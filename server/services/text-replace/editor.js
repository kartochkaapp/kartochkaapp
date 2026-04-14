"use strict";

const { toText } = require("../../utils");

let sharpModule = null;
const getSharp = () => {
  if (!sharpModule) {
    sharpModule = require("sharp");
  }
  return sharpModule;
};

/**
 * Build a prompt for replacing one or more text fragments in an image.
 * @param {Array<{from: string, to: string, bbox: {x,y,w,h}}>} replacements
 * @param {number} imageWidth
 * @param {number} imageHeight
 */
const buildEditorPrompt = (replacements, imageWidth, imageHeight) => {
  const sizeNote = imageWidth > 0 && imageHeight > 0
    ? "The image is " + String(imageWidth) + " × " + String(imageHeight) + " px."
    : "";

  const replaceLines = replacements.map((r, i) => {
    const loc = r.bbox
      ? " (at x=" + r.bbox.x + ", y=" + r.bbox.y + ", w=" + r.bbox.w + ", h=" + r.bbox.h + ")"
      : "";
    return String(i + 1) + '. Replace "' + String(r.from) + '" → "' + String(r.to) + '"' + loc;
  }).join("\n");

  return [
    "Edit this image by replacing the following text fragments:",
    "",
    replaceLines,
    "",
    "STRICT REQUIREMENTS:",
    "- Match the original font family, weight, slant, color, size, baseline and letter-spacing exactly.",
    "- Keep every replaced text at its exact original position. Do not move or reflow anything.",
    "- Do NOT change any other part of the image — background, shadows, objects, other text must be pixel-identical.",
    "- Return the complete image at the exact same dimensions as the input. " + sizeNote,
    "- No cleanup, no enhancement, no redesign. Only the requested text changes.",
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
        image_config: aspectRatio ? { aspect_ratio: aspectRatio } : undefined,
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
