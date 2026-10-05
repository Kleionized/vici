import { useState, type ComponentType, type ReactNode } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { lhNormal, mono, monoDark, ring, sans } from '@/lib/theme';

import { GhostLink, PrimaryButton } from '../buttons';
import { TextField } from '../Field';
import { Hero, heroArtBottom, heroArtTop } from '../Hero';
import { ChevronR } from '../icons';
import { NavBar } from '../NavBar';
import { PledgeCard } from '../PledgeCard';
import { Pill } from '../pills';
import { Spinner, StepList } from '../Progress';
import { Row, RowGroup } from '../rows';
import { PagerDots } from '../scales';
import { Screen, ScrollRegion, useCanvasTop } from '../Screen';
import { SHEET_TOP, Sheet } from '../Sheet';
import { Tap } from '../Tap';
import { MonoText } from '../Text';
import { DayToggles, TimeWheel, wheelFromMinutes, wheelToMinutes, type WheelTime } from '../TimeWheel';

/*
 * Kit-lab replicas for the overlay part: sheets, the time wheel, fields, the
 * pledge card and the progress pieces. The screens the sheets lie over, the
 * when-chips and the date row are plain boxes; the heroes and the photo
 * sheet's rows come from their own kit parts so the whole frame compares.
 */

type HeroKey = Parameters<typeof heroArtBottom>[0];

/**
 * D320 rule 1 on the boards below: a decorative hero whose art would reach the
 * highest control on a short screen is left out (at 393 × 852 and taller every
 * one of them clears its controls, as drawn). `controls` is the space the
 * controls take off the bottom edge: the pill's `bottom` + its 58.
 */
function useHeroClears(id: HeroKey, top: number, scale: number | undefined, controls: number) {
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  return heroArtBottom(id, top, scale) <= height - canvasTop - controls;
}

// ── plain stand-ins for the screens under the sheets ─────────────────────────

type PlainRow = { label: string; value?: string; chevron?: boolean; muted?: boolean };

/** The 54-row settings group, as plain boxes (rows after the first are 54 + the 1pt rule, as CSS lays them out). */
function PlainGroup({ caps, rows }: { caps?: string; rows: PlainRow[] }) {
  const card = (
    <View style={{ borderRadius: 20, backgroundColor: mono.card, overflow: 'hidden' }}>
      {rows.map((r, i) => (
        <View
          key={r.label}
          style={{
            height: i === 0 ? 54 : 55,
            paddingHorizontal: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            borderTopWidth: i === 0 ? 0 : 1,
            borderTopColor: mono.line,
          }}>
          <MonoText v="rowLabel" color={r.muted ? mono.mute : mono.ink}>
            {r.label}
          </MonoText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {r.value ? <MonoText v="rowValue">{r.value}</MonoText> : null}
            {r.chevron ? <ChevronR color={mono.art} /> : null}
          </View>
        </View>
      ))}
    </View>
  );
  if (!caps) return card;
  return (
    <View style={{ gap: 10 }}>
      <MonoText v="caps">{caps}</MonoText>
      {card}
    </View>
  );
}

function EditProfileBackdrop() {
  return (
    <>
      <NavBar left="back" centre={{ title: 'Edit profile' }} right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 124, gap: 18 }}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ ...sans('700'), fontSize: 38, lineHeight: lhNormal(38), color: mono.onInk }}>S</Text>
          </View>
          <Text style={{ ...sans('700'), fontSize: 14, lineHeight: lhNormal(14), color: mono.ink }}>Change photo</Text>
        </View>
        <View style={{ height: 4 }} />
        <PlainGroup
          rows={[
            { label: 'Name', value: 'Sam Reyes', chevron: true },
            { label: 'Username', value: '@sam', chevron: true },
            { label: 'Email', value: 'sam@example.com', chevron: true },
          ]}
        />
        <PlainGroup
          caps="Journey"
          rows={[
            { label: 'Started VICI', value: '14 Mar 2026' },
            { label: 'Current week', value: 'Week VI, Discipline' },
            { label: 'Medallions', value: '10 of 12', chevron: true },
          ]}
        />
      </View>
    </>
  );
}

