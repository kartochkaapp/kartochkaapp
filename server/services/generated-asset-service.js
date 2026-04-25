"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const { ApiRouteError } = require("../api-route-error");
const { toText } = require("../utils");

const MAX_ASSET_BYTES = 42 * 1024 * 1024;
const DEFAULT_MIME_TYPE = "image/png";

const isServerlessRuntime = () => Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const buildAssetId = () => "ga_" + crypto.randomUUID().replace(/-/g, "");

const normalizeMimeType = (value) => {
  const mimeType = toText(value).toLowerCase();
  return /^image\/(?:png|jpe?g|webp)$/i.test(mimeType) ? mimeType.replace("image/jpg", "image/jpeg") : DEFAULT_MIME_TYPE;
};

const normalizeFileName = (value, fallback) => {
  const base = toText(value) || fallback || "asset.png";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 96);
  return cleaned || fallback || "asset.png";
};

const toDataUrl = (buffer, mimeType) => {
  return "data:" + normalizeMimeType(mimeType) + ";base64," + buffer.toString("base64");
};

const createGeneratedAssetService = (deps = {}) => {
  const rootDir = toText(deps.rootDir) || process.cwd();
  const fileRoot = toText(deps.fileRoot) || path.join(rootDir, "server", "data", "generated-assets");
  const publicRoutePrefix = toText(deps.publicRoutePrefix) || "/api/kartochka/generatedAsset/";
  const forceInline = Boolean(deps.forceInline) || isServerlessRuntime();

  const ensureFileRoot = () => {
    fs.mkdirSync(fileRoot, { recursive: true });
  };

  const buildFilePath = (id, fileName) => {
    const safeId = toText(id).replace(/[^a-zA-Z0-9_-]+/g, "").slice(0, 80);
    const safeFileName = normalizeFileName(fileName, "asset.png");
    if (!safeId) {
      throw new ApiRouteError({
        status: 400,
        code: "invalid_generated_asset_id",
        message: "Generated asset id is invalid",
      });
    }
    return path.join(fileRoot, safeId + "-" + safeFileName);
  };

  return {
    async saveImageBuffer(payload = {}) {
      const buffer = Buffer.isBuffer(payload.buffer) ? payload.buffer : Buffer.from([]);
      if (!buffer.length) {
        throw new ApiRouteError({
          status: 500,
          code: "empty_generated_asset",
          message: "Generated asset image is empty",
        });
      }
      if (buffer.length > MAX_ASSET_BYTES) {
        throw new ApiRouteError({
          status: 413,
          code: "generated_asset_too_large",
          message: "Generated asset image is too large",
          details: { bytes: buffer.length, limitBytes: MAX_ASSET_BYTES },
        });
      }

      const id = buildAssetId();
      const mimeType = normalizeMimeType(payload.mimeType);
      const fileName = normalizeFileName(payload.fileName, "asset.png");

      if (forceInline) {
        return {
          id,
          url: toDataUrl(buffer, mimeType),
          mimeType,
          bytes: buffer.length,
          inline: true,
        };
      }

      try {
        ensureFileRoot();
        const filePath = buildFilePath(id, fileName);
        fs.writeFileSync(filePath, buffer);
        return {
          id,
          url: publicRoutePrefix + encodeURIComponent(id),
          mimeType,
          bytes: buffer.length,
          inline: false,
          fileName,
        };
      } catch (error) {
        throw new ApiRouteError({
          status: 500,
          code: "generated_asset_save_failed",
          message: "Failed to save generated asset",
          details: { reason: toText(error?.message) },
        });
      }
    },

    async get(id) {
      const safeId = toText(id).replace(/[^a-zA-Z0-9_-]+/g, "").slice(0, 80);
      if (!safeId) {
        throw new ApiRouteError({
          status: 404,
          code: "generated_asset_not_found",
          message: "Generated asset not found",
        });
      }

      let files = [];
      try {
        ensureFileRoot();
        files = fs.readdirSync(fileRoot).filter((fileName) => fileName.startsWith(safeId + "-"));
      } catch (error) {
        files = [];
      }

      const fileName = files[0] || "";
      if (!fileName) {
        throw new ApiRouteError({
          status: 404,
          code: "generated_asset_not_found",
          message: "Generated asset not found",
        });
      }

      const filePath = path.join(fileRoot, fileName);
      const extension = path.extname(fileName).toLowerCase();
      const mimeType = extension === ".jpg" || extension === ".jpeg"
        ? "image/jpeg"
        : extension === ".webp"
          ? "image/webp"
          : DEFAULT_MIME_TYPE;

      return {
        id: safeId,
        mimeType,
        buffer: fs.readFileSync(filePath),
      };
    },
  };
};

module.exports = {
  createGeneratedAssetService,
};
