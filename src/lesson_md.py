#!/usr/bin/env python3
import os, re, json, glob
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = '/home/gjkvjhab/chemistry_course'

def md_inline(node):
    out = []
    for c in node.children:
        if isinstance(c, NavigableString):
            out.append(str(c))
        elif isinstance(c, Tag):
            if c.name in ('b', 'strong'):
                out.append('**' + md_inline(c).strip() + '**')
            elif c.name in ('i', 'em'):
                out.append('*' + md_inline(c).strip() + '*')
            elif c.name == 'br':
                out.append('\n')
            elif c.name in ('a', 'span', 'mark', 'code'):
                out.append(md_inline(c))
            elif c.name == 'sup':
                out.append('^' + md_inline(c).strip())
            elif c.name == 'sub':
                out.append('_' + md_inline(c).strip())
            else:
                out.append(md_inline(c))
    return ''.join(out)

def clean_md(s):
    s = s.replace('\xa0', ' ')
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r' *\n *', '\n', s)
    return s.strip()

def para(node):
    return clean_md(md_inline(node))

def list_md(node):
    lines = []
    ordered = node.name == 'ol'
    for i, li in enumerate(node.find_all('li', recursive=False), 1):
        lines.append((f'{i}. ' if ordered else '- ') + clean_md(md_inline(li)).replace('\n', ' '))
    return '\n'.join(lines)

def table_md(tbl):
    rows = []
    for tr in tbl.find_all('tr'):
        cells = [clean_md(md_inline(td)).replace('\n', ' ') for td in tr.find_all(['th', 'td'])]
        rows.append(cells)
    if not rows:
        return ''
    w = max(len(r) for r in rows)
    rows = [r + [''] * (w - len(r)) for r in rows]
    out = ['| ' + ' | '.join(rows[0]) + ' |',
           '|' + '|'.join(['---'] * w) + '|']
    for r in rows[1:]:
        out.append('| ' + ' | '.join(r) + ' |')
    return '\n'.join(out)

def svg_text(node):
    texts = [clean_md(t.get_text(' ', strip=True)) for t in node.find_all('text')]
    texts = [t for t in texts if t]
    return ' · '.join(dict.fromkeys(texts))

SKIP_GRIDS = {'legend-grid'}
TITLE_RE = re.compile(r'(^|-)(c-title|tc-title|sc-title|t-name|tr-name|mc-title|mc-name|eq-name|prc-name|mb-title|ec-title|pc-title|pc-name|si-icon|lc-header)$')
DESC_RE = re.compile(r'(^|-)(c-desc|tc-desc|sc-desc|t-desc|tr-desc|mc-desc|eq-desc|eq-detail|prc-desc|mb-text|ec-desc|pc-desc|si-text|lc-body)$')
def html_inline(fragment):
    frag = BeautifulSoup(fragment or '', 'html.parser')
    return re.sub(r'\s+', ' ', clean_md(md_inline(frag)))


def render_practical_md(L):
    P = L.get('practical')
    if not P or not L['file'].startswith('u'):
        return []
    out = ['## Практикум: ' + P.get('title', ''), '']
    if P.get('subtitle'):
        out += ['*' + P['subtitle'] + '*', '']
    if P.get('lead'):
        out += [P['lead'], '']
    if P.get('materials'):
        out += ['**Что понадобится**'] + ['- ' + m for m in P['materials']] + ['']
    if P.get('steps'):
        out += ['**Ход работы**'] + [f'{i}. {s}' for i, s in enumerate(P['steps'], 1)] + ['']
    if P.get('safety'):
        out += ['> ⚠️ **Техника безопасности:** ' + P['safety'], '']
    if P.get('record'):
        out += ['> 📝 **В тетрадь:** ' + P['record'], '']
    return out


