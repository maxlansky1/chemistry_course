// ============================================================
//  module_5 (4а) — доказательства атомов: диффузия, броуновское движение, Пруст
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
   ДИФФУЗИЯ
   ============================================================ */

(function(){
  const canvas = document.getElementById('diffusionCanvas');
  const btn = document.getElementById('diffusionBtn');
  const scaleBtn = document.getElementById('diffusionScale');
  const resetBtn = document.getElementById('diffusionReset');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let mode = 'macro'; let running = false; let particles = [];
  function initParticles(){
    particles = [];
    if (mode === 'macro'){
      for (let i=0;i<160;i++) particles.push({x:rand(0,W),y:rand(0,H),vx:rand(-1,1),vy:rand(-1,1),r:rand(2,4),kind:'air'});
      for (let i=0;i<50;i++) particles.push({x:rand(30,140),y:rand(H-140,H-40),vx:rand(-.5,.5),vy:rand(-.5,.5),r:rand(4,6),kind:'perfume'});
    } else {
      for (let i=0;i<40;i++) particles.push({x:rand(30,W-30),y:rand(30,H-30),vx:rand(-.8,.8),vy:rand(-.8,.8),r:10,kind:'air'});
      for (let i=0;i<20;i++) particles.push({x:rand(40,180),y:rand(H-180,H-60),vx:rand(-.5,.5),vy:rand(-.5,.5),r:14,kind:'perfume'});
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const bg = ctx.createLinearGradient(0,0,0,H);
    if (mode==='macro'){bg.addColorStop(0,'#f0f9ff');bg.addColorStop(1,'#e0f2fe');}
    else {bg.addColorStop(0,'#0f172a');bg.addColorStop(1,'#1e293b');}
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    if (mode==='macro'){
      ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.strokeRect(20,20,W-40,H-40);ctx.setLineDash([]);
      ctx.fillStyle='#8b5cf6';ctx.beginPath();ctx.roundRect(60,H-110,50,70,8);ctx.fill();
      ctx.fillStyle='#c4b5fd';ctx.fillRect(75,H-125,20,20);
      ctx.font='bold 14px Inter, sans-serif';ctx.textAlign='left';ctx.fillStyle='#8b5cf6';ctx.fillText('Флакон духов',60,H-130);
      ctx.fillStyle='#64748b';ctx.fillText('Воздух комнаты',W-220,40);
    } else {
      ctx.font='bold 15px Inter, sans-serif';ctx.textAlign='left';ctx.fillStyle='#94a3b8';ctx.fillText('🔬 Молекулярный уровень: пустота между частицами',20,30);
    }
    particles.forEach(p=>{
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      if (p.kind==='perfume') ctx.fillStyle = mode==='macro'?'rgba(139,92,246,.85)':'#a78bfa';
      else ctx.fillStyle = mode==='macro'?'rgba(148,163,184,.4)':'#38bdf8';
      ctx.fill();
    });
  }
  function update(){particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<p.r||p.x>W-p.r)p.vx*=-1;if(p.y<p.r||p.y>H-p.r)p.vy*=-1;});}
  function loop(){if(!running)return;update();draw();requestAnimationFrame(loop);}
  btn.addEventListener('click',()=>{if(running){running=false;btn.textContent='▶ Запустить анимацию';return;}running=true;btn.textContent='⏸ Пауза';loop();});
  scaleBtn.addEventListener('click',()=>{mode=mode==='macro'?'micro':'macro';scaleBtn.textContent=mode==='macro'?'🔍 Уровень молекул':'🏠 Вид комнаты';initParticles();draw();});
  resetBtn.addEventListener('click',()=>{running=false;btn.textContent='▶ Запустить анимацию';initParticles();draw();});
  initParticles();draw();
})();

/* ============================================================
   БРОУНОВСКОЕ ДВИЖЕНИЕ
   ============================================================ */
