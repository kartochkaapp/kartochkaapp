"use strict";

const { toText } = require("../utils");
const DEFAULT_ANALYSIS_SUMMARY =
  "Сделай карточку чище, премиальнее и читаемее, но сохрани сам товар без искажений.";

class NanoBananaServiceError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "Nano Banana service error"));
    this.name = "NanoBananaServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 502;
    this.code = toText(params?.code) || "nano_banana_error";
    this.details = params?.details || null;
  }
}

const buildImprovePayload = (payload) => {
  const sourcePreviewUrl = toText(payload?.imageDataUrl).trim();
  const prompt = toText(payload?.prompt).trim();

  return {
    mode: "ai",
    variantsCount: 1,
    prompt,
    sourcePreviewUrl,
    referenceStyle: false,
    analysis: {
      summary: DEFAULT_ANALYSIS_SUMMARY,
      recommendations: prompt ? [prompt] : [],
    },
  };
};

const createNanoBananaService = (options) => {
  const generationService = options?.generationService;

  return {
    /**
     * Temporary stub for the future Nano Banana integration.
     * The real provider call can be placed here without changing the route contract.
     *
     * @param {{
     *   imageDataUrl: string,
     *   prompt: string,
     * }} payload
     */
    async enhanceCard(payload) {
      const imageDataUrl = toText(payload?.imageDataUrl).trim();
      if (!imageDataUrl) {
        throw new NanoBananaServiceError({
          status: 400,
          code: "missing_image",
          message: "Image is required for Nano Banana enhanceCard",
        });
      }

      if (!generationService || typeof generationService.improveGenerate !== "function") {
        throw new NanoBananaServiceError({
          status: 500,
          code: "nano_banana_not_configured",
          message: "Nano Banana generation service is not configured",
        });
      }

      let results;
      try {
        results = await generationService.improveGenerate(buildImprovePayload(payload));
      } catch (error) {
        throw new NanoBananaServiceError({
          status: Number.isFinite(Number(error?.status)) ? Number(error.status) : 502,
          code: toText(error?.code) || "nano_generation_failed",
          message: toText(error?.message) || "Nano Banana image generation failed",
          details: error?.details || null,
        });
      }

      const firstResult = Array.isArray(results) ? results[0] : null;
      const resultImageUrl = toText(firstResult?.previewUrl || firstResult?.url).trim();
      if (!resultImageUrl) {
        throw new NanoBananaServiceError({
          status: 502,
          code: "nano_empty_result",
          message: "Nano Banana returned an empty image result",
        });
      }

      if (resultImageUrl === imageDataUrl) {
        throw new NanoBananaServiceError({
          status: 502,
          code: "nano_unchanged_result",
          message: "Nano Banana returned the unchanged source image",
        });
      }

      return {
        ok: true,
        provider: "nano-banana-openrouter",
        prompt: toText(payload?.prompt),
        imageDataUrl: resultImageUrl,
        imageUrl: resultImageUrl,
        result: firstResult,
      };
    },
  };
};

module.exports = {
  NanoBananaServiceError,
  createNanoBananaService,
};
