"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const { HttpClientError, requestJson } = require("../http-client");
const { getBundledPromptText } = require("../prompts/prompt-registry");
const { toText, extractJsonObject, clamp } = require("../utils");

const hashText = (value) => {
  const source = String(value || "");
  if (!source) return "";
  return crypto.createHash("sha256").update(source).digest("hex").slice(0, 16);
};

const buildResponseDebug = (value, maxLength = 1200) => {
  const text = toText(value);
  return {
    responseHash: hashText(text),
    responsePreview: text.slice(0, maxLength),
    responseLength: text.length,
  };
};

const resolveInstructionDocument = ({ inlineText, instructionPath }) => {
  const normalizedInlineText = toText(inlineText);
  if (normalizedInlineText) {
    return {
      text: normalizedInlineText,
      source: "inline",
      path: "",
      hash: hashText(normalizedInlineText),
    };
  }

  const normalizedInstructionPath = toText(instructionPath);
  if (!normalizedInstructionPath) {
    return {
      text: "",
      source: "missing",
      path: "",
      hash: "",
    };
  }

  const bundledPromptText = getBundledPromptText(normalizedInstructionPath);
  if (bundledPromptText) {
    return {
      text: bundledPromptText,
      source: "bundled",
      path: normalizedInstructionPath,
      hash: hashText(bundledPromptText),
    };
  }

  const resolvedPath = path.isAbsolute(normalizedInstructionPath)
    ? normalizedInstructionPath
    : path.resolve(__dirname, "..", "..", normalizedInstructionPath);

  try {
    const resolvedText = toText(fs.readFileSync(resolvedPath, "utf8"));
    return {
      text: resolvedText,
      source: "fs",
      path: resolvedPath,
      hash: hashText(resolvedText),
    };
  } catch (error) {
    return {
      text: "",
      source: "missing",
      path: resolvedPath,
      hash: "",
    };
  }
};

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

const normalizeCreateAnalyzeCharacteristicsV2 = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item, index) => ({
      label: toText(item?.label),
      value: toText(item?.value),
      order: clamp(item?.order, 1, 12, index + 1),
    }))
    .filter((item) => item.label || item.value)
    .slice(0, 8);
};

const normalizeCreateAnalyzeAutofillV2 = (value) => {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const benefits = Array.isArray(source?.benefits)
    ? source.benefits.map((item) => toText(item)).filter(Boolean).slice(0, 6)
    : [];

  return {
    title: toText(source?.title),
    shortDescription: toText(source?.shortDescription),
    subtitle: toText(source?.subtitle),
    characteristics: normalizeCreateAnalyzeCharacteristicsV2(source?.characteristics),
    benefits,
  };
};

const normalizeCreateAnalyzeSubjectV2 = (value) => {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    summary: toText(source?.summary),
    productType: toText(source?.productType),
    productIdentity: toText(source?.productIdentity),
    visualEvidence: toText(source?.visualEvidence),
    referenceRelation: toText(source?.referenceRelation),
  };
};

const formatCreateAnalyzeCharacteristicsV2 = (payload) => {
  const items = Array.isArray(payload?.characteristics) ? payload.characteristics : [];
  const normalizedItems = items
    .map((item) => ({
      label: toText(item?.label),
      value: toText(item?.value),
    }))
    .filter((item) => item.label || item.value)
    .slice(0, 8);

  if (!normalizedItems.length) return "(нет)";
  return normalizedItems
    .map((item, index) => {
      const suffix = item.value ? ": " + item.value : "";
      return String(index + 1) + ". " + (item.label || "Характеристика") + suffix;
    })
    .join("\n");
};

const formatCreateAnalyzeReferenceV2 = (payload) => {
  const reference = payload?.reference || payload?.selectedTemplate || null;
  if (!reference || typeof reference !== "object") return "(нет)";

  const tags = Array.isArray(reference.tags)
    ? reference.tags.map((item) => toText(item)).filter(Boolean).slice(0, 8)
    : [];

  return [
    "- title: " + (toText(reference.title) || "(нет)"),
    "- description: " + (toText(reference.description) || "(нет)"),
    "- group: " + (toText(reference.tab) || "(нет)"),
    "- kind: " + (toText(reference.kind) || "(нет)"),
    "- sourceLabel: " + (toText(reference.sourceLabel) || "(нет)"),
    "- sourceUrl: " + (toText(reference.sourceUrl) || "(нет)"),
    "- tags: " + (tags.length ? tags.join(", ") : "(нет)"),
  ].join("\n");
};

