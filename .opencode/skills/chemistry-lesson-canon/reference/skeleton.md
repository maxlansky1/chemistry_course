# Каркас урока

`body.html` — это **фрагмент**: начинается с `<header class="hero">` и состоит из
секций `<section class="section"><div class="stage sN fade-in">…</div></section>`.
Сборщик сам оборачивает всё в shell, добавляет навигацию, глобальные островки
(глоссарий, сообщения) и блоки из `module.json`.

## Порядок блоков сверху вниз

| # | Блок | Кто пишет |
|---|---|---|
| 1 | `header.hero` (бейдж модуля/урока, `<h1>`) | **ты** |
| 2 | Введение «О чём модуль/урок» (`stage s-intro` + карточки) | сборщик (из `module.json`) |
| 3 | «Условные обозначения» + метод Фейнмана | сборщик (только начало модуля) |
| 4 | Разогрев (5 в.) и входной тест (10 в., 80%) | **ты** — только на `entry` / первом уроке |
| 5 | Теория: текст + виджеты | **ты** |
| 6 | Реальная задача «Зачем это в жизни» (`s-why`) | **ты** |
| 7 | Интерактив (игра) | **ты** |
| 8 | Практикум (`s-prac`) | сборщик (из `module.json`) |
| 9 | Задачка★ (`.thinker`) | **ты** |
| 10 | Выжимка (`.recap-card`) | **ты** |
| 11 | Домашнее задание (`s-hw`) | сборщик (из `module.json`) |
| 12 | Итоговый тест (`final`, 80%) | **ты** — в уроке `final` |
| 13 | Навигация | сборщик |

Правила:
- **Введение, практикум и ДЗ в `body.html` не пиши** — они приходят из `module.json`.
- Нумерация теоретических секций: `s1`, `s2`, `s3`, … по порядку. Разогрев — `s-entry`,
  реальная задача — `s-why`, практикум — `s-prac` (сборщик), ДЗ — `s-hw` (сборщик).
- Внутри каждого `<div class="stage sN fade-in">` первым идёт `stage-header`
  (иконка-число, заголовок, подзаголовок), затем содержимое.

## Минимальный каркас (только то, что пишешь ты)

```html
<header class="hero">
  <div class="badge">Модуль N · Урок K из M · ~20 минут</div>
  <h1>Заголовок урока</h1>
</header>

<!-- Только на entry / первом уроке модуля -->
<section class="section">
  <div class="stage s-entry fade-in">
    <div class="stage-header">
      <div class="stage-number">🚪</div>
      <div>
        <div class="stage-title">Разогрев: проверь себя</div>
        <div class="stage-subtitle">5 вопросов без оценки</div>
      </div>
    </div>
    <p class="prose">Это <b>не экзамен</b>: оценка не ставится.</p>
    <div id="quiz-uX-warmup" data-config="warmup"></div>
    <script type="application/json" id="quiz-uX-warmup-data">{ "config": "warmup", "target": "quiz-uX-warmup", "questions": [ /* … */ ] }</script>
  </div>
</section>

<section class="section">
  <div class="stage s1 fade-in">
    <div class="stage-header">
      <div class="stage-number">1</div>
      <div>
        <div class="stage-title">Тезис урока</div>
        <div class="stage-subtitle">Короткий подзаголовок</div>
      </div>
    </div>
    <p class="prose">…теория…</p>
  </div>
</section>

<section class="section">
  <div class="stage s-why fade-in">
    <div class="stage-header">
      <div class="stage-number">🌍</div>
      <div><div class="stage-title">Зачем это в жизни</div></div>
    </div>
    <p class="prose">…реальная задача…</p>
  </div>
</section>

<div class="thinker">★ Вопрос на подумать. Ответа здесь нет.</div>

<div class="recap-card">
  <ul>
    <li>Тезис 1</li>
    <li>Тезис 2</li>
  </ul>
</div>
```

Итоговый тест (в уроке `final`) — блок с `data-config="final"`, порог 80%,
отдельный файл собирает билдер.

## Что делает сборщик (не дублируй)

- оборачивает фрагмент в shell (css/js движков подбираются по классам);
- рендерит введение из `intro` (модуль — на `entry`/первом уроке, урок — на каждом);
- рендерит практикум (`practical`) и ДЗ (`homework`) на каждом `uN`;
- добавляет навигацию, глоссарий и банк текстов результатов.
