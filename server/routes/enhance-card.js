"use strict";

const { toText } = require("../utils");
const { ApiRouteError } = require("./kartochka");

const IMPROVE_INSTRUCTION_PATH = "server/prompts/improve-card-instruction.md";

const ensureObject = (value, message) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiRouteError({
      status: 400,
      code: "invalid_payload",
      message: message || "Request payload must be an object",
    });
  }

  return value;
};

const isSupportedImageDataUrl = (value) => {
  return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(String(value || "").trim());
};

const createEnhanceCardHandler = (deps) => {
  const nanoBananaService = deps?.nanoBananaService;
  const openaiBrainService = deps?.openaiBrainService;
  const billingService = deps?.billingService;

  if (!nanoBananaService || typeof nanoBananaService.enhanceCard !== "function") {
    throw new Error("Nano Banana service is not configured correctly");
  }
  if (!openaiBrainService || typeof openaiBrainService.improveAnalyze !== "function") {
    throw new Error("OpenAI brain service is not configured correctly");
  }
  if (!billingService || typeof billingService.runBillableAction !== "function") {
    throw new Error("Billing service is not configured correctly");
  }

  return async (body, requestContext) => {
    const requestBody = ensureObject(body, "Invalid enhance-card request body");
    const imageDataUrl = toText(
      requestBody.imageDataUrl
      || requestBody.imageBase64
      || requestBody.image
    ).trim();

    if (!imageDataUrl) {
      throw new ApiRouteError({
        status: 400,
        code: "missing_image",
        message: "Image is required",
      });
    }

    if (!isSupportedImageDataUrl(imageDataUrl)) {
      throw new ApiRouteError({
        status: 400,
        code: "unsupported_image_format",
        message: "Only PNG, JPG and WEBP data URLs are supported",
      });
    }

    const userPrompt = toText(requestBody.userPrompt || requestBody.prompt).trim();
    return billingService.runBillableAction({
      actionCode: "enhance_card",
      requestContext,
      requestId: requestBody.requestId,
      meta: {
        flow: "improve_prompt_then_generate",
      },
      operation: async () => {
        const promptResult = await openaiBrainService.improveAnalyze({
          analysisIntent: "prompt",
          improveInstructionPromptPath: IMPROVE_INSTRUCTION_PATH,
          imageDataUrl,
          sourcePreviewUrl: imageDataUrl,
          userPrompt,
          prompt: userPrompt,
        });

        const prompt = toText(promptResult?.prompt).trim();
        if (!prompt) {
          throw new ApiRouteError({
            status: 502,
            code: "missing_improve_prompt",
            message: "OpenAI did not return an improve prompt",
          });
        }

        return nanoBananaService.enhanceCard({
          imageDataUrl,
          prompt,
        });
      },
    });
  };
};

module.exports = {
  IMPROVE_INSTRUCTION_PATH,
  createEnhanceCardHandler,
};
