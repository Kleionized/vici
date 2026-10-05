import fs from 'node:fs'; import { PNG } from 'pngjs';
const out = process.argv[2]; const pairs = process.argv.slice(3);
const ims = pairs.map(p => PNG.sync.read(fs.readFileSync(p)));
const W = ims.reduce((s,i)=>s+i.width,0)+ (ims.length-1)*8, H = Math.max(...ims.map(i=>i.height));
const o = new PNG({width:W, height:H});
o.data.fill(255);
let ox=0;
for (const im of ims) {
  for (let y=0;y<im.height;y++) for (let x=0;x<im.width;x++){
    const s=(im.width*y+x)<<2, d=(W*y+(x+ox))<<2;
    o.data[d]=im.data[s]; o.data[d+1]=im.data[s+1]; o.data[d+2]=im.data[s+2]; o.data[d+3]=255;
  }
  ox+=im.width+8;
}
// halve for legibility/token size
const h = new PNG({width: Math.floor(W/2), height: Math.floor(H/2)});
for (let y=0;y<h.height;y++) for (let x=0;x<h.width;x++){
  const s=(W*(y*2)+(x*2))<<2, d=(h.width*y+x)<<2;
  h.data[d]=o.data[s]; h.data[d+1]=o.data[s+1]; h.data[d+2]=o.data[s+2]; h.data[d+3]=255;
}
fs.writeFileSync(out, PNG.sync.write(h));
console.log('->', out, h.width+'x'+h.height);
