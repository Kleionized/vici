// node mk-steps.mjs out.json name=js name=js ...  (js may reference SC() for the vertical pager node)
import fs from 'node:fs';
const [out, ...rest] = process.argv.slice(2);
const SC = 'const n=[...document.querySelectorAll("div")].filter(d=>d.scrollHeight>d.clientHeight+8 && getComputedStyle(d).overflowY!=="visible")[0];';
const steps = rest.map((r) => { const i = r.indexOf('='); return { name: r.slice(0, i), js: r.slice(i + 1).replace(/SC;/g, SC) }; });
fs.writeFileSync(out, JSON.stringify(steps));
