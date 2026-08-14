/* ===================== TIDELINE — secondary screens ===================== */

/* ---------- Lesson player ---------- */
function LessonPlayer({ slug, onClose, onComplete, onOpenUrge, onOpenSupport }){
  const app = useApp(); const s = app.state;
  const lesson = window.tl.lessonBySlug(slug);
  const prev = (s.progress[slug] && s.progress[slug].reflection) || {};
  const [answers, setAnswers] = useState(prev);
  const [fit, setFit] = useState((s.progress[slug] && s.progress[slug].fit) || 0);

  useEffect(()=>{ app.startLesson(slug); }, [slug]);

  const setA = (id,v) => setAnswers(a=>({ ...a, [id]:v }));
  const fitLabels = ["Not for me","","","","Fits well"];

  const save = () => { app.completeLesson(slug, answers, fit); onComplete(); };

  return (
    <div className="screen">
      <StatusBar/>
      <div className="topbar" style={{paddingTop:46}}>
        <span className="closebar" onClick={onClose}>Close</span>
        <span className="muted" style={{fontWeight:700, fontSize:14}}>Week {lesson.week}</span>
      </div>
      <div className="scroll pb"><div className="pad">
        <div className="pillrow" style={{marginTop:4}}>
          <Pill kind="accent">{lesson.category}</Pill>
          {lesson.approach.map(a=><Pill key={a}>{a}</Pill>)}
        </div>
        <h1 className="h1" style={{marginTop:14}}>{lesson.title}</h1>

        <div style={{marginTop:8}}><Markdown text={lesson.body}/></div>

        {lesson.tool==="urge" && (
          <div className="card card-accent" style={{marginTop:8}}>
            <h2 className="h2" style={{fontSize:20}}>Ready to try it?</h2>
            <p className="body" style={{marginTop:6, fontSize:15.5}}>The next time a wave comes, you have a place to ride it out.</p>
            <button className="btn btn-primary block btn-sm" style={{marginTop:14}} onClick={onOpenUrge}>Open Ride It Out</button>
          </div>
        )}

        {lesson.sensitive && (
          <div className="card flat" style={{marginTop:16, background:"#f6efe6", border:"1px solid #ecdcc6"}}>
            <p className="body" style={{fontSize:15.5, color:"#7a5a2e"}}>This topic can bring up a lot. If it does, that's worth taking seriously. <span className="link" style={{color:"#a06d2c"}} onClick={onOpenSupport}>Find support →</span></p>
          </div>
        )}

        <div className="divider"/>

        {/* Reflection */}
        <span className="label">Reflection</span>
        <p className="body" style={{marginTop:8, color:"var(--ink)", fontWeight:600, fontSize:18}}>{lesson.prompt}</p>

        {lesson.fields.map(f => (
          <div className="field" key={f.id}>
            <label>{f.label}</label>
            {f.type==="short" && <input className="input" value={answers[f.id]||""} onChange={e=>setA(f.id,e.target.value)} placeholder="A few words…"/>}
            {f.type==="long" && <textarea className="textarea" value={answers[f.id]||""} onChange={e=>setA(f.id,e.target.value)} placeholder="Take your time."/>}
            {f.type==="scale" && (
              <div className="scale10">{Array.from({length:10}).map((_,i)=>(
                <div key={i} className={"s10"+(answers[f.id]===i+1?" sel":"")} onClick={()=>setA(f.id,i+1)}>{i+1}</div>
              ))}</div>
            )}
            {f.type==="choice" && (
              <div className="choice">{f.options.map(o=>(
                <div key={o} className={"choiceopt"+(answers[f.id]===o?" sel":"")} onClick={()=>setA(f.id,o)}>
                  <span className="radio"/> {o}
                </div>
              ))}</div>
            )}
          </div>
        ))}

        <div className="divider"/>
        <span className="label muted">Does this approach fit you?</span>
        <p className="body" style={{marginTop:6, fontSize:15}}>Different methods fit different people. This just helps tune what you see.</p>
        <div className="scale10" style={{marginTop:12, gap:8}}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} className={"s10"+(fit===n?" sel":"")} style={{height:46}} onClick={()=>setFit(n)}>{n}</div>
          ))}
        </div>
        <div className="spread" style={{marginTop:8}}><span className="muted" style={{fontSize:13}}>Not for me</span><span className="muted" style={{fontSize:13}}>Fits well</span></div>
      </div></div>
      <div className="pad" style={{padding:"12px 22px 30px"}}>
        <button className="btn btn-primary block" onClick={save}>Save reflection &amp; complete</button>
      </div>
    </div>
  );
}

