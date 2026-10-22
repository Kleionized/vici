// Renders every solid glyph (src/components/mono/glyphs.tsx) to one PNG, to look at.
//   node scripts/copy/glyph-sheet.mjs <out.png>
import fs from 'node:fs';
import ts from 'typescript';
import { webkit } from 'playwright-core';

let src = fs.readFileSync('src/components/mono/glyphs.tsx', 'utf8');
src = src.replace(/^import .*$/gm, '').replace(/\/\*\* One solid pictogram[\s\S]*$/, '');
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
const cells = Object.entries(mod.GLYPHS)
  .map(([name, parts]) => `<div><svg width="72" height="72" viewBox="0 0 24 24">${parts.map((p) => `<path d="${p.d}" fill="#F2F0EC" fill-rule="${p.even ? 'evenodd' : 'nonzero'}"/>`).join('')}</svg><svg width="24" height="24" viewBox="0 0 24 24">${parts.map((p) => `<path d="${p.d}" fill="#F2F0EC" fill-rule="${p.even ? 'evenodd' : 'nonzero'}"/>`).join('')}</svg><p>${name}</p></div>`)
  .join('');
const html = `<body style="background:#0D0D0D;color:#9B968E;font:12px sans-serif;display:flex;flex-wrap:wrap;gap:16px;padding:16px;width:760px">${cells}<style>div{width:110px;display:flex;flex-direction:column;align-items:center;gap:6px}p{margin:0}</style></body>`;
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.screenshot({ path: process.argv[2], fullPage: true });
await browser.close();
