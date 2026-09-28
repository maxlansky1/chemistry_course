# Canonical Block Palette

**Source of truth:** `src/shared/data/components.json`. This file is a reading
aid — when in doubt, read the registry. Never invent a class; if a block is
genuinely missing, add it to the registry and `core.css` first.

## Meaning → component

| I want to… | Component id | Key classes | Resource |
|---|---|---|---|
| open the lesson | `hero` | `.hero`, `.badge` | core |
| show a key idea / warning / note / conclusion | `callout` | `.callout`, `.callout-idea/-warn/-note/-ok` | core |
| call to action | `cta` | `.cta` | core |
| group cards | `card-grid` | `.card-grid`, `.card`, `.c-title`, `.c-desc` | core |
| group tasks | `task-grid` | `.task-grid`, `.task-card`, `.tc-*` | core |
| show the module legend | `legend` | `.legend-grid`, `.legend-card` | core |
| drop game (sort) | `dropgame` | `.game-area`, `.game-pool`, `.basket`, … | `dropgames` |
| quiz / micro-question | `quiz` | `.test-question`, `.test-option`, … | `quiz` |
| timeline | `timeline` | `.timeline`, `.timeline-item`, `.t-*` | `timeline` |
| click → detail panel | `sciences`/`methods`/`equip` | `.sci-node`, `.method-step`, `.equip-card` | js per id |
| branch scenario | `scenarios` | `.scenario-card`, `#scenariosContainer` | `scenarios` |
| Feynman prompts | (prose + `.notebook-task`) | — | core |
| starred task | `thinker` | `.thinker` | core |
| recap | `recap-card` | `.recap-card` | core |
| "write in notebook" memo | `notebook-task` | `.notebook-task` | core |
| homework | `homework` | `.homework`, `.hw-star` | core |
| video placeholder | `video-slot` | `.video-slot` | core |
| formula | `formula` | `.formula` | core |
| equation | `formula-block` | `.formula-block`, `.reaction-arrow`, `.state-tag` | core |
| element chip | `atom-chip` | `.atom-chip` | `chemdraw` |
| term tooltip | `term` | `.term` | `glossary` |
| simulation | `sim` | `.sim`, `.sim-*` | `makesim` |
| fade on scroll | `fade-in` | `.fade-in` | `fade` |
| layout utilities | `util` | `.mt-14/.mt-16/.mt-18/.mt-22/.center-mt16/.prose/.lead/.hero-nav/.list-note/.fs-26` | core |

## Layout utilities (replace inline styles)

Use these classes instead of `style="..."`: `.mt-14 .mt-16 .mt-18 .mt-22`
margins, `.center-mt16` centered block, `.prose` body paragraph, `.lead`
muted intro, `.hero-nav` hero navigation line, `.list-note` list note, `.fs-26`
big number. If a needed utility is missing, add it to `components.json` (`util`)
and `core.css` — never inline.

## The builder owns the shell

- Do not wrap the body in `<div class="container">`; the builder adds it.
- Keep `<div>`/`<section>` balanced. The builder strips a legacy container open/close.
- `${legend_fold}` and `${feynman_fold}` snippets are injected at module start only.
- QA cards are rendered from `module.json` into `<!--QA-->`.
