"use strict";

const { HttpClientError, requestJson } = require("../http-client");
const { extractJsonObject, toText } = require("../utils");

const INTERNAL_PRODUCT_CATEGORIES = Object.freeze([
  "clothing_and_shoes",
  "accessories",
  "food_and_drinks",
  "beauty_and_care",
  "gadgets_and_tech",
  "home_and_interior",
]);

const CATEGORY_ALIAS_MAP = Object.freeze({
  clothing_and_shoes: "clothing_and_shoes",
  clothing: "clothing_and_shoes",
  clothes: "clothing_and_shoes",
  shoes: "clothing_and_shoes",
  footwear: "clothing_and_shoes",
  fashion: "clothing_and_shoes",
  apparel: "clothing_and_shoes",
  accessories: "accessories",
  accessory: "accessories",
  jewelry: "accessories",
  jewellery: "accessories",
  watches: "accessories",
  bags: "accessories",
  food_and_drinks: "food_and_drinks",
  food: "food_and_drinks",
  drink: "food_and_drinks",
  drinks: "food_and_drinks",
  beverage: "food_and_drinks",
  beverages: "food_and_drinks",
  grocery: "food_and_drinks",
  beauty_and_care: "beauty_and_care",
  beauty: "beauty_and_care",
  cosmetics: "beauty_and_care",
  skincare: "beauty_and_care",
  care: "beauty_and_care",
  gadgets_and_tech: "gadgets_and_tech",
  gadgets: "gadgets_and_tech",
  tech: "gadgets_and_tech",
  electronics: "gadgets_and_tech",
  devices: "gadgets_and_tech",
  home_and_interior: "home_and_interior",
  home: "home_and_interior",
  interior: "home_and_interior",
  decor: "home_and_interior",
});

const normalizeCategoryKey = (value) => {
  return toText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const mapAiCategoryToInternalCategory = (value) => {
  const key = normalizeCategoryKey(value);
  if (!key) return null;
  if (INTERNAL_PRODUCT_CATEGORIES.includes(key)) return key;
  return CATEGORY_ALIAS_MAP[key] || null;
};

const normalizeConfidence = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(1, parsed));
};

const extractMessageText = (response) => {
  const messageContent = response?.choices?.[0]?.message?.content;
  if (typeof messageContent === "string") return messageContent;
  if (!Array.isArray(messageContent)) return "";

  return messageContent
    .map((item) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      if (typeof item.text === "string") return item.text;
      return "";
    })
    .join("\n")
    .trim();
};

const normalizeSecondaryCandidates = (value, primaryCategory) => {
  const candidates = Array.isArray(value) ? value : [];
  const seen = new Set(primaryCategory ? [primaryCategory] : []);

  return candidates
    .map(mapAiCategoryToInternalCategory)
    .filter(Boolean)
    .filter((candidate) => {
      if (seen.has(candidate)) return false;
      seen.add(candidate);
      return true;
    })
    .slice(0, 3);
};

const buildDetectionPrompt = () => {
  return [
    "Classify the product in the image into exactly one internal category.",
    "Allowed categories:",
    "- clothing_and_shoes: clothes, shoes, hats, wearable fashion",
    "- accessories: bags, watches, glasses, jewelry, small style items",
    "- food_and_drinks: food, drinks, packaged grocery, beverages",
    "- beauty_and_care: cosmetics, skincare, care bottles, tubes, jars",
    "- gadgets_and_tech: electronics, gadgets, devices, tech accessories",
    "- home_and_interior: decor, furniture, home goods, interior items",
    "",
    "Return only strict JSON:",
    "{",
    '  "predicted_type": string | null,',
    '  "confidence": number,',
    '  "reason": string,',
    '  "secondary_candidates": string[]',
    "}",
    "",
    "If the product is not reliably visible, set predicted_type to null and confidence below 0.5.",
  ].join("\n");
};

const shouldRetry = (error) => {
  if (error instanceof HttpClientError) return Boolean(error.retryable) || error.status >= 500;
  return true;
};

