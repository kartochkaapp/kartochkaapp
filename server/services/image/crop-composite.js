"use strict";

const path = require("node:path");

const sharp = require("sharp");

const { ensureDir, normalizeFormat, withExtension } = require("./image-utils");
const { exportImage } = require("./export-image");

const CARD_TYPES = ["benefits", "features", "lifestyle", "details"];

const buildCrops = (width, height) => {
  const cardWidth = Math.floor(width / 2);
  const cardHeight = Math.floor(height / 2);
  return [
    { left: 0, top: 0, width: cardWidth, height: cardHeight },
    { left: cardWidth, top: 0, width: width - cardWidth, height: cardHeight },
    { left: 0, top: cardHeight, width: cardWidth, height: height - cardHeight },
    { left: cardWidth, top: cardHeight, width: width - cardWidth, height: height - cardHeight },
  ];
};

const cropComposite = async (inputPath, outputDir, options = {}) => {
  ensureDir(outputDir);
  const metadata = await sharp(inputPath).metadata();
  const width = Number(metadata.width) || 0;
  const height = Number(metadata.height) || 0;
  if (width < 2 || height < 2) {
    throw new Error("Composite image is too small to crop");
  }

  const format = normalizeFormat(options.format || "png");
  const crops = buildCrops(width, height);
  const cards = [];

  for (let index = 0; index < crops.length; index += 1) {
    const crop = crops[index];
    const type = CARD_TYPES[index] || "card";
    const tempPath = path.join(outputDir, "crop_" + String(index + 1) + "_" + type + ".png");
    const outputPath = path.join(outputDir, withExtension("card_" + String(index + 1) + "_" + type, format));
    await sharp(inputPath).extract(crop).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(tempPath);
    const exported = await exportImage(tempPath, outputPath, {
      format,
      mode: options.mode || "standard",
      postProcess: options.postProcessCards !== false,
      quality: options.quality,
    });
    cards.push({
      index: index + 1,
      type,
      path: exported.path,
      width: exported.width,
      height: exported.height,
      crop,
    });
  }

  return {
    width,
    height,
    cardWidth: Math.floor(width / 2),
    cardHeight: Math.floor(height / 2),
    cards,
  };
};

module.exports = {
  CARD_TYPES,
  buildCrops,
  cropComposite,
};
