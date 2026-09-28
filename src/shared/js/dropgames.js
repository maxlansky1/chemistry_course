// ============================================================
//  ДРОП-ИГРЫ (универсальная механика)
// ============================================================
function makeDropGame(opts) {
  const pool = document.getElementById(opts.poolId);
  const baskets = document.querySelectorAll('.basket');
  const fb = document.getElementById(opts.feedbackId);
  const resetBtn = document.getElementById(opts.resetId);
  if (!pool || !fb) return;

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
      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
      });
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
    baskets.forEach(b => {
      const items = b.querySelector('.basket-items');
      if (items) items.innerHTML = '';
      b.classList.remove('good', 'bad');
    });
  }

  function checkComplete() {
    const remaining = pool.querySelectorAll('.pool-item').length;
    if (remaining === 0) {
      fb.style.color = 'var(--green)';
      const messages = [
        '🎉 Отлично! Всё разложено правильно!',
        '✅ Превосходно! Ты справился!',
        '🌟 Супер! Все карточки на своих местах!'
      ];
      fb.textContent = messages[Math.floor(Math.random() * messages.length)];
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
        '❌ Подумай ещё раз.',
        '❌ Будь внимательнее.',
        '❌ Давай разберёмся: это не сюда.',
        '❌ Почти! Но не в эту корзину.',
        '❌ Хм, не то. Попробуй снова.'
      ];
      fb.textContent = badMessages[Math.floor(Math.random() * badMessages.length)];
    }
  }

  baskets.forEach(basket => {
    basket.addEventListener('dragover', (e) => {
      e.preventDefault();
      basket.classList.add('hover');
    });
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

// Игра 1: тело или вещество
makeDropGame({
  poolId: 'bodySubstancePool',
  feedbackId: 'fbBodySubstance',
  resetId: 'resetBodySubstance',
  items: [
    { label: 'древесина', cat: 'substance' },
    { label: 'железо', cat: 'substance' },
    { label: 'гвоздь', cat: 'body' },
    { label: 'ваза', cat: 'body' },
    { label: 'стекло', cat: 'substance' },
    { label: 'сахар', cat: 'substance' },
    { label: 'проволока', cat: 'body' },
    { label: 'медь', cat: 'substance' },
    { label: 'нож', cat: 'body' },
    { label: 'сталь', cat: 'substance' },
    { label: 'ртуть', cat: 'substance' },
    { label: 'термометр', cat: 'body' }
  ]
});

// Игра 2: правила безопасности
makeDropGame({
  poolId: 'safetyQuizPool',
  feedbackId: 'fbSafetyQuiz',
  resetId: 'resetSafetyQuiz',
  items: [
    { label: '🥽 Работать в защитных очках при нагревании', cat: 'can' },
    { label: '😋 Пробовать реактивы на вкус', cat: 'cannot' },
    { label: '👃 Нюхать пары, направляя их ладонью', cat: 'can' },
    { label: '🧪 Нагревать жидкость в закрытой колбе', cat: 'cannot' },
    { label: '↩️ Направлять отверстие пробирки от себя и соседей', cat: 'can' },
    { label: '💇 Убирать длинные волосы перед работой', cat: 'can' },
    { label: '🧴 Выливать остатки реактива обратно в склянку', cat: 'cannot' },
    { label: '🏷️ Читать этикетку дважды перед взятием реактива', cat: 'can' },
    { label: '🙇 Наклоняться над нагреваемым сосудом', cat: 'cannot' },
    { label: '🧹 Сообщать учителю о любом проливе и бое', cat: 'can' },
    { label: '🔥 Оставлять зажжённую спиртовку без присмотра', cat: 'cannot' },
    { label: '🧤 Убирать осколки только щёткой и совком', cat: 'can' }
  ]
});
