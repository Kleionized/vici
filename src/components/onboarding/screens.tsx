/**
 * Onboarding funnel screens — a 1:1 RN port of the design bundle's
 * `screens-onb.jsx`. Calm-monochrome base + QUITTR-style funnel momentum +
 * the immersive atmosphere layer (Stage/Aura) whose hue shifts per phase.
 * Pairs with `art.tsx`.
 */

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText, type GlyphName, Glyph, Illo, SectionLabel } from '@/components/ui';
import { colors } from '@/lib/theme';
import {
  ACCENT,
  AvatarStack,
  BigStat,
  Bloom,
  Bob,
  BG,
  CARD,
  FadeRise,
  GhostButton,
  HeroCard,
  INK,
  INK2,
  INK3,
  LINE,
  LoadingRing,
  MiniStars,
  NextPill,
  OnbBar,
  OnbCard,
  OptionRow,
  PagerDots,
  Particles,
  PatternMeter,
  PressRow,
  ProjectionChart,
  SealBadge,
  SelectPop,
  SOFT2,
  Stage,
  StatRow,
  Testimonial,
  TideScene,
  TintChip,
  tint,
} from './art';
import { SlideArt } from './art';

// unified funnel progress: one continuous bar across the 12 guided steps
// (name → notifications), with a small phase caption per stretch.
export const PROG_N = 12;
export const PHASE = { assess: 'Assessment', plan: 'Your plan', commit: 'Commitment', setup: 'Setup' };
/** The celebration intensity — the design's "medium" middle path. */
const CELEBRATE: 'calm' | 'medium' | 'full' = 'medium';

// ── per-phase signature hues ─────────────────────────────────────────────────
export const HUE = {
  welcome: 208,
  lesson: [18, 175, 150] as const,
  assess: 230,
  quiz: 220,
  scroll: 210,
  why: 225,
  analysis: 200,
  plan: 150,
  social: 40,
  pledge: 150,
  notify: 205,
  signin: 208,
  done: 168,
};

// ── content model ────────────────────────────────────────────────────────────
export const Q_FREQ: [string, string | null][] = [
  ['Several times a day', 'It interrupts the day'],
  ['About once a day', 'A familiar daily pull'],
  ['A few times a week', 'It comes and goes'],
  ['Now and then', 'Occasional, but real'],
];
export const Q_DURATION: [string, string | null][] = [
  ['Under a year', null],
  ['1–3 years', null],
  ['3–5 years', null],
  ['More than 5 years', null],
  ['As long as I can remember', null],
];
export const Q_TRIGGERS: [string, GlyphName][] = [
  ['Late at night', 'moon'],
  ['Stress or anxiety', 'wave'],
  ['Boredom', 'clock'],
  ['Feeling low', 'heart'],
  ['Loneliness', 'user'],
  ['Endless scrolling', 'search'],
  ['Tired & depleted', 'leaf'],
  ['After a win', 'star'],
];
export const Q_IMPACT: [string, GlyphName][] = [
  ['Focus & memory', 'spark'],
  ['Energy & drive', 'sun'],
  ['Mood', 'heart'],
  ['Sleep', 'moon'],
  ['Confidence', 'shield'],
  ['Relationships', 'user'],
];
export const Q_GOALS = ['Clear focus', 'Steady energy', 'Real confidence', 'A calmer mood', 'Deeper relationships', 'Self-respect', 'Better sleep', 'To feel free'];

// glyph intrinsic sizes (the app's Glyph set hardcodes per-icon sizes) — used to
// scale any glyph cleanly into a fixed box.
const GI_SIZE: Partial<Record<GlyphName, number>> = {
  moon: 22, wave: 34, clock: 22, heart: 22, user: 22, search: 20, leaf: 22, star: 40, spark: 26, sun: 22, shield: 22, bell: 40, pen: 26, flag: 22, anchor: 34,
};
export function gi(name: GlyphName, color: string, size = 22) {
  const s = size / (GI_SIZE[name] ?? 24);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ transform: [{ scale: s }] }}>{Glyph[name](color)}</View>
    </View>
  );
}

