"use strict";

const fs = require("node:fs");
const path = require("node:path");

const sharp = require("sharp");

const { ApiRouteError } = require("../api-route-error");
const { toText } = require("../utils");
const { resizeWithSharpToBuffer } = require("./image/upscale-with-sharp");

const MODE = "generate-four-marketplace-cards";
const PROMPT_PATH = path.join(__dirname, "..", "prompts", "generate-four-marketplace-cards.md");
const CARD_TYPES = ["benefits", "features", "lifestyle", "details"];
const CARD_TITLES = ["Benefits", "Features", "Lifestyle", "Details"];
const COMPOSITE_FILE_NAME = "composite.png";
const COMPOSITE_WIDTH = 2400;
const COMPOSITE_HEIGHT = 3200;
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 1600;
const CARD_EDGE_CROP_PX = 4;

class FourMarketplaceCardsServiceError extends Error {
  constructor(params) {
    super(String(params?.message || "Four marketplace cards service error"));
    this.name = "FourMarketplaceCardsServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "four_marketplace_cards_error";
    this.details = params?.details || null;
  }
}

const ensureDataImageUrl = (value) => {
  const dataUrl = toText(value);
  if (!/^data:image\/(?:png|jpe?g|webp);base64,/i.test(dataUrl)) {
    throw new ApiRouteError({
      status: 400,
      code: "missing_source_image",
      message: "generateFourMarketplaceCards requires a source image data URL",
    });
  }
  return dataUrl;
};

const imageDataUrlToBuffer = (value) => {
  const dataUrl = toText(value);
  const match = dataUrl.match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!match) {
    throw new FourMarketplaceCardsServiceError({
      status: 502,
      code: "invalid_generated_image_data_url",
      message: "Image generation returned an invalid image",
    });
  }
  const buffer = Buffer.from(match[2].replace(/\s+/g, ""), "base64");
  if (!buffer.length) {
    throw new FourMarketplaceCardsServiceError({
      status: 502,
      code: "empty_generated_image",
      message: "Image generation returned an empty image",
    });
  }
  return {
    buffer,
    mimeType: match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase(),
  };
};

const normalizeGeneratedImageUrl = (result) => {
  const url = toText(result?.previewUrl || result?.url || result?.imageUrl);
  if (!url) {
    throw new FourMarketplaceCardsServiceError({
      status: 502,
      code: "missing_composite_image",
      message: "Image generation returned no composite image",
    });
  }
  if (!/^data:image\//i.test(url)) {
    throw new FourMarketplaceCardsServiceError({
      status: 502,
      code: "unsupported_composite_image_url",
      message: "Image generation returned an unsupported image URL",
      details: { urlPrefix: url.slice(0, 48) },
    });
  }
  return url;
};

const getPngMetadata = async (buffer) => {
  try {
    const metadata = await sharp(buffer).metadata();
    const width = Number(metadata.width) || 0;
    const height = Number(metadata.height) || 0;
    if (!width || !height) {
      throw new Error("Missing image dimensions");
    }
    return { width, height };
  } catch (error) {
    throw new FourMarketplaceCardsServiceError({
      status: 502,
      code: "invalid_composite_image",
      message: "Composite image could not be decoded",
      details: { reason: toText(error?.message) },
    });
  }
};

const normalizeCompositeImageBuffer = async (buffer, metadata) => {
  if (metadata.width === COMPOSITE_WIDTH && metadata.height === COMPOSITE_HEIGHT) return buffer;

  const isUpscale = metadata.width < COMPOSITE_WIDTH || metadata.height < COMPOSITE_HEIGHT;
  return resizeWithSharpToBuffer(buffer, {
    targetWidth: COMPOSITE_WIDTH,
    targetHeight: COMPOSITE_HEIGHT,
    fit: "contain-background",
    sharpen: isUpscale ? { sigma: 0.6, m1: 0.7, m2: 1.2 } : null,
  });
};

