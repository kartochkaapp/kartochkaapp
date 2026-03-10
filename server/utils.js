"use strict";

const toText = (value) => String(value || "").trim();

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const extractJsonObject = (rawValue) => {
  if (rawValue == null) return null;
  if (typeof rawValue === "object") return rawValue;

  const text = toText(rawValue);
  if (!text) return null;

  const directParsed = safeJsonParse(text);
  if (directParsed && typeof directParsed === "object") return directParsed;

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  const sliced = text.slice(start, end + 1);
  const slicedParsed = safeJsonParse(sliced);
  if (slicedParsed && typeof slicedParsed === "object") return slicedParsed;

  return null;
};

const clamp = (value, min, max, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
};

const escapeXml = (value) => {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const buildPreviewDataUri = (title, subtitle) => {
  const safeTitle = escapeXml(toText(title) || "KARTOCHKA Variant");
  const safeSubtitle = escapeXml(toText(subtitle) || "AI generated concept");

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">',
    "<defs>",
    '<linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">',
    '<stop offset="0%" stop-color="#ecfdf5" />',
    '<stop offset="100%" stop-color="#f8fafc" />',
    "</linearGradient>",
    "</defs>",
    '<rect width="1080" height="1350" fill="url(#bg)" />',
    '<rect x="88" y="96" width="904" height="1158" rx="44" fill="#ffffff" stroke="#d1fae5" stroke-width="4" />',
    '<text x="144" y="240" font-size="42" font-family="Commissioner, Inter, Arial" fill="#0f172a" font-weight="700">',
    safeTitle,
    "</text>",
    '<text x="144" y="320" font-size="28" font-family="Commissioner, Inter, Arial" fill="#475569">',
    safeSubtitle,
    "</text>",
    '<rect x="144" y="380" width="792" height="680" rx="32" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" />',
    '<text x="540" y="740" text-anchor="middle" font-size="28" font-family="Commissioner, Inter, Arial" fill="#334155">',
    "Generated preview placeholder",
    "</text>",
    "</svg>",
  ].join("");

  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
};

module.exports = {
  toText,
  extractJsonObject,
  clamp,
  buildPreviewDataUri,
};

