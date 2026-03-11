"use strict";

const fs = require("node:fs");
const path = require("node:path");

const { clamp, toText } = require("../utils");

class HistoryServiceError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "History service error"));
    this.name = "HistoryServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "history_service_error";
    this.details = params?.details;
  }
}

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeScopeId = (value) => {
  const raw = toText(value) || "guest";
  const normalized = raw.replace(/[^a-zA-Z0-9._:@-]+/g, "_").slice(0, 120);
  return normalized || "guest";
};

const sortEntriesDesc = (entries) => {
  return entries.slice().sort((left, right) => {
    return new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime();
  });
};

const normalizeEntry = (entry) => {
  if (!isPlainObject(entry)) return null;

  const normalized = {
    ...entry,
    id: toText(entry.id) || "history-" + String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
    createdAt: toText(entry.createdAt) || new Date().toISOString(),
  };

  return normalized;
};

const normalizeEntryList = (entries, maxItems) => {
  const normalized = (Array.isArray(entries) ? entries : [])
    .map((entry) => normalizeEntry(entry))
    .filter(Boolean);

  const deduped = [];
  const seen = new Set();
  sortEntriesDesc(normalized).forEach((entry) => {
    if (seen.has(entry.id)) return;
    seen.add(entry.id);
    deduped.push(entry);
  });

  return deduped.slice(0, maxItems);
};

const ensureStoreShape = (value) => {
  if (!isPlainObject(value)) {
    return { scopes: {} };
  }

  const scopes = isPlainObject(value.scopes) ? value.scopes : {};
  return { scopes };
};

const createHistoryService = (deps) => {
  const filePath = toText(deps?.filePath);
  const maxItems = clamp(deps?.maxItems, 1, 500, 30);

  if (!filePath) {
    throw new HistoryServiceError({
      status: 500,
      code: "invalid_history_store",
      message: "History store file path is not configured",
    });
  }

  const dirPath = path.dirname(filePath);

  const ensureStoreDir = () => {
    fs.mkdirSync(dirPath, { recursive: true });
  };

  const readStore = () => {
    ensureStoreDir();

    if (!fs.existsSync(filePath)) {
      return { scopes: {} };
    }

    try {
      const raw = fs.readFileSync(filePath, "utf8").trim();
      if (!raw) return { scopes: {} };
      const parsed = JSON.parse(raw);
      return ensureStoreShape(parsed);
    } catch (error) {
      throw new HistoryServiceError({
        status: 500,
        code: "invalid_history_store",
        message: "History store file is corrupted or unreadable",
        details: {
          filePath,
          reason: toText(error?.message),
        },
      });
    }
  };

  const writeStore = (store) => {
    ensureStoreDir();

    try {
      fs.writeFileSync(filePath, JSON.stringify(ensureStoreShape(store), null, 2), "utf8");
    } catch (error) {
      throw new HistoryServiceError({
        status: 500,
        code: "history_store_write_failed",
        message: "Failed to write history store",
        details: {
          filePath,
          reason: toText(error?.message),
        },
      });
    }
  };

  const readEntries = (scopeId) => {
    const store = readStore();
    const scopedEntries = store.scopes[scopeId];
    return normalizeEntryList(scopedEntries, maxItems);
  };

  const saveEntries = (scopeId, entries) => {
    const store = readStore();
    const normalizedEntries = normalizeEntryList(entries, maxItems);

    if (normalizedEntries.length) {
      store.scopes[scopeId] = normalizedEntries;
    } else {
      delete store.scopes[scopeId];
    }

    writeStore(store);
    return normalizedEntries;
  };

  return {
    list(payload) {
      const scopeId = normalizeScopeId(payload?.scopeId || payload?.userId);
      const limit = clamp(payload?.limit, 1, 500, maxItems);
      return readEntries(scopeId).slice(0, limit);
    },

    getById(payload) {
      const scopeId = normalizeScopeId(payload?.scopeId || payload?.userId);
      const targetId = toText(payload?.id);
      if (!targetId) return null;
      return readEntries(scopeId).find((entry) => entry.id === targetId) || null;
    },

    save(payload) {
      const scopeId = normalizeScopeId(payload?.scopeId || payload?.userId);
      const clearRequested = Boolean(payload?.clear);

      let nextEntries;
      if (clearRequested) {
        nextEntries = [];
      } else if (Array.isArray(payload?.entries)) {
        nextEntries = payload.entries;
      } else if (isPlainObject(payload?.entry)) {
        const currentEntries = readEntries(scopeId);
        const nextEntry = normalizeEntry(payload.entry);
        const filteredEntries = currentEntries.filter((entry) => entry.id !== nextEntry.id);
        nextEntries = [nextEntry, ...filteredEntries];
      } else {
        nextEntries = readEntries(scopeId);
      }

      const savedEntries = saveEntries(scopeId, nextEntries);
      return {
        entries: savedEntries,
        savedAt: new Date().toISOString(),
      };
    },
  };
};

module.exports = {
  HistoryServiceError,
  createHistoryService,
};
