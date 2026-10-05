/* Did removing D010's 0.42 midpoint make the bloom's CORE worse, or only its
   ring better? Four panels on the same ground, all sampled with nothing masked:
     1 the canvas's own CSS (closest-side ramp under blur(7px))
     2 the app BEFORE the fix pass — three stops, 0.37 @ 0.126, unblurred
     3 the app AFTER  the fix pass — two stops, unblurred
     4 what D151 asks for — two stops under a real FeGaussianBlur(7) */
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const BG = 'rgb(30,29,27)';
const p = (inner) => `<div style="position:relative;width:320px;height:300px;background:${BG};overflow:hidden">${inner}</div>`;
const css = `<div style="position:absolute;left:50px;top:50px;width:220px;height:200px;border-radius:50%;background:radial-gradient(closest-side, rgba(255,236,196,0.3), rgba(255,236,196,0) 74%);filter:blur(7px)"></div>`;
const svg = (id, stops, blur) => `<svg width="${blur ? 262 : 220}" height="${blur ? 242 : 200}" style="position:absolute;left:${blur ? 29 : 50}px;top:${blur ? 29 : 50}px"><defs><radialGradient id="${id}" cx="50%" cy="50%" r="50%">${stops}</radialGradient>${blur ? `<filter id="${id}f" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" x="0" y="0" width="262" height="242"><feGaussianBlur stdDeviation="7"/></filter>` : ''}</defs><ellipse cx="${blur ? 131 : 110}" cy="${blur ? 121 : 100}" rx="110" ry="100" fill="url(#${id})"${blur ? ` filter="url(#${id}f)"` : ''}/></svg>`;
const S2 = `<stop offset="0" stop-color="#FFECC4" stop-opacity="0.3"/><stop offset="0.74" stop-color="#FFECC4" stop-opacity="0"/>`;
const S3 = `<stop offset="0" stop-color="#FFECC4" stop-opacity="0.3"/><stop offset="0.37" stop-color="#FFECC4" stop-opacity="0.126"/><stop offset="0.74" stop-color="#FFECC4" stop-opacity="0"/>`;
const html = `<!doctype html><html><body style="margin:0;background:${BG}">${p(css)}${p(svg('a', S3, false))}${p(svg('b', S2, false))}${p(svg('c', S2, true))}</body></html>`;
const br = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run'] });
const ctx = await br.newContext({ viewport: { width: 320, height: 1200 }, deviceScaleFactor: 2 });
const pg = await ctx.newPage();
await pg.setContent(html);
await pg.screenshot({ path: '.overhaul/shots/rfunnel/wash2.png' });
await br.close();
