"use strict";

const { toText } = require("./utils");
const { ApiRouteError } = require("./api-route-error");
const { OpenAIProviderError } = require("./providers/openai");
const { OpenAIImageProviderError } = require("./providers/openai-image");
const { OpenRouterProviderError } = require("./providers/openrouter");
const { OpenAIBrainServiceError } = require("./services/openai-brain-service");
const { GenerationServiceError } = require("./services/generation-service");
const { FourMarketplaceCardsServiceError } = require("./services/four-marketplace-cards-service");
const { HistoryServiceError } = require("./services/history-service");
const { HistoryAssetServiceError } = require("./services/history-asset-service");
const { AiLogServiceError } = require("./services/ai-log-service");
const { NanoBananaServiceError } = require("./services/nano-banana-service");
const { BillingServiceError } = require("./services/billing-service");
const { TextReplaceServiceError } = require("./services/text-replace-service");

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

const sendJson = (response, statusCode, payload, extraHeaders) => {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    ...(extraHeaders && typeof extraHeaders === "object" ? extraHeaders : {}),
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

  if (error instanceof TextReplaceServiceError) {
    const code = toText(error.code);
    const status = Number.isFinite(Number(error.status)) ? Number(error.status) : 500;
    let userMessage = error.message;
    if (code === "text_replace_credits_exhausted" || status === 402) {
      userMessage = "Кончились кредиты AI-сервиса. Обратитесь к @ones_thunder";
    }
    return {
      status,
      code: code || "text_replace_error",
      message: error.message,
      userMessage,
      details: error.details || null,
    };
  }

  if (
    error instanceof OpenAIProviderError
    || error instanceof OpenAIImageProviderError
    || error instanceof OpenRouterProviderError
    || error instanceof OpenAIBrainServiceError
    || error instanceof GenerationServiceError
    || error instanceof FourMarketplaceCardsServiceError
    || error instanceof HistoryServiceError
    || error instanceof HistoryAssetServiceError
    || error instanceof AiLogServiceError
    || error instanceof NanoBananaServiceError
    || error instanceof BillingServiceError
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
    if (status < 500) {
      userMessage = toText(error.userMessage) || error.message;
    }
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

const buildApiErrorBody = (apiError) => {
  return {
    error: {
      code: apiError.code,
      message: apiError.message,
      userMessage: apiError.userMessage,
      details: apiError.details,
    },
  };
};

const sendApiError = (response, error, extraHeaders) => {
  const apiError = toApiErrorPayload(error);
  sendJson(response, apiError.status, buildApiErrorBody(apiError), extraHeaders);
};

module.exports = {
  RequestBodyError,
  buildApiErrorBody,
  sendJson,
  sendApiError,
  parseJsonBody,
  toApiErrorPayload,
};
