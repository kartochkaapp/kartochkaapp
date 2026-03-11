"use strict";

const { toText } = require("../utils");

class ApiRouteError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "API route error"));
    this.name = "ApiRouteError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "route_error";
    this.details = params?.details;
  }
}

const ensureObject = (value, message) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiRouteError({
      status: 400,
      code: "invalid_payload",
      message: message || "Request payload must be an object",
    });
  }
  return value;
};

const normalizeCreateAnalyzeResult = (result, intent) => {
  const safeResult = ensureObject(result, "createAnalyze provider returned invalid response");
  const normalizedIntent = toText(intent).toLowerCase();
  const headlineIdeas = Array.isArray(safeResult.headlineIdeas)
    ? safeResult.headlineIdeas.map((item) => toText(item)).filter(Boolean)
    : [];

  if (normalizedIntent === "category") {
    return {
      detectedCategory: toText(safeResult.detectedCategory || safeResult?.insight?.category),
      insight: safeResult.insight || null,
      prompt: "",
      headlineIdeas,
      subjectOnScreen: safeResult.subjectOnScreen || null,
      autofill: safeResult.autofill || null,
    };
  }

  if (normalizedIntent === "insight") {
    return {
      detectedCategory: toText(safeResult.detectedCategory || safeResult?.insight?.category),
      insight: safeResult.insight || null,
      prompt: "",
      headlineIdeas,
      subjectOnScreen: safeResult.subjectOnScreen || null,
      autofill: safeResult.autofill || null,
    };
  }

  if (normalizedIntent === "prompt") {
    return {
      detectedCategory: toText(safeResult.detectedCategory || safeResult?.insight?.category),
      insight: safeResult.insight || null,
      prompt: toText(safeResult.prompt),
      headlineIdeas,
      subjectOnScreen: safeResult.subjectOnScreen || null,
      autofill: safeResult.autofill || null,
    };
  }

  return {
    detectedCategory: toText(safeResult.detectedCategory || safeResult?.insight?.category),
    insight: safeResult.insight || null,
    prompt: toText(safeResult.prompt),
    headlineIdeas,
    subjectOnScreen: safeResult.subjectOnScreen || null,
    autofill: safeResult.autofill || null,
  };
};

const createKartochkaHandlers = (deps) => {
  const openaiBrainService = deps?.openaiBrainService;
  const generationService = deps?.generationService;
  const historyService = deps?.historyService;

  if (
    !openaiBrainService
    || typeof openaiBrainService.createAnalyze !== "function"
    || typeof openaiBrainService.improveAnalyze !== "function"
  ) {
    throw new Error("OpenAI brain service is not configured correctly");
  }
  if (
    !generationService
    || typeof generationService.createGenerate !== "function"
    || typeof generationService.improveGenerate !== "function"
  ) {
    throw new Error("Generation service is not configured correctly");
  }
  if (
    !historyService
    || typeof historyService.list !== "function"
    || typeof historyService.getById !== "function"
    || typeof historyService.save !== "function"
  ) {
    throw new Error("History service is not configured correctly");
  }

  return {
    async createAnalyze(body) {
      const requestBody = ensureObject(body, "Invalid createAnalyze request body");
      const payload = ensureObject(requestBody.payload || {}, "createAnalyze payload must be an object");
      const context = requestBody.context && typeof requestBody.context === "object" ? requestBody.context : {};
      const result = await openaiBrainService.createAnalyze(payload, context);
      return normalizeCreateAnalyzeResult(result, context.intent);
    },

    async createGenerate(body) {
      const requestBody = ensureObject(body, "Invalid createGenerate request body");
      const payload = ensureObject(requestBody.payload || {}, "createGenerate payload must be an object");
      return generationService.createGenerate(payload);
    },

    async improveAnalyze(body) {
      const requestBody = ensureObject(body, "Invalid improveAnalyze request body");
      const payload = ensureObject(requestBody.payload || {}, "improveAnalyze payload must be an object");
      return openaiBrainService.improveAnalyze(payload);
    },

    async improveGenerate(body) {
      const requestBody = ensureObject(body, "Invalid improveGenerate request body");
      const payload = ensureObject(requestBody.payload || {}, "improveGenerate payload must be an object");
      return generationService.improveGenerate(payload);
    },

    async templatePreview(body) {
      const requestBody = ensureObject(body, "Invalid templatePreview request body");
      const payload = ensureObject(requestBody.payload || {}, "templatePreview payload must be an object");
      const prompt = toText(payload.prompt);
      if (!prompt) {
        throw new ApiRouteError({
          status: 400,
          code: "missing_prompt",
          message: "Template preview prompt is required",
        });
      }
      const previewUrl = await generationService.generateTemplatePreview(prompt);
      return { previewUrl };
    },

    async historyList(body) {
      const requestBody = ensureObject(body || {}, "Invalid historyList request body");
      return historyService.list(requestBody);
    },

    async historyGetById(body) {
      const requestBody = ensureObject(body || {}, "Invalid historyGetById request body");
      return historyService.getById(requestBody);
    },

    async historySave(body) {
      const requestBody = ensureObject(body || {}, "Invalid historySave request body");
      return historyService.save(requestBody);
    },
  };
};

module.exports = {
  ApiRouteError,
  createKartochkaHandlers,
};
