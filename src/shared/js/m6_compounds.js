// ============================================================
//  module_6 (4б) — compounds
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
  const pool = document.getElementById('structPool');
  const baskets = document.querySelectorAll('.dual-basket .basket');
  const fb = document.getElementById('fbStruct');
  const resetBtn = document.getElementById('resetStruct');
  if (!pool) return;

  const ITEMS = [
    { label:'Кислород', cat:'simple' },
    { label:'Вода', cat:'complex' },
    { label:'Железо', cat:'simple' },
    { label:'Углекислый газ', cat:'complex' },
    { label:'Азот', cat:'simple' },
    { label:'Метан', cat:'complex' },
    { label:'Золото', cat:'simple' },
    { label:'Аммиак', cat:'complex' },
    { label:'Озон', cat:'simple' },
    { label:'Поваренная соль', cat:'complex' }
  ];

  let selected = null;

  function buildPool(){
    pool.innerHTML = '';
    ITEMS.forEach(it=>{
      const el = document.createElement('div');
      el.className = 'pool-item';
      el.textContent = it.label;
      el.dataset.cat = it.cat;
      el.draggable = true;
      el.addEventListener('dragstart',(e)=>{ e.dataTransfer.setData('text/plain', it.label); selected = el; el.classList.add('dragging'); });
      el.addEventListener('dragend',()=>el.classList.remove('dragging'));
      el.addEventListener('click',()=>{
        if (el.classList.contains('placed')) return;
        pool.querySelectorAll('.pool-item').forEach(i=>i.classList.remove('selected'));
        if (selected === el){ selected = null; fb.textContent = ''; return; }
        selected = el; el.classList.add('selected');
        fb.style.color = 'var(--muted)';
        fb.textContent = 'Выбрано: ' + it.label + '. Теперь нажми на нужную корзину.';
      });
      pool.appendChild(el);
    });
  }

  function resetBaskets(){
    baskets.forEach(b=>{
      const items = b.querySelector('.basket-items');
      if (items) items.innerHTML = '';
      b.classList.remove('good','bad');
    });
  }

  function checkComplete(){
    if (pool.querySelectorAll('.pool-item').length === 0){
      fb.style.color = 'var(--green)';
      fb.textContent = '🎉 Отлично! Все вещества разложены правильно!';
    }
  }

  function tryPlace(item, basket){
    if (!item || !basket || item.classList.contains('placed')) return;
    const correct = item.dataset.cat === basket.dataset.cat;
    if (correct){
      const container = basket.querySelector('.basket-items');
      const chip = document.createElement('div');
      chip.className = 'basket-chip';
      chip.textContent = item.textContent;
      container.appendChild(chip);
      item.remove();
      selected = null;
      basket.classList.add('good');
      setTimeout(()=>basket.classList.remove('good'), 500);
      fb.style.color = 'var(--green)';
      const msgs = ['✅ Верно!','👍 Точно!','🎯 Правильно!','🌟 В точку!'];
      fb.textContent = msgs[Math.floor(Math.random()*msgs.length)];
      checkComplete();
    } else {
      basket.classList.add('bad');
      setTimeout(()=>basket.classList.remove('bad'), 500);
      item.classList.add('wrong-flash');
      setTimeout(()=>item.classList.remove('wrong-flash'), 600);
      fb.style.color = 'var(--red)';
      const bad = ['❌ Подумай ещё.','❌ Это не сюда.','❌ Почти! Попробуй снова.'];
      fb.textContent = bad[Math.floor(Math.random()*bad.length)];
    }
  }

  baskets.forEach(basket=>{
    basket.addEventListener('dragover',(e)=>{ e.preventDefault(); basket.classList.add('hover'); });
    basket.addEventListener('dragleave',()=>basket.classList.remove('hover'));
    basket.addEventListener('drop',(e)=>{ e.preventDefault(); basket.classList.remove('hover'); if (selected) tryPlace(selected, basket); });
    basket.addEventListener('click',()=>{ if (selected) tryPlace(selected, basket); });
  });

  resetBtn.addEventListener('click',()=>{
    resetBaskets(); buildPool(); selected = null; fb.textContent = '';
  });

  buildPool();
})();

/* ============================================================
   ИНТЕРАКТИВ: ОБРАЗОВАНИЕ H2 С ЭЛЕКТРОНАМИ И ОРБИТАМИ
   ============================================================ */

(function(){
  const container = document.getElementById('formulaExplorer');
  if (!container) return;

  const FORMULAS = [
    { formula:'H₂O', name:'Вода', quality:'Водород H + Кислород O', quantity:'2 атома H + 1 атом O' },
    { formula:'CO₂', name:'Углекислый газ', quality:'Углерод C + Кислород O', quantity:'1 атом C + 2 атома O' },
    { formula:'CH₄', name:'Метан', quality:'Углерод C + Водород H', quantity:'1 атом C + 4 атома H' },
    { formula:'NH₃', name:'Аммиак', quality:'Азот N + Водород H', quantity:'1 атом N + 3 атома H' },
    { formula:'H₂SO₄', name:'Серная кислота', quality:'Водород H + Сера S + Кислород O', quantity:'2 H + 1 S + 4 O' },
    { formula:'C₆H₁₂O₆', name:'Глюкоза', quality:'Углерод C + Водород H + Кислород O', quantity:'6 C + 12 H + 6 O' }
  ];

  let activeIdx = null;

  function render(){
    container.innerHTML = '';
    FORMULAS.forEach((f,i)=>{
      const card = document.createElement('div');
      card.style.cssText = 'background:#fff;border:2px solid ' + (activeIdx===i?'var(--accent)':'var(--border)') + ';border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .25s;';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:26px;font-weight:900;color:var(--accent);font-family:'Courier New',monospace;">${f.formula}</span>
          <span style="font-weight:700;color:var(--text);">${f.name}</span>
        </div>
      `;
      card.addEventListener('click',()=>{
        activeIdx = activeIdx === i ? null : i;
        render();
      });
      container.appendChild(card);

      if (activeIdx === i){
        const detail = document.createElement('div');
        detail.className = 'callout callout-ok';
        detail.style.marginTop = '8px';
        detail.innerHTML = `
          <b>Формула:</b> ${f.formula} — ${f.name}<br><br>
          <b>🔵 Качественный состав:</b> ${f.quality}<br>
          <b>🟣 Количественный состав:</b> ${f.quantity}
        `;
        container.appendChild(detail);
      }
    });
  }

  render();
})();

/* ============================================================
   ИТОГОВЫЙ ТЕСТ
   ============================================================ */
