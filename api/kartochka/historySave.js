"use strict";

const { ApiRouteError } = require("../../server/api-route-error");
const { handleKartochkaAction } = require("../../server/api-request-handler");
const { getRuntimeServices } = require("../../server/runtime-services");
const { sendApiError } = require("../../server/request-utils");

module.exports = async (request, response) => {
  const rawUrl = new URL(request.url || "/", "https://kartochka.local");
  const method = String(request.method || "POST").toUpperCase();

  if (rawUrl.searchParams.get("action") === "historyAssetSave") {
    return handleKartochkaAction(request, response, "historyAssetSave");
  }

  const assetId = String(rawUrl.searchParams.get("assetId") || "").trim();
  if (assetId) {
    try {
      if (method !== "GET" && method !== "HEAD") {
        throw new ApiRouteError({
          status: 405,
          code: "method_not_allowed",
          message: "Method not allowed",
        });
      }

      const { kartochkaHandlers } = getRuntimeServices();
      const asset = await kartochkaHandlers.historyAssetGet({ id: assetId });
      response.statusCode = 200;
      response.setHeader("Content-Type", asset.mimeType || "image/jpeg");
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
    return;
  }

  return handleKartochkaAction(request, response, "historySave");
};
