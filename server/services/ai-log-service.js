"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { getFirebaseAdminApp, getFirebaseAdminFirestore } = require("./firebase-admin");
const { clamp, toText } = require("../utils");

class AiLogServiceError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "AI log service error"));
    this.name = "AiLogServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "ai_log_service_error";
    this.details = params?.details;
  }
}

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const ensureStoreShape = (value) => {
  if (!isPlainObject(value)) {
    return { entries: [] };
  }

  return {
    entries: Array.isArray(value.entries) ? value.entries : [],
  };
};

const normalizeEntry = (entry) => {
  if (!isPlainObject(entry)) return null;

  return {
    id: toText(entry.id) || "ai-log-" + String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
    createdAt: toText(entry.createdAt) || new Date().toISOString(),
    action: toText(entry.action),
    phase: toText(entry.phase),
    provider: toText(entry.provider),
    status: toText(entry.status) || "success",
    requestId: toText(entry.requestId),
    userIdHint: toText(entry.userIdHint),
    userEmailHint: toText(entry.userEmailHint),
    aiModelTier: toText(entry.aiModelTier),
    model: toText(entry.model),
    reasoningEffort: toText(entry.reasoningEffort),
    imageModel: toText(entry.imageModel),
    promptMode: toText(entry.promptMode),
    instructionSource: toText(entry.instructionSource),
    instructionPath: toText(entry.instructionPath),
    instructionHash: toText(entry.instructionHash),
    promptHash: toText(entry.promptHash),
    promptPreview: toText(entry.promptPreview),
    promptLength: Number.isFinite(Number(entry.promptLength)) ? Number(entry.promptLength) : 0,
    responseHash: toText(entry.responseHash),
    responsePreview: toText(entry.responsePreview),
    responseLength: Number.isFinite(Number(entry.responseLength)) ? Number(entry.responseLength) : 0,
    imageCount: Number.isFinite(Number(entry.imageCount)) ? Number(entry.imageCount) : 0,
    errorCode: toText(entry.errorCode),
    errorMessage: toText(entry.errorMessage),
    details: isPlainObject(entry.details) ? entry.details : null,
  };
};

const sortEntriesDesc = (entries) => {
  return entries.slice().sort((left, right) => {
    return new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime();
  });
};

const resolveAiLogStoreFilePath = (runtimeRootDir) => {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "kartochka-ai-log-store.json");
  }

  return path.join(runtimeRootDir, "server", "data", "ai-log-store.json");
};

const createAiLogService = (deps) => {
  const rootDir = toText(deps?.rootDir) || process.cwd();
  const filePath = toText(deps?.filePath) || resolveAiLogStoreFilePath(rootDir);
  const maxItems = clamp(deps?.maxItems, 10, 1000, 300);
  const firebaseConfig = deps?.firebaseAdmin && typeof deps.firebaseAdmin === "object" ? deps.firebaseAdmin : {};
  const adminApp = getFirebaseAdminApp(firebaseConfig);
  const firestore = getFirebaseAdminFirestore(firebaseConfig);
  const useFirestore = Boolean(adminApp && firestore);

  if (!filePath) {
    throw new AiLogServiceError({
      status: 500,
      code: "invalid_ai_log_store",
      message: "AI log store file path is not configured",
    });
  }

  const dirPath = path.dirname(filePath);

  const ensureStoreDir = () => {
    fs.mkdirSync(dirPath, { recursive: true });
  };

  const readStore = () => {
    ensureStoreDir();

    if (!fs.existsSync(filePath)) {
      return { entries: [] };
    }

    try {
      const raw = fs.readFileSync(filePath, "utf8").trim();
      if (!raw) return { entries: [] };
      return ensureStoreShape(JSON.parse(raw));
    } catch (error) {
      throw new AiLogServiceError({
        status: 500,
        code: "invalid_ai_log_store",
        message: "AI log store file is corrupted or unreadable",
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
      throw new AiLogServiceError({
        status: 500,
        code: "ai_log_store_write_failed",
        message: "Failed to write AI log store",
        details: {
          filePath,
          reason: toText(error?.message),
        },
      });
    }
  };

  const getFirestoreCollection = () => {
    return firestore.collection("aiLogs");
  };

  return {
    async record(entry) {
      const normalizedEntry = normalizeEntry(entry);
      if (!normalizedEntry) return null;

      if (useFirestore) {
        try {
          await getFirestoreCollection().doc(normalizedEntry.id).set(normalizedEntry, { merge: true });
          return normalizedEntry;
        } catch (error) {
          throw new AiLogServiceError({
            status: 500,
            code: "ai_log_store_write_failed",
            message: "Failed to write AI log to Firestore",
            details: {
              reason: toText(error?.message),
            },
          });
        }
      }

      const store = readStore();
      const nextEntries = [normalizedEntry, ...store.entries.map((item) => normalizeEntry(item)).filter(Boolean)];
      store.entries = sortEntriesDesc(nextEntries).slice(0, maxItems);
      writeStore(store);
      return normalizedEntry;
    },

    async list(payload) {
      if (useFirestore) {
        try {
          const limit = clamp(payload?.limit, 1, maxItems, 50);
          const snapshot = await getFirestoreCollection()
            .orderBy("createdAt", "desc")
            .limit(limit)
            .get();
          return snapshot.docs
            .map((document) => normalizeEntry(document.data()))
            .filter(Boolean);
        } catch (error) {
          throw new AiLogServiceError({
            status: 500,
            code: "ai_log_store_read_failed",
            message: "Failed to read AI logs from Firestore",
            details: {
              reason: toText(error?.message),
            },
          });
        }
      }

      const store = readStore();
      const limit = clamp(payload?.limit, 1, maxItems, 50);
      return sortEntriesDesc(store.entries.map((item) => normalizeEntry(item)).filter(Boolean)).slice(0, limit);
    },

    async clear() {
      if (useFirestore) {
        try {
          const snapshot = await getFirestoreCollection().limit(maxItems).get();
          if (!snapshot.empty) {
            const batch = firestore.batch();
            snapshot.docs.forEach((document) => {
              batch.delete(document.ref);
            });
            await batch.commit();
          }
          return {
            clearedAt: new Date().toISOString(),
          };
        } catch (error) {
          throw new AiLogServiceError({
            status: 500,
            code: "ai_log_store_clear_failed",
            message: "Failed to clear AI logs from Firestore",
            details: {
              reason: toText(error?.message),
            },
          });
        }
      }

      writeStore({ entries: [] });
      return {
        clearedAt: new Date().toISOString(),
      };
    },
  };
};

module.exports = {
  AiLogServiceError,
  createAiLogService,
};
