# Maps: timeline, sciences, methods, equipment

All four engines share one pattern: a list of clickable elements plus a detail
panel filled from a `DATA` array/object. This is the taxonomy type `map` —
"explore a map".

## Shared pattern

```html
<div class="timeline">
  <div class="timeline-item">…</div>   <!-- one per entry -->
  <div class="timeline-detail" id="timelineDetail"></div>
</div>
```

The engine selects the items, listens for click, and writes the matching `DATA`
entry into the detail element. The first entry is usually selected by default.

## Per-engine specifics

| Engine | Trigger element | Detail container | Data key |
|---|---|---|---|
| `timeline.js` | `.timeline-item` | `#timelineDetail` | array index |
| `sciences.js` | `.sci-node` (with `data-sci`) | `#sciDetail` | object key (`physics`, `biology`, …) |
| `methods.js` | `.method-step` | `#methodDetail` | array index |
| `equip.js` | `.equip-card` | `#equipDetail` | array index (clicks first by default) |

## Rules

- Data lives inside the engine's `DATA` array (until migrated to JSON islands).
  Keep labels and texts in sync with the markup order/keys.
- Every item must be tappable (≥44px) and work without hover.
- Use `map` for "explore", not for grading — no scores.
- Reuse the same engine across modules; do not fork a new variant.

## Common mistakes

| Mistake | Fix |
|---|---|
| Markup count ≠ DATA length | match one entry per item |
| `data-sci` key not in `DATA` | align keys |
| Detail panel id typo | must match the engine's expected id |
