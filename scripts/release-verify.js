"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const vm = require("node:vm");

const ROOT_DIR = path.resolve(__dirname, "..");
const APP_MODES = ["create", "improve", "fourCards", "tools", "animate", "history"];
const SYNTAX_ONLY = process.argv[2] === "syntax";

const log = (message) => {
  process.stdout.write(String(message || "") + "\n");
};

const fail = (message) => {
  throw new Error(String(message || "Verification failed"));
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const readText = (relativePath) => {
  return fs.readFileSync(path.join(ROOT_DIR, relativePath), "utf8");
};

const readJson = (relativePath) => {
  return JSON.parse(readText(relativePath));
};

const collectJavaScriptFiles = (startDir) => {
  const files = [];
  const ignoreNames = new Set([".git", ".claude", "node_modules"]);

  const visit = (directoryPath) => {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    entries.forEach((entry) => {
      if (ignoreNames.has(entry.name)) return;

      const absolutePath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
        return;
      }

      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".js") return;
      files.push(path.relative(ROOT_DIR, absolutePath));
    });
  };

  visit(startDir);
  return files.sort();
};

const runSyntaxChecks = () => {
  log("Syntax check");
  const files = collectJavaScriptFiles(ROOT_DIR);
  assert(files.length > 0, "No JavaScript files found for syntax verification");

  files.forEach((relativePath) => {
    try {
      const source = fs.readFileSync(path.join(ROOT_DIR, relativePath), "utf8");
      new vm.Script(source, {
        filename: relativePath,
      });
    } catch (error) {
      const details = error && error.stack ? error.stack : String(error);
      fail("Syntax check failed for " + relativePath + (details ? "\n" + details : ""));
    }
  });

  log("  OK " + String(files.length) + " JS files parsed");
};

const hasRewrite = (rewrites, source, destination) => {
  return rewrites.some((entry) => entry && entry.source === source && entry.destination === destination);
};

const hasHostRewrite = (rewrites, source, destination, hostPattern) => {
  return rewrites.some((entry) => {
    if (!entry || entry.source !== source || entry.destination !== destination) return false;
    const hosts = Array.isArray(entry.has) ? entry.has : [];
    return hosts.some((item) => item && item.type === "host" && item.value === hostPattern);
  });
};

