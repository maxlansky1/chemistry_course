// ============================================================
//  ИНТЕРАКТИВНЫЙ ГРАФИК НАГРЕВА
// ============================================================
(function initHeatingGraph() {
  const slider = document.getElementById('timeSlider');
  const timeValue = document.getElementById('timeValue');
  const marker = document.getElementById('graphMarker');
  const tempBox = document.getElementById('graphTemp');
  const stateBox = document.getElementById('graphState');
  if (!slider || !marker) return;

  // Точки графика (x, y): 6 ключевых точек
  const POINTS = [
    { x: 80,  y: 340, t: -20, label: 'solid_heating' },
    { x: 200, y: 260, t: 0,   label: 'melting' },
    { x: 340, y: 260, t: 0,   label: 'melting_end' },
    { x: 500, y: 100, t: 100, label: 'boiling' },
    { x: 640, y: 100, t: 100, label: 'boiling_end' },
    { x: 820, y: 60,  t: 120, label: 'gas_heating' }
  ];

  function getPointAt(percent) {
    // percent от 0 до 100
    // 5 сегментов, каждый по 20%
    const p = percent / 100;
    if (p <= 0.2) {
      // нагрев твёрдого
      const t = p / 0.2;
      return {
        x: 80 + t * (200 - 80),
        y: 340 + t * (260 - 340),
        temp: -20 + t * 20,
        state: 'solid',
        text: 'Твёрдое (лёд). Частицы колеблются около одного места, но связь между ними ещё крепкая.'
      };
    } else if (p <= 0.4) {
      // плавление
      const t = (p - 0.2) / 0.2;
      return {
        x: 200 + t * (340 - 200),
        y: 260,
        temp: 0,
        state: 'melting',
        text: 'Плавление. Температура не меняется — вся энергия уходит на разрушение связей между частицами. Лёд превращается в воду.'
      };
    } else if (p <= 0.6) {
      // нагрев жидкости
      const t = (p - 0.4) / 0.2;
      return {
        x: 340 + t * (500 - 340),
        y: 260 + t * (100 - 260),
        temp: 0 + t * 100,
        state: 'liquid',
        text: 'Жидкое (вода). Частицы двигаются свободнее, но всё ещё держатся вместе. Вода постепенно нагревается.'
      };
    } else if (p <= 0.8) {
      // кипение
      const t = (p - 0.6) / 0.2;
      return {
        x: 500 + t * (640 - 500),
        y: 100,
        temp: 100,
        state: 'boiling',
        text: 'Кипение. Температура снова не меняется — вся энергия идёт на отрыв частиц друг от друга. Вода превращается в пар.'
      };
    } else {
      // нагрев газа
      const t = (p - 0.8) / 0.2;
      return {
        x: 640 + t * (820 - 640),
        y: 100 + t * (60 - 100),
        temp: 100 + t * 20,
        state: 'gas',
        text: 'Газообразное (пар). Частицы разлетелись по всему объёму и быстро двигаются. Пар продолжает нагреваться.'
      };
    }
  }

  function update() {
    const percent = parseInt(slider.value);
    const p = getPointAt(percent);
    marker.setAttribute('cx', p.x);
    marker.setAttribute('cy', p.y);
    timeValue.textContent = percent + ' %';
    tempBox.innerHTML = `<b>${Math.round(p.temp)} °C</b>`;
    stateBox.textContent = p.text;
  }

  slider.addEventListener('input', update);
  update();
})();
