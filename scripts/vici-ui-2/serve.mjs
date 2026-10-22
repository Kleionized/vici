// Static server for the "Vici UI 2" design bundle, so the .dc.html canvases
// can load their sibling scripts, JSON and images over http.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] ?? 'Vici UI 2/project');
const PORT = Number(process.argv[3] ?? 4791);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.jsx': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.css': 'text/css' };

export function serve(root = ROOT, port = PORT) {
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(root, p);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(port, () => r(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) serve().then(() => console.log(`serving ${ROOT} on ${PORT}`));
