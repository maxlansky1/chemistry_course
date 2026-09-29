// ============================================================
//  module_5 (4а) — модели атома: таймлайн, Томсон, Резерфорд, Бор, квантовая
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
  const track = document.getElementById('timelineTrack');
  const detail = document.getElementById('tlDetail');
  if (!track) return;
  const EVENTS = [
    { year:'1803', who:'Джон Дальтон', what:'Первая научная атомная теория', title:'1803 · Джон Дальтон',
      text:'Дальтон предложил первую <b>научную</b> атомную теорию: каждое вещество состоит из атомов, атомы одного элемента одинаковы, а разных — разные. Атомы он представлял как <b>неделимые шарики</b>. Но как доказать их существование?' },
    { year:'1897', who:'Дж. Дж. Томсон', what:'Открытие электрона', title:'1897 · Джозеф Джон Томсон',
      text:'Изучая катодные лучи, Томсон обнаружил <b>электрон</b> — отрицательно заряженную частицу, которая в тысячи раз легче атома. Это означало: атом <b>делим</b>! Внутри него есть и другие частицы.' },
    { year:'1904', who:'Дж. Дж. Томсон', what:'Модель «пудинг с изюмом»', title:'1904 · Модель Томсона',
      text:'Томсон предположил, что атом — это <b>положительно заряженный шар</b>, в который вкраплены электроны, как изюм в пудинг. Модель объясняла нейтральность атома, но не объясняла результаты будущих опытов.' },
    { year:'1909–1911', who:'Эрнест Резерфорд', what:'Опыт с золотой фольгой', title:'1909–1911 · Эрнест Резерфорд',
      text:'Резерфорд «обстреливал» золотую фольгу альфа-частицами. Ожидалось, что все они пролетят насквозь. Но некоторые <b>отскочили назад</b>! Резерфорд сделал вывод: в центре атома — крошечное тяжёлое <b>ядро</b>, а вокруг — пустота и электроны.' },
    { year:'1913', who:'Нильс Бор', what:'Квантовые постулаты', title:'1913 · Нильс Бор',
      text:'Планетарная модель Резерфорда противоречила физике: электрон должен был упасть на ядро. Бор предположил, что электроны могут двигаться только по <b>определённым орбитам</b> и <b>не излучают</b> энергию, пока на них находятся. При перескоке — поглощают или выделяют <b>квант</b>.' },
    { year:'1920-е', who:'Шрёдингер, Гейзенберг', what:'Квантовая модель', title:'1920-е · Квантовая механика',
      text:'Электрон — <b>не шарик</b>, а «облако вероятности». Мы не можем точно указать его положение, но можем сказать, где он бывает <b>чаще всего</b>. Эта модель лучше всего объясняет эксперименты.' }
  ];
  track.innerHTML = EVENTS.map((e,i)=>`
    <div class="tl-year${i===0?' active':''}" data-i="${i}">
      <div class="tl-num">${e.year}</div>
      <div class="tl-who">${e.who}</div>
      <div class="tl-what">${e.what}</div>
    </div>`).join('');
  function show(i){
    document.querySelectorAll('.tl-year').forEach(el=>el.classList.remove('active'));
    track.querySelector(`[data-i="${i}"]`).classList.add('active');
    const e = EVENTS[i];
    detail.classList.add('show');
    detail.innerHTML = `<div class="tl-d-title">${e.title}</div><div class="tl-d-text">${e.text}</div>`;
  }
  track.querySelectorAll('.tl-year').forEach(el=>el.addEventListener('click',()=>show(+el.dataset.i)));
  show(0);
})();

/* ============================================================
   МОДЕЛИ АТОМА
   ============================================================ */
(function(){
  const tabs = document.querySelectorAll('.model-tab');
  const views = document.querySelectorAll('.model-view');
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      views.forEach(v=>v.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('model-'+tab.dataset.model).classList.add('active');
      if (tab.dataset.model === 'thomson') restartThomson();
      if (tab.dataset.model === 'rutherford') restartRutherford();
      if (tab.dataset.model === 'bohr') restartBohr();
      if (tab.dataset.model === 'quantum') restartQuantum();
    });
  });
})();

/* ============================================================
   МОДЕЛЬ ТОМСОНА
   ============================================================ */
