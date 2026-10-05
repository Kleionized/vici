import { useState, type ComponentType, type ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { lhNormal, mono, ring, sans, sansItalic } from '@/lib/theme';

import { GhostLink, PrimaryButton } from '../buttons';
import { Card, IconCard } from '../cards';
import { Chips, Segmented, WhenChips } from '../choices';
import { Hero } from '../Hero';
import { Bolt, Person, Quote } from '../icons';
import { NavBar, TitleHead } from '../NavBar';
import { CheckDisc, CheckinDisc, Pill } from '../pills';
import { CheckRow, CheckRows, ListRow, ListRows, Row, RowGroup, RuledRow, RuledRows, SummaryCard } from '../rows';
import { Screen } from '../Screen';
import { TabBar } from '../TabBar';
import { MonoText } from '../Text';

/** Kit-lab replicas for the rows part of the kit (rows, pills, cards). Key = the frame's split file stem. */

const noop = () => {};

/** Settings — four `RowGroup`s of 54 rows (values + `#5A574F` chevrons), ghost "Sign out" at 48. */
function Settings() {
  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Settings' }} right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 120, gap: 18 }}>
        <RowGroup label="Reminders">
          <Row label="Morning check-in" value="8:00 AM" onPress={noop} />
          <Row label="Night check-in" value="9:30 PM" onPress={noop} />
          <Row label="Weekly report" value="Every Sunday" onPress={noop} />
        </RowGroup>
        <RowGroup label="Anchors">
          <Row label="Your vow" onPress={noop} />
          <Row label="Your letter" value="Opens Week XII" onPress={noop} />
        </RowGroup>
        <RowGroup label="Privacy">
          <Row label="App lock" value="Face ID" onPress={noop} />
          <Row label="Data & privacy" onPress={noop} />
        </RowGroup>
        <RowGroup label="Account">
          <Row label="Edit profile" onPress={noop} />
          <Row label="Manage subscription" value="Yearly" valueLines={1} onPress={noop} />
        </RowGroup>
      </View>
      <GhostLink label="Sign out" bottom={48} />
    </Screen>
  );
}

/** App Lock — `Toggle` rows (on, the frame's state; tap one to see the undrawn off state). */
function AppLock() {
  const [f, setF] = useState({ faceId: true, onLeave: true, hide: true });
  const flag = (k: keyof typeof f) => ({ value: f[k], onChange: (v: boolean) => setF((s) => ({ ...s, [k]: v })) });
  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'App lock' }} right="empty" />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 124, flexDirection: 'row', justifyContent: 'center' }}>
        <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={30} height={30} viewBox="0 0 30 30">
            <Rect width={18} height={13} x={6} y={13} rx={3.5} fill="#111111" />
            <Path d="M10 13V9.5a5 5 0 0 1 10 0V13" fill="none" stroke="#111111" strokeWidth={2.6} />
            <Circle cx={15} cy={19.5} r={2} fill="#F2F0EC" />
          </Svg>
        </View>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 222, gap: 14 }}>
        <MonoText v="h1" center>
          Only opens for you.
        </MonoText>
        <MonoText v="p" center>
          This work is personal. Keep VICI behind Face ID so it opens only for you.
        </MonoText>
        <View style={{ height: 4 }} />
        <RowGroup label="Lock">
          <Row label="Require Face ID" toggle={flag('faceId')} />
          <Row label="Lock when I leave the app" toggle={flag('onLeave')} />
          <Row label="Ask after" value="Immediately" onPress={noop} />
        </RowGroup>
        <RowGroup label="Privacy">
          <Row label="Hide sensitive previews" toggle={flag('hide')} />
        </RowGroup>
        <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
          Hides journal previews and entry titles in notifications and the app switcher.
        </MonoText>
      </View>
    </Screen>
  );
}

