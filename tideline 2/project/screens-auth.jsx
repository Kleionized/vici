// screens-auth.jsx — VICI sign-in ("I already have an account").
// Modelled on the Flo provider-button layout (Apple · Google · email
// stacked at the foot, a calm credibility hero up top), rebuilt in
// VICI's calm-monochrome system. Floats its visual directly on the
// Stage atmosphere — no framed card.
//
// Exports: LoginScreen.

const { useState: aState } = React;

const AUTH_HUE = 208;

// ── provider marks ───────────────────────────────────────────────────
// Apple uses the SF system glyph; Google keeps its official mark (a
// functional SSO logo); email is a plain monochrome envelope.
const AppleMark = ({ color }) => (
  <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui", fontSize: 21, lineHeight: 1, marginTop: -3, color }}>{'\uF8FF'}</span>
);
const GoogleMark = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);
const MailMark = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="3" stroke={color} strokeWidth="1.8" />
    <path d="M4.5 7.5l7.5 5.5 7.5-5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── one provider button: left-anchored mark, centred label ───────────
function AuthBtn({ mark, label, variant = 'neutral', onClick }) {
  const dark = variant === 'dark';
  return (
    <button onClick={onClick} className="tl-press" style={{
      appearance: 'none', border: 'none', cursor: 'pointer', width: '100%', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: dark ? 'var(--fill)' : 'var(--card)',
      color: dark ? 'var(--on-fill)' : 'var(--ink)',
      boxShadow: dark
        ? 'none'
        : 'inset 0 0 0 1.5px var(--line)',
      fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5, borderRadius: 9999,
      padding: '18px 22px', letterSpacing: '-0.012em',
    }}>
      <span style={{ position: 'absolute', left: 26, display: 'flex', alignItems: 'center' }}>{mark}</span>
      {label}
    </button>
  );
}

// ── the calm credibility hero — wordmark + floating tide, no card ────
function AuthHero() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="onb-rise" style={{ position: 'relative', width: '100%', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
        <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '78%', height: '82%', borderRadius: '50%', background: `radial-gradient(circle, ${tint(AUTH_HUE, 0.8, 0.1, 0.16)}, transparent 70%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}><TideScene hue={AUTH_HUE} w={234} h={150} /></div>
      </div>
      <Hero size={38} style={{ textAlign: 'center' }}>Welcome back.</Hero>
      <Lead style={{ marginTop: 13, fontSize: 17, maxWidth: 290 }}>Sign in to pick up right where you left off.</Lead>
    </div>
  );
}

function LoginScreen({ onBack = () => {}, onContinue = () => {}, onCreate = () => {} }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', fontFamily: 'var(--font)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Aura hue={AUTH_HUE} intensity={1} dots />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '60px 29px 52px' }}>
        {/* top: brand + close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 17, letterSpacing: '0.26em', color: 'var(--ink)' }}>VICI</span>
          <button onClick={onBack} className="tl-press" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, marginRight: -4, display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="var(--ink3)" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </button>
        </div>

        <AuthHero />

        {/* foot: providers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AuthBtn variant="dark" mark={<AppleMark color="var(--on-fill)" />} label="Continue with Apple" onClick={onContinue} />
          <AuthBtn mark={<GoogleMark />} label="Continue with Google" onClick={onContinue} />
          <AuthBtn mark={<MailMark color="var(--ink)" />} label="Continue with email" onClick={onContinue} />
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <GhostButton size={15} onClick={onCreate}>New here? <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Create an account</span></GhostButton>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, lineHeight: 1.5, color: 'var(--ink3)', fontWeight: 500, margin: '4px 14px 0' }}>
            By continuing you agree to our <span style={{ color: 'var(--ink2)' }}>Terms</span> and <span style={{ color: 'var(--ink2)' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreen });
