"use strict";

const { toText } = require("../utils");

class GenerationServiceError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "Generation service error"));
    this.name = "GenerationServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "generation_service_error";
    this.details = params?.details;
  }
}

const ensureResultList = (value, message) => {
  if (!Array.isArray(value)) {
    throw new GenerationServiceError({
      status: 500,
      code: "invalid_generation_response",
      message: message || "Generation adapter must return an array",
      details: value,
    });
  }
  return value;
};

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const nowIso = () => new Date().toISOString();

const normalizeProviderId = (adapter, fallback) => {
  return toText(adapter?.id) || toText(fallback) || "image_provider";
};

const normalizeProviderLabel = (adapter, fallback) => {
  return toText(adapter?.label) || toText(fallback) || normalizeProviderId(adapter, fallback);
};

const buildGenerationRequestId = (payload) => {
  return toText(payload?.requestId) || "generation-" + String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
};

const isInstructionTemplate = (payload) => {
  const template = payload?.selectedTemplate || payload?.reference;
  return toText(template?.kind) === "instruction-template";
};

const shouldUseBestProductOpenRouterFlow = (payload) => {
  if (!isInstructionTemplate(payload)) return false;
  if (toText(payload?.promptMode).toLowerCase() === "custom") return false;

  const productTypeId = toText(payload?.productTypeId);
  const productAngleId = toText(payload?.productAngleId);
  const productType = toText(payload?.productType).trim().toLowerCase();
  const productAngle = toText(payload?.productAngle).trim().toLowerCase();

  const isGeneralProduct =
    productTypeId === "general_product"
    || productType === "товар";

  const isSupportedAngle =
    productAngleId === "general_product-close"
    || productAngleId === "general_product-far"
    || productAngle === "вблизи"
    || productAngle === "издалека";

  return isGeneralProduct && isSupportedAngle;
};

const normalizeProviderResult = (result, params) => {
  const providerId = normalizeProviderId(params?.adapter, params?.providerId);
  const providerLabel = normalizeProviderLabel(params?.adapter, params?.providerLabel);
  const index = Number.isFinite(Number(params?.index)) ? Number(params.index) : 0;
  const source = isObject(result) ? result : {};
  const status = toText(source.status) || (toText(source.previewUrl || source.url) ? "completed" : "failed");
  const requestId = toText(source.requestId || params?.requestId);
  const generationId = toText(source.generationId) || requestId;

  return {
    ...source,
    id: toText(source.id) || providerId + "-" + String(Date.now()) + "-" + String(index + 1),
    provider: toText(source.provider) || providerId,
    providerLabel: toText(source.providerLabel) || providerLabel,
    status,
    requestId,
    generationId,
    createdAt: toText(source.createdAt) || nowIso(),
    metadata: isObject(source.metadata) ? source.metadata : {},
  };
};

const getErrorStatus = (error) => {
  const status = Number(error?.status);
  return Number.isFinite(status) && status > 0 ? status : 502;
};

const buildProviderFailureResult = (error, params) => {
  const providerId = normalizeProviderId(params?.adapter, params?.providerId);
  const providerLabel = normalizeProviderLabel(params?.adapter, params?.providerLabel);
  const startedAt = Number(params?.startedAt) || Date.now();
  return {
    id: providerId + "-failed-" + String(Date.now()),
    provider: providerId,
    providerLabel,
    status: "failed",
    previewUrl: "",
    title: providerLabel,
    variantNumber: 1,
    totalVariants: 1,
    errorCode: toText(error?.code) || "provider_failed",
    errorMessage: toText(error?.message) || "Image provider failed",
    durationMs: Math.max(0, Date.now() - startedAt),
    requestId: toText(params?.requestId),
    generationId: toText(params?.requestId),
    createdAt: nowIso(),
    metadata: {
      httpStatus: getErrorStatus(error),
      retryable: Boolean(error?.retryable),
    },
  };
};

