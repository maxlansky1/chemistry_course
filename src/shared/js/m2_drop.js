// ============================================================
//  ДРОП-ИГРЫ
// ============================================================
function makeDropGame(opts) {
  const pool = document.getElementById(opts.poolId);
  const baskets = document.querySelectorAll(`#${opts.poolId}`) ? document.querySelectorAll('.basket[data-cat]') : [];
  const fb = document.getElementById(opts.feedbackId);
  const resetBtn = document.getElementById(opts.resetId);
  if (!pool || !fb) return;

  // Отфильтруем корзины именно для этой игры (по совпадению data-cat с ключами)
  const validCats = new Set((opts.items || []).map(i => i.cat));
  const gameBaskets = Array.from(baskets).filter(b => validCats.has(b.dataset.cat));

  let selected = null;

  function buildPool() {
    pool.innerHTML = '';
    (opts.items || []).forEach(it => {
      const el = document.createElement('div');
      el.className = 'pool-item';
      el.textContent = it.label;
      el.dataset.cat = it.cat;
      el.draggable = true;
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', it.label);
        e.dataTransfer.effectAllowed = 'move';
        selected = el;
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
      el.addEventListener('click', () => {
        if (el.classList.contains('placed')) return;
        pool.querySelectorAll('.pool-item').forEach(i => i.classList.remove('selected'));
        if (selected === el) {
          selected = null;
          fb.textContent = '';
          return;
        }
        selected = el;
        el.classList.add('selected');
        fb.style.color = 'var(--muted)';
        fb.textContent = `Выбрано: ${el.textContent}. Теперь нажми на нужную корзину.`;
      });
      pool.appendChild(el);
    });
  }

  function resetBaskets() {
    gameBaskets.forEach(b => {
      const items = b.querySelector('.basket-items');
      if (items) items.innerHTML = '';
      b.classList.remove('good', 'bad');
    });
  }

  function checkComplete() {
    const remaining = pool.querySelectorAll('.pool-item').length;
    if (remaining === 0) {
      fb.style.color = 'var(--green)';
      fb.textContent = '🎉 Отлично! Всё разложено правильно!';
    }
  }

  function tryPlace(item, basket) {
    if (!item || !basket) return;
    if (item.classList.contains('placed')) return;
    const target = basket.dataset.cat;
    const correct = item.dataset.cat === target;

    if (correct) {
      const container = basket.querySelector('.basket-items');
      const chip = document.createElement('div');
      chip.className = 'basket-chip';
      chip.textContent = item.textContent;
      container.appendChild(chip);
      item.classList.add('placed');
      item.remove();
      selected = null;
      basket.classList.add('good');
      setTimeout(() => basket.classList.remove('good'), 500);
      fb.style.color = 'var(--green)';
      const okMessages = ['✅ Верно!', '👍 Точно!', '🎯 Правильно!', '🌟 В точку!'];
      fb.textContent = okMessages[Math.floor(Math.random() * okMessages.length)];
      checkComplete();
    } else {
      basket.classList.add('bad');
      setTimeout(() => basket.classList.remove('bad'), 500);
      item.classList.add('wrong-flash');
      setTimeout(() => item.classList.remove('wrong-flash'), 600);
      fb.style.color = 'var(--red)';
      const badMessages = [
        '❌ Подумай ещё раз.', '❌ Будь внимательнее.', '❌ Давай разберёмся: это не сюда.',
        '❌ Почти! Но не в эту корзину.', '❌ Хм, не то. Попробуй снова.'
      ];
      fb.textContent = badMessages[Math.floor(Math.random() * badMessages.length)];
    }
  }

  gameBaskets.forEach(basket => {
    basket.addEventListener('dragover', (e) => { e.preventDefault(); basket.classList.add('hover'); });
    basket.addEventListener('dragleave', () => basket.classList.remove('hover'));
    basket.addEventListener('drop', (e) => {
      e.preventDefault();
      basket.classList.remove('hover');
      if (selected) tryPlace(selected, basket);
    });
    basket.addEventListener('click', () => {
      if (selected) tryPlace(selected, basket);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetBaskets();
      buildPool();
      selected = null;
      fb.textContent = '';
    });
  }

  buildPool();
}

// Игра: чистое / гомогенное / гетерогенное
makeDropGame({
  poolId: 'mixturesPool',
  feedbackId: 'fbMixtures',
  resetId: 'resetMixtures',
  items: [
    { label: '💧 Дистиллированная вода', cat: 'pure' },
    { label: '🌬 Воздух', cat: 'homogeneous' },
    { label: '🏖 Песок с опилками', cat: 'heterogeneous' },
    { label: '🥇 Чистое золото', cat: 'pure' },
    { label: '🍯 Раствор сахара', cat: 'homogeneous' },
    { label: '🥛 Молоко', cat: 'heterogeneous' },
    { label: '💎 Алмаз', cat: 'pure' },
    { label: '🥃 Спирт + вода', cat: 'homogeneous' },
    { label: '🪨 Гранит', cat: 'heterogeneous' },
    { label: '🧂 Чистая соль', cat: 'pure' },
    { label: '🧪 Уксус', cat: 'homogeneous' },
    { label: '🌊 Вода с глиной', cat: 'heterogeneous' }
  ]
});

// Игра: способ разделения
makeDropGame({
  poolId: 'separationPool',
  feedbackId: 'fbSeparation',
  resetId: 'resetSeparation',
  items: [
    { label: '🌊 Песок + вода', cat: 'filter' },
    { label: '🧂 Соль + вода', cat: 'evaporate' },
    { label: '🧲 Железо + сера', cat: 'magnet' },
    { label: '🥃 Спирт + вода', cat: 'distill' },
    { label: '☕ Чай с чаинками', cat: 'filter' },
    { label: '🌊 Морская вода', cat: 'evaporate' },
    { label: '🔩 Железные опилки + песок', cat: 'magnet' },
    { label: '💧 Дистиллированная вода из крана', cat: 'distill' },
    { label: '🥛 Мел + вода', cat: 'filter' },
    { label: '🧪 Сахарный сироп', cat: 'evaporate' },
    { label: '🫒 Масло + вода', cat: 'settle' },
    { label: '🌶 Соль + перец', cat: 'filter' },
    { label: '🎨 Чернила', cat: 'chrom' },
    { label: '🌿 Пигменты листа', cat: 'chrom' }
  ]
});
