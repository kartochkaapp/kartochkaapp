"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { toText } = require("../utils");
const { getFirebaseAdminApp, getFirebaseAdminFirestore } = require("./firebase-admin");

class FeedbackServiceError extends Error {
  constructor(params) {
    super(String(params?.message || "Feedback service error"));
    this.name = "FeedbackServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "feedback_service_error";
    this.details = params?.details || null;
  }
}

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const nowIso = () => new Date().toISOString();
const text = (value, maxLength) => String(value || "").replace(/\u0000/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength || 1000);
const idPart = (value, maxLength) => text(value, maxLength || 120).replace(/[^a-zA-Z0-9._:@-]+/g, "_");
const randomId = (prefix) => prefix + "-" + Date.now() + "-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10);

const resolveActor = async (requestContext, adminApp) => {
  const adminAuth = adminApp && typeof adminApp.auth === "function" ? adminApp.auth() : null;
  const authToken = toText(requestContext?.authToken);

  if (authToken && adminAuth) {
    try {
      const decoded = await adminAuth.verifyIdToken(authToken);
      const uid = idPart(decoded?.uid, 140);
      if (uid) {
        return {
          type: "user",
          uid,
          email: text(decoded?.email || requestContext?.userEmailHint, 180),
          verified: true,
        };
      }
    } catch (error) {
      // Fall through to hints: feedback should not block the product flow.
    }
  }

  const hintedUid = idPart(requestContext?.userIdHint, 140);
  if (hintedUid) {
    return {
      type: "user",
      uid: hintedUid,
      email: text(requestContext?.userEmailHint, 180),
      verified: false,
    };
  }

  return {
    type: "guest",
    uid: "",
    email: "",
    verified: false,
  };
};

const createFeedbackService = (deps = {}) => {
  const firebaseConfig = isObject(deps.firebaseAdmin) ? deps.firebaseAdmin : {};
  const adminApp = getFirebaseAdminApp(firebaseConfig);
  const firestore = getFirebaseAdminFirestore(firebaseConfig);
  const useFirestore = Boolean(adminApp && firestore);
  const filePath = toText(deps.filePath) || path.join(os.tmpdir(), "kartochka-feedback-store.json");

  const readFileStore = () => {
    if (!fs.existsSync(filePath)) return { generationFeedback: [], productFeedback: [] };
    try {
      const raw = fs.readFileSync(filePath, "utf8").trim();
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        generationFeedback: Array.isArray(parsed.generationFeedback) ? parsed.generationFeedback : [],
        productFeedback: Array.isArray(parsed.productFeedback) ? parsed.productFeedback : [],
      };
    } catch (error) {
      throw new FeedbackServiceError({
        status: 500,
        code: "feedback_store_read_failed",
        message: "Failed to read feedback store",
        details: { filePath, reason: toText(error?.message) },
      });
    }
  };

  const writeFileStore = (store) => {
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(store, null, 2), "utf8");
    } catch (error) {
      throw new FeedbackServiceError({
        status: 500,
        code: "feedback_store_write_failed",
        message: "Failed to write feedback store",
        details: { filePath, reason: toText(error?.message) },
      });
    }
  };

  const saveDocument = async (collectionName, entry, docId) => {
    if (useFirestore) {
      await firestore.collection(collectionName).doc(docId || entry.id).set(entry, { merge: true });
      return { storage: "firestore" };
    }

    const store = readFileStore();
    const listName = collectionName === "generationFeedback" ? "generationFeedback" : "productFeedback";
    const current = store[listName].filter((item) => item.id !== entry.id);
    store[listName] = [entry, ...current].slice(0, 1000);
    writeFileStore(store);
    return { storage: "file" };
  };

  const buildCommonMeta = async (payload, requestContext) => {
    const actor = await resolveActor(requestContext, adminApp);
    return {
      createdAt: nowIso(),
      actorType: actor.type,
      userId: actor.uid,
      userEmail: actor.email,
      verifiedUser: Boolean(actor.verified),
      requestId: text(payload?.requestId, 180),
      generationId: text(payload?.generationId, 180),
      historyEntryId: text(payload?.historyEntryId, 180),
      resultId: text(payload?.resultId, 180),
      mode: text(payload?.mode, 80),
      templateId: text(payload?.templateId, 180),
      templateTitle: text(payload?.templateTitle, 180),
      provider: text(payload?.provider, 120),
      providerLabel: text(payload?.providerLabel, 120),
      imageModel: text(payload?.imageModel, 180),
    };
  };

  return {
    async saveGenerationFeedback(payload, requestContext) {
      if (!isObject(payload)) {
        throw new FeedbackServiceError({ status: 400, code: "invalid_feedback_payload", message: "Feedback payload must be an object" });
      }

      const rating = text(payload.rating, 20).toLowerCase();
      if (rating !== "up" && rating !== "down") {
        throw new FeedbackServiceError({ status: 400, code: "invalid_feedback_rating", message: "Feedback rating must be up or down" });
      }

      const common = await buildCommonMeta(payload, requestContext);
      const stableKey = [
        common.userId || "guest",
        common.historyEntryId || common.requestId || "request",
        common.resultId || common.generationId || "result",
      ].map((part) => idPart(part, 120) || "unknown").join("__");
      const entry = {
        id: "rating-" + stableKey,
        type: "generation_rating",
        rating,
        ...common,
        resultTitle: text(payload.resultTitle, 180),
        resultAssetUrl: text(payload.resultAssetUrl, 500),
        resultPreviewUrl: text(payload.resultPreviewUrl, 500),
      };
      const persisted = await saveDocument("generationFeedback", entry, entry.id);
      return { ok: true, entry: { id: entry.id, rating }, storage: persisted };
    },

    async saveProductFeedback(payload, requestContext) {
      if (!isObject(payload)) {
        throw new FeedbackServiceError({ status: 400, code: "invalid_feedback_payload", message: "Feedback payload must be an object" });
      }

      const message = String(payload.message || "").replace(/\u0000/g, "").trim().slice(0, 5000);
      if (!message) {
        throw new FeedbackServiceError({ status: 400, code: "empty_feedback_message", message: "Feedback message is required" });
      }

      const common = await buildCommonMeta(payload, requestContext);
      const entry = {
        id: randomId("product-feedback"),
        type: "product_feedback",
        message,
        generationCount: Number.isFinite(Number(payload.generationCount)) ? Number(payload.generationCount) : 0,
        triggerAt: Number.isFinite(Number(payload.triggerAt)) ? Number(payload.triggerAt) : 0,
        page: text(payload.page, 120),
        ...common,
      };
      const persisted = await saveDocument("productFeedback", entry, entry.id);
      return { ok: true, entry: { id: entry.id }, storage: persisted };
    },
  };
};

module.exports = {
  FeedbackServiceError,
  createFeedbackService,
};
