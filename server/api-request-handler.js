"use strict";

const { ApiRouteError } = require("./api-route-error");
const { getRuntimeServices } = require("./runtime-services");
const { extractRequestContext } = require("./request-context");
const { sendJson, sendApiError, parseJsonBody } = require("./request-utils");

const assertPostMethod = (request) => {
  const method = String(request.method || "POST").toUpperCase();
  if (method === "POST") return;

  throw new ApiRouteError({
    status: 405,
    code: "method_not_allowed",
    message: "Method not allowed",
  });
};

const resolveActionHandler = (handler) => {
  if (typeof handler === "function") return handler;

  throw new ApiRouteError({
    status: 404,
    code: "route_not_found",
    message: "API route not found",
  });
};

const handleApiActionRequest = async (request, response, resolveHandler) => {
  const runtimeServices = getRuntimeServices();
  const requestContext = extractRequestContext(request);

  try {
    assertPostMethod(request);

    const handler = resolveActionHandler(resolveHandler(runtimeServices));
    const body = await parseJsonBody(request, runtimeServices.runtime.app.requestBodyLimitBytes);
    const data = await handler(body, requestContext);
    sendJson(response, 200, data, requestContext.responseHeaders);
  } catch (error) {
    sendApiError(response, error, requestContext.responseHeaders);
  }
};

const handleKartochkaAction = async (request, response, actionName) => {
  return handleApiActionRequest(request, response, ({ kartochkaHandlers }) => kartochkaHandlers?.[actionName]);
};

const handleProductAction = async (request, response, actionName) => {
  return handleApiActionRequest(request, response, ({ productHandlers }) => productHandlers?.[actionName]);
};

const handleEnhanceCardRequest = async (request, response) => {
  return handleApiActionRequest(request, response, ({ enhanceCardHandler }) => enhanceCardHandler);
};

module.exports = {
  handleEnhanceCardRequest,
  handleKartochkaAction,
  handleProductAction,
};
