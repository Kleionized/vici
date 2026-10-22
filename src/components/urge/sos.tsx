/**
 * The SOS (`Vici UI 2/project/Vici SOS.dc.html`): rate the urge, where you are,
 * what's feeding it (and what you're putting off), what you're feeling, one
 * task from the library, the hub you do it in (the task, Breathe, Your pledge,
 * What helped before), the check afterward, another task or not, and the
 * summary. Behind `/urge`, `/urge-hub` and `/rough-first90`.
 *
 * Every element is placed where the frame places it, in canvas coordinates
 * (`Screen`): the nav row at 58, headings at 136, the pill at bottom 96 over
 * the ghost row at bottom 47 (48 when the pill is alone).
 */

import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, ScrollView, Text, View, type TextStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle, Path, SvgXml } from 'react-native-svg';

import { latoRuns, Screen, Tap, VizArt, WrapText } from '@/components/mono';
import { bandToSeverity } from '@/components/ui/IntensityBands';
import {
  nextSosAction,
  SOS_BED,
  SOS_BY_ID,
  SOS_FEELINGS,
  SOS_PLACES,
  SOS_TASK_TYPES,
  SOS_TRIGGERS,
  type SosAnswers,
} from '@/content/sosLibrary';
import { SOS_VIZ, SOS_VIZ_BOX } from '@/content/sosViz';
import { useCreateEvent, useCurrentUser, useEvents, useJournalEntries } from '@/lib/backend';
import { ACCOUNT_KEYS, writeAccountJSON } from '@/lib/accountState';
import { clockTime, daysAgo, shortDate, WEEKDAYS_SHORT } from '@/lib/format';
import { pledgeText, standingPledge } from '@/lib/pledge';
import { alpha, ctaOff, illus, mono, sans, sansItalic, tracking, urgeRamp } from '@/lib/theme';
import type { TidelineEvent } from '@/lib/types';
import { clearUrgeSession, openUrgeSession, saveUrgeSession, type UrgeSession } from '@/lib/urgeSession';

// ── the flow's state (the canvas's `f`) ─────────────────────────────────────

export type SosStep = 'rate' | 'loc' | 'trig' | 'task' | 'feel' | 'suggest' | 'do' | 'check' | 'more' | 'end';
export type SosHub = 'task' | 'breathe' | 'reason' | 'helped';

export type SosState = {
  step: SosStep;
  /** strength 1–5, or null */
  urge: number | null;
  loc: string | null;
  bed: string | null;
  trig: string[];
  feel: string[];
  task: string | null;
  /** the task on screen */
  cur: string | null;
  /** every task suggested, in order */
  shown: string[];
  /** the second read, 1–5; 0 is "It's gone" */
  after: number | null;
  hub: SosHub;
  /** when the urge started (ms) */
  t0: number;
  /** when the breathing page began its first breath (ms) */
  br: number;
  /** the session's length when it ended (s) */
  endS: number;
  seed: number;
  /** the answers the current suggestion was made for */
  ansKey: string | null;
};

/** A frame's preset (`S(id, label, screen, preset)` in the canvas). */
export type SosPreset = Partial<Omit<SosState, 't0' | 'br'>> & {
  /** the frame's clock, `HH:MM` — the hour the rules read */
  clock?: string;
  /** seconds since the urge started */
  since?: number;
  noTask?: boolean;
};

const MARK_OF: Partial<Record<SosStep, number>> = { rate: 1, loc: 2, trig: 3, task: 3, feel: 4 };

const answersOf = (f: SosState): SosAnswers => ({ urge: f.urge, loc: f.loc, bed: f.bed, trig: f.trig, feel: f.feel, task: f.task, no: [], shown: f.shown, seed: f.seed });
const ansKey = (f: SosState) => JSON.stringify([f.urge, f.loc, f.bed, [...f.trig].sort(), [...f.feel].sort(), f.task]);

/** "I don't know" stands alone: picking it clears the rest, picking another clears it. */
function toggleIn(list: string[], k: string): string[] {
  if (k === 'unknown') return list.includes('unknown') ? [] : ['unknown'];
  const l = list.filter((x) => x !== 'unknown');
  return l.includes(k) ? l.filter((x) => x !== k) : [...l, k];
}

/** `m:ss` */
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function fresh(preset: SosPreset | undefined, now: number, hour: number): SosState {
  const p = preset ?? {};
  const f: SosState = {
    step: 'rate',
    urge: null,
    loc: null,
    bed: null,
    trig: [],
    feel: [],
    task: null,
    cur: null,
    shown: [],
    after: null,
    hub: 'task',
    seed: preset ? 7 : 1 + Math.floor(Math.random() * 997),
    ansKey: null,
    endS: p.since ?? 0,
    ...p,
    t0: now - (p.since ?? 0) * 1000,
    br: now + 350,
  };
  if (['suggest', 'do', 'check', 'more', 'end'].includes(f.step)) {
    if (!f.cur && !p.noTask) f.cur = nextSosAction(answersOf(f), hour);
    f.shown = f.cur ? [f.cur] : [];
    f.ansKey = ansKey(f);
  }
  return f;
}

// ── type, as the frame sets it ──────────────────────────────────────────────