def render_homework_md(L):
    H = L.get('homework')
    if not H or not L['file'].startswith('u'):
        return []
    out = ['## ' + H.get('title', 'Домашнее задание'), '']
    if H.get('subtitle'):
        out += ['*' + H['subtitle'] + '*', '']
    for t in H.get('tasks', []):
        out.append('- ' + t)
    for f in H.get('feynman', []):
        out.append('- ' + f)
    out.append('')
    return out


def render_intro_md(meta, lesson, L):
    has_entry = 'entry' in meta['order']
    if lesson == 'entry' or (not has_entry and lesson == meta['order'][0]):
        title, intro, callout = 'О чём этот модуль', meta.get('intro'), True
    elif lesson.startswith('u') and L.get('intro'):
        title, intro, callout = 'О чём этот урок', L['intro'], False
    else:
        return []
    if not intro:
        return []
    out = ['## ' + title, '']
    if intro.get('subtitle'):
        out += ['*' + html_inline(intro['subtitle']) + '*', '']
    if intro.get('lead'):
        out += [html_inline(intro['lead']), '']
    for c in intro.get('cards', []):
        name = ('%s %s' % (c.get('icon', '').strip(), c.get('title', ''))).strip()
        out.append('- **' + name + '** — ' + html_inline(c.get('desc', '')))
    if intro.get('cards'):
        out.append('')
    if callout and intro.get('callout'):
        out += ['> 💡 ' + html_inline(intro['callout']), '']
    return out


def render_cards(grid):
    items = []
    for card in grid.find_all(['div'], recursive=False):
        title = card.find(class_=TITLE_RE)
        desc = card.find(class_=DESC_RE)
        t = re.sub(r'\s+', ' ', clean_md(md_inline(title))) if title else ''
        d = re.sub(r'\s+', ' ', clean_md(md_inline(desc))) if desc else ''
        if not t and not d:
            d = re.sub(r'\s+', ' ', clean_md(md_inline(card)))
        items.append(('- **' + t + '** — ' + d) if t and d else ('- **' + t + '**' if t else '- ' + d))
    return '\n'.join([i for i in items if i.strip() not in ('- ', '- **  **')])

CALLOUT_EMOJI = {'callout-idea': '💡', 'callout-note': '📌', 'callout-warn': '⚠️', 'callout-ok': '✅'}

def render_callout(div):
    emoji = '💡'
    for k, v in CALLOUT_EMOJI.items():
        if k in div.get('class', []):
            emoji = v
            break
    parts = []
    inner_lists = div.find_all(['ol', 'ul'], recursive=False)
    body = clean_md(md_inline(div)).replace('\n', ' ')
    for lst in inner_lists:
        lm = list_md(lst)
        for li in lst.find_all('li'):
            body = body.replace(clean_md(md_inline(li)), '', 1)
        body = clean_md(body)
        parts.append(lm)
    body = re.sub(r'\s+', ' ', body).strip(' .;')
    text = '> ' + emoji + ' ' + body
    for p in parts:
        text += '\n> ' + p.replace('\n', '\n> ')
    return text

def render_timeline(tl):
    items = []
    for it in tl.find_all(class_=re.compile(r'timeline-item|tl-item|t-item')):
        era = it.find(class_=re.compile(r'(t-era|timeline-era)'))
        name = it.find(class_=re.compile(r'(t-name|timeline-name|timeline-title)'))
        det = it.find(class_=re.compile(r'(timeline-detail|t-detail)'))
        e = clean_md(md_inline(era)).replace('\n', ' ') if era else ''
        n = clean_md(md_inline(name)).replace('\n', ' ') if name else ''
        d = clean_md(md_inline(det)).replace('\n', ' ') if det else ''
        items.append(' '.join(x for x in [('**' + e + '**' if e else ''), n, ('— ' + d if d else '')] if x).strip())
    detail = tl.find(class_=re.compile(r'(timeline-detail|tl-detail)'))
    out = '\n'.join('- ' + i for i in items if i)
    if detail:
        out += '\n\n' + clean_md(md_inline(detail))
    return out

