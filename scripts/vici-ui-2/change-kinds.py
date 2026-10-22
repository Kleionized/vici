"""For a static canvas in two bundles: which changed artboards changed only in their hero drawings,
and what else changed in the rest. python3 change-kinds.py <old> <new> [--detail]"""
import re, sys, difflib
def frames(path):
    s = open(path).read()
    out = {}
    for m in re.finditer(r'<div data-screen-label="([^"]*)"', s):
        out.setdefault(m.group(1), []).append(m.start())
    pos = sorted(p for v in out.values() for p in v)
    res = {}
    for name, ps in out.items():
        for k, p in enumerate(ps):
            i = pos.index(p)
            res[f'{name}#{k}' if len(ps) > 1 else name] = s[p:(pos[i + 1] if i + 1 < len(pos) else len(s))]
    return res
o, n = frames(sys.argv[1]), frames(sys.argv[2])
strip = lambda s: re.sub(r'<svg data-hero.*?</svg>', '', s, flags=re.S)
hero, other = [], []
for k in n:
    if k in o and o[k] != n[k]:
        (hero if strip(o[k]) == strip(n[k]) else other).append(k)
print(f'hero-only {len(hero)} · other {len(other)}')
for k in other:
    print('OTHER', k)
    if '--detail' in sys.argv:
        ta = re.findall(r'[^\s<>"]+', strip(o[k])); tb = re.findall(r'[^\s<>"]+', strip(n[k]))
        for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, ta, tb, autojunk=False).get_opcodes():
            if op != 'equal': print('    ', op, ' '.join(ta[i1:i2])[:150], '→', ' '.join(tb[j1:j2])[:150])
