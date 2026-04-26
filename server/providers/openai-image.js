"use strict";

const { HttpClientError, requestJson } = require("../http-client");
const { toText } = require("../utils");
const { buildCreateGenerationIntent, buildOpenAIImagePrompt, hashText } = require("../services/generation-intent");
const {
  buildDirectImprovePrompt,
  DEFAULT_IMPROVE_INSTRUCTION_PATH,
} = require("../services/enhance-card-prompt-service");

const PROVIDER_ID = "openai_gpt_image_2";
const PROVIDER_LABEL = "GPT Image 2";
const DEFAULT_MODEL = "gpt-image-2";
const DEFAULT_QUALITY = "high";
const DEFAULT_SIZE = "1024x1536";
const DEFAULT_RESPONSE_MODEL = "gpt-5.4";
const DEFAULT_RESPONSE_REASONING_EFFORT = "medium";
const SUPPORTED_QUALITIES = new Set(["low", "medium", "high", "auto"]);
const SUPPORTED_INPUT_DETAILS = new Set(["low", "high", "auto"]);

class OpenAIImageProviderError extends Error {
  constructor(params) {
    super(String(params?.message || "OpenAI image provider error"));
    this.name = "OpenAIImageProviderError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "openai_image_provider_error";
    this.retryable = Boolean(params?.retryable);
    this.details = params?.details;
    this.cause = params?.cause;
  }
}

const normalizeQuality = (value) => {
  const quality = toText(value).toLowerCase();
  return SUPPORTED_QUALITIES.has(quality) ? quality : DEFAULT_QUALITY;
};

const normalizeSize = (value) => {
  const size = toText(value).toLowerCase();
  if (size === "auto") return "auto";
  return /^\d{3,5}x\d{3,5}$/.test(size) ? size : DEFAULT_SIZE;
};

const normalizeInputDetail = (value) => {
  const detail = toText(value).toLowerCase();
  return SUPPORTED_INPUT_DETAILS.has(detail) ? detail : "low";
};

const toDataImageUrl = (value, mimeType) => {
  const raw = toText(value);
  if (!raw) return "";
  if (/^data:image\//i.test(raw)) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 256) {
    return "data:" + (toText(mimeType) || "image/png") + ";base64," + raw;
  }
  return raw;
};

const collectImageUrls = (value, output) => {
  if (!value) return;
  if (typeof value === "string") {
    const imageUrl = toDataImageUrl(value);
    if (imageUrl && (/^data:image\//i.test(imageUrl) || /^https?:\/\//i.test(imageUrl))) {
      output.push(imageUrl);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, output));
    return;
  }

  if (typeof value !== "object") return;

  collectImageUrls(value.b64_json, output);
  collectImageUrls(value.image_base64, output);
  collectImageUrls(value.result, output);
  collectImageUrls(value.url, output);
  collectImageUrls(value.image_url?.url || value.imageUrl?.url, output);
  collectImageUrls(value.data, output);
  collectImageUrls(value.content, output);
  collectImageUrls(value.output, output);
};

const extractImageUrls = (response) => {
  const urls = [];
  collectImageUrls(response?.data, urls);
  collectImageUrls(response?.output, urls);
  collectImageUrls(response?.images, urls);

  const seen = new Set();
  return urls.filter((url) => {
    const safeUrl = toText(url);
    if (!safeUrl || seen.has(safeUrl)) return false;
    seen.add(safeUrl);
    return true;
  });
};

const shouldRetry = (error) => {
  if (error instanceof HttpClientError) return Boolean(error.retryable) || error.status >= 500;
  return true;
};

const wrapHttpError = (error) => {
  if (error instanceof OpenAIImageProviderError) return error;
  if (error instanceof HttpClientError) {
    return new OpenAIImageProviderError({
      status: error.status || 502,
      code: error.code || "openai_image_upstream_error",
      message: "OpenAI image generation request failed",
      retryable: error.retryable,
      details: error.details,
      cause: error,
    });
  }

  return new OpenAIImageProviderError({
    status: 502,
    code: "openai_image_request_failed",
    message: "OpenAI image generation request failed",
    cause: error,
  });
};

const buildResponseInput = (prompt, imageInputs, inputDetail) => {
  const content = [
    {
      type: "input_text",
      text: prompt,
    },
  ];

  imageInputs.slice(0, 3).forEach((imageUrl) => {
    content.push({
      type: "input_image",
      image_url: imageUrl,
      detail: inputDetail,
    });
  });

  return [
    {
      role: "user",
      content,
    },
  ];
};

