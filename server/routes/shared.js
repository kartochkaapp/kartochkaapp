"use strict";

const { ApiRouteError } = require("../api-route-error");
const { toText } = require("../utils");

const IMPROVE_INSTRUCTION_PATH = "server/prompts/improve-card-instruction.md";

const ensureRouteObject = (value, message) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiRouteError({
      status: 400,
      code: "invalid_payload",
      message: message || "Request payload must be an object",
    });
  }

  return value;
};

const recordAiLog = async (aiLogService, entry) => {
  if (!aiLogService || typeof aiLogService.record !== "function") return;

  try {
    await aiLogService.record(entry);
  } catch (error) {
    // Logging should never break the product flow.
  }
};

const isSupportedImageDataUrl = (value) => {
  return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(toText(value));
};

const isSupportedRequestImageUrl = (value) => {
  const url = toText(value);
  if (!url || /^blob:/i.test(url)) return false;
  if (isSupportedImageDataUrl(url)) return true;
  if (/^https?:\/\//i.test(url)) return true;
  if (url.startsWith("/") || url.startsWith("./")) {
    return !url.includes("..");
  }
  return false;
};

const ensureRequestImageUrl = (value, fieldName) => {
  const url = toText(value);
  if (!url) return "";
  if (isSupportedRequestImageUrl(url)) return url;

  throw new ApiRouteError({
    status: 400,
    code: "invalid_image_url",
    message: (fieldName || "Image URL") + " must be a data:image URL, http(s) URL, or safe local asset path",
  });
};

const ensureImageUrlArray = (value, fieldName, options) => {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new ApiRouteError({
      status: 400,
      code: "invalid_image_list",
      message: (fieldName || "Images") + " must be an array",
    });
  }

  const maxItems = Number.isFinite(Number(options?.maxItems)) ? Number(options.maxItems) : 5;
  if (value.length > maxItems) {
    throw new ApiRouteError({
      status: 400,
      code: "too_many_images",
      message: (fieldName || "Images") + " exceeds the supported limit",
      details: { limit: maxItems },
    });
  }

  return value.map((item, index) => ensureRequestImageUrl(item, (fieldName || "Images") + "[" + String(index) + "]"));
};

const ensureCountInRange = (value, fieldName, min, max, fallback) => {
  if (value == null || value === "") return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new ApiRouteError({
      status: 400,
      code: "invalid_count",
      message: (fieldName || "Count") + " must be a number",
    });
  }

  const normalized = Math.floor(parsed);
  if (normalized < min || normalized > max) {
    throw new ApiRouteError({
      status: 400,
      code: "count_out_of_range",
      message: (fieldName || "Count") + " must be between " + String(min) + " and " + String(max),
    });
  }

  return normalized;
};

const ensureRequestSignal = (condition, message, code, details) => {
  if (condition) return;

  throw new ApiRouteError({
    status: 400,
    code: toText(code) || "invalid_payload",
    message: message || "Request payload is missing required data",
    details: details || null,
  });
};

module.exports = {
  ensureCountInRange,
  ensureImageUrlArray,
  ensureRequestImageUrl,
  ensureRequestSignal,
  IMPROVE_INSTRUCTION_PATH,
  ensureRouteObject,
  isSupportedRequestImageUrl,
  isSupportedImageDataUrl,
  recordAiLog,
};
