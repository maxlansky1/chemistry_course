# AGENTS.md — карта проекта для агента

Курс интерактивной химии: JSON-данные + Markdown-черновики → автономные офлайн-HTML.
Полный контекст — `README.md`. Здесь — **что где лежит и какой скилл когда звать**.

## Skills

Проектные скиллы лежат в `.opencode/skills/`. Порядок вызовов:

| Задача | Скилл |
|---|---|
| Спланировать/написать/переписать урок из `lesson.md` | `chemistry-lesson` (мастер) |
| Тесты, квизы, drop-игры, сценарии, таймлайны, оборудование | `chemistry-interactive` |
| Проверка педагогического качества готового урока | `chemistry-review` |
| Симуляции | `chemistry-sim` (пишется после P2: `makeSim`/`ChemDraw`) |

`chemistry-lesson` **вызывает** `chemistry-interactive` для тестов/игр и
`chemistry-sim` для симуляций; в конце может позвать `chemistry-review`.

## Где что лежит

| Что | Путь |
|---|---|
| Структура курса (уровни, модули, статусы) | `course.json` |
| Мета и порядок уроков модуля | `src/lessons/module_N/module.json` |
| Урок: черновик / канон / ответы | `src/lessons/module_N/uN/{lesson.md, body.html, answers.md}` |
| Канон блоков и CSS-классов | `src/shared/data/components.json` |
| Дизайн-система (принципы, каркас, quiz, симы) | `DESIGN.md` |
| Визуальные сущности (CPK, LOD, отрисовка) | `SIMULATIONS.md` |
| Термины / элементы / тексты результатов / реестр симов | `src/shared/data/{glossary,elements,messages,sims}.json` |
| Оболочка HTML | `src/shared/shell.html` |
| Движки | `src/shared/js/` |
| Собранные файлы (коммитятся) | `dist/` |
| Старые монолиты (только чтение) | `modules/legacy/` |

## Команды

```bash
python3 src/build.py module_1        # собрать модуль
python3 src/lint.py module_1         # ворота «готово» (ERROR/WARN)
python3 src/build.py module_1 --send # собрать и отправить в Telegram
```

**Перед сдачей урока обязательно:** `python3 src/lint.py <module>` → `LINT OK`, затем
`python3 src/build.py <module>` → все уроки `OK`.

## Жёсткие правила

- Классы — **только** из `src/shared/data/components.json`. Нет класса — не выдумывать,
  а добавить компонент в реестр (или использовать утилиту).
- **Инлайн-`style` в контенте запрещён** (`lint` ловит).
- `lesson.md` билдер не читает — это черновик для агента; канон собирает агент.
- Тесты — JSON-островок `<script type="application/json" id="quiz-…-data">`, не хардкод в JS.
- Ответы (Фейнман, ★, тесты) — только в `answers.md`, в урок не встраивать.
- Порог тестов 80% везде; без полбалла; повторы неограниченны; блокировки нет.
- Автономность: ноль внешних `<script src>`/`<link>`/CDN; всё инлайнит билдер.
- Главный сценарий — вертикальный телефон; тап ≥44px; hover дублируется тапом.
- `dist/` коммитится; версии — одна ветка `main` + теги на готовые модули.
- `.env` (токен бота), `.repowise/`, `.mcp.json`, `.claude/`, `.vscode/` — не коммитить.

## Статус

- `module_1` — **готов** (канон, `lint OK`, тег `module-1-v1`).
- `module_2` — ещё на `manifest.json` и легаси-классах; `lint` падает намеренно.
  Миграция — следующий подпроект (P2-сосед).
