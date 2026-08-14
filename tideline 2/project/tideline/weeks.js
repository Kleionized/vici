/* ===================== TIDELINE — Weeks (lesson browser) ===================== */

function Weeks({ onOpenLesson }){
  const app = useApp(); const s = app.state;
  const total = window.LESSONS.length;
  const done = window.tl.completedCount(s);

  // group lessons by week
  const groups = {};
  window.LESSONS.forEach(l => { (groups[l.week] = groups[l.week] || []).push(l); });
  const weekNums = Object.keys(groups).map(Number).sort((a,b)=>a-b);

  return (
    <div className="screen">
      <StatusBar/>
      <div className="scroll pb-tab">
        <div className="safe-top"/>
        <div className="pad">
          <span className="label muted">Your path</span>
          <h1 className="h1" style={{marginTop:6}}>Weeks</h1>
          <p className="body" style={{marginTop:10}}>
            <strong style={{color:"var(--ink)"}}>{done} of {total} lessons complete</strong> — move at your own pace, there's no clock.
          </p>

          {weekNums.map(wk => (
            <div key={wk}>
              <div className="weekhdr">
                <span className="wk">Week {wk}</span>
                <WaveLineMini/>
                <span className="wk" style={{color:"var(--accent)"}}>{window.WEEKS_META[wk]}</span>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:10}}>
                {groups[wk].map(l => {
                  const st = window.tl.statusOf(s, l.slug);
                  const meta = window.STATUS_META[st];
                  return (
                    <div key={l.slug} className="lessonrow" style={{borderLeftColor:meta.border}} onClick={()=>onOpenLesson(l.slug)}>
                      <div className="grow">
                        <div className="lr-title">{l.title}</div>
                        <div className="lr-status" style={{color:meta.color}}>{meta.label}</div>
                      </div>
                      {l.sensitive && <Pill kind="sensitive">sensitive</Pill>}
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" style={{flex:"none"}}><path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WaveLineMini(){
  return <svg className="grow" height="10" viewBox="0 0 100 10" preserveAspectRatio="none" style={{maxWidth:90}}>
    <path d="M0 6 C15 1 25 9 40 5 C55 1 65 9 80 5 C90 2 95 6 100 5" fill="none" stroke="var(--line)" strokeWidth="2"/>
  </svg>;
}

Object.assign(window, { Weeks });