const runStaticChecks = () => {
  log("Static release checks");
  const vercelConfig = readJson("vercel.json");
  const rewrites = Array.isArray(vercelConfig.rewrites) ? vercelConfig.rewrites : [];
  const modesPattern = APP_MODES.join("|");

  assert(hasRewrite(rewrites, "/app", "/index.html"), "Missing legacy /app rewrite to index.html");
  assert(
    hasRewrite(rewrites, "/app/:mode(" + modesPattern + ")", "/index.html"),
    "Missing legacy /app/:mode rewrite to index.html"
  );
  assert(
    hasHostRewrite(rewrites, "/", "/index.html", "app\\..+"),
    "Missing dedicated app-host root rewrite"
  );
  assert(
    hasHostRewrite(rewrites, "/:mode(" + modesPattern + ")", "/index.html", "app\\..+"),
    "Missing dedicated app-host mode rewrite"
  );
  assert(
    rewrites.some((entry) => {
      if (!entry || entry.source !== "/" || entry.destination !== "/public.html") return false;
      const missing = Array.isArray(entry.missing) ? entry.missing : [];
      return missing.some((item) => item && item.type === "host" && item.value === "app\\..+");
    }),
    "Missing public-host root rewrite to public.html"
  );
  assert(
    hasRewrite(rewrites, "/api/product/detect-type", "/api/kartochka.js?action=productDetectType"),
    "Missing product type detection API rewrite"
  );

  const indexHtml = readText("index.html");
  assert(indexHtml.includes('data-app-mode-panel="improve"'), "Improve panel missing from index.html");
  assert(indexHtml.includes('id="enhanceCardStage"'), "Visible improve stage missing from index.html");
  assert(!indexHtml.includes("improve-legacy-shell"), "Legacy improve shell still present in shipped HTML");
  assert(indexHtml.includes('data-app-mode-panel="tools"'), "Tools panel missing from index.html");
  assert(indexHtml.includes('id="toolsAppRoot"'), "Tools mount missing from index.html");
  assert(indexHtml.includes('data-app-mode-panel="history"'), "History panel missing from index.html");
  assert(indexHtml.includes('id="historyModeList"'), "History workspace list missing from index.html");
  assert(indexHtml.includes('id="createIsClothingToggle"'), "Product type toggle missing from index.html");
  assert(indexHtml.includes('id="createAngleSuggestions"'), "Product angle suggestions missing from index.html");
  assert(indexHtml.includes('id="createProductRoutingSummary"'), "Product routing summary missing from index.html");
  assert(indexHtml.includes("./ui-loading-theme.js"), "Loading UX script is not loaded by index.html");
  assert(indexHtml.includes("./improve-card-flow.js"), "Improve workbench script is not loaded by index.html");
  assert(indexHtml.includes("./tools-module.js"), "Tools module script is not loaded by index.html");

  const publicHtml = readText("public.html");
  assert(publicHtml.includes("./site.js"), "Landing page does not load site.js");

  const appJs = readText("app.js");
  assert(
    (appJs.match(/const historySave = await pushHistory\(/g) || []).length >= 2,
    "app.js should record both create and improve generations into history"
  );
  assert(appJs.includes("recordDetachedImproveResult"), "Detached improve history hook is missing from app.js");
  assert(appJs.includes("enhanceCardPrompt"), "Visible improve prompt hook is missing from app.js");

  const improveScript = readText("improve-card-flow.js");
  assert(improveScript.includes("recordDetachedImproveResult"), "Visible improve flow is not wired to history");
  assert(improveScript.includes("kartochka:improve:prefill"), "Visible improve flow does not accept prefill events");

  const servicesScript = readText(path.join("services", "kartochka-services.js"));
  assert(servicesScript.includes("productDetectType"), "Product type detection client endpoint is missing");
  assert(servicesScript.includes("createRequestLifecycleTracker"), "Mobile request lifecycle tracker is missing");
  assert(servicesScript.includes("waitUntilInteractive"), "Mobile recovery wait hook is missing");
  assert(servicesScript.includes("backgroundEpoch"), "Background interruption tracking is missing");

  const deployDoc = readText(path.join("docs", "app-subdomain-deployment.md"));
  assert(deployDoc.includes("https://<domain>/app/tools"), "Deployment doc does not mention /app/tools");
  assert(deployDoc.includes("https://<domain>/app/history"), "Deployment doc does not mention /app/history");

  log("  OK routes, shipped surfaces, history hooks, and docs/config consistency");
};

const request = (port, method, requestPath, options = {}) => {
  const headers = Object.assign({}, options.headers || {});
  const body = options.body == null ? "" : JSON.stringify(options.body);

  if (method === "POST") {
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = Buffer.byteLength(body);
  }

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: "127.0.0.1",
      port,
      path: requestPath,
      method,
      headers,
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        let json = null;

        try {
          json = text ? JSON.parse(text) : null;
        } catch (error) {
          json = null;
        }

        resolve({
          status: Number(response.statusCode || 0),
          headers: response.headers || {},
          text,
          json,
        });
      });
    });

    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error("Request timed out for " + method + " " + requestPath));
    });

    if (method === "POST") {
      req.write(body);
    }
    req.end();
  });
};

