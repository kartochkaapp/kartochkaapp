(function initKartochkaToolsModule(global) {
  "use strict";

  const root = document.getElementById("toolsAppRoot");
  if (!root) return;

  const MAX_UPLOAD_BYTES = 18 * 1024 * 1024;
  const ANALYSIS_MAX_SIDE = 720;
  const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

  const TOOL_DEFINITIONS = Object.freeze([
    {
      id: "background-removal",
      title: "Удаление фона",
      shortDescription: "Прозрачный PNG без изменения исходного кадра.",
      description:
        "Быстро очищает товарное фото и сохраняет тот же ракурс и кадрирование. Удобно для дальнейшей сборки карточек.",
      capability: "PNG transparent",
      runLabel: "Удалить фон",
      downloadLabel: "Скачать PNG",
      metaTitle: "Прозрачный PNG",
      metaText: "Фон убран, исходный кадр сохранён.",
      readyHint: "Файл готов. Запустите удаление фона в один клик.",
      emptyHint: "Результат с прозрачным фоном появится здесь.",
      successHint: "Фон удалён. PNG готов к скачиванию.",
      footnote: "Лучше всего работает на чистых предметных фото, где товар отделён от фона.",
      available: true,
    },
    {
      id: "cutout-export",
      title: "Изолированный объект",
      shortDescription: "Товар на прозрачном квадрате с аккуратной обрезкой.",
      description:
        "Выделяет товар, убирает фон и собирает объект на отдельном прозрачном квадрате с безопасным внутренним полем.",
      capability: "Square cutout",
      runLabel: "Собрать cutout",
      downloadLabel: "Скачать cutout",
      metaTitle: "Изолированный cutout",
      metaText: "Товар вырезан и собран на прозрачном квадрате.",
      readyHint: "Файл готов. Соберите изолированный cutout для быстрых макетов.",
      emptyHint: "Изолированный объект на прозрачном квадрате появится здесь.",
      successHint: "Cutout готов. PNG можно использовать в баннерах и карточках.",
      footnote: "Подходит, когда нужен чистый товарный объект для дизайна и композиций.",
      available: true,
    },
    {
      id: "multi-angle",
      title: "Мультиракурсы",
      shortDescription: "Производные ракурсы из одного фото товара.",
      description:
        "Архитектура карточки уже готова, но AI-генерация новых ракурсов из одного снимка пока оставлена на следующий релиз, чтобы не рисковать качеством.",
      capability: "Soon",
      runLabel: "Скоро",
      downloadLabel: "",
      metaTitle: "Скоро",
      metaText: "Добавим безопасный AI-генератор ракурсов отдельным этапом.",
      readyHint: "Этот инструмент появится в следующем проходе.",
      emptyHint: "Когда функция будет готова, результат появится здесь.",
      successHint: "",
      footnote: "Карточка и место в интерфейсе уже готовы под дальнейшее расширение.",
      available: false,
    },
  ]);

  const TOOL_MAP = new Map(TOOL_DEFINITIONS.map((tool) => [tool.id, tool]));

  const state = {
    selectedToolId: TOOL_DEFINITIONS[0].id,
    sourceFile: null,
    sourceKey: "",
    sourceUrl: "",
    loadedImage: null,
    segmentationCache: null,
    resultsByTool: new Map(),
    processing: false,
    processingLabel: "",
    noticeText: "",
    noticeType: "",
    requestId: 0,
  };

  root.innerHTML = [
    '<div class="tools-shell">',
    '  <div class="create-screen-head tools-screen-head">',
    '    <div class="tools-screen-copy">',
    '      <div class="step-title-row tools-screen-title-row">',
    '        <h2>Инструменты продавца</h2>',
    '        <span class="tools-screen-kicker">Beta</span>',
    "      </div>",
    '      <p class="section-subtitle">Практичные one-click утилиты для подготовки фото товара. Отдельно от create, improve и history.</p>',
    "    </div>",
    "  </div>",
    '  <section class="create-form-card tools-launcher-card">',
    '    <div class="create-card-head tools-launcher-head">',
    "      <div>",
    "        <h3>Лаунчер инструментов</h3>",
    '        <span>Выберите задачу и обработайте одно фото товара без лишних настроек.</span>',
    "      </div>",
    "    </div>",
    '    <div class="tools-card-grid" id="toolsCardGrid"></div>',
    "  </section>",
    '  <section class="tools-grid">',
    '    <article class="create-form-card tools-input-card">',
    '      <div class="create-card-head tools-input-head">',
    "        <div>",
    "          <h3>Исходное фото</h3>",
    '          <span>1 фото за запуск • PNG, JPG, WEBP</span>',
    "        </div>",
    '        <button class="btn btn-outline hidden" id="toolsReplaceBtn" type="button">Заменить</button>',
    "      </div>",
    '      <label class="tools-upload-dropzone" id="toolsUploadZone" for="toolsFileInput">',
    '        <input class="hidden" id="toolsFileInput" type="file" accept="image/png,image/jpeg,image/webp" />',
    '        <span class="tools-upload-preview">',
    '          <img class="hidden" id="toolsSourcePreview" alt="Исходное фото товара" />',
    '          <span id="toolsSourcePlaceholder">PNG, JPG, WEBP</span>',
    "        </span>",
    '        <span class="tools-upload-copy">',
    '          <strong id="toolsUploadTitle">Добавьте фото товара</strong>',
    '          <small id="toolsUploadHint">Лучший результат обычно даёт чистый контрастный фон и один главный объект.</small>',
    "        </span>",
    "      </label>",
    '      <div class="tools-source-meta hidden" id="toolsSourceMeta">',
    '        <strong id="toolsSourceName"></strong>',
    '        <span id="toolsSourceSpecs"></span>',
    "      </div>",
    '      <div class="tools-input-footer">',
    '        <button class="btn btn-outline hidden" id="toolsClearBtn" type="button">Очистить</button>',
    '        <p class="tools-footnote" id="toolsFootnote"></p>',
    "      </div>",
    "    </article>",
    '    <article class="create-form-card tools-output-card">',
    '      <div class="create-card-head tools-output-head">',
    "        <div>",
    '          <h3 id="toolsWorkbenchTitle">Удаление фона</h3>',
    '          <span id="toolsWorkbenchSubtitle">Прозрачный PNG без изменения исходного кадра.</span>',
    "        </div>",
    '        <span class="tools-output-badge" id="toolsOutputBadge">Ожидание фото</span>',
    "      </div>",
    '      <div class="tools-preview-grid">',
    '        <section class="tools-preview-panel">',
    '          <span class="tools-preview-label">До</span>',
    '          <div class="tools-preview-frame">',
    '            <img class="hidden" id="toolsSourceStageImage" alt="Исходный кадр товара" />',
    '            <div class="tools-empty-state" id="toolsSourceStageEmpty">Загрузите фото, чтобы увидеть исходник.</div>',
    "          </div>",
    "        </section>",
    '        <section class="tools-preview-panel">',
    '          <span class="tools-preview-label" id="toolsResultLabel">После</span>',
    '          <div class="tools-preview-frame tools-preview-frame-checker">',
    '            <img class="hidden" id="toolsResultPreview" alt="Результат выбранного инструмента" />',
    '            <div class="tools-empty-state" id="toolsResultEmpty">Результат выбранного инструмента появится здесь.</div>',
    '            <div class="tools-processing-overlay hidden" id="toolsProcessingOverlay">',
    '              <span class="tools-spinner" aria-hidden="true"></span>',
    '              <strong id="toolsProcessingLabel">Анализируем фон...</strong>',
    "            </div>",
    "          </div>",
    "        </section>",
    "      </div>",
    '      <div class="tools-output-meta">',
    '        <strong id="toolsOutputMetaTitle">Прозрачный PNG</strong>',
    '        <span id="toolsOutputMetaText">Сохраните обработанное фото и используйте его в карточках, баннерах и шаблонах.</span>',
    "      </div>",
    '      <div class="tools-actions">',
    '        <button class="btn btn-primary" id="toolsRunBtn" type="button" disabled>Удалить фон</button>',
    '        <a class="btn btn-outline hidden" id="toolsDownloadBtn" href="#" download>Скачать PNG</a>',
    "      </div>",
    '      <p class="status-message" id="toolsStatus" aria-live="polite"></p>',
    '      <div class="request-meta tools-request-meta">',
    "        <span>Состояние:</span>",
    '        <strong id="toolsRequestMetaValue">Ожидание фото</strong>',
    "      </div>",
    "    </article>",
    "  </section>",
    "</div>",
  ].join("");

  const elements = {
    cardGrid: root.querySelector("#toolsCardGrid"),
    uploadZone: root.querySelector("#toolsUploadZone"),
    fileInput: root.querySelector("#toolsFileInput"),
    replaceBtn: root.querySelector("#toolsReplaceBtn"),
    clearBtn: root.querySelector("#toolsClearBtn"),
    sourcePreview: root.querySelector("#toolsSourcePreview"),
    sourceStageImage: root.querySelector("#toolsSourceStageImage"),
    sourcePlaceholder: root.querySelector("#toolsSourcePlaceholder"),
    sourceMeta: root.querySelector("#toolsSourceMeta"),
    sourceName: root.querySelector("#toolsSourceName"),
    sourceSpecs: root.querySelector("#toolsSourceSpecs"),
    sourceStageEmpty: root.querySelector("#toolsSourceStageEmpty"),
    uploadTitle: root.querySelector("#toolsUploadTitle"),
    uploadHint: root.querySelector("#toolsUploadHint"),
    footnote: root.querySelector("#toolsFootnote"),
    workbenchTitle: root.querySelector("#toolsWorkbenchTitle"),
    workbenchSubtitle: root.querySelector("#toolsWorkbenchSubtitle"),
    outputBadge: root.querySelector("#toolsOutputBadge"),
    resultLabel: root.querySelector("#toolsResultLabel"),
    resultPreview: root.querySelector("#toolsResultPreview"),
    resultEmpty: root.querySelector("#toolsResultEmpty"),
    outputMetaTitle: root.querySelector("#toolsOutputMetaTitle"),
    outputMetaText: root.querySelector("#toolsOutputMetaText"),
    processingOverlay: root.querySelector("#toolsProcessingOverlay"),
    processingLabel: root.querySelector("#toolsProcessingLabel"),
    runBtn: root.querySelector("#toolsRunBtn"),
    downloadBtn: root.querySelector("#toolsDownloadBtn"),
    status: root.querySelector("#toolsStatus"),
    requestMetaValue: root.querySelector("#toolsRequestMetaValue"),
  };

  const toText = (value) => String(value || "").trim();

  const clamp = (value, min, max) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return min;
    return Math.max(min, Math.min(max, numeric));
  };

  const waitForPaint = () => {
    return new Promise((resolve) => {
      global.requestAnimationFrame(() => resolve());
    });
  };

  const formatFileSize = (bytes) => {
    const value = Number(bytes) || 0;
    if (value >= 1024 * 1024) {
      return (value / (1024 * 1024)).toFixed(value >= 10 * 1024 * 1024 ? 0 : 1) + " МБ";
    }
    if (value >= 1024) {
      return Math.round(value / 1024) + " КБ";
    }
    return String(value) + " Б";
  };

  const formatDimensions = (width, height) => {
    const safeWidth = Number(width) || 0;
    const safeHeight = Number(height) || 0;
    if (!safeWidth || !safeHeight) return "";
    return String(safeWidth) + " × " + String(safeHeight) + " px";
  };

  const buildSourceKey = (file) => {
    return [file?.name || "", file?.size || 0, file?.lastModified || 0].join(":");
  };

  const stripExtension = (fileName) => {
    return String(fileName || "product").replace(/\.[^.]+$/u, "") || "product";
  };

  const buildDownloadName = (fileName, suffix) => {
    return stripExtension(fileName) + "-" + String(suffix || "result") + ".png";
  };

  const revokeResult = (result) => {
    if (result?.objectUrl) {
      URL.revokeObjectURL(result.objectUrl);
    }
  };

  const clearResults = () => {
    state.resultsByTool.forEach((result) => revokeResult(result));
    state.resultsByTool.clear();
  };

  const resetSource = () => {
    if (state.sourceUrl) {
      URL.revokeObjectURL(state.sourceUrl);
    }
    state.sourceFile = null;
    state.sourceKey = "";
    state.sourceUrl = "";
    state.loadedImage = null;
    state.segmentationCache = null;
    clearResults();
    state.noticeText = "";
    state.noticeType = "";
    if (elements.fileInput) {
      elements.fileInput.value = "";
    }
  };

  const getSelectedTool = () => {
    return TOOL_MAP.get(state.selectedToolId) || TOOL_DEFINITIONS[0];
  };

  const getCurrentResult = () => {
    return state.resultsByTool.get(getSelectedTool().id) || null;
  };

  const getSourceDimensionsText = () => {
    const image = state.loadedImage;
    const dimensionText = image
      ? formatDimensions(image.naturalWidth || image.width || 0, image.naturalHeight || image.height || 0)
      : "";
    const sizeText = state.sourceFile ? formatFileSize(state.sourceFile.size) : "";
    return [dimensionText, sizeText].filter(Boolean).join(" • ");
  };

  const loadImageElement = (sourceUrl) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Не удалось открыть изображение."));
      image.src = sourceUrl;
    });
  };

  const ensureSourceImage = async () => {
    if (state.loadedImage && state.sourceKey) return state.loadedImage;
    if (!state.sourceUrl) {
      throw new Error("Сначала загрузите фото товара.");
    }
    state.loadedImage = await loadImageElement(state.sourceUrl);
    return state.loadedImage;
  };

  const getPixelOffset = (index) => index * 4;

  const getPixelColor = (data, index) => {
    const offset = getPixelOffset(index);
    return {
      r: data[offset],
      g: data[offset + 1],
      b: data[offset + 2],
      a: data[offset + 3],
    };
  };

  const getLumaFromColor = (color) => {
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  };

  const getSaturationFromColor = (color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    return max - min;
  };

  const getColorDistance = (colorA, colorB) => {
    const dr = Math.abs((colorA?.r || 0) - (colorB?.r || 0));
    const dg = Math.abs((colorA?.g || 0) - (colorB?.g || 0));
    const db = Math.abs((colorA?.b || 0) - (colorB?.b || 0));
    return dr * 0.35 + dg * 0.4 + db * 0.25;
  };

  const percentile = (values, ratio) => {
    if (!Array.isArray(values) || !values.length) return 0;
    const sorted = values.slice().sort((left, right) => left - right);
    const index = clamp(Math.round((sorted.length - 1) * ratio), 0, sorted.length - 1);
    return sorted[index];
  };

  const buildMaskCanvas = (mask, width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return canvas;

    const imageData = context.createImageData(width, height);
    const data = imageData.data;
    for (let index = 0; index < mask.length; index += 1) {
      const offset = getPixelOffset(index);
      const alpha = mask[index] ? 255 : 0;
      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = alpha;
    }
    context.putImageData(imageData, 0, 0);

    const softened = document.createElement("canvas");
    softened.width = width;
    softened.height = height;
    const softenedContext = softened.getContext("2d");
    if (!softenedContext) return canvas;

    softenedContext.clearRect(0, 0, width, height);
    softenedContext.imageSmoothingEnabled = true;
    softenedContext.filter = "blur(0.7px)";
    softenedContext.drawImage(canvas, 0, 0);
    softenedContext.filter = "none";
    return softened;
  };

  const findMaskBounds = (mask, width, height) => {
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        if (!mask[index]) continue;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }

    if (maxX < 0 || maxY < 0) {
      return {
        minX: 0,
        minY: 0,
        maxX: Math.max(0, width - 1),
        maxY: Math.max(0, height - 1),
      };
    }

    return { minX, minY, maxX, maxY };
  };

  const filterForegroundComponents = (mask, width, height) => {
    const total = width * height;
    const visited = new Uint8Array(total);
    const componentIds = new Int32Array(total);
    componentIds.fill(-1);

    const componentSizes = [];
    const queue = new Int32Array(total);
    let nextComponentId = 0;

    for (let index = 0; index < total; index += 1) {
      if (!mask[index] || visited[index]) continue;

      let head = 0;
      let tail = 0;
      queue[tail] = index;
      tail += 1;
      visited[index] = 1;
      componentIds[index] = nextComponentId;
      let size = 0;

      while (head < tail) {
        const current = queue[head];
        head += 1;
        size += 1;

        const x = current % width;
        const y = Math.floor(current / width);

        for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
          for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
            if (!deltaX && !deltaY) continue;
            const nextX = x + deltaX;
            const nextY = y + deltaY;
            if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
            const nextIndex = nextY * width + nextX;
            if (!mask[nextIndex] || visited[nextIndex]) continue;
            visited[nextIndex] = 1;
            componentIds[nextIndex] = nextComponentId;
            queue[tail] = nextIndex;
            tail += 1;
          }
        }
      }

      componentSizes[nextComponentId] = size;
      nextComponentId += 1;
    }

    if (!componentSizes.length) {
      return {
        mask,
        largestArea: 0,
      };
    }

    const largestArea = Math.max(...componentSizes);
    const minAreaToKeep = Math.max(120, Math.round(largestArea * 0.035));
    const filteredMask = new Uint8Array(total);

    for (let index = 0; index < total; index += 1) {
      const componentId = componentIds[index];
      if (componentId < 0) continue;
      if ((componentSizes[componentId] || 0) >= minAreaToKeep) {
        filteredMask[index] = 1;
      }
    }

    return {
      mask: filteredMask,
      largestArea,
    };
  };

  const buildSegmentation = (image) => {
    const sourceWidth = Number(image.naturalWidth || image.width || 0);
    const sourceHeight = Number(image.naturalHeight || image.height || 0);
    if (!sourceWidth || !sourceHeight) {
      throw new Error("Не удалось определить размер изображения.");
    }

    const scale = Math.min(1, ANALYSIS_MAX_SIDE / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new Error("Браузер не смог подготовить холст для обработки.");
    }
    context.drawImage(image, 0, 0, width, height);

    const { data } = context.getImageData(0, 0, width, height);
    const total = width * height;
    const ring = Math.max(2, Math.min(12, Math.round(Math.min(width, height) * 0.024)));
    const borderSamples = [];
    const luma = new Float32Array(total);
    const saturation = new Float32Array(total);
    const edgeResponse = new Float32Array(total);

    for (let index = 0; index < total; index += 1) {
      const color = getPixelColor(data, index);
      luma[index] = getLumaFromColor(color);
      saturation[index] = getSaturationFromColor(color);
    }

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        const color = getPixelColor(data, index);
        if (color.a < 12) continue;

        if (x < ring || y < ring || x >= width - ring || y >= height - ring) {
          borderSamples.push({
            r: color.r,
            g: color.g,
            b: color.b,
            luma: luma[index],
            saturation: saturation[index],
          });
        }

        let edge = 0;
        if (x > 0) edge = Math.max(edge, Math.abs(luma[index] - luma[index - 1]));
        if (x < width - 1) edge = Math.max(edge, Math.abs(luma[index] - luma[index + 1]));
        if (y > 0) edge = Math.max(edge, Math.abs(luma[index] - luma[index - width]));
        if (y < height - 1) edge = Math.max(edge, Math.abs(luma[index] - luma[index + width]));
        edgeResponse[index] = edge;
      }
    }

    if (borderSamples.length < 24) {
      throw new Error("Нужен более читаемый товарный кадр: не удалось собрать фон по краям изображения.");
    }

    const backgroundColor = {
      r: percentile(borderSamples.map((sample) => sample.r), 0.5),
      g: percentile(borderSamples.map((sample) => sample.g), 0.5),
      b: percentile(borderSamples.map((sample) => sample.b), 0.5),
    };
    const backgroundLuma = getLumaFromColor(backgroundColor);
    const backgroundSaturation = getSaturationFromColor(backgroundColor);

    const borderDistances = borderSamples.map((sample) => getColorDistance(sample, backgroundColor));
    const baseThreshold = clamp(percentile(borderDistances, 0.85) + 12, 18, 86);
    const growThreshold = clamp(baseThreshold + 12, 28, 104);
    const neighborThreshold = clamp(baseThreshold * 0.72, 14, 68);
    const edgeThreshold = clamp(percentile(Array.from(edgeResponse), 0.7) + 10, 18, 64);
    const lumaThreshold = clamp(baseThreshold * 1.15 + 12, 26, 78);
    const saturationThreshold = clamp(Math.max(backgroundSaturation + 28, 58), 58, 132);

    const backgroundDistance = new Float32Array(total);
    for (let index = 0; index < total; index += 1) {
      backgroundDistance[index] = getColorDistance(getPixelColor(data, index), backgroundColor);
    }

    const isLikelyBackgroundPixel = (index, previousIndex) => {
      const distanceToBackground = backgroundDistance[index];
      const currentLuma = luma[index];
      const currentSaturation = saturation[index];
      const edge = edgeResponse[index];
      const currentColor = getPixelColor(data, index);
      const previousColor = previousIndex >= 0 ? getPixelColor(data, previousIndex) : backgroundColor;
      const distanceToPrevious = getColorDistance(currentColor, previousColor);
      const lumaDelta = Math.abs(currentLuma - backgroundLuma);

      if (distanceToBackground <= baseThreshold && edge <= edgeThreshold * 1.45) return true;

      if (
        distanceToBackground <= growThreshold
        && distanceToPrevious <= neighborThreshold
        && lumaDelta <= lumaThreshold
        && edge <= edgeThreshold * 1.6
      ) {
        return true;
      }

      if (
        backgroundLuma >= 175
        && currentLuma >= backgroundLuma - 42
        && currentSaturation <= saturationThreshold
        && distanceToPrevious <= neighborThreshold * 1.2
        && edge <= edgeThreshold * 1.4
      ) {
        return true;
      }

      if (
        backgroundLuma <= 80
        && currentLuma <= backgroundLuma + 34
        && distanceToPrevious <= neighborThreshold * 1.18
        && edge <= edgeThreshold * 1.45
      ) {
        return true;
      }

      return false;
    };

    const backgroundMask = new Uint8Array(total);
    const visited = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0;
    let tail = 0;

    const trySeed = (index) => {
      if (visited[index]) return;
      visited[index] = 1;
      if (!isLikelyBackgroundPixel(index, -1)) return;
      backgroundMask[index] = 1;
      queue[tail] = index;
      tail += 1;
    };

    for (let x = 0; x < width; x += 1) {
      trySeed(x);
      trySeed((height - 1) * width + x);
    }
    for (let y = 0; y < height; y += 1) {
      trySeed(y * width);
      trySeed(y * width + (width - 1));
    }

    while (head < tail) {
      const current = queue[head];
      head += 1;
      const x = current % width;
      const y = Math.floor(current / width);

      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];

      for (const [nextX, nextY] of neighbors) {
        if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
        const nextIndex = nextY * width + nextX;
        if (visited[nextIndex]) continue;
        visited[nextIndex] = 1;
        if (!isLikelyBackgroundPixel(nextIndex, current)) continue;
        backgroundMask[nextIndex] = 1;
        queue[tail] = nextIndex;
        tail += 1;
      }
    }

    const foregroundMask = new Uint8Array(total);
    for (let index = 0; index < total; index += 1) {
      const color = getPixelColor(data, index);
      if (color.a < 12) continue;
      foregroundMask[index] = backgroundMask[index] ? 0 : 1;
    }

    const filtered = filterForegroundComponents(foregroundMask, width, height);
    if (!filtered.largestArea) {
      throw new Error("Не удалось уверенно выделить товар. Лучше работает фото с более чистым фоном.");
    }

    const bounds = findMaskBounds(filtered.mask, width, height);
    const maskCanvas = buildMaskCanvas(filtered.mask, width, height);

    return {
      key: state.sourceKey,
      image,
      sourceWidth,
      sourceHeight,
      analysisWidth: width,
      analysisHeight: height,
      maskCanvas,
      bounds,
      fullMaskCanvas: null,
      transparentCanvas: null,
    };
  };

  const ensureSegmentation = async () => {
    if (state.segmentationCache && state.segmentationCache.key === state.sourceKey) {
      return state.segmentationCache;
    }

    const image = await ensureSourceImage();
    state.segmentationCache = buildSegmentation(image);
    return state.segmentationCache;
  };

  const ensureFullMaskCanvas = (segmentation) => {
    if (segmentation.fullMaskCanvas) return segmentation.fullMaskCanvas;

    const canvas = document.createElement("canvas");
    canvas.width = segmentation.sourceWidth;
    canvas.height = segmentation.sourceHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      segmentation.fullMaskCanvas = canvas;
      return canvas;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.drawImage(segmentation.maskCanvas, 0, 0, canvas.width, canvas.height);
    segmentation.fullMaskCanvas = canvas;
    return canvas;
  };

  const ensureTransparentCanvas = (segmentation) => {
    if (segmentation.transparentCanvas) return segmentation.transparentCanvas;

    const canvas = document.createElement("canvas");
    canvas.width = segmentation.sourceWidth;
    canvas.height = segmentation.sourceHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      segmentation.transparentCanvas = canvas;
      return canvas;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(segmentation.image, 0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "destination-in";
    context.drawImage(ensureFullMaskCanvas(segmentation), 0, 0);
    context.globalCompositeOperation = "source-over";
    segmentation.transparentCanvas = canvas;
    return canvas;
  };

  const buildFullBounds = (segmentation) => {
    const scaleX = segmentation.sourceWidth / segmentation.analysisWidth;
    const scaleY = segmentation.sourceHeight / segmentation.analysisHeight;
    const paddingX = Math.max(4, Math.round(scaleX * 2));
    const paddingY = Math.max(4, Math.round(scaleY * 2));

    return {
      minX: Math.max(0, Math.floor(segmentation.bounds.minX * scaleX) - paddingX),
      minY: Math.max(0, Math.floor(segmentation.bounds.minY * scaleY) - paddingY),
      maxX: Math.min(segmentation.sourceWidth - 1, Math.ceil((segmentation.bounds.maxX + 1) * scaleX) + paddingX),
      maxY: Math.min(segmentation.sourceHeight - 1, Math.ceil((segmentation.bounds.maxY + 1) * scaleY) + paddingY),
    };
  };

  const canvasToBlob = (canvas) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Не удалось подготовить PNG для скачивания."));
          return;
        }
        resolve(blob);
      }, "image/png");
    });
  };

  const buildResultRecord = async (canvas, params) => {
    const blob = await canvasToBlob(canvas);
    const objectUrl = URL.createObjectURL(blob);
    return {
      blob,
      objectUrl,
      width: canvas.width,
      height: canvas.height,
      downloadName: params?.downloadName || "kartochka-tool-result.png",
      metaTitle: params?.metaTitle || "",
      metaText: params?.metaText || "",
    };
  };

  const buildBackgroundRemovalResult = async () => {
    const segmentation = await ensureSegmentation();
    const transparentCanvas = ensureTransparentCanvas(segmentation);
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = transparentCanvas.width;
    exportCanvas.height = transparentCanvas.height;
    const context = exportCanvas.getContext("2d");
    if (!context) {
      throw new Error("Не удалось подготовить прозрачный PNG.");
    }
    context.drawImage(transparentCanvas, 0, 0);

    return buildResultRecord(exportCanvas, {
      downloadName: buildDownloadName(state.sourceFile?.name, "background-removed"),
      metaTitle: "Прозрачный PNG",
      metaText: "Фон убран, исходное кадрирование сохранено: " + formatDimensions(exportCanvas.width, exportCanvas.height),
    });
  };

  const buildCutoutResult = async () => {
    const segmentation = await ensureSegmentation();
    const transparentCanvas = ensureTransparentCanvas(segmentation);
    const bounds = buildFullBounds(segmentation);
    const objectWidth = Math.max(1, bounds.maxX - bounds.minX + 1);
    const objectHeight = Math.max(1, bounds.maxY - bounds.minY + 1);
    const padding = Math.max(32, Math.round(Math.max(objectWidth, objectHeight) * 0.12));
    const side = Math.max(objectWidth, objectHeight) + padding * 2;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = side;
    exportCanvas.height = side;
    const context = exportCanvas.getContext("2d");
    if (!context) {
      throw new Error("Не удалось подготовить cutout PNG.");
    }
    const drawX = Math.round((side - objectWidth) / 2);
    const drawY = Math.round((side - objectHeight) / 2);
    context.clearRect(0, 0, side, side);
    context.imageSmoothingEnabled = true;
    context.drawImage(
      transparentCanvas,
      bounds.minX,
      bounds.minY,
      objectWidth,
      objectHeight,
      drawX,
      drawY,
      objectWidth,
      objectHeight
    );

    return buildResultRecord(exportCanvas, {
      downloadName: buildDownloadName(state.sourceFile?.name, "isolated-cutout"),
      metaTitle: "Изолированный cutout",
      metaText: "Товар собран на прозрачном квадрате: " + formatDimensions(exportCanvas.width, exportCanvas.height),
    });
  };

  const deriveToolCardState = (tool) => {
    if (!tool.available) return "Скоро";
    if (state.processing && state.selectedToolId === tool.id) return "Обработка";
    if (state.resultsByTool.has(tool.id)) return "Готово";
    if (state.sourceFile) return "Готов к запуску";
    return "Нужно фото";
  };

  const renderToolCards = () => {
    if (!elements.cardGrid) return;

    elements.cardGrid.innerHTML = TOOL_DEFINITIONS.map((tool) => {
      const isActive = tool.id === state.selectedToolId;
      const isDone = state.resultsByTool.has(tool.id);
      const isDisabled = !tool.available;
      const stateLabel = deriveToolCardState(tool);

      return [
        '<button class="tools-card',
        isActive ? " is-active" : "",
        isDone ? " is-done" : "",
        isDisabled ? " is-disabled" : "",
        '" type="button" data-tool-card-id="',
        tool.id,
        '"',
        ' aria-pressed="',
        isActive ? "true" : "false",
        '"',
        isDisabled ? ' aria-disabled="true"' : "",
        '>',
        '  <span class="tools-card-topline">',
        '    <span class="tools-card-capability">',
        tool.capability,
        "</span>",
        '    <span class="tools-card-state">',
        stateLabel,
        "</span>",
        "  </span>",
        '  <strong class="tools-card-title">',
        tool.title,
        "</strong>",
        '  <span class="tools-card-description">',
        tool.shortDescription,
        "</span>",
        "</button>",
      ].join("");
    }).join("");
  };

  const deriveDefaultStatus = () => {
    const tool = getSelectedTool();
    if (!state.sourceFile) {
      return {
        text: "Добавьте фото товара, чтобы запустить инструмент.",
        type: "",
        badge: "Ожидание фото",
        meta: "Ожидание фото",
      };
    }

    if (!tool.available) {
      return {
        text: tool.readyHint,
        type: "",
        badge: "Скоро",
        meta: "Инструмент в очереди",
      };
    }

    if (state.processing) {
      return {
        text: state.processingLabel || "Обрабатываем изображение...",
        type: "",
        badge: "Обработка",
        meta: state.processingLabel || "Обработка",
      };
    }

    if (state.resultsByTool.has(tool.id)) {
      return {
        text: tool.successHint,
        type: "success",
        badge: "Готово",
        meta: "Результат готов",
      };
    }

    return {
      text: tool.readyHint,
      type: "",
      badge: "Готов к запуску",
      meta: "Готов к запуску",
    };
  };

  render = () => {
    const tool = getSelectedTool();
    const result = getCurrentResult();
    const derivedStatus = deriveDefaultStatus();
    const status = state.noticeText
      ? { text: state.noticeText, type: state.noticeType || "" }
      : derivedStatus;

    renderToolCards();

    if (elements.workbenchTitle) {
      elements.workbenchTitle.textContent = tool.title;
    }
    if (elements.workbenchSubtitle) {
      elements.workbenchSubtitle.textContent = tool.description;
    }
    if (elements.outputBadge) {
      elements.outputBadge.textContent = derivedStatus.badge;
      elements.outputBadge.classList.toggle("is-disabled", !tool.available);
      elements.outputBadge.classList.toggle("is-ready", Boolean(state.sourceFile && tool.available && !state.processing));
      elements.outputBadge.classList.toggle("is-processing", state.processing);
      elements.outputBadge.classList.toggle("is-done", Boolean(result));
    }
    if (elements.footnote) {
      elements.footnote.textContent = tool.footnote;
    }
    if (elements.uploadTitle) {
      elements.uploadTitle.textContent = state.sourceFile ? "Фото готово к обработке" : "Добавьте фото товара";
    }
    if (elements.uploadHint) {
      elements.uploadHint.textContent = state.sourceFile
        ? "Можно сразу запускать выбранный инструмент или заменить исходник."
        : "Лучший результат обычно даёт чистый контрастный фон и один главный объект.";
    }

    const hasSource = Boolean(state.sourceUrl);
    const sourceSpecs = getSourceDimensionsText();

    if (elements.sourcePreview) {
      elements.sourcePreview.classList.toggle("hidden", !hasSource);
      if (hasSource) {
        elements.sourcePreview.src = state.sourceUrl;
      } else {
        elements.sourcePreview.removeAttribute("src");
      }
    }
    if (elements.sourceStageImage) {
      elements.sourceStageImage.classList.toggle("hidden", !hasSource);
      if (hasSource) {
        elements.sourceStageImage.src = state.sourceUrl;
      } else {
        elements.sourceStageImage.removeAttribute("src");
      }
    }
    if (elements.sourcePlaceholder) {
      elements.sourcePlaceholder.classList.toggle("hidden", hasSource);
    }
    if (elements.sourceStageEmpty) {
      elements.sourceStageEmpty.classList.toggle("hidden", hasSource);
    }
    if (elements.sourceMeta) {
      elements.sourceMeta.classList.toggle("hidden", !hasSource);
    }
    if (elements.sourceName) {
      elements.sourceName.textContent = state.sourceFile?.name || "";
    }
    if (elements.sourceSpecs) {
      elements.sourceSpecs.textContent = sourceSpecs || (state.sourceFile ? formatFileSize(state.sourceFile.size) : "");
    }
    if (elements.replaceBtn) {
      elements.replaceBtn.classList.toggle("hidden", !hasSource);
      elements.replaceBtn.toggleAttribute("disabled", state.processing);
    }
    if (elements.clearBtn) {
      elements.clearBtn.classList.toggle("hidden", !hasSource);
      elements.clearBtn.toggleAttribute("disabled", state.processing);
    }

    if (elements.resultLabel) {
      elements.resultLabel.textContent = tool.available ? "После" : "Скоро";
    }
    if (elements.resultPreview) {
      elements.resultPreview.classList.toggle("hidden", !result);
      if (result) {
        elements.resultPreview.src = result.objectUrl;
      } else {
        elements.resultPreview.removeAttribute("src");
      }
    }
    if (elements.resultEmpty) {
      elements.resultEmpty.textContent = tool.emptyHint;
      elements.resultEmpty.classList.toggle("hidden", Boolean(result));
    }
    if (elements.outputMetaTitle) {
      elements.outputMetaTitle.textContent = result?.metaTitle || tool.metaTitle;
    }
    if (elements.outputMetaText) {
      elements.outputMetaText.textContent = result?.metaText || tool.metaText;
    }
    if (elements.processingOverlay) {
      elements.processingOverlay.classList.toggle("hidden", !state.processing);
    }
    if (elements.processingLabel) {
      elements.processingLabel.textContent = state.processingLabel || "Обрабатываем изображение...";
    }

    if (elements.runBtn) {
      elements.runBtn.textContent = state.processing ? "Обрабатываем..." : tool.runLabel;
      elements.runBtn.toggleAttribute("disabled", state.processing || !hasSource || !tool.available);
    }
    if (elements.downloadBtn) {
      const hasDownload = Boolean(result?.objectUrl && result?.downloadName);
      elements.downloadBtn.classList.toggle("hidden", !hasDownload);
      if (hasDownload) {
        elements.downloadBtn.href = result.objectUrl;
        elements.downloadBtn.download = result.downloadName;
        elements.downloadBtn.textContent = tool.downloadLabel;
      } else {
        elements.downloadBtn.removeAttribute("href");
        elements.downloadBtn.removeAttribute("download");
      }
    }

    if (elements.status) {
      elements.status.textContent = status.text || "";
      elements.status.classList.remove("error", "success");
      if (status.type) {
        elements.status.classList.add(status.type);
      }
    }
    if (elements.requestMetaValue) {
      elements.requestMetaValue.textContent = state.noticeType === "error" ? "Нужна проверка" : derivedStatus.meta;
    }
  };

  setNotice = (text, type) => {
    state.noticeText = toText(text);
    state.noticeType = toText(type);
    render();
  };

  setSelectedTool = (toolId) => {
    if (!TOOL_MAP.has(toolId) || state.selectedToolId === toolId) return;
    state.selectedToolId = toolId;
    state.noticeText = "";
    state.noticeType = "";
    render();
  };

  const warmSourceImage = async () => {
    try {
      await ensureSourceImage();
      render();
    } catch (error) {
      setNotice(error?.message || "Не удалось подготовить изображение.", "error");
    }
  };

  const setSourceFile = (file) => {
    resetSource();
    state.sourceFile = file;
    state.sourceKey = buildSourceKey(file);
    state.sourceUrl = URL.createObjectURL(file);
    void warmSourceImage();
    render();
  };

  const validateFile = (file) => {
    if (!file) return "Файл не найден.";
    if (!ALLOWED_TYPES.has(file.type)) {
      return "Поддерживаются только PNG, JPG и WEBP.";
    }
    if ((Number(file.size) || 0) > MAX_UPLOAD_BYTES) {
      return "Максимальный размер файла — 18 МБ.";
    }
    return "";
  };

  handleFileList = (fileList) => {
    const file = fileList?.[0] || null;
    if (!file) return;
    const validationMessage = validateFile(file);
    if (validationMessage) {
      setNotice(validationMessage, "error");
      return;
    }
    setSourceFile(file);
  };

  executeSelectedTool = async () => {
    const tool = getSelectedTool();
    if (!state.sourceFile) {
      setNotice("Сначала добавьте фото товара.", "error");
      return;
    }
    if (!tool.available || state.processing) return;

    const requestId = state.requestId + 1;
    state.requestId = requestId;
    state.processing = true;
    state.noticeText = "";
    state.noticeType = "";
    state.processingLabel = "Анализируем фон...";
    render();

    try {
      await waitForPaint();

      let result;
      if (tool.id === "background-removal") {
        result = await buildBackgroundRemovalResult();
      } else if (tool.id === "cutout-export") {
        state.processingLabel = "Выделяем товар и собираем cutout...";
        render();
        await waitForPaint();
        result = await buildCutoutResult();
      } else {
        throw new Error("Этот инструмент будет доступен в следующем релизе.");
      }

      if (requestId !== state.requestId) return;

      const previousResult = state.resultsByTool.get(tool.id);
      if (previousResult) revokeResult(previousResult);
      state.resultsByTool.set(tool.id, result);
      state.processing = false;
      state.processingLabel = "";
      state.noticeText = "";
      state.noticeType = "";
      render();
    } catch (error) {
      if (requestId !== state.requestId) return;
      state.processing = false;
      state.processingLabel = "";
      setNotice(error?.message || "Не удалось выполнить обработку.", "error");
    }
  };

  elements.cardGrid?.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-tool-card-id]") : null;
    if (!(target instanceof HTMLElement)) return;
    setSelectedTool(target.dataset.toolCardId || "");
  });

  elements.fileInput?.addEventListener("change", () => {
    handleFileList(elements.fileInput?.files);
  });

  elements.replaceBtn?.addEventListener("click", () => {
    if (state.processing) return;
    elements.fileInput?.click();
  });

  elements.clearBtn?.addEventListener("click", () => {
    if (state.processing) return;
    resetSource();
    render();
  });

  elements.runBtn?.addEventListener("click", () => {
    void executeSelectedTool();
  });

  elements.uploadZone?.addEventListener("dragenter", (event) => {
    event.preventDefault();
    if (state.processing) return;
    elements.uploadZone?.classList.add("is-dragover");
  });

  elements.uploadZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (state.processing) return;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
    elements.uploadZone?.classList.add("is-dragover");
  });

  elements.uploadZone?.addEventListener("dragleave", (event) => {
    event.preventDefault();
    if (!event.currentTarget || !elements.uploadZone) return;
    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && elements.uploadZone.contains(relatedTarget)) return;
    elements.uploadZone.classList.remove("is-dragover");
  });

  elements.uploadZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    elements.uploadZone?.classList.remove("is-dragover");
    if (state.processing) return;
    handleFileList(event.dataTransfer?.files);
  });

  render();
})(window);