let thomsonRaf = null;
function restartThomson(){
  const canvas = document.getElementById('thomsonCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  const btn = document.getElementById('thomsonBtn');
  let alphas = []; let running = false;
  if (thomsonRaf) cancelAnimationFrame(thomsonRaf);
  function draw(){
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#f0f9ff');bg.addColorStop(1,'#e0f2fe');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    const cx=W/2,cy=H/2,R=120;
    const grad=ctx.createRadialGradient(cx,cy,10,cx,cy,R);
    grad.addColorStop(0,'rgba(239,68,68,.6)');grad.addColorStop(1,'rgba(239,68,68,.05)');
    ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
    ctx.strokeStyle='rgba(239,68,68,.5)';ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.stroke();ctx.setLineDash([]);
    const ePos=[[-60,-40],[60,-50],[70,50],[-50,60],[0,0],[-30,80],[40,80]];
    ePos.forEach(([dx,dy])=>{
      ctx.beginPath();ctx.arc(cx+dx,cy+dy,8,0,Math.PI*2);ctx.fillStyle='#3b82f6';ctx.fill();
      ctx.strokeStyle='#1e40af';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='bold 10px Inter, sans-serif';ctx.textAlign='center';ctx.fillText('−',cx+dx,cy+dy+4);
    });
    alphas.forEach(a=>{ctx.beginPath();ctx.arc(a.x,a.y,5,0,Math.PI*2);ctx.fillStyle='#fbbf24';ctx.fill();});
    ctx.font='bold 14px Inter, sans-serif';ctx.fillStyle='#64748b';ctx.textAlign='left';ctx.fillText('Пучок α-частиц →',20,30);
    ctx.textAlign='right';ctx.fillText('Атом Томсона',W-20,30);
    ctx.textAlign='center';ctx.fillStyle='#b91c1c';ctx.fillText('Положительный шар + электроны',cx,cy+R+30);
  }
  function update(){
    if (Math.random()<0.25) alphas.push({x:0,y:H/2+rand(-80,80),vx:4,vy:0,slight:rand(-0.04,0.04)});
    for (let i=alphas.length-1;i>=0;i--){const a=alphas[i];a.x+=a.vx;a.y+=a.slight;if(a.x>W+10)alphas.splice(i,1);}
  }
  function loop(){if(!running)return;update();draw();thomsonRaf=requestAnimationFrame(loop);}
  btn.addEventListener('click',()=>{if(running){running=false;btn.textContent='🎯 Обстрелять альфа-частицами';return;}running=true;btn.textContent='⏸ Пауза';loop();});
  draw();
}

/* ============================================================
   ОПЫТ РЕЗЕРФОРДА — ИСПРАВЛЕННАЯ ВЕРСИЯ
   ============================================================ */
let rutherfordRaf = null;
function restartRutherford(){
  const canvas = document.getElementById('rutherfordCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  const btn = document.getElementById('rutherfordBtn');
  const resetBtn = document.getElementById('rutherfordReset');

  // Ядра золота — распределены по фольге
  const foilX = 250;
  const nuclei = [];
  for (let y=50; y<H-50; y+=40){
    for (let x=foilX-15; x<foilX+15; x+=30){
      nuclei.push({x:x, y:y, r: 3});
    }
  }

  let alphas = [];
  let running = false;
  let counts = {through:0, deflected:0, bounced:0};
  if (rutherfordRaf) cancelAnimationFrame(rutherfordRaf);

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);

    // Источник (свинцовый блок)
    ctx.fillStyle='#475569';
    ctx.beginPath();ctx.roundRect(20,H/2-40,70,80,6);ctx.fill();
    ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(90,H/2,6,0,Math.PI*2);ctx.fill();

    // Пучок
    ctx.strokeStyle='rgba(251,191,36,.2)';ctx.lineWidth=2;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(96,H/2);ctx.lineTo(foilX-10,H/2);ctx.stroke();ctx.setLineDash([]);

    // Золотая фольга
    ctx.fillStyle='rgba(250,204,21,.08)';
    ctx.fillRect(foilX-20,30,40,H-60);
    ctx.strokeStyle='rgba(250,204,21,.3)';ctx.lineWidth=1;
    ctx.strokeRect(foilX-20,30,40,H-60);

    // Ядра золота
    nuclei.forEach(n=>{
      ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle='rgba(250,204,21,.8)';ctx.fill();
    });

    // Детектор (дуга справа)
    ctx.strokeStyle='rgba(16,185,129,.4)';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(W-100,H/2,130,-Math.PI/2,Math.PI/2);ctx.stroke();

    // Альфа-частицы
    alphas.forEach(a=>{
      if (a.trail.length>1){
        ctx.beginPath();ctx.moveTo(a.trail[0].x,a.trail[0].y);
        for(let i=1;i<a.trail.length;i++) ctx.lineTo(a.trail[i].x,a.trail[i].y);
        ctx.strokeStyle = a.bounced ? 'rgba(239,68,68,.7)' : (a.deflected ? 'rgba(251,191,36,.6)' : 'rgba(251,191,36,.2)');
        ctx.lineWidth = a.bounced ? 2.5 : 1.5;
        ctx.stroke();
      }
      ctx.beginPath();ctx.arc(a.x,a.y,4,0,Math.PI*2);
      ctx.fillStyle = a.bounced ? '#ef4444' : '#fbbf24';ctx.fill();
    });

    // Подписи
    ctx.font='bold 13px Inter, sans-serif';ctx.textAlign='left';ctx.fillStyle='#94a3b8';
    ctx.fillText('Свинцовый блок',20,30);
    ctx.fillStyle='#facc15';ctx.fillText('Золотая фольга',foilX-40,25);
    ctx.fillStyle='#10b981';ctx.textAlign='right';ctx.fillText('Детектор',W-20,30);

    // Счётчик
    ctx.textAlign='center';ctx.fillStyle='#cbd5e1';ctx.font='bold 13px Inter, sans-serif';
    ctx.fillText(`Прошло: ${counts.through} · Отклонилось: ${counts.deflected} · Отскочило: ${counts.bounced}`,W/2,H-15);
  }

  function spawn(){
    if (Math.random()>0.4) return;
    const startY = H/2 + rand(-160,160);
    // Целимся в случайное ядро золота
    const target = nuclei[Math.floor(Math.random()*nuclei.length)];
    const angle = Math.atan2(target.y - startY, target.x - 96) + rand(-0.06, 0.06);
    alphas.push({
      x:96, y:startY,
      vx:Math.cos(angle)*3.5,
      vy:Math.sin(angle)*3.5,
      trail:[], deflected:false, bounced:false
    });
  }

  function update(){
    spawn();
    for (let i=alphas.length-1;i>=0;i--){
      const a = alphas[i];
      // Взаимодействие с ближайшим ядром
      let nearest = null, minDist = Infinity;
      nuclei.forEach(n=>{
        const d = Math.hypot(a.x-n.x, a.y-n.y);
        if (d < minDist){ minDist = d; nearest = n; }
      });
      if (nearest && minDist < 60 && minDist > 0){
        const dx = a.x - nearest.x, dy = a.y - nearest.y;
        const force = 500 / (minDist*minDist);
        a.vx += (dx/minDist) * force;
        a.vy += (dy/minDist) * force;
        if (!a.deflected && force > 0.1){ a.deflected = true; }
      }
      a.x += a.vx; a.y += a.vy;
      a.trail.push({x:a.x,y:a.y});
      if (a.trail.length>60) a.trail.shift();

      if (a.x > W+10){
        if (a.bounced) counts.bounced++;
        else if (a.deflected) counts.deflected++;
        else counts.through++;
        alphas.splice(i,1); continue;
      }
      if (a.x < -10 || a.y < -10 || a.y > H+10){
        if (a.x < -10 && a.vy < 0){ a.bounced = true; counts.bounced++; }
        else if (a.deflected) counts.deflected++;
        alphas.splice(i,1); continue;
      }
    }
  }

  function loop(){if(!running)return;update();draw();rutherfordRaf=requestAnimationFrame(loop);}
  btn.addEventListener('click',()=>{if(running){running=false;btn.textContent='▶ Запустить опыт';return;}running=true;btn.textContent='⏸ Пауза';loop();});
  resetBtn.addEventListener('click',()=>{running=false;btn.textContent='▶ Запустить опыт';alphas=[];counts={through:0,deflected:0,bounced:0};draw();});
  draw();
}

