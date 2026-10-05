/* Find two-stop SVG washes whose zero-alpha stop names a different RGB from the
   opaque one. SVG interpolates non-premultiplied, so such a pair tints the wash
   toward the fade colour as the alpha falls; CSS interpolates premultiplied and
   does not. DECISIONS D048.

   Two false-positive classes were culled in pass 2 (FINDINGS F23). `stopOpacity=
   {0` also matches `{0.15}`, so every partly-transparent stop was being read as a
   fade stop; and the backward search for "the opaque stop" ran four lines without
   regard for element boundaries, so the LAST stop of one gradient was paired with
   the FIRST stop of the next. Three of the sixteen hits were the second kind and
   the same three were also the first kind. */
import fs from 'node:fs';
import path from 'node:path';
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : /\.tsx$/.test(e.name) && files.push(p); } })('src');
const hits = [];
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    // a real fade stop: exactly zero, written {0} / "0" / {0.0}
    const m = /stopColor="(#[0-9A-Fa-f]{3,8})"[^/>]*stopOpacity=(?:\{0(?:\.0+)?\}|"0(?:\.0+)?")/.exec(lines[i]);
    if (!m) continue;
    // the nearest preceding Stop **inside the same gradient element**
    for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
      if (/<\/\w*(?:Linear|Radial)Gradient|<\s*(?:Svg)?(?:Linear|Radial)Gradient/i.test(lines[j])) break;
      const p = /stopColor="(#[0-9A-Fa-f]{3,8})"/.exec(lines[j]);
      if (!p) continue;
      if (p[1].toLowerCase() !== m[1].toLowerCase()) hits.push(`${f}:${i + 1}  ${p[1]} -> ${m[1]}`);
      break;
    }
  }
}
console.log(hits.join('\n'));
console.log('--- ' + hits.length + ' mismatched fade stops');
