await tap("Log the slip"); await tap("Closed"); await tap("Continue"); await tap("Bored"); await tap("Continue · 1"); await tap("Continue"); await tap("Continue"); await tap("Continue"); await tap("Done"); await tap("Sign it again");
await new Promise(r=>setTimeout(r,900));
const out=[];
for (const el of document.querySelectorAll('*')) {
  const cs=getComputedStyle(el);
  if (cs.backgroundImage && cs.backgroundImage !== 'none' && /noise|url\(/.test(cs.backgroundImage)) {
    const r=el.getBoundingClientRect();
    out.push({tag:el.tagName, rect:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)],
      bg:cs.backgroundImage.slice(0,80), size:cs.backgroundSize, pos:cs.backgroundPosition, repeat:cs.backgroundRepeat, op:cs.opacity});
  }
}
return out;