const formatCreateTemplateInstructionTextV2 = (payload) => {
  const reference = payload?.reference || payload?.selectedTemplate || null;
  const instructionPrompt = resolveInstructionDocument({
    inlineText: payload?.instructionDocumentText || reference?.instructionPrompt,
    instructionPath: reference?.instructionPromptPath,
  }).text;
  if (!instructionPrompt) return "";

  const userText = toText(payload?.contentCardText || payload?.userText || payload?.prompt || payload?.customPrompt) || "(пусто)";
  return instructionPrompt.replace(/\{USER_TEXT\}/g, userText).trim();
};

const formatCreateAutofillInstructionText = (payload) => {
  return resolveInstructionDocument({
    inlineText: "",
    instructionPath: payload?.autofillInstructionPromptPath,
  }).text;
};

const formatImproveInstructionText = (payload) => {
  const instructionPrompt = resolveInstructionDocument({
    inlineText: payload?.improveInstructionText || payload?.instructionDocumentText,
    instructionPath: payload?.improveInstructionPromptPath || payload?.instructionPromptPath,
  }).text;
  if (!instructionPrompt) return "";

  const userText = toText(payload?.userPrompt || payload?.prompt || payload?.customPrompt || payload?.userText) || "(пусто)";
  return instructionPrompt.replace(/\{USER_TEXT\}/g, userText).trim();
};

const normalizeCreateCardTextLevelsV2 = (value) => {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    primary: toText(source?.primary),
    secondary: toText(source?.secondary),
    tertiary: toText(source?.tertiary),
  };
};

const formatCreateCardPlacementTextV2 = (payload) => {
  const levels = normalizeCreateCardTextLevelsV2(payload?.cardTextLevels);
  const lines = [
    levels.primary ? "- Главный текст (нужно разместить на карточке): " + levels.primary : "",
    levels.secondary ? "- Второй уровень текста (нужно разместить на карточке): " + levels.secondary : "",
    levels.tertiary ? "- Третий уровень текста (нужно разместить на карточке): " + levels.tertiary : "",
  ].filter(Boolean);

  return lines.length ? lines.join("\n") : "(пусто)";
};

const isCreateInstructionPromptRequestV2 = (payload) => {
  const reference = payload?.reference || payload?.selectedTemplate || null;
  return toText(payload?.analysisIntent) === "prompt"
    && toText(reference?.kind) === "instruction-template"
    && toText(reference?.promptFlow) === "gpt_instruction";
};

const isCreateAutofillTextRequestV2 = (payload) => {
  return toText(payload?.analysisIntent) === "full";
};

const buildCreateAutofillInstructionUserText = (payload) => {
  const instructionText = formatCreateAutofillInstructionText(payload) || "(пусто)";

  return [
    "Задача: по фото товара и приложенной инструкции написать тексты для карточки товара в 3 уровнях.",
    "Используй только фото товара и инструкцию ниже. Не используй описания, характеристики, шаблоны, промпты, заметки пользователя или любые другие текстовые поля.",
    "Верни только валидный JSON строго в таком формате:",
    "{",
    '  "level1": string[],',
    '  "level2": string[],',
    '  "level3": string[]',
    "}",
    "Правила:",
    "- каждая строка в массивах должна содержать только сам текст для карточки",
    "- не добавляй префиксы Level 1, Level 2, Level 3",
    "- не добавляй маркеры списка, дефисы, точки или markdown",
    "- level1, level2, level3 должны отражать иерархию из инструкции",
    "- если для уровня достаточно одного сильного текста, верни один элемент массива",
    "",
    "Инструкция:",
    instructionText,
  ].join("\n");
};

