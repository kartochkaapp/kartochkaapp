"use strict";

const { ApiRouteError } = require("../server/api-route-error");
const {
  handleKartochkaAction,
  handleProductAction,
} = require("../server/api-request-handler");
const { getRuntimeServices } = require("../server/runtime-services");
const { sendApiError } = require("../server/request-utils");

const ACTIONS = new Set([
  "aiLogs",
  "billingSummary",
  "createAnalyze",
  "createGenerate",
  "generateFourMarketplaceCards",
  "historyGetById",
  "historyList",
  "historySave",
  "historyAssetSave",
  "improveAnalyze",
  "improveGenerate",
  "redeemPromo",
  "templatePreview",
]);

const sendImageAsset = async (request, response, getter, id, fallbackMimeType) => {
  const method = String(request.method || "GET").toUpperCase();
  try {
    if (method !== "GET" && method !== "HEAD") {
      throw new ApiRouteError({
        status: 405,
        code: "method_not_allowed",
        message: "Method not allowed",
      });
    }

    const asset = await getter({ id });
    response.statusCode = 200;
    response.setHeader("Content-Type", asset.mimeType || fallbackMimeType || "image/png");
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    response.setHeader("Content-Length", asset.buffer.length);
    if (method === "HEAD") {
      response.end();
      return;
    }
    response.end(asset.buffer);
  } catch (error) {
    sendApiError(response, error);
  }
};

module.exports = async (request, response) => {
  const rawUrl = new URL(request.url || "/", "https://kartochka.local");
  const action = String(rawUrl.searchParams.get("action") || "").trim();
  const assetId = String(rawUrl.searchParams.get("assetId") || "").trim();

  if (action === "productDetectType") {
    return handleProductAction(request, response, "detectType");
  }

  if (action === "historyAssetGet" && assetId) {
    const { kartochkaHandlers } = getRuntimeServices();
    return sendImageAsset(request, response, kartochkaHandlers.historyAssetGet, assetId, "image/jpeg");
  }

  if (action === "generatedAssetGet" && assetId) {
    const { kartochkaHandlers } = getRuntimeServices();
    return sendImageAsset(request, response, kartochkaHandlers.generatedAssetGet, assetId, "image/png");
  }

  if (ACTIONS.has(action)) {
    return handleKartochkaAction(request, response, action);
  }

  throw new ApiRouteError({
    status: 404,
    code: "route_not_found",
    message: "API route not found",
  });
};

module.exports.config = { maxDuration: 240 };
