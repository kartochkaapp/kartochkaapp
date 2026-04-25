"use strict";

const { ensureImageUrlArray, ensureRouteObject, recordAiLog } = require("./shared");
const { toText } = require("../utils");

const buildProductTypeDetectionLogEntry = ({ payload, requestContext, result, error, applied }) => {
  return {
    action: "productTypeDetect",
    phase: "product_type_detection",
    provider: "openai",
    status: error ? "error" : (result?.success ? "success" : "fallback"),
    requestId: toText(payload?.requestId),
    model: toText(result?.model || payload?.openAiModel),
    imageCount: Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls.filter(Boolean).length : 0,
    errorCode: toText(error?.code),
    errorMessage: toText(error?.message),
    details: error
      ? null
      : {
        detectedType: toText(result?.detectedType),
        rawDetectedType: toText(result?.rawDetectedType),
        confidence: Number(result?.confidence) || 0,
        applied: Boolean(applied),
        secondaryCandidates: Array.isArray(result?.secondaryCandidates) ? result.secondaryCandidates : [],
      },
    userIdHint: toText(requestContext?.userIdHint),
    userEmailHint: toText(requestContext?.userEmailHint),
  };
};

const createProductHandlers = (deps) => {
  const productTypeDetectionService = deps?.productTypeDetectionService;
  const aiLogService = deps?.aiLogService;

  if (!productTypeDetectionService || typeof productTypeDetectionService.detectType !== "function") {
    throw new Error("Product type detection service is not configured correctly");
  }

  return {
    async detectType(body, requestContext) {
      const requestBody = ensureRouteObject(body || {}, "Invalid product detect-type request body");
      const payload = ensureRouteObject(requestBody.payload || requestBody || {}, "detect-type payload must be an object");
      const imageDataUrls = ensureImageUrlArray(payload.imageDataUrls || (payload.imageDataUrl ? [payload.imageDataUrl] : []), "detectType.imageDataUrls", { maxItems: 1 });
      const payloadForProvider = {
        ...payload,
        imageDataUrls,
      };

      try {
        const result = await productTypeDetectionService.detectType(payloadForProvider, {
          requestId: requestBody.requestId || payload.requestId,
        });
        await recordAiLog(aiLogService, buildProductTypeDetectionLogEntry({
          payload: payloadForProvider,
          requestContext,
          result,
          applied: Boolean(requestBody.applied),
        }));
        return result;
      } catch (error) {
        const fallbackResult = {
          success: false,
          detectedType: null,
          confidence: 0,
          source: "ai",
          secondaryCandidates: [],
          reason: "AI category detection is temporarily unavailable",
        };
        await recordAiLog(aiLogService, buildProductTypeDetectionLogEntry({
          payload: payloadForProvider,
          requestContext,
          result: fallbackResult,
          error,
        }));
        return fallbackResult;
      }
    },
  };
};

module.exports = {
  createProductHandlers,
};
