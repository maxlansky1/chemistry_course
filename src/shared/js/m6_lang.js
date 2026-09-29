// ============================================================
//  module_6 (4б) — lang
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
  const track = document.getElementById('langTimelineTrack');
  const detail = document.getElementById('langTlDetail');
  if (!track) return;

  const EVENTS = [
    { year:'1803', who:'Джон Дальтон', what:'Первые символы элементов', title:'1803 · Джон Дальтон',
      text:'Дальтон предложил обозначать каждый элемент особым значком: кислород — кружком, водород — кружком с точкой. Состав соединения он изображал соположением значков. Но значков становилось слишком много, и записывать формулы становилось неудобно.' },
    { year:'1813', who:'Йёнс Якоб Берцелиус', what:'Буквенные символы и индексы', title:'1813 · Йёнс Якоб Берцелиус',
      text:'Берцелиус предложил гениально простую систему: обозначать элементы первыми буквами латинских названий (H — Hydrogenium, O — Oxygenium), а число атомов записывать цифрой после буквы. Так вода стала H₂O. Эта система оказалась настолько удобной, что используется до сих пор.' },
    { year:'1814', who:'Берцелиус', what:'Первая таблица атомных масс', title:'1814 · Таблица атомных масс',
      text:'Берцелиус опубликовал первую таблицу атомных масс, проанализировав 2000 соединений, образованных 43 элементами. Это была титаническая работа, подтвердившая атомную теорию. Точные атомные массы позволили химикам правильно записывать формулы.' },
    { year:'1860', who:'Конгресс в Карлсруэ', what:'Единая система формул', title:'1860 · Конгресс в Карлсруэ',
      text:'Химики разных стран собрались, чтобы договориться о единой системе обозначений. Система Берцелиуса победила — с тех пор все химики мира используют одни и те же символы и формулы. Это был первый международный стандарт в химии.' }
  ];

  track.innerHTML = EVENTS.map((e,i)=>`
    <div class="tl-year${i===0?' active':''}" data-i="${i}">
      <div class="tl-num">${e.year}</div>
      <div class="tl-who">${e.who}</div>
      <div class="tl-what">${e.what}</div>
    </div>`).join('');

  function show(i){
    document.querySelectorAll('#langTimelineTrack .tl-year').forEach(el=>el.classList.remove('active'));
    track.querySelector(`[data-i="${i}"]`).classList.add('active');
    const e = EVENTS[i];
    detail.classList.add('show');
    detail.innerHTML = `<div class="tl-d-title">${e.title}</div><div class="tl-d-text">${e.text}</div>`;
  }

  track.querySelectorAll('.tl-year').forEach(el=>el.addEventListener('click',()=>show(+el.dataset.i)));
  show(0);
})();

/* ============================================================
   ИГРА: ПРОСТОЕ ИЛИ СЛОЖНОЕ (РУССКИЕ НАЗВАНИЯ)
   ============================================================ */
