/* ===================== TIDELINE — Log (Log / Check-in / History) ===================== */

const LOG_TYPES = [
  { id:"win", label:"Win", hint:"Something that went right — name it." },
  { id:"lapse", label:"Lapse", hint:"Just data. Same calm screen as a win — no shame here." },
  { id:"urge-out", label:"Urge — rode it out", hint:"You felt the wave and let it pass." },
  { id:"urge-acted", label:"Urge — acted on it", hint:"It happened. That's information for next time." }
];
const HALT4 = ["Hungry","Tired","Lonely","Bored"];

function Log({ initialTab="log" }){
  const app = useApp(); const s = app.state;
  const [tab, setTab] = useState(initialTab);
  useEffect(()=>{ setTab(initialTab); }, [initialTab]);

  return (
    <div className="screen">
      <StatusBar/>
      <div className="scroll pb-tab">
        <div className="safe-top"/>
        <div className="pad">
          <span className="label muted">A place to notice</span>
          <h1 className="h1" style={{marginTop:6, marginBottom:16}}>Your log</h1>
          <div className="segmented">
            {[["log","Log"],["checkin","Check-in"],["history","History"]].map(([id,lbl])=>(
              <div key={id} className={"seg"+(tab===id?" active":"")} onClick={()=>setTab(id)}>{lbl}</div>
            ))}
          </div>
          <div style={{marginTop:18}} key={tab} className="fade-in">
            {tab==="log" && <LogForm app={app}/>}
            {tab==="checkin" && <CheckinForm app={app}/>}
            {tab==="history" && <History s={s}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogForm({ app }){
  const [type, setType] = useState("win");
  const [halt, setHalt] = useState([]);
  const [trigger, setTrigger] = useState("");
  const [helped, setHelped] = useState("");
  const [learned, setLearned] = useState("");
  const [saved, setSaved] = useState(false);
  const meta = LOG_TYPES.find(t=>t.id===type);
  const toggle = (h)=> setHalt(a=>a.includes(h)?a.filter(x=>x!==h):[...a,h]);
  const save = () => {
    app.addLog({ type, halt, trigger:trigger.trim(), helped:helped.trim(), learned:learned.trim() });
    setSaved(true); setTimeout(()=>setSaved(false), 1800);
    setHalt([]); setTrigger(""); setHelped(""); setLearned("");
  };
  return (
    <div>
      <span className="label muted" style={{display:"block", marginBottom:10}}>What happened?</span>
      <div className="chipgrid">
        {LOG_TYPES.map(t => (
          <div key={t.id} className={"chip"+(type===t.id?" selected":"")} onClick={()=>setType(t.id)}>{t.label}</div>
        ))}
      </div>
      <p className="body" style={{marginTop:12, fontSize:15.5}}>{meta.hint}</p>

      <div className="field"><label>Were any of these true? (HALT)</label>
        <div className="chipgrid">{HALT4.map(h=><div key={h} className={"chip"+(halt.includes(h)?" selected":"")} onClick={()=>toggle(h)}>{h}</div>)}</div>
      </div>
      <div className="field"><label>Trigger <span className="muted" style={{fontWeight:600}}>(optional)</span></label>
        <input className="input" placeholder="What set it off?" value={trigger} onChange={e=>setTrigger(e.target.value)}/></div>
      <div className="field"><label>What helped <span className="muted" style={{fontWeight:600}}>(optional)</span></label>
        <input className="input" placeholder="What made it easier?" value={helped} onChange={e=>setHelped(e.target.value)}/></div>
      <div className="field"><label>What I learned <span className="muted" style={{fontWeight:600}}>(optional)</span></label>
        <textarea className="textarea" style={{minHeight:90}} placeholder="A note for next time." value={learned} onChange={e=>setLearned(e.target.value)}/></div>

      <button className="btn btn-primary block" style={{marginTop:22}} onClick={save}>{saved ? "Saved ✓" : "Save to log"}</button>
    </div>
  );
}

function CheckinForm({ app }){
  const [sleep, setSleep] = useState(7);
  const [mood, setMood] = useState(3);
  const [moved, setMoved] = useState(false);
  const [connected, setConnected] = useState(false);
  const [structure, setStructure] = useState(false);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const save = () => {
    app.addCheckin({ sleep, mood, moved, connected, structure, note:note.trim() });
    setSaved(true); setTimeout(()=>setSaved(false), 1800);
  };
  const moods = ["😞","😕","😐","🙂","😊"];
  return (
    <div>
      <p className="body" style={{fontSize:15.5}}>The quiet signals that actually move the needle.</p>
      <div className="field"><label>Hours of sleep — <span style={{color:"var(--accent-ink)"}}>{sleep}h</span></label>
        <input className="range" type="range" min="0" max="12" step="0.5" value={sleep} onChange={e=>setSleep(parseFloat(e.target.value))}/>
      </div>
      <div className="field"><label>Mood</label>
        <div className="scale10" style={{gap:8}}>
          {moods.map((m,i)=>(
            <div key={i} className={"s10"+(mood===i+1?" sel":"")} style={{fontSize:22, height:48, background:mood===i+1?"var(--accent-soft)":"var(--surface-2)", borderColor:mood===i+1?"var(--accent)":"var(--line)"}} onClick={()=>setMood(i+1)}>{m}</div>
          ))}
        </div>
      </div>
      <div className="field" style={{display:"flex", flexDirection:"column", gap:14}}>
        {[["Moved my body",moved,setMoved],["Real connection with someone",connected,setConnected],["Kept some structure",structure,setStructure]].map(([lbl,val,fn],i)=>(
          <div className="togglerow" key={i}>
            <span style={{fontSize:16.5, fontWeight:600, color:"var(--ink)"}}>{lbl}</span>
            <Toggle on={val} onChange={fn}/>
          </div>
        ))}
      </div>
      <div className="field"><label>Note <span className="muted" style={{fontWeight:600}}>(optional)</span></label>
        <textarea className="textarea" style={{minHeight:80}} placeholder="Anything you want to remember about today." value={note} onChange={e=>setNote(e.target.value)}/></div>
      <button className="btn btn-primary block" style={{marginTop:22}} onClick={save}>{saved ? "Saved ✓" : "Save check-in"}</button>
    </div>
  );
}

function History({ s }){
  const items = [
    ...s.log.map(e=>({ kind:"event", ts:e.ts, e })),
    ...s.checkins.map(c=>({ kind:"checkin", ts:c.ts, c }))
  ].sort((a,b)=>b.ts-a.ts);

  if (!items.length) return (
    <div className="card flat center" style={{padding:"40px 24px", background:"var(--surface-2)", border:"none"}}>
      <p className="body" style={{color:"var(--ink-2)"}}>Nothing logged yet.<br/>When you log a moment or check in, it'll gather here — gently, in order.</p>
    </div>
  );

  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>
      {items.map((it,i)=> it.kind==="event"
        ? <EventCard key={i} e={it.e}/>
        : <CheckinCard key={i} c={it.c}/>
      )}
    </div>
  );
}

function EventCard({ e }){
  const meta = window.TYPE_META[e.type] || { label:e.type, color:"var(--slate)" };
  return (
    <div className="eventcard" style={{borderLeftColor:meta.color}}>
      <div className="ec-top">
        <span className="ec-type" style={{color:meta.color}}>{meta.label}</span>
        <span className="ec-time">{window.tl.fmtTime(e.ts)}</span>
      </div>
      {e.halt && e.halt.length>0 && <div className="ec-field"><b>HALT:</b> {e.halt.join(", ")}</div>}
      {e.trigger && <div className="ec-field"><b>Trigger:</b> {e.trigger}</div>}
      {e.helped && <div className="ec-field"><b>Helped:</b> {e.helped}</div>}
      {e.learned && <div className="ec-field"><b>Learned:</b> {e.learned}</div>}
    </div>
  );
}

function CheckinCard({ c }){
  return (
    <div className="eventcard" style={{borderLeftColor:"var(--slate)", background:"var(--surface-2)"}}>
      <div className="ec-top">
        <span className="ec-type" style={{color:"var(--slate)", fontSize:15}}>Daily check-in</span>
        <span className="ec-time">{window.tl.fmtTime(c.ts)}</span>
      </div>
      <div className="ec-field" style={{marginTop:6}}>
        <b>{c.sleep}h</b> sleep · mood <b>{c.mood}/5</b>
        {[c.moved&&"moved", c.connected&&"connected", c.structure&&"structure"].filter(Boolean).length>0 &&
          " · " + [c.moved&&"moved", c.connected&&"connected", c.structure&&"structure"].filter(Boolean).join(", ")}
      </div>
      {c.note && <div className="ec-field">{c.note}</div>}
    </div>
  );
}

Object.assign(window, { Log });
