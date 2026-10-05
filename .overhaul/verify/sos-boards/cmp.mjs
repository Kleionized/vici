import fs from 'node:fs';
const grab = (f) => {
  const s = fs.readFileSync(f, 'utf8');
  const out = {};
  const re = /"(SOS-[A-Za-z-]+)":\s*(\{.*?\}),?\s*$/gm;
  let m;
  while ((m = re.exec(s))) { try { out[m[1]] = JSON.parse(m[2]); } catch (e) { out[m[1]] = { raw: m[2].slice(0, 200) }; } }
  return out;
};
const o = grab(process.argv[2]), n = grab(process.argv[3]);
console.log('old keys', Object.keys(o).length, 'new keys', Object.keys(n).length);
for (const k of Object.keys(n)) {
  const a = o[k] || {}, b = n[k];
  for (const f of ['title', 'body', 'cta', 'challenge', 'challengeLabel', 'another']) {
    const av = typeof a[f] === 'string' ? a[f] : a[f], bv = typeof b[f] === 'string' ? b[f].replace(/\n/g, ' ') : b[f];
    if (JSON.stringify(av) !== JSON.stringify(bv)) console.log(k, f, JSON.stringify(av), '->', JSON.stringify(b[f]));
  }
}
