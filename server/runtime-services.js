"use strict";

const os = require("node:os");
const path = require("node:path");

const { getRuntimeConfig } = require("./config");
const { createOpenAIBrainAdapter } = require("./adapters/openai-brain-adapter");
const { createOpenAIImageGenerationAdapter } = require("./adapters/openai-image-generation-adapter");
const { createOpenRouterGenerationAdapter } = require("./adapters/openrouter-generation-adapter");
const { createOpenAIBrainService } = require("./services/openai-brain-service");
const { createGenerationService } = require("./services/generation-service");
const { createGeneratedAssetService } = require("./services/generated-asset-service");
const { createFourMarketplaceCardsService } = require("./services/four-marketplace-cards-service");
const { createImageEnhancementPipeline } = require("./services/image");
const { createHistoryService } = require("./services/history-service");
const { createHistoryAssetService } = require("./services/history-asset-service");
const { createAiLogService } = require("./services/ai-log-service");
const { createBillingService } = require("./services/billing-service");
const { createEnhanceCardPromptService } = require("./services/enhance-card-prompt-service");
const { createNanoBananaService } = require("./services/nano-banana-service");
const { createProductTypeDetectionService } = require("./services/product-type-detection-service");
const { createTextReplaceService } = require("./services/text-replace-service");
const { createEnhanceCardHandler } = require("./routes/enhance-card");
const { createKartochkaHandlers } = require("./routes/kartochka");
const { createProductHandlers } = require("./routes/product");

let cachedRuntimeServices = null;

const resolveHistoryStoreFilePath = (runtime) => {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "";
  }

  return path.join(runtime.app.rootDir, "server", "data", "history-store.json");
};

const resolveAiLogStoreFilePath = (runtime) => {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "kartochka-ai-log-store.json");
  }

  return path.join(runtime.app.rootDir, "server", "data", "ai-log-store.json");
};

const getRuntimeServices = () => {
  if (cachedRuntimeServices) return cachedRuntimeServices;

  const runtime = getRuntimeConfig();
  const openaiBrainAdapter = createOpenAIBrainAdapter({
    ...runtime.openai,
    timeoutMs: runtime.app.requestTimeoutMs,
  });
  const openrouterGenerationAdapter = createOpenRouterGenerationAdapter({
    ...runtime.openrouter,
    timeoutMs: runtime.app.requestTimeoutMs,
  });
  const openaiImageGenerationAdapter = createOpenAIImageGenerationAdapter({
    ...runtime.openaiImage,
    timeoutMs: runtime.openaiImage.timeoutMs,
  });
  const openaiBrainService = createOpenAIBrainService({
    adapter: openaiBrainAdapter,
  });
  const textReplaceService = createTextReplaceService({
    apiKey: runtime.openrouter.apiKey,
    baseUrl: runtime.openrouter.baseUrl,
    referer: runtime.openrouter.referer,
    title: runtime.openrouter.title,
    timeoutMs: runtime.app.requestTimeoutMs,
    locatorModel: runtime.openrouter.textReplaceLocatorModel,
    editorModel: runtime.openrouter.textReplaceEditorModel,
    defaultImageModel: runtime.openrouter.imageModel || runtime.openrouter.model,
  });
  const generationService = createGenerationService({
    adapter: openrouterGenerationAdapter,
    createAdapter: openaiImageGenerationAdapter,
    improveAdapter: openaiImageGenerationAdapter,
    secondaryAdapters: [],
    textReplaceService,
  });
  const historyService = createHistoryService({
    filePath: resolveHistoryStoreFilePath(runtime),
    maxItems: runtime.history.maxItems,
    storeMode: runtime.history.storeMode,
    firebaseAdmin: runtime.firebaseAdmin,
  });
  const historyAssetService = createHistoryAssetService({
    rootDir: runtime.app.rootDir,
    firebaseAdmin: runtime.firebaseAdmin,
  });
  const generatedAssetService = createGeneratedAssetService({
    rootDir: runtime.app.rootDir,
  });
  const imageEnhancementService = createImageEnhancementPipeline({
    ...runtime.imageEnhancement,
    targetWidth: 2400,
    targetHeight: 3200,
  });
  const fourMarketplaceCardsService = createFourMarketplaceCardsService({
    generationService,
    generatedAssetService,
    imageEnhancementService,
  });
  const aiLogService = createAiLogService({
    rootDir: runtime.app.rootDir,
    filePath: resolveAiLogStoreFilePath(runtime),
    maxItems: 400,
    firebaseAdmin: runtime.firebaseAdmin,
  });
  const billingService = createBillingService({
    rootDir: runtime.app.rootDir,
    starterTokens: runtime.billing.starterTokens,
    storeMode: runtime.billing.storeMode,
    promoSeedsRaw: runtime.billing.promoSeeds,
    firebaseAdmin: runtime.firebaseAdmin,
  });
  const enhanceCardPromptService = createEnhanceCardPromptService();
  const productTypeDetectionService = createProductTypeDetectionService({
    apiKey: runtime.openai.apiKey,
    baseUrl: runtime.openai.baseUrl,
    ...runtime.categoryDetection,
  });

  cachedRuntimeServices = {
    runtime,
    kartochkaHandlers: createKartochkaHandlers({
      openaiBrainService,
      generationService,
      generatedAssetService,
      fourMarketplaceCardsService,
      historyService,
      historyAssetService,
      billingService,
      aiLogService,
    }),
    enhanceCardHandler: createEnhanceCardHandler({
      nanoBananaService: createNanoBananaService({ generationService }),
      enhanceCardPromptService,
      billingService,
      aiLogService,
    }),
    productHandlers: createProductHandlers({
      productTypeDetectionService,
      aiLogService,
    }),
  };

  return cachedRuntimeServices;
};

module.exports = {
  getRuntimeServices,
};