/** Manage Subscription — the plan `Card` with a `badge` `Pill`, two `ListRows` cards, ghost at 56. */
function ManageSubscription() {
  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Subscription' }} right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 18 }}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <MonoText v="p" style={{ ...sans('700'), fontSize: 24, lineHeight: lhNormal(24), letterSpacing: -0.5, color: mono.ink }}>
                Yearly
              </MonoText>
              <MonoText v="p" style={{ marginTop: 4, fontSize: 14, lineHeight: lhNormal(14) }}>
                $39.99 a year. Renews 10 Jul 2027
              </MonoText>
            </View>
            <Pill kind="badge" label="Active" />
          </View>
          <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: mono.line, flexDirection: 'row', justifyContent: 'space-between' }}>
            <MonoText v="p" color={mono.mute} style={{ lineHeight: lhNormal(15) }}>
              Next charge
            </MonoText>
            <MonoText v="rowLabel">$39.99 on 10 Jul 2027</MonoText>
          </View>
        </Card>
        <View style={{ height: 10 }} />
        <MonoText v="caps">Plan</MonoText>
        <ListRows>
          <ListRow label="Change plan" value="Yearly" onPress={noop} />
          <ListRow label="Redeem a code" onPress={noop} />
          <ListRow label="Restore purchases" onPress={noop} />
        </ListRows>
        <View style={{ height: 10 }} />
        <MonoText v="caps">Billing</MonoText>
        <ListRows>
          <ListRow label="Payment method" value="Apple ID" onPress={noop} />
          <ListRow label="Receipts & invoices" onPress={noop} />
        </ListRows>
      </View>
      <GhostLink label="Cancel subscription" bottom={56} />
    </Screen>
  );
}

/**
 * Log Urges — `Segmented` + `RuledRows` (52, with the slip variant). The week
 * strip is screen-specific (plain boxes); the tab bar is the chrome part's own
 * `TabBar`, so the replica is the whole frame.
 */
function LogUrges() {
  const [tab, setTab] = useState('Urges');
  const days: [string, number][] = [['M', 0], ['T', 1], ['W', 0], ['T', 1], ['F', 1], ['S', 0], ['S', 0]];
  return (
    <Screen>
      <NavBar left="back" right={null} />
      <TitleHead title="Your log" />
      <Segmented items={['Urges', 'Check-ins', 'Reports']} value={tab} onChange={setTab} style={{ position: 'absolute', left: 16, right: 16, top: 164 }} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 236, alignItems: 'center', gap: 10 }}>
        <MonoText v="statValue">3</MonoText>
        <MonoText v="pTight" color={mono.mute} wrap="nowrap" center>
          Urges this week
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 32, right: 32, top: 352, flexDirection: 'row', justifyContent: 'space-between' }}>
        {days.map(([d, n], i) => (
          <View key={i} style={{ width: 36, alignItems: 'center', gap: 10 }}>
            <View style={{ height: 36, alignItems: 'center', justifyContent: 'center' }}>
              {n ? (
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
                  <MonoText v="pill" style={{ fontSize: 14, lineHeight: lhNormal(14), color: mono.onInk }}>
                    1
                  </MonoText>
                </View>
              ) : (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: mono.line }} />
              )}
            </View>
            <MonoText v="pill" style={{ fontSize: 11, lineHeight: lhNormal(11), color: i === 6 ? mono.ink : mono.art }}>
              {d}
            </MonoText>
          </View>
        ))}
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 440, gap: 8 }}>
        <RuledRows height={52}>
          <RuledRow label="Fri, 9:05 pm" value="Strong" />
          <RuledRow label="Thu, 3:10 pm" value="Mild" />
          <RuledRow label="Tue, 11:40 pm" value="Intense" />
          <RuledRow label="Sun, 10:22 pm" value="Slipped" slipped />
          <RuledRow label="Wed, 12:05 am" value="Mild" />
        </RuledRows>
      </View>
      <TabBar active="log" />
    </Screen>
  );
}

