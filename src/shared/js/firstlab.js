// ============================================================
//  ВИРТУАЛЬНАЯ ЛАБОРАТОРИЯ «ПЕРВОЕ НАБЛЮДЕНИЕ»
// ============================================================
(function initFirstLab() {
  const container = document.getElementById('labScenario');
  if (!container) return;

  const STEPS = [
    {
      situation: 'Опыт 1. Стакан с прозрачной жидкостью. Можно ли сказать, что это вода?',
      options: [
        'Да: прозрачная — значит, вода',
        'Нет: прозрачных жидкостей много, нужен ещё хотя бы один признак',
        'Да, если ничем не пахнет',
        'Нет: это точно кислота'
      ],
      correct: 1,
      why: 'Один признак — не вывод. Прозрачные: вода, спирт, уксус, раствор соли. Учёный всегда требует второе независимое подтверждение.'
    },
    {
      situation: 'Опыт 2. Два белых порошка без подписей: соль и сахар. Пробовать запрещено. Как различить?',
      options: [
        'Никак — они одинаковые',
        'Нагреть по щепотке: сахар потемнеет и запахнет карамелью, соль — нет',
        'Понюхать: соль пахнет сильнее',
        'Потрясти: соль звенит'
      ],
      correct: 1,
      why: 'Разные вещества по-разному переносят нагревание: сахар плавится и разлагается (карамелизуется), соль выдерживает. Это уже использование свойства как инструмента.'
    },
    {
      situation: 'Опыт 3. Две капли на бумаге: вода и подсолнечное масло. Через 10 минут пятно воды исчезло, масла — осталось. Вывод?',
      options: [
        'Масло впиталось в бумагу навсегда, а вода — нет',
        'Вода испарилась (летучая), масло — нет; по скорости исчезновения судят о летучести',
        'Бумага съела воду',
        'Масло тяжелее, поэтому осталось'
      ],
      correct: 1,
      why: 'Исчезновение пятна — испарение. Разная скорость исчезновения = разная летучесть. Так из простого наблюдения рождается измеримое свойство.'
    },
    {
      situation: 'Опыт 4. Железный гвоздь заржавел: цвет, прочность и масса изменились, а предмет вроде тот же. Новое вещество или нет?',
      options: [
        'То же вещество — ведь гвоздь остался гвоздём',
        'Новое вещество: свойства изменились необратимо — это признак превращения',
        'Новое вещество, только если гвоздь сломался',
        'Нельзя сказать без микроскопа'
      ],
      correct: 1,
      why: 'Критерий — свойства, а не форма. Ржавчина — новое вещество с другими свойствами. Необратимое изменение свойств = химическое превращение (подробно — в Модуле 3).'
    },
    {
      situation: 'Опыт 5. Спор: «сахар исчез» против «сахар спрятался». Какой опыт рассудит?',
      options: [
        'Попробовать воду: сладкая — значит, сахар там',
        'Взвесить стакан до и после: масса сохранилась — значит, сахар никуда не делся',
        'Подождать: если сахар не всплывёт — он исчез',
        'Спор неразрешим — оба правы'
      ],
      correct: 1,
      why: 'Взвешивание — решающий опыт: масса сохранилась, значит, сахар в стакане. Сохранение массы при превращениях — великий закон (Модуль 3б). Вкус подтверждает, но весы — доказывают.'
    }
  ];

  let step = 0;
  let correctCount = 0;

  function render() {
    if (step >= STEPS.length) {
      const msg = correctCount === STEPS.length
        ? '🎉 Отлично! Ты настоящий юный исследователь!'
        : '👍 Хорошо! Ты прошёл лабораторию. Обрати внимание на объяснения — они помогут понять детали.';
      container.innerHTML = `
        <div class="callout callout-ok" style="margin-top:0;">
          <b>Лаборатория завершена!</b> ${msg} Правильных ответов: ${correctCount} из ${STEPS.length}.
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
