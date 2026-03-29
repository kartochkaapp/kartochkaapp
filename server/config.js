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

const getRuntimeConfig = () => {
  loadEnvFiles();

  return {
    app: {
      host: toText(process.env.HOST) || "0.0.0.0",
      port: toNumber(process.env.PORT, 2020),
      rootDir: ROOT_DIR,
      publicBaseUrl: toText(process.env.PUBLIC_BASE_URL) || "http://localhost:2020",
      requestBodyLimitBytes: toNumber(process.env.REQUEST_BODY_LIMIT_BYTES, 25 * 1024 * 1024),
      requestTimeoutMs: toNumber(process.env.REQUEST_TIMEOUT_MS, 300000),
    },
    openai: {
      apiKey: toText(process.env.OPENAI_API_KEY),
      baseUrl: toText(process.env.OPENAI_BASE_URL) || "https://api.openai.com/v1",
      model: toText(process.env.OPENAI_MODEL) || "gpt-4.1-mini",
    },
    openrouter: {
      apiKey: toText(process.env.OPENROUTER_API_KEY),
      baseUrl: toText(process.env.OPENROUTER_BASE_URL) || "https://openrouter.ai/api/v1",
      model: toText(process.env.OPENROUTER_MODEL) || "google/gemini-3.1-flash-image-preview",
      referer: toText(process.env.OPENROUTER_REFERER) || "http://localhost:2020",
      title: toText(process.env.OPENROUTER_TITLE) || "KARTOCHKA",
    },
    billing: {
      starterTokens: toNumber(process.env.BILLING_STARTER_TOKENS, 12),
      storeMode: toText(process.env.BILLING_STORE_MODE) || "auto",
      promoSeeds: toText(process.env.BILLING_PROMO_SEEDS),
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
