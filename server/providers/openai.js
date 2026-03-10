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
  const description = toText(payload?.description) || "(пусто)";
  const highlights = toText(payload?.highlights) || "(пусто)";
  const marketplace = toText(payload?.marketplace) || "не указан";
  const cardsCount = clamp(payload?.cardsCount, 1, 5, 1);
  const promptMode = toText(payload?.promptMode) || "ai";
  const customPrompt = toText(payload?.prompt) || toText(payload?.customPrompt) || "";

  return [
    "Задача: проанализировать входные данные товара для генерации карточки маркетплейса.",
    "Верни только валидный JSON со следующими полями:",
    "{",
    '  "detectedCategory": string,',
    '  "insight": { "category": string, "recommendedStyle": string, "conversionAccent": string, "conversionAngle": string, "marketplaceFormat": string },',
    '  "headlineIdeas": string[],',
    '  "prompt": string',
    "}",
    "Требования:",
    "- все строковые поля должны быть только на русском языке",
    "- category должна быть конкретной для карточки маркетплейса",
    "- recommendedStyle должен быть прикладным и кратким",
    "- conversionAccent и conversionAngle должны работать на конверсию продавца",
    "- headlineIdeas должны содержать 3-5 коротких вариантов",
    "- marketplaceFormat должен соответствовать особенностям маркетплейса",
    "- prompt должен быть готов для продакшен-генерации карточки и изображения",
    "",
    "Входные данные:",
    "- description: " + description,
    "- highlights: " + highlights,
    "- marketplace: " + marketplace,
    "- cardsCount: " + String(cardsCount),
    "- promptMode: " + promptMode,
    "- customPrompt: " + (customPrompt || "(нет)"),
  ].join("\n");
};

const buildImproveAnalyzeUserText = (payload) => {
  const mode = toText(payload?.mode) || "ai";
  const prompt = toText(payload?.prompt) || "(пусто)";
  const variantsCount = clamp(payload?.variantsCount, 1, 5, 1);
  const hasReference = Boolean(payload?.referenceCard || payload?.referencePreviewUrl);
  const hasSource = Boolean(payload?.sourceCard || payload?.sourcePreviewUrl);

  return [
    "Задача: проанализировать слабые места текущей карточки маркетплейса перед улучшением.",
    "Верни только валидный JSON со следующими полями:",
    "{",
    '  "score": number,',
    '  "summary": string,',
    '  "issues": [{ "key": string, "title": string, "severity": "high"|"medium"|"low", "note": string }],',
    '  "recommendations": string[],',
    '  "marketplaceFormat": string,',
    '  "reference": { "uploaded": boolean, "active": boolean, "note": string }',
    "}",
    "Правила:",
    "- используй ровно следующие issue keys: design, readability, composition, accent, cta, overload, categoryFit",
    "- score должен быть в диапазоне 0..100",
    "- recommendations должны содержать 2-4 коротких действия",
    "",
    "Входные данные:",
    "- mode: " + mode,
    "- prompt: " + prompt,
    "- variantsCount: " + String(variantsCount),
    "- sourceUploaded: " + String(hasSource),
    "- referenceUploaded: " + String(hasReference),
  ].join("\n");
};

const normalizeCreateAnalyzeResult = (parsed, payload) => {
  const fallbackCategory = "Товар для маркетплейса";
  const detectedCategory = toText(parsed?.detectedCategory || parsed?.insight?.category) || fallbackCategory;

  const insight = {
    category: toText(parsed?.insight?.category) || detectedCategory,
    recommendedStyle:
      toText(parsed?.insight?.recommendedStyle) || "Чистая иерархия, один сильный блок ценности, читаемая мобильная типографика",
    conversionAccent:
      toText(parsed?.insight?.conversionAccent) || "Подсветить главную выгоду и ясный CTA в первом экране",
    conversionAngle:
      toText(parsed?.insight?.conversionAngle)
      || toText(parsed?.insight?.conversionAccent)
      || "Подсветить главную выгоду и ясный CTA в первом экране",
    marketplaceFormat:
      toText(parsed?.insight?.marketplaceFormat) || "Первый экран + преимущества + CTA с безопасной читаемостью для маркетплейса",
  };
  const headlineIdeas = Array.isArray(parsed?.headlineIdeas)
    ? parsed.headlineIdeas.map((item) => toText(item)).filter(Boolean).slice(0, 5)
    : [];

  const prompt = toText(parsed?.prompt) || [
    "Создай готовую карточку товара для маркетплейса.",
    "Категория: " + insight.category + ".",
    "Стиль: " + insight.recommendedStyle + ".",
    "Конверсионный акцент: " + insight.conversionAccent + ".",
    "Формат: " + insight.marketplaceFormat + ".",
    "Описание товара: " + (toText(payload?.description) || "(не указано)") + ".",
    "Акценты: " + (toText(payload?.highlights) || "(не указаны)") + ".",
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
    { key: "design", title: "Слабые стороны дизайна", severity: "high", note: "Визуальная иерархия выглядит несобранно." },
    { key: "readability", title: "Читаемость", severity: "medium", note: "Главное сообщение считывается недостаточно быстро." },
    { key: "composition", title: "Композиция", severity: "medium", note: "Ключевые блоки конкурируют за внимание." },
    { key: "accent", title: "Слабый акцент", severity: "high", note: "Главная ценность товара не доминирует." },
    { key: "cta", title: "Слабый CTA", severity: "high", note: "CTA сформулирован недостаточно явно." },
    { key: "overload", title: "Перегруз", severity: "medium", note: "Слишком много второстепенных деталей." },
    { key: "categoryFit", title: "Соответствие категории", severity: "medium", note: "Категорийные маркеры выражены слабо." },
  ];

  const rawIssues = Array.isArray(parsed?.issues) ? parsed.issues : [];
  const issues = rawIssues.length
    ? rawIssues.map((item, index) => ({
        key: toText(item?.key || fallbackIssues[index]?.key || "issue-" + String(index + 1)),
        title: toText(item?.title || fallbackIssues[index]?.title || "Проблема"),
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
        ? "Анализ завершен с учетом стиля референса."
        : "Анализ завершен: выявлены проблемы конверсии и читаемости."),
    issues,
    recommendations: recommendations.length ? recommendations : [
      "Усилить иерархию первого экрана вокруг одной ключевой выгоды.",
      "Сделать CTA понятнее и заметнее.",
      "Снизить визуальный перегруз во вторичных блоках.",
    ],
    improvementPlan: recommendations.length ? recommendations : [
      "Усилить иерархию первого экрана вокруг одной ключевой выгоды.",
      "Сделать CTA понятнее и заметнее.",
      "Снизить визуальный перегруз во вторичных блоках.",
    ],
    marketplaceFormat:
      toText(parsed?.marketplaceFormat) || "Готовый формат для маркетплейса с чистой иерархией и CTA.",
    reference: {
      uploaded: hasReference,
      active: referenceActive,
      note:
        toText(parsed?.reference?.note) ||
        (referenceActive
          ? "Стиль референса активен."
          : hasReference
            ? "Референс загружен, но активен стандартный режим."
            : "Референс не загружен."),
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
          "Ты AI-ассистент для продавцов маркетплейсов. Возвращай только строгий JSON. Все строковые поля должны быть на русском языке.",
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
          "Ты AI-ревьюер качества карточек маркетплейсов и конверсионного UX. Возвращай только строгий JSON. Все строковые поля должны быть на русском языке.",
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
