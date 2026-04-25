"use strict";

const assert = require("node:assert/strict");

const {
  createAbortError,
  createEnhanceCardApi,
} = require("../enhance-card-service");
const { useEnhanceCardState } = require("../enhance-card-state");
const {
  buildDirectImprovePrompt,
  createEnhanceCardPromptService,
} = require("../server/services/enhance-card-prompt-service");
const { createOpenAIImageProvider } = require("../server/providers/openai-image");
const { createEnhanceCardHandler } = require("../server/routes/enhance-card");

const SAMPLE_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB";

const runPromptBuilderTests = () => {
  const result = buildDirectImprovePrompt({
    userPrompt: "Keep the offer cleaner and easier to scan",
    preserveSourceTextExactly: true,
  });

  assert.ok(result.prompt.includes("You are an expert e-commerce creative director"));
  assert.ok(result.prompt.includes("SCENARIO A: THE EXISTING CARD IS ALREADY GOOD"));
  assert.ok(result.prompt.includes("SCENARIO B: THE EXISTING CARD IS WEAK OR OUTDATED"));
  assert.ok(result.prompt.includes("SOURCE TEXT MODE: PRESERVE EXACT WORDING"));
  assert.ok(result.prompt.includes("Do not paraphrase, rewrite, shorten, expand, translate, reinterpret, or replace the original claims."));
  assert.ok(result.prompt.includes("Keep the offer cleaner and easier to scan"));
  assert.equal(result.debug.instructionSource, "bundled");
  assert.equal(result.debug.preserveSourceTextExactly, true);
};

const runRouteTests = async () => {
  const calls = [];
  const handler = createEnhanceCardHandler({
    nanoBananaService: {
      async enhanceCard(payload) {
        calls.push(payload);
        return {
          ok: true,
          provider: "openai_gpt_image_2",
          imageDataUrl: "data:image/png;base64,generated",
          result: {
            __debug: {
              requestText: payload.prompt,
              responseText: "[image output]",
            },
          },
        };
      },
    },
    enhanceCardPromptService: createEnhanceCardPromptService(),
    billingService: {
      async runBillableAction(params) {
        return params.operation();
      },
    },
    aiLogService: {
      async record() {
        return undefined;
      },
    },
  });

  const response = await handler({
    imageDataUrl: SAMPLE_IMAGE,
    userPrompt: "Keep the original benefit copy",
    preserveSourceTextExactly: true,
    requestId: "enhance-route-test",
  }, {});

  assert.equal(response.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].requestTimeoutMs, 240000);
  assert.equal(calls[0].inputDetail, "low");
  assert.equal(calls[0].maxRetries, 0);
  assert.ok(calls[0].prompt.includes("SOURCE TEXT MODE: PRESERVE EXACT WORDING"));
  assert.ok(calls[0].prompt.includes("Keep the original benefit copy"));
  assert.ok(!calls[0].prompt.includes("Return one production-ready prompt for image AI."));
};

const runStateStoreTests = () => {
  const transitions = [];
  let disposedCount = 0;
  const store = useEnhanceCardState();
  const unsubscribe = store.subscribe((state) => {
    transitions.push(state.status);
  });

  const source = {
    name: "source.png",
    previewUrl: "blob:source",
    dispose() {
      disposedCount += 1;
    },
  };

  store.setSource(source, { event: "test_source_selected" });
  assert.equal(store.getState().status, "file_selected");

  const request = store.beginSubmission({ event: "test_submit" });
  assert.ok(request);
  assert.equal(store.getState().status, "submitting");

  store.markProcessing(request.requestToken, { event: "test_processing" });
  assert.equal(store.getState().status, "processing");

  store.resolveSuccess(request.requestToken, { resultUrl: "data:image/png;base64,done" }, { event: "test_success" });
  assert.equal(store.getState().status, "success");
  assert.equal(store.getState().resultUrl, "data:image/png;base64,done");

  const timeoutSource = {
    name: "timeout.png",
    previewUrl: "blob:timeout",
    dispose() {
      disposedCount += 1;
    },
  };

  store.setSource(timeoutSource, { event: "test_source_replaced" });
  const timeoutRequest = store.beginSubmission({ event: "test_timeout_submit" });
  assert.ok(timeoutRequest);

  store.resolveFailure(timeoutRequest.requestToken, "timeout", {
    event: "test_timeout",
    timedOut: true,
  });
  assert.equal(store.getState().status, "timeout");
  assert.equal(store.getState().canRetry, true);

  store.reset({ event: "test_reset" });
  assert.equal(store.getState().status, "idle");
  assert.ok(disposedCount >= 2);

  unsubscribe();
  store.destroy();

  assert.deepEqual(transitions.slice(0, 5), ["idle", "file_selected", "submitting", "processing", "success"]);
};

