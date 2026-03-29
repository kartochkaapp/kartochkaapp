(function () {
  const stage = document.getElementById("enhanceCardStage");
  const toast = document.getElementById("enhanceCardToast");
  const promptInput = document.getElementById("enhanceCardPrompt");

  if (!stage || !toast) return;

  const ENHANCE_ENDPOINT = "/api/enhance-card";
  const BILLING_ACTION_CODE = "enhance_card";
  const REQUEST_TIMEOUT_MS = 65000;
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
  const MAX_IMAGE_DIMENSION = 1600;
  const JPEG_QUALITY = 0.84;
  const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CLIENT_REQUEST_SESSION_ID = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);

  const state = {
    phase: "upload",
    sourceFile: null,
    sourceName: "",
    sourcePreviewUrl: "",
    uploadDataUrl: "",
    resultUrl: "",
    toastTimerId: 0,
    requestId: 0,
  };

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  };

  const toText = (value) => String(value || "").trim();

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

  const createEnhanceButtonCopy = (text) => {
    const wrapper = createElement("span", "enhance-card-button-copy");
    wrapper.append(createElement("span", "enhance-card-button-label", text));

    const cost = getActionCost();
    if (cost) {
      wrapper.append(createElement("span", "enhance-card-button-cost", formatTokenCount(cost)));
    }

    return wrapper;
  };

  const getErrorMessage = (error) => {
    const name = String(error?.name || "").trim();
    const message = String(error?.message || "").trim();

    if (name === "AbortError") {
      return "Улучшение заняло слишком много времени. Попробуйте еще раз.";
    }

    return message || "Упс, что-то пошло не так. Попробуйте еще раз";
  };

  const clearToastTimer = () => {
    if (state.toastTimerId) {
      window.clearTimeout(state.toastTimerId);
      state.toastTimerId = 0;
    }
  };

  const showToast = (message) => {
    clearToastTimer();
    toast.textContent = message;
    toast.classList.add("is-visible");
    state.toastTimerId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      state.toastTimerId = 0;
    }, 3400);
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Не удалось прочитать изображение."));
      reader.readAsDataURL(file);
    });
  };

  const blobToDataUrl = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Не удалось подготовить изображение."));
      reader.readAsDataURL(blob);
    });
  };

  const loadImageElement = (sourceUrl) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Не удалось подготовить изображение."));
      image.src = sourceUrl;
    });
  };

  const optimizeImageFile = async (file) => {
    const sourceUrl = URL.createObjectURL(file);

    try {
      const image = await loadImageElement(sourceUrl);
      const width = Number(image.naturalWidth || image.width || 0);
      const height = Number(image.naturalHeight || image.height || 0);
      if (!width || !height) {
        return readFileAsDataUrl(file);
      }

      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(width, height));
      const targetWidth = Math.max(1, Math.round(width * scale));
      const targetHeight = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        return readFileAsDataUrl(file);
      }

      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  };

  const buildDownloadName = (fileName) => {
    const safeName = String(fileName || "product-card")
      .trim()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^\w\u0400-\u04FF-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-+|-+$/g, "");

    return (safeName || "product-card") + "-enhanced.jpg";
  };

  const validateFile = (file) => {
    if (!file) {
      return "Сначала загрузите изображение карточки.";
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return "Поддерживаются только PNG, JPG и WEBP.";
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "Файл слишком большой. Используйте изображение до 10 МБ.";
    }

    return "";
  };

  const getUserImprovePrompt = () => toText(promptInput?.value || "");

  const resolveSourceUrlToDataUrl = async (sourceUrl) => {
    const safeSourceUrl = toText(sourceUrl);
    if (!safeSourceUrl) {
      throw new Error("Не удалось подготовить карточку для улучшения.");
    }

    if (/^data:image\//i.test(safeSourceUrl)) {
      return safeSourceUrl;
    }

    const response = await fetch(safeSourceUrl);
    if (!response.ok) {
      throw new Error("Не удалось подготовить карточку для улучшения.");
    }

    const blob = await response.blob();
    return blobToDataUrl(blob);
  };

  const resetState = () => {
    state.phase = "upload";
    state.sourceFile = null;
    state.sourceName = "";
    state.sourcePreviewUrl = "";
    state.uploadDataUrl = "";
    state.resultUrl = "";
    render();
  };

  const createPreviewWindow = (options) => {
    const windowElement = createElement("div", "enhance-card-preview-window");
    if (options?.isResult) {
      windowElement.classList.add("is-result");
    }

    if (options?.sourceUrl) {
      const sourceImage = createElement("img");
      sourceImage.src = options.sourceUrl;
      sourceImage.alt = options?.sourceAlt || "Загруженная карточка товара";
      sourceImage.dataset.role = "source";
      windowElement.append(sourceImage);
    }

    if (options?.resultUrl) {
      const resultImage = createElement("img");
      resultImage.src = options.resultUrl;
      resultImage.alt = options?.resultAlt || "Улучшенная карточка товара";
      resultImage.dataset.role = "result";
      windowElement.append(resultImage);
    }

    return windowElement;
  };

  const buildUploadView = () => {
    const view = createElement("div", "enhance-card-view");
    const frame = createElement("div", "enhance-card-frame");
    const label = createElement("label", "enhance-card-dropzone");
    label.setAttribute("for", "enhanceCardInput");

    const input = createElement("input", "enhance-card-file-input");
    input.id = "enhanceCardInput";
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";

    label.append(input);

    if (state.sourcePreviewUrl) {
      const previewWrap = createElement("div", "enhance-card-preview-wrap");
      previewWrap.append(
        createPreviewWindow({
          sourceUrl: state.sourcePreviewUrl,
          sourceAlt: "Загруженная карточка товара",
        })
      );

      const previewMeta = createElement("div", "enhance-card-preview-meta");
      previewMeta.append(
        createElement("strong", "", "Карточка загружена"),
        createElement("span", "", state.sourceName || "Файл готов к улучшению")
      );
      previewWrap.append(previewMeta);
      label.append(previewWrap);
    } else {
      const placeholder = createElement("div", "enhance-card-placeholder");
      const icon = createElement("div", "enhance-card-placeholder-icon");
      icon.setAttribute("aria-hidden", "true");

      const copy = createElement("div", "enhance-card-placeholder-copy");
      copy.append(
        createElement("strong", "", "Перетащите карточку сюда"),
        createElement("p", "", "или нажмите, чтобы выбрать изображение товара"),
        createElement("span", "", "PNG, JPG, WEBP • до 10 МБ")
      );

      placeholder.append(icon, copy);
      label.append(placeholder);
    }

    frame.append(label);

    const noteText = state.sourcePreviewUrl
      ? !hasEnoughTokens() && getBillingState()?.summary
        ? "Недостаточно токенов для улучшения. Откройте баланс и пополните его."
        : ""
      : "";

    const actions = createElement("div", "enhance-card-actions");
    if (state.sourcePreviewUrl) {
      const submitButton = createElement("button", "btn btn-primary enhance-card-primary", "Улучшить");
      submitButton.type = "button";
      submitButton.id = "enhanceCardSubmitBtn";
      submitButton.textContent = "";
      submitButton.append(createEnhanceButtonCopy("Улучшить"));
      submitButton.toggleAttribute("disabled", !hasEnoughTokens() || !state.uploadDataUrl);

      const replaceButton = createElement("button", "enhance-card-secondary", "Загрузить другую");
      replaceButton.type = "button";
      replaceButton.id = "enhanceCardReplaceBtn";

      actions.append(submitButton, replaceButton);
    }

    view.append(frame);
    if (noteText) {
      const note = createElement("p", "enhance-card-status-note", noteText);
      view.append(note);
    }
    if (actions.childElementCount) {
      view.append(actions);
    }

    return view;
  };

  const buildLoadingView = () => {
    const view = createElement("div", "enhance-card-view");
    const frame = createElement("div", "enhance-card-frame");
    const previewWrap = createElement("div", "enhance-card-preview-wrap");
    previewWrap.append(
      createPreviewWindow({
        sourceUrl: state.sourcePreviewUrl,
        sourceAlt: "Карточка в обработке",
      })
    );
    frame.append(previewWrap);

    const overlay = createElement("div", "enhance-card-loading-overlay");
    const scanline = createElement("div", "enhance-card-scanline");
    scanline.setAttribute("aria-hidden", "true");

    const copy = createElement("div", "enhance-card-loading-copy");
    const spinner = createElement("div", "enhance-card-spinner");
    spinner.setAttribute("aria-hidden", "true");
    copy.append(
      spinner,
      createElement("strong", "", "KARTOCHKA колдует над вашей карточкой..."),
      createElement("span", "", "Подкручиваем свет, фон и подачу, сохраняя сам товар.")
    );

    overlay.append(scanline, copy);
    frame.append(overlay);

    const actions = createElement("div", "enhance-card-actions");
    const busyButton = createElement("button", "btn btn-primary enhance-card-primary", "Улучшаем...");
    busyButton.type = "button";
    busyButton.disabled = true;
    busyButton.textContent = "";
    busyButton.append(createEnhanceButtonCopy("Улучшаем..."));
    actions.append(busyButton);

    view.append(frame, actions);
    return view;
  };

  const buildResultView = () => {
    const view = createElement("div", "enhance-card-view");
    const frame = createElement("div", "enhance-card-frame");
    const previewWrap = createElement("div", "enhance-card-preview-wrap");
    const previewWindow = createPreviewWindow({
      sourceUrl: state.sourcePreviewUrl,
      resultUrl: state.resultUrl,
      sourceAlt: "Исходная карточка товара",
      resultAlt: "Улучшенная карточка товара",
      isResult: true,
    });

    previewWrap.append(previewWindow);

    const previewMeta = createElement("div", "enhance-card-preview-meta");
    previewMeta.append(
      createElement("strong", "", "Готово"),
      createElement("span", "", "Улучшенная карточка готова к скачиванию")
    );
    previewWrap.append(previewMeta);
    frame.append(previewWrap);

    const actions = createElement("div", "enhance-card-actions");
    const downloadButton = createElement("button", "btn btn-primary enhance-card-primary", "Скачать");
    downloadButton.type = "button";
    downloadButton.id = "enhanceCardDownloadBtn";

    const resetButton = createElement("button", "enhance-card-secondary", "Улучшить другую");
    resetButton.type = "button";
    resetButton.id = "enhanceCardResetBtn";

    actions.append(downloadButton, resetButton);
    view.append(frame, actions);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        previewWindow.classList.add("is-revealed");
      });
    });

    return view;
  };

  const bindFileControls = () => {
    const fileInput = stage.querySelector("#enhanceCardInput");
    const dropzone = stage.querySelector(".enhance-card-dropzone");
    const submitButton = stage.querySelector("#enhanceCardSubmitBtn");
    const replaceButton = stage.querySelector("#enhanceCardReplaceBtn");

    fileInput?.addEventListener("change", async () => {
      await handleSelectedFile(fileInput.files?.[0] || null);
      fileInput.value = "";
    });

    replaceButton?.addEventListener("click", () => {
      fileInput?.click();
    });

    submitButton?.addEventListener("click", () => {
      void runEnhancement();
    });

    if (!dropzone) return;

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

    dropzone.addEventListener("drop", async (event) => {
      event.preventDefault();
      dropzone.classList.remove("is-dragover");
      const file = event.dataTransfer?.files?.[0] || null;
      await handleSelectedFile(file);
    });
  };

  const bindResultControls = () => {
    const downloadButton = stage.querySelector("#enhanceCardDownloadBtn");
    const resetButton = stage.querySelector("#enhanceCardResetBtn");

    downloadButton?.addEventListener("click", () => {
      const url = state.resultUrl || state.sourcePreviewUrl;
      if (!url) return;

      const link = document.createElement("a");
      link.href = url;
      link.download = buildDownloadName(state.sourceName);
      document.body.append(link);
      link.click();
      link.remove();
    });

    resetButton?.addEventListener("click", () => {
      resetState();
    });
  };

  const render = () => {
    stage.textContent = "";

    if (state.phase === "loading") {
      stage.append(buildLoadingView());
      return;
    }

    if (state.phase === "result") {
      stage.append(buildResultView());
      bindResultControls();
      return;
    }

    stage.append(buildUploadView());
    bindFileControls();
  };

  const handleSelectedFile = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      showToast(validationError);
      return;
    }

    try {
      const optimizedDataUrl = await optimizeImageFile(file);
      state.sourceFile = file;
      state.sourceName = String(file.name || "card-image");
      state.sourcePreviewUrl = optimizedDataUrl;
      state.uploadDataUrl = optimizedDataUrl;
      state.resultUrl = "";
      state.phase = "upload";
      render();
    } catch (error) {
      showToast(getErrorMessage());
    }
  };

  const runEnhancement = async () => {
    if (!state.uploadDataUrl || state.phase === "loading") {
      return;
    }
    if (!hasEnoughTokens() && getBillingState()?.summary) {
      showToast("Недостаточно токенов для улучшения.");
      return;
    }

    const requestId = ++state.requestId;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    state.phase = "loading";
    render();

    try {
      const authHeaders = window.KARTOCHKA_AUTH_SESSION?.getHeaders
        ? await window.KARTOCHKA_AUTH_SESSION.getHeaders()
        : {};
      const response = await fetch(ENHANCE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeaders && typeof authHeaders === "object" ? authHeaders : {}),
        },
        body: JSON.stringify({
          imageDataUrl: state.uploadDataUrl,
          userPrompt: getUserImprovePrompt(),
          requestId: "enhance-card-" + CLIENT_REQUEST_SESSION_ID + "-" + String(requestId),
        }),
        signal: controller.signal,
      });

      const raw = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(raw?.error?.userMessage || raw?.error?.message || getErrorMessage());
      }

      if (requestId !== state.requestId) return;

      const resultUrl = String(raw?.imageDataUrl || raw?.resultImageDataUrl || raw?.imageUrl || "").trim();
      if (!resultUrl) {
        throw new Error(getErrorMessage());
      }

      state.resultUrl = resultUrl;
      state.phase = "result";
      render();
      window.dispatchEvent(new CustomEvent("kartochka:billing:refresh"));
    } catch (error) {
      if (requestId !== state.requestId) return;
      state.phase = "upload";
      render();
      showToast(getErrorMessage(error));
      window.dispatchEvent(new CustomEvent("kartochka:billing:refresh"));
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  if (prefersReducedMotion) {
    toast.style.transitionDuration = "0.01ms";
  }

  window.addEventListener("kartochka:billing:update", () => {
    if (state.phase === "upload") {
      render();
    }
  });

  window.addEventListener("kartochka:improve:prefill", async (event) => {
    const previewUrl = toText(event?.detail?.previewUrl);
    const fileName = toText(event?.detail?.fileName) || "generated-card.png";
    if (!previewUrl) return;

    try {
      state.sourceFile = null;
      state.sourceName = fileName;
      state.sourcePreviewUrl = previewUrl;
      state.uploadDataUrl = "";
      state.resultUrl = "";
      state.phase = "upload";
      render();

      const dataUrl = await resolveSourceUrlToDataUrl(previewUrl);
      state.sourcePreviewUrl = dataUrl || previewUrl;
      state.uploadDataUrl = dataUrl;
      state.resultUrl = "";
      state.phase = "upload";
      render();
    } catch (error) {
      resetState();
      showToast(getErrorMessage(error));
    }
  });

  render();
})();
