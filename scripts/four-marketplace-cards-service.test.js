"use strict";

const assert = require("node:assert/strict");
const sharp = require("sharp");

const { createFourMarketplaceCardsService } = require("../server/services/four-marketplace-cards-service");

const buildDataUrl = async () => {
  const buffer = await sharp({
    create: {
      width: 1200,
      height: 1600,
      channels: 4,
      background: { r: 250, g: 250, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  return "data:image/png;base64," + buffer.toString("base64");
};

(async () => {
  const generatedAssets = [];
  const sourcePreviewUrl = await buildDataUrl();

  const service = createFourMarketplaceCardsService({
    generationService: {
      async generateFourMarketplaceCards() {
        return [
          {
            previewUrl: await buildDataUrl(),
            provider: "mock",
            providerLabel: "Mock",
            metadata: { promptHash: "mock-hash" },
          },
        ];
      },
    },
    generatedAssetService: {
      async saveImageBuffer(payload) {
        const index = generatedAssets.length + 1;
        generatedAssets.push(payload);
        return {
          id: "asset-" + String(index),
          url: "/api/kartochka/generatedAsset/asset-" + String(index),
          mimeType: payload.mimeType || "image/png",
          bytes: payload.buffer.length,
        };
      },
    },
  });

  await assert.rejects(
    () => service.generate({}),
    /requires a source image data URL/
  );

  const result = await service.generate({
    requestId: "test-four-cards",
    sourcePreviewUrl,
    sourceCard: { name: "source.png", type: "image/png", sizeBytes: 100 },
  });

  assert.equal(result.success, true);
  assert.equal(result.mode, "generate-four-marketplace-cards");
  assert.equal(result.composite.width, 2400);
  assert.equal(result.composite.height, 3200);
  assert.equal(result.cards.length, 4);
  assert.deepEqual(result.cards.map((card) => card.type), ["benefits", "features", "lifestyle", "details"]);
  assert.equal(result.cards[0].width, 1200);
  assert.equal(result.cards[0].height, 1600);
  assert.equal(result.cards[0].edgeCrop, 4);
  assert.equal(result.metadata.cardEdgeCropPx, 4);
  assert.equal(generatedAssets.length, 5);

  process.stdout.write("four-marketplace-cards service tests passed\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
