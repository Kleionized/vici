// audit-app.jsx — harness renderer (loaded last)
const stage = document.getElementById('stage');
let auditRoots = [];
window.showScreens = (names, scale = 1) => {
  auditRoots.forEach(r => r.unmount());
  auditRoots = [];
  stage.innerHTML = '';
  names.forEach((name) => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.style.width = `${Math.round(402 * scale)}px`;
    slot.innerHTML = `<div class="cap">${name}</div><div class="holder" style="width:402px;height:874px;transform:scale(${scale})"><div class="scr"></div></div>`;
    if (scale !== 1) slot.querySelector('.holder').parentNode.style.height = `${Math.round(874 * scale) + 20}px`;
    stage.appendChild(slot);
    const Comp = window[name];
    const root = ReactDOM.createRoot(slot.querySelector('.scr'));
    if (Comp) {
      root.render(<React.Fragment><Comp /><div className="tl-grain"></div></React.Fragment>);
    } else {
      root.render(<div style={{ color: 'red', padding: 20 }}>MISSING: {name}</div>);
    }
    auditRoots.push(root);
  });
  return names.join(',');
};
window.__ready = true;
// auto-render from ?screens=A,B,C&scale=0.5 (screenshot-friendly)
(() => {
  const q = new URLSearchParams(location.search);
  const names = (q.get('screens') || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (names.length) window.showScreens(names, parseFloat(q.get('scale') || '0.5'));
})();