const normalizeAutofillLevelLines = (value) => {
  const items = Array.isArray(value) ? value : String(value || "").split(/\r?\n+/g);
  return items
    .map((item) => toText(item))
    .map((item) => item.replace(/^level\s*[123]\s*:?\s*/i, ""))
    .map((item) => item.replace(/^[-*•–—\d.)\s]+/, ""))
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildCreateInstructionPromptUserTextV2 = (payload) => {
  const instructionText = formatCreateTemplateInstructionTextV2(payload) || "(пусто)";
  const cardPlacementText = formatCreateCardPlacementTextV2(payload);
  const generationNotes = toText(payload?.generationNotes) || "(пусто)";

  return [
    "Задача: по инструкции шаблона, фото товара и пользовательскому тексту для карточки собери один финальный prompt для image AI.",
    "Верни только валидный JSON со следующей структурой:",
    "{",
    '  "prompt": string',
    "}",
    "Правила:",
    "- фото товара — главный источник правды о товаре",
    "- пользовательский текст ниже нужно разместить на карточке",
    "- пожелания к генерации ниже считай важной частью итогового prompt и обязательно учти их при сборке финального prompt",
    "- не добавляй объяснения, комментарии или markdown",
    "- верни только один готовый prompt для image AI",
    "",
    "Инструкция шаблона:",
    instructionText,
    "",
    "Пользовательский текст для размещения на карточке:",
    cardPlacementText,
    "",
    "Пожелания к генерации:",
    generationNotes,
  ].join("\n");
};

const buildCreateInstructionDebug = (payload, modelProfile) => {
  const reference = payload?.reference || payload?.selectedTemplate || null;
  const instructionDocument = resolveInstructionDocument({
    inlineText: payload?.instructionDocumentText || reference?.instructionPrompt,
    instructionPath: reference?.instructionPromptPath,
  });
  return {
    flow: "create_instruction_prompt",
    model: toText(modelProfile?.model),
    reasoningEffort: toText(modelProfile?.reasoningEffort),
    aiModelTier: toText(payload?.aiModelTier),
    instructionSource: instructionDocument.source,
    instructionPath: instructionDocument.path,
    instructionHash: instructionDocument.hash,
    generationNotesHash: hashText(toText(payload?.generationNotes)),
    cardTextLevelsHash: hashText(JSON.stringify(payload?.cardTextLevels || {})),
    imageCount: Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls.filter(Boolean).length : 0,
  };
};

const buildCreateAutofillDebug = (payload, modelProfile) => {
  const instructionDocument = resolveInstructionDocument({
    inlineText: "",
    instructionPath: payload?.autofillInstructionPromptPath,
  });
  return {
    flow: "create_autofill",
    model: toText(modelProfile?.model),
    reasoningEffort: toText(modelProfile?.reasoningEffort),
    instructionSource: instructionDocument.source,
    instructionPath: instructionDocument.path,
    instructionHash: instructionDocument.hash,
    imageCount: Array.isArray(payload?.imageDataUrls) ? payload.imageDataUrls.filter(Boolean).length : 0,
  };
};

const isImprovePromptRequest = (payload) => {
  return toText(payload?.analysisIntent) === "prompt"
    && Boolean(toText(payload?.improveInstructionPromptPath || payload?.instructionPromptPath || payload?.improveInstructionText || payload?.instructionDocumentText));
};

const buildImprovePromptUserText = (payload) => {
  const instructionText = formatImproveInstructionText(payload) || "(пусто)";
  const userPrompt = toText(payload?.userPrompt || payload?.prompt || payload?.customPrompt) || "(пусто)";

  return [
    "Задача: по инструкции улучшения, загруженной карточке товара и пожеланиям пользователя собери один финальный prompt для image AI.",
    "Верни только валидный JSON со следующей структурой:",
    "{",
    '  "prompt": string',
    "}",
    "Правила:",
    "- загруженная карточка товара — главный визуальный источник правды",
    "- пожелания пользователя ниже являются обязательной частью итогового prompt и должны быть учтены",
    "- не добавляй комментарии, markdown или пояснения",
    "- верни только один готовый prompt для image AI",
    "",
    "Инструкция улучшения:",
    instructionText,
    "",
    "Пожелания пользователя:",
    userPrompt,
  ].join("\n");
};

const formatCreateAnalyzeSettingsV2 = (payload) => {
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
    ["preserveReferenceLayout", settings.preserveReferenceLayout ? "да" : "нет"],
  ].filter((entry) => toText(entry[1]));

  if (!lines.length) return "(нет)";
  return lines.map((entry) => "- " + entry[0] + ": " + entry[1]).join("\n");
};

