"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT_DIR = path.resolve(__dirname, "..");
const ENV_FILES = [
  path.join(ROOT_DIR, ".env.local"),
  path.join(ROOT_DIR, ".env"),
];

const parseEnvFile = (content) => {
  const result = {};
  const lines = String(content || "").split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    if (!key) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
};

const loadEnvFiles = () => {
  for (const filePath of ENV_FILES) {
    if (!fs.existsSync(filePath)) continue;
    const parsed = parseEnvFile(fs.readFileSync(filePath, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] == null) {
        process.env[key] = value;
      }
    }
  }
};

const toText = (value) => String(value || "").trim();
const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const toBoolean = (value, fallback) => {
  const text = toText(value).toLowerCase();
  if (!text) return Boolean(fallback);
  if (["1", "true", "yes", "on"].includes(text)) return true;
  if (["0", "false", "no", "off"].includes(text)) return false;
  return Boolean(fallback);
};

const MIN_IMAGE_GENERATION_TIMEOUT_MS = 180000;
const MIN_IMAGE_IMPROVE_TIMEOUT_MS = 180000;

const getRuntimeConfig = () => {
  loadEnvFiles();

  const resolvedOpenRouterModel = toText(process.env.OPENROUTER_MODEL) || "google/gemini-2.5-flash";
  const resolvedOpenRouterImageModel = toText(process.env.OPENROUTER_IMAGE_MODEL) || "google/gemini-3-pro-image-preview";
  const resolvedRequestTimeoutMs = toNumber(process.env.REQUEST_TIMEOUT_MS, 300000);
  const resolvedImageTimeoutMs = Math.max(
    MIN_IMAGE_GENERATION_TIMEOUT_MS,
    toNumber(process.env.OPENAI_IMAGE_TIMEOUT_MS || process.env.REQUEST_TIMEOUT_MS, 300000)
  );
  const resolvedImproveImageTimeoutMs = Math.max(
    MIN_IMAGE_IMPROVE_TIMEOUT_MS,
    toNumber(process.env.OPENAI_IMAGE_IMPROVE_TIMEOUT_MS || process.env.OPENAI_IMAGE_TIMEOUT_MS || process.env.REQUEST_TIMEOUT_MS, 300000)
  );

  return {
    app: {
      host: toText(process.env.HOST) || "0.0.0.0",
      port: toNumber(process.env.PORT, 2020),
      rootDir: ROOT_DIR,
      publicBaseUrl: toText(process.env.PUBLIC_BASE_URL) || "http://localhost:2020",
      requestBodyLimitBytes: toNumber(process.env.REQUEST_BODY_LIMIT_BYTES, 25 * 1024 * 1024),
      requestTimeoutMs: resolvedRequestTimeoutMs,
    },
    openai: {
      apiKey: toText(process.env.OPENAI_API_KEY),
      baseUrl: toText(process.env.OPENAI_BASE_URL) || "https://api.openai.com/v1",
      model: toText(process.env.OPENAI_MODEL) || "gpt-5.5",
      reasoningEffort: toText(process.env.OPENAI_REASONING_EFFORT) || "medium",
    },
    openaiImage: {
      enabled: toBoolean(process.env.OPENAI_IMAGE_GENERATION_ENABLED, true),
      apiKey: toText(process.env.OPENAI_API_KEY),
      baseUrl: toText(process.env.OPENAI_BASE_URL) || "https://api.openai.com/v1",
      model: toText(process.env.OPENAI_IMAGE_MODEL) || "gpt-image-2",
      responseModel: toText(process.env.OPENAI_IMAGE_RESPONSE_MODEL) || "gpt-5.4",
      responseReasoningEffort: toText(process.env.OPENAI_IMAGE_RESPONSE_REASONING_EFFORT || process.env.OPENAI_REASONING_EFFORT) || "medium",
      quality: toText(process.env.OPENAI_IMAGE_QUALITY) || "high",
      size: toText(process.env.OPENAI_IMAGE_SIZE) || "1200x1600",
      timeoutMs: resolvedImageTimeoutMs,
      improveTimeoutMs: resolvedImproveImageTimeoutMs,
      inputDetail: toText(process.env.OPENAI_IMAGE_INPUT_DETAIL) || "low",
      improveInputDetail: toText(process.env.OPENAI_IMAGE_IMPROVE_INPUT_DETAIL || process.env.OPENAI_IMAGE_INPUT_DETAIL) || "low",
      maxRetries: toNumber(process.env.OPENAI_IMAGE_MAX_RETRIES, 1),
    },
    categoryDetection: {
      enabled: toBoolean(process.env.AI_CATEGORY_DETECTION_ENABLED, true),
      model: toText(process.env.AI_CATEGORY_OPENAI_MODEL || process.env.OPENAI_MODEL) || "gpt-5.4",
      confidenceThreshold: toNumber(process.env.AI_CATEGORY_CONFIDENCE_THRESHOLD, 0.65),
      timeoutMs: toNumber(process.env.AI_CATEGORY_TIMEOUT_MS, 20000),
      maxRetries: toNumber(process.env.AI_CATEGORY_MAX_RETRIES, 1),
    },
    openrouter: {
      apiKey: toText(process.env.OPENROUTER_API_KEY),
      baseUrl: toText(process.env.OPENROUTER_BASE_URL) || "https://openrouter.ai/api/v1",
      model: resolvedOpenRouterModel,
      imageModel: resolvedOpenRouterImageModel,
      textReplaceLocatorModel: toText(process.env.OPENROUTER_TEXT_REPLACE_LOCATOR_MODEL) || "google/gemini-2.5-flash",
      textReplaceEditorModel: toText(process.env.OPENROUTER_TEXT_REPLACE_EDITOR_MODEL) || resolvedOpenRouterImageModel,
      referer: toText(process.env.OPENROUTER_REFERER) || "http://localhost:2020",
      title: toText(process.env.OPENROUTER_TITLE) || "KARTOCHKA",
    },
    billing: {
      starterTokens: toNumber(process.env.BILLING_STARTER_TOKENS, 12),
      storeMode: toText(process.env.BILLING_STORE_MODE) || "auto",
      promoSeeds: toText(process.env.BILLING_PROMO_SEEDS),
    },
    history: {
      storeMode: toText(process.env.HISTORY_STORE_MODE) || "auto",
      maxItems: toNumber(process.env.HISTORY_MAX_ITEMS, 30),
    },
    imageEnhancement: {
      provider: toText(process.env.IMAGE_ENHANCEMENT_PROVIDER) || "auto",
      mode: toText(process.env.IMAGE_ENHANCEMENT_MODE) || "auto",
      targetWidth: toNumber(process.env.IMAGE_TARGET_WIDTH, 1200),
      targetHeight: toNumber(process.env.IMAGE_TARGET_HEIGHT, 1600),
      cacheEnabled: toBoolean(process.env.ENABLE_IMAGE_CACHE, true),
      realesrganBinaryPath: toText(process.env.REALESRGAN_BINARY_PATH),
      realesrganModel: toText(process.env.REALESRGAN_MODEL),
      exportFormat: toText(process.env.EXPORT_FORMAT) || "png",
    },
    firebaseAdmin: {
      projectId: toText(process.env.FIREBASE_ADMIN_PROJECT_ID),
      clientEmail: toText(process.env.FIREBASE_ADMIN_CLIENT_EMAIL),
      privateKey: toText(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
    },
  };
};

module.exports = {
  getRuntimeConfig,
};
