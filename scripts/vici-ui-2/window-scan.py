"""Pass 3's cropped re-diff: every live row's diff mask scanned in 100 x 100 pt
windows (stride 25 pt), so a drawing, chart or card that is wrong inside a board
that is mostly right shows, however small a share of the whole frame it is.

    python3 scripts/vici-ui-2/window-scan.py [threshold%]

Prints, per row whose densest window passes the threshold, that window's share
of red (differing) pixels and where it is, densest first."""
import json, sys
import numpy as np
from PIL import Image

T = float(sys.argv[1]) if len(sys.argv) > 1 else 4.0
S, WIN, STEP = 3, 100, 25
rows = json.load(open('scripts/vici-ui-2/ledger.json'))['rows']
out = []
for r in rows:
    if r['status'] in ('SUPERSEDED',) or 'spec only' in (r.get('note') or ''):
        continue
    a = np.asarray(Image.open(f"pixel-diff/out/{r['id']}.mask.png").convert('RGB')).astype(np.int16)
    red = ((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 0)).astype(np.int32)
    # status bar and home indicator are not compared (D2)
    red[: 54 * S] = 0
    red[-34 * S :] = 0
    ii = red.cumsum(0).cumsum(1)
    ii = np.pad(ii, ((1, 0), (1, 0)))
    w, st = WIN * S, STEP * S
    H, W = red.shape
    best = (0.0, 0, 0)
    for y in range(0, max(1, H - w + 1), st):
        for x in range(0, max(1, W - w + 1), st):
            n = ii[y + w, x + w] - ii[y, x + w] - ii[y + w, x] + ii[y, x]
            share = 100 * n / (w * w)
            if share > best[0]:
                best = (share, x // S, y // S)
    if best[0] >= T:
        out.append((best[0], r['id'], best[1], best[2], r.get('note') or ''))
for share, rid, x, y, note in sorted(out, reverse=True):
    print(f"{share:6.2f} %  {rid[:60]:60} at x{x} y{y}  {note[:60]}")
print(len(out), 'rows at or above', T, '%')