const buildCreateAnalyzeUserTextV2 = (payload) => {
  const description = toText(payload?.description) || "(пусто)";
  const highlights = toText(payload?.highlights) || "(пусто)";
  const marketplace = toText(payload?.marketplace) || "не указан";
  const cardsCount = clamp(payload?.cardsCount, 1, 5, 1);
  const promptMode = toText(payload?.promptMode) || "ai";
  const customPrompt = toText(payload?.prompt) || toText(payload?.customPrompt) || "";
  const contentCardText = toText(payload?.contentCardText) || "(пусто)";
  const title = toText(payload?.title) || "(пусто)";
  const shortDescription = toText(payload?.shortDescription || payload?.subtitle) || "(пусто)";
  const userText = toText(payload?.userText) || "(пусто)";
  const categoryHint = toText(payload?.productCategory || payload?.insight?.category) || "(нет)";
  const referenceAttached = Boolean(toText(payload?.referencePreviewUrl));
  const templateInstructionText = formatCreateTemplateInstructionTextV2(payload);

  return [
    "Задача: проанализировать товар на загруженных фото, понять кто или что изображено, учесть выбранный визуальный референс и подготовить структурированные данные для заполнения карточки товара.",
    "Анализируй входы в таком порядке: 1) фото товара 2) изображение референса 3) структурированные поля формы 4) характеристики и настройки.",
    "Фото товара — главный источник правды. Нельзя подменять товар другим объектом или выдумывать иную сущность.",
    "Если референс приложен, используй его как источник композиции, плотности, иерархии и визуального ритма, но не путай референс с самим товаром.",
    "Верни только валидный JSON со следующими полями:",
    "{",
    '  "detectedCategory": string,',
    '  "subjectOnScreen": { "summary": string, "productType": string, "productIdentity": string, "visualEvidence": string, "referenceRelation": string },',
    '  "insight": { "category": string, "recommendedStyle": string, "conversionAccent": string, "conversionAngle": string, "marketplaceFormat": string },',
    '  "headlineIdeas": string[],',
    '  "autofill": { "title": string, "shortDescription": string, "subtitle": string, "characteristics": [{ "label": string, "value": string, "order": number }], "benefits": string[] },',
    '  "prompt": string',
    "}",
    "Требования:",
    "- все строковые поля должны быть только на русском языке",
    "- subjectOnScreen.summary должен кратко и ясно объяснять, что именно на фото товара",
    "- productIdentity должен быть конкретным и не generic, если это можно понять по фото и контексту",
    "- visualEvidence должен опираться только на реально видимые признаки товара",
    "- referenceRelation должен объяснять, как адаптировать стиль референса под этот товар",
    "- category должна быть конкретной для карточки маркетплейса",
    "- autofill.title должен быть коротким, коммерчески понятным названием товара, а не названием шаблона",
    "- autofill.shortDescription должен быть кратким описанием самого товара, его особенностей, материала, назначения или пользы для покупателя",
    "- autofill.title, autofill.shortDescription и autofill.subtitle не должны описывать дизайн карточки, стиль, макет, marketplace, CTA или бейджи",
    "- если в autofill.shortDescription или autofill.subtitle появляются слова вроде карточка, маркетплейс, макет, CTA, бейдж, шаблон или референс, это считается ошибкой: перепиши текст как описание товара и его особенностей",
    "- autofill.characteristics должны включать только поддерживаемые фото или контекстом параметры; не выдумывай характеристики",
    "- headlineIdeas должны содержать 3-5 коротких вариантов в логике товара, а не шаблона",
    "- marketplaceFormat должен соответствовать особенностям маркетплейса",
    "- prompt должен быть готов для production-генерации карточки и учитывать товар, референс и structured inputs",
    "- если пользователь заполнил contentCardText, используй его как обязательный текстовый контекст для сборки финального prompt",
    "",
    "Структурированные данные формы:",
    "- title: " + title,
    "- shortDescription: " + shortDescription,
    "- contentCardText: " + contentCardText,
    "- description: " + description,
    "- highlights: " + highlights,
    "- marketplace: " + marketplace,
    "- cardsCount: " + String(cardsCount),
    "- promptMode: " + promptMode,
    "- customPrompt: " + (customPrompt || "(нет)"),
    "- userText: " + userText,
    "- productCategoryHint: " + categoryHint,
    "",
    "Характеристики:",
    formatCreateAnalyzeCharacteristicsV2(payload),
    "",
    "Референс:",
    referenceAttached ? "- referenceImageAttached: да" : "- referenceImageAttached: нет",
    formatCreateAnalyzeReferenceV2(payload),
    ...(templateInstructionText ? ["", "Template preset instructions:", templateInstructionText] : []),
    "",
    "Настройки:",
    formatCreateAnalyzeSettingsV2(payload),
  ].join("\n");
};

