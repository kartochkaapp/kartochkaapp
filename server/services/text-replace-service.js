"use strict";

const sharp = require("sharp");

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

const expandBbox = (bbox, padding, imageWidth, imageHeight) => {
  const padX = Math.round(bbox.w * padding);
  const padY = Math.round(bbox.h * padding);
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

// ── Gemini standard output sizes ────────────────────────────────────────────
// Gemini image models output at fixed resolutions tied to their aspect_ratio
// parameter.  We pick the closest native ratio to the card's actual proportions
// so the scale factors (srcW→gemW, srcH→gemH) are as equal as possible.
// Equal scale factors = no per-axis distortion when we resize the cropped
// response back to the original bbox dimensions.
// Using 512-based sizes to keep token usage low for image editing requests.
const GEMINI_SIZES = [
  { label: "1:1",  val: 1,        w: 512,  h: 512  },
  { label: "4:3",  val: 4 / 3,   w: 512,  h: 384  },
  { label: "3:4",  val: 3 / 4,   w: 384,  h: 512  },
  { label: "16:9", val: 16 / 9,  w: 512,  h: 288  },
  { label: "9:16", val: 9 / 16,  w: 288,  h: 512  },
];

const pickGeminiTarget = (imgW, imgH) => {
  const r = imgW / imgH;
  return GEMINI_SIZES.reduce((best, cur) =>
    Math.abs(cur.val - r) < Math.abs(best.val - r) ? cur : best
  );
};

// Scale a bbox from one image size to another.
const scaleBbox = (bbox, fromW, fromH, toW, toH) => {
  const sx = toW / fromW;
  const sy = toH / fromH;
  const x = Math.floor(bbox.x * sx);
  const y = Math.floor(bbox.y * sy);
  const w = Math.min(Math.ceil(bbox.w * sx), toW - x);
  const h = Math.min(Math.ceil(bbox.h * sy), toH - y);
  return { x, y, w: Math.max(1, w), h: Math.max(1, h) };
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

    const originalBuffer = await sharp(decoded.buffer).png().toBuffer();
    const imageMeta = await sharp(originalBuffer).metadata();
    const imageWidth = Number(imageMeta.width || 0);
    const imageHeight = Number(imageMeta.height || 0);

    // ── Phase 1: locate all text fragments in the original image ──────────────
    const located = [];
    for (const replacement of replacements) {
      let result;
      try {
        result = await locator.findTextBbox({
          imageBuffer: originalBuffer,
          searchText: replacement.from,
        });
        console.log('[text-replace] located "' + replacement.from + '":', JSON.stringify(result.bbox));
      } catch (error) {
        console.error('[text-replace] locator ERROR for "' + replacement.from + '":', error?.message);
        throw new TextReplaceServiceError({
          status: 422,
          code: "text_replace_not_found",
          message: 'Не удалось найти текст "' + replacement.from + '" на карточке.',
          details: { replacement },
          cause: error,
        });
      }
      located.push({
        replacement,
        bbox: expandBbox(result.bbox, padding, imageWidth, imageHeight),
        rawBbox: result.bbox,
        locatorRequestText: result.requestText,
        locatorResponseText: result.responseText,
      });
    }

    // ── Phase 2: scale card to nearest Gemini-native size and edit (1 AI call) ─
    // We send the full card once with ALL replacements described in the prompt.
    // Gemini returns the full card at the same native ratio (e.g. 3:4 → 768×1024).
    // ──────────────────────────────────────────────────────────────────────────
    const gemTarget = pickGeminiTarget(imageWidth, imageHeight);

    const scaledBuffer = await sharp(originalBuffer)
      .resize(gemTarget.w, gemTarget.h, { fit: "fill" })
      .png()
      .toBuffer();

    // Map all bboxes into Gemini coordinate space for the prompt
    const gemReplacements = located.map((item) => ({
      from: item.replacement.from,
      to: item.replacement.to,
      bbox: scaleBbox(item.bbox, imageWidth, imageHeight, gemTarget.w, gemTarget.h),
    }));

    console.log(
      "[text-replace] original:", imageWidth + "×" + imageHeight,
      "| gemini target:", gemTarget.w + "×" + gemTarget.h, "(" + gemTarget.label + ")",
      "| replacements:", replacements.length
    );

    let edited;
    try {
      edited = await editor.editImageWithRetry({
        imageBuffer: scaledBuffer,
        replacements: gemReplacements,
        aspectRatio: gemTarget.label,
      });
    } catch (err) {
      console.error("[text-replace] editor ERROR:", err?.message, err?.code, JSON.stringify(err?.details)?.slice(0, 400));
      throw err;
    }

    const editedMeta = await sharp(edited.buffer).metadata();
    const editedW = Number(editedMeta.width || 0) || gemTarget.w;
    const editedH = Number(editedMeta.height || 0) || gemTarget.h;

    console.log("[text-replace] received:", editedW + "×" + editedH);

    // ── Phase 3: scale Gemini response back to original image dimensions ───────
    // Scale the FULL edited image to original dimensions first.
    // Because the card ratio is preserved (3:4 → 3:4), scaleX ≈ scaleY and
    // fit:"fill" introduces negligible distortion.
    // After scaling, bbox coordinates are valid again — we simply extract each
    // region. No per-crop resize math needed.
    // ──────────────────────────────────────────────────────────────────────────
    const editedAtOriginalSize = await sharp(edited.buffer)
      .resize(imageWidth, imageHeight, { fit: "fill" })
      .png()
      .toBuffer();

    // ── Phase 4: composite each changed bbox from the rescaled edited image ───
    let currentBuffer = originalBuffer;
    const debugSteps = [];

    for (const item of located) {
      const { bbox } = item;

      // Crop directly from the rescaled image — no further coordinate math,
      // no per-crop resize. The crop is exactly bbox.w × bbox.h pixels.
      const editedCropBuffer = await sharp(editedAtOriginalSize)
        .extract({
          left: Math.max(0, bbox.x),
          top: Math.max(0, bbox.y),
          width: Math.max(1, bbox.w),
          height: Math.max(1, bbox.h),
        })
        .png()
        .toBuffer();

      currentBuffer = await compositeEdit({
        originalBuffer: currentBuffer,
        editedCropBuffer,
        bbox,
        featherPx,
      });

      debugSteps.push({
        replacement: item.replacement,
        bbox: item.rawBbox,
        crop: bbox,
        locatorRequestText: item.locatorRequestText,
        locatorResponseText: item.locatorResponseText,
        editorRequestText: edited.requestText,
        editorResponseText: edited.responseText,
      });
    }

    const previewUrl = "data:image/png;base64," + currentBuffer.toString("base64");
    const summary = replacements
      .map((item) => '"' + item.from + '" -> "' + item.to + '"')
      .join(", ");

    return [{
      id: "text-replace-" + String(Date.now()),
      variantNumber: 1,
      totalVariants: 1,
      previewUrl,
      title: "Сохранение карточки",
      marketplace: toText(payload?.marketplace) || "Маркетплейс",
      style: "Точечная замена текста",
      focus: "Изменены только указанные текстовые фрагменты",
      format: "Locate → crop → edit → composite",
      changes: summary,
      promptPreview: buildPipelineRequestText(replacements).slice(0, 240),
      downloadName: "kartochka-text-replace-1.png",
      __debug: payload?.debugMode ? {
        flow: "create_text_replace",
        imageModel: toText(config?.editorModel) || "google/gemini-2.5-flash-image-preview",
        locatorModel: toText(config?.locatorModel) || "google/gemini-2.5-flash",
        imageCount: 1,
        requestText: [
          "TEXT REPLACE PIPELINE",
          buildPipelineRequestText(replacements),
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
            bbox: step.bbox,
            crop: step.crop,
          })),
          output: {
            width: imageWidth,
            height: imageHeight,
          },
        }),
      } : undefined,
    }];
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
