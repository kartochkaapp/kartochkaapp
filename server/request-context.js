"use strict";

const { toText } = require("./utils");

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

const extractRequestContext = (request) => {
  const authHeader = getHeader(request?.headers, "authorization");
  const match = authHeader.match(/^bearer\s+(.+)$/i);

  return {
    authToken: match ? toText(match[1]) : "",
    userIdHint: getHeader(request?.headers, "x-kartochka-user-id"),
    userEmailHint: getHeader(request?.headers, "x-kartochka-user-email"),
  };
};

module.exports = {
  extractRequestContext,
};
