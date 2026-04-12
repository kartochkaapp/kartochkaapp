"use strict";

const { toText } = require("./utils");

class ApiRouteError extends Error {
  /**
   * @param {{
   *   status?: number,
   *   code?: string,
   *   message: string,
   *   details?: unknown,
   * }} params
   */
  constructor(params) {
    super(String(params?.message || "API route error"));
    this.name = "ApiRouteError";
    this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 500;
    this.code = toText(params?.code) || "route_error";
    this.details = params?.details;
  }
}

module.exports = {
  ApiRouteError,
};
