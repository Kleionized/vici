await tap("I slipped");
await new Promise(r=>setTimeout(r,1200));
const head = document.body.innerText.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,3).join(' | ');
return location.pathname + ' :: ' + head.slice(0,160);
