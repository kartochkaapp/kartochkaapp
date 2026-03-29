"use strict";

const fs = require("node:fs");
const path = require("node:path");

const PROMPT_FILES = Object.freeze({
  bestTemplate: Object.freeze({
    key: "server/prompts/best-template-instruction.md",
    fileName: "best-template-instruction.md",
  }),
  autofillMarketplaceTexts: Object.freeze({
    key: "server/prompts/autofill-marketplace-card-texts-v5.md",
    fileName: "autofill-marketplace-card-texts-v5.md",
  }),
  improveCard: Object.freeze({
    key: "server/prompts/improve-card-instruction.md",
    fileName: "improve-card-instruction.md",
  }),
});

const normalizePathKey = (value) => String(value || "").trim().replace(/\\/g, "/").replace(/^\.?\//, "");

const readBundledPrompt = (fileName) => {
  try {
    return String(fs.readFileSync(path.join(__dirname, fileName), "utf8") || "").trim();
  } catch (error) {
    return "";
  }
};

const PROMPT_TEXT_BY_KEY = Object.freeze(
  Object.values(PROMPT_FILES).reduce((accumulator, entry) => {
    accumulator[entry.key] = readBundledPrompt(entry.fileName);
    return accumulator;
  }, {})
);

const getBundledPromptText = (instructionPath) => {
  const normalizedPath = normalizePathKey(instructionPath);
  if (!normalizedPath) return "";

  if (PROMPT_TEXT_BY_KEY[normalizedPath]) {
    return PROMPT_TEXT_BY_KEY[normalizedPath];
  }

  const matchingEntry = Object.entries(PROMPT_TEXT_BY_KEY).find(([key]) => normalizedPath.endsWith(key));
  return matchingEntry ? matchingEntry[1] : "";
};

module.exports = {
  PROMPT_FILES,
  getBundledPromptText,
};
