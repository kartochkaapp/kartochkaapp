"use strict";

const { toText } = require("../utils");

class OpenAIBrainServiceError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "OpenAI brain service error"));
    this.name = "OpenAIBrainServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "openai_brain_service_error";
    this.details = params?.details;
  }
}

const ensureObject = (value, message) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new OpenAIBrainServiceError({
      status: 500,
      code: "invalid_provider_response",
      message: message || "OpenAI adapter returned invalid response",
      details: value,
    });
  }
  return value;
};

const normalizeCharacteristicList = (value) => {
  const items = Array.isArray(value) ? value : [];
  return items
    .map((item, index) => ({
      label: toText(item?.label),
      value: toText(item?.value),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index + 1,
    }))
    .filter((item) => item.label || item.value)
    .slice(0, 8);
};

const normalizeBenefits = (value) => {
  const items = Array.isArray(value) ? value : [];
  return items.map((item) => toText(item)).filter(Boolean).slice(0, 6);
};

const splitBenefitText = (value) => {
  return String(value || "")
    .split(/[\n;|•]+/g)
    .map((item) => toText(item).replace(/[.!?,]+$/g, ""))
    .filter(Boolean)
    .slice(0, 6);
};

const buildFallbackSubjectOnScreen = (payload, detectedCategory) => {
  const title = toText(payload?.title);
  const shortDescription = toText(payload?.shortDescription || payload?.subtitle);
  const description = toText(payload?.description);
  const characteristics = normalizeCharacteristicList(payload?.characteristics);
  const referenceTitle = toText(payload?.reference?.title || payload?.selectedTemplate?.title);
  const characteristicSummary = characteristics
    .slice(0, 2)
    .map((item) => [item.label, item.value].filter(Boolean).join(": "))
    .filter(Boolean)
    .join(", ");

  return {
    summary: title || shortDescription || description || detectedCategory || "Товар на фото",
    productType: detectedCategory || title || "Товар",
    productIdentity: title || shortDescription || detectedCategory || "Товар на фото",
    visualEvidence: characteristicSummary || description || shortDescription || title || detectedCategory,
    referenceRelation: referenceTitle
      ? "Адаптировать композицию и стиль шаблона " + referenceTitle + " под этот товар."
      : "Опирайтесь на фото товара как на главный источник идентичности.",
  };
};

const buildFallbackAutofill = (payload, detectedCategory, headlineIdeas) => {
  const title = toText(payload?.title) || headlineIdeas[0] || detectedCategory || "Товар";
  const characteristics = normalizeCharacteristicList(payload?.characteristics);
  const benefits = splitBenefitText(payload?.highlights);
  const shortDescription = (
    toText(payload?.shortDescription || payload?.subtitle)
    || toText(payload?.description)
    || characteristics
      .slice(0, 2)
      .map((item) => [item.label, item.value].filter(Boolean).join(": "))
      .filter(Boolean)
      .join(", ")
    || benefits.slice(0, 2).join(". ")
    || detectedCategory
  );

  return {
    title,
    shortDescription,
    subtitle: shortDescription,
    characteristics,
    benefits,
  };
};