/** The done screens' shared layout, for the two `SummaryCard` widths. */
function Done({ title, body, rows, cta }: { title: string; body: string; rows: { label: string; value: string }[]; cta: string }) {
  return (
    <Screen>
      <NavBar left="empty" right="close" />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 200, flexDirection: 'row', justifyContent: 'center' }}>
        <CheckDisc size={84} />
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 308, gap: 12, alignItems: 'center' }}>
        <MonoText v="h1" center style={{ alignSelf: 'stretch' }}>
          {title}
        </MonoText>
        <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
          {body}
        </MonoText>
        <View style={{ height: 6 }} />
        <SummaryCard rows={rows} />
      </View>
      <PrimaryButton label={cta} />
    </Screen>
  );
}

const LapseDone = () => (
  <Done
    title="Slip logged."
    body="Stopped, logged, and one thing changed for next time."
    rows={[
      { label: 'When', value: 'Last night' },
      { label: 'Set off by', value: 'Late night, boredom' },
      { label: 'Changed', value: 'Phone charges outside bedroom' },
    ]}
    cta="Continue"
  />
);

/** Slip Logged — CRITIC C10's third case: the card fills the 345 column and the last value wraps (rows 54/55/55/77). */
const SlipLogged = () => (
  <Done
    title="Slip logged."
    body="You stopped, logged it, and changed something for next time."
    rows={[
      { label: 'When', value: 'Tonight, 11:40 PM' },
      { label: 'What was going on', value: 'Tired' },
      { label: 'Set off by', value: 'Phone in bed, late night' },
      { label: 'Change for next time', value: 'Phone charges outside the bedroom' },
    ]}
    cta="Continue"
  />
);

const UrgeLogDone = () => (
  <Done
    title="Urge logged."
    body="Twenty-three ridden out. Two to Bronze."
    rows={[
      { label: 'Intensity', value: 'Intense' },
      { label: 'Set off by', value: 'Late night, boredom' },
      { label: 'What I did', value: 'Rode it out' },
    ]}
    cta="Done"
  />
);

/** Your Vow Page — the quote `Card` (26 26 24) and the two `status` pills, under the hero part's pennant (T 104). */
function YourVowPage() {
  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Your vow' }} right="empty" />
      <Hero id="flag" top={104} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 340, gap: 16 }}>
        <Card padding={[26, 26, 24]}>
          <View style={{ alignItems: 'center', gap: 16 }}>
            <Quote color={mono.line} />
            <MonoText v="p" wrap="wrap" center style={{ ...sans('700'), fontSize: 23, lineHeight: 32, letterSpacing: -0.4, color: mono.ink }}>
              I’m done letting the wave decide. One evening at a time, I take the watch back.
            </MonoText>
            <MonoText v="p" wrap="nowrap" center style={{ ...sansItalic(), fontSize: 24, lineHeight: lhNormal(24), color: mono.ink }}>
              Jerry
            </MonoText>
          </View>
        </Card>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
          <Pill kind="status" filled label="Held for 92 days" />
          <Pill kind="status" label="Signed Apr 18" />
        </View>
        <MonoText v="p" color={mono.mute} center style={{ fontSize: 14, lineHeight: 21 }}>
          After a relapse you can re-sign the vow. It resets the promise, never the progress.
        </MonoText>
      </View>
      <GhostLink label="Re-sign the vow" bottom={48} />
    </Screen>
  );
}

/** Morning 1 Yesterday — `CheckRows`, the hero part's sunrise at T 506 painted after them, as the frame. */
function Morning1Yesterday() {
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 3, total: 8 }} right="close" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 20 }}>
        <MonoText v="h1">Yesterday’s record.</MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 208 }}>
        <CheckRows>
          <CheckRow label="Recovery score" value="+12 → 1,240" />
          <CheckRow label="Pledge kept" />
          <CheckRow label="One urge surfed" />
          <CheckRow label="0 slips" />
          <CheckRow label="Part III finished" />
        </CheckRows>
      </View>
      <Hero id="sunrise" top={506} />
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

