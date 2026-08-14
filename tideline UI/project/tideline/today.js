/* ===================== TIDELINE — Today (home) ===================== */

function Today({ onNav, onOpenLesson, onOpenScreen }){
  const app = useApp(); const s = app.state;
  const name = s.auth.name;
  const next = window.tl.nextLesson(s);
  const status = window.tl.statusOf(s, next.slug);
  const cta = status==="completed" ? "Review lesson" : status==="in-progress" ? "Continue lesson" : "Start lesson";
  const greeting = name ? `Hi, ${name}.` : "Hello.";

  return (
    <div className="screen">
      <StatusBar/>
      <div className="scroll pb-tab">
        <div className="safe-top"/>
        <div className="pad">
          <div className="spread" style={{alignItems:"flex-start", marginTop:6}}>
            <div>
              <span className="label muted">Today</span>
              <h1 className="h1" style={{marginTop:6}}>{greeting}</h1>
            </div>
            <button className="btn btn-ghost btn-sm" style={{paddingRight:0}} onClick={()=>onOpenScreen("settings")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18 6l-1.8 1.8M7.8 16.2 6 18M18 18l-1.8-1.8M7.8 7.8 6 6" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Why card — leads with values */}
          <div className="card card-accent tap" style={{marginTop:18}} onClick={()=>onOpenScreen("lifemap")}>
            <div className="spread">
              <span className="label">Why you're here</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--accent)" strokeWidth="2.2"><path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p className="body" style={{marginTop:9, color:"var(--ink)", fontWeight:500}}>
              {s.lifemap.whyStatement || "Tap to write the life this is making room for."}
            </p>
          </div>

          {/* Today's lesson */}
          <span className="label muted" style={{display:"block", marginTop:26, marginBottom:10}}>Today's lesson</span>
          <div className="card tap" onClick={()=>onOpenLesson(next.slug)}>
            <div className="pillrow">
              <Pill>Week {next.week}</Pill>
              <Pill>{next.category}</Pill>
              <Pill>{next.minutes} min</Pill>
              {next.sensitive && <Pill kind="sensitive">sensitive</Pill>}
            </div>
            <h2 className="h2" style={{marginTop:13}}>{next.title}</h2>
            <p className="body" style={{marginTop:8}}>{next.prompt}</p>
            <button className="btn btn-primary block" style={{marginTop:16}} onClick={(e)=>{e.stopPropagation(); onOpenLesson(next.slug);}}>{cta}</button>
          </div>

          {/* In the moment */}
          <span className="label muted" style={{display:"block", marginTop:26, marginBottom:10}}>In the moment</span>
          <div className="card" style={{background:"linear-gradient(160deg,#0f3a4a,#114a52)", border:"none", color:"#eafaf7", overflow:"hidden", position:"relative"}}>
            <svg viewBox="0 0 360 80" preserveAspectRatio="none" style={{position:"absolute", left:0, right:0, bottom:0, width:"100%", height:64, opacity:.5}}>
              <path d="M0 40 C60 18 110 60 180 42 C250 24 300 58 360 38 L360 80 L0 80Z" fill="#2f8f8a"/>
            </svg>
            <div style={{position:"relative"}}>
              <h2 className="h2" style={{color:"#fff"}}>Riding out an urge?</h2>
              <p className="body" style={{marginTop:8, color:"#bfe6df"}}>An urge is a wave, not a command. It will crest and pass — let's ride it out together.</p>
              <button className="btn btn-sm" style={{marginTop:16, background:"#7fd3c6", color:"#063a35", fontWeight:800}} onClick={()=>onNav("urge")}>Ride it out</button>
            </div>
          </div>

          {/* quick actions */}
          <div className="row" style={{marginTop:14}}>
            <button className="btn btn-secondary grow" onClick={()=>onNav("log","log")}>Add to log</button>
            <button className="btn btn-secondary grow" onClick={()=>onNav("log","checkin")}>Daily check-in</button>
          </div>

          <div className="center" style={{marginTop:22}}>
            <span className="link" style={{fontSize:16}} onClick={()=>onOpenScreen("support")}>Need support right now?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Today });
