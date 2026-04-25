"use strict";

const assert = require("node:assert/strict");

const { createGenerationService } = require("../server/services/generation-service");
const { createOpenAIImageProvider } = require("../server/providers/openai-image");

const createAdapter = (id, label, handler, improveHandler) => ({
  id,
  label,
  async executeCreateGeneration(payload) {
    return handler(payload);
  },
  async executeImproveGeneration(payload) {
    return typeof improveHandler === "function" ? improveHandler(payload) : [];
  },
  async executeTemplatePreview() {
    return "data:image/png;base64,template";
  },
});

const SAMPLE_IMAGE = "data:image/png;base64,iVBORw0KGgo=";
const SAMPLE_B64 = "iVBORw0KGgo" + "A".repeat(320);

const runGenerationServiceTests = async () => {
  let legacyCreateCalled = false;
  let legacyImproveCalled = false;
  const legacyAdapter = createAdapter(
    "legacy_image_tools",
    "Legacy Image Tools",
    async () => {
      legacyCreateCalled = true;
      return [
        {
          id: "legacy-1",
          previewUrl: "data:image/png;base64,legacy",
          title: "Legacy",
        },
      ];
    },
    async () => {
      legacyImproveCalled = true;
      return [
        {
          id: "improve-1",
          previewUrl: "data:image/png;base64,improve",
          title: "Improve",
        },
      ];
    }
  );
  const openaiCreateAdapter = createAdapter(
    "openai_gpt_image_2",
    "GPT Image 2",
    async () => [
      {
        id: "openai-1",
        previewUrl: "data:image/png;base64,openai",
        title: "OpenAI",
      },
    ],
    async () => [
      {
        id: "openai-improve-1",
        previewUrl: "data:image/png;base64,openai-improve",
        title: "OpenAI Improve",
      },
    ]
  );

  const service = createGenerationService({
    adapter: legacyAdapter,
    createAdapter: openaiCreateAdapter,
    improveAdapter: openaiCreateAdapter,
    secondaryAdapters: [],
  });
  const success = await service.createGenerate({ requestId: "req-success", title: "Test" });
  assert.equal(success.length, 1);
  assert.equal(success[0].provider, "openai_gpt_image_2");
  assert.equal(legacyCreateCalled, false);

  const improved = await service.improveGenerate({ requestId: "req-improve" });
  assert.equal(improved.length, 1);
  assert.equal(improved[0].provider, "openai_gpt_image_2");
  assert.equal(legacyImproveCalled, false);

  const failingService = createGenerationService({
    adapter: legacyAdapter,
    createAdapter: createAdapter("openai_gpt_image_2", "GPT Image 2", async () => {
      throw Object.assign(new Error("openai failed"), { code: "openai_failed" });
    }),
    improveAdapter: openaiCreateAdapter,
    secondaryAdapters: [],
  });

  await assert.rejects(
    () => failingService.createGenerate({ requestId: "req-failed" }),
    (error) => error && error.code === "openai_failed"
  );
};

