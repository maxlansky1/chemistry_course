# Prose, Tone and Feynman

## Narrator

Neutral, friendly, no pathos. Russian, second person singular («давай разберёмся»).
No emojis as content (emoji are allowed as icons only). No «дорогой ученик».

## Two-layer examples

Every abstract idea gets a pair of examples:
- **everyday** — kitchen, home, everyday objects;
- **applied/adult** — medicine, industry, ecology.

Example: "растворимость: сахар в чае (бытовой) · соли в морской воде и получение
лекарств (прикладной)".

## Age fit (scientific-popular for any age)

Write so that a 7th-grader understands and an adult does not feel it is childish —
the level of Perelman and Feynman. Rules:
- short sentences; one idea per sentence;
- explain a term the first time it appears (and add it to `glossary.json`, see
  `glossary.md`);
- no unexplained jargon; no formulas before their module;
- concrete before abstract: show a phenomenon, then name it.

## Callouts — 4 fixed meanings

| Class | Meaning |
|---|---|
| `.callout-idea` | key idea / analogy |
| `.callout-warn` | warning / safety |
| `.callout-note` | note / fact |
| `.callout-ok` | success / conclusion |
| `.cta` | call to action (bold purple) |

Do not invent new meanings; the legend is fixed (DESIGN.md §1.2).

## No answers in the file

`body.html` must never contain ready answers to:
- QA cards (the answer is born during the lesson);
- Feynman prompts;
- the starred task (`.thinker`);
- tests (answers live in the quiz JSON island and `answers.md`).

## Feynman prompts

- 2–4 open questions "explain in your own words".
- Address a younger listener: «объясни брату/сестре/сыну».
- Instruction: "explain aloud → write it in the notebook".
- Self-check criterion: "would a younger student understand? where you stumbled —
  go back to the topic".
- The author writes the model answers in `answers.md`.

## Common mistakes

| Mistake | Fix |
|---|---|
| "верно/неверно" with no explanation | explanation is mandatory in quizzes (`why`) |
| Answer hides in a spoiler block | remove; answers go to `answers.md` |
| Wall of text | break into blocks; add an interactive |
| Jargon without definition | define + add to glossary |
| Baby talk or dry academic tone | neutral narrator, two-layer examples |
