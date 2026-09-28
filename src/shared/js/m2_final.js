// ============================================================
//  ИТОГОВЫЙ ТЕСТ (15 вопросов, порог 80%)
// ============================================================
const TEST_QUESTIONS = [
  {
    q: 'Какие три агрегатных состояния вещества мы изучаем в базовом курсе?',
    options: [
      'Твёрдое, жидкое, газообразное',
      'Твёрдое, плазма, жидкое',
      'Жидкое, газообразное, конденсат',
      'Только твёрдое и жидкое'
    ],
    correct: 0,
    why: 'В базовом курсе мы изучаем три основных агрегатных состояния: твёрдое, жидкое и газообразное.'
  },
  {
    q: 'Что происходит с частицами вещества при переходе из твёрдого состояния в жидкое?',
    options: [
      'Частицы исчезают',
      'Частицы начинают двигаться свободнее и разрушают часть связей',
      'Частицы превращаются в другие частицы',
      'Ничего не меняется'
    ],
    correct: 1,
    why: 'При плавлении частицы начинают двигаться свободнее: связи между ними частично разрушаются. Вещество остаётся тем же — меняется только его состояние.'
  },
  {
    q: 'Что такое плавление?',
    options: [
      'Переход из жидкого в газообразное',
      'Переход из твёрдого в жидкое',
      'Переход из газообразного в твёрдое',
      'Переход из жидкого в твёрдое'
    ],
    correct: 1,
    why: 'Плавление — переход из твёрдого состояния в жидкое. Пример: таяние льда при 0 °C.'
  },
  {
    q: 'Как называется переход вещества из газообразного состояния в жидкое?',
    options: ['Испарение', 'Конденсация', 'Сублимация', 'Кристаллизация'],
    correct: 1,
    why: 'Конденсация — переход из газа в жидкость. Пример: пар оседает каплями на холодном стекле.'
  },
  {
    q: 'Что такое сублимация?',
    options: [
      'Переход из твёрдого в газ, минуя жидкое',
      'Переход из газа в твёрдое',
      'Переход из жидкого в твёрдое',
      'Переход из твёрдого в жидкое'
    ],
    correct: 0,
    why: 'Сублимация (возгонка) — переход из твёрдого состояния сразу в газообразное, минуя жидкое. Пример: сухой лёд, нафталин.'
  },
  {
    q: 'Почему на графике нагрева воды есть горизонтальные участки (плато)?',
    options: [
      'Потому что вода остывает',
      'Потому что температура не меняется: энергия уходит на разрушение связей между частицами',
      'Потому что вода испаряется',
      'Это ошибка графика'
    ],
    correct: 1,
    why: 'На плато температура не меняется: вся подводимая энергия уходит на разрушение связей между частицами (при плавлении или кипении), а не на нагрев.'
  },
  {
    q: 'Что такое чистое вещество?',
    options: [
      'Любое вещество, которое выглядит однородным',
      'Вещество, состоящее из частиц одного вида',
      'Вещество, которое не встречается в природе',
      'Вещество без цвета и запаха'
    ],
    correct: 1,
    why: 'Чистое вещество состоит из частиц одного вида и имеет постоянные свойства. Внешний вид обманчив: прозрачная вода из крана — это смесь.'
  },
  {
    q: 'Что такое смесь?',
    options: [
      'То же самое, что чистое вещество',
      'Вещество, состоящее из двух или более разных компонентов',
      'Только жидкость с твёрдыми частицами',
      'Вещество, полученное в лаборатории'
    ],
    correct: 1,
    why: 'Смесь состоит из двух или более разных веществ, которые можно разделить физическими способами. Примеры: воздух, морская вода, молоко, гранит.'
  },
  {
    q: 'Воздух — это…',
    options: [
      'Чистое вещество',
      'Гомогенная смесь газов',
      'Гетерогенная смесь газов',
      'Химическое соединение'
    ],
    correct: 1,
    why: 'Воздух — это однородная (гомогенная) смесь газов: азота, кислорода, аргона, углекислого газа и других. Компоненты невозможно различить глазом.'
  },
  {
    q: 'Что такое гетерогенная смесь?',
    options: [
      'Смесь, компоненты которой не видны глазом',
      'Смесь, в которой видны границы между компонентами',
      'Смесь двух газов',
      'Смесь двух жидкостей, полностью растворённых друг в друге'
    ],
    correct: 1,
    why: 'В гетерогенной (неоднородной) смеси компоненты видны и имеют границы раздела. Примеры: песок в воде, молоко, гранит, дым.'
  },
  {
    q: 'Каким способом можно разделить смесь песка и воды?',
    options: ['Выпариванием', 'Фильтрованием', 'Дистилляцией', 'Магнитом'],
    correct: 1,
    why: 'Песок не растворяется в воде, поэтому его можно отделить фильтрованием: вода проходит через фильтр, а песок остаётся на нём.'
  },
  {
    q: 'Каким способом можно получить соль из морской воды?',
    options: ['Фильтрованием', 'Отстаиванием', 'Выпариванием', 'Магнитом'],
    correct: 2,
    why: 'Соль растворена в воде. Если воду выпарить, соль останется на дне в виде кристаллов. Именно так добывают соль из морской воды.'
  },
  {
    q: 'Что используют для разделения смеси железных опилок и серы?',
    options: ['Воду', 'Магнит', 'Фильтр', 'Огонь'],
    correct: 1,
    why: 'Железо обладает магнитными свойствами, а сера — нет. Магнит притянет железные опилки, а сера останется.'
  },
  {
    q: 'Каким способом разделяют смесь спирта и воды?',
    options: ['Отстаиванием', 'Выпариванием', 'Дистилляцией', 'Фильтрованием'],
    correct: 2,
    why: 'Спирт кипит при 78 °C, а вода — при 100 °C. Если нагреть смесь, спирт испарится первым. Такой способ разделения жидкостей называется дистилляцией (перегонкой).'
  },
  {
    q: 'При разделении смеси физическими способами…',
    options: [
      'Образуются новые вещества',
      'Вещества остаются теми же, что и были',
      'Одно вещество обязательно исчезает',
      'Происходит химическая реакция'
    ],
    correct: 1,
    why: 'При физическом разделении смеси никаких новых веществ не образуется. Мы просто используем различия в свойствах компонентов: растворимость, температуру кипения, магнитные свойства и т.д.'
  }
];

(function renderTest() {
  const container = document.getElementById('testContainer');
  const scoreBox = document.getElementById('testScore');
  const retryBox = document.getElementById('retryBox');
  if (!container) return;

  const TOTAL = TEST_QUESTIONS.length;
  const THRESHOLD = Math.ceil(TOTAL * 0.8);

  function renderAll() {
    let answered = 0;
    let correctCount = 0;
    container.innerHTML = '';
    retryBox.innerHTML = '';
    scoreBox.classList.remove('good', 'mid', 'bad');
    scoreBox.innerHTML = `Правильных ответов: <span id="scoreNum">0</span> из ${TOTAL}`;

    const WRONG_HEADERS = [
      '❌ Подумай ещё раз.', '❌ Будь внимательнее.', '❌ Давай разберёмся.',
      '❌ Почти! Но не совсем так.', '❌ Есть над чем подумать.',
      '❌ Не спеши, посмотри ещё раз.', '❌ Хм, не то. Попробуй снова.'
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

          retryBox.innerHTML = `<button class="retry-btn" id="retryTest">↺ Пройти тест заново</button>`;
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
