"use strict";

const { toText } = require("./utils");
const { ApiRouteError } = require("./routes/kartochka");
const { OpenAIProviderError } = require("./providers/openai");
const { OpenRouterProviderError } = require("./providers/openrouter");
const { OpenAIBrainServiceError } = require("./services/openai-brain-service");
const { GenerationServiceError } = require("./services/generation-service");
const { HistoryServiceError } = require("./services/history-service");
const { NanoBananaServiceError } = require("./services/nano-banana-service");
const { getRuntimeServices } = require("./runtime-services");

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

const sendJson = (response, statusCode, payload) => {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
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
      userMessage: error.status >= 500 ? fallback.userMessage : error.message,
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
  ) {
    const code = toText(error.code);
    const status = Number.isFinite(Number(error.status)) ? Number(error.status) : 502;
    const providerDetailsText = JSON.stringify(error.details || {}).toLowerCase();
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
      userMessage = "Сервер не авторизован в AI-провайдере. Проверьте API-ключи.";
    } else if (status === 429) {
      userMessage = "Лимит запросов к AI-провайдеру превышен. Повторите попытку позже.";
    }
    if (code === "timeout") {
      userMessage = "AI сервис не ответил вовремя. Повторите попытку.";
    } else if (code === "network_error") {
      userMessage = "Нет соединения с AI сервисом. Повторите попытку.";
    } else if (code === "invalid_json" || code.endsWith("_invalid_json")) {
      userMessage = "AI сервис вернул некорректный ответ. Попробуйте снова.";
    } else if (code === "openai_missing_key" || code === "openrouter_missing_key") {
      userMessage = "Серверная конфигурация AI не завершена. Проверьте переменные окружения.";
    } else if (code.startsWith("history_") || code === "invalid_history_store") {
      userMessage = "Серверная история временно недоступна. Попробуйте снова.";
    } else if (code.startsWith("nano_")) {
      userMessage = "Не удалось улучшить карточку. Попробуйте ещё раз.";
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

const handleKartochkaAction = async (request, response, actionName) => {
  const { runtime, kartochkaHandlers } = getRuntimeServices();

  try {
    const method = toText(request.method || "POST").toUpperCase();
    if (method !== "POST") {
      throw new ApiRouteError({
        status: 405,
        code: "method_not_allowed",
        message: "Method not allowed",
      });
    }

    if (!kartochkaHandlers || typeof kartochkaHandlers[actionName] !== "function") {
      throw new ApiRouteError({
        status: 404,
        code: "route_not_found",
        message: "API route not found",
      });
    }

    const body = await parseJsonBody(request, runtime.app.requestBodyLimitBytes);
    const data = await kartochkaHandlers[actionName](body);
    sendJson(response, 200, data);
  } catch (error) {
    const apiError = toApiErrorPayload(error);
    sendJson(response, apiError.status, {
      error: {
        code: apiError.code,
        message: apiError.message,
        userMessage: apiError.userMessage,
        details: apiError.details,
      },
    });
  }
};

const handleEnhanceCardRequest = async (request, response) => {
  const { runtime, enhanceCardHandler } = getRuntimeServices();

  try {
    const method = toText(request.method || "POST").toUpperCase();
    if (method !== "POST") {
      throw new ApiRouteError({
        status: 405,
        code: "method_not_allowed",
        message: "Method not allowed",
      });
    }

    if (typeof enhanceCardHandler !== "function") {
      throw new ApiRouteError({
        status: 404,
        code: "route_not_found",
        message: "API route not found",
      });
    }

    const body = await parseJsonBody(request, runtime.app.requestBodyLimitBytes);
    const data = await enhanceCardHandler(body);
    sendJson(response, 200, data);
  } catch (error) {
    const apiError = toApiErrorPayload(error);
    sendJson(response, apiError.status, {
      error: {
        code: apiError.code,
        message: apiError.message,
        userMessage: apiError.userMessage,
        details: apiError.details,
      },
    });
  }
};

module.exports = {
  handleEnhanceCardRequest,
  handleKartochkaAction,
};
