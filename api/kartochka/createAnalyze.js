"use strict";

const {
  handleKartochkaAction,
  handleProductAction,
} = require("../../server/api-request-handler");

module.exports = async (request, response) => {
  const rawUrl = new URL(request.url || "/", "https://kartochka.local");

  if (rawUrl.searchParams.get("action") === "productDetectType") {
    return handleProductAction(request, response, "detectType");
  }

  return handleKartochkaAction(request, response, "createAnalyze");
};