(function(){
  const canvas = document.getElementById('brownianCanvas');
  const btn = document.getElementById('brownianBtn');
  const trailBtn = document.getElementById('brownianTrail');
  const resetBtn = document.getElementById('brownianReset');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  const water = [];
  for (let i=0;i<220;i++) water.push({x:rand(0,W),y:rand(0,H),vx:rand(-3,3),vy:rand(-3,3),r:rand(2,3)});
  const pollen = {x:W/2,y:H/2,vx:0,vy:0,r:22,trail:[]};
  let running=false, showTrail=true;
  function draw(){
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#f0f9ff');bg.addColorStop(1,'#e0f2fe');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    water.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(125,211,252,.55)';ctx.fill();});
    if (showTrail && pollen.trail.length>1){
      ctx.beginPath();ctx.moveTo(pollen.trail[0].x,pollen.trail[0].y);
      for(let i=1;i<pollen.trail.length;i++) ctx.lineTo(pollen.trail[i].x,pollen.trail[i].y);
      ctx.strokeStyle='rgba(139,92,246,.55)';ctx.lineWidth=2;ctx.stroke();
    }
    ctx.beginPath();ctx.arc(pollen.x,pollen.y,pollen.r,0,Math.PI*2);ctx.fillStyle='#8b5cf6';ctx.fill();ctx.strokeStyle='#6d28d9';ctx.lineWidth=2;ctx.stroke();
    ctx.font='bold 14px Inter, sans-serif';ctx.textAlign='left';ctx.fillStyle='#64748b';ctx.fillText('Молекулы воды',20,30);ctx.fillStyle='#8b5cf6';ctx.fillText('Частица пыльцы',20,52);
  }
  function update(){
    water.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;if(p.x<p.r||p.x>W-p.r)p.vx*=-1;if(p.y<p.r||p.y>H-p.r)p.vy*=-1;
      const dx=pollen.x-p.x,dy=pollen.y-p.y,d=Math.hypot(dx,dy);
      if(d<pollen.r+p.r+4){pollen.vx+=(dx/d)*0.35;pollen.vy+=(dy/d)*0.35;}
    });
    pollen.vx*=0.95;pollen.vy*=0.95;pollen.x+=pollen.vx;pollen.y+=pollen.vy;
    if(pollen.x<pollen.r){pollen.x=pollen.r;pollen.vx=Math.abs(pollen.vx);}
    if(pollen.x>W-pollen.r){pollen.x=W-pollen.r;pollen.vx=-Math.abs(pollen.vx);}
    if(pollen.y<pollen.r){pollen.y=pollen.r;pollen.vy=Math.abs(pollen.vy);}
    if(pollen.y>H-pollen.r){pollen.y=H-pollen.r;pollen.vy=-Math.abs(pollen.vy);}
    pollen.trail.push({x:pollen.x,y:pollen.y});if(pollen.trail.length>250)pollen.trail.shift();
  }
  function loop(){if(!running)return;update();draw();requestAnimationFrame(loop);}
  btn.addEventListener('click',()=>{if(running){running=false;btn.textContent='▶ Запустить';return;}running=true;btn.textContent='⏸ Пауза';loop();});
  trailBtn.addEventListener('click',()=>{showTrail=!showTrail;trailBtn.textContent=showTrail?'👁 Скрыть траекторию':'👁 Показать траекторию';draw();});
  resetBtn.addEventListener('click',()=>{pollen.x=W/2;pollen.y=H/2;pollen.vx=0;pollen.vy=0;pollen.trail=[];running=false;btn.textContent='▶ Запустить';draw();});
  draw();
})();

/* ============================================================
   ЗАКОН ПРУСТА — пипетки и зум
   ============================================================ */
