"use strict";

const { toText } = require("./utils");

const BILLING_ACTIONS = Object.freeze({
  create_autofill: Object.freeze({
    code: "create_autofill",
    label: "Автозаполнить AI",
    tokens: 1,
    visible: true,
  }),
  create_generate_best: Object.freeze({
    code: "create_generate_best",
    label: "Сгенерировать карточку",
    tokens: 6,
    visible: true,
  }),
  create_generate_custom: Object.freeze({
    code: "create_generate_custom",
    label: "Сгенерировать карточку",
    tokens: 4,
    visible: true,
  }),
  create_prompt_assist: Object.freeze({
    code: "create_prompt_assist",
    label: "AI промт",
    tokens: 1,
    visible: false,
  }),
  create_insight: Object.freeze({
    code: "create_insight",
    label: "AI insight",
    tokens: 1,
    visible: false,
  }),
  create_category: Object.freeze({
    code: "create_category",
    label: "AI категория",
    tokens: 1,
    visible: false,
  }),
  improve_analyze: Object.freeze({
    code: "improve_analyze",
    label: "AI анализ",
    tokens: 1,
    visible: false,
  }),
  improve_generate: Object.freeze({
    code: "improve_generate",
    label: "Улучшить",
    tokens: 4,
    visible: false,
  }),
  enhance_card: Object.freeze({
    code: "enhance_card",
    label: "Улучшить",
    tokens: 4,
    visible: true,
  }),
});

const BILLING_PLANS = Object.freeze([
  Object.freeze({
    id: "start",
    title: "Start",
    priceLabel: "0 ₽",
    description: "Базовый доступ для теста сценария и стартовых промокодов.",
    statusLabel: "Текущий базовый план",
    ctaLabel: "Активен",
    isCurrentByDefault: true,
  }),
  Object.freeze({
    id: "pro",
    title: "Pro",
    priceLabel: "Скоро",
    description: "Для постоянной работы с товарами и регулярных генераций.",
    statusLabel: "Оплата подключается",
    ctaLabel: "Скоро",
    isCurrentByDefault: false,
  }),
  Object.freeze({
    id: "team",
    title: "Team",
    priceLabel: "Скоро",
    description: "Для команд и агентств с общим лимитом и управлением доступами.",
    statusLabel: "Оплата подключается",
    ctaLabel: "Скоро",
    isCurrentByDefault: false,
  }),
]);

const BILLING_TOKEN_PACKAGES = Object.freeze([
  Object.freeze({
    id: "pack_25",
    title: "25 токенов",
    tokens: 25,
    priceLabel: "Скоро",
    description: "Компактное пополнение для редких задач.",
    ctaLabel: "Скоро",
  }),
  Object.freeze({
    id: "pack_100",
    title: "100 токенов",
    tokens: 100,
    priceLabel: "Скоро",
    description: "Оптимальный пакет для регулярной работы.",
    ctaLabel: "Скоро",
  }),
  Object.freeze({
    id: "pack_300",
    title: "300 токенов",
    tokens: 300,
    priceLabel: "Скоро",
    description: "Запас токенов для команды и больших объёмов.",
    ctaLabel: "Скоро",
  }),
]);

const getBillingAction = (code) => {
  const safeCode = toText(code);
  return BILLING_ACTIONS[safeCode] || null;
};

const getPublicBillingCatalog = () => {
  return {
    actions: Object.values(BILLING_ACTIONS)
      .filter((entry) => entry.visible)
      .map((entry) => ({
        code: entry.code,
        label: entry.label,
        tokens: entry.tokens,
      })),
    plans: BILLING_PLANS.map((plan) => ({ ...plan })),
    tokenPackages: BILLING_TOKEN_PACKAGES.map((item) => ({ ...item })),
  };
};

module.exports = {
  BILLING_ACTIONS,
  BILLING_PLANS,
  BILLING_TOKEN_PACKAGES,
  getBillingAction,
  getPublicBillingCatalog,
};
