"""Zoom: python3 zoom.py <name> x y w h [scale]  (points) → pixel-diff/out/<name>.zoom.png: design over app over mask."""
import sys
from PIL import Image
name, x, y, w, h = sys.argv[1], *map(float, sys.argv[2:6])
k = float(sys.argv[6]) if len(sys.argv) > 6 else 2
side = Image.open(f'pixel-diff/out/{name}.side.png')
W = (side.width - 24) // 3
box = lambda o: (int(o + x * 3), int(y * 3), int(o + (x + w) * 3), int((y + h) * 3))
parts = [side.crop(box(o)) for o in (0, W + 12, 2 * (W + 12))]
pw, ph = parts[0].size
out = Image.new('RGB', (int(pw * k), int(ph * k) * 3 + 8), (255, 0, 255))
for i, p in enumerate(parts):
    out.paste(p.resize((int(pw * k), int(ph * k)), Image.NEAREST), (0, i * (int(ph * k) + 4)))
out.save(f'pixel-diff/out/{name}.zoom.png')
