import fs from 'node:fs'; import { PNG } from 'pngjs';
const [pa, pb, sy, sy2] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(pa)), B = PNG.sync.read(fs.readFileSync(pb));
const S=2, y0=Number(sy)*S, y1=Number(sy2)*S;
for (let x=0; x<A.width; x++) {
  let sa=0,sb=0,n=0;
  for (let y=y0;y<y1;y++){ const o=(A.width*y+x)<<2; sa+=(A.data[o]+A.data[o+1]+A.data[o+2])/3; sb+=(B.data[o]+B.data[o+1]+B.data[o+2])/3; n++; }
  const d=(sb-sa)/n; if (Math.abs(d)>3) console.log(`devx ${x} (frame ${(x/S).toFixed(1)})  design ${(sa/n).toFixed(1)}  app ${(sb/n).toFixed(1)}  Δ${d.toFixed(1)}`);
}
