"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { getBillingAction, getPublicBillingCatalog } = require("../billing-config");
const { getFirebaseAdminApp, getFirebaseAdminFirestore } = require("./firebase-admin");
const { clamp, toText } = require("../utils");

class BillingServiceError extends Error {
  constructor(params) {
    super(String(params?.message || "Billing service error"));
    this.name = "BillingServiceError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "billing_service_error";
    this.userMessage = toText(params?.userMessage) || this.message;
    this.details = params?.details || null;
  }
}

const FILE_STORE_SHAPE = Object.freeze({
  users: {},
  ledgers: {},
  promoCodes: {},
});

const DEFAULT_STARTER_TOKENS = 12;
const OPERATION_RESULT_TTL_MS = 10 * 60 * 1000;

const ensureObject = (value) => {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
};

const normalizeUid = (value) => {
  const raw = toText(value);
  const normalized = raw.replace(/[^a-zA-Z0-9._:@-]+/g, "_").slice(0, 120);
  return normalized;
};

const normalizePromoCode = (value) => {
  return toText(value).toUpperCase().replace(/[^A-Z0-9_-]+/g, "");
};

const nowIso = () => new Date().toISOString();

const resolveBillingStoreFilePath = (runtimeRootDir) => {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "kartochka-billing-store.json");
  }

  return path.join(runtimeRootDir, "server", "data", "billing-store.json");
};

const parsePromoSeeds = (rawValue) => {
  const rawText = toText(rawValue);
  if (!rawText) return [];

  try {
    const parsed = JSON.parse(rawText);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const code = normalizePromoCode(entry.code);
        const tokens = clamp(entry.tokens, 1, 100000, 0);
        if (!code || !tokens) return null;
        return {
          code,
          tokens,
          active: entry.active !== false,
          description: toText(entry.description),
          expiresAt: toText(entry.expiresAt),
          maxRedemptions: clamp(entry.maxRedemptions, 0, 1000000, 0),
          perUserLimit: clamp(entry.perUserLimit, 0, 1000000, 1),
        };
      })
      .filter(Boolean);
  } catch (error) {
    return [];
  }
};

