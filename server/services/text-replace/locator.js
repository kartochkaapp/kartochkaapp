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
      ]
    : [];

  const base = [
    "Detect the bounding box of the text \"" + String(searchText) + "\" in this image.",
    "",
    "Output ONLY a JSON object in this EXACT format (Gemini standard spatial format):",
    '{"box_2d": [ymin, xmin, ymax, xmax]}',
    "",
    "The coordinates MUST be normalized integers in the range 0-1000,",
    "where (0,0) is the top-left corner and (1000,1000) is the bottom-right.",
    "- ymin = top edge of the text (0=top of image, 1000=bottom)",
    "- xmin = left edge of the text (0=left of image, 1000=right)",
    "- ymax = bottom edge of the text",
    "- xmax = right edge of the text",
    "",
    "RULES:",
    '- Return the tightest rectangle containing the COMPLETE text "' + String(searchText) + '".',
    "- If the text appears multiple times, return the LARGEST or most PROMINENT occurrence",
    "  (large headline text beats small print on packaging).",
    "- Scan the entire image — text may be at edges, corners, or overlays.",
    "- Include full character ascenders/descenders with a small vertical margin.",
    ...multiWordNote,
    "",
    "If the text is 100% absent from the image, output: {\"found\": false}",
    "No prose. No markdown. No explanations. Only the JSON object.",
  ];

  if (mode === "retry") {
    base.splice(2, 0,
      "",
      "RETRY: The previous attempt was wrong. Look carefully at ALL text in the image,",
      "especially large/prominent text that may be display headlines rather than fine print.",
    );
  }

  return base.join("\n");
};

// Parse Gemini's official spatial format: {"box_2d": [ymin, xmin, ymax, xmax]}
// with values normalized to 0-1000. Convert to pixel {x, y, w, h}.
// Fall back to legacy {x, y, w, h} if present (old prompt style).
const parseLocatorResponse = (rawText, query, width, height) => {
  const parsed = extractJsonObject(rawText);
  if (!parsed) {
    return { error: "Locator did not return valid JSON" };
  }
  if (parsed.found === false) {
    return { notFound: true };
  }

  let xPx;
  let yPx;
  let wPx;
  let hPx;

  // Primary: Gemini spatial format [ymin, xmin, ymax, xmax] in 0-1000
  const box2d = Array.isArray(parsed.box_2d) ? parsed.box_2d : null;
  if (box2d && box2d.length === 4 && box2d.every((v) => Number.isFinite(Number(v)))) {
    const [ymin, xmin, ymax, xmax] = box2d.map(Number);
    xPx = (xmin / 1000) * width;
    yPx = (ymin / 1000) * height;
    wPx = ((xmax - xmin) / 1000) * width;
    hPx = ((ymax - ymin) / 1000) * height;
  } else {
    // Fallback: legacy {x, y, w, h} format
    const x = Number(parsed.x);
    const y = Number(parsed.y);
    const w = Number(parsed.w);
    const h = Number(parsed.h);
    if (![x, y, w, h].every(Number.isFinite)) {
      return { error: "Locator returned invalid bbox" };
    }
    xPx = x;
    yPx = y;
    wPx = w;
    hPx = h;
  }

  const bbox = {
    x: Math.max(0, Math.floor(xPx)),
    y: Math.max(0, Math.floor(yPx)),
    w: Math.max(1, Math.ceil(wPx)),
    h: Math.max(1, Math.ceil(hPx)),
  };
  bbox.w = Math.min(bbox.w, Math.max(1, width - bbox.x));
  bbox.h = Math.min(bbox.h, Math.max(1, height - bbox.y));

  return { bbox };
};

const createTextReplaceLocator = (deps) => {
  const client = deps?.client;
  // Pro by default — spatial/bbox detection needs the stronger model.
  // Flash consistently returns wrong coordinates for small text on packaging.
  const model = toText(deps?.model) || "google/gemini-2.5-pro";
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
        console.log('[text-replace] locator raw response (' + attempt.label + '):', rawText.slice(0, 300));
        const result = parseLocatorResponse(rawText, query, width, height);
        if (result.bbox) {
          console.log('[text-replace] locator found via ' + attempt.label + ':', JSON.stringify(result.bbox), '| image:', width + 'x' + height);
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
