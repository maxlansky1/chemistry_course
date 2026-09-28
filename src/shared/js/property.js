// ============================================================
//  СИМУЛЯТОР «ОПРЕДЕЛИ СВОЙСТВО»
// ============================================================
(function initPropertySimulator() {
  const container = document.getElementById('propertySimulator');
  if (!container) return;

  const QUESTIONS = [
    {
      substance: '🥉 Медь',
      question: 'Выбери правильное описание свойств меди:',
      options: [
        'Имеет резкий запах',
        'Рыжая, блестящая, хорошо проводит ток',
        'Белая, без запаха, не проводит ток',
        'Растворяется в воде с выделением тепла'
      ],
      correct: 1,
      why: 'Медь — рыжий металл с характерным блеском. Она хорошо проводит электрический ток, поэтому из неё делают провода.'
    },
    {
      substance: '🧴 Уксус',
      question: 'Выбери правильное описание свойств уксуса:',
      options: [
        'Бесцветная жидкость с резким запахом',
        'Твёрдое вещество жёлтого цвета',
        'Газ без цвета и запаха',
        'Металл, блестящий и твёрдый'
      ],
      correct: 0,
      why: 'Уксус — это бесцветная жидкость с очень резким запахом. Именно запах — его главное отличительное свойство.'
    },
    {
      substance: '🍬 Сахар',
      question: 'Выбери правильное описание свойств сахара:',
      options: [
        'Твёрдое, сладкое на вкус, растворяется в воде',
        'Жидкость с горьким вкусом',
        'Газ с запахом',
        'Металл'
      ],
      correct: 0,
      why: 'Сахар — твёрдое кристаллическое вещество, сладкое на вкус, хорошо растворяется в воде.'
    },
    {
      substance: '⚫ Уголь',
      question: 'Выбери правильное описание свойств угля:',
      options: [
        'Белое твёрдое вещество',
        'Чёрное твёрдое вещество, горит',
        'Прозрачная жидкость',
        'Газ без запаха'
      ],
      correct: 1,
      why: 'Уголь — чёрное твёрдое вещество. Его главное свойство — горючесть: он хорошо горит и даёт тепло.'
    },
    {
      substance: '💧 Вода',
      question: 'Выбери правильное описание свойств воды:',
      options: [
        'Имеет резкий запах',
        'Прозрачная жидкость без запаха',
        'Жёлтая жидкость',
        'Твёрдое вещество'
      ],
      correct: 1,
      why: 'Вода — прозрачная жидкость без цвета и запаха. Это её главные свойства.'
    }
  ];

  let current = 0;
  let answered = 0;
  let correctCount = 0;

  function render() {
    if (current >= QUESTIONS.length) {
      const msg = correctCount >= 4
        ? '🎉 Отлично! Ты хорошо различаешь свойства веществ!'
        : correctCount >= 3
          ? '👍 Хорошо! Ещё немного практики — и будет отлично.'
          : '💪 Стоит повторить свойства веществ. Попробуй ещё раз!';
      container.innerHTML = `
        <div class="callout callout-ok" style="margin-top:0;">
          <b>Результат:</b> ${correctCount} из ${QUESTIONS.length}. ${msg}
        </div>
        <div style="text-align:center;margin-top:14px;">
          <button class="retry-btn" id="retryProperty">↺ Пройти заново</button>
        </div>
      `;
      document.getElementById('retryProperty').addEventListener('click', () => {
        current = 0; answered = 0; correctCount = 0;
        render();
      });
      return;
    }

    const q = QUESTIONS[current];
    container.innerHTML = `
      <div style="background:#fff;border:2px solid var(--border);border-radius:14px;padding:22px;">
        <div style="font-size:40px;text-align:center;margin-bottom:10px;">${q.substance}</div>
        <div style="font-size:16.5px;font-weight:800;margin-bottom:14px;">${q.question}</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${q.options.map((o, i) => `
            <div class="test-option" data-i="${i}">
              <span class="opt-marker">${String.fromCharCode(65 + i)}</span>
              <span>${o}</span>
            </div>
          `).join('')}
        </div>
        <div class="explanation" id="propExp"></div>
      </div>
      <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:14px;">
        Вопрос ${current + 1} из ${QUESTIONS.length}
      </div>
    `;

    container.querySelectorAll('.test-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const i = parseInt(opt.dataset.i);
        if (opt.classList.contains('disabled')) return;
        const isCorrect = i === q.correct;
        container.querySelectorAll('.test-option').forEach(o => {
          o.classList.add('disabled');
          const idx = parseInt(o.dataset.i);
          if (idx === q.correct) o.classList.add('correct');
          if (idx === i && !isCorrect) o.classList.add('wrong');
        });
        const exp = document.getElementById('propExp');
        exp.classList.add('show', isCorrect ? 'ok' : 'no');
        exp.innerHTML = `<b>${isCorrect ? '✅ Правильно!' : '❌ Не совсем.'}</b> ${q.why}`;
        if (isCorrect) correctCount++;
        answered++;
        setTimeout(() => { current++; render(); }, 1600);
      });
    });
  }

  render();
})();