// ── text + layout helpers ────────────────────────────────────────────────────
export function Hero({ size = 46, center, style, children }: { size?: number; center?: boolean; style?: object; children: ReactNode }) {
  return (
    <AppText weightOverride="700" color={INK} center={center} style={[{ fontSize: size, lineHeight: Math.round(size * 1.06), letterSpacing: -size * 0.03 }, style]}>
      {children}
    </AppText>
  );
}
function Ask({ size = 30, style, children }: { size?: number; style?: object; children: ReactNode }) {
  return (
    <AppText weightOverride="700" color={INK} style={[{ fontSize: size, lineHeight: Math.round(size * 1.12), letterSpacing: -size * 0.02 }, style]}>
      {children}
    </AppText>
  );
}
function Lead({ size = 16.5, center, style, children }: { size?: number; center?: boolean; style?: object; children: ReactNode }) {
  return (
    <AppText weightOverride="500" color={INK2} center={center} style={[{ fontSize: size, lineHeight: Math.round(size * 1.5) }, style]}>
      {children}
    </AppText>
  );
}
function B({ children, size }: { children: ReactNode; size?: number }) {
  return (
    <AppText weightOverride="700" color={INK} style={size ? { fontSize: size } : undefined}>
      {children}
    </AppText>
  );
}
function Eyebrow({ hue = 200, children }: { hue?: number; children: ReactNode }) {
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: tint(hue, 0.6, 0.1, 0.15), borderRadius: 9999, paddingVertical: 5, paddingHorizontal: 12 }}>
      <AppText weightOverride="700" color={tint(hue, 0.72, 0.11)} style={{ fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase' }}>
        {children}
      </AppText>
    </View>
  );
}
function OnbBody({ children }: { children: ReactNode }) {
  return <View style={{ flex: 1, minHeight: 0 }}>{children}</View>;
}
function OnbFoot({ children }: { children: ReactNode }) {
  return <View style={{ paddingTop: 16 }}>{children}</View>;
}
function BackBtn({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ padding: 4, marginLeft: -4 }}>
      <Svg width={13} height={22} viewBox="0 0 13 22">
        <Path d="M11 2L2 11l9 9" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}
const Wordmark = () => (
  <AppText weightOverride="700" color={INK} style={{ fontSize: 19, letterSpacing: -0.76 }}>
    tideline
  </AppText>
);

// ── 1 · WELCOME A (the tide motif) ───────────────────────────────────────────
export function OnbWelcomeA({ onNext, onSignIn }: { onNext: () => void; onSignIn?: () => void }) {
  return (
    <Stage hue={HUE.welcome} pad={26} top={64}>
      <View style={{ marginBottom: 8 }}>
        <Wordmark />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FadeRise style={{ width: '100%', marginBottom: 36 }}>
          <HeroCard hue={HUE.welcome} h={272}>
            <TideScene hue={HUE.welcome} w={244} h={156} />
          </HeroCard>
        </FadeRise>
        <Hero size={42} center>
          A calmer way to quit.
        </Hero>
        <Lead center size={17} style={{ marginTop: 14, maxWidth: 300 }}>
          A science-backed path, built around you.
        </Lead>
      </View>
      <OnbFoot>
        <NextPill label="Begin" onPress={onNext} />
        {onSignIn ? (
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <GhostButton onPress={onSignIn}>I already have an account</GhostButton>
          </View>
        ) : null}
      </OnbFoot>
    </Stage>
  );
}

