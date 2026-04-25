"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { toText } = require("../../utils");

const VALID_PROVIDERS = new Set(["auto", "realesrgan", "sharp"]);
const VALID_MODES = new Set(["light", "standard", "strong", "auto"]);
const VALID_FORMATS = new Set(["png", "jpeg", "webp"]);

const isServerlessRuntime = () => Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
};

const getDefaultWorkRoot = () => {
  return path.join(isServerlessRuntime() ? os.tmpdir() : process.cwd(), "server", "data", "image-enhancement-cache");
};

const normalizeProvider = (value) => {
  const provider = toText(value).toLowerCase();
  return VALID_PROVIDERS.has(provider) ? provider : "auto";
};

const normalizeMode = (value) => {
  const mode = toText(value).toLowerCase();
  return VALID_MODES.has(mode) ? mode : "auto";
};

const normalizeFormat = (value) => {
  const format = toText(value).toLowerCase();
  return VALID_FORMATS.has(format) ? format : "png";
};

const normalizeTarget = (options = {}) => {
  const width = Math.max(1, Math.floor(Number(options.targetWidth || options.width || 1200)));
  const height = Math.max(1, Math.floor(Number(options.targetHeight || options.height || 1600)));
  return { width, height };
};

const hashBuffer = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

const hashFile = (filePath) => {
  return hashBuffer(fs.readFileSync(filePath));
};

const hashObject = (value) => {
  return crypto.createHash("sha256").update(JSON.stringify(value || {})).digest("hex");
};

const safeFileName = (value, fallback) => {
  const fileName = toText(value || fallback || "image.png")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);
  return fileName || fallback || "image.png";
};

const withExtension = (fileName, format) => {
  const safeFormat = normalizeFormat(format);
  return safeFileName(fileName, "image." + safeFormat).replace(/\.(png|jpe?g|webp)$/i, "") + "." + (safeFormat === "jpeg" ? "jpg" : safeFormat);
};

module.exports = {
  ensureDir,
  getDefaultWorkRoot,
  hashBuffer,
  hashFile,
  hashObject,
  isServerlessRuntime,
  normalizeFormat,
  normalizeMode,
  normalizeProvider,
  normalizeTarget,
  safeFileName,
  withExtension,
};
