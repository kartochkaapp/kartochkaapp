(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuLinks = document.querySelectorAll("[data-close-mobile-menu]");

  const publicView = document.getElementById("publicView");
  const workspace = document.getElementById("workspace");
  const workspaceUserName = document.getElementById("workspaceUserName");
  const workspaceUserCaption = document.getElementById("workspaceUserCaption");
  const workspaceUserAvatar = document.getElementById("workspaceUserAvatar");

  const authSection = document.getElementById("authSection");
  const authCloseBtn = document.getElementById("authCloseBtn");
  const googleAuthBtn = document.getElementById("googleAuthBtn");
  const authMessage = document.getElementById("authMessage");
  const authTriggers = document.querySelectorAll("[data-open-auth]");
  const cabinetBtn = document.querySelector(".topbar-actions [data-open-auth]");

  const workspaceModeButtons = Array.from(document.querySelectorAll("[data-app-mode-btn]"));
  const workspaceModePanels = Array.from(document.querySelectorAll("[data-app-mode-panel]"));
  const appSignOutBtn = document.getElementById("appSignOutBtn");

  const createImagesInput = document.getElementById("createImagesInput");
  const createImagesList = document.getElementById("createImagesList");
  const createImagesEmpty = document.getElementById("createImagesEmpty");
  const createImagesCounter = document.getElementById("createImagesCounter");
  const createUploadZone = document.getElementById("createUploadZone");
  const createUploadHint = document.getElementById("createUploadHint");
  const createDescription = document.getElementById("createDescription");
  const createHighlights = document.getElementById("createHighlights");
  const createCustomPrompt = document.getElementById("createCustomPrompt");
  const createPromptModeButtons = Array.from(document.querySelectorAll("[data-prompt-mode]"));
  const createAiPromptCard = document.getElementById("createAiPromptCard");
  const createAiPromptGenerateBtn = document.getElementById("createAiPromptGenerateBtn");
  const createAiPromptRegenerateBtn = document.getElementById("createAiPromptRegenerateBtn");
  const createAiPromptAcceptBtn = document.getElementById("createAiPromptAcceptBtn");
  const createAiPromptOutput = document.getElementById("createAiPromptOutput");
  const createAiPromptStatus = document.getElementById("createAiPromptStatus");
  const createInsightCard = document.getElementById("createInsightCard");
  const createInsightRunBtn = document.getElementById("createInsightRunBtn");
  const createInsightStatus = document.getElementById("createInsightStatus");
  const createInsightCategory = document.getElementById("createInsightCategory");
  const createInsightStyle = document.getElementById("createInsightStyle");
  const createInsightAccent = document.getElementById("createInsightAccent");
  const createInsightFormat = document.getElementById("createInsightFormat");
  const createMarketplace = document.getElementById("createMarketplace");
  const createCardsCount = document.getElementById("createCardsCount");
  const createGenerateBtn = document.getElementById("createGenerateBtn");
  const createCtaHint = document.getElementById("createCtaHint");
  const createStatus = document.getElementById("createStatus");
  const createDoneBadge = document.getElementById("createDoneBadge");
  const createMeta = document.getElementById("createMeta");
  const createResultsSection = document.getElementById("createResultsSection");
  const createResultsCaption = document.getElementById("createResultsCaption");
  const createResultsProcessing = document.getElementById("createResultsProcessing");
  const createResultsGrid = document.getElementById("createResultsGrid");

  const improveImageInput = document.getElementById("improveImageInput");
  const improvePrimaryUploadZone = document.getElementById("improvePrimaryUploadZone");
  const improveSelectedPreview = document.getElementById("improveSelectedPreview");
  const improveSelectedImage = document.getElementById("improveSelectedImage");
  const improveReferenceInput = document.getElementById("improveReferenceInput");
  const improveReferenceUploadZone = document.getElementById("improveReferenceUploadZone");
  const improveReferencePreview = document.getElementById("improveReferencePreview");
  const improveReferenceImage = document.getElementById("improveReferenceImage");
  const improveReferenceNote = document.getElementById("improveReferenceNote");
  const improveReferenceState = document.getElementById("improveReferenceState");
  const improvePrompt = document.getElementById("improvePrompt");
  const improveModeButtons = Array.from(document.querySelectorAll("[data-improve-mode]"));
  const improveVariantsCount = document.getElementById("improveVariantsCount");
  const improveCtaHint = document.getElementById("improveCtaHint");
  const improveRunBtn = document.getElementById("improveRunBtn");
  const improveStatus = document.getElementById("improveStatus");
  const improveAnalyzeBtn = document.getElementById("improveAnalyzeBtn");
  const improveAnalysisCard = document.getElementById("improveAnalysisCard");
  const improveAnalysisStatus = document.getElementById("improveAnalysisStatus");
  const improveAnalysisScore = document.getElementById("improveAnalysisScore");
  const improveAnalysisSummary = document.getElementById("improveAnalysisSummary");
  const improveAnalysisContext = document.getElementById("improveAnalysisContext");
  const improveAnalysisIssues = document.getElementById("improveAnalysisIssues");
  const improveAnalysisRecommendations = document.getElementById("improveAnalysisRecommendations");
  const improveResultsSection = document.getElementById("improveResultsSection");
  const improveResultsCaption = document.getElementById("improveResultsCaption");
  const improveResultsProcessing = document.getElementById("improveResultsProcessing");
  const improveResultsGrid = document.getElementById("improveResultsGrid");
  const improveMeta = document.getElementById("improveMeta");
  const improveDoneBadge = document.getElementById("improveDoneBadge");

  const historyList = document.getElementById("historyList");
  const historyEmpty = document.getElementById("historyEmpty");
  const historyClearBtn = document.getElementById("historyClearBtn");
  const historyModeStats = document.getElementById("historyModeStats");
  const historyModeList = document.getElementById("historyModeList");
  const historyModeEmpty = document.getElementById("historyModeEmpty");
  const historyModeClearBtn = document.getElementById("historyModeClearBtn");
  const historyModeDetails = document.getElementById("historyModeDetails");
  const historyModeDetailsCloseBtn = document.getElementById("historyModeDetailsCloseBtn");
  const historyModeDetailsBackdrop = historyModeDetails?.querySelector("[data-history-modal-close]") || null;
  const historyDetailsTitle = document.getElementById("historyDetailsTitle");
  const historyDetailsDate = document.getElementById("historyDetailsDate");
  const historyDetailsMode = document.getElementById("historyDetailsMode");
  const historyDetailsCount = document.getElementById("historyDetailsCount");
  const historyDetailsSummary = document.getElementById("historyDetailsSummary");
  const historyReuseBtn = document.getElementById("historyReuseBtn");
  const historyDetailsInputs = document.getElementById("historyDetailsInputs");
  const historyDetailsUploads = document.getElementById("historyDetailsUploads");
  const historyDetailsPrompt = document.getElementById("historyDetailsPrompt");
  const historyDetailsHighlights = document.getElementById("historyDetailsHighlights");
  const historyDetailsAi = document.getElementById("historyDetailsAi");
  const historyDetailsResults = document.getElementById("historyDetailsResults");

  const APP_ROUTE_PREFIX = "#app/";
  const APP_MODES = ["create", "improve", "animate", "history"];
  const HISTORY_MAX_ITEMS = 30;
  const HISTORY_STORAGE_PREFIX = "kartochka:history:v1:";
  const CREATE_UPLOAD_MAX_FILES = 5;
  const CREATE_ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
  const CREATE_ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);
  const CREATE_AI_PROMPT_MIN_ACCEPT_LEN = 12;
  const CREATE_AI_PROMPT_MOCK_DELAY = prefersReducedMotion ? 220 : 1450;
  const CREATE_INSIGHT_MOCK_DELAY = prefersReducedMotion ? 180 : 980;
  const CREATE_GENERATION_MOCK_DELAY = prefersReducedMotion ? 260 : 1600;
  const IMPROVE_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
  const IMPROVE_ANALYSIS_MOCK_DELAY = prefersReducedMotion ? 180 : 900;
  const IMPROVE_GENERATION_MOCK_DELAY = prefersReducedMotion ? 240 : 1500;
  const IMPROVE_RESULT_FALLBACK_PREVIEWS = [
    "./assets/examples/example-tech.png",
    "./assets/examples/example-home.png",
    "./assets/examples/example-beauty.png",
    "./assets/generated/accessories-card.png",
    "./assets/generated/beauty-sale.png",
  ];
  const IMPROVE_ANALYSIS_DIMENSIONS = [
    { key: "design", title: "Слабые стороны дизайна" },
    { key: "readability", title: "Читаемость" },
    { key: "composition", title: "Композиция" },
    { key: "accent", title: "Слабый акцент" },
    { key: "cta", title: "Плохой CTA" },
    { key: "overload", title: "Перегрузка" },
    { key: "categoryFit", title: "Слабое соответствие категории" },
  ];
  const CREATE_GENERATION_FALLBACK_PREVIEWS = [
    "./assets/generated/accessories-card.png",
    "./assets/generated/beauty-sale.png",
    "./assets/examples/example-tech.png",
    "./assets/examples/example-home.png",
    "./assets/examples/example-beauty.png",
  ];

  const modeLabelMap = {
    create: "Создание",
    improve: "Улучшение",
    animate: "Анимация",
    history: "История",
  };

  const SERVICE_MODE = (() => {
    const configuredMode = String(window.KARTOCHKA_SERVICE_MODE || "").trim().toLowerCase();
    if (configuredMode === "mock" || configuredMode === "real") return configuredMode;
    return "real";
  })();

  const serviceClient = window.KARTOCHKA_SERVICES?.createClient
    ? window.KARTOCHKA_SERVICES.createClient({
        mode: SERVICE_MODE,
        delays: {
          prompt: CREATE_AI_PROMPT_MOCK_DELAY,
          insight: CREATE_INSIGHT_MOCK_DELAY,
          createGeneration: CREATE_GENERATION_MOCK_DELAY,
          improveAnalysis: IMPROVE_ANALYSIS_MOCK_DELAY,
          improveGeneration: IMPROVE_GENERATION_MOCK_DELAY,
        },
        previewPools: {
          create: CREATE_GENERATION_FALLBACK_PREVIEWS,
          improve: IMPROVE_RESULT_FALLBACK_PREVIEWS,
        },
        historyStoragePrefix: HISTORY_STORAGE_PREFIX,
        historyMaxItems: HISTORY_MAX_ITEMS,
        request: {
          baseUrl: "",
          timeoutMs: 45000,
        },
        endpoints: {
          createAnalyze: "/api/kartochka/createAnalyze",
          createGenerate: "/api/kartochka/createGenerate",
          improveAnalyze: "/api/kartochka/improveAnalyze",
          improveGenerate: "/api/kartochka/improveGenerate",
          historyList: "",
          historyGetById: "",
          historySave: "",
        },
      })
    : null;

  let activeUser = null;
  let activeMode = "create";
  let createPromptMode = "ai";
  let createIsGenerating = false;
  let createInsightPhase = "empty";
  let createInsightData = null;
  let createInsightRequestId = 0;
  let createInsightFingerprint = "";
  let createAiPromptPhase = "empty";
  let createAiPromptRequestId = 0;
  let createGenerationRequestId = 0;
  let createGeneratedResults = [];
  let createResultExpandedId = "";
  const createSelectedFiles = [];
  let createUploadDragDepth = 0;
  let improveMode = "ai";
  let improveImageFile = null;
  let improveReferenceFile = null;
  let improveImagePreview = "";
  let improveReferencePreviewUrl = "";
  let improveIsGenerating = false;
  let improveAnalysisPhase = "empty";
  let improveAnalysisData = null;
  let improveAnalysisRequestId = 0;
  let improveAnalysisFingerprint = "";
  let improveGenerationRequestId = 0;
  let improveGeneratedResults = [];
  let improveResultExpandedId = "";
  let improvePrimaryDragDepth = 0;
  let improveReferenceDragDepth = 0;
  const historyEntries = [];
  let selectedHistoryEntryId = "";
  let historyReuseInProgress = false;
  let historyDetailsVisible = false;

  const openMobileMenu = () => {
    mobileMenu?.classList.remove("hidden");
    mobileMenu?.setAttribute("aria-hidden", "false");
    mobileMenuBtn?.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  const closeMobileMenu = () => {
    mobileMenu?.classList.add("hidden");
    mobileMenu?.setAttribute("aria-hidden", "true");
    mobileMenuBtn?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const setStatusMessage = (node, text, type) => {
    if (!node) return;
    node.textContent = text || "";
    node.classList.remove("error", "success");
    if (type) node.classList.add(type);
  };

  const setRequestMeta = (node, title, value) => {
    if (!node) return;
    node.textContent = "";

    const label = document.createElement("span");
    label.textContent = title;

    const strong = document.createElement("strong");
    strong.textContent = value;

    node.append(label, strong);
  };

  const setDoneState = (badge, isDone) => {
    badge?.classList.toggle("active", Boolean(isDone));
  };

  const setAuthMessage = (text, type) => {
    setStatusMessage(authMessage, text, type);
  };

  const openAuthModal = () => {
    authSection?.classList.remove("hidden");
    authSection?.setAttribute("aria-hidden", "false");
    document.body.classList.add("auth-open");
  };

  const closeAuthModal = () => {
    authSection?.classList.add("hidden");
    authSection?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("auth-open");
  };

  const normalizeAppMode = (mode) => {
    return APP_MODES.includes(mode) ? mode : "create";
  };

  const buildAppHash = (mode) => {
    return APP_ROUTE_PREFIX + normalizeAppMode(mode);
  };

  const parseAppModeFromHash = (hash) => {
    const sourceHash = typeof hash === "string" ? hash : window.location.hash || "";
    if (!sourceHash.startsWith(APP_ROUTE_PREFIX)) return null;
    const mode = sourceHash.slice(APP_ROUTE_PREFIX.length).split(/[/?#]/)[0].trim().toLowerCase();
    return APP_MODES.includes(mode) ? mode : null;
  };

  const replaceHash = (nextHash) => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + nextHash
    );
  };

  const syncWorkspaceUser = (user) => {
    if (!workspaceUserName) return;

    if (!user) {
      workspaceUserName.textContent = "Гость";
      if (workspaceUserCaption) workspaceUserCaption.textContent = "Личный кабинет KARTOCHKA";
      if (workspaceUserAvatar) workspaceUserAvatar.textContent = "K";
      return;
    }

    const displayName = user.displayName || user.email || "User";
    const email = user.email || "Авторизованный пользователь";

    workspaceUserName.textContent = displayName;
    if (workspaceUserCaption) workspaceUserCaption.textContent = email;
    if (workspaceUserAvatar) workspaceUserAvatar.textContent = (displayName[0] || "K").toUpperCase();
  };

  const openWorkspaceView = (user, mode) => {
    if (!workspace || !publicView) return;

    publicView.classList.add("hidden");
    publicView.setAttribute("aria-hidden", "true");
    workspace.classList.remove("hidden");
    workspace.setAttribute("aria-hidden", "false");

    document.body.classList.add("workspace-active");
    syncWorkspaceUser(user || activeUser);
    closeAuthModal();
    closeMobileMenu();
    switchWorkspaceMode(normalizeAppMode(mode || activeMode));
  };

  const closeWorkspaceView = () => {
    if (!workspace || !publicView) return;

    closeHistoryDetailsModal();

    workspace.classList.add("hidden");
    workspace.setAttribute("aria-hidden", "true");
    publicView.classList.remove("hidden");
    publicView.setAttribute("aria-hidden", "false");

    document.body.classList.remove("workspace-active");
  };

  const switchWorkspaceMode = (mode) => {
    activeMode = normalizeAppMode(mode);

    if (activeMode !== "history") {
      closeHistoryDetailsModal();
    }

    workspaceModeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.appModeBtn === activeMode);
    });

    workspaceModePanels.forEach((panel) => {
      const isActive = panel.dataset.appModePanel === activeMode;
      panel.classList.toggle("active", isActive);
      panel.classList.toggle("hidden", !isActive);
    });
  };

  const handleAppHashRoute = () => {
    const routeMode = parseAppModeFromHash();
    if (!routeMode) {
      if (document.body.classList.contains("workspace-active")) {
        closeWorkspaceView();
      }
      return false;
    }

    activeMode = routeMode;

    if (!activeUser) {
      closeWorkspaceView();
      setAuthMessage("Войдите, чтобы открыть внутренний app", "");
      openAuthModal();
      return true;
    }

    openWorkspaceView(activeUser, routeMode);
    return true;
  };

  const navigateToAppMode = (mode, options) => {
    const targetMode = normalizeAppMode(mode);
    const targetHash = buildAppHash(targetMode);
    const useReplace = Boolean(options && options.replace);

    if (useReplace) {
      replaceHash(targetHash);
      handleAppHashRoute();
      return;
    }

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
      return;
    }

    handleAppHashRoute();
  };

  const getCreateFileKey = (file) => {
    return [file.name, file.size, file.lastModified].join(":");
  };

  const createFilePreviewUrls = new Map();
  const createFileDataUrls = new Map();

  const getCreateFilePreviewUrl = (file) => {
    const key = getCreateFileKey(file);
    if (!createFilePreviewUrls.has(key)) {
      createFilePreviewUrls.set(key, URL.createObjectURL(file));
    }
    return createFilePreviewUrls.get(key) || "";
  };

  const revokeCreateFilePreviewUrl = (file) => {
    const key = getCreateFileKey(file);
    const url = createFilePreviewUrls.get(key);
    if (url) {
      URL.revokeObjectURL(url);
      createFilePreviewUrls.delete(key);
    }
    createFileDataUrls.delete(key);
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Не удалось прочитать изображение."));
      reader.readAsDataURL(file);
    });
  };

  const getCreateFileDataUrl = async (file) => {
    const key = getCreateFileKey(file);
    if (createFileDataUrls.has(key)) {
      return createFileDataUrls.get(key) || "";
    }
    const dataUrl = await readFileAsDataUrl(file);
    createFileDataUrls.set(key, dataUrl);
    return dataUrl;
  };

  const buildCreateImageDataUrls = async () => {
    const urls = await Promise.all(createSelectedFiles.map((file) => getCreateFileDataUrl(file)));
    return urls.filter(Boolean);
  };

  const dataUrlToFile = async (dataUrl, fileName, fallbackMimeType) => {
    const safeUrl = String(dataUrl || "").trim();
    if (!safeUrl) return null;
    const safeName = String(fileName || "image.png").trim() || "image.png";
    try {
      const response = await fetch(safeUrl);
      const blob = await response.blob();
      const mimeType = blob.type || fallbackMimeType || "image/png";
      return new File([blob], safeName, { type: mimeType });
    } catch (error) {
      return null;
    }
  };

  const getCreateFileExtension = (fileName) => {
    const normalizedName = String(fileName || "").toLowerCase();
    const lastDotIndex = normalizedName.lastIndexOf(".");
    if (lastDotIndex < 0) return "";
    return normalizedName.slice(lastDotIndex + 1);
  };

  const isCreateFileAccepted = (file) => {
    if (!file) return false;
    if (CREATE_ALLOWED_IMAGE_TYPES.has(file.type)) return true;
    const extension = getCreateFileExtension(file.name);
    return CREATE_ALLOWED_EXTENSIONS.has(extension);
  };

  const getCreateValidationError = () => {
    if (createSelectedFiles.length < 1) return "Добавьте минимум 1 фото товара";
    if (createSelectedFiles.length > CREATE_UPLOAD_MAX_FILES) {
      return "Допустимо максимум " + String(CREATE_UPLOAD_MAX_FILES) + " фото";
    }
    if ((createDescription?.value || "").trim().length < 12) return "Заполните поле «Описание товара»";
    if ((createHighlights?.value || "").trim().length < 8) return "Добавьте пожелания и акценты";
    if (createPromptMode === "custom" && (createCustomPrompt?.value || "").trim().length < 12) {
      return "В режиме «Свой prompt» заполните собственный prompt";
    }
    if (!(createMarketplace?.value || "").trim()) return "Выберите маркетплейс";
    if (!(createCardsCount?.value || "").trim()) return "Выберите количество карточек";
    return "";
  };

  const renderCreateFiles = () => {
    if (!createImagesList) return;

    createImagesList.textContent = "";
    createImagesEmpty?.classList.toggle("hidden", createSelectedFiles.length > 0);

    createSelectedFiles.forEach((file, index) => {
      const item = document.createElement("article");
      item.className = "create-upload-item";

      const thumb = document.createElement("img");
      thumb.className = "create-upload-thumb";
      thumb.src = getCreateFilePreviewUrl(file);
      thumb.alt = file.name || "Фото товара";
      thumb.loading = "lazy";

      const meta = document.createElement("div");
      meta.className = "create-upload-meta";

      const name = document.createElement("strong");
      name.textContent = file.name;

      const size = document.createElement("span");
      size.textContent = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      meta.append(name, size);

      const removeBtn = document.createElement("button");
      removeBtn.className = "create-upload-remove";
      removeBtn.type = "button";
      removeBtn.dataset.removeImageIndex = String(index);
      removeBtn.textContent = "Удалить";
      removeBtn.setAttribute("aria-label", "Удалить " + (file.name || "фото"));
      removeBtn.toggleAttribute("disabled", isCreateControlsLocked());
      item.append(thumb, meta, removeBtn);
      createImagesList.append(item);
    });

    if (createImagesCounter) {
      createImagesCounter.textContent = String(createSelectedFiles.length) + " / " + String(CREATE_UPLOAD_MAX_FILES) + " фото";
    }

    if (createUploadHint) {
      const remaining = Math.max(0, CREATE_UPLOAD_MAX_FILES - createSelectedFiles.length);
      createUploadHint.textContent = remaining
        ? "PNG, JPG, WEBP • можно добавить еще " + String(remaining)
        : "Лимит 5 фото достигнут. Удалите одно фото, чтобы добавить новое.";
    }

    createUploadZone?.classList.toggle("is-empty", createSelectedFiles.length === 0);
    createUploadZone?.classList.toggle("is-filled", createSelectedFiles.length > 0);
    createUploadZone?.classList.toggle("is-limit", createSelectedFiles.length >= CREATE_UPLOAD_MAX_FILES);
  };

  const syncCreatePromptMode = (nextMode) => {
    createPromptMode = nextMode === "custom" ? "custom" : "ai";

    createPromptModeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.promptMode === createPromptMode);
    });

    if (createCustomPrompt) {
      const disableCustomPrompt = createPromptMode !== "custom";
      createCustomPrompt.toggleAttribute("disabled", disableCustomPrompt);
      if (disableCustomPrompt) {
        createCustomPrompt.setAttribute("aria-disabled", "true");
      } else {
        createCustomPrompt.removeAttribute("aria-disabled");
      }
    }
  };

  const getCreateInsightFingerprint = () => {
    return [
      (createDescription?.value || "").trim(),
      (createHighlights?.value || "").trim(),
      (createMarketplace?.value || "").trim(),
      (createCardsCount?.value || "").trim(),
      createSelectedFiles.map((file) => getCreateFileKey(file)).join("|"),
    ].join("::");
  };

  const getCreateInsightInputError = () => {
    const hasImages = createSelectedFiles.length > 0;
    const hasDescription = (createDescription?.value || "").trim().length >= 8;
    if (hasImages || hasDescription) return "";
    return "Для AI insight добавьте минимум 1 фото или заполните «Описание товара».";
  };

  const buildCreateInsightPayload = async () => {
    const imageDataUrls = await buildCreateImageDataUrls();
    return {
      description: (createDescription?.value || "").trim(),
      highlights: (createHighlights?.value || "").trim(),
      marketplace: (createMarketplace?.value || "").trim(),
      cardsCount: (createCardsCount?.value || "").trim() || "1",
      files: createSelectedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
      })),
      imagePreviewUrls: imageDataUrls,
      imageDataUrls,
    };
  };

  const mockCreateInsightRequest = async (payload) => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, CREATE_INSIGHT_MOCK_DELAY);
    });

    if (!payload.description && payload.files.length === 0) {
      throw new Error("Недостаточно данных для анализа AI insight.");
    }

    const sourceText = [payload.description, payload.highlights].join(" ").toLowerCase();
    const category = /крем|сыворот|космет|beauty/.test(sourceText)
      ? "Beauty / уход"
      : /кабель|заряд|наушник|электрон|гаджет|tech/.test(sourceText)
        ? "Электроника и аксессуары"
        : /кофе|чай|снек|еда|food/.test(sourceText)
          ? "Food / FMCG"
          : payload.files.length >= 3
            ? "Lifestyle товар"
            : "Универсальный потребительский товар";

    const style = /premium|премиум|дорог/.test(sourceText)
      ? "Premium clean: светлый фон, аккуратная типографика, один сильный фокус"
      : /скидк|выгод|акци/.test(sourceText)
        ? "Promo-first: контрастная выгода + четкая иерархия оффера"
        : "Catalog+benefit: чистая продуктовая композиция с блоком выгод";

    const conversionAccent = /доставк|быстр|сегодня/.test(sourceText)
      ? "Сфокусироваться на скорости доставки и наличии"
      : /гарант|качест|сертификат/.test(sourceText)
        ? "Подчеркнуть доверие: гарантия, материалы, подтвержденное качество"
        : "Подсветить главную выгоду товара в первом экране и коротком CTA";

    const marketplaceFormat = payload.marketplace === "Wildberries"
      ? "Крупный hero + 3 быстрых буллета + короткий CTA, акцент на считываемость с мобильного"
      : payload.marketplace === "Яндекс Маркет"
        ? "Рациональный формат: факты, выгоды, доказательства, спокойный visual tone"
        : "Ozon-ready: яркий first frame, блок выгод, продукт в центре и чистый оффер";

    return {
      category,
      recommendedStyle: style,
      conversionAccent,
      marketplaceFormat,
    };
  };

  const requestCreateInsight = async (payload) => {
    if (serviceClient?.createAnalyze) {
      const response = await serviceClient.createAnalyze(payload, { intent: "insight" });
      if (response?.insight) return response.insight;
      if (response && response.category && response.recommendedStyle) return response;
      throw new Error("Invalid createAnalyze response: insight is missing.");
    }
    if (serviceClient?.ai?.generateProductInsight) {
      const detectedCategory = serviceClient.ai.detectProductCategory
        ? await serviceClient.ai.detectProductCategory(payload)
        : "";
      return serviceClient.ai.generateProductInsight({
        ...payload,
        detectedCategory,
      });
    }
    return mockCreateInsightRequest(payload);
  };

  const renderCreateInsightValues = (insight) => {
    const fallback = "-";
    if (createInsightCategory) {
      createInsightCategory.textContent = insight?.category || fallback;
    }
    if (createInsightStyle) {
      createInsightStyle.textContent = insight?.recommendedStyle || fallback;
    }
    if (createInsightAccent) {
      createInsightAccent.textContent = insight?.conversionAccent || fallback;
    }
    if (createInsightFormat) {
      createInsightFormat.textContent = insight?.marketplaceFormat || fallback;
    }
  };

  const syncCreateInsightState = () => {
    const hasInsight = Boolean(createInsightData);
    const inputError = getCreateInsightInputError();
    const isLoading = createInsightPhase === "loading";
    const isError = createInsightPhase === "error";
    const isSuccess = createInsightPhase === "success";
    const isStale = hasInsight && createInsightFingerprint !== getCreateInsightFingerprint();

    createInsightCard?.classList.toggle("is-empty", !hasInsight && createInsightPhase === "empty");
    createInsightCard?.classList.toggle("is-loading", isLoading);
    createInsightCard?.classList.toggle("is-error", isError);
    createInsightCard?.classList.toggle("is-success", isSuccess);
    createInsightCard?.classList.toggle("is-stale", isStale);

    if (createInsightRunBtn) {
      createInsightRunBtn.textContent = hasInsight ? "Обновить insight" : "Собрать insight";
      createInsightRunBtn.toggleAttribute("disabled", isLoading || createIsGenerating || createAiPromptPhase === "loading");
      createInsightRunBtn.classList.toggle("is-loading", isLoading);
    }

    if (!hasInsight) {
      renderCreateInsightValues(null);
    }

    if (createInsightStatus) {
      if (createInsightPhase === "empty") {
        setStatusMessage(
          createInsightStatus,
          inputError || "Данные готовы. Нажмите «Собрать insight».",
          ""
        );
      } else if (isSuccess && isStale) {
        setStatusMessage(
          createInsightStatus,
          "Данные изменились. Обновите insight, чтобы prompt использовал актуальные рекомендации.",
          ""
        );
      }
    }
  };

  const runCreateInsightAnalysis = async (options) => {
    const source = (options && options.source) || "manual";
    const inputError = getCreateInsightInputError();
    if (inputError) {
      createInsightPhase = "error";
      if (!createInsightData) {
        renderCreateInsightValues(null);
      }
      setStatusMessage(createInsightStatus, inputError, "error");
      syncCreateInsightState();
      return false;
    }

    createInsightPhase = "loading";
    const requestId = ++createInsightRequestId;
    setDoneState(createDoneBadge, false);
    setStatusMessage(createInsightStatus, "AI copilot анализирует товар и формирует insight...", "");
    setRequestMeta(createMeta, "Статус запроса:", "AI insight: анализ данных");
    syncCreateFormState();

    try {
      const payload = await buildCreateInsightPayload();
      const insight = await requestCreateInsight(payload);
      if (requestId !== createInsightRequestId) return false;

      createInsightData = insight;
      createInsightFingerprint = getCreateInsightFingerprint();
      createInsightPhase = "success";
      renderCreateInsightValues(insight);

      setStatusMessage(
        createInsightStatus,
        source === "prompt"
          ? "Insight обновлен и применен при генерации prompt."
          : "Insight готов. Используйте его как опору для prompt и карточки.",
        "success"
      );

      if (source !== "prompt") {
        setRequestMeta(createMeta, "Статус запроса:", "AI insight готов");
      }
      return true;
    } catch (error) {
      if (requestId !== createInsightRequestId) return false;
      createInsightPhase = "error";
      const message = error instanceof Error ? error.message : "Не удалось получить AI insight. Повторите попытку.";
      setStatusMessage(createInsightStatus, message, "error");
      setRequestMeta(createMeta, "Статус запроса:", "Ошибка генерации AI insight");
      return false;
    } finally {
      if (requestId === createInsightRequestId) {
        syncCreateFormState();
      }
    }
  };

  const getCreateAiPromptInputError = () => {
    const hasImages = createSelectedFiles.length > 0;
    const hasDescription = (createDescription?.value || "").trim().length >= 8;
    if (hasImages || hasDescription) return "";
    return "Для AI prompt добавьте минимум 1 фото или заполните «Описание товара».";
  };

  const buildCreateAiPromptPayload = async () => {
    const hasInsight = Boolean(createInsightData);
    const insightIsStale = hasInsight && createInsightFingerprint !== getCreateInsightFingerprint();
    const imageDataUrls = await buildCreateImageDataUrls();
    return {
      description: (createDescription?.value || "").trim(),
      highlights: (createHighlights?.value || "").trim(),
      marketplace: (createMarketplace?.value || "").trim(),
      cardsCount: (createCardsCount?.value || "").trim() || "1",
      files: createSelectedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
      })),
      imagePreviewUrls: imageDataUrls,
      imageDataUrls,
      insight: hasInsight && !insightIsStale ? { ...createInsightData } : null,
    };
  };

  const mockCreateAiPromptRequest = async (payload) => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, CREATE_AI_PROMPT_MOCK_DELAY);
    });

    if (!payload.description && payload.files.length === 0) {
      throw new Error("Недостаточно данных для генерации prompt.");
    }

    const headlineSource = payload.description
      ? payload.description
      : "товар по загруженным изображениям";
    const focusLine = payload.highlights
      ? payload.highlights
      : "сделай структуру чистой и добавь акцент на выгоде для покупателя";
    const visualLine = payload.files.length
      ? "Используй загруженные фото как основу композиции, ракурса и цветового баланса."
      : "Сформируй визуальную концепцию по текстовому описанию товара.";
    const targetMarketplace = payload.marketplace || "маркетплейс";
    const variants = payload.cardsCount || "1";
    const insight = payload.insight || null;

    return [
      "Ты senior e-commerce designer для marketplace sellers.",
      "Собери продающий prompt для генерации карточки товара.",
      'Товар: "' + headlineSource + '".',
      "Маркетплейс: " + targetMarketplace + ".",
      "Нужно вариантов: " + variants + ".",
      "Акценты: " + focusLine + ".",
      insight ? "Категория (AI insight): " + insight.category + "." : "",
      insight ? "Рекомендуемый стиль (AI insight): " + insight.recommendedStyle + "." : "",
      insight ? "Конверсионный акцент (AI insight): " + insight.conversionAccent + "." : "",
      insight ? "Формат подачи (AI insight): " + insight.marketplaceFormat + "." : "",
      visualLine,
      "Верни структуру: 1) Hero-заголовок 2) 3-5 буллетов выгод 3) CTA 4) визуальные указания.",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const requestCreateAiPrompt = async (payload) => {
    if (serviceClient?.createAnalyze) {
      const response = await serviceClient.createAnalyze(payload, { intent: "prompt" });
      const prompt = (response?.prompt || "").trim();
      if (prompt) return prompt;
      throw new Error("Invalid createAnalyze response: prompt is missing.");
    }
    if (serviceClient?.ai?.generatePrompt) {
      return serviceClient.ai.generatePrompt(payload);
    }
    return mockCreateAiPromptRequest(payload);
  };

  const syncCreateAiPromptState = () => {
    const promptValue = (createAiPromptOutput?.value || "").trim();
    const hasPrompt = promptValue.length > 0;
    const inputError = getCreateAiPromptInputError();
    const isLoading = createAiPromptPhase === "loading";
    const controlsLocked = isLoading || createIsGenerating || createInsightPhase === "loading";
    const canAcceptPrompt = promptValue.length >= CREATE_AI_PROMPT_MIN_ACCEPT_LEN;

    createAiPromptCard?.classList.toggle("is-empty", !hasPrompt && createAiPromptPhase === "empty");
    createAiPromptCard?.classList.toggle("is-loading", isLoading);
    createAiPromptCard?.classList.toggle("is-success", createAiPromptPhase === "success");
    createAiPromptCard?.classList.toggle("is-error", createAiPromptPhase === "error");

    if (createAiPromptGenerateBtn) {
      createAiPromptGenerateBtn.toggleAttribute("disabled", controlsLocked);
      createAiPromptGenerateBtn.classList.toggle("is-loading", isLoading);
    }

    createAiPromptRegenerateBtn?.toggleAttribute("disabled", controlsLocked || !hasPrompt);
    createAiPromptAcceptBtn?.toggleAttribute("disabled", controlsLocked || !canAcceptPrompt);

    if (createAiPromptOutput) {
      createAiPromptOutput.readOnly = controlsLocked;
      createAiPromptOutput.toggleAttribute("disabled", isLoading || (!hasPrompt && createAiPromptPhase !== "loading"));
      if (createAiPromptPhase !== "loading" && !hasPrompt) {
        createAiPromptOutput.value = "";
      }
    }

    if (createAiPromptStatus && createAiPromptPhase === "empty") {
      setStatusMessage(
        createAiPromptStatus,
        inputError || "Данные готовы. Нажмите «Сгенерировать prompt с AI».",
        ""
      );
    }
  };

  const runCreateAiPromptAssist = async () => {
    const inputError = getCreateAiPromptInputError();
    if (inputError) {
      createAiPromptPhase = "error";
      setStatusMessage(createAiPromptStatus, inputError, "error");
      syncCreateAiPromptState();
      return;
    }

    const insightIsOutdated = !createInsightData || createInsightFingerprint !== getCreateInsightFingerprint();
    if (insightIsOutdated) {
      const insightReady = await runCreateInsightAnalysis({ source: "prompt" });
      if (!insightReady) {
        createAiPromptPhase = "error";
        setStatusMessage(
          createAiPromptStatus,
          "Не удалось получить AI insight. Проверьте входные данные и повторите попытку.",
          "error"
        );
        syncCreateFormState();
        return;
      }
    }

    createAiPromptPhase = "loading";
    const requestId = ++createAiPromptRequestId;
    setDoneState(createDoneBadge, false);
    if (createAiPromptOutput) {
      createAiPromptOutput.value = "";
      createAiPromptOutput.placeholder = "AI анализирует входные данные...";
    }
    setStatusMessage(createAiPromptStatus, "AI анализирует входные данные и формирует prompt...", "");
    setRequestMeta(createMeta, "Статус запроса:", "AI prompt: анализ входных данных");
    syncCreateFormState();

    try {
      const payload = await buildCreateAiPromptPayload();
      const generatedPrompt = await requestCreateAiPrompt(payload);
      if (requestId !== createAiPromptRequestId) return;

      if (createAiPromptOutput) {
        createAiPromptOutput.value = generatedPrompt;
        createAiPromptOutput.placeholder = "Здесь появится auto-generated prompt.";
      }
      createAiPromptPhase = "success";
      setStatusMessage(
        createAiPromptStatus,
        "Prompt готов. Можно принять его, отредактировать или сгенерировать заново.",
        "success"
      );
      setRequestMeta(createMeta, "Статус запроса:", "AI prompt готов");
    } catch (error) {
      if (requestId !== createAiPromptRequestId) return;
      createAiPromptPhase = "error";
      if (createAiPromptOutput && !createAiPromptOutput.value.trim()) {
        createAiPromptOutput.placeholder = "Здесь появится auto-generated prompt.";
      }
      const message = error instanceof Error ? error.message : "Не удалось сгенерировать prompt. Повторите попытку.";
      setStatusMessage(createAiPromptStatus, message, "error");
      setRequestMeta(createMeta, "Статус запроса:", "Ошибка генерации AI prompt");
    } finally {
      if (requestId === createAiPromptRequestId) {
        syncCreateFormState();
      }
    }
  };

  const syncCreateFormState = () => {
    const validationError = getCreateValidationError();
    const controlsLocked =
      createIsGenerating ||
      createInsightPhase === "loading" ||
      createAiPromptPhase === "loading";
    const isDisabled = Boolean(validationError) || controlsLocked;

    if (createGenerateBtn) {
      createGenerateBtn.toggleAttribute("disabled", isDisabled);
      createGenerateBtn.classList.toggle("is-loading", createIsGenerating);
    }

    createPromptModeButtons.forEach((button) => {
      button.toggleAttribute("disabled", controlsLocked);
    });

    if (createImagesInput) createImagesInput.toggleAttribute("disabled", controlsLocked);
    if (createDescription) createDescription.toggleAttribute("disabled", controlsLocked);
    if (createHighlights) createHighlights.toggleAttribute("disabled", controlsLocked);
    if (createMarketplace) createMarketplace.toggleAttribute("disabled", controlsLocked);
    if (createCardsCount) createCardsCount.toggleAttribute("disabled", controlsLocked);

    if (createCustomPrompt) {
      const disableCustomPrompt = controlsLocked || createPromptMode !== "custom";
      createCustomPrompt.toggleAttribute("disabled", disableCustomPrompt);
      if (disableCustomPrompt) {
        createCustomPrompt.setAttribute("aria-disabled", "true");
      } else {
        createCustomPrompt.removeAttribute("aria-disabled");
      }
    }

    createUploadZone?.classList.toggle("is-disabled", controlsLocked);
    createUploadZone?.setAttribute("aria-disabled", controlsLocked ? "true" : "false");

    if (createCtaHint) {
      if (createIsGenerating) {
        createCtaHint.textContent = "Генерация в процессе...";
      } else if (validationError) {
        createCtaHint.textContent = validationError;
      } else {
        createCtaHint.textContent = "Форма заполнена. Можно запускать генерацию.";
      }
    }
    syncCreateInsightState();
    syncCreateAiPromptState();
  };

  const isCreateControlsLocked = () => {
    return createIsGenerating || createInsightPhase === "loading" || createAiPromptPhase === "loading";
  };

  const resetCreateTransientErrorState = () => {
    if (createAiPromptPhase === "error" && !(createAiPromptOutput?.value || "").trim()) {
      createAiPromptPhase = "empty";
    }
    if (createInsightPhase === "error" && !createInsightData) {
      createInsightPhase = "empty";
    }
  };

  const cancelPendingCreateRequests = () => {
    let cancelled = false;

    if (createInsightPhase === "loading") {
      createInsightRequestId += 1;
      createInsightPhase = createInsightData ? "success" : "empty";
      cancelled = true;
    }

    if (createAiPromptPhase === "loading") {
      createAiPromptRequestId += 1;
      createAiPromptPhase = (createAiPromptOutput?.value || "").trim() ? "success" : "empty";
      cancelled = true;
    }

    return cancelled;
  };

  const addCreateFiles = (fileList) => {
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }

    const incomingFiles = Array.from(fileList || []);
    if (!incomingFiles.length) return;

    let added = 0;
    let rejectedByType = 0;
    let rejectedByLimit = 0;
    let rejectedByDuplicate = 0;

    incomingFiles.forEach((file) => {
      if (!isCreateFileAccepted(file)) {
        rejectedByType += 1;
        return;
      }

      const key = getCreateFileKey(file);
      const alreadyExists = createSelectedFiles.some((existingFile) => getCreateFileKey(existingFile) === key);
      if (alreadyExists) {
        rejectedByDuplicate += 1;
        return;
      }

      if (createSelectedFiles.length >= CREATE_UPLOAD_MAX_FILES) {
        rejectedByLimit += 1;
        return;
      }

      createSelectedFiles.push(file);
      added += 1;
    });

    const feedbackParts = [];
    if (added > 0) feedbackParts.push("Добавлено фото: " + String(added));
    if (rejectedByType > 0) {
      feedbackParts.push(
        "Неподдерживаемый формат: " + String(rejectedByType) + " (разрешены PNG, JPG, WEBP)"
      );
    }
    if (rejectedByLimit > 0) feedbackParts.push("Превышен лимит: максимум " + String(CREATE_UPLOAD_MAX_FILES));
    if (rejectedByDuplicate > 0) feedbackParts.push("Дубликаты пропущены: " + String(rejectedByDuplicate));

    if (feedbackParts.length > 0) {
      const hasErrors = rejectedByType > 0 || rejectedByLimit > 0 || (added === 0 && rejectedByDuplicate > 0);
      setStatusMessage(createStatus, feedbackParts.join(". ") + ".", hasErrors ? "error" : "success");
    }

    resetCreateTransientErrorState();

    setDoneState(createDoneBadge, false);
    renderCreateFiles();
    syncCreateFormState();
  };

  const getHistoryScopeId = (user) => {
    return user?.uid || "guest";
  };

  const getHistoryStorageKey = (user) => {
    return HISTORY_STORAGE_PREFIX + getHistoryScopeId(user);
  };

  const getHistoryFallbackPreview = (mode) => {
    return mode === "improve"
      ? IMPROVE_RESULT_FALLBACK_PREVIEWS[0]
      : CREATE_GENERATION_FALLBACK_PREVIEWS[0];
  };

  const sanitizeHistoryPreviewUrl = (previewUrl, mode) => {
    const safeUrl = String(previewUrl || "").trim();
    if (!safeUrl || safeUrl.startsWith("blob:")) {
      return getHistoryFallbackPreview(mode);
    }
    return safeUrl;
  };

  const normalizeHistoryMode = (mode) => {
    return mode === "improve" ? "improve" : "create";
  };

  const normalizeHistorySeverity = (severity) => {
    const safeSeverity = String(severity || "").trim().toLowerCase();
    if (safeSeverity === "high" || safeSeverity === "medium" || safeSeverity === "low") return safeSeverity;
    return "medium";
  };

  const normalizeHistoryIssue = (issue, index) => {
    return {
      key: String(issue?.key || "issue-" + String(index + 1)).trim(),
      title: String(issue?.title || "Пункт анализа").trim(),
      severity: normalizeHistorySeverity(issue?.severity),
      note: String(issue?.note || "").trim(),
    };
  };

  const normalizeHistoryUpload = (upload, mode, index) => {
    return {
      id:
        String(upload?.id || "").trim() ||
        "upload-" + String(Date.now()) + "-" + String(index + 1),
      role: String(upload?.role || "product").trim().toLowerCase(),
      name: String(upload?.name || "image-" + String(index + 1) + ".png").trim(),
      type: String(upload?.type || "image/png").trim(),
      url: sanitizeHistoryPreviewUrl(upload?.url || upload?.previewUrl, mode),
    };
  };

  const normalizeHistoryResult = (result, mode, index, fallbackPreview) => {
    const normalizedVariant = Number(result?.variantNumber || index + 1);
    const normalizedTotal = Number(result?.totalVariants || result?.total || 1);
    return {
      id:
        String(result?.id || "").trim() ||
        "result-" + String(Date.now()) + "-" + String(index + 1),
      title: String(result?.title || "Вариант " + String(index + 1)).trim(),
      previewUrl: sanitizeHistoryPreviewUrl(result?.previewUrl || fallbackPreview, mode),
      variantNumber: Number.isFinite(normalizedVariant) ? Math.max(1, Math.floor(normalizedVariant)) : index + 1,
      totalVariants: Number.isFinite(normalizedTotal) ? Math.max(1, Math.floor(normalizedTotal)) : 1,
      subtitle: String(result?.subtitle || result?.strategy || "").trim(),
      summary: String(result?.summary || result?.focus || result?.changes || "").trim(),
      format: String(result?.format || "").trim(),
      styleLabel: String(result?.styleLabel || "").trim(),
      referenceStyle: Boolean(result?.referenceStyle),
      downloadName: String(result?.downloadName || "").trim(),
    };
  };

  const buildHistoryAiSummary = (mode, ai, summaryFallback) => {
    const explicitSummary = String(ai?.summary || "").trim();
    if (explicitSummary) return explicitSummary;
    if (mode === "create" && ai?.insight?.conversionAccent) {
      return "AI insight: " + String(ai.insight.conversionAccent);
    }
    if (mode === "improve" && ai?.analysis?.summary) {
      return String(ai.analysis.summary);
    }
    return String(summaryFallback || "").trim();
  };

  const normalizeHistoryEntry = (entry) => {
    const mode = normalizeHistoryMode(entry?.mode);
    const createdAtCandidate = String(entry?.createdAt || entry?.timestamp || "").trim();
    const createdAtDate = new Date(createdAtCandidate || Date.now());
    const createdAt = Number.isNaN(createdAtDate.getTime())
      ? new Date().toISOString()
      : createdAtDate.toISOString();
    const input = {
      description: String(entry?.input?.description || entry?.description || "").trim(),
      highlights: String(entry?.input?.highlights || entry?.highlights || "").trim(),
      marketplace: String(entry?.input?.marketplace || entry?.meta?.marketplace || "").trim(),
      cardsCount: Number(entry?.input?.cardsCount || entry?.resultsCount || 1),
      promptMode: String(entry?.input?.promptMode || entry?.meta?.promptMode || "").trim() || "ai",
      customPrompt: String(entry?.input?.customPrompt || "").trim(),
      improvePrompt: String(entry?.input?.improvePrompt || "").trim(),
      improveMode: String(entry?.input?.improveMode || entry?.meta?.improveMode || "").trim() || "ai",
      variantsCount: Number(entry?.input?.variantsCount || entry?.resultsCount || 1),
      referenceStyle: Boolean(entry?.input?.referenceStyle || entry?.meta?.referenceStyle),
    };
    const uploads = Array.isArray(entry?.uploads)
      ? entry.uploads.map((upload, index) => normalizeHistoryUpload(upload, mode, index)).slice(0, CREATE_UPLOAD_MAX_FILES)
      : [];
    const legacyResultPreviews = Array.isArray(entry?.resultPreviews)
      ? entry.resultPreviews
          .map((url) => sanitizeHistoryPreviewUrl(url, mode))
          .filter(Boolean)
          .slice(0, CREATE_UPLOAD_MAX_FILES)
      : [];
    const normalizedResults = Array.isArray(entry?.results)
      ? entry.results
          .map((result, index) =>
            normalizeHistoryResult(result, mode, index, legacyResultPreviews[index] || uploads[index]?.url || "")
          )
          .slice(0, CREATE_UPLOAD_MAX_FILES)
      : [];
    const results =
      normalizedResults.length > 0
        ? normalizedResults
        : legacyResultPreviews.map((previewUrl, index) =>
            normalizeHistoryResult(
              {
                title: "Вариант " + String(index + 1),
                previewUrl,
                variantNumber: index + 1,
                totalVariants: legacyResultPreviews.length || 1,
              },
              mode,
              index,
              previewUrl
            )
          );
    const resultPreviews = results.map((result) => result.previewUrl);
    const resultsCountSource = Number(entry?.resultsCount || results.length || 1);
    const resultsCount = Number.isFinite(resultsCountSource) ? Math.max(1, Math.floor(resultsCountSource)) : 1;
    const prompt = String(entry?.prompt || "").trim();
    const summary = String(entry?.summary || "").trim();
    const previewUrl = sanitizeHistoryPreviewUrl(entry?.previewUrl || resultPreviews[0] || uploads[0]?.url, mode);

    const rawInsight = entry?.ai?.insight || entry?.insight || null;
    const insight = rawInsight
      ? {
          category: String(rawInsight.category || "").trim(),
          recommendedStyle: String(rawInsight.recommendedStyle || "").trim(),
          conversionAccent: String(rawInsight.conversionAccent || "").trim(),
          marketplaceFormat: String(rawInsight.marketplaceFormat || "").trim(),
        }
      : null;
    const rawAnalysis = entry?.ai?.analysis || entry?.analysis || null;
    const analysis = rawAnalysis
      ? {
          score: Number(rawAnalysis.score || 0) || 0,
          summary: String(rawAnalysis.summary || "").trim(),
          marketplaceFormat: String(rawAnalysis.marketplaceFormat || "").trim(),
          reference: {
            uploaded: Boolean(rawAnalysis.reference?.uploaded),
            active: Boolean(rawAnalysis.reference?.active),
            note: String(rawAnalysis.reference?.note || "").trim(),
          },
          issues: Array.isArray(rawAnalysis.issues)
            ? rawAnalysis.issues.map((issue, index) => normalizeHistoryIssue(issue, index)).slice(0, IMPROVE_ANALYSIS_DIMENSIONS.length)
            : [],
          recommendations: Array.isArray(rawAnalysis.recommendations)
            ? rawAnalysis.recommendations.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4)
            : [],
        }
      : null;
    const ai = {
      summary: "",
      insight,
      analysis,
    };
    ai.summary = buildHistoryAiSummary(mode, ai, summary);

    return {
      id:
        String(entry?.id || "").trim() ||
        "history-" + String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
      mode,
      createdAt,
      title:
        String(entry?.title || "").trim() ||
        String(resultsCount) + " " + formatCardsWord(resultsCount) + " • " + (modeLabelMap[mode] || "Запрос"),
      summary: summary || "Описание не указано.",
      prompt,
      resultsCount,
      previewUrl,
      resultPreviews: resultPreviews.length ? resultPreviews : [previewUrl],
      input: {
        ...input,
        cardsCount: Number.isFinite(input.cardsCount) ? Math.max(1, Math.floor(input.cardsCount)) : 1,
        variantsCount: Number.isFinite(input.variantsCount) ? Math.max(1, Math.floor(input.variantsCount)) : 1,
      },
      uploads,
      ai,
      results,
      meta: {
        marketplace: String(entry?.meta?.marketplace || "").trim(),
        promptMode: String(entry?.meta?.promptMode || "").trim(),
        improveMode: String(entry?.meta?.improveMode || "").trim(),
        referenceStyle: Boolean(entry?.meta?.referenceStyle),
      },
    };
  };

  const sortHistoryEntriesDesc = (entries) => {
    return entries.sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
  };

  const persistHistory = async () => {
    const serializable = historyEntries.map((entry) => ({
      id: entry.id,
      mode: entry.mode,
      createdAt: entry.createdAt,
      title: entry.title,
      summary: entry.summary,
      prompt: entry.prompt,
      resultsCount: entry.resultsCount,
      previewUrl: entry.previewUrl,
      resultPreviews: entry.resultPreviews,
      input: entry.input,
      uploads: entry.uploads,
      ai: entry.ai,
      results: entry.results,
      meta: entry.meta,
    }));

    if (serviceClient?.historySave) {
      try {
        await serviceClient.historySave({
          scopeId: getHistoryScopeId(activeUser),
          entries: serializable,
        });
        return;
      } catch (error) {
        // Fallback to legacy localStorage persistence when service storage fails.
      }
    }

    if (typeof window === "undefined" || !window.localStorage) return;

    try {
      window.localStorage.setItem(getHistoryStorageKey(activeUser), JSON.stringify(serializable));
    } catch (error) {
      // Local storage can fail in private mode or when quota is exceeded.
    }
  };

  const loadHistory = async () => {
    historyEntries.length = 0;
    selectedHistoryEntryId = "";
    historyDetailsVisible = false;

    let sourceEntries = null;

    if (serviceClient?.historyList) {
      try {
        const serviceEntries = await serviceClient.historyList({
          scopeId: getHistoryScopeId(activeUser),
          limit: HISTORY_MAX_ITEMS,
        });
        if (Array.isArray(serviceEntries)) {
          sourceEntries = serviceEntries;
        }
      } catch (error) {
        sourceEntries = null;
      }
    }

    if (sourceEntries === null) {
      if (typeof window === "undefined" || !window.localStorage) return;
      try {
        const rawValue = window.localStorage.getItem(getHistoryStorageKey(activeUser));
        const parsed = JSON.parse(rawValue || "[]");
        sourceEntries = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        sourceEntries = [];
      }
    }

    try {
      const normalized = sortHistoryEntriesDesc(sourceEntries.map(normalizeHistoryEntry)).slice(0, HISTORY_MAX_ITEMS);
      historyEntries.push(...normalized);
      selectedHistoryEntryId = historyEntries[0]?.id || "";
    } catch (error) {
      historyEntries.length = 0;
      selectedHistoryEntryId = "";
    }
  };

  const clearHistory = async () => {
    historyEntries.length = 0;
    selectedHistoryEntryId = "";
    await persistHistory();
    renderHistory();
  };

  const refreshHistory = async () => {
    await loadHistory();
    renderHistory();
  };

  const getHistoryEntryById = (entryId) => {
    const safeId = String(entryId || "").trim();
    if (!safeId) return null;
    return historyEntries.find((entry) => entry.id === safeId) || null;
  };

  const formatHistoryTime = (date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatHistoryDate = (date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatHistoryDateTime = (date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getHistoryModeTag = (mode) => {
    return mode === "improve" ? "improve" : "create";
  };

  const getHistoryUploadRoleLabel = (role) => {
    const normalizedRole = String(role || "").trim().toLowerCase();
    if (normalizedRole === "source") return "Исходная карточка";
    if (normalizedRole === "reference") return "Референс";
    return "Фото товара";
  };

  const renderHistoryInputValues = (entry) => {
    if (!historyDetailsInputs) return;
    historyDetailsInputs.textContent = "";

    const rows = entry.mode === "improve"
      ? [
          { label: "Режим", value: entry.input.improveMode === "reference" ? "В стиле референса" : "Обычное AI улучшение" },
          { label: "Количество вариантов", value: String(entry.input.variantsCount || entry.resultsCount || 1) },
          { label: "Reference style", value: entry.input.referenceStyle ? "Включен" : "Не включен" },
          { label: "Комментарий", value: entry.input.improvePrompt || "Не указан" },
        ]
      : [
          { label: "Маркетплейс", value: entry.input.marketplace || "Не указан" },
          { label: "Количество карточек", value: String(entry.input.cardsCount || entry.resultsCount || 1) },
          { label: "Режим prompt", value: entry.input.promptMode === "custom" ? "Свой prompt" : "AI prompt" },
          { label: "Описание товара", value: entry.input.description || "Не указано" },
        ];

    rows.forEach((row) => {
      const item = document.createElement("article");
      item.className = "history-mode-kv-item";
      const label = document.createElement("span");
      label.textContent = row.label;
      const value = document.createElement("p");
      value.textContent = row.value;
      item.append(label, value);
      historyDetailsInputs.append(item);
    });
  };

  const renderHistoryUploads = (entry) => {
    if (!historyDetailsUploads) return;
    historyDetailsUploads.textContent = "";

    if (!entry.uploads.length) {
      const empty = document.createElement("p");
      empty.className = "history-mode-empty-note";
      empty.textContent = "Пользовательские изображения не сохранены.";
      historyDetailsUploads.append(empty);
      return;
    }

    entry.uploads.forEach((upload) => {
      const card = document.createElement("article");
      card.className = "history-mode-upload-item";

      const image = document.createElement("img");
      image.src = sanitizeHistoryPreviewUrl(upload.url, entry.mode);
      image.alt = upload.name || "Загруженное изображение";
      image.loading = "lazy";

      const meta = document.createElement("div");
      meta.className = "history-mode-upload-meta";

      const role = document.createElement("strong");
      role.textContent = getHistoryUploadRoleLabel(upload.role);

      const name = document.createElement("span");
      name.textContent = upload.name || "image.png";

      meta.append(role, name);
      card.append(image, meta);
      historyDetailsUploads.append(card);
    });
  };

  const renderHistoryAiBlock = (entry) => {
    if (!historyDetailsAi) return;
    historyDetailsAi.textContent = "";

    const insight = entry.ai?.insight || null;
    const analysis = entry.ai?.analysis || null;
    const summary = String(entry.ai?.summary || "").trim();

    if (!insight && !analysis && !summary) {
      const empty = document.createElement("p");
      empty.className = "history-mode-empty-note";
      empty.textContent = "AI summary/analysis для этой записи отсутствует.";
      historyDetailsAi.append(empty);
      return;
    }

    if (summary) {
      const summaryNode = document.createElement("p");
      summaryNode.className = "history-mode-ai-summary";
      summaryNode.textContent = summary;
      historyDetailsAi.append(summaryNode);
    }

    if (insight) {
      const insightGrid = document.createElement("div");
      insightGrid.className = "history-mode-ai-grid";

      const insightRows = [
        { label: "Категория", value: insight.category },
        { label: "Стиль", value: insight.recommendedStyle },
        { label: "Акцент", value: insight.conversionAccent },
        { label: "Формат", value: insight.marketplaceFormat },
      ].filter((item) => item.value);

      insightRows.forEach((item) => {
        const insightItem = document.createElement("article");
        insightItem.className = "history-mode-ai-item";
        const label = document.createElement("span");
        label.textContent = item.label;
        const value = document.createElement("p");
        value.textContent = item.value;
        insightItem.append(label, value);
        insightGrid.append(insightItem);
      });

      if (insightRows.length) {
        historyDetailsAi.append(insightGrid);
      }
    }

    if (analysis) {
      const analysisWrap = document.createElement("div");
      analysisWrap.className = "history-mode-analysis";

      if (Number.isFinite(analysis.score) && analysis.score > 0) {
        const score = document.createElement("p");
        score.className = "history-mode-analysis-score";
        score.textContent = "Оценка: " + String(analysis.score) + "/100";
        analysisWrap.append(score);
      }

      const issues = Array.isArray(analysis.issues) ? analysis.issues : [];
      if (issues.length) {
        const issueList = document.createElement("ul");
        issueList.className = "history-mode-analysis-issues";
        issues.slice(0, 5).forEach((issue) => {
          const issueItem = document.createElement("li");
          issueItem.textContent = issue.title + ": " + (issue.note || issue.severity);
          issueList.append(issueItem);
        });
        analysisWrap.append(issueList);
      }

      historyDetailsAi.append(analysisWrap);
    }
  };

  const renderHistoryResults = (entry) => {
    if (!historyDetailsResults) return;
    historyDetailsResults.textContent = "";

    if (!entry.results.length) {
      const empty = document.createElement("p");
      empty.className = "history-mode-empty-note";
      empty.textContent = "Результаты генерации не сохранены.";
      historyDetailsResults.append(empty);
      return;
    }

    entry.results.forEach((result) => {
      const card = document.createElement("article");
      card.className = "history-mode-result-card";
      card.classList.toggle("is-reference-style", Boolean(result.referenceStyle));

      const image = document.createElement("img");
      image.src = sanitizeHistoryPreviewUrl(result.previewUrl, entry.mode);
      image.alt = result.title || "Результат генерации";
      image.loading = "lazy";

      const body = document.createElement("div");
      body.className = "history-mode-result-body";

      const title = document.createElement("strong");
      title.textContent = result.title || "Вариант";

      const meta = document.createElement("span");
      meta.textContent =
        "Вариант " + String(result.variantNumber || 1) + " из " + String(result.totalVariants || entry.resultsCount || 1);

      body.append(title, meta);
      card.append(image, body);
      historyDetailsResults.append(card);
    });
  };

  const closeHistoryDetailsModal = () => {
    historyDetailsVisible = false;
    if (!historyModeDetails) return;
    historyModeDetails.classList.add("hidden");
    historyModeDetails.setAttribute("aria-hidden", "true");
    document.body.classList.remove("history-modal-open");
  };

  const openHistoryDetailsModal = () => {
    historyDetailsVisible = true;
    if (!historyModeDetails) return;
    historyModeDetails.classList.remove("hidden");
    historyModeDetails.setAttribute("aria-hidden", "false");
    document.body.classList.add("history-modal-open");
  };

  const renderHistoryDetails = () => {
    if (!historyModeDetails) return;

    const selectedEntry = getHistoryEntryById(selectedHistoryEntryId) || null;
    if (!selectedEntry || !historyDetailsVisible) {
      closeHistoryDetailsModal();
      historyReuseBtn?.setAttribute("disabled", "disabled");
      return;
    }

    selectedHistoryEntryId = selectedEntry.id;
    openHistoryDetailsModal();
    if (historyDetailsTitle) historyDetailsTitle.textContent = selectedEntry.title;
    if (historyDetailsDate) historyDetailsDate.textContent = formatHistoryDateTime(selectedEntry.createdAt);
    if (historyDetailsMode) {
      historyDetailsMode.textContent = selectedEntry.mode === "improve" ? "improve" : "create";
      historyDetailsMode.className = "history-mode-tag " + getHistoryModeTag(selectedEntry.mode);
    }
    if (historyDetailsCount) {
      historyDetailsCount.textContent =
        "Результатов: " + String(selectedEntry.resultsCount) + " " + formatCardsWord(selectedEntry.resultsCount);
    }
    if (historyDetailsSummary) historyDetailsSummary.textContent = selectedEntry.summary;
    if (historyDetailsPrompt) {
      const promptValue = selectedEntry.prompt || selectedEntry.input.customPrompt || "";
      historyDetailsPrompt.textContent = promptValue || "Пользовательский prompt не указан.";
    }
    if (historyDetailsHighlights) {
      historyDetailsHighlights.textContent =
        selectedEntry.input.highlights ||
        selectedEntry.input.improvePrompt ||
        "Дополнительные пожелания не указаны.";
    }
    if (historyReuseBtn) {
      historyReuseBtn.dataset.historyReuseId = selectedEntry.id;
      historyReuseBtn.toggleAttribute("disabled", historyReuseInProgress);
    }

    renderHistoryInputValues(selectedEntry);
    renderHistoryUploads(selectedEntry);
    renderHistoryAiBlock(selectedEntry);
    renderHistoryResults(selectedEntry);
  };

  const renderHistoryModeList = () => {
    if (!historyModeList) return;

    historyModeList.textContent = "";
    if (historyModeStats) {
      historyModeStats.textContent =
        String(historyEntries.length) +
        " " +
        (historyEntries.length === 1 ? "запись" : historyEntries.length > 1 && historyEntries.length < 5 ? "записи" : "записей");
    }

    if (!historyEntries.length) {
      historyModeEmpty?.classList.remove("hidden");
      closeHistoryDetailsModal();
      return;
    }

    historyModeEmpty?.classList.add("hidden");
    if (!getHistoryEntryById(selectedHistoryEntryId)) {
      selectedHistoryEntryId = historyEntries[0]?.id || "";
    }

    historyEntries.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "history-mode-item";
      item.classList.toggle("is-active", entry.id === selectedHistoryEntryId);
      item.dataset.historyOpenId = entry.id;

      const previewWrap = document.createElement("button");
      previewWrap.type = "button";
      previewWrap.className = "history-mode-item-preview";
      previewWrap.dataset.historyOpenId = entry.id;

      const previewImage = document.createElement("img");
      previewImage.src = sanitizeHistoryPreviewUrl(entry.previewUrl, entry.mode);
      previewImage.alt = entry.title;
      previewImage.loading = "lazy";
      previewImage.decoding = "async";
      previewImage.addEventListener("error", () => {
        previewImage.src = getHistoryFallbackPreview(entry.mode);
      });

      const modeTag = document.createElement("span");
      modeTag.className = "history-mode-tag " + getHistoryModeTag(entry.mode);
      modeTag.textContent = entry.mode;

      previewWrap.append(previewImage, modeTag);

      const title = document.createElement("p");
      title.className = "history-mode-item-title";
      title.textContent = entry.title;

      const meta = document.createElement("p");
      meta.className = "history-mode-item-meta";
      meta.textContent =
        formatHistoryDate(entry.createdAt) +
        " • " +
        String(entry.resultsCount) +
        " " +
        formatCardsWord(entry.resultsCount);

      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.className = "history-mode-open";
      openButton.dataset.historyOpenId = entry.id;
      openButton.textContent = "Открыть подробнее";

      item.append(previewWrap, title, meta, openButton);
      historyModeList.append(item);
    });
  };

  const renderHistory = () => {
    if (historyList) {
      historyList.textContent = "";

      if (!historyEntries.length) {
        historyEmpty?.classList.remove("hidden");
      } else {
        historyEmpty?.classList.add("hidden");

        historyEntries.slice(0, 12).forEach((entry) => {
          const item = document.createElement("article");
          item.className = "history-item";

          const itemHead = document.createElement("div");
          itemHead.className = "history-item-head";

          const title = document.createElement("strong");
          title.textContent = entry.title;

          const time = document.createElement("span");
          time.textContent = formatHistoryTime(entry.createdAt);

          itemHead.append(title, time);

          const meta = document.createElement("p");
          meta.className = "history-item-meta";
          meta.textContent = modeLabelMap[entry.mode] || "Запрос";

          const summary = document.createElement("p");
          summary.className = "history-item-prompt";
          summary.textContent = entry.summary;

          const actions = document.createElement("div");
          actions.className = "history-item-actions";

          const openButton = document.createElement("button");
          openButton.type = "button";
          openButton.className = "btn btn-ghost";
          openButton.dataset.historyOpenId = entry.id;
          openButton.textContent = "Подробнее";

          actions.append(openButton);
          item.append(itemHead, meta, summary, actions);
          historyList.append(item);
        });
      }
    }

    renderHistoryModeList();
    renderHistoryDetails();
  };

  const pushHistory = (entry) => {
    const normalizedEntry = normalizeHistoryEntry({
      ...entry,
      createdAt: new Date().toISOString(),
    });

    historyEntries.unshift(normalizedEntry);

    if (historyEntries.length > HISTORY_MAX_ITEMS) {
      historyEntries.length = HISTORY_MAX_ITEMS;
    }

    selectedHistoryEntryId = normalizedEntry.id;
    void persistHistory();
    renderHistory();
  };

  const setSelectValueIfExists = (selectNode, value) => {
    if (!selectNode) return;
    const normalizedValue = String(value || "").trim();
    if (!normalizedValue) return;
    const hasOption = Array.from(selectNode.options).some((option) => option.value === normalizedValue);
    if (hasOption) {
      selectNode.value = normalizedValue;
    }
  };

  const clearCreateSelectedFiles = () => {
    while (createSelectedFiles.length) {
      const file = createSelectedFiles.pop();
      if (file) {
        revokeCreateFilePreviewUrl(file);
      }
    }
  };

  const clearImproveFileState = () => {
    improveImageFile = null;
    improveImagePreview = "";
    improveReferenceFile = null;
    improveReferencePreviewUrl = "";

    if (improveSelectedImage) {
      improveSelectedImage.removeAttribute("src");
    }
    if (improveReferenceImage) {
      improveReferenceImage.removeAttribute("src");
    }

    improveSelectedPreview?.classList.add("hidden");
    improveReferencePreview?.classList.add("hidden");
  };

  const buildCreateHistoryPayload = async (payload, results) => {
    const files = createSelectedFiles.slice(0, CREATE_UPLOAD_MAX_FILES);
    const uploadsWithPreview = await Promise.all(
      files.map(async (file, index) => {
        const blobPreview = getCreateFilePreviewUrl(file);
        let url = "";
        try {
          url = await readFileAsDataUrl(file);
        } catch (error) {
          url = sanitizeHistoryPreviewUrl(blobPreview, "create");
        }
        return {
          blobPreview,
          upload: {
            id: "upload-" + String(Date.now()) + "-" + String(index + 1),
            role: "product",
            name: file.name,
            type: file.type || "image/png",
            url,
          },
        };
      })
    );

    const previewLookup = new Map();
    const uploads = uploadsWithPreview.map((item) => {
      previewLookup.set(item.blobPreview, item.upload.url);
      return item.upload;
    });

    const normalizedResults = (Array.isArray(results) ? results : [])
      .slice(0, CREATE_UPLOAD_MAX_FILES)
      .map((result, index) => {
        const rawPreview = String(result.previewUrl || "").trim();
        const resolvedPreview = previewLookup.get(rawPreview) || sanitizeHistoryPreviewUrl(rawPreview, "create");
        return normalizeHistoryResult(
          {
            ...result,
            previewUrl: resolvedPreview,
            subtitle: [result.marketplace, result.style].filter(Boolean).join(" • "),
            summary: result.focus || result.promptPreview || "",
          },
          "create",
          index,
          resolvedPreview
        );
      });

    const insight = payload?.insight ? { ...payload.insight } : (createInsightData ? { ...createInsightData } : null);
    const resolvedPrompt = String(payload?.prompt || resolveCreatePromptForGeneration() || "").trim();
    const summary = String(payload?.description || payload?.highlights || "Создание карточек товара").trim();

    return {
      summary: summary.slice(0, 180),
      prompt: resolvedPrompt.slice(0, 500),
      previewUrl: normalizedResults[0]?.previewUrl || uploads[0]?.url || getHistoryFallbackPreview("create"),
      resultPreviews: normalizedResults.map((item) => item.previewUrl),
      input: {
        description: String(payload?.description || "").trim(),
        highlights: String(payload?.highlights || "").trim(),
        marketplace: String(payload?.marketplace || "").trim(),
        cardsCount: Number(payload?.cardsCount || normalizedResults.length || 1),
        promptMode: String(payload?.promptMode || createPromptMode || "ai"),
        customPrompt: String(createCustomPrompt?.value || "").trim(),
        improvePrompt: "",
        improveMode: "ai",
        variantsCount: Number(payload?.cardsCount || normalizedResults.length || 1),
        referenceStyle: false,
      },
      uploads,
      ai: {
        summary: buildHistoryAiSummary("create", { insight }, summary),
        insight,
        analysis: null,
      },
      results: normalizedResults,
    };
  };

  const buildImproveHistoryPayload = (payload, results) => {
    const uploads = [];
    if (improveImagePreview) {
      uploads.push({
        id: "upload-" + String(Date.now()) + "-1",
        role: "source",
        name: improveImageFile?.name || "source-card.png",
        type: improveImageFile?.type || "image/png",
        url: sanitizeHistoryPreviewUrl(improveImagePreview, "improve"),
      });
    }
    if (improveReferencePreviewUrl) {
      uploads.push({
        id: "upload-" + String(Date.now()) + "-2",
        role: "reference",
        name: improveReferenceFile?.name || "reference-card.png",
        type: improveReferenceFile?.type || "image/png",
        url: sanitizeHistoryPreviewUrl(improveReferencePreviewUrl, "improve"),
      });
    }

    const normalizedResults = (Array.isArray(results) ? results : [])
      .slice(0, CREATE_UPLOAD_MAX_FILES)
      .map((result, index) => {
        const fallbackPreview = uploads[index]?.url || uploads[0]?.url || getHistoryFallbackPreview("improve");
        return normalizeHistoryResult(
          {
            ...result,
            previewUrl: sanitizeHistoryPreviewUrl(result.previewUrl, "improve"),
            subtitle: result.strategy || "",
            summary: result.changes || result.promptPreview || "",
          },
          "improve",
          index,
          fallbackPreview
        );
      });

    const analysis = payload?.analysis ? { ...payload.analysis } : (improveAnalysisData ? { ...improveAnalysisData } : null);
    const improveComment = String(payload?.prompt || improvePrompt?.value || "").trim();
    const summary = String(analysis?.summary || improveComment || "Улучшение карточки").trim();

    return {
      summary: summary.slice(0, 180),
      prompt: improveComment.slice(0, 500),
      previewUrl: normalizedResults[0]?.previewUrl || uploads[0]?.url || getHistoryFallbackPreview("improve"),
      resultPreviews: normalizedResults.map((item) => item.previewUrl),
      input: {
        description: "",
        highlights: "",
        marketplace: "",
        cardsCount: Number(payload?.variantsCount || normalizedResults.length || 1),
        promptMode: "ai",
        customPrompt: "",
        improvePrompt: improveComment,
        improveMode: String(payload?.mode || improveMode || "ai"),
        variantsCount: Number(payload?.variantsCount || normalizedResults.length || 1),
        referenceStyle: Boolean(payload?.referenceStyle),
      },
      uploads,
      ai: {
        summary: buildHistoryAiSummary("improve", { analysis }, summary),
        insight: null,
        analysis,
      },
      results: normalizedResults,
    };
  };

  const setHistoryReuseState = (isLoading) => {
    historyReuseInProgress = Boolean(isLoading);
    if (!historyReuseBtn) return;
    historyReuseBtn.classList.toggle("is-loading", historyReuseInProgress);
    historyReuseBtn.toggleAttribute("disabled", historyReuseInProgress);
    historyReuseBtn.textContent = historyReuseInProgress
      ? "Загружаем данные..."
      : "Использовать как основу снова";
  };

  const applyCreateHistoryEntry = async (entry) => {
    const uploads = ((entry.uploads && entry.uploads.length)
      ? entry.uploads
      : (entry.resultPreviews || []).map((previewUrl, index) => ({
          role: "product",
          name: "history-image-" + String(index + 1) + ".png",
          type: "image/png",
          url: previewUrl,
        })))
      .filter((upload) => upload.role !== "reference")
      .slice(0, CREATE_UPLOAD_MAX_FILES);

    clearCreateSelectedFiles();

    const restoredFiles = [];
    for (let index = 0; index < uploads.length; index += 1) {
      const upload = uploads[index];
      const file = await dataUrlToFile(upload.url, upload.name, upload.type);
      if (file && isCreateFileAccepted(file)) {
        restoredFiles.push(file);
      }
    }
    restoredFiles.forEach((file) => {
      createSelectedFiles.push(file);
    });

    if (createDescription) {
      createDescription.value = entry.input.description || "";
    }
    if (createHighlights) {
      createHighlights.value = entry.input.highlights || "";
    }
    setSelectValueIfExists(createMarketplace, entry.input.marketplace);
    setSelectValueIfExists(createCardsCount, String(entry.input.cardsCount || entry.resultsCount || 1));

    const historyPromptMode = entry.input.promptMode === "custom" ? "custom" : "ai";
    syncCreatePromptMode(historyPromptMode);
    if (createCustomPrompt) {
      createCustomPrompt.value = entry.input.customPrompt || entry.prompt || "";
    }

    if (createAiPromptOutput) {
      createAiPromptOutput.value = entry.prompt || "";
    }
    createAiPromptPhase = (entry.prompt || "").trim() ? "success" : "empty";

    createInsightData = entry.ai?.insight ? { ...entry.ai.insight } : null;
    createInsightPhase = createInsightData ? "success" : "empty";
    createInsightFingerprint = getCreateInsightFingerprint();
    renderCreateInsightValues(createInsightData);

    createGeneratedResults = [];
    createResultExpandedId = "";
    renderCreateResults();

    setDoneState(createDoneBadge, false);
    renderCreateFiles();
    syncCreateFormState();
    setRequestMeta(createMeta, "Статус запроса:", "Данные из истории загружены");

    const hasMissingUploads = uploads.length > 0 && restoredFiles.length === 0;
    setStatusMessage(
      createStatus,
      hasMissingUploads
        ? "Текстовые данные восстановлены. Добавьте фото снова и запустите генерацию."
        : "Данные из истории загружены. Можно использовать как основу новой генерации.",
      hasMissingUploads ? "" : "success"
    );

    navigateToAppMode("create");
  };

  const applyImproveHistoryEntry = async (entry) => {
    clearImproveFileState();
    improveGeneratedResults = [];
    improveResultExpandedId = "";
    renderImproveResults();

    syncImproveMode(entry.input.improveMode === "reference" ? "reference" : "ai");
    if (improvePrompt) {
      improvePrompt.value = entry.input.improvePrompt || entry.prompt || "";
    }
    setSelectValueIfExists(improveVariantsCount, String(entry.input.variantsCount || entry.resultsCount || 1));

    const historyUploads = (entry.uploads && entry.uploads.length)
      ? entry.uploads
      : (entry.resultPreviews || []).map((previewUrl, index) => ({
          role: index === 0 ? "source" : "reference",
          name: "history-image-" + String(index + 1) + ".png",
          type: "image/png",
          url: previewUrl,
        }));

    const sourceUpload = historyUploads.find((upload) => upload.role === "source" || upload.role === "product");
    const referenceUpload = historyUploads.find((upload) => upload.role === "reference");

    if (sourceUpload) {
      const sourceFile = await dataUrlToFile(sourceUpload.url, sourceUpload.name, sourceUpload.type);
      if (sourceFile) {
        improveImageFile = sourceFile;
      }
      improveImagePreview = sourceUpload.url;
      if (improveSelectedImage) {
        improveSelectedImage.src = improveImagePreview;
      }
      improveSelectedPreview?.classList.remove("hidden");
    }

    if (referenceUpload) {
      const referenceFile = await dataUrlToFile(referenceUpload.url, referenceUpload.name, referenceUpload.type);
      if (referenceFile) {
        improveReferenceFile = referenceFile;
      }
      improveReferencePreviewUrl = referenceUpload.url;
      if (improveReferenceImage) {
        improveReferenceImage.src = improveReferencePreviewUrl;
      }
      improveReferencePreview?.classList.remove("hidden");
    }

    improveAnalysisData = entry.ai?.analysis ? { ...entry.ai.analysis } : null;
    improveAnalysisPhase = improveAnalysisData ? "success" : "empty";
    improveAnalysisFingerprint = improveAnalysisData ? getImproveAnalysisFingerprint() : "";
    renderImproveAnalysisValues(improveAnalysisData);

    setDoneState(improveDoneBadge, false);
    syncImproveFormState();
    setRequestMeta(improveMeta, "Статус запроса:", "Данные из истории загружены");
    setStatusMessage(
      improveStatus,
      hasImproveSourceInput()
        ? "Данные из истории загружены. Проверьте параметры и запустите улучшение."
        : "Текстовые данные загружены. Добавьте исходную карточку, чтобы продолжить.",
      hasImproveSourceInput() ? "success" : ""
    );

    navigateToAppMode("improve");
  };

  const applyHistoryEntryAsBase = async (entry) => {
    setHistoryReuseState(true);
    try {
      if (entry.mode === "improve") {
        await applyImproveHistoryEntry(entry);
      } else {
        await applyCreateHistoryEntry(entry);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось восстановить запись из истории.";
      if (entry.mode === "improve") {
        setStatusMessage(improveStatus, message, "error");
      } else {
        setStatusMessage(createStatus, message, "error");
      }
    } finally {
      setHistoryReuseState(false);
      renderHistoryDetails();
    }
  };

  const formatCardsWord = (count) => {
    const normalized = Math.abs(Number(count) || 0) % 100;
    const lastDigit = normalized % 10;
    if (normalized > 10 && normalized < 20) return "карточек";
    if (lastDigit > 1 && lastDigit < 5) return "карточки";
    if (lastDigit === 1) return "карточка";
    return "карточек";
  };

  const setCreateResultsProcessing = (isProcessing) => {
    createResultsSection?.classList.remove("hidden");
    createResultsProcessing?.classList.toggle("hidden", !isProcessing);
    createResultsGrid?.classList.toggle("hidden", isProcessing);
  };

  const resolveCreatePromptForGeneration = () => {
    if (createPromptMode === "custom") {
      return (createCustomPrompt?.value || "").trim();
    }

    const aiPrompt = (createAiPromptOutput?.value || "").trim();
    if (aiPrompt) return aiPrompt;

    const fallbackPromptParts = [
      (createDescription?.value || "").trim(),
      (createHighlights?.value || "").trim(),
      createInsightData?.conversionAccent || "",
    ].filter(Boolean);

    return fallbackPromptParts.join(". ");
  };

  const buildCreateGenerationPayload = async () => {
    const cardsCount = Number(createCardsCount?.value || 1);
    const hasInsight = Boolean(createInsightData);
    const insightIsStale = hasInsight && createInsightFingerprint !== getCreateInsightFingerprint();
    const imageDataUrls = await buildCreateImageDataUrls();

    return {
      description: (createDescription?.value || "").trim(),
      highlights: (createHighlights?.value || "").trim(),
      marketplace: (createMarketplace?.value || "").trim(),
      cardsCount: Number.isFinite(cardsCount) ? cardsCount : 1,
      promptMode: createPromptMode,
      prompt: resolveCreatePromptForGeneration(),
      insight: hasInsight && !insightIsStale ? { ...createInsightData } : null,
      files: createSelectedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
      })),
      imagePreviewUrls: imageDataUrls,
      imageDataUrls,
    };
  };

  const mockCreateGenerationRequest = async (payload) => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, CREATE_GENERATION_MOCK_DELAY);
    });

    const totalVariants = Math.max(1, Math.min(CREATE_UPLOAD_MAX_FILES, Number(payload.cardsCount) || 1));
    const uploadedPreviews = createSelectedFiles.map((file) => getCreateFilePreviewUrl(file));
    const promptPreview = (payload.prompt || "").trim().slice(0, 240);

    return Array.from({ length: totalVariants }, (_, index) => {
      const variantNumber = index + 1;
      const previewUrl =
        uploadedPreviews[index % uploadedPreviews.length] ||
        CREATE_GENERATION_FALLBACK_PREVIEWS[index % CREATE_GENERATION_FALLBACK_PREVIEWS.length];

      return {
        id: "result-" + String(Date.now()) + "-" + String(variantNumber),
        variantNumber,
        totalVariants,
        previewUrl,
        title: "Вариант " + String(variantNumber),
        marketplace: payload.marketplace || "Marketplace",
        style: payload.insight?.recommendedStyle || "Clean marketplace layout",
        focus: payload.insight?.conversionAccent || "Подсветить ключевую выгоду товара в first frame",
        format: payload.insight?.marketplaceFormat || "Hero + выгоды + CTA",
        promptPreview,
        downloadName: "kartochka-variant-" + String(variantNumber) + ".png",
      };
    });
  };

  const requestCreateGeneration = async (payload) => {
    if (serviceClient?.createGenerate) {
      return serviceClient.createGenerate(payload);
    }
    if (serviceClient?.cards?.generateCards) {
      return serviceClient.cards.generateCards(payload);
    }
    return mockCreateGenerationRequest(payload);
  };

  const renderCreateResults = () => {
    if (!createResultsGrid || !createResultsCaption || !createResultsSection) return;

    createResultsGrid.textContent = "";
    const totalResults = createGeneratedResults.length;

    if (!totalResults) {
      createResultsCaption.textContent = "После генерации здесь появятся варианты карточек.";
      createResultsSection.classList.add("hidden");
      return;
    }

    const marketplace = createMarketplace?.value || "маркетплейс";
    createResultsCaption.textContent =
      "Сгенерировано " + String(totalResults) + " " + formatCardsWord(totalResults) + " для " + marketplace + ".";

    createGeneratedResults.forEach((result) => {
      const card = document.createElement("article");
      card.className = "create-result-card";

      const media = document.createElement("div");
      media.className = "create-result-media";

      const image = document.createElement("img");
      image.src = result.previewUrl;
      image.alt = result.title;
      image.loading = "lazy";

      const variantBadge = document.createElement("span");
      variantBadge.className = "create-result-badge";
      variantBadge.textContent = "Вариант " + String(result.variantNumber) + " из " + String(result.totalVariants);

      media.append(image, variantBadge);

      const body = document.createElement("div");
      body.className = "create-result-body";

      const title = document.createElement("h4");
      title.textContent = result.title;

      const subtitle = document.createElement("p");
      subtitle.textContent = result.marketplace + " • " + result.style;

      const actions = document.createElement("div");
      actions.className = "create-result-actions";

      const downloadLink = document.createElement("a");
      downloadLink.className = "create-result-action";
      downloadLink.href = result.previewUrl;
      downloadLink.download = result.downloadName;
      downloadLink.textContent = "Скачать";

      const detailsBtn = document.createElement("button");
      detailsBtn.className = "create-result-action";
      detailsBtn.type = "button";
      detailsBtn.dataset.resultDetailsId = result.id;
      detailsBtn.textContent = createResultExpandedId === result.id ? "Скрыть детали" : "Открыть подробнее";

      actions.append(downloadLink, detailsBtn);

      const details = document.createElement("div");
      details.className = "create-result-details";
      details.classList.toggle("hidden", createResultExpandedId !== result.id);

      const focus = document.createElement("p");
      focus.textContent = "Акцент: " + result.focus;

      const format = document.createElement("p");
      format.textContent = "Формат: " + result.format;

      const prompt = document.createElement("p");
      prompt.textContent = "Prompt: " + (result.promptPreview || "Использован стандартный prompt.");

      details.append(focus, format, prompt);

      body.append(title, subtitle, actions, details);
      card.append(media, body);
      createResultsGrid.append(card);
    });

    createResultsSection.classList.remove("hidden");
  };

  const getImproveFileKey = (file) => {
    return file ? [file.name, file.size, file.lastModified].join(":") : "";
  };

  const getImproveFileValidationError = (file, options) => {
    const label = (options && options.label) || "Файл";
    if (!file) return label + " не выбран.";
    if (!isCreateFileAccepted(file)) return "Поддерживаются только PNG, JPG и WEBP.";
    if (file.size > IMPROVE_MAX_FILE_SIZE_BYTES) {
      return label + " слишком большой. Максимум 10 МБ.";
    }
    return "";
  };

  const clearImproveResultsData = () => {
    improveGeneratedResults = [];
    improveResultExpandedId = "";
    renderImproveResults();
  };

  const hasImproveSourceInput = () => {
    return Boolean(improveImageFile || improveImagePreview);
  };

  const isImproveControlsLocked = () => {
    return improveIsGenerating || improveAnalysisPhase === "loading";
  };

  const cancelPendingImproveAnalysis = () => {
    if (improveAnalysisPhase !== "loading") return false;
    improveAnalysisRequestId += 1;
    improveAnalysisPhase = improveAnalysisData ? "success" : "empty";
    return true;
  };

  const resetImproveAnalysisAfterInputChange = () => {
    cancelPendingImproveAnalysis();
    if (improveAnalysisPhase === "error" && !improveAnalysisData) {
      improveAnalysisPhase = "empty";
    }
  };

  const applyImproveSourceFile = async (file) => {
    const validationError = getImproveFileValidationError(file, { label: "Исходная карточка" });
    if (validationError) {
      throw new Error(validationError);
    }

    improveImageFile = file;
    improveImagePreview = await readFileAsDataUrl(file);
    if (improveSelectedImage) {
      improveSelectedImage.src = improveImagePreview;
    }
    improveSelectedPreview?.classList.remove("hidden");

    clearImproveResultsData();
    resetImproveAnalysisAfterInputChange();
    setDoneState(improveDoneBadge, false);
    setStatusMessage(
      improveStatus,
      improveMode === "reference" && (improveReferenceFile || improveReferencePreviewUrl)
        ? "Исходная карточка загружена. AI учтет стиль референса при улучшении."
        : "Исходная карточка загружена. Запустите AI анализ перед улучшением.",
      "success"
    );
    setRequestMeta(improveMeta, "Статус запроса:", "Карточка загружена");
    syncImproveFormState();

    if (!improveIsGenerating && !historyReuseInProgress) {
      void runImproveAnalysis({ source: "auto" });
    }
  };

  const applyImproveReferenceFile = async (file) => {
    const validationError = getImproveFileValidationError(file, { label: "Референс" });
    if (validationError) {
      throw new Error(validationError);
    }

    improveReferenceFile = file;
    improveReferencePreviewUrl = await readFileAsDataUrl(file);
    if (improveReferenceImage) {
      improveReferenceImage.src = improveReferencePreviewUrl;
    }
    improveReferencePreview?.classList.remove("hidden");

    clearImproveResultsData();
    resetImproveAnalysisAfterInputChange();
    setDoneState(improveDoneBadge, false);
    setStatusMessage(
      improveStatus,
      improveMode === "reference"
        ? "Референс добавлен: улучшение будет ориентироваться на его стиль."
        : "Референс добавлен. Включите режим «В стиле референса», чтобы применить стиль.",
      "success"
    );
    syncImproveFormState();

    if (improveMode === "reference" && hasImproveSourceInput() && !improveIsGenerating && !historyReuseInProgress) {
      void runImproveAnalysis({ source: "auto" });
    }
  };

  const getImproveAnalysisFingerprint = () => {
    return [
      getImproveFileKey(improveImageFile),
      getImproveFileKey(improveReferenceFile),
      (improvePrompt?.value || "").trim(),
      improveMode,
      improveVariantsCount?.value || "1",
    ].join("::");
  };

  const getImproveAnalysisInputError = () => {
    if (hasImproveSourceInput()) return "";
    return "Загрузите исходную карточку, чтобы AI выполнил анализ.";
  };

  const getImproveValidationError = () => {
    if (!hasImproveSourceInput()) return "Добавьте исходную карточку.";
    if (improveMode === "reference" && !improveReferenceFile && !improveReferencePreviewUrl) {
      return "Для режима «в стиле референса» загрузите референс.";
    }
    if (!(improveVariantsCount?.value || "").trim()) return "Выберите количество вариантов.";
    return "";
  };

  const getImproveReferenceUiState = () => {
    const hasReference = Boolean(improveReferenceFile || improveReferencePreviewUrl);
    const referenceStyleActive = improveMode === "reference" && hasReference;
    return { hasReference, referenceStyleActive };
  };

  const syncImproveMode = (nextMode) => {
    improveMode = nextMode === "reference" ? "reference" : "ai";
    improveModeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.improveMode === improveMode);
    });
    improveReferenceUploadZone?.classList.toggle("is-required", improveMode === "reference");
  };

  const buildImproveAnalysisPayload = () => {
    return {
      mode: improveMode,
      prompt: (improvePrompt?.value || "").trim(),
      variantsCount: Number(improveVariantsCount?.value || 1),
      sourceCard: improveImageFile
        ? {
            name: improveImageFile.name,
            type: improveImageFile.type,
            sizeBytes: improveImageFile.size,
          }
        : improveImagePreview
          ? {
              name: "history-source-card.png",
              type: "image/png",
              sizeBytes: 0,
            }
          : null,
      referenceCard: improveReferenceFile
        ? {
            name: improveReferenceFile.name,
            type: improveReferenceFile.type,
            sizeBytes: improveReferenceFile.size,
          }
        : improveReferencePreviewUrl
          ? {
              name: "history-reference-card.png",
              type: "image/png",
              sizeBytes: 0,
            }
          : null,
      sourcePreviewUrl: improveImagePreview || "",
      referencePreviewUrl: improveReferencePreviewUrl || "",
    };
  };

  const mockImproveAnalysisRequest = async (payload) => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, IMPROVE_ANALYSIS_MOCK_DELAY);
    });

    if (!payload.sourceCard) {
      throw new Error("Недостаточно данных для AI анализа.");
    }

    const sourceText = [payload.prompt, payload.mode].join(" ").toLowerCase();
    const hasStructureIntent = /структур|читабель|типограф|сетка|композиц/.test(sourceText);
    const hasCtaIntent = /cta|призыв|кнопк|конверс|оффер|выгод/.test(sourceText);
    const hasMinimalIntent = /миним|чист|прост|лакон/.test(sourceText);
    const useReferenceMode = payload.mode === "reference";
    const hasReference = Boolean(payload.referenceCard);
    const referenceStyleActive = useReferenceMode && hasReference;

    const issues = [
      {
        key: "design",
        title: "Слабые стороны дизайна",
        severity: referenceStyleActive ? "medium" : "high",
        note: referenceStyleActive
          ? "База аккуратная, но стиль пока не собран в единую систему."
          : "Недостаточно визуальной иерархии и единого стилистического ритма.",
      },
      {
        key: "readability",
        title: "Читаемость",
        severity: hasStructureIntent ? "medium" : "high",
        note: hasStructureIntent
          ? "Читаемость средняя: заголовки и выгоды требуют усиления."
          : "Заголовок и выгоды считываются медленно на мобильном экране.",
      },
      {
        key: "composition",
        title: "Композиция",
        severity: hasStructureIntent ? "medium" : "high",
        note: hasStructureIntent
          ? "Композиция рабочая, но ключевые блоки равны по приоритету."
          : "Фокус распадается: важные элементы конкурируют между собой.",
      },
      {
        key: "accent",
        title: "Слабый акцент",
        severity: hasCtaIntent ? "medium" : "high",
        note: hasCtaIntent
          ? "Акцент есть, но ценность товара пока не доминирует."
          : "Главная выгода теряется, первый экран не удерживает внимание.",
      },
      {
        key: "cta",
        title: "Плохой CTA",
        severity: hasCtaIntent ? "medium" : "high",
        note: hasCtaIntent
          ? "CTA заметен, но формулировка недостаточно конкретная."
          : "CTA слабый: кнопка и призыв не дают явного следующего шага.",
      },
      {
        key: "overload",
        title: "Перегрузка",
        severity: hasMinimalIntent ? "medium" : "high",
        note: hasMinimalIntent
          ? "Перегрузка умеренная, но блоки все еще можно сократить."
          : "Избыточный текст и детали снижают скорость восприятия карточки.",
      },
      {
        key: "categoryFit",
        title: "Слабое соответствие категории",
        severity: referenceStyleActive ? "medium" : "high",
        note: referenceStyleActive
          ? "Категорийные триггеры есть, но требуют более точной адаптации."
          : "Недостаточно маркеров категории для уверенного восприятия товара.",
      },
    ];

    const severityWeight = { high: 3, medium: 2, low: 1 };
    const riskScore = issues.reduce((sum, item) => sum + (severityWeight[item.severity] || 2), 0);
    const score = Math.max(38, Math.min(96, 100 - riskScore * 2));

    const recommendations = [
      "Собрать первый экран вокруг одной главной выгоды и сильного визуального якоря.",
      "Усилить CTA: контрастная кнопка, короткий призыв и понятный следующий шаг.",
      referenceStyleActive
        ? "Применить стиль референса, сохранив категорийные триггеры marketplace."
        : "Сократить перегрузку: меньше текста, чище композиция, выше читаемость.",
    ];

    const summary = referenceStyleActive
      ? "AI учел стиль референса: выявили 7 зон риска и подготовили план улучшения под этот визуальный язык."
      : hasReference
        ? "AI нашел 7 зон риска. Референс загружен, но сейчас используется стандартный AI-режим."
        : "AI нашел 7 зон риска: фокус и CTA слабые, композицию и читаемость нужно усилить.";

    const referenceNote = referenceStyleActive
      ? "Активен reference style: улучшение будет ориентироваться на загруженный референс."
      : hasReference
        ? "Референс загружен, но не активирован. Включите режим «В стиле референса», чтобы применить стиль."
        : "Референс не загружен: используется стандартная AI-стратегия.";

    return {
      score,
      summary,
      issues,
      recommendations,
      marketplaceFormat: referenceStyleActive
        ? "Reference-style формат с адаптацией под требования marketplace."
        : "Конверсионный marketplace формат с явным оффером и CTA.",
      reference: {
        uploaded: hasReference,
        active: referenceStyleActive,
        note: referenceNote,
      },
    };
  };

  const requestImproveAnalysis = async (payload) => {
    if (serviceClient?.improveAnalyze) {
      return serviceClient.improveAnalyze(payload);
    }
    if (serviceClient?.ai?.analyzeCardWeakness) {
      return serviceClient.ai.analyzeCardWeakness(payload);
    }
    return mockImproveAnalysisRequest(payload);
  };

  const renderImproveAnalysisValues = (analysis) => {
    const { hasReference, referenceStyleActive } = getImproveReferenceUiState();

    if (improveAnalysisScore) {
      improveAnalysisScore.textContent = analysis && Number.isFinite(analysis.score) ? String(analysis.score) + "/100" : "--";
    }

    if (improveAnalysisSummary) {
      improveAnalysisSummary.textContent =
        analysis?.summary || "Загрузите карточку и запустите анализ, чтобы увидеть причины будущих улучшений.";
    }

    if (improveAnalysisContext) {
      improveAnalysisContext.textContent = analysis?.reference?.note || (
        referenceStyleActive
          ? "Активен reference style: AI ориентируется на стиль референса."
          : hasReference
            ? "Референс загружен, но сейчас работает стандартный AI-режим."
            : "Режим: стандартное AI-улучшение."
      );
    }

    if (improveAnalysisIssues) {
      improveAnalysisIssues.textContent = "";
      const titleMap = new Map(IMPROVE_ANALYSIS_DIMENSIONS.map((entry) => [entry.key, entry.title]));
      const fallbackIssues = IMPROVE_ANALYSIS_DIMENSIONS.map((entry) => ({
        key: entry.key,
        title: entry.title,
        severity: "neutral",
        note: "Ожидает анализа",
      }));
      const issues = Array.isArray(analysis?.issues) && analysis.issues.length ? analysis.issues : fallbackIssues;

      issues.forEach((issue) => {
        const severity = issue?.severity === "high" || issue?.severity === "medium" || issue?.severity === "low"
          ? issue.severity
          : "neutral";
        const severityLabel = severity === "high" ? "Критично" : severity === "medium" ? "Средне" : severity === "low" ? "Ок" : "—";

        const item = document.createElement("li");
        item.className = "improve-analysis-issue";

        const head = document.createElement("div");
        head.className = "improve-analysis-issue-head";

        const title = document.createElement("strong");
        title.textContent = issue?.title || titleMap.get(issue?.key) || "Параметр";

        const badge = document.createElement("span");
        badge.className = "improve-analysis-severity is-" + severity;
        badge.textContent = severityLabel;

        const note = document.createElement("p");
        note.textContent = issue?.note || "Данные появятся после анализа.";

        head.append(title, badge);
        item.append(head, note);
        improveAnalysisIssues.append(item);
      });
    }

    if (improveAnalysisRecommendations) {
      improveAnalysisRecommendations.textContent = "";
      const recommendations = Array.isArray(analysis?.recommendations) && analysis.recommendations.length
        ? analysis.recommendations
        : ["После анализа здесь появится план улучшений перед генерацией."];
      recommendations.slice(0, 3).forEach((entry) => {
        const item = document.createElement("li");
        item.textContent = entry;
        improveAnalysisRecommendations.append(item);
      });
    }
  };

  const syncImproveAnalysisState = () => {
    const hasAnalysis = Boolean(improveAnalysisData);
    const inputError = getImproveAnalysisInputError();
    const isLoading = improveAnalysisPhase === "loading";
    const isError = improveAnalysisPhase === "error";
    const isSuccess = improveAnalysisPhase === "success";
    const isStale = hasAnalysis && improveAnalysisFingerprint !== getImproveAnalysisFingerprint();

    improveAnalysisCard?.classList.toggle("is-empty", !hasAnalysis && improveAnalysisPhase === "empty");
    improveAnalysisCard?.classList.toggle("is-loading", isLoading);
    improveAnalysisCard?.classList.toggle("is-error", isError);
    improveAnalysisCard?.classList.toggle("is-success", isSuccess);
    improveAnalysisCard?.classList.toggle("is-stale", isStale);

    if (improveAnalyzeBtn) {
      improveAnalyzeBtn.toggleAttribute("disabled", isLoading || improveIsGenerating);
      improveAnalyzeBtn.classList.toggle("is-loading", isLoading);
    }

    if (!hasAnalysis) {
      renderImproveAnalysisValues(null);
    }

    if (improveAnalysisStatus && improveAnalysisPhase === "empty") {
      setStatusMessage(
        improveAnalysisStatus,
        inputError || "Данные готовы. Запустите AI анализ перед улучшением.",
        ""
      );
    } else if (improveAnalysisStatus && isSuccess && isStale) {
      setStatusMessage(
        improveAnalysisStatus,
        "Входные данные изменились. Обновите анализ, чтобы улучшение использовало актуальные рекомендации.",
        ""
      );
    }
  };

  const runImproveAnalysis = async (options) => {
    const source = (options && options.source) || "manual";
    const inputError = getImproveAnalysisInputError();
    const { referenceStyleActive } = getImproveReferenceUiState();
    if (inputError) {
      improveAnalysisPhase = "error";
      setStatusMessage(improveAnalysisStatus, inputError, "error");
      syncImproveFormState();
      return false;
    }

    improveAnalysisPhase = "loading";
    const requestId = ++improveAnalysisRequestId;
    setDoneState(improveDoneBadge, false);
    setStatusMessage(
      improveAnalysisStatus,
      referenceStyleActive
        ? "AI анализирует слабые стороны и сверяет карточку со стилем референса..."
        : "AI анализирует слабые стороны карточки...",
      ""
    );
    if (source !== "generation") {
      setRequestMeta(
        improveMeta,
        "Статус запроса:",
        referenceStyleActive ? "AI анализ карточки + reference style" : "AI анализ карточки"
      );
    }
    syncImproveFormState();

    try {
      const payload = buildImproveAnalysisPayload();
      const analysis = await requestImproveAnalysis(payload);
      if (requestId !== improveAnalysisRequestId) return false;

      improveAnalysisData = analysis;
      improveAnalysisFingerprint = getImproveAnalysisFingerprint();
      improveAnalysisPhase = "success";
      renderImproveAnalysisValues(analysis);
      setStatusMessage(
        improveAnalysisStatus,
        source === "generation"
          ? referenceStyleActive
            ? "Анализ обновлен с учетом референса и применен перед запуском улучшения."
            : "Анализ обновлен и применен перед запуском улучшения."
          : referenceStyleActive
            ? "Анализ готов: 7 зон улучшения определены с учетом стиля референса."
            : "Анализ готов: показали 7 зон улучшения. Можно запускать генерацию.",
        "success"
      );
      if (source !== "generation") {
        setRequestMeta(improveMeta, "Статус запроса:", "AI анализ готов");
      }
      return true;
    } catch (error) {
      if (requestId !== improveAnalysisRequestId) return false;
      improveAnalysisPhase = "error";
      const message = error instanceof Error ? error.message : "Не удалось выполнить AI анализ.";
      setStatusMessage(improveAnalysisStatus, message, "error");
      setRequestMeta(improveMeta, "Статус запроса:", "Ошибка AI анализа");
      return false;
    } finally {
      if (requestId === improveAnalysisRequestId) {
        syncImproveFormState();
      }
    }
  };

  const setImproveResultsProcessing = (isProcessing) => {
    improveResultsSection?.classList.remove("hidden");
    improveResultsProcessing?.classList.toggle("hidden", !isProcessing);
    improveResultsGrid?.classList.toggle("hidden", isProcessing);
  };

  const buildImproveGenerationPayload = () => {
    const variantsCount = Number(improveVariantsCount?.value || 1);
    const hasAnalysis = Boolean(improveAnalysisData);
    const analysisIsStale = hasAnalysis && improveAnalysisFingerprint !== getImproveAnalysisFingerprint();
    const referenceStyle = improveMode === "reference" && Boolean(improveReferenceFile);

    return {
      mode: improveMode,
      referenceStyle,
      prompt: (improvePrompt?.value || "").trim(),
      variantsCount: Number.isFinite(variantsCount) ? variantsCount : 1,
      analysis: hasAnalysis && !analysisIsStale ? { ...improveAnalysisData } : null,
      sourceCard: improveImageFile
        ? {
            name: improveImageFile.name,
            type: improveImageFile.type,
            sizeBytes: improveImageFile.size,
          }
        : improveImagePreview
          ? {
              name: "history-source-card.png",
              type: "image/png",
              sizeBytes: 0,
            }
          : null,
      referenceCard: improveReferenceFile
        ? {
            name: improveReferenceFile.name,
            type: improveReferenceFile.type,
            sizeBytes: improveReferenceFile.size,
          }
        : improveReferencePreviewUrl
          ? {
              name: "history-reference-card.png",
              type: "image/png",
              sizeBytes: 0,
            }
          : null,
      sourcePreviewUrl: improveImagePreview || "",
      referencePreviewUrl: improveReferencePreviewUrl || "",
    };
  };

  const mockImproveGenerationRequest = async (payload) => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, IMPROVE_GENERATION_MOCK_DELAY);
    });

    const totalVariants = Math.max(1, Math.min(CREATE_UPLOAD_MAX_FILES, Number(payload.variantsCount) || 1));
    const previewPool = [
      improveImagePreview,
      improveReferencePreviewUrl,
      ...IMPROVE_RESULT_FALLBACK_PREVIEWS,
    ].filter(Boolean);
    const promptPreview = (payload.prompt || "").trim().slice(0, 220);

    return Array.from({ length: totalVariants }, (_, index) => {
      const variantNumber = index + 1;
      const previewUrl = previewPool[index % previewPool.length];
      const referenceStyle = Boolean(payload.referenceStyle);

      return {
        id: "improve-result-" + String(Date.now()) + "-" + String(variantNumber),
        variantNumber,
        totalVariants,
        previewUrl,
        title: "Улучшенный вариант " + String(variantNumber),
        strategy: referenceStyle ? "Улучшение по стилю референса" : "Обычное AI улучшение",
        styleLabel: referenceStyle ? "Improved with reference style" : "",
        referenceStyle,
        changes: payload.analysis?.recommendations?.[0] || "Оптимизирована структура и усилен ключевой оффер.",
        format: payload.analysis?.marketplaceFormat || "Marketplace-ready формат с чистым CTA.",
        promptPreview,
        downloadName: "kartochka-improved-" + String(variantNumber) + ".png",
      };
    });
  };

  const requestImproveGeneration = async (payload) => {
    if (serviceClient?.improveGenerate) {
      return serviceClient.improveGenerate(payload);
    }
    if (serviceClient?.cards?.improveCards) {
      return serviceClient.cards.improveCards(payload);
    }
    return mockImproveGenerationRequest(payload);
  };

  const renderImproveResults = () => {
    if (!improveResultsGrid || !improveResultsCaption || !improveResultsSection) return;

    improveResultsGrid.textContent = "";
    const totalResults = improveGeneratedResults.length;

    if (!totalResults) {
      improveResultsCaption.textContent = "После улучшения здесь появятся варианты карточек.";
      improveResultsSection.classList.add("hidden");
      return;
    }

    const hasReferenceStyleResults = improveGeneratedResults.some((result) => Boolean(result.referenceStyle));
    improveResultsCaption.textContent = hasReferenceStyleResults
      ? "Подготовлено " + String(totalResults) + " " + formatCardsWord(totalResults) + " в стиле референса."
      : "Подготовлено " + String(totalResults) + " " + formatCardsWord(totalResults) + " после улучшения.";

    improveGeneratedResults.forEach((result) => {
      const card = document.createElement("article");
      card.className = "create-result-card";
      card.classList.toggle("is-reference-style", Boolean(result.referenceStyle));

      const media = document.createElement("div");
      media.className = "create-result-media";

      const image = document.createElement("img");
      image.src = result.previewUrl;
      image.alt = result.title;
      image.loading = "lazy";

      const variantBadge = document.createElement("span");
      variantBadge.className = "create-result-badge";
      variantBadge.textContent = "Вариант " + String(result.variantNumber) + " из " + String(result.totalVariants);

      media.append(image, variantBadge);

      const body = document.createElement("div");
      body.className = "create-result-body";

      const title = document.createElement("h4");
      title.textContent = result.title;

      const subtitle = document.createElement("p");
      subtitle.textContent = result.strategy;

      const styleTag = document.createElement("span");
      styleTag.className = "improve-reference-tag";
      styleTag.textContent = result.styleLabel || "Standard AI improvement";
      styleTag.classList.toggle("hidden", !result.referenceStyle);

      const actions = document.createElement("div");
      actions.className = "create-result-actions";

      const downloadLink = document.createElement("a");
      downloadLink.className = "create-result-action";
      downloadLink.href = result.previewUrl;
      downloadLink.download = result.downloadName;
      downloadLink.textContent = "Скачать";

      const detailsBtn = document.createElement("button");
      detailsBtn.className = "create-result-action";
      detailsBtn.type = "button";
      detailsBtn.dataset.improveResultDetailsId = result.id;
      detailsBtn.textContent = improveResultExpandedId === result.id ? "Скрыть детали" : "Открыть подробнее";

      actions.append(downloadLink, detailsBtn);

      const details = document.createElement("div");
      details.className = "create-result-details";
      details.classList.toggle("hidden", improveResultExpandedId !== result.id);

      const changes = document.createElement("p");
      changes.textContent = "Усилено: " + result.changes;

      const format = document.createElement("p");
      format.textContent = "Формат: " + result.format;

      const prompt = document.createElement("p");
      prompt.textContent = "Комментарий: " + (result.promptPreview || "Улучшение выполнено по стандартной стратегии.");

      details.append(changes, format, prompt);

      body.append(title, subtitle, styleTag, actions, details);
      card.append(media, body);
      improveResultsGrid.append(card);
    });

    improveResultsSection.classList.remove("hidden");
  };

  const syncImproveFormState = () => {
    const validationError = getImproveValidationError();
    const isBusy = isImproveControlsLocked();
    const isDisabled = Boolean(validationError) || isBusy;
    const analysisIsStale = Boolean(improveAnalysisData) && improveAnalysisFingerprint !== getImproveAnalysisFingerprint();
    const { hasReference, referenceStyleActive } = getImproveReferenceUiState();
    const hasSource = hasImproveSourceInput();

    if (improveRunBtn) {
      improveRunBtn.toggleAttribute("disabled", isDisabled);
      improveRunBtn.classList.toggle("is-loading", improveIsGenerating);
    }

    improvePrimaryUploadZone?.classList.toggle("is-filled", hasSource);
    improveReferenceUploadZone?.classList.toggle("is-filled", hasReference);
    improveReferenceUploadZone?.classList.toggle("is-reference-active", referenceStyleActive);
    improveAnalysisCard?.classList.toggle("is-reference-active", referenceStyleActive);

    if (improveImageInput) improveImageInput.toggleAttribute("disabled", isBusy);
    if (improveReferenceInput) improveReferenceInput.toggleAttribute("disabled", isBusy);
    if (improvePrompt) improvePrompt.toggleAttribute("disabled", isBusy);
    if (improveVariantsCount) improveVariantsCount.toggleAttribute("disabled", isBusy);

    improveModeButtons.forEach((button) => {
      button.toggleAttribute("disabled", isBusy);
    });

    improvePrimaryUploadZone?.classList.toggle("is-disabled", isBusy);
    improveReferenceUploadZone?.classList.toggle("is-disabled", isBusy);
    improvePrimaryUploadZone?.setAttribute("aria-disabled", isBusy ? "true" : "false");
    improveReferenceUploadZone?.setAttribute("aria-disabled", isBusy ? "true" : "false");

    if (improveReferenceNote) {
      if (improveMode === "reference" && !hasReference) {
        improveReferenceNote.textContent = "Для режима «в стиле референса» загрузите референс.";
      } else if (improveMode === "reference" && hasReference) {
        improveReferenceNote.textContent = "Референс загружен. Стиль будет учтен при улучшении.";
      } else {
        improveReferenceNote.textContent = "Можно пропустить, если выбран обычный AI режим.";
      }
    }

    if (improveReferenceState) {
      improveReferenceState.classList.remove("is-active", "is-ready", "is-empty");
      if (referenceStyleActive) {
        improveReferenceState.textContent = "Активен reference style: AI ориентируется на стиль референса.";
        improveReferenceState.classList.add("is-active");
      } else if (hasReference) {
        improveReferenceState.textContent = "Референс загружен. Включите режим «В стиле референса», чтобы применить стиль.";
        improveReferenceState.classList.add("is-ready");
      } else {
        improveReferenceState.textContent = "Референс не загружен. Используется стандартное AI-улучшение.";
        improveReferenceState.classList.add("is-empty");
      }
    }

    if (improveAnalysisContext && analysisIsStale) {
      improveAnalysisContext.textContent = referenceStyleActive
        ? "Режим изменился: перед генерацией анализ будет обновлен под reference style."
        : hasReference
          ? "Режим изменился: сейчас используется стандартный AI-режим, без прямой стилизации по референсу."
          : "Режим: стандартное AI-улучшение.";
    }

    if (improveCtaHint) {
      if (improveIsGenerating) {
        improveCtaHint.textContent = "Улучшение карточки в процессе...";
      } else if (validationError) {
        improveCtaHint.textContent = validationError;
      } else if (analysisIsStale) {
        improveCtaHint.textContent = "Данные изменились. Анализ будет обновлен перед запуском улучшения.";
      } else if (improveAnalysisPhase === "success") {
        improveCtaHint.textContent = referenceStyleActive
          ? "Анализ готов с учетом референса. Можно запускать улучшение."
          : "Анализ готов. Можно запускать улучшение.";
      } else {
        improveCtaHint.textContent = "Загрузите исходную карточку, чтобы начать.";
      }
    }

    syncImproveAnalysisState();
  };

  mobileMenuBtn?.addEventListener("click", openMobileMenu);
  mobileMenuClose?.addEventListener("click", closeMobileMenu);
  mobileMenuLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

  mobileMenu?.addEventListener("click", (event) => {
    if (event.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  authTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileMenu();

      if (activeUser) {
        navigateToAppMode(activeMode);
        return;
      }

      openAuthModal();
    });
  });

  authCloseBtn?.addEventListener("click", closeAuthModal);
  authSection?.addEventListener("click", (event) => {
    if (event.target === authSection) {
      closeAuthModal();
    }
  });

  workspaceModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navigateToAppMode(button.dataset.appModeBtn || "create");
    });
  });

  createPromptModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (isCreateControlsLocked()) {
        setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
        return;
      }
      cancelPendingCreateRequests();
      syncCreatePromptMode(button.dataset.promptMode || "ai");
      setDoneState(createDoneBadge, false);
      syncCreateFormState();
    });
  });

  createInsightRunBtn?.addEventListener("click", () => {
    runCreateInsightAnalysis({ source: "manual" });
  });

  createAiPromptGenerateBtn?.addEventListener("click", () => {
    runCreateAiPromptAssist();
  });

  createAiPromptRegenerateBtn?.addEventListener("click", () => {
    runCreateAiPromptAssist();
  });

  createAiPromptAcceptBtn?.addEventListener("click", () => {
    const acceptedPrompt = (createAiPromptOutput?.value || "").trim();
    if (acceptedPrompt.length < CREATE_AI_PROMPT_MIN_ACCEPT_LEN) {
      createAiPromptPhase = "error";
      setStatusMessage(createAiPromptStatus, "Prompt слишком короткий. Добавьте больше деталей.", "error");
      syncCreateFormState();
      return;
    }

    if (createCustomPrompt) {
      createCustomPrompt.value = acceptedPrompt;
    }
    syncCreatePromptMode("custom");
    createAiPromptPhase = "success";
    setDoneState(createDoneBadge, false);
    setStatusMessage(
      createAiPromptStatus,
      "Prompt принят. При необходимости отредактируйте его в поле «Свой prompt».",
      "success"
    );
    setRequestMeta(createMeta, "Статус запроса:", "AI prompt принят");
    syncCreateFormState();
    createCustomPrompt?.focus();
  });

  createAiPromptOutput?.addEventListener("input", () => {
    if (createAiPromptPhase === "loading") return;
    const promptText = (createAiPromptOutput.value || "").trim();
    createAiPromptPhase = promptText ? "success" : "empty";
    if (promptText) {
      setStatusMessage(createAiPromptStatus, "Prompt обновлен. Можно принять или сгенерировать заново.", "success");
    }
    setDoneState(createDoneBadge, false);
    syncCreateFormState();
  });

  createResultsGrid?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const detailsButton = target.closest("[data-result-details-id]");
    if (!(detailsButton instanceof HTMLElement)) return;

    const resultId = detailsButton.dataset.resultDetailsId || "";
    if (!resultId) return;

    createResultExpandedId = createResultExpandedId === resultId ? "" : resultId;
    renderCreateResults();
  });

  createImagesInput?.addEventListener("change", () => {
    addCreateFiles(createImagesInput.files);
    createImagesInput.value = "";
  });

  createImagesList?.addEventListener("click", (event) => {
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const removeButton = target.closest("[data-remove-image-index]");
    if (!(removeButton instanceof HTMLElement)) return;

    const index = Number(removeButton.dataset.removeImageIndex);
    if (!Number.isInteger(index) || index < 0 || index >= createSelectedFiles.length) return;

    cancelPendingCreateRequests();
    const [removedFile] = createSelectedFiles.splice(index, 1);
    if (removedFile) revokeCreateFilePreviewUrl(removedFile);

    resetCreateTransientErrorState();

    setDoneState(createDoneBadge, false);
    renderCreateFiles();
    syncCreateFormState();
  });

  createUploadZone?.addEventListener("dragenter", (event) => {
    event.preventDefault();
    if (isCreateControlsLocked()) return;
    createUploadDragDepth += 1;
    createUploadZone.classList.add("is-dragover");
  });

  createUploadZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (isCreateControlsLocked()) return;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  });

  createUploadZone?.addEventListener("dragleave", () => {
    if (isCreateControlsLocked()) return;
    createUploadDragDepth = Math.max(0, createUploadDragDepth - 1);
    if (createUploadDragDepth === 0) {
      createUploadZone.classList.remove("is-dragover");
    }
  });

  createUploadZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    createUploadDragDepth = 0;
    createUploadZone.classList.remove("is-dragover");
    if (isCreateControlsLocked()) return;
    addCreateFiles(event.dataTransfer?.files);
  });

  window.addEventListener("dragend", () => {
    createUploadDragDepth = 0;
    createUploadZone?.classList.remove("is-dragover");
  });

  window.addEventListener("drop", () => {
    createUploadDragDepth = 0;
    createUploadZone?.classList.remove("is-dragover");
  });

  const handleCreateInputMutation = () => {
    const cancelled = cancelPendingCreateRequests();
    resetCreateTransientErrorState();
    if (cancelled) {
      setStatusMessage(createStatus, "Входные данные обновлены. Предыдущий AI-запрос отменён.", "");
    }
    setDoneState(createDoneBadge, false);
    syncCreateFormState();
  };

  [createDescription, createHighlights, createCustomPrompt, createMarketplace, createCardsCount].forEach((field) => {
    field?.addEventListener("input", handleCreateInputMutation);
    field?.addEventListener("change", handleCreateInputMutation);
  });

  createGenerateBtn?.addEventListener("click", async () => {
    const validationError = getCreateValidationError();
    if (validationError) {
      setStatusMessage(createStatus, validationError, "error");
      syncCreateFormState();
      return;
    }

    const requestId = ++createGenerationRequestId;
    createIsGenerating = true;
    createGeneratedResults = [];
    createResultExpandedId = "";
    setCreateResultsProcessing(true);
    setDoneState(createDoneBadge, false);
    setStatusMessage(createStatus, "Генерируем карточки и подготавливаем results...", "");
    setRequestMeta(createMeta, "Статус запроса:", "Генерация карточек: подготовка");
    if (createResultsCaption) {
      createResultsCaption.textContent = "AI подготавливает варианты карточек...";
    }
    if (createResultsGrid) {
      createResultsGrid.textContent = "";
    }
    syncCreateFormState();

    try {
      const insightNeedsRefresh = !createInsightData || createInsightFingerprint !== getCreateInsightFingerprint();
      if (insightNeedsRefresh) {
        const insightReady = await runCreateInsightAnalysis({ source: "generation" });
        if (!insightReady) {
          throw new Error("Не удалось получить AI insight для генерации карточек.");
        }
      }

      const payload = await buildCreateGenerationPayload();
      const results = await requestCreateGeneration(payload);
      if (requestId !== createGenerationRequestId) return;

      createGeneratedResults = Array.isArray(results) ? results : [];
      setCreateResultsProcessing(false);
      renderCreateResults();

      if (!createGeneratedResults.length) {
        throw new Error("Генерация вернула пустой результат.");
      }

      const total = createGeneratedResults.length;
      setDoneState(createDoneBadge, true);
      setStatusMessage(createStatus, "Готово. Сгенерировано " + String(total) + " " + formatCardsWord(total) + ".", "success");
      setRequestMeta(createMeta, "Статус запроса:", "Готово: " + String(total) + " " + formatCardsWord(total));

      const marketplace = createMarketplace?.value || "Marketplace";
      const historyPayload = await buildCreateHistoryPayload(payload, createGeneratedResults);
      pushHistory({
        mode: "create",
        title: String(total) + " " + formatCardsWord(total) + " • " + marketplace,
        summary: historyPayload.summary,
        prompt: historyPayload.prompt,
        resultsCount: total,
        previewUrl: historyPayload.previewUrl,
        resultPreviews: historyPayload.resultPreviews,
        input: historyPayload.input,
        uploads: historyPayload.uploads,
        ai: historyPayload.ai,
        results: historyPayload.results,
        meta: {
          marketplace,
          promptMode: createPromptMode,
        },
      });

      createResultsSection?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    } catch (error) {
      if (requestId !== createGenerationRequestId) return;
      createGeneratedResults = [];
      setCreateResultsProcessing(false);
      renderCreateResults();
      setDoneState(createDoneBadge, false);
      const message = error instanceof Error ? error.message : "Ошибка генерации карточек. Повторите попытку.";
      setStatusMessage(createStatus, message, "error");
      setRequestMeta(createMeta, "Статус запроса:", "Ошибка генерации карточек");
    } finally {
      if (requestId === createGenerationRequestId) {
        createIsGenerating = false;
        syncCreateFormState();
      }
    }
  });

  const handleImproveInputMutation = () => {
    const cancelled = cancelPendingImproveAnalysis();
    clearImproveResultsData();
    resetImproveAnalysisAfterInputChange();
    if (cancelled) {
      setStatusMessage(improveStatus, "Входные данные обновлены. Предыдущий AI-анализ отменён.", "");
    }
    setDoneState(improveDoneBadge, false);
    syncImproveFormState();
  };

  const handleImproveSourceSelection = async (fileList) => {
    if (isImproveControlsLocked()) {
      setStatusMessage(improveStatus, "Дождитесь завершения текущего AI-запроса.", "");
      syncImproveFormState();
      return;
    }

    const file = fileList?.[0];
    if (!file) return;

    try {
      await applyImproveSourceFile(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось загрузить исходную карточку.";
      setStatusMessage(improveStatus, message, "error");
      syncImproveFormState();
    } finally {
      if (improveImageInput) {
        improveImageInput.value = "";
      }
    }
  };

  const handleImproveReferenceSelection = async (fileList) => {
    if (isImproveControlsLocked()) {
      setStatusMessage(improveStatus, "Дождитесь завершения текущего AI-запроса.", "");
      syncImproveFormState();
      return;
    }

    const file = fileList?.[0];
    if (!file) return;

    try {
      await applyImproveReferenceFile(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось загрузить референс.";
      setStatusMessage(improveStatus, message, "error");
      syncImproveFormState();
    } finally {
      if (improveReferenceInput) {
        improveReferenceInput.value = "";
      }
    }
  };

  improveImageInput?.addEventListener("change", () => {
    handleImproveSourceSelection(improveImageInput.files);
  });

  improveReferenceInput?.addEventListener("change", () => {
    handleImproveReferenceSelection(improveReferenceInput.files);
  });

  improvePrimaryUploadZone?.addEventListener("dragenter", (event) => {
    event.preventDefault();
    if (isImproveControlsLocked()) return;
    improvePrimaryDragDepth += 1;
    improvePrimaryUploadZone.classList.add("is-dragover");
  });

  improvePrimaryUploadZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (isImproveControlsLocked()) return;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  });

  improvePrimaryUploadZone?.addEventListener("dragleave", () => {
    if (isImproveControlsLocked()) return;
    improvePrimaryDragDepth = Math.max(0, improvePrimaryDragDepth - 1);
    if (improvePrimaryDragDepth === 0) {
      improvePrimaryUploadZone.classList.remove("is-dragover");
    }
  });

  improvePrimaryUploadZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    improvePrimaryDragDepth = 0;
    improvePrimaryUploadZone.classList.remove("is-dragover");
    if (isImproveControlsLocked()) return;
    handleImproveSourceSelection(event.dataTransfer?.files);
  });

  improveReferenceUploadZone?.addEventListener("dragenter", (event) => {
    event.preventDefault();
    if (isImproveControlsLocked()) return;
    improveReferenceDragDepth += 1;
    improveReferenceUploadZone.classList.add("is-dragover");
  });

  improveReferenceUploadZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (isImproveControlsLocked()) return;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  });

  improveReferenceUploadZone?.addEventListener("dragleave", () => {
    if (isImproveControlsLocked()) return;
    improveReferenceDragDepth = Math.max(0, improveReferenceDragDepth - 1);
    if (improveReferenceDragDepth === 0) {
      improveReferenceUploadZone.classList.remove("is-dragover");
    }
  });

  improveReferenceUploadZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    improveReferenceDragDepth = 0;
    improveReferenceUploadZone.classList.remove("is-dragover");
    if (isImproveControlsLocked()) return;
    handleImproveReferenceSelection(event.dataTransfer?.files);
  });

  window.addEventListener("dragend", () => {
    improvePrimaryDragDepth = 0;
    improveReferenceDragDepth = 0;
    improvePrimaryUploadZone?.classList.remove("is-dragover");
    improveReferenceUploadZone?.classList.remove("is-dragover");
  });

  window.addEventListener("drop", () => {
    improvePrimaryDragDepth = 0;
    improveReferenceDragDepth = 0;
    improvePrimaryUploadZone?.classList.remove("is-dragover");
    improveReferenceUploadZone?.classList.remove("is-dragover");
  });

  improveModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.improveMode || "ai";
      if (nextMode === improveMode) return;
      syncImproveMode(nextMode);
      handleImproveInputMutation();

      const canAutoAnalyze =
        hasImproveSourceInput() &&
        (nextMode !== "reference" || Boolean(improveReferenceFile || improveReferencePreviewUrl)) &&
        !improveIsGenerating;
      if (canAutoAnalyze) {
        void runImproveAnalysis({ source: "auto" });
      }
    });
  });

  [improvePrompt, improveVariantsCount].forEach((field) => {
    field?.addEventListener("input", handleImproveInputMutation);
    field?.addEventListener("change", handleImproveInputMutation);
  });

  improveAnalyzeBtn?.addEventListener("click", () => {
    runImproveAnalysis({ source: "manual" });
  });

  improveResultsGrid?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const detailsButton = target.closest("[data-improve-result-details-id]");
    if (!(detailsButton instanceof HTMLElement)) return;

    const resultId = detailsButton.dataset.improveResultDetailsId || "";
    if (!resultId) return;

    improveResultExpandedId = improveResultExpandedId === resultId ? "" : resultId;
    renderImproveResults();
  });

  improveRunBtn?.addEventListener("click", async () => {
    const validationError = getImproveValidationError();
    if (validationError) {
      setStatusMessage(improveStatus, validationError, "error");
      syncImproveFormState();
      return;
    }

    const { referenceStyleActive } = getImproveReferenceUiState();
    const requestId = ++improveGenerationRequestId;
    improveIsGenerating = true;
    improveGeneratedResults = [];
    improveResultExpandedId = "";
    setImproveResultsProcessing(true);
    setDoneState(improveDoneBadge, false);
    setStatusMessage(
      improveStatus,
      referenceStyleActive
        ? "AI улучшает карточку в стиле референса и готовит варианты..."
        : "AI улучшает карточку и готовит варианты...",
      ""
    );
    setRequestMeta(
      improveMeta,
      "Статус запроса:",
      referenceStyleActive ? "Улучшение карточки: reference style" : "Улучшение карточки: подготовка"
    );
    if (improveResultsCaption) {
      improveResultsCaption.textContent = referenceStyleActive
        ? "AI улучшает карточку по стилю референса и подготавливает варианты..."
        : "AI улучшает карточку и подготавливает варианты...";
    }
    if (improveResultsGrid) {
      improveResultsGrid.textContent = "";
    }
    syncImproveFormState();

    try {
      const analysisNeedsRefresh = !improveAnalysisData || improveAnalysisFingerprint !== getImproveAnalysisFingerprint();
      if (analysisNeedsRefresh) {
        const analysisReady = await runImproveAnalysis({ source: "generation" });
        if (!analysisReady) {
          throw new Error("Не удалось получить AI анализ для улучшения карточки.");
        }
      }

      const payload = buildImproveGenerationPayload();
      const results = await requestImproveGeneration(payload);
      if (requestId !== improveGenerationRequestId) return;

      improveGeneratedResults = Array.isArray(results) ? results : [];
      setImproveResultsProcessing(false);
      renderImproveResults();

      if (!improveGeneratedResults.length) {
        throw new Error("Улучшение вернуло пустой результат.");
      }

      const total = improveGeneratedResults.length;
      setDoneState(improveDoneBadge, true);
      setStatusMessage(improveStatus, "Готово. Подготовлено " + String(total) + " " + formatCardsWord(total) + ".", "success");
      setRequestMeta(improveMeta, "Статус запроса:", "Готово: " + String(total) + " " + formatCardsWord(total));

      const historyPayload = buildImproveHistoryPayload(payload, improveGeneratedResults);
      pushHistory({
        mode: "improve",
        title: String(total) + " " + formatCardsWord(total) + " • Улучшение",
        summary: historyPayload.summary,
        prompt: historyPayload.prompt,
        resultsCount: total,
        previewUrl: historyPayload.previewUrl,
        resultPreviews: historyPayload.resultPreviews,
        input: historyPayload.input,
        uploads: historyPayload.uploads,
        ai: historyPayload.ai,
        results: historyPayload.results,
        meta: {
          improveMode,
          referenceStyle: referenceStyleActive,
        },
      });

      improveResultsSection?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    } catch (error) {
      if (requestId !== improveGenerationRequestId) return;
      improveGeneratedResults = [];
      setImproveResultsProcessing(false);
      renderImproveResults();
      setDoneState(improveDoneBadge, false);
      const message = error instanceof Error ? error.message : "Ошибка улучшения карточки. Повторите попытку.";
      setStatusMessage(improveStatus, message, "error");
      setRequestMeta(improveMeta, "Статус запроса:", "Ошибка улучшения карточки");
    } finally {
      if (requestId === improveGenerationRequestId) {
        improveIsGenerating = false;
        syncImproveFormState();
      }
    }
  });
  const openHistoryEntry = (entryId, options) => {
    const selected = getHistoryEntryById(entryId);
    if (!selected) return;
    selectedHistoryEntryId = selected.id;
    historyDetailsVisible = true;
    if (options?.navigate) {
      navigateToAppMode("history");
    }
    renderHistoryModeList();
    renderHistoryDetails();
  };

  historyList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const actionButton = target.closest("[data-history-open-id]");
    if (!(actionButton instanceof HTMLElement)) return;
    const entryId = actionButton.dataset.historyOpenId || "";
    openHistoryEntry(entryId, { navigate: true });
  });

  historyModeList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const actionButton = target.closest("[data-history-open-id]");
    if (!(actionButton instanceof HTMLElement)) return;
    const entryId = actionButton.dataset.historyOpenId || "";
    openHistoryEntry(entryId);
  });

  historyModeDetailsCloseBtn?.addEventListener("click", () => {
    closeHistoryDetailsModal();
  });

  historyModeDetailsBackdrop?.addEventListener("click", () => {
    closeHistoryDetailsModal();
  });

  historyReuseBtn?.addEventListener("click", async () => {
    if (historyReuseInProgress) return;
    const entryId = historyReuseBtn.dataset.historyReuseId || selectedHistoryEntryId;
    const entry = getHistoryEntryById(entryId);
    if (!entry) return;
    await applyHistoryEntryAsBase(entry);
  });

  historyClearBtn?.addEventListener("click", clearHistory);
  historyModeClearBtn?.addEventListener("click", clearHistory);

  syncCreatePromptMode("ai");
  renderCreateFiles();
  renderCreateResults();
  setRequestMeta(createMeta, "Статус запроса:", "Ожидание данных");
  syncCreateFormState();

  syncImproveMode("ai");
  renderImproveAnalysisValues(null);
  renderImproveResults();
  setRequestMeta(improveMeta, "Статус запроса:", "Ожидание исходной карточки");
  syncImproveFormState();

  void refreshHistory();
  window.addEventListener("hashchange", handleAppHashRoute);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeHistoryDetailsModal();
      closeMobileMenu();
      closeAuthModal();
    }
  });

  const firebaseConfig = {
    apiKey: "AIzaSyCOYK5xZ0fKwQSX64FgsCNGEepJV1xLY8o",
    authDomain: "kartochka1-a5f1b.firebaseapp.com",
    projectId: "kartochka1-a5f1b",
    storageBucket: "kartochka1-a5f1b.firebasestorage.app",
    messagingSenderId: "509819260153",
    appId: "1:509819260153:web:5ef8a90b9b24dc81aca628",
  };

  const hasFirebaseSdk = typeof window !== "undefined" && typeof window.firebase !== "undefined";
  const firebaseApp = hasFirebaseSdk
    ? window.firebase.apps.length
      ? window.firebase.app()
      : window.firebase.initializeApp(firebaseConfig)
    : null;

  const auth = firebaseApp ? window.firebase.auth() : null;
  const db = firebaseApp ? window.firebase.firestore() : null;
  const googleProvider = auth ? new window.firebase.auth.GoogleAuthProvider() : null;

  if (auth) {
    auth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
  }

  const mapAuthError = (error) => {
    const code = String(error?.code || "");
    if (code === "auth/popup-closed-by-user") return "Вход через Google отменен";
    if (code === "auth/popup-blocked") return "Браузер заблокировал окно входа";
    if (code === "auth/network-request-failed") return "Ошибка сети. Проверьте подключение";
    if (code === "auth/unauthorized-domain") return "Домен не добавлен в Firebase Authorized domains";
    if (code === "permission-denied") return "Firestore запрещает запись. Проверьте правила доступа";
    return error instanceof Error ? error.message : "Ошибка авторизации";
  };

  const syncCabinetButton = (user) => {
    if (!cabinetBtn) return;

    cabinetBtn.textContent = "Личный кабинет";

    if (!user) {
      cabinetBtn.removeAttribute("title");
      return;
    }

    const label = user.displayName || user.email || "Личный кабинет";
    cabinetBtn.setAttribute("title", label);
  };

  const persistUserProfile = async (user) => {
    if (!db || !user) return;

    await db
      .collection("users")
      .doc(user.uid)
      .set(
        {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          providers: (user.providerData || []).map((entry) => entry?.providerId).filter(Boolean),
          lastLoginAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  };

  if (!hasFirebaseSdk) {
    setAuthMessage("Firebase SDK не загружен", "error");
  }

  googleAuthBtn?.addEventListener("click", async () => {
    if (!auth || !googleProvider) {
      setAuthMessage("Google Auth недоступен: Firebase не подключен", "error");
      return;
    }

    googleAuthBtn.setAttribute("disabled", "disabled");
    setAuthMessage("Открываем Google-авторизацию...", "");

    try {
      const result = await auth.signInWithPopup(googleProvider);
      activeUser = result.user;
      await persistUserProfile(result.user);
      syncCabinetButton(result.user);
      setAuthMessage("Вход через Google выполнен", "success");
      closeAuthModal();
      navigateToAppMode("create", { replace: true });
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      googleAuthBtn.removeAttribute("disabled");
    }
  });

  appSignOutBtn?.addEventListener("click", async () => {
    if (!activeUser) {
      closeWorkspaceView();
      if (parseAppModeFromHash()) {
        replaceHash("#top");
      }
      return;
    }

    if (!auth) {
      activeUser = null;
      syncCabinetButton(null);
      syncWorkspaceUser(null);
      void refreshHistory();
      closeWorkspaceView();
      if (parseAppModeFromHash()) {
        replaceHash("#top");
      }
      return;
    }

    appSignOutBtn.setAttribute("disabled", "disabled");

    try {
      await auth.signOut();
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      appSignOutBtn.removeAttribute("disabled");
      if (parseAppModeFromHash()) {
        replaceHash("#top");
      }
    }
  });

  if (auth) {
    auth.onAuthStateChanged(async (user) => {
      activeUser = user || null;
      syncCabinetButton(user);
      syncWorkspaceUser(user);
      await refreshHistory();

      if (!user) {
        if (parseAppModeFromHash()) {
          handleAppHashRoute();
        } else {
          closeWorkspaceView();
        }
        return;
      }
      if (parseAppModeFromHash()) {
        handleAppHashRoute();
      } else {
        navigateToAppMode(activeMode, { replace: true });
      }

      try {
        await persistUserProfile(user);
      } catch (error) {
        setAuthMessage(mapAuthError(error), "error");
      }
    });
  } else {
    syncCabinetButton(null);
    syncWorkspaceUser(null);
    void refreshHistory();
    if (parseAppModeFromHash()) {
      handleAppHashRoute();
    } else {
      closeWorkspaceView();
    }
  }

  const quickStartSection = document.getElementById("start");
  const pricingIntroSection = document.querySelector(".pricing-intro");
  const pricingSection = document.getElementById("pricing");
  const pricingAnchor = pricingIntroSection || pricingSection;
  const pricingParent = pricingAnchor?.parentNode;

  if (quickStartSection && pricingAnchor && pricingParent) {
    pricingParent.insertBefore(quickStartSection, pricingAnchor);
  }

  const revealNodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  const statsSection = document.querySelector(".kartochka-stats-section");
  if (statsSection) {
    const statsNumber = statsSection.querySelector(".kartochka-stats-number");
    const formatNumber = (value) => new Intl.NumberFormat("ru-RU").format(value).replace(/\u00A0/g, "\u00A0\u00A0");

    const revealStats = () => {
      statsSection.classList.add("kartochka-stats-section-visible");
      if (!statsNumber || statsNumber.dataset.kartochkaStatsAnimated === "true") {
        return;
      }

      statsNumber.dataset.kartochkaStatsAnimated = "true";
      const targetValue = Number(statsNumber.dataset.kartochkaStatsTarget || "16348");

      if (prefersReducedMotion) {
        statsNumber.textContent = formatNumber(targetValue);
        return;
      }

      const duration = 1500;
      const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const nextValue = Math.round(targetValue * easeOut(progress));
        statsNumber.textContent = formatNumber(nextValue);

        if (progress < 1) {
          requestAnimationFrame(tick);
          return;
        }

        statsNumber.textContent = formatNumber(targetValue);
      };

      requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealStats();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
      );
      statsObserver.observe(statsSection);
    } else {
      revealStats();
    }
  }

  const metricFills = Array.from(document.querySelectorAll(".kartochka-metric-bar-fill"));
  const animateMetricBars = () => {
    metricFills.forEach((fill) => {
      const progress = Math.max(0, Math.min(100, Number(fill.dataset.progress || 0)));
      fill.style.transform = "scaleX(" + progress / 100 + ")";
    });
  };

  if (metricFills.length) {
    requestAnimationFrame(() => {
      requestAnimationFrame(animateMetricBars);
    });
  }

  const topbar = document.querySelector(".topbar");
  if (topbar) {
    let lastScrollY = window.scrollY;

    const syncTopbarVisibility = () => {
      if (document.body.classList.contains("workspace-active") || document.body.classList.contains("menu-open")) {
        topbar.classList.remove("topbar-hidden");
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const shouldHide = scrollingDown && currentScrollY > 110;

      if (prefersReducedMotion) {
        topbar.classList.toggle("topbar-hidden", shouldHide);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= 24 || currentScrollY < lastScrollY) {
        topbar.classList.remove("topbar-hidden");
      } else if (shouldHide) {
        topbar.classList.add("topbar-hidden");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", syncTopbarVisibility, { passive: true });
    window.addEventListener("resize", syncTopbarVisibility, { passive: true });
    syncTopbarVisibility();
  }
})();