/* ============================================================
   МОДЕЛЬ БОРА
   ============================================================ */
let bohrRaf = null;
let bohrState = {orbit:1, flash:null};
function restartBohr(){
  const canvas = document.getElementById('bohrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;
  const orbits = [60,110,160];
  const labels = ['n=1','n=2','n=3'];
  let angle = 0;
  if (bohrRaf) cancelAnimationFrame(bohrRaf);
  function draw(){
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
    orbits.forEach((r,i)=>{
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle=i===bohrState.orbit-1?'#06b6d4':'#334155';
      ctx.lineWidth=i===bohrState.orbit-1?2.5:1.5;
      ctx.setLineDash(i===bohrState.orbit-1?[]:[5,5]);ctx.stroke();ctx.setLineDash([]);
      ctx.font='bold 12px Inter, sans-serif';ctx.fillStyle=i===bohrState.orbit-1?'#67e8f9':'#64748b';
      ctx.textAlign='left';ctx.fillText(labels[i],cx+r+6,cy);
    });
    ctx.beginPath();ctx.arc(cx,cy,25,0,Math.PI*2);
    const g=ctx.createRadialGradient(cx,cy,5,cx,cy,25);g.addColorStop(0,'#f87171');g.addColorStop(1,'#dc2626');
    ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='bold 11px Inter, sans-serif';ctx.textAlign='center';ctx.fillText('ядро',cx,cy+4);
    const r=orbits[bohrState.orbit-1];
    const ex=cx+Math.cos(angle)*r, ey=cy+Math.sin(angle)*r;
    ctx.beginPath();ctx.arc(ex,ey,11,0,Math.PI*2);
    const eg=ctx.createRadialGradient(ex,ey,2,ex,ey,11);eg.addColorStop(0,'#67e8f9');eg.addColorStop(1,'#06b6d4');
    ctx.fillStyle=eg;ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 12px Inter, sans-serif';ctx.fillText('−',ex,ey+4);
    if (bohrState.flash){
      const f=bohrState.flash;ctx.globalAlpha=f.alpha;
      ctx.beginPath();ctx.arc(cx+300,cy-100,12,0,Math.PI*2);ctx.fillStyle='#fbbf24';ctx.fill();
      ctx.font='bold 16px Inter, sans-serif';ctx.fillStyle='#fbbf24';ctx.textAlign='center';
      ctx.fillText(f.dir==='up'?'⚡ квант':'✨ фотон',cx+300,cy-130);
      ctx.globalAlpha=1;
    }
    ctx.font='bold 14px Inter, sans-serif';ctx.textAlign='center';ctx.fillStyle='#94a3b8';
    ctx.fillText('Электрон на орбите n='+bohrState.orbit+' (не излучает)',cx,H-20);
  }
  function loop(){
    angle+=0.03;
    if(bohrState.flash){bohrState.flash.alpha-=0.02;if(bohrState.flash.alpha<=0)bohrState.flash=null;}
    draw();bohrRaf=requestAnimationFrame(loop);
  }
  document.getElementById('bohrUp').onclick=()=>{if(bohrState.orbit<3){bohrState.orbit++;bohrState.flash={alpha:1,dir:'up'};}};
  document.getElementById('bohrDown').onclick=()=>{if(bohrState.orbit>1){bohrState.orbit--;bohrState.flash={alpha:1,dir:'down'};}};
  document.getElementById('bohrReset').onclick=()=>{bohrState.orbit=1;bohrState.flash=null;};
  loop();
}

/* ============================================================
   КВАНТОВАЯ МОДЕЛЬ
   ============================================================ */
let quantumRaf = null;
function restartQuantum(){
  const canvas = document.getElementById('quantumCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  const cx=W/2, cy=H/2;
  const slider=document.getElementById('quantumSlider');
  const label=document.getElementById('quantumLabel');
  let t=0;
  if (quantumRaf) cancelAnimationFrame(quantumRaf);
  const names=['s-орбиталь (сфера)','p-орбиталь (гантель)','d-орбиталь (лепестки)'];
  function draw(){
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
    const mode=+slider.value;
    ctx.beginPath();ctx.arc(cx,cy,18,0,Math.PI*2);
    const g=ctx.createRadialGradient(cx,cy,3,cx,cy,18);g.addColorStop(0,'#f87171');g.addColorStop(1,'#dc2626');ctx.fillStyle=g;ctx.fill();
    const pulse=1+Math.sin(t)*0.04;
    if (mode===0){
      const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,100*pulse);
      cg.addColorStop(0,'rgba(167,139,250,.55)');cg.addColorStop(1,'rgba(167,139,250,0)');
      ctx.beginPath();ctx.arc(cx,cy,100*pulse,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();
    } else if (mode===1){
      for (const sign of [-1,1]){
        const cxx=cx, cyy=cy+sign*70*pulse;
        const cg=ctx.createRadialGradient(cxx,cyy,0,cxx,cyy,80*pulse);
        cg.addColorStop(0,'rgba(139,92,246,.55)');cg.addColorStop(1,'rgba(139,92,246,0)');
        ctx.beginPath();ctx.ellipse(cxx,cyy,60*pulse,80*pulse,0,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();
      }
    } else {
      const angles=[0,Math.PI/2,Math.PI,3*Math.PI/2];
      angles.forEach(a=>{
        const cxx=cx+Math.cos(a)*80*pulse, cyy=cy+Math.sin(a)*80*pulse;
        const cg=ctx.createRadialGradient(cxx,cyy,0,cxx,cyy,60*pulse);
        cg.addColorStop(0,'rgba(139,92,246,.55)');cg.addColorStop(1,'rgba(139,92,246,0)');
        ctx.beginPath();ctx.ellipse(cxx,cyy,55*pulse,40*pulse,a,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();
      });
    }
    ctx.font='bold 15px Inter, sans-serif';ctx.textAlign='center';ctx.fillStyle='#e0e7ff';
    ctx.fillText('Где электрон бывает чаще — там облако плотнее',cx,H-20);
  }
  function loop(){t+=0.05;draw();quantumRaf=requestAnimationFrame(loop);}
  slider.oninput=()=>{label.textContent=names[+slider.value];draw();};
  label.textContent=names[+slider.value];
  loop();
}

/* ============================================================
   ШКАЛА МАСШТАБОВ — ЛОГАРИФМИЧЕСКАЯ
   ============================================================ */
