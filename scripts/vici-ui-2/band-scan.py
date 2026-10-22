"""Pass 3's cross-screen check: the furniture every board shares — the nav row
(54–102), the bottom pill's band (746–804) and the tab bar (740–818, where a
board has one) — diffed band by band across every live row, so one board whose
nav or pill sits differently from the rest shows even when its whole-frame share
is small.

    python3 scripts/vici-ui-2/band-scan.py [threshold%]"""
import json, sys
import numpy as np
from PIL import Image

T = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
S = 3
BANDS = {'nav': (54, 102), 'foot': (740, 818)}
rows = json.load(open('scripts/vici-ui-2/ledger.json'))['rows']
hits = {k: [] for k in BANDS}
for r in rows:
    if r['status'] == 'SUPERSEDED' or 'spec only' in (r.get('note') or ''):
        continue
    a = np.asarray(Image.open(f"pixel-diff/out/{r['id']}.mask.png").convert('RGB'))
    red = (a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 0)
    for k, (y0, y1) in BANDS.items():
        share = 100 * red[y0 * S : y1 * S].mean()
        if share >= T:
            hits[k].append((share, r['id'], r.get('note') or ''))
for k, v in hits.items():
    print(f'== {k}: {len(v)} rows at or above {T} %')
    for share, rid, note in sorted(v, reverse=True)[:40]:
        print(f'{share:6.2f} %  {rid[:60]:60} {note[:60]}')