const normalizeCreateAnalyzeResult = (result, payload, intent) => {
  const safeResult = ensureObject(result, "OpenAI createAnalyze response must be an object");
  const normalizedIntent = toText(intent).toLowerCase();
  const detectedCategory = toText(safeResult.detectedCategory || safeResult?.insight?.category);
  const fallbackHeadline = toText(payload?.title || payload?.shortDescription || detectedCategory);
  const headlineIdeas = Array.isArray(safeResult.headlineIdeas)
    ? safeResult.headlineIdeas.map((item) => toText(item)).filter(Boolean).slice(0, 5)
    : [];
  if (!headlineIdeas.length && fallbackHeadline) {
    headlineIdeas.push(fallbackHeadline);
  }

  const insight = {
    category: toText(safeResult?.insight?.category || detectedCategory),
    recommendedStyle: toText(safeResult?.insight?.recommendedStyle),
    conversionAccent:
      toText(safeResult?.insight?.conversionAccent)
      || toText(safeResult?.insight?.conversionAngle),
    marketplaceFormat: toText(safeResult?.insight?.marketplaceFormat),
    conversionAngle:
      toText(safeResult?.insight?.conversionAngle)
      || toText(safeResult?.insight?.conversionAccent),
    headlineIdeas,
  };
  const subjectSource = safeResult.subjectOnScreen && typeof safeResult.subjectOnScreen === "object"
    ? safeResult.subjectOnScreen
    : {};
  const autofillSource = safeResult.autofill && typeof safeResult.autofill === "object"
    ? safeResult.autofill
    : {};
  const fallbackSubject = buildFallbackSubjectOnScreen(payload, detectedCategory);
  const fallbackAutofill = buildFallbackAutofill(payload, detectedCategory, headlineIdeas);
  const subjectOnScreen = {
    summary: toText(subjectSource.summary) || fallbackSubject.summary,
    productType: toText(subjectSource.productType) || fallbackSubject.productType,
    productIdentity: toText(subjectSource.productIdentity) || fallbackSubject.productIdentity,
    visualEvidence: toText(subjectSource.visualEvidence) || fallbackSubject.visualEvidence,
    referenceRelation: toText(subjectSource.referenceRelation) || fallbackSubject.referenceRelation,
  };
  const autofill = {
    title: toText(autofillSource.title) || fallbackAutofill.title,
    shortDescription: toText(autofillSource.shortDescription) || fallbackAutofill.shortDescription,
    subtitle: toText(autofillSource.subtitle) || fallbackAutofill.subtitle,
    characteristics: normalizeCharacteristicList(autofillSource.characteristics).length
      ? normalizeCharacteristicList(autofillSource.characteristics)
      : fallbackAutofill.characteristics,
    benefits: normalizeBenefits(autofillSource.benefits).length
      ? normalizeBenefits(autofillSource.benefits)
      : fallbackAutofill.benefits,
  };

  if (normalizedIntent === "category") {
    return {
      detectedCategory,
      insight,
      prompt: "",
      headlineIdeas,
      subjectOnScreen,
      autofill,
      cardTextLevels: safeResult.cardTextLevels || null,
      __debug: safeResult.__debug || null,
    };
  }

  if (normalizedIntent === "insight") {
    return {
      detectedCategory,
      insight,
      prompt: "",
      headlineIdeas,
      subjectOnScreen,
      autofill,
      cardTextLevels: safeResult.cardTextLevels || null,
      __debug: safeResult.__debug || null,
    };
  }

  if (normalizedIntent === "prompt") {
    return {
      detectedCategory,
      insight,
      prompt: toText(safeResult.prompt),
      headlineIdeas,
      subjectOnScreen,
      autofill,
      cardTextLevels: safeResult.cardTextLevels || null,
      __debug: safeResult.__debug || null,
    };
  }

  return {
    detectedCategory,
    insight,
    prompt: toText(safeResult.prompt),
    headlineIdeas,
    subjectOnScreen,
    autofill,
    cardTextLevels: safeResult.cardTextLevels || null,
    __debug: safeResult.__debug || null,
  };
};

const normalizeImproveAnalyzeResult = (result) => {
  const safeResult = ensureObject(result, "OpenAI improveAnalyze response must be an object");
  const recommendations = Array.isArray(safeResult.recommendations)
    ? safeResult.recommendations.map((item) => toText(item)).filter(Boolean)
    : [];

  return {
    ...safeResult,
    recommendations,
    improvementPlan: recommendations,
  };
};

const createOpenAIBrainService = (deps) => {
  const adapter = deps?.adapter;
  if (!adapter || typeof adapter.analyzeCreateInput !== "function" || typeof adapter.analyzeImproveInput !== "function") {
    throw new OpenAIBrainServiceError({
      status: 500,
      code: "invalid_adapter",
      message: "OpenAI brain adapter is not configured",
    });
  }

  return {
    async createAnalyze(payload, context) {
      const result = await adapter.analyzeCreateInput(payload || {});
      return normalizeCreateAnalyzeResult(result, payload || {}, context?.intent);
    },
    async improveAnalyze(payload) {
      const result = await adapter.analyzeImproveInput(payload || {});
      return normalizeImproveAnalyzeResult(result, payload || {});
    },
  };
};

module.exports = {
  OpenAIBrainServiceError,
  createOpenAIBrainService,
};