def render_quiz(script):
    data = json.loads(script.string)
    cfg = data.get('config', 'practice')
    qs = data.get('questions', [])
    out = [f'### Тест «{cfg}» ({len(qs)} вопросов, порог 80%)', '']
    for i, q in enumerate(qs, 1):
        out.append(f'{i}. {q.get("q","")}')
        for opt in q.get('options', []):
            out.append('   - ' + opt)
        out.append('')
    return '\n'.join(out).strip()

def is_quiz(script):
    return script.get('type') == 'application/json' and (script.get('id', '') or '').startswith('quiz-')

SIM_TXT = re.compile(r'(mv-title|mv-text|mv-problem|tl-detail|timeline-detail|ec-title|ec-desc|'
                       r'jc-title|jc-text|gi-title|gi-text|mc-title|mc-desc|tr-name|tr-desc|'
                       r'tc-title|tc-desc|sc-title|sc-desc|si-title|si-text|pc-title|pc-desc|'
                       r'iso-name|iso-symbol|bal-title|balance-title)')
def sim_editorial(node):
    out = []
    for el in node.find_all(class_=SIM_TXT):
        if el.find(class_=SIM_TXT):
            continue
        t = re.sub(r'\s+', ' ', clean_md(md_inline(el)))
        if t and t not in out:
            out.append(t)
    return out

def render_sim(node):
    ed = sim_editorial(node)
    labels = svg_text(node)
    btns = [clean_md(b.get_text(' ', strip=True)) for b in node.find_all(['button', 'label'])]
    btns = [b for b in btns if b]
    marker = '> 🎛️ **Симуляция**'
    if not ed:
        extra = [x for x in ([labels] + btns) if x]
        if extra:
            marker += ': ' + ' | '.join(dict.fromkeys(extra))
    return '\n\n'.join(ed + [marker])

def process_children(stage):
    out = []
    for el in stage.children:
        if not isinstance(el, Tag):
            continue
        cls = el.get('class', [])
        if el.name == 'script':
            if is_quiz(el):
                out.append(render_quiz(el))
            continue
        if 'stage-header' in cls:
            continue
        if el.name == 'h3':
            out.append('### ' + clean_md(md_inline(el)))
        elif el.name == 'h4':
            out.append('#### ' + clean_md(md_inline(el)))
        elif el.name == 'p':
            if 'subhead-sub' in cls:
                out.append('*' + clean_md(md_inline(el)) + '*')
            else:
                out.append(clean_md(md_inline(el)))
        elif el.name in ('ul', 'ol'):
            out.append(list_md(el))
        elif el.name == 'table':
            out.append(table_md(el))
        elif el.name == 'div' and 'callout' in cls:
            out.append(render_callout(el))
        elif el.name == 'div' and 'qa-list' in cls:
            qs = [clean_md(md_inline(q)).replace('\n', ' ') for q in el.find_all(class_='qa-q')]
            out.append('\n'.join(f'{i}. {q}' for i, q in enumerate(qs, 1)))
        elif el.name == 'div' and any(re.search(r'(-grid|-cards)$', c) for c in cls) and not (set(cls) & SKIP_GRIDS):
            out.append(render_cards(el))
        elif el.name == 'div' and ('timeline' in cls or el.find(class_='timeline')):
            out.append(render_timeline(el))
        elif el.name == 'div' and any(c in cls for c in (
                'canvas-wrap', 'canvas-toolbar', 'game-area', 'sim', 'johnstone-wrap',
                'graph-wrap', 'atom-svg', 'atom-3d-wrap', 'sciences-svg-wrap', 'pc-svg',
                'reaction-canvas', 'balance-wrap', 'scale-wrap', 'quark-wrap', 'entropy',
                'diagram-wrap', 'blackbox')) or el.find(['canvas', 'svg']):
            out.append(render_sim(el))
        elif el.name == 'div':
            t = clean_md(md_inline(el)).replace('\n', ' ')
            if t:
                out.append(t)
        else:
            t = clean_md(md_inline(el))
            if t:
                out.append(t)
    return [x for x in out if x]


