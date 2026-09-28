// ============================================================
//  ИТОГОВЫЙ ТЕСТ (15 вопросов, порог 80%)
// ============================================================
const TEST_QUESTIONS = [
  {
    q: 'Что изучает химия?',
    options: ['Только живые организмы', 'Вещества, их свойства и превращения', 'Только звёзды и планеты', 'Только числа и формулы'],
    correct: 1,
    why: 'Химия — наука о веществах, их свойствах и превращениях. Живые организмы изучает биология, небесные тела — астрономия, числа — математика.'
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
    q: 'Какой метод познания предполагает активное воздействие на объект?',
    options: ['Наблюдение', 'Эксперимент', 'Размышление', 'Чтение учебника'],
    correct: 1,
    why: 'Эксперимент — это активное воздействие на вещество с целью проверки гипотезы. Наблюдение — пассивно.'
  },
  {
    q: 'Что такое научная модель?',
    options: [
      'Точная копия объекта',
      'Упрощённое представление объекта, помогающее его понять',
      'То же самое, что эксперимент',
      'То же самое, что гипотеза'
    ],
    correct: 1,
    why: 'Модель — упрощённое описание объекта. Она не копирует реальность, но помогает понять её и предсказать свойства.'
  },
  {
    q: 'Что такое гипотеза?',
    options: [
      'Доказанное знание',
      'Предположение, которое нужно проверить',
      'Результат эксперимента',
      'Прибор для опытов'
    ],
    correct: 1,
    why: 'Гипотеза — это разумное предположение, которое проверяется экспериментом. Пока гипотеза не доказана — она остаётся догадкой.'
  },
  {
    q: 'Сколько примерно воды в организме человека?',
    options: ['10%', '30%', '70%', '99%'],
    correct: 2,
    why: 'Организм человека примерно на 60–70% состоит из воды. Она нужна для работы клеток, крови, пищеварения и терморегуляции.'
  },
  {
    q: 'Какой элемент преобладает в организме человека по массе?',
    options: ['Углерод', 'Водород', 'Кислород', 'Азот'],
    correct: 2,
    why: 'Кислород — самый «массивный» элемент тела: около 65% массы. Он входит в состав воды и множества органических веществ.'
  },
  {
    q: 'Что НЕЛЬЗЯ делать в химической лаборатории?',
    options: ['Носить халат', 'Пробовать вещества на вкус', 'Мыть руки после работы', 'Слушать учителя'],
    correct: 1,
    why: 'Пробовать вещества на вкус категорически запрещено: даже «безобидное» вещество в лаборатории может быть опасным.'
  },
  {
    q: 'Для чего нужна мензурка?',
    options: ['Для нагревания', 'Для измерения объёма жидкости', 'Для взвешивания', 'Для фильтрования'],
    correct: 1,
    why: 'Мензурка — стеклянный цилиндр с делениями, предназначенный для измерения объёма жидкостей.'
  },
  {
    q: 'Что нужно сделать в первую очередь, если разбил пробирку?',
    options: [
      'Собрать осколки руками',
      'Сообщить учителю и убрать осколки щёткой и совком',
      'Продолжить работу как ни в чём не бывало',
      'Спрятать осколки в парту'
    ],
    correct: 1,
    why: 'Осколки нельзя трогать руками — можно порезаться. Сообщаем учителю и убираем специальными инструментами.'
  },
  {
    q: 'Зачем человечеству нужна химия?',
    options: ['Только чтобы сдавать экзамены', 'Чтобы понимать мир и решать важные задачи: здоровье, еду, материалы, энергию', 'Только чтобы зарабатывать деньги', 'Она не нужна'],
    correct: 1,
    why: 'Химия помогает решать ключевые задачи человечества: лечить болезни, кормить людей, создавать материалы, добывать энергию и защищать природу.'
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
  },
  {
    q: 'Какой прибор нужен для измерения массы вещества?',
    options: ['Мензурка', 'Термометр', 'Весы', 'Воронка'],
    correct: 2,
    why: 'Весы — прибор для измерения массы. Мензурка — для объёма, термометр — для температуры, воронка — для фильтрования.'
  },
  {
    q: 'Что из перечисленного — свойство вещества?',
    options: [
      'То, что тело имеет форму',
      'Цвет, запах, твёрдость, горючесть',
      'То, что тело занимает место',
      'То, что тело можно потрогать'
    ],
    correct: 1,
    why: 'Цвет, запах, твёрдость, горючесть, растворимость — это свойства вещества. Форма, объём и возможность потрогать — это признаки тела.'
  }
];

