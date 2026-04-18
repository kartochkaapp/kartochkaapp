"use strict";

const { toText } = require("../../utils");

let sharpModule = null;
const getSharp = () => {
  if (!sharpModule) {
    sharpModule = require("sharp");
  }
  return sharpModule;
};

const TARGET_CARD_WIDTH = 900;
const TARGET_CARD_HEIGHT = 1200;

/**
 * Build a prompt for replacing one or more text fragments in an image.
 * @param {Array<{from: string, to: string, bbox: {x,y,w,h}}>} replacements
 * @param {number} imageWidth
 * @param {number} imageHeight
 */
const buildEditorPrompt = (replacements, imageWidth, imageHeight) => {
  const sizeNote = imageWidth > 0 && imageHeight > 0
    ? String(imageWidth) + " × " + String(imageHeight) + " px"
    : "the same dimensions as input";

  const replaceLines = replacements.map((r, i) => {
    const loc = r.bbox
      ? " (located at x=" + r.bbox.x + ", y=" + r.bbox.y + ", w=" + r.bbox.w + ", h=" + r.bbox.h + ")"
      : "";
    return [
      "REPLACEMENT " + String(i + 1) + ":",
      '  FROM (remove this text): "' + String(r.from) + '"' + loc,
      '  TO   (write this text):  "' + String(r.to) + '"',
    ].join("\n");
  }).join("\n\n");

  return [
    "You are a professional graphic designer performing a SURGICAL TEXT EDIT on a product card.",
    "Your only job is to replace the exact text fragments listed below. Nothing else.",
    "",
    "Think of yourself editing a layered design file (Photoshop/Figma): you find the text layer,",
    "change its content, and leave every other layer untouched. The output must look like the",
    "original image with only the text strings changed — same font, same size, same color,",
    "same position, same layout, same composition.",
    "",
    "═══════════════════════════════════════════════════════",
    "TEXT REPLACEMENTS:",
    "═══════════════════════════════════════════════════════",
    "",
    replaceLines,
    "",
    "═══════════════════════════════════════════════════════",
    "ABSOLUTE RULES — violating ANY of these is a failure:",
    "═══════════════════════════════════════════════════════",
    "",
    "TEXT REPLACEMENT:",
    "• The FROM text must be COMPLETELY ERASED. Not a single pixel of the old characters may remain.",
    "• The TO text must be written in place of the FROM text — in the EXACT same location.",
    "• Replace the ENTIRE FROM string as specified. Do not keep any part of the FROM text",
    "  (for example: FROM \"Срок ношения 1 день\" → TO \"30 дней\" means the words \"Срок ношения\"",
    "  must also be erased, NOT kept). If the user wanted to keep part of it, they would include",
    "  that part in the TO string.",
    "",
    "TYPOGRAPHY — match the ORIGINAL text exactly:",
    "• Same font family (including language variants — Cyrillic/Latin/CJK).",
    "• Same font weight (bold stays bold, light stays light).",
    "• Same italic/slant.",
    "• Same color (exact hex value from the original).",
    "• Same font size in pixels.",
    "• Same letter-spacing and line-height.",
    "• Same baseline and vertical alignment.",
    "• Same horizontal alignment (if original was centered, keep centered; if left-aligned, keep left-aligned).",
    "",
    "COMPOSITION — NO redesigning:",
    "• DO NOT zoom in or out. DO NOT crop or reframe the image.",
    "• DO NOT change the camera angle, perspective, or viewpoint.",
    "• DO NOT resize, rotate, or reposition any product, object, background, or other text.",
    "• DO NOT regenerate the background. Leave lighting, shadows, reflections, gradients exactly as they were.",
    "• DO NOT add new elements, decorations, or effects.",
    "• DO NOT remove any existing elements outside the FROM text.",
    "• All OTHER text in the image must remain PIXEL-IDENTICAL to the original.",
    "",
    "OUTPUT:",
    "• Return the complete image at exactly " + sizeNote + " — same aspect ratio, same resolution.",
    "• The result must be visually indistinguishable from the original EXCEPT for the replaced text.",
    "• If you cannot replace the text without altering the rest of the image, prefer leaving the",
    "  rest untouched. A pixel-perfect background with imperfect text is better than a redesigned",
    "  image with perfect text.",
    "",
    "You are NOT creating a new design. You are performing a precise text edit on an existing design.",
  ].join("\n");
};

const createTextReplaceEditor = (deps) => {
  const client = deps?.client;
  const model = toText(deps?.model || deps?.defaultImageModel) || "google/gemini-3-pro-image-preview";
  const maxAttempts = Number.isFinite(Number(deps?.maxAttempts)) ? Math.max(1, Number(deps.maxAttempts)) : 2;

  if (!client || typeof client.callOpenRouter !== "function") {
    throw new Error("Text replace editor client is not configured");
  }

  /**
   * Send the full (Gemini-scaled) card image with all replacements in one call.
   *
   * @param {{
   *   imageBuffer: Buffer,
   *   replacements: Array<{from: string, to: string, bbox?: {x,y,w,h}}>,
   *   aspectRatio: string   // e.g. "3:4" — must match imageBuffer dimensions
   * }}
   */
  const editImage = async ({ imageBuffer, replacements, aspectRatio }) => {
    const sharp = getSharp();
    if (!Buffer.isBuffer(imageBuffer)) throw new Error("editImage requires imageBuffer");
    if (!Array.isArray(replacements) || !replacements.length) throw new Error("editImage requires replacements");

    const pngBuffer = await sharp(imageBuffer).png().toBuffer();
    const meta = await sharp(pngBuffer).metadata();
    const width = Number(meta.width || 0);
    const height = Number(meta.height || 0);

    const prompt = buildEditorPrompt(replacements, width, height);
    const base64 = pngBuffer.toString("base64");

    const data = await client.callOpenRouter({
      model,
      modalities: ["image", "text"],
      extraBody: {
        image_config: {
          aspect_ratio: aspectRatio || "3:4",
          width: TARGET_CARD_WIDTH,
          height: TARGET_CARD_HEIGHT,
        },
      },
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: "data:image/png;base64," + base64 } },
        ],
      }],
    });

    const editedBase64 = client.extractImageBase64(data);
    return {
      buffer: Buffer.from(editedBase64, "base64"),
      requestText: prompt,
      responseText: client.extractText(data),
    };
  };

  const editImageWithRetry = async (params) => {
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await editImage(params);
      } catch (error) {
        lastError = error;
        if (attempt >= maxAttempts) break;
      }
    }
    throw lastError || new Error("Text replace edit failed");
  };

  // Legacy single-item wrapper (used by older callers if any)
  const editCropWithRetry = async ({ imageBuffer, bbox, aspectRatio, from, to }) => {
    return editImageWithRetry({
      imageBuffer,
      replacements: [{ from, to, bbox }],
      aspectRatio,
    });
  };

  return {
    editImageWithRetry,
    editCropWithRetry,
  };
};

module.exports = {
  createTextReplaceEditor,
};
