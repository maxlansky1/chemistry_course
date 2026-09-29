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


def intro_block(title, intro, callout=False):
    """Универсальный вводный блок «О чём этот модуль/урок»:
    stage s-intro + prose-lead + карточки + (для модуля) callout-idea."""
    if not intro:
        return ''
    emoji = '🎯' if callout else '📌'
    p = ['<section class="section">',
         '  <div class="stage s-intro fade-in">',
         '    <div class="stage-header">',
         f'      <div class="stage-number">{emoji}</div>',
         '      <div>',
         f'        <div class="stage-title">{title}</div>']
    if intro.get('subtitle'):
        p.append(f'        <div class="stage-subtitle">{intro["subtitle"]}</div>')
    p += ['      </div>', '    </div>']
    if intro.get('lead'):
        p.append(f'    <p class="prose">{intro["lead"]}</p>')
    if intro.get('cards'):
        p.append('    <div class="card-grid">')
        for c in intro['cards']:
            icon = c.get('icon', '').strip()
            name = ('%s %s' % (icon, c.get('title', ''))).strip()
            p.append('      <div class="card">')
            p.append(f'        <div class="c-title">{name}</div>')
            p.append(f'        <div class="c-desc">{c.get("desc", "")}</div>')
            p.append('      </div>')
        p.append('    </div>')
    if callout and intro.get('callout'):
        p.append(f'    <div class="callout callout-idea">{intro["callout"]}</div>')
    p += ['  </div>', '</section>']
    return '\n'.join(p) + '\n'


def render_intro(lesson, lmeta, meta, order):
    """Модульный блок — на entry (или на первом уроке, если entry нет);
    урочный — на каждом содержательном uN. На final и entry урочного нет."""
    has_entry = 'entry' in order
    if lesson == 'entry' or (not has_entry and lesson == order[0]):
        return intro_block('О чём этот модуль', meta.get('intro'), callout=True)
    if lesson.startswith('u') and lmeta.get('intro'):
        return intro_block('О чём этот урок', lmeta['intro'])
    return ''


def practical_block(lmeta):
    """Универсальный блок «Практикум» из module.json (описание опыта)."""
    P = lmeta.get('practical')
    if not P:
        return ''
    p = ['<section class="section">',
         '  <div class="stage s-prac fade-in">',
         '    <div class="stage-header">',
         '      <div class="stage-number">🔬</div>',
         '      <div>',
         f'        <div class="stage-title">Практикум: {P.get("title", "")}</div>',
         f'        <div class="stage-subtitle">{P.get("subtitle", "Опыт по теме урока · соблюдай технику безопасности")}</div>',
         '      </div>',
         '    </div>']
    if P.get('lead'):
        p.append(f'    <p class="prose">{P["lead"]}</p>')
    if P.get('materials'):
        p.append('    <p class="subhead-sub">Что понадобится</p>')
        p.append('    <ul class="list-note">'
                 + ''.join(f'<li>{m}</li>' for m in P['materials']) + '</ul>')
    if P.get('steps'):
        p.append('    <p class="subhead-sub">Ход работы</p>')
        p.append('    <ol class="list-note">'
                 + ''.join(f'<li>{s}</li>' for s in P['steps']) + '</ol>')
    if P.get('safety'):
        p.append('    <div class="callout callout-warn"><b>⚠️ Техника безопасности:</b> '
                 f'{P["safety"]}</div>')
    if P.get('record'):
        p.append('    <div class="callout callout-note"><b>📝 В тетрадь:</b> '
                 f'{P["record"]}</div>')
    p += ['  </div>', '</section>']
    return '\n'.join(p) + '\n'


def homework_block(lmeta):
    """Универсальный блок «Домашнее задание» из module.json."""
    H = lmeta.get('homework')
    if not H:
        return ''
    p = ['<section class="section">',
         '  <div class="stage s-hw fade-in">',
         '    <div class="stage-header">',
         '      <div class="stage-number">🏠</div>',
         '      <div>',
         f'        <div class="stage-title">{H.get("title", "Домашнее задание")}</div>',
         f'        <div class="stage-subtitle">{H.get("subtitle", "Письменно в тетрадь · проверяет учитель")}</div>',
         '      </div>',
         '    </div>',
         '    <div class="homework">',
         '      <ol>']
    for t in H.get('tasks', []):
        if t.strip().startswith('★'):
            p.append(f'        <li><span class="hw-star">{t}</span></li>')
        else:
            p.append(f'        <li>{t}</li>')
    for f in H.get('feynman', []):
        p.append(f'        <li>{f}</li>')
    p += ['      </ol>', '    </div>', '  </div>', '</section>']
    return '\n'.join(p) + '\n'


