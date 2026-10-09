#!/usr/bin/env node
/**
 * Renders VICI's app icon set from the laurel (B6, D451 in
 * .overhaul/decisions/deploy-wp4.md):
 *
 *   assets/images/icon.png                     1024 · white laurel on #0D0D0D, opaque (no alpha)
 *   assets/images/android-icon-foreground.png  1024 · white laurel, transparent, inside the 66dp safe zone
 *   assets/images/android-icon-background.png  1024 · #0D0D0D, opaque
 *   assets/images/android-icon-monochrome.png  1024 · white laurel, transparent (Android 13 themed icon)
 *   assets/images/splash-icon.png              1024 · white laurel filling the square, transparent
 *   assets/images/favicon.png                    48 · white laurel on #0D0D0D, opaque
 *
 * The mark is drawn the way the app draws it (`components/mono/LaurelMark`):
 * the 280 × 252 `laurel-mark.webp` box stretched to a square, every painted
 * pixel white. Where the designer's 1254-px original of that artwork is still
 * in the repo (`tideline UI/project/uploads/laurel2-src.png`), its ink is
 * placed exactly where the webp's ink sits in that box, so the 1024 icon is
 * not an upscale of a 280-px raster; otherwise the webp itself is used.
 *
 * Usage: node scripts/overhaul/render-icons.mjs
 * Needs playwright-core (a dev dependency already), Google Chrome, and Node
 * 22.2 or later (for `zlib.crc32`). The PNGs are written by `encodePng` below
 * on Node's own zlib, so nothing the project does not declare is imported.
 */

import { Buffer } from 'node:buffer';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateSync } from 'node:zlib';

import { chromium } from 'playwright-core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'assets', 'images');
const MARK = join(ROOT, 'assets', 'images', 'laurel-mark.webp');
const HIRES = join(ROOT, 'tideline UI', 'project', 'uploads', 'laurel2-src.png');
const GROUND = '#0D0D0D';

/** name, canvas size, laurel square size, opaque ground? */
const TARGETS = [
  // ~52 % of the tile, the weight of a single-glyph iOS icon
  { file: 'icon.png', size: 1024, mark: 660, ground: true },
  // 540/1024 of 108dp: the ink's diagonal stays inside the 66dp safe circle
  { file: 'android-icon-foreground.png', size: 1024, mark: 540, ground: false },
  { file: 'android-icon-background.png', size: 1024, mark: 0, ground: true },
  { file: 'android-icon-monochrome.png', size: 1024, mark: 540, ground: false },
  // the splash plugin sizes it (imageWidth), so the mark fills its square
  { file: 'splash-icon.png', size: 1024, mark: 1024, ground: false },
  { file: 'favicon.png', size: 48, mark: 40, ground: true },
];

const dataUrl = (path, type) => `data:${type};base64,${readFileSync(path).toString('base64')}`;

// encodePng:start
/**
 * An 8-bit PNG from straight (not premultiplied) RGBA pixels, as a canvas's
 * `getImageData` gives them. `opaque` writes RGB with no alpha channel (colour
 * type 2), which App Store icons require; otherwise RGBA (type 6). Each row
 * uses the Up filter, which suits flat tiles, and the whole image is one
 * deflated IDAT.
 */
