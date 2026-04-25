"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const sharp = require("sharp");

const { toText } = require("../../utils");
const { analyzeImage, analyzeImageInput } = require("./analyze-image");
const { cropComposite } = require("./crop-composite");
const { createImageCache } = require("./image-cache");
const {
  ensureDir,
  getDefaultWorkRoot,
  normalizeFormat,
  normalizeMode,
  normalizeProvider,
  normalizeTarget,
  safeFileName,
  withExtension,
} = require("./image-utils");
const { exportImage } = require("./export-image");
const { canUseRealEsrgan, upscaleWithRealEsrgan } = require("./upscale-with-realesrgan");
const { upscaleWithSharp } = require("./upscale-with-sharp");

const PIPELINE_VERSION = "image-enhancement-v2-aspect-safe";

class ImageEnhancementError extends Error {
  constructor(message, details) {
    super(String(message || "Image enhancement failed"));
    this.name = "ImageEnhancementError";
    this.details = details || null;
  }
}

const now = () => Date.now();

const getDefaultOptions = () => ({
  provider: process.env.IMAGE_ENHANCEMENT_PROVIDER || "auto",
  mode: process.env.IMAGE_ENHANCEMENT_MODE || "auto",
  targetWidth: process.env.IMAGE_TARGET_WIDTH || 1200,
  targetHeight: process.env.IMAGE_TARGET_HEIGHT || 1600,
  cacheEnabled: String(process.env.ENABLE_IMAGE_CACHE || "true").toLowerCase() !== "false",
  realesrganBinaryPath: process.env.REALESRGAN_BINARY_PATH || "",
  realesrganModel: process.env.REALESRGAN_MODEL || "",
  exportFormat: process.env.EXPORT_FORMAT || "png",
  scale: 2,
});

const resolveOptions = (options = {}) => {
  const defaults = getDefaultOptions();
  const target = normalizeTarget({
    targetWidth: options.targetWidth || defaults.targetWidth,
    targetHeight: options.targetHeight || defaults.targetHeight,
  });
  const workRoot = ensureDir(toText(options.workRoot) || getDefaultWorkRoot());
  const cacheRoot = ensureDir(toText(options.cacheRoot) || path.join(workRoot, "entries"));

  return {
    provider: normalizeProvider(options.provider || defaults.provider),
    mode: normalizeMode(options.mode || defaults.mode),
    targetWidth: target.width,
    targetHeight: target.height,
    cacheEnabled: options.cacheEnabled == null ? Boolean(defaults.cacheEnabled) : Boolean(options.cacheEnabled),
    realesrganBinaryPath: toText(options.realesrganBinaryPath || defaults.realesrganBinaryPath),
    realesrganModel: toText(options.realesrganModel || defaults.realesrganModel),
    exportFormat: normalizeFormat(options.exportFormat || options.format || defaults.exportFormat),
    quality: Number(options.quality) || 94,
    scale: Math.max(1, Math.floor(Number(options.scale || defaults.scale || 2))),
    workRoot,
    cacheRoot,
    outputDir: toText(options.outputDir),
    requestId: toText(options.requestId),
  };
};

