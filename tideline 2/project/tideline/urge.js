/* ===================== TIDELINE — Urge tool (Ride It Out) ===================== */

const HALT_OPTS = ["Hungry","Tired","Lonely","Bored"];

function OceanWave(){
  // animated cresting + receding wave
  return (
    <div className="oceanwrap">
      <svg className="oceanwave" viewBox="0 0 600 240" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ocg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f8f8a" stopOpacity=".55"/><stop offset="1" stopColor="#0c2f31" stopOpacity=".9"/>
          </linearGradient>
        </defs>
        <path fill="#3aa39a" opacity=".35">
          <animate attributeName="d" dur="9s" repeatCount="indefinite"
            values="M0 120 C150 70 300 170 450 110 C540 78 580 120 600 110 L600 240 L0 240Z;
                    M0 110 C150 150 300 60 450 130 C540 168 580 120 600 132 L600 240 L0 240Z;
                    M0 120 C150 70 300 170 450 110 C540 78 580 120 600 110 L600 240 L0 240Z"/>
        </path>
        <path fill="url(#ocg)">
          <animate attributeName="d" dur="7s" repeatCount="indefinite"
            values="M0 150 C140 110 320 190 460 140 C540 112 580 150 600 140 L600 240 L0 240Z;
                    M0 140 C140 185 320 115 460 165 C540 198 580 150 600 162 L600 240 L0 240Z;
                    M0 150 C140 110 320 190 460 140 C540 112 580 150 600 140 L600 240 L0 240Z"/>
        </path>
      </svg>
    </div>
  );
}

