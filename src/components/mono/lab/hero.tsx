import type { ComponentType } from 'react';
import { Text, View } from 'react-native';

import type { HeroKey } from '@/content/heroes';
import { lhNormal, mono, sans, sansItalic } from '@/lib/theme';

import { PrimaryButton } from '../buttons';
import { Hero, HeroBoard } from '../Hero';
import { Apple, CloseX, Google } from '../icons';
import { LaurelMark } from '../LaurelMark';
import { ladderStanding, MedalTier, TierLadder, type Tier } from '../MedalTier';
import { NavBar } from '../NavBar';
import { Screen } from '../Screen';
import { MonoText } from '../Text';

/*
 * Kit-lab replicas for the hero part of the kit. Key = the frame's split file
 * stem. Everything that is not Hero / HeroBoard / LaurelMark / MedalTier is a
 * plain View transcribed from the frame, so a diff names only those pieces.
 */

/** 07 · Onboarding Start — the funnel's statement board: hero T 190, stack 451, title 26/33. */
function OnboardingStart() {
  return (
    <HeroBoard
      nav={{ left: 'back', right: 'empty' }}
      hero="nightPhone"
      stackTop={451}
      titleSize={26}
      title="Sam, let’s figure out what usually leads you back to porn."
      body="It’ll take about two minutes. Then we’ll show you what we’d change first."
      cta="Start"
    />
  );
}

function SosLocBed() {
  return (
    <HeroBoard
      nav={{ left: 'empty', centre: { title: 'Where you are' }, right: 'close' }}
      hero="bed"
      title="Get out of bed."
      body="Both feet on the floor. Stand up and leave the bedroom."
      cta="Continue"
    />
  );
}

function SosTrigHabit() {
  return (
    <HeroBoard
      nav={{ left: 'empty', centre: { title: 'What’s feeding it' }, right: 'close' }}
      hero="signpost"
      title="Change what happens next."
      body="Do something different from what you normally do right before you watch."
      cta="Continue"
    />
  );
}

function SlipEntry() {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'close' }}
      hero="dominoes"
      title="It happened."
      body="The day isn’t over. Log what happened, then stop it here."
      cta="Log the slip"
      ghost="Not now"
    />
  );
}

/** Slip Third — the dark board (`#111111`, white title and pill, 0.62 body). */
function SlipThird() {
  return (
    <HeroBoard
      tone="dark"
      nav={{ left: 'empty', right: 'close' }}
      hero="charger"
      title="You can still stop here."
      body="The day is not gone. The phone goes away for the rest of the evening — that’s the only job."
      cta="Continue"
    />
  );
}

/** Letter Arrival — the caps line over the title. */
function LetterArrival() {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'close' }}
      hero="envelope"
      caps="Week XII post"
      title="The post is in."
      body="A short letter from VICI — two minutes, worth keeping."
      cta="Read"
      ghost="Tonight"
    />
  );
}

/** Night Check-in Cover — dark, caps, the 34/40 cover title, gap 12, no body. */
function NightCheckinCover() {
  return (
    <HeroBoard
      tone="dark"
      nav={{ left: 'empty', right: 'close' }}
      hero="nightMoon"
      gap={12}
      caps="Day 13, about two minutes"
      title="Night check-in."
      titleSize={34}
      cta="Begin"
    />
  );
}

const SHADOW = '0 1px 2px rgba(0,0,0,0.04)';

/**
 * V3 Q3b — a question board whose hero sits under the options at T 582, scale 0.76 (drawn first). No
 * bottom controls (`controls={0}`): on a phone too short to show it whole, the hero is dropped (D320 rule 1).
 */
