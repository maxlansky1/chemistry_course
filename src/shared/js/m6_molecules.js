// ============================================================
//  module_6 (4б) — molecules
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
  const canvas = document.getElementById('h2Canvas');
  const slider = document.getElementById('h2Slider');
  const badge = document.getElementById('energyBadge');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  let animProgress = 0;

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,W,H);

    const t = slider.value / 100;
    const maxSep = W * 0.38;
    const minSep = 60;
    const sep = maxSep - t * (maxSep - minSep);
    const cx = W/2;
    const cy = H/2 - 10;

    const x1 = cx - sep/2;
    const x2 = cx + sep/2;

    // Энергия
    const energy = Math.pow((sep - minSep) / (maxSep - minSep), 2);
    const energyPct = Math.round(energy * 100);
    if (energyPct > 40){
      badge.className = 'energy-badge high';
      badge.textContent = 'Энергия: высокая (' + energyPct + '%)';
    } else if (energyPct > 10){
      badge.className = 'energy-badge high';
      badge.textContent = 'Энергия: снижается (' + energyPct + '%)';
    } else {
      badge.className = 'energy-badge low';
      badge.textContent = 'Энергия: минимальная — связь образована!';
    }

    // Орбиты и электроны
    const orbitR = Math.min(sep * 0.35, 90);
    const bondFormed = energyPct < 25;

    function drawOrbitAndElectron(atomX, atomY, orbitRadius, phase){
      // Орбита
      ctx.beginPath();
      ctx.arc(atomX, atomY, orbitRadius, 0, Math.PI*2);
      ctx.strokeStyle = bondFormed ? 'rgba(16,185,129,.35)' : 'rgba(6,182,212,.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Электрон
      const angle = animProgress * 2.5 + phase;
      const ex = atomX + Math.cos(angle) * orbitRadius;
      const ey = atomY + Math.sin(angle) * orbitRadius;
      const er = 6;

      // Свечение
      const eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, er*3);
      eGrad.addColorStop(0, bondFormed ? 'rgba(16,185,129,.5)' : 'rgba(6,182,212,.5)');
      eGrad.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = eGrad;
      ctx.beginPath(); ctx.arc(ex, ey, er*3, 0, Math.PI*2); ctx.fill();

      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI*2);
      ctx.fillStyle = bondFormed ? '#10b981' : '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();

      ctx.fillStyle = '#fff'; ctx.font = 'bold 8px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('–', ex, ey+1);
    }

    // Если связь образована — общее облако
    if (bondFormed){
      const midX = (x1 + x2) / 2;
      const cloudR = sep * 0.6 + 20;
      const cloudGrad = ctx.createRadialGradient(midX, cy, 0, midX, cy, cloudR);
      cloudGrad.addColorStop(0, 'rgba(16,185,129,.15)');
      cloudGrad.addColorStop(0.6, 'rgba(16,185,129,.06)');
      cloudGrad.addColorStop(1, 'rgba(16,185,129,0)');
      ctx.fillStyle = cloudGrad;
      ctx.beginPath(); ctx.ellipse(midX, cy, cloudR, cloudR*0.7, 0, 0, Math.PI*2); ctx.fill();

      // Общие электроны
      const angle = animProgress * 2;
      const ex1 = midX - sep*0.15 + Math.cos(angle) * 15;
      const ey1 = cy + Math.sin(angle) * 15;
      const ex2 = midX + sep*0.15 + Math.cos(angle + Math.PI) * 15;
      const ey2 = cy + Math.sin(angle + Math.PI) * 15;

      function drawSharedElectron(ex, ey){
        const eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 15);
        eGrad.addColorStop(0, 'rgba(16,185,129,.6)');
        eGrad.addColorStop(1, 'rgba(16,185,129,0)');
        ctx.fillStyle = eGrad;
        ctx.beginPath(); ctx.arc(ex, ey, 15, 0, Math.PI*2); ctx.fill();

        ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI*2);
        ctx.fillStyle = '#10b981'; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 8px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('–', ex, ey+1);
      }
      drawSharedElectron(ex1, ey1);
      drawSharedElectron(ex2, ey2);

      // Линия связи
      ctx.beginPath(); ctx.moveTo(x1+22, cy); ctx.lineTo(x2-22, cy);
      ctx.strokeStyle = 'rgba(16,185,129,.7)';
      ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
    }

    // Атомы (ядро + орбита)
    function drawAtom(x, y, label, color, phase){
      // Орбита
      drawOrbitAndElectron(x, y, orbitR, phase);

      // Ядро
      const grad = ctx.createRadialGradient(x-4, y-4, 2, x, y, 18);
      grad.addColorStop(0, '#fff');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, color);
      ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI*2);
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y+1);
    }

    drawAtom(x1, cy, 'H', '#3b82f6', 0);
    drawAtom(x2, cy, 'H', '#3b82f6', Math.PI);

    // Подписи
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#94a3b8';

    if (!bondFormed){
      ctx.fillText('Атом водорода', x1, cy + 60);
      ctx.fillText('Атом водорода', x2, cy + 60);
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Электроны летают вокруг своих ядер', W/2, cy + 95);
    } else {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 17px Inter, sans-serif';
      ctx.fillText('Молекула H₂', W/2, cy + 70);
      ctx.font = '13px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Электроны обобществлены — связь образована!', W/2, cy + 95);
    }

    // Стрелка
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('⚡ Двигай ползунок, чтобы сблизить атомы', W/2, H - 10);
  }

  function animLoop(){
    animProgress += 0.03;
    draw();
    requestAnimationFrame(animLoop);
  }

  slider.addEventListener('input', draw);
  animLoop();
})();

/* ============================================================
   АНИМАЦИЯ ГРАФИТ → АЛМАЗ С ПОЛЗУНКОМ ДАВЛЕНИЯ
   ============================================================ */
