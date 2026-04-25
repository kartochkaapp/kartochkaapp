"use strict";

const { createOpenRouterProvider } = require("../providers/openrouter");

const createOpenRouterGenerationAdapter = (config) => {
  const provider = createOpenRouterProvider(config);

  return {
    id: "nano_banana",
    label: "Nano Banana",
    executeCreateGeneration(payload) {
      return provider.createGenerate(payload);
    },
    executeImproveGeneration(payload) {
      return provider.improveGenerate(payload);
    },
    executeTemplatePreview(promptText) {
      return provider.generateTemplatePreview(promptText);
    },
  };
};

module.exports = {
  createOpenRouterGenerationAdapter,
};