const writeTempInput = (buffer, options = {}) => {
  const dir = ensureDir(path.join(options.workRoot || os.tmpdir(), "tmp"));
  const filePath = path.join(dir, safeFileName((options.requestId || "input") + "-" + String(Date.now()) + ".png", "input.png"));
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

const buildResult = (params) => ({
  success: true,
  provider: params.provider,
  mode: params.mode,
  original: params.original,
  output: params.output,
  cards: params.cards,
  timings: params.timings,
  cacheHit: Boolean(params.cacheHit),
  warnings: params.warnings || [],
});

const chooseProvider = (options, warnings) => {
  if (options.provider === "sharp") return "sharp";
  const available = canUseRealEsrgan({ binaryPath: options.realesrganBinaryPath });
  if (options.provider === "realesrgan") {
    if (!available) {
      throw new ImageEnhancementError("Real-ESRGAN provider was requested but binary is not available", {
        binaryPath: options.realesrganBinaryPath,
      });
    }
    return "realesrgan";
  }
  if (available) return "realesrgan";
  warnings.push("Real-ESRGAN is not available; used Sharp fallback.");
  return "sharp";
};

const enhanceInputToFile = async (inputPath, outputPath, analysis, options, timings, warnings) => {
  const upscaleStart = now();
  const mode = normalizeMode(options.mode) === "auto" ? analysis.recommendedMode : normalizeMode(options.mode);
  let provider = "sharp";
  let intermediatePath = path.join(path.dirname(outputPath), "upscaled.png");

  try {
    provider = chooseProvider(options, warnings);
  } catch (error) {
    if (options.provider === "realesrgan") throw error;
    warnings.push(toText(error.message) || "Real-ESRGAN provider failed before start.");
    provider = "sharp";
  }

  if (provider === "realesrgan") {
    try {
      await upscaleWithRealEsrgan(inputPath, intermediatePath, {
        binaryPath: options.realesrganBinaryPath,
        model: options.realesrganModel,
        scale: options.scale,
        timeoutMs: 240000,
        format: "png",
      });
      const upscaledMeta = await sharp(intermediatePath).metadata();
      if (Number(upscaledMeta.width) !== options.targetWidth || Number(upscaledMeta.height) !== options.targetHeight) {
        const resizedPath = path.join(path.dirname(outputPath), "upscaled-resized.png");
        await upscaleWithSharp(intermediatePath, resizedPath, {
          targetWidth: options.targetWidth,
          targetHeight: options.targetHeight,
          fit: "contain-background",
        });
        intermediatePath = resizedPath;
      }
    } catch (error) {
      if (options.provider === "realesrgan") throw error;
      warnings.push("Real-ESRGAN failed; used Sharp fallback. " + toText(error.message));
      provider = "sharp";
      await upscaleWithSharp(inputPath, intermediatePath, {
        targetWidth: options.targetWidth,
        targetHeight: options.targetHeight,
        fit: "contain-background",
      });
    }
  } else {
    await upscaleWithSharp(inputPath, intermediatePath, {
      targetWidth: options.targetWidth,
      targetHeight: options.targetHeight,
      fit: "contain-background",
    });
  }

  timings.upscaleMs = now() - upscaleStart;
  const postStart = now();
  const exported = await exportImage(intermediatePath, outputPath, {
    format: options.exportFormat,
    mode,
    quality: options.quality,
    postProcess: true,
  });
  timings.postProcessMs = now() - postStart;

  return {
    provider,
    mode,
    output: exported,
  };
};

const enhanceSingleImage = async (inputPath, rawOptions = {}) => {
  const startedAt = now();
  const options = resolveOptions(rawOptions);
  const timings = { analyzeMs: 0, upscaleMs: 0, postProcessMs: 0, cropMs: 0, totalMs: 0 };
  const warnings = [];
  const cache = createImageCache({ enabled: options.cacheEnabled, rootDir: options.cacheRoot });
  const cacheKey = cache.buildKey(inputPath, {
    provider: options.provider,
    mode: options.mode,
    targetWidth: options.targetWidth,
    targetHeight: options.targetHeight,
    format: options.exportFormat,
    crop: false,
    scale: options.scale,
    version: PIPELINE_VERSION,
  });
  const cached = cache.read(cacheKey);
  if (cached) return { ...cached, cacheHit: true };

  const analyzeStart = now();
  const analysis = await analyzeImage(inputPath, options);
  timings.analyzeMs = now() - analyzeStart;
  const entryDir = ensureDir(options.outputDir || cache.getEntryDir(cacheKey));
  const outputPath = path.join(entryDir, withExtension("enhanced", options.exportFormat));
  const enhanced = await enhanceInputToFile(inputPath, outputPath, analysis, options, timings, warnings);
  timings.totalMs = now() - startedAt;
  const result = buildResult({
    provider: enhanced.provider,
    mode: enhanced.mode,
    original: {
      width: analysis.width,
      height: analysis.height,
      sizeBytes: analysis.sizeBytes,
    },
    output: enhanced.output,
    timings,
    warnings,
  });
  return cache.write(cacheKey, result);
};

const enhanceCompositeAndCrop = async (inputPath, rawOptions = {}) => {
  const startedAt = now();
  const options = resolveOptions(rawOptions);
  const timings = { analyzeMs: 0, upscaleMs: 0, postProcessMs: 0, cropMs: 0, totalMs: 0 };
  const warnings = [];
  const cache = createImageCache({ enabled: options.cacheEnabled, rootDir: options.cacheRoot });
  const cacheKey = cache.buildKey(inputPath, {
    provider: options.provider,
    mode: options.mode,
    targetWidth: options.targetWidth,
    targetHeight: options.targetHeight,
    format: options.exportFormat,
    crop: true,
    scale: options.scale,
    version: PIPELINE_VERSION,
  });
  const cached = cache.read(cacheKey);
  if (cached) return { ...cached, cacheHit: true };

  const analyzeStart = now();
  const analysis = await analyzeImage(inputPath, options);
  timings.analyzeMs = now() - analyzeStart;
  const entryDir = ensureDir(options.outputDir || cache.getEntryDir(cacheKey));
  const outputPath = path.join(entryDir, withExtension("composite_enhanced", options.exportFormat));
  const enhanced = await enhanceInputToFile(inputPath, outputPath, analysis, options, timings, warnings);

  const cropStart = now();
  const crop = await cropComposite(enhanced.output.path, entryDir, {
    format: options.exportFormat,
    mode: enhanced.mode,
    quality: options.quality,
    postProcessCards: false,
  });
  timings.cropMs = now() - cropStart;
  timings.totalMs = now() - startedAt;

  const result = buildResult({
    provider: enhanced.provider,
    mode: enhanced.mode,
    original: {
      width: analysis.width,
      height: analysis.height,
      sizeBytes: analysis.sizeBytes,
    },
    output: enhanced.output,
    cards: crop.cards,
    timings,
    warnings,
  });
  result.composite = {
    width: crop.width,
    height: crop.height,
    cardWidth: crop.cardWidth,
    cardHeight: crop.cardHeight,
  };
  return cache.write(cacheKey, result);
};

const enhanceCompositeAndCropBuffer = async (buffer, rawOptions = {}) => {
  const options = resolveOptions(rawOptions);
  const inputPath = writeTempInput(buffer, options);
  try {
    return await enhanceCompositeAndCrop(inputPath, options);
  } finally {
    try {
      fs.unlinkSync(inputPath);
    } catch (error) {
      // Best-effort temp cleanup.
    }
  }
};

const enhanceSingleImageBuffer = async (buffer, rawOptions = {}) => {
  const options = resolveOptions(rawOptions);
  const inputPath = writeTempInput(buffer, options);
  try {
    return await enhanceSingleImage(inputPath, options);
  } finally {
    try {
      fs.unlinkSync(inputPath);
    } catch (error) {
      // Best-effort temp cleanup.
    }
  }
};

const createImageEnhancementPipeline = (options = {}) => ({
  analyzeImage,
  analyzeImageInput,
  enhanceSingleImage: (inputPath, nextOptions) => enhanceSingleImage(inputPath, { ...options, ...(nextOptions || {}) }),
  enhanceCompositeAndCrop: (inputPath, nextOptions) => enhanceCompositeAndCrop(inputPath, { ...options, ...(nextOptions || {}) }),
  enhanceSingleImageBuffer: (buffer, nextOptions) => enhanceSingleImageBuffer(buffer, { ...options, ...(nextOptions || {}) }),
  enhanceCompositeAndCropBuffer: (buffer, nextOptions) => enhanceCompositeAndCropBuffer(buffer, { ...options, ...(nextOptions || {}) }),
});

module.exports = {
  ImageEnhancementError,
  analyzeImage,
  createImageEnhancementPipeline,
  enhanceCompositeAndCrop,
  enhanceCompositeAndCropBuffer,
  enhanceSingleImage,
  enhanceSingleImageBuffer,
};
