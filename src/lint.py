#!/usr/bin/env python3
"""Lint уроков и модуля: канон, теги, id, JSON-тесты.

Usage: python3 src/lint.py module_1
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
COMPONENTS = json.load(open(os.path.join(SRC, 'shared', 'data', 'components.json'),
                            encoding='utf-8'))['components']
KNOWN_CLASSES = {c for comp in COMPONENTS for c in comp['classes']}
INLINE_STYLE = re.compile(r'style\s*=\s*"')
CLASS_ATTR = re.compile(r'class="([^"]*)"')


def iter_html(mod):
    mdir = os.path.join(SRC, 'lessons', mod)
    for lesson in sorted(os.listdir(mdir)):
        body = os.path.join(mdir, lesson, 'body.html')
        if os.path.isfile(body):
            yield lesson, open(body, encoding='utf-8').read()


def lint_body(lesson, body):
    errors, warns = [], []
    for attr in CLASS_ATTR.finditer(body):
        for cls in attr.group(1).split():
            if cls not in KNOWN_CLASSES:
                errors.append(f'{lesson}: неизвестный класс .{cls}')
    if INLINE_STYLE.search(body):
        errors.append(f'{lesson}: инлайн style запрещён')
    opens = len(re.findall(r'<div[\s>]', body)) - len(re.findall(r'</div>', body))
    if opens != 0:
        errors.append(f'{lesson}: дисбаланс <div> ({opens:+d})')
    secs = len(re.findall(r'<section[\s>]', body)) - len(re.findall(r'</section>', body))
    if secs != 0:
        errors.append(f'{lesson}: дисбаланс <section> ({secs:+d})')
    for island in re.finditer(
            r'<script type="application/json"[^>]*>(.*?)</script>', body, re.DOTALL):
        raw = island.group(1)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            errors.append(f'{lesson}: битый JSON-островок: {e}')
            continue
        for q in data.get('questions', []) if isinstance(data, dict) else []:
            t = q.get('type', 'single')
            if not q.get('why'):
                errors.append(f'{lesson}: вопрос без why: {q.get("q", "?")}')
            if t in ('single', 'multi'):
                opts = q.get('options', [])
                if len(opts) < 2:
                    errors.append(f'{lesson}: <2 вариантов: {q.get("q", "?")}')
                if t == 'single':
                    if not isinstance(q.get('correct'), int):
                        errors.append(f'{lesson}: single без correct: {q.get("q", "?")}')
                else:
                    if not isinstance(q.get('correct'), list) or not q['correct']:
                        errors.append(f'{lesson}: multi без correct[]: {q.get("q", "?")}')
            elif t == 'match':
                if len(q.get('left', [])) != len(q.get('correct', [])):
                    errors.append(f'{lesson}: match: left и correct[] разной длины')
    return errors, warns


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    mods = args or sorted(
        d for d in os.listdir(os.path.join(SRC, 'lessons'))
        if os.path.isdir(os.path.join(SRC, 'lessons', d)))
    failed = False
    for mod in mods:
        r = subprocess.run([sys.executable, os.path.join(SRC, 'build.py'), mod],
                           capture_output=True, text=True)
        out = r.stdout.strip()
        if r.returncode != 0 or 'FAIL' in out:
            failed = True
        print(out)
        for lesson, body in iter_html(mod):
            errors, warns = lint_body(lesson, body)
            for e in errors:
                failed = True
                print('ERROR', mod, e)
            for w in warns:
                print('WARN ', mod, w)
    print('LINT', 'FAIL' if failed else 'OK')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
