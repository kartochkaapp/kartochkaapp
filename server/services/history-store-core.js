"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const { clamp, toText } = require("../utils");
const { getFirebaseAdminApp, getFirebaseAdminFirestore } = require("./firebase-admin");

class HistoryServiceError extends Error {
  constructor(params) {
    super(String(params?.message || "History service error"));
    this.name = "HistoryServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "history_service_error";
    this.details = params?.details || null;
  }
}

const STORE_MODE_AUTO = "auto";
const STORE_SHAPE = Object.freeze({ scopes: {} });
const GUEST_COOKIE = "kartochka_guest_id";
const GUEST_COOKIE_TTL = 31536000;
const SCOPE_COLLECTION = "kartochkaHistoryScopes";
const ENTRY_COLLECTION = "entries";
const MAX_ENTRY_BYTES = 850 * 1024;
const MAX_DATA_URL_BYTES = 180 * 1024;
const MAX_ITEMS_DEFAULT = 30;
const MAX_RESULTS = 5;
const MAX_UPLOADS = 5;
const MAX_CHARACTERISTICS = 24;

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const ensureObject = (value) => (isObject(value) ? value : {});
const nowIso = () => new Date().toISOString();
const scopeToken = (value, maxLength) => toText(value).replace(/[^a-zA-Z0-9._:@-]+/g, "_").slice(0, maxLength || 120);
const buildHistoryId = () => "history-" + String(Date.now()) + "-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10);

const text = (value, maxLength, options) => {
  let result = String(value || "").replace(/\u0000/g, "");
  if (options?.redactDataUrls) {
    result = result.replace(/data:[^,\s]+,[A-Za-z0-9+/=%-]+/gi, "[omitted data]");
  }
  if (!options?.keepWhitespace) {
    result = result.replace(/\s+/g, " ");
  }
  result = result.trim();
  return Number.isFinite(Number(maxLength)) ? result.slice(0, Number(maxLength)) : result;
};

const ts = (value, fallback) => {
  const parsed = new Date(toText(value) || toText(fallback) || Date.now());
  const timeMs = Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
  return { iso: new Date(timeMs).toISOString(), ms: timeMs };
};

const estimateDataUrlBytes = (value) => {
  const raw = toText(value);
  const commaIndex = raw.indexOf(",");
  if (commaIndex < 0) return Buffer.byteLength(raw, "utf8");
  const meta = raw.slice(0, commaIndex);
  const body = raw.slice(commaIndex + 1);
  return /;base64/i.test(meta) ? Math.floor((body.length * 3) / 4) : Buffer.byteLength(body, "utf8");
};

