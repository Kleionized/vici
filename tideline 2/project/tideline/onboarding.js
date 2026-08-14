/* ===================== TIDELINE — onboarding ===================== */

function OnboardShell({ step, children, footer }){
  return (
    <div className="screen">
      <StatusBar/>
      <div className="safe-top"/>
      <div style={{ padding:"6px 22px 0" }}><ProgressDots total={4} idx={step}/></div>
      <div className="scroll"><div className="pad" style={{paddingTop:24, paddingBottom:24}}>{children}</div></div>
      <div className="pad" style={{ padding:"12px 22px 30px" }}>{footer}</div>
    </div>
  );
}

function OnbWelcome({ onNext }){
  return (
    <OnboardShell step={0} footer={<button className="btn btn-primary block" onClick={onNext}>Get started</button>}>
      <div className="pop-in" style={{display:"flex", justifyContent:"center", margin:"6px 0 22px"}}>
        <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
          <defs><linearGradient id="ow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe6df"/><stop offset="1" stopColor="#1c8e7c"/></linearGradient></defs>
          <circle cx="148" cy="40" r="26" fill="#fbe9d8"/>
          <path d="M0 70 C34 50 56 92 96 74 C140 54 168 90 200 66 L200 120 L0 120Z" fill="url(#ow)" opacity=".5"/>
          <path d="M0 86 C40 66 64 104 104 86 C148 66 176 100 200 82 L200 120 L0 120Z" fill="#1c8e7c" opacity=".9"/>
        </svg>
      </div>
      <h1 className="h1 center">Welcome to Tideline.</h1>
      <p className="body-lg" style={{marginTop:16}}>This isn't about streaks or perfect days. It's a calm place to build a life you actually want — and to learn from everything along the way.</p>
      <p className="body-lg" style={{marginTop:14}}>Including the hard parts. <strong style={{color:"var(--ink)"}}>Especially</strong> the hard parts. They're information, not a verdict on who you are.</p>
    </OnboardShell>
  );
}

function OnbWhy({ value, onChange, onNext }){
  const [v, setV] = useState(value||"");
  return (
    <OnboardShell step={1} footer={
      <button className="btn btn-primary block" disabled={!v.trim()} onClick={()=>{onChange(v.trim()); onNext();}}>Continue</button>
    }>
      <span className="label">Your why</span>
      <h1 className="h1" style={{marginTop:12}}>What is this in service of?</h1>
      <p className="body-lg" style={{marginTop:12}}>Write the life this change makes room for. It doesn't need to be polished — it needs to be true.</p>
      <div className="field">
        <textarea className="textarea" style={{minHeight:150}} placeholder="I want this because…"
          value={v} onChange={e=>setV(e.target.value)} autoFocus/>
      </div>
    </OnboardShell>
  );
}

function OnbValues({ value, onChange, onNext }){
  const [sel, setSel] = useState(value||[]);
  const toggle = (v) => setSel(s => s.includes(v) ? s.filter(x=>x!==v) : [...s, v]);
  return (
    <OnboardShell step={2} footer={
      <button className="btn btn-primary block" disabled={!sel.length} onClick={()=>{onChange(sel); onNext();}}>Continue</button>
    }>
      <span className="label">What you value</span>
      <h1 className="h1" style={{marginTop:12}}>Pick the few that matter most.</h1>
      <p className="body-lg" style={{marginTop:12, marginBottom:22}}>These become your anchor. You can change them anytime.</p>
      <div className="chipgrid">
        {window.SUGGESTED_VALUES.map(v => (
          <div key={v} className={"chip"+(sel.includes(v)?" selected":"")} onClick={()=>toggle(v)}>
            <span className="dot" style={{width:8, height:8, borderRadius:"50%", background:sel.includes(v)?"#fff":"var(--accent)"}}/>
            {v}
          </div>
        ))}
      </div>
    </OnboardShell>
  );
}

function OnbDone({ lifemap, onEnter }){
  return (
    <OnboardShell step={3} footer={<button className="btn btn-primary block" onClick={onEnter}>Enter Tideline</button>}>
      <div className="pop-in" style={{display:"flex", justifyContent:"center", margin:"4px 0 18px"}}>
        <svg width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="40" fill="var(--accent-softer)"/><circle cx="42" cy="42" r="40" stroke="var(--accent-soft)" strokeWidth="2" fill="none"/><path d="M28 43l10 10 19-22" stroke="var(--accent)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h1 className="h1 center">You're set.</h1>
      <p className="body-lg center" style={{marginTop:12, marginBottom:22}}>This is your starting point — not a scoreboard.</p>

      <div className="card card-accent">
        <span className="label">Your why</span>
        <p className="body" style={{marginTop:8, color:"var(--ink)", fontWeight:500}}>{lifemap.whyStatement || "—"}</p>
      </div>
      <div className="card" style={{marginTop:14}}>
        <span className="label muted">What you value</span>
        <div className="pillrow" style={{marginTop:10}}>
          {lifemap.values.length ? lifemap.values.map(v=><Pill key={v} kind="accent">{v}</Pill>) : <span className="muted">—</span>}
        </div>
      </div>
    </OnboardShell>
  );
}

Object.assign(window, { OnbWelcome, OnbWhy, OnbValues, OnbDone, OnboardShell });
