"use strict";

const { toText } = require("../utils");
const { ApiRouteError } = require("../api-route-error");
const {
  DEFAULT_IMPROVE_INSTRUCTION_PATH,
} = require("../services/enhance-card-prompt-service");

const IMPROVE_INSTRUCTION_PATH = DEFAULT_IMPROVE_INSTRUCTION_PATH;
const ENHANCE_CARD_TIMEOUT_MS = 240000;

const ensureRouteObject = (value, message) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiRouteError({
      status: 400,
      code: "invalid_payload",
      message: message || "Request payload must be an object",
    });
  }
  return value;
};

const toBoolean = (value) => {
  if (value === true || value === false) return value;
  const normalized = toText(value).toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
};

const isSupportedImageDataUrl = (value) => {
  return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(String(value || "").trim());
};

const recordAiLog = async (aiLogService, entry) => {
  if (!aiLogService || typeof aiLogService.record !== "function") return;
  try {
    await aiLogService.record(entry);
  } catch (error) {
    // Logging should never break the product flow.
  }
};

const createEnhanceCardHandler = (deps) => {
  const nanoBananaService = deps?.nanoBananaService;
  const enhanceCardPromptService = deps?.enhanceCardPromptService;
  const billingService = deps?.billingService;
  const aiLogService = deps?.aiLogService;

  if (!nanoBananaService || typeof nanoBananaService.enhanceCard !== "function") {
    throw new Error("Enhance image service is not configured correctly");
  }
  if (!enhanceCardPromptService || typeof enhanceCardPromptService.buildPrompt !== "function") {
    throw new Error("Enhance card prompt service is not configured correctly");
  }
  if (!billingService || typeof billingService.runBillableAction !== "function") {
    throw new Error("Billing service is not configured correctly");
  }

  return async (body, requestContext) => {
    const requestBody = ensureRouteObject(body, "Invalid enhance-card request body");
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
    const preserveSourceTextExactly = toBoolean(requestBody.preserveSourceTextExactly);

    try {
      return await billingService.runBillableAction({
        actionCode: "enhance_card",
        requestContext,
        requestId: requestBody.requestId,
        meta: {
          flow: "improve_direct_image_generation",
        },
        operation: async () => {
          const promptResult = enhanceCardPromptService.buildPrompt({
            instructionPath: IMPROVE_INSTRUCTION_PATH,
            userPrompt,
            preserveSourceTextExactly,
          });

          await recordAiLog(aiLogService, {
            action: "enhanceCardPrompt",
            phase: "prompt_build",
            provider: "internal",
            status: "success",
            requestId: toText(requestBody.requestId),
            instructionSource: toText(promptResult?.debug?.instructionSource),
            instructionPath: toText(promptResult?.debug?.instructionPath || IMPROVE_INSTRUCTION_PATH),
            instructionHash: toText(promptResult?.debug?.instructionHash),
            requestText: userPrompt,
            responseText: toText(promptResult?.prompt),
            details: {
              preserveSourceTextExactly,
            },
            imageCount: 1,
            userIdHint: toText(requestContext?.userIdHint),
            userEmailHint: toText(requestContext?.userEmailHint),
          });

          const prompt = toText(promptResult?.prompt).trim();
          if (!prompt) {
            throw new ApiRouteError({
              status: 502,
              code: "missing_improve_prompt",
              message: "Improve prompt could not be built",
            });
          }

          const result = await nanoBananaService.enhanceCard({
            imageDataUrl,
            prompt,
            requestTimeoutMs: ENHANCE_CARD_TIMEOUT_MS,
            inputDetail: "low",
            maxRetries: 0,
          });

          await recordAiLog(aiLogService, {
            action: "enhanceCardGenerate",
            phase: "image_generation",
            provider: toText(result?.provider) || "openai_gpt_image_2",
            status: "success",
            requestId: toText(requestBody.requestId),
            requestText: toText(result?.result?.__debug?.requestText),
            responseText: toText(result?.result?.__debug?.responseText),
            imageCount: 1,
            userIdHint: toText(requestContext?.userIdHint),
            userEmailHint: toText(requestContext?.userEmailHint),
          });

          return result;
        },
      });
    } catch (error) {
      await recordAiLog(aiLogService, {
        action: "enhanceCard",
        phase: "pipeline",
        provider: "",
        status: "error",
        requestId: toText(requestBody.requestId),
        requestText: userPrompt,
        details: {
          preserveSourceTextExactly,
        },
        imageCount: 1,
        errorCode: toText(error?.code),
        errorMessage: toText(error?.message),
        userIdHint: toText(requestContext?.userIdHint),
        userEmailHint: toText(requestContext?.userEmailHint),
      });
      throw error;
    }
  };
};

module.exports = {
  IMPROVE_INSTRUCTION_PATH,
  createEnhanceCardHandler,
};