const ink = mono.ink;
const t = (w: '400' | '700', size: number, lh: number | undefined, color: string, ls = 0): TextStyle => ({ ...sans(w), fontSize: size, lineHeight: lh, ...tracking(ls), color });
const S = {
  h1: t('700', 26, 33, ink, -0.6),
  scaleN: t('400', 18, 22, ink),
  ends: t('700', 13, 18, mono.mute),
  cta: t('700', 16, undefined, mono.onInk, 0.1),
  ghost: t('400', 15, undefined, mono.mute),
  locLabel: t('400', 16, undefined, ink),
  bedQ: t('700', 17, 24, ink),
  chip: t('400', 15, 22, ink),
  sub: t('400', 15, 22, mono.mute),
  dur: t('700', 13, 18, mono.mute),
  steps: t('400', 16, 25, mono.sub),
  statV: t('700', 22, 28, ink, -0.3),
  statK: t('700', 12, 16, mono.mute),
  doTitle: t('700', 22, 29, ink, -0.3),
  doSteps: t('400', 15, 23, mono.sub),
  brSub: t('400', 15, 24, mono.sub),
  phase: t('700', 15, undefined, ink),
  phaseSec: t('400', 13, undefined, mono.sub),
  pledge: t('700', 34, 42, ink, -0.8),
  sign: { ...sansItalic(), fontSize: 26, lineHeight: 30, color: ink } as TextStyle,
  rowT: t('700', 15, 21, ink),
  rowM: t('400', 13, 18, mono.mute),
  endK: t('400', 15, 22, mono.mute),
  endV: t('700', 15, 22, ink),
  mini: t('700', 13, 18, mono.mute),
};

/** A run that wraps where the frame's engine wrapped it, in a box `w` wide. */
function W({ s, w, children, center, right }: { s: TextStyle; w: number | null; children: string; center?: boolean; right?: boolean }) {
  return (
    <WrapText style={s} w={w} align={center ? 'center' : right ? 'right' : 'left'}>
      {children}
    </WrapText>
  );
}

// ── the pieces every board shares ───────────────────────────────────────────

function ClockGlyph({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Circle cx={8} cy={8} r={6.2} fill="none" stroke={mono.mute} strokeWidth={1.6} />
      <Path d="M8 4.8V8l2.2 1.4" fill="none" stroke={mono.mute} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Check({ size = 13 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke={mono.onInk} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** `top 58, height 44, padding 0 18`: back (44, glyph 4 in), the centre, ✕ (44, glyph 4 in). */
function Nav({ backHidden, onBack, onClose, centre }: { backHidden?: boolean; onBack: () => void; onClose: () => void; centre?: ReactNode }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 58, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, zIndex: 5, pointerEvents: 'box-none' }}>
      <Tap label="Back" disabled={backHidden} onPress={onBack} style={{ width: 44, height: 44, justifyContent: 'center', paddingLeft: 4, opacity: backHidden ? 0 : 1 }}>
        <Svg width={12} height={20} viewBox="0 0 12 20">
          <Path d="M10 2L2 10l8 8" fill="none" stroke={ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Tap>
      {centre ?? null}
      <Tap label="Close" onPress={onClose} style={{ width: 44, height: 44, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 4 }}>
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Path d="M2 2l14 14M16 2L2 16" fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </Tap>
    </View>
  );
}

/** The four 24 × 2 marks: ink up to the step, `#2E2E2E` after it. */
function Marks({ on }: { on: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: 24, height: 2, borderRadius: 1, backgroundColor: i <= on ? ink : mono.line }} />
      ))}
    </View>
  );
}

/** `left 24 right 24 h58 r29` — ink until it needs an answer, then `#2E2E2E` with `#77736C` words. */
function Cta({ label, bottom, off, onPress }: { label: string; bottom: number; off?: boolean; onPress: () => void }) {
  return (
    <Tap
      onPress={onPress}
      aria-disabled={off ? true : undefined}
      style={{ position: 'absolute', left: 24, right: 24, bottom, height: 58, borderRadius: 29, backgroundColor: off ? ctaOff.fill : ink, alignItems: 'center', justifyContent: 'center', zIndex: 6 }}>
      <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={[S.cta, { color: off ? ctaOff.text : mono.onInk }]}>
        {label}
      </Text>
    </Tap>
  );
}

/** The row under the pill: `bottom 47, height 44`, inset 90 (120 for Skip), 15/400 mute. */
function Ghost({ label, inset = 90, icon, onPress }: { label: string; inset?: number; icon?: boolean; onPress: () => void }) {
  return (
    <Tap onPress={onPress} style={{ position: 'absolute', left: inset, right: inset, bottom: 47, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 6 }}>
      {icon ? (
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Circle cx={9} cy={9} r={7.6} fill="none" stroke={mono.mute} strokeWidth={1.5} />
          <Path d="M5.6 9.3l2.3 2.2L12.5 6.6" fill="none" stroke={mono.mute} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ) : null}
      <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={S.ghost}>
        {label}
      </Text>
    </Tap>
  );
}

