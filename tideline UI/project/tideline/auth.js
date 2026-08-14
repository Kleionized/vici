/* ===================== TIDELINE — splash + auth ===================== */

function Wordmark({ size=40, light }){
  return (
    <div style={{display:"flex", alignItems:"center", gap:10}}>
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="21" fill={light?"rgba(255,255,255,.12)":"var(--accent-softer)"}/>
        <path d="M5 26c4-5 7.5-5 11.5 0s7.5 5 11.5 0 7.5-5 11.5 0" stroke={light?"#bff0e7":"var(--accent)"} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        <path d="M5 31.5c4-5 7.5-5 11.5 0s7.5 5 11.5 0 7.5-5 11.5 0" stroke={light?"#7fd3c6":"var(--accent)"} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".55"/>
      </svg>
      <span style={{ fontSize:size*0.62, fontWeight:800, letterSpacing:"-.03em", color: light?"#fff":"var(--ink)" }}>Tideline</span>
    </div>
  );
}

function Splash(){
  return (
    <div className="screen" style={{ background:"linear-gradient(180deg,#0c2f31,#0f3a4a)", alignItems:"center", justifyContent:"center" }}>
      <StatusBar dark/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:30 }} className="fade-in">
        <Wordmark size={46} light/>
        <div className="spinner"/>
      </div>
      <style>{`.spinner{ width:30px; height:30px; border:3px solid rgba(255,255,255,.2); border-top-color:#7fd3c6; border-radius:50%; animation:spin 1s linear infinite; } @keyframes spin{ to{ transform:rotate(360deg);} }`}</style>
    </div>
  );
}

function AuthShell({ children }){
  return (
    <div className="screen">
      <StatusBar/>
      <WaveHead height={150} tone="teal"/>
      <div className="scroll pb">
        <div className="pad" style={{ marginTop:-8 }}>{children}</div>
      </div>
    </div>
  );
}

function SignIn({ onSignIn, onGoSignUp }){
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const ok = email.trim() && pw.trim();
  const submit = () => {
    if (!ok) return;
    if (!/.+@.+\..+/.test(email)) { setErr("That email doesn't look right. Mind checking it?"); return; }
    onSignIn(email.trim());
  };
  return (
    <AuthShell>
      <div style={{marginTop:6}}><Wordmark size={30}/></div>
      <h1 className="h1" style={{marginTop:26}}>Welcome back</h1>
      <p className="body-lg" style={{marginTop:10}}>Sign in to keep building toward the life you want.</p>

      <div className="field">
        <label>Email</label>
        <input className="input" type="email" inputMode="email" placeholder="you@example.com"
          value={email} onChange={e=>{setEmail(e.target.value); setErr("");}}/>
      </div>
      <div className="field">
        <label>Password</label>
        <input className="input" type="password" placeholder="••••••••"
          value={pw} onChange={e=>{setPw(e.target.value); setErr("");}}/>
      </div>
      {err && <div className="errtext">{err}</div>}

      <button className="btn btn-primary block" style={{marginTop:24}} disabled={!ok} onClick={submit}>Sign in</button>
      <div className="linkrow" style={{marginTop:18}}>New here? <span className="link" onClick={onGoSignUp}>Create an account</span></div>
      <div className="offline-note">Running offline — accounts are stored locally on this device.</div>
    </AuthShell>
  );
}

function SignUp({ onSignUp, onGoSignIn }){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const ok = email.trim() && pw.trim();
  const submit = () => {
    if (!ok) return;
    if (!/.+@.+\..+/.test(email)) { setErr("That email doesn't look right. Mind checking it?"); return; }
    if (pw.length < 6) { setErr("Use at least 6 characters for your password."); return; }
    onSignUp(email.trim(), name.trim());
  };
  return (
    <AuthShell>
      <div style={{marginTop:6}}><Wordmark size={30}/></div>
      <h1 className="h1" style={{marginTop:26}}>Start where you are</h1>
      <p className="body-lg" style={{marginTop:10}}>No streaks to protect. Just a place to build a life worth living.</p>

      <div className="field">
        <label>Name <span className="muted" style={{fontWeight:600}}>(optional)</span></label>
        <input className="input" placeholder="What should we call you?" value={name} onChange={e=>setName(e.target.value)}/>
      </div>
      <div className="field">
        <label>Email</label>
        <input className="input" type="email" inputMode="email" placeholder="you@example.com"
          value={email} onChange={e=>{setEmail(e.target.value); setErr("");}}/>
      </div>
      <div className="field">
        <label>Password</label>
        <input className="input" type="password" placeholder="At least 6 characters"
          value={pw} onChange={e=>{setPw(e.target.value); setErr("");}}/>
      </div>
      {err && <div className="errtext">{err}</div>}

      <button className="btn btn-primary block" style={{marginTop:24}} disabled={!ok} onClick={submit}>Create account</button>
      <div className="linkrow" style={{marginTop:18}}>Already have an account? <span className="link" onClick={onGoSignIn}>Sign in</span></div>
      <div className="offline-note">Running offline — accounts are stored locally on this device.</div>
    </AuthShell>
  );
}

Object.assign(window, { Splash, SignIn, SignUp, Wordmark, AuthShell });
