import fs from 'node:fs'; import { PNG } from 'pngjs';
const [pa, pb] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(pa)), B = PNG.sync.read(fs.readFileSync(pb));
const S=2;
for (let y=54; y<836; y+=16) {
  let sa=0, sb=0, n=0;
  for (let dy=0; dy<16*S; dy++) { const yy=y*S+dy; if (yy>=A.height) break;
    for (let x=0; x<A.width; x++) { const o=(A.width*yy+x)<<2;
      sa+=(A.data[o]+A.data[o+1]+A.data[o+2])/3; sb+=(B.data[o]+B.data[o+1]+B.data[o+2])/3; n++; } }
  console.log(`y${String(y).padStart(3)}  design ${(sa/n).toFixed(2)}  app ${(sb/n).toFixed(2)}  Δ${((sb-sa)/n).toFixed(2)}`);
}
