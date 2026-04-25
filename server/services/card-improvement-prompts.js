"use strict";

const { clamp, toText } = require("../utils");

const PROMPT_VERSION = "adaptive-card-improvement-v1";
const MODES = Object.freeze({
  ENHANCE_EXISTING: "ENHANCE_EXISTING",
  REBUILD_FROM_SCRATCH: "REBUILD_FROM_SCRATCH",
});

const SCORE_KEYS = Object.freeze([
  "product_visibility",
  "product_attractiveness",
  "composition",
  "readability",
  "cleanliness",
  "modernity",
  "commercial_quality",
  "trustworthiness",
  "hierarchy",
  "marketplace_fit",
]);

const FINAL_QUALITY_ENFORCER = [
  "Final quality enforcer:",
  "- the product is the main visual focus",
  "- the result is commercially stronger than the original",
  "- text is readable and visually intentional",
  "- layout is clean, modern, and marketplace-ready",
  "- the design is not cluttered",
  "- product remains truthful and recognizable",
  "- decorative elements do not overpower the product",
  "- output is a vertical 3:4 marketplace card, 1200x1600 px",
  "- the before/after difference is visible even in thumbnail",
].join("\n");

const normalizeList = (value, limit) => {
  return (Array.isArray(value) ? value : [])
    .map((item) => toText(item))
    .filter(Boolean)
    .slice(0, clamp(limit, 1, 20, 6));
};

const normalizeScore = (value, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  if (numeric <= 1) return Math.round(numeric * 100);
  return clamp(numeric, 0, 100, fallback);
};

const normalizeScores = (value) => {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return SCORE_KEYS.reduce((accumulator, key) => {
    accumulator[key] = normalizeScore(source[key], 60);
    return accumulator;
  }, {});
};

const getAverageScore = (scores) => {
  const values = SCORE_KEYS.map((key) => Number(scores?.[key]) || 0);
  return values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 60;
};

const normalizeMode = (value, scores) => {
  const mode = toText(value).toUpperCase();
  if (mode === MODES.ENHANCE_EXISTING || mode === MODES.REBUILD_FROM_SCRATCH) return mode;

  const average = getAverageScore(scores);
  const criticalLowScores = SCORE_KEYS.filter((key) => Number(scores?.[key]) < 55).length;
  return average >= 72 && criticalLowScores <= 1
    ? MODES.ENHANCE_EXISTING
    : MODES.REBUILD_FROM_SCRATCH;
};

const buildContextBlock = (payload = {}) => {
  const importantFeatures = Array.isArray(payload.importantFeatures)
    ? payload.importantFeatures.map((item) => toText(item)).filter(Boolean).join(", ")
    : "";

  return [
    "Optional context:",
    "- productCategory: " + (toText(payload.productCategory || payload.productType) || "(unknown)"),
    "- marketplace: " + (toText(payload.marketplace) || "(unknown)"),
    "- language: " + (toText(payload.language) || "Russian"),
    "- stylePreference: " + (toText(payload.stylePreference) || "(none)"),
    "- mustPreserveText: " + (toText(payload.mustPreserveText) || "(none)"),
    "- importantFeatures: " + (importantFeatures || "(none)"),
    "- extraInstructions: " + (toText(payload.extraInstructions || payload.userPrompt || payload.prompt) || "(none)"),
  ].join("\n");
};

const buildAdaptiveCardAnalysisPrompt = (payload = {}) => {
  const userPrompt = toText(payload.userPrompt || payload.prompt || payload.customPrompt || payload.userText) || "(none)";
  const instructionText = toText(payload.instructionText);

  return [
    "You are an expert marketplace product card evaluator and e-commerce creative director.",
    "",
    "Analyze the uploaded marketplace product card image before any image generation.",
    "Evaluate the image on product visibility, product attractiveness, composition, text readability, cleanliness, modernity, commercial quality, trustworthiness, hierarchy, and marketplace suitability.",
    "",
    "Choose exactly one strategy:",
    "- ENHANCE_EXISTING: use this only when the card already has strong structure and mainly needs polish, better detail, clarity, readability, and commercial refinement.",
    "- REBUILD_FROM_SCRATCH: use this when the card is weak, cluttered, outdated, low-quality, poorly composed, text-heavy, visually unbalanced, or commercially ineffective.",
    "",
    "Return only valid JSON with this schema:",
    "{",
    '  "mode": "ENHANCE_EXISTING" | "REBUILD_FROM_SCRATCH",',
    '  "scores": {',
    '    "product_visibility": number,',
    '    "product_attractiveness": number,',
    '    "composition": number,',
    '    "readability": number,',
    '    "cleanliness": number,',
    '    "modernity": number,',
    '    "commercial_quality": number,',
    '    "trustworthiness": number,',
    '    "hierarchy": number,',
    '    "marketplace_fit": number',
    "  },",
    '  "strengths": string[],',
    '  "weaknesses": string[],',
    '  "product_category": string,',
    '  "recommended_style": string,',
    '  "must_preserve": string[],',
    '  "generation_prompt": string',
    "}",
    "",
    "Rules:",
    "- Scores are 0..100.",
    "- User-facing strings should be in Russian.",
    "- generation_prompt must be one production-ready prompt for image generation.",
    "- Preserve the real product identity, category, shape, material, branding, packaging, and visible product truth.",
    "- If the card is weak, generation_prompt must require a visible structural rebuild, not cosmetic shifts.",
    "- If the card is strong, generation_prompt must preserve the core concept and refine it carefully.",
    "- Always enforce a vertical 3:4 marketplace card, 1200x1600 px.",
    "",
    buildContextBlock(payload),
    "",
    "User instructions:",
    userPrompt,
    ...(instructionText ? ["", "Internal improvement instruction:", instructionText] : []),
  ].join("\n");
};

