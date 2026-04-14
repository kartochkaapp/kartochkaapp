"use strict";

const { requestJson, HttpClientError } = require("../../http-client");
const { toText } = require("../../utils");

class TextReplaceOpenRouterError extends Error {
  constructor(params) {
    super(String(params?.message || "Text replace OpenRouter error"));
    this.name = "TextReplaceOpenRouterError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 502;
    this.code = toText(params?.code) || "text_replace_openrouter_error";
    this.details = params?.details || null;
    this.cause = params?.cause;
  }
}

const createEndpoint = (baseUrl) => {
  const safeBaseUrl = toText(baseUrl) || "https://openrouter.ai/api/v1";
  return safeBaseUrl.replace(/\/+$/, "") + "/chat/completions";
};

const stripDataUrlPrefix = (value) => {
  return String(value || "").replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
};

const createTextReplaceOpenRouterClient = (config) => {
  const apiKey = toText(config?.apiKey);
  const endpoint = createEndpoint(config?.baseUrl);
  const referer = toText(config?.referer) || "http://localhost:2030";
  const title = toText(config?.title) || "KARTOCHKA Text Replace";
  const timeoutMs = Number.isFinite(Number(config?.timeoutMs)) ? Number(config.timeoutMs) : 300000;

  const callOpenRouter = async ({ model, messages, modalities, extraBody }) => {
    if (!apiKey) {
      throw new TextReplaceOpenRouterError({
        status: 500,
        code: "openrouter_missing_key",
        message: "OPENROUTER_API_KEY is not configured",
      });
    }

    try {
      return await requestJson({
        url: endpoint,
        method: "POST",
        timeoutMs,
        headers: {
          Authorization: "Bearer " + apiKey,
          "HTTP-Referer": referer,
          "X-Title": title,
        },
        body: {
          model: toText(model),
          messages: Array.isArray(messages) ? messages : [],
          ...(Array.isArray(modalities) && modalities.length ? { modalities } : {}),
          ...((extraBody && typeof extraBody === "object") ? extraBody : {}),
        },
      });
    } catch (error) {
      if (error instanceof HttpClientError) {
        throw new TextReplaceOpenRouterError({
          status: error.status || 502,
          code: error.code || "openrouter_http_error",
          message: "OpenRouter text replace request failed",
          details: error.details,
          cause: error,
        });
      }

      throw new TextReplaceOpenRouterError({
        status: 502,
        code: "openrouter_request_failed",
        message: "OpenRouter text replace request failed",
        cause: error,
      });
    }
  };

  const extractText = (data) => {
    const message = data?.choices?.[0]?.message;
    if (!message) return "";
    if (typeof message.content === "string") return message.content;
    if (!Array.isArray(message.content)) return "";

    return message.content
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        return typeof item.text === "string" ? item.text : "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  };

  const extractImageBase64 = (data) => {
    const message = data?.choices?.[0]?.message;
    if (!message) {
      throw new TextReplaceOpenRouterError({
        code: "missing_message",
        message: "OpenRouter image edit response did not contain a message",
      });
    }

    const directUrl = message?.images?.[0]?.image_url?.url || message?.images?.[0]?.imageUrl?.url;
    if (directUrl) return stripDataUrlPrefix(directUrl);

    if (Array.isArray(message.content)) {
      const block = message.content.find((item) => {
        return item?.type === "image_url" || item?.type === "image";
      });
      const url = block?.image_url?.url || block?.imageUrl?.url || block?.source?.data || block?.data;
      if (url) return stripDataUrlPrefix(url);
    }

    throw new TextReplaceOpenRouterError({
      code: "missing_image",
      message: "OpenRouter image edit response did not contain an image",
      details: {
        responseSample: JSON.stringify(data).slice(0, 800),
      },
    });
  };

  return {
    callOpenRouter,
    extractText,
    extractImageBase64,
  };
};

module.exports = {
  TextReplaceOpenRouterError,
  createTextReplaceOpenRouterClient,
};