/** The five bars, `84 + round((n − 1) · 22.5)` tall; the chosen one ink, ringed `3px #0D0D0D, 4.5px #F2F0EC`. */
function Scale({ value, onTap }: { value: number | null; onTap: (n: number) => void }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: 240, gap: 14 }}>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12, height: 174 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = value === n;
          return (
            <Tap
              key={n}
              label={`${n} of 5`}
              accessibilityRole="radio"
              aria-checked={on}
              onPress={() => onTap(n)}
              style={{
                width: 52,
                height: 84 + Math.round((n - 1) * 22.5),
                borderRadius: 26,
                backgroundColor: on ? ink : urgeRamp[n - 1],
                boxShadow: on ? `0 0 0 3px ${mono.ground}, 0 0 0 4.5px ${ink}` : undefined,
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 12,
              }}>
              <Text maxFontSizeMultiplier={1.3} style={[S.scaleN, { color: on || n >= 3 ? mono.onInk : ink }]}>
                {String(n)}
              </Text>
            </Tap>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', width: 308 }}>
        <Text maxFontSizeMultiplier={1.3} style={S.ends}>Mild</Text>
        <Text maxFontSizeMultiplier={1.3} style={S.ends}>Very strong</Text>
      </View>
    </View>
  );
}

/** A chip: `min-height 48, r24`, ink with a check when chosen. */
function Chip({ label, on, padV, onPress }: { label: string; on: boolean; padV: number; onPress: () => void }) {
  return (
    <Tap
      accessibilityRole="checkbox"
      aria-checked={on}
      onPress={onPress}
      style={{ minHeight: 48, maxWidth: '100%', flexShrink: 0, borderRadius: 24, backgroundColor: on ? ink : mono.card, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: padV, paddingHorizontal: 20 }}>
      {on ? <Check /> : null}
      <Text maxFontSizeMultiplier={1.3} style={[S.chip, { color: on ? mono.onInk : ink, flexShrink: 1 }]}>
        {label}
      </Text>
    </Tap>
  );
}

/** A task's drawing, through its own bounding box, in a box `w × h` (unclipped, `VizArt`). */
function Viz({ k, w, h }: { k: string; w: number; h: number }) {
  return <VizArt markup={SOS_VIZ[k] ?? ''} viewBox={SOS_VIZ_BOX[k] ?? '0 40 393 172'} w={w} h={h} />;
}

/** `What are you feeling?`'s thermometer: at 434, scaled 0.8 about (196, 190). */
const THERMOMETER = `<svg width="393" height="240" viewBox="0 0 393 240" overflow="visible"><g transform="translate(-28.1 -32.5) scale(1.146)"><rect x="84" y="188" width="224" height="7" rx="3.5" fill="#F2F0EC"></rect><rect x="96" y="195" width="6" height="14" rx="1.5" fill="#F2F0EC"></rect><rect x="290" y="195" width="6" height="14" rx="1.5" fill="#F2F0EC"></rect><rect x="176" y="176" width="41" height="12" rx="4" fill="#55524D"></rect><rect x="184" y="58" width="25" height="112" rx="12.5" fill="#F2F0EC"></rect><circle cx="196.5" cy="164" r="19" fill="#F2F0EC"></circle><rect x="192" y="70" width="9" height="94" rx="4.5" fill="#0D0D0D"></rect><rect x="192" y="112" width="9" height="52" rx="4.5" fill="#A8A39A"></rect><circle cx="196.5" cy="164" r="11.5" fill="#A8A39A"></circle><path d="M215 80 h9 M215 96 h6 M215 112 h9 M215 128 h6 M215 144 h9" fill="none" stroke="#F2F0EC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`;

// ── the hub's pages ─────────────────────────────────────────────────────────

/** The breath: in 4, hold 4, out 6, from 350 ms after the page opens. */
function breathPhase(br: number, now: number): 'pre' | 'in' | 'hold' | 'out' {
  const s = (now - br) / 1000;
  if (s < 0) return 'pre';
  const c = s % 14;
  return c < 4 ? 'in' : c < 8 ? 'hold' : 'out';
}

const BREATH = {
  in: { head: 'Breathe in.', sub: 'Slowly, through your nose. Let your shoulders drop.' },
  hold: { head: 'Hold.', sub: 'Keep your shoulders loose.' },
  out: { head: 'Breathe out.', sub: 'Through your mouth, slower than you breathed in.' },
} as const;

/** CSS `ease-in-out`. */
const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);

