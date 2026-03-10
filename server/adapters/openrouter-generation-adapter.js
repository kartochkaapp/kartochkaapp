"use strict";

const { createOpenRouterProvider } = require("../providers/openrouter");

const createOpenRouterGenerationAdapter = (config) => {
  const provider = createOpenRouterProvider(config);

  return {
    executeCreateGeneration(payload) {
      return provider.createGenerate(payload);
    },
    executeImproveGeneration(payload) {
      return provider.improveGenerate(payload);
    },
  };
};

module.exports = {
  createOpenRouterGenerationAdapter,
};
