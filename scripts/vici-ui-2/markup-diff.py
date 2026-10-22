"""Which artboards of a static canvas changed between two bundles, by their markup:
python3 markup-diff.py <old.dc.html> <new.dc.html>"""
import re, sys
def frames(path):
    s = open(path).read()
    pos = [(m.start(), m.group(1)) for m in re.finditer(r'<div data-screen-label="([^"]*)"', s)]
    labels = re.findall(r'border-radius:8px; box-shadow:0 1px 2px rgba\(0,0,0,0.08\);">([^<]*)</div>\n<div data-screen-label', s)
    out = {}
    for i, (p, screen) in enumerate(pos):
        end = pos[i + 1][0] if i + 1 < len(pos) else len(s)
        key = f'{labels[i] if i < len(labels) else "?"} | {screen}'
        body = s[p:end]
        body = body[: body.rfind('<div style="display:flex; flex-direction:column; gap:18px; flex-shrink:0;">')] if '<div style="display:flex; flex-direction:column; gap:18px; flex-shrink:0;">' in body else body
        out[key] = body
    return out
o, n = frames(sys.argv[1]), frames(sys.argv[2])
same = [k for k in n if k in o and o[k] == n[k]]
changed = [k for k in n if k in o and o[k] != n[k]]
new = [k for k in n if k not in o]
dropped = [k for k in o if k not in n]
print(f'same {len(same)} · changed {len(changed)} · new {len(new)} · dropped {len(dropped)}')
for k in changed: print('CHANGED', k)
for k in new: print('NEW', k)
for k in dropped: print('DROPPED', k)