function SettingsBackdrop() {
  return (
    <>
      <NavBar left="back" centre={{ title: 'Settings' }} right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 120, gap: 18 }}>
        <PlainGroup
          caps="Reminders"
          rows={[
            { label: 'Morning check-in', value: '8:00 AM', chevron: true },
            { label: 'Night check-in', value: '9:30 PM', chevron: true },
            { label: 'Weekly report', value: 'Every Sunday', chevron: true },
          ]}
        />
        <PlainGroup
          caps="Anchors"
          rows={[
            { label: 'Your vow', chevron: true },
            { label: 'Your letter', value: 'Opens Week XII', chevron: true },
          ]}
        />
        <PlainGroup
          caps="Privacy"
          rows={[
            { label: 'App lock', value: 'Face ID', chevron: true },
            { label: 'Data & privacy', chevron: true },
          ]}
        />
        <PlainGroup
          caps="Account"
          rows={[
            { label: 'Edit profile', chevron: true },
            { label: 'Manage subscription', value: 'Yearly', chevron: true },
          ]}
        />
      </View>
      <GhostLink label="Sign out" bottom={48} />
    </>
  );
}

// ── sheets ───────────────────────────────────────────────────────────────────

function ChangePledgeSheet() {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState('Phone stays out of the bedroom');
  return (
    <Screen>
      <Sheet
        open={open}
        top={SHEET_TOP.pledge}
        onClose={() => setOpen(false)}
        footer={
          <>
            <PrimaryButton label="Sign the new pledge" bottom={96} />
            <GhostLink label="Keep current pledge" onPress={() => setOpen(false)} />
          </>
        }>
        <MonoText v="h1">Change the pledge</MonoText>
        <MonoText v="p">One promise you can keep every day.</MonoText>
        <View style={{ height: 8 }} />
        <TextField variant="card" value={text} onChangeText={setText} />
      </Sheet>
    </Screen>
  );
}

function SheetEditName() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('Sam Reyes');
  return (
    <Screen>
      <EditProfileBackdrop />
      <Sheet open={open} top={SHEET_TOP.name} onClose={() => setOpen(false)} footer={<PrimaryButton label="Save" sheet onPress={() => setOpen(false)} />}>
        <MonoText v="h1Sheet">Name</MonoText>
        <TextField variant="sheet" value={name} onChangeText={setName} placeholder="Your name" />
        <Text style={{ ...sans('400'), fontSize: 14, lineHeight: 20, color: mono.mute }}>Shown on your vow and your letters.</Text>
      </Sheet>
    </Screen>
  );
}

/** `modal` renders the same sheet through the transparent `Modal` path (D360) — keyed `Sheet-Sign-Out@modal`. */
function SheetSignOut({ modal = false }: { modal?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <Screen>
      <SettingsBackdrop />
      <Sheet
        open={open}
        modal={modal}
        top={SHEET_TOP.signOut}
        gap={10}
        onClose={() => setOpen(false)}
        footer={
          <>
            <PrimaryButton label="Sign out" bottom={96} sheet />
            <GhostLink label="Stay signed in" zIndex={42} onPress={() => setOpen(false)} />
          </>
        }>
        <MonoText v="h1SheetLg">Sign out?</MonoText>
        <Text style={{ ...sans('400'), fontSize: 15, lineHeight: 23, color: mono.sub }}>
          Your log, letters and medallions stay saved to sam@example.com.
        </Text>
      </Sheet>
    </Screen>
  );
}

function SheetProfilePhoto() {
  const [open, setOpen] = useState(true);
  return (
    <Screen>
      <EditProfileBackdrop />
      <Sheet
        open={open}
        top={SHEET_TOP.photo}
        onClose={() => setOpen(false)}
        footer={<GhostLink label="Cancel" bottom={56} bold zIndex={42} onPress={() => setOpen(false)} />}>
        <MonoText v="h1Sheet">Profile photo</MonoText>
        <View style={{ height: 2 }} />
        <RowGroup>
          <Row label="Take photo" chevron={false} />
          <Row label="Choose from library" chevron={false} />
          <Row label="Remove photo" chevron={false} muted />
        </RowGroup>
      </Sheet>
    </Screen>
  );
}

