// ============================================================
//  module_4 (3б) — опыт Лавуазье: масса в открытом/закрытом сосуде
// ============================================================
// ============================================================
//  УТИЛИТЫ
// ============================================================
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

// ============================================================

//  ОПЫТ ЛАВУАЗЬЕ — ДВА СОСУДА (ОТКРЫТЫЙ И ЗАКРЫТЫЙ)
// ============================================================
(function initCandleExperiment() {
  const canvas = document.getElementById('candleCanvas');
  const btn = document.getElementById('candleBtn');
  if (!canvas || !btn) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let running = false;
  let t = 0;

  // Частицы дыма в открытом сосуде
  const smokeOpen = [];
  // Частицы дыма в закрытом сосуде
  const smokeClosed = [];
  // Капли воска
  const waxOpen = [];
  const waxClosed = [];

  const openX = 60;       // x начала левой карточки
  const closedX = 540;    // x начала правой карточки
  const cardW = 360;
  const cardH = 380;
  const cardY = 40;

  // Свеча
  const candleW = 22;
  const candleH = 70;

  function spawnSmoke(arr, candleX, candleTopY, bounds, isOpen) {
    if (t < 0.5) return;
    arr.push({
      x: candleX + (Math.random() - 0.5) * 8,
      y: candleTopY - 12 - Math.random() * 5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.6 - Math.random() * 0.5,
      r: 2 + Math.random() * 3,
      life: 0,
      maxLife: 200 + Math.random() * 100,
      isOpen: isOpen,
      bounds: bounds,
      alpha: 0.7 + Math.random() * 0.25
    });
  }

  function spawnWax(arr, candleX, candleTopY) {
    if (t < 0.3) return;
    if (Math.random() > 0.025) return;
    arr.push({
      x: candleX + (Math.random() - 0.5) * candleW * 0.7,
      y: candleTopY + 3 + Math.random() * 3,
      vy: 0.3 + Math.random() * 0.3,
      r: 1.5 + Math.random() * 1.5,
      life: 0
    });
  }

  function updateParticles() {
    // Дым в открытом — улетает вверх и исчезает за пределами карточки
    for (let i = smokeOpen.length - 1; i >= 0; i--) {
      const s = smokeOpen[i];
      s.x += s.vx + Math.sin((t + s.life * 0.05) * 2) * 0.3;
      s.y += s.vy;
      s.life++;
      s.r += 0.05;
      if (s.y < cardY - 20 || s.life > s.maxLife) {
        smokeOpen.splice(i, 1);
      }
    }

    // Дым в закрытом — поднимается и «расплывается» по всему объёму сосуда
    for (let i = smokeClosed.length - 1; i >= 0; i--) {
      const s = smokeClosed[i];
      s.x += s.vx + Math.sin((t + s.life * 0.03) * 1.5) * 0.4;
      s.y += s.vy * 0.7;
      // Отталкиваем от верхней границы
      if (s.y < s.bounds.top + s.r) {
        s.y = s.bounds.top + s.r;
        s.vy = Math.abs(s.vy) * 0.3;
        // Даём горизонтальный импульс — дым «растекается» по сосуду
        s.vx += (s.x < (s.bounds.left + s.bounds.right) / 2 ? -0.4 : 0.4);
      }
      if (s.x < s.bounds.left + s.r) { s.x = s.bounds.left + s.r; s.vx *= -0.5; }
      if (s.x > s.bounds.right - s.r) { s.x = s.bounds.right - s.r; s.vx *= -0.5; }
      s.life++;
      s.r += 0.04;
      if (s.r > 12) s.r = 12;
      s.vx *= 0.98;
      // Не даём улететь вниз
      if (s.y > s.bounds.bottom - s.r) {
        s.y = s.bounds.bottom - s.r;
        s.vy = -Math.abs(s.vy) * 0.2;
      }
    }

    // Капли воска в открытом
    for (let i = waxOpen.length - 1; i >= 0; i--) {
      const w = waxOpen[i];
      w.y += w.vy;
      w.life++;
      const bottom = cardY + cardH - 100;
      if (w.y > bottom) {
        waxOpen.splice(i, 1);
      }
    }

    // Капли воска в закрытом
    for (let i = waxClosed.length - 1; i >= 0; i--) {
      const w = waxClosed[i];
      w.y += w.vy;
      w.life++;
      const bottom = cardY + cardH - 100;
      if (w.y > bottom) {
        waxClosed.splice(i, 1);
      }
    }
  }

  function drawCard(x, y, w, h, title, isClosed) {
    // Карточка
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.strokeStyle = isClosed ? '#8b5cf6' : '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 14);
    ctx.fill();
    ctx.stroke();

    // Заголовок
    ctx.fillStyle = isClosed ? '#5b21b6' : '#065f46';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, x + w/2, y + 28);
  }

  function drawCandle(cx, baseY) {
    // Тело свечи
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(cx - candleW/2, baseY - candleH, candleW, candleH);
    ctx.fill();
    ctx.stroke();

    // Фитиль
    ctx.beginPath();
    ctx.moveTo(cx, baseY - candleH);
    ctx.lineTo(cx, baseY - candleH - 8);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawFlame(cx, baseY) {
    const candleTopY = baseY - candleH;
    const flameH = 22 + Math.sin(t * 6) * 3;
    const flameW = 10 + Math.sin(t * 5) * 1;

    // Внешнее пламя
    ctx.beginPath();
    ctx.moveTo(cx, candleTopY - 8);
    ctx.quadraticCurveTo(cx - flameW, candleTopY - 8 - flameH * 0.6, cx, candleTopY - 8 - flameH * 1.6);
    ctx.quadraticCurveTo(cx + flameW, candleTopY - 8 - flameH * 0.6, cx, candleTopY - 8);
    ctx.fillStyle = '#f97316';
    ctx.fill();

    // Среднее пламя
    ctx.beginPath();
    ctx.moveTo(cx, candleTopY - 8);
    ctx.quadraticCurveTo(cx - flameW * 0.6, candleTopY - 8 - flameH * 0.5, cx, candleTopY - 8 - flameH);
    ctx.quadraticCurveTo(cx + flameW * 0.6, candleTopY - 8 - flameH * 0.5, cx, candleTopY - 8);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Ядро пламени
    ctx.beginPath();
    ctx.moveTo(cx, candleTopY - 10);
    ctx.quadraticCurveTo(cx - 3, candleTopY - 8 - flameH * 0.3, cx, candleTopY - 8 - flameH * 0.55);
    ctx.quadraticCurveTo(cx + 3, candleTopY - 8 - flameH * 0.3, cx, candleTopY - 10);
    ctx.fillStyle = '#fff7ed';
    ctx.fill();

    // Свечение
    const glow = ctx.createRadialGradient(cx, candleTopY - 20, 5, cx, candleTopY - 20, 60);
    glow.addColorStop(0, 'rgba(251,191,36,.25)');
    glow.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, candleTopY - 20, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawJar(x, y, w, h) {
    // Стеклянный колпак
    ctx.fillStyle = 'rgba(224,242,254,.25)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();
    ctx.stroke();

    // Блик
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 25);
    ctx.lineTo(x + 12, y + h - 25);
    ctx.strokeStyle = 'rgba(255,255,255,.7)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Крышка (тонкая полоска сверху)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 4, y - 4, w + 8, 8);
  }

  function drawScale(cx, cy, tipped) {
    // Основание
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cx - 45, cy, 90, 6);
    ctx.fillRect(cx - 3, cy - 45, 6, 45);

    // Коромысло
    ctx.save();
    ctx.translate(cx, cy - 45);
    ctx.rotate(tipped);
    ctx.beginPath();
    ctx.moveTo(-45, 0);
    ctx.lineTo(45, 0);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Чашки
    ctx.beginPath();
    ctx.arc(-45, 8, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(45, 8, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Точка опоры
    ctx.beginPath();
    ctx.arc(cx, cy - 45, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Фон
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#f0f9ff');
    bg.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Карточки
    drawCard(openX, cardY, cardW, cardH, '🔓 Открытый сосуд', false);
    drawCard(closedX, cardY, cardW, cardH, '🔒 Закрытый сосуд', true);

    // Сцена в открытом сосуде
    const openCx = openX + cardW / 2;
    const openBaseY = cardY + cardH - 120;
    drawCandle(openCx, openBaseY);
    if (t > 0.3) drawFlame(openCx, openBaseY);

    // Сцена в закрытом сосуде
    const closedCx = closedX + cardW / 2;
    const closedBaseY = cardY + cardH - 120;
    drawCandle(closedCx, closedBaseY);
    if (t > 0.3) {
      // Рисуем колпак поверх свечи, но до дыма
      const jarX = closedCx - 60;
      const jarY = closedBaseY - candleH - 70;
      const jarW = 120;
      const jarH = candleH + 90;

      // Дым ВНУТРИ колпака — рисуем до колпака, чтобы колпак был поверх
      smokeClosed.forEach(s => {
        ctx.globalAlpha = Math.max(0, 1 - s.life / s.maxLife) * 0.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      drawFlame(closedCx, closedBaseY);
      drawJar(jarX, jarY, jarW, jarH);
    }

    // Дым в открытом — рисуем после всего
    smokeOpen.forEach(s => {
      ctx.globalAlpha = Math.max(0, 1 - s.life / s.maxLife) * 0.55;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Капли воска
    waxOpen.forEach(w => {
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fde68a';
      ctx.fill();
    });
    waxClosed.forEach(w => {
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fde68a';
      ctx.fill();
    });

    // Лужица воска внизу
    if (t > 1) {
      ctx.fillStyle = 'rgba(253,230,138,.7)';
      ctx.beginPath();
      ctx.ellipse(openCx, openBaseY + 8, 30, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(closedCx, closedBaseY + 8, 30, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Весы внизу
    const scaleY = cardY + cardH - 35;
    drawScale(openCx, scaleY, t > 2 ? -0.25 : 0); // Открытые — «теряет» массу
    drawScale(closedCx, scaleY, 0); // Закрытые — не теряет

    // Подписи весов
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = t > 2 ? '#dc2626' : '#64748b';
    ctx.fillText(t > 2 ? '⚠ Масса «уменьшилась»' : 'Масса не меняется', openCx, scaleY + 20);
    ctx.fillStyle = '#10b981';
    ctx.fillText('✓ Масса не меняется', closedCx, scaleY + 20);
  }

  function animate() {
    if (!running) return;
    t += 0.05;

    // Спавним частицы
    const openCx = openX + cardW / 2;
    const closedCx = closedX + cardW / 2;
    const openBaseY = cardY + cardH - 120;
    const closedBaseY = cardY + cardH - 120;
    const openCandleTop = openBaseY - candleH;
    const closedCandleTop = closedBaseY - candleH;

    if (Math.random() > 0.4) {
      spawnSmoke(smokeOpen, openCx, openCandleTop, null, true);
    }
    if (Math.random() > 0.5 && smokeClosed.length < 100) {
      const jarX = closedCx - 60;
      const jarY = closedBaseY - candleH - 70;
      const jarW = 120;
      const jarH = candleH + 90;
      spawnSmoke(smokeClosed, closedCx, closedCandleTop, {
        left: jarX + 5,
        right: jarX + jarW - 5,
        top: jarY + 5,
        bottom: closedBaseY + 10
      }, false);
    }
    spawnWax(waxOpen, openCx, openCandleTop + 5);
    spawnWax(waxClosed, closedCx, closedCandleTop + 5);

    updateParticles();
    draw();
    requestAnimationFrame(animate);
  }

  btn.addEventListener('click', () => {
    if (running) {
      running = false;
      btn.textContent = '▶ Запустить опыт';
      return;
    }
    running = true;
    t = 0;
    smokeOpen.length = 0;
    smokeClosed.length = 0;
    waxOpen.length = 0;
    waxClosed.length = 0;
    btn.textContent = '⏸ Пауза';
    animate();
  });

  // Первичная отрисовка
  draw();
})();

// ============================================================