function V3Q3b() {
  const items = ['Less than a day', 'A few days', 'About a week', 'A few weeks', 'A month or longer'];
  return (
    <Screen>
      <Hero id="calendar" top={582} scale={0.76} controls={0} />
      <NavBar left="back" centre={{ step: 3, total: 8 }} right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 14 }}>
        <MonoText v="h1">When you’ve tried to quit, how long do you usually make it before watching again?</MonoText>
        <View style={{ height: 18 }} />
        <View style={{ gap: 12 }}>
          {items.map((t, i) => (
            <View
              key={t}
              style={{ height: 58, borderRadius: 18, backgroundColor: i === 1 ? mono.ink : mono.card, justifyContent: 'center', paddingHorizontal: 22, boxShadow: i === 1 ? undefined : SHADOW }}>
              <MonoText v="optionLabel" color={i === 1 ? mono.onInk : mono.ink}>{t}</MonoText>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

/**
 * Cue Hue Picker — the hero at T 506, scale 0.723, under the place rows (their glyphs are not drawn here).
 * `controls={106}`: the primary at bottom 48 — on a 667 phone the door would run under it, so it is dropped.
 */
function CueHuePicker() {
  const items = ['Somewhere private', 'In bed', 'A public space', 'At work or school', 'Out and about'];
  return (
    <Screen>
      <Hero id="openDoor" top={506} scale={0.723} controls={106} />
      <NavBar left="back" centre={{ step: 3, total: 8 }} right="close" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 18 }}>
        <MonoText v="h1">Where are you right now?</MonoText>
        <View style={{ height: 4 }} />
        <View style={{ gap: 12 }}>
          {items.map((t, i) => {
            const on = i === 0;
            return (
              <View
                key={t}
                style={{ height: 60, borderRadius: 18, backgroundColor: on ? mono.ink : mono.card, flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 16, paddingRight: 18 }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, boxShadow: on ? '0 0 0 1.5px rgba(17,17,17,0.3)' : '0 0 0 1.5px #2E2E2E' }} />
                <Text style={{ flex: 1, ...sans('400'), fontSize: 16, lineHeight: lhNormal(16), color: on ? mono.onInk : mono.ink }}>{t}</Text>
                {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: mono.card }} /> : null}
              </View>
            );
          })}
        </View>
      </View>
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

/** 01 · Splash — the 120 laurel at (136, 330) and the wordmark. */
function Splash() {
  return (
    <Screen>
      <LaurelMark size={120} style={{ position: 'absolute', left: 136, top: 330 }} />
      <Text style={{ position: 'absolute', left: 0, right: 0, top: 478, textAlign: 'center', ...sans('700'), fontSize: 14, lineHeight: lhNormal(14), letterSpacing: 7, color: mono.ink }}>VICI</Text>
    </Screen>
  );
}

/** 02 · Login — the 104 laurel at (144.5, 150); the rest is the auth group's, transcribed plainly. */
function Login() {
  const btn = { height: 58, borderRadius: 29, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 } as const;
  const label = { ...sans('700'), fontSize: 17, lineHeight: lhNormal(17) };
  return (
    <Screen>
      <LaurelMark size={104} style={{ position: 'absolute', left: 144.5, top: 150 }} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 284, gap: 12, alignItems: 'center' }}>
        <MonoText v="h1" center style={{ alignSelf: 'stretch' }}>Welcome to VICI.</MonoText>
        <MonoText v="p" center style={{ alignSelf: 'stretch' }}>Sign in or create an account to keep your plan and progress.</MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 436, gap: 14 }}>
        <View style={[btn, { backgroundColor: mono.ink }]}>
          <Apple />
          <Text style={[label, { color: mono.onInk }]}>Continue with Apple</Text>
        </View>
        <View style={[btn, { backgroundColor: mono.card, boxShadow: '0 0 0 1.5px #2E2E2E' }]}>
          <Google />
          <Text style={[label, { color: mono.ink }]}>Continue with Google</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 2 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: mono.line }} />
          <MonoText v="caps">or</MonoText>
          <View style={{ flex: 1, height: 1, backgroundColor: mono.line }} />
        </View>
        <View style={[btn, { backgroundColor: mono.card, boxShadow: '0 0 0 1.5px #2E2E2E' }]}>
          <Text style={[label, { color: mono.ink }]}>Continue with email</Text>
        </View>
      </View>
      <Text style={{ position: 'absolute', left: 0, right: 0, bottom: 108, textAlign: 'center', ...sans('400'), fontSize: 15, lineHeight: lhNormal(15), color: mono.sub }}>
        Already have an account? <Text style={{ ...sans('700'), color: mono.ink }}>Sign in</Text>
      </Text>
      <MonoText v="legal" center style={{ position: 'absolute', left: 0, right: 0, bottom: 64 }}>Terms · Privacy</MonoText>
    </Screen>
  );
}

