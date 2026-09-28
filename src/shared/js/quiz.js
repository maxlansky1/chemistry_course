(function initQuizzes() {
  const islands = document.querySelectorAll('script[type="application/json"][id^="quiz-"]');
  if (!islands.length) return;

  const msgIsland = document.getElementById('messages');
  let MSG = {};
  try { MSG = msgIsland ? JSON.parse(msgIsland.textContent) : {}; } catch (e) { MSG = {}; }

  function pick(kind) {
    const arr = MSG[kind] || [];
    return arr.length ? arr[Math.floor(Math.random() * arr.length)] : '';
  }

  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  const PASS_RATIO = 0.8;
  const LETTERS = 'ABCDEFGH';

  islands.forEach((island) => {
    let data;
    try { data = JSON.parse(island.textContent); } catch (e) { return; }
    const targetId = data.target || island.id.replace(/-data$/, '');
    const host = document.getElementById(targetId);
    if (!host) return;
    const questions = data.questions || [];
    const config = data.config || host.dataset.config || 'practice';
    const threshold = data.threshold != null
      ? data.threshold
      : Math.ceil(questions.length * PASS_RATIO);

    const state = { answered: 0, correct: 0, wrong: [] };

    function render() {
      host.innerHTML = '';
      state.answered = 0;
      state.correct = 0;
      state.wrong = [];

      const score = document.createElement('div');
      score.className = 'test-score';
      score.textContent = 'Правильных ответов: 0 из ' + questions.length;
      host.appendChild(score);

      const ordered = data.shuffle === false
        ? questions.map((q, i) => ({ q: q, idx: i }))
        : shuffle(questions.map((q, i) => ({ q: q, idx: i })));

      ordered.forEach(({ q, idx }, displayIndex) => {
        const block = document.createElement('div');
        block.className = 'test-question';
        block.dataset.q = String(idx);
        block.innerHTML = '<div class="q-text"><span class="q-num">' +
          (displayIndex + 1) + '</span><span>' + q.q + '</span></div>' +
          '<div class="test-options"></div>' +
          '<div class="explanation" id="exp-' + island.id + '-' + idx + '"></div>';

        const optBox = block.querySelector('.test-options');
        if (q.type === 'match') {
          q.left.forEach((leftText, li) => {
            const row = document.createElement('div');
            row.className = 'test-option match-row';
            const opts = q.right.map((rt, ri) =>
              '<option value="' + ri + '">' + rt + '</option>').join('');
            row.innerHTML = '<span class="match-left">' + leftText + '</span>' +
              '<select class="match-select" data-left="' + li + '">' +
              '<option value="">—</option>' + opts + '</select>';
            optBox.appendChild(row);
          });
          const btn = document.createElement('button');
          btn.className = 'retry-btn';
          btn.type = 'button';
          btn.textContent = 'Проверить';
          btn.addEventListener('click', () => checkMatch(block, q, idx));
          optBox.appendChild(btn);
        } else {
          q.options.forEach((optText, oi) => {
            const opt = document.createElement('div');
            opt.className = 'test-option';
            opt.dataset.opt = String(oi);
            opt.innerHTML = '<span class="opt-marker">' +
              (q.type === 'multi' ? '☐' : LETTERS[oi]) +
              '</span><span>' + optText + '</span>';
            opt.addEventListener('click', () => {
              if (q.type === 'multi') {
                opt.classList.toggle('picked');
                return;
              }
              answerSingle(block, q, idx, oi);
            });
            optBox.appendChild(opt);
          });
          if (q.type === 'multi') {
            const btn = document.createElement('button');
            btn.className = 'retry-btn';
            btn.type = 'button';
            btn.textContent = 'Проверить';
            btn.addEventListener('click', () => checkMulti(block, q, idx));
            optBox.appendChild(btn);
          }
        }
        host.appendChild(block);
      });
    }

    function finish(block, exp, isCorrect, q) {
      block.querySelectorAll('.test-option').forEach((o) => o.classList.add('disabled'));
      block.querySelectorAll('button').forEach((b) => (b.disabled = true));
      exp.classList.add('show', isCorrect ? 'ok' : 'no');
      exp.innerHTML = '<b>' + (isCorrect ? '✅ Правильно!' : '❌ Не совсем.') +
        '</b> ' + (q.why || '');
      if (isCorrect) state.correct++; else state.wrong.push(q.q);
      state.answered++;
      const score = host.querySelector('.test-score');
      if (score) score.textContent = 'Правильных ответов: ' +
        state.correct + ' из ' + questions.length;
      if (state.answered === questions.length) summarize();
    }

    function answerSingle(block, q, idx, oi) {
      block.querySelectorAll('.test-option').forEach((o) => {
        const i = parseInt(o.dataset.opt, 10);
        if (i === q.correct) o.classList.add('correct');
        if (i === oi && oi !== q.correct) o.classList.add('wrong');
      });
      finish(block, document.getElementById('exp-' + island.id + '-' + idx),
        oi === q.correct, q);
    }

    function checkMulti(block, q, idx) {
      const picked = Array.from(block.querySelectorAll('.test-option.picked'))
        .map((o) => parseInt(o.dataset.opt, 10)).sort();
      const correct = q.correct.slice().sort();
      const ok = picked.length === correct.length &&
        picked.every((v, i) => v === correct[i]);
      block.querySelectorAll('.test-option').forEach((o) => {
        const i = parseInt(o.dataset.opt, 10);
        if (q.correct.indexOf(i) !== -1) o.classList.add('correct');
        else if (o.classList.contains('picked')) o.classList.add('wrong');
      });
      finish(block, document.getElementById('exp-' + island.id + '-' + idx), ok, q);
    }

    function checkMatch(block, q, idx) {
      let ok = true;
      block.querySelectorAll('.match-select').forEach((sel) => {
        const li = parseInt(sel.dataset.left, 10);
        const val = parseInt(sel.value, 10);
        if (val !== q.correct[li]) ok = false;
      });
      finish(block, document.getElementById('exp-' + island.id + '-' + idx), ok, q);
    }

    function summarize() {
      const box = document.createElement('div');
      const passed = state.correct >= threshold;
      let text;
      if (config === 'final') {
        text = passed ? pick('finalPass') : pick('finalFail');
      } else if (config === 'entry') {
        text = passed ? pick('practiceDone') : pick('entryFail');
      } else if (config === 'warmup') {
        text = pick('warmupDone');
      } else {
        text = pick('practiceDone');
      }
      box.className = 'callout ' + (passed ? 'callout-ok' : 'callout-warn');
      let html = text + ' <b>' + state.correct + ' из ' + questions.length + '</b>';
      if (state.wrong.length) {
        html += '<div class="recap-card quiz-errors"><b>Разбор ошибок:</b><ul>' +
          state.wrong.map((w) => '<li>' + w + '</li>').join('') + '</ul></div>';
      }
      box.innerHTML = html;
      const retry = document.createElement('button');
      retry.className = 'retry-btn';
      retry.type = 'button';
      retry.textContent = 'Пройти заново';
      retry.addEventListener('click', render);
      box.appendChild(retry);
      host.appendChild(box);
    }

    render();
  });
})();
