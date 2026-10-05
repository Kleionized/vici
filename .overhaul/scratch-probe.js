const el = document.elementFromPoint(28, 822);
const chain = []; let e = el;
for (let i = 0; e && i < 8; i++, e = e.parentElement) chain.push(`${e.tagName}#${e.id}.${(e.className||'').toString().slice(0,60)} aria=${e.getAttribute('aria-label')} testid=${e.getAttribute('data-testid')}`);
return chain;