const createProductTypeDetectionService = (config) => {
  const enabled = config?.enabled !== false;
  const apiKey = toText(config?.apiKey);
  const baseUrl = toText(config?.baseUrl) || "https://api.openai.com/v1";
  const endpoint = baseUrl.replace(/\/+$/, "") + "/chat/completions";
  const model = toText(config?.model) || "gpt-5.4";
  const timeoutMs = Math.max(1000, Number(config?.timeoutMs) || 20000);
  const confidenceThreshold = Math.max(0, Math.min(1, Number(config?.confidenceThreshold) || 0.65));
  const maxRetries = Math.max(0, Math.min(3, Math.floor(Number(config?.maxRetries) || 0)));
  const transport = typeof config?.requestJson === "function" ? config.requestJson : requestJson;

  const callOpenAi = async ({ imageDataUrl, requestId }) => {
    let attempt = 0;
    let lastError = null;

    while (attempt <= maxRetries) {
      try {
        return await transport({
          url: endpoint,
          method: "POST",
          timeoutMs,
          headers: {
            Authorization: "Bearer " + apiKey,
          },
          body: {
            model,
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: "You classify marketplace product images. Return only strict JSON.",
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: buildDetectionPrompt(),
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: imageDataUrl,
                      detail: "low",
                    },
                  },
                ],
              },
            ],
          },
        });
      } catch (error) {
        lastError = error;
        if (attempt >= maxRetries || !shouldRetry(error)) break;
        console.warn("[product_type_detection] retry", {
          requestId: toText(requestId),
          attempt: attempt + 1,
          code: toText(error?.code),
          status: Number(error?.status) || 0,
        });
      }
      attempt += 1;
    }

    throw lastError;
  };

  const detectType = async (payload = {}, context = {}) => {
    const requestId = toText(payload.requestId || context.requestId);
    const imageDataUrls = Array.isArray(payload.imageDataUrls) ? payload.imageDataUrls.filter((value) => toText(value)) : [];
    const imageDataUrl = toText(payload.imageDataUrl || imageDataUrls[0]);

    console.info("[product_type_detection] started", {
      requestId,
      enabled,
      model,
      imageCount: imageDataUrl ? 1 : 0,
    });

    if (!enabled) {
      return {
        success: false,
        detectedType: null,
        confidence: 0,
        source: "ai",
        model,
        secondaryCandidates: [],
        reason: "AI category detection is disabled",
      };
    }

    if (!apiKey) {
      return {
        success: false,
        detectedType: null,
        confidence: 0,
        source: "ai",
        model,
        secondaryCandidates: [],
        reason: "OPENAI_API_KEY is not configured",
      };
    }

    if (!imageDataUrl) {
      return {
        success: false,
        detectedType: null,
        confidence: 0,
        source: "ai",
        model,
        secondaryCandidates: [],
        reason: "No image was provided",
      };
    }

    const response = await callOpenAi({ imageDataUrl, requestId });
    const assistantText = extractMessageText(response);
    const parsed = extractJsonObject(assistantText);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn("[product_type_detection] invalid_response_format", { requestId });
      return {
        success: false,
        detectedType: null,
        confidence: 0,
        source: "ai",
        model,
        secondaryCandidates: [],
        reason: "Invalid AI response format",
      };
    }

    const mappedCategory = mapAiCategoryToInternalCategory(parsed.predicted_type);
    const confidence = normalizeConfidence(parsed.confidence);
    const secondaryCandidates = normalizeSecondaryCandidates(parsed.secondary_candidates, mappedCategory);
    const reason = toText(parsed.reason) || "AI category detection completed";
    const success = Boolean(mappedCategory) && confidence >= confidenceThreshold;

    if (!mappedCategory) {
      console.warn("[product_type_detection] invalid_category", {
        requestId,
        predictedType: toText(parsed.predicted_type),
        confidence,
      });
    } else if (!success) {
      console.info("[product_type_detection] low_confidence", {
        requestId,
        detectedType: mappedCategory,
        confidence,
        threshold: confidenceThreshold,
      });
    } else {
      console.info("[product_type_detection] succeeded", {
        requestId,
        detectedType: mappedCategory,
        confidence,
      });
    }

    return {
      success,
      detectedType: success ? mappedCategory : null,
      rawDetectedType: mappedCategory,
      confidence,
      source: "ai",
      model,
      secondaryCandidates,
      reason,
    };
  };

  return {
    detectType,
    mapAiCategoryToInternalCategory,
    internalCategories: INTERNAL_PRODUCT_CATEGORIES,
  };
};

module.exports = {
  INTERNAL_PRODUCT_CATEGORIES,
  createProductTypeDetectionService,
  mapAiCategoryToInternalCategory,
};
