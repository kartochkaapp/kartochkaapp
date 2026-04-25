"use strict";

const { handleEnhanceCardRequest } = require("../server/api-request-handler");

module.exports = async (request, response) => {
  return handleEnhanceCardRequest(request, response);
};

module.exports.config = { maxDuration: 240 };