// ── extra replicas: the pill, card and disc variants the required frames do not exercise ──
// Keys carry `@choices` so they never shadow another part's replica of the same frame;
// diff them against the frame's PNG with the regions they leave out ignored.

/** Your Plan — five `IconCard`s (the 20 glyphs are the frame's own, screen-specific). */
function YourPlan() {
  const g = { fill: 'none', stroke: '#111111', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  const rows: [string, string, ReactNode][] = [
    ['Late at night', 'When it usually happens', <Path key="moon" d="M14 3a8 8 0 1 0 3 12.5A7 7 0 0 1 14 3z" fill="#111111" />],
    ['In bed', 'Where it usually happens', <Path key="bed" d="M3 6v9M3 12h14v3M17 12v-3a2 2 0 0 0-2-2H8v4" {...g} />],
    [
      'Scrolling',
      'What tends to set it off',
      <G key="phone">
        <Rect width={10} height={15} x={5} y={2.5} rx={2.5} fill="none" stroke="#111111" strokeWidth={2} />
        <Path d="M10 7v6M8 11l2 2 2-2" {...g} strokeWidth={1.8} />
      </G>,
    ],
    ['Phone out of bed', 'Your first change', <Path key="cal" d="M7 3v4M13 3v4M5 7h10v3a5 5 0 0 1-10 0z M10 15v3" {...g} />],
    ['SOS gets you out first', 'When an urge hits', <Path key="bolt" d="M11 2L4 11h6l-1 7 7-9h-6z" fill="#111111" />],
  ];
  return (
    <Screen>
      <NavBar left="back" right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 170, gap: 14 }}>
        <MonoText v="h1">Your plan</MonoText>
        <View style={{ height: 6 }} />
        {rows.map(([title, sub, art]) => (
          <IconCard
            key={title}
            title={title}
            sub={sub}
            icon={
              <Svg width={20} height={20} viewBox="0 0 20 20">
                {art}
              </Svg>
            }
          />
        ))}
      </View>
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

/**
 * Paywall — the `selected` and `outline` plan `Card`s with the `inverse` and
 * `empty` radios, and the 34 `CheckDisc` feature row. The laurel (28 at 24,66)
 * is the hero part's — ignore `24,66,28,28`. The "Save 74%" tab on the card's
 * edge is paywall-only, drawn plainly here.
 */
function Paywall() {
  const plan = (on: boolean, name: string, note: string, price: string, per: string, line: string) => {
    const fg = on ? mono.onInk : mono.ink;
    const soft = on ? mono.onInkMuted : mono.mute;
    return (
      <Card variant={on ? 'selected' : 'outline'} style={{ flex: 1 }}>
        {on ? (
          <View
            style={{ position: 'absolute', top: -12, left: 18, height: 24, borderRadius: 12, backgroundColor: mono.card, boxShadow: ring.outlineInk, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
            <MonoText v="pill" wrap="nowrap" style={{ fontSize: 11, lineHeight: lhNormal(11), letterSpacing: 1 }}>
              Save 74%
            </MonoText>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText v="pill" style={{ fontSize: 18, lineHeight: lhNormal(18), color: fg }}>
            {name}
          </MonoText>
          <CheckDisc size={22} state={on ? 'inverse' : 'empty'} />
        </View>
        <MonoText v="pill" style={{ marginTop: 6, fontSize: 12, lineHeight: lhNormal(12), color: soft }}>
          {note}
        </MonoText>
        <MonoText v="pill" style={{ marginTop: 22, fontSize: 26, lineHeight: lhNormal(26), letterSpacing: -0.8, color: fg }}>
          {price}
          <MonoText v="pill" style={{ fontSize: 13, letterSpacing: 0, color: soft }}>
            {per}
          </MonoText>
        </MonoText>
        <MonoText v="pill" style={{ marginTop: 2, color: on ? 'rgba(17,17,17,0.7)' : mono.mute }}>
          {line}
        </MonoText>
      </Card>
    );
  };
  return (
    <Screen>
      <View style={{ position: 'absolute', right: 24, top: 70 }}>
        <MonoText v="rowLabel" color={mono.mute}>
          Restore
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, top: 66, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 28, height: 28 }} />
        <MonoText v="pill" wrap="nowrap" style={{ fontSize: 14, lineHeight: lhNormal(14) }}>
          VICI Unlimited
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 130, gap: 14 }}>
        <MonoText v="titleCover">Take your life back.</MonoText>
        <MonoText v="p">Break the cycle, rebuild your self-control, and become someone you can trust again.</MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 318, flexDirection: 'row', gap: 12 }}>
        {plan(true, 'Yearly', 'Best value', '$39.99', '/year', '$3.33 a month')}
        {plan(false, 'Monthly', 'Cancel anytime', '$12.99', '/month', 'Billed monthly')}
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 520 }}>
        <MonoText v="caps">What you get</MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 552, flexDirection: 'row', gap: 8 }}>
        {['12-week plan', 'SOS help', 'Weekly insights', 'Progress tracking'].map((f) => (
          <View key={f} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
            <CheckDisc size={34} />
            <MonoText v="pill" wrap="wrap" center style={{ fontSize: 12, lineHeight: 16, color: mono.sub }}>
              {f}
            </MonoText>
          </View>
        ))}
      </View>
      <PrimaryButton label="Continue" bottom={82} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 52 }}>
        <MonoText v="legal" center>
          Terms · Restore
        </MonoText>
      </View>
    </Screen>
  );
}