const normalizeAdaptiveCardAnalysis = (parsed, payload = {}) => {
  const scores = normalizeScores(parsed?.scores);
  const mode = normalizeMode(parsed?.mode || parsed?.improvementMode, scores);
  const productCategory =
    toText(parsed?.product_category || parsed?.productCategory || payload.productCategory || payload.productType)
    || "marketplace product";

  return {
    promptVersion: PROMPT_VERSION,
    mode,
    scores,
    averageScore: getAverageScore(scores),
    strengths: normalizeList(parsed?.strengths, 6),
    weaknesses: normalizeList(parsed?.weaknesses, 8),
    productCategory,
    recommendedStyle:
      toText(parsed?.recommended_style || parsed?.recommendedStyle)
      || (mode === MODES.ENHANCE_EXISTING ? "premium careful refinement" : "modern conversion-focused rebuild"),
    mustPreserve: normalizeList(parsed?.must_preserve || parsed?.mustPreserve, 6),
    rawGenerationPrompt: toText(parsed?.generation_prompt || parsed?.generationPrompt || parsed?.prompt),
  };
};

const buildEnhanceExistingPrompt = ({ analysis, payload, basePrompt }) => {
  return [
    "You are an expert e-commerce creative director.",
    "Improve the uploaded marketplace product card carefully without changing its core concept.",
    "The current card is already reasonably strong. Do not redesign it unnecessarily.",
    "Preserve the product, preserve the central selling idea, and improve the execution.",
    "",
    "Focus on stronger product detail, cleaner presentation, improved readability, better hierarchy, better polish, sharper textures, stronger clarity, cleaner spacing, premium feel, and better commercial attractiveness.",
    "Keep the product as the main visual focus. Do not overload the design.",
    "The final result should feel like a premium upgraded version of the original.",
    "",
    "Analysis strengths to preserve: " + (analysis.strengths.join("; ") || "(none)"),
    "Weaknesses to fix carefully: " + (analysis.weaknesses.join("; ") || "(none)"),
    "Product category: " + analysis.productCategory,
    "Recommended visual direction: " + analysis.recommendedStyle,
    "Must preserve: " + (analysis.mustPreserve.join("; ") || "same actual product and truthful visible details"),
    "",
    buildContextBlock(payload),
    "",
    basePrompt,
    FINAL_QUALITY_ENFORCER,
  ].filter(Boolean).join("\n");
};

const buildRebuildPrompt = ({ analysis, payload, basePrompt }) => {
  return [
    "You are an expert e-commerce creative director.",
    "Redesign the uploaded marketplace product card from scratch using the same actual product.",
    "The current card is weak or commercially ineffective. Do not preserve weak layout decisions.",
    "Build a stronger, cleaner, more modern, more conversion-oriented marketplace card.",
    "",
    "Goals: make the product the main hero, improve visual attractiveness, improve text structure, improve readability, improve trust, improve category fit, improve clarity, and improve modern commercial appeal.",
    "Use one dominant typographic move, grouped secondary information, poster-like hierarchy, strong line breaks, and edge-locked or modular text architecture.",
    "Do not solve the card with tiny labels, scattered micro-copy, small pills, or cosmetic shifts.",
    "Keep the product truthful and recognizable. Do not change the product category or invent misleading product features.",
    "",
    "Weaknesses requiring rebuild: " + (analysis.weaknesses.join("; ") || "(not specified)"),
    "Product category: " + analysis.productCategory,
    "Recommended visual direction: " + analysis.recommendedStyle,
    "Must preserve: " + (analysis.mustPreserve.join("; ") || "same actual product and truthful visible details"),
    "",
    buildContextBlock(payload),
    "",
    basePrompt,
    FINAL_QUALITY_ENFORCER,
  ].filter(Boolean).join("\n");
};

const buildAdaptiveCardGenerationPrompt = ({ analysis, payload, basePrompt }) => {
  const safeAnalysis = analysis || normalizeAdaptiveCardAnalysis({}, payload);
  const safeBasePrompt = toText(basePrompt || safeAnalysis.rawGenerationPrompt);
  const prompt = safeAnalysis.mode === MODES.ENHANCE_EXISTING
    ? buildEnhanceExistingPrompt({ analysis: safeAnalysis, payload, basePrompt: safeBasePrompt })
    : buildRebuildPrompt({ analysis: safeAnalysis, payload, basePrompt: safeBasePrompt });

  return prompt.trim();
};

module.exports = {
  MODES,
  PROMPT_VERSION,
  SCORE_KEYS,
  FINAL_QUALITY_ENFORCER,
  buildAdaptiveCardAnalysisPrompt,
  buildAdaptiveCardGenerationPrompt,
  normalizeAdaptiveCardAnalysis,
};
