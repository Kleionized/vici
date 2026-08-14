/* ===================== TIDELINE — app router + mount ===================== */
const { useState: uS, useEffect: uE } = React;

function Root(){
  const app = useApp(); const s = app.state;
  const [booting, setBooting] = uS(true);
  const [authScreen, setAuthScreen] = uS("signin");   // signin | signup
  const [onbStep, setOnbStep] = uS(0);                 // 0..3
  const [tab, setTab] = uS("today");
  const [logTab, setLogTab] = uS("log");
  const [overlay, setOverlay] = uS(null);              // {name, params}
  const [navKey, setNavKey] = uS(0);                   // forces slide anim on tab change

  // splash → decide
  uE(() => { const t = setTimeout(()=>setBooting(false), 1500); return ()=>clearTimeout(t); }, []);

  const goTab = (t, sub) => {
    setOverlay(null);
    if (t==="log" && sub) setLogTab(sub);
    setTab(t); setNavKey(k=>k+1);
  };
  const openLesson = (slug) => setOverlay({ name:"lesson", params:{ slug } });
  const openScreen = (name) => setOverlay({ name });
  const closeOverlay = () => setOverlay(null);

  // ---------- boot / auth / onboarding gates ----------
  if (booting) return <Splash/>;

  if (!s.auth.signedIn){
    return authScreen==="signin"
      ? <SignIn onSignIn={(email)=>app.signIn(email)} onGoSignUp={()=>setAuthScreen("signup")}/>
      : <SignUp onSignUp={(email,name)=>app.signIn(email,name)} onGoSignIn={()=>setAuthScreen("signin")}/>;
  }

  if (!s.onboarded){
    if (onbStep===0) return <OnbWelcome onNext={()=>setOnbStep(1)}/>;
    if (onbStep===1) return <OnbWhy value={s.lifemap.whyStatement} onChange={app.setWhy} onNext={()=>setOnbStep(2)}/>;
    if (onbStep===2) return <OnbValues value={s.lifemap.values} onChange={app.setValues} onNext={()=>setOnbStep(3)}/>;
    return <OnbDone lifemap={s.lifemap} onEnter={()=>app.completeOnboarding()}/>;
  }

  // ---------- overlays (pushed over tabs) ----------
  if (overlay){
    const { name, params } = overlay;
    const ov = (
      name==="lesson" ? <LessonPlayer slug={params.slug} onClose={closeOverlay}
                          onComplete={()=>{ setOverlay(null); goTab("today"); }}
                          onOpenUrge={()=>{ setOverlay(null); goTab("urge"); }}
                          onOpenSupport={()=>setOverlay({name:"support"})}/> :
      name==="lifemap" ? <LifeMap onClose={closeOverlay}/> :
      name==="settings" ? <Settings onClose={closeOverlay} onOpenScreen={(n)=>setOverlay({name:n})}
                            onSignOut={()=>{ setOverlay(null); app.signOut(); }}/> :
      name==="support" ? <Support onClose={closeOverlay}/> : null
    );
    return <div className="slide-in screenfill" key={name+(params?params.slug:"")}>{ov}</div>;
  }

  // ---------- main tabs ----------
  const screen =
    tab==="today" ? <Today onNav={goTab} onOpenLesson={openLesson} onOpenScreen={openScreen}/> :
    tab==="weeks" ? <Weeks onOpenLesson={openLesson}/> :
    tab==="urge"  ? <UrgeTool onExit={(type)=>{ goTab(type==="urge-out"||type==="urge-acted" ? "log" : "today", type?"history":undefined); }}/> :
    tab==="log"   ? <Log initialTab={logTab}/> :
    tab==="you"   ? <Dashboard onNav={goTab} onOpenScreen={openScreen}/> : null;

  return (
    <React.Fragment>
      <div key={navKey} className="fade-in screenfill">{screen}</div>
      <TabBar active={tab} onNav={(t)=>goTab(t)}/>
    </React.Fragment>
  );
}

/* ---------- phone scaling ---------- */
function fitPhone(){
  const phone = document.querySelector(".phone");
  if (!phone) return;
  const m = 24;
  const sc = Math.min((window.innerWidth - m)/390, (window.innerHeight - m)/844, 1);
  phone.style.transform = `scale(${sc})`;
}
window.addEventListener("resize", fitPhone);

function Mount(){
  uE(()=>{ fitPhone(); }, []);
  return (
    <AppProvider>
      <Root/>
    </AppProvider>
  );
}

ReactDOM.createRoot(document.getElementById("app-root")).render(<Mount/>);
