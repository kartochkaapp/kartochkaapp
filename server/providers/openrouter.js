"use strict";

const { HttpClientError, requestJson } = require("../http-client");
const { toText, extractJsonObject, clamp } = require("../utils");

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

const toDataImageUrl = (value, mimeType) => {
  const raw = toText(value);
  if (!raw) return "";
  if (raw.startsWith("data:image/")) return raw;

  const mime = toText(mimeType) || "image/png";
  return "data:" + mime + ";base64," + raw;
};

const extractMessageImageUrls = (response) => {
  const message = response?.choices?.[0]?.message;
  const imageUrls = [];
  const seen = new Set();

  const pushUrl = (value, mimeType) => {
    const resolved = toDataImageUrl(value, mimeType) || toText(value);
    if (!resolved || seen.has(resolved)) return;
    seen.add(resolved);
    imageUrls.push(resolved);
  };

  const directImages = Array.isArray(message?.images) ? message.images : [];
  directImages.forEach((item) => {
    if (!item) return;
    if (typeof item === "string") {
      pushUrl(item);
      return;
    }

    pushUrl(item?.imageUrl?.url, item?.imageUrl?.mimeType || item?.imageUrl?.mime_type);
    pushUrl(item?.image_url?.url, item?.image_url?.mime_type || item?.image_url?.mimeType);
    pushUrl(item?.imageUrl, item?.mimeType || item?.mime_type);
    pushUrl(item?.image_url, item?.mime_type || item?.mimeType);
    pushUrl(item?.url, item?.mime_type || item?.mimeType);
    pushUrl(item?.data, item?.mime_type || item?.mimeType);
    pushUrl(item?.b64_json, item?.mime_type || item?.mimeType);
  });

  const content = Array.isArray(message?.content) ? message.content : [];
  content.forEach((item) => {
    if (!item) return;
    pushUrl(item?.imageUrl?.url, item?.imageUrl?.mimeType || item?.imageUrl?.mime_type);
    pushUrl(item?.image_url?.url, item?.image_url?.mime_type || item?.image_url?.mimeType);
    pushUrl(item?.imageUrl, item?.mimeType || item?.mime_type);
    pushUrl(item?.image_url, item?.mime_type || item?.mimeType);
    pushUrl(item?.url, item?.mime_type || item?.mimeType);
    pushUrl(item?.data, item?.mime_type || item?.mimeType);
    pushUrl(item?.b64_json, item?.mime_type || item?.mimeType);
  });

  const assistantText = extractMessageText(response);
  const dataUrlMatches = assistantText.match(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g) || [];
  dataUrlMatches.forEach((item) => pushUrl(item));

  return imageUrls;
};

const buildImageMessageContent = (text, imageUrls) => {
  const content = [];
  const promptText = toText(text);
  if (promptText) {
    content.push({
      type: "text",
      text: promptText,
    });
  }

  const uniqueUrls = Array.isArray(imageUrls)
    ? Array.from(new Set(imageUrls.map((item) => toText(item)).filter(Boolean)))
    : [];

  uniqueUrls.slice(0, 5).forEach((url) => {
    content.push({
      type: "image_url",
      image_url: {
        url,
      },
    });
  });

  return content;
};

