"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { URL } = require("node:url");

const { ApiRouteError } = require("./server/api-route-error");
const { toText } = require("./server/utils");
const { getRuntimeServices } = require("./server/runtime-services");
const { extractRequestContext } = require("./server/request-context");
const { sendJson, sendApiError, parseJsonBody, toApiErrorPayload } = require("./server/request-utils");

const CONTENT_TYPES = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
});

const { runtime, kartochkaHandlers, enhanceCardHandler } = getRuntimeServices();

const sendText = (response, statusCode, text) => {
  const body = String(text || "");
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
};

const isPathInsideRoot = (targetPath, rootDir) => {
  const relative = path.relative(rootDir, targetPath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
};

const isLocalRuntime = () => {
  const host = String(runtime.app.host || "").trim().toLowerCase();
  const baseUrl = String(runtime.app.publicBaseUrl || "").trim().toLowerCase();
  return host === "0.0.0.0"
    || host === "127.0.0.1"
    || host === "localhost"
    || baseUrl.includes("localhost")
    || baseUrl.includes("127.0.0.1");
};

const APP_MODE_ROUTE_PATTERN = /^\/(?:app(?:\/(create|improve|history|animate))?|create|improve|history|animate)\/?$/i;

const shouldServeIndexHtml = (requestPath) => {
  const normalizedPath = String(requestPath || "/").trim() || "/";
  if (normalizedPath === "/") return true;
  if (path.extname(normalizedPath)) return false;
  return APP_MODE_ROUTE_PATTERN.test(normalizedPath);
};

const serveStatic = (requestPath, response) => {
  const decodedPath = decodeURIComponent(requestPath || "/");
  const normalizedPath = shouldServeIndexHtml(decodedPath) ? "/index.html" : decodedPath;
  const absolutePath = path.normalize(path.join(runtime.app.rootDir, normalizedPath));

  if (!isPathInsideRoot(absolutePath, runtime.app.rootDir)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  let stat;
  try {
    stat = fs.statSync(absolutePath);
  } catch (error) {
    sendText(response, 404, "Not found");
    return;
  }

  if (!stat.isFile()) {
    sendText(response, 404, "Not found");
    return;
  }

  const extension = path.extname(absolutePath).toLowerCase();
  const contentType = CONTENT_TYPES[extension] || "application/octet-stream";
  const cacheControl = isLocalRuntime()
    ? "no-store"
    : extension === ".html"
      ? "no-store"
      : "public, max-age=3600";

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
  });

  const stream = fs.createReadStream(absolutePath);
  stream.on("error", () => {
    if (!response.headersSent) {
      sendText(response, 500, "Failed to read file");
      return;
    }
    response.end();
  });
  stream.pipe(response);
};

const dispatchKartochkaApi = async (pathname, body, requestContext) => {
  switch (pathname) {
    case "/api/enhance-card":
      return enhanceCardHandler(body, requestContext);
    case "/api/kartochka/createAnalyze":
      return kartochkaHandlers.createAnalyze(body, requestContext);
    case "/api/kartochka/createGenerate":
      return kartochkaHandlers.createGenerate(body, requestContext);
    case "/api/kartochka/improveAnalyze":
      return kartochkaHandlers.improveAnalyze(body, requestContext);
    case "/api/kartochka/improveGenerate":
      return kartochkaHandlers.improveGenerate(body, requestContext);
    case "/api/kartochka/templatePreview":
      return kartochkaHandlers.templatePreview(body, requestContext);
    case "/api/kartochka/historyList":
      return kartochkaHandlers.historyList(body, requestContext);
    case "/api/kartochka/historyGetById":
      return kartochkaHandlers.historyGetById(body, requestContext);
    case "/api/kartochka/historySave":
      return kartochkaHandlers.historySave(body, requestContext);
    case "/api/kartochka/historyAssetSave":
      return kartochkaHandlers.historyAssetSave(body, requestContext);
    case "/api/kartochka/billingSummary":
      return kartochkaHandlers.billingSummary(body, requestContext);
    case "/api/kartochka/redeemPromo":
      return kartochkaHandlers.redeemPromo(body, requestContext);
    case "/api/kartochka/aiLogs":
      return kartochkaHandlers.aiLogs(body, requestContext);
    default:
      throw new ApiRouteError({
        status: 404,
        code: "route_not_found",
        message: "API route not found",
      });
  }
};

const server = http.createServer(async (request, response) => {
  const method = toText(request.method || "GET").toUpperCase();
  const requestUrl = new URL(request.url || "/", runtime.app.publicBaseUrl);
  const pathname = requestUrl.pathname;
  const requestContext = extractRequestContext(request);

  try {
    if (pathname.startsWith("/api/")) {
      console.log("[req]", method, pathname);
      if (pathname !== "/api/enhance-card" && !pathname.startsWith("/api/kartochka/")) {
        throw new ApiRouteError({
          status: 404,
          code: "route_not_found",
          message: "API route not found",
        });
      }

      if (method === "GET" && pathname.startsWith("/api/kartochka/historyAsset/")) {
        const id = decodeURIComponent(pathname.slice("/api/kartochka/historyAsset/".length));
        const asset = await kartochkaHandlers.historyAssetGet({ id });
        response.writeHead(200, {
          "Content-Type": asset.mimeType || "image/jpeg",
          "Cache-Control": isLocalRuntime() ? "no-store" : "public, max-age=31536000, immutable",
          "Content-Length": asset.buffer.length,
        });
        response.end(asset.buffer);
        return;
      }

      if (method !== "POST") {
        throw new ApiRouteError({
          status: 405,
          code: "method_not_allowed",
          message: "Method not allowed",
        });
      }

      const body = await parseJsonBody(request, runtime.app.requestBodyLimitBytes);
      const data = await dispatchKartochkaApi(pathname, body, requestContext);
      sendJson(response, 200, data, requestContext.responseHeaders);
      return;
    }

    if (method !== "GET" && method !== "HEAD") {
      sendText(response, 405, "Method not allowed");
      return;
    }

    if (method === "HEAD") {
      response.writeHead(200, {
        "Cache-Control": "no-store",
      });
      response.end();
      return;
    }

    serveStatic(pathname, response);
  } catch (error) {
    if (pathname.startsWith("/api/")) {
      sendApiError(response, error, requestContext.responseHeaders);
      return;
    }

    const apiError = toApiErrorPayload(error);
    sendText(response, 500, apiError.userMessage);
  }
});

server.listen(runtime.app.port, runtime.app.host, () => {
  process.stdout.write(
    "KARTOCHKA server is running at http://" + runtime.app.host + ":" + String(runtime.app.port) + "\n"
  );
});
