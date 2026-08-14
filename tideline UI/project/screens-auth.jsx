// screens-auth.jsx — VICI entry / auth flow, black-dominant.
// A self-contained INK surface (near-black, moonlit) that the app opens
// on before it "breaks to paper" — matching the onboarding's cold-open
// intent. Three screens: Splash (route-decider) · Sign in · Sign up.
//
// Exports: SplashScreen, LoginScreen, SignUpScreen, AuthFlow.

const { useState: aState } = React;

// ── local ink palette (self-contained; independent of the paper theme) ─
const AK = {
  bg0: '#07080A', bg1: '#0C0E12', bg2: '#14171D',
  ink: '#F0EFEA', ink2: '#A7A8A1', ink3: '#6E6F69', hair: 'rgba(255,255,255,0.14)',
  fieldBg: 'rgba(255,255,255,0.045)', fieldEdge: 'rgba(255,255,255,0.12)',
  foam: '#D7DEE6', water0: '#161B22', water1: '#10151B', water2: '#0B0F14', water3: '#080B0F',
  moon: '#F2ECD8', moonEdge: '#DCD3B4', star: '#C9CCC4',
};

// ── provider marks ───────────────────────────────────────────────────
const AppleMark = ({ color }) => (
  <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui", fontSize: 20, lineHeight: 1, marginTop: -3, color }}>{'\uF8FF'}</span>
);
const GoogleMark = () => (
  <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);
const MailMark = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="3" stroke={color} strokeWidth="1.7" />
    <path d="M4.5 7.5l7.5 5.5 7.5-5.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── the black-dominant hero: one moonlit sea — a single horizon, the
// moon's light laid on the water, and a small boat setting out on it ──
function NightTide({ w = 236, h = 188 }) {
  const stars = [[26, 30, 1.3, 0], [52, 18, 1, 1.4], [186, 26, 1.4, 0.6], [210, 46, 1, 2.1], [150, 20, 0.9, 1], [86, 24, 0.8, 2.6]];
  return (
    <svg width={w} height={h} viewBox="0 0 236 188" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="nt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EEE6CE" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#EEE6CE" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#EEE6CE" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nt-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={AK.water0} />
          <stop offset="100%" stopColor={AK.water3} />
        </linearGradient>
        <linearGradient id="nt-glade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={AK.foam} stopOpacity="0.5" />
          <stop offset="100%" stopColor={AK.foam} stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* sky — moon glow, stars, the moon */}
      <circle cx="118" cy="50" r="70" fill="url(#nt-glow)" className="onb-sun" />
      {stars.map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={AK.star} className="onb-twinkle" style={{ animationDelay: `${d}s` }} />
      ))}
      <g className="onb-bob">
        <circle cx="118" cy="50" r="24" fill={AK.moon} stroke={AK.moonEdge} strokeWidth="1.4" />
        <circle cx="109" cy="45" r="4" fill="#E4DBBF" opacity="0.7" />
        <circle cx="124" cy="56" r="2.8" fill="#E4DBBF" opacity="0.6" />
        <circle cx="126" cy="42" r="2" fill="#E4DBBF" opacity="0.5" />
      </g>

      {/* the sea — one body of water below a single horizon */}
      <path d="M-6 112 C 60 109.6, 176 109.6, 242 112 L242 194 L-6 194 Z" fill="url(#nt-sea)" />
      <path d="M-6 112 C 60 109.6, 176 109.6, 242 112" stroke={AK.foam} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />

      {/* the moonglade — the moon's light on the water, widening toward us */}
      <path d="M111 112.5 L125 112.5 L138 186 L98 186 Z" fill="url(#nt-glade)" />
      <g stroke={AK.foam} strokeLinecap="round">
        <path d="M113 121 h10" strokeWidth="1.5" opacity="0.7" />
        <path d="M110 133 h15" strokeWidth="1.7" opacity="0.55" />
        <path d="M112 148 h17" strokeWidth="1.9" opacity="0.42" />
        <path d="M108 165 h21" strokeWidth="2.1" opacity="0.3" />
      </g>

      {/* quiet swells — texture, not stripes */}
      <g stroke={AK.foam} strokeLinecap="round" fill="none">
        <path d="M28 130 q 10 -3 20 0" strokeWidth="1.4" opacity="0.2" />
        <path d="M170 127 q 11 -3 22 0" strokeWidth="1.4" opacity="0.2" />
        <path d="M46 158 q 12 -3.5 24 0" strokeWidth="1.6" opacity="0.14" />
        <path d="M166 155 q 12 -3.5 24 0" strokeWidth="1.6" opacity="0.14" />
      </g>

      {/* the boat — silhouetted on the glade, rim-lit by the moon */}
      <g className="onb-bob2" transform="translate(118 118)">
        <path d="M0 6 L0 -25" stroke={AK.foam} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <path d="M2 -23 C 12 -15 15 -4 15 5 L2 5 Z" fill="#171C23" stroke={AK.foam} strokeWidth="1.1" strokeOpacity="0.75" strokeLinejoin="round" />
        <path d="M-2 -18 C -10 -11 -12 -2 -12 5 L-2 5 Z" fill="#151A20" stroke={AK.foam} strokeWidth="1.1" strokeOpacity="0.55" strokeLinejoin="round" />
        <path d="M-16 6 C -9 10.5 10 10.5 18 6 L15 11 C 7 13.8 -7 13.8 -12 11 Z" fill="#10141A" stroke={AK.foam} strokeWidth="1.1" strokeOpacity="0.75" strokeLinejoin="round" />
        {/* the water it sits in — a ripple each side */}
        <path d="M-30 13 q 8 -2.5 16 0 M14 13.5 q 8 -2.5 16 0" stroke={AK.foam} strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      </g>
    </svg>
  );
}

