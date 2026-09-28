// ============================================================
//  СПОСОБЫ РАЗДЕЛЕНИЯ — раскрывающиеся карточки
// ============================================================
(function initSeparationCards() {
  const cards = document.querySelectorAll('.method-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      cards.forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    });
  });
  // По умолчанию открываем первую
  if (cards[0]) cards[0].classList.add('active');
})();
