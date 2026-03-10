(function (global) {
  /**
   * @typedef {Object} CreateCharacteristicItem
   * @property {string} id
   * @property {string} label
   * @property {string} value
   * @property {number} order
   */

  /**
   * @typedef {Object} CreateCharacteristicsChangeMeta
   * @property {"input"|"change"|"add"|"add-preset"|"remove"|"move-up"|"move-down"|"external"} reason
   * @property {boolean} commit
   * @property {CreateCharacteristicItem[]} items
   */

  const DEFAULT_PRESETS = Object.freeze([
    "Материал",
    "Размер",
    "Цвет",
    "Вес",
    "Объём",
    "Комплектация",
  ]);

  const sanitizeText = (value) => String(value || "");

  const cloneCharacteristicItem = (item, fallbackOrder) => ({
    id: String(item?.id || ""),
    label: sanitizeText(item?.label),
    value: sanitizeText(item?.value),
    order: Number.isFinite(Number(item?.order)) ? Math.max(1, Math.floor(Number(item.order))) : fallbackOrder,
  });

  const normalizeCharacteristicItems = (items, createId) => {
    const sourceItems = Array.isArray(items) ? items : [];

    return sourceItems
      .map((item, index) => {
        const normalized = cloneCharacteristicItem(item, index + 1);
        if (!normalized.id) {
          normalized.id = createId();
        }
        return normalized;
      })
      .sort((left, right) => left.order - right.order)
      .map((item, index) => ({
        ...item,
        order: index + 1,
      }));
  };

  const moveCharacteristicItem = (items, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return items.slice();
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
      return items.slice();
    }

    const nextItems = items.slice();
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    return nextItems;
  };

  const create = (options) => {
    const listElement = options?.listElement || null;
    const emptyElement = options?.emptyElement || null;
    const presetsElement = options?.presetsElement || null;
    const addButton = options?.addButton || null;
    const presets = Array.isArray(options?.presets) && options.presets.length ? options.presets.slice() : DEFAULT_PRESETS.slice();
    const onChange = typeof options?.onChange === "function" ? options.onChange : () => {};
    const getDisabled = typeof options?.getDisabled === "function" ? options.getDisabled : () => Boolean(options?.disabled);

    let idCounter = 0;
    let items = [];
    let disabled = Boolean(options?.disabled);

    const createId = () => {
      idCounter += 1;
      return "metric-" + String(Date.now()) + "-" + String(idCounter);
    };

    const isDisabled = () => disabled || Boolean(getDisabled());

    const getItems = () => items.map((item) => ({ ...item }));

    const emitChange = (reason, commit) => {
      const snapshot = getItems();
      onChange(snapshot, {
        reason,
        commit: Boolean(commit),
        items: snapshot,
      });
    };

    const syncEmptyState = () => {
      emptyElement?.classList.toggle("hidden", items.length > 0);
    };

    const focusField = (characteristicId, field) => {
      if (!listElement || !characteristicId) return;

      requestAnimationFrame(() => {
        const selector =
          '[data-characteristic-id="' +
          String(characteristicId) +
          '"][data-characteristic-field="' +
          String(field || "label") +
          '"]';
        const node = listElement.querySelector(selector);
        if (!(node instanceof HTMLInputElement)) return;
        node.focus();
        node.select();
      });
    };

    const renderPresets = () => {
      if (!presetsElement) return;

      presetsElement.textContent = "";
      const usedLabels = new Set(
        items
          .map((item) => item.label.trim().toLowerCase())
          .filter(Boolean)
      );
      const controlsLocked = isDisabled();

      presets.forEach((presetLabel) => {
        const button = document.createElement("button");
        const isUsed = usedLabels.has(String(presetLabel).trim().toLowerCase());

        button.type = "button";
        button.className = "create-characteristic-preset";
        button.dataset.characteristicPreset = presetLabel;
        button.textContent = presetLabel;
        button.classList.toggle("is-used", isUsed);
        button.toggleAttribute("disabled", controlsLocked || isUsed);

        presetsElement.append(button);
      });
    };

    const renderList = () => {
      if (!listElement) return;

      listElement.textContent = "";
      const controlsLocked = isDisabled();

      items.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "create-characteristic-row";
        row.dataset.characteristicRowId = item.id;

        const order = document.createElement("span");
        order.className = "create-characteristic-order";
        order.textContent = String(index + 1);

        const labelInput = document.createElement("input");
        labelInput.type = "text";
        labelInput.className = "create-characteristic-input";
        labelInput.placeholder = "Например: Материал";
        labelInput.value = item.label;
        labelInput.dataset.characteristicField = "label";
        labelInput.dataset.characteristicId = item.id;
        labelInput.toggleAttribute("disabled", controlsLocked);

        const valueInput = document.createElement("input");
        valueInput.type = "text";
        valueInput.className = "create-characteristic-input";
        valueInput.placeholder = "Например: 100% хлопок";
        valueInput.value = item.value;
        valueInput.dataset.characteristicField = "value";
        valueInput.dataset.characteristicId = item.id;
        valueInput.toggleAttribute("disabled", controlsLocked);

        const actions = document.createElement("div");
        actions.className = "create-characteristic-actions";

        const moveUpButton = document.createElement("button");
        moveUpButton.type = "button";
        moveUpButton.className = "create-characteristic-icon-btn";
        moveUpButton.dataset.moveCharacteristicId = item.id;
        moveUpButton.dataset.moveDirection = "up";
        moveUpButton.textContent = "↑";
        moveUpButton.setAttribute("aria-label", "Поднять характеристику выше");
        moveUpButton.toggleAttribute("disabled", controlsLocked || index === 0);

        const moveDownButton = document.createElement("button");
        moveDownButton.type = "button";
        moveDownButton.className = "create-characteristic-icon-btn";
        moveDownButton.dataset.moveCharacteristicId = item.id;
        moveDownButton.dataset.moveDirection = "down";
        moveDownButton.textContent = "↓";
        moveDownButton.setAttribute("aria-label", "Опустить характеристику ниже");
        moveDownButton.toggleAttribute("disabled", controlsLocked || index === items.length - 1);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "create-characteristic-remove";
        removeButton.dataset.removeCharacteristicId = item.id;
        removeButton.textContent = "Удалить";
        removeButton.toggleAttribute("disabled", controlsLocked);

        actions.append(moveUpButton, moveDownButton, removeButton);
        row.append(order, labelInput, valueInput, actions);
        listElement.append(row);
      });
    };

    const render = () => {
      items = normalizeCharacteristicItems(items, createId);
      renderPresets();
      renderList();
      syncEmptyState();
    };

    const setItems = (nextItems, config) => {
      items = normalizeCharacteristicItems(nextItems, createId);
      render();

      if (config?.silent !== false) return;
      emitChange("external", Boolean(config?.commit));
    };

    const setDisabled = (nextDisabled) => {
      disabled = Boolean(nextDisabled);
      render();
    };

    const addItem = (labelValue, reason) => {
      const nextItem = {
        id: createId(),
        label: sanitizeText(labelValue),
        value: "",
        order: items.length + 1,
      };

      items = normalizeCharacteristicItems(items.concat(nextItem), createId);
      render();
      emitChange(reason || "add", true);
      focusField(nextItem.id, labelValue ? "value" : "label");
    };

    const updateField = (characteristicId, field, value, commit) => {
      const nextField = field === "label" ? "label" : field === "value" ? "value" : "";
      if (!nextField) return;

      const currentItem = items.find((item) => item.id === characteristicId);
      if (!currentItem) return;

      currentItem[nextField] = sanitizeText(value);
      emitChange(commit ? "change" : "input", Boolean(commit));
    };

    const removeItem = (characteristicId) => {
      const nextItems = items.filter((item) => item.id !== characteristicId);
      if (nextItems.length === items.length) return;

      items = normalizeCharacteristicItems(nextItems, createId);
      render();
      emitChange("remove", true);
    };

    const moveItem = (characteristicId, direction) => {
      const currentIndex = items.findIndex((item) => item.id === characteristicId);
      if (currentIndex < 0) return;

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;

      items = normalizeCharacteristicItems(moveCharacteristicItem(items, currentIndex, targetIndex), createId);
      render();
      emitChange(direction === "up" ? "move-up" : "move-down", true);
      focusField(characteristicId, "label");
    };

    const handleListInput = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      const characteristicId = String(target.dataset.characteristicId || "").trim();
      const field = String(target.dataset.characteristicField || "").trim();
      if (!characteristicId || !field) return;

      updateField(characteristicId, field, target.value, false);
    };

    const handleListChange = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      const characteristicId = String(target.dataset.characteristicId || "").trim();
      const field = String(target.dataset.characteristicField || "").trim();
      if (!characteristicId || !field) return;

      updateField(characteristicId, field, target.value, true);
    };

    const handleListClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const removeButton = target.closest("[data-remove-characteristic-id]");
      if (removeButton instanceof HTMLElement) {
        removeItem(String(removeButton.dataset.removeCharacteristicId || "").trim());
        return;
      }

      const moveButton = target.closest("[data-move-characteristic-id]");
      if (moveButton instanceof HTMLElement) {
        const characteristicId = String(moveButton.dataset.moveCharacteristicId || "").trim();
        const direction = String(moveButton.dataset.moveDirection || "").trim();
        if (!characteristicId || (direction !== "up" && direction !== "down")) return;
        moveItem(characteristicId, direction);
      }
    };

    const handlePresetsClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const presetButton = target.closest("[data-characteristic-preset]");
      if (!(presetButton instanceof HTMLElement)) return;

      const presetLabel = String(presetButton.dataset.characteristicPreset || "").trim();
      if (!presetLabel) return;
      addItem(presetLabel, "add-preset");
    };

    const handleAddClick = () => {
      addItem("", "add");
    };

    listElement?.addEventListener("input", handleListInput);
    listElement?.addEventListener("change", handleListChange);
    listElement?.addEventListener("click", handleListClick);
    presetsElement?.addEventListener("click", handlePresetsClick);
    addButton?.addEventListener("click", handleAddClick);

    setItems(options?.initialItems || [], { silent: true });

    return {
      setItems,
      setDisabled,
      getItems,
      addItem,
      refresh: render,
      destroy() {
        listElement?.removeEventListener("input", handleListInput);
        listElement?.removeEventListener("change", handleListChange);
        listElement?.removeEventListener("click", handleListClick);
        presetsElement?.removeEventListener("click", handlePresetsClick);
        addButton?.removeEventListener("click", handleAddClick);
      },
    };
  };

  global.CreateCharacteristicsComponent = Object.freeze({
    create,
    DEFAULT_PRESETS,
    normalizeItems(items) {
      let fallbackCounter = 0;
      return normalizeCharacteristicItems(items, () => {
        fallbackCounter += 1;
        return "metric-" + String(fallbackCounter);
      });
    },
  });
})(window);
