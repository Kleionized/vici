/* ===================== TIDELINE — Dashboard (You) ===================== */

function Dashboard({ onNav, onOpenScreen }){
  const app = useApp(); const s = app.state;
  const total = window.LESSONS.length;
  const done = window.tl.completedCount(s);
  const reflections = window.tl.reflectionCount(s);
  const sleep7 = window.tl.last7(s.checkins, "sleep");
  const mood7 = window.tl.last7(s.checkins, "mood");
  const moved = window.tl.weekCount(s.checkins, "moved");
  const connected = window.tl.weekCount(s.checkins, "connected");
  const structure = window.tl.weekCount(s.checkins, "structure");
  const daysSince = window.tl.daysSinceLapse(s);

  return (
    <div className="screen">
      <StatusBar/>
      <div className="scroll pb-tab">
        <div className="safe-top"/>
        <div className="pad">
          <span className="label muted">You</span>
          <h1 className="h1" style={{marginTop:6}}>How you're really doing</h1>
          <p className="body" style={{marginTop:10}}>The things that move the needle — not a number to protect.</p>

          <div className="statgrid" style={{marginTop:20}}>
            <div className="stattile">
              <div className="num">{done}<span style={{fontSize:18, color:"var(--ink-3)", fontWeight:700}}>/{total}</span></div>
              <div className="cap">Lessons completed</div>
            </div>
            <div className="stattile">
              <div className="num">{reflections}</div>
              <div className="cap">Reflections written</div>
            </div>
          </div>

          <div className="card" style={{marginTop:14}}>
            <div className="spread"><span className="label muted">Sleep</span><span className="muted" style={{fontSize:13, fontWeight:700}}>last 7 days</span></div>
            <div style={{marginTop:14}}><BarChart data={sleep7} max={10} colorVar="--tide"/></div>
          </div>
          <div className="card" style={{marginTop:14}}>
            <div className="spread"><span className="label muted">Mood</span><span className="muted" style={{fontSize:13, fontWeight:700}}>last 7 days</span></div>
            <div style={{marginTop:14}}><BarChart data={mood7} max={5} colorVar="--accent"/></div>
          </div>

          <div className="card" style={{marginTop:14}}>
            <span className="label muted">This week</span>
            <div style={{marginTop:6}}>
              <div className="minirow"><span className="k">Moved my body</span><span className="v">{moved}/7</span></div>
              <div className="minirow"><span className="k">Real connection</span><span className="v">{connected}/7</span></div>
              <div className="minirow"><span className="k">Kept some structure</span><span className="v">{structure}/7</span></div>
            </div>
          </div>

          {s.settings.showDaysSince && (
            <div className="card card-accent" style={{marginTop:14}}>
              <span className="label">Optional stat</span>
              <div style={{display:"flex", alignItems:"baseline", gap:8, marginTop:8}}>
                <span style={{fontSize:34, fontWeight:800, color:"var(--accent-ink)", letterSpacing:"-.02em"}}>{daysSince==null?"—":daysSince}</span>
                <span style={{fontSize:17, fontWeight:600, color:"var(--ink)"}}>days since your last logged lapse</span>
              </div>
              <p className="body" style={{marginTop:8, fontSize:14.5}}>Just a number you asked to see — not a streak to defend. If it resets, that's data, not failure.</p>
            </div>
          )}

          <div className="center" style={{marginTop:22}}>
            <span className="link" style={{fontSize:16}} onClick={()=>onNav("log","history")}>See everything in your log →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
