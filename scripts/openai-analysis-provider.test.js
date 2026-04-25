"use strict";

const assert = require("node:assert/strict");

const { HttpClientError } = require("../server/http-client");
const { createOpenAIProvider } = require("../server/providers/openai");

const SAMPLE_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD";

const runTextFallbackTest = async () => {
  const calls = [];
  const provider = createOpenAIProvider({
    apiKey: "test-key",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-5.4-mini",
    requestJson: async (params) => {
      calls.push(params);
      if (params.url.endsWith("/chat/completions")) {
        throw new HttpClientError({
          code: "network_error",
          message: "Network error while calling upstream API",
          retryable: true,
        });
      }

      return {
        output_text: "Готовый промпт для карточки",
      };
    },
  });

  const result = await provider.createAnalyze({
    analysisIntent: "prompt",
    selectedTemplate: {
      kind: "instruction-template",
      promptFlow: "gpt_instruction",
      instructionPrompt: "Инструкция {USER_TEXT}",
    },
    userText: "Разместить сильный оффер",
    generationNotes: "Сделать продающе",
    imageDataUrls: [SAMPLE_IMAGE, SAMPLE_IMAGE, SAMPLE_IMAGE],
  });

  assert.equal(result.prompt, "Готовый промпт для карточки");
  assert.equal(calls.length, 3);
  assert.equal(calls[0].url.endsWith("/chat/completions"), true);
  assert.equal(calls[1].url.endsWith("/chat/completions"), true);
  assert.equal(calls[2].url.endsWith("/responses"), true);
  assert.equal(calls[2].body.input[1].content.filter((item) => item.type === "input_image").length, 2);
  assert.equal(calls[2].body.input[1].content[1].detail, "low");
};

const runJsonFallbackTest = async () => {
  const calls = [];
  const provider = createOpenAIProvider({
    apiKey: "test-key",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-5.4-mini",
    requestJson: async (params) => {
      calls.push(params);
      if (params.url.endsWith("/chat/completions")) {
        throw new HttpClientError({
          code: "timeout",
          message: "Request timed out",
          retryable: true,
        });
      }

      return {
        output_text: JSON.stringify({
          detectedCategory: "Одежда",
          subjectOnScreen: {
            summary: "Куртка на фото",
            productType: "Куртка",
            productIdentity: "Черная куртка",
            visualEvidence: "Видна молния и капюшон",
            referenceRelation: "Адаптировать стиль под товар",
          },
          insight: {
            category: "Одежда",
            recommendedStyle: "Чистый маркетплейс",
            conversionAccent: "Посадка и выгода",
            conversionAngle: "Посадка и выгода",
            marketplaceFormat: "3:4",
          },
          headlineIdeas: ["Куртка", "Ветровка"],
          autofill: {
            title: "Куртка",
            shortDescription: "Легкая ветровка",
            subtitle: "Для повседневной носки",
            characteristics: [{ label: "Материал", value: "Полиэстер", order: 1 }],
            benefits: ["Легкая", "Удобная"],
          },
          prompt: "Промпт",
        }),
      };
    },
  });

  const result = await provider.createAnalyze({
    analysisIntent: "analyze",
    title: "Куртка",
    imageDataUrls: [SAMPLE_IMAGE],
  });

  assert.equal(result.detectedCategory, "Одежда");
  assert.equal(result.autofill.title, "Куртка");
  assert.equal(calls.length, 3);
  assert.equal(calls[2].url.endsWith("/responses"), true);
  assert.equal(calls[2].body.text.format.type, "json_object");
};

const main = async () => {
  await runTextFallbackTest();
  await runJsonFallbackTest();
  process.stdout.write("OpenAI analysis provider tests passed\n");
};

main().catch((error) => {
  process.stderr.write((error && error.stack) ? error.stack + "\n" : String(error) + "\n");
  process.exit(1);
});
