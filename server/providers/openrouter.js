"use strict";

const { HttpClientError, requestJson } = require("../http-client");
const { toText, extractJsonObject, clamp, buildPreviewDataUri } = require("../utils");

class OpenRouterProviderError extends Error {
  /**
   * @param {{
   *   message: string,
   *   status?: number,
   *   code?: string,
   *   retryable?: boolean,
   *   details?: unknown,
   *   cause?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "OpenRouter provider error"));
    this.name = "OpenRouterProviderError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "openrouter_provider_error";
    this.retryable = Boolean(params?.retryable);
    this.details = params?.details;
    this.cause = params?.cause;
  }
}

const extractMessageText = (response) => {
  const content = response?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .map((item) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      if (typeof item?.text === "string") return item.text;
      return "";
    })
    .join("\n")
    .trim();
};

const buildCreateGenerateUserText = (payload) => {
  const description = toText(payload?.description) || "(empty)";
  const highlights = toText(payload?.highlights) || "(empty)";
  const marketplace = toText(payload?.marketplace) || "unknown";
  const cardsCount = clamp(payload?.cardsCount, 1, 5, 1);
  const prompt = toText(payload?.prompt) || "(empty)";
  const category = toText(payload?.insight?.category) || "(unknown)";
  const style = toText(payload?.insight?.recommendedStyle) || "(unknown)";
  const accent = toText(payload?.insight?.conversionAccent) || "(unknown)";
  const format = toText(payload?.insight?.marketplaceFormat) || "(unknown)";

  return [
    "Task: create conversion-focused generation variants for marketplace card.",
    "Return strict JSON only with this structure:",
    "{",
    '  "variants": [',
    '    { "title": string, "style": string, "focus": string, "format": string, "changes": string }',
    "  ]",
    "}",
    "Rules:",
    "- variants length should be at least requested count",
    "- title/style/focus/format/changes must be concise",
    "- no markdown",
    "",
    "Input:",
    "- description: " + description,
    "- highlights: " + highlights,
    "- marketplace: " + marketplace,
    "- cardsCount: " + String(cardsCount),
    "- prompt: " + prompt,
    "- insight.category: " + category,
    "- insight.recommendedStyle: " + style,
    "- insight.conversionAccent: " + accent,
    "- insight.marketplaceFormat: " + format,
  ].join("\n");
};

const buildImproveGenerateUserText = (payload) => {
  const mode = toText(payload?.mode) || "ai";
  const variantsCount = clamp(payload?.variantsCount, 1, 5, 1);
  const prompt = toText(payload?.prompt) || "(empty)";
  const summary = toText(payload?.analysis?.summary) || "(empty)";
  const recommendations = Array.isArray(payload?.analysis?.recommendations)
    ? payload.analysis.recommendations.map((item) => toText(item)).filter(Boolean).slice(0, 3)
    : [];
  const referenceStyle = Boolean(payload?.referenceStyle);

  return [
    "Task: build improved marketplace card variants.",
    "Return strict JSON only with this structure:",
    "{",
    '  "variants": [',
    '    { "title": string, "strategy": string, "styleLabel": string, "changes": string, "format": string }',
    "  ]",
    "}",
    "Rules:",
    "- variants length should be at least requested count",
    "- strategy and changes must explain improvement direction briefly",
    "- styleLabel should be empty string when reference style is inactive",
    "- no markdown",
    "",
    "Input:",
    "- mode: " + mode,
    "- referenceStyle: " + String(referenceStyle),
    "- variantsCount: " + String(variantsCount),
    "- prompt: " + prompt,
    "- analysis.summary: " + summary,
    "- analysis.recommendations: " + (recommendations.length ? recommendations.join(" | ") : "(none)"),
  ].join("\n");
};

const normalizeVariantList = (parsed) => {
  if (Array.isArray(parsed?.variants)) return parsed.variants;
  if (Array.isArray(parsed?.results)) return parsed.results;
  if (Array.isArray(parsed?.items)) return parsed.items;
  return [];
};

const resolvePreviewCandidates = (payload, mode) => {
  if (mode === "improve") {
    return [
      toText(payload?.sourcePreviewUrl),
      toText(payload?.referencePreviewUrl),
    ].filter(Boolean);
  }

  return [
    ...(Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls : []),
    ...(Array.isArray(payload?.imagePreviewUrls) ? payload.imagePreviewUrls : []),
  ]
    .map((item) => toText(item))
    .filter(Boolean);
};

const createOpenRouterProvider = (config) => {
  const endpoint = String(config?.baseUrl || "").replace(/\/+$/, "") + "/chat/completions";
  const model = toText(config?.model) || "openrouter/auto";
  const apiKey = toText(config?.apiKey);
  const referer = toText(config?.referer) || "http://localhost:2020";
  const title = toText(config?.title) || "KARTOCHKA";
  const timeoutMs = clamp(config?.timeoutMs, 1000, 120000, 60000);

  const callChatJson = async (messages) => {
    if (!apiKey) {
      throw new OpenRouterProviderError({
        status: 500,
        code: "openrouter_missing_key",
        message: "OPENROUTER_API_KEY is not configured",
      });
    }

    let response;
    try {
      response = await requestJson({
        url: endpoint,
        method: "POST",
        timeoutMs,
        headers: {
          Authorization: "Bearer " + apiKey,
          "HTTP-Referer": referer,
          "X-Title": title,
        },
        body: {
          model,
          temperature: 0.45,
          response_format: { type: "json_object" },
          messages,
        },
      });
    } catch (error) {
      if (error instanceof HttpClientError) {
        throw new OpenRouterProviderError({
          status: error.status || 502,
          code: error.code || "openrouter_upstream_error",
          message: "OpenRouter request failed",
          retryable: error.retryable,
          details: error.details,
          cause: error,
        });
      }

      throw new OpenRouterProviderError({
        status: 502,
        code: "openrouter_request_failed",
        message: "OpenRouter request failed",
        cause: error,
      });
    }

    const assistantText = extractMessageText(response);
    const parsed = extractJsonObject(assistantText);
    if (!parsed) {
      throw new OpenRouterProviderError({
        status: 502,
        code: "openrouter_invalid_json",
        message: "OpenRouter response did not contain valid JSON",
        details: {
          outputSample: String(assistantText || "").slice(0, 500),
        },
      });
    }

    return parsed;
  };

  const createGenerate = async (payload) => {
    const variantsCount = clamp(payload?.cardsCount, 1, 5, 1);
    const parsed = await callChatJson([
      {
        role: "system",
        content: "You are a generation planner for marketplace product cards. Return only strict JSON.",
      },
      {
        role: "user",
        content: buildCreateGenerateUserText(payload),
      },
    ]);

    const rawVariants = normalizeVariantList(parsed);
    const previewCandidates = resolvePreviewCandidates(payload, "create");
    const marketplace = toText(payload?.marketplace) || "Marketplace";
    const promptPreview = toText(payload?.prompt).slice(0, 240);

    return Array.from({ length: variantsCount }, (_, index) => {
      const variantNumber = index + 1;
      const source = rawVariants[index] || rawVariants[index % Math.max(rawVariants.length, 1)] || {};
      const title = toText(source?.title) || "Variant " + String(variantNumber);

      const previewUrl = previewCandidates[index % Math.max(previewCandidates.length, 1)]
        || buildPreviewDataUri(title, marketplace);

      return {
        id: "result-" + String(Date.now()) + "-" + String(variantNumber),
        variantNumber,
        totalVariants: variantsCount,
        previewUrl,
        title,
        marketplace,
        style: toText(source?.style) || toText(payload?.insight?.recommendedStyle),
        focus: toText(source?.focus) || toText(payload?.insight?.conversionAccent),
        format: toText(source?.format) || toText(payload?.insight?.marketplaceFormat),
        changes: toText(source?.changes),
        promptPreview,
        downloadName: "kartochka-variant-" + String(variantNumber) + ".png",
      };
    });
  };

  const improveGenerate = async (payload) => {
    const variantsCount = clamp(payload?.variantsCount, 1, 5, 1);
    const parsed = await callChatJson([
      {
        role: "system",
        content: "You are an AI designer improving marketplace cards. Return only strict JSON.",
      },
      {
        role: "user",
        content: buildImproveGenerateUserText(payload),
      },
    ]);

    const rawVariants = normalizeVariantList(parsed);
    const previewCandidates = resolvePreviewCandidates(payload, "improve");
    const promptPreview = toText(payload?.prompt).slice(0, 220);
    const referenceStyle = Boolean(payload?.referenceStyle);

    return Array.from({ length: variantsCount }, (_, index) => {
      const variantNumber = index + 1;
      const source = rawVariants[index] || rawVariants[index % Math.max(rawVariants.length, 1)] || {};
      const title = toText(source?.title) || "Improved variant " + String(variantNumber);

      const previewUrl = previewCandidates[index % Math.max(previewCandidates.length, 1)]
        || buildPreviewDataUri(title, referenceStyle ? "Reference style" : "AI improve");

      return {
        id: "improve-result-" + String(Date.now()) + "-" + String(variantNumber),
        variantNumber,
        totalVariants: variantsCount,
        previewUrl,
        title,
        strategy: toText(source?.strategy) || (referenceStyle ? "Reference style improvement" : "Standard AI improvement"),
        styleLabel: toText(source?.styleLabel) || (referenceStyle ? "Improved with reference style" : ""),
        referenceStyle,
        changes:
          toText(source?.changes)
          || toText(payload?.analysis?.recommendations?.[0])
          || "Improved hierarchy and stronger conversion focus.",
        format:
          toText(source?.format)
          || toText(payload?.analysis?.marketplaceFormat)
          || "Marketplace-ready format with clean CTA.",
        promptPreview,
        downloadName: "kartochka-improved-" + String(variantNumber) + ".png",
      };
    });
  };

  return {
    createGenerate,
    improveGenerate,
  };
};

module.exports = {
  OpenRouterProviderError,
  createOpenRouterProvider,
};