const runApiLayerTests = async () => {
  let processingCallbackCalls = 0;
  let successRequestBody = null;

  const successApi = createEnhanceCardApi({
    endpoint: "/api/enhance-card",
    prepareImageDataUrl: async () => SAMPLE_IMAGE,
    fetchImpl: async (url, options) => {
      successRequestBody = JSON.parse(options.body);
      return new Response(JSON.stringify({
        ok: true,
        imageDataUrl: "data:image/png;base64,generated",
        provider: "openai_gpt_image_2",
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  const successResult = await successApi.submitEnhancement({
    requestId: "api-success",
    source: { kind: "file", name: "source.png", mimeType: "image/png", sizeBytes: 123 },
    userPrompt: "Preserve exact wording",
    preserveSourceTextExactly: true,
    signal: new AbortController().signal,
    onProcessing() {
      processingCallbackCalls += 1;
    },
  });

  assert.equal(successResult.ok, true);
  assert.equal(successResult.provider, "openai_gpt_image_2");
  assert.equal(processingCallbackCalls, 1);
  assert.equal(successRequestBody.preserveSourceTextExactly, true);

  const invalidJsonApi = createEnhanceCardApi({
    prepareImageDataUrl: async () => SAMPLE_IMAGE,
    fetchImpl: async () => new Response("not-json", { status: 200 }),
  });

  await assert.rejects(
    invalidJsonApi.submitEnhancement({
      requestId: "api-invalid-json",
      source: { kind: "file", name: "source.png", mimeType: "image/png", sizeBytes: 123 },
      signal: new AbortController().signal,
    }),
    (error) => error && error.code === "invalid_json_response"
  );

  const errorApi = createEnhanceCardApi({
    prepareImageDataUrl: async () => SAMPLE_IMAGE,
    fetchImpl: async () => new Response(JSON.stringify({
      error: {
        code: "upstream_failed",
        userMessage: "Service temporarily unavailable",
      },
    }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    }),
  });

  await assert.rejects(
    errorApi.submitEnhancement({
      requestId: "api-error",
      source: { kind: "file", name: "source.png", mimeType: "image/png", sizeBytes: 123 },
      signal: new AbortController().signal,
    }),
    (error) => error && error.message === "Service temporarily unavailable"
  );

  const abortApi = createEnhanceCardApi({
    prepareImageDataUrl: async () => SAMPLE_IMAGE,
    fetchImpl: async (url, options) => {
      return new Promise((resolve, reject) => {
        options.signal.addEventListener("abort", () => {
          reject(createAbortError("aborted"));
        }, { once: true });
      });
    },
  });

  const controller = new AbortController();
  const abortPromise = abortApi.submitEnhancement({
    requestId: "api-abort",
    source: { kind: "file", name: "source.png", mimeType: "image/png", sizeBytes: 123 },
    signal: controller.signal,
  });

  setTimeout(() => controller.abort(), 10);

  await assert.rejects(
    abortPromise,
    (error) => error && error.name === "AbortError"
  );
};

const runImproveSizeTests = async () => {
  const requests = [];
  const provider = createOpenAIImageProvider({
    apiKey: "test-key",
    requestJson: async (params) => {
      requests.push(params);
      return {
        output: [
          {
            result: "data:image/png;base64,generated",
          },
        ],
      };
    },
  });

  const results = await provider.improveGenerate({
    prompt: "Make it stronger",
    sourcePreviewUrl: SAMPLE_IMAGE,
    size: "1200x1600",
    requestId: "improve-size-test",
  });

  assert.equal(requests.length, 1);
  assert.equal(requests[0].body.tools[0].size, "1200x1600");
  assert.equal(results[0].metadata.size, "1200x1600");
  assert.equal(results[0].format, "1200x1600 px, 3:4");
};

const main = async () => {
  runPromptBuilderTests();
  await runRouteTests();
  runStateStoreTests();
  await runApiLayerTests();
  await runImproveSizeTests();
  process.stdout.write("Enhance card flow tests passed\n");
};

main().catch((error) => {
  process.stderr.write((error && error.stack) ? error.stack + "\n" : String(error) + "\n");
  process.exit(1);
});