const executeProviderCreate = async (adapter, payload, params) => {
  const startedAt = Date.now();
  try {
    const rawResults = await adapter.executeCreateGeneration(payload || {});
    const results = ensureResultList(rawResults, normalizeProviderLabel(adapter) + " createGenerate must return an array");
    return {
      provider: normalizeProviderId(adapter, params?.providerId),
      label: normalizeProviderLabel(adapter, params?.providerLabel),
      status: "fulfilled",
      durationMs: Date.now() - startedAt,
      results: results.map((result, index) => normalizeProviderResult(
        {
          ...result,
          durationMs: Number(result?.durationMs) || Date.now() - startedAt,
        },
        {
          adapter,
          index,
          requestId: params?.requestId,
        }
      )),
    };
  } catch (error) {
    return {
      provider: normalizeProviderId(adapter, params?.providerId),
      label: normalizeProviderLabel(adapter, params?.providerLabel),
      status: "rejected",
      durationMs: Date.now() - startedAt,
      error,
      results: [buildProviderFailureResult(error, {
        adapter,
        requestId: params?.requestId,
        startedAt,
      })],
    };
  }
};

const buildMultiProviderResults = (jobs, payload) => {
  const completedResults = jobs.flatMap((job) => job.results || []).filter((result) => {
    return toText(result?.status) !== "failed" && toText(result?.previewUrl || result?.url);
  });

  const failedResults = jobs.flatMap((job) => job.results || []).filter((result) => {
    return toText(result?.status) === "failed";
  });

  if (!completedResults.length) {
    throw new GenerationServiceError({
      status: 502,
      code: "all_generation_providers_failed",
      message: "All image generation providers failed",
      details: {
        requestId: toText(payload?.requestId),
        providers: jobs.map((job) => ({
          provider: job.provider,
          label: job.label,
          status: job.status,
          durationMs: job.durationMs,
          errorCode: toText(job.error?.code),
          errorMessage: toText(job.error?.message),
        })),
      },
    });
  }

  const aggregateStatus = failedResults.length ? "partial_success" : "completed";
  return completedResults.concat(failedResults).map((result) => ({
    ...result,
    aggregateStatus,
    totalProviderResults: completedResults.length + failedResults.length,
  }));
};

