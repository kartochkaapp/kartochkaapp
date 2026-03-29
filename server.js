"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { URL } = require("node:url");

const { getRuntimeConfig } = require("./server/config");
const { toText } = require("./server/utils");
const { createEnhanceCardHandler } = require("./server/routes/enhance-card");
const { ApiRouteError, createKartochkaHandlers } = require("./server/routes/kartochka");
const { createOpenAIBrainAdapter } = require("./server/adapters/openai-brain-adapter");
const { createOpenRouterGenerationAdapter } = require("./server/adapters/openrouter-generation-adapter");
const { OpenAIBrainServiceError, createOpenAIBrainService } = require("./server/services/openai-brain-service");
const { GenerationServiceError, createGenerationService } = require("./server/services/generation-service");
const { HistoryServiceError, createHistoryService } = require("./server/services/history-service");
const { NanoBananaServiceError, createNanoBananaService } = require("./server/services/nano-banana-service");
const { BillingServiceError, createBillingService } = require("./server/services/billing-service");
const { OpenAIProviderError } = require("./server/providers/openai");
const { OpenRouterProviderError } = require("./server/providers/openrouter");
const { extractRequestContext } = require("./server/request-context");

class RequestBodyError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "Invalid request body"));
    this.name = "RequestBodyError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 400;
    this.code = toText(params?.code) || "invalid_request";
    this.details = params?.details;
  }
}

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

const runtime = getRuntimeConfig();
const openaiBrainAdapter = createOpenAIBrainAdapter({
  ...runtime.openai,
  timeoutMs: runtime.app.requestTimeoutMs,
});
const openrouterGenerationAdapter = createOpenRouterGenerationAdapter({
  ...runtime.openrouter,
  timeoutMs: runtime.app.requestTimeoutMs,
});
const openaiBrainService = createOpenAIBrainService({
  adapter: openaiBrainAdapter,
});
const generationService = createGenerationService({
  adapter: openrouterGenerationAdapter,
});
const historyService = createHistoryService({
  filePath: path.join(runtime.app.rootDir, "server", "data", "history-store.json"),
  maxItems: 30,
});
const billingService = createBillingService({
  rootDir: runtime.app.rootDir,
  starterTokens: runtime.billing.starterTokens,
  storeMode: runtime.billing.storeMode,
  promoSeedsRaw: runtime.billing.promoSeeds,
  firebaseAdmin: runtime.firebaseAdmin,
});
const nanoBananaService = createNanoBananaService({
  generationService,
});
const kartochkaHandlers = createKartochkaHandlers({
  openaiBrainService,
  generationService,
  historyService,
  billingService,
});
const enhanceCardHandler = createEnhanceCardHandler({
  nanoBananaService,
  billingService,
});

const sendJson = (response, statusCode, payload) => {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
};

const sendText = (response, statusCode, text) => {
  const body = String(text || "");
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
};

const parseJsonBody = (request, maxBodyBytes) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;

    request.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBodyBytes) {
        reject(new RequestBodyError({
          status: 413,
          code: "body_too_large",
          message: "Request body is too large",
        }));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          resolve(parsed);
          return;
        }
        reject(new RequestBodyError({
          status: 400,
          code: "invalid_json",
          message: "JSON body must be an object",
        }));
      } catch (error) {
        reject(new RequestBodyError({
          status: 400,
          code: "invalid_json",
          message: "Request body is not valid JSON",
          details: {
            textSample: raw.slice(0, 300),
          },
        }));
      }
    });

    request.on("error", (error) => {
      reject(new RequestBodyError({
        status: 400,
        code: "request_stream_error",
        message: "Failed to read request body",
        details: { reason: toText(error?.message) },
      }));
    });
  });
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