const sliceCompositeImageBuffer = async (buffer) => {
  const rawMeta = await getPngMetadata(buffer);
  const normalizedBuffer = await normalizeCompositeImageBuffer(buffer, rawMeta);
  const metadata = normalizedBuffer === buffer ? rawMeta : await getPngMetadata(normalizedBuffer);
  buffer = normalizedBuffer;
  const cardWidth = Math.floor(metadata.width / 2);
  const cardHeight = Math.floor(metadata.height / 2);

  if (cardWidth < 1 || cardHeight < 1) {
    throw new FourMarketplaceCardsServiceError({
      status: 502,
      code: "composite_image_too_small",
      message: "Composite image is too small to slice",
      details: metadata,
    });
  }

  const crops = [
    { left: 0, top: 0, width: cardWidth, height: cardHeight },
    { left: cardWidth, top: 0, width: cardWidth, height: cardHeight },
    { left: 0, top: cardHeight, width: cardWidth, height: cardHeight },
    { left: cardWidth, top: cardHeight, width: cardWidth, height: cardHeight },
  ];

  try {
    const cards = await Promise.all(crops.map(async (crop, index) => {
      const edgeCrop = crop.width > CARD_EDGE_CROP_PX * 2 && crop.height > CARD_EDGE_CROP_PX * 2
        ? CARD_EDGE_CROP_PX
        : 0;
      const cardBuffer = await sharp(buffer).extract(crop).png().toBuffer();
      let pipeline = sharp(cardBuffer);
      if (edgeCrop) {
        pipeline = pipeline
          .extract({
            left: edgeCrop,
            top: edgeCrop,
            width: crop.width - edgeCrop * 2,
            height: crop.height - edgeCrop * 2,
          })
          .resize(crop.width, crop.height, {
            fit: "fill",
            kernel: sharp.kernel.lanczos3,
          });
      }
      const outputBuffer = await pipeline
        .png()
        .toBuffer();
      return {
        index: index + 1,
        type: CARD_TYPES[index],
        title: CARD_TITLES[index],
        fileName: "card_" + String(index + 1) + "_" + CARD_TYPES[index] + ".png",
        width: crop.width,
        height: crop.height,
        crop,
        edgeCrop,
        buffer: outputBuffer,
      };
    }));
    return {
      composite: metadata,
      compositeBuffer: buffer,
      cardWidth,
      cardHeight,
      cards,
    };
  } catch (error) {
    throw new FourMarketplaceCardsServiceError({
      status: 500,
      code: "composite_slice_failed",
      message: "Failed to slice composite image",
      details: { reason: toText(error?.message), width: metadata.width, height: metadata.height },
    });
  }
};

const readImageFileBuffer = (filePath) => fs.readFileSync(filePath);

const buildSlicedResultFromEnhancedComposite = async (enhancementResult) => {
  const compositePath = toText(enhancementResult?.output?.path);
  const cards = Array.isArray(enhancementResult?.cards) ? enhancementResult.cards : [];
  if (!compositePath || cards.length !== 4) {
    throw new FourMarketplaceCardsServiceError({
      status: 500,
      code: "image_enhancement_invalid_output",
      message: "Local image enhancement returned an invalid composite result",
    });
  }

  const compositeMeta = await getPngMetadata(compositePath);
  const normalizedCards = await Promise.all(cards.map(async (card, index) => {
    const metadata = await getPngMetadata(card.path);
    const type = CARD_TYPES[index];
    return {
      index: index + 1,
      type,
      title: CARD_TITLES[index],
      fileName: "card_" + String(index + 1) + "_" + type + ".png",
      width: metadata.width,
      height: metadata.height,
      crop: card.crop,
      edgeCrop: 0,
      buffer: readImageFileBuffer(card.path),
    };
  }));

  return {
    composite: compositeMeta,
    compositeBuffer: readImageFileBuffer(compositePath),
    cardWidth: Math.floor(compositeMeta.width / 2),
    cardHeight: Math.floor(compositeMeta.height / 2),
    cards: normalizedCards,
    enhancement: {
      provider: toText(enhancementResult.provider),
      mode: toText(enhancementResult.mode),
      cacheHit: Boolean(enhancementResult.cacheHit),
      warnings: Array.isArray(enhancementResult.warnings) ? enhancementResult.warnings : [],
      timings: enhancementResult.timings || {},
      original: enhancementResult.original || null,
    },
  };
};

