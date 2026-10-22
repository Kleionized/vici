"""Review sheets: python3 review.py <out.png> <name> [<name> ...]
One row per comparison: design | app | mask from pixel-diff/out/<name>.side.png, at 1/5 scale,
labelled with the name and the diff share."""
import sys, json, os
from PIL import Image, ImageDraw
out, names = sys.argv[1], sys.argv[2:]
S = int(os.environ.get("SCALE", "5"))
tiles = []
for n in names:
    p = f'pixel-diff/out/{n}.side.png'
    if not os.path.exists(p): continue
    im = Image.open(p)
    im = im.resize((im.width // S, im.height // S), Image.BILINEAR)
    pct = json.load(open(f'pixel-diff/out/{n}.json'))['pct'] if os.path.exists(f'pixel-diff/out/{n}.json') else 0
    tiles.append((f'{n[:52]}  {pct:.3f}%', im))
if not tiles: sys.exit('nothing to review')
cols = int(os.environ.get("COLS", "2"))
w, h = tiles[0][1].size
sheet = Image.new('RGB', (cols * (w + 10), ((len(tiles) + cols - 1) // cols) * (h + 16)), (255, 255, 255))
d = ImageDraw.Draw(sheet)
for i, (label, im) in enumerate(tiles):
    x, y = (i % cols) * (w + 10), (i // cols) * (h + 16)
    d.text((x + 2, y + 2), label, fill=(0, 0, 0))
    sheet.paste(im, (x, y + 14))
sheet.save(out)
print(out, len(tiles))