function BreathePage({ br, now, active }: { br: number; now: number; active: boolean }) {
  const ph = active ? breathPhase(br, now) : 'pre';
  const k = ph === 'pre' ? 'in' : ph;
  const target = ph === 'in' || ph === 'hold' ? 1 : 0.6;
  const secs = ph === 'in' ? 4 : ph === 'out' ? 6 : 0.3;
  const [scale] = useState(() => new Animated.Value(target));
  useEffect(() => {
    const a = Animated.timing(scale, { toValue: target, duration: secs * 1000, easing: EASE_IN_OUT, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [scale, target, secs]);
  return (
    <View style={{ width: 393, height: '100%' }}>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 28, gap: 12, alignItems: 'center' }}>
        <W s={S.h1} w={345} center>{BREATH[k].head}</W>
        <W s={S.brSub} w={345} center>{BREATH[k].sub}</W>
      </View>
      <View style={{ position: 'absolute', left: 51, top: 126, width: 290, height: 290 }}>
        <View style={{ position: 'absolute', left: 5, top: 5, width: 280, height: 280, borderRadius: 140, boxShadow: `inset 0 0 0 1.5px ${alpha.ink(0.12)}` }} />
        <View style={{ position: 'absolute', left: 29, top: 29, width: 232, height: 232, borderRadius: 116, backgroundColor: alpha.ink(0.05) }} />
        <View style={{ position: 'absolute', left: 53, top: 53, width: 184, height: 184, borderRadius: 92, backgroundColor: alpha.ink(0.08) }} />
        <Animated.View style={{ position: 'absolute', left: 29, top: 29, width: 232, height: 232, borderRadius: 116, backgroundColor: ink, transform: [{ scale }] }} />
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 446, flexDirection: 'row', justifyContent: 'center', gap: 36 }}>
        {(
          [
            ['in', 'In', '4 sec'],
            ['hold', 'Hold', '4 sec'],
            ['out', 'Out', '6 sec'],
          ] as const
        ).map(([key, label, sec]) => {
          const on = key === k;
          return (
            <View key={key} style={{ alignItems: 'center', gap: 4, minWidth: 56 }}>
              <Text maxFontSizeMultiplier={1.3} style={[S.phase, { color: on ? ink : alpha.ink(0.4) }]}>{label}</Text>
              <Text maxFontSizeMultiplier={1.3} style={[S.phaseSec, { color: on ? mono.sub : alpha.ink(0.3) }]}>{sec}</Text>
              <View style={{ width: 24, height: 3, borderRadius: 2, marginTop: 6, backgroundColor: on ? ink : 'transparent' }} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

function PledgePage({ words, name, signed }: { words: string; name: string; signed: string }) {
  return (
    <View style={{ width: 393, height: '100%' }}>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 34 }}>
        <Text maxFontSizeMultiplier={1.3} style={S.h1}>Your pledge</Text>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 148, gap: 56 }}>
        <W s={S.pledge} w={345}>{words}</W>
        <View style={{ gap: 10 }}>
          <Text maxFontSizeMultiplier={1.3} style={[S.sign, { paddingLeft: 4 }]}>{name}</Text>
          <View style={{ height: 1.5, backgroundColor: illus.dim2 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={S.ends}>Signed</Text>
            <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={S.ends}>{signed}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

type Helped = { id: string; title: string; meta: string };

function HelpedPage({ rows, onPick }: { rows: Helped[]; onPick: (id: string) => void }) {
  return (
    <View style={{ width: 393, height: '100%' }}>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 34, gap: 8 }}>
        <W s={S.h1} w={345}>What helped before</W>
        <W s={S.sub} w={345}>These brought the urge down last time. Tap one to switch to it.</W>
        <View style={{ height: 14 }} />
        <View style={{ borderTopWidth: 1, borderTopColor: mono.line }}>
          {rows.map((h) => (
            <Tap key={h.id} onPress={() => onPick(h.id)} style={{ borderBottomWidth: 1, borderBottomColor: mono.line, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ flex: 1, gap: 3, minWidth: 0 }}>
                <W s={S.rowT} w={317}>{h.title}</W>
                <Text maxFontSizeMultiplier={1.3} style={S.rowM}>{latoRuns(h.meta, S.rowM)}</Text>
              </View>
              <Svg width={14} height={14} viewBox="0 0 14 14">
                <Path d="M5 2l5 5-5 5" fill="none" stroke={mono.art} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Tap>
          ))}
        </View>
      </View>
    </View>
  );
}

/** The canvas's `transform 0.34s cubic-bezier(0.2, 0.8, 0.2, 1)`. */
const PAGE_EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

/**
 * The hub's pages side by side, `top 102 bottom 196`, slid by a drag: past 50
 * it turns the page, and at either end it gives a third of the drag.
 */
function Pager({ pages, index, onIndex, children }: { pages: SosHub[]; index: number; onIndex: (i: number) => void; children: ReactNode }) {
  const [x] = useState(() => new Animated.Value(-index * 393));
  const state = useRef({ index, count: pages.length, onIndex });
  useEffect(() => {
    state.current = { index, count: pages.length, onIndex };
  });
  useEffect(() => {
    Animated.timing(x, { toValue: -index * 393, duration: 340, easing: PAGE_EASE, useNativeDriver: true }).start();
  }, [x, index]);
  // The builder only stores these callbacks; they run on gesture events, never
  // during render — which is what the refs rule cannot see through.
  /* eslint-disable react-hooks/refs */
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-4, 4])
        .failOffsetY([-12, 12])
        .onUpdate((e) => {
          const { index: i, count } = state.current;
          const dx = (i <= 0 && e.translationX > 0) || (i >= count - 1 && e.translationX < 0) ? e.translationX * 0.3 : e.translationX;
          x.setValue(-i * 393 + dx);
        })
        .onEnd((e) => {
          const { index: i, count, onIndex: go } = state.current;
          const to = e.translationX < -50 ? Math.min(count - 1, i + 1) : e.translationX > 50 ? Math.max(0, i - 1) : i;
          if (to !== i) go(to);
          else Animated.timing(x, { toValue: -i * 393, duration: 340, easing: PAGE_EASE, useNativeDriver: true }).start();
        }),
    [x],
  );
  /* eslint-enable react-hooks/refs */
  return (
    <GestureDetector gesture={pan}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 102, bottom: 196, zIndex: 4 }}>
        <Animated.View style={{ flexDirection: 'row', height: '100%', width: 393 * pages.length, transform: [{ translateX: x }] }}>{children}</Animated.View>
      </View>
    </GestureDetector>
  );
}

