"use strict";

const { toText } = require("../utils");
const { createTextReplaceOpenRouterClient } = require("./text-replace/openrouter-client");
const { createTextReplaceLocator } = require("./text-replace/locator");
const { createTextReplaceEditor } = require("./text-replace/editor");
const { compositeEdit } = require("./text-replace/compositor");

class TextReplaceServiceError extends Error {
  constructor(params) {
    super(String(params?.message || "Text replace service error"));
    this.name = "TextReplaceServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "text_replace_service_error";
    this.details = params?.details || null;
    this.cause = params?.cause;
  }
}

const isTextReplaceTemplate = (payload) => {
  return toText(payload?.selectedTemplate?.kind || payload?.reference?.kind) === "text-replace";
};

const dataUrlToBuffer = (value) => {
  const raw = toText(value);
  const match = raw.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
};

const normalizeReplacements = (payload) => {
  const items = Array.isArray(payload?.textReplacements) ? payload.textReplacements : [];
  return items
    .map((item) => ({
      from: toText(item?.from),
      to: toText(item?.to),
    }))
    .filter((item) => item.from && item.to);
};

// Tight expansion around locator bbox: max(20px, 10%) on each side.
// Just enough to cover anti-aliasing halo and minor glyph overreach —
// much smaller than the old 50%+100px approach.
const expandBbox = (bbox, _padding, imageWidth, imageHeight) => {
  const padX = Math.max(20, Math.round(bbox.w * 0.20));
  const padY = Math.max(20, Math.round(bbox.h * 0.20));
  const x = Math.max(0, bbox.x - padX);
  const y = Math.max(0, bbox.y - padY);
  const w = Math.min(imageWidth - x, bbox.w + padX * 2);
  const h = Math.min(imageHeight - y, bbox.h + padY * 2);
  return {
    x,
    y,
    w: Math.max(1, w),
    h: Math.max(1, h),
  };
};

const buildPipelineRequestText = (replacements) => {
  return replacements
    .map((item, index) => String(index + 1) + '. replace "' + item.from + '" -> "' + item.to + '"')
    .join("\n");
};

let sharpModule = null;
const getSharp = () => {
  if (!sharpModule) {
    sharpModule = require("sharp");
  }
  return sharpModule;
};

// Derive aspect ratio label from actual image dimensions — no hardcoded sizes.
const getAspectLabel = (w, h) => {
  const r = w / h;
  const known = [
    { label: "1:1",  val: 1       },
    { label: "4:3",  val: 4 / 3   },
    { label: "3:4",  val: 3 / 4   },
    { label: "16:9", val: 16 / 9  },
    { label: "9:16", val: 9 / 16  },
  ];
  return known.reduce((best, cur) =>
    Math.abs(cur.val - r) < Math.abs(best.val - r) ? cur : best
  ).label;
};

// Scale a bbox when Gemini returns a different size than the input.
// If sizes are identical this is a no-op (sx = sy = 1).
const scaleBbox = (bbox, fromW, fromH, toW, toH) => {
  const sx = toW / fromW;
  const sy = toH / fromH;
  const x = Math.floor(bbox.x * sx);
  const y = Math.floor(bbox.y * sy);
  const w = Math.min(Math.ceil(bbox.w * sx), toW - x);
  const h = Math.min(Math.ceil(bbox.h * sy), toH - y);
  return { x, y, w: Math.max(1, w), h: Math.max(1, h) };
};

// Compute a "context crop" around a bbox: big enough for Gemini to see the
// text as a prominent feature (not a tiny speck), but still a cropped region
// so small text becomes relatively large in the editor's view.
const computeContextCrop = (bbox, imageWidth, imageHeight) => {
  const minSize = 768;
  const factor = 4;

  const targetW = Math.max(minSize, bbox.w * factor);
  const targetH = Math.max(minSize, bbox.h * factor);

  const centerX = bbox.x + bbox.w / 2;
  const centerY = bbox.y + bbox.h / 2;

  let width = Math.min(imageWidth, Math.round(targetW));
  let height = Math.min(imageHeight, Math.round(targetH));
  let left = Math.round(centerX - width / 2);
  let top = Math.round(centerY - height / 2);

  if (left < 0) left = 0;
  if (top < 0) top = 0;
  if (left + width > imageWidth) left = imageWidth - width;
  if (top + height > imageHeight) top = imageHeight - height;

  return { left, top, width, height };
};

