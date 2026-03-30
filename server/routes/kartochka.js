"use strict";

const crypto = require("node:crypto");

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

const hashText = (value) => {
  const source = String(value || "");
  if (!source) return "";
  return crypto.createHash("sha256").update(source).digest("hex").slice(0, 16);
};

const buildPromptPreview = (value, maxLength = 1200) => {
  return toText(value).slice(0, maxLength);
};

const buildActorMeta = (requestContext) => {
  return {
    userIdHint: toText(requestContext?.userIdHint),
    userEmailHint: toText(requestContext?.userEmailHint),
  };
};

const recordAiLog = async (aiLogService, entry) => {
  if (!aiLogService || typeof aiLogService.record !== "function") return;
  try {
    await aiLogService.record(entry);
  } catch (error) {
    // Logging should never break the product flow.
  }
};

const buildCreateAnalyzeLogEntry = ({ payload, context, requestContext, result, error }) => {
  const debug = result?.__debug && typeof result.__debug === "object" ? result.__debug : {};
  const phase = toText(context?.intent || payload?.analysisIntent || "analyze");
  const prompt = toText(result?.prompt);

  return {
    action: "createAnalyze",
    phase,
    provider: "openai",
    status: error ? "error" : "success",
    requestId: toText(context?.requestId || payload?.requestId),
    aiModelTier: toText(payload?.aiModelTier || debug.aiModelTier),
    model: toText(debug.model || payload?.openAiModel),
    reasoningEffort: toText(debug.reasoningEffort || payload?.openAiReasoningEffort),
    instructionSource: toText(debug.instructionSource),
    instructionPath: toText(debug.instructionPath || payload?.instructionPromptPath || payload?.autofillInstructionPromptPath),
    instructionHash: toText(debug.instructionHash),
    promptHash: toText(debug.promptHash || hashText(prompt)),
    promptPreview: buildPromptPreview(prompt),
    promptLength: prompt.length,
    responseHash: toText(debug.responseHash),
    responsePreview: toText(debug.responsePreview),
    responseLength: Number.isFinite(Number(debug.responseLength)) ? Number(debug.responseLength) : 0,
    imageCount: Number.isFinite(Number(debug.imageCount))
      ? Number(debug.imageCount)
      : (Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls.filter(Boolean).length : 0),
    errorCode: toText(error?.code),
    errorMessage: toText(error?.message),
    details: error
      ? {
        billingSource: toText(context?.billingSource),
      }
      : {
        billingSource: toText(context?.billingSource),
      },
    ...buildActorMeta(requestContext),
  };
};

const buildCreateGenerateLogEntry = ({ payload, requestContext, results, error }) => {
  const firstResult = Array.isArray(results) ? results[0] : null;
  const debug = firstResult?.__debug && typeof firstResult.__debug === "object" ? firstResult.__debug : {};
  const prompt = toText(payload?.prompt || payload?.customPrompt);

  return {
    action: "createGenerate",
    phase: "image_generation",
    provider: "openrouter",
    status: error ? "error" : "success",
    requestId: toText(payload?.requestId),
    aiModelTier: toText(payload?.aiModelTier || debug.aiModelTier),
    imageModel: toText(debug.imageModel),
    promptMode: toText(payload?.promptMode || debug.promptMode),
    promptHash: toText(debug.promptHash || hashText(prompt)),
    promptPreview: buildPromptPreview(prompt),
    promptLength: prompt.length,
    responseHash: toText(debug.responseHash),
    responsePreview: toText(debug.responsePreview),
    responseLength: Number.isFinite(Number(debug.responseLength)) ? Number(debug.responseLength) : 0,
    imageCount: Number.isFinite(Number(debug.imageCount))
      ? Number(debug.imageCount)
      : (Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls.filter(Boolean).length : 0),
    errorCode: toText(error?.code),
    errorMessage: toText(error?.message),
    details: error
      ? {
        templateId: toText(payload?.selectedTemplate?.id || payload?.reference?.id),
      }
      : {
        templateId: toText(payload?.selectedTemplate?.id || payload?.reference?.id),
        resultsCount: Array.isArray(results) ? results.length : 0,
      },
    ...buildActorMeta(requestContext),
  };
};

