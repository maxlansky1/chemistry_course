#!/usr/bin/env python3
"""Builder (variant B, v1): src/lessons/<mod>/<lesson>/{manifest.json,body.html}
+ src/shared/{css,js} -> dist/<mod>/<lesson>.html (standalone, offline).

Usage: python3 src/build.py [mod]      # all lessons of mod, or all mods
Rule: content lives in body.html + manifest; shell/shared injected here.
"""
import json
import os
import re
import subprocess
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
DIST = os.path.join(ROOT, 'dist')

COMPONENTS = json.load(open(os.path.join(SRC, 'shared', 'data', 'components.json'),
                            encoding='utf-8'))['components']


def detect_assets(body, mod):
    """Собрать css/js по блокам, найденным в body.html (класс или detect_id)."""
    css, js = [], []
    for comp in COMPONENTS:
        hit = any(re.search(r'class="[^"]*\b' + re.escape(c) + r'\b', body)
                  for c in comp.get('classes', []))
        if not hit:
            hit = any(('id="' + d + '"') in body for d in comp.get('detect_ids', []))
        if hit:
            prod_css = comp['produces'].get('css', [])
            if isinstance(prod_css, str):
                prod_css = [prod_css]
            for c in prod_css:
                if c not in css:
                    css.append(c)
            for j in comp['produces'].get('js', []):
                if j not in js:
                    js.append(j)
    if mod == 'module_2' and 'mod02' not in css:
        css.append('mod02')
    return css or ['core'], js


def qa_cards(questions):
    """Universal question cards: numbered prompt, no emoji, no answers.
    The question is asked during the lesson — the answer is born in it."""
    out = ['<div class="qa-list">']
    for i, q in enumerate(questions, 1):
        out.append(
            f'<div class="qa-card"><div class="qa-q">'
            f'<span class="qa-num">{i}</span><span>{q}</span></div></div>')
    out.append('</div>')
    return '\n'.join(out)


def snippet(name):
    return open(os.path.join(SRC, 'shared', 'snippets', name),
                encoding='utf-8').read()


def data_island(name, filename):
    data = open(os.path.join(SRC, 'shared', 'data', filename), encoding='utf-8').read()
    return f'<script type="application/json" id="{name}">{data}</script>'


def glossary_island():
    return data_island('glossary', 'glossary.json')


def resolve_assets(mod, lesson, lmeta, body):
    """css/js для урока: сначала из module.json, затем из legacy manifest.json."""
    if 'css' in lmeta or 'js' in lmeta:
        return lmeta.get('css', ['core']), lmeta.get('js', [])
    mf = os.path.join(SRC, 'lessons', mod, lesson, 'manifest.json')
    if os.path.isfile(mf):
        m = json.load(open(mf, encoding='utf-8'))
        return m.get('css', ['core']), m.get('js', [])
    return detect_assets(body, mod)


def build(mod, lesson):
    ldir = os.path.join(SRC, 'lessons', mod, lesson)
    body = open(os.path.join(ldir, 'body.html'), encoding='utf-8').read()
    mod_meta = json.load(open(os.path.join(SRC, 'lessons', mod, 'module.json'),
                              encoding='utf-8'))
    lmeta = next((L for L in mod_meta['lessons'] if L['file'] == lesson), {})
    css_names, js_names = resolve_assets(mod, lesson, lmeta, body)
    js_names = list(dict.fromkeys(js_names))
    stamp = (f'<!-- built by src/build.py v1 · {date.today().isoformat()} · '
             f'{mod}/{lesson} · manifest-driven -->')
    hero, rest = body.split('</header>', 1)
    # body.html may carry its own container open/close from legacy; builder owns both
    rest = rest.replace('<div class="container">', '', 1).rstrip()
    tail = rest[:rest.rfind('</div>')].rstrip()
    # strip legacy container close only if content stays section-complete
    if tail.endswith(('</section>', '</details>')):
        rest = tail
    if 'questions' in lmeta:
        hero = hero.replace('<!--QA-->', qa_cards(lmeta['questions']))
    nav = lesson_nav(mod_meta, lesson, lambda f: f + '.html')
    content = (hero + '</header>\n<div class="container">\n' + rest
               + '\n' + nav + '\n</div>\n' + glossary_island())
    html = shell(lmeta.get('title', mod_meta['title']), load_css(css_names),
                 content, load_js(js_names), stamp)
    outdir = os.path.join(DIST, mod)
    os.makedirs(outdir, exist_ok=True)
    out = os.path.join(outdir, lesson + '.html')
    open(out, 'w', encoding='utf-8').write(html)
    return out, html


