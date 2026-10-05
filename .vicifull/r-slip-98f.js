const seq=["Log the slip","Closed","Continue","Bored","Continue · 1","Continue"];
for (const s of seq){ await tap(s); await new Promise(r=>setTimeout(r,450)); }
const before = document.body.innerText.split('\n').map(s=>s.trim()).filter(Boolean)[0];
await tap("I’m already watching again");
await new Promise(r=>setTimeout(r,500));
await tap("Continue");
await new Promise(r=>setTimeout(r,1200));
const head = document.body.innerText.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,2).join(' | ');
return before.slice(0,30)+' >> '+location.pathname+' :: '+head.slice(0,120);
