"""Horizontal drift along a text line: python3 drift.py <row id> <y0 pt> <y1 pt> [x0 pt] [x1 pt]
Splits the band into 30-pt windows and reports, per window, the shift (device px) that best
aligns the app's column-ink profile with the design's."""
import sys
import numpy as np
from PIL import Image
rid, y0, y1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
x0 = float(sys.argv[4]) if len(sys.argv) > 4 else 0
x1 = float(sys.argv[5]) if len(sys.argv) > 5 else 393
D = np.asarray(Image.open(f'pixel-diff/design/{rid}.png').convert('L'), dtype=float)
A = np.asarray(Image.open(f'pixel-diff/app/{rid}.png').convert('L'), dtype=float)
band = slice(int(y0 * 3), int(y1 * 3))
pd, pa = D[band].sum(0), A[band].sum(0)
rowsd, rowsa = D[:, int(x0*3):int(x1*3)][band].sum(1), A[:, int(x0*3):int(x1*3)][band].sum(1)
def best(a, b, r=8):
    errs = [(np.abs(a[r:-r] - np.roll(b, s)[r:-r]).sum(), s) for s in range(-r, r + 1)]
    return min(errs)[1]
print('vertical shift (device px, app→design):', best(rowsd, rowsa))
for wx in range(int(x0), int(x1), 30):
    s = slice(wx * 3, min(int(x1), wx + 30) * 3)
    if pd[s].std() < 1: continue
    print(f'x {wx:3d}-{wx+30:3d}: shift {best(pd[s], pa[s])}')