def build_module(mod):
    """Whole module in ONE file: module hero + all lessons with anchors.
    Inter-lesson links (u2.html) become in-file anchors (#m-u2)."""
    mdir = os.path.join(SRC, 'lessons', mod)
    meta = json.load(open(os.path.join(mdir, 'module.json'), encoding='utf-8'))
    order = meta['order']
    css_names, js_names, bodies = [], [], []
    lmetas = {L['file']: L for L in meta['lessons']}
    for lesson in order:
        body = open(os.path.join(mdir, lesson, 'body.html'), encoding='utf-8').read()
        lmeta = lmetas.get(lesson, {})
        lc, lj = resolve_assets(mod, lesson, lmeta, body)
        for c in lc:
            if c not in css_names:
                css_names.append(c)
        for j in lj:
            if j not in js_names:
                js_names.append(j)
        hero, rest = body.split('</header>', 1)
        rest = rest.replace('<div class="container">', '', 1).rstrip()
        tail = rest[:rest.rfind('</div>')].rstrip()
        if tail.endswith(('</section>', '</details>')):
            rest = tail
        bodies.append((lesson, hero + '</header>', rest))
    parts = []
    qas = {L['file']: L.get('questions') for L in meta['lessons']}
    for i, (lesson, hero, rest) in enumerate(bodies):
        if qas.get(lesson):
            hero = hero.replace('<!--QA-->', qa_cards(qas[lesson]))
        chunk = hero + '</header>\n' + rest
        # lesson-file links -> in-module anchors
        for other in order:
            chunk = chunk.replace(f'href="{other}.html"', f'href="#m-{other}"')
            chunk = chunk.replace(f'{mod}/{other}.html', f'#{other}')
        chunk += '\n' + lesson_nav(meta, lesson, lambda f: '#m-' + f)
        parts.append(f'<div id="m-{lesson}">\n{chunk}\n</div>')
    def short_title(L, idx):
        if L['file'] == 'final':
            return 'Тест'
        if L['file'] == 'entry':
            return 'Вход'
        return f'Урок {idx + 1}'
    chips = ' '.join(
        f'<a class="mod-chip" href="#m-{L["file"]}">{L.get("chip", short_title(L, k))}</a>'
        for k, L in enumerate(meta['lessons']))
    mod_hero = (
        '<header class="hero">\n'
        f'  <div class="badge">{meta["badge"]}</div>\n'
        f'  <h1>{meta["title"]}</h1>\n'
        f'  <p style="max-width:700px;margin:0 auto;">{meta.get("digest", "")}</p>\n'
        + qa_cards(meta.get('questions', [])) +
        f'\n  <div class="mod-chips">{chips}</div>\n'
        '</header>\n' + snippet('legend_fold.html') + snippet('feynman_fold.html'))
    content = (mod_hero + '\n<div class="container">\n' + '\n'.join(parts)
               + '\n</div>\n' + glossary_island())

    stamp = (f'<!-- built by src/build.py v1 · {date.today().isoformat()} · '
             f'{mod} WHOLE-MODULE · manifest-driven -->')
    html = shell(meta['title'], load_css(css_names), content,
                 load_js(js_names), stamp)
    out = os.path.join(DIST, mod + '.html')
    open(out, 'w', encoding='utf-8').write(html)
    # Telegram message from the same module.json (single source)
    open(os.path.join(DIST, mod + '.message.txt'), 'w',
         encoding='utf-8').write(tg_message(meta))
    return out, html


def shell(title, css, content, js, stamp):
    tpl = open(os.path.join(SRC, 'shared', 'shell.html'), encoding='utf-8').read()
    return (tpl.replace('{{TITLE}}', title)
               .replace('{{CSS}}', css)
               .replace('{{CONTENT}}', content)
               .replace('{{JS}}', js)
               .replace('{{STAMP}}', stamp))


