#!/usr/bin/env python3
"""Render the course map from course.json -> dist/course_map.html.

Usage: python3 src/course_map.py [--send]
"""
import json
import os
import sys
from datetime import date

from build import SRC, DIST, shell, load_css, send_telegram

ROOT = os.path.dirname(SRC)
COURSE = os.path.join(ROOT, 'course.json')


def plural_lessons(n):
    if n % 10 == 1 and n % 100 != 11:
        return 'урок'
    if n % 10 in (2, 3, 4) and n % 100 not in (12, 13, 14):
        return 'урока'
    return 'уроков'


def build_map():
    c = json.load(open(COURSE, encoding='utf-8'))
    modules = {m['id']: m for lvl in c['levels'] for m in lvl['modules']}
    status = {'ready': ('ready', 'готов'), 'lint_ok': ('wip', 'собран'),
              'lessons_done': ('wip', 'уроки готовы'), 'draft': ('wip', 'в работе')}

    parts = []
    for lvl in c['levels']:
        cards = []
        for m in lvl['modules']:
            cls, label = status.get(m.get('status', 'draft'), ('wip', 'в работе'))
            prereq = ''
            if m.get('prereq'):
                titles = [modules[p]['title'] for p in m['prereq'] if p in modules]
                if titles:
                    prereq = f'<div class="map-prereq">Сначала: {" · ".join(titles)}</div>'
            topics = ' · '.join(m.get('themes', []))
            skills = ' · '.join(m.get('skills', []))
            n = m.get('lessons_count', 0)
            meta = f"{n} {plural_lessons(n)} · {m.get('time', '')}"
            cards.append(
                f'<div class="map-card {cls}">\n'
                f'  <div class="map-icon">{m.get("icon", "")}</div>\n'
                f'  <div class="map-title">{m["title"]}</div>\n'
                f'  <div class="map-meta">{meta}</div>\n'
                f'  <div class="map-badge">{label}</div>\n'
                f'  <div class="map-topics">{topics}</div>\n'
                f'  <div class="map-skills">Навыки: {skills}</div>\n'
                f'  {prereq}\n'
                f'</div>')
        first = lvl['modules'][0]['id'].replace('module_', '')
        last = lvl['modules'][-1]['id'].replace('module_', '')
        rng = f'Модуль {first}' if first == last else f'Модули {first}–{last}'
        parts.append(
            '<section class="section">\n'
            '  <div class="stage">\n'
            '    <div class="stage-header">\n'
            f'      <div class="stage-number">{lvl["id"]}</div>\n'
            '      <div>\n'
            f'        <div class="map-level-title">{lvl["title"]}</div>\n'
            f'        <div class="stage-subtitle">{rng}</div>\n'
            '      </div>\n'
            '    </div>\n'
            '    <div class="map-grid">\n' + '\n'.join(cards) + '\n    </div>\n'
            '  </div>\n'
            '</section>')

    hero = ('<header class="hero">\n'
            f'  <div class="badge">Единый курс химии · {c.get("year", "")}</div>\n'
            '  <h1>Карта курса</h1>\n'
            '  <p>14 модулей: от нуля до конца неорганической химии. '
            'Иди по порядку или зайди с нужной темы, сдав входной тест.</p>\n'
            '</header>')
    content = hero + '\n<div class="container">\n' + '\n'.join(parts) + '\n</div>'
    stamp = (f'<!-- course map · built by src/course_map.py · {date.today().isoformat()} -->')
    html = shell('Карта курса химии', load_css(['core']), content, '', stamp)
    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, 'course_map.html')
    open(out, 'w', encoding='utf-8').write(html)
    return out, html, c


def main():
    out, html, c = build_map()
    n = sum(len(l['modules']) for l in c['levels'])
    print(f'course_map: OK | {n} модулей | {len(html) // 1024} KB')
    if '--send' in sys.argv:
        lines = ['🗺️ <b>Карта курса химии</b>',
                 f'<i>{n} модулей · от фундамента до систематизации</i>', '']
        for lvl in c['levels']:
            lines.append(f'<b>Уровень {lvl["id"]}. {lvl["title"]}</b>')
            for m in lvl['modules']:
                lines.append(f'▸ {m.get("icon", "")} {m["title"]} · {m.get("time", "")}')
            lines.append('')
        send_telegram('\n'.join(lines).rstrip(), out)


if __name__ == '__main__':
    main()
