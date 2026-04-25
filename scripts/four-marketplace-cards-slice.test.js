"use strict";

const assert = require("node:assert/strict");
const sharp = require("sharp");

const { sliceCompositeImageBuffer } = require("../server/services/four-marketplace-cards-service");

const buildImage = (width, height) => {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 32, g: 104, b: 188, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
};

const assertSliceDimensions = async (sourceWidth, sourceHeight, expectedCompositeWidth, expectedCompositeHeight, expectedWidth, expectedHeight) => {
  const buffer = await buildImage(sourceWidth, sourceHeight);
  const result = await sliceCompositeImageBuffer(buffer);

  assert.equal(result.composite.width, expectedCompositeWidth);
  assert.equal(result.composite.height, expectedCompositeHeight);
  assert.equal(result.cardWidth, expectedWidth);
  assert.equal(result.cardHeight, expectedHeight);
  assert.equal(result.cards.length, 4);

  for (const card of result.cards) {
    assert.equal(card.width, expectedWidth);
    assert.equal(card.height, expectedHeight);
    assert.equal(card.edgeCrop, 4);
    const metadata = await sharp(card.buffer).metadata();
    assert.equal(metadata.width, expectedWidth);
    assert.equal(metadata.height, expectedHeight);
  }
};

(async () => {
  await assertSliceDimensions(2400, 3200, 2400, 3200, 1200, 1600);
  await assertSliceDimensions(2401, 3201, 2400, 3200, 1200, 1600);
  await assertSliceDimensions(1200, 1600, 2400, 3200, 1200, 1600);
  await assertSliceDimensions(1024, 1536, 2400, 3200, 1200, 1600);

  await assert.rejects(
    () => sliceCompositeImageBuffer(Buffer.from("not an image")),
    /Composite image could not be decoded/
  );

  process.stdout.write("four-marketplace-cards slice tests passed\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
