/* ===================== TIDELINE — shared UI ===================== */

function StatusBar({ dark }){
  const [t, setT] = useState(()=>nowStr());
  function nowStr(){ const d=new Date(); return d.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}).replace(/^0/,""); }
  useEffect(()=>{ const id=setInterval(()=>setT(nowStr()), 20000); return ()=>clearInterval(id); },[]);
  return (
    <div className={"statusbar"+(dark?" on-dark":"")}>
      <div>{t}</div>
      <div className="sb-right">
        <svg width="19" height="13" viewBox="0 0 19 13"><g fill="currentColor"><rect x="0" y="8" width="3" height="5" rx="1"/><rect x="5" y="5.5" width="3" height="7.5" rx="1"/><rect x="10" y="2.5" width="3" height="10.5" rx="1"/><rect x="15" y="0" width="3" height="13" rx="1"/></g></svg>
        <svg width="17" height="13" viewBox="0 0 18 14"><path fill="currentColor" d="M9 2.3c2.6 0 5 1 6.8 2.6l1.6-1.7C15.2 1.1 12.2 0 9 0 5.8 0 2.8 1.1.6 3.2l1.6 1.7C4 3.3 6.4 2.3 9 2.3Zm0 4.1c1.5 0 2.9.6 3.9 1.5l1.6-1.6C13.1 4.9 11.1 4 9 4S4.9 4.9 3.5 6.3l1.6 1.6C6.1 7 7.5 6.4 9 6.4Zm0 4 2.2-2.2c-.6-.6-1.4-.9-2.2-.9s-1.6.3-2.2.9L9 10.4Z"/></svg>
        <div className="bat"></div>
      </div>
    </div>
  );
}

/* recurring wave motif header */
function WaveHead({ height=120, tone="teal", flip=false }){
  const grads = {
    teal:["#bfe6df","#7fccc0","#1c8e7c"],
    tide:["#cfe9f0","#8fc7d8","#3e96b0"],
    dawn:["#fbe9d8","#f3cdb6","#e6b48f"]
  };
  const g = grads[tone] || grads.teal;
  const id = "wg"+tone+(flip?"f":"");
  return (
    <div className="wavehead" style={{height}}>
      <svg viewBox="0 0 390 120" preserveAspectRatio="none" style={{height:"100%", transform:flip?"scaleY(-1)":"none"}}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={g[0]}/><stop offset="1" stopColor={g[1]}/>
          </linearGradient>
        </defs>
        <path d="M0 64 C70 30 120 96 195 70 C270 44 320 92 390 60 L390 120 L0 120 Z" fill={id&&`url(#${id})`} opacity="0.55"/>
        <path d="M0 84 C80 56 130 110 200 86 C280 60 330 104 390 80 L390 120 L0 120 Z" fill={g[2]} opacity="0.85"/>
      </svg>
    </div>
  );
}

/* small inline wave divider */
function WaveLine({ color="var(--accent-soft)" }){
  return (
    <svg width="100%" height="22" viewBox="0 0 390 22" preserveAspectRatio="none" style={{display:"block"}}>
      <path d="M0 12 C60 2 100 20 160 11 C220 2 260 20 320 11 C350 6 370 12 390 9" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function ProgressDots({ total, idx }){
  return <div className="dots">{Array.from({length:total}).map((_,i)=>(
    <i key={i} className={i===idx?"on":(i<idx?"":"")} style={i<idx?{background:"var(--accent-soft)"}:null}/>
  ))}</div>;
}

function Pill({ children, kind }){ return <span className={"pill"+(kind?" "+kind:"")}>{children}</span>; }

function Toggle({ on, onChange }){
  return <div className={"toggle"+(on?" on":"")} onClick={()=>onChange(!on)}><div className="knob"/></div>;
}

/* tiny markdown renderer: ## h2, **bold**, > quote, - list, paragraphs */
function Markdown({ text }){
  const blocks = text.split(/\n\n+/);
  const inline = (s) => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p,i) => p.startsWith("**") && p.endsWith("**")
      ? <strong key={i}>{p.slice(2,-2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>);
  };
  return <div className="md">{blocks.map((b,i) => {
    if (b.startsWith("## ")) return <h3 key={i} className="md-h">{b.slice(3)}</h3>;
    if (b.startsWith("> ")) return <blockquote key={i} className="md-q">{inline(b.slice(2))}</blockquote>;
    if (/^[-*] /m.test(b)){
      const items = b.split(/\n/).filter(x=>/^[-*] /.test(x));
      return <ul key={i} className="md-ul">{items.map((it,j)=><li key={j}>{inline(it.replace(/^[-*] /,""))}</li>)}</ul>;
    }
    return <p key={i} className="md-p">{inline(b)}</p>;
  })}</div>;
}

function BarChart({ data, max, unit, colorVar="--accent" }){
  const top = max || Math.max(1, ...data.map(d=>d.value||0));
  return (
    <div className="bars">
      {data.map((d,i)=>(
        <div className="barcol" key={i}>
          <div className={"bar"+(d.value==null||d.value===0?" empty":"")}
               style={{ height:(d.value==null?6:Math.max(6,(d.value/top)*72))+"px",
                        background:d.value==null||d.value===0?undefined:`var(${colorVar})` }}/>
          <div className="barlbl">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

/* tab bar icons (neutral, calm line glyphs) */
const TABS = [
  { id:"today", label:"Today" },
  { id:"weeks", label:"Weeks" },
  { id:"urge",  label:"Urge" },
  { id:"log",   label:"Log" },
  { id:"you",   label:"You" }
];
function TabIcon({ id, active }){
  const c = active ? "var(--accent)" : "currentColor";
  const sw = 2;
  switch(id){
    case "today": return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="13" r="9"/><path d="M13 8v5l3.5 2.5"/></svg>;
    case "weeks": return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M5 6h16M5 13h16M5 20h10"/></svg>;
    case "urge": return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 14c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 5-3"/><path d="M3 19c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 5-3"/></svg>;
    case "log": return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4" width="16" height="18" rx="3"/><path d="M9 9h8M9 13h8M9 17h5"/></svg>;
    case "you": return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="9.5" r="4"/><path d="M5.5 21c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/></svg>;
    default: return null;
  }
}
function TabBar({ active, onNav }){
  return (
    <div className="tabbar">
      {TABS.map(t => (
        <button key={t.id} className={"tabbtn"+(active===t.id?" active":"")} onClick={()=>onNav(t.id)}>
          <span className="glyph"><TabIcon id={t.id} active={active===t.id}/></span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

const STATUS_META = {
  "not-started":{ label:"Not started", color:"var(--ink-3)", border:"var(--line)" },
  "in-progress":{ label:"In progress", color:"var(--tide)", border:"var(--tide)" },
  "completed":{ label:"Completed", color:"var(--win)", border:"var(--win)" }
};
const TYPE_META = {
  "win":{ label:"Win", color:"var(--win)" },
  "lapse":{ label:"Lapse", color:"var(--lapse)" },
  "urge-out":{ label:"Urge — rode it out", color:"var(--urge)" },
  "urge-acted":{ label:"Urge — acted on it", color:"var(--acted)" }
};

Object.assign(window, {
  StatusBar, WaveHead, WaveLine, ProgressDots, Pill, Toggle, Markdown, BarChart,
  TabBar, TabIcon, TABS, STATUS_META, TYPE_META
});
