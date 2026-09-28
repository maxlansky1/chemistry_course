# Formulas and Chemical Notation

Never type a formula freehand. Use the canonical components (all in `core.css`).
Subscripts and charges use HTML `<sub>`/`<sup>` — **not** Unicode subscripts — so
rendering and copy behaviour stay consistent.

## Components

| Need | Markup |
|---|---|
| Formula | `<span class="formula">H<sub>2</sub>O</span>` |
| Charge | `Ca<sup>2+</sup>`, `Cl<sup>−</sup>` |
| Equation | `<div class="formula-block">2H<sub>2</sub> + O<sub>2</sub> <span class="reaction-arrow">→</span> 2H<sub>2</sub>O</div>` |
| Reversible | `<span class="reaction-arrow">⇌</span>` |
| Condition over/under arrow | `<span class="reaction-arrow">→<span class="cond top">t°</span><span class="cond bottom">кат.</span></span>` |
| State of matter | `<span class="state-tag">(г)</span>` / `(ж)` / `(тв)` / `(р-р)` |
| Oxidation state | `<span class="ox-state">+2</span>` |
| Inline element chip | `<span class="atom-chip" data-el="H"></span>` |

## Rules

- Equations go in `.formula-block` (a block), never inline in a sentence.
- Use `→` for irreversible, `⇌` for reversible; conditions above/below the arrow.
- Oxidation states are introduced only from **module 13** (ОВР) — before that, do
  not show them.
- Coefficients are plain numbers before the formula: `2H<sub>2</sub>O`.
- Atoms in the coefficient are placed with `.formula`; molecule formulas get
  subscripts.
- Provide an `aria-label` with the spoken form when a formula is a key element
  ("аш два о") for accessibility.

## Common mistakes

| Mistake | Fix |
|---|---|
| `H₂O` with a Unicode subscript | use `<sub>` |
| Equation as a plain sentence | wrap in `.formula-block` |
| `=>` or `->` instead of arrow | use `→` / `⇌` |
| Conditions written after the equation | put on the arrow (`.cond.top`/`.bottom`) |
| Oxidation state shown in module < 13 | remove |
