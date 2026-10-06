const out = [];
for (const d of document.querySelectorAll('div')) {
  const cs = getComputedStyle(d);
  if (cs.backgroundImage && cs.backgroundImage !== 'none') out.push({ bg: cs.backgroundImage.slice(0, 80), rep: cs.backgroundRepeat, size: cs.backgroundSize, kids: d.parentElement.innerHTML.slice(0, 300) });
}
return { imgs: [...document.images].map((i) => ({ src: i.src.slice(-40), c: i.complete, w: i.naturalWidth })), bgs: out.slice(0, 3) };