// ── the shared ink surface: near-black moonlit ground + optional close ─
function AuthSurface({ children, onClose, brand = true, bgImg = null }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(128% 78% at 50% -6%, ${AK.bg2} 0%, ${AK.bg1} 42%, ${AK.bg0} 100%)`, color: AK.ink, fontFamily: 'var(--font)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* faint vignette + grain sit above via the frame's tl-grain */}
      {bgImg ? (
        <React.Fragment>
          <img src={bgImg} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,9,0.62) 0%, rgba(8,8,9,0.34) 40%, rgba(8,8,9,0.4) 74%, rgba(8,8,9,0.8) 100%)', pointerEvents: 'none' }} />
        </React.Fragment>
      ) : null}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '58px 29px 50px' }}>
        {(brand || onClose) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: brand ? 'space-between' : 'flex-end', marginBottom: 2 }}>
            {brand && <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 17, letterSpacing: '0.3em', color: AK.ink }}>VICI</span>}
            {onClose && (
              <button onClick={onClose} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginRight: -4, display: 'flex' }}>
                <svg width="19" height="19" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke={AK.ink3} strokeWidth="2.3" strokeLinecap="round" /></svg>
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── one provider / action button on the ink surface ──────────────────
function AuthBtn({ mark, label, variant = 'ghost', onClick }) {
  const light = variant === 'light';
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: light ? AK.ink : 'transparent',
      color: light ? AK.bg0 : AK.ink,
      boxShadow: light ? 'none' : `inset 0 0 0 1.5px ${AK.hair}`,
      fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999,
      padding: '17px 22px', letterSpacing: '-0.012em',
    }}>
      {mark && <span style={{ position: 'absolute', left: 24, display: 'flex', alignItems: 'center' }}>{mark}</span>}
      {label}
    </button>
  );
}

const authProviders = (onContinue) => ([
  <AuthBtn key="a" variant="light" mark={<AppleMark color={AK.bg0} />} label="Continue with Apple" onClick={onContinue} />,
  <AuthBtn key="g" mark={<GoogleMark />} label="Continue with Google" onClick={onContinue} />,
]);

// a dark, letterpressed static field mock
function AuthField({ label, value, placeholder, active }) {
  return (
    <div style={{ background: AK.fieldBg, borderRadius: 15, padding: '13px 17px', boxShadow: `inset 0 0 0 1.5px ${active ? 'rgba(255,255,255,0.28)' : AK.fieldEdge}` }}>
      <div style={{ fontFamily: 'var(--font)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: AK.ink3, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font)', fontSize: 16.5, fontWeight: 500, color: value ? AK.ink : AK.ink3, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center' }}>
        {value || placeholder}
        {active && <span className="tl-caret" style={{ display: 'inline-block', width: 2, height: 19, background: AK.foam, marginLeft: 1, verticalAlign: -3 }} />}
      </div>
    </div>
  );
}

const AuthLegal = () => (
  <p style={{ textAlign: 'center', fontSize: 11.5, lineHeight: 1.55, color: AK.ink3, fontWeight: 500, margin: '2px 12px 0' }}>
    By continuing you agree to our <span style={{ color: AK.ink2 }}>Terms</span> and <span style={{ color: AK.ink2 }}>Privacy Policy</span>.
  </p>
);

// ═════ 1 · SPLASH — the route-decider ════════════════════════════════
function SplashScreen({ onStart = () => {}, onSignIn = () => {} }) {
  return (
    <AuthSurface brand={false} bgImg="assets/auth-dawn.png">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="onb-rise" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Laurel size={46} color="#F5F4F1" />
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 21, letterSpacing: '0.34em', textIndent: '0.34em', color: AK.ink, marginBottom: 22 }}>VICI</div>
        <Hero size={38} style={{ color: AK.ink, textAlign: 'center', letterSpacing: '-0.01em', lineHeight: 1.16 }}>You came.<br />You saw.<br />Now conquer it.</Hero>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AuthBtn variant="light" label="Get started" onClick={onStart} />
        <div style={{ textAlign: 'center', paddingTop: 2 }}>
          <button onClick={onSignIn} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 15, fontWeight: 500, color: AK.ink2, padding: '8px 4px' }}>
            I already have an account
          </button>
        </div>
      </div>
    </AuthSurface>
  );
}

// ═════ 2 · SIGN IN ═══════════════════════════════════════════════════
function LoginScreen({ onBack = () => {}, onContinue = () => {}, onCreate = () => {} }) {
  return (
    <AuthSurface onClose={onBack} bgImg="assets/auth-dawn.png">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Hero size={37} style={{ color: AK.ink, textAlign: 'center' }}>Welcome back.</Hero>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {authProviders(onContinue)}
        <AuthBtn mark={<MailMark color={AK.ink} />} label="Continue with email" onClick={onContinue} />
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button onClick={onCreate} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14.5, fontWeight: 500, color: AK.ink3, padding: '6px 4px' }}>
            New here? <span style={{ color: AK.ink, fontWeight: 600 }}>Create an account</span>
          </button>
        </div>
      </div>
    </AuthSurface>
  );
}

// ═════ 3 · SIGN UP ═══════════════════════════════════════════════════
function SignUpScreen({ onBack = () => {}, onContinue = () => {}, onSignIn = () => {} }) {
  return (
    <AuthSurface onClose={onBack}>
      <div style={{ paddingTop: 24, marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <NightTide w={168} h={128} />
        </div>
        <Hero size={35} style={{ color: AK.ink, textAlign: 'center' }}>Create your account.</Hero>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AuthField label="Name" value="Jordan" active={false} />
        <AuthField label="Email" value="" placeholder="you@email.com" active />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AuthBtn variant="light" label="Create account" onClick={onContinue} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2px 0' }}>
          <div style={{ flex: 1, height: 1, background: AK.hair }} />
          <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: AK.ink3 }}>or</span>
          <div style={{ flex: 1, height: 1, background: AK.hair }} />
        </div>
        {authProviders(onContinue)}
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <button onClick={onSignIn} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14.5, fontWeight: 500, color: AK.ink3, padding: '6px 4px' }}>
            Already have an account? <span style={{ color: AK.ink, fontWeight: 600 }}>Sign in</span>
          </button>
        </div>
        <AuthLegal />
      </div>
    </AuthSurface>
  );
}

// ═════ LIVE FLOW — splash ⇄ sign in ⇄ sign up ════════════════════════
function AuthFlow() {
  const [route, setRoute] = aState('splash');
  return (
    <React.Fragment>
      {route === 'splash' && <SplashScreen onStart={() => setRoute('signup')} onSignIn={() => setRoute('signin')} />}
      {route === 'signin' && <LoginScreen onBack={() => setRoute('splash')} onCreate={() => setRoute('signup')} onContinue={() => setRoute('splash')} />}
      {route === 'signup' && <SignUpScreen onBack={() => setRoute('splash')} onSignIn={() => setRoute('signin')} onContinue={() => setRoute('splash')} />}
    </React.Fragment>
  );
}

Object.assign(window, { SplashScreen, LoginScreen, SignUpScreen, AuthFlow });