def render_extra(lesson, lmeta):
    """Практикум и ДЗ — только на содержательных уроках uN."""
    if not lesson.startswith('u'):
        return ''
    return practical_block(lmeta) + homework_block(lmeta)


def snippet(name):
    return open(os.path.join(SRC, 'shared', 'snippets', name),
                encoding='utf-8').read()


def data_island(name, filename):
    data = open(os.path.join(SRC, 'shared', 'data', filename), encoding='utf-8').read()
    return f'<script type="application/json" id="{name}">{data}</script>'


def glossary_island():
    return data_island('glossary', 'glossary.json')


def messages_island():
    return data_island('messages', 'messages.json')


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
    lesson_html, stages = annotate_stages(
        render_intro(lesson, lmeta, mod_meta, mod_meta['order'])
        + rest + render_extra(lesson, lmeta), lesson)
    lessons_nav = []
    for L in mod_meta['lessons']:
        cur = (L['file'] == lesson)
        lessons_nav.append({
            'label': L.get('chip', L['file']),
            'href': '' if cur else L['file'] + '.html',
            'current': cur,
            'subs': stages if cur else []})
    if 'nav' not in js_names:
        js_names.append('nav')
    nav = nav_markup(mod_meta, lessons_nav)
    content = (hero + '</header>\n<div class="container">\n' + nav + lesson_html
               + '\n</div>\n' + glossary_island() + messages_island())
    html = shell(lmeta.get('title', mod_meta['title']), load_css(css_names),
                 content, load_js(js_names), stamp)
    outdir = os.path.join(DIST, mod)
    os.makedirs(outdir, exist_ok=True)
    out = os.path.join(outdir, lesson + '.html')
    open(out, 'w', encoding='utf-8').write(html)
    return out, html


STAGE_RE = re.compile(r'<div class="(stage(?: [^"]*)?)">')


def annotate_stages(html, lesson):
    """Проставляет каждому stage id `s-<lesson>-<n>` и data-stage,
    возвращает HTML и список {id, title} для дерева навигации."""
    stages = []

    def repl(m):
        idx = len(stages) + 1
        sid = f's-{lesson}-{idx}'
        tail = html[m.end():m.end() + 2000]
        t = re.search(r'<div class="stage-title">(.*?)</div>', tail, re.S)
        title = re.sub(r'<[^>]+>', '', t.group(1)).strip() if t else ''
        stages.append({'id': sid, 'title': title})
        return f'<div id="{sid}" data-stage class="{m.group(1)}">'

    return STAGE_RE.sub(repl, html), stages


def nav_markup(meta, lessons_nav):
    """Триггер + backdrop + drawer + «наверх».
    lessons_nav: [{label, href, current, subs:[{id,title}]}]."""
    items = ['<ul class="nav-tree">']
    for L in lessons_nav:
        cls = 'nav-lesson' + (' nav-current' if L.get('current') else '')
        if L.get('href'):
            a = f'<a href="{L["href"]}">{L["label"]}</a>'
        else:
            a = f'<a href="#" aria-current="true">{L["label"]}</a>'
        subs = ''.join(
            f'<li><a class="nav-sub" href="#{s["id"]}">{s["title"]}</a></li>'
            for s in L.get('subs', []) if s.get('title'))
        inner = a + (f'<ul class="nav-subs">{subs}</ul>' if subs else '')
        items.append(f'<li class="{cls}">{inner}</li>')
    items.append('</ul>')
    return (
        '<button class="nav-trigger" id="navTrigger" aria-controls="navDrawer" '
        'aria-expanded="false"><span class="nav-trigger-icon">☰</span>'
        '<span class="nav-trigger-text">Содержание</span></button>\n'
        '<div class="nav-backdrop" id="navBackdrop" hidden></div>\n'
        '<nav class="nav-drawer" id="navDrawer" aria-label="Содержание" aria-hidden="true">'
        f'<div class="nav-drawer-head">{meta.get("title", "")}</div>'
        + ''.join(items) + '</nav>\n'
        '<button class="to-top" id="toTop" aria-label="Наверх" hidden>↑</button>\n')


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
        lesson_html, stages = annotate_stages(
            render_intro(lesson, lmetas.get(lesson, {}), meta, order)
            + rest + render_extra(lesson, lmetas.get(lesson, {})), lesson)
        bodies.append((lesson, hero + '</header>', lesson_html, stages))
    parts, nav_lessons = [], []
    for (lesson, hero, lesson_html, stages) in bodies:
        chunk = hero + '\n' + lesson_html
        # lesson-file links -> in-module anchors
        for other in order:
            chunk = chunk.replace(f'href="{other}.html"', f'href="#m-{other}"')
            chunk = chunk.replace(f'{mod}/{other}.html', f'#{other}')
        parts.append(f'<div id="m-{lesson}">\n{chunk}\n</div>')
        L = lmetas.get(lesson, {})
        nav_lessons.append({'label': L.get('chip', lesson), 'href': '#m-' + lesson,
                            'current': False, 'subs': stages})
    mod_hero = (
        '<header class="hero">\n'
        f'  <div class="badge">{meta["badge"]}</div>\n'
        f'  <h1>{meta["title"]}</h1>\n'
        f'  <p class="hero-digest">{meta.get("digest", "")}</p>\n'
        '</header>\n' + snippet('legend_fold.html') + snippet('feynman_fold.html'))
    if 'nav' not in js_names:
        js_names.append('nav')
    content = (mod_hero + '\n<div class="container">\n'
               + nav_markup(meta, nav_lessons) + '\n'
               + '\n'.join(parts)
               + '\n</div>\n' + glossary_island() + messages_island())

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


