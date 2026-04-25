"use strict";

const {
  PROVIDER_ID,
  PROVIDER_LABEL,
  createOpenAIImageProvider,
} = require("../providers/openai-image");

const createOpenAIImageGenerationAdapter = (config) => {
  const provider = createOpenAIImageProvider(config);

  return {
    id: PROVIDER_ID,
    label: PROVIDER_LABEL,
    enabled: config?.enabled !== false,
    executeCreateGeneration(payload) {
      return provider.createGenerate(payload);
    },
    executeImproveGeneration(payload) {
      return provider.improveGenerate(payload);
    },
    executeDirectImageGeneration(payload) {
      return provider.directImageGenerate(payload);
    },
  };
};

module.exports = {
  createOpenAIImageGenerationAdapter,
};