/* ---------- Life Map ---------- */
function LifeMap({ onClose }){
  const app = useApp(); const s = app.state;
  const [why, setWhy] = useState(s.lifemap.whyStatement||"");
  const [year, setYear] = useState(s.lifemap.oneYear||"");
  const [vals, setVals] = useState(s.lifemap.values||[]);
  const [custom, setCustom] = useState(s.lifemap.customValues||[]);
  const [adding, setAdding] = useState("");
  const all = [...window.SUGGESTED_VALUES, ...custom.filter(c=>!window.SUGGESTED_VALUES.includes(c))];
  const toggle = (v)=> setVals(a=>a.includes(v)?a.filter(x=>x!==v):[...a,v]);
  const addCustom = () => {
    const v = adding.trim(); if(!v) return;
    if(!all.includes(v)) setCustom(c=>[...c,v]);
    if(!vals.includes(v)) setVals(a=>[...a,v]);
    setAdding("");
  };
  const save = () => { app.updateLifemap({ whyStatement:why.trim(), oneYear:year.trim(), values:vals, customValues:custom }); onClose(); };

  return (
    <div className="screen">
      <StatusBar/>
      <div className="topbar" style={{paddingTop:46}}>
        <span style={{fontWeight:800, fontSize:18, color:"var(--ink)"}}>Life Map</span>
        <span className="closebar" onClick={save}>Done</span>
      </div>
      <div className="scroll pb"><div className="pad">
        <div className="field" style={{marginTop:6}}><label>Why you're here</label>
          <textarea className="textarea" value={why} onChange={e=>setWhy(e.target.value)} placeholder="The life this makes room for…"/></div>
        <div className="field"><label>One year from now</label>
          <textarea className="textarea" value={year} onChange={e=>setYear(e.target.value)} placeholder="If this is working, what's different?"/></div>
        <div className="field"><label>What you value</label>
          <div className="chipgrid" style={{marginTop:4}}>
            {all.map(v=>(
              <div key={v} className={"chip"+(vals.includes(v)?" selected":"")} onClick={()=>toggle(v)}>
                <span className="dot" style={{width:8,height:8,borderRadius:"50%",background:vals.includes(v)?"#fff":"var(--accent)"}}/>{v}
              </div>
            ))}
          </div>
        </div>
        <div className="field"><label>Add your own</label>
          <div className="row">
            <input className="input grow" value={adding} onChange={e=>setAdding(e.target.value)} placeholder="A value that matters to you"
              onKeyDown={e=>{ if(e.key==="Enter") addCustom(); }}/>
            <button className="btn btn-secondary" style={{flex:"none", height:"auto", padding:"0 20px"}} onClick={addCustom}>Add</button>
          </div>
        </div>
      </div></div>
      <div className="pad" style={{padding:"12px 22px 30px"}}>
        <button className="btn btn-primary block" onClick={save}>Save Life Map</button>
      </div>
    </div>
  );
}