const createGenerationService = (deps) => {
  const adapter = deps?.adapter;
  const createAdapter = deps?.createAdapter || adapter;
  const bestProductCreateAdapter = deps?.bestProductCreateAdapter;
  const improveAdapter = deps?.improveAdapter || adapter;
  const secondaryAdapters = Array.isArray(deps?.secondaryAdapters)
    ? deps.secondaryAdapters.filter((item) => item && typeof item.executeCreateGeneration === "function" && item.enabled !== false)
    : [];
  const textReplaceService = deps?.textReplaceService;
  if (!adapter || typeof adapter.executeTemplatePreview !== "function") {
    throw new GenerationServiceError({
      status: 500,
      code: "invalid_adapter",
      message: "Template preview adapter is not configured",
    });
  }
  if (!createAdapter || typeof createAdapter.executeCreateGeneration !== "function") {
    throw new GenerationServiceError({
      status: 500,
      code: "invalid_create_adapter",
      message: "Create generation adapter is not configured",
    });
  }
  if (!improveAdapter || typeof improveAdapter.executeImproveGeneration !== "function") {
    throw new GenerationServiceError({
      status: 500,
      code: "invalid_improve_adapter",
      message: "Improve generation adapter is not configured",
    });
  }

  return {
    async createGenerate(payload) {
      if (textReplaceService && typeof textReplaceService.isTextReplaceTemplate === "function" && textReplaceService.isTextReplaceTemplate(payload)) {
        if (typeof textReplaceService.createGenerate !== "function") {
          throw new GenerationServiceError({
            status: 500,
            code: "text_replace_not_configured",
            message: "Text replace service is not configured",
          });
        }
        const results = await textReplaceService.createGenerate(payload || {});
        return ensureResultList(results, "textReplace createGenerate must return an array");
      }

      const resolvedCreateAdapter = shouldUseBestProductOpenRouterFlow(payload || {})
        && bestProductCreateAdapter
        && typeof bestProductCreateAdapter.executeCreateGeneration === "function"
        ? bestProductCreateAdapter
        : createAdapter;

      if (!secondaryAdapters.length) {
        const requestId = buildGenerationRequestId(payload || {});
        const startedAt = Date.now();
        const results = await resolvedCreateAdapter.executeCreateGeneration({ ...(payload || {}), requestId });
        return ensureResultList(results, "createGenerate must return an array").map((result, index) => normalizeProviderResult(
          {
            ...result,
            durationMs: Number(result?.durationMs) || Date.now() - startedAt,
          },
          {
            adapter: resolvedCreateAdapter,
            index,
            requestId,
          }
        ));
      }

      const requestId = buildGenerationRequestId(payload || {});
      console.info("[generation] generation_started", {
        requestId,
        providers: [normalizeProviderId(resolvedCreateAdapter)].concat(secondaryAdapters.map((item) => normalizeProviderId(item))),
      });
      const jobs = await Promise.all([
        executeProviderCreate(resolvedCreateAdapter, { ...(payload || {}), requestId }, { requestId }),
        ...secondaryAdapters.map((secondaryAdapter) =>
          executeProviderCreate(secondaryAdapter, { ...(payload || {}), requestId }, { requestId })
        ),
      ]);

      jobs.forEach((job) => {
        console.info("[generation] " + (job.status === "fulfilled" ? "generation_result_received" : "generation_provider_failed"), {
          requestId,
          provider: job.provider,
          durationMs: job.durationMs,
          resultsCount: Array.isArray(job.results) ? job.results.filter((item) => toText(item?.previewUrl)).length : 0,
          errorCode: toText(job.error?.code),
        });
      });

      return buildMultiProviderResults(jobs, { ...(payload || {}), requestId });
    },
    async improveGenerate(payload) {
      const requestId = buildGenerationRequestId(payload || {});
      const startedAt = Date.now();
      const results = await improveAdapter.executeImproveGeneration({ ...(payload || {}), requestId });
      return ensureResultList(results, "improveGenerate must return an array").map((result, index) => normalizeProviderResult(
        {
          ...result,
          durationMs: Number(result?.durationMs) || Date.now() - startedAt,
        },
        {
          adapter: improveAdapter,
          index,
          requestId,
        }
      ));
    },
    async generateFourMarketplaceCards(payload) {
      if (!createAdapter || typeof createAdapter.executeDirectImageGeneration !== "function") {
        throw new GenerationServiceError({
          status: 500,
          code: "direct_image_generation_not_configured",
          message: "Direct image generation adapter is not configured",
        });
      }

      const requestId = buildGenerationRequestId(payload || {});
      const startedAt = Date.now();
      const results = await createAdapter.executeDirectImageGeneration({
        ...(payload || {}),
        requestId,
        flow: "generate_four_marketplace_cards",
        title: "Four marketplace cards composite",
        downloadName: "composite.png",
      });
      return ensureResultList(results, "generateFourMarketplaceCards must return an array").map((result, index) => normalizeProviderResult(
        {
          ...result,
          durationMs: Number(result?.durationMs) || Date.now() - startedAt,
        },
        {
          adapter: createAdapter,
          index,
          requestId,
        }
      ));
    },
    async generateTemplatePreview(promptText) {
      if (typeof adapter.executeTemplatePreview !== "function") {
        throw new GenerationServiceError({
          status: 500,
          code: "template_preview_not_supported",
          message: "Adapter does not support template preview generation",
        });
      }
      const url = await adapter.executeTemplatePreview(promptText);
      if (!url || typeof url !== "string") {
        throw new GenerationServiceError({
          status: 502,
          code: "template_preview_empty",
          message: "Template preview generation returned no image",
        });
      }
      return url;
    },
  };
};

module.exports = {
  GenerationServiceError,
  createGenerationService,
};
