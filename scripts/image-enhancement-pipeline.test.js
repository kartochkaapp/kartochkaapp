"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const sharp = require("sharp");

const {
  analyzeImage,
  enhanceCompositeAndCrop,
  enhanceSingleImage,
} = require("../server/services/image");

const buildSyntheticImage = (width, height) => {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 245, g: 247, b: 250, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          "<svg width=\"" + width + "\" height=\"" + height + "\" xmlns=\"http://www.w3.org/2000/svg\">" +
          "<rect x=\"40\" y=\"40\" width=\"" + Math.floor(width / 2) + "\" height=\"" + Math.floor(height / 3) + "\" fill=\"#111827\"/>" +
          "<text x=\"64\" y=\"120\" font-family=\"Arial\" font-size=\"64\" fill=\"#ffffff\">TEST CARD</text>" +
          "<circle cx=\"" + Math.floor(width * 0.72) + "\" cy=\"" + Math.floor(height * 0.34) + "\" r=\"120\" fill=\"#38bdf8\"/>" +
          "</svg>"
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();
};

const writeImage = async (filePath, width, height) => {
  fs.writeFileSync(filePath, await buildSyntheticImage(width, height));
};

(async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kartochka-image-pipeline-"));
  const singlePath = path.join(root, "single.png");
  const compositePath = path.join(root, "composite.png");
  await writeImage(singlePath, 640, 900);
  await writeImage(compositePath, 900, 1200);

  const analysis = await analyzeImage(singlePath, { targetWidth: 1200, targetHeight: 1600 });
  assert.equal(analysis.width, 640);
  assert.equal(analysis.height, 900);
  assert.equal(analysis.likelyLowResolution, true);
  assert.ok(["light", "standard", "strong"].includes(analysis.recommendedMode));

  const single = await enhanceSingleImage(singlePath, {
    provider: "sharp",
    mode: "standard",
    targetWidth: 1200,
    targetHeight: 1600,
    workRoot: path.join(root, "work"),
    cacheRoot: path.join(root, "cache"),
  });
  assert.equal(single.success, true);
  assert.equal(single.provider, "sharp");
  assert.equal(single.output.width, 1200);
  assert.equal(single.output.height, 1600);
  assert.equal(fs.existsSync(single.output.path), true);

  const cachedSingle = await enhanceSingleImage(singlePath, {
    provider: "sharp",
    mode: "standard",
    targetWidth: 1200,
    targetHeight: 1600,
    workRoot: path.join(root, "work"),
    cacheRoot: path.join(root, "cache"),
  });
  assert.equal(cachedSingle.cacheHit, true);

  const composite = await enhanceCompositeAndCrop(compositePath, {
    provider: "sharp",
    mode: "standard",
    targetWidth: 2400,
    targetHeight: 3200,
    workRoot: path.join(root, "work"),
    cacheRoot: path.join(root, "cache"),
  });
  assert.equal(composite.success, true);
  assert.equal(composite.output.width, 2400);
  assert.equal(composite.output.height, 3200);
  assert.equal(composite.cards.length, 4);
  for (const card of composite.cards) {
    assert.equal(card.width, 1200);
    assert.equal(card.height, 1600);
    assert.equal(fs.existsSync(card.path), true);
  }

  process.stdout.write("image enhancement pipeline tests passed\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
