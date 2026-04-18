"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const { toText } = require("../utils");
const { getFirebaseAdminApp, getFirebaseAdminFirestore } = require("./firebase-admin");

class HistoryAssetServiceError extends Error {
  constructor(params) {
    super(String(params?.message || "History asset service error"));
    this.name = "HistoryAssetServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "history_asset_service_error";
    this.details = params?.details || null;
  }
}

const ASSET_COLLECTION = "kartochkaHistoryAssets";
const MAX_ASSET_BYTES = 620 * 1024;
const MAX_FILE_ASSETS = 400;

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const ensureObject = (value) => (isObject(value) ? value : {});
const nowIso = () => new Date().toISOString();
const buildAssetId = () => "ha_" + crypto.randomUUID().replace(/-/g, "");

const parseDataUrl = (value) => {
  const raw = toText(value);
  const match = raw.match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!match) {
    throw new HistoryAssetServiceError({
      status: 400,
      code: "invalid_history_asset_data_url",
      message: "History asset must be a base64 image data URL",
    });
  }

  const mimeType = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  const base64 = match[2].replace(/\s+/g, "");
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length) {
    throw new HistoryAssetServiceError({
      status: 400,
      code: "empty_history_asset",
      message: "History asset image is empty",
    });
  }
  if (buffer.length > MAX_ASSET_BYTES) {
    throw new HistoryAssetServiceError({
      status: 413,
      code: "history_asset_too_large",
      message: "History asset image is too large",
      details: { bytes: buffer.length, limitBytes: MAX_ASSET_BYTES },
    });
  }

  return { mimeType, base64, bytes: buffer.length };
};

const normalizeRecord = (record) => {
  const safe = ensureObject(record);
  return {
    id: toText(safe.id),
    mimeType: /^image\/(?:png|jpe?g|webp)$/i.test(toText(safe.mimeType)) ? toText(safe.mimeType).toLowerCase() : "image/jpeg",
    base64: toText(safe.base64),
    bytes: Number.isFinite(Number(safe.bytes)) ? Number(safe.bytes) : 0,
    createdAt: toText(safe.createdAt) || nowIso(),
  };
};

const createHistoryAssetService = (deps) => {
  const rootDir = toText(deps?.rootDir) || process.cwd();
  const filePath = toText(deps?.filePath) || path.join(rootDir, "server", "data", "history-assets-store.json");
  const firebaseConfig = ensureObject(deps?.firebaseAdmin);
  const adminApp = getFirebaseAdminApp(firebaseConfig);
  const firestore = getFirebaseAdminFirestore(firebaseConfig);
  const useFirestore = Boolean(adminApp && firestore);

  const ensureDir = () => {
    if (filePath) fs.mkdirSync(path.dirname(filePath), { recursive: true });
  };

  const readStore = () => {
    ensureDir();
    if (!filePath || !fs.existsSync(filePath)) return { assets: {} };
    const raw = fs.readFileSync(filePath, "utf8").trim();
    const parsed = raw ? JSON.parse(raw) : {};
    return isObject(parsed) && isObject(parsed.assets) ? parsed : { assets: {} };
  };

  const writeStore = (store) => {
    ensureDir();
    fs.writeFileSync(filePath, JSON.stringify(store || { assets: {} }, null, 2), "utf8");
  };

  const assetRef = (id) => firestore.collection(ASSET_COLLECTION).doc(id);

  const saveToFile = (record) => {
    const store = readStore();
    const assets = ensureObject(store.assets);
    assets[record.id] = record;
    const orderedIds = Object.keys(assets)
      .sort((a, b) => String(assets[b]?.createdAt || "").localeCompare(String(assets[a]?.createdAt || "")));
    orderedIds.slice(MAX_FILE_ASSETS).forEach((id) => {
      delete assets[id];
    });
    writeStore({ assets });
  };

  const getFromFile = (id) => {
    const record = normalizeRecord(readStore().assets?.[id]);
    return record.id ? record : null;
  };

  return {
    async save(payload) {
      const requestBody = ensureObject(payload);
      const parsed = parseDataUrl(requestBody.dataUrl);
      const id = buildAssetId();
      const record = {
        id,
        ...parsed,
        createdAt: nowIso(),
        kind: toText(requestBody.kind).slice(0, 80) || "history-preview",
      };

      if (useFirestore) {
        await assetRef(id).set(record, { merge: false });
      } else {
        saveToFile(record);
      }

      return {
        id,
        url: "/api/kartochka/historyAsset/" + encodeURIComponent(id),
        mimeType: record.mimeType,
        bytes: record.bytes,
      };
    },

    async get(id) {
      const assetId = toText(id).replace(/[^a-zA-Z0-9_-]+/g, "").slice(0, 80);
      if (!assetId) {
        throw new HistoryAssetServiceError({
          status: 404,
          code: "history_asset_not_found",
          message: "History asset not found",
        });
      }

      let record = null;
      if (useFirestore) {
        const snapshot = await assetRef(assetId).get();
        record = snapshot.exists ? normalizeRecord(snapshot.data()) : null;
      } else {
        record = getFromFile(assetId);
      }

      if (!record?.base64) {
        throw new HistoryAssetServiceError({
          status: 404,
          code: "history_asset_not_found",
          message: "History asset not found",
        });
      }

      const buffer = Buffer.from(record.base64, "base64");
      return {
        id: record.id,
        mimeType: record.mimeType,
        buffer,
        bytes: buffer.length,
      };
    },
  };
};

module.exports = {
  HistoryAssetServiceError,
  createHistoryAssetService,
};