/**
 * A Breakwater / Detail page around its tier ladder. The 168 album medal above it is the medallions
 * group's and is not drawn here (diff these with that region ignored).
 */
function MedalPage({
  y = 0,
  name,
  line,
  tier,
  reached,
  quote,
  cta,
  tierColor,
}: {
  tierColor?: string;
  y?: number;
  name: string;
  line: string;
  tier: string;
  reached: -1 | Tier;
  quote: string;
  cta: string;
}) {
  return (
    <Screen>
      <NavBar left="back" right="share" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 366 + y, gap: 8, alignItems: 'center' }}>
        <MonoText v="titlePage" center style={{ alignSelf: 'stretch' }}>{name}</MonoText>
        <MonoText v="pTight" center style={{ alignSelf: 'stretch' }}>{line}</MonoText>
        <View style={{ height: 4 }} />
        <MonoText v="caps" center color={tierColor}>{tier}</MonoText>
      </View>
      <TierLadder reached={reached} style={{ position: 'absolute', left: 24, right: 24, top: 508 + y }} />
      <MonoText wrap="pretty" style={{ position: 'absolute', left: 44, right: 44, top: 608 + y, textAlign: 'center', ...sansItalic(), fontSize: 18, lineHeight: 28, color: mono.ink }}>
        {quote}
      </MonoText>
      <PrimaryButton label={cta} />
    </Screen>
  );
}

const BW = { name: 'Breakwater', line: 'An overwhelming urge that ended without a slip.', cta: 'Share this' };
/** Breakwater Paper — only Paper reached: no ink on the track, tiers 1–4 dimmed. */
const BreakwaterPaper = () => <MedalPage {...BW} tier="Tier I, ×1" reached={0} quote="“The first wave broke against you, not over you.”" />;
/** Breakwater Gold — tier IV reached. */
const BreakwaterGold = () => <MedalPage {...BW} tier="Tier IV, ×25" reached={3} quote="“Twenty-five. What used to flood you now only gets loud.”" />;
/** Breakwater Platinum — every tier; the frame sits the page one point lower (CRITIC §5, medallions Q4). */
const BreakwaterPlatinum = () => <MedalPage {...BW} y={1} tier="Tier V, ×50" reached={4} quote="“Fifty waves. The sea hasn’t changed. The wall did.”" />;
/** Detail Paper — nothing earned yet: Paper redrawn as the dashed `#5A574F` ring, every name mute. */
const DetailPaper = () => (
  <MedalPage
    y={-13}
    name="Vici"
    line="Urges met and outlasted — the conquering half of the campaign."
    tier="Not yet. First at ×1"
    tierColor={mono.art}
    reached={-1}
    quote="“Nine minutes, start to finish. You watched it rise, crest, and leave without you.”"
    cta="Back to medallions"
  />
);

/**
 * A Tiers page (T 155) around its ladder: thresholds under the names and a fill that runs part-way to
 * the next rung, both from `ladderStanding(count, rungs)`. The 168 coin is the medallions group's and
 * is not drawn (diff with it masked); the count block is transcribed plainly.
 */
