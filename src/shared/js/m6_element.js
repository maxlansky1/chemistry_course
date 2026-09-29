// ============================================================
//  module_6 (4б) — element
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
  const canvas = document.getElementById('isotopeCanvas');
  const btn = document.getElementById('isotopeBtn');
  const stepBtn = document.getElementById('isotopeStepBtn');
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  let progress = 0; let running = false; let rafId = null;
  let stepMode = 0;

  const isotopes = [
    { name:'Протий ¹H', protons:1, neutrons:0, color:'#3b82f6', abundance:'99,985%' },
    { name:'Дейтерий ²H (D)', protons:1, neutrons:1, color:'#8b5cf6', abundance:'0,015%' },
    { name:'Тритий ³H (T)', protons:1, neutrons:2, color:'#ef4444', abundance:'Следы' }
  ];

  function drawNucleus(cx, cy, protons, neutrons, size){
    const particles = [];
    for (let i=0; i<protons; i++) particles.push({type:'p', color:'#ef4444'});
    for (let i=0; i<neutrons; i++) particles.push({type:'n', color:'#64748b'});

    const glowR = size + particles.length * 4 + 6;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
    grad.addColorStop(0, 'rgba(239,68,68,.25)');
    grad.addColorStop(1, 'rgba(239,68,68,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI*2); ctx.fill();

    particles.forEach((p, i)=>{
      const angle = (i / particles.length) * Math.PI * 2 + progress * 0.8;
      const r = size * 0.5 + (i % 2) * size * 0.35;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      const pr = size * 0.32;

      ctx.beginPath(); ctx.arc(px+2, py+2, pr, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fill();

      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI*2);
      ctx.fillStyle = p.color; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

      if (p.type === 'p'){
        ctx.fillStyle = '#fff'; ctx.font = 'bold ' + (pr*1.1) + 'px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('+', px, py+1);
      } else {
        ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold ' + (pr*1.1) + 'px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('n', px, py+1);
      }
    });
  }

  function drawElectronOrbit(cx, cy, radius, angleOffset, scale){
    // Орбита (пунктирный круг)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(6,182,212,.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Электрон
    const angle = progress * 2 + angleOffset;
    const ex = cx + Math.cos(angle) * radius;
    const ey = cy + Math.sin(angle) * radius;
    const er = 7 * scale;

    // Свечение электрона
    const eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, er * 2.5);
    eGrad.addColorStop(0, 'rgba(6,182,212,.6)');
    eGrad.addColorStop(1, 'rgba(6,182,212,0)');
    ctx.fillStyle = eGrad;
    ctx.beginPath(); ctx.arc(ex, ey, er * 2.5, 0, Math.PI*2); ctx.fill();

    // Электрон
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI*2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();

    // Знак минус
    ctx.fillStyle = '#fff'; ctx.font = 'bold ' + (er*0.9) + 'px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('–', ex, ey+1);
  }

  function drawIsotope(iso, cx, cy, scale){
    const size = 50 * scale;

    // Название
    ctx.font = 'bold ' + (16*scale) + 'px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = iso.color;
    ctx.fillText(iso.name, cx, 40*scale);

    // Электронная орбита (1s)
    const orbitR = 110 * scale;
    drawElectronOrbit(cx, cy, orbitR, 0, scale);

    // Ядро
    drawNucleus(cx, cy, iso.protons, iso.neutrons, size);

    // Подпись состава
    ctx.font = 'bold ' + (13*scale) + 'px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${iso.protons} протон, ${iso.neutrons} нейтрон${iso.neutrons !== 1 ? 'а' : ''}, 1 электрон`, cx, cy + 135*scale);

    // Распространённость
    ctx.font = (11*scale) + 'px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`В природе: ${iso.abundance}`, cx, cy + 155*scale);
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,W,H);

    if (stepMode === 0){
      const spacing = W / 3;
      isotopes.forEach((iso, idx)=>{
        const cx = spacing * (idx + 0.5);
        const cy = H/2 - 30;
        drawIsotope(iso, cx, cy, 0.85);
      });

      if (progress > 0.7){
        ctx.font = 'bold 15px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('У всех трёх — 1 протон, 1 электрон. Это изотопы водорода.', W/2, H - 15);
      }
    } else {
      const iso = isotopes[stepMode - 1];
      const cx = W/2;
      const cy = H/2 - 30;
      drawIsotope(iso, cx, cy, 1.3);

      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = iso.color;
      ctx.fillText(`Изотоп водорода: ${iso.name}`, W/2, H - 20);
    }
  }

  function loop(){
    if (!running) return;
    progress += 0.012;
    if (progress >= 1){ progress = 1; running = false; btn.textContent = '▶ Показать три изотопа водорода'; }
    draw();
    if (running) rafId = requestAnimationFrame(loop);
  }

  btn.addEventListener('click',()=>{
    if (running){ running = false; btn.textContent = '▶ Продолжить'; return; }
    if (progress >= 1) progress = 0;
    stepMode = 0;
    running = true; btn.textContent = '⏸ Пауза'; loop();
  });

  stepBtn.addEventListener('click',()=>{
    stepMode = stepMode >= 3 ? 1 : stepMode + 1;
    progress = 1;
    draw();
    btn.textContent = '▶ Показать три изотопа водорода';
    running = false;
    stepBtn.textContent = stepMode === 0 ? '🔍 Показать по одному' :
      stepMode === 1 ? '🔍 Протий →' :
      stepMode === 2 ? '🔍 Дейтерий →' : '🔍 Тритий →';
  });

  draw();
})();