const createTextReplaceService = (config) => {
  const padding = Number.isFinite(Number(config?.padding)) ? Number(config.padding) : 0.15;
  const featherPx = Number.isFinite(Number(config?.featherPx)) ? Number(config.featherPx) : 3;

  const client = createTextReplaceOpenRouterClient(config);
  const locator = createTextReplaceLocator({
    client,
    model: config?.locatorModel,
  });
  const editor = createTextReplaceEditor({
    client,
    model: config?.editorModel,
    defaultImageModel: config?.defaultImageModel,
    maxAttempts: 2,
  });

  const createGenerate = async (payload) => {
    if (!isTextReplaceTemplate(payload)) {
      throw new TextReplaceServiceError({
        status: 500,
        code: "text_replace_wrong_mode",
        message: "Text replace service called for non text-replace payload",
      });
    }

    const replacements = normalizeReplacements(payload);
    if (!replacements.length) {
      throw new TextReplaceServiceError({
        status: 400,
        code: "text_replace_missing_rules",
        message: "Добавьте хотя бы одну пару замены текста.",
      });
    }

    const sourceImages = [
      ...(Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls : []),
      ...(Array.isArray(payload?.imagePreviewUrls) ? payload.imagePreviewUrls : []),
    ].map((item) => toText(item)).filter(Boolean);

    const source = sourceImages[0];
    const decoded = dataUrlToBuffer(source);
    if (!decoded?.buffer) {
      throw new TextReplaceServiceError({
        status: 400,
        code: "text_replace_missing_image",
        message: "Для режима замены текста нужно добавить изображение карточки.",
      });
    }

    const sharp = getSharp();
    const originalBuffer = await sharp(decoded.buffer).png().toBuffer();
    const imageMeta = await sharp(originalBuffer).metadata();
    const imageWidth = Number(imageMeta.width || 0);
    const imageHeight = Number(imageMeta.height || 0);

    // ── Phase 1: send full image to Gemini editor ─────────────────────────────
    const aspectLabel = getAspectLabel(imageWidth, imageHeight);
    console.log(
      "[text-replace] editing full image",
      imageWidth + "×" + imageHeight,
      "| aspect:", aspectLabel,
      "| replacements:", replacements.length,
    );

    let edited;
    try {
      edited = await editor.editImageWithRetry({
        imageBuffer: originalBuffer,
        replacements,
        aspectRatio: aspectLabel,
      });
    } catch (err) {
      console.error("[text-replace] editor ERROR:", err?.message, err?.code, JSON.stringify(err?.details)?.slice(0, 400));
      const errStatus = Number(err?.status);
      const errDetails = JSON.stringify(err?.details || "").toLowerCase();
      const errMessage = String(err?.message || "").toLowerCase();
      const isCreditsExhausted = errStatus === 402
        || errDetails.includes("credits")
        || errDetails.includes("credit limit")
        || errDetails.includes("afford")
        || errMessage.includes("credits");
      if (isCreditsExhausted) {
        throw new TextReplaceServiceError({
          status: 402,
          code: "text_replace_credits_exhausted",
          message: "Кончились кредиты AI-сервиса. Обратитесь к @ones_thunder",
          cause: err,
        });
      }
      throw err;
    }

    const editedMeta = await sharp(edited.buffer).metadata();
    const editedW = Number(editedMeta.width || imageWidth);
    const editedH = Number(editedMeta.height || imageHeight);
    console.log("[text-replace] Gemini output:", editedW + "×" + editedH,
      editedW === imageWidth && editedH === imageHeight ? "(same size ✓)" : "(size changed)");

    // ── Phase 2: locate NEW text in the edited image ───────────────────────────
    const located = [];
    for (const replacement of replacements) {
      let result;
      try {
        result = await locator.findTextBbox({
          imageBuffer: edited.buffer,
          searchText: replacement.to,
        });
        console.log('[text-replace] post-edit located "' + replacement.to + '":', JSON.stringify(result.bbox));
      } catch (error) {
        console.error('[text-replace] post-edit locator ERROR for "' + replacement.to + '":', error?.message);
        throw new TextReplaceServiceError({
          status: 422,
          code: "text_replace_not_found",
          message: 'Gemini заменил текст, но не удалось найти "' + replacement.to + '" в результате.',
          details: { replacement },
          cause: error,
        });
      }

      const bbox = expandBbox(result.bbox, padding, editedW, editedH);

      // Debug: save crop from edited image at located bbox
      const debugCropPath = "/tmp/text-replace-locator-crop-" + Date.now() + ".png";
      await sharp(edited.buffer)
        .extract({ left: result.bbox.x, top: result.bbox.y, width: result.bbox.w, height: result.bbox.h })
        .png().toBuffer()
        .then((buf) => require("fs").writeFileSync(debugCropPath, buf));
      console.log('[text-replace] post-edit crop saved to:', debugCropPath, '(should contain "' + replacement.to + '")');

      located.push({
        replacement,
        bbox,
        rawBbox: result.bbox,
        locatorRequestText: result.requestText,
        locatorResponseText: result.responseText,
      });
    }

    // ── Phase 3: extract from edited, paste onto original ─────────────────────
    let currentBuffer = originalBuffer;
    const debugSteps = [];

    for (const item of located) {
      const { bbox, rawBbox } = item;

      console.log(
        '[text-replace] compositing "' + item.replacement.from + '" → "' + item.replacement.to + '"',
        "| new text at:", JSON.stringify(rawBbox),
        "| paste region:", JSON.stringify(bbox),
      );

      const editedRegion = await sharp(edited.buffer)
        .extract({ left: bbox.x, top: bbox.y, width: bbox.w, height: bbox.h })
        .png()
        .toBuffer();

      currentBuffer = await compositeEdit({
        originalBuffer: currentBuffer,
        editedCropBuffer: editedRegion,
        bbox,
        featherPx,
      });

      debugSteps.push({
        replacement: item.replacement,
        newBbox: rawBbox,
        pasteRegion: bbox,
        locatorRequestText: item.locatorRequestText,
        locatorResponseText: item.locatorResponseText,
        editorRequestText: edited.requestText,
        editorResponseText: edited.responseText,
      });
    }

    const ts = Date.now();
    require("fs").writeFileSync("/tmp/text-replace-gemini-output-" + ts + ".png", edited.buffer);
    require("fs").writeFileSync("/tmp/text-replace-final-" + ts + ".png", currentBuffer);
    console.log("[text-replace] debug saved: gemini-output and final (" + ts + ")");

    const geminiPreviewUrl = "data:image/png;base64," + edited.buffer.toString("base64");
    const finalPreviewUrl = "data:image/png;base64," + currentBuffer.toString("base64");
    const summary = replacements
      .map((item) => '"' + item.from + '" -> "' + item.to + '"')
      .join(", ");
    const requestText = buildPipelineRequestText(replacements);
    const debugPayload = payload?.debugMode ? {
      flow: "create_text_replace",
      imageModel: toText(config?.editorModel) || "google/gemini-2.5-flash-image-preview",
      locatorModel: toText(config?.locatorModel) || "google/gemini-2.5-flash",
      imageCount: 1,
      requestText: [
        "TEXT REPLACE PIPELINE",
        requestText,
        "",
        debugSteps.map((step, index) => {
          return [
            "STEP " + String(index + 1),
            "LOCATOR REQUEST:",
            step.locatorRequestText,
            "",
            "LOCATOR RESPONSE:",
            step.locatorResponseText,
            "",
            "EDITOR REQUEST:",
            step.editorRequestText,
            "",
            "EDITOR RESPONSE:",
            step.editorResponseText,
          ].join("\n");
        }).join("\n\n"),
      ].join("\n"),
      responseText: JSON.stringify({
        replacements,
        steps: debugSteps.map((step) => ({
          replacement: step.replacement,
          newBbox: step.newBbox,
          pasteRegion: step.pasteRegion,
        })),
        output: {
          width: imageWidth,
          height: imageHeight,
        },
      }),
    } : undefined;

    return [
      {
        id: "text-replace-gemini-" + String(ts),
        variantNumber: 1,
        totalVariants: 2,
        previewUrl: geminiPreviewUrl,
        title: "Gemini-версия",
        resultRole: "gemini",
        isIntermediate: true,
        marketplace: toText(payload?.marketplace) || "Маркетплейс",
        style: "Полный результат Gemini",
        focus: "Изображение после AI-редактора до локального композита",
        format: "Gemini image editor output",
        changes: summary,
        promptPreview: requestText.slice(0, 240),
        downloadName: "kartochka-text-replace-gemini.png",
        __debug: debugPayload,
      },
      {
        id: "text-replace-final-" + String(ts),
        variantNumber: 2,
        totalVariants: 2,
        previewUrl: finalPreviewUrl,
        title: "Карточка с замененным текстом",
        resultRole: "final",
        isIntermediate: false,
        marketplace: toText(payload?.marketplace) || "Маркетплейс",
        style: "Финальный композит",
        focus: "В оригинал вставлены только области с замененным текстом",
        format: "Locate → crop → composite",
        changes: summary,
        promptPreview: requestText.slice(0, 240),
        downloadName: "kartochka-text-replace-final.png",
        __debug: debugPayload,
      },
    ];
  };

  return {
    isTextReplaceTemplate,
    createGenerate,
  };
};

module.exports = {
  TextReplaceServiceError,
  createTextReplaceService,
};
