#!/usr/bin/env python3
"""Генерирует каталог компонентов для скилла chemistry-lesson-canon.

Читает src/shared/data/components.json -> .opencode/skills/chemistry-lesson-canon/reference/components.md
Один источник истины — components.json; каталог вручную не править.

Usage: python3 src/export_skill_catalog.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, '.opencode', 'skills', 'chemistry-lesson-canon',
                   'reference', 'components.md')


def produces(c):
    p = c.get('produces', {}) or {}
    css = p.get('css') or '—'
    js = p.get('js') or []
    return f"css: {css} / js: {', '.join(js) if js else '—'}"


def main():
    data = json.load(open(os.path.join(SRC, 'shared', 'data', 'components.json'),
                          encoding='utf-8'))
    comps = data['components']
    version = data.get('version', '?')

    out = []
    out.append('# Каталог компонентов (сгенерировано)\n')
    out.append(f'> Источник: `src/shared/data/components.json` (version {version}). '
               'НЕ редактировать вручную — перегенерировать командой '
               '`python3 src/export_skill_catalog.py`.\n')
    out.append(f'Всего компонентов: **{len(comps)}**.\n')

    out.append('## Индекс классов → компонент\n')
    out.append('Используй **только** эти классы. Неизвестный класс = `lint ERROR`.\n')
    out.append('| Класс | Компонент |')
    out.append('|---|---|')
    idx = {}
    for c in comps:
        for cl in c['classes']:
            idx[cl] = c['id']
    for cl in sorted(idx):
        out.append(f'| `{cl}` | `{idx[cl]}` |')
    out.append('')

    out.append('## Компоненты\n')
    for c in comps:
        out.append(f'### `{c["id"]}` — {c.get("purpose", "")}\n')
        out.append(f'- Классы: {", ".join("`" + x + "`" for x in c["classes"])}')
        out.append(f'- Дети: `{c.get("children", "")}`')
        ra = c.get('required_attrs') or []
        out.append(f'- Обязательные атрибуты: '
                   + (', '.join("`" + x + "`" for x in ra) if ra else '—'))
        out.append(f'- Движки: {produces(c)}')
        if c.get('detect_ids'):
            out.append(f'- detect_ids: {", ".join("`" + x + "`" for x in c["detect_ids"])}')
        if c.get('allowed_variants'):
            out.append(f'- Варианты: {", ".join("`" + x + "`" for x in c["allowed_variants"])}')
        ex = c.get('example')
        if ex:
            out.append('\n```html\n' + ex + '\n```')
        out.append('')

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
    print(f'OK | {len(comps)} компонентов | {os.path.relpath(OUT, ROOT)}')


if __name__ == '__main__':
    main()