def tg_message(meta):
    """Strict HTML text: module digest + 3 questions per lesson (no answers)."""
    lines = [f'📘 <b>{meta["title"]}</b>', f'<i>{meta["badge"]}</i>',
             f'<i>{meta.get("digest", "")}</i>', '']
    for n, L in enumerate(meta['lessons'], 1):
        lines.append(f'<b>{n}. {L["title"]}</b> ({L["time"]})')
        if L.get('intro'):
            lines += [f'❓ {c.get("desc", c.get("title", ""))}'
                      for c in L['intro'].get('cards', [])]
        elif L.get('topics'):
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
    line = (f'{tag}: {status} | JS:{"OK" if ok else "FAIL"} '
            f'div:{divs} section:{secs} missing:{missing or "none"} '
            f'KB:{len(html)//1024}')
    print(line)
    return line


def load_env():
    env = {}
    path = os.path.join(ROOT, '.env')
    if os.path.isfile(path):
        for line in open(path, encoding='utf-8'):
            if '=' in line and not line.strip().startswith('#'):
                k, v = line.strip().split('=', 1)
                env[k.strip()] = v.strip()
    return env


def send_telegram(text, doc_path=None):
    import urllib.request
    import urllib.parse
    env = load_env()
    token = env.get('TELEGRAM_BOT_TOKEN')
    chat = env.get('TELEGRAM_CHAT_ID')
    if not token or not chat:
        print('SEND skipped: нет TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID')
        return
    base = f'https://api.telegram.org/bot{token}/'
    data = urllib.parse.urlencode({'chat_id': chat, 'text': text,
                                   'parse_mode': 'HTML'}).encode()
    urllib.request.urlopen(base + 'sendMessage', data=data).read()
    if doc_path and os.path.isfile(doc_path):
        boundary = '----chem'
        body = b''
        body += (f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n'
                 f'{chat}\r\n').encode()
        body += (f'--{boundary}\r\nContent-Disposition: form-data; name="document"; '
                 f'filename="{os.path.basename(doc_path)}"\r\n\r\n').encode()
        body += open(doc_path, 'rb').read() + b'\r\n'
        body += f'--{boundary}--\r\n'.encode()
        req = urllib.request.Request(
            base + 'sendDocument', data=body,
            headers={'Content-Type': f'multipart/form-data; boundary={boundary}'})
        urllib.request.urlopen(req).read()
    print('SEND ok')


def main():
    argv = sys.argv[1:]
    do_send = '--send' in argv
    mods = ([a for a in argv if not a.startswith('--')]
            or sorted(d for d in os.listdir(os.path.join(SRC, 'lessons'))
                      if os.path.isdir(os.path.join(SRC, 'lessons', d))))
    lines = []
    last_mod_file = None
    for mod in mods:
        ldir = os.path.join(SRC, 'lessons', mod)
        for lesson in sorted(os.listdir(ldir)):
            if not os.path.isdir(os.path.join(ldir, lesson)):
                continue
            out, html = build(mod, lesson)
            lines.append(report(f'{mod}/{lesson}', html))
        out, html = build_module(mod)
        last_mod_file = out
        lines.append(report(f'{mod} WHOLE', html))
    if do_send:
        title = '📦 Сборка курса'
        text = title + '\n' + '\n'.join(lines)
        send_telegram(text, last_mod_file)


if __name__ == '__main__':
    main()
