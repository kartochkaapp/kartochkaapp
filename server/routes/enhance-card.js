"use strict";

const crypto = require("node:crypto");

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

const hashText = (value) => {
  const source = String(value || "");
  if (!source) return "";
  return crypto.createHash("sha256").update(source).digest("hex").slice(0, 16);
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
  const openaiBrainService = deps?.openaiBrainService;
  const billingService = deps?.billingService;
  const aiLogService = deps?.aiLogService;

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
    try {
      return await billingService.runBillableAction({
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

          await recordAiLog(aiLogService, {
            action: "enhanceCardPrompt",
            phase: "prompt_generation",
            provider: "openai",
            status: "success",
            requestId: toText(requestBody.requestId),
            model: toText(promptResult?.__debug?.model),
            reasoningEffort: toText(promptResult?.__debug?.reasoningEffort),
            instructionSource: toText(promptResult?.__debug?.instructionSource),
            instructionPath: toText(promptResult?.__debug?.instructionPath || IMPROVE_INSTRUCTION_PATH),
            instructionHash: toText(promptResult?.__debug?.instructionHash),
            promptHash: toText(promptResult?.__debug?.promptHash || hashText(promptResult?.prompt)),
            promptPreview: toText(promptResult?.prompt).slice(0, 1200),
            promptLength: toText(promptResult?.prompt).length,
            responseHash: toText(promptResult?.__debug?.responseHash),
            responsePreview: toText(promptResult?.__debug?.responsePreview),
            responseLength: Number(promptResult?.__debug?.responseLength) || 0,
            imageCount: 1,
            userIdHint: toText(requestContext?.userIdHint),
            userEmailHint: toText(requestContext?.userEmailHint),
          });

          const prompt = toText(promptResult?.prompt).trim();
          if (!prompt) {
            throw new ApiRouteError({
              status: 502,
              code: "missing_improve_prompt",
              message: "OpenAI did not return an improve prompt",
            });
          }

          const result = await nanoBananaService.enhanceCard({
            imageDataUrl,
            prompt,
          });

          await recordAiLog(aiLogService, {
            action: "enhanceCardGenerate",
            phase: "image_generation",
            provider: "openrouter",
            status: "success",
            requestId: toText(requestBody.requestId),
            promptHash: hashText(prompt),
            promptPreview: prompt.slice(0, 1200),
            promptLength: prompt.length,
            responseHash: toText(result?.result?.__debug?.responseHash),
            responsePreview: toText(result?.result?.__debug?.responsePreview),
            responseLength: Number(result?.result?.__debug?.responseLength) || 0,
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
        promptHash: hashText(userPrompt),
        promptPreview: userPrompt.slice(0, 1200),
        promptLength: userPrompt.length,
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