const createBillingService = (deps) => {
  const rootDir = toText(deps?.rootDir) || process.cwd();
  const starterTokens = clamp(deps?.starterTokens, 0, 1000000, DEFAULT_STARTER_TOKENS);
  const promoSeeds = parsePromoSeeds(deps?.promoSeedsRaw || process.env.BILLING_PROMO_SEEDS);
  const storeMode = toText(deps?.storeMode || process.env.BILLING_STORE_MODE).toLowerCase();
  const filePath = toText(deps?.filePath) || resolveBillingStoreFilePath(rootDir);
  const firebaseConfig = ensureObject(deps?.firebaseAdmin);
  const adminApp = getFirebaseAdminApp(firebaseConfig);
  const firestore = getFirebaseAdminFirestore(firebaseConfig);
  const useFirestore = storeMode === "firestore" || (storeMode !== "file" && Boolean(firestore && adminApp));
  const adminAuth = adminApp ? adminApp.auth() : null;
  const inFlightOperations = new Map();
  const completedOperations = new Map();
  const LOCAL_DEV_USER_ID = "local-dev-user";

  const ensureFileStoreDir = () => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  };

  const readFileStore = () => {
    ensureFileStoreDir();
    if (!fs.existsSync(filePath)) {
      return {
        users: {},
        ledgers: {},
        promoCodes: {},
      };
    }

    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return {
        users: ensureObject(parsed?.users),
        ledgers: ensureObject(parsed?.ledgers),
        promoCodes: ensureObject(parsed?.promoCodes),
      };
    } catch (error) {
      return {
        users: { ...FILE_STORE_SHAPE.users },
        ledgers: { ...FILE_STORE_SHAPE.ledgers },
        promoCodes: { ...FILE_STORE_SHAPE.promoCodes },
      };
    }
  };

  const writeFileStore = (store) => {
    ensureFileStoreDir();
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), "utf8");
  };

  const seedFilePromos = (store) => {
    const promoCodes = ensureObject(store.promoCodes);
    promoSeeds.forEach((seed) => {
      if (promoCodes[seed.code]) return;
      promoCodes[seed.code] = {
        code: seed.code,
        tokens: seed.tokens,
        active: seed.active !== false,
        description: seed.description || "",
        expiresAt: seed.expiresAt || "",
        maxRedemptions: seed.maxRedemptions || 0,
        perUserLimit: seed.perUserLimit || 1,
        redemptionCount: 0,
        redeemedByUsers: {},
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
    });
    store.promoCodes = promoCodes;
    return store;
  };

  const buildLedgerEntryId = (prefix, requestId, actionCode) => {
    const safeRequestId = toText(requestId).replace(/[^a-zA-Z0-9._:@-]+/g, "_").slice(0, 80);
    const safeAction = toText(actionCode).replace(/[^a-zA-Z0-9._:@-]+/g, "_").slice(0, 80);
    if (safeRequestId && safeAction) {
      return prefix + ":" + safeAction + ":" + safeRequestId;
    }
    return prefix + ":" + safeAction + ":" + Date.now() + ":" + Math.random().toString(36).slice(2, 8);
  };

  const buildOperationExecutionKey = (uid, actionCode, requestId) => {
    const safeUid = normalizeUid(uid) || "anonymous";
    const safeAction = toText(actionCode).replace(/[^a-zA-Z0-9._:@-]+/g, "_").slice(0, 80) || "action";
    const safeRequestId = toText(requestId).replace(/[^a-zA-Z0-9._:@-]+/g, "_").slice(0, 120) || "request";
    return safeUid + "::" + safeAction + "::" + safeRequestId;
  };

  const pruneCompletedOperations = () => {
    const now = Date.now();
    completedOperations.forEach((entry, key) => {
      if (!entry || !Number.isFinite(entry.expiresAt) || entry.expiresAt <= now) {
        completedOperations.delete(key);
      }
    });
  };

  const getCompletedOperationResult = (operationKey) => {
    pruneCompletedOperations();
    const entry = completedOperations.get(operationKey);
    return entry ? entry.result : undefined;
  };

  const rememberCompletedOperationResult = (operationKey, result) => {
    pruneCompletedOperations();
    completedOperations.set(operationKey, {
      result,
      expiresAt: Date.now() + OPERATION_RESULT_TTL_MS,
    });
  };

  const buildAccountSummary = (account) => {
    const safeAccount = ensureObject(account);
    return {
      uid: toText(safeAccount.uid),
      planId: toText(safeAccount.planId) || "start",
      balanceTokens: clamp(safeAccount.balanceTokens, 0, 100000000, 0),
      totalGrantedTokens: clamp(safeAccount.totalGrantedTokens, 0, 100000000, 0),
      totalSpentTokens: clamp(safeAccount.totalSpentTokens, 0, 100000000, 0),
      totalPromoTokens: clamp(safeAccount.totalPromoTokens, 0, 100000000, 0),
      createdAt: toText(safeAccount.createdAt),
      updatedAt: toText(safeAccount.updatedAt),
      storageMode: useFirestore ? "firestore" : "file",
    };
  };

  const resolveStarterTokensForUid = (uid) => {
    return normalizeUid(uid) === LOCAL_DEV_USER_ID ? Math.max(starterTokens, 200) : starterTokens;
  };

  const buildStarterAccount = (uid) => {
    const timestamp = nowIso();
    const resolvedStarterTokens = resolveStarterTokensForUid(uid);
    return {
      uid,
      planId: "start",
      balanceTokens: resolvedStarterTokens,
      totalGrantedTokens: resolvedStarterTokens,
      totalSpentTokens: 0,
      totalPromoTokens: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  };

  const buildCreditEntry = (params) => {
    return {
      id: params.id,
      type: "credit",
      source: params.source,
      label: params.label,
      actionCode: toText(params.actionCode),
      tokensDelta: clamp(params.tokensDelta, -100000000, 100000000, 0),
      balanceBefore: clamp(params.balanceBefore, 0, 100000000, 0),
      balanceAfter: clamp(params.balanceAfter, 0, 100000000, 0),
      requestId: toText(params.requestId),
      meta: ensureObject(params.meta),
      createdAt: params.createdAt || nowIso(),
    };
  };

  const sortLedgerEntries = (items) => {
    return items.slice().sort((left, right) => {
      return new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime();
    });
  };

  const ensureFileAccount = (uid) => {
    const store = seedFilePromos(readFileStore());
    const users = ensureObject(store.users);
    const ledgers = ensureObject(store.ledgers);
    const resolvedStarterTokens = resolveStarterTokensForUid(uid);

    if (!users[uid]) {
      const account = buildStarterAccount(uid);
      users[uid] = account;
      const starterEntry = buildCreditEntry({
        id: buildLedgerEntryId("starter", "starter-" + uid, "starter"),
        source: "starter",
        label: "Стартовый бонус",
        actionCode: "starter_grant",
        tokensDelta: resolvedStarterTokens,
        balanceBefore: 0,
        balanceAfter: resolvedStarterTokens,
        meta: {
          starterTokens: resolvedStarterTokens,
        },
        createdAt: account.createdAt,
      });
      ledgers[uid] = [starterEntry];
      store.users = users;
      store.ledgers = ledgers;
      writeFileStore(store);
      return {
        account: buildAccountSummary(account),
        ledger: [starterEntry],
      };
    }

    const existingAccount = ensureObject(users[uid]);
    const existingLedger = Array.isArray(ledgers[uid]) ? ledgers[uid] : [];
    const existingGrantedTokens = clamp(existingAccount.totalGrantedTokens, 0, 100000000, 0);

    if (normalizeUid(uid) === LOCAL_DEV_USER_ID && existingGrantedTokens < resolvedStarterTokens) {
      const topUpTokens = resolvedStarterTokens - existingGrantedTokens;
      const balanceBefore = clamp(existingAccount.balanceTokens, 0, 100000000, 0);
      const topUpEntry = buildCreditEntry({
        id: buildLedgerEntryId("dev-topup", "localhost-" + uid, "local_dev_topup"),
        source: "starter",
        label: "Localhost dev balance",
        actionCode: "local_dev_topup",
        tokensDelta: topUpTokens,
        balanceBefore,
        balanceAfter: balanceBefore + topUpTokens,
        meta: {
          starterTokens: resolvedStarterTokens,
          appliedForUid: uid,
        },
        createdAt: nowIso(),
      });

      existingAccount.balanceTokens = balanceBefore + topUpTokens;
      existingAccount.totalGrantedTokens = clamp(existingGrantedTokens + topUpTokens, 0, 100000000, 0);
      existingAccount.updatedAt = topUpEntry.createdAt;
      users[uid] = existingAccount;
      ledgers[uid] = sortLedgerEntries([topUpEntry].concat(existingLedger));
      store.users = users;
      store.ledgers = ledgers;
      writeFileStore(store);
    }

    const account = buildAccountSummary(users[uid]);
    const ledger = sortLedgerEntries(Array.isArray(ledgers[uid]) ? ledgers[uid] : []);
    return {
      account,
      ledger,
    };
  };

  const listFileLedger = (uid, limit) => {
    const store = seedFilePromos(readFileStore());
    const ledger = sortLedgerEntries(Array.isArray(store.ledgers?.[uid]) ? store.ledgers[uid] : []);
    return ledger.slice(0, clamp(limit, 1, 100, 15));
  };

  const getExistingFileEntry = (uid, entryId) => {
    const store = seedFilePromos(readFileStore());
    const ledger = Array.isArray(store.ledgers?.[uid]) ? store.ledgers[uid] : [];
    return ledger.find((entry) => toText(entry.id) === entryId) || null;
  };

  const debitFileTokens = (uid, action, requestId, meta) => {
    const store = seedFilePromos(readFileStore());
    const users = ensureObject(store.users);
    const ledgers = ensureObject(store.ledgers);

    if (!users[uid]) {
      const ensured = ensureFileAccount(uid);
      users[uid] = ensured.account;
      ledgers[uid] = ensured.ledger;
    }

    const account = ensureObject(users[uid]);
    const balanceBefore = clamp(account.balanceTokens, 0, 100000000, 0);
    const existingEntryId = buildLedgerEntryId("debit", requestId, action.code);
    const existingEntry = Array.isArray(ledgers[uid])
      ? ledgers[uid].find((entry) => toText(entry.id) === existingEntryId)
      : null;

    if (existingEntry) {
      return {
        entry: existingEntry,
        account: buildAccountSummary(account),
        duplicated: true,
      };
    }

    if (balanceBefore < action.tokens) {
      throw new BillingServiceError({
        status: 402,
        code: "billing_insufficient_tokens",
        message: "Недостаточно токенов",
        userMessage:
          "Недостаточно токенов. Нужно " + String(action.tokens) + ", доступно " + String(balanceBefore) + ".",
        details: {
          actionCode: action.code,
          requiredTokens: action.tokens,
          balanceTokens: balanceBefore,
        },
      });
    }

    const balanceAfter = balanceBefore - action.tokens;
    const entry = {
      id: existingEntryId,
      type: "debit",
      source: "ai_action",
      label: action.label,
      actionCode: action.code,
      tokensDelta: -action.tokens,
      balanceBefore,
      balanceAfter,
      requestId: toText(requestId),
      meta: ensureObject(meta),
      createdAt: nowIso(),
    };

    account.balanceTokens = balanceAfter;
    account.totalSpentTokens = clamp(clamp(account.totalSpentTokens, 0, 100000000, 0) + action.tokens, 0, 100000000, 0);
    account.updatedAt = entry.createdAt;
    users[uid] = account;
    ledgers[uid] = sortLedgerEntries([entry].concat(Array.isArray(ledgers[uid]) ? ledgers[uid] : []));
    store.users = users;
    store.ledgers = ledgers;
    writeFileStore(store);

    return {
      entry,
      account: buildAccountSummary(account),
      duplicated: false,
    };
  };

  const refundFileTokens = (uid, action, requestId, reason) => {
    const store = seedFilePromos(readFileStore());
    const users = ensureObject(store.users);
    const ledgers = ensureObject(store.ledgers);
    const account = ensureObject(users[uid]);
    const refundEntryId = buildLedgerEntryId("refund", requestId, action.code);
    const existingEntry = Array.isArray(ledgers[uid])
      ? ledgers[uid].find((entry) => toText(entry.id) === refundEntryId)
      : null;
    if (existingEntry) return existingEntry;

    const balanceBefore = clamp(account.balanceTokens, 0, 100000000, 0);
    const balanceAfter = balanceBefore + action.tokens;
    const refundEntry = buildCreditEntry({
      id: refundEntryId,
      source: "refund",
      label: "Возврат токенов",
      actionCode: action.code,
      tokensDelta: action.tokens,
      balanceBefore,
      balanceAfter,
      requestId,
      meta: {
        reason: toText(reason) || "request_failed",
      },
      createdAt: nowIso(),
    });

    account.balanceTokens = balanceAfter;
    account.totalSpentTokens = Math.max(0, clamp(account.totalSpentTokens, 0, 100000000, 0) - action.tokens);
    account.updatedAt = refundEntry.createdAt;
    users[uid] = account;
    ledgers[uid] = sortLedgerEntries([refundEntry].concat(Array.isArray(ledgers[uid]) ? ledgers[uid] : []));
    store.users = users;
    store.ledgers = ledgers;
    writeFileStore(store);
    return refundEntry;
  };

  const redeemFilePromo = (uid, rawCode) => {
    const code = normalizePromoCode(rawCode);
    if (!code) {
      throw new BillingServiceError({
        status: 400,
        code: "promo_code_required",
        message: "Промокод не указан",
        userMessage: "Введите промокод.",
      });
    }

    const store = seedFilePromos(readFileStore());
    const users = ensureObject(store.users);
    const ledgers = ensureObject(store.ledgers);
    const promoCodes = ensureObject(store.promoCodes);
    const promo = ensureObject(promoCodes[code]);

    if (!Object.keys(promo).length || promo.active === false) {
      throw new BillingServiceError({
        status: 404,
        code: "promo_not_found",
        message: "Promo code not found",
        userMessage: "Промокод не найден или уже отключен.",
      });
    }

    if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) {
      throw new BillingServiceError({
        status: 400,
        code: "promo_expired",
        message: "Promo code expired",
        userMessage: "Срок действия промокода истек.",
      });
    }

    if (!users[uid]) {
      const ensured = ensureFileAccount(uid);
      users[uid] = ensured.account;
      ledgers[uid] = ensured.ledger;
    }

    const redeemedByUsers = ensureObject(promo.redeemedByUsers);
    const userRedeemCount = clamp(redeemedByUsers[uid], 0, 1000000, 0);
    const maxRedemptions = clamp(promo.maxRedemptions, 0, 1000000, 0);
    const redemptionCount = clamp(promo.redemptionCount, 0, 1000000, 0);
    const perUserLimit = clamp(promo.perUserLimit, 0, 1000000, 1);

    if (perUserLimit && userRedeemCount >= perUserLimit) {
      throw new BillingServiceError({
        status: 409,
        code: "promo_already_redeemed",
        message: "Promo code already redeemed",
        userMessage: "Этот промокод уже использован для вашего аккаунта.",
      });
    }

    if (maxRedemptions && redemptionCount >= maxRedemptions) {
      throw new BillingServiceError({
        status: 409,
        code: "promo_limit_reached",
        message: "Promo redemptions limit reached",
        userMessage: "Промокод больше не доступен.",
      });
    }

    const account = ensureObject(users[uid]);
    const tokens = clamp(promo.tokens, 1, 100000000, 0);
    const balanceBefore = clamp(account.balanceTokens, 0, 100000000, 0);
    const balanceAfter = balanceBefore + tokens;
    const entry = buildCreditEntry({
      id: buildLedgerEntryId("promo", code + "-" + uid, code),
      source: "promo",
      label: "Промокод " + code,
      actionCode: "promo_redeem",
      tokensDelta: tokens,
      balanceBefore,
      balanceAfter,
      requestId: code,
      meta: {
        code,
        description: toText(promo.description),
      },
      createdAt: nowIso(),
    });

    account.balanceTokens = balanceAfter;
    account.totalGrantedTokens = clamp(account.totalGrantedTokens, 0, 100000000, 0) + tokens;
    account.totalPromoTokens = clamp(account.totalPromoTokens, 0, 100000000, 0) + tokens;
    account.updatedAt = entry.createdAt;
    users[uid] = account;

    redeemedByUsers[uid] = userRedeemCount + 1;
    promo.redeemedByUsers = redeemedByUsers;
    promo.redemptionCount = redemptionCount + 1;
    promo.updatedAt = entry.createdAt;
    promoCodes[code] = promo;
    ledgers[uid] = sortLedgerEntries([entry].concat(Array.isArray(ledgers[uid]) ? ledgers[uid] : []));

    store.users = users;
    store.ledgers = ledgers;
    store.promoCodes = promoCodes;
    writeFileStore(store);

    return {
      redemption: {
        code,
        tokens,
      },
      account: buildAccountSummary(account),
      ledger: listFileLedger(uid, 12),
    };
  };

  const seedFirestorePromos = async () => {
    if (!useFirestore || !firestore || !promoSeeds.length) return;

    await Promise.all(promoSeeds.map(async (seed) => {
      const ref = firestore.collection("promoCodes").doc(seed.code);
      const snapshot = await ref.get();
      if (snapshot.exists) return;
      await ref.set({
        code: seed.code,
        tokens: seed.tokens,
        active: seed.active !== false,
        description: seed.description || "",
        expiresAt: seed.expiresAt || "",
        maxRedemptions: seed.maxRedemptions || 0,
        perUserLimit: seed.perUserLimit || 1,
        redemptionCount: 0,
        redeemedByUsers: {},
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
    }));
  };

  const getFirestoreAccountRef = (uid) => firestore.collection("billingAccounts").doc(uid);
  const getFirestoreLedgerRef = (uid, entryId) => getFirestoreAccountRef(uid).collection("ledger").doc(entryId);

  const ensureFirestoreAccount = async (uid) => {
    await seedFirestorePromos();

    const accountRef = getFirestoreAccountRef(uid);
    const resolvedStarterTokens = resolveStarterTokensForUid(uid);

    await firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(accountRef);
      if (snapshot.exists) return;

      const account = buildStarterAccount(uid);
      const starterEntry = buildCreditEntry({
        id: buildLedgerEntryId("starter", "starter-" + uid, "starter"),
        source: "starter",
        label: "Стартовый бонус",
        actionCode: "starter_grant",
        tokensDelta: resolvedStarterTokens,
        balanceBefore: 0,
        balanceAfter: resolvedStarterTokens,
        meta: {
          starterTokens: resolvedStarterTokens,
        },
        createdAt: account.createdAt,
      });

      transaction.set(accountRef, account, { merge: true });
      transaction.set(getFirestoreLedgerRef(uid, starterEntry.id), starterEntry, { merge: true });
    });

    const snapshot = await accountRef.get();
    return buildAccountSummary(snapshot.data() || {});
  };

  const listFirestoreLedger = async (uid, limit) => {
    const snapshot = await getFirestoreAccountRef(uid)
      .collection("ledger")
      .orderBy("createdAt", "desc")
      .limit(clamp(limit, 1, 100, 15))
      .get();

    return snapshot.docs.map((doc) => doc.data());
  };

  const debitFirestoreTokens = async (uid, action, requestId, meta) => {
    await ensureFirestoreAccount(uid);
    const accountRef = getFirestoreAccountRef(uid);
    const entryId = buildLedgerEntryId("debit", requestId, action.code);
    const entryRef = getFirestoreLedgerRef(uid, entryId);

    let debitResult = null;

    await firestore.runTransaction(async (transaction) => {
      const [accountSnapshot, existingEntrySnapshot] = await Promise.all([
        transaction.get(accountRef),
        transaction.get(entryRef),
      ]);

      const account = ensureObject(accountSnapshot.data());
      if (existingEntrySnapshot.exists) {
        debitResult = {
          entry: existingEntrySnapshot.data(),
          account: buildAccountSummary(account),
          duplicated: true,
        };
        return;
      }

      const balanceBefore = clamp(account.balanceTokens, 0, 100000000, 0);
      if (balanceBefore < action.tokens) {
        throw new BillingServiceError({
          status: 402,
          code: "billing_insufficient_tokens",
          message: "Недостаточно токенов",
          userMessage:
            "Недостаточно токенов. Нужно " + String(action.tokens) + ", доступно " + String(balanceBefore) + ".",
          details: {
            actionCode: action.code,
            requiredTokens: action.tokens,
            balanceTokens: balanceBefore,
          },
        });
      }

      const balanceAfter = balanceBefore - action.tokens;
      const entry = {
        id: entryId,
        type: "debit",
        source: "ai_action",
        label: action.label,
        actionCode: action.code,
        tokensDelta: -action.tokens,
        balanceBefore,
        balanceAfter,
        requestId: toText(requestId),
        meta: ensureObject(meta),
        createdAt: nowIso(),
      };

      transaction.set(entryRef, entry, { merge: true });
      const nextTotalSpentTokens = clamp(clamp(account.totalSpentTokens, 0, 100000000, 0) + action.tokens, 0, 100000000, 0);
      transaction.set(accountRef, {
        balanceTokens: balanceAfter,
        totalSpentTokens: nextTotalSpentTokens,
        updatedAt: entry.createdAt,
      }, { merge: true });

      debitResult = {
        entry,
        account: buildAccountSummary({
          ...account,
          balanceTokens: balanceAfter,
          totalSpentTokens: nextTotalSpentTokens,
          updatedAt: entry.createdAt,
        }),
        duplicated: false,
      };
    });

    return debitResult;
  };

  const refundFirestoreTokens = async (uid, action, requestId, reason) => {
    const accountRef = getFirestoreAccountRef(uid);
    const refundId = buildLedgerEntryId("refund", requestId, action.code);
    const refundRef = getFirestoreLedgerRef(uid, refundId);

    await firestore.runTransaction(async (transaction) => {
      const [accountSnapshot, refundSnapshot] = await Promise.all([
        transaction.get(accountRef),
        transaction.get(refundRef),
      ]);

      if (refundSnapshot.exists) return;

      const account = ensureObject(accountSnapshot.data());
      const balanceBefore = clamp(account.balanceTokens, 0, 100000000, 0);
      const balanceAfter = balanceBefore + action.tokens;
      const entry = buildCreditEntry({
        id: refundId,
        source: "refund",
        label: "Возврат токенов",
        actionCode: action.code,
        tokensDelta: action.tokens,
        balanceBefore,
        balanceAfter,
        requestId,
        meta: {
          reason: toText(reason) || "request_failed",
        },
        createdAt: nowIso(),
      });

      transaction.set(refundRef, entry, { merge: true });
      transaction.set(accountRef, {
        balanceTokens: balanceAfter,
        totalSpentTokens: Math.max(0, clamp(account.totalSpentTokens, 0, 100000000, 0) - action.tokens),
        updatedAt: entry.createdAt,
      }, { merge: true });
    });
  };

  const redeemFirestorePromo = async (uid, rawCode) => {
    const code = normalizePromoCode(rawCode);
    if (!code) {
      throw new BillingServiceError({
        status: 400,
        code: "promo_code_required",
        message: "Промокод не указан",
        userMessage: "Введите промокод.",
      });
    }

    await ensureFirestoreAccount(uid);
    await seedFirestorePromos();

    const accountRef = getFirestoreAccountRef(uid);
    const promoRef = firestore.collection("promoCodes").doc(code);
    const ledgerId = buildLedgerEntryId("promo", code + "-" + uid, code);
    const ledgerRef = getFirestoreLedgerRef(uid, ledgerId);

    let result = null;

    await firestore.runTransaction(async (transaction) => {
      const [accountSnapshot, promoSnapshot, ledgerSnapshot] = await Promise.all([
        transaction.get(accountRef),
        transaction.get(promoRef),
        transaction.get(ledgerRef),
      ]);

      if (ledgerSnapshot.exists) {
        throw new BillingServiceError({
          status: 409,
          code: "promo_already_redeemed",
          message: "Promo code already redeemed",
          userMessage: "Этот промокод уже использован для вашего аккаунта.",
        });
      }

      if (!promoSnapshot.exists) {
        throw new BillingServiceError({
          status: 404,
          code: "promo_not_found",
          message: "Promo code not found",
          userMessage: "Промокод не найден или уже отключен.",
        });
      }

      const promo = ensureObject(promoSnapshot.data());
      if (promo.active === false) {
        throw new BillingServiceError({
          status: 404,
          code: "promo_not_found",
          message: "Promo code not found",
          userMessage: "Промокод не найден или уже отключен.",
        });
      }
      if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) {
        throw new BillingServiceError({
          status: 400,
          code: "promo_expired",
          message: "Promo expired",
          userMessage: "Срок действия промокода истек.",
        });
      }

      const redeemedByUsers = ensureObject(promo.redeemedByUsers);
      const userRedeemCount = clamp(redeemedByUsers[uid], 0, 1000000, 0);
      const maxRedemptions = clamp(promo.maxRedemptions, 0, 1000000, 0);
      const redemptionCount = clamp(promo.redemptionCount, 0, 1000000, 0);
      const perUserLimit = clamp(promo.perUserLimit, 0, 1000000, 1);

      if (perUserLimit && userRedeemCount >= perUserLimit) {
        throw new BillingServiceError({
          status: 409,
          code: "promo_already_redeemed",
          message: "Promo already redeemed",
          userMessage: "Этот промокод уже использован для вашего аккаунта.",
        });
      }

      if (maxRedemptions && redemptionCount >= maxRedemptions) {
        throw new BillingServiceError({
          status: 409,
          code: "promo_limit_reached",
          message: "Promo limit reached",
          userMessage: "Промокод больше не доступен.",
        });
      }

      const account = ensureObject(accountSnapshot.data());
      const tokens = clamp(promo.tokens, 1, 100000000, 0);
      const balanceBefore = clamp(account.balanceTokens, 0, 100000000, 0);
      const balanceAfter = balanceBefore + tokens;
      const entry = buildCreditEntry({
        id: ledgerId,
        source: "promo",
        label: "Промокод " + code,
        actionCode: "promo_redeem",
        tokensDelta: tokens,
        balanceBefore,
        balanceAfter,
        requestId: code,
        meta: {
          code,
          description: toText(promo.description),
        },
        createdAt: nowIso(),
      });

      transaction.set(ledgerRef, entry, { merge: true });
      transaction.set(accountRef, {
        balanceTokens: balanceAfter,
        totalGrantedTokens: clamp(account.totalGrantedTokens, 0, 100000000, 0) + tokens,
        totalPromoTokens: clamp(account.totalPromoTokens, 0, 100000000, 0) + tokens,
        updatedAt: entry.createdAt,
      }, { merge: true });
      transaction.set(promoRef, {
        redemptionCount: redemptionCount + 1,
        redeemedByUsers: {
          ...redeemedByUsers,
          [uid]: userRedeemCount + 1,
        },
        updatedAt: entry.createdAt,
      }, { merge: true });

      result = {
        redemption: {
          code,
          tokens,
        },
      };
    });

    return {
      ...result,
      account: await ensureFirestoreAccount(uid),
      ledger: await listFirestoreLedger(uid, 12),
    };
  };

  const resolveUser = async (requestContext) => {
    const authToken = toText(requestContext?.authToken);
    const userIdHint = normalizeUid(requestContext?.userIdHint);

    if (authToken && adminAuth) {
      try {
        const decoded = await adminAuth.verifyIdToken(authToken);
        const uid = normalizeUid(decoded?.uid);
        if (uid) {
          return {
            uid,
            email: toText(decoded?.email || requestContext?.userEmailHint),
            verified: true,
          };
        }
      } catch (error) {
        if (!userIdHint) {
          throw new BillingServiceError({
            status: 401,
            code: "billing_unauthorized",
            message: "Unauthorized",
            userMessage: "Войдите в аккаунт, чтобы использовать AI.",
          });
        }
      }
    }

    if (userIdHint) {
      return {
        uid: userIdHint,
        email: toText(requestContext?.userEmailHint),
        verified: false,
      };
    }

    throw new BillingServiceError({
      status: 401,
      code: "billing_unauthorized",
      message: "Unauthorized",
      userMessage: "Войдите в аккаунт, чтобы использовать AI.",
    });
  };

  const ensureAccount = async (uid) => {
    return useFirestore ? ensureFirestoreAccount(uid) : ensureFileAccount(uid).account;
  };

  const listLedger = async (uid, limit) => {
    return useFirestore ? listFirestoreLedger(uid, limit) : listFileLedger(uid, limit);
  };

  const getBillingSummary = async (requestContext) => {
    const actor = await resolveUser(requestContext);
    const account = await ensureAccount(actor.uid);
    const ledger = await listLedger(actor.uid, 12);

    return {
      account,
      ledger,
      catalog: getPublicBillingCatalog(),
      auth: {
        uid: actor.uid,
        verified: Boolean(actor.verified),
      },
    };
  };

  const redeemPromoCode = async (requestContext, code) => {
    const actor = await resolveUser(requestContext);
    const result = useFirestore
      ? await redeemFirestorePromo(actor.uid, code)
      : redeemFilePromo(actor.uid, code);

    return {
      ...result,
      catalog: getPublicBillingCatalog(),
      auth: {
        uid: actor.uid,
        verified: Boolean(actor.verified),
      },
    };
  };

  const runBillableAction = async (params) => {
    const action = getBillingAction(params?.actionCode);
    if (!action || !action.tokens) {
      return params.operation();
    }

    const actor = await resolveUser(params?.requestContext);
    const requestId = toText(params?.requestId) || Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    const operationKey = buildOperationExecutionKey(actor.uid, action.code, requestId);
    const cachedResult = getCompletedOperationResult(operationKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const activeOperation = inFlightOperations.get(operationKey);
    if (activeOperation) {
      return activeOperation;
    }

    const operationPromise = (async () => {
      const debitResult = useFirestore
        ? await debitFirestoreTokens(actor.uid, action, requestId, params?.meta)
        : debitFileTokens(actor.uid, action, requestId, params?.meta);

      if (debitResult?.duplicated) {
        const duplicatedResult = getCompletedOperationResult(operationKey);
        if (duplicatedResult !== undefined) {
          return duplicatedResult;
        }
      }

      try {
        const result = await params.operation({
          actor,
          action,
          requestId,
          debitResult,
        });
        rememberCompletedOperationResult(operationKey, result);
        return result;
      } catch (error) {
        if (!debitResult?.duplicated) {
          if (useFirestore) {
            await refundFirestoreTokens(actor.uid, action, requestId, error?.code || error?.message);
          } else {
            refundFileTokens(actor.uid, action, requestId, error?.code || error?.message);
          }
        }
        throw error;
      } finally {
        inFlightOperations.delete(operationKey);
      }
    })();

    inFlightOperations.set(operationKey, operationPromise);
    return operationPromise;
  };

  return {
    getPublicCatalog: getPublicBillingCatalog,
    getBillingSummary,
    redeemPromoCode,
    runBillableAction,
    resolveUser,
  };
};

module.exports = {
  BillingServiceError,
  createBillingService,
};
