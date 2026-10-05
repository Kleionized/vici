import fs from 'node:fs';
const dir='/Users/admin/Documents/Vici/node_modules/@expo-google-fonts/lato/';
for (const w of ['400Regular','700Bold','900Black','700Bold_Italic','400Regular_Italic']) {
  const f = fs.readdirSync(dir+w).find(x=>x.endsWith('.ttf')); const b = fs.readFileSync(dir+w+'/'+f);
  const n = b.readUInt16BE(4); const t={};
  for (let i=0;i<n;i++){const o=12+i*16; t[b.toString('ascii',o,o+4)]={off:b.readUInt32BE(o+8)};}
  const head=t.head.off, hhea=t.hhea.off, os2=t['OS/2'].off;
  const upm=b.readUInt16BE(head+18);
  const asc=b.readInt16BE(hhea+4), desc=b.readInt16BE(hhea+6), gap=b.readInt16BE(hhea+8);
  const tAsc=b.readInt16BE(os2+68), tDesc=b.readInt16BE(os2+70), tGap=b.readInt16BE(os2+72), wAsc=b.readUInt16BE(os2+74), wDesc=b.readUInt16BE(os2+76), fsSel=b.readUInt16BE(os2+62);
  console.log(w, f, 'upm',upm,'hhea',asc,desc,gap,'=> normal lh', ((asc-desc+gap)/upm).toFixed(4), 'typo',tAsc,tDesc,tGap,'win',wAsc,wDesc,'useTypo',!!(fsSel&128));
}