const normalizeImproveRecommendations = (analysis) => {
  if (!analysis || typeof analysis !== "object" || Array.isArray(analysis)) return [];
  return Array.isArray(analysis.recommendations)
    ? analysis.recommendations.map((item) => toText(item)).filter(Boolean).slice(0, 8)
    : [];
};

const buildImproveGenerationPayload = (payload = {}) => {
  const userPrompt = toText(payload.prompt || payload.userPrompt);
  const analysisSummary = toText(payload.analysis?.summary);
  const adaptive =
    payload.adaptiveImprovement && typeof payload.adaptiveImprovement === "object"
      ? payload.adaptiveImprovement
      : payload.analysis?.adaptiveImprovement && typeof payload.analysis.adaptiveImprovement === "object"
        ? payload.analysis.adaptiveImprovement
        : null;
  const recommendations = normalizeImproveRecommendations(payload.analysis);
  const sourcePreviewUrl = toDataImageUrl(payload.sourcePreviewUrl || payload.imageDataUrl || payload.imageUrl);
  const referencePreviewUrl = toDataImageUrl(payload.referencePreviewUrl || payload.referenceImageDataUrl);
  const directPrompt = buildDirectImprovePrompt({
    instructionPath: toText(payload.improveInstructionPromptPath) || DEFAULT_IMPROVE_INSTRUCTION_PATH,
    userPrompt,
  });
  const promptParts = [
    directPrompt.prompt,
    adaptive ? "Adaptive improvement mode: " + toText(adaptive.mode) : "",
    adaptive ? "Recommended style: " + toText(adaptive.recommendedStyle) : "",
    adaptive && Array.isArray(adaptive.weaknesses) && adaptive.weaknesses.length
      ? "Weaknesses to fix: " + adaptive.weaknesses.map((item) => toText(item)).filter(Boolean).join("; ")
      : "",
    analysisSummary ? "Analysis summary: " + analysisSummary : "",
    recommendations.length ? "Recommendations:\n" + recommendations.join("\n") : "",
  ].filter(Boolean);

  return {
    requestId: toText(payload.requestId),
    title: toText(payload.title || payload.sourceCard?.title) || "Improved card",
    description: "Improve the existing product card while preserving product identity.",
    prompt: promptParts.join("\n\n"),
    productType: toText(payload.productType || payload.sourceCard?.productType),
    productAngle: toText(payload.productAngle || payload.sourceCard?.productAngle),
    marketplace: toText(payload.marketplace || payload.sourceCard?.marketplace),
    imageDataUrls: [sourcePreviewUrl, referencePreviewUrl].filter(Boolean),
    referencePreviewUrl: "",
    cardsCount: 1,
    debugMode: Boolean(payload.debugMode),
    requestTimeoutMs: Number(payload.requestTimeoutMs) || 0,
    inputDetail: toText(payload.inputDetail),
    __improvePromptDebug: directPrompt.debug,
  };
};

const isInstructionTemplatePromptMode = (payload = {}) => {
  const reference = payload.reference || payload.selectedTemplate || {};
  return toText(reference?.kind) === "instruction-template"
    && toText(reference?.promptFlow) === "gpt_instruction"
    && Boolean(toText(payload.prompt));
};