(function renderTest() {
  const container = document.getElementById('testContainer');
  const scoreBox = document.getElementById('testScore');
  const retryBox = document.getElementById('retryBox');
  if (!container) return;

  const TOTAL = TEST_QUESTIONS.length;
  const THRESHOLD = Math.ceil(TOTAL * 0.8);

  let answered = 0;
  let correctCount = 0;
  let questionStates = new Array(TOTAL).fill(null);

  function renderAll() {
    answered = 0;
    correctCount = 0;
    container.innerHTML = '';
    retryBox.innerHTML = '';
    scoreBox.classList.remove('good', 'mid', 'bad');
    scoreBox.innerHTML = `Правильных ответов: <span id="scoreNum">0</span> из ${TOTAL}`;

    const WRONG_HEADERS = [
      '❌ Подумай ещё раз.',
      '❌ Будь внимательнее.',
      '❌ Давай разберёмся.',
      '❌ Почти! Но не совсем так.',
      '❌ Есть над чем подумать.',
      '❌ Не спеши, посмотри ещё раз.',
      '❌ Хм, не то. Попробуй снова.'
    ];

    TEST_QUESTIONS.forEach((q, i) => {
      const block = document.createElement('div');
      block.className = 'test-question';
      block.innerHTML = `
        <div class="q-text"><span class="q-num">${i+1}</span><span>${q.q}</span></div>
        <div class="test-options">
          ${q.options.map((opt, j) => `
            <div class="test-option" data-q="${i}" data-opt="${j}">
              <span class="opt-marker">${String.fromCharCode(65+j)}</span>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>
        <div class="explanation" id="exp-${i}"></div>
      `;
      container.appendChild(block);
    });

    container.querySelectorAll('.test-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const qIdx = parseInt(opt.dataset.q);
        const oIdx = parseInt(opt.dataset.opt);
        const question = TEST_QUESTIONS[qIdx];
        const options = container.querySelectorAll(`[data-q="${qIdx}"]`);
        const exp = document.getElementById(`exp-${qIdx}`);

        if (exp.classList.contains('show')) return;

        const isCorrect = (oIdx === question.correct);

        options.forEach(o => {
          o.classList.add('disabled');
          const idx = parseInt(o.dataset.opt);
          if (idx === question.correct) o.classList.add('correct');
          if (idx === oIdx && !isCorrect) o.classList.add('wrong');
        });

        exp.classList.add('show');
        exp.classList.add(isCorrect ? 'ok' : 'no');

        if (isCorrect) {
          correctCount++;
          exp.innerHTML = `<b>✅ Правильно!</b> ${question.why}`;
        } else {
          const header = WRONG_HEADERS[Math.floor(Math.random() * WRONG_HEADERS.length)];
          exp.innerHTML = `<b>${header}</b> Правильный ответ выделен зелёным. ${question.why}`;
        }

        answered++;
        const scoreNum = document.getElementById('scoreNum');
        if (scoreNum) scoreNum.textContent = correctCount;

        if (answered === TOTAL) {
          scoreBox.classList.remove('good', 'mid', 'bad');
          if (correctCount >= THRESHOLD) {
            scoreBox.classList.add('good');
            scoreBox.innerHTML = `🎉 <b>Модуль пройден!</b> ${correctCount} из ${TOTAL} (порог: ${THRESHOLD}).`;
          } else if (correctCount >= Math.ceil(TOTAL * 0.6)) {
            scoreBox.classList.add('mid');
            scoreBox.innerHTML = `👍 <b>Почти получилось!</b> ${correctCount} из ${TOTAL}. Порог — ${THRESHOLD}. Перечитай объяснения и попробуй снова.`;
          } else {
            scoreBox.classList.add('bad');
            scoreBox.innerHTML = `💪 <b>Есть над чем поработать:</b> ${correctCount} из ${TOTAL}. Перечитай модуль и попробуй снова.`;
          }

          retryBox.innerHTML = `
            <button class="retry-btn" id="retryTest">↺ Пройти тест заново</button>
          `;
          document.getElementById('retryTest').addEventListener('click', () => {
            renderAll();
            window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
          });
        } else {
          scoreBox.classList.remove('good', 'mid', 'bad');
          scoreBox.innerHTML = `Правильных ответов: <span id="scoreNum">${correctCount}</span> из ${TOTAL}`;
        }
      });
    });
  }

  renderAll();
})();
