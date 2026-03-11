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

const CREATE_CARD_ART_DIRECTOR_SYSTEM_PROMPT_V2 = [
  "You are a senior marketplace product card art director, conversion-focused visual designer, and product image generation system.",
  "Analyze inputs in this order: uploaded product images first, selected reference image second, structured flow inputs third, characteristics and offer logic fourth.",
  "Preserve the real product identity. Do not redesign the product into something else. Keep recognizability, proportions, silhouette, materials, palette, and key functional parts.",
  "Follow the reference in composition logic, hierarchy, spacing, density, badge placement, background treatment, and premium feel, but do not copy it literally.",
  "Create a premium, clean, readable, conversion-oriented marketplace card where the product is the hero.",
  "Convert raw features into short consumer-facing value statements whenever appropriate.",
  "Protect readability, spacing, safe padding, and visual hierarchy. Remove low-priority content before sacrificing clarity.",
  "Do not overload the card with too many badges or text blocks. Do not cover important product parts. Do not add random decoration that weakens conversion.",
  "Priority order: 1) product recognizability 2) readability 3) conversion logic 4) similarity to reference style 5) visual polish.",
  "All visible text on the final card must be in Russian.",
  "All JSON string values returned for planning must be in Russian.",
].join("\n");

const formatBooleanInstructionV2 = (value) => (value ? "yes" : "no");

const formatCreateCharacteristicsTextV2 = (payload) => {
  const items = Array.isArray(payload?.characteristics) ? payload.characteristics : [];
  const normalizedItems = items
    .map((item) => ({
      label: toText(item?.label),
      value: toText(item?.value),
    }))
    .filter((item) => item.label || item.value);

  if (!normalizedItems.length) return "(none)";
  return normalizedItems
    .map((item, index) => {
      const value = item.value ? ": " + item.value : "";
      return String(index + 1) + ". " + (item.label || "Characteristic") + value;
    })
    .join("\n");
};

const formatCreateSettingsTextV2 = (payload) => {
  const settings = payload?.settings || {};
  const lines = [
    ["accentColor", toText(settings.accentColorLabel || settings.accentColor)],
    ["referenceStrength", toText(settings.referenceStrengthLabel || settings.referenceStrength)],
    ["visualStyle", toText(settings.visualStyleLabel || settings.visualStyle)],
    ["infoDensity", toText(settings.infoDensityLabel || settings.infoDensity)],
    ["readabilityPriority", toText(settings.readabilityPriorityLabel || settings.readabilityPriority)],
    ["conversionPriority", toText(settings.conversionPriorityLabel || settings.conversionPriority)],
    ["accentFormat", toText(settings.accentFormatLabel || settings.accentFormat)],
    ["backgroundMode", toText(settings.backgroundModeLabel || settings.backgroundMode)],
    ["preserveReferenceLayout", formatBooleanInstructionV2(Boolean(settings.preserveReferenceLayout))],
  ].filter((entry) => toText(entry[1]));

  if (!lines.length) return "(none)";
  return lines.map((entry) => "- " + entry[0] + ": " + entry[1]).join("\n");
};

const formatCreateReferenceTextV2 = (payload) => {
  const reference = payload?.reference || payload?.selectedTemplate || null;
  if (!reference) return "(none)";

  const tags = Array.isArray(reference.tags)
    ? reference.tags.map((item) => toText(item)).filter(Boolean).slice(0, 8)
    : [];

  return [
    "- referenceTitle: " + (toText(reference.title) || "(none)"),
    "- referenceDescription: " + (toText(reference.description) || "(none)"),
    "- referenceGroup: " + (toText(reference.tab) || "(none)"),
    "- referenceTags: " + (tags.length ? tags.join(", ") : "(none)"),
  ].join("\n");
};

const formatCreateTemplateInstructionTextV2 = (payload) => {
  const reference = payload?.reference || payload?.selectedTemplate || null;
  const instructionPrompt = toText(reference?.instructionPrompt);
  if (!instructionPrompt) return "";

  const userText = toText(payload?.userText) || "(none)";
  return instructionPrompt.replace(/\{USER_TEXT\}/g, userText).trim();
};

const resolveCreatePreviewCandidatesV2 = (payload) => {
  return [
    ...(Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls : []),
    ...(Array.isArray(payload?.imagePreviewUrls) ? payload.imagePreviewUrls : []),
    toText(payload?.referencePreviewUrl),
  ]
    .map((item) => toText(item))
    .filter(Boolean);
};

