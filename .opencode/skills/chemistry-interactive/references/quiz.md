# Quizzes (`quiz.js`)

One engine for every test. Data lives in a JSON island; the engine renders,
scores and explains.

## Host + island

```html
<div id="quiz-u1-warmup" data-config="warmup"></div>
<script type="application/json" id="quiz-u1-warmup-data">
{ "config": "warmup", "questions": [ … ] }
</script>
```

- The island id must start with `quiz-` and end with `-data`.
- Target host = island id without `-data`, or an explicit `"target": "quiz-…"`.
- Naming convention: `quiz-<lesson>-<role>` (`quiz-u1-warmup`, `quiz-u3-practice`,
  `quiz-final`).

## Configs

| `config` | Questions | Threshold | Result text (messages.json) |
|---|---|---|---|
| `warmup` | 5 | — | `warmupDone` |
| `entry` | 10 | 80% | pass → `practiceDone`, fail → `entryFail` |
| `practice` | by topic | — | `practiceDone` |
| `final` | bank subset (e.g. 15 of 30) | 80% | `finalPass` / `finalFail` |
| `safety` | 5 | 80% | `practiceDone` |

Optional fields: `"threshold": <int>`, `"bank": <int>`, `"shuffle": false`.

## Question types

**single** — one correct:
```json
{ "type": "single", "q": "…", "options": ["…","…"], "correct": 1, "why": "…" }
```
**multi** — several correct:
```json
{ "type": "multi", "q": "…", "options": ["…","…","…"], "correct": [0,2], "why": "…" }
```
**match** — pair left↔right (`correct[i]` = index of the right item for left `i`):
```json
{ "type": "match", "q": "…", "left": ["…","…"], "right": ["…","…"], "correct": [1,0], "why": "…" }
```

## Mechanics (enforced by the engine)

- Questions and options are shuffled on every render.
- One attempt per question: after clicking, options lock and the explanation shows.
- Score is `correctCount`, shown only at the end together with an error review.
- A "Пройти заново" button re-renders with a fresh shuffle — unlimited.

## Result texts

Never hardcode result text in the island. The engine picks a random phrase from
`src/shared/data/messages.json` by config/situation. To add a phrase, edit that file.

## Micro-questions after a simulation

Use `config: "practice"` with 1–2 questions ("what you saw → what it means"),
no threshold. Same engine.

## Validation

`python3 src/lint.py <module>` checks every island: valid JSON, ≥2 options for
single/multi, correct `correct`, non-empty `why`, `match` length equality.

## Common mistakes

| Mistake | Fix |
|---|---|
| Island id not ending in `-data` | rename to `quiz-…-data` |
| Host id mismatch | set `"target"` or match ids |
| Missing `why` | lint ERROR — add explanation |
| Threshold ≠ 80% | set 80% |
| Bank bigger than the array | `bank` must be ≤ number of questions |
