// ============================================================
//  module_5 (4а) — внутри атома: шкала масштабов, кварки
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
  const canvas = document.getElementById('scaleCanvas');
  const btnIn = document.getElementById('scaleIn');
  const btnOut = document.getElementById('scaleOut');
  const btnReset = document.getElementById('scaleReset');
  const info = document.getElementById('scaleInfo');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Логарифмическая шкала: от 10^-18 м (кварк) до 10^7 м (Земля)
  // log10 от -18 до 7 = 25 порядков
  const MIN_LOG = -18, MAX_LOG = 7;
  let currentLog = 0; // 1 метр

  const OBJECTS = [
    {log:-18, name:'Кварк', r:2, color:'#a78bfa', label:'< 10⁻¹⁸ м'},
    {log:-15, name:'Протон', r:4, color:'#f87171', label:'~10⁻¹⁵ м'},
    {log:-14, name:'Ядро атома', r:6, color:'#ef4444', label:'~10⁻¹⁴ м'},
    {log:-10, name:'Атом', r:20, color:'#38bdf8', label:'~10⁻¹⁰ м'},
    {log:-9, name:'Молекула', r:25, color:'#06b6d4', label:'~10⁻⁹ м'},
    {log:-7, name:'Вирус', r:30, color:'#10b981', label:'~10⁻⁷ м'},
    {log:-6, name:'Бактерия', r:35, color:'#22c55e', label:'~10⁻⁶ м'},
    {log:-4, name:'Клетка', r:45, color:'#84cc16', label:'~10⁻⁴ м'},
    {log:-2, name:'Пылинка', r:50, color:'#eab308', label:'~10⁻² м'},
    {log:0, name:'Человек', r:70, color:'#f97316', label:'1 м'},
    {log:4, name:'Гора', r:100, color:'#78716c', label:'~10⁴ м'},
    {log:7, name:'Земля', r:150, color:'#3b82f6', label:'~10⁷ м'}
  ];

  // Находим ближайший объект к текущему масштабу
  function nearestObject(log){
    let best = OBJECTS[0], bestDist = Infinity;
    OBJECTS.forEach(o=>{
      const d = Math.abs(o.log - log);
      if (d < bestDist){ bestDist = d; best = o; }
    });
    return best;
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#0f172a'); bg.addColorStop(1,'#1e293b');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    // Центральный объект
    const obj = nearestObject(currentLog);
    const cx = W/2, cy = H/2 - 20;

    // Пульсация
    const pulse = 1 + Math.sin(Date.now()*0.003) * 0.05;
    const radius = obj.r * pulse;

    // Свечение
    const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,radius*3);
    glow.addColorStop(0, obj.color + '66');
    glow.addColorStop(1, obj.color + '00');
    ctx.beginPath(); ctx.arc(cx,cy,radius*3,0,Math.PI*2);
    ctx.fillStyle = glow; ctx.fill();

    // Объект
    ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2);
    ctx.fillStyle = obj.color; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

    // Название
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(obj.name, cx, cy + radius + 40);
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(obj.label, cx, cy + radius + 65);

    // Шкала (логарифмическая линейка)
    const barY = H - 60;
    const barX = 60;
    const barW = W - 120;
    const barH = 12;

    ctx.fillStyle = '#334155';
    ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 6); ctx.fill();

    // Заполнение
    const fillW = ((currentLog - MIN_LOG) / (MAX_LOG - MIN_LOG)) * barW;
    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    grad.addColorStop(0, '#a78bfa');
    grad.addColorStop(0.5, '#38bdf8');
    grad.addColorStop(1, '#f97316');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(barX, barY, fillW, barH, 6); ctx.fill();

    // Метки на шкале
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    const marks = [-18, -15, -12, -9, -6, -3, 0, 3, 6];
    marks.forEach(m=>{
      const x = barX + ((m - MIN_LOG) / (MAX_LOG - MIN_LOG)) * barW;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x-1, barY+barH, 2, 6);
      ctx.fillStyle = '#94a3b8';
      const label = m === 0 ? '1 м' : `10${m < 0 ? '⁻' : ''}${Math.abs(m)} м`;
      ctx.fillText(label, x, barY + barH + 22);
    });

    // Подпись
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(`Текущий масштаб: 10${currentLog < 0 ? '⁻' : ''}${Math.abs(Math.round(currentLog))} м`, cx, 40);

    // Инфо
    info.innerHTML = `Текущий масштаб: <b>${obj.label}</b> — ${obj.name}`;
  }

  btnIn.addEventListener('click',()=>{ currentLog = Math.max(MIN_LOG, currentLog - 1); draw(); });
  btnOut.addEventListener('click',()=>{ currentLog = Math.min(MAX_LOG, currentLog + 1); draw(); });
  btnReset.addEventListener('click',()=>{ currentLog = 0; draw(); });

  draw();
})();