const runOpenAIProviderTests = async () => {
  const calls = [];
  const provider = createOpenAIImageProvider({
    apiKey: "test-key",
    model: "gpt-image-2",
    responseModel: "gpt-5.4-mini",
    quality: "high",
    size: "1200x1600",
    maxRetries: 0,
    requestJson: async (params) => {
      calls.push(params);
      return {
        output: [
          {
            type: "image_generation_call",
            result: SAMPLE_B64,
          },
        ],
      };
    },
  });

  const results = await provider.createGenerate({
    requestId: "openai-test",
    title: "Green jacket",
    imageDataUrls: [SAMPLE_IMAGE],
    productType: "clothing_and_shoes",
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].provider, "openai_gpt_image_2");
  assert.equal(results[0].status, "completed");
  assert.ok(results[0].previewUrl.startsWith("data:image/png;base64,"));
  assert.equal(results[0].metadata.model, "gpt-image-2");
  assert.equal(calls[0].url.endsWith("/responses"), true);
  assert.equal(calls[0].body.tools[0].model, "gpt-image-2");
  assert.equal(calls[0].body.tools[0].quality, "high");
  assert.equal(calls[0].body.tools[0].size, "1200x1600");

  const improved = await provider.improveGenerate({
    requestId: "openai-improve-test",
    sourcePreviewUrl: SAMPLE_IMAGE,
    prompt: "Make it cleaner",
  });

  assert.equal(improved.length, 1);
  assert.equal(improved[0].provider, "openai_gpt_image_2");
  assert.equal(improved[0].metadata.flow, "improve_generate_openai_image");
  assert.equal(calls[1].body.tools[0].size, "1200x1600");
  assert.ok(calls[1].body.input[0].content[0].text.includes("uploaded marketplace product card image"));
  assert.ok(calls[1].body.input[0].content[0].text.includes("Make it cleaner"));

  const dedupeCalls = [];
  const dedupeProvider = createOpenAIImageProvider({
    apiKey: "test-key",
    model: "gpt-image-2",
    responseModel: "gpt-5.4-mini",
    quality: "medium",
    size: "1024x1024",
    maxRetries: 0,
    requestJson: async (params) => {
      dedupeCalls.push(params);
      return {
        output: [
          {
            type: "image_generation_call",
            result: SAMPLE_B64,
          },
        ],
      };
    },
  });

  const dedupeResults = await dedupeProvider.createGenerate({
    requestId: "openai-dedupe-test",
    title: "Bag",
    imageDataUrls: [SAMPLE_IMAGE],
    imagePreviewUrls: [SAMPLE_IMAGE],
    size: "1200x1600",
    quality: "high",
  });

  assert.equal(dedupeResults.length, 1);
  assert.equal(dedupeResults[0].metadata.imageCount, 1);
  assert.equal(dedupeCalls[0].body.tools[0].size, "1200x1600");
  assert.equal(dedupeCalls[0].body.tools[0].quality, "high");
  assert.equal(dedupeCalls[0].body.input[0].content.filter((item) => item.type === "input_image").length, 1);
};

const runFrontendWiringTests = () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const rootDir = path.resolve(__dirname, "..");
  const appJs = fs.readFileSync(path.join(rootDir, "app.js"), "utf8");
  const servicesJs = fs.readFileSync(path.join(rootDir, "services", "kartochka-services.js"), "utf8");
  const historyCore = fs.readFileSync(path.join(rootDir, "server", "services", "history-store-core.js"), "utf8");
  const runtimeServices = fs.readFileSync(path.join(rootDir, "server", "runtime-services.js"), "utf8");

  assert.ok(appJs.includes("getFirstSelectableCreateResult"), "create flow should prefer selectable provider results");
  assert.ok(appJs.includes("generation_variant_selected"), "variant selection analytics event should be emitted");
  assert.ok(appJs.includes("selectedResultId: historyPayload.selectedResultId"), "history should persist selected result");
  assert.ok(servicesJs.includes("providerLabel"), "client result normalization should preserve provider labels");
  assert.ok(servicesJs.includes("status !== \"failed\""), "client result normalization should allow failed provider cards only explicitly");
  assert.ok(historyCore.includes("selectedProvider"), "server history should persist selected provider metadata");
  assert.ok(runtimeServices.includes("createAdapter: openaiImageGenerationAdapter"), "create generation should use GPT Image 2");
  assert.ok(runtimeServices.includes("improveAdapter: openaiImageGenerationAdapter"), "improve generation should use GPT Image 2");
  assert.ok(runtimeServices.includes("secondaryAdapters: []"), "create generation should return a single image result");
};

const main = async () => {
  await runGenerationServiceTests();
  await runOpenAIProviderTests();
  runFrontendWiringTests();
  process.stdout.write("OpenAI image generation tests passed\n");
};

main().catch((error) => {
  process.stderr.write((error && error.stack) ? error.stack + "\n" : String(error) + "\n");
  process.exit(1);
});
