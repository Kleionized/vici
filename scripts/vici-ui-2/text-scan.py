"""Pass 3's shift-tolerant text check. pixelmatch (includeAA: false) counts
pixels it takes for antialiasing as equal, and thin grey text on the dark
ground reads to it as antialiasing — so a different word can score as noise.
Here every 40 x 40 pt window with ink in the design is compared with the app
at its best alignment within +-2 pt: the same text at a sub-point offset nearly
vanishes, different text does not, whatever pixelmatch called it.

    python3 scripts/vici-ui-2/text-scan.py [rowRegex] [threshold]

Prints rows whose worst window keeps more than `threshold` (default 0.35) of
the design's ink after alignment, worst first."""
import json, re, sys
import numpy as np
from PIL import Image

RX = re.compile(sys.argv[1] if len(sys.argv) > 1 else '.')
T = float(sys.argv[2]) if len(sys.argv) > 2 else 0.35
S, WIN, SHIFT = 3, 40, 6  # px at 3x: +-2 pt

def integral(a):
    return np.pad(a.cumsum(0).cumsum(1), ((1, 0), (1, 0)))

def boxsum(ii, w):
    return ii[w:, w:] - ii[:-w, w:] - ii[w:, :-w] + ii[:-w, :-w]

rows = json.load(open('scripts/vici-ui-2/ledger.json'))['rows']
out = []
for r in rows:
    if r['status'] == 'SUPERSEDED' or 'spec only' in (r.get('note') or '') or not RX.search(r['id']):
        continue
    d = np.asarray(Image.open(f"pixel-diff/design/{r['id']}.png").convert('L')).astype(np.float32)
    a = np.asarray(Image.open(f"pixel-diff/app/{r['id']}.png").convert('L')).astype(np.float32)
    H, W = d.shape
    d[: 54 * S] = a[: 54 * S] = 0
    d[-34 * S :] = a[-34 * S :] = 0
    # ink: how far each design pixel stands from its neighbourhood's ground (a 9 px median stand-in: a blurred copy)
    k = np.ones(9) / 9
    ground = np.apply_along_axis(lambda v: np.convolve(v, k, 'same'), 1, np.apply_along_axis(lambda v: np.convolve(v, k, 'same'), 0, d))
    ink = np.abs(d - ground)
    best = None
    for dy in range(-SHIFT, SHIFT + 1, 3):
        for dx in range(-SHIFT, SHIFT + 1, 3):
            sh = np.roll(np.roll(a, dy, 0), dx, 1)
            e = boxsum(integral(np.abs(d - sh)), WIN * S)
            best = e if best is None else np.minimum(best, e)
    inksum = boxsum(integral(ink), WIN * S)
    step = 10 * S
    best, inksum = best[::step, ::step], inksum[::step, ::step]
    ok = inksum > 3.0 * (WIN * S) ** 2  # windows with real ink only (a mean of 3 levels from the ground)
    if not ok.any():
        continue
    ratio = np.where(ok, best / (inksum + 1e-6), 0)
    i = np.unravel_index(np.argmax(ratio), ratio.shape)
    if ratio[i] > T:
        out.append((ratio[i], r['id'], i[1] * 10, i[0] * 10, r.get('note') or ''))
for s, rid, x, y, note in sorted(out, reverse=True):
    print(f'{s:5.2f}  {rid[:60]:60} at x{x} y{y}  {note[:60]}')
print(len(out), 'rows over', T)
