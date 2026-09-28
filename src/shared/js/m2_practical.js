// ============================================================
//  ПРАКТИКУМ «ОЧИСТКА СОЛИ»
// ============================================================
(function initPracticalTask() {
  const container = document.getElementById('practicalTask');
  if (!container) return;

  const STEPS = [
    {
      situation: 'Тебе выдали загрязнённую соль (смесь соли и песка). С чего начать?',
      options: [
        'Нагреть смесь на огне',
        'Растворить смесь в воде',
        'Поднести магнит',
        'Оставить смесь отстаиваться'
      ],
      correct: 1,
      why: 'Правильно! Сначала нужно растворить смесь в воде: соль растворится, а песок — нет. Так мы разделим растворимый и нерастворимый компоненты.'
    },
    {
      situation: 'Соль растворилась, песок осел на дно. Что делать дальше?',
      options: [
        'Выпарить всю воду',
        'Отфильтровать смесь через фильтр',
        'Поднести магнит',
        'Долить ещё воды'
      ],
      correct: 1,
      why: 'Правильно! Нужно отфильтровать: песок останется на фильтре, а раствор соли пройдёт через него в стакан.'
    },
    {
      situation: 'Песок остался на фильтре. Что делать с чистым раствором соли?',
      options: [
        'Выбросить',
        'Выпарить воду',
        'Оставить отстаиваться',
        'Подвергнуть хроматографии'
      ],
      correct: 1,
      why: 'Правильно! Нужно выпарить воду. При нагревании вода испаряется, а соль остаётся на дне в виде кристаллов.'
    },
    {
      situation: 'Ты получил чистую соль. Что нужно сделать в конце?',
      options: [
        'Уйти сразу — урок закончился',
        'Убрать рабочее место, вымыть руки, записать наблюдения',
        'Оставить всё как есть',
        'Выбросить всё в мусор'
      ],
      correct: 1,
      why: 'Правильно! Настоящий химик записывает наблюдения и убирает рабочее место. Это правило безопасности и хорошая привычка учёного.'
    }
  ];

  let step = 0;
  let correctCount = 0;

  function render() {
    if (step >= STEPS.length) {
      const msg = correctCount === STEPS.length
        ? '🎉 Отлично! Ты настоящий юный химик!'
        : '👍 Хорошо! Ты прошёл практикум. Обрати внимание на объяснения — они помогут понять детали.';
      container.innerHTML = `
        <div class="callout callout-ok" style="margin-top:0;">
          <b>Практикум завершён!</b> ${msg} Правильных ответов: ${correctCount} из ${STEPS.length}.
        </div>
        <div style="text-align:center;margin-top:14px;">
          <button class="retry-btn" id="retryLab">↺ Пройти заново</button>
        </div>
      `;
      document.getElementById('retryLab').addEventListener('click', () => {
        step = 0; correctCount = 0; render();
      });
      return;
    }

    const s = STEPS[step];
    container.innerHTML = `
      <div style="background:linear-gradient(180deg,#f0f9ff,#fff);border:2px solid var(--border);border-radius:14px;padding:22px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--h-deep);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;">${step + 1}</div>
          <div style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--h-deep);">Шаг ${step + 1} из ${STEPS.length}</div>
        </div>
        <div style="font-size:16.5px;font-weight:700;margin-bottom:14px;line-height:1.6;">${s.situation}</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${s.options.map((o, i) => `
            <div class="test-option" data-i="${i}">
              <span class="opt-marker">${String.fromCharCode(65 + i)}</span>
              <span>${o}</span>
            </div>
          `).join('')}
        </div>
        <div class="explanation" id="labExp"></div>
      </div>
    `;

    container.querySelectorAll('.test-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const i = parseInt(opt.dataset.i);
        if (opt.classList.contains('disabled')) return;
        const isCorrect = i === s.correct;
        container.querySelectorAll('.test-option').forEach(o => {
          o.classList.add('disabled');
          const idx = parseInt(o.dataset.i);
          if (idx === s.correct) o.classList.add('correct');
          if (idx === i && !isCorrect) o.classList.add('wrong');
        });
        const exp = document.getElementById('labExp');
        exp.classList.add('show', isCorrect ? 'ok' : 'no');
        exp.innerHTML = `<b>${isCorrect ? '✅ Верно!' : '❌ Не совсем.'}</b> ${s.why}`;
        if (isCorrect) correctCount++;
        setTimeout(() => { step++; render(); }, 2200);
      });
    });
  }

  render();
})();