// ── WELCOME B (manifesto) ────────────────────────────────────────────────────
export function OnbWelcomeB({ onNext, onSignIn }: { onNext: () => void; onSignIn?: () => void }) {
  return (
    <Stage hue={HUE.welcome} pad={26} top={64}>
      <View style={{ marginBottom: 8 }}>
        <Wordmark />
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <AppText weightOverride="700" color={INK} style={{ fontSize: 40, lineHeight: 43, letterSpacing: -1.2 }}>
          You&rsquo;re not weak.{'\n'}
          <AppText weightOverride="700" style={{ fontSize: 40, color: tint(HUE.welcome, 0.6, 0.09) }}>
            Your brain just learned a shortcut.
          </AppText>
          {'\n'}Let&rsquo;s unlearn it.
        </AppText>
        <Bob style={{ marginTop: 30 }}>{Illo.waveline(tint(HUE.welcome, 0.6, 0.09), { w: 280, h: 26, opacity: 0.8 })}</Bob>
        <Lead size={17} style={{ marginTop: 30 }}>
          Quitting porn isn&rsquo;t about white-knuckling it. It&rsquo;s about rewiring the loop underneath. We&rsquo;ll show you how.
        </Lead>
      </View>
      <OnbFoot>
        <NextPill label="Start" onPress={onNext} />
        {onSignIn ? (
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <GhostButton onPress={onSignIn}>I already have an account</GhostButton>
          </View>
        ) : null}
      </OnbFoot>
    </Stage>
  );
}

