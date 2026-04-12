"use strict";

const { toText } = require("./utils");

const parseCookies = (cookieHeader) => {
  const cookies = {};
  const raw = toText(cookieHeader);
  if (!raw) return cookies;

  raw.split(";").forEach((part) => {
    const chunk = String(part || "").trim();
    if (!chunk) return;
    const separatorIndex = chunk.indexOf("=");
    if (separatorIndex <= 0) return;

    const key = chunk.slice(0, separatorIndex).trim();
    const value = chunk.slice(separatorIndex + 1).trim();
    if (!key || Object.prototype.hasOwnProperty.call(cookies, key)) return;

    try {
      cookies[key] = decodeURIComponent(value);
    } catch (error) {
      cookies[key] = value;
    }
  });

  return cookies;
};

const getHeader = (headers, headerName) => {
  if (!headers || typeof headers !== "object") return "";
  const targetName = String(headerName || "").toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (String(key || "").toLowerCase() !== targetName) continue;
    if (Array.isArray(value)) return toText(value[0]);
    return toText(value);
  }

  return "";
};

const LOCAL_DEV_USER_ID = "local-dev-user";
const LOCAL_DEV_USER_EMAIL = "local-dev@kartochka.local";

const normalizeHostName = (value) => {
  const raw = toText(value).split(",")[0].trim();
  if (!raw) return "";

  if (raw.startsWith("[")) {
    const endIndex = raw.indexOf("]");
    return (endIndex > 0 ? raw.slice(1, endIndex) : raw).toLowerCase();
  }

  const colonIndex = raw.indexOf(":");
  return (colonIndex >= 0 ? raw.slice(0, colonIndex) : raw).toLowerCase();
};

const isLocalRequestHost = (value) => {
  const hostname = normalizeHostName(value);
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
};

const extractRequestContext = (request) => {
  const authHeader = getHeader(request?.headers, "authorization");
  const match = authHeader.match(/^bearer\s+(.+)$/i);
  const responseHeaders = {};
  const hostHeader = getHeader(request?.headers, "x-forwarded-host") || getHeader(request?.headers, "host");
  const forwardedProto = getHeader(request?.headers, "x-forwarded-proto")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const isSecure = forwardedProto === "https"
    || Boolean(request?.socket?.encrypted)
    || Boolean(request?.connection?.encrypted);
  const authToken = match ? toText(match[1]) : "";
  const userIdHint = getHeader(request?.headers, "x-kartochka-user-id");
  const userEmailHint = getHeader(request?.headers, "x-kartochka-user-email");
  const useLocalDevFallback = !authToken && !userIdHint && isLocalRequestHost(hostHeader);

  return {
    authToken,
    userIdHint: useLocalDevFallback ? LOCAL_DEV_USER_ID : userIdHint,
    userEmailHint: useLocalDevFallback ? LOCAL_DEV_USER_EMAIL : userEmailHint,
    cookies: parseCookies(getHeader(request?.headers, "cookie")),
    isSecure,
    responseHeaders,
    appendResponseHeader(name, value) {
      const headerName = toText(name);
      if (!headerName || value == null || value === "") return;

      const currentValue = responseHeaders[headerName];
      if (currentValue == null) {
        responseHeaders[headerName] = value;
        return;
      }

      if (Array.isArray(currentValue)) {
        currentValue.push(value);
        return;
      }

      responseHeaders[headerName] = [currentValue, value];
    },
  };
};

module.exports = {
  extractRequestContext,
};