const buildCreateGenerateUserTextV2 = (payload) => {
  const title = toText(payload?.title) || "(none)";
  const subtitle = toText(payload?.subtitle || payload?.shortDescription) || "(none)";
  const description = toText(payload?.description) || "(none)";
  const highlights = toText(payload?.highlights) || "(none)";
  const marketplace = toText(payload?.marketplace) || "(none)";
  const cardsCount = clamp(payload?.cardsCount, 1, 5, 1);
  const prompt = toText(payload?.prompt) || "(none)";
  const userText = toText(payload?.userText) || "(none)";
  const category = toText(payload?.productCategory || payload?.insight?.category) || "(none)";
  const style = toText(payload?.insight?.recommendedStyle) || "(none)";
  const accent = toText(payload?.insight?.conversionAccent) || "(none)";
  const format = toText(payload?.insight?.marketplaceFormat) || "(none)";
  const cardGoal = toText(payload?.cardGoal) || "Marketplace-ready conversion cover";
  const generationMode = toText(payload?.generationMode) || "(none)";
  const densityMode = toText(payload?.densityMode) || "(none)";
  const userNotes = toText(payload?.userNotes) || "(none)";
  const referenceAttached = Boolean(toText(payload?.referencePreviewUrl));
  const templateInstructionText = formatCreateTemplateInstructionTextV2(payload);

  return [
    "Plan high-converting marketplace product card variants for the provided product.",
    "Return strict JSON only with this structure:",
    "{",
    '  "variants": [',
    '    { "title": string, "style": string, "focus": string, "format": string, "changes": string }',
    "  ]",
    "}",
    "Planner rules:",
    "- all returned string values must be in Russian",
    "- variants length must be at least the requested count",
    "- use the attached product images as the primary source of truth",
    referenceAttached
      ? "- the selected reference image is attached after the product images and must be used as a secondary style and layout guide"
      : "- no visual reference image is attached; rely on the reference metadata only",
    "- plan for premium, clean, readable, commercially strong marketplace cards",
    "- keep copy concise and suitable for on-card placement",
    "- convert dry features into consumer-facing value statements whenever appropriate",
    "- subtitle and shortDescription describe the product itself and its features, not the card layout or marketplace formatting",
    "- no markdown",
    "",
    "Structured flow inputs:",
    "- title: " + title,
    "- subtitle: " + subtitle,
    "- marketplace: " + marketplace,
    "- cardGoal: " + cardGoal,
    "- generationMode: " + generationMode,
    "- densityMode: " + densityMode,
    "- cardsCount: " + String(cardsCount),
    "- productCategory: " + category,
    "- userText: " + userText,
    "- description: " + description,
    "- highlights: " + highlights,
    "- userNotes: " + userNotes,
    "- additionalPromptModifiers: " + prompt,
    "- insight.recommendedStyle: " + style,
    "- insight.conversionAccent: " + accent,
    "- insight.marketplaceFormat: " + format,
    "",
    "Reference metadata:",
    formatCreateReferenceTextV2(payload),
    ...(templateInstructionText ? ["", "Selected template preset instructions:", templateInstructionText] : []),
    "",
    "Settings:",
    formatCreateSettingsTextV2(payload),
    "",
    "Characteristics / benefits:",
    formatCreateCharacteristicsTextV2(payload),
  ].join("\n");
};

const buildCreateVariantImagePromptV2 = (payload, variant, variantNumber) => {
  const marketplace = toText(payload?.marketplace) || "маркетплейс";
  const title = toText(payload?.title) || toText(payload?.description) || "товар";
  const subtitle = toText(payload?.subtitle || payload?.shortDescription) || "";
  const userText = toText(payload?.userText) || "(none)";
  const description = toText(payload?.description) || "товар";
  const highlights = toText(payload?.highlights) || "";
  const prompt = toText(payload?.prompt) || "";
  const style = toText(variant?.style) || toText(payload?.insight?.recommendedStyle) || "чистая композиция под маркетплейс";
  const focus = toText(variant?.focus) || toText(payload?.insight?.conversionAccent) || "ясная ценность товара";
  const format = toText(variant?.format) || toText(payload?.insight?.marketplaceFormat) || "первый экран с преимуществами и CTA";
  const changes = toText(variant?.changes) || "новая композиция карточки";
  const referenceAttached = Boolean(toText(payload?.referencePreviewUrl));
  const templateInstructionText = formatCreateTemplateInstructionTextV2(payload);

  return [
    "Create one final polished marketplace product card image.",
    "Analyze the attached inputs in this order:",
    "1. Uploaded product images come first and define the real product identity.",
    referenceAttached
      ? "2. The selected reference image comes after the product images and defines style, layout rhythm, density, spacing, and premium feel."
      : "2. No visual reference image is attached, so use only the provided reference metadata.",
    "3. Then use the structured flow inputs and planned variant direction below.",
    "Return one image only.",
    "",
    "Structured flow inputs:",
    "- marketplace: " + marketplace,
    "- title: " + title,
    "- subtitle: " + (subtitle || "(none)"),
    "- subtitle describes the product itself, not the card layout",
    "- userText: " + userText,
    "- description: " + description,
    "- highlights: " + (highlights || "(none)"),
    "- prompt modifiers: " + (prompt || "(none)"),
    "",
    "Reference metadata:",
    formatCreateReferenceTextV2(payload),
    ...(templateInstructionText ? ["", "Selected template preset instructions:", templateInstructionText] : []),
    "",
    "Settings:",
    formatCreateSettingsTextV2(payload),
    "",
    "Characteristics / benefits:",
    formatCreateCharacteristicsTextV2(payload),
    "",
    "Planned variant direction:",
    "- variantNumber: " + String(variantNumber),
    "- plannedTitle: " + (toText(variant?.title) || "Вариант " + String(variantNumber)),
    "- plannedStyle: " + style,
    "- plannedFocus: " + focus,
    "- plannedFormat: " + format,
    "- plannedChanges: " + changes,
  ].join("\n");
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
    const inputImages = mode === "create"
      ? resolveCreatePreviewCandidatesV2(payload)
      : resolvePreviewCandidates(payload, mode);

    const userPrompt = mode === "improve"
      ? buildImproveVariantImagePrompt(payload, variant, variantNumber)
      : buildCreateVariantImagePromptV2(payload, variant, variantNumber);

    const responseImages = await callImageGeneration([
      {
        role: "system",
        content: mode === "improve"
          ? "Ты AI-редактор изображений для карточек маркетплейсов. Верни новое улучшенное изображение, а не исходник. Весь видимый текст должен быть на русском языке."
          : CREATE_CARD_ART_DIRECTOR_SYSTEM_PROMPT_V2,
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
        content: CREATE_CARD_ART_DIRECTOR_SYSTEM_PROMPT_V2 + "\nReturn only strict JSON with the requested planning structure.",
      },
      {
        role: "user",
        content: buildImageMessageContent(buildCreateGenerateUserTextV2(payload), resolveCreatePreviewCandidatesV2(payload)),
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