(function(){
  const canvas = document.getElementById('proustCanvas');
  const btn = document.getElementById('proustBtn');
  const resetBtn = document.getElementById('proustReset');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;

  // Состояния анимации: 'idle' | 'pipette' | 'drop' | 'zoom1' | 'zoom2' | 'compare' | 'done'
  let state = 'idle';
  let t = 0;
  let rafId = null;

  const beakerA = {x: W*0.25, y: H*0.55, w: 120, h: 140};
  const beakerB = {x: W*0.75, y: H*0.55, w: 120, h: 140};
  const slideY = H*0.85;

  function drawBeaker(cx, cy, label, subtitle){
    // Стакан
    ctx.beginPath();
    ctx.moveTo(cx-60, cy-70);
    ctx.lineTo(cx-60, cy+70);
    ctx.lineTo(cx+60, cy+70);
    ctx.lineTo(cx+60, cy-70);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.stroke();
    // Жидкость
    ctx.beginPath();
    ctx.moveTo(cx-58, cy-20); ctx.lineTo(cx-58, cy+68);
    ctx.lineTo(cx+58, cy+68); ctx.lineTo(cx+58, cy-20);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56,189,248,.35)'; ctx.fill();
    // Подписи
    ctx.font = 'bold 14px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = '#0e7490'; ctx.fillText(label, cx, cy-90);
    ctx.font = '12px Inter, sans-serif'; ctx.fillStyle = '#64748b';
    ctx.fillText(subtitle, cx, cy-74);
    // Примеси (мелкие точки)
    for (let i=0;i<15;i++){
      ctx.beginPath();
      ctx.arc(cx-40+Math.random()*80, cy-10+Math.random()*70, 1.5, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(148,163,184,.5)'; ctx.fill();
    }
  }

  function drawPipette(x, y, angle){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    // Стеклянная трубка
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.beginPath(); ctx.roundRect(-6, -40, 12, 80, 4); ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.stroke();
    // Резиновая груша
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.ellipse(0, -50, 10, 14, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawDrop(x, y, r, alpha){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(56,189,248,${alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(14,116,144,${alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
  }

  function drawMolecules(cx, cy, count, scale, label){
    // Молекулы H2O: O (красный) + 2 H (синий)
    for (let i=0;i<count;i++){
      const angle = (i/count) * Math.PI * 2 + Math.random()*0.5;
      const r = 20 + Math.random() * 60 * scale;
      const mx = cx + Math.cos(angle) * r;
      const my = cy + Math.sin(angle) * r;
      // O
      ctx.beginPath(); ctx.arc(mx, my, 8*scale, 0, Math.PI*2);
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = `bold ${9*scale}px Inter, sans-serif`; ctx.textAlign = 'center';
      ctx.fillText('O', mx, my+3*scale);
      // H1
      ctx.beginPath(); ctx.arc(mx-12*scale, my-8*scale, 5*scale, 0, Math.PI*2);
      ctx.fillStyle = '#3b82f6'; ctx.fill();
      // H2
      ctx.beginPath(); ctx.arc(mx+12*scale, my-8*scale, 5*scale, 0, Math.PI*2);
      ctx.fillStyle = '#3b82f6'; ctx.fill();
    }
    if (label){
      ctx.font = 'bold 16px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#10b981'; ctx.fillText(label, cx, cy+100*scale);
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#f0f9ff'); bg.addColorStop(1,'#e0f2fe');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    // Заголовок
    ctx.font = 'bold 16px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = '#0e7490';
    ctx.fillText('Вода из разных источников — после очистки это одно и то же вещество', W/2, 35);

    if (state === 'idle' || state === 'pipette' || state === 'drop'){
      drawBeaker(beakerA.x, beakerA.y, 'Сибирское озеро', 'отфильтрована, но могут быть примеси');
      drawBeaker(beakerB.x, beakerB.y, 'Лаборатория', 'отфильтрована, но могут быть примеси');

      if (state === 'pipette' || state === 'drop'){
        const progress = Math.min(t, 1);
        // Пипетка A
        const pxA = beakerA.x + (W/2 - beakerA.x) * progress;
        const pyA = beakerA.y - 40 + (H*0.15) * progress;
        drawPipette(pxA, pyA, 0.3 * progress);
        // Пипетка B
        const pxB = beakerB.x + (W/2 - beakerB.x) * progress;
        const pyB = beakerB.y - 40 + (H*0.15) * progress;
        drawPipette(pxB, pyB, -0.3 * progress);
      }

      if (state === 'drop' && t > 1.2){
        drawDrop(W/2 - 80, H*0.3 + (t-1.2)*100, 8, Math.min(1, (t-1.2)*2));
        drawDrop(W/2 + 80, H*0.3 + (t-1.2)*100, 8, Math.min(1, (t-1.2)*2));
      }
    }

    if (state === 'zoom1'){
      // Зум в первую каплю
      const progress = Math.min(t, 1);
      ctx.save();
      ctx.translate(W/2, H/2);
      ctx.scale(1 + progress * 4, 1 + progress * 4);
      ctx.translate(-W/2, -H/2);
      drawMolecules(W/2 - 80, H/2, 8, 0.8, '');
      ctx.restore();
      ctx.font = 'bold 18px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText('🔬 Капля №1: молекулы воды H₂O', W/2, H - 30);
    }

    if (state === 'zoom2' || state === 'compare'){
      const progress = state === 'compare' ? 1 : Math.min(t, 1);
      // Две капли рядом
      drawMolecules(W/2 - 150, H/2, 8, 1, '');
      drawMolecules(W/2 + 150, H/2, 8, 1, '');
      ctx.font = 'bold 16px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Капля №1', W/2 - 150, H/2 - 110);
      ctx.fillText('Капля №2', W/2 + 150, H/2 - 110);
      if (state === 'compare'){
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.fillText('✅ Состав одинаковый: H₂O!', W/2, H - 40);
      }
    }

    if (state === 'done'){
      drawMolecules(W/2 - 150, H/2, 8, 1, '');
      drawMolecules(W/2 + 150, H/2, 8, 1, '');
      ctx.font = 'bold 16px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Капля №1', W/2 - 150, H/2 - 110);
      ctx.fillText('Капля №2', W/2 + 150, H/2 - 110);
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText('✅ Состав одинаковый: H₂O!', W/2, H - 30);
    }
  }

  function animate(){
    if (state === 'done') return;
    t += 0.02;
    if (state === 'pipette' && t >= 1){ state = 'drop'; t = 0; }
    else if (state === 'drop' && t >= 2.5){ state = 'zoom1'; t = 0; }
    else if (state === 'zoom1' && t >= 1){ state = 'zoom2'; t = 0; }
    else if (state === 'zoom2' && t >= 1){ state = 'compare'; t = 0; }
    else if (state === 'compare' && t >= 1.5){ state = 'done'; }
    draw();
    if (state !== 'done') rafId = requestAnimationFrame(animate);
  }

  btn.addEventListener('click',()=>{
    if (state !== 'idle') return;
    state = 'pipette'; t = 0;
    btn.textContent = '⏳ Анимация...';
    btn.disabled = true;
    animate();
  });

  resetBtn.addEventListener('click',()=>{
    if (rafId) cancelAnimationFrame(rafId);
    state = 'idle'; t = 0;
    btn.textContent = '🔬 Взять по капле и заглянуть внутрь';
    btn.disabled = false;
    draw();
  });

  draw();
})();

/* ============================================================
   ТАЙМЛАЙН
   ============================================================ */
