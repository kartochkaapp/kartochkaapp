"use strict";

const crypto = require("node:crypto");

const { clamp, toText } = require("../utils");

const hashText = (value) => {
  const source = String(value || "");
  if (!source) return "";
  return crypto.createHash("sha256").update(source).digest("hex").slice(0, 16);
};

const normalizeList = (items, formatter, limit) => {
  const source = Array.isArray(items) ? items : [];
  return source
    .map(formatter)
    .map((item) => toText(item))
    .filter(Boolean)
    .slice(0, clamp(limit, 1, 50, 10));
};

const normalizeUniqueList = (items, formatter, limit) => {
  const normalized = normalizeList(items, formatter, limit);
  const seen = new Set();
  return normalized.filter((item) => {
    if (!item || seen.has(item)) return false;
    seen.add(item);
    return true;
  });
};

const buildCreateGenerationIntent = (payload = {}) => {
  const reference = payload.reference || payload.selectedTemplate || {};
  const settings = payload.settings || {};
  const characteristics = normalizeList(payload.characteristics, (item, index) => {
    const label = toText(item?.label);
    const value = toText(item?.value);
    if (!label && !value) return "";
    return String(index + 1) + ". " + [label, value].filter(Boolean).join(": ");
  }, 12);

  const imageInputs = normalizeUniqueList(
    [
      ...(Array.isArray(payload.imageDataUrls) ? payload.imageDataUrls : []),
      ...(Array.isArray(payload.imagePreviewUrls) ? payload.imagePreviewUrls : []),
      payload.referencePreviewUrl,
    ],
    (item) => item,
    4
  );

  const promptParts = [
    toText(payload.prompt || payload.customPrompt),
    toText(payload.userText),
    toText(payload.description),
    toText(payload.highlights),
    toText(payload.userNotes),
  ].filter(Boolean);

  return {
    requestId: toText(payload.requestId),
    title: toText(payload.title),
    shortDescription: toText(payload.shortDescription),
    description: toText(payload.description),
    highlights: toText(payload.highlights),
    userText: toText(payload.userText),
    marketplace: toText(payload.marketplace),
    promptMode: toText(payload.promptMode),
    prompt: promptParts.join("\n\n"),
    productType: toText(payload.productType || payload.productCategory || payload.insight?.category),
    productTypeId: toText(payload.productTypeId),
    productAngle: toText(payload.productAngle),
    productAnglePrompt: toText(payload.productAnglePrompt),
    cardGoal: toText(payload.cardGoal),
    generationMode: toText(payload.generationMode),
    densityMode: toText(payload.densityMode),
    referenceTitle: toText(reference.title),
    referenceDescription: toText(reference.description),
    referenceKind: toText(reference.kind),
    characteristics,
    settings: {
      visualStyle: toText(settings.visualStyleLabel || settings.visualStyle),
      infoDensity: toText(settings.infoDensityLabel || settings.infoDensity),
      backgroundMode: toText(settings.backgroundModeLabel || settings.backgroundMode),
      accentColor: toText(settings.accentColorLabel || settings.accentColor),
      referenceStrength: toText(settings.referenceStrengthLabel || settings.referenceStrength),
    },
    imageInputs,
    cardsCount: clamp(payload.cardsCount, 1, 5, 1),
  };
};

const buildOpenAIImagePrompt = (intent) => {
  const safeIntent = intent || {};
  const lines = [
    "Create one premium Russian marketplace product card image.",
    "Preserve the real product identity from any provided input image: silhouette, proportions, material, color, branding, packaging, and recognizable details.",
    "Do not replace the product with a different item. Do not add unrelated logos or marketplace badges unless they are part of the real product.",
    "Make a clean, conversion-oriented composition with the product as the hero, readable hierarchy, safe margins, and polished commercial lighting.",
    "All visible generated text must be in Russian.",
    "",
    "Product context:",
    "- title: " + (safeIntent.title || "(none)"),
    "- shortDescription: " + (safeIntent.shortDescription || "(none)"),
    "- productType: " + (safeIntent.productType || "(none)"),
    "- productAngle: " + (safeIntent.productAngle || "(none)"),
    "- productAnglePrompt: " + (safeIntent.productAnglePrompt || "(none)"),
    "- marketplace: " + (safeIntent.marketplace || "(none)"),
    "- cardGoal: " + (safeIntent.cardGoal || "conversion marketplace cover"),
    "- template: " + [safeIntent.referenceTitle, safeIntent.referenceDescription].filter(Boolean).join(" | "),
    "",
    "User and AI prompt:",
    safeIntent.prompt || "(none)",
    "",
    "Characteristics:",
    safeIntent.characteristics && safeIntent.characteristics.length ? safeIntent.characteristics.join("\n") : "(none)",
    "",
    "Visual settings:",
    "- visualStyle: " + (safeIntent.settings?.visualStyle || "(none)"),
    "- infoDensity: " + (safeIntent.settings?.infoDensity || "(none)"),
    "- backgroundMode: " + (safeIntent.settings?.backgroundMode || "(none)"),
    "- accentColor: " + (safeIntent.settings?.accentColor || "(none)"),
    "- referenceStrength: " + (safeIntent.settings?.referenceStrength || "(none)"),
  ];

  return lines.join("\n").trim();
};

module.exports = {
  buildCreateGenerationIntent,
  buildOpenAIImagePrompt,
  hashText,
};
