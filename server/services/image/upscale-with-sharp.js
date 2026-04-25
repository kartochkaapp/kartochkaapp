"use strict";

const sharp = require("sharp");

const shouldResize = (metadata, target) => {
  const width = Number(metadata.width) || 0;
  const height = Number(metadata.height) || 0;
  return width !== target.width || height !== target.height;
};

const toTarget = (options = {}) => ({
  width: Math.max(1, Math.floor(Number(options.targetWidth || options.width || 1200))),
  height: Math.max(1, Math.floor(Number(options.targetHeight || options.height || 1600))),
});

const resizeWithSharpToBuffer = async (input, options = {}) => {
  const target = toTarget(options);
  const fit = options.fit || "contain-background";
  const metadata = await sharp(input).metadata();

  if (!shouldResize(metadata, target)) {
    let pipeline = sharp(input).rotate();
    if (options.sharpen) {
      pipeline = pipeline.sharpen(options.sharpen);
    }
    return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  }

  if (fit === "fill") {
    let pipeline = sharp(input)
      .rotate()
      .resize(target.width, target.height, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      });
    if (options.sharpen) {
      pipeline = pipeline.sharpen(options.sharpen);
    }
    return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  }

  const backgroundBuffer = await sharp(input)
    .rotate()
    .resize(target.width, target.height, {
      fit: "cover",
      position: "center",
      kernel: sharp.kernel.lanczos3,
    })
    .blur(Number(options.backgroundBlur) || 24)
    .modulate({
      brightness: Number(options.backgroundBrightness) || 0.96,
      saturation: Number(options.backgroundSaturation) || 0.88,
    })
    .png()
    .toBuffer();

  let foreground = sharp(input)
    .rotate()
    .resize(target.width, target.height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    });
  if (options.sharpen) {
    foreground = foreground.sharpen(options.sharpen);
  }
  const foregroundBuffer = await foreground.png().toBuffer();

  return sharp(backgroundBuffer)
    .composite([{ input: foregroundBuffer, gravity: "center" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
};

const upscaleWithSharp = async (input, outputPath, options = {}) => {
  const target = toTarget(options);
  const buffer = await resizeWithSharpToBuffer(input, options);
  await sharp(buffer).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outputPath);
  return {
    provider: "sharp",
    path: outputPath,
    width: target.width,
    height: target.height,
  };
};

module.exports = {
  resizeWithSharpToBuffer,
  upscaleWithSharp,
};