// ── 2–4 · EDUCATIONAL CAROUSEL ───────────────────────────────────────────────
const LESSONS = [
  {
    art: SlideArt.wave,
    hue: HUE.lesson[0],
    title: 'It’s not a willpower problem.',
    short: 'Your brain wired a shortcut. We rewire it.',
    press: false,
  },
  {
    art: SlideArt.rewire,
    hue: HUE.lesson[1],
    title: 'Your brain can change — fast.',
    short: 'Most feel the fog lift within two weeks.',
    press: true,
  },
  {
    art: SlideArt.steps,
    hue: HUE.lesson[2],
    title: 'Small steps beat big resets.',
    short: 'One honest check-in a day moves the needle.',
    press: false,
  },
];
export function OnbLesson({ idx, onNext, onBack }: { idx: number; onNext: () => void; onBack: () => void }) {
  const L = LESSONS[idx];
  return (
    <Stage hue={L.hue} intensity={0.9} pad={26} top={56}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <BackBtn onPress={onBack} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FadeRise key={idx} style={{ width: '100%', marginBottom: 38 }}>
          <HeroCard hue={L.hue} h={252}>{L.art(L.hue)}</HeroCard>
        </FadeRise>
        <Hero size={32} center style={{ maxWidth: 330 }}>
          {L.title}
        </Hero>
        <Lead center size={16.5} style={{ marginTop: 14, maxWidth: 320 }}>
          {L.short}
        </Lead>
        {L.press ? (
          <View style={{ marginTop: 34, width: '100%' }}>
            <PressRow />
          </View>
        ) : null}
      </View>
      <OnbFoot>
        <View style={{ marginBottom: 20 }}>
          <PagerDots n={3} i={idx} hue={L.hue} />
        </View>
        <NextPill label={idx === 2 ? 'I’m ready' : 'Next'} onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 5 · ASSESSMENT INTRO ─────────────────────────────────────────────────────
export function OnbAssessIntro({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <Stage hue={HUE.assess} pad={26} top={56}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <BackBtn onPress={onBack} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FadeRise style={{ width: '100%', marginBottom: 34 }}>
          <HeroCard hue={HUE.assess} h={232}>{SlideArt.anchor(HUE.assess)}</HeroCard>
        </FadeRise>
        <Eyebrow hue={HUE.assess}>2 minutes</Eyebrow>
        <Hero size={34} center style={{ marginTop: 16, maxWidth: 320 }}>
          A few honest questions.
        </Hero>
        <Lead center style={{ marginTop: 12, maxWidth: 300 }}>
          Nothing leaves your phone.
        </Lead>
      </View>
      <OnbFoot>
        <NextPill label="Start" onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 6 · NAME ─────────────────────────────────────────────────────────────────
export function OnbName({ value, onChange, onNext, onBack, barI }: { value: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void; barI: number }) {
  return (
    <Stage hue={HUE.quiz} intensity={0.5} pad={26} top={52}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.quiz} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={30}>What should we call you?</Ask>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Your name"
          placeholderTextColor={INK3}
          style={{ marginTop: 32, backgroundColor: CARD, borderWidth: 1.5, borderColor: LINE, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 18, fontFamily: 'System', fontWeight: '600', fontSize: 19, color: INK, letterSpacing: -0.2 }}
        />
      </OnbBody>
      <OnbFoot>
        <NextPill label="Continue" enabled={!!value.trim()} onPress={onNext} />
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <GhostButton onPress={onNext}>Skip for now</GhostButton>
        </View>
      </OnbFoot>
    </Stage>
  );
}

// ── 7–8 · SINGLE-SELECT ──────────────────────────────────────────────────────
export function OnbSingle({ title, lead, options, value, onPick, onNext, onBack, barI }: { title: string; lead?: string; options: [string, string | null][]; value: string; onPick: (v: string) => void; onNext: () => void; onBack: () => void; barI: number }) {
  return (
    <Stage hue={HUE.quiz} intensity={0.5} pad={26} top={52}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.quiz} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>{title}</Ask>
        <ScrollView style={{ marginTop: 30 }} contentContainerStyle={{ gap: 11, paddingBottom: 4 }} showsVerticalScrollIndicator={false}>
          {options.map(([label, sub]) => (
            <OptionRow key={label} label={label} sub={sub} single hue={HUE.quiz} selected={value === label} onPress={() => onPick(label)} />
          ))}
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Continue" enabled={!!value} onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 9 · MULTI-SELECT LIST (triggers, with icons) ─────────────────────────────
export function OnbMultiList({ title, lead, options, selected, onToggle, onNext, onBack, barI }: { title: string; lead?: string; options: [string, GlyphName][]; selected: string[]; onToggle: (v: string) => void; onNext: () => void; onBack: () => void; barI: number }) {
  return (
    <Stage hue={HUE.scroll} intensity={0.5} pad={26} top={52}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.scroll} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>{title}</Ask>
        <ScrollView style={{ marginTop: 28 }} contentContainerStyle={{ gap: 11, paddingBottom: 4 }} showsVerticalScrollIndicator={false}>
          {options.map(([label, icon]) => (
            <OptionRow key={label} label={label} icon={gi(icon, INK, 24)} hue={HUE.scroll} selected={selected.includes(label)} onPress={() => onToggle(label)} />
          ))}
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label={selected.length ? `Continue · ${selected.length}` : 'Continue'} enabled={selected.length > 0} onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 10 · MULTI-SELECT TILES (impact, 2-col) ──────────────────────────────────
function ImpactTile({ label, icon, on, onPress }: { label: string; icon: GlyphName; on: boolean; onPress: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <SelectPop on={on}>
        <Pressable
          onPress={onPress}
          style={{
            gap: 12,
            paddingVertical: 18,
            paddingHorizontal: 16,
            borderRadius: 18,
            backgroundColor: on ? tint(HUE.scroll, 0.68, 0.07, 0.16) : CARD,
            borderWidth: on ? 1.8 : 1.5,
            borderColor: on ? tint(HUE.scroll, 0.55, 0.1) : LINE,
          }}>
          <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: on ? tint(HUE.scroll, 0.5, 0.12) : 'rgba(0,0,0,0.045)', alignItems: 'center', justifyContent: 'center' }}>
            {gi(icon, on ? '#fff' : INK, 22)}
          </View>
          <AppText weightOverride={on ? '700' : '600'} color={INK} style={{ fontSize: 15.5, letterSpacing: -0.15 }}>
            {label}
          </AppText>
        </Pressable>
      </SelectPop>
    </View>
  );
}
export function OnbImpact({ selected, onToggle, onNext, onBack, barI }: { selected: string[]; onToggle: (v: string) => void; onNext: () => void; onBack: () => void; barI: number }) {
  const rows: [string, GlyphName][][] = [];
  for (let i = 0; i < Q_IMPACT.length; i += 2) rows.push(Q_IMPACT.slice(i, i + 2));
  return (
    <Stage hue={HUE.scroll} intensity={0.5} pad={26} top={52}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.scroll} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>What has it been touching?</Ask>
        <ScrollView style={{ marginTop: 28 }} contentContainerStyle={{ gap: 12, paddingBottom: 4 }} showsVerticalScrollIndicator={false}>
          {rows.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', gap: 12 }}>
              {row.map(([label, icon]) => (
                <ImpactTile key={label} label={label} icon={icon} on={selected.includes(label)} onPress={() => onToggle(label)} />
              ))}
            </View>
          ))}
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Continue" enabled={selected.length > 0} onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 11 · GOALS (pill wrap) ───────────────────────────────────────────────────
function GoalPill({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <SelectPop on={on}>
      <Pressable
        onPress={onPress}
        style={{
          paddingVertical: 13,
          paddingHorizontal: 19,
          borderRadius: 9999,
          backgroundColor: on ? colors.accent : CARD,
          borderWidth: on ? 0 : 1.5,
          borderColor: LINE,
        }}>
        <AppText weightOverride={on ? '700' : '600'} color={on ? colors.accentText : INK} style={{ fontSize: 16, letterSpacing: -0.15 }}>
          {label}
        </AppText>
      </Pressable>
    </SelectPop>
  );
}
export function OnbGoals({ selected, onToggle, onNext, onBack, barI }: { selected: string[]; onToggle: (v: string) => void; onNext: () => void; onBack: () => void; barI: number }) {
  return (
    <Stage hue={HUE.scroll} intensity={0.5} pad={26} top={52}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.scroll} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>What do you want back?</Ask>
        <ScrollView style={{ marginTop: 30 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11 }}>
            {Q_GOALS.map((g) => (
              <GoalPill key={g} label={g} on={selected.includes(g)} onPress={() => onToggle(g)} />
            ))}
          </View>
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Continue" enabled={selected.length > 0} onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 12 · WHY (free-write) ────────────────────────────────────────────────────
export function OnbWhy({ value, onChange, onNext, onBack, barI }: { value: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void; barI: number }) {
  return (
    <Stage hue={HUE.why} intensity={0.5} pad={26} top={52}>
      <OnbBar i={barI} n={PROG_N} phase={PHASE.assess} hue={HUE.why} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Ask size={29}>Last one — why now?</Ask>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="I want this because…"
          placeholderTextColor={INK3}
          multiline
          textAlignVertical="top"
          style={{ marginTop: 28, flex: 1, minHeight: 150, backgroundColor: CARD, borderWidth: 1.5, borderColor: LINE, borderRadius: 18, paddingHorizontal: 20, paddingVertical: 18, fontFamily: 'System', fontWeight: '500', fontSize: 17, lineHeight: 25, color: INK }}
        />
      </OnbBody>
      <OnbFoot>
        <NextPill label="Build my plan" enabled={!!value.trim()} onPress={onNext} />
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <GhostButton onPress={onNext}>Skip — I’ll add this later</GhostButton>
        </View>
      </OnbFoot>
    </Stage>
  );
}

// ── 13 · ANALYSIS (loading) ──────────────────────────────────────────────────
const ANALYSIS_STEPS = ['Reading your answers', 'Mapping your triggers', 'Shaping your 90-day plan'];
export function OnbAnalysis({ live = false, onDone }: { live?: boolean; onDone?: () => void }) {
  const [pct, setPct] = useState(live ? 0 : 1);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    if (!live) return;
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(1, v + 0.025);
      setPct(v);
      if (v >= 1) {
        clearInterval(id);
        setTimeout(() => onDoneRef.current && onDoneRef.current(), 760);
      }
    }, 55);
    return () => clearInterval(id);
  }, [live]);
  const done = Math.floor(pct * 3 + 0.0001);
  const complete = pct >= 1;
  return (
    <Stage hue={HUE.analysis} intensity={0.95} pad={26} top={56}>
      {complete ? <Particles mode={CELEBRATE} /> : null}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LoadingRing pct={pct} hue={HUE.analysis} />
        <Hero size={26} center style={{ marginTop: 30 }}>
          {complete ? 'Your plan is ready.' : 'Building your plan…'}
        </Hero>
        <View style={{ marginTop: 26, gap: 14, width: 250 }}>
          {ANALYSIS_STEPS.map((s, k) => {
            const isDone = k < done || pct >= 1;
            return (
              <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: k <= done || pct >= 1 ? 1 : 0.35 }}>
                <View style={{ width: 22, height: 22, borderRadius: 9999, backgroundColor: isDone ? tint(HUE.analysis, 0.5, 0.12) : 'transparent', borderWidth: isDone ? 0 : 2, borderColor: SOFT2, alignItems: 'center', justifyContent: 'center' }}>
                  {isDone ? (
                    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                      <Path d="M4 12l5 5L20 6" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  ) : null}
                </View>
                <AppText weightOverride="600" color={INK} style={{ fontSize: 15.5 }}>
                  {s}
                </AppText>
              </View>
            );
          })}
        </View>
      </View>
    </Stage>
  );
}

