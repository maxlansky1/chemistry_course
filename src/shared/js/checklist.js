// ============================================================
//  ПРАВИЛА БЕЗОПАСНОСТИ (чек-лист)
// ============================================================
(function initSafetyChecklist() {
  const items = document.querySelectorAll('.safety-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
    });
  });
})();
