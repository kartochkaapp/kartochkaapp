"use strict";

const { toText } = require("../utils");
const OUTPUT_SIZE = "1200x1600";
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
    size: OUTPUT_SIZE,
    referenceStyle: false,
    requestTimeoutMs: Number(payload?.requestTimeoutMs) || 0,
    inputDetail: toText(payload?.inputDetail),
    maxRetries: Number(payload?.maxRetries) || 0,
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
          message: "Image is required for enhanceCard",
        });
      }

      if (!generationService || typeof generationService.improveGenerate !== "function") {
        throw new NanoBananaServiceError({
          status: 500,
          code: "image_generation_not_configured",
          message: "Image generation service is not configured",
        });
      }

      let results;
      try {
        results = await generationService.improveGenerate(buildImprovePayload(payload));
      } catch (error) {
        throw new NanoBananaServiceError({
          status: Number.isFinite(Number(error?.status)) ? Number(error.status) : 502,
          code: toText(error?.code) || "image_generation_failed",
          message: toText(error?.message) || "Image generation failed",
          details: error?.details || null,
        });
      }

      const firstResult = Array.isArray(results) ? results[0] : null;
      const resultImageUrl = toText(firstResult?.previewUrl || firstResult?.url).trim();
      if (!resultImageUrl) {
        throw new NanoBananaServiceError({
          status: 502,
          code: "image_generation_empty_result",
          message: "Image generation returned an empty image result",
        });
      }

      if (resultImageUrl === imageDataUrl) {
        throw new NanoBananaServiceError({
          status: 502,
          code: "image_generation_unchanged_result",
          message: "Image generation returned the unchanged source image",
        });
      }

      // Strip large image blobs from result metadata to keep the response JSON small.
      // previewUrl/url contain the same base64 image as imageDataUrl — including them
      // would triple the response size (~25–45 MB) and freeze the browser during JSON.parse.
      const resultMeta = firstResult ? { ...firstResult } : {};
      delete resultMeta.previewUrl;
      delete resultMeta.url;

      return {
        ok: true,
        provider: toText(firstResult?.provider) || "openai_gpt_image_2",
        prompt: toText(payload?.prompt),
        imageDataUrl: resultImageUrl,
        result: resultMeta,
      };
    },
  };
};

module.exports = {
  NanoBananaServiceError,
  createNanoBananaService,
};
