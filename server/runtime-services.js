"use strict";

const os = require("node:os");
const path = require("node:path");

const { getRuntimeConfig } = require("./config");
const { createOpenAIBrainAdapter } = require("./adapters/openai-brain-adapter");
const { createOpenRouterGenerationAdapter } = require("./adapters/openrouter-generation-adapter");
const { createOpenAIBrainService } = require("./services/openai-brain-service");
const { createGenerationService } = require("./services/generation-service");
const { createHistoryService } = require("./services/history-service");
const { createNanoBananaService } = require("./services/nano-banana-service");
const { createBillingService } = require("./services/billing-service");
const { createEnhanceCardHandler } = require("./routes/enhance-card");
const { createKartochkaHandlers } = require("./routes/kartochka");

let cachedRuntimeServices = null;

const resolveHistoryStoreFilePath = (runtime) => {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "kartochka-history-store.json");
  }

  return path.join(runtime.app.rootDir, "server", "data", "history-store.json");
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
  const openaiBrainService = createOpenAIBrainService({
    adapter: openaiBrainAdapter,
  });
  const generationService = createGenerationService({
    adapter: openrouterGenerationAdapter,
  });
  const historyService = createHistoryService({
    filePath: resolveHistoryStoreFilePath(runtime),
    maxItems: 30,
  });
  const billingService = createBillingService({
    rootDir: runtime.app.rootDir,
    starterTokens: runtime.billing.starterTokens,
    storeMode: runtime.billing.storeMode,
    promoSeedsRaw: runtime.billing.promoSeeds,
    firebaseAdmin: runtime.firebaseAdmin,
  });
  const nanoBananaService = createNanoBananaService({
    generationService,
  });

  cachedRuntimeServices = {
    runtime,
    kartochkaHandlers: createKartochkaHandlers({
      openaiBrainService,
      generationService,
      historyService,
      billingService,
    }),
    enhanceCardHandler: createEnhanceCardHandler({
      nanoBananaService,
      billingService,
    }),
  };

  return cachedRuntimeServices;
};

module.exports = {
  getRuntimeServices,
};
