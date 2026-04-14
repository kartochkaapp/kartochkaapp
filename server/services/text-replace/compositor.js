"use strict";

const sharp = require("sharp");

const createFeatherMask = async (width, height, featherPx) => {
  const inset = Math.max(0, featherPx);
  const svg = [
    '<svg width="' + String(width) + '" height="' + String(height) + '" xmlns="http://www.w3.org/2000/svg">',
    '<rect x="' + String(inset) + '" y="' + String(inset) + '" width="' + String(Math.max(1, width - inset * 2)) + '" height="' + String(Math.max(1, height - inset * 2)) + '" fill="white" />',
    "</svg>",
  ].join("");

  return sharp(Buffer.from(svg))
    .blur(featherPx > 0 ? featherPx : 0.3)
    .toColorspace("b-w")
    .png()
    .toBuffer();
};

const compositeEdit = async ({ originalBuffer, editedCropBuffer, bbox, featherPx = 3 }) => {
  // editedCropBuffer is produced by the service by cropping the bbox region out of
  // the full edited image that was already scaled to original image dimensions.
  // Therefore editedCropBuffer should already be bbox.w × bbox.h.
  // The resize here is a safety net for any sub-pixel rounding difference.
  const resized = await sharp(editedCropBuffer)
    .resize(bbox.w, bbox.h, { fit: "fill" })
    .png()
    .toBuffer();

  const mask = await createFeatherMask(bbox.w, bbox.h, featherPx);
  const maskedCrop = await sharp(resized)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(originalBuffer)
    .composite([{
      input: maskedCrop,
      left: bbox.x,
      top: bbox.y,
    }])
    .png()
    .toBuffer();
};

module.exports = {
  compositeEdit,
};
