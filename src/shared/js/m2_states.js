// ============================================================
//  АГРЕГАТНЫЕ СОСТОЯНИЯ (canvas)
// ============================================================
(function initStateOfMatter() {
  const canvas = document.getElementById('stateCanvas');
  const slider = document.getElementById('tempSlider');
  const label = document.getElementById('tempValue');
  const stateLabel = document.getElementById('stateLabel');
  const stateDesc = document.getElementById('stateDesc');
  if (!canvas || !slider) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const box = { x: 90, y: 100, w: W - 180, h: H - 140 };

  const N = 110;
  const particles = [];
  let mode = 'liquid';
  let temperature = 20;

  for (let i = 0; i < N; i++) {
    const cols = 14;
    const rows = Math.ceil(N / cols);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const gx = box.x + 8 + col * ((box.w - 16) / (cols - 1));
    const gy = box.y + box.h - 8 - row * ((box.h * 0.55) / rows);
    particles.push({
      x: box.x + Math.random() * box.w,
      y: box.y + Math.random() * box.h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      gx, gy,
      r: 5.5
    });
  }

  function setMode() {
    if (temperature <= 0) mode = 'solid';
    else if (temperature < 100) mode = 'liquid';
    else mode = 'gas';

    if (mode === 'solid') {
      stateLabel.textContent = '🧊 ЛЁД';
      stateDesc.textContent = 'частицы плотно упакованы, почти не двигаются';
    } else if (mode === 'liquid') {
      stateLabel.textContent = '💧 ВОДА';
      stateDesc.textContent = 'частицы двигаются, но держатся вместе';
    } else {
      stateLabel.textContent = '☁️ ПАР';
      stateDesc.textContent = 'частицы летают свободно по всему объёму';
    }
  }

  function drawContainer() {
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, box.y, box.w, box.h);

    if (mode === 'liquid') {
      ctx.fillStyle = 'rgba(56,189,248,.35)';
      ctx.fillRect(box.x + 2, box.y + box.h * 0.45, box.w - 4, box.h * 0.55 - 2);
    } else if (mode === 'solid') {
      ctx.fillStyle = 'rgba(186,230,253,.4)';
      ctx.fillRect(box.x + 2, box.y + box.h * 0.72, box.w - 4, box.h * 0.28 - 2);
    }
  }

  function updateParticle(p) {
    if (mode === 'solid') {
      p.x += (p.gx - p.x) * 0.12 + (Math.random() - 0.5) * 0.6;
      p.y += (p.gy - p.y) * 0.12 + (Math.random() - 0.5) * 0.6;
    } else if (mode === 'liquid') {
      p.vy += 0.15;
      p.vx += (Math.random() - 0.5) * 0.4;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < box.x + p.r) { p.x = box.x + p.r; p.vx *= -0.7; }
      if (p.x > box.x + box.w - p.r) { p.x = box.x + box.w - p.r; p.vx *= -0.7; }
      const surface = box.y + box.h * 0.45;
      if (p.y < surface) {
        p.y = surface + Math.random() * 4;
        p.vy += 0.2;
      }
      if (p.y > box.y + box.h - p.r) {
        p.y = box.y + box.h - p.r;
        p.vy *= -0.55;
      }
      p.vx *= 0.96;
      p.vy *= 0.98;
    } else {
      p.x += p.vx * 1.8;
      p.y += p.vy * 1.8;
      if (p.x < box.x + p.r) { p.x = box.x + p.r; p.vx *= -1; }
      if (p.x > box.x + box.w - p.r) { p.x = box.x + box.w - p.r; p.vx *= -1; }
      if (p.y < box.y + p.r) { p.y = box.y + p.r; p.vy *= -1; }
      if (p.y > box.y + box.h - p.r) { p.y = box.y + box.h - p.r; p.vy *= -1; }
      p.vx += (Math.random() - 0.5) * 0.3;
      p.vy += (Math.random() - 0.5) * 0.3;
      const sp = Math.hypot(p.vx, p.vy);
      const max = 2.6;
      if (sp > max) { p.vx = p.vx / sp * max; p.vy = p.vy / sp * max; }
    }
  }

  function drawParticle(p) {
    let color;
    if (mode === 'solid') color = '#0369a1';
    else if (mode === 'liquid') color = '#0ea5e9';
    else color = '#7dd3fc';

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.92;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(p.x - 1.5, p.y - 1.5, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.fill();
  }

  function drawBubbles() {
    if (mode !== 'gas') return;
    const t = Date.now() / 400;
    for (let i = 0; i < 8; i++) {
      const phase = i * 0.9;
      const y = box.y + 30 + Math.sin(t + phase) * 15 + i * 12;
      const x = box.x + 80 + i * 70 + Math.cos(t + phase) * 12;
      ctx.beginPath();
      ctx.arc(x, y, 12 + Math.sin(t + phase) * 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148,197,247,.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, W, H);
    drawContainer();
    particles.forEach(p => {
      updateParticle(p);
      drawParticle(p);
    });
    drawBubbles();
    requestAnimationFrame(animate);
  }

  slider.addEventListener('input', () => {
    temperature = parseInt(slider.value);
    label.textContent = temperature + ' °C';
    setMode();
  });

  setMode();
  label.textContent = temperature + ' °C';
  animate();
})();
