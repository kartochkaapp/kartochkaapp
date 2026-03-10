"use strict";

class HttpClientError extends Error {
  /**
   * @param {{
   *   code: string,
   *   message: string,
   *   status?: number,
   *   details?: unknown,
   *   retryable?: boolean,
   *   cause?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "HTTP client error"));
    this.name = "HttpClientError";
    this.code = String(params?.code || "http_error");
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 0;
    this.details = params?.details;
    this.retryable = Boolean(params?.retryable);
    this.cause = params?.cause;
  }
}

const toText = (value) => String(value || "").trim();

const parseResponseBody = async (response) => {
  if (!response) return null;
  if (response.status === 204) return null;

  const raw = await response.text();
  if (!raw) return null;

  const contentType = toText(response.headers?.get?.("content-type")).toLowerCase();
  const canParseAsJson = contentType.includes("application/json") || /^[\[{]/.test(raw.trim());

  if (!canParseAsJson) return raw;

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new HttpClientError({
      code: "invalid_json",
      message: "Response body is not valid JSON",
      details: {
        textSample: raw.slice(0, 300),
      },
      cause: error,
    });
  }
};

/**
 * @param {{
 *   url: string,
 *   method?: string,
 *   headers?: Record<string, string>,
 *   body?: unknown,
 *   timeoutMs?: number,
 * }} params
 */
const requestJson = async (params) => {
  const url = toText(params?.url);
  if (!url) {
    throw new HttpClientError({
      code: "invalid_url",
      message: "Request URL is empty",
    });
  }

  const method = toText(params?.method || "POST").toUpperCase();
  const timeoutMs = Number.isFinite(Number(params?.timeoutMs))
    ? Math.max(500, Number(params.timeoutMs))
    : 30000;
  const headers = {
    Accept: "application/json",
    ...(params?.headers || {}),
  };

  let body;
  if (Object.prototype.hasOwnProperty.call(params || {}, "body") && params.body !== undefined) {
    if (typeof params.body === "string") {
      body = params.body;
    } else {
      body = JSON.stringify(params.body);
      if (!Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
        headers["Content-Type"] = "application/json";
      }
    }
  }

  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timerId = controller
    ? setTimeout(() => {
        controller.abort();
      }, timeoutMs)
    : null;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body,
      signal: controller ? controller.signal : undefined,
    });
  } catch (error) {
    if (controller?.signal?.aborted) {
      throw new HttpClientError({
        code: "timeout",
        message: "Request timed out",
        retryable: true,
        details: { url, timeoutMs },
        cause: error,
      });
    }

    throw new HttpClientError({
      code: "network_error",
      message: "Network error while calling upstream API",
      retryable: true,
      details: { url, method },
      cause: error,
    });
  } finally {
    if (timerId != null) {
      clearTimeout(timerId);
    }
  }

  const parsedBody = await parseResponseBody(response);
  if (!response.ok) {
    throw new HttpClientError({
      code: "http_error",
      message: "Upstream responded with HTTP " + String(response.status),
      status: response.status,
      retryable: response.status >= 500,
      details: parsedBody,
    });
  }

  return parsedBody;
};

module.exports = {
  HttpClientError,
  requestJson,
};

