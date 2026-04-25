# Project Structure

Актуальная структура проекта `kartochka` после мерджа локальной версии и внешних доработок.

## Root

- `app.js` — основной frontend-код рабочего пространства и auth-flow.
- `site.js` — логика публичного лендинга и переходов в `/app`.
- `index.html` — shell приложения и внутренних экранов.
- `public.html` — публичный лендинг.
- `styles.css` — базовые стили проекта.
- `theme-refresh.css` — актуальные override-стили и UI-система.
- `site-overrides.css` — дополнительные стили для лендинга.
- `landing-override.css` — точечные переопределения landing-секций.
- `tools-module.js`, `tools.css` — модуль инструментов.
- `improve-card-flow.js` — flow улучшения карточки.
- `create-characteristics-component.js` — UI-компонент характеристик товара.
- `enhance-card-module.css`, `enhance-card-service.js`, `enhance-card-state.js` — модуль улучшения карточек.
- `server.js` — локальный Node server.
- `vercel.json` — конфигурация деплоя Vercel.
- `agent.md` — локальные инструкции для AI-агентов.

## API

- `api/kartochka.js` — агрегирующий handler для Vercel.
- `api/enhance-card.js` — route улучшения карточки.
- `api/kartochka/` — отдельные routes для create/improve/history/billing.
- `api/product/` — product-related API routes.

## Frontend Assets

- `assets/examples/` — примеры карточек для лендинга и UI.
- `assets/generated/` — локальные сгенерированные превью/демо-ассеты.

## Services Client

- `services/kartochka-services.js` — клиент для запросов с фронтенда к backend/API.

## Server

- `server/adapters/` — адаптеры провайдеров генерации и анализа.
- `server/providers/` — низкоуровневые клиенты OpenAI/OpenRouter.
- `server/prompts/` — инструкции и prompt-файлы.
- `server/routes/` — серверные маршруты.
- `server/services/` — бизнес-логика генерации, истории, биллинга и text replace.
- `server/services/text-replace/` — locator/editor/compositor/openrouter-client для замены текста.
- `server/services/image/` — image pipeline, crop/export/cache/upscale.
- `server/data/` — локальные runtime-данные (история, биллинг и т.д.).
- `server/api-request-handler.js`, `server/request-utils.js`, `server/config.js`, `server/runtime-services.js` — серверная инфраструктура.

## Scripts

- `scripts/release-verify.js` — smoke/consistency checks.
- `scripts/deploy-local-sync.sh` — локальный deploy script.
- `scripts/*.test.js` — точечные интеграционные и pipeline-тесты.

## Docs

- `docs/app-subdomain-deployment.md` — правила роутинга app-path.
- `docs/image-enhancement-pipeline.md` — описание image enhancement pipeline.
- `docs/project-structure.md` — этот файл.

## Local / Ignored Runtime

Эти сущности могут существовать локально, но не являются частью основной продуктовой структуры:

- `.env`, `.env.local` — локальные переменные окружения.
- `.vercel/` — локальная привязка Vercel.
- `node_modules/` — установленные зависимости.
- `.claude/` — локальные настройки Claude/Codex workflow.
- `server/data/*.json` — локальное состояние рантайма.
