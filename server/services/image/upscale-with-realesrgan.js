"use strict";

const fs = require("node:fs");
const { execFile } = require("node:child_process");

const { toText } = require("../../utils");

const fileExists = (filePath) => {
  try {
    return Boolean(filePath) && fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
};

const runCommand = (binaryPath, args, timeoutMs) => {
  return new Promise((resolve, reject) => {
    execFile(binaryPath, args, {
      timeout: Math.max(1000, Number(timeoutMs) || 180000),
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 4,
    }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

const canUseRealEsrgan = (options = {}) => fileExists(toText(options.binaryPath));

const upscaleWithRealEsrgan = async (inputPath, outputPath, options = {}) => {
  const binaryPath = toText(options.binaryPath);
  if (!canUseRealEsrgan({ binaryPath })) {
    throw new Error("Real-ESRGAN binary not found");
  }

  const args = [
    "-i", inputPath,
    "-o", outputPath,
    "-s", String(Math.max(1, Math.floor(Number(options.scale || 2)))),
  ];
  const model = toText(options.model);
  if (model) {
    args.push("-n", model);
  }
  if (toText(options.format)) {
    args.push("-f", toText(options.format));
  }

  const result = await runCommand(binaryPath, args, options.timeoutMs);
  return {
    provider: "realesrgan",
    path: outputPath,
    stdout: toText(result.stdout),
    stderr: toText(result.stderr),
  };
};

module.exports = {
  canUseRealEsrgan,
  upscaleWithRealEsrgan,
};
