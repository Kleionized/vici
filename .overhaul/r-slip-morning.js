const seq=["Log the slip","Closed","Yesterday","Continue","Bored","Continue · 1","Continue","Continue","Continue","Done","Sign it again","Start again"];
const out=[];const head=()=>document.body.innerText.split('\n').map(s=>s.trim()).filter(Boolean)[0]??'';
for(const s of seq){let ok=true;try{await tap(s);}catch(e){ok=false;}await new Promise(r=>setTimeout(r,450));
 out.push((ok?'':'X ')+s.slice(0,9)+'>'+location.pathname+':'+head().slice(0,20));}
return out;
