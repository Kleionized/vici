import fs from 'node:fs'; import { PNG } from 'pngjs';
const [f,colS,y0S,y1S]=process.argv.slice(2);
const P=PNG.sync.read(fs.readFileSync(f)); const S=P.width/393;
const x=Math.round(Number(colS)*S);
for(let dy=Number(y0S);dy<=Number(y1S);dy++){const i=(dy*P.width+x)*4;console.log(`dev row ${dy} (css ${(dy/S).toFixed(2)}): ${P.data[i]},${P.data[i+1]},${P.data[i+2]}`);}
