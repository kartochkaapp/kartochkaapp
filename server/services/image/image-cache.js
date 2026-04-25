"use strict";

const fs = require("node:fs");
const path = require("node:path");

const { ensureDir, hashFile, hashObject, normalizeFormat, normalizeMode, normalizeProvider } = require("./image-utils");

const createImageCache = (options = {}) => {
  const enabled = options.enabled !== false;
  const rootDir = ensureDir(options.rootDir);

  const buildKey = (inputPath, params = {}) => {
    const inputHash = hashFile(inputPath);
    const paramsHash = hashObject({
      provider: normalizeProvider(params.provider),
      mode: normalizeMode(params.mode),
      targetWidth: params.targetWidth,
      targetHeight: params.targetHeight,
      scale: params.scale,
      crop: Boolean(params.crop),
      format: normalizeFormat(params.format),
      version: params.version || "v1",
    });
    return inputHash + "-" + paramsHash.slice(0, 24);
  };

  const getEntryDir = (key) => path.join(rootDir, key);
  const getManifestPath = (key) => path.join(getEntryDir(key), "manifest.json");

  const read = (key) => {
    if (!enabled) return null;
    const manifestPath = getManifestPath(key);
    if (!fs.existsSync(manifestPath)) return null;
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      const files = [manifest?.output?.path, ...(Array.isArray(manifest?.cards) ? manifest.cards.map((item) => item.path) : [])]
        .filter(Boolean);
      if (!files.every((filePath) => fs.existsSync(filePath))) return null;
      return manifest;
    } catch (error) {
      return null;
    }
  };

  const write = (key, manifest) => {
    if (!enabled) return manifest;
    const entryDir = ensureDir(getEntryDir(key));
    fs.writeFileSync(path.join(entryDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
    return manifest;
  };

  return {
    enabled,
    rootDir,
    buildKey,
    getEntryDir,
    read,
    write,
  };
};

module.exports = {
  createImageCache,
};
