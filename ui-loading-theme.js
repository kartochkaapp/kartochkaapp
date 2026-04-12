(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ROTATION_INTERVAL_MS = 2200;
  const activeRotators = new Map();

  const WAIT_COPY = Object.freeze({
    create: Object.freeze({
      title: "Генерация в работе",
      fallbackPhase: "Подготавливаем карточку",
      lines: Object.freeze([
        "Мы анализируем ваш товар и собираем базовую композицию.",
        "Подбираем более чистую иерархию для первого экрана.",
        "Собираем аккуратные варианты с читаемым акцентом.",
        "Проверяем подачу, чтобы карточка выглядела спокойно и продуктово.",
      ]),
    }),
    enhance: Object.freeze({
      title: "Улучшаем карточку",
      subtitle: "Сохраняем сам товар, упрощаем подачу и усиливаем читаемость.",
      lines: Object.freeze([
        "Мы разбираем текущую композицию и балансируем акценты.",
        "Чистим фон, воздух и контраст без тяжёлой стилизации.",
        "Проверяем заголовок, иерархию и читаемость ключевых зон.",
        "Собираем более аккуратную версию карточки для маркетплейса.",
      ]),
    }),
  });

  const createElement = (tagName, className, text) => {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  };

  const stopRotator = (key) => {
    const state = activeRotators.get(key);
    if (!state) return;
    if (state.timerId) {
      window.clearInterval(state.timerId);
    }
    activeRotators.delete(key);
  };

  const startRotator = (key, node, lines) => {
    if (!node || !Array.isArray(lines) || !lines.length) return;

    const current = activeRotators.get(key);
    if (current && current.node === node) return;

    stopRotator(key);
    node.textContent = lines[0];

    if (prefersReducedMotion || lines.length < 2) {
      activeRotators.set(key, { node, timerId: 0 });
      return;
    }

    let index = 0;
    const timerId = window.setInterval(() => {
      if (!node.isConnected) {
        stopRotator(key);
        return;
      }
      index = (index + 1) % lines.length;
      node.textContent = lines[index];
    }, ROTATION_INTERVAL_MS);

    activeRotators.set(key, { node, timerId });
  };

  const ensureCreateWaitPanel = () => {
    const host = document.getElementById("createPreviewCard");
    const anchor = document.getElementById("createMeta");
    if (!host || !anchor) return null;

    let panel = host.querySelector('[data-wait-panel="create"]');
    if (panel) return panel;

    panel = createElement("section", "ui-wait-panel hidden");
    panel.dataset.waitPanel = "create";
    panel.setAttribute("aria-hidden", "true");

    const head = createElement("div", "ui-wait-head");
    const kicker = createElement("span", "ui-wait-kicker", WAIT_COPY.create.fallbackPhase);
    const pulse = createElement("span", "ui-wait-pulse");
    pulse.setAttribute("aria-hidden", "true");
    head.append(kicker, pulse);

    const body = createElement("div", "ui-wait-body");
    const title = createElement("strong", "ui-wait-title", WAIT_COPY.create.title);
    const rotator = createElement("p", "ui-wait-rotator", WAIT_COPY.create.lines[0]);
    rotator.setAttribute("aria-hidden", "true");
    body.append(title, rotator);

    const progress = createElement("div", "ui-wait-progress");
    progress.setAttribute("aria-hidden", "true");
    progress.append(createElement("span", "ui-wait-progress-bar"));

    panel.append(head, body, progress);
    anchor.insertAdjacentElement("afterend", panel);
    return panel;
  };

  const syncCreateWaitPanel = () => {
    const trigger = document.getElementById("createGenerateBtn");
    const meta = document.getElementById("createMeta");
    const panel = ensureCreateWaitPanel();
    if (!trigger || !meta || !panel) return;

    const isBusy = trigger.classList.contains("is-loading");
    if (!isBusy) {
      panel.classList.add("hidden");
      panel.setAttribute("aria-hidden", "true");
      stopRotator("create");
      return;
    }

    const phaseText = meta.querySelector("strong")?.textContent?.trim() || WAIT_COPY.create.fallbackPhase;
    const kicker = panel.querySelector(".ui-wait-kicker");
    if (kicker) kicker.textContent = phaseText;

    panel.classList.remove("hidden");
    panel.setAttribute("aria-hidden", "false");
    startRotator("create", panel.querySelector(".ui-wait-rotator"), WAIT_COPY.create.lines);
  };

  const syncEnhanceOverlay = () => {
    const stage = document.getElementById("enhanceCardStage");
    const overlay = stage?.querySelector(".enhance-card-loading-overlay");

    if (!overlay) {
      stopRotator("enhance");
      return;
    }

    const copy = overlay.querySelector(".enhance-card-loading-copy");
    if (!copy) return;

    const title = copy.querySelector("strong");
    const subtitle = copy.querySelector("span");
    if (title) title.textContent = WAIT_COPY.enhance.title;
    if (subtitle) subtitle.textContent = WAIT_COPY.enhance.subtitle;

    let inline = copy.querySelector(".ui-wait-inline");
    if (!inline) {
      inline = createElement("div", "ui-wait-inline");

      const rotator = createElement("p", "ui-wait-rotator", WAIT_COPY.enhance.lines[0]);
      rotator.setAttribute("aria-hidden", "true");

      const progress = createElement("div", "ui-wait-progress");
      progress.setAttribute("aria-hidden", "true");
      progress.append(createElement("span", "ui-wait-progress-bar"));

      inline.append(rotator, progress);
      copy.append(inline);
    }

    startRotator("enhance", inline.querySelector(".ui-wait-rotator"), WAIT_COPY.enhance.lines);
  };

  const observe = (node, options, callback) => {
    if (!node) return null;
    const observer = new MutationObserver(() => {
      callback();
    });
    observer.observe(node, options);
    return observer;
  };

  const init = () => {
    const createTrigger = document.getElementById("createGenerateBtn");
    const createMeta = document.getElementById("createMeta");
    const enhanceStage = document.getElementById("enhanceCardStage");

    observe(createTrigger, { attributes: true, attributeFilter: ["class", "disabled"] }, syncCreateWaitPanel);
    observe(createMeta, { childList: true, subtree: true, characterData: true }, syncCreateWaitPanel);
    observe(enhanceStage, { childList: true, subtree: true }, syncEnhanceOverlay);

    syncCreateWaitPanel();
    syncEnhanceOverlay();
  };

  window.addEventListener("beforeunload", () => {
    Array.from(activeRotators.keys()).forEach(stopRotator);
  });

  init();
})();
