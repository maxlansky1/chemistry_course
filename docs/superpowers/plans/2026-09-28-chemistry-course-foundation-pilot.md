# Единый каркас курса: фундамент + пилот Модуля 1 — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заложить машинный каркас «данные → канон → билдер → линт → движок» и привести Модуль 1 к нему как эталон.

**Architecture:** Источники правды — JSON-файлы (`course.json`, `components.json`, `glossary.json`, `elements.json`, `messages.json`, `sims.json`, единый `module.json`). Python-билдер без внешних зависимостей собирает автономные HTML-файлы, `lint.py` проверяет канон, единый `quiz.js` обслуживает все тесты. Markdown — черновик автора, билдер его не читает.

**Tech Stack:** Python 3 (stdlib), чистый JS/HTML/CSS (без библиотек), Node только для `node --check`.

**Spec:** `docs/superpowers/specs/2026-09-28-chemistry-course-refactor-design.md`

## Global Constraints

- Python 3, только стандартная библиотека. Никаких новых зависимостей, ни `npm`, ни `pip`.
- JS/CSS/HTML без внешних библиотек; шрифты — системный стек. Автономный офлайн-файл.
- Все CSS/JS инлайнятся билдером. Никаких CDN/`<link>`/внешних `<script src>`.
- Тексты, комментарии, имена блоков — русские слова допустимы в контенте; код/идентификаторы — латиница.
- Имена папок модулей: `module_1`, `module_2`, …; уроков: `u1`, `u2`, `final`, `entry`.
- В контенте запрещены инлайн-`style="..."` и классы вне `components.json`.
- Тесты: порог 80% везде; без полбалла/второй попытки; неограниченный ретрай; без блокировки.
- Тесты самопроверки, 3 типа вопросов: `single`, `multi`, `match`. `why` обязателен.
- Тап-зоны ≥44px; hover дублируется тапом; вертикальный телефон 390×844 — главный сценарий.
- Эмодзи допустимы. Тёмная тема/печать/бренд/прогресс — вне скоупа.
- `dist/` коммитится. Одна ветка. Никакого CI.
- Нет тестового фреймворка (без pytest/jest). Проверка = `node --check`, `lint.py`,
  `build.py` + ручной просмотр на телефоне.
- Каждая правка контента завершается зелёным `lint.py` и пересборкой модуля.

---

## File Structure

**Создаются:**
- `course.json` — структура курса (уровни, модули, темы, навыки, пререк, статус).
- `BACKLOG.md` — версионируемый бэклог.
- `src/shared/data/components.json` — реестр канонических блоков.
- `src/shared/data/glossary.json` — термины (конвертация из `data/glossary.md`).
- `src/shared/data/elements.json` — перенос из `data/elements.json`.
- `src/shared/data/messages.json` — банк текстов результатов.
- `src/shared/data/sims.json` — реестр симуляций.
- `src/shared/shell.html` — вынесенный HTML-шаблон оболочки.
- `src/shared/js/quiz.js` — единый тестовый движок.
- `src/lint.py` — проверки ERROR/WARN.
- `src/lessons/module_1/module.json` — единый манифест модуля.
- `src/lessons/module_1/u*/lesson.md`, `answers.md`.
- `docs/superpowers/specs/2026-09-28-chemistry-course-refactor-design.md` — уже создана.

**Модифицируются:**
- `src/build.py` — подкоманды `new`, `--send`; чтение `module.json`/`course.json`;
  авто-подбор css/js; использование `shell.html`; отчёт.
- `src/lessons/module_1/u*/body.html` — канон, JSON-островки, без инлайн-стилей.
- `.gitignore` — разрешить `data/` внутри `src/shared`; `dist/` больше не игнорируется.
- `DESIGN.md`, `STRUCTURE.md`, `PROGRAM.md`, `SIMULATIONS.md`, `SOURCES.md` — синхронизация с решениями.
- `src/shared/css/core.css`, `js/*.js` — только косметические правки по мере миграции.

**Удаляются (после проверки пилота):**
- `src/lessons/mod01/`, `src/lessons/mod02/` (переименование → `module_1/`, `module_2/`).
- `data/` (после переноса в `src/shared/data/`).
- `modules/mod01/` (ручная сборка) — после подтверждения пилота.
- `package.json`, `package-lock`, `.mcp.json`, `.claude/`, `.vscode/` — мусор окружения,
  удалить из репозитория (по согласованию; в план включено как отдельный шаг с проверкой).

---

### Task 1: Git-репозиторий и гигиена

**Files:**
- Create: `.gitignore` (перезапись), `BACKLOG.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: —
- Produces: git-репозиторий, о котором зависят все коммиты последующих задач.

- [ ] **Step 1: Инициализировать git**

Run:
```bash
cd /home/gjkvjhab/chemistry_course
git init
git branch -M main
```
Expected: `Initialized empty Git repository`.

- [ ] **Step 2: Переписать `.gitignore`**

```gitignore
.env
__pycache__/
*.pyc
*.pyo
.DS_Store
node_modules/
.venv/
.idea/
.vscode/
.claude/
.mcp.json
```
Примечание: **`dist/` больше не игнорируется** (решение: коммитим собранные файлы).

- [ ] **Step 3: Создать `BACKLOG.md`**

```markdown
# BACKLOG

## Инфраструктура
- Разбиение `core.css` по темам.
- Lazy-load тяжёлых симуляций (после появления сайта/роутера).
- Сайт/роутер: сигнал даёт автор; переезд на `shared` (DESIGN §1.5).

## Контент и методика
- Spaced repetition и другие приёмы «учиться учиться» (сейчас только Фейнман).
- Банк типичных заблуждений и ловушки.
- Медиа: фото реакций, гифки, шортсы — внешними ссылками.

## Интерактив
- Интерактивная таблица элементов (Модуль 7).
- `sandbox`-конструкторы молекул (Модуль водорода и далее).

## Оценка и платформа
- Приём домашек ботом (ученик → бот → автор).
- Аналитика обучения (что валится).
- Личный кабинет/прогресс, идентификация.

