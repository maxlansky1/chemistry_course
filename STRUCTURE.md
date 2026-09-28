# STRUCTURE.md — словарь структуры проекта

Источник правды по папкам, файлам и именам. Правится при любом добавлении папки,
модуля или урока. Связи: `PROGRAM.md` (уровни), `DESIGN.md` (каркас и компоненты),
`SIMULATIONS.md` (сущности симов), `course.json` (машинная структура курса).

---

## 1. Дерево

```
chemistry_course/
├── course.json           # машинная структура курса: уровни A–F, модули, темы, навыки, статус
├── BACKLOG.md            # версионируемый бэклог
├── PROGRAM.md            # человекочитаемая программа (черновик; источник — course.json)
├── DESIGN.md             # дизайн-система
├── SIMULATIONS.md        # визуальные сущности
├── STRUCTURE.md          # этот словарь
├── SOURCES.md            # источники
├── .gitignore            # .env, .repowise/, мусор — в git не едут
├── .env                  # TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (только локально)
├── docs/superpowers/     # спеки и планы (specs/, plans/)
│
├── src/
│   ├── build.py          # сборка: module.json + body.html → dist/; подкоманды `new`, `--send`
│   ├── lint.py           # проверки канона/данных (ERROR/WARN)
│   ├── shared/
│   │   ├── shell.html    # HTML-шаблон оболочки
│   │   ├── css/          # core.css (+ модульные при необходимости)
│   │   ├── js/           # quiz.js, glossary.js, fade.js и др. движки
│   │   ├── sims/         # ядро симуляций (ChemDraw, makeSim)
│   │   ├── snippets/     # legend_fold.html, feynman_fold.html
│   │   └── data/         # components.json, glossary.json, elements.json, sims.json, messages.json
│   └── lessons/
│       └── module_1/
│           ├── module.json          # единый: meta + order + уроки (css/js или авто-подбор)
│           └── u1/
│               ├── lesson.md        # черновик автора (билдер НЕ читает)
│               ├── body.html        # канонический контент (вход билдера)
│               └── answers.md       # ответы для учителя
│
├── modules/
│   └── legacy/           # старые монолиты М1–М4б, только чтение
│
└── dist/                 # собранные файлы (коммитятся)
    ├── module_1.html
    ├── module_1.message.txt
    └── module_1/…        # поурочные файлы
```

## 2. Правила имён

Только английский, lowercase, без пробелов: `module_N` (сквозная нумерация; сплитов
`module_3a`/`module_3b` больше нет — 3а и 3б сливаются в `module_3`), `uN` (уроки внутри
модуля с 1), `final`, `entry`. Кириллицы, заглавных, пробелов в именах нет — человеческие
названия живут внутри файлов (hero) и в `course.json`.

## 3. Карта код → человек

| Код | Модуль | Уроки | Тесты |
|---|---|---|---|
| `module_1` | Химия как наука (A) | u1: как учимся + что изучает химия; u2: свойства + химия и жизнь; u3: лаборатория | разогрев + входной (нет) / final |
| `module_2` | Агрегатные состояния и смеси (A) | entry + 3 урока | entry + final |
| `module_3` | Химические явления (A) | по программе | entry + final |
| `module_4` | Атомы и молекулы (A) | по программе | entry + final |
| `module_5`–`module_14` | по `course.json` | позже | entry + final |

## 4. Слои работы

1. **Автор** пишет `lesson.md` — свободный черновик.
2. **Агент** по скиллу + `components.json` + DESIGN делает `body.html` + `answers.md`.
3. **Билдер** `python3 src/build.py module_N` собирает `dist/`.
4. **Линт** `python3 src/lint.py module_N` — ворота «готово».
5. **Доставка** `python3 src/build.py module_N --send` — файл в Telegram.

## 5. Что где лежит

- Канон блоков/классов — `src/shared/data/components.json` (единственный машинный источник).
- Термины — `src/shared/data/glossary.json`; элементы (CPK) — `elements.json`;
  тексты результатов — `messages.json`; реестр симов — `sims.json`.
- Вопросы QA уроков и порядок — `module.json`.
- Ответы для учителя — `answers.md` рядом с уроком (в файл не встраиваются).
