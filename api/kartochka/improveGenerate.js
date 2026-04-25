"use strict";

const { handleKartochkaAction } = require("../../server/api-request-handler");

module.exports = async (request, response) => {
  return handleKartochkaAction(request, response, "improveGenerate");
};

module.exports.config = { maxDuration: 240 };
