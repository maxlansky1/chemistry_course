# Glossary and Terms

Term storage: `src/shared/data/glossary.json`. Click on a `.term` in a lesson
shows a tooltip with the definition (engine `glossary.js`).

## When to add a term

Add a term the **first time it is used** in the course, before or when it appears
in a lesson. Rule: no term in the glossary → add the line first, then use it.

## Data shape

```json
{
  "вещество": { "definition": "то, из чего состоят физические тела", "module": "module_1" }
}
```

- key — the term as it appears in the text (lowercase, natural form);
- `definition` — one line, plain language, no formulas;
- `module` — where it is introduced (`module_N`).

## Markup in the lesson

First use in the lesson body:

```html
<span class="term" data-term="вещество">вещество</span>
```

Subsequent uses may stay plain text. Do not wrap every occurrence.

## Rules

- One-line definition; do not duplicate the full explanation from the prose.
- Do not add trivia or multiple senses; if a term has two senses, add two entries
  with a suffix (e.g. `"соль (поваренная)"`).
- The glossary is a reference for the reader, not a place for lesson content.
- Keep terms consistent with the textbook (Ерёмин) — see `SOURCES.md`.
