# Planning a Lesson

The plan is a contract with the author: what the lesson must achieve and which
canonical blocks implement it. Plan before writing prose.

## 1. Extract learning objectives

From `lesson.md`, `module.json` (`questions`, `title`) and `course.json`
(`themes`, `skills`), write **2–4 objectives** in the form
"The student can <verb> <what>" (understand / distinguish / describe / apply).
Avoid vague verbs ("know about", "get familiar").

Example (module_1 · u2):
- distinguish substances by properties (color, smell, hardness, solubility, flammability);
- describe a substance according to a plan;
- find chemistry in everyday life.

## 2. Check prerequisites

Read the module's `prereq` in `course.json`. The lesson may reference earlier
modules **only in plain text** (separate offline files cannot be linked). Never
assume a concept that is not yet taught (e.g. no Johnstone triangle before module 4).

## 3. Choose blocks for each objective

For every objective pick one or more canonical blocks (`blocks.md`), e.g.:

| Objective | Blocks |
|---|---|
| Understand an idea | theory prose + `.callout-idea` |
| See it | a simulation (`watch`/`tune`) via `chemistry-sim` |
| Practise | `practice` quiz or `.notebook-task` |
| Check understanding | `final`/`warmup` quiz via `chemistry-interactive` |
| Apply to real life | **real-life task** block |

## 4. Lay out the block plan

Write the plan top-to-bottom in skeleton order (`SKILL.md`). Mark each block
type and its purpose. Example:

```
hero           — badge, title, QA placeholders
warmup         — 5 questions, no grade        (chemistry-interactive)
theory §1      — what properties are; callout-idea
interactive    — property simulator           (chemistry-interactive)
real-life task — "how to tell salt from sugar at home"
practice       — 5-question quiz              (chemistry-interactive)
Feynman        — "explain to your sibling how to tell salt from sugar"
thinker ★      — one open question, no answer in file
recap          — 5–7 theses + terms
homework       — 5 tasks in the notebook, last one ★
```

## 5. Timing

Target **15–20 minutes** of reading. If the plan exceeds it, split the lesson
rather than cram. Tests are separate (`~10 min`). The `~20 минут` in
`module.json` is the recommended study time.

## 6. Save the plan

Put the plan at the top of the work (chat or a scratch comment). Get the
author's approval on the plan before writing full prose — it is cheaper to fix
a plan than a finished lesson.