/* ============================================================
   КВАРКИ — АНИМИРОВАННЫЙ ОБМЕН ГЛЮОНАМИ
   ============================================================ */
(function(){
  const canvas = document.getElementById('quarkCanvas');
  const toggleBtn = document.getElementById('quarkToggle');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;
  let running = true;
  let rafId = null;
  let t = 0;

  // Три кварка
  const quarks = [
    {angle: 0, radius: 70, color: '#a78bfa', label: 'u', offset: 0},
    {angle: 2*Math.PI/3, radius: 70, color: '#a78bfa', label: 'u', offset: Math.PI/3},
    {angle: 4*Math.PI/3, radius: 70, color: '#7dd3fc', label: 'd', offset: 2*Math.PI/3}
  ];

  // Глюоны — 6 частиц, которые летают между кварками
  const gluons = [];
  for (let i=0;i<6;i++){
    gluons.push({
      from: i % 3,
      to: (i+1) % 3,
      progress: Math.random(),
      speed: 0.005 + Math.random()*0.01
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#1e1b4b'; ctx.fillRect(0,0,W,H);

    // Свечение протона
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,130);
    g.addColorStop(0,'rgba(167,139,250,.15)');
    g.addColorStop(1,'rgba(167,139,250,0)');
    ctx.beginPath(); ctx.arc(cx,cy,130,0,Math.PI*2); ctx.fillStyle = g; ctx.fill();

    // Контур протона
    ctx.beginPath(); ctx.arc(cx,cy,120,0,Math.PI*2);
    ctx.strokeStyle = 'rgba(167,139,250,.3)';
    ctx.lineWidth = 2; ctx.setLineDash([8,6]); ctx.stroke(); ctx.setLineDash([]);

    // Позиции кварков
    const pos = quarks.map(q=>{
      const a = q.angle + t * 0.01;
      return { x: cx + Math.cos(a) * q.radius, y: cy + Math.sin(a) * q.radius };
    });

    // Глюоны (линии между кварками)
    gluons.forEach(gl=>{
      const from = pos[gl.from];
      const to = pos[gl.to];
      const gx = from.x + (to.x - from.x) * gl.progress;
      const gy = from.y + (to.y - from.y) * gl.progress;

      // Линия
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = `rgba(251,191,36,${0.2 + gl.progress * 0.3})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([4,4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Глюон (жёлтая точка)
      ctx.beginPath();
      ctx.arc(gx, gy, 4, 0, Math.PI*2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.stroke();

      gl.progress += gl.speed;
      if (gl.progress > 1){ gl.progress = 0; gl.from = gl.to; gl.to = (gl.to+1)%3; }
    });

    // Кварки
    quarks.forEach((q,i)=>{
      const p = pos[i];
      ctx.beginPath(); ctx.arc(p.x, p.y, 26, 0, Math.PI*2);
      const qg = ctx.createRadialGradient(p.x-6,p.y-6,4,p.x,p.y,26);
      qg.addColorStop(0, q.color);
      qg.addColorStop(1, q.color === '#a78bfa' ? '#7c3aed' : '#0284c7');
      ctx.fillStyle = qg; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(q.label, p.x, p.y + 6);
    });

    // Подписи
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c7d2fe';
    ctx.fillText('Протон: два u-кварка и один d-кварк', cx, 30);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Жёлтые точки — глюоны, «склеивающие» кварки', cx, H - 20);

    t++;
  }

  function loop(){
    if (!running) return;
    draw();
    rafId = requestAnimationFrame(loop);
  }

  toggleBtn.addEventListener('click',()=>{
    if (running){ running = false; toggleBtn.textContent = '▶ Продолжить'; }
    else { running = true; toggleBtn.textContent = '⏸ Пауза'; loop(); }
  });

  loop();
})();

/* ============================================================
   ВХОДНОЙ ТЕСТ
   ============================================================ */