// ── the flow ────────────────────────────────────────────────────────────────

/** A task's title → its id: what an urge files as what helped is the task's title. */
const BY_TITLE: Record<string, string> = Object.fromEntries(Object.values(SOS_BY_ID).map((x) => [x.title, x.id]));
const label = (list: readonly (readonly [string, string])[], k: string | null) => list.find((x) => x[0] === k)?.[1];

/**
 * What helped before: past urges where a task was done and the urge came down,
 * newest first — the task, when, and the strength before and after. Not the
 * task on screen; three at most.
 */
function helpedFrom(events: TidelineEvent[] | undefined, cur: string | null, now: number): Helped[] {
  const out: Helped[] = [];
  const seen = new Set<string>();
  for (const e of [...(events ?? [])].sort((a, b) => b.createdAt - a.createdAt)) {
    if (e.type !== 'urge_rode_out' || !e.whatHelped) continue;
    const id = BY_TITLE[e.whatHelped];
    const a = id ? SOS_BY_ID[id] : undefined;
    if (!a || id === cur || seen.has(id) || e.severity == null || e.severityAfter == null) continue;
    const before = Math.round(e.severity / 2);
    const after = Math.round(e.severityAfter / 2);
    if (!(after < before) || after === 0) continue;
    seen.add(id);
    const d = new Date(e.createdAt);
    const when = daysAgo(e.createdAt, now) < 7 ? WEEKDAYS_SHORT[d.getDay()] : shortDate(d);
    out.push({ id, title: a.title, meta: `${when}, ${clockTime(e.createdAt, { lower: true })} · Strength ${before} → ${after}` });
    if (out.length === 3) break;
  }
  return out;
}

/** "Today, 8:12 am" · "Yesterday, 8:12 am" · "Oct 14, 8:12 am". */
function signedAt(at: number, now: number): string {
  const n = daysAgo(at, now);
  const day = n === 0 ? 'Today' : n === 1 ? 'Yesterday' : shortDate(at);
  return `${day}, ${clockTime(at, { lower: true })}`;
}

