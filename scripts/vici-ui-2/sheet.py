"""Contact sheet: python3 sheet.py out.png cols width img1 img2 ... (labels are file names)."""
import sys, os
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
files = sys.argv[4:]
ims = []
for f in files:
    im = Image.open(f).convert('RGB')
    h = round(im.height * w / im.width)
    ims.append((os.path.basename(f)[:-4], im.resize((w, h), Image.LANCZOS)))
rows = (len(ims) + cols - 1) // cols
cellh = max(i.height for _, i in ims) + 16
sheet = Image.new('RGB', (cols * (w + 8), rows * cellh), (200, 200, 200))
d = ImageDraw.Draw(sheet)
for k, (name, im) in enumerate(ims):
    x, y = (k % cols) * (w + 8), (k // cols) * cellh
    d.text((x + 2, y + 1), name[-48:], fill=(0, 0, 0))
    sheet.paste(im, (x, y + 14))
sheet.save(out)
