(function () {
  const stage = document.getElementById("enhanceCardStage");
  const toast = document.getElementById("enhanceCardToast");
  const promptInput = document.getElementById("enhanceCardPrompt");
  const preserveTextToggle = document.getElementById("enhanceCardPreserveTextToggle");

  if (!stage || !toast) return;

  const serviceModule = window.KARTOCHKA_ENHANCE_CARD_SERVICE;
  const stateModule = window.KARTOCHKA_ENHANCE_CARD_STATE;

  if (!serviceModule || !stateModule) {
    console.error("[kartochka][enhance-card] Required enhance-card modules are not loaded");
    return;
  }

  const {
    REQUEST_TIMEOUT_MS,
    createEnhanceCardApi,
    createFileSource,
    createLogger,
    createRemoteSource,
    createRequestId,
    isAbortError,
    validateImageFile,
  } = serviceModule;
  const { useEnhanceCardState } = stateModule;

  const BILLING_ACTION_CODE = "enhance_card";
  const logger = createLogger({ scope: "enhance-card-ui" });
  const store = useEnhanceCardState({ logger });
  const api = createEnhanceCardApi({
    endpoint: "/api/enhance-card",
    logger,
    getAuthHeaders: async () => {
      return window.KARTOCHKA_AUTH_SESSION?.getHeaders
        ? window.KARTOCHKA_AUTH_SESSION.getHeaders()
        : {};
    },
  });

  let toastTimerId = 0;
  let imageManagerOpen = false;

  const toText = (value) => String(value || "").trim();

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  };

  const clearToast = () => {
    if (toastTimerId) {
      window.clearTimeout(toastTimerId);
      toastTimerId = 0;
    }
    toast.classList.remove("is-visible");
  };

  const showToast = (message) => {
    clearToast();
    toast.textContent = toText(message);
    if (!toast.textContent) return;
    toast.classList.add("is-visible");
    toastTimerId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      toastTimerId = 0;
    }, 3200);
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

  const getBillingState = () => window.KARTOCHKA_BILLING_STATE || {};

  const getActionCost = () => {
    const actions = Array.isArray(getBillingState()?.catalog?.actions) ? getBillingState().catalog.actions : [];
    const action = actions.find((item) => toText(item?.code) === BILLING_ACTION_CODE);
    return Number(action?.tokens) || 0;
  };

  const hasEnoughTokens = () => {
    const cost = getActionCost();
    if (!cost || !getBillingState()?.summary) return true;
    const balance = Number(getBillingState()?.summary?.account?.balanceTokens) || 0;
    return balance >= cost;
  };

  const buildDownloadName = (fileName, resultUrl) => {
    const safeBaseName = String(fileName || "product-card")
      .trim()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^\w\u0400-\u04FF-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-+|-+$/g, "");

    const mimeMatch = String(resultUrl || "").match(/^data:image\/([a-z0-9+.-]+);/i);
    const extension = mimeMatch?.[1]?.replace("jpeg", "jpg") || "jpg";
    return (safeBaseName || "product-card") + "-enhanced." + extension;
  };

  const resolveHumanError = (error, timedOut) => {
    if (timedOut) {
      return "Запрос занял слишком много времени. Исходник и настройки сохранены: повторите с теми же параметрами или загрузите другую карточку.";
    }

    if (isAbortError(error)) {
      return "Запрос был остановлен. Можно сразу повторить попытку.";
    }

    const message = toText(error?.message);
    return message || "Не удалось улучшить карточку. Попробуйте ещё раз.";
  };

  const getTextMode = () => {
    return Boolean(preserveTextToggle?.checked) ? "preserve" : "rewrite";
  };

  const setTextMode = (mode) => {
    if (!preserveTextToggle) return;
    const nextMode = mode === "rewrite" ? "rewrite" : "preserve";
    preserveTextToggle.checked = nextMode === "preserve";
    logger.info("text_mode_changed", { mode: nextMode });
    render(store.getState());
  };

  const getStatusDescriptor = (state) => {
    switch (state.status) {
      case "file_selected":
        if (!hasEnoughTokens() && getBillingState()?.summary) {
          return {
            tone: "warning",
            title: "Недостаточно токенов",
            text: "Пополните баланс или выберите другой сценарий. Сайт остаётся доступным, загрузка не потеряна.",
          };
        }
        return {
          tone: "ready",
          title: "",
          text: "",
        };
      case "submitting":
        return {
          tone: "processing",
          title: "Подготавливаем изображение",
          text: "Бережно готовим исходник к отправке, не перегружая интерфейс тяжёлыми операциями.",
        };
      case "processing":
        return {
          tone: "processing",
          title: "AI обрабатывает карточку",
          text: "AI пересобирает композицию, акценты и подачу в более сильную 3:4 карточку. Интерфейс остаётся свободным.",
        };
      case "success":
        return {
          tone: "success",
          title: "Улучшение готово",
          text: "Результат готов. Можно скачать файл, сделать вариант 2 или загрузить другую карточку.",
        };
      case "error":
        return {
          tone: "error",
          title: "Ошибка улучшения",
          text: state.errorMessage || "Сервис не вернул итог. Исходник и настройки сохранены: повторите с теми же параметрами или смените карточку.",
        };
      case "timeout":
        return {
          tone: "timeout",
          title: "Сработал timeout",
          text: state.errorMessage || "Ответ сервера пришёл слишком поздно. Можно повторить запрос с теми же настройками или загрузить другую карточку.",
        };
      case "idle":
      default:
        return {
          tone: "neutral",
          title: "",
          text: "",
        };
    }
  };

  const openFilePicker = () => {
    const input = stage.querySelector("#enhanceCardInput");
    input?.click();
  };

  const handleFileSelection = (file) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      showToast(validationError);
      return;
    }

    const source = createFileSource(file);
    store.setSource(source, { event: "file_selected" });
  };

  const submitCurrentSource = async (options) => {
    const currentState = store.getState();
    if (!currentState.source || currentState.isBusy) return;

    if (!hasEnoughTokens() && getBillingState()?.summary) {
      showToast("Недостаточно токенов для улучшения карточки.");
      return;
    }

    const request = store.beginSubmission({ event: options?.retry ? "retry_started" : "submit_started" });
    if (!request) return;

    const requestId = createRequestId();
    const textMode = getTextMode();
    const userPrompt = toText(promptInput?.value);
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      logger.warn("request_timeout", {
        requestId,
        requestToken: request.requestToken,
        timeoutMs: REQUEST_TIMEOUT_MS,
      });
      request.controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      logger.info("request_started", {
        requestId,
        requestToken: request.requestToken,
        textMode,
        hasUserPrompt: Boolean(userPrompt),
        isRetry: Boolean(options?.retry),
      });

      const result = await api.submitEnhancement({
        requestId,
        source: request.source,
        userPrompt,
        preserveSourceTextExactly: textMode === "preserve",
        signal: request.controller.signal,
        onProcessing() {
          store.markProcessing(request.requestToken, { event: "request_sent" });
        },
      });

      if (!store.isCurrentRequest(request.requestToken)) return;

      logger.info("request_success", {
        requestId,
        requestToken: request.requestToken,
        textMode,
        hasResult: Boolean(result.imageDataUrl),
      });

      store.resolveSuccess(request.requestToken, {
        resultUrl: result.imageDataUrl,
      }, { event: "request_success" });

      try {
        await window.KARTOCHKA_HISTORY?.recordDetachedImproveResult?.({
          title: "1 карточка - Улучшение",
          sourcePreviewUrl: request.source?.previewUrl,
          sourceName: request.source?.name || "source-card.png",
          resultPreviewUrl: result.imageDataUrl,
          prompt: userPrompt,
          userPrompt,
          mode: "ai",
          resultSummary: textMode === "preserve"
            ? "Улучшение с сохранением исходного текста 1 в 1"
            : "Улучшение с возможностью переработать текст карточки",
        });
      } catch (historyError) {
        logger.warn("history_record_failed", {
          requestId,
          requestToken: request.requestToken,
          errorName: toText(historyError?.name),
          errorMessage: toText(historyError?.message) || "history_record_failed",
        });
      }

      window.dispatchEvent(new CustomEvent("kartochka:billing:refresh"));
    } catch (error) {
      if (!store.isCurrentRequest(request.requestToken)) return;

      const message = resolveHumanError(error, timedOut);
      logger.warn("request_failed", {
        requestId,
        requestToken: request.requestToken,
        textMode,
        timedOut,
        errorName: toText(error?.name),
        errorMessage: message,
      });
      store.resolveFailure(request.requestToken, message, {
        event: timedOut ? "request_timeout" : "request_error",
        timedOut,
      });

      window.dispatchEvent(new CustomEvent("kartochka:billing:refresh"));
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const downloadResult = () => {
    const state = store.getState();
    const resultUrl = toText(state.resultUrl);
    if (!resultUrl) return;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = buildDownloadName(state.source?.name, resultUrl);
    document.body.append(link);
    link.click();
    link.remove();
  };

  const buildPreviewImage = (sourceUrl, altText) => {
    const image = createElement("img", "enhance-card-v2-image");
    image.src = sourceUrl;
    image.alt = altText;
    return image;
  };

  const buildAnalysisVisual = (state) => {
    const panel = createElement("div", "enhance-card-v2-analysis");
    const stageVisual = createElement("div", "enhance-card-v2-analysis-stage");
    const frame = createElement("div", "enhance-card-v2-analysis-frame");
    const product = createElement("div", "enhance-card-v2-analysis-product");
    const productGlow = createElement("div", "enhance-card-v2-analysis-glow");
    const beam = createElement("div", "enhance-card-v2-analysis-beam");
    const grid = createElement("div", "enhance-card-v2-analysis-grid");
    const chips = createElement("div", "enhance-card-v2-analysis-chips");

    ["Фокус", "Текст", "Композиция"].forEach((labelText, index) => {
      const chip = createElement("span", "enhance-card-v2-analysis-chip", labelText);
      if (state.status === "processing" && index === 1) {
        chip.classList.add("is-active");
      }
      chips.append(chip);
    });

    const metrics = createElement("div", "enhance-card-v2-analysis-metrics");
    ["Товар", "Иерархия", "Оффер"].forEach((labelText, index) => {
      const row = createElement("div", "enhance-card-v2-analysis-metric");
      const label = createElement("span", "", labelText);
      const track = createElement("div", "enhance-card-v2-analysis-track");
      const bar = createElement("span", "enhance-card-v2-analysis-bar");
      bar.style.setProperty("--analysis-bar-scale", String(0.58 + index * 0.14));
      track.append(bar);
      row.append(label, track);
      metrics.append(row);
    });

    frame.append(productGlow, product, beam, grid, chips);
    stageVisual.append(frame, metrics);

    const steps = createElement("div", "enhance-card-v2-analysis-steps");
    [
      {
        title: "Подготовка",
        text: "Нормализуем исходник и держим интерфейс свободным.",
        active: state.status === "submitting",
        done: state.status === "processing",
      },
      {
        title: "Анализ",
        text: "Оцениваем композицию, читаемость и коммерческий потенциал.",
        active: state.status === "processing",
        done: false,
      },
      {
        title: "Сборка 3:4",
        text: "Финальный кадр идёт в вертикальном формате карточки.",
        active: state.status === "processing",
        done: false,
      },
    ].forEach((stepDefinition) => {
      const step = createElement("div", "enhance-card-v2-analysis-step");
      if (stepDefinition.active) step.classList.add("is-active");
      if (stepDefinition.done) step.classList.add("is-done");
      step.append(
        createElement("strong", "", stepDefinition.title),
        createElement("p", "", stepDefinition.text)
      );
      steps.append(step);
    });

    panel.append(stageVisual, steps);
    return panel;
  };

  const buildSourceCard = (state) => {
    const sourceUrl = toText(state.source?.previewUrl);
    const panel = createElement("section", "create-form-card create-source-card enhance-card-v2-source-card");
    const header = createElement("div", "create-card-head");
    header.append(
      createElement("h3", "", "Исходная карточка"),
      createElement("span", "", sourceUrl ? "1 / 1 фото" : "0 / 1 фото")
    );

    const uploadButton = createElement(
      "button",
      "create-upload-dropzone create-upload-dropzone-hero enhance-card-v2-source-dropzone",
      ""
    );
    uploadButton.type = "button";
    uploadButton.dataset.action = "open-manager";
    uploadButton.setAttribute("aria-haspopup", "dialog");
    if (sourceUrl) uploadButton.classList.add("is-filled");
    if (state.isBusy) uploadButton.disabled = true;

    const stageNode = createElement("span", "create-upload-stage");
    const frame = createElement("span", "create-upload-preview-frame");
    const icon = createElement("span", "create-upload-dropzone-icon");
    icon.setAttribute("aria-hidden", "true");
    const image = buildPreviewImage(sourceUrl || "", "Превью исходной карточки");

    image.classList.toggle("hidden", !sourceUrl);

    if (sourceUrl) {
      frame.classList.add("is-filled");
    }

    frame.append(icon, image);

    const copy = createElement("span", "create-upload-copy");
    copy.append(
      createElement("strong", "", sourceUrl ? "Заменить карточку" : "Добавить карточку"),
      createElement("small", "", "PNG, JPG, WEBP")
    );
    stageNode.append(frame, copy);
    uploadButton.append(stageNode);

    panel.append(header, uploadButton);

    return panel;
  };

  const buildSourceManagerModal = (state) => {
    const sourceUrl = toText(state.source?.previewUrl);
    const modal = createElement(
      "div",
      "create-reference-modal create-image-manager-modal enhance-card-v2-image-manager-modal"
        + (imageManagerOpen ? " is-open" : " hidden")
    );
    modal.setAttribute("aria-hidden", imageManagerOpen ? "false" : "true");

    const backdrop = createElement("div", "create-reference-modal-backdrop");
    backdrop.dataset.action = "close-manager";

    const dialog = createElement(
      "div",
      "create-reference-modal-dialog create-image-manager-dialog enhance-card-v2-image-manager-dialog"
    );
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "enhanceCardImageManagerTitle");

    const head = createElement("div", "create-reference-modal-head");
    const headCopy = createElement("div", "");
    const title = createElement("h3", "", "Карточка для улучшения");
    title.id = "enhanceCardImageManagerTitle";
    headCopy.append(title);
    const counter = createElement("span", "", sourceUrl ? "1 / 1 фото • карточка готова к улучшению" : "0 / 1 фото • загрузите исходную карточку");
    headCopy.append(counter);

    const closeBtn = createElement("button", "create-reference-modal-close", "×");
    closeBtn.type = "button";
    closeBtn.dataset.action = "close-manager";
    closeBtn.setAttribute("aria-label", "Закрыть менеджер изображения");
    head.append(headCopy, closeBtn);

    const body = createElement("div", "create-reference-modal-body");
    const toolbar = createElement("div", "create-image-manager-toolbar");
    const addBtn = createElement("button", "btn btn-primary", "Добавить изображение");
    addBtn.type = "button";
    addBtn.dataset.action = "pick-file";
    addBtn.disabled = Boolean(state.isBusy);
    const note = createElement("p", "", "PNG, JPG и WEBP. Используется одна карточка 3:4.");
    toolbar.append(addBtn, note);

    const empty = createElement("p", "create-upload-empty", "Добавьте 1 карточку товара для улучшения.");
    empty.classList.toggle("hidden", Boolean(sourceUrl));

    const list = createElement("div", "create-upload-list create-image-manager-list");
    if (sourceUrl) {
      const item = createElement("article", "create-upload-item");
      const thumb = buildPreviewImage(sourceUrl, state.source?.name || "Исходная карточка");
      thumb.classList.add("create-upload-thumb");

      const meta = createElement("div", "create-upload-meta");
      meta.append(
        createElement("strong", "", state.source?.name || "Исходная карточка"),
        createElement(
          "span",
          "",
          state.source?.file?.size
            ? (state.source.file.size / (1024 * 1024)).toFixed(2) + " MB"
            : "PNG, JPG, WEBP"
        )
      );

      const removeBtn = createElement("button", "create-upload-remove", "Удалить");
      removeBtn.type = "button";
      removeBtn.dataset.action = "reset";
      removeBtn.disabled = Boolean(state.isBusy);
      removeBtn.setAttribute("aria-label", "Удалить исходную карточку");

      item.append(thumb, meta, removeBtn);
      list.append(item);
    }

    body.append(toolbar, empty, list);
    dialog.append(head, body);
    modal.append(backdrop, dialog);
    return modal;
  };

  const buildResultCard = (state) => {
    const panel = createElement("section", "enhance-card-v2-preview-card");
    const header = createElement("div", "enhance-card-v2-preview-head");
    header.append(
      createElement("strong", "", "Результат"),
      ...(state.status === "success" ? [createElement("span", "", "Готово к скачиванию")] : [])
    );
    panel.append(header);

    if (state.status === "success" && state.resultUrl) {
      const frame = createElement("div", "enhance-card-v2-image-frame");
      frame.append(buildPreviewImage(state.resultUrl, "Улучшенная карточка товара"));
      panel.append(frame);
      return panel;
    }

    const placeholderCopy = (() => {
      if (state.status === "error" || state.status === "timeout") {
        return {
          title: "Можно повторить с теми же настройками",
          text: "Исходник сохранён. Повторите запрос или загрузите другую карточку, не перезагружая страницу.",
        };
      }

      if (state.status === "submitting" || state.status === "processing") {
        return { title: "Готовим результат", text: "" };
      }

      if (state.status === "file_selected") {
        return { title: "Здесь появится результат", text: "" };
      }

      return { title: "Здесь появится результат", text: "" };
    })();

    const placeholder = createElement("div", "enhance-card-v2-result-placeholder");
    placeholder.append(
      createElement("strong", "", placeholderCopy.title),
      createElement("p", "", placeholderCopy.text)
    );
    panel.append(placeholder);
    return panel;
  };

  const buildStatusPanel = (state) => {
    if (
      state.status === "idle"
      || state.status === "file_selected"
      || state.status === "submitting"
      || state.status === "processing"
      || state.status === "success"
    ) {
      return null;
    }

    const descriptor = getStatusDescriptor(state);
    const panel = createElement("section", "enhance-card-v2-status enhance-card-v2-status-" + descriptor.tone);
    const badge = createElement("span", "enhance-card-v2-status-badge", state.status);
    const body = createElement("div", "enhance-card-v2-status-body");
    body.append(
      createElement("strong", "", descriptor.title),
      createElement("p", "", descriptor.text)
    );
    panel.append(badge, body);
    return panel;
  };

  const buildActionButton = (options) => {
    const button = createElement("button", options.className || "btn", options.text || "");
    button.type = "button";
    if (options.action) button.dataset.action = options.action;
    if (options.disabled) button.disabled = true;
    return button;
  };

  const buildTextModeControl = (state) => {
    const mode = getTextMode();
    const disabled = Boolean(state?.isBusy);
    const panel = createElement("section", "enhance-card-v2-text-mode");
    const label = createElement("strong", "enhance-card-v2-text-mode-label", "Как работать с текстом");
    const controls = createElement("div", "enhance-card-v2-text-mode-controls");

    [
      { mode: "preserve", text: "Сохранить текст 1 в 1" },
      { mode: "rewrite", text: "Разрешить улучшить текст" },
    ].forEach((option) => {
      const button = createElement("button", "enhance-card-v2-text-mode-btn", option.text);
      button.type = "button";
      button.dataset.action = "set-text-mode";
      button.dataset.textMode = option.mode;
      button.setAttribute("aria-pressed", option.mode === mode ? "true" : "false");
      if (option.mode === mode) button.classList.add("is-active");
      if (disabled) button.disabled = true;
      controls.append(button);
    });

    const caption = createElement(
      "p",
      "enhance-card-v2-text-mode-caption",
      "В режиме «1 в 1» сохраняются формулировки, а меняются только компоновка и подача."
    );
    panel.append(label, controls, caption);
    return panel;
  };

  const buildActions = (state) => {
    const actions = createElement("div", "enhance-card-v2-actions");
    const cost = getActionCost();
    const improveLabel = cost ? "Улучшить карточку • " + formatTokenCount(cost) : "Улучшить карточку";

    if (state.status === "success") {
      actions.append(
        buildActionButton({ action: "retry", className: "btn btn-primary", text: "Сделать вариант 2" }),
        buildActionButton({ action: "download", className: "enhance-card-v2-secondary", text: "Скачать результат" })
      );
      return actions;
    }

    if (state.status === "error" || state.status === "timeout") {
      actions.append(buildActionButton({
        action: "retry",
        className: "btn btn-primary",
        text: "Повторить с теми же настройками",
      }));
      return actions;
    }

    if (state.status === "submitting" || state.status === "processing") {
      actions.append(buildActionButton({
        className: "btn btn-primary",
        text: state.status === "submitting" ? "Подготавливаем..." : "Обрабатываем...",
        disabled: true,
      }));
      return actions;
    }

    actions.append(buildActionButton({
      action: "submit",
      className: "btn btn-primary",
      text: improveLabel,
      disabled: !hasEnoughTokens() || !state.source,
    }));
    return actions;
  };

  const render = (state) => {
    stage.textContent = "";

    const root = createElement("div", "enhance-card-v2-root");
    const fileInput = createElement("input", "enhance-card-v2-input");
    fileInput.id = "enhanceCardInput";
    fileInput.type = "file";
    fileInput.accept = "image/png,image/jpeg,image/webp";

    fileInput.addEventListener("change", () => {
      handleFileSelection(fileInput.files?.[0] || null);
      fileInput.value = "";
    });

    const layout = createElement("div", "enhance-card-v2-layout");

    const leftCol = createElement("div", "enhance-card-v2-col-left");
    leftCol.append(buildSourceCard(state));

    const centerCol = createElement("div", "enhance-card-v2-col-center");
    centerCol.append(buildTextModeControl(state));
    const promptSection = createElement("section", "create-form-card enhance-card-v2-prompt-section");
    const promptLabel = createElement("label", "field-label", "Что улучшить (опционально)");
    promptLabel.setAttribute("for", "enhanceCardPrompt");
    if (promptInput) promptInput.classList.remove("hidden");
    promptSection.append(promptLabel, ...(promptInput ? [promptInput] : []));
    centerCol.append(promptSection);

    const rightCol = createElement("div", "enhance-card-v2-col-right");
    rightCol.append(buildResultCard(state), buildActions(state));

    layout.append(leftCol, centerCol, rightCol);

    const managerModal = buildSourceManagerModal(state);
    const statusPanel = buildStatusPanel(state);
    root.append(fileInput);
    if (statusPanel) root.append(statusPanel);
    root.append(layout, managerModal);
    stage.append(root);

    const dropzone = stage.querySelector(".enhance-card-v2-source-dropzone");
    if (dropzone instanceof HTMLElement) {
      ["dragenter", "dragover"].forEach((eventName) => {
        dropzone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropzone.classList.add("is-dragover");
        });
      });

      ["dragleave", "dragend"].forEach((eventName) => {
        dropzone.addEventListener(eventName, () => {
          dropzone.classList.remove("is-dragover");
        });
      });

      dropzone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropzone.classList.remove("is-dragover");
        handleFileSelection(event.dataTransfer?.files?.[0] || null);
      });
    }
  };

  stage.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const actionElement = target.closest("[data-action]");
    if (!(actionElement instanceof HTMLElement)) return;

    const action = actionElement.dataset.action;
    if (!action) return;

    switch (action) {
      case "open-manager":
        imageManagerOpen = true;
        render(store.getState());
        break;
      case "close-manager":
        imageManagerOpen = false;
        render(store.getState());
        break;
      case "set-text-mode":
        setTextMode(actionElement.dataset.textMode);
        break;
      case "pick-file":
        openFilePicker();
        break;
      case "submit":
        void submitCurrentSource({ retry: false });
        break;
      case "retry":
        void submitCurrentSource({ retry: true });
        break;
      case "reset":
        store.reset({ event: "manual_reset" });
        imageManagerOpen = false;
        clearToast();
        break;
      case "download":
        downloadResult();
        break;
      default:
        break;
    }
  });

  window.addEventListener("kartochka:billing:update", () => {
    render(store.getState());
  });

  window.addEventListener("kartochka:improve:prefill", (event) => {
    const previewUrl = toText(event?.detail?.previewUrl);
    const fileName = toText(event?.detail?.fileName) || "generated-card.png";
    if (!previewUrl) return;

    logger.info("prefill_received", {
      fileName,
      hasPreviewUrl: true,
    });

    const source = createRemoteSource({
      previewUrl,
      name: fileName,
    });
    store.setSource(source, { event: "prefill_loaded" });
  });

  window.addEventListener("beforeunload", () => {
    store.destroy();
  });

  store.subscribe((nextState) => {
    render(nextState);
  });
})();
