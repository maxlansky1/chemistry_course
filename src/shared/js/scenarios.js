// ============================================================
//  BRANCHING SCENARIOS (5 ситуаций)
// ============================================================
(function initScenarios() {
  const container = document.getElementById('scenariosContainer');
  if (!container) return;

  const SCENARIOS = [
    {
      situation: 'Ты случайно разбил пробирку с раствором соли. Осколки и лужа на столе.',
      actions: [
        'Соберу осколки руками',
        'Сообщу учителю и уберу осколки щёткой и совком в специальный контейнер',
        'Закопаю осколки в мусорное ведро',
        'Продолжу работу — это неважно'
      ],
      correct: 1,
      why: 'Осколки нельзя собирать руками — можно порезаться. Нужно сообщить учителю и убрать специальными инструментами.'
    },
    {
      situation: 'На кожу попала капля концентрированной серной кислоты.',
      actions: [
        'Сразу смою большим количеством воды',
        'Осторожно промокну сухой салфеткой, затем промою водой и сообщу учителю',
        'Нейтрализую уксусом',
        'Вытру рукавом и продолжу работу'
      ],
      correct: 1,
      why: 'Концентрированная серная кислота с водой разогревается — ожог станет хуже. Сначала снимаем кислоту насухо салфеткой и только потом промываем большим количеством воды. Разбавленные кислоты смывают водой сразу, но концентрированную — сначала насухо!'
    },
    {
      situation: 'Ты хочешь понюхать неизвестное вещество в колбе.',
      actions: [
        'Наклонюсь и вдохну прямо из сосуда',
        'Направлю пары ладонью к носу и осторожно понюхаю',
        'Понюхаю, но закрою один глаз',
        'Не буду нюхать, это запрещено правилами'
      ],
      correct: 1,
      why: 'Нюхать можно только осторожно, направляя пары ладонью. Наклоняться над сосудом и вдыхать напрямую — опасно.'
    },
    {
      situation: 'Ты закончил работу с реактивами.',
      actions: [
        'Уйду сразу — урок закончился',
        'Уберу всё на место и вымою руки',
        'Оставлю реактивы на столе — может ещё пригодятся',
        'Начну новую работу без уборки'
      ],
      correct: 1,
      why: 'После работы обязательно нужно убрать всё на место и вымыть руки — это правило безопасности.'
    },
    {
      situation: 'Учитель просит нагреть раствор в пробирке.',
      actions: [
        'Накрою пробирку рукой и подержу над пламенем',
        'Зажму пробирку держателем, направлю отверстие от себя и от соседей',
        'Нагрею пробирку, направив отверстие на соседа',
        'Откажусь — это опасно'
      ],
      correct: 1,
      why: 'Пробирку нужно держать специальным держателем и направлять отверстие от себя и соседей, чтобы брызги никого не обожгли.'
    }
  ];

  container.innerHTML = SCENARIOS.map((s, i) => `
    <div class="scenario-card" data-scenario="${i}">
      <div class="sc-header">
        <div class="sc-num">${i + 1}</div>
        <div class="sc-title">Ситуация ${i + 1}</div>
      </div>
      <div class="sc-situation">${s.situation}</div>
      <div class="scenario-actions">
        ${s.actions.map((a, j) => `
          <div class="scenario-action" data-sc="${i}" data-act="${j}">
            <span class="sa-marker">${String.fromCharCode(65 + j)}</span>
            <span>${a}</span>
          </div>
        `).join('')}
      </div>
      <div class="scenario-feedback" id="scfb-${i}"></div>
    </div>
  `).join('');

  const solved = new Set();
  let attempts = 0;

  function updateGate() {
    const gate = document.getElementById('safetyGate');
    const gateText = document.getElementById('safetyGateText');
    if (solved.size === SCENARIOS.length) {
      gate.classList.add('good');
      gateText.innerHTML = `🎉 <b>Пропуск получен!</b> Все ${SCENARIOS.length} ситуаций разобраны (попыток: ${attempts}). Можно идти дальше.`;
    } else {
      gate.classList.remove('good');
      gateText.innerHTML = `🔒 <b>Пропуск дальше:</b> разбери все ${SCENARIOS.length} ситуаций. Ошибаться можно — читай объяснение и пробуй снова. Разобрано: <b>${solved.size}/${SCENARIOS.length}</b> · попыток: ${attempts}.`;
    }
  }

  function resetCard(scIdx) {
    container.querySelectorAll(`[data-sc="${scIdx}"]`).forEach(a =>
      a.classList.remove('disabled', 'correct', 'wrong'));
    const fb = document.getElementById(`scfb-${scIdx}`);
    fb.classList.remove('show', 'ok', 'no');
    fb.innerHTML = '';
  }

  container.querySelectorAll('.scenario-action').forEach(act => {
    act.addEventListener('click', () => {
      const scIdx = parseInt(act.dataset.sc);
      const aIdx = parseInt(act.dataset.act);
      const s = SCENARIOS[scIdx];
      const actions = container.querySelectorAll(`[data-sc="${scIdx}"]`);
      const fb = document.getElementById(`scfb-${scIdx}`);
      if (fb.classList.contains('show')) return;

      attempts++;
      const isCorrect = aIdx === s.correct;
      actions.forEach(a => {
        a.classList.add('disabled');
        const idx = parseInt(a.dataset.act);
        if (idx === s.correct) a.classList.add('correct');
        if (idx === aIdx && !isCorrect) a.classList.add('wrong');
      });

      fb.classList.add('show', isCorrect ? 'ok' : 'no');
      if (isCorrect) {
        solved.add(scIdx);
        fb.innerHTML = `<b>✅ Правильно!</b> ${s.why}`;
      } else {
        fb.innerHTML = `<b>❌ Не совсем.</b> Правильный ответ выделен зелёным. ${s.why}<br><button class="retry-btn" data-retry="${scIdx}" style="margin-top:10px;">↺ Понял, пробую снова</button>`;
        fb.querySelector('[data-retry]').addEventListener('click', (e) => {
          e.stopPropagation();
          resetCard(scIdx);
          updateGate();
        });
      }
      updateGate();
    });
  });

  document.getElementById('retryScenarios').addEventListener('click', () => {
    solved.clear();
    attempts = 0;
    for (let i = 0; i < SCENARIOS.length; i++) resetCard(i);
    updateGate();
  });

  updateGate();
})();
