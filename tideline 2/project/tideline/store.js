/* ===================== TIDELINE — store (state + persistence) ===================== */
const { createContext, useContext, useState, useEffect, useRef, useCallback } = React;

const LS = "tideline.v1";
const loadState = () => {
  try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch(e){ return {}; }
};

const DEFAULTS = {
  auth: { signedIn:false, name:"", email:"" },
  onboarded: false,
  lifemap: { whyStatement:"", oneYear:"", values:[], customValues:[] },
  progress: {},            // slug -> { status, reflection:{}, fit }
  log: [],                 // events
  checkins: [],            // daily check-ins
  urgeSession: null,       // in-progress urge { phase, intensity, duration, startedAt, ... }
  settings: { showDaysSince:false, reminder:"21:00" }
};

const AppCtx = createContext(null);
window.useApp = () => useContext(AppCtx);

function AppProvider({ children }){
  const [state, setState] = useState(() => {
    const saved = loadState();
    return { ...DEFAULTS, ...saved,
      auth:{...DEFAULTS.auth, ...(saved.auth||{})},
      lifemap:{...DEFAULTS.lifemap, ...(saved.lifemap||{})},
      settings:{...DEFAULTS.settings, ...(saved.settings||{})}
    };
  });

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify(state)); } catch(e){}
  }, [state]);

  const set = useCallback((patch) => {
    setState(s => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  // ---- actions ----
  const api = {
    state,
    // auth
    signIn:(email, name) => set({ auth:{ signedIn:true, email, name: name || "" } }),
    signOut:() => set({ auth:{ signedIn:false, name:"", email:"" } }),
    // onboarding
    setWhy:(whyStatement) => set(s => ({ lifemap:{...s.lifemap, whyStatement} })),
    setValues:(values) => set(s => ({ lifemap:{...s.lifemap, values} })),
    completeOnboarding:() => set({ onboarded:true }),
    // lifemap
    updateLifemap:(patch) => set(s => ({ lifemap:{...s.lifemap, ...patch} })),
    // lessons
    startLesson:(slug) => set(s => {
      const p = s.progress[slug] || {};
      if (p.status === "completed") return {};
      return { progress:{ ...s.progress, [slug]:{ ...p, status:"in-progress" } } };
    }),
    completeLesson:(slug, reflection, fit) => set(s => ({
      progress:{ ...s.progress, [slug]:{ status:"completed", reflection, fit } }
    })),
    // log
    addLog:(evt) => set(s => ({ log:[{ id:Date.now()+"", ts:Date.now(), ...evt }, ...s.log] })),
    addCheckin:(c) => set(s => ({ checkins:[{ id:Date.now()+"", ts:Date.now(), ...c }, ...s.checkins] })),
    // urge session
    setUrge:(session) => set({ urgeSession: session }),
    clearUrge:() => set({ urgeSession: null }),
    // settings
    updateSettings:(patch) => set(s => ({ settings:{...s.settings, ...patch} })),
    // hard reset (dev)
    reset:() => { localStorage.removeItem(LS); setState({...DEFAULTS}); }
  };

  return React.createElement(AppCtx.Provider, { value: api }, children);
}

// ---- derived helpers (pure) ----
window.tl = {
  lessonBySlug:(slug) => window.LESSONS.find(l => l.slug === slug),
  statusOf:(state, slug) => (state.progress[slug] && state.progress[slug].status) || "not-started",
  completedCount:(state) => window.LESSONS.filter(l => window.tl.statusOf(state, l.slug) === "completed").length,
  reflectionCount:(state) => Object.values(state.progress).filter(p => p.status==="completed").length,
  // next lesson = first not-completed in order
  nextLesson:(state) => window.LESSONS.find(l => window.tl.statusOf(state, l.slug) !== "completed") || window.LESSONS[window.LESSONS.length-1],
  daysSinceLapse:(state) => {
    const lapses = state.log.filter(e => e.type==="lapse");
    if (!lapses.length) return null;
    const last = Math.max(...lapses.map(e=>e.ts));
    return Math.floor((Date.now() - last) / 86400000);
  },
  // last 7 days arrays for charts
  last7:(checkins, key) => {
    const days = [];
    for (let i=6;i>=0;i--){
      const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-i);
      const start = d.getTime(), end = start + 86400000;
      const c = checkins.find(c => c.ts>=start && c.ts<end);
      days.push({ label:["S","M","T","W","T","F","S"][d.getDay()], value: c ? c[key] : null });
    }
    return days;
  },
  weekCount:(checkins, key) => {
    const start = new Date(); start.setHours(0,0,0,0); start.setDate(start.getDate()-6);
    return checkins.filter(c => c.ts>=start.getTime() && c[key]).length;
  },
  fmtTime:(ts) => {
    const d = new Date(ts), now = new Date();
    const sameDay = d.toDateString()===now.toDateString();
    const y = new Date(now); y.setDate(now.getDate()-1);
    const opts = { hour:"numeric", minute:"2-digit" };
    if (sameDay) return "Today · " + d.toLocaleTimeString([], opts);
    if (d.toDateString()===y.toDateString()) return "Yesterday · " + d.toLocaleTimeString([], opts);
    return d.toLocaleDateString([], {month:"short", day:"numeric"}) + " · " + d.toLocaleTimeString([], opts);
  }
};

Object.assign(window, { AppProvider });
