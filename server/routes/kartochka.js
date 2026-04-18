"use strict";

const { ApiRouteError } = require("../api-route-error");
const {
  IMPROVE_INSTRUCTION_PATH,
  ensureCountInRange,
  ensureImageUrlArray,
  ensureRequestImageUrl,
  ensureRequestSignal,
  ensureRouteObject,
  recordAiLog,
} = require("./shared");
const { toText } = require("../utils");

const buildActorMeta = (requestContext) => {
  return {
    userIdHint: toText(requestContext?.userIdHint),
    userEmailHint: toText(requestContext?.userEmailHint),
  };
};

const buildCreateAnalyzeLogEntry = ({ payload, context, requestContext, result, error }) => {
  const debug = result?.__debug && typeof result.__debug === "object" ? result.__debug : {};
  const phase = toText(context?.intent || payload?.analysisIntent || "analyze");

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
    requestText: toText(debug.requestText),
    responseText: toText(debug.responseText),
    imageCount: Number.isFinite(Number(debug.imageCount))
      ? Number(debug.imageCount)
      : (Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls.filter(Boolean).length : 0),
    errorCode: toText(error?.code),
    errorMessage: toText(error?.message),
    details: {
      billingSource: toText(context?.billingSource),
    },
    ...buildActorMeta(requestContext),
  };
};

const buildCreateGenerateLogEntry = ({ payload, requestContext, results, error }) => {
  const firstResult = Array.isArray(results) ? results[0] : null;
  const debug = firstResult?.__debug && typeof firstResult.__debug === "object" ? firstResult.__debug : {};
  const errorDetailsText = error?.details
    ? (() => {
      try {
        return typeof error.details === "string" ? error.details : JSON.stringify(error.details);
      } catch (stringifyError) {
        return "";
      }
    })()
    : "";

  return {
    action: "createGenerate",
    phase: "image_generation",
    provider: "openrouter",
    status: error ? "error" : "success",
    requestId: toText(payload?.requestId),
    aiModelTier: toText(payload?.aiModelTier || debug.aiModelTier),
    imageModel: toText(debug.imageModel),
    requestText: toText(debug.requestText),
    promptMode: toText(payload?.promptMode || debug.promptMode),
    responseText: error ? errorDetailsText : toText(debug.responseText),
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
    requestText: toText(debug.requestText),
    responseText: toText(debug.responseText),
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

  return {
    action: "improveGenerate",
    phase: "image_generation",
    provider: "openrouter",
    status: error ? "error" : "success",
    requestId: toText(payload?.requestId),
    imageModel: toText(debug.imageModel),
    requestText: toText(debug.requestText),
    responseText: toText(debug.responseText),
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
  const safeResult = ensureRouteObject(result, "createAnalyze provider returned invalid response");
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
  const templateKind = toText(payload?.selectedTemplate?.kind || payload?.reference?.kind).toLowerCase();
  if (templateKind === "text-replace") return "create_generate_text_replace";

  const promptMode = toText(payload?.promptMode).toLowerCase();
  if (promptMode === "custom") return "create_generate_custom";
  return toText(payload?.aiModelTier).toLowerCase() === "best"
    ? "create_generate_best_best"
    : "create_generate_best_good";
};

const hasCreateInputSignal = (payload) => {
  return Boolean(
    toText(payload?.title)
    || toText(payload?.shortDescription)
    || toText(payload?.description)
    || toText(payload?.highlights)
    || toText(payload?.prompt)
    || toText(payload?.customPrompt)
    || toText(payload?.userText)
    || (Array.isArray(payload?.imageDataUrls) && payload.imageDataUrls.length)
  );
};

const validateCreateAnalyzePayload = (payload) => {
  ensureImageUrlArray(payload?.imageDataUrls, "createAnalyze.imageDataUrls", { maxItems: 5 });
  ensureRequestSignal(
    hasCreateInputSignal(payload),
    "createAnalyze requires product text or at least one image",
    "missing_create_input"
  );
};

const validateCreateGeneratePayload = (payload) => {
  ensureImageUrlArray(payload?.imageDataUrls, "createGenerate.imageDataUrls", { maxItems: 5 });
  ensureRequestImageUrl(payload?.referencePreviewUrl, "createGenerate.referencePreviewUrl");
  ensureCountInRange(payload?.cardsCount, "createGenerate.cardsCount", 1, 5, 1);
  ensureRequestSignal(
    hasCreateInputSignal(payload),
    "createGenerate requires a prompt, product text, or at least one image",
    "missing_create_generation_input"
  );
};

const validateImprovePayload = (payload, actionName) => {
  ensureRequestImageUrl(payload?.sourcePreviewUrl, actionName + ".sourcePreviewUrl");
  ensureRequestImageUrl(payload?.referencePreviewUrl, actionName + ".referencePreviewUrl");
  ensureRequestSignal(
    Boolean(payload?.sourceCard) || Boolean(toText(payload?.sourcePreviewUrl)),
    actionName + " requires a source card image",
    "missing_source_image"
  );

  const wantsReferenceStyle = toText(payload?.mode).toLowerCase() === "reference" || Boolean(payload?.referenceStyle);
  if (wantsReferenceStyle) {
    ensureRequestSignal(
      Boolean(payload?.referenceCard) || Boolean(toText(payload?.referencePreviewUrl)),
      actionName + " requires a reference image when reference style is enabled",
      "missing_reference_image"
    );
  }
};

const createKartochkaHandlers = (deps) => {
  const openaiBrainService = deps?.openaiBrainService;
  const generationService = deps?.generationService;
  const historyService = deps?.historyService;
  const historyAssetService = deps?.historyAssetService;
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
    !historyAssetService
    || typeof historyAssetService.save !== "function"
    || typeof historyAssetService.get !== "function"
  ) {
    throw new Error("History asset service is not configured correctly");
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
      const requestBody = ensureRouteObject(body, "Invalid createAnalyze request body");
      const payload = ensureRouteObject(requestBody.payload || {}, "createAnalyze payload must be an object");
      validateCreateAnalyzePayload(payload);
      const payloadForProvider = { ...payload, debugMode: true };
      const context = requestBody.context && typeof requestBody.context === "object" ? requestBody.context : {};
      const billingActionCode = resolveCreateAnalyzeBillingAction(context);
      const operation = async () => {
        const result = await openaiBrainService.createAnalyze(payloadForProvider, context);
        return normalizeCreateAnalyzeResult(result, context.intent);
      };

      if (!billingActionCode) {
        try {
          const result = await operation();
          await recordAiLog(aiLogService, buildCreateAnalyzeLogEntry({
            payload: payloadForProvider,
            context,
            requestContext,
            result,
          }));
          return result;
        } catch (error) {
          await recordAiLog(aiLogService, buildCreateAnalyzeLogEntry({
            payload: payloadForProvider,
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
          payload: payloadForProvider,
          context,
          requestContext,
          result,
        }));
        return result;
      } catch (error) {
        await recordAiLog(aiLogService, buildCreateAnalyzeLogEntry({
          payload: payloadForProvider,
          context,
          requestContext,
          error,
        }));
        throw error;
      }
    },

    async createGenerate(body, requestContext) {
      const requestBody = ensureRouteObject(body, "Invalid createGenerate request body");
      const payload = ensureRouteObject(requestBody.payload || {}, "createGenerate payload must be an object");
      validateCreateGeneratePayload(payload);
      const payloadForProvider = { ...payload, debugMode: true };
      try {
        const result = await billingService.runBillableAction({
          actionCode: resolveCreateGenerateBillingAction(payloadForProvider),
          requestContext,
          requestId: requestBody.requestId || payloadForProvider.requestId,
          meta: {
            promptMode: toText(payloadForProvider.promptMode),
            templateId: toText(payloadForProvider?.selectedTemplate?.id || payloadForProvider?.reference?.id),
          },
          operation: async () => generationService.createGenerate(payloadForProvider),
        });
        await recordAiLog(aiLogService, buildCreateGenerateLogEntry({
          payload: payloadForProvider,
          requestContext,
          results: result,
        }));
        return result;
      } catch (error) {
        await recordAiLog(aiLogService, buildCreateGenerateLogEntry({
          payload: payloadForProvider,
          requestContext,
          error,
        }));
        throw error;
      }
    },

    async improveAnalyze(body, requestContext) {
      const requestBody = ensureRouteObject(body, "Invalid improveAnalyze request body");
      const payload = ensureRouteObject(requestBody.payload || {}, "improveAnalyze payload must be an object");
      validateImprovePayload(payload, "improveAnalyze");
      const payloadForProvider = {
        ...payload,
        improveInstructionPromptPath:
          toText(payload?.improveInstructionPromptPath || payload?.instructionPromptPath)
          || IMPROVE_INSTRUCTION_PATH,
        debugMode: true,
      };
      try {
        const result = await billingService.runBillableAction({
          actionCode: "improve_analyze",
          requestContext,
          requestId: requestBody.requestId || payloadForProvider.requestId,
          operation: async () => openaiBrainService.improveAnalyze(payloadForProvider),
        });
        await recordAiLog(aiLogService, buildImproveAnalyzeLogEntry({
          payload: payloadForProvider,
          requestContext,
          result,
        }));
        return result;
      } catch (error) {
        await recordAiLog(aiLogService, buildImproveAnalyzeLogEntry({
          payload: payloadForProvider,
          requestContext,
          error,
        }));
        throw error;
      }
    },

    async improveGenerate(body, requestContext) {
      const requestBody = ensureRouteObject(body, "Invalid improveGenerate request body");
      const payload = ensureRouteObject(requestBody.payload || {}, "improveGenerate payload must be an object");
      validateImprovePayload(payload, "improveGenerate");
      ensureCountInRange(payload?.variantsCount, "improveGenerate.variantsCount", 1, 5, 1);
      const payloadForProvider = { ...payload, debugMode: true };
      try {
        const result = await billingService.runBillableAction({
          actionCode: "improve_generate",
          requestContext,
          requestId: requestBody.requestId || payloadForProvider.requestId,
          operation: async () => generationService.improveGenerate(payloadForProvider),
        });
        await recordAiLog(aiLogService, buildImproveGenerateLogEntry({
          payload: payloadForProvider,
          requestContext,
          results: result,
        }));
        return result;
      } catch (error) {
        await recordAiLog(aiLogService, buildImproveGenerateLogEntry({
          payload: payloadForProvider,
          requestContext,
          error,
        }));
        throw error;
      }
    },

    async templatePreview(body) {
      const requestBody = ensureRouteObject(body, "Invalid templatePreview request body");
      const payload = ensureRouteObject(requestBody.payload || {}, "templatePreview payload must be an object");
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

    async historyList(body, requestContext) {
      const requestBody = ensureRouteObject(body || {}, "Invalid historyList request body");
      return historyService.list(requestBody, requestContext);
    },

    async historyGetById(body, requestContext) {
      const requestBody = ensureRouteObject(body || {}, "Invalid historyGetById request body");
      return historyService.getById(requestBody, requestContext);
    },

    async historySave(body, requestContext) {
      const requestBody = ensureRouteObject(body || {}, "Invalid historySave request body");
      return historyService.save(requestBody, requestContext);
    },

    async historyAssetSave(body) {
      const requestBody = ensureRouteObject(body || {}, "Invalid historyAssetSave request body");
      return historyAssetService.save(requestBody);
    },

    async historyAssetGet(payload) {
      const requestBody = ensureRouteObject(payload || {}, "Invalid historyAssetGet request");
      return historyAssetService.get(requestBody.id);
    },

    async billingSummary(body, requestContext) {
      ensureRouteObject(body || {}, "Invalid billingSummary request body");
      return billingService.getBillingSummary(requestContext);
    },

    async redeemPromo(body, requestContext) {
      const requestBody = ensureRouteObject(body || {}, "Invalid redeemPromo request body");
      return billingService.redeemPromoCode(requestContext, requestBody.code);
    },

    async aiLogs(body) {
      const requestBody = ensureRouteObject(body || {}, "Invalid aiLogs request body");
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