function TiersPage({
  name,
  blurb,
  caps,
  rungs,
  labels,
  count,
  next,
}: {
  name: string;
  blurb: string;
  caps: string;
  rungs: number[];
  labels: (r: number) => string;
  count: number;
  next: string;
}) {
  const { reached, progress } = ladderStanding(count, rungs);
  return (
    <Screen>
      <NavBar left="back" right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 351, gap: 8, alignItems: 'center' }}>
        <MonoText v="titlePage" center style={{ alignSelf: 'stretch' }}>{name}</MonoText>
        <MonoText v="pTight" center style={{ alignSelf: 'stretch' }}>{blurb}</MonoText>
        <View style={{ height: 4 }} />
        <MonoText v="caps" center color={reached < 0 ? mono.art : undefined}>{caps}</MonoText>
      </View>
      <TierLadder reached={reached} progress={progress} thresholds={rungs.map(labels)} style={{ position: 'absolute', left: 24, right: 24, top: 493 }} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 603, gap: 6, alignItems: 'center' }}>
        <MonoText v="titlePage" wrap="nowrap" style={{ fontSize: 48, lineHeight: 50, letterSpacing: -1.7 }}>{labels(count)}</MonoText>
        <MonoText v="pTight" wrap="nowrap" center color={mono.mute}>{next}</MonoText>
      </View>
      <PrimaryButton label="Back to medallions" />
    </Screen>
  );
}

const times = (n: number) => `×${n.toLocaleString('en-US')}`;
const day = (n: number) => `Day ${n}`;
/** Tiers Vidi — day rungs, 6/23 of the way to Bronze: a 5.2 % fill. */
const TiersVidi = () => (
  <TiersPage name="Vidi" blurb="Days Vici was opened and something recorded." caps="Tier I, Day 7" rungs={[7, 30, 90, 180, 365]} labels={day} count={13} next="17 days to Bronze" />
);
/** Tiers Vici — 18.0 %. */
const TiersVici = () => (
  <TiersPage name="Vici" blurb="Urge logs that did not end in a slip." caps="Tier I, ×5" rungs={[5, 25, 100, 250, 1000]} labels={times} count={23} next="2 more to Bronze" />
);
/** Tiers Rebound — 2.2 %. */
const TiersRebound = () => (
  <TiersPage name="Rebound" blurb="A check-in on the day after a slip." caps="Tier I, ×1" rungs={[1, 10, 25, 50, 100]} labels={times} count={2} next="8 more to Bronze" />
);
/** Tiers Breakwater — 10.0 %. */
const TiersBreakwater = () => (
  <TiersPage name="Breakwater" blurb="An overwhelming urge that ended without a slip." caps="Tier I, ×1" rungs={[1, 5, 10, 25, 50]} labels={times} count={3} next="2 more to Bronze" />
);
/** Tiers Logbook — two tiers reached and 1/50 of the third: 20.4 %. */
const TiersLogbook = () => (
  <TiersPage name="Logbook" blurb="Urge logs saved, whatever the outcome." caps="Tier II, ×25" rungs={[5, 25, 75, 200, 500]} labels={times} count={26} next="49 more to Silver" />
);
/** Tiers Pulse — 14.0 %. */
const TiersPulse = () => (
  <TiersPage name="Pulse" blurb="Check-ins completed." caps="Tier I, ×5" rungs={[5, 25, 75, 200, 500]} labels={times} count={19} next="6 more to Bronze" />
);
/** Tiers Archive — nothing reached: no fill (even 9 of 10 toward Paper), every threshold `#5A574F`. */
const TiersArchive = () => (
  <TiersPage name="Archive" blurb="Journal entries saved." caps="Not yet. First at ×10" rungs={[10, 50, 100, 200, 365]} labels={times} count={9} next="1 more to Paper" />
);
/** Tiers Lessons — 7.0 %. */
const TiersLessons = () => (
  <TiersPage name="Lessons" blurb="Lessons completed." caps="Tier I, ×5" rungs={[5, 25, 50, 75, 110]} labels={times} count={12} next="13 more to Bronze" />
);

/** 39D · Drop Received — a HeroBoard whose art is the 176 platinum medal with its "V" (no disc), stack 432. */
function DropReceived() {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'close' }}
      art={
        <View style={{ position: 'absolute', left: 0, right: 0, top: 212, alignItems: 'center' }}>
          <MedalTier tier={4} size={176} glyph="V" disc={false} />
        </View>
      }
      artTop={212}
      stackTop={432}
      caps="The year"
      title="You received a drop."
      body="One drop covers the year — twelve months of VICI, billed once."
      cta="Continue"
      ghost="See the receipt"
    />
  );
}

