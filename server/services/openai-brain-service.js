"use strict";

const { toText } = require("../utils");

class OpenAIBrainServiceError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "OpenAI brain service error"));
    this.name = "OpenAIBrainServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "openai_brain_service_error";
    this.details = params?.details;
  }
}

const ensureObject = (value, message) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new OpenAIBrainServiceError({
      status: 500,
      code: "invalid_provider_response",
      message: message || "OpenAI adapter returned invalid response",
      details: value,
    });
  }
  return value;
};

const normalizeCreateAnalyzeResult = (result, intent) => {
  const safeResult = ensureObject(result, "OpenAI createAnalyze response must be an object");
  const normalizedIntent = toText(intent).toLowerCase();
  const detectedCategory = toText(safeResult.detectedCategory || safeResult?.insight?.category);
  const headlineIdeas = Array.isArray(safeResult.headlineIdeas)
    ? safeResult.headlineIdeas.map((item) => toText(item)).filter(Boolean).slice(0, 5)
    : [];

  const insight = {
    category: toText(safeResult?.insight?.category || detectedCategory),
    recommendedStyle: toText(safeResult?.insight?.recommendedStyle),
    conversionAccent:
      toText(safeResult?.insight?.conversionAccent)
      || toText(safeResult?.insight?.conversionAngle),
    marketplaceFormat: toText(safeResult?.insight?.marketplaceFormat),
    conversionAngle:
      toText(safeResult?.insight?.conversionAngle)
      || toText(safeResult?.insight?.conversionAccent),
    headlineIdeas,
  };

  if (normalizedIntent === "category") {
    return {
      detectedCategory,
      insight,
      prompt: "",
      headlineIdeas,
    };
  }

  if (normalizedIntent === "insight") {
    return {
      detectedCategory,
      insight,
      prompt: "",
      headlineIdeas,
    };
  }

  if (normalizedIntent === "prompt") {
    return {
      detectedCategory,
      insight,
      prompt: toText(safeResult.prompt),
      headlineIdeas,
    };
  }

  return {
    detectedCategory,
    insight,
    prompt: toText(safeResult.prompt),
    headlineIdeas,
  };
};

const normalizeImproveAnalyzeResult = (result) => {
  const safeResult = ensureObject(result, "OpenAI improveAnalyze response must be an object");
  const recommendations = Array.isArray(safeResult.recommendations)
    ? safeResult.recommendations.map((item) => toText(item)).filter(Boolean)
    : [];

  return {
    ...safeResult,
    recommendations,
    improvementPlan: recommendations,
  };
};

const createOpenAIBrainService = (deps) => {
  const adapter = deps?.adapter;
  if (!adapter || typeof adapter.analyzeCreateInput !== "function" || typeof adapter.analyzeImproveInput !== "function") {
    throw new OpenAIBrainServiceError({
      status: 500,
      code: "invalid_adapter",
      message: "OpenAI brain adapter is not configured",
    });
  }

  return {
    async createAnalyze(payload, context) {
      const result = await adapter.analyzeCreateInput(payload || {});
      return normalizeCreateAnalyzeResult(result, context?.intent);
    },
    async improveAnalyze(payload) {
      const result = await adapter.analyzeImproveInput(payload || {});
      return normalizeImproveAnalyzeResult(result);
    },
  };
};

module.exports = {
  OpenAIBrainServiceError,
  createOpenAIBrainService,
};
