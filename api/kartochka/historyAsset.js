"use strict";

const { ApiRouteError } = require("../../server/api-route-error");
const { getRuntimeServices } = require("../../server/runtime-services");
const { sendApiError } = require("../../server/request-utils");

module.exports = async (request, response) => {
  const method = String(request.method || "GET").toUpperCase();

  try {
    if (method !== "GET" && method !== "HEAD") {
      throw new ApiRouteError({
        status: 405,
        code: "method_not_allowed",
        message: "Method not allowed",
      });
    }

    const runtimeServices = getRuntimeServices();
    const rawUrl = new URL(request.url || "/", "https://kartochka.local");
    const id = String(request.query?.id || rawUrl.searchParams.get("id") || "").trim();
    const asset = await runtimeServices.kartochkaHandlers.historyAssetGet({ id });

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
};