## Далеко
- Монетизация (отдельная большая задача).
- Другие предметы на том же каркасе (алгебра, геометрия).
- Локализация.
```

- [ ] **Step 4: Первый коммит**

Run:
```bash
git add .gitignore BACKLOG.md docs/
git commit -m "chore: init repo, gitignore, backlog, design spec"
```
Expected: коммит создан.

---

### Task 2: `course.json`

**Files:**
- Create: `course.json`

**Interfaces:**
- Consumes: —
- Produces: `course.json`; поля читает `build.py` (Task 14) для карты курса и отчёта.

- [ ] **Step 1: Создать `course.json`**

```json
{
  "title": "Единый курс химии",
  "year": 2026,
  "levels": [
    {
      "id": "A",
      "title": "Фундамент",
      "modules": [
        {
          "id": "module_1",
          "title": "Химия как наука",
          "themes": ["Что изучает химия", "Тела и вещества", "Свойства веществ", "Методы познания", "Безопасность и оборудование"],
          "skills": ["различать тело и вещество", "описывать вещество по плану", "работать в лаборатории безопасно"],
          "prereq": [],
          "lessons_count": 4,
          "time": "~1 час",
          "status": "draft",
          "icon": "🧪"
        },
        {
          "id": "module_2",
          "title": "Агрегатные состояния и смеси",
          "themes": ["Агрегатные состояния", "Переходы и смеси", "Разделение смесей"],
          "skills": ["различать чистые вещества и смеси", "выбирать способ разделения"],
          "prereq": ["module_1"],
          "lessons_count": 5,
          "time": "~1,5 часа",
          "status": "draft",
          "icon": "💧"
        },
        {
          "id": "module_3",
          "title": "Химические явления",
          "themes": ["Признаки реакций", "Закон сохранения массы"],
          "skills": ["отличать реакцию от физического явления"],
          "prereq": ["module_2"],
          "lessons_count": 4,
          "time": "~1,5 часа",
          "status": "draft",
          "icon": "🔥"
        },
        {
          "id": "module_4",
          "title": "Атомы и молекулы",
          "themes": ["Модели атома", "Молекулы", "Джонстон с 4б"],
          "skills": ["объяснять вещества через частицы"],
          "prereq": ["module_3"],
          "lessons_count": 5,
          "time": "~2 часа",
          "status": "draft",
          "icon": "⚛️"
        }
      ]
    },
    {
      "id": "B",
      "title": "Количественный язык",
      "modules": [
        { "id": "module_5", "title": "Количественные отношения", "themes": ["Моль", "Масса", "Объём"], "skills": ["решать задачи на количество вещества"], "prereq": ["module_4"], "lessons_count": 5, "time": "~2 часа", "status": "draft", "icon": "⚖️" },
        { "id": "module_6", "title": "Уравнения и расчёты", "themes": ["Уравнения реакций", "Расчёты"], "skills": ["уравнивать и считать"], "prereq": ["module_5"], "lessons_count": 5, "time": "~2 часа", "status": "draft", "icon": "🧮" }
      ]
    },
    {
      "id": "C",
      "title": "Теоретическое ядро",
      "modules": [
        { "id": "module_7", "title": "Периодический закон", "themes": ["Периодическая таблица"], "skills": ["видеть закономерности"], "prereq": ["module_6"], "lessons_count": 5, "time": "~2 часа", "status": "draft", "icon": "📊" },
        { "id": "module_8", "title": "Строение атома", "themes": ["Электроны", "Орбитали"], "skills": ["объяснять строение"], "prereq": ["module_7"], "lessons_count": 5, "time": "~2 часа", "status": "draft", "icon": "🌀" },
        { "id": "module_9", "title": "Химическая связь", "themes": ["Связи", "Молекулы"], "skills": ["определять тип связи"], "prereq": ["module_8"], "lessons_count": 5, "time": "~2 часа", "status": "draft", "icon": "🔗" }
      ]
    },
    {
      "id": "D",
      "title": "Элементы и их соединения",
      "modules": [
        { "id": "module_10", "title": "Кислород. Водород. Вода. Растворы", "themes": ["Кислород", "Водород", "Вода", "Растворы"], "skills": ["описывать свойства"], "prereq": ["module_9"], "lessons_count": 6, "time": "~2,5 часа", "status": "draft", "icon": "🌊" },
        { "id": "module_11", "title": "Основные классы соединений", "themes": ["Оксиды", "Кислоты", "Основания", "Соли"], "skills": ["классифицировать"], "prereq": ["module_10"], "lessons_count": 6, "time": "~2,5 часа", "status": "draft", "icon": "🧫" },
        { "id": "module_12", "title": "Растворы электролитов", "themes": ["Диссоциация", "Ионные реакции"], "skills": ["писать ионные уравнения"], "prereq": ["module_11"], "lessons_count": 5, "time": "~2 часа", "status": "draft", "icon": "⚡" }
      ]
    },
    {
      "id": "E",
      "title": "Окислительно-восстановительные процессы",
      "modules": [
        { "id": "module_13", "title": "ОВР", "themes": ["Степени окисления", "ОВР"], "skills": ["уравнивать ОВР"], "prereq": ["module_12"], "lessons_count": 5, "time": "~2 часа", "status": "draft", "icon": "🔋" }
      ]
    },
    {
      "id": "F",
      "title": "Систематизация",
      "modules": [
        { "id": "module_14", "title": "Обобщение неорганической химии", "themes": ["Связи между классами", "Генетические ряды"], "skills": ["видеть систему"], "prereq": ["module_13"], "lessons_count": 5, "time": "~2 часа", "status": "draft", "icon": "🗺️" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Проверить валидность JSON**

Run:
```bash
python3 -c "import json; d=json.load(open('course.json')); print(sum(len(l['modules']) for l in d['levels']), 'modules')"
```
Expected: `14 modules`.

- [ ] **Step 3: Commit**

```bash
git add course.json
git commit -m "feat(data): add course.json structure (14 modules)"
```

---

### Task 3: Перенос и преобразование справочных данных

**Files:**
- Create: `src/shared/data/elements.json`, `glossary.json`, `messages.json`, `sims.json`
- Delete: `data/elements.json`, `data/glossary.md`

**Interfaces:**
- Consumes: `data/elements.json`, `data/glossary.md`.
- Produces: JSON-файлы в `src/shared/data/`; `glossary.json` читает автоподсветка (Task 12);
  `messages.json` читает `quiz.js` (Task 11); `elements.json` — `ChemDraw` (P2).

- [ ] **Step 1: Создать каталог и перенести `elements.json`**

Run:
```bash
mkdir -p src/shared/data
git mv data/elements.json src/shared/data/elements.json
```

- [ ] **Step 2: Создать `src/shared/data/glossary.json`**

```json
{
  "вещество": { "definition": "то, из чего состоят физические тела", "module": "module_1" },
  "физическое тело": { "definition": "отдельный предмет, имеющий форму и объём", "module": "module_1" },
  "свойство вещества": { "definition": "признак, по которому вещества различают и описывают", "module": "module_1" },
  "наблюдение": { "definition": "внимательное изучение явления без вмешательства в процесс", "module": "module_1" },
  "эксперимент": { "definition": "изучение явления через активное воздействие на вещество", "module": "module_1" },
  "измерение": { "definition": "сравнение величины с эталоном", "module": "module_1" },
  "моделирование": { "definition": "замена объекта упрощённой схемой для изучения", "module": "module_1" },
  "гипотеза": { "definition": "разумное предположение, которое ещё нужно проверить", "module": "module_1" },
  "лаборатория": { "definition": "помещение со специальным оборудованием для опытов", "module": "module_1" },
  "агрегатное состояние": { "definition": "состояние вещества (твёрдое, жидкое, газообразное) при данных условиях", "module": "module_2" },
  "плавление": { "definition": "переход вещества из твёрдого состояния в жидкое при нагревании", "module": "module_2" },
  "кипение": { "definition": "переход жидкости в газ по всему объёму при температуре кипения", "module": "module_2" },
  "конденсация": { "definition": "переход вещества из газообразного состояния в жидкое при охлаждении", "module": "module_2" },
  "замерзание": { "definition": "переход жидкости в твёрдое состояние при охлаждении", "module": "module_2" },
  "сублимация": { "definition": "переход вещества из твёрдого состояния сразу в газообразное, минуя жидкость", "module": "module_2" },
  "чистое вещество": { "definition": "вещество, состоящее из одинаковых частиц", "module": "module_2" },
  "смесь": { "definition": "система из разных веществ, сохраняющих свои свойства", "module": "module_2" },
  "гомогенная смесь": { "definition": "однородная смесь, составные части неразличимы глазом", "module": "module_2" },
  "гетерогенная смесь": { "definition": "неоднородная смесь, части различимы", "module": "module_2" },
  "отстаивание": { "definition": "разделение смеси по разной плотности: тяжёлое оседает", "module": "module_2" }
}
```

- [ ] **Step 3: Создать `src/shared/data/messages.json`**

```json
{
  "entryFail": [
    "Не страшно — сейчас всё узнаешь. Повтори предыдущий урок и пройди входной снова.",
    "Это входной тест, а не оценка. Загляни в прошлый урок и попробуй ещё раз."
  ],
  "finalPass": [
    "🎉 Модуль пройден!",
    "🎉 Отлично, ты справился с итоговым тестом!"
  ],
  "finalFail": [
    "Есть над чем поработать. Вернись к текущему уроку и попробуй ещё раз.",
    "Пока не хватает до порога. Перечитай урок и пройди снова."
  ],
  "warmupDone": [
    "Разминка пройдена.",
    "Разминка готова — двигаемся дальше."
  ],
  "practiceDone": [
    "Хорошо! Двигаемся дальше.",
    "Верно! Закрепим это в тетради."
  ]
}
```

- [ ] **Step 4: Создать `src/shared/data/sims.json`**

```json
{
  "state_of_matter": { "title": "Агрегатные состояния", "type": "tune", "used_in": ["module_2/u1"], "status": "draft" },
  "heating_graph": { "title": "График нагрева", "type": "tune", "used_in": ["module_2/u2"], "status": "draft" },
  "separation_cards": { "title": "Способы разделения", "type": "map", "used_in": ["module_2/u3"], "status": "draft" }
}
```

- [ ] **Step 5: Удалить старый `data/` каталог**

Run:
```bash
git rm data/glossary.md
rmdir data 2>/dev/null || true
ls data 2>/dev/null || echo "data removed"
```
Expected: `data removed`.

- [ ] **Step 6: Проверить JSON**

Run:
```bash
for f in src/shared/data/*.json; do python3 -c "import json,sys; json.load(open('$f'))" && echo "$f OK"; done
```
Expected: 4 строки `... OK`.

- [ ] **Step 7: Commit**

```bash
git add src/shared/data
git commit -m "feat(data): move reference data into src/shared/data, add glossary/messages/sims JSON"
```

---

### Task 4: Реестр компонентов `components.json`

**Files:**
- Create: `src/shared/data/components.json`

**Interfaces:**
- Consumes: текущие классы из `src/shared/css/core.css` и `DESIGN.md §3`.
- Produces: `components.json` с массивом `components[]`; читают `build.py` (авто-подбор
  css/js, Task 9) и `lint.py` (Task 13). Поля каждого блока: `id`, `purpose`, `classes`,
  `required_attrs`, `allowed_variants`, `children`, `produces {css, js}`, `example`.

- [ ] **Step 1: Создать `src/shared/data/components.json`**

Данные, классы и `produces` скопированы из `core.css` и `DESIGN.md §3`. Ниже — полный
минимальный набор, покрывающий текущие уроки.

```json
{
  "version": "1.0",
  "components": [
    { "id": "hero", "purpose": "Шапка урока: бейдж, заголовок, QA", "classes": ["hero", "badge"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": [] }, "example": "<header class=\"hero\"><div class=\"badge\">…</div><h1>…</h1></header>" },
    { "id": "container", "purpose": "Контейнер контента", "classes": ["container"], "required_attrs": [], "children": "block", "produces": { "css": "core", "js": [] }, "example": "<div class=\"container\">…</div>" },
    { "id": "stage", "purpose": "Этап/секция урока", "classes": ["section", "stage", "stage-header", "stage-number", "stage-title", "stage-subtitle"], "required_attrs": [], "children": "block", "produces": { "css": "core", "js": [] }, "example": "<section class=\"stage\"><div class=\"stage-header\">…</div></section>" },
    { "id": "callout", "purpose": "Смысловой блок", "classes": ["callout", "callout-idea", "callout-warn", "callout-note", "callout-ok"], "required_attrs": [], "allowed_variants": ["idea", "warn", "note", "ok"], "children": "inline", "produces": { "css": "core", "js": [] }, "example": "<div class=\"callout callout-warn\">…</div>" },
    { "id": "cta", "purpose": "Призыв к действию", "classes": ["cta"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": [] }, "example": "<div class=\"cta\">…</div>" },
    { "id": "card-grid", "purpose": "Сетка карточек", "classes": ["card-grid", "card"], "required_attrs": [], "children": "block", "produces": { "css": "core", "js": [] }, "example": "<div class=\"card-grid\"><div class=\"card\">…</div></div>" },
    { "id": "task-grid", "purpose": "Сетка задач", "classes": ["task-grid", "task-card"], "required_attrs": [], "children": "block", "produces": { "css": "core", "js": [] }, "example": "<div class=\"task-grid\"><div class=\"task-card\">…</div></div>" },
    { "id": "legend", "purpose": "Легенда модуля", "classes": ["legend-grid", "legend-card"], "required_attrs": [], "children": "block", "produces": { "css": "core", "js": [] }, "example": "<div class=\"legend-grid\"><div class=\"legend-card\">…</div></div>" },
    { "id": "dropgame", "purpose": "Drop-игра с click-фолбэком", "classes": ["game-area", "game-pool", "pool-item", "basket", "dual-basket", "triple-basket", "reset-btn", "game-feedback"], "required_attrs": ["data-game-id"], "children": "block", "produces": { "css": "core", "js": ["dropgames"] }, "example": "<div class=\"game-area\" data-game-id=\"g1\"><div class=\"game-pool\" id=\"pool-g1\"></div></div>" },
    { "id": "quiz", "purpose": "Тест/микровопрос", "classes": ["test-question", "test-options", "test-option", "opt-marker", "explanation", "test-score", "retry-btn"], "required_attrs": ["data-config", "id"], "children": "none", "produces": { "css": "core", "js": ["quiz"] }, "example": "<div id=\"quiz-u1-entry\" data-config=\"entry\"></div>" },
    { "id": "entry-result", "purpose": "Итог входного/разогрева", "classes": ["entry-result"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": ["quiz"] }, "example": "<div class=\"entry-result\" id=\"entryResult\"></div>" },
    { "id": "timeline", "purpose": "Таймлайн", "classes": ["timeline", "timeline-track", "timeline-item", "timeline-detail"], "required_attrs": [], "children": "block", "produces": { "css": "core", "js": ["timeline"] }, "example": "<div class=\"timeline\"><div class=\"timeline-item\">…</div></div>" },
    { "id": "fade-in", "purpose": "Появление при скролле", "classes": ["fade-in"], "required_attrs": [], "children": "any", "produces": { "css": "core", "js": ["fade"] }, "example": "<div class=\"fade-in\">…</div>" },
    { "id": "qa-card", "purpose": "QA-карточка вопроса", "classes": ["qa-list", "qa-card", "qa-q", "qa-num"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": [] }, "example": "<div class=\"qa-list\"><div class=\"qa-card\"><div class=\"qa-q\">…</div></div></div>" },
    { "id": "lesson-nav", "purpose": "Оглавление модуля", "classes": ["lesson-nav", "ln-card", "ln-map", "ln-pill"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": [] }, "example": "<nav class=\"lesson-nav\">…</nav>" },
    { "id": "thinker", "purpose": "Задачка★ без ответа", "classes": ["thinker"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": [] }, "example": "<div class=\"thinker\">…</div>" },
    { "id": "recap-card", "purpose": "Выжимка урока", "classes": ["recap-card"], "required_attrs": [], "children": "block", "produces": { "css": "core", "js": [] }, "example": "<div class=\"recap-card\">…</div>" },
    { "id": "notebook-task", "purpose": "Пометка «в тетрадь»", "classes": ["notebook-task"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": [] }, "example": "<div class=\"notebook-task\">…</div>" },
    { "id": "gate-box", "purpose": "Гейт безопасности", "classes": ["gate-box"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": ["scenarios"] }, "example": "<div class=\"gate-box\">…</div>" },
    { "id": "video-slot", "purpose": "Слот видео 16:9", "classes": ["video-slot"], "required_attrs": [], "children": "iframe", "produces": { "css": "core", "js": [] }, "example": "<div class=\"video-slot\">…</div>" },
    { "id": "formula", "purpose": "Химическая формула", "classes": ["formula"], "required_attrs": [], "children": "inline (sub/sup)", "produces": { "css": "core", "js": [] }, "example": "<span class=\"formula\">H<sub>2</sub>O</span>" },
    { "id": "formula-block", "purpose": "Уравнение реакции", "classes": ["formula-block", "reaction-arrow", "state-tag", "ox-state"], "required_attrs": [], "children": "inline", "produces": { "css": "core", "js": [] }, "example": "<div class=\"formula-block\">2H<sub>2</sub> + O<sub>2</sub> <span class=\"reaction-arrow\">→</span> 2H<sub>2</sub>O</div>" },
    { "id": "atom-chip", "purpose": "Инлайн-чип элемента", "classes": ["atom-chip"], "required_attrs": ["data-el"], "children": "none", "produces": { "css": "core", "js": ["chemdraw"] }, "example": "<span class=\"atom-chip\" data-el=\"H\"></span>" },
    { "id": "term", "purpose": "Термин с подсказкой", "classes": ["term"], "required_attrs": ["data-term"], "children": "inline", "produces": { "css": "core", "js": ["glossary"] }, "example": "<span class=\"term\" data-term=\"вещество\">вещество</span>" },
    { "id": "sim", "purpose": "Симуляция (обёртка v2)", "classes": ["sim", "sim-head", "sim-cta", "sim-body", "sim-controls", "sim-status", "sim-meta", "sim-micro"], "required_attrs": ["data-sim", "id"], "children": "block", "produces": { "css": "core", "js": ["makesim"] }, "example": "<div class=\"sim\" id=\"sim-states\" data-sim=\"state_of_matter\"></div>" }
  ]
}
```

- [ ] **Step 2: Проверить уникальность id**

Run:
```bash
python3 -c "
import json
d=json.load(open('src/shared/data/components.json'))
ids=[c['id'] for c in d['components']]
assert len(ids)==len(set(ids)), 'duplicate ids'
print(len(ids), 'components OK')
"
```
Expected: `25 components OK`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/data/components.json
git commit -m "feat(canon): add components.json registry"
```

---

### Task 5: Неймспейс `mod01/mod02` → `module_1/module_2`

**Files:**
- Rename: `src/lessons/mod01/` → `src/lessons/module_1/`, `src/lessons/mod02/` → `src/lessons/module_2/`
- Modify: `src/build.py`, `src/lessons/**/module.json`, `STRUCTURE.md`, `DESIGN.md`

**Interfaces:**
- Consumes: текущие `src/lessons/mod01`, `mod02`.
- Produces: папки `module_1`, `module_2`; `build.py` считает модули из `course.json` и папок.

- [ ] **Step 1: Переименовать папки**

Run:
```bash
cd /home/gjkvjhab/chemistry_course/src/lessons
git mv mod01 module_1
git mv mod02 module_2
ls
```
Expected: `module_1  module_2`.

- [ ] **Step 2: Обновить `module: "mod01"` в манифестах**

Run:
```bash
cd /home/gjkvjhab/chemistry_course
grep -rl '"mod01"\|"mod02"' src/lessons | xargs -r sed -i 's/"mod01"/"module_1"/g; s/"mod02"/"module_2"/g'
grep -rn '"mod0' src/lessons || echo "no mod01/mod02 left"
```
Expected: `no mod01/mod02 left`.

- [ ] **Step 3: Обновить `build.py`**

В `src/build.py` заменить `mod`-строки там, где модуль берётся из аргументов, — уже
работает через `os.listdir(SRC/lessons)`, поэтому правка только в дефолтах/комментариях:
заменить `mod01`/`mod02` в docstring на `module_1`.

- [ ] **Step 4: Обновить `STRUCTURE.md` и `DESIGN.md`**

Run:
```bash
grep -rn 'mod0[0-9]' STRUCTURE.md DESIGN.md || echo "clean"
```
Заменить найденные упоминания `modNN` на `module_N` и описать сквозную нумерацию
(3а/3б → `module_3`, без букв).

- [ ] **Step 5: Проверить сборку**

Run:
```bash
python3 src/build.py module_1
```
Expected: строки `module_1/u1: OK …` и `module_1 WHOLE: OK …` (до миграции контента
поведение не хуже прежнего).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: rename mod01/mod02 to module_1/module_2 (continuous numbering)"
```

---

### Task 6: Вынести шаблон `shell.html`

**Files:**
- Create: `src/shared/shell.html`
- Modify: `src/build.py` (функция `shell`)

**Interfaces:**
- Consumes: текущую строку `shell()` в `build.py`.
- Produces: `shell(title, css, content, js, stamp) -> str`, читающая шаблон из файла,
  с плейсхолдерами `{{TITLE}} {{CSS}} {{CONTENT}} {{JS}} {{STAMP}}`.

- [ ] **Step 1: Создать `src/shared/shell.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITLE}}</title>
<style>{{CSS}}</style>
</head>
<body>
{{STAMP}}
{{CONTENT}}

<footer class="footer">
  <div>Интерактивный модуль · Химия · 2026</div>
  <div style="margin-top:8px;font-size:13px;opacity:.6;">
    Простое объяснение · пример из жизни · наглядный опыт · запись в тетрадь
  </div>
</footer>

<script>
{{JS}}
</script>
</body>
</html>
```

- [ ] **Step 2: Переписать `shell()` в `build.py`**

Заменить тело функции (строки ~144–149) на:

```python
def shell(title, css, content, js, stamp):
    tpl = open(os.path.join(SRC, 'shared', 'shell.html'), encoding='utf-8').read()
    return (tpl.replace('{{TITLE}}', title)
               .replace('{{CSS}}', css)
               .replace('{{CONTENT}}', content)
               .replace('{{JS}}', js)
               .replace('{{STAMP}}', stamp))
```

Удалить константу `FOOTER` — футер теперь в шаблоне.

- [ ] **Step 3: Пересобрать и сверить размер/структуру**

Run:
```bash
python3 src/build.py module_1
python3 -c "
h=open('dist/module_1.html',encoding='utf-8').read()
assert h.startswith('<!DOCTYPE html>') and h.rstrip().endswith('</html>')
assert '<footer class=\"footer\">' in h
print('shell OK', len(h)//1024, 'KB')
"
```
Expected: `shell OK … KB` и `module_1 WHOLE: OK`.

- [ ] **Step 4: Commit**

```bash
git add src/shared/shell.html src/build.py
git commit -m "refactor(build): extract shell.html template"
```

---

### Task 7: Единый `module.json` (слияние manifest)

**Files:**
- Create: `src/lessons/module_1/module.json` (перезапись существующего)
- Modify: `src/build.py`
- Delete (после миграции всех модулей): `src/lessons/module_*/u*/manifest.json`

**Interfaces:**
- Consumes: существующие `module.json` (meta) + `u*/manifest.json` (css/js).
- Produces: единый `module.json`, где каждый урок несёт `file/title/chip/pill/time/questions/canon`.
  `css`/`js` из манифестов **не переносятся** — их определит авто-подбор (Task 9).

- [ ] **Step 1: Записать `src/lessons/module_1/module.json`**

```json
{
  "id": "module_1",
  "title": "Модуль 1. Химия как наука",
  "badge": "Модуль 1 · Химия как наука · ~1 час",
  "digest": "Химия — наука о веществах и их превращениях. В этом модуле разберёмся, чем тело отличается от вещества, как учёные познают мир и как работать в лаборатории безопасно.",
  "questions": [
    "Из чего состоит всё вокруг нас?",
    "Почему одни вещества горят, а другие растворяются?",
    "Как изучать вещества и не навредить себе?"
  ],
  "canon": "1.0",
  "order": ["u1", "u2", "u3", "final"],
  "lessons": [
    { "file": "u1", "title": "Урок 1. Как учимся и что изучает химия", "chip": "Урок 1", "pill": "1", "time": "~20 минут", "questions": ["Что изучает химия?", "Чем тело отличается от вещества?", "Как учёные познают мир?"] },
    { "file": "u2", "title": "Урок 2. Свойства веществ и химия вокруг нас", "chip": "Урок 2", "pill": "2", "time": "~20 минут", "questions": ["Как различить вещества вокруг нас?", "Из чего состоим мы сами?", "Где химия в твоём доме?"] },
    { "file": "u3", "title": "Урок 3. Лаборатория: безопасность и оборудование", "chip": "Урок 3", "pill": "3", "time": "~20 минут", "questions": ["Как работать в лаборатории безопасно?", "Как называется оборудование и зачем оно?", "Как описать вещество по плану?"] },
    { "file": "final", "title": "Итоговый тест", "chip": "Тест", "pill": "✓", "time": "~10 минут", "topics": "15 вопросов · порог 80% · результат показать учителю" }
  ]
}
```

- [ ] **Step 2: Адаптировать `build.py` под единый манифест**

В `build(mod, lesson)`: убрать чтение `manifest.json`; брать мета урока из `module.json`
(`lmeta = next(...)` уже есть). `title` брать из `lmeta['title']`; `css`/`js` временно
формировать заглушкой (Task 9 заменит на авто-подбор), например:

```python
def build(mod, lesson):
    ldir = os.path.join(SRC, 'lessons', mod, lesson)
    body = open(os.path.join(ldir, 'body.html'), encoding='utf-8').read()
    mod_meta = json.load(open(os.path.join(SRC, 'lessons', mod, 'module.json'),
                              encoding='utf-8'))
    lmeta = next((L for L in mod_meta['lessons'] if L['file'] == lesson), {})
    css_names, js_names = detect_assets(body, mod)   # Task 8; до неё — явный список
    ...
```

В `build_module(mod)` тоже читать `module.json` один раз; убрать цикл по `manifest.json`.

- [ ] **Step 3: Проверить сборку**

Run:
```bash
python3 src/build.py module_1
```
Expected: `module_1/u1: OK …`, `module_1 WHOLE: OK …`.

- [ ] **Step 4: Commit**

```bash
git add src/lessons/module_1/module.json src/build.py
git commit -m "feat(build): single module.json, drop manifest.json"
```

---

### Task 8: Авто-подбор CSS/JS по блокам

**Files:**
- Modify: `src/build.py`
- Reuse: `src/shared/data/components.json`

**Interfaces:**
- Consumes: `body.html`, `components.json`.
- Produces: `detect_assets(body: str, mod: str) -> (list[str], list[str])` там же в `build.py`;
  возвращает уникальные имена css/js.

- [ ] **Step 1: Добавить `detect_assets` в `build.py`**

```python
def detect_assets(body, mod):
    css, js = [], []
    for comp in COMPONENTS:
        if any(re.search(r'class="[^"]*\b' + re.escape(c) + r'\b', body)
               for c in comp['classes']) or ('data-' + comp['id'] + '=') in body:
            for c in comp['produces'].get('css', []):
                if c not in css:
                    css.append(c)
            for j in comp['produces'].get('js', []):
                if j not in js:
                    js.append(j)
    if mod == 'module_2' and 'mod02' not in css:
        css.append('mod02')
    return css or ['core'], js
```

- [ ] **Step 2: Использовать `detect_assets` в `build` и `build_module`**

В `build`: `css_names, js_names = detect_assets(body, mod)`.
В `build_module`: для объединённого файла собрать css/js по каждому `body`, объединив
уникальным образом (порядок сохранять по первому появлению).

- [ ] **Step 3: Проверить, что ресурсы подобрались**

Run:
```bash
python3 -c "
import sys; sys.path.insert(0,'src')
import build
body=open('src/lessons/module_1/u1/body.html',encoding='utf-8').read()
print(build.detect_assets(body,'module_1'))
"
```
Expected: printed tuple содержит `'core'` и нужные js (например `timeline`, `sciences`).

- [ ] **Step 4: Пересобрать**

Run: `python3 src/build.py module_1`
Expected: `OK` и размер файла близок к прежнему.

- [ ] **Step 5: Commit**

```bash
git add src/build.py
git commit -m "feat(build): auto-detect css/js from component registry"
```

---

### Task 9: Дописать компоненты формул и терминов в `core.css`

**Files:**
- Modify: `src/shared/css/core.css`

**Interfaces:**
- Consumes: `components.json` (классы `formula`, `formula-block`, `reaction-arrow`,
  `state-tag`, `ox-state`, `atom-chip`, `term`).
- Produces: стили этих классов.

- [ ] **Step 1: Добавить в конец `core.css`**

```css
  .formula { font-variant-numeric: lining-nums; white-space: nowrap; }
  .formula sub { font-size: .7em; vertical-align: -.25em; }
  .formula sup { font-size: .7em; vertical-align: .5em; }
  .formula-block {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    flex-wrap: wrap; padding: 16px; margin: 14px 0;
    background: var(--panel-2); border-radius: var(--radius);
    font-size: 20px; overflow-x: auto;
  }
  .reaction-arrow { position: relative; display: inline-block; padding: 0 10px; }
  .reaction-arrow > .cond {
    position: absolute; left: 0; right: 0; font-size: 12px; color: var(--muted);
  }
  .reaction-arrow > .cond.top { bottom: 100%; }
  .reaction-arrow > .cond.bottom { top: 100%; }
  .state-tag { font-size: .8em; color: var(--muted); }
  .ox-state { display: inline-block; font-size: .75em; font-weight: 700; }
  .atom-chip {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 50%; font-size: 11px; font-weight: 700;
    color: #111; border: 1.5px solid rgba(0,0,0,.35); vertical-align: middle;
    cursor: pointer;
  }
  .term { border-bottom: 1px dashed var(--accent); cursor: pointer; }
```

- [ ] **Step 2: Проверить, что классы на месте**

Run:
```bash
for c in formula formula-block reaction-arrow state-tag ox-state atom-chip term; do grep -q "\.$c" src/shared/css/core.css && echo "$c ok"; done
```
Expected: 7 строк `… ok`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/css/core.css
git commit -m "feat(css): formula, reaction, atom-chip and term components"
```

---

### Task 10: Автоподсветка терминов `glossary.js`

**Files:**
- Create: `src/shared/js/glossary.js`
- Modify: `src/shared/data/components.json` (ресурс `glossary` уже указан у `term`)

**Interfaces:**
- Consumes: JSON-островок `#glossary` (встраивает билдер из `glossary.json`),
  элементы `.term[data-term]`.
- Produces: popover с определением при клике/тапе; закрытие по тапу вне.

- [ ] **Step 1: Создать `src/shared/js/glossary.js`**

```javascript
(function initGlossary() {
  const island = document.getElementById('glossary');
  const terms = document.querySelectorAll('.term[data-term]');
  if (!island || !terms.length) return;

  let DATA = {};
  try { DATA = JSON.parse(island.textContent); } catch (e) { return; }

  const pop = document.createElement('div');
  pop.className = 'glossary-pop';
  pop.setAttribute('role', 'tooltip');
  pop.hidden = true;
  document.body.appendChild(pop);

  function hide() { pop.hidden = true; }

  terms.forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = DATA[el.dataset.term];
      if (!item) return;
      pop.textContent = item.definition;
      const r = el.getBoundingClientRect();
      pop.style.left = Math.max(8, Math.min(window.innerWidth - 280, r.left)) + 'px';
      pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
      pop.hidden = false;
    });
  });

  document.addEventListener('click', hide);
  window.addEventListener('scroll', hide, { passive: true });
})();
```

- [ ] **Step 2: Добавить стиль popover в `core.css`**

```css
  .glossary-pop {
    position: absolute; z-index: 50; max-width: 260px;
    background: var(--panel); border: 1px solid var(--border);
    border-radius: 12px; padding: 10px 14px; box-shadow: var(--shadow-lg);
    font-size: 15px; line-height: 1.5;
  }
```

- [ ] **Step 3: Встроить JSON-островок в `build.py`**

В `build.py` при сборке добавить в конец `<body>` перед футером:

```python
def glossary_island():
    data = open(os.path.join(SRC, 'shared', 'data', 'glossary.json'),
                encoding='utf-8').read()
    return f'<script type="application/json" id="glossary">{data}</script>'
```

и в `content` дописать `glossary_island()`.

- [ ] **Step 4: Проверить в собранном файле**

Run:
```bash
python3 src/build.py module_1
grep -c 'id="glossary"' dist/module_1.html
```
Expected: `1` (или больше, если один на файл).

- [ ] **Step 5: Commit**

```bash
git add src/shared/js/glossary.js src/shared/css/core.css src/build.py
git commit -m "feat: glossary term popover from glossary.json"
```

---

### Task 11: Единый движок `quiz.js`

**Files:**
- Create: `src/shared/js/quiz.js`
- Delete (после миграции): `entry.js`, `pract.js`, `finaltest.js`, `m2_entry.js`, `m2_final.js`

**Interfaces:**
- Consumes: JSON-островок `#quiz-<id>`; текст из `#messages` (островок `messages.json`);
  контейнер `<div id="quiz-<id>" data-config="warmup|entry|practice|final|safety"></div>`;
  внутри островка: `{ "questions": [...] }`.
  Формат вопроса:
  - `{ "type":"single", "q":str, "options":[str], "correct":int, "why":str }`
  - `{ "type":"multi", "q":str, "options":[str], "correct":[int], "why":str }`
  - `{ "type":"match", "q":str, "left":[str], "right":[str], "correct":[int], "why":str }`
    (`correct[i]` — индекс правого для левого `i`).
- Produces: `renderQuiz(el)` через IIFE-автозапуск; банк `messages.json`; порог по
  умолчанию 80%.

- [ ] **Step 1: Создать `src/shared/js/quiz.js`**

```javascript
(function initQuizzes() {
  const islands = document.querySelectorAll('script[type="application/json"][id^="quiz-"]');
  if (!islands.length) return;

  const msgIsland = document.getElementById('messages');
  let MSG = {};
  try { MSG = msgIsland ? JSON.parse(msgIsland.textContent) : {}; } catch (e) { MSG = {}; }

  function pick(kind) {
    const arr = MSG[kind] || [];
    return arr.length ? arr[Math.floor(Math.random() * arr.length)] : '';
  }

  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  const PASS_RATIO = 0.8;
  const LETTERS = 'ABCDEFGH';

  islands.forEach((island) => {
    let data;
    try { data = JSON.parse(island.textContent); } catch (e) { return; }
    const targetId = data.target || island.id.replace(/-data$/, '');
    const host = document.getElementById(targetId);
    if (!host) return;
    const questions = data.questions || [];
    const config = data.config || host.dataset.config || 'practice';
    const threshold = data.threshold != null
      ? data.threshold
      : Math.ceil(questions.length * PASS_RATIO);

    const state = { answered: 0, correct: 0, wrong: [] };

    function resultKey() {
      if (config === 'final') return null; // решается по счёту
      if (config === 'entry') return 'entryFail';
      if (config === 'warmup') return 'warmupDone';
      if (config === 'practice') return 'practiceDone';
      return 'practiceDone';
    }

    function render() {
      host.innerHTML = '';
      state.answered = 0;
      state.correct = 0;
      state.wrong = [];

      const score = document.createElement('div');
      score.className = 'test-score';
      score.textContent = 'Правильных ответов: 0 из ' + questions.length;
      host.appendChild(score);

      const set = questions.map((q, i) => ({ q: q, idx: i }));
      const ordered = data.shuffle === false ? set : shuffle(set);

      ordered.forEach(({ q, idx }, displayIndex) => {
        const block = document.createElement('div');
        block.className = 'test-question';
        block.dataset.q = String(idx);
        block.innerHTML = '<div class="q-text"><span class="q-num">' +
          (displayIndex + 1) + '</span><span>' + q.q + '</span></div>' +
          '<div class="test-options"></div>' +
          '<div class="explanation" id="exp-' + island.id + '-' + idx + '"></div>';

        const optBox = block.querySelector('.test-options');
        if (q.type === 'match') {
          q.left.forEach((leftText, li) => {
            const row = document.createElement('div');
            row.className = 'test-option match-row';
            const opts = q.right.map((rt, ri) =>
              '<option value="' + ri + '">' + rt + '</option>').join('');
            row.innerHTML = '<span class="match-left">' + leftText + '</span>' +
              '<select class="match-select" data-left="' + li + '">' +
              '<option value="">—</option>' + opts + '</select>';
            optBox.appendChild(row);
          });
          const btn = document.createElement('button');
          btn.className = 'retry-btn';
          btn.type = 'button';
          btn.textContent = 'Проверить';
          btn.addEventListener('click', () => checkMatch(block, q, idx, btn));
          optBox.appendChild(btn);
        } else {
          q.options.forEach((optText, oi) => {
            const opt = document.createElement('div');
            opt.className = 'test-option';
            opt.dataset.opt = String(oi);
            opt.innerHTML = '<span class="opt-marker">' +
              (q.type === 'multi' ? '☐' : LETTERS[oi]) + '</span><span>' + optText + '</span>';
            opt.addEventListener('click', () => {
              if (q.type === 'multi') {
                opt.classList.toggle('picked');
                return;
              }
              answerSingle(block, q, idx, oi, opt);
            });
            optBox.appendChild(opt);
          });
          if (q.type === 'multi') {
            const btn = document.createElement('button');
            btn.className = 'retry-btn';
            btn.type = 'button';
            btn.textContent = 'Проверить';
            btn.addEventListener('click', () => checkMulti(block, q, idx, btn));
            optBox.appendChild(btn);
          }
        }
        host.appendChild(block);
      });
    }

    function finish(block, exp, isCorrect, q) {
      block.querySelectorAll('.test-option').forEach((o) => o.classList.add('disabled'));
      block.querySelectorAll('button').forEach((b) => (b.disabled = true));
      exp.classList.add('show', isCorrect ? 'ok' : 'no');
      exp.innerHTML = '<b>' + (isCorrect ? '✅ Правильно!' : '❌ Не совсем.') +
        '</b> ' + (q.why || '');
      if (isCorrect) state.correct++; else state.wrong.push(q.q);
      state.answered++;
      const score = host.querySelector('.test-score');
      if (score) score.textContent = 'Правильных ответов: ' +
        state.correct + ' из ' + questions.length;
      if (state.answered === questions.length) summarize();
    }

    function answerSingle(block, q, idx, oi, opt) {
      const rel = block.querySelectorAll('.test-option');
      rel.forEach((o) => {
        const i = parseInt(o.dataset.opt, 10);
        if (i === q.correct) o.classList.add('correct');
        if (i === oi && oi !== q.correct) o.classList.add('wrong');
      });
      finish(block, document.getElementById('exp-' + island.id + '-' + idx),
        oi === q.correct, q);
    }

    function checkMulti(block, q, idx, btn) {
      const picked = Array.from(block.querySelectorAll('.test-option.picked'))
        .map((o) => parseInt(o.dataset.opt, 10)).sort();
      const correct = q.correct.slice().sort();
      const ok = picked.length === correct.length &&
        picked.every((v, i) => v === correct[i]);
      block.querySelectorAll('.test-option').forEach((o) => {
        const i = parseInt(o.dataset.opt, 10);
        if (q.correct.indexOf(i) !== -1) o.classList.add('correct');
        else if (o.classList.contains('picked')) o.classList.add('wrong');
      });
      finish(block, document.getElementById('exp-' + island.id + '-' + idx), ok, q);
    }

    function checkMatch(block, q, idx, btn) {
      let ok = true;
      block.querySelectorAll('.match-select').forEach((sel) => {
        const li = parseInt(sel.dataset.left, 10);
        const val = parseInt(sel.value, 10);
        if (val !== q.correct[li]) ok = false;
      });
      finish(block, document.getElementById('exp-' + island.id + '-' + idx), ok, q);
    }

    function summarize() {
      const box = document.createElement('div');
      const passed = state.correct >= threshold;
      let text;
      if (config === 'final') {
        text = passed ? pick('finalPass') : pick('finalFail');
      } else if (config === 'entry') {
        text = passed ? pick('practiceDone') : pick('entryFail');
      } else {
        text = pick(resultKey()) || '';
      }
      box.className = 'callout ' + (passed ? 'callout-ok' : 'callout-warn');
      let html = text + ' <b>' + state.correct + ' из ' + questions.length + '</b>';
      if (state.wrong.length) {
        html += '<div class="recap-card" style="margin-top:10px"><b>Разбор ошибок:</b><ul>' +
          state.wrong.map((w) => '<li>' + w + '</li>').join('') + '</ul></div>';
      }
      box.innerHTML = html;
      const retry = document.createElement('button');
      retry.className = 'retry-btn';
      retry.type = 'button';
      retry.textContent = 'Пройти заново';
      retry.addEventListener('click', render);
      box.appendChild(retry);
      host.appendChild(box);
    }

    render();
  });
})();
```

- [ ] **Step 2: Встроить островки `messages.json` в `build.py`**

В `build.py` добавить (рядом с `glossary_island`):

```python
def messages_island():
    data = open(os.path.join(SRC, 'shared', 'data', 'messages.json'),
                encoding='utf-8').read()
    return f'<script type="application/json" id="messages">{data}</script>'
```

дописывать `messages_island()` в `content` модульного и поурочного файла.

- [ ] **Step 3: Мигрировать тест урока `u1` (разогрев) в JSON-островок**

В `src/lessons/module_1/u1/body.html` заменить контейнер теста на:
```html
<div class="stage">
  <div id="quiz-u1-warmup" data-config="warmup"></div>
</div>
<script type="application/json" id="quiz-u1-warmup-data">
{ "config": "warmup", "questions": [
  { "type": "single", "q": "Что изучает химия?", "options": ["Только живые организмы", "Вещества, их свойства и превращения", "Только звёзды и планеты", "Только числа и формулы"], "correct": 1, "why": "Химия — наука о веществах, их свойствах и превращениях." },
  { "type": "single", "q": "Что из перечисленного — физическое тело?", "options": ["Вода", "Алюминий", "Ложка", "Кислород"], "correct": 2, "why": "Ложка — физическое тело: у неё есть форма и объём." },
  { "type": "single", "q": "Что такое вещество?", "options": ["То, что имеет форму и объём", "То, из чего состоят физические тела", "То, что светит в темноте", "То, что движется"], "correct": 1, "why": "Вещество — то, из чего состоят тела." },
  { "type": "single", "q": "Что НЕЛЬЗЯ делать в лаборатории?", "options": ["Носить халат", "Пробовать вещества на вкус", "Мыть руки после работы", "Слушать учителя"], "correct": 1, "why": "Пробовать вещества на вкус запрещено." },
  { "type": "single", "q": "Что такое наблюдение?", "options": ["Активное воздействие на вещество", "Внимательное изучение явления без вмешательства", "Измерение температуры", "Выдвижение предположения"], "correct": 1, "why": "Наблюдение — изучение без вмешательства." }
] }
</script>
```
Внимание: `id` островка — `quiz-u1-warmup-data`, а контейнера — `quiz-u1-warmup`;
`quiz.js` ищет `script[id^="quiz-"]`, затем `document.getElementById(island.id)`,
поэтому в островке нужен атрибут, связывающий с контейнером. Привести к правилу:
контейнер `id="quiz-u1-warmup"`, островок `id="quiz-u1-warmup"` **не может** совпадать
(разные теги, но `getElementById` вернёт первый). Решение: островок `id="quiz-u1-warmup-data"`,
в него добавить `"target": "quiz-u1-warmup"`, а в `quiz.js` искать контейнер по
`data.target || island.id.replace(/-data$/,'')`. Обновить `quiz.js` соответственно:

```javascript
    const targetId = data.target || island.id.replace(/-data$/, '');
    const host = document.getElementById(targetId);
    if (!host) return;
```

- [ ] **Step 4: Аналогично мигрировать**
- `u2` практикум (`property`) → `quiz` c `data-config="practice"`;
- `u3` практикум (`pract`) и сценарий безопасности (`scenarios`) — сценарий остаётся
  `scenarios.js`, практикум → `quiz`;
- `final` → `quiz` c `data-config="final"`, банк из 15 вопросов.

- [ ] **Step 5: Удалить старые движки**

Run:
```bash
cd /home/gjkvjhab/chemistry_course
git rm src/shared/js/entry.js src/shared/js/pract.js src/shared/js/finaltest.js \
       src/shared/js/m2_entry.js src/shared/js/m2_final.js
```

- [ ] **Step 6: Пересобрать и проверить синтаксис**

Run:
```bash
python3 src/build.py module_1
python3 -c "
import re
h=open('dist/module_1.html',encoding='utf-8').read()
js=re.search(r'<script>\n(.*)\n</script>',h,re.S).group(1)
open('/tmp/q.js','w',encoding='utf-8').write(js)
"
node --check /tmp/q.js && echo "JS OK"
grep -c 'id="messages"' dist/module_1.html
```
Expected: `module_1 … OK`, `JS OK`, `1`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(quiz): single quiz.js engine with single/multi/match, migrate module_1"
```

---

### Task 12: `lint.py`

**Files:**
- Create: `src/lint.py`
- Reuse: `src/shared/data/components.json`, `course.json`

**Interfaces:**
- Consumes: `python3 src/lint.py module_1`.
- Produces: вывод `ERROR`/`WARN` по файлам, код возврата 1 при ERROR.

- [ ] **Step 1: Создать `src/lint.py`**

```python
#!/usr/bin/env python3
"""Lint уроков и модуля: канон, теги, id, JSON-тесты. Usage: python3 src/lint.py module_1"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
COMPONENTS = json.load(open(os.path.join(SRC, 'shared', 'data', 'components.json'),
                            encoding='utf-8'))['components']
KNOWN_CLASSES = {c for comp in COMPONENTS for c in comp['classes']}
INLINE_STYLE = re.compile(r'style\s*=\s*"')
CLASS_ATTR = re.compile(r'class="([^"]*)"')


def iter_html(mod):
    mdir = os.path.join(SRC, 'lessons', mod)
    for lesson in sorted(os.listdir(mdir)):
        body = os.path.join(mdir, lesson, 'body.html')
        if os.path.isfile(body):
            yield lesson, open(body, encoding='utf-8').read()


def js_syntax(html):
    m = re.search(r'<script>(.*)</script>', html, re.DOTALL)
    if not m:
        return True, ''
    open('/tmp/lint_chk.js', 'w', encoding='utf-8').write(m.group(1))
    r = subprocess.run(['node', '--check', '/tmp/lint_chk.js'],
                       capture_output=True, text=True)
    return r.returncode == 0, r.stderr.strip()


def lint_body(lesson, body):
    errors, warns = [], []
    for attr in CLASS_ATTR.finditer(body):
        for cls in attr.group(1).split():
            if cls not in KNOWN_CLASSES:
                errors.append(f'{lesson}: неизвестный класс .{cls}')
    if INLINE_STYLE.search(body):
        errors.append(f'{lesson}: инлайн style запрещён')
    opens = len(re.findall(r'<div[\s>]', body)) - len(re.findall(r'</div>', body))
    if opens != 0:
        errors.append(f'{lesson}: дисбаланс <div> ({opens:+d})')
    secs = len(re.findall(r'<section[\s>]', body)) - len(re.findall(r'</section>', body))
    if secs != 0:
        errors.append(f'{lesson}: дисбаланс <section> ({secs:+d})')
    for island in re.finditer(
            r'<script type="application/json"[^>]*>(.*?)</script>', body, re.DOTALL):
        raw = island.group(1)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            errors.append(f'{lesson}: битый JSON-островок: {e}')
            continue
        for q in data.get('questions', []) if isinstance(data, dict) else []:
            t = q.get('type', 'single')
            if not q.get('why'):
                errors.append(f'{lesson}: вопрос без why: {q.get("q", "?")}')
            if t in ('single', 'multi'):
                opts = q.get('options', [])
                if len(opts) < 2:
                    errors.append(f'{lesson}: <2 вариантов: {q.get("q", "?")}')
                if t == 'single':
                    if not isinstance(q.get('correct'), int):
                        errors.append(f'{lesson}: single без correct: {q.get("q", "?")}')
                else:
                    if not isinstance(q.get('correct'), list) or not q['correct']:
                        errors.append(f'{lesson}: multi без correct[]: {q.get("q", "?")}')
            elif t == 'match':
                if len(q.get('left', [])) != len(q.get('correct', [])):
                    errors.append(f'{lesson}: match: left и correct[] разной длины')
    return errors, warns


def main():
    mods = sys.argv[1:] or sorted(
        d for d in os.listdir(os.path.join(SRC, 'lessons'))
        if os.path.isdir(os.path.join(SRC, 'lessons', d)))
    failed = False
    for mod in mods:
        mdir = os.path.join(SRC, 'lessons', mod)
        # проверка сборки/JS на собранном модуле
        r = subprocess.run([sys.executable, os.path.join(SRC, 'build.py'), mod],
                           capture_output=True, text=True)
        out = r.stdout.strip()
        if r.returncode != 0 or 'FAIL' in out:
            failed = True
        print(out)
        for lesson, body in iter_html(mod):
            errors, warns = lint_body(lesson, body)
            for e in errors:
                failed = True
                print('ERROR', mod, e)
            for w in warns:
                print('WARN ', mod, w)
    print('LINT', 'FAIL' if failed else 'OK')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
```

- [ ] **Step 2: Проверить на текущем (до чистки) контенте**

Run:
```bash
python3 src/lint.py module_1; echo "exit=$?"
```
Expected: сначала возможны ERROR про инлайн-стили/неизвестные классы — это рабочий
список к устранению в Task 14. Зафиксировать список в задаче миграции.

- [ ] **Step 3: Проверить детекцию на синтетике**

Run:
```bash
python3 - <<'PY'
import sys; sys.path.insert(0,'src')
import lint
body='<div class="nope"></div><div style="x"></div>'
errs,_=lint.lint_body('uX', body)
print(len(errs), errs)
PY
```
Expected: `2 [...]` (неизвестный класс + инлайн style).

- [ ] **Step 4: Commit**

```bash
git add src/lint.py
git commit -m "feat(lint): canon/tag/id/quiz validator with ERROR/WARN"
```

---

### Task 13: Отчёт билдера и отправка в Telegram

**Files:**
- Modify: `src/build.py`
- Reuse: `.env` (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)

**Interfaces:**
- Consumes: `python3 src/build.py module_1 --send`.
- Produces: отчёт в stdout; при `--send` — сообщение и файл `dist/module_1.html` в Telegram.

- [ ] **Step 1: Добавить отправку в `build.py`**

```python
def load_env():
    env = {}
    path = os.path.join(ROOT, '.env')
    if os.path.isfile(path):
        for line in open(path, encoding='utf-8'):
            if '=' in line and not line.strip().startswith('#'):
                k, v = line.strip().split('=', 1)
                env[k.strip()] = v.strip()
    return env


def send_telegram(text, doc_path=None):
    import urllib.request
    import urllib.parse
    env = load_env()
    token = env.get('TELEGRAM_BOT_TOKEN')
    chat = env.get('TELEGRAM_CHAT_ID')
    if not token or not chat:
        print('SEND skipped: нет TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID')
        return
    base = f'https://api.telegram.org/bot{token}/'
    data = urllib.parse.urlencode({'chat_id': chat, 'text': text,
                                   'parse_mode': 'HTML'}).encode()
    urllib.request.urlopen(base + 'sendMessage', data=data).read()
    if doc_path and os.path.isfile(doc_path):
        boundary = '----chem'
        body = b''
        body += (f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n'
                 f'{chat}\r\n').encode()
        body += (f'--{boundary}\r\nContent-Disposition: form-data; name="document"; '
                 f'filename="{os.path.basename(doc_path)}"\r\n\r\n').encode()
        body += open(doc_path, 'rb').read() + b'\r\n'
        body += f'--{boundary}--\r\n'.encode()
        req = urllib.request.Request(
            base + 'sendDocument', data=body,
            headers={'Content-Type': f'multipart/form-data; boundary={boundary}'})
        urllib.request.urlopen(req).read()
    print('SEND ok')
```

В конце `main()` при `'--send' in sys.argv`: собрать строку отчёта (по строке на урок +
итог модуля) и вызвать `send_telegram(report, os.path.join(DIST, mod + '.html'))`.
Аргументы модулей отфильтровать: `mods = [a for a in sys.argv[1:] if not a.startswith('--')]`.

- [ ] **Step 2: Проверить отчёт без отправки**

Run:
```bash
python3 src/build.py module_1
```
Expected: строки вида
```
module_1/u1: OK | JS:OK div:0 section:0 missing:none KB:…
module_1 WHOLE: OK | …
```

- [ ] **Step 3: Проверить отправку (нужен интернет и `.env`)**

Run: `python3 src/build.py module_1 --send`
Expected: `SEND ok` (или `SEND skipped`, если ключей нет).

- [ ] **Step 4: Commit**

```bash
git add src/build.py
git commit -m "feat(build): report + optional telegram delivery"
```

---

### Task 14: Миграция контента Модуля 1 к канону

**Files:**
- Modify: `src/lessons/module_1/u1/body.html`, `u2/body.html`, `u3/body.html`, `final/body.html`
- Create: `src/lessons/module_1/u1/answers.md`, `u2/answers.md`, `u3/answers.md`, `final/answers.md`.

**Interfaces:**
- Consumes: пройденный `lint.py` из Task 12.
- Produces: контент без ERROR, собранный `dist/module_1.html`.

- [ ] **Step 1: Прогнать линт и собрать список нарушений**

Run:
```bash
python3 src/lint.py module_1 2>&1 | tee /tmp/lint_before.txt
grep '^ERROR' /tmp/lint_before.txt | wc -l
```
Expected: число нарушений N (для планирования).

- [ ] **Step 2: Убрать инлайн-`style` и заменить на классы**

Для каждого найденного `style="..."` подобрать существующий класс или добавить
утилитарный класс в `core.css` (например `.mt-2`, `.muted`, `.center`). Если стиль
уникален для блока — расширить компонент в `components.json` и `core.css`, не inline.

- [ ] **Step 3: Заменить неизвестные классы на канонические**

Каждое `ERROR: неизвестный класс .X` — либо опечатка (заменить на класс из реестра),
либо отсутствующий компонент (добавить в `components.json` + `core.css`).

- [ ] **Step 4: Убрать prev/next навигацию, добавить оглавление**

Заменить блок `.lesson-nav` на оглавление модуля (список уроков с якорями) и
закрепить его sticky. В `build_module` оглавление строится из `module.json.order`.

Run:
```bash
grep -c 'ln-card' dist/module_1.html || true
grep -c 'ln-card' src/lessons/module_1/*/body.html || true
```
Expected: в `body.html` — 0 (навигацию генерирует билдер).

- [ ] **Step 5: Создать `answers.md` для каждого урока**

Формат:
```markdown
# Ответы · Модуль 1 · Урок 1

## Вопросы QA
1. Что изучает химия?
   - Вещества, их свойства и превращения.

## Фейнман
- Чем химия отличается от физики (на примере стакана воды)?
  - <ответ/ход разбора>

## Задачка★
- …
  - <ход решения>
```
Заполнить по каждому уроку (Фейнман, ★, практикум).

- [ ] **Step 6: Линт зелёный**

Run:
```bash
python3 src/lint.py module_1; echo "exit=$?"
```
Expected: `LINT OK`, `exit=0`.

- [ ] **Step 7: Ручная проверка и коммит**

Открыть `dist/module_1.html` на вертикальном телефоне: оглавление, тесты (все 3 типа),
симы, формулы, термины-подсказки, вёрстка без горизонтальной прокрутки.

```bash
git add src/lessons/module_1
git commit -m "content(module_1): migrate to canonical components, answers, TOC"
```

---

### Task 15: Синхронизация документации

**Files:**
- Modify: `DESIGN.md`, `STRUCTURE.md`, `PROGRAM.md`, `SIMULATIONS.md`, `SOURCES.md`

**Interfaces:**
- Consumes: принятые решения (спека §1), новые `course.json`/`components.json`, неймспейс `module_N`.
- Produces: доки, согласованные с кодом; `components.json` — машинный источник, DESIGN — человекочитаемый.

- [ ] **Step 1: Обновить `DESIGN.md`**

Внести правки по разделам:
- §1.5: триггер переезда — «сигнал даёт автор, не по расписанию».
- §2: добавить блок «реальная задача»; заменить prev/next на оглавление модуля + sticky.
- §3.3/новый: сослаться на `src/shared/data/components.json` как единственный машинный канон;
  добавить компоненты `formula`, `formula-block`, `reaction-arrow`, `state-tag`, `ox-state`,
  `atom-chip`, `term`, `sim`.
- §4: новый движок `quiz.js`; **80% везде** (включая safety); убрать «полбалла/вторую попытку»;
  неограниченный ретрай; 3 типа вопросов (`single`/`multi`/`match`); итоговый — выборка из банка;
  тексты из `messages.json`.
- §5: без изменений (Джонстон с 4б).
- §6: обёртка `makeSim`, сквозной LOD-переключатель «уровень глаз ↔ частицы», DPR + пауза rAF.
- §7: пометить выполненным для М1 после Task 16.

- [ ] **Step 2: Обновить `STRUCTURE.md`**

- Дерево: `course.json`, `BACKLOG.md`, `docs/`, `src/shared/data/`, `src/shared/shell.html`,
  `src/shared/sims/`, папки `module_N/uN/{lesson.md,body.html,answers.md}`, `modules/legacy/`.
- Имена: `module_1`, `module_2`, … сквозная нумерация; 3а/3б → `module_3` без букв.
- Убрать все `modNN`.

Run:
```bash
grep -n 'mod0[0-9]' STRUCTURE.md || echo "STRUCTURE clean"
```
Expected: `STRUCTURE clean`.

- [ ] **Step 3: Обновить `SIMULATIONS.md`**

- §2: пометить, что `elements.json` переехал в `src/shared/data/` и читается ядром `ChemDraw` (P2).
- §3: зафиксировать сквозной LOD-механизм макро↔микро как стандарт.
- §4: DPR и пауза rAF вне экрана — обязательны.

- [ ] **Step 4: Обновить `PROGRAM.md`**

`PROGRAM.md` остаётся черновиком автора. В начало секции с картой курса добавить строку:
```markdown
> Машинный источник структуры курса — `course.json`. Этот файл — черновик, правится вручную.
```
Текст не переписывать (переработка программы — отдельная задача автора).

- [ ] **Step 5: Обновить `SOURCES.md`**

Заменить пути `data/elements.json`, `data/glossary.md` на `src/shared/data/elements.json`,
`src/shared/data/glossary.json`.

Run:
```bash
grep -rn 'data/elements\|data/glossary' SOURCES.md DESIGN.md SIMULATIONS.md || echo "paths clean"
```
Expected: `paths clean`.

- [ ] **Step 6: Проверить отсутствие ссылок на снятое**

Run:
```bash
grep -rn 'manifest.json\|mod01\|mod02\|полбалл' DESIGN.md STRUCTURE.md PROGRAM.md SIMULATIONS.md || echo "stale refs clean"
```
Expected: `stale refs clean` (или каждая находка осознанно объяснена).

- [ ] **Step 7: Commit**

```bash
git add DESIGN.md STRUCTURE.md PROGRAM.md SIMULATIONS.md SOURCES.md
git commit -m "docs: sync design/structure/program/simulations/sources with refactor decisions"
```

---

### Task 16: Проверка пилота, уборка, тег

**Files:**
- Delete: `modules/mod01/` (ручная сборка)
- Create: git tag `module-1-v1`

**Interfaces:**
- Consumes: зелёный lint + ручная проверка Task 14; синхронизированные доки (Task 15).
- Produces: чистый репозиторий, эталонный тег.

- [ ] **Step 1: Подтверждение автора**

Автор открывает `dist/module_1.html` на телефоне и подтверждает канон. **Стоп-точка.**

- [ ] **Step 2: Удалить ручную сборку М1**

Run:
```bash
git rm -r modules/mod01
git commit -m "chore: remove hand-built module 1 (superseded by src build)"
```

- [ ] **Step 3: Обновить статусы в `course.json`**

`module_1.status`: `draft` → `ready` (все уроки, lint зелёный, entry/final, answers).
`module_2.status` → `draft` (пилот не трогаем).

- [ ] **Step 4: Тег**

Run:
```bash
git add course.json
git commit -m "chore(course): mark module_1 ready"
git tag -a module-1-v1 -m "Module 1 canonical build"
```

- [ ] **Step 5: Push (после создания приватного репозитория на GitHub)**

Run:
```bash
git remote add origin <PRIVATE_REPO_URL>
git push -u origin main --tags
```
Expected: ветка и тег отправлены.

---

## Self-Review

**1. Покрытие спеки:** P0 (Tasks 1–10: репо, course.json, data, components, неймспейс,
shell, module.json, авто-подбор, формулы/термины) и P1 (Tasks 11–16: quiz, lint, отчёт,
миграция, docs sync, уборка/тег). P2–P7 — вне этого плана (следующие планы по спеке §7).
Документы синхронизируются в Task 5 (частично) и Task 15 (полностью).

**2. Плейсхолдеров нет:** все новые файлы приведены целиком; миграция контента описана
конкретным списком шагов с проверками.

**3. Согласованность типов:** `detect_assets(body, mod) -> (css, js)`;
`lint_body(lesson, body) -> (errors, warns)`; JSON-островок `#quiz-<id>-data` +
`target`; `messages.json`/`glossary.json` островки `#messages`/`#glossary`.

**Известные риски исполнения:** миграция контента (Task 14) может вскрыть много
инлайн-стилей — это ожидаемо; при большом объёме разбить на под-коммиты по урокам.
