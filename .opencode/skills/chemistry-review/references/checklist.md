# Review Checklist

Work top to bottom. Mark each item ✔ / ✘ / n/a and attach a remark for every ✘.

## 0. Mechanical gate

- [ ] `python3 src/lint.py <module>` prints `LINT OK`. If not — report the lint
      output and stop.

## 1. Structure (DESIGN.md §2)

- [ ] hero with badge, title, QA placeholders rendered.
- [ ] theory before interactive; interactive before practice.
- [ ] real-life task block present.
- [ ] Feynman block present and open-ended.
- [ ] starred task (`.thinker`) present, no answer in file.
- [ ] recap (`.recap-card`), homework (`.homework`), notebook memo present.
- [ ] final test only in the `final` lesson.

## 2. Learning objectives

- [ ] 2–4 objectives exist and the lesson actually reaches them.
- [ ] Nothing important is promised but not delivered.

## 3. Real-life task

- [ ] Tied to the topic, concrete, believable (not a decorative question).
- [ ] Explains what chemistry solves here.

## 4. Feynman

- [ ] Open prompts ("explain in your own words").
- [ ] Addressed to a younger listener.
- [ ] No ready answer in `body.html`.
- [ ] Model answers present in `answers.md`.

## 5. Tone and examples

- [ ] Neutral narrator; no pathos; no baby talk.
- [ ] Two-layer examples (everyday + applied) for abstract ideas.
- [ ] Callout colors used with their fixed meanings.

## 6. Age fit

- [ ] Understandable to a 7th-grader.
- [ ] Not childish for an adult reader.
- [ ] Terms defined on first use.

## 7. Cognitive load

- [ ] Reading time ~15–20 min; not a wall of text.
- [ ] Blocks not too dense; interactives break up the theory.
- [ ] One new idea at a time.

## 8. Prerequisites

- [ ] Nothing assumed beyond `course.json` prereqs.
- [ ] Johnstone triangle not mentioned before module 4b.

## 9. Completeness

- [ ] Homework: ≥5 tasks, last one starred, written-in-notebook cue.
- [ ] Starred task has no answer in the file.
- [ ] Recap: 5–7 theses + terms; formulas only if taught.
- [ ] Notebook memo says exactly what to write.

## 10. Answers

- [ ] `answers.md` covers QA, all tests, Feynman, and the starred task.
- [ ] No answers leaked into `body.html`.

## Verdict

- [ ] All blockers and majors resolved → `READY`, else `NEEDS WORK (…)`.
