---
name: chemistry-review
description: Use when reviewing a draft or finished chemistry lesson for pedagogical quality — structure, tone, real-life task, Feynman quality, cognitive load, age fit, prerequisites, and completeness of answers. Not for mechanical checks (lint does those) and not for rewriting.
---

# Chemistry Lesson Review

## Overview

Pedagogical quality gate for a written lesson. It **reports remarks; it does not
edit the lesson.** Mechanical canon (classes, inline styles, tag balance, quiz
JSON, JS syntax) is already covered by `python3 src/lint.py` — this skill judges
what a linter cannot: is this lesson good for a student?

## When to Use

Use when:
- the author asks to "review/check a lesson" (draft or finished);
- after `chemistry-lesson` writes a lesson, as a final quality pass.

Do NOT use when:
- the task is to fix or rewrite → `chemistry-lesson` / `chemistry-interactive`;
- only mechanical validation is wanted → `python3 src/lint.py`.

## Inputs

`body.html`, `answers.md`, `module.json`, `course.json` (prereqs), `DESIGN.md` §2,
`lesson.md` (author intent). Run `python3 src/lint.py <module>` first — if it fails,
report that and stop; review judgment only on lint-clean content.

## What to Check

Full list in `references/checklist.md`. Headlines:

1. **Structure** — blocks present and in skeleton order (optional blocks may be omitted).
2. **Objectives** — the lesson achieves clear learning objectives.
3. **Real-life task** — present, concrete, not fake.
4. **Feynman** — open prompts, addressed to a younger listener, no answers in file.
5. **Tone** — neutral narrator, two-layer examples (everyday + applied).
6. **Age fit** — understandable to 7th grade, not childish for an adult.
7. **Cognitive load** — length, density, pace; ~15–20 min reading.
8. **Prerequisites** — nothing assumed beyond `course.json`; Johnstone not used before 4b.
9. **Completeness** — recap, homework (5 tasks, last starred), starred task without
   answer, notebook memo.
10. **Answers** — `answers.md` covers QA, tests, Feynman, and the starred task.

## Output Format

An ordered remark list, most severe first. Each remark:

```
[blocker|major|minor] <location> — <what is wrong> → <suggested fix>
```

- `blocker` — lesson cannot ship (missing key block, answer leaked into the file,
  concept beyond prerequisites);
- `major` — quality problem the author should fix (weak real-life task, unclear tone);
- `minor` — polish (wording, ordering, density).

End with a one-line verdict: `READY` (no blockers/majors) or `NEEDS WORK (N blockers, M majors)`.

## Rules

- Do not edit files. Do not run `build.py --send`. Do not fix anything yourself.
- Base remarks on evidence: quote the block/location.
- Do not invent requirements beyond `DESIGN.md` / `course.json`.
- If `lint` fails, the only output is the lint failure.

## Reference Files

- `references/checklist.md` — the full review checklist.
