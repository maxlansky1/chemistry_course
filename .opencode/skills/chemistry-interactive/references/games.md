# Drop / Sort Games (`dropgames.js`)

A drag-and-drop sorting game with a mandatory **click fallback** (tap the card,
then tap the basket) for phones and tldraw.

## API

```html
<div class="game-area">
  <div class="game-pool" id="pool-substances"></div>
  <div class="dual-basket">
    <div class="basket" data-cat="solid"><div class="basket-title">Твёрдые</div><div class="basket-items"></div></div>
    <div class="basket" data-cat="liquid"><div class="basket-title">Жидкие</div><div class="basket-items"></div></div>
  </div>
  <div class="game-feedback" id="fb-substances"></div>
  <button class="reset-btn" id="reset-substances">Заново</button>
</div>
<script>
  makeDropGame({
    poolId: 'pool-substances',
    feedbackId: 'fb-substances',
    resetId: 'reset-substances',
    items: [
      { label: 'Соль', cat: 'solid' },
      { label: 'Вода', cat: 'liquid' }
    ]
  });
</script>
```

`makeDropGame(opts)` fields: `poolId`, `feedbackId`, `resetId`, `items[]`
(each `{label, cat}`). `cat` must match a basket's `data-cat`.

## Rules

- **2–4 baskets** maximum. Use `.dual-basket` (2) or `.triple-basket` (3).
- Click fallback is mandatory: selecting a card shows "Выбрано: … Теперь нажми на
  нужную корзину."
- Correct drop → `.good` flash; wrong → `.bad` flash; card may be retried.
- `resetId` returns all cards to the pool.

## Multiple games on one page

`dropgames.js` selects all `.basket` on the page and assumes **one game per page**.
`m2_drop.js` is the scoped variant (filters baskets by `data-cat` shared with the
game's items) and supports several games per page. When migrating a lesson with
more than one game, use the scoped variant.

## Data lives in the page

Unlike quizzes, game items are passed in the `makeDropGame` call (a small inline
`<script>`), not in a JSON island. Keep the inline script minimal — data only.

## Common mistakes

| Mistake | Fix |
|---|---|
| `cat` not matching any `data-cat` | align values |
| Only drag & drop, no click | keep the click fallback |
| 5+ baskets | split into two games |
| Two games with `dropgames.js` | switch to `m2_drop.js` scoping |
