"use strict";

const { HttpClientError, requestJson } = require("../http-client");
const { toText, extractJsonObject, clamp } = require("../utils");

class OpenAIProviderError extends Error {
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
    super(String(params?.message || "OpenAI provider error"));
    this.name = "OpenAIProviderError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "openai_provider_error";
    this.retryable = Boolean(params?.retryable);
    this.details = params?.details;
    this.cause = params?.cause;
  }
}

const extractMessageText = (response) => {
  const messageContent = response?.choices?.[0]?.message?.content;
  if (typeof messageContent === "string") return messageContent;

  if (Array.isArray(messageContent)) {
    return messageContent
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        if (typeof item?.text === "string") return item.text;
        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
};

const buildCreateAnalyzeUserText = (payload) => {
  const description = toText(payload?.description) || "(empty)";
  const highlights = toText(payload?.highlights) || "(empty)";
  const marketplace = toText(payload?.marketplace) || "unknown";
  const cardsCount = clamp(payload?.cardsCount, 1, 5, 1);
  const promptMode = toText(payload?.promptMode) || "ai";
  const customPrompt = toText(payload?.prompt) || toText(payload?.customPrompt) || "";

  return [
    "Task: analyze product input for marketplace card generation.",
    "Return valid JSON only with fields:",
    "{",
    '  "detectedCategory": string,',
    '  "insight": { "category": string, "recommendedStyle": string, "conversionAccent": string, "conversionAngle": string, "marketplaceFormat": string },',
    '  "headlineIdeas": string[],',
    '  "prompt": string',
    "}",
    "Requirements:",
    "- category must be specific for marketplace listing",
    "- recommendedStyle must be practical and concise",
    "- conversionAccent and conversionAngle must target seller conversion",
    "- headlineIdeas must contain 3-5 concise options",
    "- marketplaceFormat must match marketplace specifics",
    "- prompt must be production-ready for image/card generation",
    "",
    "Input:",
    "- description: " + description,
    "- highlights: " + highlights,
    "- marketplace: " + marketplace,
    "- cardsCount: " + String(cardsCount),
    "- promptMode: " + promptMode,
    "- customPrompt: " + (customPrompt || "(none)"),
  ].join("\n");
};

const buildImproveAnalyzeUserText = (payload) => {
  const mode = toText(payload?.mode) || "ai";
  const prompt = toText(payload?.prompt) || "(empty)";
  const variantsCount = clamp(payload?.variantsCount, 1, 5, 1);
  const hasReference = Boolean(payload?.referenceCard || payload?.referencePreviewUrl);
  const hasSource = Boolean(payload?.sourceCard || payload?.sourcePreviewUrl);

  return [
    "Task: analyze weaknesses of current marketplace card before improvement.",
    "Return valid JSON only with fields:",
    "{",
    '  "score": number,',
    '  "summary": string,',
    '  "issues": [{ "key": string, "title": string, "severity": "high"|"medium"|"low", "note": string }],',
    '  "recommendations": string[],',
    '  "marketplaceFormat": string,',
    '  "reference": { "uploaded": boolean, "active": boolean, "note": string }',
    "}",
    "Rules:",
    "- include exactly these issue keys: design, readability, composition, accent, cta, overload, categoryFit",
    "- score is 0..100",
    "- recommendations must contain 2-4 short actions",
    "",
    "Input:",
    "- mode: " + mode,
    "- prompt: " + prompt,
    "- variantsCount: " + String(variantsCount),
    "- sourceUploaded: " + String(hasSource),
    "- referenceUploaded: " + String(hasReference),
  ].join("\n");
};

const normalizeCreateAnalyzeResult = (parsed, payload) => {
  const fallbackCategory = "General marketplace product";
  const detectedCategory = toText(parsed?.detectedCategory || parsed?.insight?.category) || fallbackCategory;

  const insight = {
    category: toText(parsed?.insight?.category) || detectedCategory,
    recommendedStyle:
      toText(parsed?.insight?.recommendedStyle) || "Clean hierarchy, one strong value block, readable mobile typography",
    conversionAccent:
      toText(parsed?.insight?.conversionAccent) || "Highlight core benefit and clear CTA above the fold",
    conversionAngle:
      toText(parsed?.insight?.conversionAngle)
      || toText(parsed?.insight?.conversionAccent)
      || "Highlight core benefit and clear CTA above the fold",
    marketplaceFormat:
      toText(parsed?.insight?.marketplaceFormat) || "Hero + benefits + CTA with marketplace-safe readability",
  };
  const headlineIdeas = Array.isArray(parsed?.headlineIdeas)
    ? parsed.headlineIdeas.map((item) => toText(item)).filter(Boolean).slice(0, 5)
    : [];

  const prompt = toText(parsed?.prompt) || [
    "Create a marketplace-ready product card.",
    "Category: " + insight.category + ".",
    "Style: " + insight.recommendedStyle + ".",
    "Conversion focus: " + insight.conversionAccent + ".",
    "Format: " + insight.marketplaceFormat + ".",
    "Product description: " + (toText(payload?.description) || "(not provided)") + ".",
    "Highlights: " + (toText(payload?.highlights) || "(not provided)") + ".",
  ].join(" ");

  return {
    detectedCategory,
    insight,
    headlineIdeas,
    prompt,
  };
};

const normalizeImproveAnalyzeResult = (parsed, payload) => {
  const fallbackIssues = [
    { key: "design", title: "Design weaknesses", severity: "high", note: "Visual hierarchy is inconsistent." },
    { key: "readability", title: "Readability", severity: "medium", note: "Main message is not scanned quickly." },
    { key: "composition", title: "Composition", severity: "medium", note: "Key blocks compete for attention." },
    { key: "accent", title: "Weak accent", severity: "high", note: "Primary value is not dominant." },
    { key: "cta", title: "Weak CTA", severity: "high", note: "CTA is not explicit enough." },
    { key: "overload", title: "Overload", severity: "medium", note: "Too many secondary details." },
    { key: "categoryFit", title: "Category fit", severity: "medium", note: "Category markers are weak." },
  ];

  const rawIssues = Array.isArray(parsed?.issues) ? parsed.issues : [];
  const issues = rawIssues.length
    ? rawIssues.map((item, index) => ({
        key: toText(item?.key || fallbackIssues[index]?.key || "issue-" + String(index + 1)),
        title: toText(item?.title || fallbackIssues[index]?.title || "Issue"),
        severity: (() => {
          const value = toText(item?.severity).toLowerCase();
          return value === "high" || value === "medium" || value === "low" ? value : "medium";
        })(),
        note: toText(item?.note || fallbackIssues[index]?.note || ""),
      }))
    : fallbackIssues;

  const recommendations = Array.isArray(parsed?.recommendations)
    ? parsed.recommendations.map((item) => toText(item)).filter(Boolean).slice(0, 4)
    : [];

  const hasReference = Boolean(payload?.referenceCard || payload?.referencePreviewUrl);
  const referenceActive = toText(payload?.mode).toLowerCase() === "reference" && hasReference;

  return {
    score: clamp(parsed?.score, 0, 100, 62),
    summary:
      toText(parsed?.summary) ||
      (referenceActive
        ? "Analysis completed with reference style context."
        : "Analysis completed with conversion and readability weaknesses."),
    issues,
    recommendations: recommendations.length ? recommendations : [
      "Strengthen first-frame hierarchy around one key benefit.",
      "Make CTA clearer and more prominent.",
      "Reduce visual overload in secondary blocks.",
    ],
    improvementPlan: recommendations.length ? recommendations : [
      "Strengthen first-frame hierarchy around one key benefit.",
      "Make CTA clearer and more prominent.",
      "Reduce visual overload in secondary blocks.",
    ],
    marketplaceFormat:
      toText(parsed?.marketplaceFormat) || "Marketplace-ready format with clean hierarchy and CTA.",
    reference: {
      uploaded: hasReference,
      active: referenceActive,
      note:
        toText(parsed?.reference?.note) ||
        (referenceActive
          ? "Reference style is active."
          : hasReference
            ? "Reference uploaded, but standard mode is active."
            : "No reference uploaded."),
    },
  };
};

const createOpenAIProvider = (config) => {
  const endpoint = String(config?.baseUrl || "").replace(/\/+$/, "") + "/chat/completions";
  const model = toText(config?.model) || "gpt-4.1-mini";
  const apiKey = toText(config?.apiKey);
  const timeoutMs = clamp(config?.timeoutMs, 1000, 120000, 45000);

  const callChatJson = async (messages) => {
    if (!apiKey) {
      throw new OpenAIProviderError({
        status: 500,
        code: "openai_missing_key",
        message: "OPENAI_API_KEY is not configured",
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
        },
        body: {
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages,
        },
      });
    } catch (error) {
      if (error instanceof HttpClientError) {
        throw new OpenAIProviderError({
          status: error.status || 502,
          code: error.code || "openai_upstream_error",
          message: "OpenAI request failed",
          retryable: error.retryable,
          details: error.details,
          cause: error,
        });
      }
      throw new OpenAIProviderError({
        status: 502,
        code: "openai_request_failed",
        message: "OpenAI request failed",
        cause: error,
      });
    }

    const assistantText = extractMessageText(response);
    const parsed = extractJsonObject(assistantText);
    if (!parsed) {
      throw new OpenAIProviderError({
        status: 502,
        code: "openai_invalid_json",
        message: "OpenAI response did not contain valid JSON",
        details: {
          outputSample: String(assistantText || "").slice(0, 500),
        },
      });
    }
    return parsed;
  };

  const createAnalyze = async (payload) => {
    const messages = [
      {
        role: "system",
        content:
          "You are an e-commerce AI copilot for marketplace sellers. Return only strict JSON.",
      },
    ];

    const userContent = [
      {
        type: "text",
        text: buildCreateAnalyzeUserText(payload),
      },
    ];

    const imageDataUrls = Array.isArray(payload?.imageDataUrls)
      ? payload.imageDataUrls.filter((value) => toText(value))
      : [];
    for (const imageUrl of imageDataUrls.slice(0, 3)) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
          detail: "low",
        },
      });
    }

    messages.push({
      role: "user",
      content: userContent,
    });

    const parsed = await callChatJson(messages);
    return normalizeCreateAnalyzeResult(parsed, payload);
  };

  const improveAnalyze = async (payload) => {
    const messages = [
      {
        role: "system",
        content:
          "You are an AI reviewer for marketplace card quality and conversion UX. Return only strict JSON.",
      },
    ];

    const userContent = [
      {
        type: "text",
        text: buildImproveAnalyzeUserText(payload),
      },
    ];

    const previewCandidates = [
      toText(payload?.sourcePreviewUrl),
      toText(payload?.referencePreviewUrl),
    ].filter(Boolean);
    for (const imageUrl of previewCandidates.slice(0, 2)) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
          detail: "low",
        },
      });
    }

    messages.push({
      role: "user",
      content: userContent,
    });

    const parsed = await callChatJson(messages);
    return normalizeImproveAnalyzeResult(parsed, payload);
  };

  return {
    createAnalyze,
    improveAnalyze,
  };
};

module.exports = {
  OpenAIProviderError,
  createOpenAIProvider,
};
