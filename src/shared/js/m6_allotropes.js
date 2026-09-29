// ============================================================
//  module_6 (4б) — allotropes
// ============================================================
/* ============================================================
   УТИЛИТЫ
   ============================================================ */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
    this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);
    this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;
  };
}
var rand = (a,b)=>a+Math.random()*(b-a);

/* ============================================================
   ИЗОТОПЫ ВОДОРОДА — С ЭЛЕКТРОНАМИ И ОРБИТАМИ
   ============================================================ */

(function(){
  const canvas = document.getElementById('diamondCanvas');
  const slider = document.getElementById('diamondSlider');
  const badge = document.getElementById('diamondBadge');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;

  function drawGraphite(cx, cy, alpha, scale){
    ctx.globalAlpha = alpha;
    const s = scale || 1;
    const layers = 4;
    const atomsPerLayer = 5;
    const spacing = 38 * s;

    for (let layer=0; layer<layers; layer++){
      const yBase = cy - 50*s + layer * 32*s;
      const offsetX = (layer % 2) * spacing * 0.5;

      // Связи в слое
      for (let x=0; x<atomsPerLayer-1; x++){
        const px1 = cx + (x - (atomsPerLayer-1)/2) * spacing + offsetX;
        const px2 = cx + (x+1 - (atomsPerLayer-1)/2) * spacing + offsetX;
        ctx.beginPath(); ctx.moveTo(px1, yBase); ctx.lineTo(px2, yBase);
        ctx.strokeStyle = 'rgba(148,163,184,.5)';
        ctx.lineWidth = 2 * s; ctx.stroke();
      }

      // Атомы
      for (let x=0; x<atomsPerLayer; x++){
        const px = cx + (x - (atomsPerLayer-1)/2) * spacing + offsetX;
        ctx.beginPath(); ctx.arc(px, yBase, 7*s, 0, Math.PI*2);
        ctx.fillStyle = '#64748b'; ctx.fill();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5*s; ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawDiamond(cx, cy, alpha, scale){
    ctx.globalAlpha = alpha;
    const s = scale || 1;
    const baseSize = 70 * s;

    // Строим тетраэдрическую сетку
    const atoms = [];
    const bonds = [];

    // Центральный атом
    atoms.push({x: cx, y: cy, z: 0});

    // 4 атома вокруг (тетраэдр)
    const tetraAngles = [0, Math.PI*0.5, Math.PI, Math.PI*1.5];
    const tetraTilt = 0.6;
    tetraAngles.forEach((angle, i)=>{
      const r = baseSize;
      const x = cx + Math.cos(angle) * r * 0.8;
      const y = cy + Math.sin(angle) * r * 0.5 + (i % 2 === 0 ? -r*0.3 : r*0.3);
      atoms.push({x, y, z: 1});
      bonds.push({from: 0, to: i+1});
    });

    // Добавляем ещё атомы для объёма (второй слой)
    const outerAngles = [Math.PI*0.25, Math.PI*0.75, Math.PI*1.25, Math.PI*1.75];
    outerAngles.forEach((angle, i)=>{
      const r = baseSize * 1.6;
      const x = cx + Math.cos(angle) * r * 0.7;
      const y = cy + Math.sin(angle) * r * 0.4;
      atoms.push({x, y, z: 2});
      // Связываем с ближайшим тетраэдрическим атомом
      const nearestTetra = i < 2 ? 1 : 3;
      bonds.push({from: nearestTetra, to: atoms.length - 1});
    });

    // Рисуем связи
    bonds.forEach(b=>{
      const a = atoms[b.from];
      const c = atoms[b.to];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y);
      ctx.strokeStyle = 'rgba(148,163,184,.45)';
      ctx.lineWidth = 2.5 * s; ctx.stroke();
    });

    // Рисуем атомы
    atoms.forEach((a, i)=>{
      const radius = (i === 0 ? 12 : 8) * s;
      const grad = ctx.createRadialGradient(a.x-2, a.y-2, 1, a.x, a.y, radius);
      grad.addColorStop(0, '#e2e8f0');
      grad.addColorStop(0.4, '#94a3b8');
      grad.addColorStop(1, '#64748b');
      ctx.beginPath(); ctx.arc(a.x, a.y, radius, 0, Math.PI*2);
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.5 * s; ctx.stroke();
    });

    ctx.globalAlpha = 1;
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,W,H);

    const cx = W/2;
    const cy = H/2;
    const t = slider.value / 100;

    // Давление
    let pressureText, pressureColor;
    if (t < 0.3){
      pressureText = 'Давление: низкое (атмосферное)';
      pressureColor = '#10b981';
      badge.className = 'energy-badge low';
    } else if (t < 0.6){
      pressureText = 'Давление: повышается (~2–4 ГПа)';
      pressureColor = '#f59e0b';
      badge.className = 'energy-badge high';
    } else if (t < 0.85){
      pressureText = 'Давление: высокое (~5 ГПа)';
      pressureColor = '#f59e0b';
      badge.className = 'energy-badge high';
    } else {
      pressureText = 'Давление: критическое (~6+ ГПа)';
      pressureColor = '#ef4444';
      badge.className = 'energy-badge high';
    }
    badge.textContent = pressureText;

    if (t < 0.3){
      // Графит
      drawGraphite(cx, cy, 1, 1);
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#64748b';
      ctx.fillText('✏️ Графит', cx, 45);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Плоские слои, слабые связи между слоями', cx, H - 30);

      // Стрелки давления вниз
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillStyle = 'rgba(239,68,68,.3)';
      for (let i=0; i<5; i++){
        ctx.fillText('⬇', 150 + i*150, 80 + Math.sin(Date.now()/300 + i)*5);
      }
    } else if (t < 0.7){
      // Переход
      const mix = (t - 0.3) / 0.4;
      drawGraphite(cx, cy, 1 - mix, 1 - mix * 0.3);
      drawDiamond(cx, cy, mix, 0.4 + mix * 0.6);

      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText('🔄 Перестройка кристаллической решётки...', cx, 45);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Слои сжимаются, атомы перестраиваются в тетраэдры', cx, H - 30);

      // Давление
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillStyle = 'rgba(239,68,68,' + (0.4 + mix*0.6) + ')';
      for (let i=0; i<7; i++){
        ctx.fillText('⬇', 100 + i*120, 80 + Math.sin(Date.now()/200 + i)*8);
      }
    } else {
      // Алмаз
      const alpha = (t - 0.7) / 0.3;
      drawDiamond(cx, cy, Math.min(1, alpha), 1 + alpha * 0.3);

      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('💎 Алмаз', cx, 45);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Тетраэдрическая сетка — сверхпрочный', cx, H - 30);

      if (alpha > 0.5){
        ctx.font = 'bold 15px Inter, sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('Условия: ~5–6 ГПа, ~1400–2000 °C', W/2, H - 10);
      }
    }

    // Подпись слайдера
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('⚡ Двигай ползунок давления', W/2, 20);
  }

  function animLoop(){
    draw();
    requestAnimationFrame(animLoop);
  }

  slider.addEventListener('input', draw);
  animLoop();
})();

/* ============================================================
   АНИМАЦИЯ ОЗОНА С МОЛНИЕЙ
   ============================================================ */
(function(){
  const canvas = document.getElementById('ozoneCanvas');
  const btn = document.getElementById('ozoneBtn');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  let progress = 0; let running = false; let rafId = null;
  let lightningBolts = [];
  let molecules = [];

  function initMolecules(){
    molecules = [];
    for (let i=0; i<6; i++){
      molecules.push({
        x: 100 + Math.random() * (W - 200),
        y: 80 + Math.random() * (H - 160),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        type: Math.random() > 0.5 ? 'O2' : 'O2',
        alpha: 0.3 + Math.random() * 0.4
      });
    }
  }

  function initLightning(){
    lightningBolts = [];
    for (let i=0; i<3; i++){
      const bolt = {
        x: 150 + Math.random() * (W - 300),
        y: 0,
        points: [],
        life: 0,
        maxLife: 40 + Math.random() * 30
      };
      let cy = 0;
      let cx = bolt.x;
      while (cy < H * 0.6){
        bolt.points.push({x: cx, y: cy});
        cx += (Math.random() - 0.5) * 40;
        cy += 20 + Math.random() * 20;
      }
      bolt.points.push({x: cx, y: H * 0.6});
      lightningBolts.push(bolt);
    }
  }

  function drawMolecule(x, y, type, alpha){
    ctx.globalAlpha = alpha;
    if (type === 'O2'){
      ctx.beginPath(); ctx.arc(x-12, y, 9, 0, Math.PI*2);
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; ctx.stroke();

      ctx.beginPath(); ctx.arc(x+12, y, 9, 0, Math.PI*2);
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; ctx.stroke();

      ctx.beginPath(); ctx.moveTo(x-3, y); ctx.lineTo(x+3, y);
      ctx.strokeStyle = 'rgba(148,163,184,.5)'; ctx.lineWidth = 3; ctx.stroke();
    } else {
      // O3 (угловая)
      const angle = Math.PI * 0.35;
      const r = 22;
      ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI*2);
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; ctx.stroke();

      ctx.beginPath(); ctx.arc(x - Math.cos(angle/2)*r, y + Math.sin(angle/2)*r, 8, 0, Math.PI*2);
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; ctx.stroke();

      ctx.beginPath(); ctx.arc(x + Math.cos(angle/2)*r, y + Math.sin(angle/2)*r, 8, 0, Math.PI*2);
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; ctx.stroke();

      // Связи
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(angle/2)*r, y + Math.sin(angle/2)*r);
      ctx.strokeStyle = 'rgba(148,163,184,.4)'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(angle/2)*r, y + Math.sin(angle/2)*r);
      ctx.strokeStyle = 'rgba(148,163,184,.4)'; ctx.lineWidth = 2.5; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,W,H);

    // Фон атмосферы
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, 'rgba(30,58,138,.15)');
    bgGrad.addColorStop(1, 'rgba(15,23,42,0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Подпись
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Верхние слои атмосферы (10–30 км)', W/2, 25);
    ctx.fillText('☀️ Ультрафиолетовое излучение', W/2, H - 15);

    const t = Math.min(progress, 1);

    // Фаза 1: молекулы O2
    if (t < 0.3){
      molecules.forEach(m=>{
        m.x += m.vx;
        m.y += m.vy;
        if (m.x < 50 || m.x > W-50) m.vx *= -1;
        if (m.y < 50 || m.y > H-50) m.vy *= -1;
        drawMolecule(m.x, m.y, 'O2', m.alpha);
      });
    }

    // Фаза 2: молния
    if (t > 0.15 && t < 0.7){
      const boltAlpha = Math.min(1, (t - 0.15) * 4) * (1 - Math.max(0, (t - 0.5) * 3));
      if (boltAlpha > 0){
        if (lightningBolts.length === 0) initLightning();
        lightningBolts.forEach(bolt=>{
          ctx.beginPath();
          ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
          bolt.points.forEach(p=>ctx.lineTo(p.x, p.y));
          ctx.strokeStyle = 'rgba(251,191,36,' + boltAlpha + ')';
          ctx.lineWidth = 2 + Math.random() * 2;
          ctx.stroke();

          // Свечение
          ctx.beginPath();
          ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
          bolt.points.forEach(p=>ctx.lineTo(p.x, p.y));
          ctx.strokeStyle = 'rgba(255,255,255,' + boltAlpha * 0.5 + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // Вспышка
        if (t > 0.2 && t < 0.35){
          ctx.fillStyle = 'rgba(251,191,36,' + (0.15 - Math.abs(t - 0.275) * 0.5) + ')';
          ctx.fillRect(0, 0, W, H);
        }
      }
    }

    // Фаза 3: распад O2 и образование O3
    if (t > 0.4){
      const showProducts = Math.min(1, (t - 0.4) * 2.5);

      // Показываем O3 молекулы
      for (let i=0; i<4; i++){
        const ox = 150 + i * 180 + Math.sin(i * 2) * 30;
        const oy = 120 + (i % 3) * 80;
        drawMolecule(ox, oy, 'O3', showProducts * 0.8);
      }

      if (showProducts > 0.5){
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#10b981';
        ctx.fillText('Молекулы озона O₃', W/2, H - 40);
      }
    }

    // Итог
    if (t >= 0.85){
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('Озон защищает Землю от УФ-излучения', W/2, H - 55);
    }

    // Стрелка
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('⚡ Разряд молнии расщепляет O₂ на атомы', W/2, H - 5);
  }

  function loop(){
    if (!running) return;
    progress += 0.006;
    if (progress >= 1){ progress = 1; running = false; btn.textContent = '▶ Разряд молнии и образование озона'; }
    draw();
    if (running) rafId = requestAnimationFrame(loop);
  }

  btn.addEventListener('click',()=>{
    if (running){ running = false; btn.textContent = '▶ Продолжить'; return; }
    if (progress >= 1) progress = 0;
    lightningBolts = [];
    running = true; btn.textContent = '⏸ Пауза'; loop();
  });

  initMolecules();
  draw();
})();

/* ============================================================
   ВХОДНОЙ ТЕСТ
   ============================================================ */
