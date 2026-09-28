// ============================================================
//  ПРАКТИЧЕСКОЕ ЗАДАНИЕ (тест)
// ============================================================
(function initPracticalTask() {
  const container = document.getElementById('practicalTask');
  if (!container) return;

  const QUESTIONS = [
    {
      plan: 'Цвет и блеск',
      q: 'Какого цвета медь и есть ли у неё блеск?',
      options: [
        'Белая, без блеска',
        'Рыжая (красноватая), есть металлический блеск',
        'Чёрная, без блеска',
        'Прозрачная, без блеска'
      ],
      correct: 1,
      why: 'Медь — рыжий металл с характерным металлическим блеском.'
    },
    {
      plan: 'Запах',
      q: 'Есть ли запах у чистой воды?',
      options: [
        'Резкий запах',
        'Сладкий запах',
        'Нет запаха',
        'Запах гари'
      ],
      correct: 2,
      why: 'Чистая вода не имеет запаха. Это одно из её свойств.'
    },
    {
      plan: 'Твёрдость',
      q: 'Какое из этих веществ самое твёрдое?',
      options: [
        'Воск',
        'Алмаз',
        'Стекло',
        'Дерево'
      ],
      correct: 1,
      why: 'Алмаз — самое твёрдое природное вещество. Он царапает стекло, а воск и дерево — нет.'
    },
    {
      plan: 'Растворимость',
      q: 'Какое вещество растворяется в воде?',
      options: [
        'Песок',
        'Мел',
        'Сахар',
        'Стекло'
      ],
      correct: 2,
      why: 'Сахар хорошо растворяется в воде. Песок, мел и стекло — не растворяются.'
    },
    {
      plan: 'Горючесть',
      q: 'Какое вещество горит?',
      options: [
        'Вода',
        'Песок',
        'Спирт',
        'Соль'
      ],
      correct: 2,
      why: 'Спирт — горючее вещество. Вода, песок и соль не горят.'
    }
  ];

  let correctCount = 0;
  let answered = 0;

  container.innerHTML = QUESTIONS.map((q, i) => `
    <div class="test-question">
      <div class="q-text"><span class="q-num">${i + 1}</span><span><b>${q.plan}.</b> ${q.q}</span></div>
      <div class="test-options">
        ${q.options.map((o, j) => `
          <div class="test-option" data-pq="${i}" data-po="${j}">
            <span class="opt-marker">${String.fromCharCode(65 + j)}</span>
            <span>${o}</span>
          </div>
        `).join('')}
      </div>
      <div class="explanation" id="pracExp-${i}"></div>
    </div>
  `).join('');

  container.querySelectorAll('.test-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const qIdx = parseInt(opt.dataset.pq);
      const oIdx = parseInt(opt.dataset.po);
      const q = QUESTIONS[qIdx];
      const exp = document.getElementById(`pracExp-${qIdx}`);
      if (exp.classList.contains('show')) return;

      const isCorrect = oIdx === q.correct;
      container.querySelectorAll(`[data-pq="${qIdx}"]`).forEach(o => {
        o.classList.add('disabled');
        const idx = parseInt(o.dataset.po);
        if (idx === q.correct) o.classList.add('correct');
        if (idx === oIdx && !isCorrect) o.classList.add('wrong');
      });
      exp.classList.add('show', isCorrect ? 'ok' : 'no');
      exp.innerHTML = `<b>${isCorrect ? '✅ Правильно!' : '❌ Не совсем.'}</b> ${q.why}`;

      if (isCorrect) correctCount++;
      answered++;

      if (answered === QUESTIONS.length) {
        const msg = correctCount >= 4
          ? '🎉 <b>Отлично!</b> Ты умеешь описывать вещества по плану.'
          : '👍 <b>Хорошо!</b> Но стоит ещё раз повторить свойства веществ.';
        const box = document.createElement('div');
        box.className = 'callout callout-ok';
        box.style.marginTop = '14px';
        box.innerHTML = `Правильных ответов: <b>${correctCount} из ${QUESTIONS.length}</b>. ${msg}`;
        container.appendChild(box);
      }
    });
  });
})();