/** Today Home Task — the cropped hero only (crop mode, top 241.3); the rest of the page is today-day's. */
function TodayHomeTask() {
  return (
    <Screen>
      <Hero mode="crop" id="nightPhone" top={241.3} />
    </Screen>
  );
}

/** Today Home III — the other crop (nightMoon at 231.5, 147.7 tall): checks the snap on a half-point top. */
function TodayHomeIII() {
  return (
    <Screen>
      <Hero mode="crop" id="nightMoon" top={231.5} />
    </Screen>
  );
}

/** Week IV page — a CSS-mode hero at a fractional top (114.4); the hero only (the page is the library group's). */
function WeekIV() {
  return (
    <Screen>
      <Hero id="brain" top={114.4} />
    </Screen>
  );
}

/** A lesson cover: the hero in its `393 × h` box (box mode), the caps and the title. */
function LessonCover({ n, id, title, progress }: { n: number; id: HeroKey; title: string; progress: `${number}%` }) {
  return (
    <Screen variant="lesson">
      <View style={{ position: 'absolute', left: 22, top: 60, height: 40, justifyContent: 'center', zIndex: 5 }}>
        <CloseX />
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 108, height: 3, borderRadius: 2, backgroundColor: mono.line }}>
        <View style={{ width: progress, height: 3, borderRadius: 2, backgroundColor: mono.ink }} />
      </View>
      <View style={{ position: 'absolute', left: 32, right: 32, top: 140, bottom: 128, paddingBottom: 24, justifyContent: 'center' }}>
        <Hero mode="box" id={id} />
        <MonoText v="lessonCaps" center style={{ marginTop: 36 }}>{`Lesson ${n}`}</MonoText>
        <MonoText v="title" center style={{ marginTop: 12 }}>{title}</MonoText>
      </View>
      <PrimaryButton label="Begin" />
    </Screen>
  );
}

/** Week 01 · L1 Frame 1 — nightPhone, box 176 / top −36. */
const L1Frame1 = () => <LessonCover n={1} id="nightPhone" title="Prepare for tonight" progress="7%" />;
/** Week 01 · L2 Frame 1 — sunrise, box 115 / top −79: full-bleed art in box mode. */
const L2Frame1 = () => <LessonCover n={2} id="sunrise" title="Remove easy access to porn" progress="6%" />;

export const LAB_HERO: Record<string, ComponentType> = {
  'Onboarding-Start': OnboardingStart,
  'SOS-Loc-Bed': SosLocBed,
  'SOS-Trig-Habit': SosTrigHabit,
  'Slip-Entry': SlipEntry,
  'Slip-Third': SlipThird,
  'Letter-Arrival': LetterArrival,
  'Night-Check-in-Cover': NightCheckinCover,
  'V3-Q3b': V3Q3b,
  'Cue-Hue-Picker': CueHuePicker,
  Splash,
  Login,
  'Breakwater-Paper': BreakwaterPaper,
  'Breakwater-Gold': BreakwaterGold,
  'Breakwater-Platinum': BreakwaterPlatinum,
  'Detail-Paper': DetailPaper,
  'Tiers-Vidi': TiersVidi,
  'Tiers-Vici': TiersVici,
  'Tiers-Rebound': TiersRebound,
  'Tiers-Breakwater': TiersBreakwater,
  'Tiers-Logbook': TiersLogbook,
  'Tiers-Pulse': TiersPulse,
  'Tiers-Archive': TiersArchive,
  'Tiers-Lessons': TiersLessons,
  'Drop-Received': DropReceived,
  'Today-Home-Task': TodayHomeTask,
  'Today-Home-III': TodayHomeIII,
  'Week-IV-Know-Your-Brain': WeekIV,
  'L1-Frame-1': L1Frame1,
  'L2-Frame-1': L2Frame1,
};
