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
  const createResultsProcessing = document.getElementById("createResultsProcessing");
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
  const createReferenceLibraryBtn = document.getElementById("createReferenceLibraryBtn");
  const createReferenceModal = document.getElementById("createReferenceModal");
  const createReferenceModalClose = document.getElementById("createReferenceModalClose");
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
  const createProductTitle = document.getElementById("createProductTitle");
  const createProductShortDescription = document.getElementById("createProductShortDescription");
  const createProductThirdLevelText = document.getElementById("createProductThirdLevelText");
  const createAutofillBtn = document.getElementById("createAutofillBtn");
  const createCharacteristicPresets = document.getElementById("createCharacteristicPresets");
  const createCharacteristicsList = document.getElementById("createCharacteristicsList");
  const createCharacteristicsEmpty = document.getElementById("createCharacteristicsEmpty");
  const createAddCharacteristicBtn = document.getElementById("createAddCharacteristicBtn");
  const createPreviewCard = document.getElementById("createPreviewCard");
  const createPreviewImage = document.getElementById("createPreviewImage");
  const createPreviewEmpty = document.getElementById("createPreviewEmpty");
  const createPreviewEmptyTitle = document.getElementById("createPreviewEmptyTitle");
  const createPreviewEmptyText = document.getElementById("createPreviewEmptyText");
  const createPreviewBadge = document.getElementById("createPreviewBadge");
  const createPreviewTitle = document.getElementById("createPreviewTitle");
  const createPreviewMeta = document.getElementById("createPreviewMeta");
  const createImproveBtn = document.getElementById("createImproveBtn");
  const createExportBtn = document.getElementById("createExportBtn");
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
  mountWorkspaceOverlay(createImageManagerModal);
  mountWorkspaceOverlay(billingModal);
  mountWorkspaceOverlay(historyPreviewModal);

  const APP_ROUTE_PREFIX = "#app/";
  const APP_MODES = ["create", "improve", "animate", "history"];
  const HISTORY_MAX_ITEMS = 30;
  const HISTORY_STORAGE_PREFIX = "kartochka:history:v1:";
  const HISTORY_IMAGE_MAX_DIMENSION = 960;
  const HISTORY_IMAGE_JPEG_QUALITY = 0.82;
  const API_IMAGE_MAX_DIMENSION = 1280;
  const API_AI_IMAGE_MAX_DIMENSION = 1024;
  const API_IMAGE_JPEG_QUALITY = 0.84;
  const API_AI_IMAGE_MIME_TYPE = "image/png";
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
    animate: "Анимация",
    history: "История",
  };

  const SERVICE_MODE = (() => {
    const configuredMode = String(window.KARTOCHKA_SERVICE_MODE || "").trim().toLowerCase();
    if (configuredMode === "mock" || configuredMode === "real") return configuredMode;
    return "real";
  })();

  let activeUser = null;

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
          timeoutMs: 300000,
          getHeaders: async () => {
            if (!activeUser) return {};
            try {
              const token = typeof activeUser.getIdToken === "function"
                ? await activeUser.getIdToken()
                : "";
              return {
                ...(token ? { Authorization: "Bearer " + token } : {}),
                "X-Kartochka-User-Id": activeUser.uid || "",
                "X-Kartochka-User-Email": activeUser.email || "",
              };
            } catch (error) {
              return {
                "X-Kartochka-User-Id": activeUser.uid || "",
                "X-Kartochka-User-Email": activeUser.email || "",
              };
            }
          },
        },
        endpoints: {
          createAnalyze: "/api/kartochka/createAnalyze",
          createGenerate: "/api/kartochka/createGenerate",
          improveAnalyze: "/api/kartochka/improveAnalyze",
          improveGenerate: "/api/kartochka/improveGenerate",
          historyList: "/api/kartochka/historyList",
          historyGetById: "/api/kartochka/historyGetById",
          historySave: "/api/kartochka/historySave",
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
  let createResultExpandedId = "";
  let createActivePreviewResultId = "";
  let createInstructionDocumentText = "";
  let createInstructionDocumentName = "";
  let createBestModelTier = "good";
  let createGenerationNotesExpanded = false;
  const createSelectedFiles = [];
  let createActiveTemplateTab = "all";
  let createTemplateSearchQuery = "";
  let createSelectedTemplateId = CREATE_DEFAULT_TEMPLATE_ID;
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
  let improveGenerationRequestId = 0;
  let improveGeneratedResults = [];
  let improveResultExpandedId = "";
  let improvePrimaryDragDepth = 0;
  let improveReferenceDragDepth = 0;
  const historyEntries = [];
  let selectedHistoryEntryId = "";
  let historyReuseInProgress = false;
  let historyDetailsVisible = false;
  let historyPreviewVisible = false;
  let selectedHistoryPreviewEntryId = "";
  let billingModalOpen = false;
  let billingSummary = null;
  let billingSummaryLoading = false;
  let billingPromoLoading = false;

  window.KARTOCHKA_AUTH_SESSION = {
    async getHeaders() {
      if (!activeUser) return {};
      try {
        const token = typeof activeUser.getIdToken === "function"
          ? await activeUser.getIdToken()
          : "";
        return {
          ...(token ? { Authorization: "Bearer " + token } : {}),
          "X-Kartochka-User-Id": activeUser.uid || "",
          "X-Kartochka-User-Email": activeUser.email || "",
        };
      } catch (error) {
        return {
          "X-Kartochka-User-Id": activeUser.uid || "",
          "X-Kartochka-User-Email": activeUser.email || "",
        };
      }
    },
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
    return isCreateDirectPromptTemplate(selectedTemplate)
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
      createBestModelSelect.closest(".create-best-model-control")?.classList.toggle("hidden", !isInstructionTemplate);
      createBestModelSelect.value = createBestModelTier;
      createBestModelSelect.toggleAttribute("disabled", !isInstructionTemplate || createIsGenerating || createAiPromptPhase === "loading" || createAutofillPhase === "loading");
    }
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
    if (!activeUser || !serviceClient?.billingSummary) {
      billingSummary = null;
      renderBillingSummary();
      return null;
    }

    billingSummaryLoading = true;
    syncBillingHeader();

    try {
      billingSummary = await serviceClient.billingSummary({});
      renderBillingSummary();
      return billingSummary;
    } catch (error) {
      billingSummary = null;
      renderBillingSummary();
      setBillingPromoStatus("", "");
      return null;
    } finally {
      billingSummaryLoading = false;
      syncBillingHeader();
      dispatchBillingUpdate();
    }
  };

  const openBillingModal = () => {
    if (!billingModal) return;
    billingModal.classList.remove("hidden");
    billingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("billing-open");
    billingModalOpen = true;
  };

  const closeBillingModal = () => {
    if (!billingModal) return;
    billingModal.classList.add("hidden");
    billingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("billing-open");
    billingModalOpen = false;
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
    closeCreateReferenceLibrary();
    closeCreateImageManagerModal();
    closeBillingModal();

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

  const buildHistoryImageSnapshot = async (sourceUrl) => {
    const safeUrl = String(sourceUrl || "").trim();
    if (!safeUrl) return "";
    if (!/^data:image\//i.test(safeUrl) && !/^blob:/i.test(safeUrl)) return safeUrl;

    try {
      const image = await loadImageElement(safeUrl);
      const width = Number(image.naturalWidth || image.width || 0);
      const height = Number(image.naturalHeight || image.height || 0);
      if (!width || !height) return safeUrl;

      const scale = Math.min(1, HISTORY_IMAGE_MAX_DIMENSION / Math.max(width, height));
      const targetWidth = Math.max(1, Math.round(width * scale));
      const targetHeight = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext("2d");
      if (!context) return safeUrl;
      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      return canvas.toDataURL("image/jpeg", HISTORY_IMAGE_JPEG_QUALITY);
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

  const buildCreateImageDataUrls = async () => {
    const urls = await Promise.all(createSelectedFiles.map((file) => getCreateFileDataUrl(file)));
    const prepared = urls.filter(Boolean);
    if (createSelectedFiles.length > 0 && prepared.length !== createSelectedFiles.length) {
      throw new Error("Не удалось подготовить одно или несколько фото для AI. Оставьте PNG, JPG или WEBP и попробуйте другое изображение.");
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
    return [CREATE_BEST_INSTRUCTION_TEMPLATE, CREATE_DIRECT_PROMPT_TEMPLATE];
  };

  const getCreateSelectedTemplate = () => {
    const library = getCreateTemplateLibrary();
    return library.find((item) => item.id === createSelectedTemplateId) || library[0] || null;
  };

  const isCreateDirectPromptTemplate = (template) => {
    return toText(template?.kind) === "custom-prompt";
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
    if (template?.kind === "instruction-template") return "Адаптивный";
    if (template?.kind === "preset") return "Пресет";
    if (template?.tab === "reference") return "Референс";
    if (template?.tab === "promo") return "Промо";
    if (template?.tab === "clean") return "Чистый";
    return "Шаблон";
  };

  const getCreateTemplatePlaceholderText = (template) => {
    if (template?.kind === "custom-prompt") return "PROMPT";
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
    const levels = getCreateCardTextLevels();

    return [
      normalizeCreateCardTextLine(levels.primary),
      normalizeCreateCardTextLine(levels.secondary),
      normalizeCreateCardTextLine(levels.tertiary),
    ].filter(Boolean).join("\n");
  };

  const buildCreateContentCardText = () => {
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

  const buildCreateTemplateSummary = () => {
    const template = getCreateSelectedTemplate();
    if (!template) return "";
    return "Шаблон: " + template.title + ". " + template.description;
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
    const isInstructionTemplate = isCreateInstructionTemplate(template);
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
        : isInstructionTemplate
          ? "Сейчас выбран шаблон «Лучший»"
          : (template?.sourceUrl || template?.title || "Открыть библиотеку шаблонов");
      createSelectedTemplateCard.classList.toggle("hidden", isDirectPrompt);
      createSelectedTemplateCard.classList.remove("is-text-only");
      createSelectedTemplateCard.classList.toggle("is-with-parameters", isInstructionTemplate);
    }
    createInstructionTemplatePanel?.classList.toggle("hidden", !isInstructionTemplate);
    if (!isInstructionTemplate) {
      createGenerationNotesExpanded = false;
    } else if (buildCreateGenerationNotesValue()) {
      createGenerationNotesExpanded = true;
    }
    syncCreateGenerationNotesState();
    createCustomPromptPanel?.classList.toggle("hidden", !isDirectPrompt);
    syncCreateInstructionState();
    syncCreateBestModelState();
    syncCreateGenerationNotesState();
  };

  const syncCreateOverlayScrollLock = () => {
    document.documentElement.style.overflow = createReferenceLibraryOpen || createImageManagerOpen ? "hidden" : "";
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

  const renderCreateTemplateLibrary = () => {
    renderCreateSelectedTemplateSummary();
    if (!createTemplateGrid) return;

    createTemplateGrid.textContent = "";
    createTemplateTabButtons.forEach((button) => {
      button.classList.toggle("active", normalizeCreateTemplateTab(button.dataset.createTemplateTab) === createActiveTemplateTab);
    });

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
    return createGeneratedResults.find((item) => item.id === createActivePreviewResultId) || createGeneratedResults[0] || null;
  };

  const renderCreatePreviewPanel = () => {
    const activeResult = getActiveCreateResult();
    const selectedTemplate = getCreateSelectedTemplate();
    const isDirectPrompt = isCreateDirectPromptTemplate(selectedTemplate);
    const hasPhoto = createSelectedFiles.length > 0;
    const uploadUrl = createSelectedFiles[0] ? getCreateFilePreviewUrl(createSelectedFiles[0]) : "";
    const previewUrl = activeResult?.previewUrl || selectedTemplate?.previewUrl || uploadUrl;
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
    }

    createPreviewImage?.classList.toggle("hidden", !previewUrl);
    createPreviewEmpty?.classList.toggle("hidden", Boolean(previewUrl));

    if (createPreviewImage) {
      if (previewUrl) {
        createPreviewImage.src = previewUrl;
      } else {
        createPreviewImage.removeAttribute("src");
      }
    }

    if (!previewUrl) {
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

  const clearCreateResultsData = () => {
    createGeneratedResults = [];
    createResultExpandedId = "";
    createActivePreviewResultId = "";
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
    if (createSelectedFiles.length < 1) return "Добавьте минимум 1 фото товара";
    if (createSelectedFiles.length > CREATE_UPLOAD_MAX_FILES) {
      return "Допустимо максимум " + String(CREATE_UPLOAD_MAX_FILES) + " фото";
    }
    if (createPromptMode === "custom" && (createCustomPrompt?.value || "").trim().length < 12) {
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
    syncCreatePromptMode(isCreateDirectPromptTemplate(nextTemplate) ? "custom" : "ai");
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

    if (createInsightDetails && (isLoading || (isError && !hasInsight))) {
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
      createInsightPhase = "error";
      const message = error instanceof Error ? error.message : "Не удалось собрать insight.";
      setStatusMessage(createInsightStatus, message, "error");
      setRequestMeta(createMeta, "Статус запроса:", "Ошибка AI-анализа");
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
    const controlsLocked = isLoading || createIsGenerating || createInsightPhase === "loading";
    const canAcceptPrompt = promptValue.length >= CREATE_AI_PROMPT_MIN_ACCEPT_LEN;
    const showEditor = isLoading || hasPrompt;

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

    if (createPromptAssistDetails && (isLoading || hasPrompt || createAiPromptPhase === "error")) {
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
        createAiPromptPhase = "error";
        setStatusMessage(createAiPromptStatus, "Не удалось обновить insight.", "error");
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
      createAiPromptPhase = "error";
      if (createAiPromptOutput && !createAiPromptOutput.value.trim()) {
        createAiPromptOutput.placeholder = "Здесь появится промпт.";
      }
      const message = error instanceof Error ? error.message : "Не удалось собрать промпт.";
      setStatusMessage(createAiPromptStatus, message, "error");
      setRequestMeta(createMeta, "Статус запроса:", "Ошибка AI-промпта");
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
      createAutofillPhase = "error";
      const message = error instanceof Error ? error.message : "Не удалось выполнить AI автозаполнение.";
      setStatusMessage(createStatus, message, "error");
      setRequestMeta(createMeta, "Статус запроса:", "Ошибка AI автозаполнения");
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
        createGeneratedResults.length ? "Перегенерировать" : "Сгенерировать карточку",
        createGenerateActionCode
      );
      createGenerateBtn.toggleAttribute("disabled", isDisabled);
      createGenerateBtn.classList.toggle("is-loading", createIsGenerating);
    }

    if (createAutofillBtn) {
      setButtonCostLabel(createAutofillBtn, "Автозаполнить AI", "create_autofill");
      createAutofillBtn.toggleAttribute("disabled", controlsLocked || Boolean(autofillInputError) || createAutofillTokenLocked);
      createAutofillBtn.classList.toggle("is-loading", createAutofillPhase === "loading");
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
    if (createMarketplace) createMarketplace.toggleAttribute("disabled", controlsLocked);
    if (createCardsCount) createCardsCount.toggleAttribute("disabled", controlsLocked);
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
      } else if (createPromptMode === "custom" && customPromptValue.length < 12) {
        createCtaHint.textContent = "Шаг 3: введите свой промт.";
      } else if (validationError) {
        createCtaHint.textContent = validationError;
      } else if (createGeneratedResults.length) {
        createCtaHint.textContent = "Готово. Можно экспортировать карточку или запустить новую генерацию.";
      } else if (createPromptMode === "custom") {
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
    if (createAiPromptPhase === "error" && !(createAiPromptOutput?.value || "").trim()) {
      createAiPromptPhase = "empty";
    }
    if (createInsightPhase === "error" && !createInsightData) {
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

  const serializeHistoryEntry = (entry) => {
    return {
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
    };
  };

  const persistHistory = async (options) => {
    const serializable = historyEntries.map((entry) => serializeHistoryEntry(entry));
    const persistMode = String(options?.mode || "replace").trim().toLowerCase();
    const scopeId = getHistoryScopeId(activeUser);
    const singleEntry = options?.entry ? serializeHistoryEntry(options.entry) : null;

    if (serviceClient?.historySave) {
      try {
        if (persistMode === "clear") {
          await serviceClient.historySave({
            scopeId,
            clear: true,
          });
        } else if (persistMode === "entry" && singleEntry) {
          await serviceClient.historySave({
            scopeId,
            entry: singleEntry,
          });
        } else {
          await serviceClient.historySave({
            scopeId,
            entries: serializable,
          });
        }
        return;
      } catch (error) {
        // Fallback to legacy localStorage persistence when service storage fails.
      }
    }

    if (typeof window === "undefined" || !window.localStorage) return;

    try {
      if (!serializable.length) {
        window.localStorage.removeItem(getHistoryStorageKey(activeUser));
        return;
      }

      let entriesToStore = serializable.slice();
      let stored = false;

      while (!stored && entriesToStore.length > 0) {
        try {
          window.localStorage.setItem(getHistoryStorageKey(activeUser), JSON.stringify(entriesToStore));
          stored = true;
        } catch (error) {
          entriesToStore = entriesToStore.slice(0, entriesToStore.length - 1);
        }
      }
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
    await persistHistory({ mode: "clear" });
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
          { label: "Стиль референса", value: entry.input.referenceStyle ? "Включен" : "Не включен" },
          { label: "Комментарий", value: entry.input.improvePrompt || "Не указан" },
        ]
      : [
          { label: "Маркетплейс", value: entry.input.marketplace || "Не указан" },
          { label: "Количество карточек", value: String(entry.input.cardsCount || entry.resultsCount || 1) },
          { label: "Режим промпта", value: entry.input.promptMode === "custom" ? "Свой промпт" : "AI-промпт" },
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

  const closeHistoryPreviewModal = () => {
    historyPreviewVisible = false;
    selectedHistoryPreviewEntryId = "";
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

  const openHistoryPreviewModal = (entryId) => {
    const entry = getHistoryEntryById(entryId);
    if (!entry || !historyPreviewModal) return;

    const previewUrl = sanitizeHistoryPreviewUrl(entry.previewUrl, entry.mode);
    selectedHistoryPreviewEntryId = entry.id;
    historyPreviewVisible = true;

    if (historyPreviewTitle) historyPreviewTitle.textContent = entry.title || "Превью";
    if (historyPreviewMeta) {
      historyPreviewMeta.textContent =
        formatHistoryDate(entry.createdAt) +
        " • " +
        String(entry.resultsCount || 1) +
        " " +
        formatCardsWord(entry.resultsCount || 1);
    }
    if (historyPreviewImage) {
      historyPreviewImage.src = previewUrl;
    }
    if (historyPreviewExportBtn) {
      historyPreviewExportBtn.href = previewUrl;
      historyPreviewExportBtn.setAttribute("download", buildHistoryExportName(entry));
    }

    historyPreviewModal.classList.remove("hidden");
    historyPreviewModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("history-preview-open");
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

      const previewWrap = document.createElement("button");
      previewWrap.type = "button";
      previewWrap.className = "history-mode-item-preview";
      previewWrap.dataset.historyPreviewId = entry.id;

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

      item.append(previewWrap, title, meta);
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
    void persistHistory({
      mode: "entry",
      entry: normalizedEntry,
    });
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

    const normalizedResults = await Promise.all((Array.isArray(results) ? results : [])
      .slice(0, CREATE_UPLOAD_MAX_FILES)
      .map(async (result, index) => {
        const rawPreview = String(result.previewUrl || "").trim();
        const previewSource = previewLookup.get(rawPreview) || sanitizeHistoryPreviewUrl(rawPreview, "create");
        const resolvedPreview = await buildHistoryImageSnapshot(previewSource);
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
        generationNotes: String(payload?.generationNotes || buildCreateGenerationNotesValue() || "").trim(),
        mainText: getCreateProductTitleValue(),
        secondaryText: getCreateProductShortDescriptionValue(),
        tertiaryText: getCreateProductThirdLevelTextValue(),
        marketplace: String(payload?.marketplace || "").trim(),
        cardsCount: Number(payload?.cardsCount || normalizedResults.length || 1),
        promptMode: String(payload?.promptMode || createPromptMode || "ai"),
        selectedTemplateId: String(payload?.selectedTemplate?.id || createSelectedTemplateId || ""),
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
        const compactPreview = await buildHistoryImageSnapshot(sanitizeHistoryPreviewUrl(result.previewUrl, "improve"));
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
    createResultExpandedId = "";
    createActivePreviewResultId = "";
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

  const formatRussianCountWord = (count, one, few, many) => {
    const normalized = Math.abs(Number(count) || 0) % 100;
    const lastDigit = normalized % 10;
    if (normalized > 10 && normalized < 20) return many;
    if (lastDigit > 1 && lastDigit < 5) return few;
    if (lastDigit === 1) return one;
    return many;
  };

  const buildHistoryExportName = (entry) => {
    const safeName = String(entry?.title || "history-preview")
      .trim()
      .replace(/[^\w\u0400-\u04FF-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-+|-+$/g, "");
    return (safeName || "history-preview") + ".png";
  };

  const setCreateResultsProcessing = (isProcessing) => {
    if (!createResultsSection || !createResultsProcessing || !createResultsGrid) return;
    createResultsSection.classList.remove("hidden");
    createResultsProcessing.classList.toggle("hidden", !isProcessing);
    createResultsGrid.classList.toggle("hidden", isProcessing);
  };

  const resolveCreatePromptForGeneration = () => {
    syncCreateLegacyFields();
    const selectedTemplate = getCreateSelectedTemplate();
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
    const imageDataUrls = await buildCreateImageDataUrls();
    const selectedTemplate = getCreateSelectedTemplate();
    const referencePreviewUrl = await getCreateTemplateReferencePreviewUrl(selectedTemplate);
    const title = getCreateProductTitleValue();
    const shortDescription = getCreateProductShortDescriptionValue();
    const characteristics = getCreateCharacteristicRows();
    const settings = buildCreateSettingsPayload();
    const serializedTemplate = serializeCreateTemplate(selectedTemplate);

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
      generationMode: isCreateDirectPromptTemplate(selectedTemplate) ? "custom" : normalizeCreateTemplateTab(createActiveTemplateTab),
      densityMode: settings.infoDensity || CREATE_USEFUL_SETTINGS_DEFAULTS.infoDensity,
      productCategory: hasInsight && !insightIsStale ? createInsightData?.category || "" : "",
      userNotes: createPromptMode === "custom" ? (createCustomPrompt?.value || "").trim() : "",
      aiModelTier: getCreateBestModelOption().id,
      openAiModel: getCreateBestModelOption().openAiModel,
      openAiReasoningEffort: getCreateBestModelOption().reasoningEffort,
      settings,
      selectedTemplate: serializedTemplate,
      reference: serializedTemplate,
      referencePreviewUrl,
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
    if (!createResultsGrid || !createResultsCaption || !createResultsSection) {
      renderCreatePreviewPanel();
      return;
    }

    createResultsGrid.textContent = "";
    const totalResults = createGeneratedResults.length;

    if (!totalResults) {
      createResultsCaption.textContent = "После генерации здесь появятся варианты карточек.";
      createResultsSection.classList.add("hidden");
      renderCreatePreviewPanel();
      return;
    }

    if (!createGeneratedResults.some((item) => item.id === createActivePreviewResultId)) {
      createActivePreviewResultId = createGeneratedResults[0]?.id || "";
    }

    const marketplace = createMarketplace?.value || "маркетплейс";
    createResultsCaption.textContent =
      "Сгенерировано " + String(totalResults) + " " + formatCardsWord(totalResults) + " для " + marketplace + ".";
    const selectedTemplateTitle = getCreateSelectedTemplate()?.title || "Шаблон";

    createGeneratedResults.forEach((result) => {
      const card = document.createElement("article");
      card.className = "create-result-card create-result-card-compact";
      card.classList.toggle("is-active", result.id === createActivePreviewResultId);
      card.dataset.resultPreviewId = result.id;

      const media = document.createElement("div");
      media.className = "create-result-media";

      const image = document.createElement("img");
      image.src = result.previewUrl;
      image.alt = result.title;
      image.loading = "lazy";
      media.append(image);

      const body = document.createElement("div");
      body.className = "create-result-body";

      const title = document.createElement("h4");
      title.textContent = selectedTemplateTitle;

      body.append(title);
      card.append(media, body);
      createResultsGrid.append(card);
    });

    createResultsSection.classList.remove("hidden");
    renderCreatePreviewPanel();
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
      payload.requestId = buildClientRequestId("improve-analyze", requestId);
      const analysis = await requestImproveAnalysis(payload);
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
    const previewPool = IMPROVE_RESULT_FALLBACK_PREVIEWS;
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

    createActivePreviewResultId = resultId;
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

  createSelectedTemplateCard?.addEventListener("click", () => {
    openCreateReferenceLibrary();
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
    }
  });

  createImproveBtn?.addEventListener("click", () => {
    const activeResult = getActiveCreateResult();
    openImproveFromCreateResult(activeResult);
  });

  createBestModelSelect?.addEventListener("change", () => {
    const nextTier = toText(createBestModelSelect.value);
    if (!CREATE_BEST_MODEL_OPTIONS[nextTier] || nextTier === createBestModelTier) return;
    createBestModelTier = nextTier;
    syncCreateBestModelState();
    syncCreateFormState();
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
    createActivePreviewResultId = "";
    setCreateResultsProcessing(true);
    setDoneState(createDoneBadge, false);
    setStatusMessage(createStatus, "Анализируем ваш товар...", "");
    setRequestMeta(createMeta, "Статус запроса:", "Анализируем ваш товар");
    if (createResultsCaption) {
      createResultsCaption.textContent = "AI подготавливает варианты карточек...";
    }
    if (createResultsGrid) {
      createResultsGrid.textContent = "";
    }
    syncCreateFormState();

    try {
      const selectedTemplate = getCreateSelectedTemplate();
      const isDirectPromptTemplate = isCreateDirectPromptTemplate(selectedTemplate);
      const usesInstructionPromptFlow = usesCreateInstructionPromptFlow(selectedTemplate);

      if (usesInstructionPromptFlow) {
        createAiPromptPhase = "loading";
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
            throw new Error("Не удалось получить AI-анализ для генерации карточек.");
          }
        }
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
      const results = await requestCreateGeneration(payload);
      if (requestId !== createGenerationRequestId) return;

      createGeneratedResults = Array.isArray(results) ? results : [];
      createActivePreviewResultId = createGeneratedResults[0]?.id || "";
      setCreateResultsProcessing(false);
      renderCreateResults();

      if (!createGeneratedResults.length) {
        throw new Error("Генерация вернула пустой результат.");
      }

      const total = createGeneratedResults.length;
      setDoneState(createDoneBadge, true);
      setStatusMessage(createStatus, "Готово. Сгенерировано " + String(total) + " " + formatCardsWord(total) + ".", "success");
      setRequestMeta(createMeta, "Статус запроса:", "Готово: " + String(total) + " " + formatCardsWord(total));

      const marketplace = createMarketplace?.value || "Маркетплейс";
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
    } catch (error) {
      if (requestId !== createGenerationRequestId) return;
      createGeneratedResults = [];
      createActivePreviewResultId = "";
      createAiPromptPhase = createAiPromptPhase === "loading" ? "error" : createAiPromptPhase;
      setCreateResultsProcessing(false);
      renderCreateResults();
      setDoneState(createDoneBadge, false);
      const message = error instanceof Error ? error.message : "Ошибка генерации карточек. Повторите попытку.";
      setStatusMessage(createStatus, message, "error");
      setRequestMeta(createMeta, "Статус запроса:", message);
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
    createUploadDragDepth = 0;
    improvePrimaryDragDepth = 0;
    improveReferenceDragDepth = 0;
    createUploadZone?.classList.remove("is-dragover");
    improvePrimaryUploadZone?.classList.remove("is-dragover");
    improveReferenceUploadZone?.classList.remove("is-dragover");
  });

  window.addEventListener("drop", () => {
    createUploadDragDepth = 0;
    improvePrimaryDragDepth = 0;
    improveReferenceDragDepth = 0;
    createUploadZone?.classList.remove("is-dragover");
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

      const historyPayload = await buildImproveHistoryPayload(payload, improveGeneratedResults);
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
    const previewButton = target.closest("[data-history-preview-id]");
    if (!(previewButton instanceof HTMLElement)) return;
    const entryId = previewButton.dataset.historyPreviewId || "";
    openHistoryPreviewModal(entryId);
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

  void refreshHistory();
  void refreshBillingSummary();
  window.addEventListener("hashchange", handleAppHashRoute);
  window.addEventListener("kartochka:billing:refresh", () => {
    if (activeUser) {
      void refreshBillingSummary();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCreateReferenceLibrary();
      closeCreateImageManagerModal();
      closeBillingModal();
      closeHistoryDetailsModal();
      closeHistoryPreviewModal();
      closeMobileMenu();
      closeAuthModal();
    }
  });

  billingOpenBtn?.addEventListener("click", async () => {
    if (!activeUser) {
      openAuthModal();
      return;
    }
    openBillingModal();
    if (!billingSummary) {
      await refreshBillingSummary();
    }
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

    billingPromoLoading = true;
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
      billingPromoLoading = false;
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
      await refreshBillingSummary();
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
      void refreshBillingSummary();
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
      await refreshBillingSummary();

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
    void refreshBillingSummary();
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