// ── 14 · PATTERN READOUT ─────────────────────────────────────────────────────
export function OnbPattern({ name = 'there', topTrigger = 'Late nights', toll = 'Focus & sleep', onNext, onBack }: { name?: string; topTrigger?: string; toll?: string; onNext: () => void; onBack: () => void }) {
  return (
    <Stage hue={HUE.plan} intensity={0.9} pad={26} top={52}>
      <OnbBar i={8} n={PROG_N} phase={PHASE.plan} hue={HUE.plan} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
          <Eyebrow hue={HUE.plan}>Your pattern</Eyebrow>
          <Hero size={32} style={{ marginTop: 14 }}>
            Moderate — and very workable.
          </Hero>
          <Lead size={16} style={{ marginTop: 12 }}>
            Not an extreme case, {name}. A <B>habit case</B> — the most changeable thing there is.
          </Lead>
          <OnbCard pad={20} style={{ marginTop: 24 }}>
            <PatternMeter level={0.56} label="Moderate" />
          </OnbCard>
          <OnbCard pad={0} style={{ marginTop: 14, paddingHorizontal: 18 }}>
            <StatRow icon={gi('wave', INK2, 20)} label="Most active trigger" value={topTrigger} />
            <View style={{ height: 1, backgroundColor: LINE }} />
            <StatRow icon={gi('spark', INK2, 20)} label="Likely toll" value={toll} />
            <View style={{ height: 1, backgroundColor: LINE }} />
            <StatRow icon={gi('flag', INK2, 20)} label="Your edge" value="You showed up" />
          </OnbCard>
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label="See what’s ahead" onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 15 · PROJECTION ──────────────────────────────────────────────────────────
export function OnbProjection({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const milestones = [
    ['Day 7', 'The fog starts to lift'],
    ['Day 30', 'Urges get quieter, shorter'],
    ['Day 90', 'A new normal — by default'],
  ];
  return (
    <Stage hue={HUE.plan} intensity={0.9} pad={26} top={52}>
      <OnbBar i={9} n={PROG_N} phase={PHASE.plan} hue={HUE.plan} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
          <Eyebrow hue={HUE.plan}>Your 90 days</Eyebrow>
          <Hero size={32} style={{ marginTop: 14 }}>
            Here’s what’s ahead.
          </Hero>
          <View style={{ marginTop: 24, marginBottom: 8 }}>
            <ProjectionChart />
          </View>
          <View style={{ gap: 12, marginTop: 14 }}>
            {milestones.map(([d, t]) => (
              <View key={d} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <AppText weightOverride="700" style={{ width: 54, fontSize: 14.5, color: ACCENT, letterSpacing: -0.15 }}>
                  {d}
                </AppText>
                <AppText weightOverride="600" color={INK} style={{ fontSize: 15.5, flex: 1 }}>
                  {t}
                </AppText>
              </View>
            ))}
          </View>
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label="I want this" onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 16 · SOCIAL PROOF ────────────────────────────────────────────────────────
export function OnbSocial({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <Stage hue={HUE.social} intensity={0.85} pad={26} top={52}>
      <OnbBar i={10} n={PROG_N} phase={PHASE.plan} hue={HUE.social} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
          <Hero size={32}>You’re in good company.</Hero>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 }}>
            <AvatarStack items={['J', 'M', 'A', 'K']} />
            <AppText weightOverride="600" color={INK2} style={{ fontSize: 15, flex: 1 }}>
              <B>80,000+</B> people starting over
            </AppText>
          </View>
          <OnbCard pad={18} style={{ marginTop: 18, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <BigStat value="4.8" label="App Store" />
            <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: LINE }} />
            <BigStat value="90 days" label="median streak" />
            <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: LINE }} />
            <BigStat value="12k" label="reviews" />
          </OnbCard>
          <View style={{ gap: 12, marginTop: 16 }}>
            <Testimonial initials="MS" name="Marcus S." handle="@marcus_runs" hue={208} quote="“The plan felt like it actually knew me. Three months in and the constant noise in my head is just… gone.”" />
            <Testimonial initials="DL" name="David L." handle="@dleewrites" hue={150} quote="“No guilt-tripping, no streak alarms. The panic button got me through week one. I’m clearer than I’ve been in years.”" />
          </View>
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Continue" onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 17 · COMMITMENT / PLEDGE ─────────────────────────────────────────────────
export function OnbPledge({ name = '', why = '', onNext, onBack }: { name?: string; why?: string; onNext: () => void; onBack: () => void }) {
  const [signed, setSigned] = useState(false);
  return (
    <Stage hue={HUE.pledge} intensity={0.85} pad={26} top={52}>
      <OnbBar i={11} n={PROG_N} phase={PHASE.commit} hue={HUE.pledge} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <Eyebrow hue={HUE.pledge}>Commitment</Eyebrow>
        <Hero size={32} style={{ marginTop: 14 }}>
          Make it real.
        </Hero>
        <Lead size={16} style={{ marginTop: 12 }}>
          Not a contract. Just a line you draw for yourself, today.
        </Lead>
        <OnbCard pad={22} style={{ marginTop: 22 }}>
          <AppText weightOverride="600" color={INK} style={{ fontSize: 18, lineHeight: 27 }}>
            I’m choosing to show up — not to be perfect, but to begin.
            {why ? <AppText weightOverride="600" color={INK2} style={{ fontSize: 18 }}> {why.trim().replace(/\.$/, '')}.</AppText> : ''} Today is day zero.
          </AppText>
          <View style={{ marginTop: 22, paddingTop: 16, borderTopWidth: 1, borderTopColor: SOFT2, borderStyle: 'dashed', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View>
              <AppText style={{ fontFamily: 'Georgia', fontStyle: 'italic', fontSize: 22, color: INK }}>{name || 'You'}</AppText>
              <AppText weightOverride="600" color={INK3} style={{ fontSize: 12, marginTop: 4, letterSpacing: 0.5 }}>
                SIGNED · DAY 0
              </AppText>
            </View>
            {signed ? (
              <FadeRise key="seal">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 30, height: 30, borderRadius: 9999, backgroundColor: tint(HUE.pledge, 0.5, 0.12), alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path d="M4 12l5 5L20 6" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                  <AppText weightOverride="600" color={tint(HUE.pledge, 0.55, 0.11)} style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Sealed
                  </AppText>
                </View>
              </FadeRise>
            ) : (
              gi('anchor', tint(HUE.pledge, 0.6, 0.1), 26)
            )}
          </View>
        </OnbCard>
      </OnbBody>
      <OnbFoot>
        <Pressable onPress={() => setSigned((s) => !s)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4, paddingBottom: 16 }}>
          <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: signed ? tint(HUE.pledge, 0.5, 0.12) : 'transparent', borderWidth: signed ? 0 : 2, borderColor: SOFT2, alignItems: 'center', justifyContent: 'center' }}>
            {signed ? (
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M4 12l5 5L20 6" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            ) : null}
          </View>
          <AppText weightOverride="600" color={INK} style={{ fontSize: 15, flex: 1 }}>
            I’m committing to myself, starting now.
          </AppText>
        </Pressable>
        <NextPill label="I’m in" enabled={signed} onPress={onNext} />
      </OnbFoot>
    </Stage>
  );
}

// ── 18 · NOTIFICATIONS ───────────────────────────────────────────────────────
export function OnbNotify({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const examples: [GlyphName, string, string][] = [
    ['sun', 'Morning check-in', 'A 20-second pulse on where your head’s at.'],
    ['wave', 'A nudge when it’s risky', 'Quiet support around the times urges spike.'],
    ['star', 'One small win a day', 'Never a streak alarm — just a note worth opening.'],
  ];
  return (
    <Stage hue={HUE.notify} intensity={0.85} pad={26} top={52}>
      <OnbBar i={12} n={PROG_N} phase={PHASE.setup} hue={HUE.notify} onBack={onBack} onClose={onBack} />
      <OnbBody>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
          <View style={{ alignItems: 'center', marginTop: 4, marginBottom: 22 }}>
            <Bob>
              <View style={{ width: 88, height: 88, borderRadius: 9999, backgroundColor: CARD, alignItems: 'center', justifyContent: 'center', shadowColor: tint(HUE.notify, 0.6, 0.1), shadowOpacity: 0.4, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } }}>
                {gi('bell', INK, 30)}
              </View>
            </Bob>
          </View>
          <Hero size={31} center>
            One gentle nudge a day.
          </Hero>
          <Lead center size={16} style={{ marginTop: 12, maxWidth: 300, alignSelf: 'center' }}>
            For the moments that happen outside the app.
          </Lead>
          <View style={{ gap: 11, marginTop: 28 }}>
            {examples.map(([g, t, s]) => (
              <OnbCard key={t} pad={15} style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                <TintChip hue={HUE.notify} icon={gi(g, INK, 21)} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText weightOverride="700" color={INK} style={{ fontSize: 15.5, letterSpacing: -0.15 }}>
                    {t}
                  </AppText>
                  <AppText weightOverride="500" color={INK2} style={{ fontSize: 13.5, lineHeight: 18, marginTop: 2 }}>
                    {s}
                  </AppText>
                </View>
              </OnbCard>
            ))}
          </View>
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Turn on reminders" arrow={false} onPress={onNext} />
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <GhostButton onPress={onNext}>Not now</GhostButton>
        </View>
      </OnbFoot>
    </Stage>
  );
}

// ── 20 · DONE ────────────────────────────────────────────────────────────────
export function OnbDone({ name = '', why = '', goals = [], onEnter }: { name?: string; why?: string; goals?: string[]; onEnter: () => void }) {
  return (
    <Stage hue={HUE.done} pad={26} top={56}>
      <Particles mode={CELEBRATE} />
      <OnbBody>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
          <FadeRise style={{ alignItems: 'center', marginTop: 6, marginBottom: 16 }}>
            <TideScene hue={HUE.done} w={208} h={130} />
          </FadeRise>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Bloom hue={HUE.done} />
            <SealBadge label="Day 0 · Ready" hue={HUE.done} />
          </View>
          <Hero size={36} center>
            {name ? `You’re set, ${name}.` : 'You’re set.'}
          </Hero>
          <Lead center size={16} style={{ marginTop: 12, maxWidth: 290, alignSelf: 'center' }}>
            Your starting line — not a scoreboard.
          </Lead>
          <OnbCard pad={18} style={{ marginTop: 26 }}>
            <SectionLabel style={{ marginBottom: 9 }}>Your why</SectionLabel>
            <AppText weightOverride="600" color={INK} style={{ fontSize: 16, lineHeight: 23 }}>
              {why.trim() || 'To feel like myself again.'}
            </AppText>
          </OnbCard>
          {goals.length ? (
            <OnbCard pad={18} style={{ marginTop: 12 }}>
              <SectionLabel style={{ marginBottom: 11 }}>You’re tracking</SectionLabel>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {goals.map((g) => (
                  <View key={g} style={{ backgroundColor: tint(HUE.done, 0.68, 0.07, 0.2), borderRadius: 9999, paddingVertical: 7, paddingHorizontal: 13 }}>
                    <AppText weightOverride="600" color={INK} style={{ fontSize: 14.5 }}>
                      {g}
                    </AppText>
                  </View>
                ))}
              </View>
            </OnbCard>
          ) : null}
        </ScrollView>
      </OnbBody>
      <OnbFoot>
        <NextPill label="Enter tideline" arrow={false} onPress={onEnter} />
      </OnbFoot>
    </Stage>
  );
}
