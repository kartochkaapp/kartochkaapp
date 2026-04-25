"use strict";

const assert = require("node:assert/strict");

const {
  MODES,
  buildAdaptiveCardAnalysisPrompt,
  buildAdaptiveCardGenerationPrompt,
  normalizeAdaptiveCardAnalysis,
} = require("../server/services/card-improvement-prompts");

const runPromptBuilderTests = () => {
  const analysisPrompt = buildAdaptiveCardAnalysisPrompt({
    productType: "clothing_and_shoes",
    marketplace: "Wildberries",
    prompt: "Make the card stronger",
  });

  assert.ok(analysisPrompt.includes("ENHANCE_EXISTING"));
  assert.ok(analysisPrompt.includes("REBUILD_FROM_SCRATCH"));
  assert.ok(analysisPrompt.includes("1200x1600"));
  assert.ok(analysisPrompt.includes('"scores"'));
};

const runModeNormalizationTests = () => {
  const strong = normalizeAdaptiveCardAnalysis({
    scores: {
      product_visibility: 88,
      product_attractiveness: 82,
      composition: 78,
      readability: 80,
      cleanliness: 84,
      modernity: 76,
      commercial_quality: 79,
      trustworthiness: 85,
      hierarchy: 81,
      marketplace_fit: 83,
    },
  });

  assert.equal(strong.mode, MODES.ENHANCE_EXISTING);

  const weak = normalizeAdaptiveCardAnalysis({
    scores: {
      product_visibility: 45,
      composition: 38,
      readability: 32,
      cleanliness: 48,
      hierarchy: 40,
    },
  });

  assert.equal(weak.mode, MODES.REBUILD_FROM_SCRATCH);
};

const runGenerationPromptTests = () => {
  const rebuildAnalysis = normalizeAdaptiveCardAnalysis({
    mode: "REBUILD_FROM_SCRATCH",
    weaknesses: ["small headline", "scattered labels"],
    product_category: "home appliance",
    recommended_style: "poster headline block",
    must_preserve: ["same product shape"],
    generation_prompt: "Create a stronger card.",
  });
  const rebuildPrompt = buildAdaptiveCardGenerationPrompt({
    analysis: rebuildAnalysis,
    payload: { marketplace: "Ozon", language: "Russian" },
  });

  assert.ok(rebuildPrompt.includes("Redesign"));
  assert.ok(rebuildPrompt.includes("same product shape"));
  assert.ok(rebuildPrompt.includes("1200x1600"));
  assert.ok(rebuildPrompt.includes("before/after difference"));

  const enhanceAnalysis = normalizeAdaptiveCardAnalysis({
    mode: "ENHANCE_EXISTING",
    strengths: ["clear product"],
    weaknesses: ["low polish"],
  });
  const enhancePrompt = buildAdaptiveCardGenerationPrompt({
    analysis: enhanceAnalysis,
    payload: {},
    basePrompt: "Improve clarity.",
  });

  assert.ok(enhancePrompt.includes("without changing its core concept"));
  assert.ok(enhancePrompt.includes("premium upgraded version"));
};

const main = () => {
  runPromptBuilderTests();
  runModeNormalizationTests();
  runGenerationPromptTests();
  process.stdout.write("Adaptive card improvement tests passed\n");
};

main();