def convert(module_dir, run=None):
    """Рендерит lesson.md для каждого урока модуля и отдаёт результат в `run`."""
    meta = json.load(open(os.path.join(module_dir, 'module.json'), encoding='utf-8'))
    lessons = {L['file']: L for L in meta['lessons']}
    for lesson in meta['order']:
        body = open(os.path.join(module_dir, lesson, 'body.html'), encoding='utf-8').read()
        soup = BeautifulSoup(body, 'html.parser')
        hero = soup.find('header', class_='hero')
        h1 = clean_md(md_inline(hero.find('h1'))) if hero and hero.find('h1') else meta['title']
        badge = clean_md(md_inline(hero.find(class_='badge'))) if hero and hero.find(class_='badge') else ''
        hero_p = hero.find('p') if hero else None
        digest = ''
        if hero_p:
            digest = re.split(r'\s·\s*(Вход|Урок|Тест|Финал|Итог)', md_inline(hero_p))[0]
            digest = clean_md(digest)
        L = lessons.get(lesson, {})
        md = [f'# {meta["title"]}', '', f'## {L.get("title", lesson)}', '']
        if badge:
            md.append(f'> {badge}')
        if digest:
            md.append('')
            md.append(digest)
        md.append('')
        md.append('---')
        md.append('')
        md.extend(render_intro_md(meta, lesson, L))
        for stage in soup.find_all('div', class_='stage'):
            st = stage.find(class_='stage-title')
            ss = stage.find(class_='stage-subtitle')
            if st:
                md.append('## ' + clean_md(md_inline(st)))
            if ss:
                md.append('')
                md.append('*' + clean_md(md_inline(ss)) + '*')
            md.append('')
            blocks = process_children(stage)
            md.append('\n\n'.join(blocks))
            md.append('')
        md.extend(render_practical_md(L))
        md.extend(render_homework_md(L))
        text = '\n'.join(md)
        text = re.sub(r'[ \t]{2,}', ' ', text)
        text = re.sub(r'\n{3,}', '\n\n', text).strip() + '\n'
        if run:
            run(os.path.join(module_dir, lesson, 'lesson.md'), text,
                module_dir.split('/')[-1], lesson)


def main():
    """Экспорт lesson.md из канона. ПО УМОЛЧАНИЮ НЕ ПЕРЕЗАПИСЫВАЕТ существующие
    файлы (lesson.md — источник истины, правит человек/агент).
      --missing  создать только отсутствующие lesson.md (по умолчанию)
      --force    перезаписать все (осторожно: сотрёт правки)
      --check    только показать расхождения md и канона, ничего не писать
    """
    import argparse
    ap = argparse.ArgumentParser(description='Export lesson.md from canon (non-destructive).')
    ap.add_argument('--force', action='store_true', help='перезаписать все lesson.md')
    ap.add_argument('--check', action='store_true', help='показать расхождения, не писать')
    args = ap.parse_args()

    os.chdir(ROOT)
    stats = {'written': 0, 'skipped': 0, 'drift': 0}

    def run(path, text, mod, lesson):
        exists = os.path.isfile(path)
        old = open(path, encoding='utf-8').read() if exists else None
        if args.check:
            if exists and old != text:
                stats['drift'] += 1
                print(f'DRIFT {mod}/{lesson}: lesson.md отличается от канона')
            return
        if args.force or not exists:
            open(path, 'w', encoding='utf-8').write(text)
            stats['written'] += 1
            print(f'WROTE {mod}/{lesson}')
        else:
            stats['skipped'] += 1

    for m in range(1, 7):
        convert(f'src/lessons/module_{m}', run)

    if args.check:
        print(f"check: {stats['drift']} расхождений (правки в lesson.md — источник, канон надо догнать)")
    else:
        print(f"export: записано {stats['written']}, пропущено существующих {stats['skipped']}")


if __name__ == '__main__':
    main()