// ── the wheel ────────────────────────────────────────────────────────────────

function CheckinTime({ title, initial }: { title: string; initial: WheelTime }) {
  const [time, setTime] = useState<WheelTime>(initial);
  const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  return (
    <Screen>
      <NavBar left="back" right="empty" />
      {/* D320: the band between the nav and the pill scrolls only when it does not fit (no-op at 852) */}
      <ScrollRegion top={136} bottom={106} contentStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 18 }}>
        <MonoText v="h1">{title}</MonoText>
        <View style={{ height: 6 }} />
        <MonoText v="caps">Select time</MonoText>
        <TimeWheel value={time} onChange={setTime} />
        <View style={{ height: 6 }} />
        <MonoText v="caps">Select days</MonoText>
        <DayToggles value={days} onChange={setDays} />
      </ScrollRegion>
      <PrimaryButton label="Save time" />
    </Screen>
  );
}

/** Lapse When: the wheel region is this part's; the when-chips and the date row are plain boxes. */
function LapseWhen() {
  const [time, setTime] = useState<WheelTime>({ hour12: 11, minute: 40, period: 'PM' });
  const chip = (label: string, on: boolean) => (
    <View
      key={label}
      style={{ height: 44, borderRadius: 22, backgroundColor: on ? mono.ink : mono.card, justifyContent: 'center', paddingHorizontal: 18 }}>
      <Text style={{ ...sans('700'), fontSize: 14, lineHeight: lhNormal(14), color: on ? mono.onInk : mono.ink }}>{label}</Text>
    </View>
  );
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 3, total: 8 }} right="close" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 14 }}>
        <MonoText v="h1">When did it happen?</MonoText>
        <View style={{ height: 2 }} />
        <View style={{ flexDirection: 'row', gap: 10 }}>{[chip('Just now', true), chip('Earlier today', false), chip('Yesterday', false)]}</View>
        <View style={{ height: 6 }} />
        <MonoText v="caps">Or choose a time</MonoText>
        <TimeWheel value={time} onChange={setTime} />
        <View
          style={{
            height: 44,
            borderRadius: 14,
            backgroundColor: mono.card,
            paddingLeft: 18,
            paddingRight: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{ ...sans('700'), fontSize: 15, lineHeight: lhNormal(15), color: mono.ink }}>Tonight, Tue Jul 22</Text>
          <View style={{ height: 32, borderRadius: 16, backgroundColor: mono.ground, paddingHorizontal: 14, justifyContent: 'center' }}>
            <Text style={{ ...sans('700'), fontSize: 13, lineHeight: lhNormal(13), color: mono.ink }}>Change</Text>
          </View>
        </View>
      </View>
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

/**
 * Not a frame: a caller that never lets the time pass "now" (slip.md §98C —
 * the picked time may not be in the future), plus an outside preset, to drive
 * the wheel's controlled behaviour (D362). Starts at 11:30 PM, now = 11:40 PM.
 * The readout under the wheel is the caller's state; the columns' own
 * `aria-valuetext` is what the wheel shows.
 */
const LAB_NOW = 23 * 60 + 40;
const fmtWheel = (t: WheelTime) => `${t.hour12}:${String(t.minute).padStart(2, '0')} ${t.period}`;
function WheelControlled() {
  const [time, setTime] = useState<WheelTime>({ hour12: 11, minute: 30, period: 'PM' });
  const [steps, setSteps] = useState<string[]>([]);
  return (
    <Screen>
      <NavBar left="back" right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 18 }}>
        <MonoText v="h1">Never in the future</MonoText>
        <TimeWheel
          value={time}
          onChange={(next, step) => {
            setTime(wheelToMinutes(next) > LAB_NOW ? wheelFromMinutes(LAB_NOW) : next);
            setSteps((all) => [...all, `${step.column}${step.delta > 0 ? '+' : ''}${step.delta}`]);
          }}
        />
        <MonoText v="p" testID="wheel-state">{`state ${fmtWheel(time)}`}</MonoText>
        <MonoText v="p" testID="wheel-steps" color={mono.mute}>{`steps ${steps.join(' ')}`}</MonoText>
      </View>
      <Tap
        label="Preset 7:15 AM"
        onPress={() => setTime({ hour12: 7, minute: 15, period: 'AM' })}
        style={{ position: 'absolute', left: 24, bottom: 48, height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: mono.card, justifyContent: 'center' }}>
        <MonoText v="p">Preset 7:15 AM</MonoText>
      </Tap>
    </Screen>
  );
}

