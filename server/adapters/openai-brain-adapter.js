"use strict";

const { createOpenAIProvider } = require("../providers/openai");

const createOpenAIBrainAdapter = (config) => {
  const provider = createOpenAIProvider(config);

  return {
    analyzeCreateInput(payload) {
      return provider.createAnalyze(payload);
    },
    analyzeImproveInput(payload) {
      return provider.improveAnalyze(payload);
    },
  };
};

module.exports = {
  createOpenAIBrainAdapter,
};
