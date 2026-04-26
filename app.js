(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersTouchUi = window.matchMedia("(pointer: coarse)").matches;

  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuLinks = document.querySelectorAll("[data-close-mobile-menu]");

  const publicView = document.getElementById("publicView");
  const workspace = document.getElementById("workspace");
  const workspaceUserName = document.getElementById("workspaceUserName");
  const workspaceUserCaption = document.getElementById("workspaceUserCaption");
  const workspaceUserAvatar = document.getElementById("workspaceUserAvatar");
  const billingOpenBtn = document.getElementById("billingOpenBtn");
  const billingBalanceValue = document.getElementById("billingBalanceValue");
  const billingBalanceLabel = document.getElementById("billingBalanceLabel");
  const billingPlanLabel = document.getElementById("billingPlanLabel");
  const billingModal = document.getElementById("billingModal");
  const billingModalClose = document.getElementById("billingModalClose");
  const billingModalBackdrop = billingModal?.querySelector("[data-billing-close]") || null;
  const billingSummaryTokens = document.getElementById("billingSummaryTokens");
  const billingSummaryNote = document.getElementById("billingSummaryNote");
  const billingSummaryPlan = document.getElementById("billingSummaryPlan");
  const billingSummaryGranted = document.getElementById("billingSummaryGranted");
  const billingSummarySpent = document.getElementById("billingSummarySpent");
  const billingPromoInput = document.getElementById("billingPromoInput");
  const billingPromoBtn = document.getElementById("billingPromoBtn");
  const billingPromoStatus = document.getElementById("billingPromoStatus");
  const billingPlans = document.getElementById("billingPlans");
  const billingPackages = document.getElementById("billingPackages");
  const billingActionCosts = document.getElementById("billingActionCosts");
  const billingLedger = document.getElementById("billingLedger");

  const authSection = document.getElementById("authSection");
  const authCloseBtn = document.getElementById("authCloseBtn");
  const googleAuthBtn = document.getElementById("googleAuthBtn");
  const authEmailLoginTab = document.getElementById("authEmailLoginTab");
  const authEmailRegisterTab = document.getElementById("authEmailRegisterTab");
  const authEmailLoginPanel = document.getElementById("authEmailLoginPanel");
  const authEmailRegisterPanel = document.getElementById("authEmailRegisterPanel");
  const authLoginEmailInput = document.getElementById("authLoginEmail");
  const authLoginPasswordInput = document.getElementById("authLoginPassword");
  const authRegisterEmailInput = document.getElementById("authRegisterEmail");
  const authRegisterPasswordInput = document.getElementById("authRegisterPassword");
  const authRegisterPasswordConfirmInput = document.getElementById("authRegisterPasswordConfirm");
  const emailLoginBtn = document.getElementById("emailLoginBtn");
  const emailRegisterBtn = document.getElementById("emailRegisterBtn");
  const authMessage = document.getElementById("authMessage");
  const authTriggers = document.querySelectorAll("[data-open-auth]");
  const cabinetBtn = document.querySelector(".topbar-actions [data-open-auth]");
  const workspaceAppBrand = document.querySelector(".workspace-app-brand");

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
  const createAiPromptEditor = document.getElementById("createAiPromptEditor");
  const createInsightCard = document.getElementById("createInsightCard");
  const createInsightRunBtn = document.getElementById("createInsightRunBtn");
  const createInsightStatus = document.getElementById("createInsightStatus");
  const createInsightCategory = document.getElementById("createInsightCategory");
  const createInsightStyle = document.getElementById("createInsightStyle");
  const createInsightAccent = document.getElementById("createInsightAccent");
  const createInsightFormat = document.getElementById("createInsightFormat");
  const createInsightDetails = document.getElementById("createInsightDetails");
  const createInsightSummaryBadge = document.getElementById("createInsightSummaryBadge");
  const createPromptAssistDetails = document.getElementById("createPromptAssistDetails");
  const createPromptAssistSummaryBadge = document.getElementById("createPromptAssistSummaryBadge");
  const createAdvancedDetails = document.getElementById("createAdvancedDetails");
  const createCustomPromptSummaryBadge = document.getElementById("createCustomPromptSummaryBadge");
  const createCustomPromptHelper = document.getElementById("createCustomPromptHelper");
  const createMarketplace = document.getElementById("createMarketplace");
  const createCardsCount = document.getElementById("createCardsCount");
  const createGenerateBtn = document.getElementById("createGenerateBtn");
  const createCtaHint = document.getElementById("createCtaHint");
  const createStatus = document.getElementById("createStatus");
  const createDoneBadge = document.getElementById("createDoneBadge");
  const createFlowSteps = {
    photo: document.querySelector('[data-create-flow-step="photo"]'),
    template: document.querySelector('[data-create-flow-step="template"]'),
    content: document.querySelector('[data-create-flow-step="content"]'),
    generate: document.querySelector('[data-create-flow-step="generate"]'),
  };
  const createMeta = document.getElementById("createMeta");
  const createResultsSection = document.getElementById("createResultsSection");
  const createResultsCaption = document.getElementById("createResultsCaption");
  const createResultsGrid = document.getElementById("createResultsGrid");
  const createSourcePreviewFrame = document.getElementById("createSourcePreviewFrame");
  const createSourcePreviewImage = document.getElementById("createSourcePreviewImage");
  const createSourcePreviewEmpty = document.getElementById("createSourcePreviewEmpty");
  const createEditImageBtn = document.getElementById("createEditImageBtn");
  const createImageManagerModal = document.getElementById("createImageManagerModal");
  const createImageManagerClose = document.getElementById("createImageManagerClose");
  const createImageManagerAddBtn = document.getElementById("createImageManagerAddBtn");
  const createImageManagerCounter = document.getElementById("createImageManagerCounter");
  const createTemplateSearchInput = document.getElementById("createTemplateSearchInput");
  const createTemplateTabButtons = Array.from(document.querySelectorAll("[data-create-template-tab]"));
  const createTemplateGrid = document.getElementById("createTemplateGrid");
  const createModeChoiceStrip = document.getElementById("createModeChoiceStrip");
  const createModeChoiceModal = document.getElementById("createModeChoiceModal");
  const createModeChoiceModalClose = document.getElementById("createModeChoiceModalClose");
  const createModeChoiceModalList = document.getElementById("createModeChoiceModalList");
  const createReferenceLibraryBtn = document.getElementById("createReferenceLibraryBtn");
  const createReferenceModal = document.getElementById("createReferenceModal");
  const createReferenceModalClose = document.getElementById("createReferenceModalClose");
  const createIsClothingToggle = document.getElementById("createIsClothingToggle");
  const createProductModeState = document.getElementById("createProductModeState");
  const createAngleSuggestionsLead = document.getElementById("createAngleSuggestionsLead");
  const createAngleSuggestions = document.getElementById("createAngleSuggestions");
  const createSelectedTemplateCard = document.getElementById("createSelectedTemplateCard");
  const createSelectedTemplateThumbImage = document.getElementById("createSelectedTemplateThumbImage");
  const createSelectedTemplateThumbPlaceholder = document.getElementById("createSelectedTemplateThumbPlaceholder");
  const createSelectedTemplateTitle = document.getElementById("createSelectedTemplateTitle");
  const createSelectedTemplateDescription = document.getElementById("createSelectedTemplateDescription");
  const createSelectedTemplateMeta = document.getElementById("createSelectedTemplateMeta");
  const createSelectedTemplateTags = document.getElementById("createSelectedTemplateTags");
  const createInstructionTemplatePanel = document.getElementById("createInstructionTemplatePanel");
  const createBestModelSelect = document.getElementById("createBestModelSelect");
  const createGenerationNotesToggle = document.getElementById("createGenerationNotesToggle");
  const createGenerationNotesPanel = document.getElementById("createGenerationNotesPanel");
  const createGenerationNotes = document.getElementById("createGenerationNotes");
  const createCustomPromptPanel = document.getElementById("createCustomPromptPanel");
  const createInstructionAttachBtn = document.getElementById("createInstructionAttachBtn");
  const createInstructionInput = document.getElementById("createInstructionInput");
  const createInstructionState = document.getElementById("createInstructionState");
  const createResultsProcessing = document.getElementById("createResultsProcessing");
  const createProcessingKicker = document.getElementById("createProcessingKicker");
  const createProcessingTitle = document.getElementById("createProcessingTitle");
  const createProcessingText = document.getElementById("createProcessingText");
  const createProcessingModePill = document.getElementById("createProcessingModePill");
  const createProcessingAnglePill = document.getElementById("createProcessingAnglePill");
  const createProcessingSteps = Array.from(document.querySelectorAll("[data-create-processing-step]"));
  const createProductCardTitle = document.getElementById("createProductCardTitle");
  const createProductTextFields = document.getElementById("createProductTextFields");
  const createTextReplacePanel = document.getElementById("createTextReplacePanel");
  const createTextReplaceList = document.getElementById("createTextReplaceList");
  const createTextReplaceAddBtn = document.getElementById("createTextReplaceAddBtn");
  const createProductTitle = document.getElementById("createProductTitle");
  const createProductShortDescription = document.getElementById("createProductShortDescription");
  const createProductThirdLevelText = document.getElementById("createProductThirdLevelText");
  const createAutofillBtn = document.getElementById("createAutofillBtn");
  const createCharacteristicPresets = document.getElementById("createCharacteristicPresets");
  const createCharacteristicsList = document.getElementById("createCharacteristicsList");
  const createCharacteristicsEmpty = document.getElementById("createCharacteristicsEmpty");
  const createAddCharacteristicBtn = document.getElementById("createAddCharacteristicBtn");
  const createPreviewCard = document.getElementById("createPreviewCard");
  const createPreviewStage = document.querySelector(".create-preview-stage");
  const createPreviewImage = document.getElementById("createPreviewImage");
  const createPreviewEmpty = document.getElementById("createPreviewEmpty");
  const createPreviewEmptyTitle = document.getElementById("createPreviewEmptyTitle");
  const createPreviewEmptyText = document.getElementById("createPreviewEmptyText");
  const createPreviewBadge = document.getElementById("createPreviewBadge");
  const createPreviewTitle = document.getElementById("createPreviewTitle");
  const createPreviewMeta = document.getElementById("createPreviewMeta");
  const createImproveBtn = document.getElementById("createImproveBtn");
  const createExportBtn = document.getElementById("createExportBtn");
  const createProductRoutingSummary = document.getElementById("createProductRoutingSummary");
  const createSettingAccentColor = document.getElementById("createSettingAccentColor");
  const createSettingReferenceStrength = document.getElementById("createSettingReferenceStrength");
  const createSettingVisualStyle = document.getElementById("createSettingVisualStyle");
  const createSettingInfoDensity = document.getElementById("createSettingInfoDensity");
  const createSettingReadabilityPriority = document.getElementById("createSettingReadabilityPriority");
  const createSettingConversionPriority = document.getElementById("createSettingConversionPriority");
  const createSettingAccentFormat = document.getElementById("createSettingAccentFormat");
  const createSettingBackgroundMode = document.getElementById("createSettingBackgroundMode");
  const createSettingPreserveLayout = document.getElementById("createSettingPreserveLayout");

  const improveImageInput = document.getElementById("improveImageInput");
  const improvePrimaryUploadZone = document.getElementById("improvePrimaryUploadZone");
  const improveSelectedPreview = document.getElementById("improveSelectedPreview");
  const improveSelectedImage = document.getElementById("improveSelectedImage");
  const improveReferenceInput = document.getElementById("improveReferenceInput");
  const improveReferenceUploadZone = document.getElementById("improveReferenceUploadZone");
  const improveReferencePreview = document.getElementById("improveReferencePreview");
  const improveReferenceImage = document.getElementById("improveReferenceImage");
  const improveReferencePanel = document.getElementById("improveReferencePanel");
  const improveReferenceNote = document.getElementById("improveReferenceNote");
  const improveReferenceState = document.getElementById("improveReferenceState");
  const improvePrompt = document.getElementById("improvePrompt");
  const improveModeButtons = Array.from(document.querySelectorAll("[data-improve-mode]"));
  const improveModeSummary = document.getElementById("improveModeSummary");
  const improveModeBadge = document.getElementById("improveModeBadge");
  const improveModeSignal = document.getElementById("improveModeSignal");
  const improveReferenceSignal = document.getElementById("improveReferenceSignal");
  const improveVariantsSignal = document.getElementById("improveVariantsSignal");
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
  const enhanceCardPrompt = document.getElementById("enhanceCardPrompt");

  const fourCardsImageInput = document.getElementById("fourCardsImageInput");
  const fourCardsUploadZone = document.getElementById("fourCardsUploadZone");
  const fourCardsSelectedPreview = document.getElementById("fourCardsSelectedPreview");
  const fourCardsSelectedImage = document.getElementById("fourCardsSelectedImage");
  const fourCardsUploadEmpty = document.getElementById("fourCardsUploadEmpty");
  const fourCardsGenerateBtn = document.getElementById("fourCardsGenerateBtn");
  const fourCardsRegenerateBtn = document.getElementById("fourCardsRegenerateBtn");
  const fourCardsStatus = document.getElementById("fourCardsStatus");
  const fourCardsMeta = document.getElementById("fourCardsMeta");
  const fourCardsResultsSection = document.getElementById("fourCardsResultsSection");
  const fourCardsResultsCaption = document.getElementById("fourCardsResultsCaption");
  const fourCardsProcessing = document.getElementById("fourCardsProcessing");
  const fourCardsCompositeSection = document.getElementById("fourCardsCompositeSection");
  const fourCardsCompositeImage = document.getElementById("fourCardsCompositeImage");
  const fourCardsCompositeDownload = document.getElementById("fourCardsCompositeDownload");
  const fourCardsGridSection = document.getElementById("fourCardsGridSection");
  const fourCardsGrid = document.getElementById("fourCardsGrid");
  const fourCardsDownloadAllBtn = document.getElementById("fourCardsDownloadAllBtn");

  const historyList = document.getElementById("historyList");
  const historyEmpty = document.getElementById("historyEmpty");
  const historyClearBtn = document.getElementById("historyClearBtn");
  const historyModeStats = document.getElementById("historyModeStats");
  const historyModeNote = document.getElementById("historyModeNote");
  const historyModeList = document.getElementById("historyModeList");
  const historyModeEmpty = document.getElementById("historyModeEmpty");
  const historyModeRefreshBtn = document.getElementById("historyModeRefreshBtn");
  const historyModeClearBtn = document.getElementById("historyModeClearBtn");
  const historyModeDetails = document.getElementById("historyModeDetails");
  const historyModeDetailsContent = document.getElementById("historyModeDetailsContent");
  const historyModeDetailsEmpty = document.getElementById("historyModeDetailsEmpty");
  const historyModeDetailsCloseBtn = document.getElementById("historyModeDetailsCloseBtn");
  const historyModeDetailsBackdrop = historyModeDetails?.querySelector("[data-history-modal-close]") || null;
  const historyDetailsEyebrow = document.getElementById("historyDetailsEyebrow");
  const historyDetailsTitle = document.getElementById("historyDetailsTitle");
  const historyDetailsDate = document.getElementById("historyDetailsDate");
  const historyDetailsMode = document.getElementById("historyDetailsMode");
  const historyDetailsCount = document.getElementById("historyDetailsCount");
  const historyDetailsSummary = document.getElementById("historyDetailsSummary");
  const historyReusePromptBtn = document.getElementById("historyReusePromptBtn");
  const historyReuseBtn = document.getElementById("historyReuseBtn");
  const historyOpenResultBtn = document.getElementById("historyOpenResultBtn");
  const historyDetailsInputs = document.getElementById("historyDetailsInputs");
  const historyDetailsUploads = document.getElementById("historyDetailsUploads");
  const historyDetailsPrompt = document.getElementById("historyDetailsPrompt");
  const historyDetailsPromptMeta = document.getElementById("historyDetailsPromptMeta");
  const historyDetailsHighlights = document.getElementById("historyDetailsHighlights");
  const historyDetailsAi = document.getElementById("historyDetailsAi");
  const historyDetailsResults = document.getElementById("historyDetailsResults");
  const historyPreviewModal = document.getElementById("historyPreviewModal");
  const historyPreviewCloseBtn = document.getElementById("historyPreviewCloseBtn");
  const historyPreviewBackdrop = historyPreviewModal?.querySelector("[data-history-preview-close]") || null;
  const historyPreviewTitle = document.getElementById("historyPreviewTitle");
  const historyPreviewMeta = document.getElementById("historyPreviewMeta");
  const historyPreviewImage = document.getElementById("historyPreviewImage");
  const historyPreviewExportBtn = document.getElementById("historyPreviewExportBtn");

  const mountWorkspaceOverlay = (element) => {
    if (!element || !workspace || element.parentElement === workspace) return;
    workspace.append(element);
  };

  mountWorkspaceOverlay(createReferenceModal);
  mountWorkspaceOverlay(createModeChoiceModal);
  mountWorkspaceOverlay(createImageManagerModal);
  mountWorkspaceOverlay(billingModal);
  mountWorkspaceOverlay(historyPreviewModal);

  const APP_ROUTE_PREFIX = "#app/";
  const APP_MODES = ["create", "improve", "fourCards", "tools", "animate", "history"];
  const HISTORY_MAX_ITEMS = 30;
  const HISTORY_STORAGE_PREFIX = "kartochka:history:v1:";
  const HISTORY_CLIENT_MIRROR_PREFIX = "kartochka:history:mirror:v1:";
  const HISTORY_IMAGE_WIDTH = 900;
  const HISTORY_IMAGE_HEIGHT = 1200;
  const HISTORY_IMAGE_JPEG_QUALITY = 0.82;
  const HISTORY_IMAGE_MAX_BYTES = 170 * 1024;
  const API_IMAGE_MAX_DIMENSION = 1280;
  const API_AI_IMAGE_MAX_DIMENSION = 1024;
  const API_IMAGE_JPEG_QUALITY = 0.84;
  const API_AI_IMAGE_MIME_TYPE = "image/jpeg";
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
    "./assets/examples/best-product-close.png",
    "./assets/examples/best-product-far.png",
    "./assets/examples/example-tech.png",
    "./assets/examples/example-home.png",
    "./assets/examples/example-beauty.png",
  ];
  const CREATE_TEMPLATE_PROMPT_PRESETS = Object.freeze({
    marketplaceHero: `
Сгенерируй продающую обложку карточки товара в стиле маркетплейса: товар очень крупно + универсальный светлый фон + акцентные графические элементы + 2–3 текстовые зоны (верх слева, круглый бейдж верх справа, плашка низ справа).

Формат:
- Вертикальное 3:4, высокое качество.
- Товар максимально резкий, фон слегка мягкий.

Товар:
- Масштаб товара: 85–95% высоты кадра.
- Положение: центр или слегка правее.
- Под товаром: реалистичная мягкая тень контакта + лёгкая студийная подложка-овал (подиум), чтобы предмет стоял в кадре.

Универсальный фон:
- Светлый нейтральный градиент.
- Лёгкий бумажный микрошум 2–4%.
- 3–5 абстрактных форм с мягким контрастом.
- Мягкое свечение позади товара.
- Один дополнительный акцентный цвет в элементах фона.

Текст:
- Возьми текст строго как {USER_TEXT} и используй пустые строки как разделители блоков.
- Раздели {USER_TEXT} на 3 блока по пустой строке.

Верстка текста:
- Блок 1 (верх слева): очень крупный заголовок в 1–3 строки, жирный современный гротеск.
- Блок 2 (верх справа): круглый белый бейдж с тёмным текстом.
- Блок 3 (низ справа): большая прямоугольная плашка с мягким градиентом и скруглением.
- Внутри Блока 3 сделай визуальную иерархию: короткую или числовую строку крупнее остальных.

Дополнительные визуальные акценты:
- 2–4 минималистичные иконки рядом с нижней плашкой или под ней.
- 1 декор-стикер без текста.
- 1–2 тонкие линии или стрелки без подписи.
- Одинаковая толщина линий, единая палитра, единый стиль иконок.

Итог:
- Карточка должна выглядеть маркетплейсно: товар главный и очень крупный, фон универсальный, текст читается с первого взгляда.
    `.trim(),
    liquidGlass: `
[GOAL]
Создать фотореалистичную вертикальную карточку товара (3:4). Эстетика: Apple Keynote, Liquid Glass, Premium UI.

[INPUTS]
- Исходное фото товара (reference).
- Текст: {USER_TEXT}

[BLOCK A: ТОВАР]
Товар остается на 100% неизменным. Масштаб — не менее 60% площади кадра. Допустим bleeding edge и частичный кроп.

[BLOCK B: ФОН]
Абстрактные, текучие 3D-волны из полупрозрачного матового стекла и акрила, студийный свет, smooth gradients, мягкое свечение и красивое боке.

[BLOCK C: ТЕКСТ И UI]
Выводить только {USER_TEXT} дословно. Текст располагается на полупрозрачной интерфейсной панели с тонким светящимся краем. Выключка строго по левому краю.
- Заголовок: Mirador, очень крупный, белый.
- Остальные строки: Amoret, заметно мельче, полупрозрачные.

[BLOCK D: СПИСКИ]
Если в {USER_TEXT} есть ; — удали символ, сделай перенос строки. Маркеры: тонкие светящиеся микро-точки или короткие линии.

[BLOCK E: ОГРАНИЧЕНИЯ]
Не менять сам товар. Никаких текстур дерева, бетона, пластика или грязи — только премиальное стекло и интерфейсный минимализм.
    `.trim(),
    cleanGirl: `
Сгенерируй премиальную clean girl / aesthetic карточку товара для маркетплейса по референс-фото товара.

Формат и качество:
- Вертикальное 3:4, high-res, коммерческое качество.
- Реалистичная продуктовая фотография, мягкий студийный свет, естественная контактная тень.
- Товар сохранить максимально похожим на фото.

Композиция:
- Товар 80–90% высоты кадра, расположен слева.
- Справа оставить 30–40% воздуха под текст и инфографику.
- Допустим лёгкий кроп товара на 2–6% за левый или нижний край.
- Запрещено: подиум, платформа, постамент, подложка-овал и любые подставки.

Фон:
- Один спокойный пастельный двухцветный градиент.
- Лёгкий световой haze за товаром.
- Едва заметная бумажная фактура + микрошум 1–2%.
- Максимум 1–2 очень мягкие размытые формы.

Типографика:
- Один шрифт: Inter.
- Только Inter Bold 700 и Inter Medium 500.
- Без эффектов текста.

Текст:
- Очисти входной текст от повторяющейся пунктуации и двойных пробелов.
- Раздели текст на 3 блока по пустой строке.

Инфографика:
- Добавь 3–6 инфо-элементов.
- Иконки только outline, одинаковая толщина линии 2px.
- Тематика иконок строго по товару.

Итог:
- Чисто, премиально, консистентно.
- Товар очень крупный слева, справа воздух под текст.
- Один шрифт, один акцентный цвет, фактурные мазки и аккуратная инфографика без визуального шума.
    `.trim(),
    stoneLuxury: `
[GOAL]
Создать фотореалистичную вертикальную карточку товара 3:4 на основе reference-фото.
Стиль: elemental luxury / organic minimalism (weathered stone + cool concrete), чисто и дорого.

[INPUTS]
1) Исходное фото товара (reference).
2) Текст: {USER_TEXT}

[BLOCK A — ТОВАР]
- Товар 100% неизменен.
- Масштаб: не менее 60% площади кадра.
- Допустим bleeding edge и частичный кроп.
- Товар стоит на крупном фактурном выветренном сером камне.

[BLOCK B — ОКРУЖЕНИЕ]
- Weathered grey stone.
- Smooth cool gray concrete walls.
- Нейтральные серые, белые и каменные тона.

[BLOCK C — СВЕТ]
- Мягкий рассеянный естественный свет.
- Товар и камень — максимально резкие; фон — слегка размыт.

[BLOCK D — ТЕКСТ]
- На изображении должен быть только текст {USER_TEXT}, строго дословно.
- Размер: большой, читабельный на телефоне.
- Выравнивание: строго по левому краю.
- Первая строка: Telegraf, ExtraBold/Black.
- Остальные строки: Montserrat, Regular/Medium.
- 1–3 минимальных UI-акцента: hairline rule, outline circle или мягкая капсула.

[BLOCK E — СПИСКИ]
- Если в {USER_TEXT} есть ;, не печатай ;, вместо него сделай перенос строки.
- Перед каждой строкой добавь тонкое кольцо или короткую вертикальную микро-линию.

[OUTPUT]
Один итоговый кадр 3:4: товар неизменен, стоит на фактурном сером камне, фон — прохладный бетон, сверху — крупная премиальная типографика с минималистичными UI-акцентами.
    `.trim(),
    barbieSwiss: `
[GOAL]
Сгенерируй фотореалистичную вертикальную карточку товара (3:4) на основе загруженного фото.
Помести неизменный товар в детализированную кукольную диораму (Barbiecore) и добавь поверх стильную, массивную и графичную типографику в стиле Premium Editorial / Swiss Design.

[INPUTS]
- Исходное фото товара (reference).
- Текст: {USER_TEXT}

[BLOCK A — ТОВАР]
- Товар остается на 100% как на оригинале.
- Запрещено менять стиль самого товара.

[BLOCK B — ОКРУЖЕНИЕ]
- Премиальная Barbie-диорама.
- Ярко выраженный эффект миниатюры.
- Глянцевый пластик, прозрачный акрил, крошечная мебель.
- На фоне или сбоку — фрагмент глянцевой пластиковой куклы, не перекрывая товар и текст.
- Палитра: пудровый / насыщенный розовый + белые акценты.

[BLOCK C — ОПТИКА]
- Мягкий high-key свет.
- Товар самый резкий.
- Фон с легким tilt-shift.

[BLOCK D — КОМПОЗИЦИЯ]
- Товар слева или по центру слева.
- Справа — чистое негативное пространство под текст.

[BLOCK E — ТЕКСТ]
- Выводить только {USER_TEXT} дословно.
- Огромная типографика.
- Заголовок экстра-жирный, описание значительно мельче.
- Выключка строго по левому краю.
- Графические элементы: hairline rules, микро-капсулы, круги или полупрозрачные плашки.
- Никаких мультяшных стикеров в графике.

[BLOCK F — СПИСКИ]
- Если в {USER_TEXT} есть ;, удали символ и начни новый пункт с новой строки.
- Маркеры: тонкое векторное кольцо, минималистичный плюсик или строгая вертикальная микро-линия.

[OUTPUT]
Один вертикальный кадр 3:4. Слева — неизменный товар в премиальной Barbie-диораме. Справа — гигантская, контрастная и стильная типографика с тонкой UI-графикой.
    `.trim(),
    frostedGlass: `
[GOAL]
Создать фотореалистичную вертикальную карточку товара (3:4). Эстетика: high-end skincare, macro realism, съемка сквозь влажное матовое стекло.

[INPUTS]
- Исходное фото товара (reference).
- Текст: {USER_TEXT}

[BLOCK A — ТОВАР]
- Товар остается на 100% неизменным.
- Масштаб: не менее 50% площади кадра, может выходить за границы кадра.
- Товар бережно поддерживается снизу гиперреалистичной рукой.

[BLOCK B — СРЕДА]
- Сцена снимается сквозь матовое стекло, покрытое конденсатом.
- Капли разного размера, вертикальные дорожки, следы протирания.
- Фон: бесшовный студийный переход от белого к мягкому светло-серому.

[BLOCK C — ОПТИКА И СВЕТ]
- Straight-on macro close-up, 100 mm prime, f/8.
- Товар и рука в фокусе, капли на стекле тоже резкие.
- Холодный контровой свет создает halo glow вокруг товара.
- Мягкий контурный свет справа отделяет руку от фона.

[BLOCK D — ТЕКСТ]
- Выводить только {USER_TEXT} дословно.
- Шрифт: премиальный геометрический гротеск.
- Заголовок — крупный и жирный, описание — тоньше и мельче.
- Выключка строго по левому краю.
- Цвет текста: графитовый, мягкий серый или белый.

[BLOCK E — СПИСКИ]
- Если в {USER_TEXT} есть ; — удали символ, сделай перенос строки.
- Маркеры: минималистичные тонкие линии или микро-точки.

[BLOCK F — ОГРАНИЧЕНИЯ]
- Не менять сам товар.
- Логотипы и текст на самом товаре должны читаться чисто сквозь капли.
- Сохранять нейтральную, чистую палитру без грязи и лишних предметов.
    `.trim(),
  });
  const CREATE_TEMPLATE_LIBRARY = Object.freeze([
    {
      id: "tpl-ozon-clean",
      title: "Чистый Ozon",
      description: "Чистый макет маркетплейса с заметным первым экраном и компактной подачей преимуществ.",
      tab: "marketplace",
      previewUrl: "./assets/generated/accessories-card.png",
      tags: ["ozon", "чистый", "маркетплейс", "преимущества", "clean"],
    },
    {
      id: "tpl-beauty-premium",
      title: "Премиум-косметика",
      description: "Спокойная премиальная подача для косметики, ухода и beauty-категорий.",
      tab: "clean",
      previewUrl: "./assets/generated/beauty-sale.png",
      tags: ["косметика", "уход", "beauty", "премиум", "чистый"],
    },
    {
      id: "tpl-tech-grid",
      title: "Техно-сетка",
      description: "Структурный шаблон с акцентом на характеристики и читаемость.",
      tab: "marketplace",
      previewUrl: "./assets/examples/example-tech.png",
      tags: ["техника", "сетка", "характеристики", "читаемость", "tech"],
    },
    {
      id: "tpl-home-editorial",
      title: "Домашняя редакционная подача",
      description: "Редакционная подача для товаров для дома и lifestyle-категорий.",
      tab: "reference",
      previewUrl: "./assets/examples/example-home.png",
      tags: ["дом", "редакционный", "референс", "мягкий", "home"],
    },
    {
      id: "tpl-promo-burst",
      title: "Промо-акцент",
      description: "Промо-шаблон с сильным оффером, бейджами и быстрым CTA.",
      tab: "promo",
      previewUrl: "./assets/generated/beauty-sale.png",
      tags: ["промо", "скидка", "cta", "контраст", "sale"],
    },
    {
      id: "tpl-reference-beauty",
      title: "Референс-настроение",
      description: "Референс для мягкой композиции, глубины и визуального ритма.",
      tab: "reference",
      previewUrl: "./assets/examples/example-beauty.png",
      tags: ["референс", "косметика", "настроение", "визуальный ритм", "beauty"],
    },
    {
      id: "tpl-preset-marketplace-hero",
      title: "Marketplace Hero",
      description: "Крупный товар, светлый универсальный фон, бейджи, плашка и графические акценты в логике маркетплейса.",
      tab: "marketplace",
      previewUrl: "./assets/generated/accessories-card.png",
      sourceLabel: "KARTOCHKA",
      kind: "preset",
      usePreviewAsReference: false,
      instructionPrompt: CREATE_TEMPLATE_PROMPT_PRESETS.marketplaceHero,
      tags: ["preset", "marketplace", "hero", "badge", "graphic", "cover"],
    },
    {
      id: "tpl-preset-liquid-glass",
      title: "Liquid Glass UI",
      description: "Apple Keynote / Liquid Glass эстетика с огромным товаром, стеклянной UI-плашкой и премиальной типографикой.",
      tab: "clean",
      previewUrl: "./assets/generated/beauty-sale.png",
      sourceLabel: "KARTOCHKA",
      kind: "preset",
      usePreviewAsReference: false,
      instructionPrompt: CREATE_TEMPLATE_PROMPT_PRESETS.liquidGlass,
      tags: ["preset", "liquid glass", "glassmorphism", "premium ui", "apple", "clean"],
    },
    {
      id: "tpl-preset-clean-girl",
      title: "Clean Girl Aesthetic",
      description: "Пастельный фон, крупный товар слева, clean girl эстетика и аккуратная инфографика.",
      tab: "clean",
      previewUrl: "./assets/examples/example-beauty.png",
      sourceLabel: "KARTOCHKA",
      kind: "preset",
      usePreviewAsReference: false,
      instructionPrompt: CREATE_TEMPLATE_PROMPT_PRESETS.cleanGirl,
      tags: ["preset", "clean girl", "aesthetic", "pastel", "inter", "paint swash"],
    },
    {
      id: "tpl-preset-stone-luxury",
      title: "Stone Luxury",
      description: "Elemental luxury с фактурным камнем, прохладным бетоном и крупной editorial-типографикой.",
      tab: "reference",
      previewUrl: "./assets/examples/example-home.png",
      sourceLabel: "KARTOCHKA",
      kind: "preset",
      usePreviewAsReference: false,
      instructionPrompt: CREATE_TEMPLATE_PROMPT_PRESETS.stoneLuxury,
      tags: ["preset", "stone", "concrete", "luxury", "editorial", "telegraf"],
    },
    {
      id: "tpl-preset-barbie-swiss",
      title: "Barbiecore Swiss",
      description: "Премиальная Barbie-диорама слева и гигантская Swiss / editorial типографика справа.",
      tab: "promo",
      previewUrl: "./assets/generated/beauty-sale.png",
      sourceLabel: "KARTOCHKA",
      kind: "preset",
      usePreviewAsReference: false,
      instructionPrompt: CREATE_TEMPLATE_PROMPT_PRESETS.barbieSwiss,
      tags: ["preset", "barbiecore", "swiss", "editorial", "toy scale", "pink"],
    },
    {
      id: "tpl-preset-frosted-glass",
      title: "Frosted Glass Macro",
      description: "High-end skincare эстетика: макро-съёмка сквозь влажное матовое стекло с конденсатом и рукой.",
      tab: "clean",
      previewUrl: "./assets/examples/example-tech.png",
      sourceLabel: "KARTOCHKA",
      kind: "preset",
      usePreviewAsReference: false,
      instructionPrompt: CREATE_TEMPLATE_PROMPT_PRESETS.frostedGlass,
      tags: ["preset", "frosted glass", "skincare", "macro", "condensation", "studio"],
    },
  ]);
  const CREATE_INSTRUCTION_TEMPLATE_PATH = "server/prompts/best-template-instruction.md";
  const CREATE_INSTRUCTION_TEMPLATE_LABEL = "best-template-instruction.md";
  const CREATE_AUTOFILL_TEXTS_INSTRUCTION_PATH = "server/prompts/autofill-marketplace-card-texts-v5.md";
  const IMPROVE_INSTRUCTION_TEMPLATE_PATH = "server/prompts/improve-card-instruction.md";
  const CREATE_BEST_INSTRUCTION_TEMPLATE = Object.freeze({
    id: "tpl-best-instruction",
    title: "Лучший",
    description: "Адаптивный визуал персонально под ваш товар",
    tab: "marketplace",
    previewUrl: "",
    sourceLabel: "KARTOCHKA",
    kind: "instruction-template",
    promptFlow: "gpt_instruction",
    instructionPromptPath: CREATE_INSTRUCTION_TEMPLATE_PATH,
    instructionPromptLabel: CREATE_INSTRUCTION_TEMPLATE_LABEL,
    usePreviewAsReference: false,
    tags: ["лучший", "инструкция", "gpt", "prompt pipeline"],
  });
  const CREATE_DIRECT_PROMPT_TEMPLATE = Object.freeze({
    id: "tpl-direct-custom-prompt",
    title: "Свой промт",
    description: "Полностью ручной режим: ваш промт без изменений уходит в image AI.",
    tab: "custom",
    previewUrl: "",
    sourceLabel: "KARTOCHKA",
    kind: "custom-prompt",
    usePreviewAsReference: false,
    tags: ["свой промт", "ручной", "direct", "no rewrite"],
  });
  const CREATE_TEXT_REPLACE_TEMPLATE = Object.freeze({
    id: "tpl-preserve-card-replace-text",
    title: "Сохранение карточки",
    description: "Сохраняет изображение карточки один в один и меняет только выбранные фрагменты текста.",
    tab: "custom",
    previewUrl: "",
    sourceLabel: "TXT",
    kind: "text-replace",
    usePreviewAsReference: false,
    tags: ["сохранение карточки", "замена текста", "exact preserve", "replace text"],
  });
  const CREATE_DEFAULT_TEMPLATE_ID = CREATE_BEST_INSTRUCTION_TEMPLATE.id;
  const CREATE_TEMPLATE_TABS = new Set(["all"]);
  const CREATE_USEFUL_SETTINGS_DEFAULTS = Object.freeze({
    accentColor: "emerald",
    referenceStrength: "medium",
    visualStyle: "clean-market",
    infoDensity: "balanced",
    readabilityPriority: "high",
    conversionPriority: "balanced",
    accentFormat: "benefit",
    backgroundMode: "clean",
    preserveReferenceLayout: false,
  });
  const CREATE_BEST_MODEL_OPTIONS = Object.freeze({
    good: Object.freeze({
      id: "good",
      label: "Хорошая модель",
      billingActionCode: "create_generate_best_good",
      openAiModel: "gpt-5.4-mini",
      reasoningEffort: "high",
    }),
    best: Object.freeze({
      id: "best",
      label: "Лучшая модель",
      billingActionCode: "create_generate_best_best",
      openAiModel: "gpt-5.4",
      reasoningEffort: "high",
    }),
  });
  const CREATE_PRODUCT_TYPE_OPTIONS = Object.freeze([
    Object.freeze({
      id: "clothing_and_shoes",
      label: "Одежда и обувь",
      hint: "одежда, обувь, головные уборы",
      angles: Object.freeze([
        Object.freeze({
          id: "clothing_and_shoes-model",
          title: "На модели",
          description: "носимый контекст, акцент на посадке",
          prompt: "Показать товар на модели или в носимом контексте, чтобы было понятно, как он сидит и выглядит в жизни.",
          previewUrl: "./assets/examples/best-fashion-model.jpg",
        }),
        Object.freeze({
          id: "clothing_and_shoes-store",
          title: "Как в магазине",
          description: "на вешалке или подставке",
          prompt: "Показать товар в аккуратной магазинной подаче на вешалке, стойке или подставке.",
          previewUrl: "./assets/examples/example-home.png",
        }),
        Object.freeze({
          id: "clothing_and_shoes-flatlay",
          title: "Раскладка сверху",
          description: "вид строго сверху",
          prompt: "Сделать flat lay композицию: товар разложен сверху, чистый фон, понятная форма и детали.",
          previewUrl: "./assets/examples/best-fashion-flat.jpg",
        }),
        Object.freeze({
          id: "clothing_and_shoes-catalog",
          title: "Каталог студийно",
          description: "чистый объект на нейтральном фоне",
          prompt: "Каталожная студийная съемка: товар отдельно, нейтральный фон, точная форма, без лишнего шума.",
          previewUrl: "./assets/examples/soap-card.png",
        }),
      ]),
    }),
    Object.freeze({
      id: "accessories",
      label: "Аксессуары",
      hint: "сумки, часы, очки, украшения",
      angles: Object.freeze([
        Object.freeze({
          id: "accessories-lifestyle",
          title: "В образе",
          description: "на человеке или рядом с образом",
          prompt: "Показать аксессуар в образе: на человеке, руке, сумке или рядом с одеждой, чтобы была понятна стилизация.",
          previewUrl: "./assets/generated/accessories-card.png",
        }),
        Object.freeze({
          id: "accessories-macro",
          title: "Детали крупно",
          description: "фактура, фурнитура, материалы",
          prompt: "Крупный план деталей: фактура, фурнитура, застежки, блеск и качество материалов.",
          previewUrl: "./assets/examples/candle-card.png",
        }),
        Object.freeze({
          id: "accessories-gift",
          title: "Подарочная подача",
          description: "премиальная композиция",
          prompt: "Премиальная подарочная композиция с аккуратным светом, упаковкой и ощущением ценности.",
          previewUrl: "./assets/examples/bioderma-card.png",
        }),
        Object.freeze({
          id: "accessories-catalog",
          title: "Каталог",
          description: "объект по центру",
          prompt: "Чистая каталожная подача аксессуара по центру, нейтральный фон, читаемый силуэт.",
          previewUrl: "./assets/examples/example-tech.png",
        }),
      ]),
    }),
    Object.freeze({
      id: "food_and_drinks",
      label: "Еда и напитки",
      hint: "продукты, блюда, напитки, упаковка",
      angles: Object.freeze([
        Object.freeze({
          id: "food_and_drinks-pack",
          title: "Hero упаковка",
          description: "товар крупно и аппетитно",
          prompt: "Hero-подача упаковки или продукта крупно, аппетитный свет, чистый маркетплейс-фон.",
          previewUrl: "./assets/examples/redbull-card.png",
        }),
        Object.freeze({
          id: "food_and_drinks-ingredients",
          title: "С ингредиентами",
          description: "состав и вкус рядом",
          prompt: "Показать продукт рядом с ингредиентами, вкусами или сырьем, чтобы сразу считывался состав.",
          previewUrl: "./assets/examples/example-beauty.png",
        }),
        Object.freeze({
          id: "food_and_drinks-serving",
          title: "В сервировке",
          description: "готовый сценарий употребления",
          prompt: "Показать продукт в сценарии употребления: стол, сервировка, готовое блюдо или напиток.",
          previewUrl: "./assets/examples/marshall-card.png",
        }),
        Object.freeze({
          id: "food_and_drinks-macro",
          title: "Макро",
          description: "текстура и свежесть",
          prompt: "Макро-кадр продукта: текстура, свежесть, сочность или хруст должны быть главным акцентом.",
          previewUrl: "./assets/examples/process-ai-card.png",
        }),
      ]),
    }),
    Object.freeze({
      id: "beauty_and_care",
      label: "Косметика и уход",
      hint: "банки, флаконы, тюбики",
      angles: Object.freeze([
        Object.freeze({
          id: "beauty_and_care-hand",
          title: "В руке",
          description: "масштаб и доверие",
          prompt: "Показать косметику в руке или рядом с рукой, чтобы был понятен масштаб и возникало доверие.",
          previewUrl: "./assets/examples/bioderma-card.png",
        }),
        Object.freeze({
          id: "beauty_and_care-packshot",
          title: "Флакон крупно",
          description: "чистый hero-кадр",
          prompt: "Чистый hero-кадр флакона или тюбика крупно, премиальный свет, читаемая упаковка.",
          previewUrl: "./assets/generated/beauty-sale.png",
        }),
        Object.freeze({
          id: "beauty_and_care-ritual",
          title: "Ритуал ухода",
          description: "ванная, полка, текстуры",
          prompt: "Показать товар в контексте ритуала ухода: полка, ванная, мягкий свет, текстуры крема или воды.",
          previewUrl: "./assets/examples/example-beauty.png",
        }),
        Object.freeze({
          id: "beauty_and_care-catalog",
          title: "Каталог чисто",
          description: "объект и выгоды",
          prompt: "Каталожная подача косметики: объект по центру, чистый фон, место под выгоды и текст.",
          previewUrl: "./assets/examples/soap-card.png",
        }),
      ]),
    }),
    Object.freeze({
      id: "gadgets_and_tech",
      label: "Гаджеты и техника",
      hint: "электроника, устройства, аксессуары",
      angles: Object.freeze([
        Object.freeze({
          id: "gadgets_and_tech-use",
          title: "В использовании",
          description: "реальный сценарий",
          prompt: "Показать устройство в реальном сценарии использования: рука, стол, рабочее место или дом.",
          previewUrl: "./assets/examples/example-tech.png",
        }),
        Object.freeze({
          id: "gadgets_and_tech-detail",
          title: "Детали",
          description: "порты, кнопки, материалы",
          prompt: "Крупный план деталей техники: порты, кнопки, материалы, качество сборки.",
          previewUrl: "./assets/examples/marshall-card.png",
        }),
        Object.freeze({
          id: "gadgets_and_tech-desk",
          title: "На столе",
          description: "аккуратный рабочий сетап",
          prompt: "Показать гаджет на аккуратном столе или в рабочем сетапе, современный чистый фон.",
          previewUrl: "./assets/examples/process-ai-card.png",
        }),
        Object.freeze({
          id: "gadgets_and_tech-catalog",
          title: "Каталог",
          description: "форма и комплектация",
          prompt: "Каталожная подача техники: устройство, комплектация и чистое пространство под характеристики.",
          previewUrl: "./assets/examples/process-photo-card.png",
        }),
      ]),
    }),
    Object.freeze({
      id: "home_and_interior",
      label: "Дом и интерьер",
      hint: "декор, мебель, товары для дома",
      angles: Object.freeze([
        Object.freeze({
          id: "home_and_interior-interior",
          title: "В интерьере",
          description: "товар в живом пространстве",
          prompt: "Показать товар в интерьере: понятный масштаб, уютный контекст, гармония с окружением.",
          previewUrl: "./assets/examples/example-home.png",
        }),
        Object.freeze({
          id: "home_and_interior-texture",
          title: "Фактура крупно",
          description: "материал и качество",
          prompt: "Крупный план фактуры и материала, чтобы подчеркнуть качество, поверхность и детали.",
          previewUrl: "./assets/examples/candle-card.png",
        }),
        Object.freeze({
          id: "home_and_interior-before",
          title: "Сценарий до/после",
          description: "польза в быту",
          prompt: "Показать бытовой сценарий пользы товара: до/после, порядок, удобство или экономия места.",
          previewUrl: "./assets/examples/youto-card.png",
        }),
        Object.freeze({
          id: "home_and_interior-catalog",
          title: "Каталог",
          description: "предмет на чистом фоне",
          prompt: "Чистая каталожная подача товара для дома, нейтральный фон, читаемый силуэт и место под текст.",
          previewUrl: "./assets/examples/soap-card.png",
        }),
      ]),
    }),
  ]);
  const CREATE_ACCENT_COLOR_MAP = Object.freeze({
    emerald: "#10b981",
    mint: "#34d399",
    sky: "#38bdf8",
    gold: "#f59e0b",
  });
  const CREATE_AI_AUTOFILL_PRESET_LABELS = Object.freeze([
    "Материал",
    "Размер",
    "Цвет",
    "Вес",
    "Объём",
    "Комплектация",
  ]);
  const CREATE_PRODUCT_ROUTING_OPTIONS = Object.freeze({
    general_product: Object.freeze({
      id: "general_product",
      label: "Товар",
      hint: "",
      modeLabel: "Товар",
      angleHeading: "Как показать товар?",
      angleHint: "",
      angles: Object.freeze([
        Object.freeze({
          id: "general_product-close",
          title: "Вблизи",
          description: "",
          prompt: "Показать товар крупно и близко к камере, чтобы сразу считывались форма, материал, детали и ценность продукта.",
          previewUrl: "./assets/examples/best-product-close.png",
        }),
        Object.freeze({
          id: "general_product-far",
          title: "Издалека",
          description: "",
          prompt: "Показать товар целиком, в более широком кадре с воздухом и аккуратным контекстом, чтобы был понятен масштаб и сценарий использования.",
          previewUrl: "./assets/examples/best-product-far.png",
        }),
      ]),
    }),
    clothing_and_shoes: Object.freeze({
      id: "clothing_and_shoes",
      label: "Одежда и обувь",
      hint: "",
      modeLabel: "Одежда / обувь",
      angleHeading: "Как показать одежду?",
      angleHint: "",
      angles: Object.freeze([
        Object.freeze({
          id: "clothing_and_shoes-model",
          title: "На человеке",
          description: "",
          prompt: "Показать одежду или обувь на человеке, чтобы были понятны посадка, пропорции, силуэт и настроение образа.",
          previewUrl: "./assets/examples/best-fashion-model.jpg",
        }),
        Object.freeze({
          id: "clothing_and_shoes-flat",
          title: "Не на человеке",
          description: "",
          prompt: "Показать одежду или обувь без человека: аккуратно, предметно, с чистой формой, хорошим светом и понятными деталями товара.",
          previewUrl: "./assets/examples/best-fashion-flat.jpg",
        }),
      ]),
    }),
  });
  const CREATE_RESULTS_PROCESSING_STAGES = Object.freeze({
    analyzing: Object.freeze({
      kicker: "ANALYSIS",
      title: "Считываем товар",
      text: "Смотрим форму, фактуру и решаем, какая подача будет сильнее продавать в карточке.",
    }),
    planning: Object.freeze({
      kicker: "LAYOUT",
      title: "Собираем подачу",
      text: "Уточняем ракурс, иерархию и место для текста без лишнего визуального шума.",
    }),
    generating: Object.freeze({
      kicker: "RENDER",
      title: "Генерируем карточку",
      text: "Собираем вертикальную 3:4 карточку и аккуратно доводим её до коммерческого вида.",
    }),
    finalizing: Object.freeze({
      kicker: "FINISH",
      title: "Доводим детали",
      text: "Проверяем читаемость, вертикальный формат и готовим финальный вариант к выдаче.",
    }),
    error: Object.freeze({
      kicker: "TRY AGAIN",
      title: "Генерация остановилась",
      text: "Исходные данные сохранены. Можно сразу поменять настройки и запустить ещё раз.",
    }),
  });
  const CREATE_AI_AUTOFILL_COLOR_KEYWORDS = Object.freeze([
    "черный",
    "белый",
    "серый",
    "бежевый",
    "коричневый",
    "синий",
    "голубой",
    "зеленый",
    "зелёный",
    "красный",
    "розовый",
    "фиолетовый",
    "желтый",
    "жёлтый",
    "оранжевый",
    "золотой",
    "серебристый",
    "прозрачный",
  ]);
  const CREATE_AI_AUTOFILL_MATERIAL_KEYWORDS = Object.freeze([
    "хлопок",
    "лен",
    "лён",
    "кожа",
    "экокожа",
    "полиэстер",
    "шерсть",
    "дерево",
    "металл",
    "пластик",
    "стекло",
    "силикон",
    "алюминий",
    "нержавеющая сталь",
    "керамика",
  ]);
  const CREATE_PRODUCT_DESCRIPTION_BLOCKLIST = Object.freeze([
    "карточк",
    "маркетплейс",
    "marketplace",
    "макет",
    "обложк",
    "cta",
    "бейдж",
    "плашк",
    "референс",
    "шаблон",
    "дизайн",
    "инфограф",
    "композици",
    "типограф",
    "оффер",
    "hero",
    "wildberries",
    "вайлдберриз",
    "ozon",
    "озон",
    "яндекс маркет",
  ]);

  const modeLabelMap = {
    create: "Создание",
    improve: "Улучшение",
    fourCards: "4 дополнительные карточки",
    animate: "Анимация",
    history: "История",
  };

  const SERVICE_MODE = (() => {
    const configuredMode = String(window.KARTOCHKA_SERVICE_MODE || "").trim().toLowerCase();
    if (configuredMode === "mock" || configuredMode === "real") return configuredMode;
    return "real";
  })();

  let activeUser = null;
  let pendingPostAuthMode = "create";
  let signOutRedirectPending = false;
  let authRouteBootstrapPending = false;

  const buildUserHintHeaders = (user, token) => {
    if (!user) return {};
    return {
      ...(token ? { Authorization: "Bearer " + token } : {}),
      "X-Kartochka-User-Id": user.uid || "",
      "X-Kartochka-User-Email": user.email || "",
    };
  };

  const getAuthRequestHeaders = async () => {
    if (!activeUser) return {};

    try {
      const token = typeof activeUser.getIdToken === "function"
        ? await activeUser.getIdToken()
        : "";
      return buildUserHintHeaders(activeUser, token);
    } catch (error) {
      return buildUserHintHeaders(activeUser, "");
    }
  };

  const serviceClient = window.KARTOCHKA_SERVICES?.createClient
    ? window.KARTOCHKA_SERVICES.createClient({
        mode: SERVICE_MODE,
        delays: {
          prompt: CREATE_AI_PROMPT_MOCK_DELAY,
          insight: CREATE_INSIGHT_MOCK_DELAY,
          createGeneration: CREATE_GENERATION_MOCK_DELAY,
          fourCardsGeneration: CREATE_GENERATION_MOCK_DELAY,
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
          timeoutMs: 300000,
          backgroundRetryCount: 1,
          recoveryWaitMs: 45000,
          recoveryStabilizeMs: 700,
          retryDelayMs: 700,
          getHeaders: getAuthRequestHeaders,
        },
        endpoints: {
          createAnalyze: "/api/kartochka/createAnalyze",
          createGenerate: "/api/kartochka/createGenerate",
          generateFourMarketplaceCards: "/api/kartochka/generateFourMarketplaceCards",
          productDetectType: "/api/product/detect-type",
          improveAnalyze: "/api/kartochka/improveAnalyze",
          improveGenerate: "/api/kartochka/improveGenerate",
          historyList: "/api/kartochka/historyList",
          historyGetById: "/api/kartochka/historyGetById",
          historySave: "/api/kartochka/historySave",
          historyAssetSave: "/api/kartochka/historyAssetSave",
          billingSummary: "/api/kartochka/billingSummary",
          redeemPromo: "/api/kartochka/redeemPromo",
        },
      })
    : null;
  let activeMode = "create";
  let createPromptMode = "ai";
  let createIsGenerating = false;
  let createInsightPhase = "empty";
  let createInsightData = null;
  let createInsightRequestId = 0;
  let createInsightFingerprint = "";
  let createAutofillPhase = "idle";
  let createAutofillRequestId = 0;
  let createAiPromptPhase = "empty";
  let createAiPromptRequestId = 0;
  let createGenerationRequestId = 0;
  let createGeneratedResults = [];
  let createActivePreviewResultId = "";
  let createLastHistoryEntryId = "";
  let createInstructionDocumentText = "";
  let createInstructionDocumentName = "";
  let createBestModelTier = "good";
  let createGenerationNotesExpanded = false;
  const createSelectedFiles = [];
  let createTextReplaceRuleId = 1;
  let createTextReplaceRules = [{ id: createTextReplaceRuleId, from: "", to: "" }];
  let createActiveTemplateTab = "all";
  let createTemplateSearchQuery = "";
  let createSelectedTemplateId = CREATE_DEFAULT_TEMPLATE_ID;
  let createProductTypeId = "clothing_and_shoes";
  let createProductAngleId = "clothing_and_shoes-model";
  let createProductTypeSource = "manual";
  let createProductTypeDetectionPhase = "idle";
  let createProductTypeDetectionRequestId = 0;
  let createProductTypeDetectionFileKey = "";
  let createModeChoiceModalOpen = false;
  let createReferenceLibraryOpen = false;
  let createImageManagerOpen = false;
  let createUploadDragDepth = 0;
  const createCharacteristics = [];
  let createCharacteristicsComponent = null;
  const createUsefulSettings = { ...CREATE_USEFUL_SETTINGS_DEFAULTS };
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
  let improveAnalysisInFlight = null;
  let improveGenerationRequestId = 0;
  let improveGeneratedResults = [];
  let improveResultExpandedId = "";
  let improvePrimaryDragDepth = 0;
  let improveReferenceDragDepth = 0;
  let fourCardsImageFile = null;
  let fourCardsImagePreview = "";
  let fourCardsIsGenerating = false;
  let fourCardsRequestId = 0;
  let fourCardsResult = null;
  let fourCardsDragDepth = 0;
  const historyEntries = [];
  let selectedHistoryEntryId = "";
  let historyReuseInProgress = false;
  let historyIsLoading = false;
  let historyLoadRequestId = 0;
  let historyDetailsVisible = false;
  let historyDetailsRequestId = 0;
  let historyDetailsLoadingId = "";
  let historyPreviewVisible = false;
  let selectedHistoryPreviewEntryId = "";
  let selectedHistoryPreviewResultId = "";
  let historySyncStatus = {
    level: "idle",
    message: "",
    storageMode: "",
    fallbackUsed: false,
    savedAt: "",
  };
  let billingSummary = null;
  let billingSummaryLoading = false;
  let billingSummaryRequestId = 0;

  window.KARTOCHKA_AUTH_SESSION = {
    getHeaders: getAuthRequestHeaders,
    getUserId() {
      return activeUser?.uid || "";
    },
  };

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

    if (node === createStatus && createMeta) {
      setRequestMeta(createMeta, "Статус запроса:", text || "Ожидание данных", type);
    }
  };

  const formatTokenWord = (count) => {
    const value = Math.abs(Number(count) || 0);
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) return "токен";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "токена";
    return "токенов";
  };

  const formatTokenCount = (count) => {
    const value = Number(count) || 0;
    return String(value) + " " + formatTokenWord(value);
  };

  const CLIENT_REQUEST_SESSION_ID = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);

  const buildClientRequestId = (prefix, requestId) => {
    return String(prefix || "request") + "-" + CLIENT_REQUEST_SESSION_ID + "-" + String(requestId || 0);
  };

  const buildImproveSourceNameFromResult = (result) => {
    const preferredName = String(result?.downloadName || "").trim();
    if (preferredName) return preferredName;

    const titleName = String(result?.title || "").trim().replace(/[^\w\u0400-\u04FF-]+/g, "-");
    return (titleName || "generated-card") + ".png";
  };

  const getBillingCatalog = () => {
    return billingSummary?.catalog || null;
  };

  const getBillingActionCost = (actionCode) => {
    const safeCode = toText(actionCode);
    if (!safeCode) return 0;
    const catalog = getBillingCatalog();
    const action = Array.isArray(catalog?.actions)
      ? catalog.actions.find((item) => toText(item?.code) === safeCode)
      : null;
    return Number(action?.tokens) || 0;
  };

  const getBillingBalanceTokens = () => {
    return Number(billingSummary?.account?.balanceTokens) || 0;
  };

  const hasEnoughTokens = (actionCode) => {
    const cost = getBillingActionCost(actionCode);
    if (!cost) return true;
    if (!billingSummary) return true;
    return getBillingBalanceTokens() >= cost;
  };

  const getCreateGenerateBillingActionCode = () => {
    const selectedTemplate = typeof getCreateSelectedTemplate === "function"
      ? getCreateSelectedTemplate()
      : null;
    if (isCreateTextReplaceTemplate(selectedTemplate)) {
      return "create_generate_text_replace";
    }
    return usesCreateDirectGenerationPrompt(selectedTemplate)
      ? "create_generate_custom"
      : ((CREATE_BEST_MODEL_OPTIONS[createBestModelTier] || CREATE_BEST_MODEL_OPTIONS.good).billingActionCode);
  };

  const getCreateBestModelOption = () => {
    return CREATE_BEST_MODEL_OPTIONS[createBestModelTier] || CREATE_BEST_MODEL_OPTIONS.good;
  };

  const syncCreateBestModelState = () => {
    const selectedTemplate = typeof getCreateSelectedTemplate === "function"
      ? getCreateSelectedTemplate()
      : null;
    const isInstructionTemplate = isCreateInstructionTemplate(selectedTemplate);

    if (createBestModelSelect) {
      const bestModelControl = createBestModelSelect.closest(".create-best-model-control");
      const isLocked = !isInstructionTemplate || createIsGenerating || createAiPromptPhase === "loading" || createAutofillPhase === "loading";
      bestModelControl?.classList.toggle("hidden", !isInstructionTemplate);
      bestModelControl?.classList.toggle("is-pro", createBestModelTier === "best");
      bestModelControl?.classList.toggle("is-disabled", isLocked);
      bestModelControl?.setAttribute("aria-checked", String(createBestModelTier === "best"));
      bestModelControl?.setAttribute("aria-disabled", String(isLocked));
      bestModelControl?.setAttribute("tabindex", isLocked ? "-1" : "0");
      createBestModelSelect.value = createBestModelTier;
      createBestModelSelect.toggleAttribute("disabled", isLocked);
    }
  };

  const setCreateBestModelTier = (nextTier) => {
    const normalizedTier = toText(nextTier);
    if (!CREATE_BEST_MODEL_OPTIONS[normalizedTier] || normalizedTier === createBestModelTier) return;
    createBestModelTier = normalizedTier;
    syncCreateBestModelState();
    syncCreateFormState();
  };

  const syncCreateGenerationNotesState = () => {
    const selectedTemplate = typeof getCreateSelectedTemplate === "function"
      ? getCreateSelectedTemplate()
      : null;
    const isInstructionTemplate = isCreateInstructionTemplate(selectedTemplate);
    const controlsLocked = createIsGenerating || createAiPromptPhase === "loading" || createAutofillPhase === "loading";

    createGenerationNotesPanel?.classList.toggle("hidden", !isInstructionTemplate || !createGenerationNotesExpanded);
    createGenerationNotesToggle?.classList.toggle("hidden", !isInstructionTemplate);
    createGenerationNotesToggle?.classList.toggle("is-active", Boolean(createGenerationNotesExpanded));
    createGenerationNotesToggle?.setAttribute("aria-expanded", createGenerationNotesExpanded ? "true" : "false");
    if (createGenerationNotesToggle) {
      createGenerationNotesToggle.toggleAttribute("disabled", !isInstructionTemplate || controlsLocked);
    }
  };

  const setCreateGenerationNotesExpanded = (nextExpanded, options = {}) => {
    createGenerationNotesExpanded = Boolean(nextExpanded);
    syncCreateGenerationNotesState();
    if (createGenerationNotesExpanded && options.focus) {
      window.setTimeout(() => {
        createGenerationNotes?.focus();
      }, 0);
    }
  };

  const dispatchBillingUpdate = () => {
    window.KARTOCHKA_BILLING_STATE = {
      summary: billingSummary,
      catalog: getBillingCatalog(),
    };

    window.dispatchEvent(new CustomEvent("kartochka:billing:update", {
      detail: window.KARTOCHKA_BILLING_STATE,
    }));
  };

  const setButtonCostLabel = (button, labelText, actionCode, options) => {
    if (!button) return;

    const buttonLabel = labelText || button.textContent || "";
    const cost = getBillingActionCost(actionCode);
    const balanceKnown = Boolean(billingSummary);
    const isDisabledForTokens = Boolean(actionCode) && balanceKnown && !hasEnoughTokens(actionCode);

    button.classList.toggle("btn-has-cost", Boolean(cost));
    button.classList.toggle("is-token-locked", isDisabledForTokens);
    button.dataset.billingActionCode = actionCode || "";

    button.textContent = "";

    const label = document.createElement("span");
    label.className = "btn-label";
    label.textContent = buttonLabel;
    button.append(label);

    if (cost) {
      const costNode = document.createElement("span");
      costNode.className = "btn-cost";
      costNode.textContent = formatTokenCount(cost);
      button.append(costNode);
    }

    if (options?.preserveDisabled !== false && isDisabledForTokens) {
      button.setAttribute("disabled", "disabled");
    }
  };

  const setBillingPromoStatus = (text, type) => {
    setStatusMessage(billingPromoStatus, text, type);
    billingPromoStatus?.classList.toggle("hidden", !text);
  };

  const syncBillingHeader = () => {
    const balance = getBillingBalanceTokens();
    const planId = toText(billingSummary?.account?.planId).toLowerCase() || "start";
    const plan = Array.isArray(getBillingCatalog()?.plans)
      ? getBillingCatalog().plans.find((entry) => toText(entry?.id).toLowerCase() === planId)
      : null;

    if (billingBalanceValue) {
      billingBalanceValue.textContent = billingSummaryLoading ? "..." : String(balance);
    }
    if (billingBalanceLabel) {
      billingBalanceLabel.textContent = activeUser ? (plan?.title || "Start") : "Подписка";
    }
    if (billingPlanLabel) {
      if (!activeUser) {
        billingPlanLabel.textContent = "Нужен вход";
      } else if (billingSummaryLoading) {
        billingPlanLabel.textContent = "токенов";
      } else {
        billingPlanLabel.textContent = "токенов";
      }
    }
    billingOpenBtn?.toggleAttribute("disabled", !activeUser);
  };

  const renderBillingPlans = () => {
    if (!billingPlans) return;
    billingPlans.textContent = "";

    const plans = Array.isArray(getBillingCatalog()?.plans) ? getBillingCatalog().plans : [];
    plans.forEach((plan) => {
      const card = document.createElement("article");
      card.className = "billing-option-card";
      card.classList.toggle("is-current", toText(plan.id) === toText(billingSummary?.account?.planId));

      const title = document.createElement("strong");
      title.textContent = plan.title || "План";

      const price = document.createElement("span");
      price.className = "billing-option-price";
      price.textContent = plan.priceLabel || "Скоро";

      const description = document.createElement("p");
      description.textContent = plan.description || "";

      const status = document.createElement("span");
      status.className = "billing-chip";
      status.textContent = card.classList.contains("is-current")
        ? "Текущий"
        : (plan.statusLabel || "Скоро");

      const action = document.createElement("button");
      action.className = "btn btn-outline billing-option-btn";
      action.type = "button";
      action.textContent = card.classList.contains("is-current")
        ? "Активен"
        : (plan.ctaLabel || "Скоро");
      action.setAttribute("disabled", "disabled");

      card.append(status, title, price, description, action);
      billingPlans.append(card);
    });
  };

  const renderBillingPackages = () => {
    if (!billingPackages) return;
    billingPackages.textContent = "";

    const items = Array.isArray(getBillingCatalog()?.tokenPackages) ? getBillingCatalog().tokenPackages : [];
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "billing-option-card";

      const title = document.createElement("strong");
      title.textContent = item.title || formatTokenCount(item.tokens);

      const price = document.createElement("span");
      price.className = "billing-option-price";
      price.textContent = item.priceLabel || "Скоро";

      const description = document.createElement("p");
      description.textContent = item.description || "";

      const tokenChip = document.createElement("span");
      tokenChip.className = "billing-chip";
      tokenChip.textContent = formatTokenCount(item.tokens);

      const action = document.createElement("button");
      action.className = "btn btn-outline billing-option-btn";
      action.type = "button";
      action.textContent = item.ctaLabel || "Скоро";
      action.setAttribute("disabled", "disabled");

      card.append(tokenChip, title, price, description, action);
      billingPackages.append(card);
    });
  };

  const renderBillingActionCosts = () => {
    if (!billingActionCosts) return;
    billingActionCosts.textContent = "";

    const actions = Array.isArray(getBillingCatalog()?.actions) ? getBillingCatalog().actions : [];
    actions.forEach((action) => {
      const row = document.createElement("div");
      row.className = "billing-action-row";

      const label = document.createElement("span");
      label.textContent = action.label || action.code || "Действие";

      const cost = document.createElement("strong");
      cost.textContent = formatTokenCount(action.tokens);

      row.append(label, cost);
      billingActionCosts.append(row);
    });
  };

  const renderBillingLedger = () => {
    if (!billingLedger) return;
    billingLedger.textContent = "";

    const entries = Array.isArray(billingSummary?.ledger) ? billingSummary.ledger : [];
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "billing-empty";
      empty.textContent = "Операции появятся после первых списаний или активации промокода.";
      billingLedger.append(empty);
      return;
    }

    entries.slice(0, 8).forEach((entry) => {
      const row = document.createElement("div");
      row.className = "billing-ledger-row";

      const main = document.createElement("div");
      main.className = "billing-ledger-main";

      const title = document.createElement("strong");
      title.textContent = entry?.label || "Операция";

      const meta = document.createElement("span");
      const createdAt = entry?.createdAt
        ? new Date(entry.createdAt).toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
      meta.textContent = createdAt || "—";

      const delta = document.createElement("strong");
      delta.className = "billing-ledger-delta";
      const tokensDelta = Number(entry?.tokensDelta) || 0;
      delta.textContent = (tokensDelta > 0 ? "+" : "") + String(tokensDelta) + " " + formatTokenWord(tokensDelta);
      delta.classList.toggle("is-positive", tokensDelta > 0);
      delta.classList.toggle("is-negative", tokensDelta < 0);

      main.append(title, meta);
      row.append(main, delta);
      billingLedger.append(row);
    });
  };

  const renderBillingSummary = () => {
    const account = billingSummary?.account || null;
    const balance = Number(account?.balanceTokens) || 0;
    const granted = Number(account?.totalGrantedTokens) || 0;
    const spent = Number(account?.totalSpentTokens) || 0;
    const planId = toText(account?.planId).toLowerCase() || "start";
    const plan = Array.isArray(getBillingCatalog()?.plans)
      ? getBillingCatalog().plans.find((entry) => toText(entry?.id).toLowerCase() === planId)
      : null;

    if (billingSummaryTokens) billingSummaryTokens.textContent = formatTokenCount(balance);
    if (billingSummaryPlan) billingSummaryPlan.textContent = plan?.title || "Start";
    if (billingSummaryGranted) billingSummaryGranted.textContent = String(granted);
    if (billingSummarySpent) billingSummarySpent.textContent = String(spent);

    renderBillingPlans();
    renderBillingPackages();
    renderBillingLedger();
    syncBillingHeader();
    dispatchBillingUpdate();
  };

  const refreshBillingSummary = async () => {
    const requestId = ++billingSummaryRequestId;
    const expectedUserId = activeUser?.uid || "";

    if (!activeUser || !serviceClient?.billingSummary) {
      if (requestId === billingSummaryRequestId) {
        billingSummary = null;
        billingSummaryLoading = false;
        renderBillingSummary();
        syncBillingHeader();
        dispatchBillingUpdate();
      }
      return null;
    }

    billingSummaryLoading = true;
    syncBillingHeader();

    try {
      const nextSummary = await serviceClient.billingSummary({});
      if (requestId !== billingSummaryRequestId || expectedUserId !== (activeUser?.uid || "")) {
        return null;
      }

      billingSummary = nextSummary;
      renderBillingSummary();
      return billingSummary;
    } catch (error) {
      if (requestId !== billingSummaryRequestId || expectedUserId !== (activeUser?.uid || "")) {
        return null;
      }

      billingSummary = null;
      renderBillingSummary();
      setBillingPromoStatus("", "");
      return null;
    } finally {
      if (requestId === billingSummaryRequestId && expectedUserId === (activeUser?.uid || "")) {
        billingSummaryLoading = false;
        syncBillingHeader();
        dispatchBillingUpdate();
      }
    }
  };

  const openBillingModal = () => {
    if (!billingModal) return;
    billingModal.classList.remove("hidden");
    billingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("billing-open");
  };

  const closeBillingModal = () => {
    if (!billingModal) return;
    billingModal.classList.add("hidden");
    billingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("billing-open");
  };

  const setCreateSecondaryBadge = (node, text, tone) => {
    if (!node) return;
    node.textContent = text || "";
    node.classList.remove("is-neutral", "is-active", "is-success", "is-warning", "is-error");
    node.classList.add(tone || "is-neutral");
  };

  const setRequestMeta = (node, title, value, type) => {
    if (!node) return;
    node.textContent = "";
    node.classList.remove("is-neutral", "is-active", "is-success", "is-error");

    const label = document.createElement("span");
    label.textContent = title;

    const strong = document.createElement("strong");
    strong.textContent = value;

    const tone = (() => {
      if (type === "error" || /ошиб/i.test(String(value || ""))) return "is-error";
      if (type === "success" || /готово/i.test(String(value || ""))) return "is-success";
      if (!String(value || "").trim() || /ожидани/i.test(String(value || ""))) return "is-neutral";
      return "is-active";
    })();

    node.classList.add(tone);
    node.append(label, strong);
  };

  const setCreateFlowStepState = (node, state, detail) => {
    if (!node) return;
    node.classList.remove("is-upcoming", "is-active", "is-done");
    node.classList.add(state || "is-upcoming");

    const detailNode = node.querySelector("small");
    if (!detailNode) return;

    detailNode.textContent = detail || detailNode.dataset.defaultText || "";
  };

  const setDoneState = (badge, isDone) => {
    if (!badge) return;

    if (!isDone) {
      badge.classList.remove("active", "is-pop");
      return;
    }

    badge.classList.remove("is-pop");
    badge.classList.add("active");
    void badge.offsetWidth;
    badge.classList.add("is-pop");
  };

  const toText = (value) => {
    return String(value || "").trim();
  };

  const toLowerText = (value) => {
    return toText(value).toLowerCase();
  };

  const SERVICE_ERROR_CODES = window.KARTOCHKA_SERVICES?.ERROR_CODES || {};
  const REQUEST_LIFECYCLE_NOTICE_WINDOW_MS = 20000;
  const isMobileLifecycleClient = (() => {
    const coarsePointer = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
    const userAgent = toLowerText(window.navigator?.userAgent || "");
    return coarsePointer || /android|iphone|ipad|ipod|mobile/.test(userAgent);
  })();
  let lastAppBackgroundAt = document.hidden ? Date.now() : 0;
  let lastAppForegroundAt = document.hidden ? 0 : Date.now();
  let lastAppOfflineAt = window.navigator?.onLine === false ? Date.now() : 0;
  let lastAppOnlineAt = window.navigator?.onLine === false ? 0 : Date.now();

  const getServiceErrorCode = (error) => {
    return toText(error?.code);
  };

  const createInterruptedRequestError = (message) => {
    const error = new Error(message || "Request interrupted");
    error.code = SERVICE_ERROR_CODES.interrupted || "request_interrupted";
    return error;
  };

  const isInterruptedRequestError = (error) => {
    const code = getServiceErrorCode(error);
    return code === toText(SERVICE_ERROR_CODES.interrupted) || code === "request_interrupted";
  };

  const hasRecentLifecycleInterruption = () => {
    const now = Date.now();
    return (
      (lastAppBackgroundAt && now - lastAppBackgroundAt <= REQUEST_LIFECYCLE_NOTICE_WINDOW_MS)
      || (lastAppForegroundAt && now - lastAppForegroundAt <= REQUEST_LIFECYCLE_NOTICE_WINDOW_MS)
      || (lastAppOfflineAt && now - lastAppOfflineAt <= REQUEST_LIFECYCLE_NOTICE_WINDOW_MS)
      || (lastAppOnlineAt && now - lastAppOnlineAt <= REQUEST_LIFECYCLE_NOTICE_WINDOW_MS)
    );
  };

  const resolveRequestErrorFeedback = (error, fallbackMessage, options) => {
    const code = getServiceErrorCode(error);
    const offlineNow = window.navigator?.onLine === false;
    const recoveryTimedOut = Boolean(error?.details?.recoveryTimedOut);
    const interruptedFallback = recoveryTimedOut
      ? "Соединение не восстановилось после возврата в приложение. Данные на экране сохранены, можно повторить запрос."
      : "Связь прервалась после сворачивания приложения. Данные на экране сохранены, можно повторить запрос.";

    if (isInterruptedRequestError(error) || (code === toText(SERVICE_ERROR_CODES.network) && hasRecentLifecycleInterruption())) {
      return {
        message: toText(options?.interruptedMessage) || interruptedFallback,
        type: "",
        metaValue: toText(options?.interruptedMeta) || "Запрос прерван после возврата",
        isInterrupted: true,
      };
    }

    if (offlineNow && code === toText(SERVICE_ERROR_CODES.network)) {
      return {
        message: toText(options?.offlineMessage) || "Соединение пропало. Когда интернет вернется, запрос можно повторить.",
        type: "",
        metaValue: toText(options?.offlineMeta) || "Нет соединения",
        isInterrupted: false,
      };
    }

    if (code === toText(SERVICE_ERROR_CODES.timeout)) {
      return {
        message: toText(options?.timeoutMessage) || "Запрос занял слишком много времени. Попробуйте еще раз при стабильной связи.",
        type: "error",
        metaValue: toText(options?.timeoutMeta) || "Превышено время ожидания",
        isInterrupted: false,
      };
    }

    if (code === toText(SERVICE_ERROR_CODES.network)) {
      return {
        message: toText(options?.networkMessage) || "Не удалось связаться с сервисом. Попробуйте еще раз.",
        type: "error",
        metaValue: toText(options?.networkMeta) || "Сбой соединения",
        isInterrupted: false,
      };
    }

    // If the server sent a specific userMessage (e.g. credits exhausted),
    // use it for both the displayed message and the meta label.
    const serverMessage = error instanceof Error && toText(error.message) ? error.message : "";
    const errorStatus = Number(error?.status);
    const isCreditsError = errorStatus === 402
      || toText(error?.code) === "text_replace_credits_exhausted"
      || (serverMessage.toLowerCase().includes("кредит") && serverMessage.toLowerCase().includes("ones_thunder"));
    if (isCreditsError) {
      const creditsMsg = serverMessage || "Кончились кредиты AI-сервиса. Обратитесь к @ones_thunder";
      return {
        message: creditsMsg,
        type: "error",
        metaValue: creditsMsg,
        isInterrupted: false,
      };
    }
    return {
      message: serverMessage || fallbackMessage,
      type: "error",
      metaValue: toText(options?.errorMeta) || fallbackMessage,
      isInterrupted: false,
    };
  };

  const formatLifecycleStatusMessage = (actionLabel, stage) => {
    if (stage === "background") {
      return "Приложение свернуто. " + actionLabel + " продолжится, когда вы вернетесь.";
    }
    if (stage === "offline") {
      return "Соединение пропало. " + actionLabel + " продолжится после восстановления сети.";
    }
    return "Соединение восстановлено. Продолжаем: " + actionLabel + ".";
  };

  const formatLifecycleMetaValue = (actionLabel, stage) => {
    if (stage === "background") {
      return actionLabel + ": приложение в фоне";
    }
    if (stage === "offline") {
      return actionLabel + ": ждем сеть";
    }
    return actionLabel + ": восстанавливаем соединение";
  };

  const buildActiveLifecycleRequestContexts = () => {
    const contexts = [];

    if (createAutofillPhase === "loading") {
      contexts.push({ statusNode: createStatus, metaNode: createMeta, actionLabel: "AI автозаполнение" });
    }
    if (createInsightPhase === "loading") {
      contexts.push({ statusNode: createInsightStatus, metaNode: createMeta, actionLabel: "AI-анализ товара" });
    }
    if (createAiPromptPhase === "loading") {
      contexts.push({ statusNode: createAiPromptStatus, metaNode: createMeta, actionLabel: "AI-промпт" });
    }
    if (createIsGenerating) {
      contexts.push({ statusNode: createStatus, metaNode: createMeta, actionLabel: "генерация карточки" });
    }
    if (improveAnalysisPhase === "loading") {
      contexts.push({ statusNode: improveAnalysisStatus, metaNode: improveMeta, actionLabel: "AI-анализ карточки" });
    }
    if (improveIsGenerating) {
      contexts.push({ statusNode: improveStatus, metaNode: improveMeta, actionLabel: "улучшение карточки" });
    }

    if (fourCardsIsGenerating) {
      contexts.push({ statusNode: fourCardsStatus, metaNode: fourCardsMeta, actionLabel: "генерация 4 карточек" });
    }

    return contexts;
  };

  const syncActiveLifecycleRequestStatus = (stage) => {
    if (!isMobileLifecycleClient) return;

    buildActiveLifecycleRequestContexts().forEach((context) => {
      setStatusMessage(context.statusNode, formatLifecycleStatusMessage(context.actionLabel, stage), "");
      if (context.metaNode) {
        setRequestMeta(context.metaNode, "Статус запроса:", formatLifecycleMetaValue(context.actionLabel, stage), "");
      }
    });
  };

  const isLocalHostname = (hostname) => {
    const normalized = toLowerText(hostname);
    return normalized === "localhost"
      || normalized === "127.0.0.1"
      || normalized === "0.0.0.0"
      || normalized === "[::1]";
  };

  const isPreviewHostname = (hostname) => {
    const normalized = toLowerText(hostname);
    return normalized.endsWith(".vercel.app") || normalized.endsWith(".vercel.dev");
  };

  const resolveDedicatedAppBaseUrl = () => {
    const explicitBaseUrl = toText(window.KARTOCHKA_APP_BASE_URL).replace(/\/+$/, "");
    if (explicitBaseUrl) return explicitBaseUrl;
    return toText(window.location.origin);
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

  const setAuthMode = (mode) => {
    const normalizedMode = mode === "register" ? "register" : "login";
    const isRegister = normalizedMode === "register";
    authEmailLoginTab?.classList.toggle("active", !isRegister);
    authEmailRegisterTab?.classList.toggle("active", isRegister);
    authEmailLoginTab?.setAttribute("aria-selected", String(!isRegister));
    authEmailRegisterTab?.setAttribute("aria-selected", String(isRegister));
    authEmailLoginPanel?.classList.toggle("active", !isRegister);
    authEmailRegisterPanel?.classList.toggle("active", isRegister);
  };

  const setAuthButtonsDisabled = (disabled) => {
    [googleAuthBtn, emailLoginBtn, emailRegisterBtn].forEach((button) => {
      if (!button) return;
      if (disabled) {
        button.setAttribute("disabled", "disabled");
      } else {
        button.removeAttribute("disabled");
      }
    });
  };

  const resolveAppMode = (mode) => {
    const source = String(mode || "").trim();
    const match = APP_MODES.find((item) => item.toLowerCase() === source.toLowerCase());
    return match || null;
  };

  const normalizeAppMode = (mode) => {
    return resolveAppMode(mode) || "create";
  };

  const buildAppHash = (mode) => {
    return APP_ROUTE_PREFIX + normalizeAppMode(mode);
  };

  const buildAppPath = (mode) => {
    const normalizedMode = normalizeAppMode(mode);
    return normalizedMode === "create" ? "/app" : "/app/" + normalizedMode;
  };

  const isDedicatedAppHost = () => /^\/app(?:\/|$)/i.test(window.location.pathname);

  const getDedicatedAppUrl = (mode) => {
    const baseUrl = resolveDedicatedAppBaseUrl();
    if (!baseUrl) return "";
    return baseUrl + buildAppPath(mode);
  };

  const parseAppModeFromPath = (pathname) => {
    const normalizedPath = toText(pathname || window.location.pathname).replace(/^\/+|\/+$/g, "");
    if (!normalizedPath) return "create";

    const segments = normalizedPath.split("/");
    const candidate = segments[0] === "app" ? (segments[1] || "create") : segments[0];
    return resolveAppMode(candidate);
  };

  const parseAppModeFromHash = (hash) => {
    if (typeof hash !== "string") {
      const legacyPathMode = parseAppModeFromPath();
      if (isDedicatedAppHost()) {
        return legacyPathMode;
      }
    }

    const sourceHash = typeof hash === "string" ? hash : window.location.hash || "";
    if (!sourceHash.startsWith(APP_ROUTE_PREFIX)) return null;
    return resolveAppMode(sourceHash.slice(APP_ROUTE_PREFIX.length).split(/[/?#]/)[0].trim());
  };

  const replaceHash = (nextHash) => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + nextHash
    );
  };

  const clearPublicAnchorHashOnBoot = () => {
    const currentHash = toText(window.location.hash);
    if (!currentHash || parseAppModeFromHash(currentHash)) return;
    replaceHash("");
    window.scrollTo(0, 0);
  };

  const replaceAppPath = (mode) => {
    const nextPath = buildAppPath(mode);
    window.history.replaceState(null, "", nextPath + window.location.search);
  };

  const replacePublicPath = (hash) => {
    const nextHash = typeof hash === "string" ? hash : "";
    window.history.replaceState(null, "", "/" + window.location.search + nextHash);
  };

  const setAppRouteBootstrapPending = (isPending) => {
    authRouteBootstrapPending = Boolean(isPending);
    document.body.classList.toggle("app-route-loading", authRouteBootstrapPending);
  };

  const openDedicatedApp = (mode, options) => {
    const targetUrl = getDedicatedAppUrl(mode);
    if (!targetUrl || isDedicatedAppHost()) return false;

    if (Boolean(options && options.replace)) {
      window.location.replace(targetUrl);
    } else {
      window.location.assign(targetUrl);
    }
    return true;
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

  const revealPublicViewImmediately = () => {
    if (!publicView) return;

    publicView.querySelectorAll(".reveal").forEach((node) => {
      node.classList.add("is-visible");
    });

    const statsSection = publicView.querySelector(".kartochka-stats-section");
    if (statsSection) {
      statsSection.classList.add("kartochka-stats-section-visible");

      const statsNumber = statsSection.querySelector(".kartochka-stats-number");
      const targetValue = Number(statsNumber?.dataset?.kartochkaStatsTarget || "0");
      if (statsNumber && targetValue > 0) {
        statsNumber.dataset.kartochkaStatsAnimated = "true";
        statsNumber.textContent = new Intl.NumberFormat("ru-RU")
          .format(targetValue)
          .replace(/\u00A0/g, "\u00A0\u00A0");
      }
    }
  };

  const openWorkspaceView = (user, mode) => {
    if (!workspace) return;

    publicView?.classList.add("hidden");
    publicView?.setAttribute("aria-hidden", "true");
    workspace.classList.remove("hidden");
    workspace.setAttribute("aria-hidden", "false");

    document.body.classList.add("workspace-active");
    syncWorkspaceUser(user || activeUser);
    closeAuthModal();
    closeMobileMenu();
    switchWorkspaceMode(normalizeAppMode(mode || activeMode));
  };

  const closeWorkspaceView = () => {
    if (!workspace) return;

    closeHistoryDetailsModal();
    closeCreateReferenceLibrary();
    closeCreateImageManagerModal();
    closeBillingModal();

    workspace.classList.add("hidden");
    workspace.setAttribute("aria-hidden", "true");
    if (publicView) {
      const shouldShowPublicView = !isDedicatedAppHost();
      publicView.classList.toggle("hidden", !shouldShowPublicView);
      publicView.setAttribute("aria-hidden", shouldShowPublicView ? "false" : "true");
      if (shouldShowPublicView) {
        revealPublicViewImmediately();
        replaceHash("");
        window.scrollTo(0, 0);
      }
    }

    document.body.classList.remove("workspace-active");
  };

  const switchWorkspaceMode = (mode) => {
    activeMode = normalizeAppMode(mode);

    if (activeMode !== "history") {
      closeHistoryDetailsModal();
    } else if (historyEntries.length) {
      if (!selectedHistoryEntryId) {
        selectedHistoryEntryId = historyEntries[0]?.id || "";
      }
      historyDetailsVisible = Boolean(selectedHistoryEntryId);
      renderHistoryDetails();
    }
    if (activeMode !== "create") {
      closeCreateReferenceLibrary();
      closeCreateImageManagerModal();
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
      if (isDedicatedAppHost()) {
        if (activeUser) {
          replaceAppPath(activeMode);
          openWorkspaceView(activeUser, activeMode);
        } else {
          closeWorkspaceView();
          setAuthMessage("Р’РѕР№РґРёС‚Рµ, С‡С‚РѕР±С‹ РѕС‚РєСЂС‹С‚СЊ РІРЅСѓС‚СЂРµРЅРЅРёР№ app", "");
          openAuthModal();
        }
        return true;
      }

      if (document.body.classList.contains("workspace-active")) {
        closeWorkspaceView();
      }
      return false;
    }

    if (!isDedicatedAppHost() && openDedicatedApp(routeMode, { replace: true })) {
      return true;
    }

    activeMode = routeMode;
    if (isDedicatedAppHost() && /^\/app(?:\/|$)/i.test(window.location.pathname)) {
      replaceAppPath(routeMode);
    }

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

    if (!isDedicatedAppHost() && openDedicatedApp(targetMode, { replace: useReplace })) {
      return;
    }

    if (isDedicatedAppHost()) {
      const targetPath = buildAppPath(targetMode);

      if (useReplace) {
        replaceAppPath(targetMode);
        handleAppHashRoute();
        return;
      }

      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, "", targetPath + window.location.search);
      }

      handleAppHashRoute();
      return;
    }

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
  const createOriginalFileDataUrls = new Map();
  const createTemplatePreviewDataUrls = new Map();

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
    createOriginalFileDataUrls.delete(key);
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Не удалось прочитать изображение."));
      reader.readAsDataURL(file);
    });
  };

  const readBlobAsDataUrl = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Не удалось подготовить изображение референса."));
      reader.readAsDataURL(blob);
    });
  };

  const loadImageElement = (sourceUrl, errorMessage) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(errorMessage || "Не удалось загрузить изображение."));
      image.src = sourceUrl;
    });
  };

  const waitForCreateResultImages = async (results, options) => {
    const urls = (Array.isArray(results) ? results : [])
      .map((result) => String(result?.previewUrl || "").trim())
      .filter(Boolean);
    const minimumCount = Number(options?.minimumCount || 1);
    if (urls.length < minimumCount) {
      throw new Error("Не удалось подготовить все изображения результата.");
    }

    await Promise.all(urls.map((url) =>
      loadImageElement(url, "Не удалось загрузить изображение результата.")
    ));
  };

  const buildOptimizedImageDataUrl = async (sourceUrl, options) => {
    const safeUrl = String(sourceUrl || "").trim();
    if (!safeUrl) return "";

    const fallbackUrl = String(options?.fallbackUrl || safeUrl).trim();
    const maxDimension = Number(options?.maxDimension) > 0 ? Number(options.maxDimension) : API_IMAGE_MAX_DIMENSION;
    const quality = Number(options?.quality) > 0 ? Number(options.quality) : API_IMAGE_JPEG_QUALITY;
    const outputMimeType = String(options?.outputMimeType || "image/jpeg").trim().toLowerCase();

    try {
      const image = await loadImageElement(safeUrl, options?.errorMessage || "Не удалось подготовить изображение.");
      const width = Number(image.naturalWidth || image.width || 0);
      const height = Number(image.naturalHeight || image.height || 0);
      if (!width || !height) return fallbackUrl;

      const scale = Math.min(1, maxDimension / Math.max(width, height));
      const targetWidth = Math.max(1, Math.round(width * scale));
      const targetHeight = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext("2d");
      if (!context) return fallbackUrl;
      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      if (outputMimeType === "image/png") {
        return canvas.toDataURL("image/png");
      }

      return canvas.toDataURL("image/jpeg", quality);
    } catch (error) {
      return fallbackUrl;
    }
  };

  const buildOptimizedFileDataUrl = async (file, errorMessage) => {
    if (!file) return "";

    const objectUrl = URL.createObjectURL(file);
    try {
      const optimized = await buildOptimizedImageDataUrl(objectUrl, {
        errorMessage,
        fallbackUrl: "",
        maxDimension: API_AI_IMAGE_MAX_DIMENSION,
        outputMimeType: API_AI_IMAGE_MIME_TYPE,
      });
      if (optimized) return optimized;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }

    return "";
  };

  const saveHistoryImageAsset = async (dataUrl, kind) => {
    const safeDataUrl = String(dataUrl || "").trim();
    if (!safeDataUrl || !/^data:image\//i.test(safeDataUrl) || typeof serviceClient?.historyAssetSave !== "function") {
      return "";
    }

    try {
      const saved = await serviceClient.historyAssetSave({
        dataUrl: safeDataUrl,
        kind: String(kind || "history-preview").trim() || "history-preview",
      });
      return String(saved?.url || "").trim();
    } catch (error) {
      return "";
    }
  };

  const buildHistoryImageSnapshot = async (sourceUrl, options) => {
    const safeUrl = String(sourceUrl || "").trim();
    if (!safeUrl) return "";
    if (!/^data:image\//i.test(safeUrl) && !/^blob:/i.test(safeUrl)) return safeUrl;

    try {
      const image = await loadImageElement(safeUrl);
      const width = Number(image.naturalWidth || image.width || 0);
      const height = Number(image.naturalHeight || image.height || 0);
      if (!width || !height) return safeUrl;

      const buildSnapshotAt = (quality) => {
        const canvas = document.createElement("canvas");
        canvas.width = HISTORY_IMAGE_WIDTH;
        canvas.height = HISTORY_IMAGE_HEIGHT;

        const context = canvas.getContext("2d");
        if (!context) return "";
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, HISTORY_IMAGE_WIDTH, HISTORY_IMAGE_HEIGHT);
        context.drawImage(image, 0, 0, HISTORY_IMAGE_WIDTH, HISTORY_IMAGE_HEIGHT);
        return canvas.toDataURL("image/jpeg", quality);
      };
      const estimateDataUrlBytes = (dataUrl) => {
        const body = String(dataUrl || "").split(",")[1] || "";
        return Math.floor((body.length * 3) / 4);
      };

      const attempts = [
        HISTORY_IMAGE_JPEG_QUALITY,
        0.76,
        0.7,
        0.64,
        0.58,
        0.52,
        0.46,
        0.4,
        0.34,
        0.28,
        0.22,
        0.18,
        0.14,
        0.1,
      ];
      if (options?.preferAsset) {
        let bestInlineSnapshot = "";
        for (const quality of [0.9, 0.84, 0.78, 0.72, 0.66, 0.6, 0.54, 0.48, 0.42, 0.36]) {
          const snapshot = buildSnapshotAt(quality);
          if (!snapshot) continue;
          if (!bestInlineSnapshot && estimateDataUrlBytes(snapshot) <= HISTORY_IMAGE_MAX_BYTES) {
            bestInlineSnapshot = snapshot;
          }
          const savedUrl = await saveHistoryImageAsset(snapshot, options.assetKind || "history-result-preview");
          if (savedUrl && /^https?:\/\//i.test(savedUrl)) return savedUrl;
        }
        if (bestInlineSnapshot) return bestInlineSnapshot;
      }

      let fallbackSnapshot = "";
      for (const quality of attempts) {
        const snapshot = buildSnapshotAt(quality);
        if (!snapshot) continue;
        fallbackSnapshot = snapshot;
        if (estimateDataUrlBytes(snapshot) <= HISTORY_IMAGE_MAX_BYTES) {
          return snapshot;
        }
      }

      return fallbackSnapshot || safeUrl;
    } catch (error) {
      return safeUrl;
    }
  };

  const getCreateFileDataUrl = async (file) => {
    const key = getCreateFileKey(file);
    if (createFileDataUrls.has(key)) {
      return createFileDataUrls.get(key) || "";
    }
    const dataUrl = await buildOptimizedFileDataUrl(file, "Не удалось подготовить изображение товара.");
    createFileDataUrls.set(key, dataUrl);
    return dataUrl;
  };

  const getCreateOriginalFileDataUrl = async (file) => {
    const key = getCreateFileKey(file);
    if (createOriginalFileDataUrls.has(key)) {
      return createOriginalFileDataUrls.get(key) || "";
    }
    const dataUrl = await readFileAsDataUrl(file);
    createOriginalFileDataUrls.set(key, dataUrl);
    return dataUrl;
  };

  const buildCreateImageDataUrls = async () => {
    const urls = await Promise.all(createSelectedFiles.map((file) => getCreateFileDataUrl(file)));
    const prepared = urls.filter(Boolean);
    if (createSelectedFiles.length > 0 && prepared.length !== createSelectedFiles.length) {
      throw new Error("Не удалось подготовить одно или несколько фото для AI. Оставьте PNG, JPG или WEBP и попробуйте другое изображение.");
    }
    return prepared;
  };

  const buildCreateOriginalImageDataUrls = async () => {
    const urls = await Promise.all(createSelectedFiles.map((file) => getCreateOriginalFileDataUrl(file)));
    const prepared = urls.filter(Boolean);
    if (createSelectedFiles.length > 0 && prepared.length !== createSelectedFiles.length) {
      throw new Error("Не удалось прочитать одно или несколько фото для режима замены текста.");
    }
    return prepared;
  };

  const getCreateTemplatePreviewDataUrl = async (previewUrl) => {
    const source = String(previewUrl || "").trim();
    if (!source) return "";
    if (/^data:image\//i.test(source)) return source;
    if (createTemplatePreviewDataUrls.has(source)) {
      return createTemplatePreviewDataUrls.get(source) || "";
    }

    try {
      const response = await fetch(source, { credentials: "same-origin" });
      if (!response.ok) throw new Error("Template preview request failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      let dataUrl = "";
      try {
        dataUrl = await buildOptimizedImageDataUrl(blobUrl, {
          errorMessage: "Не удалось подготовить изображение референса.",
          fallbackUrl: "",
          maxDimension: 1400,
          quality: 0.82,
        });
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
      if (!dataUrl) {
        dataUrl = await readBlobAsDataUrl(blob);
      }
      createTemplatePreviewDataUrls.set(source, dataUrl);
      return dataUrl;
    } catch (error) {
      createTemplatePreviewDataUrls.set(source, "");
      return "";
    }
  };

  const normalizeCreateTemplateTab = (value) => {
    const tab = String(value || "").trim().toLowerCase();
    return CREATE_TEMPLATE_TABS.has(tab) ? tab : "all";
  };

  const getCreateTemplateLibrary = () => {
    return [CREATE_BEST_INSTRUCTION_TEMPLATE, CREATE_TEXT_REPLACE_TEMPLATE, CREATE_DIRECT_PROMPT_TEMPLATE];
  };

  const getCreateSelectedTemplate = () => {
    const library = getCreateTemplateLibrary();
    return library.find((item) => item.id === createSelectedTemplateId) || library[0] || null;
  };

  const renderCreateModeChoices = () => {
    const controlsLocked = isCreateControlsLocked();
    const selectedTemplate = getCreateSelectedTemplate();

    if (createModeChoiceStrip) {
      createModeChoiceStrip.textContent = "";

      const button = document.createElement("button");
      button.className = "create-template-mode-trigger";
      button.type = "button";
      button.dataset.createTemplateModeTrigger = "true";
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-expanded", createModeChoiceModalOpen ? "true" : "false");
      button.toggleAttribute("disabled", controlsLocked);

      const label = document.createElement("span");
      label.className = "create-template-mode-trigger-label";
      label.textContent = "Режим";

      const value = document.createElement("strong");
      value.textContent = selectedTemplate?.title || "Выбрать";

      button.append(label, value);
      createModeChoiceStrip.append(button);
    }

    if (!createModeChoiceModalList) return;
    createModeChoiceModalList.textContent = "";

    getCreateTemplateLibrary().forEach((template) => {
      const button = document.createElement("button");
      button.className = "create-mode-choice-card";
      button.type = "button";
      button.dataset.createTemplateModeId = template.id;
      button.classList.toggle("is-active", template.id === createSelectedTemplateId);
      button.setAttribute("aria-pressed", template.id === createSelectedTemplateId ? "true" : "false");
      button.toggleAttribute("disabled", controlsLocked);

      const title = document.createElement("strong");
      title.textContent = template.title;

      const description = document.createElement("span");
      description.textContent = template.description || "";

      const status = document.createElement("small");
      status.textContent = template.id === createSelectedTemplateId ? "Выбран сейчас" : "Выбрать режим";

      button.append(title, description, status);
      createModeChoiceModalList.append(button);
    });
  };

  const isCreateDirectPromptTemplate = (template) => {
    return toText(template?.kind) === "custom-prompt";
  };

  const isCreateTextReplaceTemplate = (template) => {
    return toText(template?.kind) === "text-replace";
  };

  const usesCreateDirectGenerationPrompt = (template) => {
    return isCreateDirectPromptTemplate(template) || isCreateTextReplaceTemplate(template);
  };

  const isCreateDirectPromptSelected = () => {
    return isCreateDirectPromptTemplate(getCreateSelectedTemplate());
  };

  const isCreateInstructionTemplate = (template) => {
    return toText(template?.kind) === "instruction-template";
  };

  const usesCreateInstructionPromptFlow = (template) => {
    return toText(template?.promptFlow) === "gpt_instruction";
  };

  const syncCreateInstructionState = () => {
    if (!createInstructionState) return;
    createInstructionState.textContent = "";
  };


  const shouldUseCreateTemplatePreviewAsReference = (template) => {
    return Boolean(template) && template.usePreviewAsReference !== false;
  };

  const serializeCreateTemplate = (template) => {
    if (!template) return null;

    return {
      id: template.id,
      title: template.title,
      description: template.description,
      tab: template.tab,
      tags: Array.isArray(template.tags) ? template.tags.slice(0, 8) : [],
      sourceUrl: template.sourceUrl || "",
      sourceLabel: template.sourceLabel || "",
      kind: template.kind || "",
      promptFlow: template.promptFlow || "",
      instructionPrompt: toText(template.instructionPrompt),
      instructionPromptPath: toText(template.instructionPromptPath),
      instructionPromptLabel: toText(template.instructionPromptLabel),
      usePreviewAsReference: shouldUseCreateTemplatePreviewAsReference(template),
    };
  };

  const getCreateTemplateReferencePreviewUrl = async (template) => {
    if (!shouldUseCreateTemplatePreviewAsReference(template)) return "";
    return getCreateTemplatePreviewDataUrl(template?.previewUrl || "");
  };

  const getCreateTemplateKindLabel = (template) => {
    if (template?.kind === "custom-prompt") return "Ручной";
    if (template?.kind === "text-replace") return "Замена текста";
    if (template?.kind === "instruction-template") return "Адаптивный";
    if (template?.kind === "preset") return "Пресет";
    if (template?.tab === "reference") return "Референс";
    if (template?.tab === "promo") return "Промо";
    if (template?.tab === "clean") return "Чистый";
    return "Шаблон";
  };

  const getCreateTemplatePlaceholderText = (template) => {
    if (template?.kind === "custom-prompt") return "PROMPT";
    if (template?.kind === "text-replace") return "TXT";
    if (template?.kind === "instruction-template") return template?.title || "Лучший";
    const sourceLabel = String(template?.sourceLabel || "").trim();
    if (sourceLabel) return sourceLabel.slice(0, 3).toUpperCase();
    return "REF";
  };

  const getCreateProductTitleValue = () => {
    return (createProductTitle?.value || "").trim();
  };

  const getCreateProductShortDescriptionValue = () => {
    return (createProductShortDescription?.value || "").trim();
  };

  const getCreateProductThirdLevelTextValue = () => {
    return (createProductThirdLevelText?.value || "").trim();
  };

  const normalizeCreateCardTextLine = (value) => {
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/^[\s\-:+]+/, "")
      .replace(/[\s\-:+.,;!?]+$/, "")
      .trim();
  };

  const formatCreateCardFeatureLine = (item) => {
    const label = normalizeCreateCardTextLine(item?.label);
    const value = normalizeCreateCardTextLine(item?.value);

    if (label && value) {
      if (value.toLowerCase().includes(label.toLowerCase())) {
        return value;
      }

      return label.length <= 18 && value.length <= 24
        ? label + " " + value
        : label + ": " + value;
    }

    return value || label;
  };

  const buildCreateSellingFeatureLines = () => {
    const seen = new Set();

    return getCreateCharacteristicRows()
      .map((item) => formatCreateCardFeatureLine(item))
      .filter(Boolean)
      .filter((line) => {
        const key = line.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 4);
  };

  const pickCreateBadgeTextLine = (lines) => {
    const candidates = Array.isArray(lines) ? lines.filter(Boolean) : [];
    const badgePattern = /\d|гарант|скид|комплект|хит|премиум|защита|выгода|комфорт|мл|см|мм|кг|шт|мин|час|дн|лет/i;
    return candidates.find((line) => badgePattern.test(line)) || candidates[0] || "";
  };

  const getCreateCardTextLevels = () => {
    return {
      primary: getCreateProductTitleValue(),
      secondary: getCreateProductShortDescriptionValue(),
      tertiary: getCreateProductThirdLevelTextValue(),
    };
  };

  const buildCreateCardTextLevelsPayload = () => {
    const levels = getCreateCardTextLevels();
    return {
      primary: levels.primary,
      secondary: levels.secondary,
      tertiary: levels.tertiary,
    };
  };

  const buildCreateUserText = () => {
    if (isCreateTextReplaceTemplate(getCreateSelectedTemplate())) {
      return buildCreateTextReplaceSummary();
    }
    const levels = getCreateCardTextLevels();

    return [
      normalizeCreateCardTextLine(levels.primary),
      normalizeCreateCardTextLine(levels.secondary),
      normalizeCreateCardTextLine(levels.tertiary),
    ].filter(Boolean).join("\n");
  };

  const buildCreateContentCardText = () => {
    if (isCreateTextReplaceTemplate(getCreateSelectedTemplate())) {
      return buildCreateTextReplaceSummary();
    }
    const levels = getCreateCardTextLevels();

    return [
      levels.primary ? "Главный текст (нужно разместить на карточке): " + levels.primary : "",
      levels.secondary ? "Второй уровень текста (нужно разместить на карточке): " + levels.secondary : "",
      levels.tertiary ? "Третий уровень текста (нужно разместить на карточке): " + levels.tertiary : "",
    ].filter(Boolean).join("\n");
  };

  const buildCreateGenerationNotesValue = () => {
    return toText(createGenerationNotes?.value);
  };

  const ensureCreateTextReplaceRules = () => {
    if (!Array.isArray(createTextReplaceRules) || !createTextReplaceRules.length) {
      createTextReplaceRuleId += 1;
      createTextReplaceRules = [{ id: createTextReplaceRuleId, from: "", to: "" }];
      return;
    }
    const firstRule = createTextReplaceRules[0];
    createTextReplaceRules = [{
      id: Number(firstRule?.id) || 1,
      from: toText(firstRule?.from),
      to: toText(firstRule?.to),
    }];
  };

  const getCreateTextReplaceRules = () => {
    ensureCreateTextReplaceRules();
    return createTextReplaceRules
      .map((rule) => ({
        id: Number(rule?.id) || 0,
        from: toText(rule?.from),
        to: toText(rule?.to),
      }))
      .filter((rule) => rule.from || rule.to);
  };

  const buildCreateTextReplaceSummary = () => {
    const rules = getCreateTextReplaceRules();
    if (!rules.length) return "";
    return rules
      .map((rule) => "Заменить: \"" + rule.from + "\" → \"" + rule.to + "\"")
      .join("\n");
  };

  const buildCreateTextReplacePrompt = () => {
    const rules = getCreateTextReplaceRules();
    const replacementLines = rules.length
      ? rules.map((rule, index) => String(index + 1) + ') replace "' + rule.from + '" with "' + rule.to + '"').join("; ")
      : '1) replace "" with ""';

    return "Use the uploaded image as the exact visual source and preserve the entire card one to one: keep the product, packaging, composition, crop, perspective, lighting, colors, shadows, reflections, materials, background, decorative elements, badges, panels, typography style, text placement, text scale, line breaks and visual hierarchy as close to the original as possible. Do not redesign, restyle, recompose, enhance or simplify the card. Replace only these visible text fragments: "
      + replacementLines
      + ". Do not change any other text. Do not add any new words, labels or captions. If one of the source fragments is missing in the image, do not invent anything and leave the rest unchanged. Keep the image in a strict vertical 3:4 format and preserve the card appearance as faithfully as possible while updating only the requested text fragments.";
  };

  const renderCreateTextReplaceRules = () => {
    if (!createTextReplaceList) return;
    ensureCreateTextReplaceRules();
    createTextReplaceList.textContent = "";

    createTextReplaceRules.slice(0, 1).forEach((rule) => {
      const row = document.createElement("div");
      row.className = "create-text-replace-row";
      row.dataset.ruleId = String(rule.id);

      const fromField = document.createElement("label");
      fromField.className = "create-text-replace-field";
      const fromLabel = document.createElement("span");
      fromLabel.className = "field-label";
      fromLabel.textContent = "Текст, который заменить";
      const fromInput = document.createElement("textarea");
      fromInput.className = "create-text-replace-textarea";
      fromInput.value = rule.from;
      fromInput.placeholder = "Например: Ультра увлажнение";
      fromInput.dataset.replaceField = "from";
      fromInput.dataset.ruleId = String(rule.id);

      const toField = document.createElement("label");
      toField.className = "create-text-replace-field";
      const toLabel = document.createElement("span");
      toLabel.className = "field-label";
      toLabel.textContent = "На какой текст заменить";
      const toInput = document.createElement("textarea");
      toInput.className = "create-text-replace-textarea";
      toInput.value = rule.to;
      toInput.placeholder = "Например: Интенсивное питание";
      toInput.dataset.replaceField = "to";
      toInput.dataset.ruleId = String(rule.id);

      const actions = document.createElement("div");
      actions.className = "create-text-replace-row-actions";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-outline create-text-replace-remove";
      removeBtn.dataset.removeReplaceRule = String(rule.id);
      removeBtn.textContent = "Очистить";

      fromField.append(fromLabel, fromInput);
      toField.append(toLabel, toInput);
      actions.append(removeBtn);
      row.append(fromField, toField, actions);
      createTextReplaceList.append(row);
    });
  };

  const hasCreateSettingsControls = [
    createSettingAccentColor,
    createSettingReferenceStrength,
    createSettingVisualStyle,
    createSettingInfoDensity,
    createSettingReadabilityPriority,
    createSettingConversionPriority,
    createSettingAccentFormat,
    createSettingBackgroundMode,
    createSettingPreserveLayout,
  ].some(Boolean);

  const buildCreateSettingsPayload = () => {
    if (!hasCreateSettingsControls) {
      return {};
    }

    const getSelectedLabel = (selectElement) => String(selectElement?.selectedOptions?.[0]?.textContent || "").trim();

    return {
      ...createUsefulSettings,
      accentColorLabel: getSelectedLabel(createSettingAccentColor),
      referenceStrengthLabel: getSelectedLabel(createSettingReferenceStrength),
      visualStyleLabel: getSelectedLabel(createSettingVisualStyle),
      infoDensityLabel: getSelectedLabel(createSettingInfoDensity),
      readabilityPriorityLabel: getSelectedLabel(createSettingReadabilityPriority),
      conversionPriorityLabel: getSelectedLabel(createSettingConversionPriority),
      accentFormatLabel: getSelectedLabel(createSettingAccentFormat),
      backgroundModeLabel: getSelectedLabel(createSettingBackgroundMode),
    };
  };

  const normalizeCreateCharacteristicRows = (items) => {
    const externalNormalizer = window.CreateCharacteristicsComponent?.normalizeItems;
    if (typeof externalNormalizer === "function") {
      return externalNormalizer(items);
    }

    return (Array.isArray(items) ? items : [])
      .map((item, index) => ({
        id: String(item?.id || "metric-" + String(index + 1)),
        label: String(item?.label || ""),
        value: String(item?.value || ""),
        order: Number.isFinite(Number(item?.order)) ? Math.max(1, Math.floor(Number(item.order))) : index + 1,
      }))
      .sort((left, right) => left.order - right.order)
      .map((item, index) => ({
        ...item,
        order: index + 1,
      }));
  };

  const setCreateCharacteristicsState = (nextItems) => {
    const normalizedItems = normalizeCreateCharacteristicRows(nextItems);
    createCharacteristics.length = 0;
    normalizedItems.forEach((item) => {
      createCharacteristics.push({
        id: item.id,
        label: item.label,
        value: item.value,
        order: item.order,
      });
    });
  };

  const getCreateCharacteristicRows = () => {
    return normalizeCreateCharacteristicRows(createCharacteristics)
      .map((item) => ({
        id: item.id,
        label: String(item.label || "").trim(),
        value: String(item.value || "").trim(),
        order: Number.isFinite(Number(item.order)) ? Math.max(1, Math.floor(Number(item.order))) : 1,
      }))
      .filter((item) => item.label || item.value);
  };

  const getCreateAutofillInputError = () => {
    syncCreateLegacyFields();
    const hasImages = createSelectedFiles.length > 0;
    const hasContext = Boolean(
      toText(createProductTitle?.value)
      || toText(createProductShortDescription?.value)
      || toText(createProductThirdLevelText?.value)
      || toText(createDescription?.value)
      || toText(createHighlights?.value)
    );

    if (hasImages || hasContext) return "";
    return "Для AI автозаполнения добавьте фото товара или короткое описание.";
  };

  const getCreateAutofillPresetPriority = (categoryValue) => {
    const category = toLowerText(categoryValue);

    if (/beauty|уход|космет|сыворот|крем/.test(category)) {
      return ["Объём", "Цвет", "Комплектация", "Материал"];
    }
    if (/tech|электрон|кабел|заряд|наушник|гаджет/.test(category)) {
      return ["Размер", "Вес", "Комплектация", "Цвет"];
    }
    if (/food|еда|напит|чай|кофе|fmcg/.test(category)) {
      return ["Вес", "Объём", "Комплектация", "Цвет"];
    }
    return Array.from(CREATE_AI_AUTOFILL_PRESET_LABELS);
  };

  const getCreateAutofillSourceText = (payload, analysis) => {
    return [
      toText(createProductTitle?.value),
      toText(createProductShortDescription?.value),
      toText(createProductThirdLevelText?.value),
      toText(payload?.title),
      toText(payload?.shortDescription || payload?.subtitle),
      toText(analysis?.subjectOnScreen?.summary),
      toText(analysis?.subjectOnScreen?.productIdentity),
      toText(analysis?.subjectOnScreen?.productType),
      toText(analysis?.subjectOnScreen?.visualEvidence),
      toText(analysis?.detectedCategory),
      toText(analysis?.insight?.category),
      ...(Array.isArray(analysis?.autofill?.benefits) ? analysis.autofill.benefits.map((item) => toText(item)) : []),
      ...(Array.isArray(payload?.characteristics)
        ? payload.characteristics.flatMap((item) => [toText(item?.label), toText(item?.value)])
        : []),
      ...(Array.isArray(analysis?.autofill?.characteristics)
        ? analysis.autofill.characteristics.flatMap((item) => [toText(item?.label), toText(item?.value)])
        : []),
      ...createSelectedFiles.map((file) => toText(file?.name)),
    ]
      .filter(Boolean)
      .join(" ");
  };

  const extractCreateAutofillCharacteristicValue = (label, sourceText) => {
    const rawSource = String(sourceText || "");
    const normalizedSource = toLowerText(rawSource);

    if (!rawSource) return "";

    if (label === "Материал") {
      const materialKeyword = CREATE_AI_AUTOFILL_MATERIAL_KEYWORDS.find((item) => normalizedSource.includes(item));
      return materialKeyword ? materialKeyword.replace(/(^|\s)\S/g, (char) => char.toUpperCase()) : "";
    }

    if (label === "Размер") {
      const dimensionMatch = rawSource.match(/(\d+(?:[.,]\d+)?\s?(?:x|х|×)\s?\d+(?:[.,]\d+)?(?:\s?(?:x|х|×)\s?\d+(?:[.,]\d+)?)?\s?(?:мм|см|м)?)/i);
      if (dimensionMatch?.[1]) return dimensionMatch[1].replace(/\s+/g, " ").trim();

      const apparelSizeMatch = rawSource.match(/\b(XXL|XL|L|M|S|XS)\b/i);
      return apparelSizeMatch?.[1] ? apparelSizeMatch[1].toUpperCase() : "";
    }

    if (label === "Цвет") {
      const colorKeyword = CREATE_AI_AUTOFILL_COLOR_KEYWORDS.find((item) => normalizedSource.includes(item));
      return colorKeyword ? colorKeyword.replace(/(^|\s)\S/g, (char) => char.toUpperCase()) : "";
    }

    if (label === "Вес") {
      const weightMatch = rawSource.match(/(\d+(?:[.,]\d+)?)\s?(кг|г)\b/i);
      return weightMatch ? (weightMatch[1] + " " + weightMatch[2]).replace(/\s+/g, " ").trim() : "";
    }

    if (label === "Объём") {
      const volumeMatch = rawSource.match(/(\d+(?:[.,]\d+)?)\s?(мл|л)\b/i);
      return volumeMatch ? (volumeMatch[1] + " " + volumeMatch[2]).replace(/\s+/g, " ").trim() : "";
    }

    if (label === "Комплектация") {
      const packageMatch = rawSource.match(/(?:комплектация|в комплекте|includes?)\s*[:\-]?\s*([^.\n]+)/i);
      if (packageMatch?.[1]) return packageMatch[1].replace(/\s+/g, " ").trim();

      const countMatch = rawSource.match(/(\d+)\s?(шт|предмет|предмета|предметов)\b/i);
      return countMatch ? (countMatch[1] + " " + countMatch[2]).replace(/\s+/g, " ").trim() : "";
    }

    return "";
  };

  const containsCreateCardDescriptionLanguage = (value) => {
    const normalizedValue = toLowerText(value);
    if (!normalizedValue) return false;
    return CREATE_PRODUCT_DESCRIPTION_BLOCKLIST.some((token) => normalizedValue.includes(token));
  };

  const sanitizeCreateProductDescriptionText = (value) => {
    const normalizedValue = toText(value).replace(/\s+/g, " ").trim();
    if (!normalizedValue) return "";

    const fragments = normalizedValue
      .split(/[.!?\n]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => !containsCreateCardDescriptionLanguage(item));

    if (!fragments.length) return "";

    const result = fragments.join(". ");
    return result.endsWith(".") ? result : result + ".";
  };

  const resolveCreateProductDescriptionCandidate = (...values) => {
    for (const value of values) {
      const sanitized = sanitizeCreateProductDescriptionText(value);
      if (sanitized) return sanitized;
    }
    return "";
  };

  const buildCreateAutofillTitle = (analysis, payload) => {
    const aiTitle = toText(analysis?.autofill?.title);
    if (aiTitle) return aiTitle;

    const headlineCandidates = Array.isArray(analysis?.headlineIdeas)
      ? analysis.headlineIdeas.map((item) => toText(item)).filter(Boolean)
      : [];

    if (headlineCandidates.length) return headlineCandidates[0];

    const descriptionText = toText(payload?.description);
    if (descriptionText) return descriptionText.split(/[.!?]/)[0].trim();

    return toText(analysis?.detectedCategory || analysis?.insight?.category || "Товар");
  };

  const normalizeCreateAutofillLevelLines = (value) => {
    const sourceItems = Array.isArray(value)
      ? value
      : String(value || "").split(/\r?\n+/g);

    return sourceItems
      .map((item) => toText(item))
      .map((item) => item.replace(/^level\s*[123]\s*:?\s*/i, ""))
      .map((item) => item.replace(/^[-*•–—\d.)\s]+/, ""))
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const buildCreateAutofillTextLevels = (analysis, payload) => {
    const explicitLevels = analysis?.cardTextLevels && typeof analysis.cardTextLevels === "object"
      ? analysis.cardTextLevels
      : {};

    const primaryLines = normalizeCreateAutofillLevelLines(explicitLevels.primary || analysis?.level1 || analysis?.levelOne);
    const secondaryLines = normalizeCreateAutofillLevelLines(explicitLevels.secondary || analysis?.level2 || analysis?.levelTwo);
    const tertiaryLines = normalizeCreateAutofillLevelLines(explicitLevels.tertiary || analysis?.level3 || analysis?.levelThree);

    return {
      primary: primaryLines.join("\n") || buildCreateAutofillTitle(analysis, payload),
      secondary: secondaryLines.join("\n") || buildCreateAutofillDescription(analysis, payload),
      tertiary: tertiaryLines.join("\n"),
    };
  };

  const buildCreateAutofillDescription = (analysis, payload) => {
    const aiDescription = resolveCreateProductDescriptionCandidate(
      analysis?.autofill?.shortDescription,
      analysis?.autofill?.subtitle
    );
    if (aiDescription) {
      return aiDescription;
    }

    const subjectSummary = resolveCreateProductDescriptionCandidate(
      analysis?.subjectOnScreen?.summary,
      analysis?.subjectOnScreen?.productIdentity,
      analysis?.subjectOnScreen?.productType
    );
    const characteristicItems = Array.isArray(analysis?.autofill?.characteristics) && analysis.autofill.characteristics.length
      ? analysis.autofill.characteristics
      : (Array.isArray(payload?.characteristics) ? payload.characteristics : []);
    const characteristicSummary = characteristicItems
      .map((item) => [toText(item?.label), toText(item?.value)].filter(Boolean).join(": "))
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");
    const benefitSummary = Array.isArray(analysis?.autofill?.benefits)
      ? analysis.autofill.benefits.map((item) => toText(item)).filter(Boolean).slice(0, 2).join(". ")
      : "";
    const category = sanitizeCreateProductDescriptionText(analysis?.detectedCategory || analysis?.insight?.category);
    const text = resolveCreateProductDescriptionCandidate(
      [subjectSummary, benefitSummary, characteristicSummary, category].filter(Boolean).join(". "),
      [subjectSummary, characteristicSummary, category].filter(Boolean).join(". "),
      [subjectSummary, benefitSummary, category].filter(Boolean).join(". "),
      subjectSummary,
      characteristicSummary,
      category
    );

    return text;
  };

  const mergeCreateAutofillCharacteristics = (suggestedItems) => {
    const currentItems = normalizeCreateCharacteristicRows(createCharacteristics);
    const mergedItems = currentItems.map((item) => ({ ...item }));
    const labelLookup = new Map(
      mergedItems
        .map((item, index) => [toLowerText(item.label), index])
        .filter((item) => item[0])
    );

    suggestedItems.forEach((item) => {
      const normalizedLabel = toLowerText(item.label);
      if (!normalizedLabel) return;

      const existingIndex = labelLookup.get(normalizedLabel);
      if (Number.isInteger(existingIndex) && existingIndex >= 0) {
        const currentItem = mergedItems[existingIndex];
        if (!toText(currentItem.value) && toText(item.value)) {
          currentItem.value = toText(item.value);
        }
        return;
      }

      mergedItems.push({
        id: "",
        label: toText(item.label),
        value: toText(item.value),
        order: mergedItems.length + 1,
      });
      labelLookup.set(normalizedLabel, mergedItems.length - 1);
    });

    return normalizeCreateCharacteristicRows(mergedItems);
  };

  const buildCreateAutofillCharacteristics = (analysis, payload) => {
    const aiCharacteristics = Array.isArray(analysis?.autofill?.characteristics)
      ? analysis.autofill.characteristics
          .map((item) => ({
            id: "",
            label: toText(item?.label),
            value: toText(item?.value),
            order: Number(item?.order) || 0,
          }))
          .filter((item) => item.label || item.value)
      : [];

    if (aiCharacteristics.length) {
      return mergeCreateAutofillCharacteristics(aiCharacteristics);
    }

    const sourceText = getCreateAutofillSourceText(payload, analysis);
    const priorityLabels = getCreateAutofillPresetPriority(analysis?.detectedCategory || analysis?.insight?.category);
    const suggestions = [];

    priorityLabels.forEach((label) => {
      const value = extractCreateAutofillCharacteristicValue(label, sourceText);
      if (value) {
        suggestions.push({
          id: "",
          label,
          value,
          order: suggestions.length + 1,
        });
      }
    });

    if (!suggestions.length) {
      priorityLabels.slice(0, 3).forEach((label) => {
        suggestions.push({
          id: "",
          label,
          value: "",
          order: suggestions.length + 1,
        });
      });
    }

    return mergeCreateAutofillCharacteristics(suggestions);
  };

  const buildCreateAutofillPayload = async () => {
    const imageDataUrls = await buildCreateImageDataUrls();
    return {
      analysisIntent: "full",
      autofillInstructionPromptPath: CREATE_AUTOFILL_TEXTS_INSTRUCTION_PATH,
      files: createSelectedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
      })),
      imagePreviewUrls: imageDataUrls,
      imageDataUrls,
    };
  };

  const buildCreateCharacteristicsSummary = () => {
    const rows = getCreateCharacteristicRows();
    if (!rows.length) return "";
    return "Характеристики: " + rows.map((item) => item.label + " — " + item.value).join(", ");
  };

  const buildCreateCharacteristicsSummaryClean = () => {
    const rows = getCreateCharacteristicRows();
    if (!rows.length) return "";
    return "Характеристики: " + rows.map((item) => [item.label, item.value].filter(Boolean).join(": ")).join(", ");
  };

  const buildCreateSettingsSummary = () => {
    if (!hasCreateSettingsControls) return "";

    const flags = [];
    const accentColorLabel = createSettingAccentColor?.selectedOptions?.[0]?.textContent || "";
    const visualStyleLabel = createSettingVisualStyle?.selectedOptions?.[0]?.textContent || "";
    const accentFormatLabel = createSettingAccentFormat?.selectedOptions?.[0]?.textContent || "";
    const backgroundModeLabel = createSettingBackgroundMode?.selectedOptions?.[0]?.textContent || "";
    const referenceStrengthLabel = createSettingReferenceStrength?.selectedOptions?.[0]?.textContent || "";

    if (accentColorLabel) flags.push("акцентный цвет " + accentColorLabel.trim());
    if (visualStyleLabel) flags.push("стиль " + visualStyleLabel.trim());
    if (accentFormatLabel) flags.push("формат акцента " + accentFormatLabel.trim());
    if (backgroundModeLabel) flags.push("фон " + backgroundModeLabel.trim());
    if (referenceStrengthLabel) flags.push("сила референса " + referenceStrengthLabel.trim());
    if (createUsefulSettings.preserveReferenceLayout) flags.push("сохранить компоновку референса");
    return flags.length ? "Настройки: " + flags.join(", ") : "";
  };

  const getCreateProductTypeOption = () => {
    return CREATE_PRODUCT_ROUTING_OPTIONS[createProductTypeId]
      || CREATE_PRODUCT_ROUTING_OPTIONS.general_product
      || null;
  };

  const getCreateProductAngleOptions = () => {
    const productType = getCreateProductTypeOption();
    return Array.isArray(productType?.angles) ? productType.angles : [];
  };

  const ensureCreateProductAngleSelection = () => {
    const angles = getCreateProductAngleOptions();
    if (!angles.length) {
      createProductAngleId = "";
      return null;
    }

    const selectedAngle = angles.find((item) => item.id === createProductAngleId) || angles[0];
    createProductAngleId = selectedAngle.id;
    return selectedAngle;
  };

  const getCreateSelectedProductAngleOption = () => {
    return ensureCreateProductAngleSelection();
  };

  const buildCreateProductContextPayload = () => {
    const productType = getCreateProductTypeOption();
    const angle = getCreateSelectedProductAngleOption();

    return {
      productTypeId: productType?.id || "",
      productType: productType?.label || "",
      productTypeHint: productType?.hint || "",
      productAngleId: angle?.id || "",
      productAngle: angle?.title || "",
      productAngleDescription: angle?.description || "",
      productAnglePrompt: angle?.prompt || "",
    };
  };

  const buildCreateProductContextSummary = () => {
    const context = buildCreateProductContextPayload();
    return [
      context.productType ? "Тип товара: " + context.productType : "",
      context.productTypeHint ? "режим: " + context.productTypeHint : "",
      context.productAngle ? "ракурс: " + context.productAngle : "",
      context.productAnglePrompt,
    ].filter(Boolean).join(". ");
  };

  const getCreateProductModeDisplayLabel = () => {
    return createProductTypeId === "clothing_and_shoes"
      ? "Одежда / обувь"
      : "Не одежда / обувь";
  };

  const buildCreateProductRoutingSummary = () => {
    const angle = getCreateSelectedProductAngleOption();
    return [
      getCreateProductModeDisplayLabel(),
      angle?.title || "",
      "3:4",
    ].filter(Boolean).join(" • ");
  };

  const setCreateResultsProcessingStage = (stageKey) => {
    const stage = CREATE_RESULTS_PROCESSING_STAGES[stageKey] || CREATE_RESULTS_PROCESSING_STAGES.analyzing;
    const orderedStages = ["analyzing", "planning", "generating"];
    const stageProgressMap = {
      analyzing: 0,
      planning: 1,
      generating: 2,
      finalizing: 2,
    };
    const activeIndex = stageProgressMap[stageKey] ?? 0;
    const productContext = buildCreateProductContextPayload();

    if (createProcessingKicker) {
      createProcessingKicker.textContent = stage.kicker;
    }
    if (createProcessingTitle) {
      createProcessingTitle.textContent = stage.title;
    }
    if (createProcessingText) {
      createProcessingText.textContent = stage.text;
    }
    if (createProcessingModePill) {
      createProcessingModePill.textContent = createProductTypeId === "clothing_and_shoes"
        ? "Одежда / обувь"
        : "Товар";
    }
    if (createProcessingAnglePill) {
      createProcessingAnglePill.textContent = productContext.productAngle || "Ракурс";
    }

    createProcessingSteps.forEach((node, index) => {
      const stepKey = String(node.dataset.createProcessingStep || "");
      const stepIndex = orderedStages.indexOf(stepKey);
      node.classList.toggle("is-active", stepIndex === activeIndex);
      node.classList.toggle("is-complete", activeIndex >= 0 && stepIndex >= 0 && stepIndex < activeIndex);
      node.classList.toggle("is-dimmed", activeIndex >= 0 && stepIndex > activeIndex);
    });
  };

  const buildCreateTemplateSummary = () => {
    const template = getCreateSelectedTemplate();
    const productContext = buildCreateProductContextSummary();
    if (!template && !productContext) return "";
    return [
      template ? "Шаблон: " + template.title + ". " + template.description : "",
      productContext,
    ].filter(Boolean).join(". ");
  };

  const syncCreateUsefulSettings = () => {
    if (!hasCreateSettingsControls) {
      Object.assign(createUsefulSettings, CREATE_USEFUL_SETTINGS_DEFAULTS);
      return;
    }

    createUsefulSettings.accentColor = String(createSettingAccentColor?.value || CREATE_USEFUL_SETTINGS_DEFAULTS.accentColor);
    createUsefulSettings.referenceStrength = String(createSettingReferenceStrength?.value || CREATE_USEFUL_SETTINGS_DEFAULTS.referenceStrength);
    createUsefulSettings.visualStyle = String(createSettingVisualStyle?.value || CREATE_USEFUL_SETTINGS_DEFAULTS.visualStyle);
    createUsefulSettings.infoDensity = String(createSettingInfoDensity?.value || CREATE_USEFUL_SETTINGS_DEFAULTS.infoDensity);
    createUsefulSettings.readabilityPriority = String(
      createSettingReadabilityPriority?.value || CREATE_USEFUL_SETTINGS_DEFAULTS.readabilityPriority
    );
    createUsefulSettings.conversionPriority = String(
      createSettingConversionPriority?.value || CREATE_USEFUL_SETTINGS_DEFAULTS.conversionPriority
    );
    createUsefulSettings.accentFormat = String(createSettingAccentFormat?.value || CREATE_USEFUL_SETTINGS_DEFAULTS.accentFormat);
    createUsefulSettings.backgroundMode = String(createSettingBackgroundMode?.value || CREATE_USEFUL_SETTINGS_DEFAULTS.backgroundMode);
    createUsefulSettings.preserveReferenceLayout = Boolean(createSettingPreserveLayout?.checked);
  };

  const syncCreateLegacyFields = () => {
    syncCreateUsefulSettings();

    const cardTextLevels = getCreateCardTextLevels();
    const descriptionParts = [cardTextLevels.primary, cardTextLevels.secondary, cardTextLevels.tertiary].filter(Boolean);
    const highlightParts = [
      buildCreateTemplateSummary(),
      buildCreateCharacteristicsSummaryClean(),
      buildCreateSettingsSummary(),
    ].filter(Boolean);

    if (createDescription) {
      createDescription.value = descriptionParts.join(". ");
    }
    if (createHighlights) {
      createHighlights.value = highlightParts.join(". ");
    }
  };

  const createCharacteristicDraft = () => {
    return {
      id: "metric-" + String(Date.now()),
      label: "",
      value: "",
      order: createCharacteristics.length + 1,
    };
  };

  const renderCreateCharacteristics = () => {
    createCharacteristicsComponent?.setItems(createCharacteristics, { silent: true });
    if (createCharacteristicsComponent) return;
    if (!createCharacteristicsList) return;

    createCharacteristicsList.textContent = "";

    createCharacteristics.forEach((item) => {
      const row = document.createElement("div");
      row.className = "create-characteristic-row";
      row.dataset.characteristicId = item.id;

      const labelInput = document.createElement("input");
      labelInput.type = "text";
      labelInput.className = "create-characteristic-input";
      labelInput.placeholder = "Метрика";
      labelInput.value = item.label;
      labelInput.dataset.characteristicField = "label";
      labelInput.dataset.characteristicId = item.id;
      labelInput.toggleAttribute("disabled", isCreateControlsLocked());

      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.className = "create-characteristic-input";
      valueInput.placeholder = "Значение";
      valueInput.value = item.value;
      valueInput.dataset.characteristicField = "value";
      valueInput.dataset.characteristicId = item.id;
      valueInput.toggleAttribute("disabled", isCreateControlsLocked());

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "create-characteristic-remove";
      removeBtn.dataset.removeCharacteristicId = item.id;
      removeBtn.textContent = "Удалить";
      removeBtn.toggleAttribute("disabled", isCreateControlsLocked());

      row.append(labelInput, valueInput, removeBtn);
      createCharacteristicsList.append(row);
    });

    createCharacteristicsEmpty?.classList.toggle("hidden", createCharacteristics.length > 0);
  };

  const initCreateCharacteristicsComponent = () => {
    if (createCharacteristicsComponent || !createCharacteristicsList || !window.CreateCharacteristicsComponent?.create) {
      return;
    }

    createCharacteristicsComponent = window.CreateCharacteristicsComponent.create({
      listElement: createCharacteristicsList,
      emptyElement: createCharacteristicsEmpty,
      presetsElement: createCharacteristicPresets,
      addButton: createAddCharacteristicBtn,
      initialItems: createCharacteristics,
      getDisabled: () => isCreateControlsLocked(),
      onChange: (nextItems, meta) => {
        setCreateCharacteristicsState(nextItems);
        syncCreateLegacyFields();
        renderCreatePreviewPanel();

        if (meta?.commit) {
          handleCreateInputMutation();
        }
      },
    });
  };

  const getFilteredCreateTemplates = () => {
    const query = createTemplateSearchQuery;
    const activeTab = normalizeCreateTemplateTab(createActiveTemplateTab);

    return getCreateTemplateLibrary().filter((item) => {
      if (activeTab !== "all" && item.tab !== activeTab) return false;
      if (!query) return true;
      const haystack = [item.title, item.description, ...(Array.isArray(item.tags) ? item.tags : [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  };

  const appendCreateTemplateThumb = (container, template, imageElement, placeholderElement) => {
    if (!container) return;

    const previewUrl = String(template?.previewUrl || "").trim();
    const placeholderText = getCreateTemplatePlaceholderText(template);
    const isEmptyVisual = !previewUrl && !placeholderText;
    const isTitleOnlyPlaceholder = !previewUrl && toText(template?.kind) === "instruction-template";
    container.classList.toggle("is-placeholder", !previewUrl);
    container.classList.toggle("is-empty-visual", isEmptyVisual);
    container.classList.toggle("is-title-only", isTitleOnlyPlaceholder);

    if (imageElement && placeholderElement) {
      imageElement.classList.toggle("hidden", !previewUrl);
      placeholderElement.textContent = placeholderText;
      placeholderElement.classList.toggle("hidden", Boolean(previewUrl) || isEmptyVisual);

      if (previewUrl) {
        imageElement.src = previewUrl;
        imageElement.alt = template?.title || "Шаблон";
      } else {
        imageElement.removeAttribute("src");
      }

      imageElement.onerror = () => {
        imageElement.classList.add("hidden");
        imageElement.removeAttribute("src");
        placeholderElement.classList.remove("hidden");
      };
      return;
    }

    container.textContent = "";
    container.classList.toggle("is-placeholder", !previewUrl);
    container.classList.toggle("is-empty-visual", isEmptyVisual);
    container.classList.toggle("is-title-only", isTitleOnlyPlaceholder);

    if (previewUrl) {
      const image = document.createElement("img");
      image.src = previewUrl;
      image.alt = template?.title || "Шаблон";
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.remove();
        container.classList.add("is-placeholder");
        const fallback = document.createElement("span");
        fallback.className = "create-template-thumb-placeholder";
        fallback.textContent = placeholderText;
        container.append(fallback);
      }, { once: true });
      container.append(image);
      return;
    }

    if (isEmptyVisual) {
      return;
    }

    const fallback = document.createElement("span");
    fallback.className = "create-template-thumb-placeholder";
    fallback.textContent = placeholderText;
    container.append(fallback);
  };

  const renderCreateTemplateTagChips = (container, template, limit) => {
    if (!container) return;
    container.textContent = "";

    const tags = Array.isArray(template?.tags)
      ? template.tags.map((item) => String(item || "").trim()).filter(Boolean).slice(0, limit || 4)
      : [];

    tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "create-template-tag";
      chip.textContent = tag;
      container.append(chip);
    });
  };

  const renderCreateSelectedTemplateSummary = () => {
    const template = getCreateSelectedTemplate();
    const isDirectPrompt = isCreateDirectPromptTemplate(template);
    const isTextReplace = isCreateTextReplaceTemplate(template);
    const isInstructionTemplate = isCreateInstructionTemplate(template);
    const needsInitialTextReplaceRender =
      Boolean(isTextReplace)
      && Boolean(createTextReplaceList)
      && (!createTextReplaceList.children.length || createTextReplacePanel?.classList.contains("hidden"));
    const selectedTemplateThumb = createSelectedTemplateThumbPlaceholder?.parentElement || null;

    if (createSelectedTemplateTitle) {
      createSelectedTemplateTitle.textContent = template?.title || "Выберите шаблон";
    }
    if (createSelectedTemplateDescription) {
      createSelectedTemplateDescription.textContent = template?.description
        || "Выберите режим генерации.";
    }
    if (createReferenceLibraryBtn) {
      createReferenceLibraryBtn.textContent = template ? "Сменить режим" : "Выбрать режим";
    }
    renderCreateModeChoices();

    if (selectedTemplateThumb) {
      appendCreateTemplateThumb(
        selectedTemplateThumb,
        template,
        createSelectedTemplateThumbImage,
        createSelectedTemplateThumbPlaceholder
      );
    }
    if (createSelectedTemplateTags) {
      createSelectedTemplateTags.textContent = "";
      createSelectedTemplateTags.classList.add("hidden");
    }

    if (createSelectedTemplateCard) {
      createSelectedTemplateCard.title = isDirectPrompt
        ? "Сейчас выбран режим «Свой промт»"
        : isTextReplace
          ? "Сейчас выбран режим «Сохранение карточки»"
        : isInstructionTemplate
          ? "Сейчас выбран шаблон «Лучший»"
          : (template?.sourceUrl || template?.title || "Открыть библиотеку шаблонов");
      createSelectedTemplateCard.classList.toggle("hidden", isDirectPrompt);
      createSelectedTemplateCard.classList.remove("is-text-only");
      createSelectedTemplateCard.classList.toggle("is-with-parameters", isInstructionTemplate || isTextReplace);
    }
    renderCreateProductRouting();
    createInstructionTemplatePanel?.classList.toggle("hidden", !isInstructionTemplate);
    createTextReplacePanel?.classList.toggle("hidden", !isTextReplace);
    createProductTextFields?.classList.toggle("hidden", isTextReplace);
    if (createAutofillBtn) {
      createAutofillBtn.classList.toggle("hidden", isTextReplace);
      createAutofillBtn.toggleAttribute("hidden", isTextReplace);
      createAutofillBtn.setAttribute("aria-hidden", isTextReplace ? "true" : "false");
      createAutofillBtn.style.display = isTextReplace ? "none" : "";
    }
    if (createProductCardTitle) {
      createProductCardTitle.textContent = isTextReplace ? "Замена текста" : "Контент карточки";
    }
    if (!isInstructionTemplate) {
      createGenerationNotesExpanded = false;
    } else if (buildCreateGenerationNotesValue()) {
      createGenerationNotesExpanded = true;
    }
    syncCreateGenerationNotesState();
    createCustomPromptPanel?.classList.toggle("hidden", !isDirectPrompt);
    if (needsInitialTextReplaceRender) {
      renderCreateTextReplaceRules();
    }
    syncCreateInstructionState();
    syncCreateBestModelState();
    syncCreateGenerationNotesState();
  };

  const syncCreateOverlayScrollLock = () => {
    document.documentElement.style.overflow = createReferenceLibraryOpen || createImageManagerOpen || createModeChoiceModalOpen ? "hidden" : "";
  };

  const syncCreateModeChoiceModalState = () => {
    createModeChoiceModal?.classList.toggle("hidden", !createModeChoiceModalOpen);
    createModeChoiceModal?.classList.toggle("is-open", createModeChoiceModalOpen);
    createModeChoiceModal?.setAttribute("aria-hidden", createModeChoiceModalOpen ? "false" : "true");
    renderCreateModeChoices();
    syncCreateOverlayScrollLock();
  };

  const openCreateModeChoiceModal = () => {
    createModeChoiceModalOpen = true;
    syncCreateModeChoiceModalState();
    window.setTimeout(() => {
      createModeChoiceModalList?.querySelector(".create-mode-choice-card.is-active")?.focus();
    }, 0);
  };

  const closeCreateModeChoiceModal = () => {
    createModeChoiceModalOpen = false;
    syncCreateModeChoiceModalState();
  };

  const syncCreateReferenceLibraryState = () => {
    createReferenceModal?.classList.toggle("hidden", !createReferenceLibraryOpen);
    createReferenceModal?.classList.toggle("is-open", createReferenceLibraryOpen);
    createReferenceModal?.setAttribute("aria-hidden", createReferenceLibraryOpen ? "false" : "true");
    syncCreateOverlayScrollLock();
  };

  const openCreateReferenceLibrary = () => {
    createReferenceLibraryOpen = true;
    syncCreateReferenceLibraryState();
    if (!prefersTouchUi) {
      window.setTimeout(() => {
        createTemplateSearchInput?.focus();
        createTemplateSearchInput?.select();
      }, 0);
    }
  };

  const closeCreateReferenceLibrary = () => {
    createReferenceLibraryOpen = false;
    syncCreateReferenceLibraryState();
  };

  const syncCreateImageManagerState = () => {
    createImageManagerModal?.classList.toggle("hidden", !createImageManagerOpen);
    createImageManagerModal?.classList.toggle("is-open", createImageManagerOpen);
    createImageManagerModal?.setAttribute("aria-hidden", createImageManagerOpen ? "false" : "true");
    syncCreateOverlayScrollLock();
  };

  const openCreateImageManagerModal = () => {
    createImageManagerOpen = true;
    syncCreateImageManagerState();
    window.setTimeout(() => {
      createImageManagerAddBtn?.focus();
    }, 0);
  };

  const closeCreateImageManagerModal = () => {
    createImageManagerOpen = false;
    syncCreateImageManagerState();
  };

  const setCreateProductType = (nextTypeId, options = {}) => {
    const safeTypeId = String(nextTypeId || "").trim();
    const nextType = CREATE_PRODUCT_ROUTING_OPTIONS[safeTypeId] || CREATE_PRODUCT_ROUTING_OPTIONS.general_product || null;
    if (!nextType) return false;

    const changed = createProductTypeId !== nextType.id;
    createProductTypeId = nextType.id;
    if (changed || options.resetAngle) {
      createProductAngleId = "";
      ensureCreateProductAngleSelection();
    }
    return changed;
  };

  const setCreateProductAngle = (nextAngleId) => {
    const safeAngleId = String(nextAngleId || "").trim();
    const nextAngle = getCreateProductAngleOptions().find((item) => item.id === safeAngleId) || null;
    if (!nextAngle || nextAngle.id === createProductAngleId) return false;

    createProductAngleId = nextAngle.id;
    return true;
  };

  const renderCreateAngleOptionsInto = (container, options = {}) => {
    if (!container) return;
    const compact = Boolean(options.compact);
    const controlsLocked = isCreateControlsLocked();
    const angles = getCreateProductAngleOptions();
    const selectedAngle = ensureCreateProductAngleSelection();

    container.textContent = "";
    angles.forEach((angle) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = compact ? "create-angle-option create-angle-option-compact" : "create-template-item create-angle-option";
      button.dataset.productAngleId = angle.id;
      button.classList.toggle("is-active", angle.id === selectedAngle?.id);
      button.setAttribute("role", compact ? "radio" : "button");
      button.setAttribute("aria-checked", compact ? String(angle.id === selectedAngle?.id) : "false");
      button.toggleAttribute("disabled", controlsLocked);

      const preview = document.createElement("span");
      preview.className = compact ? "create-angle-option-thumb" : "create-template-thumb";
      if (angle.previewUrl) {
        const image = document.createElement("img");
        image.src = angle.previewUrl;
        image.alt = angle.title;
        image.loading = "lazy";
        preview.append(image);
      }

      const body = document.createElement("span");
      body.className = compact ? "create-angle-option-body" : "create-template-item-body";

      const title = document.createElement("strong");
      title.textContent = angle.title;

      if (compact) {
        body.append(title);
        if (angle.description) {
          const description = document.createElement("span");
          description.className = "create-angle-option-description";
          description.textContent = angle.description;
          body.append(description);
        }
        button.append(preview, body);
      } else {
        const description = document.createElement("span");
        description.className = "create-template-item-description";
        description.textContent = angle.description;
        const action = document.createElement("span");
        action.className = "create-template-item-action";
        action.textContent = angle.id === selectedAngle?.id ? "Выбрано" : "Выбрать ракурс";
        body.append(title);
        if (angle.description) {
          body.append(description);
        }
        body.append(action);
        button.append(preview, body);
      }

      container.append(button);
    });
  };

  const renderCreateProductRouting = () => {
    const selectedType = getCreateProductTypeOption();
    const controlsLocked = isCreateControlsLocked();
    const isFashionRouting = createProductTypeId === "clothing_and_shoes";
    ensureCreateProductAngleSelection();

    if (createIsClothingToggle) {
      createIsClothingToggle.checked = isFashionRouting;
      createIsClothingToggle.toggleAttribute("disabled", controlsLocked);
    }
    if (workspace) {
      workspace.dataset.createProductTheme = isFashionRouting ? "fashion" : "object";
    }
    if (createProductModeState) {
      createProductModeState.textContent = getCreateProductModeDisplayLabel();
    }
    if (createAngleSuggestionsLead) {
      createAngleSuggestionsLead.textContent = selectedType?.angleHeading || "Как показать товар?";
    }
    if (createProductRoutingSummary) {
      createProductRoutingSummary.textContent = buildCreateProductRoutingSummary();
    }
    if (createAngleSuggestions) {
      createAngleSuggestions.setAttribute("aria-label", selectedType?.angleHeading || "Ракурс товара");
    }
    createSelectedTemplateCard?.classList.toggle("is-fashion-routing", isFashionRouting);
    createSelectedTemplateCard?.classList.toggle("is-object-routing", !isFashionRouting);
    renderCreateAngleOptionsInto(createAngleSuggestions, { compact: true });
    setCreateResultsProcessingStage("analyzing");
  };

  const renderCreateTemplateLibrary = () => {
    renderCreateSelectedTemplateSummary();
    if (!createTemplateGrid) return;

    createTemplateGrid.textContent = "";
    createTemplateTabButtons.forEach((button) => {
      button.classList.toggle("active", normalizeCreateTemplateTab(button.dataset.createTemplateTab) === createActiveTemplateTab);
    });

    const angles = getCreateProductAngleOptions();
    if (!angles.length) {
      const empty = document.createElement("div");
      empty.className = "create-template-empty";
      empty.textContent = "Для этого типа товара пока нет ракурсов.";
      createTemplateGrid.append(empty);
      return;
    }

    renderCreateAngleOptionsInto(createTemplateGrid);
    return;

    const templates = getFilteredCreateTemplates();

    if (!templates.length) {
      const empty = document.createElement("div");
      empty.className = "create-template-empty";
      empty.textContent = "Ничего не найдено. Попробуйте другой запрос или вкладку.";
      createTemplateGrid.append(empty);
      return;
    }

    templates.forEach((template) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "create-template-item";
      card.dataset.templateId = template.id;
      card.classList.toggle("is-active", template.id === createSelectedTemplateId);
      card.classList.toggle("is-recommended", isCreateInstructionTemplate(template));
      if (template.sourceUrl) {
        card.title = template.sourceUrl;
      }

      const thumb = document.createElement("span");
      thumb.className = "create-template-thumb";
      appendCreateTemplateThumb(thumb, template);

      const body = document.createElement("span");
      body.className = "create-template-item-body";

      const title = document.createElement("strong");
      title.textContent = template.title;

      const description = document.createElement("span");
      description.className = "create-template-item-description";
      description.textContent = template.description || "Откройте и используйте этот шаблон для генерации.";

      const action = document.createElement("span");
      action.className = "create-template-item-action";
      action.textContent = template.id === createSelectedTemplateId ? "Выбрано" : "Выбрать режим";

      body.append(title, description, action);
      card.append(thumb, body);
      createTemplateGrid.append(card);
    });
  };

  const renderCreateSourcePreview = () => {
    const sourceFile = createSelectedFiles[0] || null;
    const sourceUrl = sourceFile ? getCreateFilePreviewUrl(sourceFile) : "";

    createSourcePreviewFrame?.classList.toggle("is-filled", Boolean(sourceUrl));
    createSourcePreviewImage?.classList.toggle("hidden", !sourceUrl);
    createSourcePreviewEmpty?.classList.toggle("hidden", Boolean(sourceUrl));

    if (createSourcePreviewImage) {
      if (sourceUrl) {
        createSourcePreviewImage.src = sourceUrl;
      } else {
        createSourcePreviewImage.removeAttribute("src");
      }
    }
  };

  const getActiveCreateResult = () => {
    if (!createGeneratedResults.length) return null;
    const selected = createGeneratedResults.find((item) => item.id === createActivePreviewResultId) || null;
    if (selected && selected.status !== "failed" && selected.previewUrl) return selected;
    return createGeneratedResults.find((item) => item.status !== "failed" && item.previewUrl) || null;
  };

  const getFirstSelectableCreateResult = () => {
    return createGeneratedResults.find((item) => item?.status !== "failed" && item?.previewUrl) || null;
  };

  const getCreateResultProviderLabel = (result) => {
    return String(result?.providerLabel || result?.provider || "").trim();
  };

  const renderCreatePreviewPanel = () => {
    const activeResult = getActiveCreateResult();
    const selectedTemplate = getCreateSelectedTemplate();
    const isDirectPrompt = isCreateDirectPromptTemplate(selectedTemplate);
    const isTextReplaceTemplate = isCreateTextReplaceTemplate(selectedTemplate);
    const shouldExportAllTextReplaceResults = isTextReplaceTemplate && createGeneratedResults.length > 1;
    const hasPhoto = createSelectedFiles.length > 0;
    const uploadUrl = createSelectedFiles[0] ? getCreateFilePreviewUrl(createSelectedFiles[0]) : "";
    const previewUrl = activeResult?.previewUrl || selectedTemplate?.previewUrl || uploadUrl;
    const hasPreview = Boolean(previewUrl);
    const accentColor = CREATE_ACCENT_COLOR_MAP[createUsefulSettings.accentColor] || CREATE_ACCENT_COLOR_MAP.emerald;
    const title = activeResult?.title || getCreateProductTitleValue() || selectedTemplate?.title || "Готовим структуру карточки";
    const meta = activeResult
      ? [
          activeResult.marketplace || createMarketplace?.value || "",
          activeResult.style || "",
        ].filter(Boolean).join(" • ")
      : [
          getCreateProductShortDescriptionValue()
            || getCreateProductThirdLevelTextValue()
            || "Выберите шаблон, заполните данные и запустите генерацию.",
          buildCreateCharacteristicsSummaryClean(),
        ].filter(Boolean).join(" ");

    if (createPreviewCard) {
      createPreviewCard.style.setProperty("--create-accent-color", accentColor);
      createPreviewCard.classList.toggle("has-preview", hasPreview);
    }
    createPreviewStage?.classList.toggle("has-preview", hasPreview);

    createPreviewImage?.classList.toggle("hidden", !hasPreview);
    createPreviewEmpty?.classList.toggle("hidden", hasPreview);

    if (createPreviewImage) {
      if (hasPreview) {
        createPreviewImage.src = previewUrl;
      } else {
        createPreviewImage.removeAttribute("src");
      }
    }

    if (!hasPreview) {
      if (createPreviewEmptyTitle) {
        createPreviewEmptyTitle.textContent = hasPhoto
          ? (selectedTemplate ? "Можно переходить к генерации" : "Выберите режим")
          : "Добавьте фото товара";
      }
      if (createPreviewEmptyText) {
        createPreviewEmptyText.textContent = hasPhoto
          ? (selectedTemplate
              ? (isDirectPrompt
                  ? "Введите свой промт и запустите генерацию."
                  : "Добавьте текст при необходимости и запустите генерацию.")
              : "Следующий шаг: выберите режим генерации.")
          : "Первое фото сразу станет основой для превью и генерации.";
      }
    }

    if (createPreviewBadge) {
      createPreviewBadge.textContent = activeResult
        ? "Готово"
        : selectedTemplate
          ? selectedTemplate.title
          : "Черновик";
    }
    if (createPreviewTitle) {
      createPreviewTitle.textContent = title;
    }
    if (createPreviewMeta) {
      createPreviewMeta.textContent = meta || "Здесь будет итоговое превью 3:4.";
    }

    if (createExportBtn) {
      const canExport = Boolean(activeResult?.previewUrl);
      createExportBtn.classList.toggle("hidden", !canExport);
      createExportBtn.classList.toggle("is-disabled", !canExport);
      createExportBtn.setAttribute("aria-disabled", canExport ? "false" : "true");
      createExportBtn.href = canExport ? activeResult.previewUrl : "#";
      createExportBtn.download = canExport ? activeResult.downloadName || "kartochka-prevyu.png" : "";
      createExportBtn.textContent = shouldExportAllTextReplaceResults ? "Экспортировать 2 файла" : "Экспортировать";
    }

    if (createImproveBtn) {
      const canImprove = Boolean(activeResult?.previewUrl);
      createImproveBtn.classList.toggle("hidden", !canImprove);
      createImproveBtn.toggleAttribute("disabled", !canImprove);
    }
  };

  const openImproveFromCreateResult = (result) => {
    const previewUrl = String(result?.previewUrl || "").trim();
    if (!previewUrl) {
      setStatusMessage(createStatus, "Сначала сгенерируйте карточку, чтобы перейти к улучшению.", "");
      return;
    }

    navigateToAppMode("improve");
    window.dispatchEvent(new CustomEvent("kartochka:improve:prefill", {
      detail: {
        previewUrl,
        fileName: buildImproveSourceNameFromResult(result),
      },
    }));
  };

  const applyImprovePrefill = async (options) => {
    if (!improveImageInput && !improveRunBtn && !improvePrompt) return;
    const previewUrl = String(options?.previewUrl || "").trim();
    if (!previewUrl) {
      throw new Error("РќРµС‚ РїСЂРµРІСЊСЋ РґР»СЏ РїРµСЂРµС…РѕРґР° Рє СѓР»СѓС‡С€РµРЅРёСЋ.");
    }

    clearImproveFileState();
    improveGeneratedResults = [];
    improveResultExpandedId = "";
    renderImproveResults();
    syncImproveMode("ai");
    if (improvePrompt) {
      improvePrompt.value = "";
    }
    setSelectValueIfExists(improveVariantsCount, "1");

    const sourceFile = await dataUrlToFile(
      previewUrl,
      String(options?.fileName || "source-card.png").trim() || "source-card.png",
      "image/png"
    );
    if (sourceFile) {
      improveImageFile = sourceFile;
    }
    improveImagePreview = previewUrl;
    if (improveSelectedImage) {
      improveSelectedImage.src = previewUrl;
    }
    improveSelectedPreview?.classList.remove("hidden");

    resetImproveAnalysisAfterInputChange();
    renderImproveAnalysisValues(improveAnalysisData);
    setDoneState(improveDoneBadge, false);
    syncImproveFormState();
    setRequestMeta(improveMeta, "РЎС‚Р°С‚СѓСЃ Р·Р°РїСЂРѕСЃР°:", "РСЃС…РѕРґРЅР°СЏ РєР°СЂС‚РѕС‡РєР° РїРµСЂРµРЅРµСЃРµРЅР° РёР· create");
    setStatusMessage(improveStatus, "РљР°СЂС‚РѕС‡РєР° РїРµСЂРµРЅРµСЃРµРЅР° РІ improve. РњРѕР¶РЅРѕ Р·Р°РїСѓСЃРєР°С‚СЊ AI-Р°РЅР°Р»РёР·.", "success");

    if (!historyReuseInProgress) {
      void runImproveAnalysis({ source: "auto" });
    }
  };

  const clearCreateResultsData = () => {
    createGeneratedResults = [];
    createActivePreviewResultId = "";
    createLastHistoryEntryId = "";
    setCreateResultsProcessing(false);
    renderCreateResults();
    renderCreatePreviewPanel();
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
    const selectedTemplate = getCreateSelectedTemplate();
    if (createSelectedFiles.length < 1) return "Добавьте минимум 1 фото товара";
    if (createSelectedFiles.length > CREATE_UPLOAD_MAX_FILES) {
      return "Допустимо максимум " + String(CREATE_UPLOAD_MAX_FILES) + " фото";
    }
    if (isCreateTextReplaceTemplate(selectedTemplate)) {
      const hasValidReplaceRule = getCreateTextReplaceRules().some((rule) => rule.from && rule.to);
      if (!hasValidReplaceRule) {
        return "Добавьте хотя бы одну пару «что заменить → на что заменить»";
      }
    }
    if (isCreateDirectPromptTemplate(selectedTemplate) && (createCustomPrompt?.value || "").trim().length < 12) {
      return "В режиме «Свой промпт» заполните собственный промпт";
    }
    if (!(createMarketplace?.value || "").trim()) return "Выберите маркетплейс";
    if (!(createCardsCount?.value || "").trim()) return "Выберите количество карточек";
    return "";
  };

  const applyCreateTemplateSelection = (templateId) => {
    const nextId = String(templateId || "").trim();
    if (!nextId) return;

    const library = getCreateTemplateLibrary();
    const nextTemplate = library.find((item) => item.id === nextId) || null;
    if (!nextTemplate) return;

    createSelectedTemplateId = nextId;
    syncCreatePromptMode(usesCreateDirectGenerationPrompt(nextTemplate) ? "custom" : "ai");
  };

  const renderCreateFiles = () => {
    renderCreateSourcePreview();
    createImagesList && (createImagesList.textContent = "");
    createImagesEmpty?.classList.toggle("hidden", createSelectedFiles.length > 0);

    createSelectedFiles.forEach((file, index) => {
      if (!createImagesList) return;

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

    if (createImageManagerCounter) {
      createImageManagerCounter.textContent = String(createSelectedFiles.length)
        + " / "
        + String(CREATE_UPLOAD_MAX_FILES)
        + " фото • первое фото основное";
    }

    if (createUploadHint) {
      if (createSelectedFiles.length < CREATE_UPLOAD_MAX_FILES) {
        createUploadHint.textContent = "PNG, JPG, WEBP • до 5 фото";
      } else {
        createUploadHint.textContent = "Лимит достигнут • удалите лишнее фото";
      }
    }

    createUploadZone?.classList.toggle("is-empty", createSelectedFiles.length === 0);
    createUploadZone?.classList.toggle("is-filled", createSelectedFiles.length > 0);
    createUploadZone?.classList.toggle("is-limit", createSelectedFiles.length >= CREATE_UPLOAD_MAX_FILES);
    createUploadZone?.setAttribute(
      "aria-label",
      createSelectedFiles.length > 0 ? "Открыть менеджер изображений товара" : "Добавить фото товара"
    );
    createUploadZone?.setAttribute(
      "title",
      createSelectedFiles.length > 0 ? "Открыть менеджер изображений" : "Добавить фото товара"
    );
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

    if (createPromptAssistDetails) {
      if (createPromptMode === "ai") {
        createPromptAssistDetails.open = true;
      } else if (!(createAiPromptOutput?.value || "").trim() && createAiPromptPhase !== "loading") {
        createPromptAssistDetails.open = false;
      }
    }

    if (createAdvancedDetails) {
      if (createPromptMode === "custom") {
        createAdvancedDetails.open = true;
      } else if (!(createCustomPrompt?.value || "").trim()) {
        createAdvancedDetails.open = false;
      }
    }
  };

  const syncCreateFlowGuide = (validationError) => {
    const hasPhoto = createSelectedFiles.length > 0;
    const selectedTemplate = getCreateSelectedTemplate();
    const isDirectPrompt = isCreateDirectPromptTemplate(selectedTemplate);
    const customPromptValue = (createCustomPrompt?.value || "").trim();
    const hasCardText = Boolean(
      getCreateProductTitleValue()
      || getCreateProductShortDescriptionValue()
      || getCreateProductThirdLevelTextValue()
    );

    setCreateFlowStepState(
      createFlowSteps.photo,
      hasPhoto ? "is-done" : "is-active",
      hasPhoto ? "Фото добавлено" : "Добавьте хотя бы 1 фото"
    );

    setCreateFlowStepState(
      createFlowSteps.template,
      selectedTemplate ? "is-done" : (hasPhoto ? "is-active" : "is-upcoming"),
      selectedTemplate ? "Выбран: " + selectedTemplate.title : "Нужен выбор режима"
    );

    if (isDirectPrompt) {
      setCreateFlowStepState(
        createFlowSteps.content,
        customPromptValue.length >= 12 ? "is-done" : (hasPhoto ? "is-active" : "is-upcoming"),
        customPromptValue.length >= 12 ? "Промт добавлен" : "Добавьте свой промт"
      );
    } else {
      setCreateFlowStepState(
        createFlowSteps.content,
        hasCardText ? "is-done" : "is-upcoming",
        hasCardText ? "Текст добавлен" : "Необязательно"
      );
    }

    if (createGeneratedResults.length) {
      setCreateFlowStepState(createFlowSteps.generate, "is-done", "Варианты готовы");
      return;
    }

    if (createIsGenerating) {
      setCreateFlowStepState(createFlowSteps.generate, "is-active", "AI создает карточки");
      return;
    }

    if (validationError) {
      setCreateFlowStepState(createFlowSteps.generate, "is-upcoming", "Нужны обязательные данные");
      return;
    }

    setCreateFlowStepState(createFlowSteps.generate, "is-active", "Можно запускать");
  };

  const getCreateInsightFingerprint = () => {
    syncCreateLegacyFields();
    return [
      (createDescription?.value || "").trim(),
      (createHighlights?.value || "").trim(),
      (createMarketplace?.value || "").trim(),
      (createCardsCount?.value || "").trim(),
      createSelectedTemplateId,
      createProductTypeId,
      createProductAngleId,
      createSelectedFiles.map((file) => getCreateFileKey(file)).join("|"),
    ].join("::");
  };

  const getCreateInsightInputError = () => {
    syncCreateLegacyFields();
    const hasImages = createSelectedFiles.length > 0;
    const hasDescription = (createDescription?.value || "").trim().length >= 8;
    if (hasImages || hasDescription) return "";
    return "Для AI-анализа добавьте минимум 1 фото или заполните «Описание товара».";
  };

  const buildCreateInsightPayload = async () => {
    syncCreateLegacyFields();
    const imageDataUrls = await buildCreateImageDataUrls();
    const selectedTemplate = getCreateSelectedTemplate();
    const customPromptText = isCreateDirectPromptTemplate(selectedTemplate) ? toText(createCustomPrompt?.value) : "";
    const productContext = buildCreateProductContextPayload();
    return {
      analysisIntent: "insight",
      title: getCreateProductTitleValue(),
      shortDescription: getCreateProductShortDescriptionValue(),
      subtitle: "",
      description: (createDescription?.value || "").trim(),
      highlights: (createHighlights?.value || "").trim(),
      marketplace: (createMarketplace?.value || "").trim(),
      cardsCount: (createCardsCount?.value || "").trim() || "1",
      promptMode: createPromptMode,
      prompt: customPromptText,
      customPrompt: customPromptText,
      cardTextLevels: buildCreateCardTextLevelsPayload(),
      contentCardText: buildCreateContentCardText(),
      generationNotes: buildCreateGenerationNotesValue(),
      productCategory: productContext.productType,
      productType: productContext.productType,
      productTypeId: productContext.productTypeId,
      productAngle: productContext.productAngle,
      productAngleId: productContext.productAngleId,
      productAngleDescription: productContext.productAngleDescription,
      productAnglePrompt: productContext.productAnglePrompt,
      instructionDocumentText: createInstructionDocumentText,
      instructionDocumentName: createInstructionDocumentName,
      userText: buildCreateUserText(),
      settings: buildCreateSettingsPayload(),
      characteristics: getCreateCharacteristicRows(),
      selectedTemplate: serializeCreateTemplate(selectedTemplate),
      reference: serializeCreateTemplate(selectedTemplate),
      referencePreviewUrl: await getCreateTemplateReferencePreviewUrl(selectedTemplate),
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
      throw new Error("Недостаточно данных для AI-анализа.");
    }

    const sourceText = [payload.description, payload.highlights].join(" ").toLowerCase();
    const category = /крем|сыворот|космет|beauty/.test(sourceText)
      ? "Beauty / уход"
      : /кабель|заряд|наушник|электрон|гаджет|tech/.test(sourceText)
        ? "Электроника и аксессуары"
        : /кофе|чай|снек|еда|food/.test(sourceText)
          ? "Еда и FMCG"
          : payload.files.length >= 3
            ? "Лайфстайл-товар"
            : "Универсальный потребительский товар";

    const style = /premium|премиум|дорог/.test(sourceText)
      ? "Премиальная чистая подача: светлый фон, аккуратная типографика, один сильный фокус"
      : /скидк|выгод|акци/.test(sourceText)
        ? "Промо-подача: контрастная выгода и четкая иерархия оффера"
        : "Каталожная подача: чистая продуктовая композиция с блоком выгод";

    const conversionAccent = /доставк|быстр|сегодня/.test(sourceText)
      ? "Сфокусироваться на скорости доставки и наличии"
      : /гарант|качест|сертификат/.test(sourceText)
        ? "Подчеркнуть доверие: гарантия, материалы, подтвержденное качество"
        : "Подсветить главную выгоду товара в первом экране и коротком CTA";

    const marketplaceFormat = payload.marketplace === "Wildberries"
      ? "Крупный hero + 3 быстрых буллета + короткий CTA, акцент на считываемость с мобильного"
      : payload.marketplace === "Яндекс Маркет"
        ? "Рациональный формат: факты, выгоды, доказательства, спокойный визуальный тон"
        : "Под Ozon: яркий первый экран, блок выгод, продукт в центре и чистый оффер";

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
      throw new Error("Некорректный ответ createAnalyze: отсутствует insight.");
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
    const isInterrupted = createInsightPhase === "interrupted";
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

    if (createInsightSummaryBadge) {
      if (isLoading) {
        setCreateSecondaryBadge(createInsightSummaryBadge, "AI анализ", "is-active");
      } else if (isInterrupted) {
        setCreateSecondaryBadge(createInsightSummaryBadge, hasInsight ? "Повторить" : "Пауза", "is-warning");
      } else if (isError && !hasInsight) {
        setCreateSecondaryBadge(createInsightSummaryBadge, "Нужны данные", "is-error");
      } else if (isSuccess && isStale) {
        setCreateSecondaryBadge(createInsightSummaryBadge, "Обновить", "is-warning");
      } else if (hasInsight) {
        setCreateSecondaryBadge(createInsightSummaryBadge, createInsightData?.category || "Готово", "is-success");
      } else {
        setCreateSecondaryBadge(createInsightSummaryBadge, "Пусто", "is-neutral");
      }
    }

    if (createInsightDetails && (isLoading || isInterrupted || (isError && !hasInsight))) {
      createInsightDetails.open = true;
    }

    if (!hasInsight) {
      renderCreateInsightValues(null);
    }

    if (createInsightStatus) {
      if (createInsightPhase === "empty") {
        setStatusMessage(createInsightStatus, inputError || "Данные готовы. Соберите insight.", "");
      } else if (isSuccess && isStale) {
        setStatusMessage(createInsightStatus, "Данные изменились. Обновите insight.", "");
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
    setStatusMessage(createInsightStatus, "AI собирает insight...", "");
    setRequestMeta(
      createMeta,
      "Статус запроса:",
      source === "generation" ? "Анализируем ваш товар" : "AI-анализ: выполняется"
    );
    syncCreateFormState();

    try {
      const payload = await buildCreateInsightPayload();
      payload.requestId = buildClientRequestId("create-insight", requestId);
      const insight = await requestCreateInsight(payload);
      if (requestId !== createInsightRequestId) return false;

      createInsightData = insight;
      createInsightFingerprint = getCreateInsightFingerprint();
      createInsightPhase = "success";
      renderCreateInsightValues(insight);

      setStatusMessage(
        createInsightStatus,
        source === "prompt" ? "Инсайт обновлен для промпта." : "Инсайт готов.",
        "success"
      );

      if (source !== "prompt") {
        setRequestMeta(createMeta, "Статус запроса:", "AI-анализ готов");
      }
      return true;
    } catch (error) {
      if (requestId !== createInsightRequestId) return false;
      const feedback = resolveRequestErrorFeedback(error, "Не удалось собрать insight.", {
        interruptedMessage: "Связь прервалась после сворачивания приложения. Insight можно обновить еще раз без потери данных.",
        interruptedMeta: "AI-анализ прерван после возврата",
        timeoutMeta: "Таймаут AI-анализа",
        networkMeta: "Сбой AI-анализа",
        errorMeta: "Ошибка AI-анализа",
      });
      createInsightPhase = feedback.isInterrupted ? "interrupted" : "error";
      setStatusMessage(createInsightStatus, feedback.message, feedback.type);
      setRequestMeta(createMeta, "Статус запроса:", feedback.metaValue, feedback.type);
      return false;
    } finally {
      if (requestId === createInsightRequestId) {
        if (activeUser) {
          void refreshBillingSummary();
        }
        syncCreateFormState();
      }
    }
  };

  const getCreateAiPromptInputError = () => {
    syncCreateLegacyFields();
    const hasImages = createSelectedFiles.length > 0;
    const hasDescription = (createDescription?.value || "").trim().length >= 8;
    if (hasImages || hasDescription) return "";
    return "Для AI-промпта добавьте минимум 1 фото или заполните «Описание товара».";
  };

  const buildCreateAiPromptPayload = async () => {
    syncCreateLegacyFields();
    const hasInsight = Boolean(createInsightData);
    const insightIsStale = hasInsight && createInsightFingerprint !== getCreateInsightFingerprint();
    const imageDataUrls = await buildCreateImageDataUrls();
    const selectedTemplate = getCreateSelectedTemplate();
    const customPromptText = isCreateDirectPromptTemplate(selectedTemplate) ? toText(createCustomPrompt?.value) : "";
    const productContext = buildCreateProductContextPayload();
    return {
      analysisIntent: "prompt",
      title: getCreateProductTitleValue(),
      shortDescription: getCreateProductShortDescriptionValue(),
      subtitle: "",
      description: (createDescription?.value || "").trim(),
      highlights: (createHighlights?.value || "").trim(),
      marketplace: (createMarketplace?.value || "").trim(),
      cardsCount: (createCardsCount?.value || "").trim() || "1",
      promptMode: createPromptMode,
      prompt: customPromptText,
      customPrompt: customPromptText,
      cardTextLevels: buildCreateCardTextLevelsPayload(),
      contentCardText: buildCreateContentCardText(),
      generationNotes: buildCreateGenerationNotesValue(),
      productCategory: productContext.productType,
      productType: productContext.productType,
      productTypeId: productContext.productTypeId,
      productAngle: productContext.productAngle,
      productAngleId: productContext.productAngleId,
      productAngleDescription: productContext.productAngleDescription,
      productAnglePrompt: productContext.productAnglePrompt,
      instructionDocumentText: createInstructionDocumentText,
      instructionDocumentName: createInstructionDocumentName,
      aiModelTier: getCreateBestModelOption().id,
      openAiModel: getCreateBestModelOption().openAiModel,
      openAiReasoningEffort: getCreateBestModelOption().reasoningEffort,
      userText: buildCreateUserText(),
      settings: buildCreateSettingsPayload(),
      characteristics: getCreateCharacteristicRows(),
      selectedTemplate: serializeCreateTemplate(selectedTemplate),
      reference: serializeCreateTemplate(selectedTemplate),
      referencePreviewUrl: await getCreateTemplateReferencePreviewUrl(selectedTemplate),
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
      throw new Error("Недостаточно данных для генерации промпта.");
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
      "Ты senior e-commerce designer для продавцов маркетплейсов.",
      "Собери продающий промпт для генерации карточки товара.",
      'Товар: "' + headlineSource + '".',
      "Маркетплейс: " + targetMarketplace + ".",
      "Нужно вариантов: " + variants + ".",
      "Акценты: " + focusLine + ".",
      insight ? "Категория (AI-анализ): " + insight.category + "." : "",
      insight ? "Рекомендуемый стиль (AI-анализ): " + insight.recommendedStyle + "." : "",
      insight ? "Конверсионный акцент (AI-анализ): " + insight.conversionAccent + "." : "",
      insight ? "Формат подачи (AI-анализ): " + insight.marketplaceFormat + "." : "",
      visualLine,
      "Верни структуру: 1) главный заголовок 2) 3-5 буллетов выгод 3) CTA 4) визуальные указания.",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const requestCreateAiPrompt = async (payload, contextExtras) => {
    if (serviceClient?.createAnalyze) {
      const response = await serviceClient.createAnalyze(payload, {
        intent: "prompt",
        ...(contextExtras && typeof contextExtras === "object" ? contextExtras : {}),
      });
      const prompt = typeof response?.prompt === "string" ? response.prompt : "";
      if (prompt.trim()) return prompt;
      throw new Error("Некорректный ответ createAnalyze: отсутствует промпт.");
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
    const isInterrupted = createAiPromptPhase === "interrupted";
    const controlsLocked = isLoading || createIsGenerating || createInsightPhase === "loading";
    const canAcceptPrompt = promptValue.length >= CREATE_AI_PROMPT_MIN_ACCEPT_LEN;
    const showEditor = isLoading || isInterrupted || hasPrompt;

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

    if (createPromptAssistSummaryBadge) {
      if (isLoading) {
        setCreateSecondaryBadge(createPromptAssistSummaryBadge, "Генерация", "is-active");
      } else if (isInterrupted && !hasPrompt) {
        setCreateSecondaryBadge(createPromptAssistSummaryBadge, "Пауза", "is-warning");
      } else if (createAiPromptPhase === "error" && !hasPrompt) {
        setCreateSecondaryBadge(createPromptAssistSummaryBadge, "Ошибка", "is-error");
      } else if (hasPrompt) {
        setCreateSecondaryBadge(createPromptAssistSummaryBadge, "Готово", "is-success");
      } else if (createPromptMode === "ai") {
        setCreateSecondaryBadge(createPromptAssistSummaryBadge, "AI режим", "is-active");
      } else {
        setCreateSecondaryBadge(createPromptAssistSummaryBadge, "Неактивно", "is-neutral");
      }
    }

    if (createPromptAssistDetails && (isLoading || isInterrupted || hasPrompt || createAiPromptPhase === "error")) {
      createPromptAssistDetails.open = true;
    }

    createAiPromptEditor?.classList.toggle("hidden", !showEditor);

    if (createAiPromptOutput) {
      createAiPromptOutput.readOnly = controlsLocked;
      createAiPromptOutput.toggleAttribute("disabled", isLoading || (!hasPrompt && createAiPromptPhase !== "loading"));
      if (createAiPromptPhase !== "loading" && !hasPrompt) {
        createAiPromptOutput.value = "";
      }
    }

    if (createAiPromptStatus && createAiPromptPhase === "empty") {
      setStatusMessage(createAiPromptStatus, inputError || "Данные готовы. Соберите промпт.", "");
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
        if (createInsightPhase === "interrupted") {
          createAiPromptPhase = "interrupted";
          setStatusMessage(
            createAiPromptStatus,
            "Связь прервалась после сворачивания приложения. Insight можно обновить еще раз без потери данных.",
            ""
          );
        } else {
          createAiPromptPhase = "error";
          setStatusMessage(createAiPromptStatus, "Не удалось обновить insight.", "error");
        }
        syncCreateFormState();
        return;
      }
    }

    createAiPromptPhase = "loading";
    const requestId = ++createAiPromptRequestId;
    setDoneState(createDoneBadge, false);
    if (createAiPromptOutput) {
      createAiPromptOutput.value = "";
      createAiPromptOutput.placeholder = "AI собирает промпт...";
    }
    setStatusMessage(createAiPromptStatus, "AI собирает промпт...", "");
    setRequestMeta(createMeta, "Статус запроса:", "AI-промпт: выполняется");
    syncCreateFormState();

    try {
      const payload = await buildCreateAiPromptPayload();
      payload.requestId = buildClientRequestId("create-prompt", requestId);
      const generatedPrompt = await requestCreateAiPrompt(payload);
      if (requestId !== createAiPromptRequestId) return;

      if (createAiPromptOutput) {
        createAiPromptOutput.value = generatedPrompt;
        createAiPromptOutput.placeholder = "Здесь появится промпт.";
      }
      createAiPromptPhase = "success";
      setStatusMessage(createAiPromptStatus, "Prompt готов. Можно применить или править.", "success");
      setRequestMeta(createMeta, "Статус запроса:", "AI-промпт готов");
    } catch (error) {
      if (requestId !== createAiPromptRequestId) return;
      if (createAiPromptOutput && !createAiPromptOutput.value.trim()) {
        createAiPromptOutput.placeholder = "Здесь появится промпт.";
      }
      const feedback = resolveRequestErrorFeedback(error, "Не удалось собрать промпт.", {
        interruptedMessage: "Связь прервалась после сворачивания приложения. Промпт можно собрать еще раз без потери введенных данных.",
        interruptedMeta: "AI-промпт прерван после возврата",
        timeoutMeta: "Таймаут AI-промпта",
        networkMeta: "Сбой AI-промпта",
        errorMeta: "Ошибка AI-промпта",
      });
      createAiPromptPhase = feedback.isInterrupted ? "interrupted" : "error";
      setStatusMessage(createAiPromptStatus, feedback.message, feedback.type);
      setRequestMeta(createMeta, "Статус запроса:", feedback.metaValue, feedback.type);
    } finally {
      if (requestId === createAiPromptRequestId) {
        if (activeUser) {
          void refreshBillingSummary();
        }
        syncCreateFormState();
      }
    }
  };

  const requestCreateAutofillAnalysis = async (payload) => {
    if (serviceClient?.createAnalyze) {
      const response = await serviceClient.createAnalyze(payload, { intent: "full" });
      const hasHeadlineIdeas = Array.isArray(response?.headlineIdeas) && response.headlineIdeas.length > 0;
      const hasTextLevels = Boolean(
        response?.cardTextLevels
        || response?.level1
        || response?.level2
        || response?.level3
      );
      if (response?.detectedCategory || response?.insight || response?.prompt || hasHeadlineIdeas || hasTextLevels) {
        return response;
      }
      throw new Error("Invalid createAnalyze response: autofill data is missing.");
    }

    const insight = await requestCreateInsight(payload);
    const prompt = await requestCreateAiPrompt({
      ...payload,
      insight,
    });

    return {
      detectedCategory: insight?.category || "",
      insight,
      prompt,
      headlineIdeas: [],
    };
  };

  const applyCreateAutofillResult = (analysis, payload) => {
    const nextLevels = buildCreateAutofillTextLevels(analysis, payload);
    let titleFilled = false;
    let descriptionFilled = false;
    let thirdLevelFilled = false;

    if (createProductTitle && nextLevels.primary) {
      createProductTitle.value = nextLevels.primary;
      titleFilled = true;
    }

    if (createProductShortDescription && nextLevels.secondary) {
      createProductShortDescription.value = nextLevels.secondary;
      descriptionFilled = true;
    }

    if (createProductThirdLevelText && nextLevels.tertiary) {
      createProductThirdLevelText.value = nextLevels.tertiary;
      thirdLevelFilled = true;
    }

    createInsightData = null;
    createInsightFingerprint = "";
    createInsightPhase = "empty";
    renderCreateInsightValues(null);
    syncCreateInsightState();

    if (createAiPromptOutput) {
      createAiPromptOutput.value = "";
    }
    createAiPromptPhase = "empty";
    syncCreateAiPromptState();

    if (
      createSettingVisualStyle
      && createSettingVisualStyle.value === CREATE_USEFUL_SETTINGS_DEFAULTS.visualStyle
      && analysis?.insight?.recommendedStyle
    ) {
      const styleSource = toLowerText(analysis.insight.recommendedStyle);
      if (/premium|lux/.test(styleSource)) {
        createSettingVisualStyle.value = "premium";
      } else if (/promo|sale|contrast/.test(styleSource)) {
        createSettingVisualStyle.value = "promo";
      } else if (/editorial/.test(styleSource)) {
        createSettingVisualStyle.value = "editorial";
      } else {
        createSettingVisualStyle.value = "clean-market";
      }
    }

    syncCreateLegacyFields();
    handleCreateInputMutation();

    const feedbackParts = [];
    if (titleFilled) feedbackParts.push("название");
    if (descriptionFilled) feedbackParts.push("второй уровень");
    if (thirdLevelFilled) feedbackParts.push("третий уровень");

    setStatusMessage(
      createStatus,
      feedbackParts.length
        ? "AI заполнил: " + feedbackParts.join(", ") + "."
        : "AI обновил контекст формы и подготовил данные.",
      "success"
    );
    setRequestMeta(createMeta, "Статус запроса:", "AI автозаполнение готово");
  };

  const runCreateAutofill = async () => {
    const inputError = getCreateAutofillInputError();
    if (inputError) {
      setStatusMessage(createStatus, inputError, "error");
      syncCreateFormState();
      return;
    }

    createAutofillPhase = "loading";
    const requestId = ++createAutofillRequestId;
    setDoneState(createDoneBadge, false);
    setStatusMessage(createStatus, "AI анализирует товар и заполняет поля...", "");
    setRequestMeta(createMeta, "Статус запроса:", "AI автозаполнение: анализ");
    syncCreateFormState();

    try {
      const payload = await buildCreateAutofillPayload();
      payload.requestId = buildClientRequestId("create-autofill", requestId);
      const analysis = await requestCreateAutofillAnalysis(payload);
      if (requestId !== createAutofillRequestId) return;

      createAutofillPhase = "success";
      applyCreateAutofillResult(analysis, payload);
    } catch (error) {
      if (requestId !== createAutofillRequestId) return;
      const feedback = resolveRequestErrorFeedback(error, "Не удалось выполнить AI автозаполнение.", {
        interruptedMessage: "Связь прервалась после сворачивания приложения. Заполнение можно повторить без потери данных формы.",
        interruptedMeta: "AI автозаполнение прервано после возврата",
        timeoutMeta: "Таймаут AI автозаполнения",
        networkMeta: "Сбой AI автозаполнения",
        errorMeta: "Ошибка AI автозаполнения",
      });
      createAutofillPhase = feedback.isInterrupted ? "idle" : "error";
      setStatusMessage(createStatus, feedback.message, feedback.type);
      setRequestMeta(createMeta, "Статус запроса:", feedback.metaValue, feedback.type);
    } finally {
      if (requestId === createAutofillRequestId && createAutofillPhase !== "loading") {
        if (activeUser) {
          void refreshBillingSummary();
        }
        syncCreateFormState();
      }
    }
  };

  const syncCreateFormState = () => {
    syncCreateLegacyFields();

    const validationError = getCreateValidationError();
    const selectedTemplate = getCreateSelectedTemplate();
    const isTextReplace = isCreateTextReplaceTemplate(selectedTemplate);
    const autofillInputError = getCreateAutofillInputError();
    const createGenerateActionCode = getCreateGenerateBillingActionCode();
    const createGenerateTokenLocked = !hasEnoughTokens(createGenerateActionCode);
    const createAutofillTokenLocked = !hasEnoughTokens("create_autofill");
    const controlsLocked =
      createIsGenerating ||
      createAutofillPhase === "loading" ||
      createInsightPhase === "loading" ||
      createAiPromptPhase === "loading";
    const isDisabled = Boolean(validationError) || controlsLocked || createGenerateTokenLocked;
    const aiPromptValue = (createAiPromptOutput?.value || "").trim();
    const customPromptValue = (createCustomPrompt?.value || "").trim();

    if (createGenerateBtn) {
      setButtonCostLabel(
        createGenerateBtn,
        createGeneratedResults.length ? "Сделать вариант 2" : "Сгенерировать карточку",
        createGenerateActionCode
      );
      createGenerateBtn.toggleAttribute("disabled", isDisabled);
      createGenerateBtn.classList.toggle("is-loading", createIsGenerating);
    }

    if (createAutofillBtn) {
      setButtonCostLabel(createAutofillBtn, "Автозаполнить AI", "create_autofill");
      createAutofillBtn.toggleAttribute("disabled", isTextReplace || controlsLocked || Boolean(autofillInputError) || createAutofillTokenLocked);
      createAutofillBtn.classList.toggle("is-loading", !isTextReplace && createAutofillPhase === "loading");
      createAutofillBtn.toggleAttribute("hidden", isTextReplace);
      createAutofillBtn.setAttribute("aria-hidden", isTextReplace ? "true" : "false");
      createAutofillBtn.style.display = isTextReplace ? "none" : "";
    }

    syncCreateBestModelState();

    createPromptModeButtons.forEach((button) => {
      button.toggleAttribute("disabled", controlsLocked);
    });

    if (createImagesInput) createImagesInput.toggleAttribute("disabled", controlsLocked);
    if (createDescription) createDescription.toggleAttribute("disabled", controlsLocked);
    if (createHighlights) createHighlights.toggleAttribute("disabled", controlsLocked);
    if (createProductTitle) createProductTitle.toggleAttribute("disabled", controlsLocked);
    if (createProductShortDescription) createProductShortDescription.toggleAttribute("disabled", controlsLocked);
    if (createProductThirdLevelText) createProductThirdLevelText.toggleAttribute("disabled", controlsLocked);
    if (createGenerationNotes) createGenerationNotes.toggleAttribute("disabled", controlsLocked);
    if (createIsClothingToggle) createIsClothingToggle.toggleAttribute("disabled", controlsLocked);
    createAngleSuggestions?.querySelectorAll("[data-product-angle-id]").forEach((node) => {
      node.toggleAttribute("disabled", controlsLocked);
    });
    if (createMarketplace) createMarketplace.toggleAttribute("disabled", controlsLocked);
    if (createCardsCount) createCardsCount.toggleAttribute("disabled", controlsLocked);
    createTextReplaceList?.querySelectorAll("textarea, button[data-remove-replace-rule]").forEach((node) => {
      node.toggleAttribute("disabled", controlsLocked);
    });
    if (createTemplateSearchInput) createTemplateSearchInput.toggleAttribute("disabled", controlsLocked);
    if (createAddCharacteristicBtn) createAddCharacteristicBtn.toggleAttribute("disabled", controlsLocked);
    if (createEditImageBtn) {
      createEditImageBtn.toggleAttribute("disabled", controlsLocked);
    }
    if (createImageManagerAddBtn) {
      createImageManagerAddBtn.toggleAttribute("disabled", controlsLocked || createSelectedFiles.length >= CREATE_UPLOAD_MAX_FILES);
    }
    createInstructionAttachBtn?.toggleAttribute("disabled", controlsLocked);
    createInstructionInput?.toggleAttribute("disabled", controlsLocked);
    createTemplateTabButtons.forEach((button) => {
      button.toggleAttribute("disabled", controlsLocked);
    });
    createModeChoiceStrip?.querySelectorAll("[data-create-template-mode-id]").forEach((button) => {
      button.toggleAttribute("disabled", controlsLocked);
    });
    createModeChoiceStrip?.querySelectorAll("[data-create-template-mode-trigger]").forEach((button) => {
      button.toggleAttribute("disabled", controlsLocked);
    });
    createModeChoiceModalList?.querySelectorAll("[data-create-template-mode-id]").forEach((button) => {
      button.toggleAttribute("disabled", controlsLocked);
    });

    if (createCustomPrompt) {
      const disableCustomPrompt = controlsLocked || createPromptMode !== "custom" || isTextReplace;
      createCustomPrompt.toggleAttribute("disabled", disableCustomPrompt);
      if (disableCustomPrompt) {
        createCustomPrompt.setAttribute("aria-disabled", "true");
      } else {
        createCustomPrompt.removeAttribute("aria-disabled");
      }
    }

    createUploadZone?.classList.toggle("is-disabled", controlsLocked);
    createUploadZone?.toggleAttribute("disabled", controlsLocked);
    createUploadZone?.setAttribute("aria-disabled", controlsLocked ? "true" : "false");

    [
      createSettingAccentColor,
      createSettingReferenceStrength,
      createSettingVisualStyle,
      createSettingInfoDensity,
      createSettingReadabilityPriority,
      createSettingConversionPriority,
      createSettingAccentFormat,
      createSettingBackgroundMode,
    ].forEach((field) => {
      field?.toggleAttribute("disabled", controlsLocked);
    });
    createSettingPreserveLayout?.toggleAttribute("disabled", controlsLocked);
    createCharacteristicsComponent?.setDisabled(controlsLocked);

    if (createPromptAssistDetails && createPromptMode !== "ai" && !aiPromptValue && createAiPromptPhase !== "loading") {
      createPromptAssistDetails.open = false;
    }

    if (createAdvancedDetails) {
      if (createPromptMode === "custom" || customPromptValue) {
        createAdvancedDetails.open = true;
      } else {
        createAdvancedDetails.open = false;
      }
    }

    if (createCustomPromptSummaryBadge) {
      if (createPromptMode === "custom" && customPromptValue) {
        setCreateSecondaryBadge(createCustomPromptSummaryBadge, "Ручной", "is-success");
      } else if (createPromptMode === "custom") {
        setCreateSecondaryBadge(createCustomPromptSummaryBadge, "Ввод", "is-active");
      } else if (customPromptValue) {
        setCreateSecondaryBadge(createCustomPromptSummaryBadge, "Сохранен", "is-success");
      } else {
        setCreateSecondaryBadge(createCustomPromptSummaryBadge, "Опционально", "is-neutral");
      }
    }

    if (createCustomPromptHelper) {
      createCustomPromptHelper.textContent = createPromptMode === "custom"
        ? "Короткий промпт для ручной настройки."
        : "Откройте, если нужен ручной контроль.";
    }

    if (createCtaHint) {
      if (createAutofillPhase === "loading") {
        createCtaHint.textContent = "AI подготавливает текстовые уровни для карточки...";
      } else if (createIsGenerating) {
        createCtaHint.textContent = "Генерация в процессе...";
      } else if (createGenerateTokenLocked && billingSummary) {
        createCtaHint.textContent =
          "Недостаточно токенов. Нужно " + formatTokenCount(getBillingActionCost(createGenerateActionCode))
          + ", доступно " + formatTokenCount(getBillingBalanceTokens()) + ".";
      } else if (createSelectedFiles.length < 1) {
        createCtaHint.textContent = "Шаг 1: добавьте фото товара.";
      } else if (isTextReplace) {
        createCtaHint.textContent = "Укажите, какой текст заменить и на что заменить. Изображение карточки сохранится максимально близко к исходнику.";
      } else if (createPromptMode === "custom" && customPromptValue.length < 12) {
        createCtaHint.textContent = "Шаг 3: введите свой промт.";
      } else if (validationError) {
        createCtaHint.textContent = validationError;
      } else if (createGeneratedResults.length) {
        createCtaHint.textContent = "Готово. Можно экспортировать карточку, улучшить её или сделать вариант 2.";
      } else if (createPromptMode === "custom" && !isTextReplace) {
        createCtaHint.textContent = "Шаг 4: запускайте генерацию по своему промту.";
      } else if (
        !getCreateProductTitleValue()
        && !getCreateProductShortDescriptionValue()
        && !getCreateProductThirdLevelTextValue()
      ) {
        createCtaHint.textContent = "Шаг 4: можно запускать сразу или добавить текст на карточку.";
      } else {
        createCtaHint.textContent = "Шаг 4: всё готово к генерации.";
      }
    }
    syncCreateFlowGuide(validationError);
    renderCreateTemplateLibrary();
    renderCreatePreviewPanel();
    syncCreateInsightState();
    syncCreateAiPromptState();
  };

  const isCreateControlsLocked = () => {
    return (
      createIsGenerating
      || createAutofillPhase === "loading"
      || createInsightPhase === "loading"
      || createAiPromptPhase === "loading"
    );
  };

  const resetCreateTransientErrorState = () => {
    if (createAutofillPhase === "error") {
      createAutofillPhase = "idle";
    }
    if ((createAiPromptPhase === "error" || createAiPromptPhase === "interrupted") && !(createAiPromptOutput?.value || "").trim()) {
      createAiPromptPhase = "empty";
    }
    if ((createInsightPhase === "error" || createInsightPhase === "interrupted") && !createInsightData) {
      createInsightPhase = "empty";
    }
  };

  const cancelPendingCreateRequests = () => {
    let cancelled = false;

    if (createAutofillPhase === "loading") {
      createAutofillRequestId += 1;
      createAutofillPhase = "idle";
      cancelled = true;
    }

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

  const logProductTypeEvent = (eventName, details = {}) => {
    console.info("[analytics]", eventName, {
      source: createProductTypeSource,
      productType: createProductTypeId,
      ...details,
    });
  };

  const syncCreateProductTypeDetectionStatus = () => {
    createProductTypeDetectionPhase = "idle";
  };

  const requestCreateProductTypeDetection = async (payload) => {
    if (serviceClient?.productDetectType) {
      return serviceClient.productDetectType(payload);
    }
    return {
      success: false,
      detectedType: null,
      confidence: 0,
      source: "ai",
      secondaryCandidates: [],
      reason: "Product type detection endpoint is not configured",
    };
  };

  const runCreateProductTypeDetectionForCurrentImage = async () => {
    createProductTypeDetectionRequestId += 1;
    createProductTypeDetectionFileKey = createSelectedFiles[0] ? getCreateFileKey(createSelectedFiles[0]) : "";
    createProductTypeDetectionPhase = "idle";
    createProductTypeSource = "manual";
    syncCreateProductTypeDetectionStatus();
    renderCreateProductRouting();
    syncCreateFormState();
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

    clearCreateResultsData();
    setDoneState(createDoneBadge, false);
    renderCreateFiles();
    syncCreateFormState();
    if (added > 0) {
      void runCreateProductTypeDetectionForCurrentImage();
    }
  };

  const getHistoryScopeId = (user) => {
    return user?.uid || "guest";
  };

  const getHistorySourceMode = () => {
    const activeServiceMode = typeof serviceClient?.getMode === "function" ? serviceClient.getMode() : SERVICE_MODE;
    return activeServiceMode === "mock" ? "mock" : "backend";
  };

  const resetHistorySyncStatus = () => {
    historySyncStatus = {
      level: "idle",
      message: "",
      storageMode: "",
      fallbackUsed: false,
      savedAt: "",
    };
  };

  const setHistorySyncStatus = (nextStatus) => {
    historySyncStatus = {
      level: String(nextStatus?.level || "idle").trim().toLowerCase() || "idle",
      message: String(nextStatus?.message || "").trim(),
      storageMode: String(nextStatus?.storageMode || "").trim().toLowerCase(),
      fallbackUsed: Boolean(nextStatus?.fallbackUsed),
      savedAt: String(nextStatus?.savedAt || "").trim(),
    };
  };

  const getHistoryDefaultNote = () => {
    if (getHistorySourceMode() === "mock") {
      return historyEntries.length
        ? "Показаны локальные mock-записи. Это demo-режим, а не production persistence."
        : "В mock-режиме здесь появятся локальные demo-записи.";
    }
    return "";
  };

  const getHistoryDefaultEmptyText = () => {
    return getHistorySourceMode() === "mock"
      ? "Пока нет локальных demo-записей."
      : "После реального сохранения create и improve записи появятся здесь.";
  };

  const buildHistoryPersistenceFeedback = (error, operation, options) => {
    const normalizedOperation = String(operation || "save").trim().toLowerCase();
    const fallbackMessage = normalizedOperation === "load"
      ? (
        options?.hasEntries
          ? "Не удалось обновить историю из backend. Показаны последние успешно загруженные записи."
          : "Не удалось загрузить историю из backend. История сейчас недоступна."
      )
      : normalizedOperation === "clear"
        ? "Не удалось очистить историю в backend. Текущие записи не были удалены."
        : "История не сохранилась в backend. Генерация завершена, но запись не была зафиксирована.";
    const feedback = resolveRequestErrorFeedback(error, fallbackMessage, {
      interruptedMessage: normalizedOperation === "load"
        ? "Связь прервалась после сворачивания приложения. Не удалось подтвердить backend-историю."
        : "Связь прервалась после сворачивания приложения. Не удалось подтвердить сохранение истории.",
      interruptedMeta: normalizedOperation === "load" ? "История недоступна после возврата" : "История не подтверждена после возврата",
      timeoutMeta: normalizedOperation === "load" ? "Таймаут чтения истории" : "Таймаут сохранения истории",
      networkMeta: normalizedOperation === "load" ? "Сбой чтения истории" : "Сбой сохранения истории",
      errorMeta: normalizedOperation === "load" ? "Ошибка чтения истории" : "Ошибка сохранения истории",
    });
    setHistorySyncStatus({
      level: "error",
      message: feedback.message,
    });
    return feedback;
  };

  const getHistoryFallbackPreview = (mode) => {
    return mode === "improve"
      ? IMPROVE_RESULT_FALLBACK_PREVIEWS[0]
      : CREATE_GENERATION_FALLBACK_PREVIEWS[0];
  };

  const sanitizeHistoryPreviewUrl = (previewUrl, mode) => {
    const safeUrl = String(previewUrl || "").trim();
    if (
      !safeUrl
      || safeUrl.startsWith("blob:")
      || /^javascript:/i.test(safeUrl)
      || (
        !/^data:image\//i.test(safeUrl)
        && !/^https?:\/\//i.test(safeUrl)
        && !safeUrl.startsWith("/")
        && !safeUrl.startsWith("./")
      )
      || safeUrl.includes("..")
    ) {
      return getHistoryFallbackPreview(mode);
    }
    return safeUrl;
  };

  const normalizeHistoryMode = (mode) => {
    return mode === "improve" ? "improve" : mode === "fourCards" ? "fourCards" : "create";
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

  const collapseHistoryText = (value) => {
    return String(value || "").replace(/\s+/g, " ").trim();
  };

  const truncateHistoryText = (value, maxLength) => {
    const safeValue = collapseHistoryText(value);
    const safeMaxLength = Number.isFinite(Number(maxLength)) ? Math.max(12, Math.floor(Number(maxLength))) : 120;
    if (!safeValue || safeValue.length <= safeMaxLength) return safeValue;
    return safeValue.slice(0, safeMaxLength - 1).trim() + "…";
  };

  const stripHistoryFileExtension = (value) => {
    return collapseHistoryText(value).replace(/\.[a-z0-9]{2,6}$/i, "");
  };

  const getHistoryModeLabel = (mode) => {
    return mode === "improve" ? "Улучшение" : "Создание";
  };

  const getHistoryImproveModeLabel = (mode) => {
    return mode === "reference" ? "Reference style" : "Стандартный AI";
  };

  const getHistoryPromptModeLabel = (entry) => {
    if (entry?.mode === "improve") {
      return getHistoryImproveModeLabel(entry?.input?.improveMode || entry?.meta?.improveMode || "");
    }
    return (entry?.input?.promptMode || entry?.meta?.promptMode || "") === "custom"
      ? "Свой prompt"
      : "AI prompt";
  };

  const getHistoryPromptMeta = (entry) => {
    if (entry?.mode === "improve") {
      return (entry?.input?.improveMode || entry?.meta?.improveMode || "") === "reference"
        ? "Комментарий пользователя + режим reference style"
        : "Комментарий пользователя для улучшения";
    }
    return (entry?.input?.promptMode || entry?.meta?.promptMode || "") === "custom"
      ? "Пользовательский prompt"
      : "AI prompt, использованный при генерации";
  };

  const getCreateTemplateTitleById = (templateId) => {
    const safeId = collapseHistoryText(templateId);
    if (!safeId) return "";
    const matchedTemplate = getCreateTemplateLibrary().find((item) => item.id === safeId);
    return collapseHistoryText(matchedTemplate?.title || safeId);
  };

  const buildHistoryResultsCountLabel = (count) => {
    const safeCount = Math.max(0, Math.floor(Number(count) || 0));
    return String(safeCount) + " " + formatCardsWord(safeCount);
  };

  const buildHistoryUploadsCountLabel = (count) => {
    const safeCount = Math.max(0, Math.floor(Number(count) || 0));
    return String(safeCount) + " " + formatRussianCountWord(safeCount, "исходник", "исходника", "исходников");
  };

  const buildHistoryCharacteristicsSummary = (rows) => {
    const normalizedRows = Array.isArray(rows)
      ? rows
          .map((row) => {
            const label = collapseHistoryText(row?.label);
            const value = collapseHistoryText(row?.value);
            return [label, value].filter(Boolean).join(": ");
          })
          .filter(Boolean)
      : [];

    if (!normalizedRows.length) return "";
    const preview = normalizedRows.slice(0, 3).join(", ");
    const suffix = normalizedRows.length > 3 ? " +" + String(normalizedRows.length - 3) : "";
    return String(normalizedRows.length)
      + " "
      + formatRussianCountWord(normalizedRows.length, "поле", "поля", "полей")
      + " • "
      + truncateHistoryText(preview, 110)
      + suffix;
  };

  const looksLikeGenericHistoryTitle = (value) => {
    const safeValue = collapseHistoryText(value).toLowerCase();
    if (!safeValue) return true;
    return /^(\d+\s+карточ)/.test(safeValue)
      || /(^|[•|-]\s*)(создани|улучшени|вариант|результат)/.test(safeValue)
      || safeValue.length < 5;
  };

  const buildHistoryOriginalInputText = (mode, input, promptValue) => {
    const sections = [];
    const pushSection = (label, value) => {
      const safeValue = String(value || "").trim();
      if (!safeValue) return;
      sections.push(label + "\n" + safeValue);
    };

    if (mode === "improve") {
      pushSection("Комментарий пользователя", input?.improvePrompt || promptValue);
    } else {
      pushSection("Главный текст", input?.mainText);
      pushSection("Короткий текст", input?.secondaryText);
      pushSection("Дополнительная строка", input?.tertiaryText);
      pushSection("Описание товара", input?.description);
      pushSection("Пожелания", input?.highlights);
    }

    pushSection("Примечания к генерации", input?.generationNotes);

    return sections.length
      ? sections.join("\n\n")
      : "Текстовые вводные для этой записи не сохранены.";
  };

  const buildHistoryDisplayTitle = (mode, rawTitle, input, uploads, promptValue, summaryValue, results) => {
    const explicitTitle = collapseHistoryText(rawTitle);
    if (explicitTitle && !looksLikeGenericHistoryTitle(explicitTitle)) {
      return truncateHistoryText(explicitTitle, 88);
    }

    const uploadTitle = stripHistoryFileExtension(
      uploads.find((upload) => upload.role === "source" || upload.role === "product")?.name
      || uploads[0]?.name
      || ""
    );
    const resultTitle = collapseHistoryText(results[0]?.title);
    const titleCandidates = mode === "improve"
      ? [input?.improvePrompt, resultTitle, uploadTitle, summaryValue, promptValue, explicitTitle]
      : [input?.mainText, input?.description, input?.highlights, uploadTitle, resultTitle, promptValue, explicitTitle];

    for (let index = 0; index < titleCandidates.length; index += 1) {
      const safeCandidate = collapseHistoryText(titleCandidates[index]);
      if (!safeCandidate) continue;
      const sentenceCandidate = safeCandidate.split(/[.!?]/)[0] || safeCandidate;
      return truncateHistoryText(sentenceCandidate, 88);
    }

    return mode === "improve" ? "Улучшение карточки" : "Новая карточка товара";
  };

  const buildHistoryDisplaySummary = (mode, input, summaryValue, aiSummary, promptValue, results) => {
    const summaryCandidates = mode === "improve"
      ? [summaryValue, aiSummary, results[0]?.summary, results[0]?.subtitle, input?.improvePrompt, promptValue]
      : [summaryValue, aiSummary, results[0]?.summary, input?.highlights, input?.description, promptValue];

    for (let index = 0; index < summaryCandidates.length; index += 1) {
      const safeCandidate = collapseHistoryText(summaryCandidates[index]);
      if (!safeCandidate) continue;
      return truncateHistoryText(safeCandidate, 180);
    }

    return mode === "improve"
      ? "Сохранено улучшение карточки без текстового описания."
      : "Сохранена генерация карточки без текстового описания.";
  };

  const buildHistoryEyebrow = (mode, input, meta, uploadsCount) => {
    const primaryMeta = mode === "improve"
      ? getHistoryImproveModeLabel(input?.improveMode || meta?.improveMode || "")
      : collapseHistoryText(input?.marketplace || meta?.marketplace || "");
    const parts = [
      getHistoryModeLabel(mode),
      getHistoryPromptModeLabel({ mode, input, meta }),
      primaryMeta,
      buildHistoryUploadsCountLabel(uploadsCount),
    ].filter(Boolean);
    return parts.join(" • ");
  };

  const buildHistoryStatsText = (entries) => {
    const totalEntries = Array.isArray(entries) ? entries.length : 0;
    const createEntries = Array.isArray(entries) ? entries.filter((entry) => entry.mode === "create").length : 0;
    const improveEntries = Array.isArray(entries) ? entries.filter((entry) => entry.mode === "improve").length : 0;

    return String(totalEntries)
      + " "
      + formatRussianCountWord(totalEntries, "запись", "записи", "записей")
      + " • "
      + String(createEntries)
      + " создание • "
      + String(improveEntries)
      + " улучшение";
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
      provider: String(result?.provider || "").trim(),
      providerLabel: String(result?.providerLabel || "").trim(),
      status: String(result?.status || (result?.previewUrl ? "completed" : "failed")).trim(),
      aggregateStatus: String(result?.aggregateStatus || "").trim(),
      requestId: String(result?.requestId || "").trim(),
      generationId: String(result?.generationId || "").trim(),
      durationMs: Number.isFinite(Number(result?.durationMs)) ? Number(result.durationMs) : 0,
      createdAt: String(result?.createdAt || "").trim(),
      errorCode: String(result?.errorCode || "").trim(),
      errorMessage: String(result?.errorMessage || "").trim(),
      metadata: result?.metadata && typeof result.metadata === "object" && !Array.isArray(result.metadata) ? result.metadata : null,
      variantNumber: Number.isFinite(normalizedVariant) ? Math.max(1, Math.floor(normalizedVariant)) : index + 1,
      totalVariants: Number.isFinite(normalizedTotal) ? Math.max(1, Math.floor(normalizedTotal)) : 1,
      subtitle: String(result?.subtitle || result?.strategy || "").trim(),
      summary: String(result?.summary || result?.focus || result?.changes || "").trim(),
      format: String(result?.format || "").trim(),
      styleLabel: String(result?.styleLabel || "").trim(),
      referenceStyle: Boolean(result?.referenceStyle),
      downloadName: String(result?.downloadName || "").trim(),
      resultRole: String(result?.resultRole || "").trim(),
      isIntermediate: Boolean(result?.isIntermediate),
    };
  };

  const buildHistoryAiSummary = (mode, ai, summaryFallback) => {
    const explicitSummary = String(ai?.summary || "").trim();
    if (explicitSummary) return explicitSummary;
    if (mode === "create" && ai?.insight?.conversionAccent) {
      return "AI-инсайт: " + String(ai.insight.conversionAccent);
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
    const updatedAtCandidate = String(entry?.updatedAt || entry?.timestamps?.updatedAt || entry?.savedAt || entry?.timestamps?.savedAt || createdAt).trim();
    const updatedAtDate = new Date(updatedAtCandidate || createdAt);
    const updatedAt = Number.isNaN(updatedAtDate.getTime())
      ? createdAt
      : updatedAtDate.toISOString();
    const savedAtCandidate = String(entry?.savedAt || entry?.timestamps?.savedAt || updatedAt).trim();
    const savedAtDate = new Date(savedAtCandidate || updatedAt);
    const savedAt = Number.isNaN(savedAtDate.getTime())
      ? updatedAt
      : savedAtDate.toISOString();
    const input = {
      mainText: String(entry?.input?.mainText || "").trim(),
      secondaryText: String(entry?.input?.secondaryText || "").trim(),
      tertiaryText: String(entry?.input?.tertiaryText || "").trim(),
      description: String(entry?.input?.description || entry?.description || "").trim(),
      highlights: String(entry?.input?.highlights || entry?.highlights || "").trim(),
      generationNotes: String(entry?.input?.generationNotes || "").trim(),
      marketplace: String(entry?.input?.marketplace || entry?.meta?.marketplace || "").trim(),
      cardsCount: Number(entry?.input?.cardsCount || entry?.resultsCount || 1),
      promptMode: String(entry?.input?.promptMode || entry?.meta?.promptMode || "").trim() || "ai",
      selectedTemplateId: String(entry?.input?.selectedTemplateId || "").trim(),
      customPrompt: String(entry?.input?.customPrompt || "").trim(),
      improvePrompt: String(entry?.input?.improvePrompt || "").trim(),
      improveMode: String(entry?.input?.improveMode || entry?.meta?.improveMode || "").trim() || "ai",
      variantsCount: Number(entry?.input?.variantsCount || entry?.resultsCount || 1),
      referenceStyle: Boolean(entry?.input?.referenceStyle || entry?.meta?.referenceStyle),
      characteristics: normalizeCreateCharacteristicRows(entry?.input?.characteristics),
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
    const selectedResultId = String(entry?.selectedResultId || entry?.meta?.selectedResultId || "").trim();
    const resultPreviews = results.map((result) => result.previewUrl).filter(Boolean);
    const resultsCountSource = Number(entry?.resultsCount);
    const resultsCount = Number.isFinite(resultsCountSource)
      ? Math.max(0, Math.floor(resultsCountSource))
      : results.length;
    const prompt = String(entry?.prompt || entry?.input?.customPrompt || entry?.input?.improvePrompt || "").trim();
    const summary = String(entry?.summary || "").trim();
    const selectedResult = selectedResultId
      ? results.find((result) => result.id === selectedResultId) || null
      : null;
    const previewUrl = sanitizeHistoryPreviewUrl(entry?.previewUrl || selectedResult?.previewUrl || resultPreviews[0] || uploads[0]?.url, mode);
    const meta = {
      marketplace: String(entry?.meta?.marketplace || "").trim(),
      promptMode: String(entry?.meta?.promptMode || "").trim(),
      improveMode: String(entry?.meta?.improveMode || "").trim(),
      referenceStyle: Boolean(entry?.meta?.referenceStyle),
      selectedResultId,
      selectedProvider: String(entry?.meta?.selectedProvider || "").trim(),
      aggregateStatus: String(entry?.meta?.aggregateStatus || "").trim(),
    };
    const source = entry?.source && typeof entry.source === "object"
      ? {
          kind: String(entry.source.kind || "").trim(),
          channel: String(entry.source.channel || "").trim(),
          requestId: String(entry.source.requestId || "").trim(),
          requestedScopeId: String(entry.source.requestedScopeId || "").trim(),
          actorType: String(entry.source.actorType || "").trim(),
        }
      : null;
    const storageVersion = Number.isFinite(Number(entry?.storageVersion))
      ? Math.max(1, Math.floor(Number(entry.storageVersion)))
      : 0;

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
    const fallbackTitle =
      String(resultsCount) + " " + formatCardsWord(resultsCount) + " • " + (modeLabelMap[mode] || "Р—Р°РїСЂРѕСЃ");
    const viewEntry = { mode, input, meta };
    const view = {
      modeLabel: getHistoryModeLabel(mode),
      promptModeLabel: getHistoryPromptModeLabel(viewEntry),
      promptMeta: getHistoryPromptMeta(viewEntry),
      eyebrow: buildHistoryEyebrow(mode, input, meta, uploads.length),
      displayTitle: buildHistoryDisplayTitle(
        mode,
        String(entry?.title || "").trim(),
        input,
        uploads,
        prompt,
        summary || ai.summary,
        results
      ),
      displaySummary: buildHistoryDisplaySummary(mode, input, summary, ai.summary, prompt, results),
      originalInputText: buildHistoryOriginalInputText(mode, input, prompt),
      characteristicsSummary: buildHistoryCharacteristicsSummary(input.characteristics),
      templateTitle: getCreateTemplateTitleById(input.selectedTemplateId),
    };

    return {
      id:
        String(entry?.id || "").trim() ||
        "history-" + String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
      mode,
      createdAt,
      updatedAt,
      savedAt,
      timestamps: {
        createdAt,
        updatedAt,
        savedAt,
      },
      storageVersion,
      source,
      title:
        String(entry?.title || "").trim() ||
        String(resultsCount) + " " + formatCardsWord(resultsCount) + " • " + (modeLabelMap[mode] || "Запрос"),
      summary: summary || "Описание не указано.",
      prompt,
      resultsCount,
      selectedResultId,
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
      meta,
      view,
    };
  };

  const sortHistoryEntriesDesc = (entries) => {
    return entries.sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
  };

  const serializeHistoryEntry = (entry) => {
    return {
      id: entry.id,
      mode: entry.mode,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      savedAt: entry.savedAt,
      timestamps: entry.timestamps,
      storageVersion: entry.storageVersion,
      source: entry.source,
      title: entry.title,
      summary: entry.summary,
      prompt: entry.prompt,
      resultsCount: entry.resultsCount,
      selectedResultId: entry.selectedResultId,
      previewUrl: entry.previewUrl,
      resultPreviews: entry.resultPreviews,
      input: entry.input,
      uploads: entry.uploads,
      ai: entry.ai,
      results: entry.results,
      meta: entry.meta,
    };
  };

  const getHistoryMirrorScopeId = (scopeId) => {
    const explicitScopeId = String(scopeId || "").trim();
    if (activeUser?.uid) return "user:" + String(activeUser.uid).trim();
    return explicitScopeId || "guest";
  };

  const getHistoryMirrorStorageKey = (scopeId) => {
    return HISTORY_CLIENT_MIRROR_PREFIX + getHistoryMirrorScopeId(scopeId);
  };

  const mergeHistoryEntrySources = (...sources) => {
    const byId = new Map();
    sources.flat().forEach((entry) => {
      if (!entry) return;
      const normalized = normalizeHistoryEntry(entry);
      if (!normalized?.id) return;
      const existing = byId.get(normalized.id);
      if (!existing || new Date(normalized.updatedAt).getTime() >= new Date(existing.updatedAt).getTime()) {
        byId.set(normalized.id, normalized);
      }
    });
    return sortHistoryEntriesDesc(Array.from(byId.values())).slice(0, HISTORY_MAX_ITEMS);
  };

  const readLocalHistoryMirror = (scopeId) => {
    try {
      const raw = window.localStorage?.getItem(getHistoryMirrorStorageKey(scopeId));
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  };

  const writeLocalHistoryMirror = (scopeId, entries) => {
    try {
      window.localStorage?.setItem(
        getHistoryMirrorStorageKey(scopeId),
        JSON.stringify((Array.isArray(entries) ? entries : []).slice(0, HISTORY_MAX_ITEMS))
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  const getFirestoreHistoryMirrorCollection = () => {
    if (!db || !activeUser?.uid) return null;
    return db.collection("users").doc(activeUser.uid).collection("kartochkaHistory");
  };

  const loadHistoryMirror = async (scopeId, limit = HISTORY_MAX_ITEMS) => {
    const localEntries = readLocalHistoryMirror(scopeId);
    const collection = getFirestoreHistoryMirrorCollection();
    if (!collection) {
      return localEntries.slice(0, limit);
    }

    try {
      const snapshot = await collection
        .orderBy("createdAt", "desc")
        .limit(Math.max(1, Math.min(HISTORY_MAX_ITEMS, Number(limit) || HISTORY_MAX_ITEMS)))
        .get();
      const firestoreEntries = snapshot.docs.map((document) => document.data()).filter(Boolean);
      return mergeHistoryEntrySources(firestoreEntries, localEntries).slice(0, limit);
    } catch (error) {
      return localEntries.slice(0, limit);
    }
  };

  const persistHistoryMirror = async (entries, options = {}) => {
    const scopeId = getHistoryMirrorScopeId(options.scopeId);
    const serializableEntries = (Array.isArray(entries) ? entries : [])
      .map((entry) => normalizeHistoryEntry(entry))
      .filter(Boolean)
      .map((entry) => serializeHistoryEntry(entry))
      .slice(0, HISTORY_MAX_ITEMS);

    writeLocalHistoryMirror(scopeId, serializableEntries);

    const collection = getFirestoreHistoryMirrorCollection();
    if (!collection) return false;

    try {
      const mode = String(options.mode || "replace").trim().toLowerCase();
      if (mode === "clear") {
        const snapshot = await collection.limit(HISTORY_MAX_ITEMS).get();
        const batch = db.batch();
        snapshot.docs.forEach((document) => batch.delete(document.ref));
        await batch.commit();
        return true;
      }

      if (mode === "entry" && options.entry) {
        const normalizedEntry = normalizeHistoryEntry(options.entry);
        if (!normalizedEntry) return false;
        const entry = serializeHistoryEntry(normalizedEntry);
        await collection.doc(entry.id).set(entry, { merge: true });
        return true;
      }

      const snapshot = await collection.limit(HISTORY_MAX_ITEMS).get();
      const batch = db.batch();
      const nextIds = new Set(serializableEntries.map((entry) => entry.id));
      serializableEntries.forEach((entry) => {
        batch.set(collection.doc(entry.id), entry, { merge: true });
      });
      snapshot.docs.forEach((document) => {
        if (!nextIds.has(document.id)) batch.delete(document.ref);
      });
      await batch.commit();
      return true;
    } catch (error) {
      return false;
    }
  };

  const applyHistoryEntriesFromSource = (sourceEntries, options = {}) => {
    const normalized = sortHistoryEntriesDesc(
      (Array.isArray(sourceEntries) ? sourceEntries : []).map(normalizeHistoryEntry)
    ).slice(0, HISTORY_MAX_ITEMS);
    const preferredSelectedId = String(
      Object.prototype.hasOwnProperty.call(options, "selectedEntryId")
        ? options.selectedEntryId
        : selectedHistoryEntryId
    ).trim();

    historyEntries.length = 0;
    historyEntries.push(...normalized);

    if (preferredSelectedId && historyEntries.some((entry) => entry.id === preferredSelectedId)) {
      selectedHistoryEntryId = preferredSelectedId;
    } else {
      selectedHistoryEntryId = historyEntries[0]?.id || "";
    }

    historyDetailsVisible = Boolean(selectedHistoryEntryId);
    if (!historyDetailsVisible) {
      historyDetailsLoadingId = "";
    }

    return normalized;
  };

  const persistHistory = async (options = {}) => {
    if (!serviceClient?.historySave) {
      throw new Error("History backend is not configured.");
    }

    const serializable = historyEntries.map((entry) => serializeHistoryEntry(entry));
    const persistMode = String(options?.mode || "replace").trim().toLowerCase();
    const scopeId = String(options?.scopeId || getHistoryScopeId(activeUser)).trim();
    const singleEntry = options?.entry ? serializeHistoryEntry(options.entry) : null;
    let response;

    if (persistMode === "clear") {
      response = await serviceClient.historySave({
        scopeId,
        clear: true,
      });
    } else if (persistMode === "entry" && singleEntry) {
      response = await serviceClient.historySave({
        scopeId,
        entry: singleEntry,
      });
    } else {
      response = await serviceClient.historySave({
        scopeId,
        entries: serializable,
      });
    }

    const normalizedEntries = applyHistoryEntriesFromSource(response?.entries, {
      selectedEntryId: persistMode === "clear"
        ? ""
        : (singleEntry?.id || options?.selectedEntryId || selectedHistoryEntryId),
    });
    await persistHistoryMirror(normalizedEntries, {
      mode: persistMode,
      scopeId,
      entry: singleEntry,
    });
    const storage = response?.storage && typeof response.storage === "object" ? response.storage : null;
    const storageMode = String(storage?.mode || "").trim().toLowerCase();
    const fallbackUsed = Boolean(storage?.fallbackUsed);

    setHistorySyncStatus({
      level: fallbackUsed ? "warning" : "idle",
      message: fallbackUsed
        ? "История сохранена, но backend использовал резервное хранилище. Для production нужен Firestore."
        : "",
      storageMode,
      fallbackUsed,
      savedAt: String(response?.savedAt || "").trim(),
    });

    return {
      ...response,
      entries: normalizedEntries,
      storage,
    };
  };

  const loadHistory = async (options = {}) => {
    const previousEntryId = selectedHistoryEntryId;
    const requestId = Number(options.requestId) || 0;
    const expectedScopeId = String(options.scopeId || getHistoryScopeId(activeUser));
    const hasExistingEntries = historyEntries.length > 0;

    if (!serviceClient?.historyList) {
      if ((requestId && requestId !== historyLoadRequestId) || expectedScopeId !== getHistoryScopeId(activeUser)) {
        return false;
      }
      historyEntries.length = 0;
      selectedHistoryEntryId = "";
      historyDetailsVisible = false;
      historyDetailsLoadingId = "";
      buildHistoryPersistenceFeedback(new Error("History backend is not configured."), "load", { hasEntries: false });
      return false;
    }

    try {
      const sourceEntries = await serviceClient.historyList({
        scopeId: expectedScopeId,
        limit: HISTORY_MAX_ITEMS,
      });
      const mirrorEntries = await loadHistoryMirror(expectedScopeId, HISTORY_MAX_ITEMS);

      if ((requestId && requestId !== historyLoadRequestId) || expectedScopeId !== getHistoryScopeId(activeUser)) {
        return false;
      }

      const mergedEntries = mergeHistoryEntrySources(sourceEntries, mirrorEntries);
      applyHistoryEntriesFromSource(mergedEntries, {
        selectedEntryId: previousEntryId,
      });
      if (mergedEntries.length) {
        void persistHistoryMirror(mergedEntries, { mode: "replace", scopeId: expectedScopeId });
      }
      resetHistorySyncStatus();
      return true;
    } catch (error) {
      if ((requestId && requestId !== historyLoadRequestId) || expectedScopeId !== getHistoryScopeId(activeUser)) {
        return false;
      }

      const mirrorEntries = await loadHistoryMirror(expectedScopeId, HISTORY_MAX_ITEMS);
      if (mirrorEntries.length) {
        applyHistoryEntriesFromSource(mirrorEntries, {
          selectedEntryId: previousEntryId,
        });
      } else if (!hasExistingEntries) {
        historyEntries.length = 0;
        selectedHistoryEntryId = "";
        historyDetailsVisible = false;
        historyDetailsLoadingId = "";
      }

      buildHistoryPersistenceFeedback(error, "load", { hasEntries: hasExistingEntries });
      return mirrorEntries.length > 0;
    }
  };

  const clearHistory = async () => {
    const requestId = ++historyLoadRequestId;
    const scopeId = getHistoryScopeId(activeUser);
    historyIsLoading = true;
    renderHistory();

    try {
      await persistHistory({
        mode: "clear",
        scopeId,
        selectedEntryId: "",
      });
    } catch (error) {
      buildHistoryPersistenceFeedback(error, "clear");
    } finally {
      if (requestId === historyLoadRequestId && scopeId === getHistoryScopeId(activeUser)) {
        historyIsLoading = false;
        renderHistory();
      }
    }
  };

  const refreshHistory = async () => {
    const requestId = ++historyLoadRequestId;
    const scopeId = getHistoryScopeId(activeUser);
    historyIsLoading = true;
    renderHistory();
    try {
      await loadHistory({ requestId, scopeId });
    } finally {
      if (requestId === historyLoadRequestId && scopeId === getHistoryScopeId(activeUser)) {
        historyIsLoading = false;
        renderHistory();
      }
    }
  };

  const getHistoryEntryById = (entryId) => {
    const safeId = String(entryId || "").trim();
    if (!safeId) return null;
    return historyEntries.find((entry) => entry.id === safeId) || null;
  };

  const upsertHistoryEntry = (entry) => {
    if (!entry) return;
    const existingIndex = historyEntries.findIndex((item) => item.id === entry.id);
    if (existingIndex >= 0) {
      historyEntries.splice(existingIndex, 1, entry);
    } else {
      historyEntries.unshift(entry);
    }
    sortHistoryEntriesDesc(historyEntries);
  };

  const getHistoryPrimaryResult = (entry) => {
    if (!entry) return null;
    if (Array.isArray(entry.results) && entry.results.length) {
      const selectedResultId = String(entry.selectedResultId || entry.meta?.selectedResultId || "").trim();
      if (selectedResultId) {
        const selected = entry.results.find((result) => result.id === selectedResultId && result.previewUrl) || null;
        if (selected) return selected;
      }
      return entry.results.find((result) => result.previewUrl && result.status !== "failed") || entry.results[0] || null;
    }
    return null;
  };

  const getHistoryResultById = (entry, resultId) => {
    const safeId = String(resultId || "").trim();
    if (!entry) return null;
    if (!safeId) return getHistoryPrimaryResult(entry);
    return entry.results.find((result) => result.id === safeId) || getHistoryPrimaryResult(entry);
  };

  const hydrateHistoryEntry = async (entryId) => {
    const safeId = String(entryId || "").trim();
    if (!safeId || !serviceClient?.historyGetById) return;
    const scopeId = getHistoryScopeId(activeUser);

    historyDetailsLoadingId = safeId;
    const requestId = ++historyDetailsRequestId;
    renderHistoryDetails();

    try {
      const rawEntry = await serviceClient.historyGetById({
        scopeId,
        id: safeId,
      });
      if (requestId !== historyDetailsRequestId || scopeId !== getHistoryScopeId(activeUser)) return;
      if (!rawEntry) {
        setHistorySyncStatus({
          level: "error",
          message: "Запись больше не найдена в backend. Обновите историю, чтобы увидеть актуальный список.",
        });
        return;
      }
      upsertHistoryEntry(normalizeHistoryEntry(rawEntry));
      resetHistorySyncStatus();
    } catch (error) {
      setHistorySyncStatus({
        level: "error",
        message: "Не удалось обновить детали записи из backend. Показана последняя подтвержденная версия.",
      });
    } finally {
      if (requestId === historyDetailsRequestId && scopeId === getHistoryScopeId(activeUser)) {
        historyDetailsLoadingId = "";
        renderHistory();
      }
    }
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
          { label: "Стиль референса", value: entry.input.referenceStyle ? "Включен" : "Не включен" },
          { label: "Комментарий", value: entry.input.improvePrompt || "Не указан" },
        ]
      : [
          { label: "Маркетплейс", value: entry.input.marketplace || "Не указан" },
          { label: "Количество карточек", value: String(entry.input.cardsCount || entry.resultsCount || 1) },
          { label: "Режим промпта", value: entry.input.promptMode === "custom" ? "Свой промпт" : "AI-промпт" },
          { label: "Описание товара", value: entry.input.description || "Не указано" },
        ];

    const displayRows = entry.mode === "improve"
      ? [
          { label: "Режим", value: getHistoryImproveModeLabel(entry.input.improveMode) },
          { label: "Результаты", value: buildHistoryResultsCountLabel(entry.resultsCount) },
          { label: "Вариантов", value: String(entry.input.variantsCount || entry.resultsCount || 1) },
          { label: "Исходники", value: buildHistoryUploadsCountLabel(entry.uploads.length) },
          { label: "Reference style", value: entry.input.referenceStyle ? "Включен" : "Не включен" },
        ]
      : [
          { label: "Маркетплейс", value: entry.input.marketplace || "Не указан" },
          { label: "Результаты", value: buildHistoryResultsCountLabel(entry.resultsCount) },
          { label: "Сколько просили", value: String(entry.input.cardsCount || entry.resultsCount || 1) },
          { label: "Исходники", value: buildHistoryUploadsCountLabel(entry.uploads.length) },
          { label: "Режим prompt", value: entry.view?.promptModeLabel || getHistoryPromptModeLabel(entry) },
          { label: "Шаблон", value: entry.view?.templateTitle || "Не сохранен" },
          { label: "Характеристики", value: entry.view?.characteristicsSummary || "Не сохранены", wide: true },
        ];

    displayRows.forEach((row) => {
      const item = document.createElement("article");
      item.className = "history-mode-kv-item";
      item.classList.toggle("is-wide", Boolean(row.wide));
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

      const analysisMetaRows = [
        { label: "Формат", value: analysis.marketplaceFormat },
        { label: "Контекст", value: analysis.reference?.note },
      ].filter((item) => item.value);

      if (analysisMetaRows.length) {
        const analysisMetaGrid = document.createElement("div");
        analysisMetaGrid.className = "history-mode-ai-grid";
        analysisMetaRows.forEach((item) => {
          const metaItem = document.createElement("article");
          metaItem.className = "history-mode-ai-item";
          const label = document.createElement("span");
          label.textContent = item.label;
          const value = document.createElement("p");
          value.textContent = item.value;
          metaItem.append(label, value);
          analysisMetaGrid.append(metaItem);
        });
        analysisWrap.append(analysisMetaGrid);
      }

      const issues = Array.isArray(analysis.issues) ? analysis.issues : [];
      if (issues.length) {
        const issuesTitle = document.createElement("p");
        issuesTitle.className = "history-mode-analysis-label";
        issuesTitle.textContent = "Зоны внимания";
        const issueList = document.createElement("ul");
        issueList.className = "history-mode-analysis-issues";
        issues.slice(0, 5).forEach((issue) => {
          const issueItem = document.createElement("li");
          issueItem.textContent = issue.title + ": " + (issue.note || issue.severity);
          issueList.append(issueItem);
        });
        analysisWrap.append(issuesTitle, issueList);
      }

      const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
      if (recommendations.length) {
        const recommendationsTitle = document.createElement("p");
        recommendationsTitle.className = "history-mode-analysis-label";
        recommendationsTitle.textContent = "Что можно повторно использовать";
        const recommendationsList = document.createElement("ul");
        recommendationsList.className = "history-mode-analysis-recommendations";
        recommendations.slice(0, 4).forEach((item) => {
          const recommendationItem = document.createElement("li");
          recommendationItem.textContent = item;
          recommendationsList.append(recommendationItem);
        });
        analysisWrap.append(recommendationsTitle, recommendationsList);
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
      meta.textContent = [
        result.providerLabel || result.provider || "",
        "Вариант " + String(result.variantNumber || 1) + " из " + String(result.totalVariants || entry.resultsCount || 1),
        result.status === "failed" ? "failed" : "",
      ].filter(Boolean).join(" • ");

      const summary = document.createElement("span");
      summary.textContent = truncateHistoryText(
        result.summary || result.subtitle || result.format || "",
        120
      ) || "Описание результата не сохранено.";

      const actions = document.createElement("div");
      actions.className = "history-mode-result-actions";

      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.className = "history-mode-open";
      openButton.dataset.historyResultPreviewEntryId = entry.id;
      openButton.dataset.historyResultPreviewId = result.id;
      openButton.textContent = "Открыть";

      const exportLink = document.createElement("a");
      exportLink.className = "history-mode-export";
      exportLink.href = sanitizeHistoryPreviewUrl(result.previewUrl, entry.mode);
      exportLink.setAttribute("download", buildHistoryExportName(entry, result));
      exportLink.textContent = "Экспорт";

      actions.append(openButton, exportLink);
      body.append(title, meta, summary, actions);
      card.append(image, body);
      historyDetailsResults.append(card);
    });
  };

  const closeHistoryDetailsModal = () => {
    historyDetailsVisible = false;
    if (!historyModeDetails) return;
    historyModeDetails.classList.remove("is-loading");
    historyModeDetails.setAttribute("aria-hidden", "false");
    historyModeDetailsContent?.classList.add("hidden");
    historyModeDetailsEmpty?.classList.remove("hidden");
  };

  const closeHistoryPreviewModal = () => {
    historyPreviewVisible = false;
    selectedHistoryPreviewEntryId = "";
    selectedHistoryPreviewResultId = "";
    if (!historyPreviewModal) return;
    historyPreviewModal.classList.add("hidden");
    historyPreviewModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("history-preview-open");
    if (historyPreviewImage) {
      historyPreviewImage.removeAttribute("src");
    }
    if (historyPreviewExportBtn) {
      historyPreviewExportBtn.setAttribute("href", "#");
      historyPreviewExportBtn.removeAttribute("download");
    }
  };

  const openHistoryPreviewModal = (entryId, resultId) => {
    const entry = getHistoryEntryById(entryId);
    if (!entry || !historyPreviewModal) return;

    const selectedResult = getHistoryResultById(entry, resultId);
    const previewUrl = sanitizeHistoryPreviewUrl(selectedResult?.previewUrl || entry.previewUrl, entry.mode);
    selectedHistoryPreviewEntryId = entry.id;
    selectedHistoryPreviewResultId = selectedResult?.id || "";
    historyPreviewVisible = true;

    if (historyPreviewTitle) historyPreviewTitle.textContent = entry.title || "Превью";
    if (historyPreviewTitle) {
      historyPreviewTitle.textContent =
        selectedResult?.title
        || entry.view?.displayTitle
        || entry.title
        || "Превью";
    }
    if (historyPreviewMeta) {
      historyPreviewMeta.textContent =
        formatHistoryDate(entry.createdAt) +
        " • " +
        String(entry.resultsCount || 1) +
        " " +
        formatCardsWord(entry.resultsCount || 1);
    }
    if (historyPreviewImage) {
      if (historyPreviewMeta) {
        const metaParts = [
          formatHistoryDate(entry.createdAt),
          entry.view?.modeLabel || getHistoryModeLabel(entry.mode),
          selectedResult
            ? "Вариант " + String(selectedResult.variantNumber || 1) + " из " + String(selectedResult.totalVariants || entry.resultsCount || 1)
            : buildHistoryResultsCountLabel(entry.resultsCount),
        ].filter(Boolean);
        historyPreviewMeta.textContent = metaParts.join(" • ");
      }
      historyPreviewImage.src = previewUrl;
    }
    if (historyPreviewExportBtn) {
      historyPreviewExportBtn.href = previewUrl;
      historyPreviewExportBtn.setAttribute("download", buildHistoryExportName(entry));
      historyPreviewExportBtn.setAttribute("download", buildHistoryExportName(entry, selectedResult));
    }

    historyPreviewModal.classList.remove("hidden");
    historyPreviewModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("history-preview-open");
  };

  const openHistoryDetailsModal = () => {
    historyDetailsVisible = true;
    if (!historyModeDetails) return;
    historyModeDetails.setAttribute("aria-hidden", "false");
    historyModeDetailsContent?.classList.remove("hidden");
    historyModeDetailsEmpty?.classList.add("hidden");
  };

  const renderHistoryDetails = () => {
    // Details panel is hidden in gallery design
    return;
    if (!historyModeDetails) return;

    const selectedEntry = getHistoryEntryById(selectedHistoryEntryId) || null;
    if (!selectedEntry || !historyDetailsVisible) {
      closeHistoryDetailsModal();
      historyReuseBtn?.setAttribute("disabled", "disabled");
      historyReusePromptBtn?.setAttribute("disabled", "disabled");
      historyOpenResultBtn?.setAttribute("disabled", "disabled");
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
      historyDetailsPrompt.textContent = promptValue || "Пользовательский промпт не указан.";
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
      historyReuseBtn.textContent = historyReuseInProgress
        ? "Загружаем данные..."
        : "Использовать как основу снова";
    }
    historyModeDetails.classList.toggle("is-loading", historyDetailsLoadingId === selectedEntry.id);
    if (historyDetailsEyebrow) {
      historyDetailsEyebrow.textContent = selectedEntry.view?.eyebrow || getHistoryModeLabel(selectedEntry.mode);
    }
    if (historyDetailsTitle) {
      historyDetailsTitle.textContent = selectedEntry.view?.displayTitle || selectedEntry.title;
    }
    if (historyDetailsDate) {
      const suffix = historyDetailsLoadingId === selectedEntry.id ? " • Обновляем запись..." : "";
      historyDetailsDate.textContent = formatHistoryDateTime(selectedEntry.createdAt) + suffix;
    }
    if (historyDetailsMode) {
      historyDetailsMode.textContent = selectedEntry.view?.modeLabel || getHistoryModeLabel(selectedEntry.mode);
      historyDetailsMode.className = "history-mode-tag " + getHistoryModeTag(selectedEntry.mode);
    }
    if (historyDetailsCount) {
      historyDetailsCount.textContent =
        buildHistoryResultsCountLabel(selectedEntry.resultsCount)
        + " • "
        + buildHistoryUploadsCountLabel(selectedEntry.uploads.length);
    }
    if (historyDetailsSummary) {
      historyDetailsSummary.textContent = selectedEntry.view?.displaySummary || selectedEntry.summary;
    }
    if (historyDetailsPromptMeta) {
      historyDetailsPromptMeta.textContent = selectedEntry.view?.promptMeta || getHistoryPromptMeta(selectedEntry);
    }
    if (historyDetailsPrompt) {
      const promptValue = selectedEntry.prompt || selectedEntry.input.customPrompt || selectedEntry.input.improvePrompt || "";
      historyDetailsPrompt.textContent = promptValue || "Prompt для этой записи не сохранен.";
    }
    if (historyDetailsHighlights) {
      historyDetailsHighlights.textContent =
        selectedEntry.view?.originalInputText
        || "Текстовые вводные для этой записи не сохранены.";
    }
    if (historyReusePromptBtn) {
      historyReusePromptBtn.dataset.historyPromptReuseId = selectedEntry.id;
      historyReusePromptBtn.toggleAttribute("disabled", historyReuseInProgress || !selectedEntry.prompt);
    }
    if (historyOpenResultBtn) {
      historyOpenResultBtn.dataset.historyOpenResultId = selectedEntry.id;
      historyOpenResultBtn.toggleAttribute("disabled", !getHistoryPrimaryResult(selectedEntry));
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
      historyModeStats.textContent = historyIsLoading
        ? (historyEntries.length ? "Обновляем историю..." : "Загружаем историю...")
        : buildHistoryStatsText(historyEntries);
    }
    if (historyModeNote) {
      historyModeNote.textContent = historyIsLoading
        ? "Подтягиваем историю из backend..."
        : (historySyncStatus.message || getHistoryDefaultNote());
    }
    historyModeRefreshBtn?.toggleAttribute("disabled", historyIsLoading);
    historyModeRefreshBtn?.classList.toggle("is-loading", historyIsLoading);
    historyModeClearBtn?.toggleAttribute("disabled", historyIsLoading || !historyEntries.length);

    if (!historyEntries.length) {
      historyModeEmpty?.classList.remove("hidden");
      if (historyModeEmpty) {
        historyModeEmpty.textContent = historyIsLoading
          ? "Загружаем историю из backend..."
          : (historySyncStatus.message || getHistoryDefaultEmptyText());
      }
      return;
    }

    historyModeEmpty?.classList.add("hidden");

    const createHistoryExportLink = (href, downloadName) => {
      const exportLink = document.createElement("a");
      exportLink.className = "btn history-gallery-export-btn";
      exportLink.textContent = "Скачать";
      exportLink.href = href;
      exportLink.download = downloadName;
      exportLink.setAttribute("aria-label", "Скачать карточку");
      exportLink.addEventListener("click", (e) => e.stopPropagation());
      return exportLink;
    };

    const isTextReplaceHistoryEntry = (entry, results) => {
      if (entry?.input?.selectedTemplateId === "tpl-preserve-card-replace-text") return true;
      return results.some((result) => {
        const marker = [
          result?.id,
          result?.title,
          result?.downloadName,
        ].map((item) => String(item || "").toLowerCase()).join(" ");
        return marker.includes("text-replace") || marker.includes("gemini");
      });
    };

    const getTextReplaceStackResults = (results) => {
      const normalized = Array.isArray(results) ? results.filter((result) => result?.previewUrl) : [];
      const getMarker = (result) => [
        result?.id,
        result?.title,
        result?.downloadName,
        result?.resultRole,
        result?.style,
      ].map((item) => String(item || "").toLowerCase()).join(" ");
      const geminiResult = normalized.find((result) => {
        const marker = getMarker(result);
        return marker.includes("gemini") || marker.includes("intermediate");
      });
      const finalResult = normalized.find((result) => {
        const marker = getMarker(result);
        return marker.includes("final") || marker.includes("финаль") || marker.includes("замен");
      });
      return [geminiResult, finalResult]
        .filter(Boolean)
        .filter((result, index, list) => list.findIndex((item) => item === result) === index);
    };

    // Gallery: one card per result image, except text-replace pairs stay grouped.
    historyEntries.forEach((entry) => {
      const results = Array.isArray(entry?.results) && entry.results.length
        ? entry.results
        : (Array.isArray(entry?.resultPreviews) && entry.resultPreviews.length
            ? entry.resultPreviews.map((url, i) => ({
                id: "",
                previewUrl: url,
                downloadName: "",
                title: entry.title + (i > 0 ? " " + String(i + 1) : ""),
              }))
            : [{ id: "", previewUrl: entry.previewUrl, downloadName: "", title: entry.title }]);

      if (isTextReplaceHistoryEntry(entry, results) && results.length > 1) {
        const stackResults = getTextReplaceStackResults(results);
        const stackCard = document.createElement("article");
        stackCard.className = "history-gallery-card history-gallery-stack-card";

        stackResults.forEach((result) => {
          const imgUrl = sanitizeHistoryPreviewUrl(result.previewUrl, entry.mode);
          if (!imgUrl) return;

          const item = document.createElement("div");
          item.className = "history-gallery-stack-item";
          item.tabIndex = 0;
          item.setAttribute("role", "button");
          item.setAttribute("aria-label", "Открыть результат: " + (result.title || entry.title || "Карточка"));

          const img = document.createElement("img");
          img.src = imgUrl;
          img.alt = result.title || entry.title || "Карточка";
          img.loading = "lazy";
          img.decoding = "async";
          img.addEventListener("error", () => { img.src = getHistoryFallbackPreview(entry.mode); });

          const label = document.createElement("span");
          label.className = "history-gallery-stack-label";
          label.textContent = result.title || "Вариант";

          const overlay = document.createElement("span");
          overlay.className = "history-gallery-overlay";
          overlay.append(createHistoryExportLink(imgUrl, result.downloadName || buildHistoryExportName(entry, result)));

          item.append(img, label, overlay);
          item.addEventListener("click", () => openHistoryPreviewModal(entry.id, result.id || ""));
          item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openHistoryPreviewModal(entry.id, result.id || "");
            }
          });
          stackCard.append(item);
        });

        if (stackCard.children.length) {
          historyModeList.append(stackCard);
        }
        return;
      }

      results.forEach((result) => {
        const imgUrl = sanitizeHistoryPreviewUrl(result.previewUrl, entry.mode);
        if (!imgUrl) return;

        const card = document.createElement("article");
        card.className = "history-gallery-card";

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = result.title || entry.title || "Карточка";
        img.loading = "lazy";
        img.decoding = "async";
        img.addEventListener("error", () => { img.src = getHistoryFallbackPreview(entry.mode); });

        const overlay = document.createElement("div");
        overlay.className = "history-gallery-overlay";

        overlay.append(createHistoryExportLink(imgUrl, result.downloadName || buildHistoryExportName(entry, result)));
        card.append(img, overlay);

        card.addEventListener("click", () => openHistoryPreviewModal(entry.id, result.id || ""));
        historyModeList.append(card);
      });
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

  const pushHistory = async (entry) => {
    const normalizedEntry = normalizeHistoryEntry({
      ...entry,
      createdAt: new Date().toISOString(),
    });

    try {
      const response = await persistHistory({
        mode: "entry",
        entry: normalizedEntry,
        selectedEntryId: normalizedEntry.id,
      });
      renderHistory();
      return {
        ok: true,
        entry: getHistoryEntryById(normalizedEntry.id) || normalizedEntry,
        storage: response?.storage || null,
      };
    } catch (error) {
      upsertHistoryEntry(normalizedEntry);
      await persistHistoryMirror(historyEntries.map((item) => serializeHistoryEntry(item)), {
        mode: "entry",
        scopeId: getHistoryScopeId(activeUser),
        entry: normalizedEntry,
      });
      const feedback = buildHistoryPersistenceFeedback(error, "save");
      renderHistory();
      return {
        ok: true,
        entry: getHistoryEntryById(normalizedEntry.id) || normalizedEntry,
        error,
        feedback,
        storage: {
          mode: "client_mirror",
          fallbackUsed: true,
        },
      };
    }
  };

  const persistCreateVariantSelection = async (result) => {
    const resultId = String(result?.id || "").trim();
    if (!resultId || !createLastHistoryEntryId) return;

    const entry = getHistoryEntryById(createLastHistoryEntryId);
    if (!entry || entry.mode !== "create") return;

    const historyResult = entry.results.find((item) => item.id === resultId) || null;
    if (!historyResult || !historyResult.previewUrl) return;

    const updatedEntry = normalizeHistoryEntry({
      ...entry,
      selectedResultId: resultId,
      previewUrl: historyResult.previewUrl,
      meta: {
        ...(entry.meta || {}),
        selectedResultId: resultId,
        selectedProvider: historyResult.provider || result.provider || "",
        aggregateStatus: historyResult.aggregateStatus || result.aggregateStatus || "",
      },
    });

    upsertHistoryEntry(updatedEntry);
    renderHistory();

    try {
      await persistHistory({
        mode: "entry",
        entry: updatedEntry,
        selectedEntryId: updatedEntry.id,
      });
    } catch (error) {
      await persistHistoryMirror(historyEntries.map((item) => serializeHistoryEntry(item)), {
        mode: "entry",
        scopeId: getHistoryScopeId(activeUser),
        entry: updatedEntry,
      });
    }
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
    const historyResults = Array.isArray(results) ? results : [];
    const files = createSelectedFiles.slice(0, CREATE_UPLOAD_MAX_FILES);
    const uploadsWithPreview = await Promise.all(
      files.map(async (file, index) => {
        const blobPreview = getCreateFilePreviewUrl(file);
        let url = "";
        try {
          url = await buildHistoryImageSnapshot(blobPreview);
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

    const normalizedResults = await Promise.all(historyResults
      .slice(0, CREATE_UPLOAD_MAX_FILES)
      .map(async (result, index) => {
        const rawPreview = String(result.previewUrl || "").trim();
        const previewSource = previewLookup.get(rawPreview) || sanitizeHistoryPreviewUrl(rawPreview, "create");
        const resolvedPreview = await buildHistoryImageSnapshot(previewSource, {
          preferAsset: true,
          assetKind: "create-result-preview",
        });
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
      }));

    const selectedHistoryResult = normalizedResults.find((item) => item.id === createActivePreviewResultId && item.previewUrl)
      || normalizedResults.find((item) => item.previewUrl)
      || null;
    const insight = payload?.insight ? { ...payload.insight } : (createInsightData ? { ...createInsightData } : null);
    const resolvedPrompt = String(payload?.prompt || resolveCreatePromptForGeneration() || "").trim();
    const summary = String(payload?.description || payload?.highlights || "Создание карточек товара").trim();
    const productContext = buildCreateProductContextPayload();

    return {
      summary: summary.slice(0, 180),
      prompt: resolvedPrompt.slice(0, 8000),
      selectedResultId: selectedHistoryResult?.id || "",
      previewUrl: selectedHistoryResult?.previewUrl || "",
      resultPreviews: normalizedResults.map((item) => item.previewUrl).filter(Boolean),
      input: {
        description: String(payload?.description || "").trim(),
        highlights: String(payload?.highlights || "").trim(),
        generationNotes: String(payload?.generationNotes || buildCreateGenerationNotesValue() || "").trim(),
        mainText: getCreateProductTitleValue(),
        secondaryText: getCreateProductShortDescriptionValue(),
        tertiaryText: getCreateProductThirdLevelTextValue(),
        marketplace: String(payload?.marketplace || "").trim(),
        cardsCount: Number(payload?.cardsCount || normalizedResults.length || 1),
        promptMode: String(payload?.promptMode || createPromptMode || "ai"),
        selectedTemplateId: String(payload?.selectedTemplate?.id || createSelectedTemplateId || ""),
        productTypeId: String(payload?.productTypeId || productContext.productTypeId || ""),
        productType: String(payload?.productType || productContext.productType || ""),
        productTypeSource: String(payload?.productTypeSource || createProductTypeSource || "default"),
        productAngleId: String(payload?.productAngleId || productContext.productAngleId || ""),
        productAngle: String(payload?.productAngle || productContext.productAngle || ""),
        customPrompt: String(createCustomPrompt?.value || "").trim(),
        improvePrompt: "",
        improveMode: "ai",
        variantsCount: Number(payload?.cardsCount || normalizedResults.length || 1),
        referenceStyle: false,
        characteristics: getCreateCharacteristicRows(),
      },
      uploads,
      ai: {
        summary: buildHistoryAiSummary("create", { insight }, summary),
        insight,
        analysis: null,
      },
      results: normalizedResults,
      meta: {
        selectedResultId: selectedHistoryResult?.id || "",
        selectedProvider: selectedHistoryResult?.provider || "",
        aggregateStatus: selectedHistoryResult?.aggregateStatus || "",
      },
    };
  };

  const buildImproveHistoryPayload = async (payload, results) => {
    const uploads = [];
    if (improveImagePreview) {
      uploads.push({
        id: "upload-" + String(Date.now()) + "-1",
        role: "source",
        name: improveImageFile?.name || "source-card.png",
        type: improveImageFile?.type || "image/png",
        url: await buildHistoryImageSnapshot(sanitizeHistoryPreviewUrl(improveImagePreview, "improve")),
      });
    }
    if (improveReferencePreviewUrl) {
      uploads.push({
        id: "upload-" + String(Date.now()) + "-2",
        role: "reference",
        name: improveReferenceFile?.name || "reference-card.png",
        type: improveReferenceFile?.type || "image/png",
        url: await buildHistoryImageSnapshot(sanitizeHistoryPreviewUrl(improveReferencePreviewUrl, "improve")),
      });
    }

    const normalizedResults = await Promise.all((Array.isArray(results) ? results : [])
      .slice(0, CREATE_UPLOAD_MAX_FILES)
      .map(async (result, index) => {
        const fallbackPreview = uploads[index]?.url || uploads[0]?.url || getHistoryFallbackPreview("improve");
        const compactPreview = await buildHistoryImageSnapshot(sanitizeHistoryPreviewUrl(result.previewUrl, "improve"), {
          preferAsset: true,
          assetKind: "improve-result-preview",
        });
        return normalizeHistoryResult(
          {
            ...result,
            previewUrl: compactPreview,
            subtitle: result.strategy || "",
            summary: result.changes || result.promptPreview || "",
          },
          "improve",
          index,
          fallbackPreview
        );
      }));

    const analysis = payload?.analysis ? { ...payload.analysis } : (improveAnalysisData ? { ...improveAnalysisData } : null);
    const improveComment = String(payload?.userPrompt || payload?.prompt || improvePrompt?.value || "").trim();
    const summary = String(analysis?.summary || improveComment || "Улучшение карточки").trim();

    return {
      summary: summary.slice(0, 180),
      prompt: improveComment.slice(0, 8000),
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

  const buildDetachedImproveHistoryPayload = async (payload = {}) => {
    const sourcePreviewUrl = sanitizeHistoryPreviewUrl(payload.sourcePreviewUrl, "improve");
    const resultPreviewUrl = sanitizeHistoryPreviewUrl(payload.resultPreviewUrl || payload.resultUrl, "improve");
    const uploads = [];

    if (sourcePreviewUrl) {
      uploads.push({
        id: "upload-" + String(Date.now()) + "-1",
        role: "source",
        name: String(payload.sourceName || "source-card.png").trim() || "source-card.png",
        type: String(payload.sourceType || "image/png").trim() || "image/png",
        url: await buildHistoryImageSnapshot(sourcePreviewUrl),
      });
    }

    const rawAnalysis = payload.analysis && typeof payload.analysis === "object" ? payload.analysis : {};
    const analysis = {
      score: Number(rawAnalysis.score || 0) || 0,
      summary: String(rawAnalysis.summary || payload.summary || payload.resultSummary || "").trim(),
      marketplaceFormat: String(rawAnalysis.marketplaceFormat || "").trim(),
      reference: {
        uploaded: Boolean(rawAnalysis.reference?.uploaded),
        active: Boolean(payload.referenceStyle || rawAnalysis.reference?.active),
        note: String(rawAnalysis.reference?.note || "").trim(),
      },
      issues: Array.isArray(rawAnalysis.issues)
        ? rawAnalysis.issues.map((issue, index) => normalizeHistoryIssue(issue, index)).slice(0, IMPROVE_ANALYSIS_DIMENSIONS.length)
        : [],
      recommendations: Array.isArray(rawAnalysis.recommendations)
        ? rawAnalysis.recommendations.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4)
        : [],
    };
    const improveComment = String(payload.userPrompt || payload.prompt || "").trim();
    const summary = String(
      analysis.summary
      || payload.resultSummary
      || payload.resultChanges
      || improveComment
      || "Улучшение карточки"
    ).trim();
    const resolvedResultPreview = await buildHistoryImageSnapshot(
      resultPreviewUrl || uploads[0]?.url || getHistoryFallbackPreview("improve"),
      {
        preferAsset: true,
        assetKind: "improve-result-preview",
      }
    );
    const result = normalizeHistoryResult(
      {
        title: String(payload.title || "1 карточка - Улучшение").trim() || "1 карточка - Улучшение",
        previewUrl: resolvedResultPreview,
        subtitle: String(payload.strategy || payload.mode || "").trim(),
        summary: String(payload.resultChanges || payload.resultSummary || summary).trim(),
        changes: String(payload.resultChanges || "").trim(),
        why: String(payload.resultWhy || "").trim(),
        preserved: String(payload.resultPreserved || "").trim(),
        variantNumber: 1,
        totalVariants: 1,
      },
      "improve",
      0,
      resolvedResultPreview || uploads[0]?.url || getHistoryFallbackPreview("improve")
    );

    return {
      summary: summary.slice(0, 180),
      prompt: improveComment.slice(0, 8000),
      previewUrl: result.previewUrl || uploads[0]?.url || getHistoryFallbackPreview("improve"),
      resultPreviews: result.previewUrl ? [result.previewUrl] : [],
      input: {
        description: "",
        highlights: "",
        marketplace: "",
        cardsCount: 1,
        promptMode: "ai",
        customPrompt: "",
        improvePrompt: improveComment,
        improveMode: String(payload.mode || "ai").trim() || "ai",
        variantsCount: 1,
        referenceStyle: Boolean(payload.referenceStyle),
      },
      uploads,
      ai: {
        summary: buildHistoryAiSummary("improve", { analysis }, summary),
        insight: null,
        analysis,
      },
      results: [result],
    };
  };

  window.KARTOCHKA_HISTORY = {
    async recordDetachedImproveResult(payload = {}) {
      const historyPayload = await buildDetachedImproveHistoryPayload(payload);
      return pushHistory({
        mode: "improve",
        title: String(payload.title || "1 карточка - Улучшение").trim() || "1 карточка - Улучшение",
        summary: historyPayload.summary,
        prompt: historyPayload.prompt,
        resultsCount: historyPayload.results.length,
        previewUrl: historyPayload.previewUrl,
        resultPreviews: historyPayload.resultPreviews,
        input: historyPayload.input,
        uploads: historyPayload.uploads,
        ai: historyPayload.ai,
        results: historyPayload.results,
        meta: {
          improveMode: historyPayload.input.improveMode,
          referenceStyle: historyPayload.input.referenceStyle,
        },
      });
    },
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

    const restoredDescription = entry.input.description || "";
    const restoredHighlights = entry.input.highlights || "";
    const restoredMainText = entry.input.mainText || restoredDescription.split(/[.!?]/)[0] || restoredDescription;
    const restoredSecondaryText = entry.input.secondaryText || restoredHighlights || restoredDescription;
    const restoredTertiaryText = entry.input.tertiaryText || "";
    if (createProductTitle) {
      createProductTitle.value = restoredMainText;
    }
    if (createProductShortDescription) {
      createProductShortDescription.value = restoredSecondaryText;
    }
    if (createProductThirdLevelText) {
      createProductThirdLevelText.value = restoredTertiaryText;
    }
    if (createDescription) {
      createDescription.value = restoredDescription;
    }
    if (createHighlights) {
      createHighlights.value = restoredHighlights;
    }
    setSelectValueIfExists(createMarketplace, entry.input.marketplace);
    setSelectValueIfExists(createCardsCount, String(entry.input.cardsCount || entry.resultsCount || 1));
    createTemplateSearchQuery = "";
    if (createTemplateSearchInput) {
      createTemplateSearchInput.value = "";
    }
    createActiveTemplateTab = "all";
    createSelectedTemplateId = entry.input.selectedTemplateId || CREATE_DEFAULT_TEMPLATE_ID;
    setCreateCharacteristicsState(entry.input.characteristics || []);

    const historyPromptMode = (
      createSelectedTemplateId === CREATE_DIRECT_PROMPT_TEMPLATE.id
      || entry.input.promptMode === "custom"
    ) ? "custom" : "ai";
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
    createActivePreviewResultId = "";
    createLastHistoryEntryId = "";
    syncCreateLegacyFields();
    createCharacteristicsComponent?.setItems(createCharacteristics, { silent: true });
    renderCreateTemplateLibrary();
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
    const activeHistoryUploads = (entry.uploads && entry.uploads.length)
      ? entry.uploads
      : (entry.resultPreviews || []).map((previewUrl, index) => ({
          role: index === 0 ? "source" : "reference",
          name: "history-image-" + String(index + 1) + ".png",
          type: "image/png",
          url: previewUrl,
        }));
    const activeSourceUpload = activeHistoryUploads.find((upload) => upload.role === "source" || upload.role === "product");
    if (!activeSourceUpload?.url) {
      throw new Error("В этой записи нет исходной карточки для повторного улучшения.");
    }

    navigateToAppMode("improve");
    if (enhanceCardPrompt) {
      enhanceCardPrompt.value = entry.input.improvePrompt || entry.prompt || "";
    }
    window.dispatchEvent(new CustomEvent("kartochka:improve:prefill", {
      detail: {
        previewUrl: activeSourceUpload.url,
        fileName: activeSourceUpload.name || "history-improve-source.png",
      },
    }));
    return;

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

  const applyHistoryPromptOnly = (entry) => {
    const promptValue = String(entry?.prompt || entry?.input?.customPrompt || entry?.input?.improvePrompt || "").trim();
    if (!promptValue) return;

    if (entry.mode === "improve") {
      navigateToAppMode("improve");
      if (enhanceCardPrompt) {
        enhanceCardPrompt.value = promptValue;
      }
      return;
      if (improvePrompt) {
        improvePrompt.value = promptValue;
      }
      handleImproveInputMutation();
      setRequestMeta(improveMeta, "РЎС‚Р°С‚СѓСЃ Р·Р°РїСЂРѕСЃР°:", "Prompt РёР· РёСЃС‚РѕСЂРёРё Р·Р°РіСЂСѓР¶РµРЅ");
      setStatusMessage(
        improveStatus,
        "Prompt РёР· РёСЃС‚РѕСЂРёРё Р·Р°РіСЂСѓР¶РµРЅ. РџСЂРѕРІРµСЂСЊС‚Рµ РёСЃС…РѕРґРЅРёРє Рё Р·Р°РїСѓСЃС‚РёС‚Рµ СѓР»СѓС‡С€РµРЅРёРµ.",
        hasImproveSourceInput() ? "success" : ""
      );
      syncImproveFormState();
      return;
    }

    navigateToAppMode("create");
    syncCreatePromptMode("custom");
    if (createCustomPrompt) {
      createCustomPrompt.value = promptValue;
    }
    if (createAiPromptOutput) {
      createAiPromptOutput.value = promptValue;
    }
    createAiPromptPhase = "success";
    clearCreateResultsData();
    setDoneState(createDoneBadge, false);
    syncCreateLegacyFields();
    syncCreateFormState();
    setRequestMeta(createMeta, "РЎС‚Р°С‚СѓСЃ Р·Р°РїСЂРѕСЃР°:", "Prompt РёР· РёСЃС‚РѕСЂРёРё Р·Р°РіСЂСѓР¶РµРЅ");
    setStatusMessage(
      createStatus,
      "Prompt РёР· РёСЃС‚РѕСЂРёРё Р·Р°РіСЂСѓР¶РµРЅ. РџСЂРѕРІРµСЂСЊС‚Рµ РґР°РЅРЅС‹Рµ Рё Р·Р°РїСѓСЃС‚РёС‚Рµ РЅРѕРІСѓСЋ РіРµРЅРµСЂР°С†РёСЋ.",
      "success"
    );
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

  const formatRussianCountWord = (count, one, few, many) => {
    const normalized = Math.abs(Number(count) || 0) % 100;
    const lastDigit = normalized % 10;
    if (normalized > 10 && normalized < 20) return many;
    if (lastDigit > 1 && lastDigit < 5) return few;
    if (lastDigit === 1) return one;
    return many;
  };

  const buildHistoryExportName = (entry, result) => {
    const safeName = String(
      result?.downloadName
      || result?.title
      || entry?.view?.displayTitle
      || entry?.title
      || "history-preview"
    )
      .trim()
      .replace(/\.[a-z0-9]{2,6}$/i, "")
      .replace(/[^\w\u0400-\u04FF-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-+|-+$/g, "");
    return (safeName || "history-preview") + ".png";
  };

  const downloadCreateResultFiles = (results) => {
    const downloadable = (Array.isArray(results) ? results : [])
      .filter((result) => String(result?.previewUrl || "").trim());

    downloadable.forEach((result, index) => {
      window.setTimeout(() => {
        const link = document.createElement("a");
        link.href = result.previewUrl;
        link.download = result.downloadName || ("kartochka-result-" + String(index + 1) + ".png");
        link.rel = "noopener";
        link.style.display = "none";
        document.body.append(link);
        link.click();
        link.remove();
      }, index * 180);
    });
  };

  const setCreateResultsProcessing = (isProcessing) => {
    if (!createResultsSection || !createResultsGrid) return;
    createResultsSection.classList.toggle("hidden", !Boolean(isProcessing) && !createGeneratedResults.length);
    createResultsProcessing?.classList.toggle("hidden", !Boolean(isProcessing));
    createResultsProcessing?.setAttribute("aria-hidden", isProcessing ? "false" : "true");
    createResultsGrid.classList.toggle("hidden", Boolean(isProcessing));
  };

  const resolveCreatePromptForGeneration = () => {
    syncCreateLegacyFields();
    const selectedTemplate = getCreateSelectedTemplate();
    if (isCreateTextReplaceTemplate(selectedTemplate)) {
      return buildCreateTextReplacePrompt();
    }
    if (usesCreateInstructionPromptFlow(selectedTemplate)) {
      const aiPrompt = typeof createAiPromptOutput?.value === "string" ? createAiPromptOutput.value : "";
      if (aiPrompt.trim()) return aiPrompt;
      return "";
    }

    if (isCreateDirectPromptSelected()) {
      return (createCustomPrompt?.value || "").trim();
    }

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
    syncCreateLegacyFields();
    const cardsCount = Number(createCardsCount?.value || 1);
    const hasInsight = Boolean(createInsightData);
    const insightIsStale = hasInsight && createInsightFingerprint !== getCreateInsightFingerprint();
    const selectedTemplate = getCreateSelectedTemplate();
    const imageDataUrls = isCreateTextReplaceTemplate(selectedTemplate)
      ? await buildCreateOriginalImageDataUrls()
      : await buildCreateImageDataUrls();
    const referencePreviewUrl = await getCreateTemplateReferencePreviewUrl(selectedTemplate);
    const title = getCreateProductTitleValue();
    const shortDescription = getCreateProductShortDescriptionValue();
    const characteristics = getCreateCharacteristicRows();
    const settings = buildCreateSettingsPayload();
    const serializedTemplate = serializeCreateTemplate(selectedTemplate);
    const productContext = buildCreateProductContextPayload();

    return {
      description: (createDescription?.value || "").trim(),
      highlights: (createHighlights?.value || "").trim(),
      title,
      shortDescription,
      subtitle: "",
      cardTextLevels: buildCreateCardTextLevelsPayload(),
      userText: buildCreateUserText(),
      characteristics,
      marketplace: (createMarketplace?.value || "").trim(),
      cardsCount: Number.isFinite(cardsCount) ? cardsCount : 1,
      cardGoal: "Конверсионная карточка товара для маркетплейса",
      generationMode: usesCreateDirectGenerationPrompt(selectedTemplate) ? "custom" : normalizeCreateTemplateTab(createActiveTemplateTab),
      densityMode: settings.infoDensity || CREATE_USEFUL_SETTINGS_DEFAULTS.infoDensity,
      productCategory: productContext.productType || (hasInsight && !insightIsStale ? createInsightData?.category || "" : ""),
      productType: productContext.productType,
      productTypeId: productContext.productTypeId,
      productTypeSource: createProductTypeSource,
      productAngle: productContext.productAngle,
      productAngleId: productContext.productAngleId,
      productAngleDescription: productContext.productAngleDescription,
      productAnglePrompt: productContext.productAnglePrompt,
      userNotes: isCreateTextReplaceTemplate(selectedTemplate)
        ? buildCreateTextReplaceSummary()
        : (createPromptMode === "custom" ? (createCustomPrompt?.value || "").trim() : ""),
      textReplacements: isCreateTextReplaceTemplate(selectedTemplate)
        ? getCreateTextReplaceRules()
        : [],
      aiModelTier: getCreateBestModelOption().id,
      openAiModel: getCreateBestModelOption().openAiModel,
      openAiReasoningEffort: getCreateBestModelOption().reasoningEffort,
      settings,
      selectedTemplate: serializedTemplate,
      reference: serializedTemplate,
      referencePreviewUrl,
      promptMode: createPromptMode,
      prompt: resolveCreatePromptForGeneration(),
      size: "1200x1600",
      quality: "high",
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
    const promptPreview = (payload.prompt || "").trim().slice(0, 240);

    return Array.from({ length: totalVariants }, (_, index) => {
      const variantNumber = index + 1;
      const previewUrl = CREATE_GENERATION_FALLBACK_PREVIEWS[index % CREATE_GENERATION_FALLBACK_PREVIEWS.length];

      return {
        id: "result-" + String(Date.now()) + "-" + String(variantNumber),
        variantNumber,
        totalVariants,
        previewUrl,
        title: "Вариант " + String(variantNumber),
        marketplace: payload.marketplace || "Маркетплейс",
        style: payload.insight?.recommendedStyle || "Чистая композиция под маркетплейс",
        focus: payload.insight?.conversionAccent || "Подсветить ключевую выгоду товара на первом экране",
        format: payload.insight?.marketplaceFormat || "Hero-блок + выгоды + CTA",
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
    if (!createResultsGrid || !createResultsSection) {
      renderCreatePreviewPanel();
      return;
    }

    createResultsGrid.textContent = "";
    const totalResults = createGeneratedResults.length;
    const selectedTemplate = getCreateSelectedTemplate();
    const isTextReplaceResults = isCreateTextReplaceTemplate(selectedTemplate);

    if (!totalResults) {
      if (createResultsCaption) {
        createResultsCaption.textContent = "";
      }
      createResultsSection.classList.add("hidden");
      createResultsSection.classList.remove("is-text-replace-results");
      createResultsGrid.classList.remove("create-results-grid-stacked");
      renderCreatePreviewPanel();
      return;
    }

    const activeResultStillSelectable = createGeneratedResults.some((item) =>
      item.id === createActivePreviewResultId && item.status !== "failed" && item.previewUrl
    );
    if (!activeResultStillSelectable) {
      createActivePreviewResultId = getFirstSelectableCreateResult()?.id || createGeneratedResults[0]?.id || "";
    }

    createResultsSection.classList.toggle("is-text-replace-results", isTextReplaceResults);
    createResultsGrid.classList.toggle("create-results-grid-stacked", isTextReplaceResults);

    if (createResultsCaption) {
      createResultsCaption.textContent = "";
    }
    const selectedTemplateTitle = selectedTemplate?.title || "Шаблон";

    createGeneratedResults.forEach((result) => {
      const card = document.createElement("article");
      card.className = "create-result-card create-result-card-compact";
      const isFailedResult = result.status === "failed" || !result.previewUrl;
      const providerLabel = getCreateResultProviderLabel(result);
      card.classList.toggle("is-text-replace-result", isTextReplaceResults);
      card.classList.toggle("is-active", result.id === createActivePreviewResultId);
      card.classList.toggle("is-failed", isFailedResult);
      card.dataset.resultPreviewId = result.id;
      card.setAttribute("role", "button");
      card.tabIndex = isFailedResult ? -1 : 0;
      card.setAttribute("aria-disabled", isFailedResult ? "true" : "false");
      card.setAttribute("aria-label", "Открыть результат: " + (result.title || selectedTemplateTitle));

      const media = document.createElement("div");
      media.className = "create-result-media";

      if (result.previewUrl) {
        const image = document.createElement("img");
        image.src = result.previewUrl;
        image.alt = result.title;
        image.loading = "lazy";
        media.append(image);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "create-result-placeholder";
        placeholder.textContent = "Провайдер не вернул изображение";
        media.append(placeholder);
      }

      if (providerLabel) {
        const providerBadge = document.createElement("span");
        providerBadge.className = "create-result-provider";
        providerBadge.textContent = providerLabel;
        media.append(providerBadge);
      }

      const body = document.createElement("div");
      body.className = "create-result-body";

      const title = document.createElement("h4");
      title.textContent = isTextReplaceResults
        ? (result.title || selectedTemplateTitle)
        : (providerLabel ? "Вариант " + providerLabel : selectedTemplateTitle);

      body.append(title);
      if (isFailedResult) {
        const subtitle = document.createElement("p");
        subtitle.textContent = result.errorMessage || "Этот провайдер не вернул изображение. Можно выбрать другой вариант.";
        body.append(subtitle);
      } else if (isTextReplaceResults) {
        const subtitle = document.createElement("p");
        subtitle.textContent = result.focus || result.style || "Нажмите, чтобы открыть этот вариант в превью.";
        body.append(subtitle);
      } else {
        const subtitle = document.createElement("p");
        subtitle.textContent = result.id === createActivePreviewResultId
          ? "Выбран как основной"
          : "Нажмите, чтобы выбрать основным";
        body.append(subtitle);
      }
      card.append(media, body);
      createResultsGrid.append(card);
    });

    createResultsSection.classList.remove("hidden");
    renderCreatePreviewPanel();
  };

  const getImproveFileKey = (file) => {
    return file ? [file.name, file.size, file.lastModified].join(":") : "";
  };

  const getImprovePreviewKey = (value) => {
    const safeValue = String(value || "").trim();
    if (!safeValue) return "";
    return safeValue.slice(0, 96) + ":" + String(safeValue.length);
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
    if ((improveAnalysisPhase === "error" || improveAnalysisPhase === "interrupted") && !improveAnalysisData) {
      improveAnalysisPhase = "empty";
    }
  };

  const applyImproveSourceFile = async (file) => {
    const validationError = getImproveFileValidationError(file, { label: "Исходная карточка" });
    if (validationError) {
      throw new Error(validationError);
    }

    improveImageFile = file;
    improveImagePreview = await buildOptimizedFileDataUrl(file, "Не удалось подготовить исходную карточку.");
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
    improveReferencePreviewUrl = await buildOptimizedFileDataUrl(file, "Не удалось подготовить референс.");
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
      getImprovePreviewKey(improveImagePreview),
      getImproveFileKey(improveReferenceFile),
      getImprovePreviewKey(improveReferencePreviewUrl),
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
    const userPrompt = (improvePrompt?.value || "").trim();
    return {
      mode: improveMode,
      prompt: userPrompt,
      userPrompt,
      improveInstructionPromptPath: IMPROVE_INSTRUCTION_TEMPLATE_PATH,
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
    const transformationStrength = score <= 55 ? "rebuild" : score <= 74 ? "strong" : "focused";

    const recommendations = [
      "Собрать первый экран вокруг одной главной выгоды и сильного визуального якоря.",
      "Усилить CTA: контрастная кнопка, короткий призыв и понятный следующий шаг.",
      referenceStyleActive
        ? "Применить стиль референса, сохранив категорийные триггеры marketplace."
        : "Сократить перегрузку: меньше текста, чище композиция, выше читаемость.",
    ];
    const changePlan = [
      {
        area: "hero",
        change: "Сделать главный оффер крупнее и построить вокруг него первый экран.",
        why: "Покупатель быстрее понимает выгоду товара уже в миниатюре.",
      },
      {
        area: "facts",
        change: "Собрать вторичную информацию в один компактный модуль вместо россыпи мелких подпунктов.",
        why: "Карточка выглядит чище и лучше читается на мобильном экране.",
      },
      {
        area: referenceStyleActive ? "style" : "cta",
        change: referenceStyleActive
          ? "Переложить ритм и композицию референса на этот товар без потери категорийной логики."
          : "Сделать CTA или proof-point более заметным и конкретным.",
        why: "Фокус смещается к продаже, а не к декоративным элементам.",
      },
    ];
    const mustPreserve = [
      "тот же товар без подмены модели и категории",
      "узнаваемые форма, материал и ключевые детали продукта",
      "реальный брендинг и упаковка, если они видны на исходнике",
    ];
    const productIdentity = "Тот же товар с исходной карточки, без подмены ассортимента.";
    const improvementMode = referenceStyleActive
      ? "Адаптация под стиль референса с усилением иерархии"
      : transformationStrength === "rebuild"
        ? "Структурный typographic rebuild"
        : transformationStrength === "strong"
          ? "Сильная переработка композиции и оффера"
          : "Сфокусированное усиление иерархии";
    const rebuildMode = referenceStyleActive
      ? "Reference-adapted editorial"
      : transformationStrength === "rebuild"
        ? "Poster Headline Block"
        : transformationStrength === "strong"
          ? "Split Panel System"
          : "Focused hero cleanup";
    const generationPrompt = [
      "Создай заметно улучшенную карточку товара для маркетплейса на основе исходного изображения.",
      "Сохрани тот же товар без подмены модели, бренда, формы, цвета и комплектации.",
      "Что обязательно сохранить: " + mustPreserve.join("; ") + ".",
      "Нужна не косметика, а заметная переработка иерархии, читаемости, композиции и продажного фокуса.",
      "Режим улучшения: " + improvementMode + ".",
      "Режим перестройки: " + rebuildMode + ".",
      "Сила улучшения: " + transformationStrength + ".",
      "План изменений: " + changePlan
        .map((item, index) => String(index + 1) + ") " + [item.area, item.change, item.why].filter(Boolean).join(" — "))
        .join("; ") + ".",
      (payload?.userPrompt || payload?.prompt)
        ? "Учти пожелания пользователя: " + String(payload.userPrompt || payload.prompt).trim() + "."
        : "",
      "Весь видимый текст только на русском языке.",
      "Убери платформенные бейджи и слова вроде маркетплейс, Ozon, Wildberries, WB, если это не часть реального брендинга товара.",
      "Разница до и после должна быть заметна уже в миниатюре.",
    ]
      .filter(Boolean)
      .join(" ");

    const issuesCountLabel = String(issues.length) + " " + formatRussianCountWord(issues.length, "зона", "зоны", "зон");
    const summary = referenceStyleActive
      ? "AI учел стиль референса: выявили " + issuesCountLabel + " риска и подготовили план улучшения под этот визуальный язык."
      : hasReference
        ? "AI нашел " + issuesCountLabel + " риска. Референс загружен, но сейчас используется стандартный AI-режим."
        : "AI нашел " + issuesCountLabel + " риска: фокус и CTA слабые, композицию и читаемость нужно усилить.";

    const referenceNote = referenceStyleActive
      ? "Активен reference style: улучшение будет ориентироваться на загруженный референс."
      : hasReference
        ? "Референс загружен, но не активирован. Включите режим «В стиле референса», чтобы применить стиль."
        : "Референс не загружен: используется стандартная AI-стратегия.";

    return {
      score,
      summary,
      productIdentity,
      mustPreserve,
      issues,
      recommendations,
      improvementPlan: changePlan.map((item) => item.change),
      transformationStrength,
      improvementMode,
      rebuildMode,
      changePlan,
      marketplaceFormat: referenceStyleActive
        ? "Reference-style формат с адаптацией под требования marketplace."
        : "Конверсионный marketplace формат с явным оффером и CTA.",
      generationPrompt,
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
      const modeDetails = analysis?.rebuildMode
        ? [
            analysis.rebuildMode,
            analysis?.transformationStrength
              ? (analysis.transformationStrength === "rebuild"
                ? "сила: structural rebuild"
                : analysis.transformationStrength === "strong"
                  ? "сила: strong"
                  : "сила: focused")
              : "",
          ]
            .filter(Boolean)
            .join(" • ")
        : "";
      const baseContext = analysis?.reference?.note || (
        referenceStyleActive
          ? "Активен reference style: AI ориентируется на стиль референса."
          : hasReference
            ? "Референс загружен, но сейчас работает стандартный AI-режим."
            : "Режим: стандартное AI-улучшение."
      );
      improveAnalysisContext.textContent = [baseContext, modeDetails].filter(Boolean).join(" • ");
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
      const recommendations = Array.isArray(analysis?.changePlan) && analysis.changePlan.length
        ? analysis.changePlan
          .map((entry) => [entry?.change, entry?.why].filter(Boolean).join(" — "))
          .filter(Boolean)
        : Array.isArray(analysis?.recommendations) && analysis.recommendations.length
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
    const isInterrupted = improveAnalysisPhase === "interrupted";
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
    } else if (improveAnalysisStatus && isInterrupted && !hasAnalysis) {
      setStatusMessage(
        improveAnalysisStatus,
        "Связь прервалась после сворачивания приложения. Анализ можно повторить без потери исходных данных.",
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
    if (improveAnalysisPhase === "loading" && improveAnalysisInFlight) {
      return improveAnalysisInFlight;
    }
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
      payload.requestId = buildClientRequestId("improve-analyze", requestId);
      const activeAnalysisRequest = requestImproveAnalysis(payload);
      improveAnalysisInFlight = activeAnalysisRequest.then(
        () => true,
        () => false
      );
      const analysis = await activeAnalysisRequest;
      if (requestId !== improveAnalysisRequestId) return false;

      improveAnalysisData = analysis;
      improveAnalysisFingerprint = getImproveAnalysisFingerprint();
      improveAnalysisPhase = "success";
      renderImproveAnalysisValues(analysis);
      const issuesCount = Array.isArray(analysis?.issues) ? analysis.issues.length : 0;
      const improveIssuesLabel = issuesCount
        ? String(issuesCount) + " " + formatRussianCountWord(issuesCount, "зона", "зоны", "зон") + " улучшения"
        : "несколько зон улучшения";
      setStatusMessage(
        improveAnalysisStatus,
        source === "generation"
          ? referenceStyleActive
            ? "Анализ обновлен с учетом референса и применен перед запуском улучшения."
            : "Анализ обновлен и применен перед запуском улучшения."
          : referenceStyleActive
            ? "Анализ готов: " + improveIssuesLabel + " определены с учетом стиля референса."
            : "Анализ готов: показали " + improveIssuesLabel + ". Можно запускать генерацию.",
        "success"
      );
      if (source !== "generation") {
        setRequestMeta(improveMeta, "Статус запроса:", "AI анализ готов");
      }
      return true;
    } catch (error) {
      if (requestId !== improveAnalysisRequestId) return false;
      const feedback = resolveRequestErrorFeedback(error, "Не удалось выполнить AI анализ.", {
        interruptedMessage: "Связь прервалась после сворачивания приложения. Анализ можно повторить без потери исходных данных.",
        interruptedMeta: "AI анализ прерван после возврата",
        timeoutMeta: "Таймаут AI анализа",
        networkMeta: "Сбой AI анализа",
        errorMeta: "Ошибка AI анализа",
      });
      improveAnalysisPhase = feedback.isInterrupted ? "interrupted" : "error";
      setStatusMessage(improveAnalysisStatus, feedback.message, feedback.type);
      setRequestMeta(improveMeta, "Статус запроса:", feedback.metaValue, feedback.type);
      return false;
    } finally {
      if (requestId === improveAnalysisRequestId) {
        improveAnalysisInFlight = null;
      }
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
    const referenceStyle = improveMode === "reference" && Boolean(improveReferenceFile || improveReferencePreviewUrl);
    const userPrompt = (improvePrompt?.value || "").trim();
    const resolvedAnalysis = hasAnalysis && !analysisIsStale ? { ...improveAnalysisData } : null;

    return {
      mode: improveMode,
      referenceStyle,
      prompt: resolvedAnalysis?.generationPrompt || userPrompt,
      userPrompt,
      improveInstructionPromptPath: IMPROVE_INSTRUCTION_TEMPLATE_PATH,
      variantsCount: Number.isFinite(variantsCount) ? variantsCount : 1,
      analysis: resolvedAnalysis,
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
    const previewPool = IMPROVE_RESULT_FALLBACK_PREVIEWS;
    const promptPreview = (payload.userPrompt || payload.prompt || "").trim().slice(0, 220);

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
        styleLabel: referenceStyle ? "Улучшено по стилю референса" : "",
        referenceStyle,
        changes: Array.isArray(payload.analysis?.changePlan) && payload.analysis.changePlan.length
          ? payload.analysis.changePlan.map((item) => String(item?.change || "").trim()).filter(Boolean).slice(0, 2).join(" • ")
          : payload.analysis?.recommendations?.[0] || "Оптимизирована структура и усилен ключевой оффер.",
        why: Array.isArray(payload.analysis?.changePlan) && payload.analysis.changePlan.length
          ? String(payload.analysis.changePlan[0]?.why || "").trim()
          : "Карточка быстрее считывается и яснее подсвечивает выгоду товара.",
        preserved: Array.isArray(payload.analysis?.mustPreserve) && payload.analysis.mustPreserve.length
          ? payload.analysis.mustPreserve.slice(0, 3).join(", ")
          : payload.analysis?.productIdentity || "тот же товар с исходной карточки",
        rebuildMode: payload.analysis?.rebuildMode || (referenceStyle ? "Reference-adapted editorial" : "Split Panel System"),
        strength: payload.analysis?.transformationStrength || "strong",
        format: payload.analysis?.marketplaceFormat || "Готовый формат для маркетплейса с чистым CTA.",
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

  const getFourCardsFileValidationError = (file) => {
    if (!file) return "Файл не выбран.";
    if (!isCreateFileAccepted(file)) return "Поддерживаются только PNG, JPG и WEBP.";
    if (file.size > IMPROVE_MAX_FILE_SIZE_BYTES) return "Файл слишком большой. Максимум 10 МБ.";
    return "";
  };

  const hasFourCardsSourceInput = () => Boolean(fourCardsImageFile || fourCardsImagePreview);

  const isFourCardsControlsLocked = () => fourCardsIsGenerating;

  const getFourCardsValidationError = () => {
    if (!hasFourCardsSourceInput()) return "Загрузите исходную карточку или фото товара.";
    return "";
  };

  const setFourCardsProcessing = (isProcessing) => {
    fourCardsResultsSection?.classList.remove("hidden");
    fourCardsProcessing?.classList.toggle("hidden", !isProcessing);
    fourCardsCompositeSection?.classList.toggle("hidden", isProcessing || !fourCardsResult?.composite?.url);
    fourCardsGridSection?.classList.toggle("hidden", isProcessing || !Array.isArray(fourCardsResult?.cards) || !fourCardsResult.cards.length);
  };

  const syncFourCardsFormState = () => {
    const isBusy = isFourCardsControlsLocked();
    const hasSource = hasFourCardsSourceInput();
    const validationError = getFourCardsValidationError();
    fourCardsGenerateBtn?.toggleAttribute("disabled", Boolean(validationError) || isBusy);
    fourCardsRegenerateBtn?.classList.toggle("hidden", !fourCardsResult);
    fourCardsRegenerateBtn?.toggleAttribute("disabled", Boolean(validationError) || isBusy);
    fourCardsGenerateBtn?.classList.toggle("is-loading", isBusy);
    fourCardsUploadZone?.classList.toggle("is-empty", !hasSource);
    fourCardsUploadZone?.classList.toggle("is-filled", hasSource);
    fourCardsUploadZone?.classList.toggle("is-disabled", isBusy);
    fourCardsImageInput?.toggleAttribute("disabled", isBusy);
    fourCardsUploadEmpty?.classList.toggle("hidden", hasSource);
    fourCardsSelectedPreview?.classList.toggle("hidden", !hasSource);
  };

  const renderFourCardsResult = () => {
    if (!fourCardsResultsSection || !fourCardsGrid || !fourCardsCompositeImage) return;
    fourCardsGrid.textContent = "";

    if (!fourCardsResult) {
      fourCardsResultsSection.classList.add("hidden");
      fourCardsCompositeSection?.classList.add("hidden");
      fourCardsGridSection?.classList.add("hidden");
      return;
    }

    const composite = fourCardsResult.composite || {};
    if (composite.url) {
      fourCardsCompositeImage.src = composite.url;
      if (fourCardsCompositeDownload) {
        fourCardsCompositeDownload.href = composite.url;
        fourCardsCompositeDownload.download = composite.downloadName || "composite.png";
      }
    }

    const cards = Array.isArray(fourCardsResult.cards) ? fourCardsResult.cards : [];
    const typeLabels = {
      benefits: "Преимущества",
      features: "Характеристики",
      lifestyle: "Сценарии",
      details: "Детали",
    };

    cards.forEach((result, index) => {
      const card = document.createElement("article");
      card.className = "four-cards-card";

      const media = document.createElement("div");
      media.className = "four-cards-card-media";
      const image = document.createElement("img");
      image.src = result.url;
      image.alt = result.title || typeLabels[result.type] || "Карточка " + String(index + 1);
      image.loading = "lazy";
      media.append(image);

      const body = document.createElement("div");
      body.className = "four-cards-card-body";
      const title = document.createElement("strong");
      title.textContent = result.title || typeLabels[result.type] || "Карточка " + String(index + 1);
      const meta = document.createElement("span");
      meta.textContent = String(result.width || 600) + " x " + String(result.height || 800) + " px";
      const downloadLink = document.createElement("a");
      downloadLink.className = "create-result-action";
      downloadLink.href = result.url;
      downloadLink.download = result.downloadName || "card_" + String(index + 1) + ".png";
      downloadLink.textContent = "Скачать";
      body.append(title, meta, downloadLink);

      card.append(media, body);
      fourCardsGrid.append(card);
    });

    if (fourCardsResultsCaption) {
      fourCardsResultsCaption.textContent = "Готово: composite preview и 4 отдельные карточки.";
    }
    fourCardsResultsSection.classList.remove("hidden");
    setFourCardsProcessing(false);
  };

  const clearFourCardsResult = () => {
    fourCardsResult = null;
    renderFourCardsResult();
  };

  const applyFourCardsSourceFile = async (file) => {
    const validationError = getFourCardsFileValidationError(file);
    if (validationError) throw new Error(validationError);

    fourCardsImageFile = file;
    fourCardsImagePreview = await buildOptimizedFileDataUrl(file, "Не удалось подготовить изображение.");
    if (!fourCardsImagePreview) {
      throw new Error("Не удалось подготовить изображение для генерации.");
    }
    if (fourCardsSelectedImage) {
      fourCardsSelectedImage.src = fourCardsImagePreview;
    }
    clearFourCardsResult();
    setStatusMessage(fourCardsStatus, "Изображение загружено. Можно запускать генерацию 4 карточек.", "success");
    setRequestMeta(fourCardsMeta, "Статус запроса:", "Исходное изображение готово");
    syncFourCardsFormState();
  };

  const buildFourCardsGenerationPayload = () => ({
    mode: "generate-four-marketplace-cards",
    sourcePreviewUrl: fourCardsImagePreview,
    sourceCard: fourCardsImageFile
      ? {
          name: fourCardsImageFile.name,
          type: fourCardsImageFile.type,
          sizeBytes: fourCardsImageFile.size,
        }
      : {
          name: "source-card.png",
          type: "image/png",
          sizeBytes: 0,
        },
  });

  const requestFourCardsGeneration = async (payload) => {
    if (serviceClient?.generateFourMarketplaceCards) {
      return serviceClient.generateFourMarketplaceCards(payload);
    }
    if (serviceClient?.cards?.generateFourMarketplaceCards) {
      return serviceClient.cards.generateFourMarketplaceCards(payload);
    }
    throw new Error("Сервис генерации 4 карточек не настроен.");
  };

  const downloadFourCardsFiles = () => {
    const result = fourCardsResult;
    const files = [
      result?.composite?.url
        ? {
            url: result.composite.url,
            downloadName: result.composite.downloadName || "composite.png",
          }
        : null,
      ...(Array.isArray(result?.cards) ? result.cards.map((card, index) => ({
        url: card.url,
        downloadName: card.downloadName || "card_" + String(index + 1) + ".png",
      })) : []),
    ].filter((item) => item?.url);

    files.forEach((file, index) => {
      window.setTimeout(() => {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.downloadName;
        document.body.append(link);
        link.click();
        link.remove();
      }, index * 180);
    });
  };

  const buildFourCardsHistoryPayload = async (payload, result) => {
    const uploads = [];
    if (fourCardsImagePreview) {
      uploads.push({
        id: "upload-" + String(Date.now()) + "-1",
        role: "source",
        name: fourCardsImageFile?.name || "source-card.png",
        type: fourCardsImageFile?.type || "image/png",
        url: await buildHistoryImageSnapshot(sanitizeHistoryPreviewUrl(fourCardsImagePreview, "improve")),
      });
    }

    const compositePreview = result?.composite?.url
      ? await buildHistoryImageSnapshot(sanitizeHistoryPreviewUrl(result.composite.url, "improve"), {
          preferAsset: true,
          assetKind: "four-cards-composite",
        })
      : "";

    const normalizedResults = await Promise.all((Array.isArray(result?.cards) ? result.cards : []).map(async (card, index) => {
      const previewUrl = await buildHistoryImageSnapshot(sanitizeHistoryPreviewUrl(card.url, "improve"), {
        preferAsset: true,
        assetKind: "four-cards-result",
      });
      return normalizeHistoryResult(
        {
          id: "four-card-" + String(index + 1) + "-" + String(Date.now()),
          previewUrl,
          title: card.title || "Карточка " + String(index + 1),
          subtitle: card.type || "",
          summary: "Дополнительная карточка товара",
          downloadName: card.downloadName,
        },
        "fourCards",
        index,
        previewUrl || uploads[0]?.url || getHistoryFallbackPreview("improve")
      );
    }));

    return {
      summary: "4 дополнительные карточки для описания товара",
      prompt: "server/prompts/generate-four-marketplace-cards.md",
      previewUrl: compositePreview || normalizedResults[0]?.previewUrl || uploads[0]?.url || getHistoryFallbackPreview("improve"),
      resultPreviews: normalizedResults.map((item) => item.previewUrl).filter(Boolean),
      input: {
        description: "",
        highlights: "",
        marketplace: "",
        cardsCount: 4,
        promptMode: "ai",
        customPrompt: "",
        improvePrompt: "",
        improveMode: "fourCards",
        variantsCount: 4,
        referenceStyle: false,
        mode: payload.mode,
      },
      uploads,
      ai: {
        summary: "Сгенерирован один composite image и автоматически нарезан на 4 карточки.",
        insight: null,
        analysis: null,
      },
      results: normalizedResults,
      meta: {
        compositePreview,
        promptPath: result?.metadata?.promptPath || "server/prompts/generate-four-marketplace-cards.md",
        cardWidth: result?.metadata?.cardWidth || 600,
        cardHeight: result?.metadata?.cardHeight || 800,
      },
    };
  };

  const runFourCardsGeneration = async () => {
    const validationError = getFourCardsValidationError();
    if (validationError) {
      setStatusMessage(fourCardsStatus, validationError, "error");
      syncFourCardsFormState();
      return;
    }

    const requestId = ++fourCardsRequestId;
    fourCardsIsGenerating = true;
    fourCardsResult = null;
    setFourCardsProcessing(true);
    setStatusMessage(fourCardsStatus, "Генерируем 4 дополнительные карточки. Это может занять 3-5 минут.", "");
    setRequestMeta(fourCardsMeta, "Статус запроса:", "Генерация composite image");
    if (fourCardsResultsCaption) {
      fourCardsResultsCaption.textContent = "Генерация идет через GPT Image 2, затем backend нарежет результат на 4 части.";
    }
    syncFourCardsFormState();

    try {
      const payload = buildFourCardsGenerationPayload();
      payload.requestId = buildClientRequestId("four-cards", requestId);
      const result = await requestFourCardsGeneration(payload);
      if (requestId !== fourCardsRequestId) return;
      fourCardsResult = result;
      renderFourCardsResult();
      setStatusMessage(fourCardsStatus, "Готово. Composite image нарезан на 4 карточки.", "success");
      setRequestMeta(fourCardsMeta, "Статус запроса:", "Готово: 4 карточки");

      try {
        const historyPayload = await buildFourCardsHistoryPayload(payload, result);
        await pushHistory({
          mode: "fourCards",
          title: "4 дополнительные карточки",
          summary: historyPayload.summary,
          prompt: historyPayload.prompt,
          resultsCount: 4,
          previewUrl: historyPayload.previewUrl,
          resultPreviews: historyPayload.resultPreviews,
          input: historyPayload.input,
          uploads: historyPayload.uploads,
          ai: historyPayload.ai,
          results: historyPayload.results,
          meta: historyPayload.meta,
        });
      } catch (historyError) {
        console.warn("[history] four cards save failed", historyError);
      }

      fourCardsResultsSection?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    } catch (error) {
      if (requestId !== fourCardsRequestId) return;
      fourCardsResult = null;
      setFourCardsProcessing(false);
      renderFourCardsResult();
      const feedback = resolveRequestErrorFeedback(error, "Не удалось создать 4 дополнительные карточки. Повторите попытку.", {
        interruptedMessage: "Связь прервалась после сворачивания приложения. Исходное изображение сохранено, генерацию можно повторить.",
        interruptedMeta: "Генерация 4 карточек прервана после возврата",
        timeoutMeta: "Таймаут генерации 4 карточек",
        networkMeta: "Сбой генерации 4 карточек",
        errorMeta: "Ошибка генерации 4 карточек",
      });
      setStatusMessage(fourCardsStatus, feedback.message, feedback.type);
      setRequestMeta(fourCardsMeta, "Статус запроса:", feedback.metaValue, feedback.type);
    } finally {
      if (requestId === fourCardsRequestId) {
        fourCardsIsGenerating = false;
        if (activeUser) {
          void refreshBillingSummary();
        }
        syncFourCardsFormState();
      }
    }
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
      styleTag.textContent = result.styleLabel || "Стандартное AI-улучшение";
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

      const why = document.createElement("p");
      why.textContent = "Почему лучше: " + (result.why || "Карточка должна быстрее считываться и сильнее продавать товар.");

      const preserved = document.createElement("p");
      preserved.textContent = "Сохранили: " + (result.preserved || "Тот же товар и узнаваемые признаки исходника.");

      const rebuild = document.createElement("p");
      rebuild.textContent = "Режим: " + (result.rebuildMode || result.strength || "Стандартное улучшение");

      const format = document.createElement("p");
      format.textContent = "Формат: " + result.format;

      const prompt = document.createElement("p");
      prompt.textContent = "Комментарий: " + (result.promptPreview || "Улучшение выполнено по стандартной стратегии.");

      details.append(changes, why, preserved, rebuild, format, prompt);

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
    const referenceModeSelected = improveMode === "reference";

    if (improveRunBtn) {
      improveRunBtn.toggleAttribute("disabled", isDisabled);
      improveRunBtn.classList.toggle("is-loading", improveIsGenerating);
    }

    improvePrimaryUploadZone?.classList.toggle("is-filled", hasSource);
    improveReferenceUploadZone?.classList.toggle("is-filled", hasReference);
    improveReferenceUploadZone?.classList.toggle("is-reference-active", referenceStyleActive);
    improveAnalysisCard?.classList.toggle("is-reference-active", referenceStyleActive);
    improveReferencePanel?.classList.toggle("is-filled", hasReference);
    improveReferencePanel?.classList.toggle("is-reference-mode", referenceModeSelected);
    improveReferencePanel?.classList.toggle("is-reference-active", referenceStyleActive);

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

    if (improveModeSummary) {
      if (referenceStyleActive) {
        improveModeSummary.textContent = "AI улучшит карточку по стилю референса.";
      } else if (referenceModeSelected) {
        improveModeSummary.textContent = "Добавьте референс для style match.";
      } else if (hasReference) {
        improveModeSummary.textContent = "Референс загружен и готов.";
      } else {
        improveModeSummary.textContent = "AI улучшит карточку без style match.";
      }
    }

    if (improveModeBadge) {
      if (referenceStyleActive) {
        setCreateSecondaryBadge(improveModeBadge, "Стиль референса", "is-active");
      } else if (referenceModeSelected) {
        setCreateSecondaryBadge(improveModeBadge, "Нужен референс", "is-warning");
      } else {
        setCreateSecondaryBadge(improveModeBadge, "AI режим", "is-neutral");
      }
    }

    if (improveModeSignal) {
      improveModeSignal.textContent = referenceStyleActive
        ? "По референсу"
        : referenceModeSelected
          ? "Ждёт ref"
          : "AI режим";
    }

    if (improveReferenceSignal) {
      improveReferenceSignal.textContent = referenceStyleActive
        ? "Подключен"
        : referenceModeSelected
          ? "Нужен"
          : hasReference
            ? "Загружен"
            : "Не нужен";
    }

    if (improveVariantsSignal) {
      const selectedOption = improveVariantsCount?.options?.[improveVariantsCount.selectedIndex];
      improveVariantsSignal.textContent = (selectedOption?.textContent || "1 вариант").trim();
    }

    if (improveReferenceNote) {
      if (referenceModeSelected && !hasReference) {
        improveReferenceNote.textContent = "Добавьте пример нужного визуального стиля.";
      } else if (referenceModeSelected && hasReference) {
        improveReferenceNote.textContent = "Стиль референса будет использован при улучшении.";
      } else {
        improveReferenceNote.textContent = "Опционально, если нужен style match.";
      }
    }

    if (improveReferenceState) {
      improveReferenceState.classList.remove("is-active", "is-ready", "is-empty");
      if (referenceStyleActive) {
        improveReferenceState.textContent = "Референс будет учтен при улучшении.";
        improveReferenceState.classList.add("is-active");
      } else if (referenceModeSelected) {
        improveReferenceState.textContent = "Для запуска нужен референс.";
        improveReferenceState.classList.add("is-ready");
      } else if (hasReference) {
        improveReferenceState.textContent = "Можно переключиться на improve по референсу.";
        improveReferenceState.classList.add("is-ready");
      } else {
        improveReferenceState.textContent = "Референс не обязателен.";
        improveReferenceState.classList.add("is-empty");
      }
    }

    if (improveAnalysisContext) {
      improveAnalysisContext.textContent = referenceStyleActive
        ? "Режим: улучшение с учетом референса."
        : referenceModeSelected
          ? "Режим: ожидается референс для style match."
          : "Режим: стандартное AI-улучшение.";

      if (analysisIsStale) {
        improveAnalysisContext.textContent += " Перед генерацией анализ будет обновлен.";
      }
    }

    if (improveCtaHint) {
      if (improveIsGenerating) {
        improveCtaHint.textContent = "Улучшение...";
      } else if (validationError) {
        improveCtaHint.textContent = validationError;
      } else if (improveAnalysisPhase === "loading") {
        improveCtaHint.textContent = "Подготовка...";
      } else if (analysisIsStale) {
        improveCtaHint.textContent = "Данные обновлены.";
      } else if (improveAnalysisPhase === "success") {
        improveCtaHint.textContent = referenceStyleActive
          ? "Можно запускать improve по референсу."
          : "Можно запускать AI improve.";
      } else if (hasSource) {
        improveCtaHint.textContent = referenceModeSelected
          ? "Нужен референс для запуска."
          : "Можно запускать.";
      } else {
        improveCtaHint.textContent = "Загрузите исходную карточку, чтобы начать.";
      }
    }

    syncImproveAnalysisState();
  };

  mobileMenuBtn?.addEventListener("click", openMobileMenu);
  mobileMenuClose?.addEventListener("click", closeMobileMenu);
  mobileMenuLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

  if (isDedicatedAppHost()) {
    setAppRouteBootstrapPending(true);
  }

  if (workspaceAppBrand) {
    workspaceAppBrand.setAttribute("href", isDedicatedAppHost() ? buildAppPath("create") : buildAppHash("create"));
    workspaceAppBrand.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToAppMode("create");
    });
  }

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
  authEmailLoginTab?.addEventListener("click", () => setAuthMode("login"));
  authEmailRegisterTab?.addEventListener("click", () => setAuthMode("register"));
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
      setStatusMessage(createAiPromptStatus, "Prompt слишком короткий.", "error");
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
      "Prompt применен. При необходимости скорректируйте его.",
      "success"
    );
    setRequestMeta(createMeta, "Статус запроса:", "AI-промпт применен");
    syncCreateFormState();
    createCustomPrompt?.focus();
  });

  createAiPromptOutput?.addEventListener("input", () => {
    if (createAiPromptPhase === "loading") return;
    const promptText = (createAiPromptOutput.value || "").trim();
    createAiPromptPhase = promptText ? "success" : "empty";
    if (promptText) {
      setStatusMessage(createAiPromptStatus, "Prompt обновлен.", "success");
    }
    setDoneState(createDoneBadge, false);
    syncCreateFormState();
  });

  createResultsGrid?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const previewButton = target.closest("[data-result-preview-id]");
    if (!(previewButton instanceof HTMLElement)) return;

    const resultId = previewButton.dataset.resultPreviewId || "";
    if (!resultId) return;
    const result = createGeneratedResults.find((item) => item.id === resultId) || null;
    if (!result || result.status === "failed" || !result.previewUrl) return;

    createActivePreviewResultId = resultId;
    console.info("[analytics] generation_variant_selected", {
      provider: result.provider || "",
      generationId: result.generationId || result.requestId || "",
    });
    void persistCreateVariantSelection(result);
    renderCreateResults();
  });

  createResultsGrid?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const previewButton = target.closest("[data-result-preview-id]");
    if (!(previewButton instanceof HTMLElement)) return;
    event.preventDefault();

    const resultId = previewButton.dataset.resultPreviewId || "";
    if (!resultId) return;
    const result = createGeneratedResults.find((item) => item.id === resultId) || null;
    if (!result || result.status === "failed" || !result.previewUrl) return;

    createActivePreviewResultId = resultId;
    console.info("[analytics] generation_variant_selected", {
      provider: result.provider || "",
      generationId: result.generationId || result.requestId || "",
    });
    void persistCreateVariantSelection(result);
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

    clearCreateResultsData();
    setDoneState(createDoneBadge, false);
    renderCreateFiles();
    syncCreateFormState();
    void runCreateProductTypeDetectionForCurrentImage();
  });

  const handleCreateInputMutation = () => {
    syncCreateLegacyFields();
    const cancelled = cancelPendingCreateRequests();
    resetCreateTransientErrorState();
    clearCreateResultsData();
    if (cancelled) {
      setStatusMessage(createStatus, "Входные данные обновлены. Предыдущий AI-запрос отменён.", "");
    }
    setDoneState(createDoneBadge, false);
    syncCreateFormState();
  };

  [
    createProductTitle,
    createProductShortDescription,
    createProductThirdLevelText,
    createGenerationNotes,
    createCustomPrompt,
    createMarketplace,
    createCardsCount,
  ].forEach((field) => {
    field?.addEventListener("input", handleCreateInputMutation);
    field?.addEventListener("change", handleCreateInputMutation);
  });

  [
    createSettingAccentColor,
    createSettingReferenceStrength,
    createSettingVisualStyle,
    createSettingInfoDensity,
    createSettingReadabilityPriority,
    createSettingConversionPriority,
    createSettingAccentFormat,
    createSettingBackgroundMode,
    createSettingPreserveLayout,
  ].forEach((field) => {
    field?.addEventListener("input", handleCreateInputMutation);
    field?.addEventListener("change", handleCreateInputMutation);
  });

  createTemplateSearchInput?.addEventListener("input", () => {
    createTemplateSearchQuery = (createTemplateSearchInput.value || "").trim().toLowerCase();
    renderCreateTemplateLibrary();
  });

  createReferenceLibraryBtn?.addEventListener("click", () => {
    openCreateReferenceLibrary();
  });

  createModeChoiceStrip?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("[data-create-template-mode-trigger]");
    if (!(button instanceof HTMLElement)) return;
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }

    openCreateModeChoiceModal();
  });

  createModeChoiceModalList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("[data-create-template-mode-id]");
    if (!(button instanceof HTMLElement)) return;
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }

    const templateId = String(button.dataset.createTemplateModeId || "").trim();
    if (!templateId) return;
    const changed = templateId !== createSelectedTemplateId;
    if (changed) {
      applyCreateTemplateSelection(templateId);
    }
    renderCreateModeChoices();
    closeCreateModeChoiceModal();
    if (changed) handleCreateInputMutation();

    if (createSelectedTemplateId === CREATE_DIRECT_PROMPT_TEMPLATE.id) {
      window.setTimeout(() => {
        createCustomPrompt?.focus();
      }, 0);
    }
  });

  createModeChoiceModalClose?.addEventListener("click", () => {
    closeCreateModeChoiceModal();
  });

  createModeChoiceModal?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("[data-create-mode-choice-close]")) {
      closeCreateModeChoiceModal();
    }
  });

  createIsClothingToggle?.addEventListener("change", () => {
    const nextTypeId = createIsClothingToggle.checked ? "clothing_and_shoes" : "general_product";
    const changed = setCreateProductType(nextTypeId, { resetAngle: true });
    createProductTypeSource = "manual";
    logProductTypeEvent("product_type_manual_override", { productType: createProductTypeId });
    syncCreateProductTypeDetectionStatus();
    renderCreateProductRouting();
    if (changed) handleCreateInputMutation();
  });

  createAngleSuggestions?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const angleButton = target.closest("[data-product-angle-id]");
    if (!(angleButton instanceof HTMLElement)) return;

    if (setCreateProductAngle(angleButton.dataset.productAngleId)) {
      renderCreateProductRouting();
      handleCreateInputMutation();
    }
  });

  createReferenceModalClose?.addEventListener("click", () => {
    closeCreateReferenceLibrary();
  });

  createReferenceModal?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("[data-create-reference-close]")) {
      closeCreateReferenceLibrary();
    }
  });

  createUploadZone?.addEventListener("click", () => {
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }

    openCreateImageManagerModal();
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

  createEditImageBtn?.addEventListener("click", () => {
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }

    openCreateImageManagerModal();
  });

  createImageManagerAddBtn?.addEventListener("click", () => {
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }
    if (createSelectedFiles.length >= CREATE_UPLOAD_MAX_FILES) {
      setStatusMessage(createStatus, "Достигнут лимит: максимум " + String(CREATE_UPLOAD_MAX_FILES) + " фото.", "error");
      return;
    }

    createImagesInput?.click();
  });

  createImageManagerClose?.addEventListener("click", () => {
    closeCreateImageManagerModal();
  });

  createImageManagerModal?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("[data-create-image-manager-close]")) {
      closeCreateImageManagerModal();
    }
  });

  createTemplateTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      createActiveTemplateTab = normalizeCreateTemplateTab(button.dataset.createTemplateTab);
      renderCreateTemplateLibrary();
    });
  });

  createTemplateGrid?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const angleButton = target.closest("[data-product-angle-id]");
    if (angleButton instanceof HTMLElement) {
      if (setCreateProductAngle(angleButton.dataset.productAngleId)) {
        renderCreateTemplateLibrary();
        handleCreateInputMutation();
      }
      closeCreateReferenceLibrary();
      return;
    }

    const templateButton = target.closest("[data-template-id]");
    if (!(templateButton instanceof HTMLElement)) return;

    const templateId = String(templateButton.dataset.templateId || "").trim();
    if (!templateId) return;
    if (templateId === createSelectedTemplateId) {
      closeCreateReferenceLibrary();
      return;
    }

    applyCreateTemplateSelection(templateId);
    closeCreateReferenceLibrary();
    renderCreateTemplateLibrary();
    handleCreateInputMutation();

    if (createSelectedTemplateId === CREATE_DIRECT_PROMPT_TEMPLATE.id) {
      window.setTimeout(() => {
        createCustomPrompt?.focus();
      }, 0);
    }
  });

  createInstructionAttachBtn?.addEventListener("click", () => {
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }
    createInstructionInput?.click();
  });

  createInstructionInput?.addEventListener("change", async () => {
    const file = createInstructionInput.files?.[0] || null;
    if (!file) return;

    try {
      createInstructionDocumentText = await file.text();
      createInstructionDocumentName = file.name || "instruction.md";
      syncCreateInstructionState();
      setStatusMessage(createStatus, "Инструкция подключена: " + createInstructionDocumentName + ".", "success");
      setDoneState(createDoneBadge, false);
      syncCreateFormState();
    } catch (error) {
      createInstructionDocumentText = "";
      createInstructionDocumentName = "";
      syncCreateInstructionState();
      setStatusMessage(createStatus, "Не удалось прочитать файл инструкции.", "error");
    } finally {
      if (createInstructionInput) {
        createInstructionInput.value = "";
      }
    }
  });

  createAutofillBtn?.addEventListener("click", async () => {
    if (isCreateControlsLocked()) {
      setStatusMessage(createStatus, "Дождитесь завершения текущего AI-запроса.", "");
      return;
    }

    cancelPendingCreateRequests();
    await runCreateAutofill();
  });

  createExportBtn?.addEventListener("click", (event) => {
    if (createExportBtn.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      setStatusMessage(createStatus, "Сначала сгенерируйте карточку, чтобы экспортировать превью.", "");
      return;
    }

    const selectedTemplate = getCreateSelectedTemplate();
    if (isCreateTextReplaceTemplate(selectedTemplate) && createGeneratedResults.length > 1) {
      event.preventDefault();
      downloadCreateResultFiles(createGeneratedResults);
      setStatusMessage(createStatus, "Экспортируем Gemini-версию и финальную карточку.", "success");
    }
  });

  createImproveBtn?.addEventListener("click", () => {
    const activeResult = getActiveCreateResult();
    openImproveFromCreateResult(activeResult);
  });

  createBestModelSelect?.addEventListener("change", () => {
    setCreateBestModelTier(createBestModelSelect.value);
  });

  const createBestModelControl = createBestModelSelect?.closest(".create-best-model-control");
  const toggleCreateBestModelTier = () => {
    if (!createBestModelSelect || createBestModelSelect.disabled) return;
    setCreateBestModelTier(createBestModelTier === "best" ? "good" : "best");
  };

  createBestModelControl?.addEventListener("click", (event) => {
    event.preventDefault();
    toggleCreateBestModelTier();
  });

  createBestModelControl?.addEventListener("keydown", (event) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    toggleCreateBestModelTier();
  });

  createGenerationNotesToggle?.addEventListener("click", () => {
    setCreateGenerationNotesExpanded(!createGenerationNotesExpanded, { focus: !createGenerationNotesExpanded });
  });

  createGenerationNotes?.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !createGenerationNotesExpanded) return;
    event.preventDefault();
    setCreateGenerationNotesExpanded(false);
    createGenerationNotesToggle?.focus();
  });

  createTextReplaceList?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    const ruleId = Number(target.dataset.ruleId || 0);
    const field = String(target.dataset.replaceField || "");
    if (!ruleId || (field !== "from" && field !== "to")) return;
    const rule = createTextReplaceRules.find((item) => item.id === ruleId);
    if (!rule) return;
    rule[field] = target.value;
    syncCreateFormState();
  });

  createTextReplaceList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const removeBtn = target.closest("[data-remove-replace-rule]");
    if (!removeBtn) return;
    const ruleId = Number(removeBtn.getAttribute("data-remove-replace-rule") || 0);
    if (!ruleId) return;

    createTextReplaceRules = createTextReplaceRules.map((rule) => ({
      ...rule,
      from: rule.id === ruleId ? "" : rule.from,
      to: rule.id === ruleId ? "" : rule.to,
    })).slice(0, 1);

    renderCreateTextReplaceRules();
    syncCreateFormState();
  });

  createGenerateBtn?.addEventListener("click", async () => {
    if (createIsGenerating) return;

    const validationError = getCreateValidationError();
    if (validationError) {
      setStatusMessage(createStatus, validationError, "error");
      syncCreateFormState();
      return;
    }

    const requestId = ++createGenerationRequestId;
    createIsGenerating = true;
    createGeneratedResults = [];
    createActivePreviewResultId = "";
    createLastHistoryEntryId = "";
    setCreateResultsProcessing(true);
    setCreateResultsProcessingStage("analyzing");
    setDoneState(createDoneBadge, false);
    setStatusMessage(createStatus, "Анализируем ваш товар...", "");
    setRequestMeta(createMeta, "Статус запроса:", "Анализируем ваш товар");
    if (createResultsGrid) {
      createResultsGrid.textContent = "";
    }
    syncCreateFormState();

    try {
      const selectedTemplate = getCreateSelectedTemplate();
      const isDirectPromptTemplate = usesCreateDirectGenerationPrompt(selectedTemplate);
      const usesInstructionPromptFlow = usesCreateInstructionPromptFlow(selectedTemplate);

      if (usesInstructionPromptFlow) {
        createAiPromptPhase = "loading";
        setCreateResultsProcessingStage("planning");
        setStatusMessage(createStatus, "Анализируем ваш товар...", "");
        setRequestMeta(createMeta, "Статус запроса:", "Анализируем ваш товар");
        syncCreateFormState();

        const promptPayload = await buildCreateAiPromptPayload();
        promptPayload.requestId = buildClientRequestId("create-generate-prompt", requestId);
        const generatedPrompt = await requestCreateAiPrompt(promptPayload, {
          billingSource: "create_generate",
          requestId: promptPayload.requestId,
        });
        if (requestId !== createGenerationRequestId) return;

        if (createAiPromptOutput) {
          createAiPromptOutput.value = generatedPrompt;
        }
        createAiPromptPhase = "success";
        setStatusMessage(createStatus, "Создаем карточку...", "");
        setRequestMeta(createMeta, "Статус запроса:", "Создаем карточку");
        syncCreateFormState();
      } else if (!isDirectPromptTemplate) {
        const insightNeedsRefresh = !createInsightData || createInsightFingerprint !== getCreateInsightFingerprint();
        if (insightNeedsRefresh) {
          const insightReady = await runCreateInsightAnalysis({ source: "generation" });
          if (!insightReady) {
            if (createInsightPhase === "interrupted") {
              throw createInterruptedRequestError("Связь прервалась после сворачивания приложения. Генерацию можно повторить без потери данных.");
            }
            throw new Error("Не удалось получить AI-анализ для генерации карточек.");
          }
        }
        setCreateResultsProcessingStage("planning");
      } else {
        setStatusMessage(createStatus, "Создаем карточку...", "");
        setRequestMeta(createMeta, "Статус запроса:", "Создаем карточку");
      }

      if (usesInstructionPromptFlow) {
        setStatusMessage(createStatus, "Создаем карточку...", "");
        setRequestMeta(createMeta, "Статус запроса:", "Создаем карточку");
      } else if (isDirectPromptTemplate) {
        setStatusMessage(createStatus, "Создаем карточку...", "");
        setRequestMeta(createMeta, "Статус запроса:", "Создаем карточку");
      } else {
        setStatusMessage(createStatus, "Создаем карточку...", "");
        setRequestMeta(createMeta, "Статус запроса:", "Создаем карточку");
      }
      const payload = await buildCreateGenerationPayload();
      payload.requestId = buildClientRequestId("create-generate", requestId);
      setCreateResultsProcessingStage("generating");
      setStatusMessage(createStatus, "Генерация изображения займет 3-5 минут. Не закрывайте страницу.", "");
      setRequestMeta(createMeta, "Статус запроса:", "Генерация изображения: 3-5 минут");
      syncCreateFormState();
      const results = await requestCreateGeneration(payload);
      if (requestId !== createGenerationRequestId) return;

      createGeneratedResults = Array.isArray(results) ? results : [];
      if (!createGeneratedResults.length) {
        throw new Error("Генерация вернула пустой результат.");
      }

      const selectableResults = createGeneratedResults.filter((result) => result?.status !== "failed" && result?.previewUrl);
      if (!selectableResults.length) {
        throw new Error("Generation providers did not return a selectable image.");
      }

      const isTextReplaceResultSet = isCreateTextReplaceTemplate(getCreateSelectedTemplate());
      setCreateResultsProcessingStage("finalizing");
      setStatusMessage(createStatus, "Готовим результат", "");
      setRequestMeta(createMeta, "Статус запроса:", "Готовим результат");
      await waitForCreateResultImages(createGeneratedResults, {
        minimumCount: isTextReplaceResultSet ? 2 : 1,
      });
      if (requestId !== createGenerationRequestId) return;

      const preferredTextReplaceResult = isCreateTextReplaceTemplate(getCreateSelectedTemplate())
        ? selectableResults.find((result) => String(result?.id || "").includes("final")) || null
        : null;
      createActivePreviewResultId = preferredTextReplaceResult?.id || selectableResults[0]?.id || "";
      setCreateResultsProcessing(false);
      renderCreateResults();

      const total = createGeneratedResults.length;
      const completedTotal = selectableResults.length;
      const failedTotal = Math.max(0, total - completedTotal);
      setDoneState(createDoneBadge, true);
      setStatusMessage(createStatus, "Готово. Сгенерировано " + String(completedTotal) + " " + formatCardsWord(completedTotal) + (failedTotal ? ", " + String(failedTotal) + " провайдер без результата." : "."), "success");
      setRequestMeta(createMeta, "Статус запроса:", "Готово: " + String(completedTotal) + " " + formatCardsWord(completedTotal));
      createIsGenerating = false;
      syncCreateFormState();

      const marketplace = createMarketplace?.value || "Маркетплейс";
      try {
        const historyPayload = await buildCreateHistoryPayload(payload, createGeneratedResults);
        const historySave = await pushHistory({
          mode: "create",
          title: String(total) + " " + formatCardsWord(total) + " • " + marketplace,
          summary: historyPayload.summary,
          prompt: historyPayload.prompt,
          resultsCount: total,
          selectedResultId: historyPayload.selectedResultId,
          previewUrl: historyPayload.previewUrl,
          resultPreviews: historyPayload.resultPreviews,
          input: historyPayload.input,
          uploads: historyPayload.uploads,
          ai: historyPayload.ai,
          results: historyPayload.results,
          meta: {
            marketplace,
            promptMode: createPromptMode,
            ...(historyPayload.meta || {}),
          },
        });
        if (historySave?.entry?.id) {
          createLastHistoryEntryId = historySave.entry.id;
        }
        if (!historySave?.ok) {
          setStatusMessage(createStatus, "Генерация готова, но история не сохранилась в backend.", "error");
          setRequestMeta(createMeta, "Статус запроса:", historySave?.feedback?.metaValue || "История не сохранена", "error");
        }
      } catch (historyError) {
        console.warn("[history] create save failed", historyError);
        setStatusMessage(createStatus, "Генерация готова, но историю сохранить не удалось.", "error");
        setRequestMeta(createMeta, "Статус запроса:", "История не сохранена", "error");
      }
    } catch (error) {
      if (requestId !== createGenerationRequestId) return;
      createGeneratedResults = [];
      createActivePreviewResultId = "";
      createLastHistoryEntryId = "";
      setCreateResultsProcessingStage("error");
      if (createAiPromptPhase === "loading") {
        createAiPromptPhase = isInterruptedRequestError(error) ? "interrupted" : "error";
      }
      setCreateResultsProcessing(false);
      renderCreateResults();
      setDoneState(createDoneBadge, false);
      const feedback = resolveRequestErrorFeedback(error, "Ошибка генерации карточек. Повторите попытку.", {
        interruptedMessage: "Связь прервалась после сворачивания приложения. Исходные данные сохранены, генерацию можно безопасно повторить.",
        interruptedMeta: "Генерация карточки прервана после возврата",
        timeoutMeta: "Таймаут генерации карточки",
        networkMeta: "Сбой генерации карточки",
        errorMeta: "Ошибка генерации карточки",
      });
      setStatusMessage(createStatus, feedback.message, feedback.type);
      setRequestMeta(createMeta, "Статус запроса:", feedback.metaValue, feedback.type);
    } finally {
      if (requestId === createGenerationRequestId) {
        createIsGenerating = false;
        if (activeUser) {
          void refreshBillingSummary();
        }
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

  const handleFourCardsSourceSelection = async (fileList) => {
    if (isFourCardsControlsLocked()) {
      setStatusMessage(fourCardsStatus, "Дождитесь завершения текущей генерации.", "");
      syncFourCardsFormState();
      return;
    }

    const file = fileList?.[0];
    if (!file) return;

    try {
      await applyFourCardsSourceFile(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось загрузить изображение.";
      setStatusMessage(fourCardsStatus, message, "error");
      syncFourCardsFormState();
    } finally {
      if (fourCardsImageInput) {
        fourCardsImageInput.value = "";
      }
    }
  };

  improveImageInput?.addEventListener("change", () => {
    handleImproveSourceSelection(improveImageInput.files);
  });

  fourCardsImageInput?.addEventListener("change", () => {
    handleFourCardsSourceSelection(fourCardsImageInput.files);
  });

  fourCardsUploadZone?.addEventListener("click", () => {
    if (isFourCardsControlsLocked()) return;
    fourCardsImageInput?.click();
  });

  fourCardsUploadZone?.addEventListener("dragenter", (event) => {
    event.preventDefault();
    if (isFourCardsControlsLocked()) return;
    fourCardsDragDepth += 1;
    fourCardsUploadZone.classList.add("is-dragover");
  });

  fourCardsUploadZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (isFourCardsControlsLocked()) return;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  });

  fourCardsUploadZone?.addEventListener("dragleave", () => {
    if (isFourCardsControlsLocked()) return;
    fourCardsDragDepth = Math.max(0, fourCardsDragDepth - 1);
    if (fourCardsDragDepth === 0) {
      fourCardsUploadZone.classList.remove("is-dragover");
    }
  });

  fourCardsUploadZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    fourCardsDragDepth = 0;
    fourCardsUploadZone.classList.remove("is-dragover");
    if (isFourCardsControlsLocked()) return;
    handleFourCardsSourceSelection(event.dataTransfer?.files);
  });

  fourCardsGenerateBtn?.addEventListener("click", () => {
    void runFourCardsGeneration();
  });

  fourCardsRegenerateBtn?.addEventListener("click", () => {
    void runFourCardsGeneration();
  });

  fourCardsDownloadAllBtn?.addEventListener("click", () => {
    downloadFourCardsFiles();
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
    createUploadDragDepth = 0;
    improvePrimaryDragDepth = 0;
    improveReferenceDragDepth = 0;
    fourCardsDragDepth = 0;
    createUploadZone?.classList.remove("is-dragover");
    improvePrimaryUploadZone?.classList.remove("is-dragover");
    improveReferenceUploadZone?.classList.remove("is-dragover");
    fourCardsUploadZone?.classList.remove("is-dragover");
  });

  window.addEventListener("drop", () => {
    createUploadDragDepth = 0;
    improvePrimaryDragDepth = 0;
    improveReferenceDragDepth = 0;
    fourCardsDragDepth = 0;
    createUploadZone?.classList.remove("is-dragover");
    improvePrimaryUploadZone?.classList.remove("is-dragover");
    improveReferenceUploadZone?.classList.remove("is-dragover");
    fourCardsUploadZone?.classList.remove("is-dragover");
  });

  window.addEventListener("kartochka:improve:prefill", (event) => {
    const details = event?.detail && typeof event.detail === "object" ? event.detail : {};
    void applyImprovePrefill(details).catch((error) => {
      const message = error instanceof Error ? error.message : "РќРµ СѓРґР°Р»РѕСЃСЊ РїРµСЂРµРЅРµСЃС‚Рё РєР°СЂС‚РѕС‡РєСѓ РІ improve.";
      setStatusMessage(improveStatus, message, "error");
      syncImproveFormState();
    });
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
        ? "AI улучшает карточку в стиле референса. Генерация обычно занимает 3-5 минут, не закрывайте страницу."
        : "AI улучшает карточку. Генерация обычно занимает 3-5 минут, не закрывайте страницу.",
      ""
    );
    setRequestMeta(
      improveMeta,
      "Статус запроса:",
      referenceStyleActive ? "Улучшение карточки: reference style" : "Улучшение карточки: подготовка"
    );
    if (improveResultsCaption) {
      improveResultsCaption.textContent = "Генерация идет через GPT Image 2 и может занять 3-5 минут. Страница сама покажет результат.";
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
          if (improveAnalysisPhase === "interrupted") {
            throw createInterruptedRequestError("Связь прервалась после сворачивания приложения. Улучшение можно повторить без потери исходных данных.");
          }
          throw new Error("Не удалось получить AI анализ для улучшения карточки.");
        }
      }

      const payload = buildImproveGenerationPayload();
      payload.requestId = buildClientRequestId("improve-generate", requestId);
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

      try {
        const historyPayload = await buildImproveHistoryPayload(payload, improveGeneratedResults);
        const historySave = await pushHistory({
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
        if (!historySave?.ok) {
          setStatusMessage(improveStatus, "Улучшение готово, но история не сохранилась в backend.", "error");
          setRequestMeta(improveMeta, "Статус запроса:", historySave?.feedback?.metaValue || "История не сохранена", "error");
        }
      } catch (historyError) {
        console.warn("[history] improve save failed", historyError);
        setStatusMessage(improveStatus, "Улучшение готово, но историю сохранить не удалось.", "error");
        setRequestMeta(improveMeta, "Статус запроса:", "История не сохранена", "error");
      }

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
      const feedback = resolveRequestErrorFeedback(error, "Ошибка улучшения карточки. Повторите попытку.", {
        interruptedMessage: "Связь прервалась после сворачивания приложения. Исходные данные сохранены, улучшение можно повторить.",
        interruptedMeta: "Улучшение карточки прервано после возврата",
        timeoutMeta: "Таймаут улучшения карточки",
        networkMeta: "Сбой улучшения карточки",
        errorMeta: "Ошибка улучшения карточки",
      });
      setStatusMessage(improveStatus, feedback.message, feedback.type);
      setRequestMeta(improveMeta, "Статус запроса:", feedback.metaValue, feedback.type);
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
    void hydrateHistoryEntry(selected.id);
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
    const openButton = target.closest("[data-history-open-id]");
    if (openButton instanceof HTMLElement) {
      const entryId = openButton.dataset.historyOpenId || "";
      openHistoryEntry(entryId);
      return;
    }
    const previewButton = target.closest("[data-history-preview-id]");
    if (!(previewButton instanceof HTMLElement)) return;
    const entryId = previewButton.dataset.historyPreviewId || "";
    openHistoryPreviewModal(entryId);
  });

  historyDetailsResults?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const previewButton = target.closest("[data-history-result-preview-id]");
    if (!(previewButton instanceof HTMLElement)) return;
    const entryId = previewButton.dataset.historyResultPreviewEntryId || selectedHistoryEntryId;
    const resultId = previewButton.dataset.historyResultPreviewId || "";
    openHistoryPreviewModal(entryId, resultId);
  });

  historyModeDetailsCloseBtn?.addEventListener("click", () => {
    closeHistoryDetailsModal();
  });

  historyModeDetailsBackdrop?.addEventListener("click", () => {
    closeHistoryDetailsModal();
  });

  historyPreviewCloseBtn?.addEventListener("click", () => {
    closeHistoryPreviewModal();
  });

  historyPreviewBackdrop?.addEventListener("click", () => {
    closeHistoryPreviewModal();
  });

  historyReusePromptBtn?.addEventListener("click", () => {
    if (historyReuseInProgress) return;
    const entryId = historyReusePromptBtn.dataset.historyPromptReuseId || selectedHistoryEntryId;
    const entry = getHistoryEntryById(entryId);
    if (!entry) return;
    applyHistoryPromptOnly(entry);
    if (entry.mode === "improve") {
      setRequestMeta(improveMeta, "Статус запроса:", "Prompt из истории загружен");
      setStatusMessage(
        improveStatus,
        "Prompt из истории загружен. Проверьте исходник и запустите улучшение.",
        hasImproveSourceInput() ? "success" : ""
      );
      return;
    }
    setRequestMeta(createMeta, "Статус запроса:", "Prompt из истории загружен");
    setStatusMessage(
      createStatus,
      "Prompt из истории загружен. Проверьте данные и запустите новую генерацию.",
      "success"
    );
  });

  historyReuseBtn?.addEventListener("click", async () => {
    if (historyReuseInProgress) return;
    const entryId = historyReuseBtn.dataset.historyReuseId || selectedHistoryEntryId;
    const entry = getHistoryEntryById(entryId);
    if (!entry) return;
    await applyHistoryEntryAsBase(entry);
  });

  historyOpenResultBtn?.addEventListener("click", () => {
    const entryId = historyOpenResultBtn.dataset.historyOpenResultId || selectedHistoryEntryId;
    const entry = getHistoryEntryById(entryId);
    if (!entry) return;
    const result = getHistoryPrimaryResult(entry);
    if (!result) return;
    openHistoryPreviewModal(entry.id, result.id);
  });

  historyClearBtn?.addEventListener("click", clearHistory);
  historyModeRefreshBtn?.addEventListener("click", () => {
    void refreshHistory();
  });
  historyModeClearBtn?.addEventListener("click", clearHistory);

  syncCreatePromptMode("ai");
  syncCreateUsefulSettings();
  initCreateCharacteristicsComponent();
  syncCreateLegacyFields();
  syncCreateReferenceLibraryState();
  syncCreateImageManagerState();
  renderCreateTemplateLibrary();
  renderCreateFiles();
  renderCreateResults();
  setRequestMeta(createMeta, "Статус запроса:", "Ожидание данных");
  syncCreateFormState();
  renderBillingSummary();
  syncBillingHeader();

  syncImproveMode("ai");
  renderImproveAnalysisValues(null);
  renderImproveResults();
  setRequestMeta(improveMeta, "Статус запроса:", "Ожидание исходной карточки");
  syncImproveFormState();

  renderFourCardsResult();
  setRequestMeta(fourCardsMeta, "Статус запроса:", "Ждём исходное изображение");
  syncFourCardsFormState();

  void refreshHistory();
  void refreshBillingSummary();
  window.addEventListener("hashchange", handleAppHashRoute);
  window.addEventListener("popstate", handleAppHashRoute);
  window.addEventListener("kartochka:billing:refresh", () => {
    if (activeUser) {
      void refreshBillingSummary();
    }
  });

  const handleAppBackgrounded = () => {
    lastAppBackgroundAt = Date.now();
    syncActiveLifecycleRequestStatus("background");
  };

  const handleAppForegrounded = () => {
    lastAppForegroundAt = Date.now();
    syncActiveLifecycleRequestStatus("resume");
  };

  const handleAppOffline = () => {
    lastAppOfflineAt = Date.now();
    syncActiveLifecycleRequestStatus("offline");
  };

  const handleAppOnline = () => {
    lastAppOnlineAt = Date.now();
    syncActiveLifecycleRequestStatus("resume");
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      handleAppBackgrounded();
      return;
    }
    handleAppForegrounded();
  });

  window.addEventListener("pagehide", handleAppBackgrounded);
  window.addEventListener("pageshow", handleAppForegrounded);
  window.addEventListener("freeze", handleAppBackgrounded);
  window.addEventListener("resume", handleAppForegrounded);
  window.addEventListener("offline", handleAppOffline);
  window.addEventListener("online", handleAppOnline);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCreateModeChoiceModal();
      closeCreateReferenceLibrary();
      closeCreateImageManagerModal();
      closeBillingModal();
      closeHistoryDetailsModal();
      closeHistoryPreviewModal();
      closeMobileMenu();
      closeAuthModal();
    }
  });

  const requestAuthAccess = (message) => {
    setAuthMessage(message || "Войдите, чтобы использовать AI.", "");
    openAuthModal();
  };

  const requestBillingAccess = async () => {
    if (!activeUser) {
      requestAuthAccess("Войдите, чтобы открыть баланс и продолжить.");
      return;
    }
    openBillingModal();
    if (!billingSummary) {
      await refreshBillingSummary();
    }
  };

  window.addEventListener("kartochka:auth:open", (event) => {
    const detail = event?.detail && typeof event.detail === "object" ? event.detail : {};
    requestAuthAccess(toText(detail.message) || "Войдите, чтобы использовать AI.");
  });

  window.addEventListener("kartochka:billing:open", () => {
    void requestBillingAccess();
  });

  billingOpenBtn?.addEventListener("click", async () => {
    await requestBillingAccess();
  });

  billingModalClose?.addEventListener("click", closeBillingModal);
  billingModalBackdrop?.addEventListener("click", closeBillingModal);

  billingPromoBtn?.addEventListener("click", async () => {
    if (!activeUser) {
      openAuthModal();
      return;
    }
    const code = (billingPromoInput?.value || "").trim();
    if (!code) {
      setBillingPromoStatus("Введите промокод.", "error");
      return;
    }
    if (!serviceClient?.redeemPromo) {
      setBillingPromoStatus("Промокоды пока недоступны.", "error");
      return;
    }

    billingPromoBtn.setAttribute("disabled", "disabled");
    setBillingPromoStatus("Проверяем промокод...", "");

    try {
      billingSummary = await serviceClient.redeemPromo({ code });
      if (billingPromoInput) billingPromoInput.value = "";
      renderBillingSummary();
      setBillingPromoStatus("Промокод применен. Баланс обновлен.", "success");
      syncCreateFormState();
    } catch (error) {
      setBillingPromoStatus(error instanceof Error ? error.message : "Не удалось применить промокод.", "error");
    } finally {
      billingPromoBtn.removeAttribute("disabled");
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
    if (code === "auth/invalid-email") return "Некорректный email";
    if (code === "auth/user-not-found") return "Аккаунт с таким email не найден";
    if (code === "auth/wrong-password") return "Неверный пароль";
    if (code === "auth/invalid-credential") return "Неверный email или пароль";
    if (code === "auth/email-already-in-use") return "Этот email уже используется";
    if (code === "auth/weak-password") return "Пароль должен быть не короче 6 символов";
    if (code === "auth/too-many-requests") return "Слишком много попыток. Попробуйте позже";
    if (code === "auth/operation-not-allowed") return "В Firebase не включён вход по email и паролю";
    if (code === "auth/configuration-not-found") return "В Firebase не настроен способ входа по email и паролю";
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

    setAuthButtonsDisabled(true);
    setAuthMessage("Открываем Google-авторизацию...", "");

    try {
      pendingPostAuthMode = parseAppModeFromHash() || activeMode || "create";
      const result = await auth.signInWithPopup(googleProvider);
      activeUser = result.user;
      syncCabinetButton(result.user);
      setAuthMessage("Вход через Google выполнен", "success");
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      setAuthButtonsDisabled(false);
    }
  });

  authEmailLoginPanel?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!auth) {
      setAuthMessage("Email-авторизация недоступна: Firebase не подключен", "error");
      return;
    }

    const email = toText(authLoginEmailInput?.value);
    const password = toText(authLoginPasswordInput?.value);

    if (!email || !password) {
      setAuthMessage("Введите email и пароль", "error");
      return;
    }

    setAuthButtonsDisabled(true);
    setAuthMessage("Проверяем данные и входим...", "");

    try {
      pendingPostAuthMode = parseAppModeFromHash() || activeMode || "create";
      const result = await auth.signInWithEmailAndPassword(email, password);
      activeUser = result.user || null;
      syncCabinetButton(result.user);
      setAuthMessage("Вход по email выполнен", "success");
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      setAuthButtonsDisabled(false);
    }
  });

  authEmailRegisterPanel?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!auth) {
      setAuthMessage("Регистрация по email недоступна: Firebase не подключен", "error");
      return;
    }

    const email = toText(authRegisterEmailInput?.value);
    const password = toText(authRegisterPasswordInput?.value);
    const confirmPassword = toText(authRegisterPasswordConfirmInput?.value);

    if (!email || !password || !confirmPassword) {
      setAuthMessage("Заполните все поля регистрации", "error");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("Пароль должен быть не короче 6 символов", "error");
      return;
    }

    if (password !== confirmPassword) {
      setAuthMessage("Пароли не совпадают", "error");
      return;
    }

    setAuthButtonsDisabled(true);
    setAuthMessage("Создаём аккаунт...", "");

    try {
      pendingPostAuthMode = parseAppModeFromHash() || activeMode || "create";
      const result = await auth.createUserWithEmailAndPassword(email, password);
      activeUser = result.user || null;
      syncCabinetButton(result.user);
      setAuthMessage("Аккаунт создан", "success");
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      setAuthButtonsDisabled(false);
    }
  });

  appSignOutBtn?.addEventListener("click", async () => {
    if (!activeUser) {
      signOutRedirectPending = false;
      replacePublicPath("");
      closeWorkspaceView();
      return;
    }

    if (!auth) {
      signOutRedirectPending = false;
      activeUser = null;
      syncCabinetButton(null);
      syncWorkspaceUser(null);
      void refreshHistory();
      void refreshBillingSummary();
      replacePublicPath("");
      closeWorkspaceView();
      return;
    }

    signOutRedirectPending = true;
    appSignOutBtn.setAttribute("disabled", "disabled");

    try {
      await auth.signOut();
    } catch (error) {
      signOutRedirectPending = false;
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      appSignOutBtn.removeAttribute("disabled");
    }
  });

  if (auth) {
    auth.onAuthStateChanged(async (user) => {
      activeUser = user || null;
      syncCabinetButton(user);
      syncWorkspaceUser(user);

      if (!user) {
        pendingPostAuthMode = "create";
        if (signOutRedirectPending) {
          signOutRedirectPending = false;
          replacePublicPath("");
          closeWorkspaceView();
          closeAuthModal();
          setAppRouteBootstrapPending(false);
          void Promise.allSettled([refreshHistory(), refreshBillingSummary()]);
          return;
        }

        if (parseAppModeFromHash()) {
          handleAppHashRoute();
        } else {
          closeWorkspaceView();
        }
        void Promise.allSettled([refreshHistory(), refreshBillingSummary()]);
        return;
      }

      const targetMode = pendingPostAuthMode || parseAppModeFromHash() || activeMode || "create";
      pendingPostAuthMode = targetMode;
      if (parseAppModeFromHash()) {
        handleAppHashRoute();
      } else {
        navigateToAppMode(targetMode, { replace: true });
      }

      closeAuthModal();
      setAppRouteBootstrapPending(false);
      void Promise.allSettled([refreshHistory(), refreshBillingSummary()]);

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
    void refreshBillingSummary();
    if (parseAppModeFromHash()) {
      handleAppHashRoute();
    } else {
      closeWorkspaceView();
      setAppRouteBootstrapPending(false);
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

  clearPublicAnchorHashOnBoot();

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
