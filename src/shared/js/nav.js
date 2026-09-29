// ============================================================
//  Навигация: триггер + выезжающий drawer + scroll-spy + «наверх»
//  Разметку (navTrigger/navDrawer/navBackdrop/toTop) рендерит билдер.
// ============================================================
(function () {
  const trigger = document.getElementById('navTrigger');
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navBackdrop');
  const toTop = document.getElementById('toTop');
  if (!trigger || !drawer) return;

  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    drawer.classList.add('open');
    requestAnimationFrame(function () { backdrop.classList.add('show'); });
    drawer.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    const first = drawer.querySelector('a, button');
    if (first) first.focus();
    document.addEventListener('keydown', onKey);
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    window.setTimeout(function () { backdrop.hidden = true; }, reduce ? 0 : 300);
    drawer.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') { closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    const f = drawer.querySelectorAll('a, button');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  trigger.addEventListener('click', function () {
    if (drawer.classList.contains('open')) closeDrawer(); else openDrawer();
  });
  backdrop.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeDrawer();
  });

  // Scroll-spy: подсвечиваем активный подраздел
  const subs = Array.prototype.slice.call(drawer.querySelectorAll('a.nav-sub'));
  if (subs.length && 'IntersectionObserver' in window) {
    const byId = {};
    subs.forEach(function (a) {
      const href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') byId[href.slice(1)] = a;
    });
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        subs.forEach(function (a) { a.classList.remove('nav-active'); });
        const a = byId[en.target.id];
        if (a) a.classList.add('nav-active');
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    Object.keys(byId).forEach(function (id) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // Кнопка «Наверх»
  if (toTop) {
    const onScroll = function () { toTop.hidden = window.scrollY < 600; };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();
