"use strict";

const fs = require("node:fs");

const sharp = require("sharp");

const { normalizeMode } = require("./image-utils");

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const computeEdgeMetrics = async (input) => {
  const resized = await sharp(input)
    .rotate()
    .resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const data = resized.data;
  const width = resized.info.width;
  const height = resized.info.height;
  if (width < 3 || height < 3) {
    return { sharpness: 0, edgeDensity: 0 };
  }

  let total = 0;
  let strongEdges = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      const laplacian = Math.abs(
        -4 * data[i]
        + data[i - 1]
        + data[i + 1]
        + data[i - width]
        + data[i + width]
      );
      total += laplacian;
      if (laplacian > 28) strongEdges += 1;
      count += 1;
    }
  }

  const average = count ? total / count : 0;
  return {
    sharpness: clamp(average / 34, 0, 1),
    edgeDensity: count ? strongEdges / count : 0,
  };
};

const computeChannelStats = async (input) => {
  const stats = await sharp(input)
    .rotate()
    .resize({ width: 384, height: 384, fit: "inside", withoutEnlargement: true })
    .stats();
  const channels = Array.isArray(stats.channels) ? stats.channels : [];
  const stdevMean = channels.length
    ? channels.slice(0, 3).reduce((sum, channel) => sum + Number(channel.stdev || 0), 0) / Math.min(3, channels.length)
    : 0;
  return {
    channelStdev: stdevMean,
    isLowContrast: stdevMean > 0 && stdevMean < 38,
  };
};

const chooseMode = (analysis, requestedMode) => {
  const normalized = normalizeMode(requestedMode);
  if (normalized !== "auto") return normalized;

  if (analysis.likelyLowResolution || analysis.estimatedSharpness < 0.22) return "strong";
  if (analysis.estimatedSharpness < 0.38 || analysis.isLowContrast) return "standard";
  return "light";
};

const analyzeImageInput = async (input, options = {}) => {
  const startedAt = Date.now();
  const metadata = await sharp(input).metadata();
  const width = Number(metadata.width) || 0;
  const height = Number(metadata.height) || 0;
  if (!width || !height) {
    throw new Error("Image dimensions could not be detected");
  }

  const targetWidth = Math.max(1, Math.floor(Number(options.targetWidth || 1200)));
  const targetHeight = Math.max(1, Math.floor(Number(options.targetHeight || 1600)));
  const [edgeMetrics, channelStats] = await Promise.all([
    computeEdgeMetrics(input),
    computeChannelStats(input),
  ]);
  const aspectRatio = width / height;
  const likelyLowResolution = width < targetWidth || height < targetHeight;
  const likelyTextHeavy = edgeMetrics.edgeDensity > 0.105 && channelStats.channelStdev > 34;
  const recommendedMode = chooseMode({
    likelyLowResolution,
    estimatedSharpness: edgeMetrics.sharpness,
    isLowContrast: channelStats.isLowContrast,
  }, options.mode);

  return {
    width,
    height,
    sizeBytes: Buffer.isBuffer(input) ? input.length : fs.statSync(input).size,
    format: String(metadata.format || ""),
    aspectRatio,
    estimatedSharpness: edgeMetrics.sharpness,
    edgeDensity: edgeMetrics.edgeDensity,
    likelyLowResolution,
    likelyTextHeavy,
    isLowContrast: channelStats.isLowContrast,
    recommendedMode,
    shouldUpscale: likelyLowResolution,
    analyzeMs: Date.now() - startedAt,
  };
};

const analyzeImage = async (inputPath, options = {}) => analyzeImageInput(inputPath, options);

module.exports = {
  analyzeImage,
  analyzeImageInput,
};
