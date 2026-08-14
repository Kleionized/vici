// screens-notify.jsx — Notification permission primer + Reminder settings
//
// The primer shows the notes themselves: three iOS-style banners, exactly
// as they'd arrive on the lock screen — instead of describing them with
// icons. Discretion is the promise for this category, so it's stated.

function NotifBanner({ title, time, msg }) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 15px', borderRadius: 20,
      background: 'var(--card)',
      boxShadow: 'none',
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 9.5, flexShrink: 0, background: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}>
        <Laurel size={21} color={'var(--on-fill)'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)', letterSpacing: '-0.005em' }}>{title}</span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, color: 'var(--ink3)', flexShrink: 0 }}>{time}</span>
        </div>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'var(--ink2)', margin: '3px 0 0', textWrap: 'pretty' }}>{msg}</p>
      </div>
    </div>
  );
}

function NotifPrimerScreen() {
  const examples = [
    ['Morning check-in', '8:00 AM', 'Twenty seconds — how did you sleep, and where\'s your head today?'],
    ['A quiet word', '10:52 PM', 'This hour is usually your hardest. One breath before the scroll.'],
    ['Worth noticing', '6:15 PM', 'Day XXIV — you\'ve ridden every wave this week.'],
  ];
  return (
    <Shell top={74}>
      <OnboardTop step={8} total={9} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, marginTop: 6 }}>
          <Eyebrow>Notifications</Eyebrow>
        </div>
        <Hero size={36} style={{ textAlign: 'center', marginBottom: 12 }}>Stay close</Hero>
        <p style={{ fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.5, color: 'var(--ink2)', margin: '0 0 26px', fontWeight: 400, textAlign: 'center', textWrap: 'pretty' }}>
          The hardest moments rarely happen inside the app. These are the only kinds of notes we'd send — exactly as they'd arrive.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {examples.map(([t, time, m]) => <NotifBanner key={t} title={t} time={time} msg={m} />)}
        </div>

      </div>

      <div>
        <PillButton full size={15.5} style={{ padding: '16px 0', marginBottom: 10 }}>Turn on reminders</PillButton>
        <div style={{ textAlign: 'center' }}>
          <GhostButton size={15}>Not now</GhostButton>
        </div>
      </div>
    </Shell>
  );
}

function ReminderSettingsScreen() {
  return (
    <Shell pad={0} top={0}>
      <div style={{ padding: '60px 0 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader hue={285} eyebrow="Settings" title="Reminders" onBack={() => {}} />

        <SettingsGroup header="Daily check-in">
          <Row icon={<IconChip hue={285} icon={Glyph.sun('var(--ink)')} />} title="Morning check-in" control={<Toggle on />} />
          <Row icon={<IconChip hue={285} icon={Glyph.clock('var(--ink)')} />} title="Time" detail="8:00 AM" last />
        </SettingsGroup>

        <SettingsGroup header="Smart nudges" footer="VICI learns when your urges tend to spike and sends quiet support a little before — never more than twice a day.">
          <Row icon={<IconChip hue={285} icon={Glyph.wave('var(--ink)')} />} title="Risk-time support" control={<Toggle on />} />
          <Row icon={<IconChip hue={285} icon={Glyph.moon('var(--ink)')} />} title="Evening wind-down" control={<Toggle on />} />
          <Row icon={<IconChip hue={285} icon={Glyph.spark('var(--ink)')} />} title="Weekly reflection" control={<Toggle />} last />
        </SettingsGroup>

        <SettingsGroup header="Tone" footer="Calm keeps language soft and shame-free. We never send streak alarms.">
          <Row icon={<IconChip hue={285} icon={Glyph.leaf('var(--ink)')} />} title="Calm" control={<div>{Glyph.check('var(--ink)', 3)}</div>} />
          <Row icon={<IconChip hue={285} icon={Glyph.flag('var(--ink)')} />} title="Direct" control={<span style={{ width: 20 }} />} last />
        </SettingsGroup>
      </div>
    </Shell>
  );
}

Object.assign(window, { NotifPrimerScreen, ReminderSettingsScreen });