const serveStatic = (requestPath, response) => {
  const decodedPath = decodeURIComponent(requestPath || "/");
  const normalizedPath = decodedPath === "/" ? "/index.html" : decodedPath;
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

const toApiErrorPayload = (error) => {
  const fallback = {
    status: 500,
    code: "internal_error",
    message: "Internal server error",
    userMessage: "Временная ошибка сервера. Попробуйте снова.",
    details: null,
  };

  if (error instanceof RequestBodyError || error instanceof ApiRouteError) {
    return {
      status: error.status,
      code: error.code,
      message: error.message,
      userMessage: error.status >= 500
        ? "Временная ошибка сервера. Попробуйте снова."
        : error.message,
      details: error.details || null,
    };
  }

  if (
    error instanceof OpenAIProviderError
    || error instanceof OpenRouterProviderError
    || error instanceof OpenAIBrainServiceError
    || error instanceof GenerationServiceError
    || error instanceof HistoryServiceError
    || error instanceof NanoBananaServiceError
    || error instanceof BillingServiceError
  ) {
    const code = toText(error.code);
    const status = Number.isFinite(Number(error.status)) ? Number(error.status) : 502;
    const providerDetailsText = JSON.stringify(error.details || "").toLowerCase();
    const hasKeyLimitExceeded = providerDetailsText.includes("key limit exceeded")
      || providerDetailsText.includes("monthly limit")
      || providerDetailsText.includes("credit limit")
      || providerDetailsText.includes("quota");
    const hasInvalidInputImage = providerDetailsText.includes("unable to process input image");

    let userMessage = "AI сервис временно недоступен. Попробуйте снова.";
    if (hasKeyLimitExceeded) {
      userMessage = "Лимит AI-ключа исчерпан. Нужен новый лимит или другой ключ OpenRouter.";
    } else if (hasInvalidInputImage) {
      userMessage = "AI не смог обработать одно из фото. Попробуйте PNG/JPG/WEBP и, если фото несколько, оставьте 1-3 самых важных.";
    } else if (status === 401 || status === 403) {
      userMessage = "Сервер не авторизован в AI провайдере. Проверьте API ключи в .env.local.";
    } else if (status === 429) {
      userMessage = "Лимит запросов к AI провайдеру превышен. Повторите попытку позже.";
    }
    if (code === "timeout") {
      userMessage = "AI сервис не ответил вовремя. Повторите попытку.";
    } else if (code === "network_error") {
      userMessage = "Нет соединения с AI сервисом. Повторите попытку.";
    } else if (code === "invalid_json" || code.endsWith("_invalid_json")) {
      userMessage = "AI сервис вернул некорректный ответ. Попробуйте снова.";
    } else if (code === "openai_missing_key" || code === "openrouter_missing_key") {
      userMessage = "Серверная конфигурация AI не завершена. Проверьте переменные окружения.";
    } else if (code.startsWith("nano_")) {
      userMessage = "Не удалось улучшить карточку. Попробуйте ещё раз.";
    } else if (code === "billing_unauthorized") {
      userMessage = "Войдите в аккаунт, чтобы использовать AI.";
    } else if (code === "billing_insufficient_tokens") {
      userMessage = toText(error.userMessage) || "Недостаточно токенов для действия.";
    } else if (code.startsWith("promo_")) {
      userMessage = toText(error.userMessage) || "Не удалось применить промокод.";
    }

    return {
      status,
      code: code || "upstream_error",
      message: error.message,
      userMessage,
      details: error.details || null,
    };
  }

  return fallback;
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
    case "/api/kartochka/billingSummary":
      return kartochkaHandlers.billingSummary(body, requestContext);
    case "/api/kartochka/redeemPromo":
      return kartochkaHandlers.redeemPromo(body, requestContext);
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

  try {
    if (pathname.startsWith("/api/")) {
      if (pathname !== "/api/enhance-card" && !pathname.startsWith("/api/kartochka/")) {
        throw new ApiRouteError({
          status: 404,
          code: "route_not_found",
          message: "API route not found",
        });
      }

      if (method !== "POST") {
        throw new ApiRouteError({
          status: 405,
          code: "method_not_allowed",
          message: "Method not allowed",
        });
      }

      const body = await parseJsonBody(request, runtime.app.requestBodyLimitBytes);
      const requestContext = extractRequestContext(request);
      const data = await dispatchKartochkaApi(pathname, body, requestContext);
      sendJson(response, 200, data);
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
    const apiError = toApiErrorPayload(error);
    if (pathname.startsWith("/api/")) {
      sendJson(response, apiError.status, {
        error: {
          code: apiError.code,
          message: apiError.message,
          userMessage: apiError.userMessage,
          details: apiError.details,
        },
      });
      return;
    }

    sendText(response, 500, apiError.userMessage);
  }
});

server.listen(runtime.app.port, runtime.app.host, () => {
  process.stdout.write(
    "KARTOCHKA server is running at http://" + runtime.app.host + ":" + String(runtime.app.port) + "\n"
  );
});