// ── the pledge ───────────────────────────────────────────────────────────────

function PledgeBoard({ signed }: { signed: boolean }) {
  const art = useHeroClears('fountainPen', 458, undefined, 96 + 58);
  return (
    <Screen>
      {art ? <Hero id="fountainPen" top={458} /> : null}
      <NavBar left="back" centre={{ step: 8, total: 8 }} right="close" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 18 }}>
        <MonoText v="h1">Re-sign your pledge.</MonoText>
        <View style={{ height: 6 }} />
        <PledgeCard pledge="The mornings are mine again." name="Jerry" signed={signed} />
      </View>
      <PrimaryButton label={signed ? 'Confirm' : 'Sign for today'} bottom={96} />
      <GhostLink label="Change the pledge" />
    </Screen>
  );
}

/** Slip Pledge: the same signing card under a p, gap 14, the pen at 0.869. */
function SlipPledge() {
  const art = useHeroClears('fountainPen', 458, 0.869, 96 + 58);
  return (
    <Screen>
      {art ? <Hero id="fountainPen" top={458} scale={0.869} /> : null}
      <NavBar left="empty" right="close" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 14 }}>
        <MonoText v="h1">The pledge still stands.</MonoText>
        <MonoText v="p">A slip doesn’t erase what you decided. Sign it again and keep going.</MonoText>
        <View style={{ height: 6 }} />
        <PledgeCard pledge="The mornings are mine again." name="Jerry" signed />
      </View>
      <PrimaryButton label="Sign it again" bottom={96} />
      <GhostLink label="Read my pledge" />
    </Screen>
  );
}

/** Urge Hub Pledges: the read-back card, dark. Pager dots from kit-chrome. */
function UrgeHubPledges() {
  return (
    <Screen variant="dark">
      <NavBar left="empty" centre={{ title: 'Ride it out' }} right="close" tone="dark" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 160, alignItems: 'center' }}>
        <MonoText v="h1" center color={monoDark.text}>
          Your pledge.
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 238, gap: 12 }}>
        <PledgeCard variant="quote" tone="dark" pledge="The mornings are mine again." name="Jerry" />
        <Text style={{ ...sans('400'), paddingTop: 6, fontSize: 15, lineHeight: 22, color: monoDark.body, textAlign: 'center' }}>
          Signed 14 days ago. Kept every day since.
        </Text>
      </View>
      <PagerDots active={4} />
      <PrimaryButton label="Breathe" bottom={96} tone="dark" />
      <GhostLink label="I slipped" tone="dark" />
    </Screen>
  );
}

/**
 * Your Vow Page with the read-back card as `PledgeCard variant="quote"` (light).
 * Part A's `Your-Vow-Page` draws the card from its own `Card`; this one checks
 * the pledge part's variant against the same frame. Short screens (D320, as
 * `HeroBoard` does it): when the stack would come within 16 of the ghost link,
 * the flag and the stack rise together, or — past the flag's room above 108 —
 * the flag goes and the stack rises alone.
 */