const createFourMarketplaceCardsService = (deps = {}) => {
  const generationService = deps.generationService;
  const generatedAssetService = deps.generatedAssetService;
  const imageEnhancementService = deps.imageEnhancementService;

  if (!generationService || typeof generationService.generateFourMarketplaceCards !== "function") {
    throw new Error("Four marketplace cards generation service is not configured");
  }
  if (!generatedAssetService || typeof generatedAssetService.saveImageBuffer !== "function") {
    throw new Error("Generated asset service is not configured");
  }

  const prompt = fs.readFileSync(PROMPT_PATH, "utf8").trim();

  return {
    async generate(payload = {}) {
      const requestId = toText(payload.requestId);
      const sourcePreviewUrl = ensureDataImageUrl(payload.sourcePreviewUrl);
      const startedAt = Date.now();

      console.info("[four_marketplace_cards] started", { requestId, mode: MODE });

      let rawResult;
      try {
        rawResult = await generationService.generateFourMarketplaceCards({
          ...payload,
          mode: MODE,
          prompt,
          imageDataUrls: [sourcePreviewUrl],
          sourcePreviewUrl,
          size: "1024x1536",
          quality: "high",
          responseReasoningEffort: "medium",
          requestTimeoutMs: Number(payload.requestTimeoutMs) || 220000,
          maxRetries: 0,
          cardsCount: 1,
          requestId,
          debugMode: Boolean(payload.debugMode),
        });
      } catch (error) {
        console.error("[four_marketplace_cards] failed", {
          requestId,
          phase: "generation",
          code: toText(error?.code),
          status: error?.status,
          message: toText(error?.message),
          details: error?.details,
          causeMessage: toText(error?.cause?.message),
          causeDetails: error?.cause?.details,
        });
        throw error;
      }

      const generationResult = Array.isArray(rawResult) ? rawResult[0] : rawResult;
      const compositeDataUrl = normalizeGeneratedImageUrl(generationResult);
      const parsedComposite = imageDataUrlToBuffer(compositeDataUrl);
      console.info("[four_marketplace_cards] image_received", { requestId, bytes: parsedComposite.buffer.length });

      let sliced;
      try {
        if (imageEnhancementService && typeof imageEnhancementService.enhanceCompositeAndCropBuffer === "function") {
          const enhancementResult = await imageEnhancementService.enhanceCompositeAndCropBuffer(parsedComposite.buffer, {
            requestId,
            targetWidth: COMPOSITE_WIDTH,
            targetHeight: COMPOSITE_HEIGHT,
            exportFormat: "png",
          });
          sliced = await buildSlicedResultFromEnhancedComposite(enhancementResult);
        } else {
          sliced = await sliceCompositeImageBuffer(parsedComposite.buffer);
        }
      } catch (error) {
        console.error("[four_marketplace_cards] enhancement_failed", {
          requestId,
          code: toText(error?.code),
          message: toText(error?.message),
          details: error?.details,
        });
        sliced = await sliceCompositeImageBuffer(parsedComposite.buffer);
        sliced.enhancement = {
          provider: "sharp",
          mode: "fallback",
          cacheHit: false,
          warnings: ["Local enhancement failed; used minimal Sharp fallback."],
          error: toText(error?.message),
        };
      }
      console.info("[four_marketplace_cards] sliced", {
        requestId,
        width: sliced.composite.width,
        height: sliced.composite.height,
        cardWidth: sliced.cardWidth,
        cardHeight: sliced.cardHeight,
        enhancementProvider: sliced.enhancement?.provider,
        enhancementMode: sliced.enhancement?.mode,
        enhancementCacheHit: Boolean(sliced.enhancement?.cacheHit),
      });

      const compositeAsset = await generatedAssetService.saveImageBuffer({
        buffer: sliced.compositeBuffer,
        fileName: COMPOSITE_FILE_NAME,
        mimeType: "image/png",
      });
      const cardAssets = await Promise.all(sliced.cards.map(async (card) => {
        const saved = await generatedAssetService.saveImageBuffer({
          buffer: card.buffer,
          fileName: card.fileName,
          mimeType: "image/png",
        });
        return {
          index: card.index,
          type: card.type,
          title: card.title,
          url: saved.url,
          width: card.width,
          height: card.height,
          downloadName: card.fileName,
          crop: card.crop,
          edgeCrop: card.edgeCrop,
        };
      }));

      console.info("[four_marketplace_cards] saved", {
        requestId,
        durationMs: Date.now() - startedAt,
        compositeAssetId: compositeAsset.id,
        cards: cardAssets.length,
      });

      return {
        success: true,
        mode: MODE,
        composite: {
          url: compositeAsset.url,
          width: sliced.composite.width,
          height: sliced.composite.height,
          downloadName: COMPOSITE_FILE_NAME,
        },
        cards: cardAssets,
        metadata: {
          requestId,
          durationMs: Date.now() - startedAt,
          promptPath: "server/prompts/generate-four-marketplace-cards.md",
          provider: toText(generationResult?.provider),
          providerLabel: toText(generationResult?.providerLabel),
          generatedWidth: sliced.composite.width,
          generatedHeight: sliced.composite.height,
          cardWidth: sliced.cardWidth,
          cardHeight: sliced.cardHeight,
          targetCompositeWidth: COMPOSITE_WIDTH,
          targetCompositeHeight: COMPOSITE_HEIGHT,
          targetCardWidth: CARD_WIDTH,
          targetCardHeight: CARD_HEIGHT,
          cardEdgeCropPx: CARD_EDGE_CROP_PX,
          enhancement: sliced.enhancement || null,
          promptHash: toText(generationResult?.metadata?.promptHash),
        },
        __debug: generationResult?.__debug || null,
      };
    },
  };
};

module.exports = {
  MODE,
  CARD_TYPES,
  COMPOSITE_WIDTH,
  COMPOSITE_HEIGHT,
  CARD_WIDTH,
  CARD_HEIGHT,
  FourMarketplaceCardsServiceError,
  createFourMarketplaceCardsService,
  sliceCompositeImageBuffer,
};
