// ============================================================
//  module_4 (3б) — дроп-игра «куда ушла энергия» (движок — dropgames.js)
// ============================================================
makeDropGame({
  poolId: 'energyPool',
  feedbackId: 'fbEnergy',
  resetId: 'resetEnergy',
  items: [
    { label: '🔥 Горение дров', cat: 'heat' },
    { label: '🕯 Свеча горит', cat: 'light' },
    { label: '🍔 Пища → движение', cat: 'mech' },
    { label: '🔋 Батарейка → ток', cat: 'mech' },
    { label: '🥶 Таяние льда', cat: 'heat' },
    { label: '✨ Фейерверк', cat: 'light' },
    { label: '🚴 Езда на велосипеде', cat: 'mech' },
    { label: '☕ Чай остывает', cat: 'heat' }
  ]
});
