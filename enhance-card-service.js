(function (globalScope, factory) {
  const exportsObject = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exportsObject;
  }
  globalScope.KARTOCHKA_ENHANCE_CARD_SERVICE = exportsObject;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const REQUEST_TIMEOUT_MS = 240000;
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
  const MAX_IMAGE_DIMENSION = 1024;
  const JPEG_QUALITY = 0.84;
  const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

  const toText = (value) => String(value || "").trim();

  const createRequestId = () => {
    return "enhance-card-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  };

  const sanitizeLogDetails = (details) => {
    if (!details || typeof details !== "object") return details;

    const blockedKeys = new Set([
      "prompt",
      "userPrompt",
      "requestText",
      "responseText",
      "imageDataUrl",
      "imageBase64",
      "body",
      "headers",
      "authHeaders",
    ]);

    const output = {};
    Object.keys(details).forEach((key) => {
      if (blockedKeys.has(key)) return;

      const value = details[key];
      if (typeof value === "string" && value.length > 220) {
        output[key] = value.slice(0, 220) + "...";
        return;
      }

      if (value && typeof value === "object") {
        output[key] = sanitizeLogDetails(value);
        return;
      }

      output[key] = value;
    });
    return output;
  };

  const createLogger = (options) => {
    const scope = toText(options?.scope) || "enhance-card";
    const sessionId = toText(options?.sessionId) || createRequestId();

    const write = (level, eventName, details) => {
      const consoleMethod = typeof console?.[level] === "function" ? console[level] : console.log;
      try {
        consoleMethod("[kartochka][" + scope + "] " + eventName, sanitizeLogDetails({
          sessionId,
          ...(details && typeof details === "object" ? details : {}),
        }));
      } catch (error) {
        console.log("[kartochka][" + scope + "] " + eventName);
      }
    };

    return {
      debug(eventName, details) {
        write("debug", eventName, details);
      },
      info(eventName, details) {
        write("info", eventName, details);
      },
      warn(eventName, details) {
        write("warn", eventName, details);
      },
      error(eventName, details) {
        write("error", eventName, details);
      },
      sessionId,
    };
  };

  class EnhanceCardError extends Error {
    constructor(params) {
      super(toText(params?.message) || "Enhance card request failed");
      this.name = toText(params?.name) || "EnhanceCardError";
      this.code = toText(params?.code) || "enhance_card_error";
      this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 0;
      this.details = params?.details;
      this.cause = params?.cause;
    }
  }

  const createAbortError = (message) => {
    const error = new Error(toText(message) || "The operation was aborted");
    error.name = "AbortError";
    return error;
  };

  const isAbortError = (error) => {
    return toText(error?.name) === "AbortError";
  };

  const assertNotAborted = (signal) => {
    if (signal?.aborted) {
      throw createAbortError("The operation was aborted");
    }
  };

  const validateImageFile = (file) => {
    if (!file) {
      return "Сначала загрузите изображение карточки.";
    }

    if (!ALLOWED_IMAGE_TYPES.has(toText(file.type).toLowerCase())) {
      return "Поддерживаются только PNG, JPG и WEBP.";
    }

    if ((Number(file.size) || 0) > MAX_FILE_SIZE_BYTES) {
      return "Файл слишком большой. Используйте изображение до 10 МБ.";
    }

    return "";
  };

  const revokePreviewUrl = (previewUrl) => {
    if (!previewUrl || typeof URL === "undefined" || typeof URL.revokeObjectURL !== "function") return;
    if (!/^blob:/i.test(String(previewUrl))) return;
    try {
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      // Ignore preview cleanup failures.
    }
  };

  const createFileSource = (file) => {
    const previewUrl = typeof URL !== "undefined" && typeof URL.createObjectURL === "function"
      ? URL.createObjectURL(file)
      : "";

    return {
      kind: "file",
      name: toText(file?.name) || "source-card",
      mimeType: toText(file?.type) || "image/jpeg",
      sizeBytes: Number(file?.size) || 0,
      previewUrl,
      file,
      dispose() {
        revokePreviewUrl(previewUrl);
      },
    };
  };

  const createRemoteSource = (options) => {
    return {
      kind: "remote",
      name: toText(options?.name) || "source-card.png",
      mimeType: toText(options?.mimeType) || "",
      sizeBytes: Number(options?.sizeBytes) || 0,
      previewUrl: toText(options?.previewUrl),
      url: toText(options?.previewUrl),
      dispose() {
        return undefined;
      },
    };
  };

  const blobToDataUrl = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(toText(reader.result));
      reader.onerror = () => reject(new EnhanceCardError({
        code: "file_read_failed",
        message: "Не удалось подготовить изображение.",
      }));
      reader.readAsDataURL(blob);
    });
  };

  const loadImageElement = (objectUrl) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new EnhanceCardError({
        code: "image_decode_failed",
        message: "Не удалось подготовить изображение.",
      }));
      image.src = objectUrl;
    });
  };

  const canvasToBlob = (canvas, mimeType, quality) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new EnhanceCardError({
          code: "image_encode_failed",
          message: "Не удалось подготовить изображение.",
        }));
      }, mimeType, quality);
    });
  };

  const downscaleImageBlob = async (blob, options) => {
    const mimeType = toText(options?.mimeType) || "image/jpeg";
    const quality = Number(options?.quality) || JPEG_QUALITY;
    const maxDimension = Number(options?.maxDimension) || MAX_IMAGE_DIMENSION;
    const signal = options?.signal;

    if (typeof document === "undefined") {
      return blobToDataUrl(blob);
    }

    const objectUrl = typeof URL !== "undefined" && typeof URL.createObjectURL === "function"
      ? URL.createObjectURL(blob)
      : "";

    if (!objectUrl) {
      return blobToDataUrl(blob);
    }

    try {
      assertNotAborted(signal);
      const image = await loadImageElement(objectUrl);
      assertNotAborted(signal);

      const width = Number(image.naturalWidth || image.width || 0);
      const height = Number(image.naturalHeight || image.height || 0);
      if (!width || !height) {
        return blobToDataUrl(blob);
      }

      const scale = Math.min(1, maxDimension / Math.max(width, height));
      const targetWidth = Math.max(1, Math.round(width * scale));
      const targetHeight = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) {
        return blobToDataUrl(blob);
      }

      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      const outputBlob = await canvasToBlob(canvas, mimeType, quality);
      assertNotAborted(signal);
      return blobToDataUrl(outputBlob);
    } finally {
      revokePreviewUrl(objectUrl);
    }
  };

  const fetchRemoteBlob = async (source, options) => {
    const fetchImpl = options?.fetchImpl || fetch.bind(globalThis);
    const signal = options?.signal;

    assertNotAborted(signal);

    const response = await fetchImpl(source.url, { signal });
    if (!response.ok) {
      throw new EnhanceCardError({
        code: "source_fetch_failed",
        status: response.status,
        message: "Не удалось загрузить исходную карточку для улучшения.",
      });
    }

    return response.blob();
  };

  const prepareImageDataUrl = async (source, options) => {
    const signal = options?.signal;
    const logger = options?.logger;

    if (!source || typeof source !== "object") {
      throw new EnhanceCardError({
        code: "missing_source",
        message: "Сначала загрузите изображение карточки.",
      });
    }

    assertNotAborted(signal);
    logger?.debug("image_prepare_start", {
      sourceKind: source.kind,
      sizeBytes: Number(source.sizeBytes) || 0,
      mimeType: source.mimeType,
    });

    const sourceBlob = source.kind === "file"
      ? source.file
      : await fetchRemoteBlob(source, options);

    const dataUrl = await downscaleImageBlob(sourceBlob, {
      signal,
      maxDimension: MAX_IMAGE_DIMENSION,
      mimeType: "image/jpeg",
      quality: JPEG_QUALITY,
    });

    logger?.debug("image_prepare_done", {
      sourceKind: source.kind,
      sizeBytes: Number(source.sizeBytes) || 0,
    });

    return dataUrl;
  };

  const parseJsonSafely = (rawText) => {
    const text = String(rawText || "").trim();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new EnhanceCardError({
        code: "invalid_json_response",
        message: "Сервер вернул невалидный ответ. Попробуйте ещё раз.",
        cause: error,
      });
    }
  };

  const buildApiError = (response, payload) => {
    const errorMessage = toText(payload?.error?.userMessage)
      || toText(payload?.error?.message)
      || toText(payload?.message)
      || "Не удалось улучшить карточку.";

    return new EnhanceCardError({
      code: toText(payload?.error?.code) || "enhance_card_request_failed",
      status: response.status,
      message: errorMessage,
      details: payload?.error?.details,
    });
  };

  const normalizeApiResult = (payload) => {
    const imageDataUrl = toText(payload?.imageDataUrl)
      || toText(payload?.result?.imageDataUrl)
      || toText(payload?.resultUrl)
      || toText(payload?.url);

    if (!imageDataUrl) {
      throw new EnhanceCardError({
        code: "invalid_api_response",
        message: "Сервер не вернул готовое изображение.",
        details: sanitizeLogDetails(payload),
      });
    }

    return {
      ok: true,
      imageDataUrl,
      provider: toText(payload?.provider) || toText(payload?.result?.provider),
      requestId: toText(payload?.requestId),
    };
  };

  const createEnhanceCardApi = (options) => {
    const endpoint = toText(options?.endpoint) || "/api/enhance-card";
    const fetchImpl = options?.fetchImpl || fetch.bind(globalThis);
    const logger = options?.logger || createLogger();
    const getAuthHeaders = typeof options?.getAuthHeaders === "function"
      ? options.getAuthHeaders
      : async () => ({});
    const prepareImageDataUrlImpl = typeof options?.prepareImageDataUrl === "function"
      ? options.prepareImageDataUrl
      : prepareImageDataUrl;

    return {
      async submitEnhancement(params) {
        const requestId = toText(params?.requestId) || createRequestId();
        const source = params?.source;
        const userPrompt = toText(params?.userPrompt);
        const preserveSourceTextExactly = Boolean(params?.preserveSourceTextExactly);
        const signal = params?.signal;
        const onProcessing = typeof params?.onProcessing === "function"
          ? params.onProcessing
          : null;

        logger.info("request_start", {
          requestId,
          endpoint,
          sourceKind: source?.kind,
          fileName: source?.name,
          mimeType: source?.mimeType,
          sizeBytes: Number(source?.sizeBytes) || 0,
          hasUserPrompt: Boolean(userPrompt),
          preserveSourceTextExactly,
        });

        try {
          const imageDataUrl = await prepareImageDataUrlImpl(source, {
            fetchImpl,
            signal,
            logger,
          });

          assertNotAborted(signal);
          onProcessing?.();

          const authHeaders = await getAuthHeaders();
          const response = await fetchImpl(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(authHeaders && typeof authHeaders === "object" ? authHeaders : {}),
            },
            body: JSON.stringify({
              requestId,
              imageDataUrl,
              userPrompt,
              preserveSourceTextExactly,
            }),
            signal,
          });

          const responseText = await response.text();
          const payload = parseJsonSafely(responseText);

          if (!response.ok) {
            throw buildApiError(response, payload);
          }

          const result = normalizeApiResult(payload);
          logger.info("request_success", {
            requestId,
            provider: result.provider,
            status: response.status,
          });
          return result;
        } catch (error) {
          if (isAbortError(error)) {
            logger.warn("request_aborted", {
              requestId,
              code: "abort",
            });
            throw error;
          }

          logger.error("request_error", {
            requestId,
            code: toText(error?.code) || "enhance_card_error",
            status: Number(error?.status) || 0,
            message: toText(error?.message),
          });
          throw error;
        }
      },
    };
  };

  return {
    REQUEST_TIMEOUT_MS,
    MAX_FILE_SIZE_BYTES,
    ALLOWED_IMAGE_TYPES,
    EnhanceCardError,
    createAbortError,
    createEnhanceCardApi,
    createFileSource,
    createLogger,
    createRemoteSource,
    createRequestId,
    isAbortError,
    prepareImageDataUrl,
    revokePreviewUrl,
    sanitizeLogDetails,
    validateImageFile,
  };
});
