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

const expandBbox = (bbox, padding, imageWidth, imageHeight) => {
  // Large horizontal margin: at least 100px or 50% of bbox width on each side.
  // Large glyphs and display text often have ink that extends well past
  // what the AI locator returns — the extra buffer ensures those pixels
  // are taken from the edited (clean) image rather than the original.
  const baseX = typeof padding === "object" ? Number(padding.x) : Number(padding);
  const baseY = typeof padding === "object" ? Number(padding.y) : Number(padding);
  const padX = Math.max(100, Math.round(bbox.w * Math.max(baseX, 0.5)));
  const padY = Math.max(20, Math.round(bbox.h * Math.max(baseY, 0.2)));
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

// ── Gemini standard output sizes ────────────────────────────────────────────
// Gemini image models output at fixed resolutions tied to their aspect_ratio
// parameter.  We pick the closest native ratio to the card's actual proportions
// so the scale factors (srcW→gemW, srcH→gemH) are as equal as possible.
// Equal scale factors = no per-axis distortion when we resize the cropped
// response back to the original bbox dimensions.
// Using 1024-based sizes: this matches Gemini 2.5 Image Preview's native output
// resolution and preserves detail for small text that would be lost at 512.
const GEMINI_SIZES = [
  { label: "1:1",  val: 1,       w: 1024, h: 1024 },
  { label: "4:3",  val: 4 / 3,   w: 1024, h: 768  },
  { label: "3:4",  val: 3 / 4,   w: 768,  h: 1024 },
  { label: "16:9", val: 16 / 9,  w: 1024, h: 576  },
  { label: "9:16", val: 9 / 16,  w: 576,  h: 1024 },
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

    // ── Phase 2-4: per-replacement context-crop → edit → composite ────────────
    // KNOWN WORKING version. For each located text we extract a CONTEXT CROP
    // around it (minimum 768px). The text occupies a large fraction of this
    // crop so Gemini treats it as a prominent feature to edit — critical for
    // small text that the model otherwise leaves untouched when shown the
    // full card. We composite the ENTIRE edited crop back: replacement
    // succeeds reliably. May cause slight deformation at crop edges (mitigated
    // by 8px feather).
    let currentBuffer = originalBuffer;
    const debugSteps = [];

    for (const item of located) {
      const { bbox } = item;
      const context = computeContextCrop(bbox, imageWidth, imageHeight);
      const cropAspect = pickGeminiTarget(context.width, context.height);

      const cropBuffer = await sharp(currentBuffer)
        .extract({
          left: context.left,
          top: context.top,
          width: context.width,
          height: context.height,
        })
        .png()
        .toBuffer();

      // bbox re-expressed in coordinates local to the context crop
      const localBbox = {
        x: bbox.x - context.left,
        y: bbox.y - context.top,
        w: bbox.w,
        h: bbox.h,
      };

      console.log(
        '[text-replace] editing "' + item.replacement.from + '"',
        "| context crop:", context.width + "×" + context.height,
        "at (" + context.left + "," + context.top + ")",
        "| aspect:", cropAspect.label
      );

      let edited;
      try {
        edited = await editor.editImageWithRetry({
          imageBuffer: cropBuffer,
          replacements: [{
            from: item.replacement.from,
            to: item.replacement.to,
            bbox: localBbox,
          }],
          aspectRatio: cropAspect.label,
        });
      } catch (err) {
        console.error("[text-replace] editor ERROR:", err?.message, err?.code, JSON.stringify(err?.details)?.slice(0, 400));
        throw err;
      }

      // Rescale Gemini's output back to the context crop's native dimensions.
      const editedContextBuffer = await sharp(edited.buffer)
        .resize(context.width, context.height, { fit: "fill" })
        .png()
        .toBuffer();

      // Composite the entire edited context crop back onto the current buffer.
      currentBuffer = await compositeEdit({
        originalBuffer: currentBuffer,
        editedCropBuffer: editedContextBuffer,
        bbox: {
          x: context.left,
          y: context.top,
          w: context.width,
          h: context.height,
        },
        featherPx: Math.max(featherPx, 8),
      });

      debugSteps.push({
        replacement: item.replacement,
        bbox: item.rawBbox,
        crop: bbox,
        contextCrop: context,
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
