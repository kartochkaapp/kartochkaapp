"use strict";

const { extractJsonObject, toText } = require("../../utils");

let sharpModule = null;
const getSharp = () => {
  if (!sharpModule) {
    sharpModule = require("sharp");
  }
  return sharpModule;
};

const buildLocatorPrompt = (searchText, width, height, mode) => {
  const wordCount = String(searchText).trim().split(/\s+/).length;
  const multiWordNote = wordCount > 1
    ? [
        "",
        "MULTI-WORD PHRASE: The target is " + String(wordCount) + ' words: "' + String(searchText) + '".',
        "Your bounding box MUST span ALL words from the first character of the first word",
        "to the last character of the last word — in a single rectangle.",
        "Do NOT return a box for only part of the phrase. Cover the entire phrase end-to-end.",
      ]
    : [];

  const base = [
    "You are a precise text locator for image editing.",
    "",
    'TASK: Find the exact bounding box of the text "' + String(searchText) + '" in this image.',
    "",
    "IMAGE DIMENSIONS: " + String(width) + " x " + String(height) + " pixels (width x height).",
    "",
    "CRITICAL: The target text may be VERY SMALL. Scan the ENTIRE image carefully —",
    "including edges, corners, product labels, fine print, packaging, price tags,",
    "tiny captions, small numbers, secondary text. Do NOT skip text just because it is small.",
    "If you see any text that matches — even partially or in small size — report it.",
    ...multiWordNote,
    "",
    "RULES:",
    '- Return the tightest rectangle that contains the COMPLETE text "' + String(searchText) + '".',
    "- Coordinates are in pixels. Origin (0,0) is top-left. x grows right, y grows down.",
    "- If the text appears multiple times, return the largest or most prominent occurrence.",
    "- Be generous vertically to include full ascenders, descenders and punctuation.",
    "- Be generous horizontally: x starts at the leftmost pixel of the first character,",
    "  x+w ends at the rightmost pixel of the last character. Include all characters.",
    "- Respond with ONLY a single JSON object. No prose. No markdown fences.",
    "",
    'FORMAT: {"x": <int>, "y": <int>, "w": <int>, "h": <int>}',
    "",
    'Only if the text is 100% NOT visible anywhere in the image, respond with: {"found": false}',
  ];

  if (mode === "retry") {
    base.splice(4, 0,
      "",
      "THIS IS A RETRY. The first attempt failed. Look HARDER and more carefully.",
      "Zoom mentally into every area of the image. Check packaging labels, small numbers,",
      "corners, anywhere text might hide at small scale. The text IS there — find it.",
    );
  }

  return base.join("\n");
};

const parseLocatorResponse = (rawText, query, width, height) => {
  const parsed = extractJsonObject(rawText);
  if (!parsed) {
    return { error: "Locator did not return valid JSON" };
  }
  if (parsed.found === false) {
    return { notFound: true };
  }

  const x = Number(parsed.x);
  const y = Number(parsed.y);
  const w = Number(parsed.w);
  const h = Number(parsed.h);
  if (![x, y, w, h].every(Number.isFinite)) {
    return { error: "Locator returned invalid bbox" };
  }

  const bbox = {
    x: Math.max(0, Math.floor(x)),
    y: Math.max(0, Math.floor(y)),
    w: Math.max(1, Math.ceil(w)),
    h: Math.max(1, Math.ceil(h)),
  };
  bbox.w = Math.min(bbox.w, Math.max(1, width - bbox.x));
  bbox.h = Math.min(bbox.h, Math.max(1, height - bbox.y));

  return { bbox };
};

const createTextReplaceLocator = (deps) => {
  const client = deps?.client;
  const model = toText(deps?.model) || "google/gemini-2.5-flash";
  const fallbackModel = toText(deps?.fallbackModel) || "google/gemini-2.5-pro";

  if (!client || typeof client.callOpenRouter !== "function") {
    throw new Error("Text replace locator client is not configured");
  }

  const callLocator = async ({ modelId, prompt, base64 }) => {
    const data = await client.callOpenRouter({
      model: modelId,
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
    return client.extractText(data);
  };

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

    const attempts = [
      { modelId: model, mode: "initial", label: "flash" },
      { modelId: model, mode: "retry", label: "flash-retry" },
      { modelId: fallbackModel, mode: "retry", label: "pro-fallback" },
    ];

    let lastRawText = "";
    let lastPrompt = "";
    let lastError = null;

    for (const attempt of attempts) {
      const prompt = buildLocatorPrompt(query, width, height, attempt.mode);
      lastPrompt = prompt;
      try {
        const rawText = await callLocator({ modelId: attempt.modelId, prompt, base64 });
        lastRawText = rawText;
        const result = parseLocatorResponse(rawText, query, width, height);
        if (result.bbox) {
          console.log('[text-replace] locator found via ' + attempt.label + ':', JSON.stringify(result.bbox));
          return { bbox: result.bbox, requestText: prompt, responseText: rawText };
        }
        if (result.error) {
          lastError = new Error(result.error + " (attempt: " + attempt.label + ")");
          continue;
        }
        // notFound — try next attempt
        console.log('[text-replace] locator ' + attempt.label + ' returned not-found, retrying...');
      } catch (error) {
        lastError = error;
        console.log('[text-replace] locator ' + attempt.label + ' errored:', error?.message);
      }
    }

    throw lastError || new Error('Text "' + query + '" not found in image after all attempts');
  };

  return {
    findTextBbox,
  };
};

module.exports = {
  createTextReplaceLocator,
};
