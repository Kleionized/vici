// screens-account.jsx — Edit profile, Data & privacy, App lock

function EditProfileScreen() {
  const Field = ({ label, value, placeholder }) => (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', gap: 12 }}>
        <span style={{ width: 86, fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.5, color: 'var(--ink2)', flexShrink: 0 }}>{label}</span>
        <span style={{ flex: 1, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: value ? 'var(--ink)' : 'var(--ink3)', letterSpacing: 'normal' }}>{value || placeholder}</span>
      </div>
    </div>
  );
  return (
    <Shell pad={0} top={0}>
      <div style={{ padding: '60px 0 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 29px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <GhostButton size={16.5} style={{ fontWeight: 500 }}>Cancel</GhostButton>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15.5 }}>Edit profile</span>
          <button className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 15, color: 'var(--ink)', cursor: 'pointer' }}>Save</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0 26px' }}>
          <div style={{ position: 'relative' }}>
            <Avatar initials="JR" size={88} />
            <div className="tl-press" style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderRadius: 9999, cursor: 'pointer', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}>
              <svg width="15" height="15" viewBox="0 0 24 24"><path d="M4 20l4-1L19 8a2 2 0 00-3-3L5 16l-1 4z" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <GhostButton size={14.5} style={{ marginTop: 12, color: 'var(--ink)', fontWeight: 500 }}>Change photo</GhostButton>
        </div>

        <div style={{ position: 'relative', margin: '0 29px 26px', background: 'var(--card)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'none', padding: '5px 0' }}>
          <Field label="Name" value="Jordan Reyes" />
          <Field label="Username" value="@jordan" />
          <Field label="Email" value="jordan@hey.com" />
        </div>

        {/* medallions — the shelf, straight from the album */}
        <div style={{ margin: '0 29px 22px' }}>
          <SectionLabel style={{ paddingBottom: 12 }}>Medallions</SectionLabel>
          <div className="tl-press-soft" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'none', padding: '16px 18px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {['veni', 'vidi', 'vici', 'lettersent'].map((key) => {
                const k = KEEPSAKES.find((x) => x.key === key);
                return <KKMedallion key={key} scene={KK_SCENES[key]} size={50} earned tier={kkTier(k)} tierMax={k.tiers ? k.tiers.steps.length : 0} />;
              })}
              <div className="tnum" style={{ width: 50, height: 50, borderRadius: 9999, flexShrink: 0, background: 'var(--soft)', boxShadow: 'inset 0 0 0 1.4px rgba(74,74,66,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink2)' }}>+3</div>
              <div style={{ flex: 1 }} />
              {Glyph.chevR('var(--ink3)')}
            </div>
            <div className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, color: 'var(--ink3)', marginTop: 13 }}>7 earned · 2 within reach · Letter sent is newest</div>
          </div>
        </div>

        <SettingsGroup header="Recovery">
          <Row icon={<IconChip hue={230} icon={Glyph.calendar('var(--ink)')} />} title="Campaign began" detail="14 Mar 2026" />
          <Row icon={<IconChip hue={230} icon={Glyph.heart('var(--ink)')} />} title="My values" detail="4 chosen" last />
        </SettingsGroup>
      </div>
    </Shell>
  );
}

function DataPrivacyScreen() {
  return (
    <Shell pad={0} top={0}>
      <div style={{ padding: '60px 0 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader hue={250} eyebrow="Privacy" title={<>Data &amp; privacy</>} onBack={() => {}} />

        <div style={{ padding: '0 29px', marginBottom: 22 }}>
          <Card pad={20} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
            <div style={{ marginTop: 1, flexShrink: 0 }}>{Glyph.shield('var(--ink)')}</div>
            <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.45, color: 'var(--ink2)' }}>
              Your journal, urges and Life Map stay on your device and your private account. We never sell your data, ever.
            </div>
          </Card>
        </div>

        <SettingsGroup header="Your data">
          <Row icon={<IconChip hue={230} icon={Glyph.download('var(--ink)')} />} title="Export my data" detail="JSON" />
          <Row icon={<IconChip hue={230} icon={Glyph.doc('var(--ink)')} />} title="Privacy policy" />
          <Row icon={<IconChip hue={230} icon={Glyph.doc('var(--ink)')} />} title="Terms of service" last />
        </SettingsGroup>

        <SettingsGroup header="Controls" footer="Deleting your account erases your journal, urges and Life Map permanently. This can't be undone.">
          <Row icon={<IconChip hue={230} icon={Glyph.spark('var(--ink)')} />} title="Pause analytics" control={<Toggle on />} />
          <Row icon={<IconChip hue={230} icon={Glyph.trash('var(--ink)')} />} title="Delete account" last />
        </SettingsGroup>
      </div>
    </Shell>
  );
}

function AppLockScreen() {
  return (
    <Shell pad={0} top={0}>
      <div style={{ padding: '60px 0 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader hue={200} eyebrow="Security" title="App lock" onBack={() => {}} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', margin: '8px 0 24px' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', opacity: 0.16 }}>{Illo.waveline('var(--ink)', { w: 402, h: 30 })}</div>
          {/* Face ID on the dark disc — home's urge-button surface */}
          <div style={{ width: 92, height: 92, borderRadius: 9999, background: '#131313', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', position: 'relative' }}>
            {Glyph.face('#F5F4F1')}
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.45, color: 'var(--ink2)', margin: '0 29px 24px', fontWeight: 400, textAlign: 'center' }}>
          Recovery is personal. Keep VICI behind Face ID so it opens only for you.
        </p>

        <SettingsGroup header="Lock">
          <Row icon={<IconChip hue={230} icon={Glyph.face('var(--ink)')} />} title="Require Face ID" control={<Toggle on />} />
          <Row icon={<IconChip hue={230} icon={Glyph.lock('var(--ink)')} />} title="Lock when I leave the app" control={<Toggle on />} />
          <Row icon={<IconChip hue={230} icon={Glyph.clock('var(--ink)')} />} title="Ask after" detail="Immediately" last />
        </SettingsGroup>

        <SettingsGroup header="Privacy" footer="Hides journal previews and entry titles in notifications and the app switcher.">
          <Row icon={<IconChip hue={230} icon={Glyph.shield('var(--ink)')} />} title="Hide sensitive previews" control={<Toggle on />} last />
        </SettingsGroup>
      </div>
    </Shell>
  );
}

Object.assign(window, { EditProfileScreen, DataPrivacyScreen, AppLockScreen });