const waitForServer = async (port) => {
  const deadline = Date.now() + 10000;
  let lastError = null;

  while (Date.now() < deadline) {
    try {
      const response = await request(port, "GET", "/index.html");
      if (response.status === 200) return;
      lastError = new Error("Unexpected status " + String(response.status));
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw lastError || new Error("Server did not start in time");
};

const tryDeleteFile = async (absolutePath) => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      if (!fs.existsSync(absolutePath)) return true;
      fs.unlinkSync(absolutePath);
      return true;
    } catch (error) {
      if (error && error.code === "ENOENT") return true;
      const retryable = error && (error.code === "EPERM" || error.code === "EBUSY" || error.code === "EACCES");
      if (!retryable || attempt === 7) return false;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  return !fs.existsSync(absolutePath);
};

const withRestoredFiles = async (relativePaths, fn) => {
  const snapshots = relativePaths.map((relativePath) => {
    const absolutePath = path.join(ROOT_DIR, relativePath);
    return {
      relativePath,
      absolutePath,
      existed: fs.existsSync(absolutePath),
      content: fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : "",
    };
  });

  try {
    return await fn();
  } finally {
    for (const snapshot of snapshots) {
      if (snapshot.existed) {
        fs.mkdirSync(path.dirname(snapshot.absolutePath), { recursive: true });
        fs.writeFileSync(snapshot.absolutePath, snapshot.content, "utf8");
        continue;
      }

      if (fs.existsSync(snapshot.absolutePath)) {
        const deleted = await tryDeleteFile(snapshot.absolutePath);
        if (!deleted && snapshot.content && fs.existsSync(snapshot.absolutePath)) {
          fs.writeFileSync(snapshot.absolutePath, snapshot.content, "utf8");
        }
      }
    }
  }
};

const createHistoryEntry = (mode, suffix) => {
  const previewUrl = "./assets/examples/example-tech.png";
  const isImprove = mode === "improve";

  return {
    id: "release-" + mode + "-" + suffix,
    mode,
    title: isImprove ? "Improved card" : "Generated card",
    summary: isImprove ? "Improved summary" : "Generated summary",
    prompt: isImprove ? "Improve prompt" : "Create prompt",
    resultsCount: 1,
    previewUrl,
    resultPreviews: [previewUrl],
    input: {
      description: isImprove ? "" : "Product description",
      highlights: isImprove ? "" : "Key highlights",
      generationNotes: "",
      mainText: "",
      secondaryText: "",
      tertiaryText: "",
      marketplace: "wb",
      cardsCount: 1,
      promptMode: "ai",
      selectedTemplateId: "",
      customPrompt: "",
      improvePrompt: isImprove ? "Make it cleaner and stronger" : "",
      improveMode: "ai",
      variantsCount: 1,
      referenceStyle: false,
      characteristics: [],
    },
    uploads: [
      {
        id: "upload-" + suffix,
        role: isImprove ? "source" : "product",
        name: "example-tech.png",
        type: "image/png",
        url: previewUrl,
      },
    ],
    ai: {
      summary: isImprove ? "Improved summary" : "Generated summary",
      insight: null,
      analysis: null,
    },
    results: [
      {
        id: "result-" + suffix,
        title: isImprove ? "Improved result" : "Generated result",
        previewUrl,
        variantNumber: 1,
        totalVariants: 1,
        subtitle: "",
        summary: "",
        format: "",
        styleLabel: "",
        referenceStyle: false,
        downloadName: isImprove ? "improved-card.png" : "generated-card.png",
      },
    ],
    meta: {
      marketplace: "wb",
      promptMode: "ai",
      improveMode: "ai",
      referenceStyle: false,
      selectedTemplateId: "",
    },
    status: {
      state: "completed",
      truncated: false,
    },
    source: {
      kind: "user_action",
      channel: isImprove ? "improve" : "create",
      requestId: "release-smoke-" + suffix,
      actorType: "guest",
    },
    storageVersion: 2,
  };
};

const runServerSmoke = async () => {
  log("Local server smoke");
  const port = 24000 + Math.floor(Math.random() * 1000);
  const storeFiles = [
    path.join("server", "data", "history-store.json"),
    path.join("server", "data", "billing-store.json"),
  ];

  await withRestoredFiles(storeFiles, async () => {
    const serverPath = path.join(ROOT_DIR, "server.js");
    const runtimeServicesPath = path.join(ROOT_DIR, "server", "runtime-services.js");
    const originalCreateServer = http.createServer;
    const originalEnv = {
      HOST: process.env.HOST,
      PORT: process.env.PORT,
      PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL,
    };
    let capturedServer = null;

    http.createServer = (...args) => {
      capturedServer = originalCreateServer(...args);
      return capturedServer;
    };

    process.env.HOST = "127.0.0.1";
    process.env.PORT = String(port);
    process.env.PUBLIC_BASE_URL = "http://127.0.0.1:" + String(port);

    delete require.cache[serverPath];
    delete require.cache[runtimeServicesPath];

    try {
      require(serverPath);
      assert(capturedServer && typeof capturedServer.close === "function", "Failed to capture local server instance");
      await waitForServer(port);

      const appShell = await request(port, "GET", "/index.html");
      assert(appShell.status === 200, "GET /index.html did not return 200");
      assert(appShell.text.includes("enhanceCardStage"), "App shell response is missing improve workbench stage");

      const landingShell = await request(port, "GET", "/public.html");
      assert(landingShell.status === 200, "GET /public.html did not return 200");
      assert(landingShell.text.includes("./site.js"), "Landing shell response is missing site.js");

      const themeCss = await request(port, "GET", "/site-overrides.css");
      assert(themeCss.status === 200, "GET /site-overrides.css did not return 200");

      const billing = await request(port, "POST", "/api/kartochka/billingSummary", {
        headers: {
          "x-kartochka-user-id": "release-smoke-user",
        },
        body: {},
      });
      assert(billing.status === 200, "billingSummary smoke request failed");
      assert(Array.isArray(billing.json?.catalog?.actions), "billingSummary response is missing catalog.actions");
      assert(String(billing.json?.auth?.uid || "") === "release-smoke-user", "billingSummary auth user mismatch");

      const createSave = await request(port, "POST", "/api/kartochka/historySave", {
        headers: {
          host: "smoke-test.kartochka.internal",
        },
        body: {
          entry: createHistoryEntry("create", "create"),
        },
      });
      assert(createSave.status === 200, "historySave(create) failed");
      const guestCookie = Array.isArray(createSave.headers["set-cookie"])
        ? createSave.headers["set-cookie"][0]
        : createSave.headers["set-cookie"];
      assert(guestCookie, "historySave(create) did not return a guest persistence cookie");
      const cookieHeader = String(guestCookie).split(";")[0];
      assert(Array.isArray(createSave.json?.entries) && createSave.json.entries.length >= 1, "historySave(create) did not return entries");
      assert(["file", "firestore"].includes(String(createSave.json?.storage?.mode || "")), "historySave(create) returned an invalid storage mode");

      const improveSave = await request(port, "POST", "/api/kartochka/historySave", {
        headers: {
          host: "smoke-test.kartochka.internal",
          Cookie: cookieHeader,
        },
        body: {
          entry: createHistoryEntry("improve", "improve"),
        },
      });
      assert(improveSave.status === 200, "historySave(improve) failed");
      assert(Array.isArray(improveSave.json?.entries) && improveSave.json.entries.length >= 2, "historySave(improve) did not preserve both entries");
      assert(String(improveSave.json?.entries?.[0]?.mode || "") === "improve", "Latest saved history entry should be improve");

      const improveEntryId = String(improveSave.json?.entries?.[0]?.id || "").trim();
      assert(improveEntryId, "Missing improve history entry id after save");

      const historyList = await request(port, "POST", "/api/kartochka/historyList", {
        headers: {
          host: "smoke-test.kartochka.internal",
          Cookie: cookieHeader,
        },
        body: {
          limit: 10,
        },
      });
      assert(historyList.status === 200, "historyList failed");
      assert(Array.isArray(historyList.json) && historyList.json.length >= 2, "historyList did not return both smoke entries");
      assert(historyList.json.some((entry) => entry && entry.mode === "create"), "historyList missing create entry");
      assert(historyList.json.some((entry) => entry && entry.mode === "improve"), "historyList missing improve entry");

      const historyGet = await request(port, "POST", "/api/kartochka/historyGetById", {
        headers: {
          host: "smoke-test.kartochka.internal",
          Cookie: cookieHeader,
        },
        body: {
          id: improveEntryId,
        },
      });
      assert(historyGet.status === 200, "historyGetById failed");
      assert(String(historyGet.json?.mode || "") === "improve", "historyGetById did not return the improve entry");
      assert(String(historyGet.json?.prompt || "").trim().length > 0, "historyGetById improve entry is missing prompt");

      const historyClear = await request(port, "POST", "/api/kartochka/historySave", {
        headers: {
          host: "smoke-test.kartochka.internal",
          Cookie: cookieHeader,
        },
        body: {
          clear: true,
        },
      });
      assert(historyClear.status === 200, "history clear failed");
      assert(Array.isArray(historyClear.json?.entries) && historyClear.json.entries.length === 0, "history clear did not empty the guest scope");

      log("  OK app shell, landing shell, billing summary, and history save/list/get/clear smoke");
    } finally {
      http.createServer = originalCreateServer;
      if (originalEnv.HOST == null) delete process.env.HOST;
      else process.env.HOST = originalEnv.HOST;
      if (originalEnv.PORT == null) delete process.env.PORT;
      else process.env.PORT = originalEnv.PORT;
      if (originalEnv.PUBLIC_BASE_URL == null) delete process.env.PUBLIC_BASE_URL;
      else process.env.PUBLIC_BASE_URL = originalEnv.PUBLIC_BASE_URL;

      if (capturedServer && typeof capturedServer.close === "function") {
        await new Promise((resolve) => capturedServer.close(() => resolve()));
      }
    }
  });
};

const main = async () => {
  runSyntaxChecks();
  if (SYNTAX_ONLY) return;
  runStaticChecks();
  await runServerSmoke();
  log("Release verification passed");
};

main().catch((error) => {
  process.stderr.write((error && error.stack) ? error.stack + "\n" : String(error) + "\n");
  process.exit(1);
});