/**
 * Today Home — the `streak`, `delta` and `checkin` pills (and the ringed avatar
 * the header pairs them with). The week strip (130–215), the score chart
 * (330–615) and the tab bar (748–852) are other parts' — ignore them.
 */
function TodayHome() {
  return (
    <Screen>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <MonoText v="greeting">Good morning.</MonoText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Pill kind="streak" label="41" />
          <View style={{ width: 40, height: 40, borderRadius: 20, boxShadow: ring.outline, alignItems: 'center', justifyContent: 'center' }}>
            <Person />
          </View>
        </View>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 240, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View style={{ gap: 12 }}>
          <MonoText v="caps">Recovery score</MonoText>
          <MonoText v="statValue" style={{ fontSize: 56, lineHeight: 56, letterSpacing: -0.5 }}>
            1,240
          </MonoText>
        </View>
        <Pill kind="delta" label="18" style={{ marginBottom: 8 }} />
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 622 }}>
        <MonoText v="caps" style={{ lineHeight: 16 }}>
          This morning
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 650, flexDirection: 'row', gap: 10 }}>
        <Pill kind="checkin" label="Fine" lead={<CheckinDisc tone="#BAB5AD" />} />
        <Pill kind="checkin" label="Low energy" lead={<CheckinDisc icon={<Bolt />} />} />
      </View>
    </Screen>
  );
}

/** Where We’d Start — the `place` pills (wrapping, centred). The hero (T 190) is the hero part's — ignore `0,100,393,350`. */
function WhereWedStart() {
  return (
    <Screen>
      <NavBar left="empty" right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 451, gap: 16, alignItems: 'center' }}>
        <MonoText v="h1" center style={{ alignSelf: 'stretch' }}>
          Sam, this is where we’d start.
        </MonoText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 4 }}>
          <Pill kind="place" label="Late at night" />
          <Pill kind="place" label="Home alone" />
          <Pill kind="place" label="Phone in bed" />
        </View>
        <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
          These came up together in your answers.
        </MonoText>
        <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
          You don’t need to change everything at once.{' '}
          <MonoText v="p" style={{ ...sans('700'), color: mono.ink }}>
            Start with this.
          </MonoText>
        </MonoText>
      </View>
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

