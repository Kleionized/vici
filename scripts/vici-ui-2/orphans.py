"""Modules under src/ that nothing imports (routes under src/app are entry points): python3 orphans.py"""
import re, os
root = 'src'
files = [os.path.join(dp, f) for dp, dn, fn in os.walk(root) for f in fn if f.endswith(('.ts', '.tsx'))]
text = {f: open(f).read() for f in files}
for f in sorted(files):
    if f.startswith('src/app/'): continue
    alias = '@/' + re.sub(r'\.(tsx?)$', '', f[len(root) + 1:])
    bare = re.sub(r'\.(tsx?)$', '', f)
    used = False
    for g, s in text.items():
        if g == f: continue
        for m in re.finditer(r"from '([^']+)'|require\('([^']+)'\)|import\('([^']+)'\)", s):
            spec = m.group(1) or m.group(2) or m.group(3)
            if spec in (alias, alias.rsplit('/index', 1)[0]): used = True; break
            if spec.startswith('.'):
                r = os.path.normpath(os.path.join(os.path.dirname(g), spec))
                if r == bare or r + '/index' == bare: used = True; break
        if used: break
    if not used: print(f)