/* ============================================================
   ТАЙМЛАЙН ЭЛЕМЕНТОВ
   ============================================================ */
(function(){
  const track = document.getElementById('elemTimelineTrack');
  const detail = document.getElementById('elemTlDetail');
  if (!track) return;

  const EVENTS = [
    { year:'1661', who:'Роберт Бойль', what:'Понятие химического элемента', title:'1661 · Роберт Бойль',
      text:'Бойль предложил определение химического элемента как вещества, которое нельзя разложить на более простые части химическими методами. Это был важный шаг от алхимии к настоящей химии. Бойль также ввёл в науку принцип скептицизма: не принимать ничего на веру без экспериментальной проверки.' },
    { year:'1789', who:'Антуан Лавуазье', what:'Первый список элементов', title:'1789 · Антуан Лавуазье',
      text:'Лавуазье опубликовал первый научный список химических элементов. Он включил в него 33 вещества, из которых более 20 действительно являются элементами. Лавуазье также дал элементам современные названия и показал, что при химических реакциях масса веществ сохраняется. Именно он превратил химию в точную науку.' },
    { year:'1803', who:'Джон Дальтон', what:'Атомная теория', title:'1803 · Джон Дальтон',
      text:'Дальтон предложил атомную теорию: все атомы одного элемента одинаковы по массе и свойствам, а разных — разные. Это связало понятие элемента с конкретными атомами. Дальтон также ввёл первые символы элементов и таблицу атомных масс, хотя его символы были неудобными — каждый элемент обозначался особым значком.' },
    { year:'1869', who:'Дмитрий Менделеев', what:'Периодическая таблица', title:'1869 · Дмитрий Менделеев',
      text:'Менделеев расположил элементы в порядке возрастания атомных масс и обнаружил периодический закон. Его таблица предсказала существование ещё не открытых элементов и стала основой современной химии. Периодический закон показал, что элементы связаны между собой, и это окончательно укрепило понятие химического элемента.' }
  ];

  track.innerHTML = EVENTS.map((e,i)=>`
    <div class="tl-year${i===0?' active':''}" data-i="${i}">
      <div class="tl-num">${e.year}</div>
      <div class="tl-who">${e.who}</div>
      <div class="tl-what">${e.what}</div>
    </div>`).join('');

  function show(i){
    document.querySelectorAll('#elemTimelineTrack .tl-year').forEach(el=>el.classList.remove('active'));
    track.querySelector(`[data-i="${i}"]`).classList.add('active');
    const e = EVENTS[i];
    detail.classList.add('show');
    detail.innerHTML = `<div class="tl-d-title">${e.title}</div><div class="tl-d-text">${e.text}</div>`;
  }

  track.querySelectorAll('.tl-year').forEach(el=>el.addEventListener('click',()=>show(+el.dataset.i)));
  show(0);
})();

/* ============================================================
   ТАЙМЛАЙН ЯЗЫКА ХИМИИ
   ============================================================ */