/**
 * Urge Overview (Strength page) — the `range` `Pill` in the nav, a four-item
 * `Segmented`, and the 46 dot rows (`RuledRow` with `labelWidth` and its own
 * right side). The bubble chart (352–508) is the logs group's — plain dots here.
 */
function UrgeOverview() {
  const [tab, setTab] = useState('Strength');
  const cols = [1, 1, 3, 3, 1];
  const rows: [string, number][] = [['Stress', 5], ['Late night', 4], ['Boredom', 3], ['Tiredness', 1]];
  return (
    <Screen>
      <NavBar left="back" right={{ node: <Pill kind="range" label="Last 30 days" /> }} />
      <TitleHead title="Urge overview" />
      <Segmented items={['Overview', 'Strength', 'Mood', 'Timing']} value={tab} onChange={setTab} style={{ position: 'absolute', left: 16, right: 16, top: 164 }} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 236, alignItems: 'center', gap: 10 }}>
        <MonoText v="statValue" style={{ fontSize: 44, letterSpacing: -1.5 }}>
          Strong
        </MonoText>
        <MonoText v="pTight" color={mono.mute} wrap="nowrap" center>
          Most urges
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 40, right: 40, top: 352, gap: 12 }}>
        <View style={{ height: 96, flexDirection: 'row', alignItems: 'flex-end' }}>
          {cols.map((n, i) => (
            <View key={i} style={{ flex: 1, flexDirection: 'column-reverse', alignItems: 'center', gap: 7 }}>
              {Array.from({ length: n }, (_, k) => (
                <View key={k} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: mono.ink }} />
              ))}
            </View>
          ))}
        </View>
        <View style={{ height: 1, backgroundColor: mono.line }} />
        <View style={{ flexDirection: 'row' }}>
          {cols.map((_, i) => (
            <MonoText key={i} v="pill" center style={{ flex: 1 }}>
              {String(i + 1)}
            </MonoText>
          ))}
        </View>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 524 }}>
        <RuledRows height={46}>
          {rows.map(([label, n]) => (
            <RuledRow key={label} label={label} labelWidth={96}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {Array.from({ length: n }, (_, k) => (
                  <View key={k} style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: mono.ink }} />
                ))}
              </View>
              <MonoText v="rowValue">{String(n)}</MonoText>
            </RuledRow>
          ))}
        </RuledRows>
      </View>
    </Screen>
  );
}

/**
 * Region checks for the variants no required frame draws — diff only the
 * named region (the rest of each frame is other parts' or screen-specific):
 * Enlisting Aegis step discs (`done` / `current` / `pending`, 20,455,350,130),
 * Urge Hub Now `darkTag`s on the dark ground (40,540,315,48), Starting Score's
 * `outline` pill (135,488,124,46).
 */
function EnlistingAegis() {
  const steps: ['done' | 'current' | 'pending', string][] = [
    ['done', 'Finding where you usually struggle'],
    ['current', 'Looking at what tends to set it off'],
    ['pending', 'Choosing where to start'],
  ];
  return (
    <Screen>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 462, gap: 18 }}>
        {steps.map(([state, label]) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <CheckDisc size={26} state={state} />
            <MonoText v="gridLabel" wrap="wrap" color={state === 'pending' ? mono.mute : mono.ink} style={[{ flex: 1 }, state === 'pending' ? sans('400') : null]}>
              {label}
            </MonoText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

function UrgeHubNow() {
  return (
    <Screen variant="dark">
      <View style={{ position: 'absolute', left: 0, right: 0, top: 546, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        <Pill kind="darkTag" label="Bored" />
        <Pill kind="darkTag" label="Relationship" />
        <Pill kind="darkTag" label="Work or school" />
      </View>
    </Screen>
  );
}

function StartingScore() {
  return (
    <Screen>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 494, flexDirection: 'row', justifyContent: 'center' }}>
        <Pill kind="outline" label="Starting point" />
      </View>
    </Screen>
  );
}

/** Region checks: Score Detail's `range` pill with its dot (135,244,124,40); L1 F5's `lessonTag` (74,255,124,30, lesson ground). */
function ScoreDetail() {
  return (
    <Screen>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 248, flexDirection: 'row', justifyContent: 'center' }}>
        <Pill kind="range" dot label="Navigator II" />
      </View>
    </Screen>
  );
}

