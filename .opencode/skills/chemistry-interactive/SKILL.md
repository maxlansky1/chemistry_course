---
name: chemistry-interactive
description: Use when authoring or fixing any non-simulation interactive in a chemistry lesson — quizzes and tests, drop/sort games, branching safety scenarios, timelines, science maps, or equipment explorers.
---

# Chemistry Interactives

## Overview

Authors and fixes every interactive block of the course **except simulations**
(those belong to `chemistry-sim`). Each interactive is one of the taxonomy types
below and is backed by a shared engine in `src/shared/js/`. Interactives never
contain bespoke JS: they are markup hooks plus data.

## When to Use

Use when:
- writing or editing a quiz/test, drop game, scenario, timeline/map, or equipment
  explorer;
- a lesson needs a micro-question after a simulation (config `practice`).

Do NOT use when:
- the block is a simulation → `chemistry-sim`;
- only prose/lesson structure is needed → `chemistry-lesson`.

## Type → Engine Map (closed list)

| Type | Engine | Data location |
|---|---|---|
| `quiz` | `quiz.js` | JSON island `<script type="application/json" id="quiz-<id>-data">` |
| `sort` | `dropgames.js` | page markup + `makeDropGame({...})` call |
| `scenario` | `scenarios.js` | `#scenariosContainer` (data inside the JS template — pending migration) |
| `map` | `timeline.js` / `sciences.js` / `methods.js` / `equip.js` | click element → detail panel |

All engine files live in `src/shared/js/`. The builder auto-includes the engine
based on detected blocks, but during migration the module's `module.json` may list
`js`/`css` explicitly.

## Workflow

1. Classify the block as one taxonomy type.
2. Pick the engine from the map; read its reference file.
3. Write the **data** (quiz JSON, game items, scenario list).
4. Add the **hook** markup with the required id/`data-*` and config.
5. Run `python3 src/lint.py <module>` (validates quiz data and classes) then
   `python3 src/build.py <module>`.

## Reference Files

- `references/quiz.md` — quiz configs, 3 question types, thresholds, bank, messages.
- `references/games.md` — drop/sort games with click fallback.
- `references/scenarios.md` — branching scenarios and gates.
- `references/maps.md` — timelines, science maps, methods, equipment explorers.

## Global Rules

- **80% threshold everywhere**; no half-points; unlimited retries; no content lock.
- Every question has a non-empty `why` (explanation) — no bare correct/incorrect.
- Shuffle questions and options on each render.
- `final` draws a random subset from a bank.
- Result texts come from `src/shared/data/messages.json`, not hardcode.
- Tap targets ≥44px; hover always duplicated by tap; no anti-click protection.
- Maximum 4 baskets per drop game.
- Engines no-op safely when their DOM is absent — never rely on another lesson's ids.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Quiz JS written into the lesson | use `quiz.js` + JSON island |
| Bare "верно/неверно" | add `why` |
| Threshold not 80% | set 80% |
| Answers shown before answering | lock the question after the first answer |
| Game with >4 baskets | split or reduce |
| Inline style on interactive | use canonical classes |

## Definition of Done

- Block uses the correct engine and data shape.
- `python3 src/lint.py <module>` → `LINT OK` (quiz data valid, classes canonical).
- `python3 src/build.py <module>` → `OK`.
