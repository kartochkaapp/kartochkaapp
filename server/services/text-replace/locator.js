"use strict";

const { extractJsonObject, toText } = require("../../utils");

let sharpModule = null;
const getSharp = () => {
  if (!sharpModule) {
    sharpModule = require("sharp");
  }
  return sharpModule;
};

const buildLocatorPrompt = (searchText, width, height) => {
  return [
    "You are a precise text locator for image editing.",
    "",
    'TASK: Find the exact bounding box of the text "' + String(searchText) + '" in this image.',
    "",
    "IMAGE DIMENSIONS: " + String(width) + " x " + String(height) + " pixels (width x height).",
    "",
    "RULES:",
    '- Return the tightest rectangle that contains the full visible text "' + String(searchText) + '".',
    "- Coordinates are in pixels. Origin (0,0) is top-left. x grows right, y grows down.",
    "- If the text appears multiple times, return the largest or most prominent occurrence.",
    "- Be generous vertically to include full ascenders, descenders and punctuation.",
    "- Respond with ONLY a single JSON object. No prose. No markdown fences.",
    "",
    'FORMAT: {"x": <int>, "y": <int>, "w": <int>, "h": <int>}',
    "",
    'If the text is not visible in the image, respond with: {"found": false}',
  ].join("\n");
};

const createTextReplaceLocator = (deps) => {
  const client = deps?.client;
  const model = toText(deps?.model) || "google/gemini-2.5-flash";

  if (!client || typeof client.callOpenRouter !== "function") {
    throw new Error("Text replace locator client is not configured");
  }

  const findTextBbox = async ({ imageBuffer, searchText }) => {
    const sharp = getSharp();
    const query = toText(searchText);
    if (!Buffer.isBuffer(imageBuffer) || !query) {
      throw new Error("findTextBbox requires imageBuffer and searchText");
    }

    const pngBuffer = await sharp(imageBuffer).png().toBuffer();
    const meta = await sharp(pngBuffer).metadata();
    const width = Number(meta.width || 0);
    const height = Number(meta.height || 0);
    const base64 = pngBuffer.toString("base64");
    const prompt = buildLocatorPrompt(query, width, height);

    const data = await client.callOpenRouter({
      model,
      extraBody: {
        temperature: 0,
        response_format: { type: "json_object" },
      },
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: "data:image/png;base64," + base64 } },
        ],
      }],
    });

    const rawText = client.extractText(data);
    const parsed = extractJsonObject(rawText);
    if (!parsed) {
      throw new Error("Locator did not return valid JSON");
    }
    if (parsed.found === false) {
      throw new Error('Text "' + query + '" not found in image');
    }

    const x = Number(parsed.x);
    const y = Number(parsed.y);
    const w = Number(parsed.w);
    const h = Number(parsed.h);
    if (![x, y, w, h].every(Number.isFinite)) {
      throw new Error("Locator returned invalid bbox");
    }

    const bbox = {
      x: Math.max(0, Math.floor(x)),
      y: Math.max(0, Math.floor(y)),
      w: Math.max(1, Math.ceil(w)),
      h: Math.max(1, Math.ceil(h)),
    };
    bbox.w = Math.min(bbox.w, Math.max(1, width - bbox.x));
    bbox.h = Math.min(bbox.h, Math.max(1, height - bbox.y));

    return {
      bbox,
      requestText: prompt,
      responseText: rawText,
    };
  };

  return {
    findTextBbox,
  };
};

module.exports = {
  createTextReplaceLocator,
};