const createOpenAIImageProvider = (config = {}) => {
  const enabled = config.enabled !== false;
  const apiKey = toText(config.apiKey);
  const baseUrl = (toText(config.baseUrl) || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = toText(config.model) || DEFAULT_MODEL;
  const responseModel = toText(config.responseModel) || DEFAULT_RESPONSE_MODEL;
  const responseReasoningEffort = toText(config.responseReasoningEffort) || DEFAULT_RESPONSE_REASONING_EFFORT;
  const quality = normalizeQuality(config.quality);
  const size = normalizeSize(config.size);
  const timeoutMs = Math.max(1000, Number(config.timeoutMs) || 300000);
  const improveTimeoutMs = Math.max(1000, Number(config.improveTimeoutMs) || timeoutMs);
  const inputDetail = normalizeInputDetail(config.inputDetail);
  const improveInputDetail = normalizeInputDetail(config.improveInputDetail || config.inputDetail);
  const maxRetries = Math.max(0, Math.min(3, Math.floor(Number(config.maxRetries) || 0)));
  const transport = typeof config.requestJson === "function" ? config.requestJson : requestJson;

  const callWithRetry = async (params) => {
    const maxAttempts = Math.max(0, Math.min(3, Math.floor(Number(params?.maxRetries))));
    const allowedRetries = Number.isFinite(maxAttempts) ? maxAttempts : maxRetries;
    let attempt = 0;
    let lastError = null;

    while (attempt <= allowedRetries) {
      try {
        return await transport(params);
      } catch (error) {
        const wrapped = wrapHttpError(error);
        lastError = wrapped;
        if (attempt >= allowedRetries || !shouldRetry(error)) break;
        console.warn("[openai_image] retry", {
          requestId: toText(params?.requestId),
          attempt: attempt + 1,
          code: toText(wrapped.code),
          status: Number(wrapped.status) || 0,
        });
      }
      attempt += 1;
    }

    throw lastError;
  };

  const callImageApi = async ({
    prompt,
    imageInputs,
    requestId,
    requestTimeoutMs,
    requestInputDetail,
    requestMaxRetries,
    requestSize,
    requestQuality,
    requestResponseModel,
    requestResponseReasoningEffort,
  }) => {
    const commonHeaders = {
      Authorization: "Bearer " + apiKey,
    };
    const resolvedTimeoutMs = Math.max(1000, Number(requestTimeoutMs) || timeoutMs);
    const resolvedInputDetail = normalizeInputDetail(requestInputDetail || inputDetail);
    const resolvedSize = normalizeSize(requestSize || size);
    const resolvedQuality = normalizeQuality(requestQuality || quality);
    const resolvedResponseModel = toText(requestResponseModel) || responseModel;
    const resolvedResponseReasoningEffort = toText(requestResponseReasoningEffort) || responseReasoningEffort;

    if (imageInputs.length) {
      return callWithRetry({
        requestId,
        maxRetries: requestMaxRetries,
        url: baseUrl + "/responses",
        method: "POST",
        timeoutMs: resolvedTimeoutMs,
        headers: commonHeaders,
        body: {
          model: resolvedResponseModel,
          reasoning: resolvedResponseReasoningEffort ? { effort: resolvedResponseReasoningEffort } : undefined,
          input: buildResponseInput(prompt, imageInputs, resolvedInputDetail),
          tools: [
            {
              type: "image_generation",
              model,
              quality: resolvedQuality,
              size: resolvedSize,
            },
          ],
          tool_choice: "required",
        },
      });
    }

    return callWithRetry({
      requestId,
      maxRetries: requestMaxRetries,
      url: baseUrl + "/images/generations",
      method: "POST",
      timeoutMs: resolvedTimeoutMs,
      headers: commonHeaders,
      body: {
        model,
        prompt,
        quality: resolvedQuality,
        size: resolvedSize,
        n: 1,
      },
    });
  };

  const createGenerate = async (payload = {}) => {
    const requestId = toText(payload.requestId);
    const startedAt = Date.now();
    const intent = buildCreateGenerationIntent(payload);
    const prompt = isInstructionTemplatePromptMode(payload)
      ? toText(payload.prompt)
      : buildOpenAIImagePrompt(intent);
    const imageInputs = intent.imageInputs.filter(Boolean);
    const requestTimeoutMs = Math.max(1000, Number(payload.requestTimeoutMs) || timeoutMs);
    const requestInputDetail = normalizeInputDetail(payload.inputDetail || inputDetail);
    const requestSize = normalizeSize(payload.size || size);
    const requestQuality = normalizeQuality(payload.quality || quality);
    const requestResponseModel = toText(payload.responseModel);
    const requestResponseReasoningEffort = toText(payload.responseReasoningEffort);
    const parsedRequestMaxRetries = Number(payload.maxRetries);
    const requestMaxRetries = Number.isFinite(parsedRequestMaxRetries)
      ? Math.max(0, Math.min(3, Math.floor(parsedRequestMaxRetries)))
      : maxRetries;

    console.info("[openai_image] generation_started", {
      requestId,
      enabled,
      provider: PROVIDER_ID,
      model,
      quality: requestQuality,
      size: requestSize,
      timeoutMs: requestTimeoutMs,
      inputDetail: requestInputDetail,
      maxRetries: requestMaxRetries,
      responseModel: imageInputs.length ? (requestResponseModel || responseModel) : "",
      responseReasoningEffort: imageInputs.length ? (requestResponseReasoningEffort || responseReasoningEffort) : "",
      imageCount: imageInputs.length,
    });

    if (!enabled) {
      throw new OpenAIImageProviderError({
        status: 503,
        code: "openai_image_disabled",
        message: "OpenAI image generation is disabled",
      });
    }

    if (!apiKey) {
      throw new OpenAIImageProviderError({
        status: 500,
        code: "openai_missing_key",
        message: "OPENAI_API_KEY is not configured",
      });
    }

    const response = await callImageApi({
      prompt,
      imageInputs,
      requestId,
      requestTimeoutMs,
      requestInputDetail,
      requestMaxRetries,
      requestSize,
      requestQuality,
      requestResponseModel,
      requestResponseReasoningEffort,
    });
    const imageUrls = extractImageUrls(response);

    if (!imageUrls.length) {
      throw new OpenAIImageProviderError({
        status: 502,
        code: "openai_image_missing_output",
        message: "OpenAI image generation returned no image",
        details: {
          responseKeys: response && typeof response === "object" ? Object.keys(response).slice(0, 12) : [],
        },
      });
    }

    const durationMs = Date.now() - startedAt;
    console.info("[openai_image] generation_result_received", {
      requestId,
      provider: PROVIDER_ID,
      durationMs,
      imageCount: imageUrls.length,
    });

    return [
      {
        id: PROVIDER_ID + "-" + String(Date.now()),
        provider: PROVIDER_ID,
        providerLabel: PROVIDER_LABEL,
        status: "completed",
        variantNumber: 1,
        totalVariants: 1,
        previewUrl: imageUrls[0],
        title: "GPT Image 2",
        marketplace: intent.marketplace,
        style: "OpenAI GPT Image 2",
        focus: intent.productAngle || intent.highlights || intent.productType,
        format: requestSize + " px, 3:4",
        promptPreview: prompt.slice(0, 240),
        normalizedPrompt: prompt,
        downloadName: "kartochka-gpt-image-2-1200x1600.png",
        requestId,
        generationId: requestId,
        durationMs,
        metadata: {
          model,
          responseModel: imageInputs.length ? (requestResponseModel || responseModel) : "",
          responseReasoningEffort: imageInputs.length ? (requestResponseReasoningEffort || responseReasoningEffort) : "",
          quality: requestQuality,
          size: requestSize,
          imageCount: imageInputs.length,
          promptHash: hashText(prompt),
        },
        __debug: payload.debugMode
          ? {
            flow: "create_generate_openai_image",
            imageModel: model,
            responseModel: imageInputs.length ? (requestResponseModel || responseModel) : "",
            responseReasoningEffort: imageInputs.length ? (requestResponseReasoningEffort || responseReasoningEffort) : "",
            promptHash: hashText(prompt),
            imageCount: imageInputs.length,
            requestText: prompt,
            responseText: "[image output]",
          }
          : undefined,
      },
    ];
  };

  const improveGenerate = async (payload = {}) => {
    const results = await createGenerate({
      ...buildImproveGenerationPayload(payload),
      requestTimeoutMs: Math.max(1000, Number(payload.requestTimeoutMs) || improveTimeoutMs),
      inputDetail: payload.inputDetail || improveInputDetail,
      size: payload.size || DEFAULT_SIZE,
      quality: payload.quality || DEFAULT_QUALITY,
    });
    return results.map((result) => ({
      ...result,
      title: "GPT Image 2 Improve",
      style: "OpenAI GPT Image 2 improve",
      referenceStyle: Boolean(payload?.referenceStyle),
      metadata: {
        ...(result.metadata || {}),
        flow: "improve_generate_openai_image",
      },
      __debug: result.__debug
        ? {
          ...result.__debug,
          flow: "improve_generate_openai_image",
        }
      : undefined,
    }));
  };

  const directImageGenerate = async (payload = {}) => {
    const requestId = toText(payload.requestId);
    const startedAt = Date.now();
    const prompt = toText(payload.prompt || payload.normalizedPrompt);
    const imageInputs = Array.isArray(payload.imageDataUrls)
      ? payload.imageDataUrls.map((item) => toDataImageUrl(item)).filter(Boolean)
      : [];
    const requestTimeoutMs = Math.max(1000, Number(payload.requestTimeoutMs) || timeoutMs);
    const requestInputDetail = normalizeInputDetail(payload.inputDetail || inputDetail);
    const requestSize = normalizeSize(payload.size || size);
    const requestQuality = normalizeQuality(payload.quality || quality);
    const requestResponseModel = toText(payload.responseModel);
    const requestResponseReasoningEffort = toText(payload.responseReasoningEffort);
    const parsedRequestMaxRetries = Number(payload.maxRetries);
    const requestMaxRetries = Number.isFinite(parsedRequestMaxRetries)
      ? Math.max(0, Math.min(3, Math.floor(parsedRequestMaxRetries)))
      : maxRetries;

    console.info("[openai_image] direct_generation_started", {
      requestId,
      enabled,
      provider: PROVIDER_ID,
      model,
      quality: requestQuality,
      size: requestSize,
      timeoutMs: requestTimeoutMs,
      inputDetail: requestInputDetail,
      maxRetries: requestMaxRetries,
      responseModel: imageInputs.length ? (requestResponseModel || responseModel) : "",
      responseReasoningEffort: imageInputs.length ? (requestResponseReasoningEffort || responseReasoningEffort) : "",
      imageCount: imageInputs.length,
    });

    if (!enabled) {
      throw new OpenAIImageProviderError({
        status: 503,
        code: "openai_image_disabled",
        message: "OpenAI image generation is disabled",
      });
    }

    if (!apiKey) {
      throw new OpenAIImageProviderError({
        status: 500,
        code: "openai_missing_key",
        message: "OPENAI_API_KEY is not configured",
      });
    }

    if (!prompt) {
      throw new OpenAIImageProviderError({
        status: 400,
        code: "missing_image_prompt",
        message: "Image generation prompt is required",
      });
    }

    const response = await callImageApi({
      prompt,
      imageInputs,
      requestId,
      requestTimeoutMs,
      requestInputDetail,
      requestMaxRetries,
      requestSize,
      requestQuality,
      requestResponseModel,
      requestResponseReasoningEffort,
    });
    const imageUrls = extractImageUrls(response);

    if (!imageUrls.length) {
      throw new OpenAIImageProviderError({
        status: 502,
        code: "openai_image_missing_output",
        message: "OpenAI image generation returned no image",
        details: {
          responseKeys: response && typeof response === "object" ? Object.keys(response).slice(0, 12) : [],
        },
      });
    }

    const durationMs = Date.now() - startedAt;
    console.info("[openai_image] direct_generation_result_received", {
      requestId,
      provider: PROVIDER_ID,
      durationMs,
      imageCount: imageUrls.length,
    });

    return [
      {
        id: PROVIDER_ID + "-direct-" + String(Date.now()),
        provider: PROVIDER_ID,
        providerLabel: PROVIDER_LABEL,
        status: "completed",
        variantNumber: 1,
        totalVariants: 1,
        previewUrl: imageUrls[0],
        title: toText(payload.title) || "GPT Image 2",
        marketplace: toText(payload.marketplace),
        style: "OpenAI GPT Image 2",
        focus: toText(payload.focus),
        format: requestSize + " px, 3:4",
        promptPreview: prompt.slice(0, 240),
        normalizedPrompt: prompt,
        downloadName: toText(payload.downloadName) || "kartochka-gpt-image-2.png",
        requestId,
        generationId: requestId,
        durationMs,
        metadata: {
          model,
          responseModel: imageInputs.length ? (requestResponseModel || responseModel) : "",
          responseReasoningEffort: imageInputs.length ? (requestResponseReasoningEffort || responseReasoningEffort) : "",
          quality: requestQuality,
          size: requestSize,
          imageCount: imageInputs.length,
          promptHash: hashText(prompt),
          flow: toText(payload.flow) || "direct_openai_image",
        },
        __debug: payload.debugMode
          ? {
            flow: toText(payload.flow) || "direct_openai_image",
            imageModel: model,
            responseModel: imageInputs.length ? (requestResponseModel || responseModel) : "",
            responseReasoningEffort: imageInputs.length ? (requestResponseReasoningEffort || responseReasoningEffort) : "",
            promptHash: hashText(prompt),
            imageCount: imageInputs.length,
            requestText: prompt,
            responseText: "[image output]",
          }
          : undefined,
      },
    ];
  };

  return {
    createGenerate,
    improveGenerate,
    directImageGenerate,
  };
};

module.exports = {
  OpenAIImageProviderError,
  createOpenAIImageProvider,
  PROVIDER_ID,
  PROVIDER_LABEL,
};
