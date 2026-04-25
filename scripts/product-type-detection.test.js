"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT_DIR = path.resolve(__dirname, "..");
const {
  createProductTypeDetectionService,
  mapAiCategoryToInternalCategory,
} = require("../server/services/product-type-detection-service");
const { createProductHandlers } = require("../server/routes/product");

const SAMPLE_IMAGE = "data:image/png;base64,iVBORw0KGgo=";

const createResponse = (payload) => ({
  choices: [
    {
      message: {
        content: JSON.stringify(payload),
      },
    },
  ],
});

const createService = (handler, overrides = {}) => {
  return createProductTypeDetectionService({
    enabled: true,
    apiKey: "test-api-key",
    model: "gpt-5.4",
    confidenceThreshold: 0.65,
    timeoutMs: 1000,
    maxRetries: 0,
    requestJson: handler,
    ...overrides,
  });
};

const readText = (relativePath) => {
  return fs.readFileSync(path.join(ROOT_DIR, relativePath), "utf8");
};

const runBackendTests = async () => {
  assert.equal(mapAiCategoryToInternalCategory("clothing_and_shoes"), "clothing_and_shoes");
  assert.equal(mapAiCategoryToInternalCategory("fashion"), "clothing_and_shoes");
  assert.equal(mapAiCategoryToInternalCategory("not_a_category"), null);

  const successService = createService(async () => createResponse({
    predicted_type: "clothing_and_shoes",
    confidence: 0.94,
    reason: "Visible wearable product",
    secondary_candidates: ["accessories"],
  }));
  const success = await successService.detectType({ imageDataUrls: [SAMPLE_IMAGE] });
  assert.equal(success.success, true);
  assert.equal(success.detectedType, "clothing_and_shoes");
  assert.equal(success.confidence, 0.94);
  assert.deepEqual(success.secondaryCandidates, ["accessories"]);

  const invalidCategoryService = createService(async () => createResponse({
    predicted_type: "vehicle",
    confidence: 0.91,
    reason: "Invalid internal category",
    secondary_candidates: ["food_and_drinks"],
  }));
  const invalidCategory = await invalidCategoryService.detectType({ imageDataUrls: [SAMPLE_IMAGE] });
  assert.equal(invalidCategory.success, false);
  assert.equal(invalidCategory.detectedType, null);
  assert.equal(invalidCategory.rawDetectedType, null);

  const lowConfidenceService = createService(async () => createResponse({
    predicted_type: "gadgets_and_tech",
    confidence: 0.42,
    reason: "Unclear product crop",
    secondary_candidates: [],
  }));
  const lowConfidence = await lowConfidenceService.detectType({ imageDataUrls: [SAMPLE_IMAGE] });
  assert.equal(lowConfidence.success, false);
  assert.equal(lowConfidence.detectedType, null);
  assert.equal(lowConfidence.rawDetectedType, "gadgets_and_tech");

  const logs = [];
  const handlers = createProductHandlers({
    productTypeDetectionService: {
      async detectType() {
        throw new Error("upstream unavailable");
      },
    },
    aiLogService: {
      async record(entry) {
        logs.push(entry);
      },
    },
  });
  const fallback = await handlers.detectType({ payload: { imageDataUrls: [SAMPLE_IMAGE] } }, {});
  assert.equal(fallback.success, false);
  assert.equal(fallback.detectedType, null);
  assert.equal(fallback.source, "ai");
  assert.equal(logs.length, 1);
  assert.equal(logs[0].status, "error");
};

const runFrontendWiringTests = () => {
  const appJs = readText("app.js");
  const indexHtml = readText("index.html");
  const servicesJs = readText(path.join("services", "kartochka-services.js"));
  const vercelConfig = JSON.parse(readText("vercel.json"));
  const rewrites = Array.isArray(vercelConfig.rewrites) ? vercelConfig.rewrites : [];

  assert.ok(indexHtml.includes('id="createIsClothingToggle"'), "product type toggle should be present");
  assert.ok(indexHtml.includes('id="createAngleSuggestions"'), "angle suggestion block should be present");
  assert.ok(indexHtml.includes('id="createProductRoutingSummary"'), "product routing summary should be present");
  assert.ok(appJs.includes('createIsClothingToggle?.addEventListener("change"'), "manual product type toggle should update routing");
  assert.ok(appJs.includes('product_type_manual_override'), "manual override analytics event should be logged");
  assert.ok(appJs.includes("buildCreateProductRoutingSummary"), "routing summary should be derived from the current mode and angle");
  assert.ok(appJs.includes("renderCreateAngleOptionsInto(createAngleSuggestions"), "angle cards should render from current category state");
  assert.ok(appJs.includes("createProductTypeDetectionRequestId"), "stale AI requests should be tracked");
  assert.ok(appJs.includes("createProductTypeDetectionFileKey"), "repeat uploads should be deduped by file key");
  assert.ok(appJs.includes("productAnglePrompt: productContext.productAnglePrompt"), "generation payload should include chosen angle prompt");
  assert.ok(servicesJs.includes("productDetectType"), "client service should expose productDetectType");
  assert.ok(
    rewrites.some((entry) => entry.source === "/api/product/detect-type" && entry.destination === "/api/kartochka/createAnalyze.js?action=productDetectType"),
    "Vercel rewrite for product detect-type endpoint should reuse an existing function"
  );
};

const main = async () => {
  await runBackendTests();
  runFrontendWiringTests();
  process.stdout.write("Product type detection tests passed\n");
};

main().catch((error) => {
  process.stderr.write((error && error.stack) ? error.stack + "\n" : String(error) + "\n");
  process.exit(1);
});