/* ---------- Settings ---------- */
function Settings({ onClose, onOpenScreen, onSignOut }){
  const app = useApp(); const s = app.state;
  const [reminder, setReminder] = useState(s.settings.reminder||"21:00");
  const [savedR, setSavedR] = useState(false);

  return (
    <div className="screen">
      <StatusBar/>
      <div className="topbar" style={{paddingTop:46}}>
        <span style={{fontWeight:800, fontSize:18, color:"var(--ink)"}}>Settings</span>
        <span className="closebar" onClick={onClose}>Done</span>
      </div>
      <div className="scroll pb"><div className="pad">
        <span className="label muted" style={{display:"block", marginTop:6}}>Progress</span>
        <div className="card" style={{marginTop:10}}>
          <div className="togglerow">
            <div className="grow">
              <div style={{fontSize:16.5, fontWeight:700, color:"var(--ink)"}}>Show a "days since" number</div>
              <p className="body" style={{marginTop:6, fontSize:14.5}}>Optional and secondary. It never resets as a failure — it's just a number, only if you want it.</p>
            </div>
            <Toggle on={s.settings.showDaysSince} onChange={(v)=>app.updateSettings({ showDaysSince:v })}/>
          </div>
        </div>

        <span className="label muted" style={{display:"block", marginTop:24}}>Daily reminder</span>
        <div className="card" style={{marginTop:10}}>
          <div className="spread">
            <span style={{fontSize:16.5, fontWeight:600, color:"var(--ink)"}}>Reminder time</span>
            <input className="input" type="time" style={{width:130, padding:"10px 12px"}} value={reminder}
              onChange={e=>{ setReminder(e.target.value); }}/>
          </div>
          <button className="btn btn-secondary btn-sm block" style={{marginTop:14}}
            onClick={()=>{ app.updateSettings({ reminder }); setSavedR(true); setTimeout(()=>setSavedR(false),1600); }}>
            {savedR ? "Saved ✓" : "Save"}
          </button>
          <p className="body" style={{marginTop:10, fontSize:13.5, color:"var(--ink-3)"}}>Stored on this device. Real notification scheduling is on the roadmap.</p>
        </div>

        <span className="label muted" style={{display:"block", marginTop:24}}>Anchors</span>
        <div className="card" style={{marginTop:10, padding:8}}>
          <Rowlink label="Edit your Life Map" onClick={()=>onOpenScreen("lifemap")}/>
          <Rowlink label="Find support" onClick={()=>onOpenScreen("support")}/>
        </div>

        <span className="label muted" style={{display:"block", marginTop:24}}>Account</span>
        <div className="card" style={{marginTop:10}}>
          <div className="minirow"><span className="k">Name</span><span className="muted" style={{fontWeight:600}}>{s.auth.name||"—"}</span></div>
          <div className="minirow"><span className="k">Email</span><span className="muted" style={{fontWeight:600}}>{s.auth.email||"—"}</span></div>
          <div className="minirow"><span className="k">Run mode</span><span className="muted" style={{fontWeight:600}}>Data: mock · Auth: mock</span></div>
          <button className="btn btn-outline block btn-sm" style={{marginTop:14, color:"#c0603f", borderColor:"#eccfc4"}} onClick={onSignOut}>Sign out</button>
        </div>
      </div></div>
    </div>
  );
}
function Rowlink({ label, onClick }){
  return (
    <div className="tap" style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 12px", cursor:"pointer"}} onClick={onClick}>
      <span style={{fontSize:16.5, fontWeight:600, color:"var(--ink)"}}>{label}</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--ink-3)" strokeWidth="2.2"><path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );
}

/* ---------- Support ---------- */
function Support({ onClose }){
  return (
    <div className="screen">
      <StatusBar/>
      <div className="topbar" style={{paddingTop:46}}>
        <span className="closebar" onClick={onClose}>← Back</span>
        <span/>
      </div>
      <div className="scroll pb"><div className="pad">
        <h1 className="h1" style={{marginTop:6}}>You're not alone in this.</h1>
        <div className="card flat" style={{marginTop:16, background:"#f6efe6", border:"1px solid #ecdcc6"}}>
          <p className="body" style={{fontSize:15.5, color:"#7a5a2e"}}>Tideline is a self-help companion — <strong>not</strong> medical advice or a crisis service. If you're in danger or thinking about harming yourself, please reach out to a professional or emergency service right now.</p>
        </div>

        <span className="label muted" style={{display:"block", marginTop:24, marginBottom:10}}>Resources</span>
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          <ResourceCard title="Crisis line" sub="24/7 phone & text support" tag="Placeholder"/>
          <ResourceCard title="Find a therapist" sub="Searchable professional directory" tag="Placeholder"/>
          <ResourceCard title="Peer community" sub="Moderated group support" tag="Placeholder"/>
        </div>
        <p className="body" style={{marginTop:18, fontSize:14, color:"var(--ink-3)"}}>These are placeholders. Real, region-appropriate resources must be added by a human before this ships.</p>
      </div></div>
    </div>
  );
}
function ResourceCard({ title, sub, tag }){
  return (
    <div className="card" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12}}>
      <div>
        <div style={{fontSize:17, fontWeight:800, color:"var(--ink)"}}>{title}</div>
        <div className="body" style={{fontSize:14.5, marginTop:3}}>{sub}</div>
      </div>
      <Pill kind="line">{tag}</Pill>
    </div>
  );
}

Object.assign(window, { LessonPlayer, LifeMap, Settings, Support });