export function SosFlow({ preset, frozenNow, builtAt, fixture }: {
  /** a frame's preset (the dev harness) — the flow opens on that board */
  preset?: SosPreset;
  /** a fixed "now" (the dev harness): the timers and the breath stand still at it */
  frozenNow?: number;
  /** when the preset's board was opened (the dev harness): its timers count from here */
  builtAt?: number;
  /** the hub's pledge and history, as a frame draws them (the dev harness) */
  fixture?: { pledge?: { words: string; name: string; signed: string }; helped?: Helped[] };
} = {}) {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const events = useEvents();
  const journal = useJournalEntries();
  const user = useCurrentUser();
  const [tick, setTick] = useState(() => frozenNow ?? Date.now());
  const now = frozenNow ?? tick;
  const hourOf = () => (preset?.clock ? parseInt(preset.clock, 10) : new Date(now).getHours());
  const [f, setF] = useState<SosState>(() => fresh(preset, builtAt ?? now, preset?.clock ? parseInt(preset.clock, 10) : new Date(now).getHours()));
  const session = useRef<UrgeSession | null>(null);
  const ended = useRef(Boolean(preset));

  // the clock the hub's timer and the breath read
  useEffect(() => {
    if (frozenNow != null) return;
    const id = setInterval(() => setTick(Date.now()), f.step === 'do' && f.hub === 'breathe' ? 150 : 1000);
    return () => clearInterval(id);
  }, [frozenNow, f.step, f.hub]);

  // the urge in progress, so it outlives the screen (D461) — not for a harness board
  useEffect(() => {
    if (preset) return;
    let alive = true;
    void openUrgeSession('interrupt').then((s) => {
      if (!alive) return;
      session.current = s;
      const snap = s.flow?.sos as SosState | undefined;
      if (snap && snap.step && snap.step !== 'rate' && snap.step !== 'end') setF({ ...snap, t0: s.startedAt });
      else setF((cur) => ({ ...cur, t0: s.startedAt }));
    });
    return () => {
      alive = false;
      if (!ended.current) {
        ended.current = true;
        void clearUrgeSession();
      }
    };
  }, [preset]);

  useEffect(() => {
    const s = session.current;
    if (!s || ended.current || f.step === 'end') return;
    const next: UrgeSession = {
      ...s,
      severity: f.urge ? bandToSeverity(f.urge - 1) : undefined,
      flow: { step: f.step, band: f.urge ? f.urge - 1 : null, place: f.loc, reasons: f.trig, feelings: f.feel, after: f.after, note: '', sos: f },
    };
    session.current = next;
    void saveUrgeSession(next);
  }, [f]);

  const set = (patch: Partial<SosState> | ((cur: SosState) => Partial<SosState>)) => setF((cur) => ({ ...cur, ...(typeof patch === 'function' ? patch(cur) : patch) }));
  const since = () => Math.max(0, Math.floor((now - f.t0) / 1000));
  const a = f.cur ? SOS_BY_ID[f.cur] : null;

  /** Write the urge, once: the strengths given, how long it ran, the task done. */
  function log(cur: SosState) {
    if (ended.current) return;
    ended.current = true;
    const s = session.current;
    const done = cur.cur ? SOS_BY_ID[cur.cur] : null;
    const reasons = cur.trig.map((k) => label(SOS_TRIGGERS, k)).filter((x): x is string => !!x);
    void createEvent({
      type: 'urge_rode_out',
      severity: cur.urge ? bandToSeverity(cur.urge - 1) : undefined,
      severityAfter: cur.after === 0 ? 0 : cur.after ? bandToSeverity(cur.after - 1) : undefined,
      durationSeconds: Math.max(1, cur.endS),
      trigger: reasons.filter((r) => r !== 'I don’t know').join(' · ') || undefined,
      whatHelped: done?.title,
      reopens: s?.reopens ? s.reopens : undefined,
      precedingState: {
        location: label(SOS_PLACES, cur.loc),
        feeling: label(SOS_FEELINGS, cur.feel[0] ?? null),
        reasons: reasons.length ? reasons : undefined,
      },
    }).catch((error) => {
      if (__DEV__) console.warn('urge_rode_out was not written', error);
    });
    void writeAccountJSON(ACCOUNT_KEYS.postPending, Date.now());
    void clearUrgeSession();
  }

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  /** ✕: a session that reached the check has been worked through, and is logged as it stands. */
  const close = () => {
    if (!ended.current && ['check', 'more'].includes(f.step)) log({ ...f, endS: since() });
    if (!ended.current) {
      ended.current = true;
      void clearUrgeSession();
    }
    if (preset) set(fresh(preset, now, hourOf()));
    else leave();
  };
  const end = (patch: Partial<SosState>) => {
    const next = { ...f, ...patch, endS: since(), step: 'end' as const };
    setF(next);
    if (!preset) log(next);
  };

  const pick = () =>
    set((cur) => {
      const id = nextSosAction(answersOf(cur), hourOf());
      return { cur: id, shown: [...cur.shown, id], after: null, step: 'suggest' };
    });
  const toSuggest = (patch: Partial<SosState>) =>
    set((cur) => {
      const n = { ...cur, ...patch };
      const k = ansKey(n);
      if (k !== n.ansKey || !n.cur) {
        const id = nextSosAction({ ...answersOf(n), shown: [] }, hourOf());
        return { ...patch, cur: id, shown: [id], ansKey: k, step: 'suggest' };
      }
      return { ...patch, step: 'suggest' };
    });

  const back = () =>
    set((cur): Partial<SosState> => {
      const s = cur.step;
      if (s === 'do' && cur.hub !== 'task') return { hub: 'task' };
      if (s === 'loc') return { step: 'rate' };
      if (s === 'trig') return { step: 'loc' };
      if (s === 'task') return { step: 'trig' };
      if (s === 'feel') return { step: cur.trig.includes('putoff') ? 'task' : 'trig' };
      if (s === 'suggest') return { step: 'feel' };
      if (s === 'do') return { step: 'suggest' };
      if (s === 'more') return { step: 'check' };
      if (s === 'check') return { step: 'do', hub: 'task' };
      return {};
    });

  const st = f.step;
  const mark = MARK_OF[st];
  const pledgeEntry = standingPledge(journal);
  const pledge = fixture?.pledge ?? (pledgeEntry && pledgeText(pledgeEntry) ? { words: pledgeText(pledgeEntry), name: user?.displayName?.split(' ')[0] ?? 'You', signed: signedAt(pledgeEntry.createdAt, now) } : null);
  const helped = fixture?.helped ?? helpedFrom(events, f.cur, now);
  const pages: SosHub[] = ['task', 'breathe', ...(pledge ? (['reason'] as const) : []), ...(helped.length ? (['helped'] as const) : [])];
  const hub = pages.includes(f.hub) ? f.hub : 'task';
  const pi = pages.indexOf(hub);
  const toHub = (h: SosHub) => set(h === 'breathe' ? { hub: h, br: now + 350 } : { hub: h });

  let centre: ReactNode = null;
  if (mark) centre = <Marks on={mark} />;
  else if (st === 'do' && hub !== 'task')
    centre = (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <ClockGlyph />
        <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={[S.mini, { fontVariant: ['tabular-nums'] }]}>{`Urge · ${fmt(since())}`}</Text>
      </View>
    );

  let body: ReactNode = null;
  if (st === 'rate' || st === 'check') {
    const value = st === 'rate' ? f.urge : f.after;
    body = (
      <>
        <View style={{ position: 'absolute', left: 24, right: 24, top: 136 }}>
          <W s={S.h1} w={345}>{st === 'rate' ? 'How strong is the urge right now?' : 'How strong is the urge now?'}</W>
        </View>
        <Scale value={value} onTap={(n) => set(st === 'rate' ? { urge: f.urge === n ? null : n } : { after: f.after === n ? null : n })} />
        <Cta
          label="Continue"
          bottom={96}
          off={st === 'rate' && !f.urge}
          onPress={() => {
            if (st === 'rate') {
              if (f.urge) set({ step: 'loc' });
            } else set((cur) => ({ step: 'more', after: cur.after === 0 ? null : cur.after }));
          }}
        />
        <Ghost label="It’s gone" icon onPress={() => end(st === 'rate' ? { cur: null, after: 0 } : { after: 0 })} />
      </>
    );
  } else if (st === 'loc') {
    body = (
      <>
        <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 22 }}>
          <W s={S.h1} w={345}>Where are you right now?</W>
          <View accessibilityRole="radiogroup" style={{ gap: 12 }}>
            {SOS_PLACES.map(([k, l]) => {
              const on = f.loc === k;
              const fg = on ? mono.onInk : ink;
              return (
                <Tap
                  key={k}
                  label={l}
                  accessibilityRole="radio"
                  aria-checked={on}
                  onPress={() => set({ loc: k, bed: k === 'bed' ? f.bed : null })}
                  style={{ height: 60, borderRadius: 18, backgroundColor: on ? ink : mono.card, flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 16, paddingRight: 18 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, flexShrink: 0, alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1.5px ${on ? mono.onInkRing : mono.line}` }}>
                    <Svg width={20} height={20} viewBox="0 0 20 20">
                      <Path d={PLACE_GLYPH[k]} fill="none" stroke={fg} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                  <Text maxFontSizeMultiplier={1.3} style={[S.locLabel, { flex: 1, color: fg }]}>{l}</Text>
                  {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: mono.card }} /> : null}
                </Tap>
              );
            })}
          </View>
          {f.loc === 'bed' ? (
            <View style={{ gap: 14 }}>
              <Text maxFontSizeMultiplier={1.3} style={S.bedQ}>Are you trying to sleep?</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {SOS_BED.map(([k, l]) => (
                  <Chip key={k} label={l} on={f.bed === k} padV={12} onPress={() => set({ bed: f.bed === k ? null : k })} />
                ))}
              </View>
            </View>
          ) : null}
        </View>
        <Cta label="Continue" bottom={48} off={!f.loc} onPress={() => f.loc && set({ step: 'trig' })} />
      </>
    );
  } else if (st === 'trig' || st === 'task' || st === 'feel') {
    const cfg =
      st === 'trig'
        ? { head: 'What’s feeding it right now?', multi: true, list: SOS_TRIGGERS, sel: f.trig }
        : st === 'task'
          ? { head: 'What are you putting off?', multi: false, list: SOS_TASK_TYPES, sel: f.task ? [f.task] : [] }
          : { head: 'What are you feeling?', multi: true, list: SOS_FEELINGS, sel: f.feel };
    const tap = (k: string) =>
      st === 'trig'
        ? set((cur) => {
            const trig = toggleIn(cur.trig, k);
            return { trig, task: trig.includes('putoff') ? cur.task : null };
          })
        : st === 'task'
          ? set((cur) => ({ task: cur.task === k ? null : k }))
          : set((cur) => ({ feel: toggleIn(cur.feel, k) }));
    const next = () => {
      if (!cfg.sel.length) return;
      if (st === 'trig') set({ step: f.trig.includes('putoff') ? 'task' : 'feel' });
      else if (st === 'task') set({ step: 'feel' });
      else toSuggest({});
    };
    const skip = () => {
      if (st === 'trig') set({ trig: [], task: null, step: 'feel' });
      else if (st === 'task') set({ task: null, step: 'feel' });
      else toSuggest({ feel: [] });
    };
    body = (
      <>
        {st === 'feel' ? (
          <View style={{ position: 'absolute', left: 0, top: 434, width: 393, height: 240, transform: [{ scale: 0.8 }], transformOrigin: '196px 190px' }}>
            <SvgXml xml={THERMOMETER} width={393} height={240} />
          </View>
        ) : null}
        <ScrollView style={{ position: 'absolute', left: 24, right: 24, top: 136, bottom: 174 }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
          <W s={S.h1} w={345}>{cfg.head}</W>
          {cfg.multi ? <W s={S.sub} w={345}>Select all that apply.</W> : null}
          <View style={{ height: 6 }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {cfg.list.map(([k, l]) => (
              <Chip key={k} label={l} on={cfg.sel.includes(k)} padV={13} onPress={() => tap(k)} />
            ))}
          </View>
        </ScrollView>
        <Cta label="Continue" bottom={96} off={!cfg.sel.length} onPress={next} />
        <Ghost label="Skip" inset={120} onPress={skip} />
      </>
    );
  } else if (st === 'suggest' && a) {
    body = (
      <>
        <View style={{ position: 'absolute', left: 24, right: 24, top: 118, height: 176, alignItems: 'center', justifyContent: 'center' }}>
          <Viz k={a.viz} w={345} h={176} />
        </View>
        <View style={{ position: 'absolute', left: 24, right: 24, top: 326, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <ClockGlyph />
            <Text maxFontSizeMultiplier={1.3} style={S.dur}>{`${a.dur} min`}</Text>
          </View>
          <W s={S.h1} w={345}>{a.title}</W>
          <W s={S.steps} w={345}>{a.steps}</W>
        </View>
        <Cta label="Do this task" bottom={96} onPress={() => set({ step: 'do', hub: 'task' })} />
        <Ghost label="Choose another" onPress={pick} />
      </>
    );
  } else if (st === 'do' && a) {
    body = (
      <>
        <Pager pages={pages} index={pi} onIndex={(i) => toHub(pages[i])}>
          <View style={{ width: 393, height: '100%' }}>
            <View style={{ position: 'absolute', left: 36, right: 36, top: 16, flexDirection: 'row', alignItems: 'stretch' }}>
              <View style={{ flex: 1, minWidth: 0, alignItems: 'center', gap: 2 }}>
                <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={[S.statV, { fontVariant: ['tabular-nums'] }]}>{fmt(since())}</Text>
                <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={S.statK}>Since the urge started</Text>
              </View>
              <View style={{ width: 1, backgroundColor: mono.line, flexShrink: 0 }} />
              <View style={{ flex: 1, minWidth: 0, alignItems: 'center', gap: 2 }}>
                <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={S.statV}>{f.urge ? `${f.urge} of 5` : 'Not rated'}</Text>
                <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={S.statK}>Strength</Text>
              </View>
            </View>
            <View style={{ position: 'absolute', left: 24, right: 24, top: 90, height: 176, alignItems: 'center', justifyContent: 'center' }}>
              <Viz k={a.viz} w={345} h={176} />
            </View>
            <View style={{ position: 'absolute', left: 32, right: 32, top: 298, gap: 12, alignItems: 'center' }}>
              <W s={S.doTitle} w={329} center>{a.title}</W>
              <W s={S.doSteps} w={329} center>{a.steps}</W>
            </View>
          </View>
          <BreathePage br={f.br} now={now} active={hub === 'breathe'} />
          {pledge ? <PledgePage {...pledge} /> : null}
          {helped.length ? (
            <HelpedPage
              rows={helped}
              onPick={(id) => set((cur) => ({ cur: id, shown: cur.shown.includes(id) ? cur.shown : [...cur.shown, id], hub: 'task' }))}
            />
          ) : null}
        </Pager>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 166, flexDirection: 'row', justifyContent: 'center', gap: 4, zIndex: 6 }}>
          {pages.map((p, i) => (
            <Tap key={p} label={`Page ${i + 1}`} onPress={() => i !== pi && toHub(p)} style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i === pi ? ink : illus.dim2 }} />
            </Tap>
          ))}
        </View>
        <Cta label="I did it" bottom={96} onPress={() => set({ after: null, hub: 'task', step: 'check' })} />
        <Ghost label="Choose another" onPress={pick} />
      </>
    );
  } else if (st === 'more') {
    const u = f.urge;
    const af = f.after;
    const sub = u && af ? (af < u ? `The urge has dropped from ${u} to ${af}.` : af > u ? `The urge has gone up from ${u} to ${af}.` : `The urge is still at ${af} out of 5.`) : '';
    body = (
      <>
        <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 10 }}>
          <W s={S.h1} w={345}>Would you like another task?</W>
          {sub ? <W s={S.sub} w={345}>{sub}</W> : null}
        </View>
        <Cta label="Show me another task" bottom={96} onPress={pick} />
        <Ghost label="No, I’m done" onPress={() => end({})} />
      </>
    );
  } else if (st === 'end') {
    const u = f.urge;
    const af = f.after;
    const rows: { k: string; v: string }[] = [];
    const sv = u && af != null ? `${u} → ${af === 0 ? 'gone' : af}` : af === 0 ? 'Gone' : u ? `${u} of 5` : '';
    if (sv) rows.push({ k: 'Urge strength', v: sv });
    if (a) {
      rows.push({ k: 'Time with the urge', v: f.endS < 60 ? 'Under a minute' : `${Math.round(f.endS / 60)} min` });
      rows.push({ k: 'Task', v: a.title });
    }
    body = (
      <>
        <View style={{ position: 'absolute', left: 24, right: 24, top: 136 }}>
          <W s={S.h1} w={345}>Done for now.</W>
          <View style={{ marginTop: 28, borderTopWidth: 1, borderTopColor: mono.line }}>
            {rows.map((r) => (
              <View key={r.k} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: mono.line }}>
                <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={S.endK}>{r.k}</Text>
                <View style={{ flexShrink: 1 }}>
                  <Text maxFontSizeMultiplier={1.3} style={[S.endV, { textAlign: 'right' }]}>{latoRuns(r.v, S.endV)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <Cta label="Back to Today" bottom={48} onPress={close} />
      </>
    );
  }

  return (
    <Screen>
      <Nav backHidden={st === 'rate' || st === 'end'} onBack={back} onClose={close} centre={centre} />
      {body}
    </Screen>
  );
}

/** The five places' glyphs (20-box, `currentColor` 1.8, round caps and joins). */
const PLACE_GLYPH: Record<string, string> = {
  private: 'M4 17V8l6-5 6 5v9M8 17v-5h4v5',
  bed: 'M3 15V9h14v6M3 12h14M5 9V6h4v3',
  public: 'M6 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM14 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 16c0-2.5 1.8-4 4-4s4 1.5 4 4M10 16c0-2.5 1.8-4 4-4s4 1.5 4 4',
  work: 'M3 7h14v9H3zM7 7V4h6v3M3 11h14',
  out: 'M10 17s-5-4.5-5-8a5 5 0 0 1 10 0c0 3.5-5 8-5 8zM10 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
};
