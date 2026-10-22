"""Phase 1 inventory: open every file in `Vici UI 2`, record what it is, write specs/vici-ui-2/inventory.md."""
import hashlib, os, zipfile, re
from PIL import Image
ROOT = 'Vici UI 2'
rows = []
for dp, dn, fn in os.walk(ROOT):
    dn.sort()
    for f in sorted(fn):
        p = os.path.join(dp, f)
        rel = p[len(ROOT) + 1:]
        data = open(p, 'rb').read()
        h = hashlib.sha1(data).hexdigest()[:8]
        ext = os.path.splitext(f)[1].lower()
        info = ''
        if ext in ('.png', '.jpg', '.jpeg', '.webp') or f == '.thumbnail':
            try:
                im = Image.open(p); info = f'{im.width}×{im.height}'
            except Exception as e:
                info = 'not an image'
        elif ext in ('.html', '.js', '.jsx', '.json', '.txt', '.md'):
            text = data.decode('utf8', 'replace')
            info = f'{text.count(chr(10)) + 1} lines'
            m = re.search(r'data-screen-label', text)
            if ext == '.html': info += f', {len(re.findall("data-screen-label", text))} artboard templates'
        elif ext == '.docx':
            try:
                z = zipfile.ZipFile(p); x = z.read('word/document.xml').decode('utf8', 'replace')
                words = len(re.sub('<[^>]+>', ' ', x).split()); info = f'{words} words'
            except Exception:
                info = 'unreadable docx'
        else:
            info = f'{len(data)} bytes'
        top = rel.split('/')[1] if rel.count('/') >= 2 else ''
        if f.endswith('.dc.html'): cat = 'canvas (design)'
        elif top == 'uploads': cat = 'reference upload'
        elif top in ('ref', 'ref-stoic'): cat = 'reference image'
        elif top == 'screenshots': cat = 'designer QA capture'
        elif top == 'gen': cat = 'generator / generated data'
        elif top == 'exports': cat = 'export'
        elif f in ('sos-library.js', 'sos-viz.js', 'lesson-viz-v5.js', 'support.js', '_bbox.js', 'image-slot.js', 'ios-frame.jsx', 'taskgen-meta.js', 'taskgen-visuals.js', 'restyle-lessons.js'): cat = 'canvas script'
        elif ext in ('.png', '.webp') or f == '.thumbnail': cat = 'asset'
        elif f == 'viz-preview.html': cat = 'preview page (no artboards)'
        elif f == '.DS_Store': cat = 'system file'
        else: cat = 'content / notes'
        rows.append((rel, ext or f, len(data), info, cat, h))
out = ['# Vici UI 2 — file inventory', '', f'Every file under `Vici UI 2/`, opened by `scripts/vici-ui-2/inventory.py` ({len(rows)} files). Canvases are rendered artboard by artboard into the ledger; everything else is listed with what it is.', '', '| ✓ | file | size | contents | kind | sha1 |', '|---|---|---|---|---|---|']
for r in rows:
    out.append(f'| ✓ | `{r[0]}` | {r[2]:,} | {r[3]} | {r[4]} | {r[5]} |')
from collections import Counter
c = Counter(r[4] for r in rows)
out += ['', '## By kind', ''] + [f'- {k}: {v}' for k, v in sorted(c.items(), key=lambda x: -x[1])]
open('specs/vici-ui-2/inventory.md', 'w').write('\n'.join(out) + '\n')
print(len(rows), dict(c))
