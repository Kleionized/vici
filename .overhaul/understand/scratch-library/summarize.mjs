import fs from 'fs';
const files = fs.readdirSync('.').filter(f=>f.endsWith('.txt')).sort();
for (const f of files) {
  const L = fs.readFileSync(f,'utf8').split('\n');
  const out = [];
  let hdrTop, listTop;
  for (let i=0;i<L.length;i++){
    const l=L[i];
    let m;
    if ((m=l.match(/^  <div> position:absolute  left:24px  right:24px  top:(\d+)px/))) hdrTop=m[1];
    if ((m=l.match(/^  <div> position:absolute  left:16px  right:16px  top:(\d+)px/))) listTop=m[1];
    if ((m=l.match(/^  <svg> viewBox="([^"]+)".*?(left:[^ ]+)  (top:[^ ]+).*?(transform:[^ ]+)?  (transform-origin:[^ ]+ [^ ]+)?/))) out.push(`hero svg vb=${m[1]} ${m[2]} ${m[3]} ${m[4]||''} ${m[5]||''}`);
  }
  // rows
  const rows=[];
  for (let i=0;i<L.length;i++){
    const l=L[i]; let m;
    if ((m=l.match(/^      <div> height:58px  border-radius:18px  background:(#\w+)/))) {
      const bg=m[1]; let lead='', title='', trail='', ttlstyle='';
      for (let j=i+1;j<L.length && !L[j].match(/^      <div> height:58px/) && !L[j].match(/^  <div>/);j++){
        const k=L[j];
        if (k.match(/border-radius:12px  background:/)) lead='check('+k.match(/background:(#\w+)/)[1]+')';
        if (k.match(/^          <span>/)) { lead='num['+k.trim()+']'; lead += ' '+L[j+1].trim(); }
        if (k.match(/^        <span> flex:1/)) { ttlstyle=k.trim().replace('<span> ',''); title=L[j+1].trim().replace(/^· /,''); }
        if (k.match(/^        <span> (?!flex)/)) { trail='span['+k.trim()+'] '+L[j+1].trim(); }
        if (k.match(/^          <path> d="M5 2l5 5-5 5"/)) trail='chev '+k.match(/stroke="(#\w+)"/)[1];
        if (k.match(/^        <svg>/) && !trail) {}
      }
      rows.push(`  [${bg}] ${lead} | ${title} | ${ttlstyle} | ${trail}`);
    }
  }
  const txt = L.filter(l=>l.match(/^      · /)).slice(0,3).map(s=>s.trim());
  console.log(`=== ${f}  hdrTop=${hdrTop} listTop=${listTop}`);
  out.forEach(o=>console.log('  '+o));
  console.log('  '+txt.join(' / '));
  rows.forEach(r=>console.log(r));
}