const normalizeCreateAnalyzeResultV2 = (parsed, payload) => {
  if (isCreateAutofillTextRequestV2(payload)) {
    const level1 = normalizeAutofillLevelLines(parsed?.level1);
    const level2 = normalizeAutofillLevelLines(parsed?.level2);
    const level3 = normalizeAutofillLevelLines(parsed?.level3);

    return {
      detectedCategory: "",
      subjectOnScreen: null,
      insight: null,
      headlineIdeas: level1.slice(0, 3),
      autofill: {
        title: level1.join("\n"),
        shortDescription: level2.join("\n"),
        subtitle: level3.join("\n"),
        characteristics: [],
        benefits: [],
      },
      cardTextLevels: {
        primary: level1.join("\n"),
        secondary: level2.join("\n"),
        tertiary: level3.join("\n"),
      },
      prompt: "",
    };
  }

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
  const subjectOnScreen = normalizeCreateAnalyzeSubjectV2(parsed?.subjectOnScreen);
  const autofill = normalizeCreateAnalyzeAutofillV2(parsed?.autofill);

  const prompt = toText(parsed?.prompt) || [
    "Создай готовую карточку товара для маркетплейса.",
    "Категория: " + insight.category + ".",
    "Стиль: " + insight.recommendedStyle + ".",
    "Конверсионный акцент: " + insight.conversionAccent + ".",
    "Формат: " + insight.marketplaceFormat + ".",
    "Описание товара: " + (toText(payload?.description) || "(не указано)") + ".",
    "Акценты: " + (toText(payload?.highlights) || "(не указаны)") + ".",
    subjectOnScreen.summary ? "Что на фото: " + subjectOnScreen.summary + "." : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    detectedCategory,
    subjectOnScreen,
    insight,
    headlineIdeas,
    autofill,
    prompt,
  };
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
  const normalizedIntent = toText(payload?.analysisIntent).toLowerCase();
  if (normalizedIntent === "prompt") {
    return {
      prompt: toText(parsed?.prompt),
    };
  }

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
  const defaultModel = toText(config?.model) || "gpt-5.4-mini";
  const defaultReasoningEffort = toText(config?.reasoningEffort) || "medium";
  const apiKey = toText(config?.apiKey);
  const timeoutMs = clamp(config?.timeoutMs, 1000, 300000, 300000);

  const resolveModelProfile = (payload) => {
    if (toText(payload?.aiModelTier).toLowerCase() === "best") {
      return {
        model: "gpt-5.4",
        reasoningEffort: "high",
      };
    }

    return {
      model: toText(payload?.openAiModel) || defaultModel,
      reasoningEffort: toText(payload?.openAiReasoningEffort) || defaultReasoningEffort,
    };
  };

  const callChatJson = async (messages, profile) => {
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
          model: toText(profile?.model) || defaultModel,
          reasoning_effort: toText(profile?.reasoningEffort) || defaultReasoningEffort,
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
    return {
      parsed,
      debug: buildResponseDebug(assistantText),
    };
  };

  const createAnalyze = async (payload) => {
    const modelProfile = resolveModelProfile(payload);
    if (isCreateInstructionPromptRequestV2(payload)) {
      const messages = [
        {
          role: "system",
          content: "Ты собираешь один готовый prompt для image AI. Возвращай только строгий JSON.",
        },
      ];

      const userContent = [
        {
          type: "text",
          text: buildCreateInstructionPromptUserTextV2(payload),
        },
      ];

      const imageDataUrls = Array.isArray(payload?.imageDataUrls)
        ? payload.imageDataUrls.filter((value) => toText(value))
        : [];
      for (const imageUrl of imageDataUrls.slice(0, 5)) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "high",
          },
        });
      }

      messages.push({
        role: "user",
        content: userContent,
      });

      const { parsed, debug: apiResponseDebug } = await callChatJson(messages, modelProfile);
      const result = {
        prompt: toText(parsed?.prompt),
      };
      if (payload?.debugMode) {
        result.__debug = {
          ...buildCreateInstructionDebug(payload, modelProfile),
          promptHash: hashText(toText(parsed?.prompt)),
          ...apiResponseDebug,
        };
      }
      return result;
    }

    if (isCreateAutofillTextRequestV2(payload)) {
      const messages = [
        {
          role: "system",
          content: "Ты пишешь тексты для карточек товаров. Возвращай только строгий JSON.",
        },
      ];

      const userContent = [
        {
          type: "text",
          text: buildCreateAutofillInstructionUserText(payload),
        },
      ];

      const imageDataUrls = Array.isArray(payload?.imageDataUrls)
        ? payload.imageDataUrls.filter((value) => toText(value))
        : [];
      for (const imageUrl of imageDataUrls.slice(0, 5)) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "high",
          },
        });
      }

      messages.push({
        role: "user",
        content: userContent,
      });

      const { parsed, debug: apiResponseDebug } = await callChatJson(messages, modelProfile);
      const result = normalizeCreateAnalyzeResultV2(parsed, payload);
      if (payload?.debugMode) {
        result.__debug = {
          ...buildCreateAutofillDebug(payload, modelProfile),
          level1Hash: hashText(JSON.stringify(parsed?.level1 || [])),
          level2Hash: hashText(JSON.stringify(parsed?.level2 || [])),
          level3Hash: hashText(JSON.stringify(parsed?.level3 || [])),
          ...apiResponseDebug,
        };
      }
      return result;
    }

    {
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
          text: buildCreateAnalyzeUserTextV2(payload),
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

      const referencePreviewUrl = toText(payload?.referencePreviewUrl);
      if (referencePreviewUrl) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: referencePreviewUrl,
            detail: "low",
          },
        });
      }

      messages.push({
        role: "user",
        content: userContent,
      });

      const { parsed, debug: apiResponseDebug } = await callChatJson(messages, modelProfile);
      const result = normalizeCreateAnalyzeResultV2(parsed, payload);
      if (payload?.debugMode) {
        result.__debug = {
          ...(result.__debug && typeof result.__debug === "object" ? result.__debug : {}),
          ...apiResponseDebug,
        };
      }
      return result;
    }

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

    const { parsed, debug: apiResponseDebug } = await callChatJson(messages, modelProfile);
    const result = normalizeCreateAnalyzeResult(parsed, payload);
    if (payload?.debugMode) {
      result.__debug = {
        ...(result.__debug && typeof result.__debug === "object" ? result.__debug : {}),
        ...apiResponseDebug,
      };
    }
    return result;
  };

  const improveAnalyze = async (payload) => {
    const modelProfile = resolveModelProfile(payload);
    if (isImprovePromptRequest(payload)) {
      const messages = [
        {
          role: "system",
          content: "Ты собираешь один готовый prompt для image AI. Возвращай только строгий JSON.",
        },
      ];

      const userContent = [
        {
          type: "text",
          text: buildImprovePromptUserText(payload),
        },
      ];

      const previewCandidates = [
        toText(payload?.imageDataUrl),
        toText(payload?.sourcePreviewUrl),
        toText(payload?.referencePreviewUrl),
      ].filter(Boolean);
      for (const imageUrl of previewCandidates.slice(0, 2)) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "high",
          },
        });
      }

      messages.push({
        role: "user",
        content: userContent,
      });

      const { parsed, debug: apiResponseDebug } = await callChatJson(messages, modelProfile);
      const result = normalizeImproveAnalyzeResult(parsed, payload);
      if (payload?.debugMode) {
        result.__debug = {
          ...(result.__debug && typeof result.__debug === "object" ? result.__debug : {}),
          ...apiResponseDebug,
        };
      }
      return result;
    }

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

    const { parsed, debug: apiResponseDebug } = await callChatJson(messages, modelProfile);
    const result = normalizeImproveAnalyzeResult(parsed, payload);
    if (payload?.debugMode) {
      result.__debug = {
        ...(result.__debug && typeof result.__debug === "object" ? result.__debug : {}),
        ...apiResponseDebug,
      };
    }
    return result;
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
