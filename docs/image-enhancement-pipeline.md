# Local Image Enhancement Pipeline

This project includes a local-only image enhancement pipeline for marketplace cards. It does not call OpenAI, Replicate, Stability, fal, or any external inference provider.

## What It Does

- Validates and reads image metadata.
- Estimates image quality with practical heuristics: size, edge strength, contrast, and text-heavy likelihood.
- Chooses `light`, `standard`, or `strong` enhancement.
- Upscales locally with Real-ESRGAN when configured.
- Falls back to Sharp `lanczos3` resize when Real-ESRGAN is unavailable or fails.
- Preserves geometry when converting to marketplace 3:4: if an upstream image has a different aspect ratio, the pipeline centers the original composition on a subtle blurred background instead of stretching the product or text.
- Applies conservative post-processing: mild sharpen, contrast/gamma, and subtle saturation normalization.
- Enhances a full 2x2 composite before cropping.
- Crops composite images into four equal cards after upscale.
- Caches repeated work by input hash and processing options.

## Files

- `server/services/image/analyze-image.js`  
  Quality analysis and mode recommendation.

- `server/services/image/upscale-with-realesrgan.js`  
  Safe Real-ESRGAN CLI integration.

- `server/services/image/upscale-with-sharp.js`  
  Local Sharp fallback upscaler with aspect-safe 3:4 normalization.

- `server/services/image/export-image.js`  
  Post-processing and PNG/JPEG/WEBP export.

- `server/services/image/crop-composite.js`  
  2x2 crop logic.

- `server/services/image/image-cache.js`  
  Hash-based result cache.

- `server/services/image/image-pipeline.js`  
  Public pipeline functions.

- `server/services/four-marketplace-cards-service.js`  
  The `1=4` flow now enhances the full composite first, then crops.

## Public API

```js
const {
  analyzeImage,
  enhanceSingleImage,
  enhanceCompositeAndCrop,
} = require("./server/services/image");
```

### Single Image

```js
await enhanceSingleImage("input.png", {
  provider: "auto",
  mode: "auto",
  targetWidth: 1200,
  targetHeight: 1600,
  exportFormat: "png",
});
```

### Composite 2x2

```js
await enhanceCompositeAndCrop("composite.png", {
  provider: "auto",
  mode: "standard",
  targetWidth: 2400,
  targetHeight: 3200,
  exportFormat: "png",
});
```

## Environment Variables

```bash
IMAGE_ENHANCEMENT_PROVIDER=auto
IMAGE_ENHANCEMENT_MODE=auto
IMAGE_TARGET_WIDTH=1200
IMAGE_TARGET_HEIGHT=1600
ENABLE_IMAGE_CACHE=true
REALESRGAN_BINARY_PATH=/absolute/path/to/realesrgan-ncnn-vulkan
REALESRGAN_MODEL=realesrgan-x4plus
EXPORT_FORMAT=png
```

Provider values:

- `auto`: use Real-ESRGAN if available, otherwise Sharp.
- `realesrgan`: require Real-ESRGAN.
- `sharp`: force Sharp-only local processing.

Mode values:

- `auto`: choose based on analysis.
- `light`: minimal enhancement.
- `standard`: balanced default.
- `strong`: for low-resolution or blurry images.

## Real-ESRGAN Setup

Recommended CLI: `realesrgan-ncnn-vulkan`.

1. Download a release for your OS from the official Real-ESRGAN ncnn Vulkan project.
2. Put the binary on the server.
3. Set `REALESRGAN_BINARY_PATH` to the absolute binary path.
4. Optionally set `REALESRGAN_MODEL`, for example `realesrgan-x4plus`.
5. Restart the app.

If the binary is missing or fails in `auto` mode, the pipeline logs a warning and uses Sharp.

## Fallback Behavior

The pipeline is designed not to crash the product flow:

- Real-ESRGAN unavailable in `auto`: Sharp fallback.
- Real-ESRGAN failure in `auto`: Sharp fallback.
- Full enhancement failure in the `1=4` flow: minimal existing Sharp crop/upscale fallback.

## Validation

Run:

```bash
npm run test:image-pipeline
npm run test:four-cards-slice
npm run test:four-cards-service
npm run check
```

Expected composite output for the `1=4` flow:

- Composite: `2400 x 3200`
- Card 1-4: `1200 x 1600`
- Geometry: product shape and typography are not stretched when the source image is not exactly `3:4`.

## Known Limitations

- Sharp fallback improves perceived quality but cannot invent true lost detail.
- Real-ESRGAN can improve texture and edges, but it may create artifacts on tiny text. Use `mode=light` or `standard` when text accuracy matters most.
- The pipeline never rewrites text or changes layout; it only enhances pixels.