const buildImproveAnalyzeLogEntry = ({ payload, requestContext, result, error }) => {
  const debug = result?.__debug && typeof result.__debug === "object" ? result.__debug : {};
  const prompt = toText(result?.prompt);

  return {
    action: "improveAnalyze",
    phase: "prompt_generation",
    provider: "openai",
    status: error ? "error" : "success",
    requestId: toText(payload?.requestId),
    model: toText(debug.model || payload?.openAiModel),
    reasoningEffort: toText(debug.reasoningEffort || payload?.openAiReasoningEffort),
    instructionSource: toText(debug.instructionSource),
    instructionPath: toText(debug.instructionPath || payload?.improveInstructionPromptPath || payload?.instructionPromptPath),
    instructionHash: toText(debug.instructionHash),
    promptHash: toText(debug.promptHash || hashText(prompt)),
    promptPreview: buildPromptPreview(prompt),
    promptLength: prompt.length,
    responseHash: toText(debug.responseHash),
    responsePreview: toText(debug.responsePreview),
    responseLength: Number.isFinite(Number(debug.responseLength)) ? Number(debug.responseLength) : 0,
    imageCount: Number.isFinite(Number(debug.imageCount))
      ? Number(debug.imageCount)
      : (Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls.filter(Boolean).length : 0),
    errorCode: toText(error?.code),
    errorMessage: toText(error?.message),
    ...buildActorMeta(requestContext),
  };
};

const buildImproveGenerateLogEntry = ({ payload, requestContext, results, error }) => {
  const firstResult = Array.isArray(results) ? results[0] : null;
  const debug = firstResult?.__debug && typeof firstResult.__debug === "object" ? firstResult.__debug : {};
  const prompt = toText(payload?.prompt || payload?.userPrompt);

  return {
    action: "improveGenerate",
    phase: "image_generation",
    provider: "openrouter",
    status: error ? "error" : "success",
    requestId: toText(payload?.requestId),
    imageModel: toText(debug.imageModel),
    promptHash: toText(debug.promptHash || hashText(prompt)),
    promptPreview: buildPromptPreview(prompt),
    promptLength: prompt.length,
    responseHash: toText(debug.responseHash),
    responsePreview: toText(debug.responsePreview),
    responseLength: Number.isFinite(Number(debug.responseLength)) ? Number(debug.responseLength) : 0,
    imageCount: Number.isFinite(Number(debug.imageCount))
      ? Number(debug.imageCount)
      : (Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls.filter(Boolean).length : 0),
    errorCode: toText(error?.code),
    errorMessage: toText(error?.message),
    details: error ? null : { resultsCount: Array.isArray(results) ? results.length : 0 },
    ...buildActorMeta(requestContext),
  };
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
      cardTextLevels: safeResult.cardTextLevels || null,
      __debug: safeResult.__debug || null,
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
      cardTextLevels: safeResult.cardTextLevels || null,
      __debug: safeResult.__debug || null,
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
      cardTextLevels: safeResult.cardTextLevels || null,
      __debug: safeResult.__debug || null,
    };
  }

  return {
    detectedCategory: toText(safeResult.detectedCategory || safeResult?.insight?.category),
    insight: safeResult.insight || null,
    prompt: toText(safeResult.prompt),
    headlineIdeas,
    subjectOnScreen: safeResult.subjectOnScreen || null,
    autofill: safeResult.autofill || null,
    cardTextLevels: safeResult.cardTextLevels || null,
    __debug: safeResult.__debug || null,
  };
};

const resolveCreateAnalyzeBillingAction = (context) => {
  const intent = toText(context?.intent).toLowerCase();
  const billingSource = toText(context?.billingSource).toLowerCase();

  if (intent === "prompt" && billingSource === "create_generate") return "";
  if (intent === "full") return "create_autofill";
  if (intent === "prompt") return "create_prompt_assist";
  if (intent === "insight") return "create_insight";
  if (intent === "category") return "create_category";
  return "";
};

const resolveCreateGenerateBillingAction = (payload) => {
  const promptMode = toText(payload?.promptMode).toLowerCase();
  if (promptMode === "custom") return "create_generate_custom";
  return toText(payload?.aiModelTier).toLowerCase() === "best"
    ? "create_generate_best_best"
    : "create_generate_best_good";
};

const createKartochkaHandlers = (deps) => {
  const openaiBrainService = deps?.openaiBrainService;
  const generationService = deps?.generationService;
  const historyService = deps?.historyService;
  const billingService = deps?.billingService;
  const aiLogService = deps?.aiLogService;

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
  if (
    !billingService
    || typeof billingService.getBillingSummary !== "function"
    || typeof billingService.redeemPromoCode !== "function"
    || typeof billingService.runBillableAction !== "function"
  ) {
    throw new Error("Billing service is not configured correctly");
  }

  return {
    async createAnalyze(body, requestContext) {
      const requestBody = ensureObject(body, "Invalid createAnalyze request body");
      const payload = ensureObject(requestBody.payload || {}, "createAnalyze payload must be an object");
      const context = requestBody.context && typeof requestBody.context === "object" ? requestBody.context : {};
      const billingActionCode = resolveCreateAnalyzeBillingAction(context);
      const operation = async () => {
        const result = await openaiBrainService.createAnalyze(payload, context);
        return normalizeCreateAnalyzeResult(result, context.intent);
      };

      if (!billingActionCode) {
        try {
          const result = await operation();
          await recordAiLog(aiLogService, buildCreateAnalyzeLogEntry({
            payload,
            context,
            requestContext,
            result,
          }));
          return result;
        } catch (error) {
          await recordAiLog(aiLogService, buildCreateAnalyzeLogEntry({
            payload,
            context,
            requestContext,
            error,
          }));
          throw error;
        }
      }

      try {
        const result = await billingService.runBillableAction({
          actionCode: billingActionCode,
          requestContext,
          requestId: requestBody.requestId || payload.requestId || context.requestId,
          meta: {
            intent: toText(context.intent),
            billingSource: toText(context.billingSource),
          },
          operation,
        });
        await recordAiLog(aiLogService, buildCreateAnalyzeLogEntry({
          payload,
          context,
          requestContext,
          result,
        }));
        return result;
      } catch (error) {
        await recordAiLog(aiLogService, buildCreateAnalyzeLogEntry({
          payload,
          context,
          requestContext,
          error,
        }));
        throw error;
      }
    },

    async createGenerate(body, requestContext) {
      const requestBody = ensureObject(body, "Invalid createGenerate request body");
      const payload = ensureObject(requestBody.payload || {}, "createGenerate payload must be an object");
      try {
        const result = await billingService.runBillableAction({
          actionCode: resolveCreateGenerateBillingAction(payload),
          requestContext,
          requestId: requestBody.requestId || payload.requestId,
          meta: {
            promptMode: toText(payload.promptMode),
            templateId: toText(payload?.selectedTemplate?.id || payload?.reference?.id),
          },
          operation: async () => generationService.createGenerate(payload),
        });
        await recordAiLog(aiLogService, buildCreateGenerateLogEntry({
          payload,
          requestContext,
          results: result,
        }));
        return result;
      } catch (error) {
        await recordAiLog(aiLogService, buildCreateGenerateLogEntry({
          payload,
          requestContext,
          error,
        }));
        throw error;
      }
    },

    async improveAnalyze(body, requestContext) {
      const requestBody = ensureObject(body, "Invalid improveAnalyze request body");
      const payload = ensureObject(requestBody.payload || {}, "improveAnalyze payload must be an object");
      try {
        const result = await billingService.runBillableAction({
          actionCode: "improve_analyze",
          requestContext,
          requestId: requestBody.requestId || payload.requestId,
          operation: async () => openaiBrainService.improveAnalyze(payload),
        });
        await recordAiLog(aiLogService, buildImproveAnalyzeLogEntry({
          payload,
          requestContext,
          result,
        }));
        return result;
      } catch (error) {
        await recordAiLog(aiLogService, buildImproveAnalyzeLogEntry({
          payload,
          requestContext,
          error,
        }));
        throw error;
      }
    },

    async improveGenerate(body, requestContext) {
      const requestBody = ensureObject(body, "Invalid improveGenerate request body");
      const payload = ensureObject(requestBody.payload || {}, "improveGenerate payload must be an object");
      try {
        const result = await billingService.runBillableAction({
          actionCode: "improve_generate",
          requestContext,
          requestId: requestBody.requestId || payload.requestId,
          operation: async () => generationService.improveGenerate(payload),
        });
        await recordAiLog(aiLogService, buildImproveGenerateLogEntry({
          payload,
          requestContext,
          results: result,
        }));
        return result;
      } catch (error) {
        await recordAiLog(aiLogService, buildImproveGenerateLogEntry({
          payload,
          requestContext,
          error,
        }));
        throw error;
      }
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

    async billingSummary(body, requestContext) {
      ensureObject(body || {}, "Invalid billingSummary request body");
      return billingService.getBillingSummary(requestContext);
    },

    async redeemPromo(body, requestContext) {
      const requestBody = ensureObject(body || {}, "Invalid redeemPromo request body");
      return billingService.redeemPromoCode(requestContext, requestBody.code);
    },

    async aiLogs(body) {
      const requestBody = ensureObject(body || {}, "Invalid aiLogs request body");
      if (!aiLogService || typeof aiLogService.list !== "function") {
        throw new ApiRouteError({
          status: 500,
          code: "ai_logs_not_configured",
          message: "AI logs service is not configured",
        });
      }

      if (requestBody.clear) {
        return aiLogService.clear();
      }

      return {
        entries: await aiLogService.list({
          limit: requestBody.limit,
        }),
      };
    },
  };
};

module.exports = {
  ApiRouteError,
  createKartochkaHandlers,
};
