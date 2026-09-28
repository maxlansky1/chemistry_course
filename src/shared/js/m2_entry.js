// ============================================================
//  ВХОДНОЙ ТЕСТ МОДУЛЯ 2 (10 вопросов по Модулю 1, порог 80%)
// ============================================================
(function initEntryTest() {
  const container = document.getElementById('entryTestContainer');
  const resultBox = document.getElementById('entryResult');
  if (!container || !resultBox) return;

  const QUESTIONS = [
    {
      q: 'Что изучает химия?',
      options: [
        'Только живые организмы',
        'Вещества, их свойства и превращения',
        'Только звёзды',
        'Только числа'
      ],
      correct: 1,
      why: 'Химия — наука о веществах, их свойствах и превращениях.'
    },
    {
      q: 'Что из перечисленного — физическое тело?',
      options: [
        'Вода',
        'Кислород',
        'Колба',
        'Алюминий'
      ],
      correct: 2,
      why: 'Колба — тело (форма и объём). Остальное — вещества.'
    },
    {
      q: 'Что такое вещество?',
      options: [
        'То, что имеет форму',
        'То, из чего состоят тела',
        'То, что светится',
        'То, что движется'
      ],
      correct: 1,
      why: 'Вещество — то, из чего состоят тела.'
    },
    {
      q: 'Что из перечисленного — свойство вещества?',
      options: [
        'Ложка',
        'Прозрачность',
        'Стакан',
        'Пробирка'
      ],
      correct: 1,
      why: 'Прозрачность — свойство. Остальное — тела.'
    },
    {
      q: 'Что такое наблюдение?',
      options: [
        'Воздействие на вещество',
        'Изучение явления без вмешательства',
        'Измерение температуры',
        'Выдвижение гипотезы'
      ],
      correct: 1,
      why: 'Наблюдение — смотрим и замечаем, не вмешиваясь.'
    },
    {
      q: 'Что такое эксперимент?',
      options: [
        'Пассивное созерцание',
        'Активное воздействие на вещество',
        'Запись в тетрадь',
        'Чтение учебника'
      ],
      correct: 1,
      why: 'Эксперимент — воздействуем и смотрим, что будет.'
    },
    {
      q: 'Что НЕЛЬЗЯ делать в лаборатории?',
      options: [
        'Носить халат',
        'Пробовать вещества на вкус',
        'Мыть руки',
        'Слушать учителя'
      ],
      correct: 1,
      why: 'Пробовать на вкус запрещено всегда.'
    },
    {
      q: 'Разбил пробирку. Первое действие?',
      options: [
        'Собрать осколки руками',
        'Сообщить учителю, убрать щёткой и совком',
        'Продолжить работу',
        'Спрятать осколки'
      ],
      correct: 1,
      why: 'Руками — нельзя. Учителю сообщить, убрать инструментами.'
    },
    {
      q: 'Как правильно понюхать вещество?',
      options: [
        'Вдохнуть прямо из сосуда',
        'Направить пары ладонью к носу',
        'Наклониться над колбой',
        'Нюхать с закрытыми глазами'
      ],
      correct: 1,
      why: 'Только ладонью, осторожно. Наклоняться над сосудом опасно.'
    },
    {
      q: 'Что такое гипотеза?',
      options: [
        'Доказанное знание',
        'Догадка, которую нужно проверить',
        'Результат опыта',
        'Прибор'
      ],
      correct: 1,
      why: 'Гипотеза — предположение, требующее проверки.'
    }
  ];
  const THRESHOLD = 8;

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
        if (correctCount >= THRESHOLD) {
          resultBox.classList.add('good');
          resultBox.innerHTML = `🎉 <b>Готов!</b> ${correctCount} из ${QUESTIONS.length} — база Модуля 1 есть. Можно идти в Модуль 2.`;
        } else {
          resultBox.classList.add('mid');
          resultBox.innerHTML = `👍 ${correctCount} из ${QUESTIONS.length}. Стоит повторить Модуль 1 — без базы дальше будет трудно.`;
        }
      }
    });
  });
})();
