#!/usr/bin/env node
/**
 * Serve the split design frames so a frame can be measured in a browser the
 * same way the running app is.
 *
 * `GET /f/<bundle>/<frameFile>` wraps one split frame in a standalone page:
 * the canvas's own <helmet> styles, a <base> pointing at the bundle's project
 * folder so `laurel-mark.webp` and `noise.png` resolve, and the frame pinned at
 * 0,0 so `getBoundingClientRect()` reports canvas coordinates directly.
 *
 * `GET /i/<bundle>` lists a bundle's frames.
 *
 * Usage: node scripts/overhaul/serve.mjs [port]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.argv[2] ?? 8097);
const ROOT = process.cwd();
const SPLIT = path.join(ROOT, '.overhaul', 'final');
const PROJECT = 'Vici Overhaul/project';

const LATO_FILE = { '400normal': '400Regular/Lato_400Regular.ttf', '400italic': '400Regular_Italic/Lato_400Regular_Italic.ttf', '700normal': '700Bold/Lato_700Bold.ttf', '700italic': '700Bold_Italic/Lato_700Bold_Italic.ttf', '900normal': '900Black/Lato_900Black.ttf', '900italic': '900Black_Italic/Lato_900Black_Italic.ttf', '300normal': '300Light/Lato_300Light.ttf' };
/**
 * Exactly the faces the canvas's own Google Fonts link requests, no more. That
 * matters: Email Login asks for `ital,wght@0,400;0,700;0,900;1,700`, so a frame
 * that sets `font-style:italic; font-weight:400` (the medallion quotes) renders
 * in the designer's browser as **700 italic** — style is matched before weight
 * and 700 is the only italic there is. Serving a 400 italic here would hide that.
 */
function latoFaces(helmet) {
  const m = helmet.match(/family=Lato:([^&"]+)/);
  if (!m) return '';
  const [axes, list] = decodeURIComponent(m[1]).split('@');
  const faces = list.split(';').map((t) => {
    const v = t.split(',');
    return axes.startsWith('ital') ? [Number(v[1]), v[0] === '1' ? 'italic' : 'normal'] : [Number(v[0]), 'normal'];
  });
  return `<style>${faces.map(([w, st]) => `@font-face{font-family:'Lato';src:url('/font/${LATO_FILE[w + st]}') format('truetype');font-weight:${w};font-style:${st};font-display:block;}`).join('')}</style>`;
}

const TYPES = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.js': 'text/javascript', '.html': 'text/html', '.txt': 'text/plain' };

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    try {
      if (url.startsWith('/f/')) {
        const rest = url.slice(3);
        const i = rest.indexOf('/');
        const bundle = rest.slice(0, i);
        const file = rest.slice(i + 1);
        const frame = fs.readFileSync(path.join(SPLIT, bundle, file), 'utf8');
        const helmetPath = path.join(SPLIT, bundle, '_helmet.html');
        // The canvas pulls Lato from Google Fonts. The frame is served with the
        // very TTFs the app bundles (@expo-google-fonts/lato) instead, so a diff
        // between the two sides can never be a difference between two copies of
        // the font, and a capture never races a network font load.
        const raw = fs.existsSync(helmetPath) ? fs.readFileSync(helmetPath, 'utf8') : '';
        const helmet = raw.replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>/g, '') + latoFaces(raw);
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(`<!doctype html><html><head><meta charset="utf-8"><base href="/p/">${helmet}
<style>html,body{margin:0;padding:0;background:#fff}#frame{position:absolute;left:0;top:0}
#frame > [data-screen-label]{box-shadow:none !important;margin:0 !important}</style>
</head><body><div id="frame">${frame}</div></body></html>`);
        return;
      }
      if (url.startsWith('/font/')) {
        const p = path.join(ROOT, 'node_modules/@expo-google-fonts/lato', url.slice(6));
        res.writeHead(200, { 'content-type': 'font/ttf', 'access-control-allow-origin': '*' });
        res.end(fs.readFileSync(p));
        return;
      }
      if (url.startsWith('/p/')) {
        const p = path.join(ROOT, PROJECT, url.slice(3));
        res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' });
        res.end(fs.readFileSync(p));
        return;
      }
      if (url === '/mock-selection.json') {
        res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
        res.end(fs.readFileSync('.overhaul/mock-selection.json'));
        return;
      }
      if (url === '/reseed.js') {
        res.writeHead(200, { 'content-type': 'text/javascript', 'access-control-allow-origin': '*' });
        res.end(fs.readFileSync('.overhaul/reseed.js'));
        return;
      }
      if (url === '/seed.json') {
        res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
        res.end(fs.readFileSync('.overhaul/seed.json'));
        return;
      }
      if (url === '/walk.js') {
        res.writeHead(200, { 'content-type': 'text/javascript', 'access-control-allow-origin': '*' });
        res.end(fs.readFileSync('.overhaul/walk.js'));
        return;
      }
      if (url === '/probe.js') {
        res.writeHead(200, { 'content-type': 'text/javascript', 'access-control-allow-origin': '*' });
        res.end(fs.readFileSync('.overhaul/probe.js'));
        return;
      }
      if (req.method === 'POST' && url === '/sig') {
        // A page POSTs its layout signature here and it lands on disk, so a
        // design frame and the app can be diffed in node instead of by eye.
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          const { name, rows } = JSON.parse(body);
          fs.mkdirSync('.overhaul/sig', { recursive: true });
          fs.writeFileSync(path.join('.overhaul', 'sig', name.replace(/[^A-Za-z0-9._-]/g, '_') + '.txt'), rows);
          res.writeHead(200, { 'access-control-allow-origin': '*' });
          res.end('ok');
        });
        return;
      }
      if (req.method === 'OPTIONS') {
        res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST,GET,OPTIONS' });
        res.end();
        return;
      }
      if (url.startsWith('/i/')) {
        const bundle = url.slice(3);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(fs.readFileSync(path.join(SPLIT, bundle, '_index.json')));
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(fs.readdirSync(SPLIT)));
    } catch (e) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end(String(e));
    }
  })
  .listen(PORT, () => console.log(`design frames on http://localhost:${PORT}`));
