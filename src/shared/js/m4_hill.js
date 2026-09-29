// ============================================================
//  module_4 (3б) — энтропия · энергетическая горка · баланс сил
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

//  ЭНТРОПИЯ — CANVAS С ПОЛЗУНКОМ
// ============================================================
(function initEntropyCanvas() {
  const canvas = document.getElementById('entropyCanvas');
  const slider = document.getElementById('entropySlider');
  const value = document.getElementById('entropyValue');
  const feedback = document.getElementById('entropyFeedback');
  if (!canvas || !slider) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Частицы: начальное положение — плотный блок слева
  const N = 80;
  const particles = [];
  const cols = 10;
  const rows = 8;
  for (let i = 0; i < N; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    particles.push({
      orderedX: W * 0.15 + col * 14 + 5,
      orderedY: H * 0.5 - rows * 7 + row * 14 + 5,
      randomX: W * 0.05 + Math.random() * W * 0.9,
      randomY: H * 0.15 + Math.random() * H * 0.7,
      size: 4 + Math.random() * 3,
      seed: Math.random() * 100
    });
  }

  function draw(progress) {
    ctx.clearRect(0, 0, W, H);

    // Фон
    const bg = ctx.createLinearGradient(0, 0, W, 0);
    bg.addColorStop(0, '#f0f9ff');
    bg.addColorStop(1, '#faf5ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Область слева — «порядок»
    ctx.fillStyle = 'rgba(6,182,212,.06)';
    ctx.fillRect(0, 0, W * 0.35, H);
    // Область справа — «беспорядок»
    ctx.fillStyle = 'rgba(139,92,246,.06)';
    ctx.fillRect(W * 0.35, 0, W * 0.65, H);

    // Разделитель
    ctx.strokeStyle = 'rgba(148,163,184,.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(W * 0.35, 0);
    ctx.lineTo(W * 0.35, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Подписи
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0369a1';
    ctx.fillText('📦 Порядок', W * 0.175, 25);
    ctx.fillStyle = '#7c3aed';
    ctx.fillText('🌀 Беспорядок', W * 0.65, 25);

    // Частицы
    const eased = progress * progress * (3 - 2 * progress); // smoothstep

    particles.forEach(p => {
      const x = p.orderedX + (p.randomX - p.orderedX) * eased;
      const y = p.orderedY + (p.randomY - p.orderedY) * eased;

      // Цвет: от синего к фиолетовому
      const r = Math.round(6 + (139 - 6) * eased);
      const g = Math.round(182 + (92 - 182) * eased);
      const b = Math.round(212 + (246 - 212) * eased);

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
      ctx.fill();

      // Блик
      ctx.beginPath();
      ctx.arc(x - 1, y - 1, p.size * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    });
  }

  function update() {
    const val = parseInt(slider.value);
    value.textContent = val + ' %';
    draw(val / 100);

    if (val < 20) {
      feedback.className = 'verdict-box';
      feedback.innerHTML = `
        <div class="vb-icon">📦</div>
        <div>Полный порядок: все частицы собраны в плотный блок.</div>
        <div class="vb-sub">Такое состояние маловероятно само по себе — нужно «наводить порядок руками».</div>
      `;
    } else if (val < 60) {
      feedback.className = 'verdict-box mixed';
      feedback.innerHTML = `
        <div class="vb-icon">🌊</div>
        <div>Частицы начинают разлетаться: порядок разрушается.</div>
        <div class="vb-sub">Беспорядок постепенно растёт — это естественный процесс.</div>
      `;
    } else if (val < 90) {
      feedback.className = 'verdict-box good';
      feedback.innerHTML = `
        <div class="vb-icon">🌀</div>
        <div>Сильный беспорядок: большинство частиц разлетелись.</div>
        <div class="vb-sub">Именно так работает природа: беспорядок растёт сам собой.</div>
      `;
    } else {
      feedback.className = 'verdict-box good';
      feedback.innerHTML = `
        <div class="vb-icon">💨</div>
        <div>Максимальный беспорядок: частицы равномерно распределены.</div>
        <div class="vb-sub">Это самое устойчивое состояние системы. Так сахар растворяется в воде.</div>
      `;
    }
  }

  slider.addEventListener('input', update);
  update();
})();

// ============================================================
//  ЭНЕРГЕТИЧЕСКАЯ ГОРКА — ПОЛЗУНОК
// ============================================================
(function initHillSlider() {
  const slider = document.getElementById('hillSlider');
  const value = document.getElementById('hillValue');
  const ball = document.getElementById('energyBall');
  const feedback = document.getElementById('hillFeedback');
  if (!slider || !ball) return;

  // Точки горки (x, y) и соответствующие им энергии
  // Гора: от (80, 340) поднимается до (200, 120), затем спускается до (720, 300)
  const path = [
    { x: 80, y: 340 },
    { x: 120, y: 280 },
    { x: 160, y: 200 },
    { x: 200, y: 120 },
    { x: 240, y: 160 },
    { x: 280, y: 230 },
    { x: 320, y: 280 },
    { x: 400, y: 360 },
    { x: 480, y: 300 },
    { x: 560, y: 300 },
    { x: 640, y: 300 },
    { x: 720, y: 300 }
  ];

  function getPos(progress) {
    // progress от 0 до 1
    const seg = progress * (path.length - 1);
    const i = Math.floor(seg);
    const t = seg - i;
    const a = path[Math.min(i, path.length - 2)];
    const b = path[Math.min(i + 1, path.length - 1)];
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t
    };
  }

  function update() {
    const val = parseInt(slider.value);
    value.textContent = val + ' %';
    const p = getPos(val / 100);
    ball.setAttribute('transform', `translate(${p.x - 200}, ${p.y - 150})`);

    if (val < 20) {
      feedback.className = 'verdict-box bad';
      feedback.innerHTML = `
        <div class="vb-icon">⬆️</div>
        <div><b>Мяч на вершине горки.</b> Реагенты обладают большой энергией.</div>
        <div class="vb-sub">Система «не хочет» оставаться в таком положении — она стремится скатиться вниз.</div>
      `;
    } else if (val < 50) {
      feedback.className = 'verdict-box mixed';
      feedback.innerHTML = `
        <div class="vb-icon">🔄</div>
        <div><b>Мяч начинает катиться.</b> Реакция пошла!</div>
        <div class="vb-sub">Система снижает энергию — при этом выделяется тепло или свет.</div>
      `;
    } else if (val < 80) {
      feedback.className = 'verdict-box good';
      feedback.innerHTML = `
        <div class="vb-icon">⬇️</div>
        <div><b>Мяч катится вниз.</b> Реакция идёт сама собой.</div>
        <div class="vb-sub">Система «скатывается» в состояние с меньшей энергией. Именно так горят дрова и ржавеет железо.</div>
      `;
    } else {
      feedback.className = 'verdict-box good';
      feedback.innerHTML = `
        <div class="vb-icon">✅</div>
        <div><b>Мяч внизу — устойчивое состояние.</b> Реакция завершена.</div>
        <div class="vb-sub">Продукты обладают меньшей энергией, чем реагенты. Система «успокоилась».</div>
      `;
    }
  }

  slider.addEventListener('input', update);
  update();
})();

// ============================================================
//  ДВЕ СИЛЫ ВМЕСТЕ — БАЛАНС
// ============================================================
(function initBalance() {
  const energySlider = document.getElementById('forceEnergy');
  const entropySlider = document.getElementById('forceEntropy');
  const energyValue = document.getElementById('forceEnergyValue');
  const entropyValue = document.getElementById('forceEntropyValue');
  const verdict = document.getElementById('balanceVerdict');
  if (!energySlider || !entropySlider) return;

  function update() {
    const e = parseInt(energySlider.value);
    const s = parseInt(entropySlider.value);
    energyValue.textContent = e + ' %';
    entropyValue.textContent = s + ' %';

    // Обновляем стили ползунков
    energySlider.style.background = `linear-gradient(90deg, #fed7aa 0%, #f97316 ${e}%, #e2e8f0 ${e}%, #e2e8f0 100%)`;
    entropySlider.style.background = `linear-gradient(90deg, #ddd6fe 0%, #8b5cf6 ${s}%, #e2e8f0 ${s}%, #e2e8f0 100%)`;

    const energyStrong = e >= 60;
    const entropyStrong = s >= 60;
    const energyWeak = e < 30;
    const entropyWeak = s < 30;

    if (energyStrong && entropyStrong) {
      verdict.className = 'verdict-box good';
      verdict.innerHTML = `
        <div class="vb-icon">✅</div>
        <div><b>Реакция идёт сама!</b></div>
        <div class="vb-sub">Обе силы «за»: система снижает энергию и повышает беспорядок.</div>
      `;
    } else if (energyWeak && entropyWeak) {
      verdict.className = 'verdict-box bad';
      verdict.innerHTML = `
        <div class="vb-icon">❌</div>
        <div><b>Реакция не пойдёт сама.</b></div>
        <div class="vb-sub">Обе силы «против»: ни снижения энергии, ни роста беспорядка.</div>
      `;
    } else if (energyStrong && entropyWeak) {
      verdict.className = 'verdict-box mixed';
      verdict.innerHTML = `
        <div class="vb-icon">⚡</div>
        <div><b>Реакция может пойти.</b></div>
        <div class="vb-sub">Снижение энергии помогает, но беспорядок почти не растёт. Такая реакция идёт, если энергия выделяется очень сильно.</div>
      `;
    } else if (energyWeak && entropyStrong) {
      verdict.className = 'verdict-box mixed';
      verdict.innerHTML = `
        <div class="vb-icon">🌪</div>
        <div><b>Реакция может пойти при нагревании.</b></div>
        <div class="vb-sub">Беспорядок растёт, но системе не хватает снижения энергии. Нужен подвод тепла извне.</div>
      `;
    } else {
      verdict.className = 'verdict-box';
      verdict.innerHTML = `
        <div class="vb-icon">🤔</div>
        <div>Силы примерно равны — реакция на грани.</div>
        <div class="vb-sub">Подвигай ползунки, чтобы увидеть, что произойдёт.</div>
      `;
    }
  }

  energySlider.addEventListener('input', update);
  entropySlider.addEventListener('input', update);
  update();
})();

// ============================================================
