"use strict";

const sharp = require("sharp");

const { normalizeFormat } = require("./image-utils");

const getPostProcessSettings = (mode) => {
  if (mode === "strong") {
    return {
      sharpen: { sigma: 0.8, m1: 0.85, m2: 1.35 },
      modulate: { brightness: 1.01, saturation: 1.025 },
      gamma: 1.02,
    };
  }
  if (mode === "light") {
    return {
      sharpen: { sigma: 0.45, m1: 0.45, m2: 0.9 },
      modulate: { brightness: 1, saturation: 1.005 },
      gamma: 1,
    };
  }
  return {
    sharpen: { sigma: 0.6, m1: 0.65, m2: 1.15 },
    modulate: { brightness: 1.005, saturation: 1.015 },
    gamma: 1.01,
  };
};

const applyPostProcess = (pipeline, mode) => {
  const settings = getPostProcessSettings(mode);
  let next = pipeline.sharpen(settings.sharpen);
  if (settings.gamma && settings.gamma !== 1) next = next.gamma(settings.gamma);
  if (settings.modulate) next = next.modulate(settings.modulate);
  return next;
};

const exportImage = async (input, outputPath, options = {}) => {
  const format = normalizeFormat(options.format);
  let pipeline = sharp(input).rotate();
  if (options.postProcess !== false) {
    pipeline = applyPostProcess(pipeline, options.mode || "standard");
  }

  if (format === "jpeg") {
    await pipeline.jpeg({ quality: Number(options.quality) || 94, mozjpeg: true }).toFile(outputPath);
  } else if (format === "webp") {
    await pipeline.webp({ quality: Number(options.quality) || 94, effort: 5 }).toFile(outputPath);
  } else {
    await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outputPath);
  }

  const metadata = await sharp(outputPath).metadata();
  return {
    path: outputPath,
    width: Number(metadata.width) || 0,
    height: Number(metadata.height) || 0,
    format,
  };
};

module.exports = {
  applyPostProcess,
  exportImage,
  getPostProcessSettings,
};
