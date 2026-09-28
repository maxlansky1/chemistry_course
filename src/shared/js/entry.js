// ============================================================
//  РАЗОГРЕВ (5 вопросов без оценки)
// ============================================================
(function initEntryTest() {
  const container = document.getElementById('entryTestContainer');
  const resultBox = document.getElementById('entryResult');
  if (!container || !resultBox) return;

  const QUESTIONS = [
    {
      q: 'Что изучает химия?',
      options: ['Только живые организмы', 'Вещества, их свойства и превращения', 'Только звёзды и планеты', 'Только числа и формулы'],
      correct: 1,
      why: 'Химия — наука о веществах, их свойствах и превращениях.'
    },
    {
      q: 'Что из перечисленного — физическое тело?',
      options: ['Вода', 'Алюминий', 'Ложка', 'Кислород'],
      correct: 2,
      why: 'Ложка — физическое тело: у неё есть форма и объём. Вода, алюминий и кислород — это вещества.'
    },
    {
      q: 'Что такое вещество?',
      options: ['То, что имеет форму и объём', 'То, из чего состоят физические тела', 'То, что светит в темноте', 'То, что движется'],
      correct: 1,
      why: 'Вещество — то, из чего состоят тела. Форма и объём — признак тела, а не вещества.'
    },
    {
      q: 'Что НЕЛЬЗЯ делать в химической лаборатории?',
      options: ['Носить халат', 'Пробовать вещества на вкус', 'Мыть руки после работы', 'Слушать учителя'],
      correct: 1,
      why: 'Пробовать вещества на вкус категорически запрещено: даже «безобидное» вещество в лаборатории может быть опасным.'
    },
    {
      q: 'Что такое наблюдение?',
      options: [
        'Активное воздействие на вещество',
        'Внимательное изучение явления без вмешательства в процесс',
        'Измерение температуры',
        'Выдвижение предположения'
      ],
      correct: 1,
      why: 'Наблюдение — это когда мы смотрим на явление и замечаем, что происходит, не вмешиваясь в процесс.'
    }
  ];

  let correctCount = 0;
  let answered = 0;

  container.innerHTML = QUESTIONS.map((q, i) => `
    <div class="test-question">
      <div class="q-text"><span class="q-num">${i + 1}</span><span>${q.q}</span></div>
      <div class="test-options">
        ${q.options.map((o, j) => `
          <div class="test-option" data-q="${i}" data-o="${j}">
            <span class="opt-marker">${String.fromCharCode(65 + j)}</span>
            <span>${o}</span>
          </div>
        `).join('')}
      </div>
      <div class="explanation" id="entryExp-${i}"></div>
    </div>
  `).join('');

  container.querySelectorAll('.test-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const qIdx = parseInt(opt.dataset.q);
      const oIdx = parseInt(opt.dataset.o);
      const q = QUESTIONS[qIdx];
      const exp = document.getElementById(`entryExp-${qIdx}`);
      if (exp.classList.contains('show')) return;

      const isCorrect = oIdx === q.correct;
      container.querySelectorAll(`[data-q="${qIdx}"]`).forEach(o => {
        o.classList.add('disabled');
        const idx = parseInt(o.dataset.o);
        if (idx === q.correct) o.classList.add('correct');
        if (idx === oIdx && !isCorrect) o.classList.add('wrong');
      });
      exp.classList.add('show', isCorrect ? 'ok' : 'no');
      exp.innerHTML = `<b>${isCorrect ? '✅ Правильно!' : '❌ Не совсем.'}</b> ${q.why}`;

      if (isCorrect) correctCount++;
      answered++;

      if (answered === QUESTIONS.length) {
        resultBox.classList.add('show');
        resultBox.classList.add('mid');
        resultBox.innerHTML = `👍 <b>Разминка пройдена!</b> Правильных ответов: ${correctCount} из ${QUESTIONS.length}. Запомни вопросы, где ошибся, — ответы найдёшь в модуле. А теперь — за дело!`;
      }
    });
  });
})();
