# Branching Scenarios (`scenarios.js`)

A situation with a choice of actions and a consequence — used for safety and for
procedure choices (method, indicator, order of operations).

## Shape

```js
{
  situation: 'Ты случайно разбил пробирку с раствором соли.',
  actions: [
    'Соберу осколки руками',
    'Сообщу учителю и уберу осколки щёткой и совком',
    'Закопаю осколки в мусорное ведро',
    'Продолжу работу'
  ],
  correct: 1,
  why: 'Осколки нельзя собирать руками — можно порезаться…'
}
```

The engine (IIFE) reads `#scenariosContainer`, renders each situation, and on
click highlights `correct` / wrong and shows `why`.

## Rules

- One `correct` action per situation; explanation `why` is mandatory.
- Actions must be realistic — no joke options that can never be chosen.
- Safety scenarios use the gate pattern: the student must work through every
  situation; mistakes are allowed and can be retried inside the walkthrough.
- Reuse for non-safety choices too: which separation method, which indicator,
  which order of lab operations — same shape.

## Migration note

`scenarios.js` currently hardcodes the `SCENARIOS` array inside the engine. The
target state (like quizzes) is data in a JSON island (`#scenarios-data`) so the
engine is generic. Until then, edit the data inline and keep it per-lesson.

## Common mistakes

| Mistake | Fix |
|---|---|
| Bare correct/incorrect | add `why` |
| Two correct actions | keep exactly one |
| Gating without an exit | always allow retry / completion |