function UrgeTool({ onExit, embeddedReturn }){
  const app = useApp();
  const saved = app.state.urgeSession;
  const [phase, setPhase] = useState(saved ? saved.phase : "idle"); // idle|rate|wait|outcome
  const [intensity, setIntensity] = useState(saved ? saved.intensity : 5);
  const [duration, setDuration] = useState(saved ? saved.duration : 3); // minutes
  const [remaining, setRemaining] = useState(saved && saved.phase==="wait"
      ? Math.max(0, saved.duration*60 - Math.floor((Date.now()-saved.startedAt)/1000)) : 0);
  const [breathText, setBreathText] = useState("Breathe in…");
  const [halt, setHalt] = useState(saved?.halt || []);
  const [trigger, setTrigger] = useState("");
  const [helped, setHelped] = useState("");
  const [learned, setLearned] = useState("");
  const startedAt = useRef(saved?.startedAt || null);

  // persist in-progress session so backgrounding doesn't lose it
  const persist = (p, extra={}) => app.setUrge({ phase:p, intensity, duration, startedAt:startedAt.current, halt, ...extra });

  // countdown
  useEffect(() => {
    if (phase!=="wait") return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r<=1){ clearInterval(id); setPhase("outcome"); app.setUrge({ phase:"outcome", intensity, duration, startedAt:startedAt.current, halt }); return 0; }
        return r-1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // breathing text cycle (4-4-4-4 over 16s)
  useEffect(() => {
    if (phase!=="wait") return;
    const seq = ["Breathe in…","Hold…","Breathe out…","Hold…"];
    let i = 0; setBreathText(seq[0]);
    const id = setInterval(() => { i=(i+1)%4; setBreathText(seq[i]); }, 4000);
    return () => clearInterval(id);
  }, [phase]);

  const beginWait = () => { startedAt.current = Date.now(); setRemaining(duration*60); setPhase("wait"); persist("wait",{ startedAt:Date.now() }); };
  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const toggleHalt = (h) => setHalt(a => a.includes(h)?a.filter(x=>x!==h):[...a,h]);

  const finish = (type) => {
    app.addLog({ type, intensity, halt, trigger:trigger.trim(), helped:helped.trim(), learned:learned.trim() });
    app.clearUrge();
    onExit(type);
  };

  // ---------- IDLE ----------
  if (phase==="idle"){
    return (
      <div className="screen">
        <StatusBar/>
        <div className="scroll pb"><div className="pad">
          <div className="safe-top"/>
          <span className="label muted" style={{marginTop:6, display:"block"}}>Ride it out</span>
          <h1 className="h1" style={{marginTop:8}}>An urge is a wave.</h1>
          <p className="body-lg" style={{marginTop:14}}>It feels like it'll rise forever. It won't. Urges crest and fade — usually in minutes — whether or not you act on them.</p>
          <p className="body-lg" style={{marginTop:14}}>Whatever happens next is <strong style={{color:"var(--ink)"}}>information</strong>, not a verdict. Let's ride this one out.</p>
          <div style={{display:"flex", justifyContent:"center", margin:"26px 0"}}>
            <svg width="260" height="120" viewBox="0 0 260 120" fill="none">
              <path d="M0 70 C50 30 80 100 130 70 C180 40 210 96 260 64" stroke="var(--accent)" strokeWidth="3" opacity=".4" fill="none" strokeLinecap="round"/>
              <path d="M0 88 C50 52 80 116 130 86 C180 56 210 110 260 82" stroke="var(--tide)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div></div>
        <div className="pad" style={{padding:"12px 22px 30px"}}>
          <button className="btn btn-primary block" onClick={()=>setPhase("rate")}>I'm having an urge</button>
        </div>
      </div>
    );
  }

  // ---------- RATE ----------
  if (phase==="rate"){
    return (
      <div className="screen">
        <StatusBar/>
        <div className="scroll pb"><div className="pad">
          <div className="safe-top"/>
          <h1 className="h1" style={{marginTop:6}}>How strong is it?</h1>
          <p className="body-lg" style={{marginTop:12}}>No wrong answer. Just notice where the wave is right now.</p>

          <div className="field"><label>Intensity</label>
            <div className="scale10">
              {Array.from({length:10}).map((_,i)=>(
                <div key={i} className={"s10"+(intensity===i+1?" sel":"")} onClick={()=>setIntensity(i+1)}>{i+1}</div>
              ))}
            </div>
            <div className="spread" style={{marginTop:8}}><span className="muted" style={{fontSize:13}}>barely there</span><span className="muted" style={{fontSize:13}}>overwhelming</span></div>
          </div>

          <div className="field" style={{marginTop:26}}><label>How long do you want to ride it out?</label>
            <div className="intensity-scale">
              {[1,3,5].map(m => (
                <div key={m} className={"iv"+(duration===m?" sel":"")} onClick={()=>setDuration(m)}>{m} min</div>
              ))}
            </div>
          </div>
        </div></div>
        <div className="pad" style={{padding:"12px 22px 30px", display:"flex", gap:12}}>
          <button className="btn btn-secondary grow" onClick={()=>{ app.clearUrge(); setPhase("idle"); }}>Cancel</button>
          <button className="btn btn-primary grow" onClick={beginWait}>Begin</button>
        </div>
      </div>
    );
  }

  // ---------- WAIT (dark) ----------
  if (phase==="wait"){
    return (
      <div className="urge-dark">
        <StatusBar dark/>
        <div className="scroll" style={{position:"relative", zIndex:2}}>
          <div className="safe-top"/>
          <div className="pad center" style={{paddingTop:10}}>
            <div className="clock">{fmt(remaining)}</div>
            <p style={{color:"#bfe6df", fontSize:16, fontWeight:600, marginTop:6}}>Stay with it. You don't have to do anything.</p>
            <div className="breathwrap" style={{marginTop:24}}>
              <div className="breathring"/>
              <div className="breathcircle">{breathText}</div>
            </div>
            <p style={{color:"#9fcfc8", fontSize:16, fontWeight:500, lineHeight:1.55, marginTop:26, padding:"0 6px"}}>
              Notice your feet on the floor. The wave is cresting. It is already on its way back down.
            </p>
          </div>
        </div>
        <div className="pad" style={{padding:"12px 22px 30px", position:"relative", zIndex:3}}>
          <button className="btn block" style={{background:"rgba(255,255,255,.14)", color:"#eafaf7", backdropFilter:"blur(4px)"}}
            onClick={()=>{ setPhase("outcome"); app.setUrge({ phase:"outcome", intensity, duration, startedAt:startedAt.current, halt }); }}>
            I'm through it
          </button>
        </div>
        <OceanWave/>
      </div>
    );
  }

  // ---------- OUTCOME ----------
  return (
    <div className="screen">
      <StatusBar/>
      <div className="scroll pb"><div className="pad">
        <div className="safe-top"/>
        <h1 className="h1" style={{marginTop:6}}>How did the wave go?</h1>
        <p className="body-lg" style={{marginTop:12}}>Both answers get logged the same calm way. There's nothing to confess here.</p>

        <div className="field"><label>Were any of these true? (HALT)</label>
          <div className="chipgrid">
            {HALT_OPTS.map(h => <div key={h} className={"chip"+(halt.includes(h)?" selected":"")} onClick={()=>toggleHalt(h)}>{h}</div>)}
          </div>
        </div>
        <div className="field"><label>What set it off? <span className="muted" style={{fontWeight:600}}>(optional)</span></label>
          <input className="input" placeholder="A place, a feeling, a person…" value={trigger} onChange={e=>setTrigger(e.target.value)}/>
        </div>
        <div className="field"><label>What helped? <span className="muted" style={{fontWeight:600}}>(optional)</span></label>
          <input className="input" placeholder="Breathing, a walk, texting someone…" value={helped} onChange={e=>setHelped(e.target.value)}/>
        </div>
        <div className="field"><label>What did this teach you? <span className="muted" style={{fontWeight:600}}>(optional)</span></label>
          <textarea className="textarea" style={{minHeight:90}} placeholder="A note to your future self." value={learned} onChange={e=>setLearned(e.target.value)}/>
        </div>
      </div></div>
      <div className="pad" style={{padding:"12px 22px 30px", display:"flex", gap:12}}>
        <button className="btn btn-outline grow" onClick={()=>finish("urge-acted")}>I acted on it</button>
        <button className="btn btn-primary grow" onClick={()=>finish("urge-out")}>I rode it out</button>
      </div>
    </div>
  );
}

Object.assign(window, { UrgeTool });