const safeUrl = (value) => {
  const raw = toText(value);
  if (!raw || /^blob:/i.test(raw)) return "";
  if (/^data:image\//i.test(raw)) return estimateDataUrlBytes(raw) <= MAX_DATA_URL_BYTES ? raw : "";
  if (/^https?:\/\//i.test(raw)) return raw.length <= 4096 ? raw : "";
  if ((raw.startsWith("/") || raw.startsWith("./")) && !raw.includes("..")) return raw.length <= 512 ? raw : "";
  return "";
};

const sortDesc = (entries) => entries.slice().sort((a, b) => Number(b?.createdAtMs || 0) - Number(a?.createdAtMs || 0));

const errorFor = (operation, storage, error, filePath, storeMode) => new HistoryServiceError({
  status: storage === "firestore" ? 503 : 500,
  code: operation === "write" ? "history_store_write_failed" : "history_store_read_failed",
  message: "Failed to " + operation + " history from " + (storage === "firestore" ? "Firestore" : "file store"),
  details: { storage, requestedStoreMode: storeMode, filePath: filePath || "", reason: toText(error?.message) },
});

const normalizeStoreMode = (value) => {
  const normalized = toText(value).toLowerCase();
  return normalized === "file" || normalized === "firestore" ? normalized : STORE_MODE_AUTO;
};

const ensureStoreShape = (value) => {
  if (!isObject(value)) return { scopes: {} };
  return { scopes: isObject(value.scopes) ? value.scopes : {} };
};

const buildFallbackResult = (previewUrl, index, total) => ({
  id: "result-" + String(index + 1),
  title: "Result " + String(index + 1),
  previewUrl,
  variantNumber: index + 1,
  totalVariants: total,
  subtitle: "",
  summary: "",
  format: "",
  styleLabel: "",
  referenceStyle: false,
  downloadName: "",
});

const normalizeEntry = (entry, actor, options) => {
  if (!isObject(entry)) return null;

  const createdAt = ts(entry.createdAt || entry.timestamp, nowIso());
  const updatedAt = options?.touch
    ? ts(nowIso(), createdAt.iso)
    : ts(entry.updatedAt || entry.timestamps?.updatedAt || entry.savedAt || entry.timestamps?.savedAt, createdAt.iso);
  const savedAt = options?.touch ? updatedAt : ts(entry.savedAt || entry.timestamps?.savedAt, updatedAt.iso);

  const uploads = (Array.isArray(entry.uploads) ? entry.uploads : [])
    .slice(0, MAX_UPLOADS)
    .map((upload, index) => ({
      id: scopeToken(upload?.id || "upload-" + String(index + 1), 120) || "upload-" + String(index + 1),
      role: ["product", "source", "reference"].includes(text(upload?.role, 20).toLowerCase())
        ? text(upload?.role, 20).toLowerCase()
        : "product",
      name: text(upload?.name || "image-" + String(index + 1) + ".png", 180),
      type: text(upload?.type || "image/png", 80),
      url: safeUrl(upload?.url || upload?.previewUrl),
    }))
    .filter((upload) => upload.name || upload.url);

  const fallbackPreviews = (Array.isArray(entry.resultPreviews) ? entry.resultPreviews : [])
    .map((item) => safeUrl(item))
    .filter(Boolean)
    .slice(0, MAX_RESULTS);

  const results = (Array.isArray(entry.results) ? entry.results : [])
    .slice(0, MAX_RESULTS)
    .map((result, index) => ({
      id: scopeToken(result?.id || "result-" + String(index + 1), 120) || "result-" + String(index + 1),
      title: text(result?.title || "Result " + String(index + 1), 180),
      previewUrl: safeUrl(result?.previewUrl || fallbackPreviews[index] || uploads[index]?.url || uploads[0]?.url),
      variantNumber: clamp(result?.variantNumber, 1, 50, index + 1),
      totalVariants: clamp(result?.totalVariants || result?.total, 1, 50, (entry.results || []).length || fallbackPreviews.length || 1),
      subtitle: text(result?.subtitle || result?.strategy, 240),
      summary: text(result?.summary || result?.focus || result?.changes, 500, { keepWhitespace: true }),
      format: text(result?.format, 160),
      styleLabel: text(result?.styleLabel, 160),
      referenceStyle: Boolean(result?.referenceStyle),
      downloadName: text(result?.downloadName, 160),
    }));

  const realizedResults = results.length
    ? results
    : fallbackPreviews.map((previewUrl, index) => buildFallbackResult(previewUrl, index, fallbackPreviews.length || 1));

  const resultsCount = clamp(entry.resultsCount, 1, 50, realizedResults.length || 1);
  const input = ensureObject(entry.input);
  const insight = ensureObject(entry.ai?.insight || entry.insight);
  const analysis = ensureObject(entry.ai?.analysis || entry.analysis);

  const aiInsight = {
    category: text(insight.category, 120),
    recommendedStyle: text(insight.recommendedStyle, 240),
    conversionAccent: text(insight.conversionAccent, 320),
    marketplaceFormat: text(insight.marketplaceFormat, 240),
  };

  const aiAnalysis = {
    score: clamp(analysis.score, 0, 100, 0),
    summary: text(analysis.summary, 700, { keepWhitespace: true }),
    marketplaceFormat: text(analysis.marketplaceFormat, 240),
    reference: {
      uploaded: Boolean(analysis.reference?.uploaded),
      active: Boolean(analysis.reference?.active),
      note: text(analysis.reference?.note, 240),
    },
    issues: (Array.isArray(analysis.issues) ? analysis.issues : [])
      .slice(0, 8)
      .map((issue, index) => ({
        key: scopeToken(issue?.key || "issue-" + String(index + 1), 80) || "issue-" + String(index + 1),
        title: text(issue?.title || "Issue " + String(index + 1), 180),
        severity: ["high", "medium", "low"].includes(text(issue?.severity, 16).toLowerCase())
          ? text(issue?.severity, 16).toLowerCase()
          : "medium",
        note: text(issue?.note, 320, { keepWhitespace: true }),
      })),
    recommendations: (Array.isArray(analysis.recommendations) ? analysis.recommendations : [])
      .slice(0, 6)
      .map((item) => text(item, 320, { keepWhitespace: true }))
      .filter(Boolean),
  };

  const summary = text(
    entry.summary
      || entry.ai?.summary
      || aiAnalysis.summary
      || aiInsight.conversionAccent
      || input.description
      || input.highlights
      || input.improvePrompt
      || "",
    500,
    { keepWhitespace: true }
  ) || (entry.mode === "improve" ? "Improved card" : "Generated card");

  const normalized = {
    id: scopeToken(entry.id, 120) || buildHistoryId(),
    scopeId: actor.scopeKey,
    userScope: {
      type: actor.type,
      uid: text(actor.uid, 120),
      guestId: text(actor.guestId, 80),
      email: text(actor.email, 180),
      verified: Boolean(actor.verified),
    },
    mode: text(entry.mode, 20).toLowerCase() === "improve" ? "improve" : "create",
    createdAt: createdAt.iso,
    updatedAt: updatedAt.iso,
    savedAt: savedAt.iso,
    timestamps: { createdAt: createdAt.iso, updatedAt: updatedAt.iso, savedAt: savedAt.iso },
    title: text(entry.title, 180, { keepWhitespace: true }) || ((entry.mode === "improve" ? "Improved cards (" : "Generated cards (") + String(resultsCount) + ")"),
    summary,
    prompt: text(entry.prompt, 8000, { keepWhitespace: true, redactDataUrls: true }),
    resultsCount,
    previewUrl: safeUrl(entry.previewUrl || realizedResults[0]?.previewUrl || uploads[0]?.url),
    resultPreviews: realizedResults.map((item) => safeUrl(item.previewUrl)).filter(Boolean).slice(0, MAX_RESULTS),
    input: {
      description: text(input.description || entry.description, 2000, { keepWhitespace: true }),
      highlights: text(input.highlights || entry.highlights, 2000, { keepWhitespace: true }),
      generationNotes: text(input.generationNotes, 2400, { keepWhitespace: true }),
      mainText: text(input.mainText, 300, { keepWhitespace: true }),
      secondaryText: text(input.secondaryText, 500, { keepWhitespace: true }),
      tertiaryText: text(input.tertiaryText, 500, { keepWhitespace: true }),
      marketplace: text(input.marketplace || entry.meta?.marketplace, 120),
      cardsCount: clamp(input.cardsCount, 1, 50, resultsCount),
      promptMode: text(input.promptMode || entry.meta?.promptMode || "ai", 40).toLowerCase() || "ai",
      selectedTemplateId: text(input.selectedTemplateId, 120),
      customPrompt: text(input.customPrompt, 8000, { keepWhitespace: true, redactDataUrls: true }),
      improvePrompt: text(input.improvePrompt, 4000, { keepWhitespace: true, redactDataUrls: true }),
      improveMode: text(input.improveMode || entry.meta?.improveMode || "ai", 40).toLowerCase() || "ai",
      variantsCount: clamp(input.variantsCount, 1, 50, resultsCount),
      referenceStyle: Boolean(input.referenceStyle || entry.meta?.referenceStyle),
      characteristics: (Array.isArray(input.characteristics) ? input.characteristics : [])
        .slice(0, MAX_CHARACTERISTICS)
        .map((item, index) => ({
          id: scopeToken(item?.id || "metric-" + String(index + 1), 80) || "metric-" + String(index + 1),
          label: text(item?.label, 120),
          value: text(item?.value, 240),
          order: clamp(item?.order, 1, MAX_CHARACTERISTICS, index + 1),
        }))
        .filter((item) => item.label || item.value),
    },
    uploads,
    ai: {
      summary,
      insight: Object.values(aiInsight).some(Boolean) ? aiInsight : null,
      analysis: aiAnalysis.summary || aiAnalysis.issues.length || aiAnalysis.recommendations.length || aiAnalysis.reference.note || aiAnalysis.score ? aiAnalysis : null,
    },
    results: realizedResults,
    meta: {
      marketplace: text(entry.meta?.marketplace || input.marketplace, 120),
      promptMode: text(entry.meta?.promptMode || input.promptMode, 40).toLowerCase(),
      improveMode: text(entry.meta?.improveMode || input.improveMode, 40).toLowerCase(),
      referenceStyle: Boolean(entry.meta?.referenceStyle || input.referenceStyle),
      selectedTemplateId: text(entry.meta?.selectedTemplateId || input.selectedTemplateId, 120),
    },
    status: {
      state: ["completed", "partial", "failed", "draft"].includes(text(entry.status?.state || entry.status || "completed", 20).toLowerCase())
        ? text(entry.status?.state || entry.status || "completed", 20).toLowerCase()
        : "completed",
      truncated: false,
    },
    source: {
      kind: text(entry.source?.kind || "user_action", 40).toLowerCase() || "user_action",
      channel: text(entry.source?.channel || "historySave", 60).toLowerCase() || "historysave",
      requestId: text(entry.source?.requestId || options?.payload?.requestId, 120),
      requestedScopeId: text(actor.requestedScopeId, 160),
      actorType: actor.type,
    },
    storageVersion: 2,
    createdAtMs: createdAt.ms,
    updatedAtMs: updatedAt.ms,
  };

  const sizeOf = (value) => Buffer.byteLength(JSON.stringify(value), "utf8");
  const warnings = [];
  const note = (message) => { if (!warnings.includes(message)) warnings.push(message); };

  if (sizeOf(normalized) > MAX_ENTRY_BYTES) {
    for (let index = normalized.results.length - 1; index >= 1 && sizeOf(normalized) > MAX_ENTRY_BYTES; index -= 1) {
      if (normalized.results[index]?.previewUrl) {
        normalized.results[index].previewUrl = "";
        note("Some history previews were omitted to keep storage safe.");
      }
    }
    for (let index = normalized.uploads.length - 1; index >= 1 && sizeOf(normalized) > MAX_ENTRY_BYTES; index -= 1) {
      if (normalized.uploads[index]?.url) {
        normalized.uploads[index].url = "";
        note("Some uploaded source previews were omitted to keep storage safe.");
      }
    }
    while (normalized.ai?.analysis?.issues?.length > 4 && sizeOf(normalized) > MAX_ENTRY_BYTES) {
      normalized.ai.analysis.issues.pop();
      note("Detailed AI issues were trimmed for storage.");
    }
    while (normalized.ai?.analysis?.recommendations?.length > 3 && sizeOf(normalized) > MAX_ENTRY_BYTES) {
      normalized.ai.analysis.recommendations.pop();
      note("Detailed AI recommendations were trimmed for storage.");
    }
    while (normalized.input?.characteristics?.length > 10 && sizeOf(normalized) > MAX_ENTRY_BYTES) {
      normalized.input.characteristics.pop();
      note("Extra characteristic rows were trimmed for storage.");
    }
    if (sizeOf(normalized) > MAX_ENTRY_BYTES && normalized.results[0]?.previewUrl) {
      normalized.results[0].previewUrl = "";
      note("Primary result preview was omitted to keep storage safe.");
    }
    if (sizeOf(normalized) > MAX_ENTRY_BYTES && normalized.uploads[0]?.url) {
      normalized.uploads[0].url = "";
      note("Primary upload preview was omitted to keep storage safe.");
    }
    if (sizeOf(normalized) > MAX_ENTRY_BYTES) {
      normalized.prompt = text(normalized.prompt, 2000, { keepWhitespace: true, redactDataUrls: true });
      normalized.input.customPrompt = text(normalized.input.customPrompt, 2000, { keepWhitespace: true, redactDataUrls: true });
      normalized.input.improvePrompt = text(normalized.input.improvePrompt, 2000, { keepWhitespace: true, redactDataUrls: true });
      normalized.input.generationNotes = text(normalized.input.generationNotes, 1200, { keepWhitespace: true });
      note("Long prompt fields were trimmed for storage.");
    }
    if (sizeOf(normalized) > MAX_ENTRY_BYTES) {
      normalized.summary = text(normalized.summary, 280, { keepWhitespace: true });
      normalized.ai.summary = text(normalized.ai.summary, 280, { keepWhitespace: true });
      note("Summary fields were trimmed for storage.");
    }
    if (sizeOf(normalized) > MAX_ENTRY_BYTES) {
      throw new HistoryServiceError({
        status: 413,
        code: "history_entry_too_large",
        message: "History entry is too large to store safely",
        details: { id: normalized.id, bytes: sizeOf(normalized), limitBytes: MAX_ENTRY_BYTES },
      });
    }
    normalized.status.truncated = true;
    normalized.status.warning = warnings[0];
    normalized.status.warnings = warnings.slice(0, 3);
  }

  normalized.resultPreviews = normalized.results.map((item) => safeUrl(item.previewUrl)).filter(Boolean).slice(0, MAX_RESULTS);
  normalized.previewUrl = safeUrl(normalized.previewUrl) || normalized.resultPreviews[0] || normalized.uploads.map((item) => safeUrl(item.url)).find(Boolean) || "";
  return normalized;
};

const normalizeEntries = (entries, actor, options) => {
  const deduped = [];
  const seen = new Set();
  sortDesc((Array.isArray(entries) ? entries : []).map((entry) => normalizeEntry(entry, actor, options)).filter(Boolean)).forEach((entry) => {
    if (seen.has(entry.id)) return;
    seen.add(entry.id);
    deduped.push(entry);
  });
  return deduped;
};

const createHistoryService = (deps) => {
  const filePath = toText(deps?.filePath);
  const maxItems = clamp(deps?.maxItems, 1, 500, MAX_ITEMS_DEFAULT);
  const storeMode = normalizeStoreMode(deps?.storeMode);
  const firebaseConfig = ensureObject(deps?.firebaseAdmin);
  const adminApp = getFirebaseAdminApp(firebaseConfig);
  const firestore = getFirebaseAdminFirestore(firebaseConfig);
  const adminAuth = adminApp && typeof adminApp.auth === "function" ? adminApp.auth() : null;
  const useFirestore = storeMode !== "file" && Boolean(adminApp && firestore);
  const allowFileFallback = storeMode !== "firestore" && Boolean(filePath);

  const ensureAvailable = (operation) => {
    if (useFirestore || allowFileFallback) return;
    throw new HistoryServiceError({
      status: 503,
      code: "history_persistence_unavailable",
      message: "History persistence is not available",
      details: { operation, requestedStoreMode: storeMode, requires: "FIREBASE_ADMIN_* or writable file storage" },
    });
  };

  const ensureDir = () => {
    if (filePath) fs.mkdirSync(path.dirname(filePath), { recursive: true });
  };

  const readStore = () => {
    ensureDir();
    if (!filePath || !fs.existsSync(filePath)) return { scopes: {} };
    try {
      const raw = fs.readFileSync(filePath, "utf8").trim();
      return ensureStoreShape(raw ? JSON.parse(raw) : {});
    } catch (error) {
      throw new HistoryServiceError({
        status: 500,
        code: "invalid_history_store",
        message: "History store file is corrupted or unreadable",
        details: { filePath, reason: toText(error?.message) },
      });
    }
  };

  const writeStore = (store) => {
    ensureDir();
    try {
      fs.writeFileSync(filePath, JSON.stringify(ensureStoreShape(store || STORE_SHAPE), null, 2), "utf8");
    } catch (error) {
      throw new HistoryServiceError({
        status: 500,
        code: "history_store_write_failed",
        message: "Failed to write history store",
        details: { filePath, reason: toText(error?.message) },
      });
    }
  };

  const appendGuestCookie = (requestContext, guestId) => {
    if (!requestContext || typeof requestContext.appendResponseHeader !== "function" || !guestId) return;
    const parts = [
      GUEST_COOKIE + "=" + encodeURIComponent(guestId),
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=" + String(GUEST_COOKIE_TTL),
    ];
    if (requestContext.isSecure) parts.push("Secure");
    requestContext.appendResponseHeader("Set-Cookie", parts.join("; "));
  };

  const resolveActor = async (payload, requestContext) => {
    const requestedScopeId = scopeToken(payload?.scopeId || payload?.userId, 160);
    const hintedUid = scopeToken(requestContext?.userIdHint, 120);

    if (toText(requestContext?.authToken) && adminAuth) {
      try {
        const decoded = await adminAuth.verifyIdToken(requestContext.authToken);
        const uid = scopeToken(decoded?.uid, 120);
        if (uid) {
          return {
            type: "user",
            scopeKey: uid,
            uid,
            email: text(decoded?.email || requestContext?.userEmailHint, 180),
            verified: true,
            requestedScopeId,
          };
        }
      } catch (error) {
        // Verified Firebase users only in Firestore-backed mode.
      }
    }

    if (hintedUid && !adminAuth) {
      return {
        type: "user",
        scopeKey: hintedUid,
        uid: hintedUid,
        email: text(requestContext?.userEmailHint, 180),
        verified: false,
        requestedScopeId,
      };
    }

    let guestId = scopeToken(requestContext?.cookies?.[GUEST_COOKIE], 80);
    if (!guestId && requestedScopeId.startsWith("guest:")) {
      guestId = scopeToken(requestedScopeId.slice("guest:".length), 80);
    }
    if (!guestId) {
      guestId = "g_" + crypto.randomUUID().replace(/-/g, "").slice(0, 24);
    }
    appendGuestCookie(requestContext, guestId);

    return {
      type: "guest",
      scopeKey: "guest:" + guestId,
      guestId,
      email: "",
      verified: false,
      requestedScopeId,
    };
  };

  const readFileEntries = (actor, limit) => {
    const store = readStore();
    return normalizeEntries(store.scopes[actor.scopeKey], actor, { touch: false }).slice(0, clamp(limit, 1, maxItems, maxItems));
  };

  const writeFileEntries = (actor, entries, options) => {
    const store = readStore();
    const normalized = normalizeEntries(entries, actor, { touch: false, payload: options?.payload }).slice(0, maxItems);
    if (normalized.length) store.scopes[actor.scopeKey] = normalized;
    else delete store.scopes[actor.scopeKey];
    writeStore(store);
    return normalized;
  };

  const scopeRef = (scopeKey) => firestore.collection(SCOPE_COLLECTION).doc(scopeKey);
  const entryRef = (scopeKey) => scopeRef(scopeKey).collection(ENTRY_COLLECTION);

  const listFirestoreEntries = async (actor, limit) => {
    try {
      const snapshot = await entryRef(actor.scopeKey)
        .orderBy("createdAtMs", "desc")
        .limit(clamp(limit, 1, maxItems, maxItems))
        .get();

      return snapshot.docs
        .map((document) => normalizeEntry(document.data(), actor, { touch: false }))
        .filter(Boolean);
    } catch (error) {
      throw errorFor("read", "firestore", error, filePath, storeMode);
    }
  };

  const getFirestoreEntry = async (actor, id) => {
    try {
      const snapshot = await entryRef(actor.scopeKey).doc(id).get();
      return snapshot.exists ? normalizeEntry(snapshot.data(), actor, { touch: false }) : null;
    } catch (error) {
      throw errorFor("read", "firestore", error, filePath, storeMode);
    }
  };

  const replaceFirestoreEntries = async (actor, entries, options) => {
    const normalized = normalizeEntries(entries, actor, { touch: false, payload: options?.payload }).slice(0, maxItems);

    try {
      const existing = await entryRef(actor.scopeKey).get();
      const nextIds = new Set(normalized.map((entry) => entry.id));
      const batch = firestore.batch();

      normalized.forEach((entry) => {
        batch.set(entryRef(actor.scopeKey).doc(entry.id), entry, { merge: true });
      });

      existing.docs.forEach((document) => {
        if (!nextIds.has(document.id)) batch.delete(document.ref);
      });

      batch.set(scopeRef(actor.scopeKey), {
        scopeId: actor.scopeKey,
        scopeType: actor.type,
        uid: text(actor.uid, 120),
        guestId: text(actor.guestId, 80),
        email: text(actor.email, 180),
        verified: Boolean(actor.verified),
        entriesCount: normalized.length,
        latestEntryId: normalized[0]?.id || "",
        updatedAt: nowIso(),
        storageVersion: 2,
        ...(isObject(options?.scopeDoc) ? options.scopeDoc : {}),
      }, { merge: true });

      await batch.commit();
      return normalized;
    } catch (error) {
      throw errorFor("write", "firestore", error, filePath, storeMode);
    }
  };

  const ensureFirestoreMigration = async (actor) => {
    if (actor.type !== "user" || !allowFileFallback) return;
    const existing = await listFirestoreEntries(actor, 1);
    if (existing.length) return;
    const legacy = readFileEntries(actor, maxItems);
    if (!legacy.length) return;
    await replaceFirestoreEntries(actor, legacy, {
      scopeDoc: {
        migratedFromFileAt: nowIso(),
      },
    });
  };

  const loadEntries = async (actor, limit) => {
    ensureAvailable("list");

    if (useFirestore) {
      try {
        await ensureFirestoreMigration(actor);
        return {
          entries: await listFirestoreEntries(actor, limit),
          storageMode: "firestore",
          fallbackUsed: false,
        };
      } catch (error) {
        if (!allowFileFallback || error.code === "invalid_history_store") throw error;
      }
    }

    try {
      return {
        entries: readFileEntries(actor, limit),
        storageMode: "file",
        fallbackUsed: useFirestore,
      };
    } catch (error) {
      if (error instanceof HistoryServiceError) throw error;
      throw errorFor("read", "file", error, filePath, storeMode);
    }
  };

  const persistEntries = async (actor, entries, options) => {
    ensureAvailable("save");

    if (useFirestore) {
      try {
        const saved = await replaceFirestoreEntries(actor, entries, {
          payload: options?.payload,
          scopeDoc: { lastSavedAt: nowIso() },
        });

        if (allowFileFallback) {
          try {
            writeFileEntries(actor, saved, { payload: options?.payload });
          } catch (error) {
            // Firestore stays authoritative if the mirror file write fails.
          }
        }

        return {
          entries: saved,
          storageMode: "firestore",
          fallbackUsed: false,
        };
      } catch (error) {
        if (!allowFileFallback || error.code === "invalid_history_store") throw error;
      }
    }

    try {
      return {
        entries: writeFileEntries(actor, entries, { payload: options?.payload }),
        storageMode: "file",
        fallbackUsed: useFirestore,
      };
    } catch (error) {
      if (error instanceof HistoryServiceError) throw error;
      throw errorFor("write", "file", error, filePath, storeMode);
    }
  };

  return {
    async list(payload, requestContext) {
      const actor = await resolveActor(ensureObject(payload), requestContext);
      const limit = clamp(payload?.limit, 1, maxItems, maxItems);
      return (await loadEntries(actor, limit)).entries.slice(0, limit);
    },

    async getById(payload, requestContext) {
      const actor = await resolveActor(ensureObject(payload), requestContext);
      const id = scopeToken(payload?.id, 120);
      if (!id) return null;

      ensureAvailable("getById");
      if (useFirestore) {
        try {
          await ensureFirestoreMigration(actor);
          const entry = await getFirestoreEntry(actor, id);
          if (entry) return entry;
        } catch (error) {
          if (!allowFileFallback || error.code === "invalid_history_store") throw error;
        }
      }

      return (await loadEntries(actor, maxItems)).entries.find((entry) => entry.id === id) || null;
    },

    async save(payload, requestContext) {
      const requestBody = ensureObject(payload);
      const actor = await resolveActor(requestBody, requestContext);

      if (Object.prototype.hasOwnProperty.call(requestBody, "entries") && !Array.isArray(requestBody.entries)) {
        throw new HistoryServiceError({
          status: 400,
          code: "invalid_history_entries",
          message: "historySave entries must be an array",
        });
      }

      if (Object.prototype.hasOwnProperty.call(requestBody, "entry") && !isObject(requestBody.entry)) {
        throw new HistoryServiceError({
          status: 400,
          code: "invalid_history_entry",
          message: "historySave entry must be an object",
        });
      }

      let nextEntries;
      if (requestBody.clear) {
        nextEntries = [];
      } else if (Array.isArray(requestBody.entries)) {
        nextEntries = requestBody.entries;
      } else if (isObject(requestBody.entry)) {
        const currentEntries = (await loadEntries(actor, maxItems)).entries;
        const nextEntry = normalizeEntry(requestBody.entry, actor, { touch: true, payload: requestBody });
        nextEntries = [nextEntry, ...currentEntries.filter((entry) => entry.id !== nextEntry.id)];
      } else {
        nextEntries = (await loadEntries(actor, maxItems)).entries;
      }

      const persisted = await persistEntries(actor, nextEntries, { payload: requestBody });
      return {
        entries: persisted.entries,
        savedAt: nowIso(),
        storage: {
          mode: persisted.storageMode,
          fallbackUsed: Boolean(persisted.fallbackUsed),
          scopeId: actor.scopeKey,
          actorType: actor.type,
          verified: Boolean(actor.verified),
        },
      };
    },
  };
};

module.exports = {
  HistoryServiceError,
  createHistoryService,
};