function YourVowPage() {
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const [stackH, setStackH] = useState(0);
  const ghostTop = height - canvasTop - 48 - lhNormal(15);
  const deficit = stackH > 0 ? Math.ceil(340 + stackH + 16 - ghostTop) : 0;
  const room = Math.floor(heroArtTop('flag', 104) - 108);
  const dropArt = deficit > room;
  const lift = deficit <= 0 ? 0 : dropArt ? Math.min(deficit, 340 - 108) : deficit;
  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Your vow' }} right="empty" />
      {dropArt ? null : <Hero id="flag" top={104 - lift} />}
      <View
        onLayout={(e) => setStackH(e.nativeEvent.layout.height)}
        style={{ position: 'absolute', left: 24, right: 24, top: 340 - lift, gap: 16 }}>
        <PledgeCard variant="quote" pledge="I’m done letting the wave decide. One evening at a time, I take the watch back." name="Jerry" />
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

const ICON18 = { fill: 'none', stroke: mono.ink, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/**
 * Today Home III's pledge block only — `PledgeCard variant="plain"` at 413 with
 * the frame's three 42 rings as its children. The rest of the screen (header,
 * week strip, hero crop, Tonight card, tab bar) belongs to other parts and is
 * not drawn: diff it with `--ignore=0,0,393,405;0,565,393,287`.
 */
function TodayHomeIIIPledge() {
  const disc = (d: string, key: string) => (
    <View key={key} style={{ width: 42, height: 42, borderRadius: 21, boxShadow: ring.outline, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={18} height={18} viewBox="0 0 18 18">
        <Path d={d} {...ICON18} />
      </Svg>
    </View>
  );
  return (
    <Screen>
      <PledgeCard variant="plain" pledge="The mornings are mine again." name="Jerry" style={{ position: 'absolute', left: 24, right: 24, top: 413 }}>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
          {disc('M3 9h12M9 3v12', 'add')}
          {disc('M9 3l1.8 3.8 4.2.6-3 3 .7 4.2L9 12.6l-3.7 2 .7-4.2-3-3 4.2-.6z', 'star')}
          {disc('M9 11V3M6 6l3-3 3 3M4 11v3h10v-3', 'share')}
        </View>
      </PledgeCard>
    </Screen>
  );
}

// ── progress ─────────────────────────────────────────────────────────────────

function EnlistingAegis() {
  return (
    <Screen>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 236, flexDirection: 'row', justifyContent: 'center' }}>
        <Spinner spinning={false} />
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 352, alignItems: 'center' }}>
        <MonoText v="h1" center>
          Putting your plan together…
        </MonoText>
      </View>
      <StepList
        style={{ position: 'absolute', left: 24, right: 24, top: 462 }}
        current={1}
        steps={['Finding where you usually struggle', 'Looking at what tends to set it off', 'Choosing where to start']}
      />
    </Screen>
  );
}

// ── fields ───────────────────────────────────────────────────────────────────

function QuestionBoard({
  hero,
  dashes,
  close,
  left = 'back',
  children,
  cta,
}: {
  hero: 'pencil' | 'notebook' | 'envelope';
  dashes?: number;
  close?: boolean;
  left?: 'back' | 'empty';
  children: ReactNode;
  cta: string;
}) {
  const art = useHeroClears(hero, 506, undefined, 48 + 58);
  return (
    <Screen>
      {art ? <Hero id={hero} top={506} /> : null}
      <NavBar left={left} centre={dashes ? { step: dashes, total: 8 } : null} right={close ? 'close' : 'empty'} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 14 }}>{children}</View>
      <PrimaryButton label={cta} />
    </Screen>
  );
}

function V3Q24Name() {
  const [name, setName] = useState('');
  return (
    <QuestionBoard hero="pencil" dashes={1} cta="Continue">
      <MonoText v="h1">What should we call you?</MonoText>
      <MonoText v="pTight" color={mono.mute}>
        All your data will be encrypted.
      </MonoText>
      <View style={{ height: 10 }} />
      <TextField variant="name" value={name} onChangeText={setName} placeholder="Your name" autoFocus autoCapitalize="words" maxLength={40} />
    </QuestionBoard>
  );
}

function Night3Reflection() {
  const [text, setText] = useState('Sam called at the right moment…');
  return (
    <QuestionBoard hero="notebook" dashes={5} close cta="Continue">
      <MonoText v="h1">Anything worth keeping?</MonoText>
      <MonoText v="caps">Optional</MonoText>
      <View style={{ height: 6 }} />
      <TextField variant="bare" value={text} onChangeText={setText} />
    </QuestionBoard>
  );
}

