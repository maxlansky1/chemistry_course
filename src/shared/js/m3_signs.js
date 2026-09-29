// ============================================================
//  module_3 (3а) — canvas-анимация признаков реакций
// ============================================================
(function initSignAnimations() {
  const cards = document.querySelectorAll('.sign-card');
  if (!cards.length) return;

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

  function drawGas(ctx, W, H, t) {
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(W/2 - 90, 25, 180, 190, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(56,189,248,.45)';
    ctx.beginPath();
    ctx.moveTo(W/2 - 85, 100);
    for (let x = W/2 - 85; x <= W/2 + 85; x += 5) {
      const y = 100 + Math.sin((x + t * 40) * 0.08) * 3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W/2 + 85, 210);
    ctx.lineTo(W/2 - 85, 210);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 15; i++) {
      const phase = i * 0.6;
      const py = 210 - ((t * 1.8 + phase * 18) % 130);
      const px = W/2 - 60 + (i % 7) * 20 + Math.sin(t * 1.5 + phase) * 6;
      const r = 3 + (i % 3) * 1.2;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(125,211,252,.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(W/2 - 75, 50);
    ctx.quadraticCurveTo(W/2 - 78, 120, W/2 - 72, 180);
    ctx.strokeStyle = 'rgba(255,255,255,.7)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  function drawPrecipitate(ctx, W, H, t) {
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(W/2 - 90, 25, 180, 190, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(224,242,254,.6)';
    ctx.fillRect(W/2 - 85, 30, 170, 110);

    const turb = (Math.sin(t * 0.6) + 1) / 2;
    ctx.fillStyle = `rgba(251,191,36,${0.05 + turb * 0.08})`;
    ctx.fillRect(W/2 - 85, 30, 170, 110);

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(W/2 - 85, 180);
    for (let x = W/2 - 85; x <= W/2 + 85; x += 8) {
      ctx.lineTo(x, 180 + Math.sin((x + t * 20) * 0.15) * 3);
    }
    ctx.lineTo(W/2 + 85, 215);
    ctx.lineTo(W/2 - 85, 215);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 20; i++) {
      const px = W/2 - 70 + (i * 15) % 140;
      const phase = i * 0.35;
      const py = 40 + ((t * 1.5 + phase * 20) % 140);
      const r = 2 + (i % 3) * 0.8;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,158,11,${0.5 + (i%3)*0.2})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(W/2 - 75, 50);
    ctx.quadraticCurveTo(W/2 - 78, 120, W/2 - 72, 180);
    ctx.strokeStyle = 'rgba(255,255,255,.7)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  function drawColor(ctx, W, H, t) {
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(60, 40, 140, 180, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(6,182,212,.7)';
    ctx.fillRect(65, 110, 130, 105);

    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.roundRect(220, 40, 140, 180, 12);
    ctx.fill();
    ctx.stroke();

    const cyc = (Math.sin(t * 0.8) + 1) / 2;
    const r = Math.round(6 + (239 - 6) * cyc);
    const g = Math.round(182 + (68 - 182) * cyc);
    const b = Math.round(212 + (68 - 212) * cyc);
    ctx.fillStyle = `rgba(${r},${g},${b},.75)`;
    ctx.fillRect(225, 110, 130, 105);

    for (let i = 0; i < 3; i++) {
      const phase = ((t * 0.7 + i * 0.33) % 1);
      ctx.beginPath();
      ctx.arc(290, 130, 20 + phase * 70, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.4 * (1 - phase)})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(210, 130);
    ctx.lineTo(215, 130);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(215, 130);
    ctx.lineTo(207, 124);
    ctx.lineTo(207, 136);
    ctx.closePath();
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();

    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.textAlign = 'center';
    ctx.fillText('реакция', 210, 155);

    ctx.beginPath();
    ctx.moveTo(75, 60);
    ctx.lineTo(75, 180);
    ctx.strokeStyle = 'rgba(255,255,255,.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(235, 60);
    ctx.lineTo(235, 180);
    ctx.stroke();
  }

  function drawHeat(ctx, W, H, t) {
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(W/2 - 80, 25, 160, 190, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(251,191,36,.5)';
    ctx.fillRect(W/2 - 75, 100, 150, 110);

    const pulse = (Math.sin(t * 3) + 1) / 2;
    const grd = ctx.createRadialGradient(W/2, 120, 20, W/2, 120, 200);
    grd.addColorStop(0, `rgba(249,115,22,${0.15 + pulse * 0.25})`);
    grd.addColorStop(1, 'rgba(249,115,22,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(W/2, 120, 200, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 7; i++) {
      const x = W/2 - 70 + i * 22;
      const flameH = 25 + Math.sin(t * 4 + i) * 12;
      ctx.beginPath();
      ctx.moveTo(x, 230);
      ctx.quadraticCurveTo(x + 6, 230 - flameH, x + 12, 230);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? '#f97316' : '#fbbf24';
      ctx.fill();
    }

    for (let i = 0; i < 4; i++) {
      const phase = (t * 0.5 + i * 0.25) % 1;
      ctx.beginPath();
      ctx.arc(W/2, 100, 30 + phase * 100, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(249,115,22,${0.4 * (1 - phase)})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(W - 55, 40, 20, 170, 8);
    ctx.fill();
    ctx.stroke();
    const level = 0.3 + pulse * 0.6;
    ctx.fillStyle = '#ef4444';
    const fillH = 160 * level;
    ctx.fillRect(W - 51, 45 + (160 - fillH), 12, fillH);
    ctx.beginPath();
    ctx.arc(W - 45, 200, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(W - 40, 50 + i * 16);
      ctx.lineTo(W - 36, 50 + i * 16);
      ctx.stroke();
    }
  }

  function drawLight(ctx, W, H, t) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    const pulse = (Math.sin(t * 2.5) + 1) / 2;
    const grd = ctx.createRadialGradient(W/2, H/2, 5, W/2, H/2, 180 + pulse * 60);
    grd.addColorStop(0, 'rgba(255,255,255,.95)');
    grd.addColorStop(0.25, 'rgba(251,191,36,.85)');
    grd.addColorStop(0.6, 'rgba(245,158,11,.35)');
    grd.addColorStop(1, 'rgba(245,158,11,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(W/2, H/2, 280, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + t * 0.4;
      const r1 = 30;
      const r2 = 60 + pulse * 70;
      ctx.beginPath();
      ctx.moveTo(W/2 + Math.cos(angle) * r1, H/2 + Math.sin(angle) * r1);
      ctx.lineTo(W/2 + Math.cos(angle) * r2, H/2 + Math.sin(angle) * r2);
      ctx.strokeStyle = `rgba(255,255,255,${0.5 + pulse * 0.4})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(W/2, H/2, 20 + pulse * 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W/2, H/2, 30 + pulse * 10, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.6})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const DRAWERS = {
    gas: drawGas,
    precipitate: drawPrecipitate,
    color: drawColor,
    heat: drawHeat,
    light: drawLight
  };

  const states = new Map();

  cards.forEach(card => {
    const canvas = card.querySelector('.sign-canvas');
    const mode = card.dataset.sign;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    states.set(mode, { canvas, ctx, t: 0, running: false, rafId: null });

    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      cards.forEach(c => c.classList.remove('active'));
      states.forEach(s => { s.running = false; if (s.rafId) cancelAnimationFrame(s.rafId); });
      if (!isActive) {
        card.classList.add('active');
        const s = states.get(mode);
        if (s) startAnim(s);
      }
    });
  });

  function startAnim(s) {
    if (s.running) return;
    s.running = true;
    s.t = 0;
    function loop() {
      if (!s.running) return;
      s.t += 0.04;
      const W = s.canvas.width, H = s.canvas.height;
      s.ctx.clearRect(0, 0, W, H);
      if (s.canvas.dataset.sign !== 'light') {
        const bg = s.ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#f0f9ff');
        bg.addColorStop(1, '#e0f2fe');
        s.ctx.fillStyle = bg;
        s.ctx.fillRect(0, 0, W, H);
      }
      const drawer = DRAWERS[s.canvas.dataset.sign];
      if (drawer) drawer(s.ctx, W, H, s.t);
      s.rafId = requestAnimationFrame(loop);
    }
    loop();
  }

  cards[0].classList.add('active');
  const firstState = states.get(cards[0].dataset.sign);
  if (firstState) startAnim(firstState);
})();
