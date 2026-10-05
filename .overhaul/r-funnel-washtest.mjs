/* Isolated test of D151 on `10 · First Principle`'s warm bloom.
   The canvas states  left:50% top:60 220x200  border-radius:50%
   background: radial-gradient(closest-side, rgba(255,236,196,0.3), rgba(255,236,196,0) 74%)
   filter: blur(7px)
   Three panels, same ground: the canvas's own CSS; the app's unblurred two-stop
   SVG radial; the same radial under a real FeGaussianBlur(7) with a 3-sigma
   userSpaceOnUse region. Nothing is excluded — the whole panel is sampled. */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const BG = 'rgb(30,29,27)';
const panel = (inner) => `<div style="position:relative;width:320px;height:300px;background:${BG};overflow:hidden">${inner}</div>`;
const css = `<div style="position:absolute;left:50px;top:50px;width:220px;height:200px;border-radius:50%;background:radial-gradient(closest-side, rgba(255,236,196,0.3), rgba(255,236,196,0) 74%);filter:blur(7px)"></div>`;
const svgPlain = `<svg width="220" height="200" style="position:absolute;left:50px;top:50px"><defs><radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFECC4" stop-opacity="0.3"/><stop offset="0.74" stop-color="#FFECC4" stop-opacity="0"/></radialGradient></defs><ellipse cx="110" cy="100" rx="110" ry="100" fill="url(#g1)"/></svg>`;
const svgBlur = `<svg width="262" height="242" style="position:absolute;left:29px;top:29px"><defs><radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFECC4" stop-opacity="0.3"/><stop offset="0.74" stop-color="#FFECC4" stop-opacity="0"/></radialGradient><filter id="fb" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" x="0" y="0" width="262" height="242"><feGaussianBlur stdDeviation="7"/></filter></defs><ellipse cx="131" cy="121" rx="110" ry="100" fill="url(#g2)" filter="url(#fb)"/></svg>`;
const html = `<!doctype html><html><body style="margin:0;background:${BG}">${panel(css)}${panel(svgPlain)}${panel(svgBlur)}</body></html>`;
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run'] });
const ctx = await b.newContext({ viewport: { width: 320, height: 900 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.setContent(html);
await p.screenshot({ path: '.overhaul/shots/rfunnel/wash.png' });
await b.close();