function SOSAfterward() {
  const [text, setText] = useState('I need to say…');
  return (
    <QuestionBoard hero="envelope" left="empty" close cta="Done">
      <MonoText v="h1">One more thing.</MonoText>
      <MonoText v="p">The relationship doesn’t need solving tonight. Write the one thing you need to say tomorrow.</MonoText>
      <View style={{ height: 6 }} />
      <TextField variant="note" value={text} onChangeText={setText} />
    </QuestionBoard>
  );
}

/**
 * Not a frame: the knobs the unframed screens need (routes.md §4.4 Life Map) —
 * a `sheet` field grown multiline, one with the 48 "+" disc as its accessory,
 * and a caller's own `onContentSizeChange` running beside the growth.
 */
function FieldGrown() {
  const [why, setWhy] = useState('To be the father I said I would be, and to be there in the mornings.');
  const [add, setAdd] = useState('');
  const [heights, setHeights] = useState<number[]>([]);
  return (
    <Screen>
      <NavBar left="back" right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 14 }}>
        <MonoText v="caps">Why you’re here</MonoText>
        <TextField
          variant="sheet"
          multiline
          value={why}
          onChangeText={setWhy}
          onContentSizeChange={(e) => {
            const h = Math.round(e.nativeEvent.contentSize.height);
            setHeights((all) => (all[all.length - 1] === h ? all : [...all, h]));
          }}
        />
        <MonoText v="caps">One line, as drawn</MonoText>
        <TextField variant="sheet" value="Sam Reyes" onChangeText={() => {}} />
        <MonoText v="caps">Add your own</MonoText>
        <TextField
          variant="sheet"
          value={add}
          onChangeText={setAdd}
          placeholder="A value"
          style={{ paddingRight: 6 }}
          accessory={
            <View style={{ width: 48, height: 48, borderRadius: 24, boxShadow: ring.outline, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={18} height={18} viewBox="0 0 18 18">
                <Path d="M3 9h12M9 3v12" {...ICON18} />
              </Svg>
            </View>
          }
        />
        <MonoText v="p" testID="field-heights" color={mono.mute}>{`content heights ${heights.join(' ')}`}</MonoText>
      </View>
    </Screen>
  );
}

/** Kit-lab replicas for the overlay part of the kit. Key = the frame's split file stem. */
export const LAB_OVERLAY: Record<string, ComponentType> = {
  'Change-Pledge-Sheet': ChangePledgeSheet,
  'Sheet-Edit-Name': SheetEditName,
  'Sheet-Sign-Out': SheetSignOut,
  'Sheet-Sign-Out@modal': () => <SheetSignOut modal />,
  'Sheet-Profile-Photo': SheetProfilePhoto,
  'Morning-Check-in-Time': () => <CheckinTime title="When should the morning check-in come?" initial={{ hour12: 8, minute: 0, period: 'AM' }} />,
  'Nightly-Check-in-Time': () => <CheckinTime title="When should the nightly check-in come?" initial={{ hour12: 10, minute: 30, period: 'PM' }} />,
  // Part A keys the frame's main replica (its when-chips); this one is the wheel's
  'Lapse-When@overlay': LapseWhen,
  'Morning-Resign-Pledge': () => <PledgeBoard signed={false} />,
  'Morning-Pledge-Signed': () => <PledgeBoard signed />,
  'Slip-Pledge': SlipPledge,
  'Urge-Hub-Pledges': UrgeHubPledges,
  // the two PledgeCard variants whose frames another part keys (Part A: Your Vow Page; Today Home III)
  'Your-Vow-Page@overlay': YourVowPage,
  'Today-Home-III@overlay': TodayHomeIIIPledge,
  'Enlisting-Aegis': EnlistingAegis,
  'V3-Q24-Name': V3Q24Name,
  'Night-3-Reflection': Night3Reflection,
  'SOS-Afterward': SOSAfterward,
  // not a frame: the wheel under a clamping caller (D362)
  '_Wheel-Controlled': WheelControlled,
  '_Field-Grown': FieldGrown,
};