const buildCreateGenerateUserText = (payload) => {
  const description = toText(payload?.description) || "(пусто)";
  const highlights = toText(payload?.highlights) || "(пусто)";
  const marketplace = toText(payload?.marketplace) || "не указан";
  const cardsCount = clamp(payload?.cardsCount, 1, 5, 1);
  const prompt = toText(payload?.prompt) || "(пусто)";
  const category = toText(payload?.insight?.category) || "(неизвестно)";
  const style = toText(payload?.insight?.recommendedStyle) || "(неизвестно)";
  const accent = toText(payload?.insight?.conversionAccent) || "(неизвестно)";
  const format = toText(payload?.insight?.marketplaceFormat) || "(неизвестно)";

  return [
    "Задача: придумать варианты генерации карточки товара для маркетплейса с фокусом на конверсию.",
    "Верни только строгий JSON со следующей структурой:",
    "{",
    '  "variants": [',
    '    { "title": string, "style": string, "focus": string, "format": string, "changes": string }',
    "  ]",
    "}",
    "Правила:",
    "- количество вариантов должно быть не меньше запрошенного",
    "- все строковые поля должны быть только на русском языке",
    "- title/style/focus/format/changes должны быть краткими",
    "- без markdown",
    "",
    "Входные данные:",
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
  const prompt = toText(payload?.prompt) || "(пусто)";
  const summary = toText(payload?.analysis?.summary) || "(пусто)";
  const recommendations = Array.isArray(payload?.analysis?.recommendations)
    ? payload.analysis.recommendations.map((item) => toText(item)).filter(Boolean).slice(0, 3)
    : [];
  const referenceStyle = Boolean(payload?.referenceStyle);

  return [
    "Задача: собрать варианты улучшенной карточки для маркетплейса.",
    "Верни только строгий JSON со следующей структурой:",
    "{",
    '  "variants": [',
    '    { "title": string, "strategy": string, "styleLabel": string, "changes": string, "format": string }',
    "  ]",
    "}",
    "Правила:",
    "- количество вариантов должно быть не меньше запрошенного",
    "- все строковые поля должны быть только на русском языке",
    "- strategy и changes должны кратко объяснять направление улучшения",
    "- styleLabel должен быть пустой строкой, когда стиль референса не активен",
    "- без markdown",
    "",
    "Входные данные:",
    "- mode: " + mode,
    "- referenceStyle: " + String(referenceStyle),
    "- variantsCount: " + String(variantsCount),
    "- prompt: " + prompt,
    "- analysis.summary: " + summary,
    "- analysis.recommendations: " + (recommendations.length ? recommendations.join(" | ") : "(нет)"),
  ].join("\n");
};

const buildCreateVariantImagePrompt = (payload, variant, variantNumber) => {
  const marketplace = toText(payload?.marketplace) || "маркетплейс";
  const description = toText(payload?.description) || "товар";
  const highlights = toText(payload?.highlights) || "";
  const prompt = toText(payload?.prompt) || "";
  const style = toText(variant?.style) || toText(payload?.insight?.recommendedStyle) || "чистая композиция под маркетплейс";
  const focus = toText(variant?.focus) || toText(payload?.insight?.conversionAccent) || "ясная ценность товара";
  const format = toText(variant?.format) || toText(payload?.insight?.marketplaceFormat) || "первый экран с преимуществами и CTA";
  const changes = toText(variant?.changes) || "новая композиция карточки";

  return [
    "Сгенерируй ровно одно новое изображение карточки товара для маркетплейса в вертикальном формате 4:5.",
    "Используй приложенные изображения товара как исходный материал, но не возвращай их без изменений.",
    "Собери свежую дизайн-композицию, подходящую продавцу маркетплейса.",
    "Сохрани идентичность товара и ключевые характеристики с исходных изображений.",
    "Добавь визуальную иерархию, продающую структуру и оформление в стиле CTA, подходящее для финальной карточки.",
    "Весь видимый текст на карточке должен быть только на русском языке.",
    "Не добавляй markdown и объяснения. Верни только изображение.",
    "",
    "Вариант: " + String(variantNumber),
    "Маркетплейс: " + marketplace,
    "Описание товара: " + description,
    "Ключевые акценты: " + (highlights || "(нет)"),
    "Направление промпта: " + (prompt || "(нет)"),
    "Планируемый заголовок: " + (toText(variant?.title) || "Вариант " + String(variantNumber)),
    "Планируемый стиль: " + style,
    "Планируемый фокус: " + focus,
    "Планируемый формат: " + format,
    "Планируемые изменения: " + changes,
  ].join("\n");
};

const buildImproveVariantImagePrompt = (payload, variant, variantNumber) => {
  const prompt = toText(payload?.prompt) || "";
  const analysisSummary = toText(payload?.analysis?.summary) || "";
  const recommendation = toText(payload?.analysis?.recommendations?.[0]) || "";
  const referenceStyle = Boolean(payload?.referenceStyle);

  return [
    "Сгенерируй ровно одно улучшенное изображение карточки маркетплейса в вертикальном формате 4:5.",
    "Первое приложенное изображение — исходная карточка для улучшения.",
    referenceStyle ? "Если приложено второе изображение, используй его как стилевой референс." : "Стилевой референс не требуется.",
    "Не возвращай исходную карточку без изменений.",
    "Сохрани тот же товар, но заметно улучши иерархию, читаемость, композицию и ясность CTA.",
    "Весь видимый текст на карточке должен быть только на русском языке.",
    "Верни только изображение.",
    "",
    "Вариант: " + String(variantNumber),
    "Режим: " + (referenceStyle ? "улучшение в стиле референса" : "обычное AI-улучшение"),
    "Комментарий к улучшению: " + (prompt || "(нет)"),
    "Краткий анализ: " + (analysisSummary || "(нет)"),
    "Главная рекомендация: " + (recommendation || "(нет)"),
    "Планируемый заголовок: " + (toText(variant?.title) || "Улучшенный вариант " + String(variantNumber)),
    "Стратегия: " + (toText(variant?.strategy) || (referenceStyle ? "Улучшение в стиле референса" : "Обычное AI-улучшение")),
    "Формат: " + (toText(variant?.format) || toText(payload?.analysis?.marketplaceFormat) || "Готовый формат для маркетплейса с чистым CTA"),
    "Изменения: " + (toText(variant?.changes) || "Улучшить иерархию и конверсионный фокус"),
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

  const callImageGeneration = async (messages) => {
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
          modalities: ["image", "text"],
          image_config: {
            aspect_ratio: "4:5",
          },
          messages,
        },
      });
    } catch (error) {
      if (error instanceof HttpClientError) {
        throw new OpenRouterProviderError({
          status: error.status || 502,
          code: error.code || "openrouter_upstream_error",
          message: "OpenRouter image generation request failed",
          retryable: error.retryable,
          details: error.details,
          cause: error,
        });
      }

      throw new OpenRouterProviderError({
        status: 502,
        code: "openrouter_image_request_failed",
        message: "OpenRouter image generation request failed",
        cause: error,
      });
    }

    const imageUrls = extractMessageImageUrls(response);
    if (!imageUrls.length) {
      throw new OpenRouterProviderError({
        status: 502,
        code: "openrouter_missing_generated_image",
        message: "OpenRouter did not return generated images",
        details: {
          outputSample: String(extractMessageText(response) || "").slice(0, 500),
        },
      });
    }

    return imageUrls;
  };

  const generateVariantPreview = async (params) => {
    const mode = params?.mode === "improve" ? "improve" : "create";
    const payload = params?.payload || {};
    const variant = params?.variant || {};
    const variantNumber = clamp(params?.variantNumber, 1, 5, 1);
    const inputImages = resolvePreviewCandidates(payload, mode);

    const userPrompt = mode === "improve"
      ? buildImproveVariantImagePrompt(payload, variant, variantNumber)
      : buildCreateVariantImagePrompt(payload, variant, variantNumber);

    const responseImages = await callImageGeneration([
      {
        role: "system",
        content: mode === "improve"
          ? "Ты AI-редактор изображений для карточек маркетплейсов. Верни новое улучшенное изображение, а не исходник. Весь видимый текст должен быть на русском языке."
          : "Ты AI-генератор изображений для карточек товаров маркетплейсов. Верни новую сгенерированную карточку. Весь видимый текст должен быть на русском языке.",
      },
      {
        role: "user",
        content: buildImageMessageContent(userPrompt, inputImages),
      },
    ]);

    return responseImages[0] || "";
  };

  const createGenerate = async (payload) => {
    const variantsCount = clamp(payload?.cardsCount, 1, 5, 1);
    const parsed = await callChatJson([
      {
        role: "system",
        content: "Ты planner генерации карточек товаров для маркетплейсов. Возвращай только строгий JSON. Все строковые поля должны быть на русском языке.",
      },
      {
        role: "user",
        content: buildCreateGenerateUserText(payload),
      },
    ]);

    const rawVariants = normalizeVariantList(parsed);
    const marketplace = toText(payload?.marketplace) || "Маркетплейс";
    const promptPreview = toText(payload?.prompt).slice(0, 240);

    const results = [];
    for (let index = 0; index < variantsCount; index += 1) {
      const variantNumber = index + 1;
      const source = rawVariants[index] || rawVariants[index % Math.max(rawVariants.length, 1)] || {};
      const title = toText(source?.title) || "Вариант " + String(variantNumber);

      const previewUrl = await generateVariantPreview({
        mode: "create",
        payload,
        variant: source,
        variantNumber,
      });

      results.push({
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
      });
    }

    return results;
  };

  const improveGenerate = async (payload) => {
    const variantsCount = clamp(payload?.variantsCount, 1, 5, 1);
    const parsed = await callChatJson([
      {
        role: "system",
        content: "Ты AI-дизайнер, который улучшает карточки маркетплейсов. Возвращай только строгий JSON. Все строковые поля должны быть на русском языке.",
      },
      {
        role: "user",
        content: buildImproveGenerateUserText(payload),
      },
    ]);

    const rawVariants = normalizeVariantList(parsed);
    const promptPreview = toText(payload?.prompt).slice(0, 220);
    const referenceStyle = Boolean(payload?.referenceStyle);

    const results = [];
    for (let index = 0; index < variantsCount; index += 1) {
      const variantNumber = index + 1;
      const source = rawVariants[index] || rawVariants[index % Math.max(rawVariants.length, 1)] || {};
      const title = toText(source?.title) || "Улучшенный вариант " + String(variantNumber);

      const previewUrl = await generateVariantPreview({
        mode: "improve",
        payload,
        variant: source,
        variantNumber,
      });

      results.push({
        id: "improve-result-" + String(Date.now()) + "-" + String(variantNumber),
        variantNumber,
        totalVariants: variantsCount,
        previewUrl,
        title,
        strategy: toText(source?.strategy) || (referenceStyle ? "Улучшение в стиле референса" : "Обычное AI-улучшение"),
        styleLabel: toText(source?.styleLabel) || (referenceStyle ? "Улучшено по стилю референса" : ""),
        referenceStyle,
        changes:
          toText(source?.changes)
          || toText(payload?.analysis?.recommendations?.[0])
          || "Улучшена иерархия и усилен конверсионный фокус.",
        format:
          toText(source?.format)
          || toText(payload?.analysis?.marketplaceFormat)
          || "Готовый формат для маркетплейса с чистым CTA.",
        promptPreview,
        downloadName: "kartochka-improved-" + String(variantNumber) + ".png",
      });
    }

    return results;
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
