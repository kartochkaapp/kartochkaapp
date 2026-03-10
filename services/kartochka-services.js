
(function initKartochkaServices(global) {
  "use strict";

  /**
   * @typedef {"mock"|"real"} ServiceMode
   * @typedef {"none"|"category"|"insight"|"prompt"|"full"} CreateAnalyzeIntent
   */

  const DEFAULT_MODE = "mock";
  const MODE_SET = new Set(["mock", "real"]);
  const DEFAULT_TIMEOUT_MS = 12000;
  const DEFAULT_HISTORY_STORAGE_PREFIX = "kartochka:history:v1:";
  const DEFAULT_HISTORY_MAX_ITEMS = 30;

  const DEFAULT_DELAYS = Object.freeze({
    prompt: 1450,
    insight: 980,
    createGeneration: 1600,
    improveAnalysis: 900,
    improveGeneration: 1500,
  });

  const DEFAULT_PREVIEW_POOLS = Object.freeze({
    create: Object.freeze([
      "./assets/generated/accessories-card.png",
      "./assets/generated/beauty-sale.png",
      "./assets/examples/example-tech.png",
      "./assets/examples/example-home.png",
      "./assets/examples/example-beauty.png",
    ]),
    improve: Object.freeze([
      "./assets/examples/example-tech.png",
      "./assets/examples/example-home.png",
      "./assets/examples/example-beauty.png",
      "./assets/generated/accessories-card.png",
      "./assets/generated/beauty-sale.png",
    ]),
  });

  const DEFAULT_ENDPOINTS = Object.freeze({
    createAnalyze: "",
    createGenerate: "",
    improveAnalyze: "",
    improveGenerate: "",
    historyList: "",
    historyGetById: "",
    historySave: "",
  });

  const ERROR_CODES = Object.freeze({
    timeout: "timeout",
    network: "network_error",
    http: "http_error",
    invalidResponse: "invalid_response",
    notConfigured: "not_configured",
    invalidInput: "invalid_input",
  });

  class ServiceError extends Error {
    /**
     * @param {{
     *   code: string,
     *   message: string,
     *   status?: number,
     *   retryable?: boolean,
     *   details?: unknown,
     *   cause?: unknown,
     * }} params
     */
    constructor(params) {
      super(String(params?.message || "Service error"));
      this.name = "ServiceError";
      this.code = String(params?.code || "service_error");
      this.status = Number.isFinite(Number(params?.status)) ? Number(params.status) : 0;
      this.retryable = Boolean(params?.retryable);
      this.details = params?.details;
      this.cause = params?.cause;
    }
  }

  const isServiceError = (error) => error instanceof ServiceError;

  const toText = (value) => String(value || "").trim();
  const toLowerText = (value) => toText(value).toLowerCase();
  const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

  const clampInt = (value, min, max, fallback) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, Math.floor(parsed)));
  };

  const normalizeMode = (value) => {
    const mode = toLowerText(value);
    return MODE_SET.has(mode) ? mode : DEFAULT_MODE;
  };

  const normalizeAnalyzeIntent = (value) => {
    const intent = toLowerText(value);
    switch (intent) {
      case "category":
      case "insight":
      case "prompt":
      case "full":
        return intent;
      default:
        return "none";
    }
  };

  const wait = async (ms) => {
    await new Promise((resolve) => {
      global.setTimeout(resolve, Math.max(0, Number(ms) || 0));
    });
  };

  const safeErrorMessage = (error, fallbackMessage) => {
    if (isServiceError(error)) return error.message;
    if (error instanceof Error && toText(error.message)) return error.message;
    return fallbackMessage;
  };

  const createInvalidResponseError = (message, details) => {
    return new ServiceError({
      code: ERROR_CODES.invalidResponse,
      message: message || "Invalid response from service",
      retryable: false,
      details,
    });
  };

  const unwrapEnvelope = (value) => {
    if (isPlainObject(value) && Object.prototype.hasOwnProperty.call(value, "data")) {
      return value.data;
    }
    return value;
  };

  const ensureObject = (value, message) => {
    if (!isPlainObject(value)) {
      throw createInvalidResponseError(message || "Expected object response", value);
    }
    return value;
  };

  const normalizeInsight = (value) => {
    if (!isPlainObject(value)) return null;
    const category = toText(value.category);
    const recommendedStyle = toText(value.recommendedStyle);
    const conversionAccent = toText(value.conversionAccent);
    const marketplaceFormat = toText(value.marketplaceFormat);

    if (!category && !recommendedStyle && !conversionAccent && !marketplaceFormat) {
      return null;
    }

    return {
      category,
      recommendedStyle,
      conversionAccent,
      marketplaceFormat,
    };
  };

  const normalizeResultItem = (value, index, prefix) => {
    const objectValue = ensureObject(value, "Result item must be an object");
    const variantNumber = clampInt(objectValue.variantNumber || index + 1, 1, 50, index + 1);
    const totalVariants = clampInt(objectValue.totalVariants || objectValue.total || 1, 1, 50, 1);
    const previewUrl = toText(objectValue.previewUrl || objectValue.url);

    if (!previewUrl) {
      throw createInvalidResponseError("Result item is missing previewUrl", objectValue);
    }

    return {
      id: toText(objectValue.id) || prefix + "-" + String(Date.now()) + "-" + String(index + 1),
      variantNumber,
      totalVariants,
      previewUrl,
      title: toText(objectValue.title) || "Variant " + String(index + 1),
      marketplace: toText(objectValue.marketplace),
      style: toText(objectValue.style),
      focus: toText(objectValue.focus),
      format: toText(objectValue.format),
      promptPreview: toText(objectValue.promptPreview),
      downloadName: toText(objectValue.downloadName),
      strategy: toText(objectValue.strategy),
      styleLabel: toText(objectValue.styleLabel),
      referenceStyle: Boolean(objectValue.referenceStyle),
      changes: toText(objectValue.changes),
    };
  };

  const validateCreateAnalyzeResponse = (rawValue) => {
    const data = unwrapEnvelope(rawValue);

    if (typeof data === "string") {
      return {
        detectedCategory: "",
        insight: null,
        prompt: data,
      };
    }

    const objectValue = ensureObject(data, "createAnalyze must return an object response");
    const insight = normalizeInsight(objectValue.insight || objectValue.productInsight || null);
    const prompt = toText(objectValue.prompt || objectValue.generatedPrompt);
    const detectedCategory = toText(objectValue.detectedCategory || insight?.category || "");
    const headlineIdeas = Array.isArray(objectValue.headlineIdeas)
      ? objectValue.headlineIdeas.map((item) => toText(item)).filter(Boolean).slice(0, 5)
      : [];

    if (!insight && !prompt && !detectedCategory && !headlineIdeas.length) {
      throw createInvalidResponseError("createAnalyze response is missing insight and prompt", objectValue);
    }

    return {
      detectedCategory,
      insight,
      prompt,
      headlineIdeas,
    };
  };

  const validateResultsResponse = (rawValue, prefix) => {
    const data = unwrapEnvelope(rawValue);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.items)
          ? data.items
          : null;

    if (!Array.isArray(list)) {
      throw createInvalidResponseError("Results response must be an array", data);
    }

    return list.map((item, index) => normalizeResultItem(item, index, prefix));
  };

  const normalizeSeverity = (value) => {
    const severity = toLowerText(value);
    if (severity === "high" || severity === "medium" || severity === "low") return severity;
    return "medium";
  };

  const validateImproveAnalyzeResponse = (rawValue) => {
    const data = unwrapEnvelope(rawValue);
    const objectValue = ensureObject(data, "improveAnalyze must return an object response");

    const issuesRaw = Array.isArray(objectValue.issues) ? objectValue.issues : [];
    const recommendationsRaw = Array.isArray(objectValue.recommendations) ? objectValue.recommendations : [];

    return {
      score: clampInt(objectValue.score, 0, 100, 0),
      summary: toText(objectValue.summary),
      issues: issuesRaw
        .map((issue, index) => {
          if (!isPlainObject(issue)) return null;
          return {
            key: toText(issue.key) || "issue-" + String(index + 1),
            title: toText(issue.title) || "Issue " + String(index + 1),
            severity: normalizeSeverity(issue.severity),
            note: toText(issue.note),
          };
        })
        .filter(Boolean),
      recommendations: recommendationsRaw
        .map((item) => toText(item))
        .filter(Boolean),
      marketplaceFormat: toText(objectValue.marketplaceFormat),
      reference: {
        uploaded: Boolean(objectValue.reference?.uploaded),
        active: Boolean(objectValue.reference?.active),
        note: toText(objectValue.reference?.note),
      },
    };
  };
  const validateHistoryListResponse = (rawValue) => {
    const data = unwrapEnvelope(rawValue);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.entries)) return data.entries;
    throw createInvalidResponseError("historyList response must be an array", data);
  };

  const validateHistoryGetByIdResponse = (rawValue) => {
    const data = unwrapEnvelope(rawValue);
    if (data == null) return null;
    if (!isPlainObject(data)) {
      throw createInvalidResponseError("historyGetById response must be an object or null", data);
    }
    return data;
  };

  const validateHistorySaveResponse = (rawValue) => {
    const data = unwrapEnvelope(rawValue);

    if (Array.isArray(data)) {
      return {
        entries: data,
        savedAt: new Date().toISOString(),
      };
    }

    const objectValue = ensureObject(data, "historySave response must be an object");

    return {
      entries: Array.isArray(objectValue.entries)
        ? objectValue.entries
        : Array.isArray(objectValue.items)
          ? objectValue.items
          : [],
      savedAt: toText(objectValue.savedAt) || new Date().toISOString(),
    };
  };

  const createHttpClient = (options) => {
    const baseUrl = toText(options?.baseUrl).replace(/\/+$/, "");
    const timeoutMs = clampInt(options?.timeoutMs, 1000, 120000, DEFAULT_TIMEOUT_MS);
    const defaultHeaders = {
      Accept: "application/json",
      ...(isPlainObject(options?.headers) ? options.headers : {}),
    };

    const fetchImpl = typeof options?.fetch === "function"
      ? options.fetch
      : (typeof global.fetch === "function" ? global.fetch.bind(global) : null);

    const buildUrl = (url) => {
      const source = toText(url);
      if (!source) return "";
      if (/^https?:\/\//i.test(source)) return source;
      if (!baseUrl) return source;
      if (source.startsWith("/")) return baseUrl + source;
      return baseUrl + "/" + source;
    };

  const parseResponse = async (response) => {
      if (!response) return null;
      if (response.status === 204) return null;

      const rawText = await response.text();
      if (!rawText) return null;

      const contentType = toLowerText(response.headers?.get?.("content-type"));
      const shouldParseJson = contentType.includes("application/json") || /^[\[{]/.test(rawText.trim());

      if (!shouldParseJson) {
        return rawText;
      }

      try {
        return JSON.parse(rawText);
      } catch (error) {
        throw createInvalidResponseError("Response body is not valid JSON", {
          textSample: rawText.slice(0, 300),
        });
      }
    };

    const resolveHttpErrorMessage = (status, parsedBody, url) => {
      const fromEnvelope = toText(parsedBody?.error?.userMessage || parsedBody?.error?.message);
      const fromBody = toText(parsedBody?.message);
      return fromEnvelope || fromBody || "HTTP " + String(status) + " while requesting " + url;
    };

    const request = async (config) => {
      if (typeof fetchImpl !== "function") {
        throw new ServiceError({
          code: ERROR_CODES.network,
          message: "Fetch API is not available",
          retryable: true,
        });
      }

      const url = buildUrl(config?.url || "");
      if (!url) {
        throw new ServiceError({
          code: ERROR_CODES.notConfigured,
          message: "Request URL is not configured",
          retryable: false,
        });
      }

      const method = toText(config?.method || "POST").toUpperCase();
      const requestTimeout = clampInt(config?.timeoutMs, 500, 120000, timeoutMs);
      const headers = {
        ...defaultHeaders,
        ...(isPlainObject(config?.headers) ? config.headers : {}),
      };

      let body;
      if (Object.prototype.hasOwnProperty.call(config || {}, "body") && config.body !== undefined) {
        if (typeof config.body === "string") {
          body = config.body;
        } else {
          body = JSON.stringify(config.body);
          if (!Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
            headers["Content-Type"] = "application/json";
          }
        }
      }

      const controller = typeof AbortController === "function" ? new AbortController() : null;
      let timeoutId = null;

      if (controller) {
        timeoutId = global.setTimeout(() => {
          controller.abort();
        }, requestTimeout);
      }

      let response;
      try {
        response = await fetchImpl(url, {
          method,
          headers,
          body,
          signal: controller ? controller.signal : undefined,
        });
      } catch (error) {
        if (controller?.signal?.aborted) {
          throw new ServiceError({
            code: ERROR_CODES.timeout,
            message: "Request timeout",
            retryable: true,
            details: {
              url,
              timeoutMs: requestTimeout,
            },
            cause: error,
          });
        }

        throw new ServiceError({
          code: ERROR_CODES.network,
          message: "Network request failed",
          retryable: true,
          details: {
            url,
            method,
          },
          cause: error,
        });
      } finally {
        if (timeoutId != null) {
          global.clearTimeout(timeoutId);
        }
      }

      const parsed = await parseResponse(response);

      if (!response.ok) {
        throw new ServiceError({
          code: ERROR_CODES.http,
          message: resolveHttpErrorMessage(response.status, parsed, url),
          status: response.status,
          retryable: response.status >= 500,
          details: parsed,
        });
      }

      return parsed;
    };

    return Object.freeze({ request });
  };

  const hasCreateSignals = (payload) => {
    const description = toText(payload?.description);
    const hasFiles = Array.isArray(payload?.files) && payload.files.length > 0;
    return Boolean(description || hasFiles);
  };

  const getDetectedCategory = (payload) => {
    const sourceText = [payload?.description, payload?.highlights].map(toLowerText).join(" ");
    const fileCount = Array.isArray(payload?.files) ? payload.files.length : 0;

    if (/cream|serum|beauty|cosmetic|skincare/.test(sourceText)) return "Beauty / Care";
    if (/cable|charger|headphone|gadget|tech|electronics/.test(sourceText)) return "Electronics / Accessories";
    if (/coffee|tea|food|snack|drink/.test(sourceText)) return "Food / FMCG";
    if (fileCount >= 3) return "Lifestyle product";
    return "General marketplace product";
  };

  const buildInsight = (payload, detectedCategory) => {
    const sourceText = [payload?.description, payload?.highlights].map(toLowerText).join(" ");
    const marketplace = toText(payload?.marketplace);

    const recommendedStyle = /premium|lux|minimal|clean/.test(sourceText)
      ? "Premium clean: bright base, one visual anchor, calm typography"
      : /discount|sale|promo|deal/.test(sourceText)
        ? "Promo-first: contrast offer block + direct hierarchy"
        : "Catalog-first: clear product focus + structured benefits";

    const conversionAccent = /delivery|fast|today|shipping/.test(sourceText)
      ? "Highlight fast delivery and stock availability"
      : /guarantee|quality|cert/.test(sourceText)
        ? "Increase trust markers: quality proof and guarantee"
        : "Make the main customer benefit dominant in the first frame";

    const marketplaceFormat = marketplace === "Wildberries"
      ? "Hero + 3 quick benefit bullets + short CTA, mobile readable"
      : marketplace === "Yandex Market"
        ? "Rational format: facts, benefits, proof, calm visual tone"
        : "Ozon-ready: bright first frame, value block, clean CTA";

    return {
      category: toText(detectedCategory) || getDetectedCategory(payload),
      recommendedStyle,
      conversionAccent,
      marketplaceFormat,
    };
  };

  const buildPrompt = (payload, insight) => {
    const headlineSource = toText(payload?.description) || "product from uploaded visuals";
    const focusLine = toText(payload?.highlights) || "keep hierarchy clean and focus on conversion value";
    const hasFiles = Array.isArray(payload?.files) && payload.files.length > 0;
    const visualLine = hasFiles
      ? "Use uploaded product visuals as the base for layout and color rhythm."
      : "Build visual concept from text description only.";
    const targetMarketplace = toText(payload?.marketplace) || "marketplace";
    const variants = toText(payload?.cardsCount) || "1";

    const resolvedInsight = insight && isPlainObject(insight) ? insight : null;

    return [
      "You are a senior e-commerce designer for marketplace sellers.",
      "Build a conversion-focused generation prompt for a product card.",
      'Product: \"' + headlineSource + '\".',
      "Marketplace: " + targetMarketplace + ".",
      "Variants required: " + variants + ".",
      "Highlights: " + focusLine + ".",
      resolvedInsight ? "Detected category: " + toText(resolvedInsight.category) + "." : "",
      resolvedInsight ? "Recommended style: " + toText(resolvedInsight.recommendedStyle) + "." : "",
      resolvedInsight ? "Conversion accent: " + toText(resolvedInsight.conversionAccent) + "." : "",
      resolvedInsight ? "Marketplace format: " + toText(resolvedInsight.marketplaceFormat) + "." : "",
      visualLine,
      "Return structure: 1) Hero headline 2) 3-5 value bullets 3) CTA 4) visual guidance.",
    ]
      .filter(Boolean)
      .join("\\n");
  };
  const clampVariants = (value, max) => {
    return clampInt(value, 1, max, 1);
  };

  const pickPreview = (pool, index, fallback) => {
    const validPool = Array.isArray(pool) ? pool.filter(Boolean) : [];
    if (!validPool.length) return fallback;
    return validPool[index % validPool.length] || fallback;
  };

  const buildResultId = (prefix, variantNumber) => {
    return prefix + "-" + String(Date.now()) + "-" + String(variantNumber);
  };

  const buildCreateResults = (payload, config) => {
    const totalVariants = clampVariants(payload?.cardsCount, 5);
    const uploadedPreviews = Array.isArray(payload?.imagePreviewUrls)
      ? payload.imagePreviewUrls.filter(Boolean)
      : [];
    const previewPool = uploadedPreviews.length ? uploadedPreviews : config.previewPools.create;
    const promptPreview = toText(payload?.prompt).slice(0, 240);

    return Array.from({ length: totalVariants }, (_, index) => {
      const variantNumber = index + 1;
      const previewUrl = pickPreview(previewPool, index, config.previewPools.create[0]);

      return {
        id: buildResultId("result", variantNumber),
        variantNumber,
        totalVariants,
        previewUrl,
        title: "Variant " + String(variantNumber),
        marketplace: toText(payload?.marketplace) || "Marketplace",
        style: payload?.insight?.recommendedStyle || "Clean marketplace layout",
        focus: payload?.insight?.conversionAccent || "Focus on main value in first frame",
        format: payload?.insight?.marketplaceFormat || "Hero + benefits + CTA",
        promptPreview,
        downloadName: "kartochka-variant-" + String(variantNumber) + ".png",
      };
    });
  };

  const buildImproveAnalysis = (payload) => {
    if (!payload?.sourceCard) {
      throw new ServiceError({
        code: ERROR_CODES.invalidInput,
        message: "Source card is required for improveAnalyze",
      });
    }

    const sourceText = [payload?.prompt, payload?.mode].map(toLowerText).join(" ");
    const hasStructureIntent = /structure|readability|typography|grid|composition/.test(sourceText);
    const hasCtaIntent = /cta|button|offer|conversion|benefit/.test(sourceText);
    const hasMinimalIntent = /minimal|clean|simple/.test(sourceText);
    const useReferenceMode = payload?.mode === "reference";
    const hasReference = Boolean(payload?.referenceCard);
    const referenceStyleActive = useReferenceMode && hasReference;

    const issues = [
      {
        key: "design",
        title: "Design weaknesses",
        severity: referenceStyleActive ? "medium" : "high",
        note: referenceStyleActive
          ? "Base is acceptable, but visual language is still inconsistent."
          : "Visual hierarchy and style rhythm are not consistent.",
      },
      {
        key: "readability",
        title: "Readability",
        severity: hasStructureIntent ? "medium" : "high",
        note: hasStructureIntent
          ? "Readable, but key message contrast can be improved."
          : "Main offer and key message are not scanned quickly on mobile.",
      },
      {
        key: "composition",
        title: "Composition",
        severity: hasStructureIntent ? "medium" : "high",
        note: hasStructureIntent
          ? "Composition works, but focus priorities are equalized."
          : "Focus is fragmented across competing elements.",
      },
      {
        key: "accent",
        title: "Weak accent",
        severity: hasCtaIntent ? "medium" : "high",
        note: hasCtaIntent
          ? "Accent exists, but does not dominate enough."
          : "Primary customer value is not dominant in first frame.",
      },
      {
        key: "cta",
        title: "Weak CTA",
        severity: hasCtaIntent ? "medium" : "high",
        note: hasCtaIntent
          ? "CTA is visible, but wording is not specific."
          : "CTA does not define a clear next action.",
      },
      {
        key: "overload",
        title: "Overload",
        severity: hasMinimalIntent ? "medium" : "high",
        note: hasMinimalIntent
          ? "Moderate overload remains in secondary blocks."
          : "Text and details overload reduce scan speed.",
      },
      {
        key: "categoryFit",
        title: "Category fit",
        severity: referenceStyleActive ? "medium" : "high",
        note: referenceStyleActive
          ? "Category markers exist, but still need adaptation."
          : "Category signals are weak for marketplace context.",
      },
    ];

    const severityWeight = { high: 3, medium: 2, low: 1 };
    const riskScore = issues.reduce((sum, item) => sum + (severityWeight[item.severity] || 2), 0);
    const score = Math.max(38, Math.min(96, 100 - riskScore * 2));

    const recommendations = [
      "Rebuild first frame around one dominant customer benefit.",
      "Strengthen CTA contrast and make the action explicit.",
      referenceStyleActive
        ? "Apply reference style while preserving marketplace clarity."
        : "Reduce visual noise and keep only core blocks.",
    ];

    return {
      score,
      summary: referenceStyleActive
        ? "Analysis ready with reference style context."
        : "Analysis ready: key conversion and hierarchy risks found.",
      issues,
      recommendations,
      marketplaceFormat: referenceStyleActive
        ? "Reference-style marketplace format with clean CTA"
        : "Conversion-focused marketplace format with explicit CTA",
      reference: {
        uploaded: hasReference,
        active: referenceStyleActive,
        note: referenceStyleActive
          ? "Reference style is active for improvement output."
          : hasReference
            ? "Reference uploaded but standard improve mode is active."
            : "No reference uploaded: standard improve mode is active.",
      },
    };
  };

  const buildImproveResults = (payload, config) => {
    const totalVariants = clampVariants(payload?.variantsCount, 5);
    const previewPool = [
      toText(payload?.sourcePreviewUrl),
      toText(payload?.referencePreviewUrl),
      ...config.previewPools.improve,
    ].filter(Boolean);

    const promptPreview = toText(payload?.prompt).slice(0, 220);
    const referenceStyle = Boolean(payload?.referenceStyle);

    return Array.from({ length: totalVariants }, (_, index) => {
      const variantNumber = index + 1;
      const previewUrl = pickPreview(previewPool, index, config.previewPools.improve[0]);

      return {
        id: buildResultId("improve-result", variantNumber),
        variantNumber,
        totalVariants,
        previewUrl,
        title: "Improved variant " + String(variantNumber),
        strategy: referenceStyle ? "Reference style improvement" : "Standard AI improvement",
        styleLabel: referenceStyle ? "Improved with reference style" : "",
        referenceStyle,
        changes: payload?.analysis?.recommendations?.[0] || "Improved structure and stronger offer hierarchy.",
        format: payload?.analysis?.marketplaceFormat || "Marketplace-ready format with clean CTA.",
        promptPreview,
        downloadName: "kartochka-improved-" + String(variantNumber) + ".png",
      };
    });
  };
  const createHistoryStore = (config) => {
    const inMemoryMap = new Map();

    const getScopeId = (payload) => {
      return toText(payload?.scopeId || payload?.userId || "guest") || "guest";
    };

    const getStorageKey = (scopeId) => {
      return config.historyStoragePrefix + scopeId;
    };

    const readFromLocalStorage = (scopeId) => {
      if (!global.localStorage) return null;
      try {
        const raw = global.localStorage.getItem(getStorageKey(scopeId));
        const parsed = JSON.parse(raw || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    };

    const writeToLocalStorage = (scopeId, entries) => {
      if (!global.localStorage) return false;
      try {
        global.localStorage.setItem(getStorageKey(scopeId), JSON.stringify(entries));
        return true;
      } catch (error) {
        return false;
      }
    };

    const sortEntries = (entries) => {
      return entries.slice().sort((left, right) => {
        return new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime();
      });
    };

    const readEntries = (scopeId) => {
      const fromStorage = readFromLocalStorage(scopeId);
      if (Array.isArray(fromStorage)) {
        return sortEntries(fromStorage);
      }

      const fallback = inMemoryMap.get(scopeId);
      return Array.isArray(fallback) ? sortEntries(fallback) : [];
    };

    const writeEntries = (scopeId, entries) => {
      const normalized = sortEntries(Array.isArray(entries) ? entries : []).slice(0, config.historyMaxItems);
      const savedToStorage = writeToLocalStorage(scopeId, normalized);
      if (!savedToStorage) {
        inMemoryMap.set(scopeId, normalized);
      }
      return normalized;
    };

    return Object.freeze({
      getScopeId,
      readEntries,
      writeEntries,
    });
  };

  const createMockGateway = (config) => {
    const historyStore = createHistoryStore(config);

    return {
      async createAnalyze(payload, context) {
        const intent = normalizeAnalyzeIntent(context?.intent);
        const needsPrompt = intent === "prompt" || intent === "full";
        const needsInsight = intent === "insight" || intent === "full" || intent === "none" || intent === "category";

        if (!hasCreateSignals(payload)) {
          throw new ServiceError({
            code: ERROR_CODES.invalidInput,
            message: "Not enough create data to run analysis",
          });
        }

        await wait(needsPrompt ? config.delays.prompt : config.delays.insight);

        const detectedCategory = getDetectedCategory(payload);
        const generatedInsight = buildInsight(payload, detectedCategory);

        return {
          detectedCategory,
          insight: needsInsight ? generatedInsight : null,
          prompt: needsPrompt
            ? buildPrompt(payload, payload?.insight || generatedInsight)
            : "",
        };
      },

      async createGenerate(payload) {
        await wait(config.delays.createGeneration);
        return buildCreateResults(payload, config);
      },

      async improveAnalyze(payload) {
        await wait(config.delays.improveAnalysis);
        return buildImproveAnalysis(payload);
      },

      async improveGenerate(payload) {
        await wait(config.delays.improveGeneration);
        return buildImproveResults(payload, config);
      },

      async historyList(payload) {
        const scopeId = historyStore.getScopeId(payload);
        const limit = clampInt(payload?.limit, 1, 500, config.historyMaxItems);
        return historyStore.readEntries(scopeId).slice(0, limit);
      },

      async historyGetById(payload) {
        const scopeId = historyStore.getScopeId(payload);
        const targetId = toText(payload?.id);
        if (!targetId) return null;
        const entries = historyStore.readEntries(scopeId);
        return entries.find((entry) => toText(entry?.id) === targetId) || null;
      },

      async historySave(payload) {
        const scopeId = historyStore.getScopeId(payload);
        const clearRequested = Boolean(payload?.clear);

        let nextEntries;

        if (clearRequested) {
          nextEntries = [];
        } else if (Array.isArray(payload?.entries)) {
          nextEntries = payload.entries.slice();
        } else if (isPlainObject(payload?.entry)) {
          const existing = historyStore.readEntries(scopeId);
          const entryId = toText(payload.entry.id);
          const withoutCurrent = existing.filter((item) => toText(item?.id) !== entryId);
          nextEntries = [payload.entry, ...withoutCurrent];
        } else {
          nextEntries = historyStore.readEntries(scopeId);
        }

        const savedEntries = historyStore.writeEntries(scopeId, nextEntries);

        return {
          entries: savedEntries,
          savedAt: new Date().toISOString(),
        };
      },
    };
  };
  const createRealGateway = (config) => {
    const requestClient = config.http;

    const resolveEndpoint = (endpointName) => {
      const endpoint = toText(config.endpoints[endpointName]);
      if (!endpoint) {
        throw new ServiceError({
          code: ERROR_CODES.notConfigured,
          message: "Endpoint for " + endpointName + " is not configured",
        });
      }
      return endpoint;
    };

    const postJson = async (endpointName, body) => {
      const raw = await requestClient.request({
        url: resolveEndpoint(endpointName),
        method: "POST",
        body,
        timeoutMs: config.request.timeoutMs,
      });
      return unwrapEnvelope(raw);
    };

    return {
      async createAnalyze(payload, context) {
        const raw = await postJson("createAnalyze", { payload, context });
        return validateCreateAnalyzeResponse(raw);
      },

      async createGenerate(payload) {
        const raw = await postJson("createGenerate", { payload });
        return validateResultsResponse(raw, "result");
      },

      async improveAnalyze(payload) {
        const raw = await postJson("improveAnalyze", { payload });
        return validateImproveAnalyzeResponse(raw);
      },

      async improveGenerate(payload) {
        const raw = await postJson("improveGenerate", { payload });
        return validateResultsResponse(raw, "improve-result");
      },

      async historyList(payload) {
        const raw = await postJson("historyList", payload || {});
        return validateHistoryListResponse(raw);
      },

      async historyGetById(payload) {
        const raw = await postJson("historyGetById", payload || {});
        return validateHistoryGetByIdResponse(raw);
      },

      async historySave(payload) {
        const raw = await postJson("historySave", payload || {});
        return validateHistorySaveResponse(raw);
      },
    };
  };

  const createClient = (options) => {
    const configuredMode = normalizeMode(options?.mode || DEFAULT_MODE);

    const config = {
      mode: configuredMode,
      delays: {
        ...DEFAULT_DELAYS,
        ...(isPlainObject(options?.delays) ? options.delays : {}),
      },
      previewPools: {
        create: Array.isArray(options?.previewPools?.create) && options.previewPools.create.length
          ? options.previewPools.create.slice()
          : DEFAULT_PREVIEW_POOLS.create.slice(),
        improve: Array.isArray(options?.previewPools?.improve) && options.previewPools.improve.length
          ? options.previewPools.improve.slice()
          : DEFAULT_PREVIEW_POOLS.improve.slice(),
      },
      historyStoragePrefix: toText(options?.historyStoragePrefix) || DEFAULT_HISTORY_STORAGE_PREFIX,
      historyMaxItems: clampInt(options?.historyMaxItems, 1, 500, DEFAULT_HISTORY_MAX_ITEMS),
      endpoints: {
        ...DEFAULT_ENDPOINTS,
        ...(isPlainObject(options?.endpoints) ? options.endpoints : {}),
      },
      request: {
        baseUrl: toText(options?.request?.baseUrl),
        timeoutMs: clampInt(options?.request?.timeoutMs, 1000, 120000, DEFAULT_TIMEOUT_MS),
        headers: isPlainObject(options?.request?.headers) ? options.request.headers : {},
      },
    };

    config.http = createHttpClient(config.request);

    const mockGateway = createMockGateway(config);
    const realGateway = createRealGateway(config);

    let activeMode = config.mode;

    const resolveGateway = () => {
      return activeMode === "real" ? realGateway : mockGateway;
    };

    const callGateway = async (methodName, args) => {
      const gateway = resolveGateway();
      const method = gateway[methodName];
      if (typeof method !== "function") {
        throw new ServiceError({
          code: ERROR_CODES.notConfigured,
          message: "Service method " + methodName + " is not available",
        });
      }

      try {
        return await method.apply(gateway, args);
      } catch (error) {
        if (isServiceError(error)) {
          throw error;
        }

        throw new ServiceError({
          code: ERROR_CODES.network,
          message: safeErrorMessage(error, "Service request failed"),
          retryable: true,
          cause: error,
        });
      }
    };

    const client = {
      getMode() {
        return activeMode;
      },

      setMode(mode) {
        activeMode = normalizeMode(mode);
        return activeMode;
      },

      async createAnalyze(payload, context) {
        return callGateway("createAnalyze", [payload, context]);
      },

      async createGenerate(payload) {
        return callGateway("createGenerate", [payload]);
      },

      async improveAnalyze(payload) {
        return callGateway("improveAnalyze", [payload]);
      },

      async improveGenerate(payload) {
        return callGateway("improveGenerate", [payload]);
      },

      async historyList(payload) {
        return callGateway("historyList", [payload]);
      },

      async historyGetById(payload) {
        return callGateway("historyGetById", [payload]);
      },

      async historySave(payload) {
        return callGateway("historySave", [payload]);
      },
    };
    client.ai = Object.freeze({
      async detectProductCategory(payload) {
        const response = await client.createAnalyze(payload, { intent: "category" });
        const category = toText(response?.detectedCategory || response?.insight?.category);
        if (!category) {
          throw createInvalidResponseError("createAnalyze did not return detectedCategory", response);
        }
        return category;
      },

      async generateProductInsight(payload) {
        const response = await client.createAnalyze(payload, { intent: "insight" });
        const insight = normalizeInsight(response?.insight);
        if (!insight) {
          throw createInvalidResponseError("createAnalyze did not return insight", response);
        }
        return insight;
      },

      async generatePrompt(payload) {
        const response = await client.createAnalyze(payload, { intent: "prompt" });
        const prompt = toText(response?.prompt);
        if (!prompt) {
          throw createInvalidResponseError("createAnalyze did not return prompt", response);
        }
        return prompt;
      },

      async analyzeCardWeakness(payload) {
        return client.improveAnalyze(payload);
      },
    });

    client.cards = Object.freeze({
      async generateCards(payload) {
        return client.createGenerate(payload);
      },

      async improveCards(payload) {
        return client.improveGenerate(payload);
      },
    });

    client.history = Object.freeze({
      async list(payload) {
        return client.historyList(payload);
      },

      async getById(payload) {
        return client.historyGetById(payload);
      },

      async save(payload) {
        return client.historySave(payload);
      },
    });

    return Object.freeze(client);
  };

  global.KARTOCHKA_SERVICES = Object.freeze({
    createClient,
    ServiceError,
    isServiceError,
    ERROR_CODES,
  });
})(window);
