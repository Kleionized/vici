// The WebKit side of the text lab (src/dev/TextLab.tsx): each string's width in Lato 400 16px.
import { webkit } from 'playwright-core';
import fs from 'node:fs';

const strings = JSON.parse(process.argv[2]);
const font = fs.readFileSync('node_modules/@expo-google-fonts/lato/400Regular/Lato_400Regular.ttf').toString('base64');
const browser = await webkit.launch();
const page = await browser.newPage();
await page.setContent(`<style>@font-face{font-family:L;src:url(data:font/ttf;base64,${font})} span{font:400 16px/25px L;-webkit-font-smoothing:antialiased;white-space:pre}</style>` + strings.map((s, i) => `<div><span id=s${i}></span></div>`).join(''));
await page.evaluate((strings) => strings.forEach((s, i) => (document.getElementById('s' + i).textContent = s)), strings);
await page.evaluate(() => document.fonts.ready);
const w = await page.evaluate((n) => [...Array(n).keys()].map((i) => document.getElementById('s' + i).getBoundingClientRect().width), strings.length);
strings.forEach((s, i) => console.log(JSON.stringify(s), w[i].toFixed(3)));
await browser.close();