def load_css(names):
    return '\n'.join(open(os.path.join(SRC, 'shared', 'css', c + '.css'),
                           encoding='utf-8').read() for c in names)


def load_js(names):
    return '\n'.join(open(os.path.join(SRC, 'shared', 'js', j + '.js'),
                          encoding='utf-8').read() for j in names)


def lesson_nav(meta, current, href):
    """Nav cards + pills. href(f) -> link target (sibling file or #anchor)."""
    order = meta['order']
    titles = {L['file']: L['title'] for L in meta['lessons']}
    pills = {L['file']: L.get('pill', L['file']) for L in meta['lessons']}
    i = order.index(current)
    prev_html = (f'<a class="ln-card" href="{href(order[i-1])}">'
                 f'<span class="ln-dir">← Назад</span>'
                 f'<span class="ln-title">{titles[order[i-1]]}</span></a>'
                 if i > 0 else
                 '<span class="ln-card done"><span class="ln-dir">Старт</span>'
                 '<span class="ln-title">Ты в начале модуля</span></span>')
    if i < len(order) - 1:
        next_html = (f'<a class="ln-card ln-next" href="{href(order[i+1])}">'
                     f'<span class="ln-dir">Вперёд →</span>'
                     f'<span class="ln-title">{titles[order[i+1]]}</span></a>')
    else:
        next_html = ('<span class="ln-card ln-next done"><span class="ln-dir">Финиш</span>'
                     '<span class="ln-title">Модуль пройден — покажи результат учителю</span></span>')
    dots = []
    for f in order:
        if f == current:
            dots.append(f'<span class="ln-pill now">{pills[f]}</span>')
        else:
            dots.append(f'<a class="ln-pill" href="{href(f)}">{pills[f]}</a>')
    return (f'<nav class="lesson-nav">\n{prev_html}\n'
            f'<div class="ln-map">{"".join(dots)}</div>\n{next_html}\n</nav>')


def tg_message(meta):
    """Strict HTML text: module digest + 3 questions per lesson (no answers)."""
    lines = [f'📘 <b>{meta["title"]}</b>', f'<i>{meta["badge"]}</i>',
             f'<i>{meta.get("digest", "")}</i>', '']
    for n, L in enumerate(meta['lessons'], 1):
        lines.append(f'<b>{n}. {L["title"]}</b> ({L["time"]})')
        if 'questions' in L:
            lines += [f'❓ {q}' for q in L['questions']]
        else:
            lines += [f'▸ {t.strip()}' for t in L['topics'].split('·')]
        lines.append('')
    return '\n'.join(lines).rstrip() + '\n'


def check(html):
    m = re.search(r'<script>(.*)</script>', html, re.DOTALL).group(1)
    open('/tmp/build_chk.js', 'w', encoding='utf-8').write(m)
    r = subprocess.run(['node', '--check', '/tmp/build_chk.js'],
                       capture_output=True, text=True)
    divs = len(re.findall(r'<div[\s>]', html)) - len(re.findall(r'</div>', html))
    secs = len(re.findall(r'<section[\s>]', html)) - len(re.findall(r'</section>', html))
    ids = set(re.findall(r'getElementById\(\'([^\']+)\'\)', m))
    missing = [i for i in ids if f'id="{i}"' not in html]
    return r.returncode == 0, divs, secs, missing


def report(tag, html):
    ok, divs, secs, missing = check(html)
    status = 'OK' if (ok and divs == 0 and secs == 0 and not missing) else 'FAIL'
    print(f'{tag}: {status} | JS:{"OK" if ok else "FAIL"} '
          f'div:{divs} section:{secs} missing:{missing or "none"} '
          f'KB:{len(html)//1024}')
    return status == 'OK'


def main():
    mods = sys.argv[1:] or sorted(os.listdir(os.path.join(SRC, 'lessons')))
    for mod in mods:
        ldir = os.path.join(SRC, 'lessons', mod)
        for lesson in sorted(os.listdir(ldir)):
            if not os.path.isdir(os.path.join(ldir, lesson)):
                continue
            out, html = build(mod, lesson)
            report(f'{mod}/{lesson}', html)
        out, html = build_module(mod)
        report(f'{mod} WHOLE', html)


if __name__ == '__main__':
    main()