function encodePng(rgba, width, height, opaque) {
  const channels = opaque ? 3 : 4;
  const stride = width * channels;
  const rows = Buffer.alloc((stride + 1) * height);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const line = Buffer.alloc(stride);
    for (let x = 0; x < width; x++) {
      const s = (y * width + x) * 4;
      const d = x * channels;
      line[d] = rgba[s];
      line[d + 1] = rgba[s + 1];
      line[d + 2] = rgba[s + 2];
      if (!opaque) line[d + 3] = rgba[s + 3];
    }
    const at = y * (stride + 1);
    rows[at] = 2; // filter: Up
    for (let i = 0; i < stride; i++) rows[at + 1 + i] = (line[i] - prev[i]) & 0xff;
    prev = line;
  }
  const chunk = (type, data) => {
    const head = Buffer.alloc(4);
    head.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
    const tail = Buffer.alloc(4);
    tail.writeUInt32BE(crc32(body));
    return Buffer.concat([head, body, tail]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = opaque ? 2 : 6; // colour type
  // compression, filter method and interlace are all 0
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
// encodePng:end

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  const rendered = await page.evaluate(
    async ({ mark, hires, targets, ground }) => {
      const load = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('image failed to load'));
          img.src = src;
        });
      const canvas = (w, h) => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        return [c, ctx];
      };
      /** Bounding box of the painted pixels (alpha > 128, and dark where the art is ink-on-transparent). */
      const inkBox = (img, darkOnly) => {
        const [, ctx] = canvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, img.width, img.height).data;
        let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
        for (let y = 0; y < img.height; y++)
          for (let x = 0; x < img.width; x++) {
            const i = (y * img.width + x) * 4;
            const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
            if (d[i + 3] > 128 && (!darkOnly || lum < 128)) {
              x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
            }
          }
        return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
      };

      const webp = await load(mark);
      const webpInk = inkBox(webp, false);
      // the ink's place in the stretched square, as fractions of the webp box
      const place = { x: webpInk.x / webp.width, y: webpInk.y / webp.height, w: webpInk.w / webp.width, h: webpInk.h / webp.height };

      // The white mask: alpha from the art's ink. The hi-res original carries a
      // light fringe from its cut-out, so its coverage is alpha × darkness.
      let source = null;
      if (hires) {
        const img = await load(hires);
        const box = inkBox(img, true);
        const [c, ctx] = canvas(box.w, box.h);
        ctx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
        const px = ctx.getImageData(0, 0, box.w, box.h);
        const d = px.data;
        for (let i = 0; i < d.length; i += 4) {
          const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
          const dark = Math.min(1, Math.max(0, (200 - lum) / 110));
          d[i + 3] = Math.round(d[i + 3] * dark);
          d[i] = d[i + 1] = d[i + 2] = 255;
        }
        ctx.putImageData(px, 0, 0);
        source = { img: c, ink: true };
      } else {
        const [c, ctx] = canvas(webp.width, webp.height);
        ctx.drawImage(webp, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, webp.width, webp.height);
        source = { img: c, ink: false };
      }

      const out = [];
      for (const t of targets) {
        const [, ctx] = canvas(t.size, t.size);
        if (t.ground) {
          ctx.fillStyle = ground;
          ctx.fillRect(0, 0, t.size, t.size);
        }
        if (t.mark > 0) {
          const left = (t.size - t.mark) / 2;
          const top = (t.size - t.mark) / 2;
          if (source.ink) {
            ctx.drawImage(source.img, left + place.x * t.mark, top + place.y * t.mark, place.w * t.mark, place.h * t.mark);
          } else {
            ctx.drawImage(source.img, left, top, t.mark, t.mark);
          }
        }
        const { data } = ctx.getImageData(0, 0, t.size, t.size);
        let bin = '';
        for (let i = 0; i < data.length; i += 0x8000) bin += String.fromCharCode.apply(null, data.subarray(i, i + 0x8000));
        out.push({ file: t.file, size: t.size, ground: t.ground, rgba: btoa(bin) });
      }
      return { out, hires: !!hires };
    },
    {
      mark: dataUrl(MARK, 'image/webp'),
      hires: existsSync(HIRES) ? dataUrl(HIRES, 'image/png') : null,
      targets: TARGETS,
      ground: GROUND,
    },
  );

  for (const r of rendered.out) {
    const rgba = Buffer.from(r.rgba, 'base64');
    // an opaque tile is written without an alpha channel (App Store icons must not carry one)
    const file = encodePng(rgba, r.size, r.size, r.ground);
    writeFileSync(join(OUT, r.file), file);
    console.log(`${r.file}  ${r.size}×${r.size}  ${r.ground ? 'RGB' : 'RGBA'}  ${(file.length / 1024).toFixed(1)} KB`);
  }
  console.log(rendered.hires ? 'laurel: hi-res original' : 'laurel: laurel-mark.webp');
} finally {
  await browser.close();
}
