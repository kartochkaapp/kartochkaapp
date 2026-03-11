"use strict";

const { toText } = require("../utils");
const { ApiRouteError } = require("./kartochka");

const DEFAULT_NANO_BANANA_PROMPT =
  "Professional product card. Pure minimalist background, studio lighting, highly detailed, vibrant colors, clear drop shadow. Keep the original product shape intact, but make it look premium and conversion-focused. Do not show marketplace names, marketplace badges, or words like marketplace, маркетплейс, Ozon, Wildberries, or WB on the card unless they are part of the actual product branding.";

const ensureObject = (value, message) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiRouteError({
      status: 400,
      code: "invalid_payload",
      message: message || "Request payload must be an object",
    });
  }

  return value;
};

const isSupportedImageDataUrl = (value) => {
  return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(String(value || "").trim());
};

const createEnhanceCardHandler = (deps) => {
  const nanoBananaService = deps?.nanoBananaService;

  if (!nanoBananaService || typeof nanoBananaService.enhanceCard !== "function") {
    throw new Error("Nano Banana service is not configured correctly");
  }

  return async (body) => {
    const requestBody = ensureObject(body, "Invalid enhance-card request body");
    const imageDataUrl = toText(
      requestBody.imageDataUrl
      || requestBody.imageBase64
      || requestBody.image
    ).trim();

    if (!imageDataUrl) {
      throw new ApiRouteError({
        status: 400,
        code: "missing_image",
        message: "Image is required",
      });
    }

    if (!isSupportedImageDataUrl(imageDataUrl)) {
      throw new ApiRouteError({
        status: 400,
        code: "unsupported_image_format",
        message: "Only PNG, JPG and WEBP data URLs are supported",
      });
    }

    const prompt = toText(requestBody.prompt).trim() || DEFAULT_NANO_BANANA_PROMPT;
    return nanoBananaService.enhanceCard({
      imageDataUrl,
      prompt,
    });
  };
};

module.exports = {
  DEFAULT_NANO_BANANA_PROMPT,
  createEnhanceCardHandler,
};
