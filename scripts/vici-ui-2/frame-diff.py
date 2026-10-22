"""Token diff of one artboard's markup between two bundles:
python3 frame-diff.py <old.dc.html> <new.dc.html> <screen label>"""
import re, sys, difflib
def frame(path, screen):
    s = open(path).read()
    i = s.index(f'<div data-screen-label="{screen}"')
    j = s.find('<div data-screen-label=', i + 10)
    return s[i:j if j > 0 else len(s)]
a, b = frame(sys.argv[1], sys.argv[3]), frame(sys.argv[2], sys.argv[3])
tok = lambda s: re.findall(r'[A-Za-z#][\w#.%-]*:?|\d+(?:\.\d+)?(?:px)?|[^\s\w]', s)
ta, tb = tok(a), tok(b)
sm = difflib.SequenceMatcher(None, ta, tb, autojunk=False)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op == 'equal': continue
    ctx = ' '.join(ta[max(0, i1 - 8):i1])
    print(f'{op:7} …{ctx[-70:]} ⟨{" ".join(ta[i1:i2])[:160]}⟩ → ⟨{" ".join(tb[j1:j2])[:160]}⟩')
