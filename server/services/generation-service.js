"use strict";

const { toText } = require("../utils");

class GenerationServiceError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "Generation service error"));
    this.name = "GenerationServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "generation_service_error";
    this.details = params?.details;
  }
}

const ensureResultList = (value, message) => {
  if (!Array.isArray(value)) {
    throw new GenerationServiceError({
      status: 500,
      code: "invalid_generation_response",
      message: message || "Generation adapter must return an array",
      details: value,
    });
  }
  return value;
};

const createGenerationService = (deps) => {
  const adapter = deps?.adapter;
  if (!adapter || typeof adapter.executeCreateGeneration !== "function" || typeof adapter.executeImproveGeneration !== "function") {
    throw new GenerationServiceError({
      status: 500,
      code: "invalid_adapter",
      message: "Generation adapter is not configured",
    });
  }

  return {
    async createGenerate(payload) {
      const results = await adapter.executeCreateGeneration(payload || {});
      return ensureResultList(results, "createGenerate must return an array");
    },
    async improveGenerate(payload) {
      const results = await adapter.executeImproveGeneration(payload || {});
      return ensureResultList(results, "improveGenerate must return an array");
    },
  };
};

module.exports = {
  GenerationServiceError,
  createGenerationService,
};
