// The dev harness's remote: the app (src/dev/HarnessDriver.tsx) polls GET
// /target; the capture scripts POST /target with { screen, state, extra } or
// { route, seed, clock }. GET /seed/<name> hands the app a stored account
// (pixel-diff/seeds/<name>.json, scripts/vici-ui-2/capture-seeds.mjs).
//
//   node scripts/vici-ui-2/harness-server.mjs      (port 8099)
import fs from 'node:fs';
import http from 'node:http';

let target = { n: 0, screen: '', state: '' };
http
  .createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/target') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        target = { ...JSON.parse(body), n: Date.now() };
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(target));
      });
      return;
    }
    const seed = req.url.match(/^\/seed\/([\w.-]+)$/);
    if (seed) {
      const file = `pixel-diff/seeds/${decodeURIComponent(seed[1])}.json`;
      if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(fs.readFileSync(file));
      return;
    }
    if (req.url === '/target') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(target));
      return;
    }
    res.writeHead(404);
    res.end();
  })
  .listen(8099, () => console.log('harness server on 8099'));
