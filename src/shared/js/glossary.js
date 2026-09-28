(function initGlossary() {
  const island = document.getElementById('glossary');
  const terms = document.querySelectorAll('.term[data-term]');
  if (!island || !terms.length) return;

  let DATA = {};
  try { DATA = JSON.parse(island.textContent); } catch (e) { return; }

  const pop = document.createElement('div');
  pop.className = 'glossary-pop';
  pop.setAttribute('role', 'tooltip');
  pop.hidden = true;
  document.body.appendChild(pop);

  function hide() { pop.hidden = true; }

  terms.forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = DATA[el.dataset.term];
      if (!item) return;
      pop.textContent = item.definition;
      const r = el.getBoundingClientRect();
      pop.style.left = Math.max(8, Math.min(window.innerWidth - 280, r.left)) + 'px';
      pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
      pop.hidden = false;
    });
  });

  document.addEventListener('click', hide);
  window.addEventListener('scroll', hide, { passive: true });
})();
