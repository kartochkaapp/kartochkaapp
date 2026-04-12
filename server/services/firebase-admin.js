"use strict";

let admin = null;
try {
  admin = require("firebase-admin");
} catch (error) {
  admin = null;
}

const { toText } = require("../utils");

let cachedApp = undefined;
let cachedFirestore = undefined;

const canUseDefaultCredentials = () => {
  return Boolean(
    process.env.GOOGLE_APPLICATION_CREDENTIALS
    || process.env.FIREBASE_CONFIG
    || process.env.GCLOUD_PROJECT
  );
};

const getFirebaseAdminApp = (config) => {
  if (cachedApp !== undefined) return cachedApp;
  if (!admin) {
    cachedApp = null;
    return cachedApp;
  }

  const projectId = toText(config?.projectId || process.env.FIREBASE_ADMIN_PROJECT_ID);
  const clientEmail = toText(config?.clientEmail || process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  const privateKey = toText(config?.privateKey || process.env.FIREBASE_ADMIN_PRIVATE_KEY).replace(/\\n/g, "\n");

  try {
    if (admin.apps.length) {
      cachedApp = admin.app();
      return cachedApp;
    }

    if (projectId && clientEmail && privateKey) {
      cachedApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
      return cachedApp;
    }

    if (canUseDefaultCredentials()) {
      cachedApp = admin.initializeApp(projectId ? { projectId } : {});
      return cachedApp;
    }
  } catch (error) {
    cachedApp = null;
    return cachedApp;
  }

  cachedApp = null;
  return cachedApp;
};

const getFirebaseAdminFirestore = (config) => {
  if (cachedFirestore !== undefined) return cachedFirestore;
  if (!admin) {
    cachedFirestore = null;
    return cachedFirestore;
  }

  const app = getFirebaseAdminApp(config);
  if (!app) {
    cachedFirestore = null;
    return cachedFirestore;
  }

  try {
    cachedFirestore = admin.firestore(app);
    return cachedFirestore;
  } catch (error) {
    cachedFirestore = null;
    return cachedFirestore;
  }
};

module.exports = {
  getFirebaseAdminApp,
  getFirebaseAdminFirestore,
};