function L1Frame5() {
  return (
    <Screen variant="lesson">
      <View style={{ position: 'absolute', left: 78, top: 258.5 }}>
        <Pill kind="lessonTag" label="Change this part" />
      </View>
    </Screen>
  );
}

/**
 * Not a frame: the states no frame draws, and the behaviour the verifier asked
 * about, in one place to look at and drive — a falling `delta`, a glyph-less
 * streak, a record row's negative (`empty` disc), rows inside a Fragment (still
 * ruled, +1), a pressable `Card` (role button), the when-chips wrapping in a
 * narrow column, and `max` refusing a pick without an `onChange`
 * (`[data-testid=changes]` counts the calls).
 */
function States() {
  const [picked, setPicked] = useState<string[]>(['Sleep', 'Focus']);
  const [changes, setChanges] = useState(0);
  const [when, setWhen] = useState<string | null>('Just now');
  const [on, setOn] = useState(true);
  const premium = true;
  return (
    <Screen>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 64, gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Pill kind="delta" label="18" />
          <Pill kind="delta" down label="6" />
          <Pill kind="streak" label="41" lead={null} />
        </View>
        <CheckRows>
          <CheckRow label="Pledge kept" />
          <CheckRow label="No urges logged" done={false} />
        </CheckRows>
        <RowGroup label="Fragment">
          <Row label="First" value="54" />
          {premium && (
            <>
              <Row label="Second" value="55" />
              <Row label="Third" toggle={{ value: on, onChange: setOn }} />
            </>
          )}
        </RowGroup>
        <Card padding={[18, 20]} onPress={noop} accessibilityLabel="Pressable card">
          <MonoText v="rowLabel">A card with onPress</MonoText>
        </Card>
        <View style={{ width: 300 }}>
          <WhenChips options={['Just now', 'Earlier today', 'Yesterday']} value={when} onChange={setWhen} />
        </View>
        <Chips
          multi
          max={2}
          options={['Sleep', 'Focus', 'Mood']}
          value={picked}
          onChange={(k) => {
            setPicked(k);
            setChanges((n) => n + 1);
          }}
        />
        <MonoText v="caps" testID="changes">{`onChange calls: ${changes}`}</MonoText>
      </View>
    </Screen>
  );
}

export const LAB_ROWS: Record<string, ComponentType> = {
  'States@choices': States,
  Settings,
  'App-Lock': AppLock,
  'Manage-Subscription': ManageSubscription,
  // the chrome part's bar-only `Log-Urges` is spread later and wins the plain key; this is the whole
  // frame (segmented, ruled rows, the chrome part's real `TabBar`) — the orchestrator picks which keeps it
  'Log-Urges@choices': LogUrges,
  'Lapse-Done': LapseDone,
  'Slip-Logged@choices': SlipLogged,
  'Urge-Log-Done': UrgeLogDone,
  'Your-Vow-Page': YourVowPage,
  'Morning-1-Yesterday': Morning1Yesterday,
  'Your-Plan@choices': YourPlan,
  'Paywall@choices': Paywall,
  'Today-Home@choices': TodayHome,
  'Where-We-d-Start@choices': WhereWedStart,
  'Urge-Overview@choices': UrgeOverview,
  'Enlisting-Aegis@choices': EnlistingAegis,
  'Urge-Hub-Now@choices': UrgeHubNow,
  'Starting-Score@choices': StartingScore,
  'Score-Detail@choices': ScoreDetail,
  'L1-Frame-5@choices': L1Frame5,
};
