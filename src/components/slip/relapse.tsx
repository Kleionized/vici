/**
 * The relapse flow (`Vici UI 2/project/Vici Relapse.dc.html`): when it
 * happened (with a date-and-time sheet), what led up to it, whether you feel
 * like watching again, and one encouragement message chosen for the answers —
 * then the relapse log (`05 · Back in the app`, `/relapses`). Behind `/slip`.
 *
 * Canvas coordinates throughout (`Screen`): the nav row at 58, the page from
 * 102 to the frame's foot, its pill 48 (47 over Skip) off the bottom.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, useWindowDimensions, View, type TextStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen, Tap, VizArt, WrapText } from '@/components/mono';
import { RELAPSE_ART, RELAPSE_CALENDAR, RELAPSE_CAUSES, RELAPSE_MESSAGES, RELAPSE_QUOTES, RELAPSE_WATCH, RELAPSE_WHEN } from '@/content/relapse.data';
import { SOS_VIZ, SOS_VIZ_BOX } from '@/content/sosViz';
import { ACCOUNT_KEYS, readAccountJSON, writeAccountJSON } from '@/lib/accountState';
import { alpha, ctaOff, illus, mono, sans, tracking } from '@/lib/theme';
import type { RelapseRecord, TidelineEvent } from '@/lib/types';

// ── the canvas's helpers ────────────────────────────────────────────────────

const pad2 = (n: number) => String(n).padStart(2, '0');
const isoOf = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
/** Today, or `off` days from it, as `YYYY-MM-DD`, read at `now`. */
export function dayISO(now: number, off = 0): string {
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + off);
  return isoOf(d);
}
/** Whole days from today to `iso` (−1 is yesterday). */
export function diffDays(iso: string, now: number): number {
  return Math.round((new Date(`${iso}T12:00:00`).getTime() - new Date(`${dayISO(now)}T12:00:00`).getTime()) / 86400000);
}
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "Today" · "Yesterday" · "Mon 19 Oct" (`toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })`). */
export function dayLabel(iso: string, now: number): string {
  const d = diffDays(iso, now);
  if (d === 0) return 'Today';
  if (d === -1) return 'Yesterday';
  const x = new Date(`${iso}T12:00:00`);
  return `${WD[x.getDay()]} ${x.getDate()} ${MON[x.getMonth()]}`;
}
/** Minutes after midnight → "9:42 pm". */
export const fmtTime = (min: number) => `${Math.floor(min / 60) % 12 || 12}:${pad2(min % 60)} ${min < 720 ? 'am' : 'pm'}`;
const minutesOf = (at: number) => new Date(at).getHours() * 60 + new Date(at).getMinutes();

const CAUSE_LABEL: Record<string, string> = Object.fromEntries(RELAPSE_CAUSES.map(([k, l]) => [k, l]));

/** The log row's title: "Today, about 9:42 pm" · "Earlier today" · "Yesterday" · "Mon 19 Oct, 10:15 pm" · "Date not known". */
export function entryTitle(r: RelapseRecord, now: number): string {
  if (!r.date) return 'Date not known';
  const day = dayLabel(r.date, now);
  if (r.when === 'today' || r.when === 'yesterday') return r.when === 'today' && day === 'Today' ? 'Earlier today' : day;
  return r.time != null ? `${day}, ${r.approx ? 'about ' : ''}${fmtTime(r.time)}` : day;
}
/** The log row's line: what led up to it. */
export function entryMeta(r: RelapseRecord): string {
  if (r.skipped || !r.causes.length) return 'What led up to it: not answered';
  if (r.causes.includes('notsure')) return 'Not sure what led up to it';
  return r.causes.map((k) => CAUSE_LABEL[k] ?? k).join(', ');
}

// ── the message rules (the canvas's `facts` and `assign`) ───────────────────

type Msg = (typeof RELAPSE_MESSAGES)[number];
const MSG_BY: Record<string, Msg> = Object.fromEntries(RELAPSE_MESSAGES.map((m) => [m[0], m]));
const Q_BY = Object.fromEntries(RELAPSE_QUOTES.map((q) => [q[0], q]));
/** A message's place among its theme's, which picks its drawing. */
const THEME_IX: Record<string, number> = (() => {
  const c: Record<string, number> = {};
  const out: Record<string, number> = {};
  for (const m of RELAPSE_MESSAGES) {
    c[m[1]] = c[m[1]] ?? 0;
    out[m[0]] = c[m[1]]++;
  }
  return out;
})();

/** FNV-1a, as the canvas hashes. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type RelapseCtx = { hour: number; goal: 'sleep' | 'awake' | 'unknown'; practice: boolean; attempts: boolean };

function facts(r: RelapseRecord, c: RelapseCtx, now: number): Record<string, boolean> {
  const off = r.date ? diffDays(r.date, now) : null;
  const h = c.hour;
  return {
    event_on_current_local_date: off === 0,
    event_on_an_earlier_local_date: off !== null && off < 0,
    daytime_or_evening: h >= 5 && h < 22,
    current_evening: h >= 17 && h < 22,
    current_evening_or_night: h >= 17 || h < 5,
    not_trying_to_sleep: c.goal === 'awake',
    current_sleep_goal: c.goal === 'sleep',
    known_prior_course_or_task_practice: c.practice,
    prior_attempt_self_reported: c.attempts,
    current_watch_again_yes_or_not_sure: r.watch === 'yes' || r.watch === 'unsure',
    current_watch_again_no: r.watch === 'no',
    log_saved: true,
    content_confirmed_open: false,
    not_urgent: false,
    reported_cause_not_sure: r.causes.includes('notsure'),
  };
}

/** What has been shown before on this phone: the messages, in order, and the quotes. */
export type RelapseHistory = { hist: { id: string; theme: string; at: number }[]; qSeen: string[] };

/**
 * The message (and maybe a quote) for an entry: the one it already has if it
 * still fits; else, among those that fit, one not in the last 24 shown and not
 * of the last two themes, the least shown, longest ago, a specific theme over
 * "general", then by hash. A quote ends one message in four (by hash), the
 * first not yet seen that fits the theme and facts.
 */
export function assignMessage(entryId: string, r: RelapseRecord, c: RelapseCtx, now: number, history: RelapseHistory, forced?: { msg: string; quote?: string | null }): { record: RelapseRecord; history: RelapseHistory } {
  if (forced) return { record: { ...r, message: forced.msg, quote: forced.quote ?? undefined }, history };
  const F = facts(r, c, now);
  const ok = (m: Msg) => m[2].every((k) => F[k]);
  const H = [...history.hist];
  const qSeen = [...history.qSeen];
  let message = r.message;
  let quote = r.quote;
  if (!(message && MSG_BY[message] && ok(MSG_BY[message]))) {
    const el = RELAPSE_MESSAGES.filter(ok);
    const last = H.slice(-24).map((x) => x.id);
    const themes = H.slice(-2).map((x) => x.theme);
    let pool = el.filter((m) => !last.includes(m[0]) && !themes.includes(m[1]));
    if (!pool.length) pool = el.filter((m) => !last.includes(m[0]));
    if (!pool.length) pool = el;
    const stat = (id: string) => {
      let n = 0;
      let at = 0;
      for (const x of H) if (x.id === id) {
        n++;
        at = x.at;
      }
      return [n, at];
    };
    const ranked = pool
      .map((m) => {
        const [n, at] = stat(m[0]);
        return { m, n, at, sp: m[1] === 'general' ? 1 : 0, hs: hash(entryId + m[0]) };
      })
      .sort((a, b) => a.n - b.n || a.at - b.at || a.sp - b.sp || a.hs - b.hs);
    const pick = ranked[0]?.m;
    if (pick) {
      message = pick[0];
      quote = undefined;
      H.push({ id: pick[0], theme: pick[1], at: now + H.length });
      if (hash(`${entryId}:q`) % 4 === 0) {
        const q = RELAPSE_QUOTES.find((x) => !qSeen.includes(x[0]) && x[4].every((k) => F[k]) && (x[3][0] === '*' || x[3].includes(pick[1])));
        if (q) {
          quote = q[0];
          qSeen.push(q[0]);
        }
      }
    }
  } else if (quote && Q_BY[quote] && !Q_BY[quote][4].every((k) => F[k])) quote = undefined;
  return { record: { ...r, message, quote }, history: { hist: H, qSeen } };
}

export const RELAPSE_HISTORY_KEY = ACCOUNT_KEYS.relapseHistory;
export async function readRelapseHistory(): Promise<RelapseHistory> {
  return (await readAccountJSON<RelapseHistory>(RELAPSE_HISTORY_KEY)) ?? { hist: [], qSeen: [] };
}
export function writeRelapseHistory(h: RelapseHistory) {
  return writeAccountJSON(RELAPSE_HISTORY_KEY, h);
}

/** A message split as the canvas splits it: the first sentence, then the rest. */
function paras(t: string): [string, string] {
  const s = t.split(/(?<=[.!?][’”]?)\s+(?=[A-Z‘“])/);
  return s.length > 1 ? [s[0], s.slice(1).join(' ')] : [t, ''];
}

/** An entry's drawing: its theme's, by the message's place in the theme. */
function artFor(message: string | undefined): string {
  const m = message ? MSG_BY[message] : undefined;
  const arts = m ? RELAPSE_ART[m[1]] : RELAPSE_ART.general;
  return arts[(m ? THEME_IX[m[0]] : 0) % arts.length];
}

// ── type ────────────────────────────────────────────────────────────────────

const ink = mono.ink;
const t = (w: '400' | '700', size: number, lh: number | undefined, color: string, ls = 0): TextStyle => ({ ...sans(w), fontSize: size, lineHeight: lh, ...tracking(ls), color });
const S = {
  h1: t('700', 26, 33, ink, -0.6),
  row: t('400', 16, 22, ink),
  rowSub: t('700', 13, 18, mono.mute),
  sub: t('400', 15, 22, mono.mute),
  chip: t('400', 15, 22, ink),
  cta: t('700', 16, undefined, mono.onInk, 0.1),
  ghost: t('400', 15, undefined, mono.mute),
  err: t('400', 14, 20, ink),
  lead: t('700', 22, 30, ink, -0.3),
  body: t('400', 16, 25, mono.sub),
  quote: t('700', 17, 25, ink),
  author: t('700', 13, 16, mono.mute, 0.2),
  logTitle: t('700', 32, 38, ink, -0.6),
  logCaps: t('700', 13, 18, mono.mute),
  logRowT: t('700', 15, 21, ink),
  logRowM: t('400', 14, 20, mono.mute),
  sheetCancel: t('400', 16, undefined, mono.mute),
  sheetTitle: t('700', 17, undefined, ink, -0.2),
  sheetDone: t('700', 16, undefined, ink),
  month: t('700', 15, 20, ink),
  wd: t('700', 12, 16, ctaOff.text),
};

function W({ s, w, children, center }: { s: TextStyle; w: number; children: string; center?: boolean }) {
  return (
    <WrapText style={s} w={w} align={center ? 'center' : 'left'}>
      {children}
    </WrapText>
  );
}

// ── pieces ──────────────────────────────────────────────────────────────────

function Art({ k, cal, w, h }: { k?: string; cal?: boolean; w: number; h: number }) {
  return cal ? (
    <VizArt markup={RELAPSE_CALENDAR.markup} viewBox={RELAPSE_CALENDAR.viewBox} w={w} h={h} />
  ) : (
    <VizArt markup={SOS_VIZ[k ?? ''] ?? ''} viewBox={SOS_VIZ_BOX[k ?? ''] ?? '0 40 393 172'} w={w} h={h} />
  );
}

function Nav({ marks, backHidden, closeHidden, onBack, onClose }: { marks: number; backHidden?: boolean; closeHidden?: boolean; onBack: () => void; onClose: () => void }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 58, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, zIndex: 5, pointerEvents: 'box-none' }}>
      <Tap label="Back" disabled={backHidden} onPress={onBack} style={{ width: 44, height: 44, justifyContent: 'center', paddingLeft: 4, opacity: backHidden ? 0 : 1 }}>
        <Svg width={12} height={20} viewBox="0 0 12 20">
          <Path d="M10 2L2 10l8 8" fill="none" stroke={ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Tap>
      {marks ? (
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ width: 24, height: 2, borderRadius: 1, backgroundColor: i <= marks ? ink : mono.line }} />
          ))}
        </View>
      ) : null}
      <Tap label="Close" disabled={closeHidden} onPress={onClose} style={{ width: 44, height: 44, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 4, opacity: closeHidden ? 0 : 1 }}>
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Path d="M2 2l14 14M16 2L2 16" fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </Tap>
    </View>
  );
}

function Cta({ label, off, onPress, spin }: { label: string; off?: boolean; onPress: () => void; spin?: boolean }) {
  return (
    <Tap onPress={onPress} aria-disabled={off ? true : undefined} style={{ height: 58, borderRadius: 29, backgroundColor: off ? ctaOff.fill : ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      {spin ? <Spinner /> : null}
      <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={[S.cta, { color: off ? ctaOff.text : mono.onInk }]}>
        {label}
      </Text>
    </Tap>
  );
}

/** `Saving…`'s spinner: 16, a 2px `rgba(17,17,17,0.25)` ring with a `#111111` top, one turn in 0.8 s, linear. */
function Spinner() {
  const [turn] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const a = Animated.loop(Animated.timing(turn, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: true }));
    a.start();
    return () => a.stop();
  }, [turn]);
  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: alpha.onInk(0.25), borderTopColor: mono.onInk, transform: [{ rotate }] }} />;
}

function Ghost({ label, onPress, hidden }: { label: string; onPress: () => void; hidden?: boolean }) {
  return (
    <Tap onPress={onPress} disabled={hidden} style={{ marginTop: 5, height: 44, alignItems: 'center', justifyContent: 'center', opacity: hidden ? 0 : 1 }}>
      <Text maxFontSizeMultiplier={1.3} style={S.ghost}>{label}</Text>
    </Tap>
  );
}

function ErrGlyph() {
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20">
      <Circle cx={10} cy={10} r={8.2} fill="none" stroke={ink} strokeWidth={1.6} />
      <Path d="M10 5.6v5.4" fill="none" stroke={ink} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={10} cy={14.2} r={1.1} fill={ink} />
    </Svg>
  );
}

/** An option row: `min-height 60, r18, padding 11 18 11 20, gap 14`; ink when chosen. */
function Row({ label, sub, on, chev, onPress }: { label: string; sub?: string; on: boolean; chev?: boolean; onPress: () => void }) {
  return (
    <Tap
      accessibilityRole="radio"
      aria-checked={on}
      onPress={onPress}
      style={{ minHeight: 60, borderRadius: 18, backgroundColor: on ? ink : mono.card, flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 11, paddingBottom: 11, paddingLeft: 20, paddingRight: 18 }}>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text maxFontSizeMultiplier={1.3} style={[S.row, { color: on ? mono.onInk : ink }]}>{label}</Text>
        {sub ? <Text maxFontSizeMultiplier={1.3} style={[S.rowSub, { color: on ? mono.onInkMuted : mono.mute }]}>{sub}</Text> : null}
      </View>
      {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: mono.card, flexShrink: 0 }} /> : null}
      {chev ? (
        <Svg width={14} height={14} viewBox="0 0 14 14">
          <Path d="M5 2l5 5-5 5" fill="none" stroke={mono.art} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ) : null}
    </Tap>
  );
}

/** The art band under the rows: fills what the page leaves (at least 130), the drawing at most 220 tall. */
function ArtBand({ children }: { children: (w: number, h: number) => ReactNode }) {
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  return (
    <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minHeight: 130, paddingTop: 28, paddingBottom: 4 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: Math.min(220, e.nativeEvent.layout.height) })}>
        {box ? children(box.w, box.h) : null}
      </View>
    </View>
  );
}

// ── the date-and-time sheet ─────────────────────────────────────────────────

export type SheetState = { d: number; on: boolean; t: number };

const WHEEL_FG = [ink, mono.mute, illus.dim, illus.dim2];

function wStep(sh: SheetState, k: 'h' | 'm' | 'p', n: number): SheetState | null {
  if (!n) return null;
  const H = Math.floor(sh.t / 60);
  const M = sh.t % 60;
  const pm = H >= 12;
  const h12 = H % 12 || 12;
  if (k === 'h') {
    const nh = ((((h12 - 1 + n) % 12) + 12) % 12) + 1;
    return { ...sh, t: ((nh % 12) + (pm ? 12 : 0)) * 60 + M };
  }
  if (k === 'm') return { ...sh, t: H * 60 + ((((Math.round(M / 5) + n) % 12) + 12) % 12) * 5 };
  if (n > 0 === pm) return null;
  return { ...sh, t: (sh.t + (n > 0 ? 720 : -720) + 1440) % 1440 };
}

/** One column of the time wheel: 64 wide, 200 tall, rows 40 apart round the centre at 80. */
function Wheel({ k, sh, onChange, align }: { k: 'h' | 'm' | 'p'; sh: SheetState; onChange: (next: SheetState) => void; align: 'right' | 'left' | 'center' }) {
  const H = Math.floor(sh.t / 60);
  const M = sh.t % 60;
  const pm = H >= 12;
  const h12 = H % 12 || 12;
  const items: { t: string; y: number; a: number }[] = [];
  for (let j = -3; j <= 3; j++) {
    let txt: string;
    if (k === 'h') txt = String(((((h12 - 1 + j) % 12) + 12) % 12) + 1);
    else if (k === 'm') txt = pad2(((((Math.round(M / 5) + j) % 12) + 12) % 12) * 5);
    else {
      const i = (pm ? 1 : 0) + j;
      if (i < 0 || i > 1) continue;
      txt = i ? 'pm' : 'am';
    }
    items.push({ t: txt, y: 80 + j * 40, a: Math.abs(j) });
  }
  const live = useRef({ sh, onChange });
  useEffect(() => {
    live.current = { sh, onChange };
  });
  const [dy] = useState(() => new Animated.Value(0));
  /** the drag's distance already turned into whole rows */
  const base = useRef(0);
  // The builder only stores these callbacks; they run on gesture events, never
  // during render — which is what the refs rule cannot see through.
  /* eslint-disable react-hooks/refs */
  const pan = useMemo(() => {
    return Gesture.Pan()
      .runOnJS(true)
      .onStart(() => {
        base.current = 0;
      })
      .onUpdate((e) => {
        let d = e.translationY - base.current;
        while (d <= -20) {
          const n = wStep(live.current.sh, k, 1);
          if (!n) {
            d = Math.max(d, -16);
            break;
          }
          live.current.sh = n;
          live.current.onChange(n);
          base.current -= 40;
          d += 40;
        }
        while (d >= 20) {
          const n = wStep(live.current.sh, k, -1);
          if (!n) {
            d = Math.min(d, 16);
            break;
          }
          live.current.sh = n;
          live.current.onChange(n);
          base.current += 40;
          d -= 40;
        }
        dy.setValue(d);
      })
      .onEnd(() => {
        Animated.timing(dy, { toValue: 0, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
      });
  }, [k, dy]);
  /* eslint-enable react-hooks/refs */
  const tap = (y: number) => {
    const n = wStep(sh, k, Math.round((y - 100) / 40));
    if (n) onChange(n);
  };
  return (
    <GestureDetector gesture={pan}>
      <Pressable onPress={(e) => tap(e.nativeEvent.locationY)} style={{ width: 64, height: 200, marginLeft: k === 'p' ? 8 : 0 }}>
        <Animated.View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, transform: [{ translateY: dy }] }}>
          {items.map((it) => (
            <View
              key={`${it.y}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: it.y,
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: align === 'right' ? 'flex-end' : align === 'left' ? 'flex-start' : 'center',
                paddingRight: align === 'right' ? 10 : 0,
                paddingLeft: align === 'left' ? 10 : 0,
              }}>
              <Text maxFontSizeMultiplier={1} style={{ ...sans(it.a ? '400' : '700'), fontSize: it.a ? 20 : 24, color: WHEEL_FG[it.a], fontVariant: k === 'p' ? undefined : ['tabular-nums'] }}>{it.t}</Text>
            </View>
          ))}
        </Animated.View>
      </Pressable>
    </GestureDetector>
  );
}

function DateSheet({ sh, now, onChange, onCancel, onUse }: { sh: SheetState; now: number; onChange: (next: SheetState) => void; onCancel: () => void; onUse: () => void }) {
  const nm = minutesOf(now);
  const fut = sh.d === 0 && sh.on && sh.t > nm;
  const base = new Date(`${dayISO(now)}T12:00:00`);
  const at = (o: number) => {
    const x = new Date(base);
    x.setDate(x.getDate() + o);
    return x;
  };
  const sd = at(sh.d);
  const ws = sh.d - ((sd.getDay() + 6) % 7);
  return (
    <>
      <Pressable onPress={onCancel} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: alpha.black(0.6), zIndex: 40 }} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: mono.card, paddingTop: 10, paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: illus.dim2 }} />
        <View style={{ marginTop: 6, height: 44, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <Tap onPress={onCancel} style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 4, paddingRight: 12 }}>
              <Text maxFontSizeMultiplier={1.3} style={S.sheetCancel}>Cancel</Text>
            </Tap>
          </View>
          <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={[S.sheetTitle, { marginHorizontal: 8 }]}>Date and time</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Tap onPress={onUse} aria-disabled={fut ? true : undefined} style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 12, paddingRight: 4 }}>
              <Text maxFontSizeMultiplier={1.3} style={[S.sheetDone, { color: fut ? mono.art : ink }]}>Done</Text>
            </Tap>
          </View>
        </View>
        <View style={{ marginTop: 14, height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingLeft: 4 }}>
          <Text maxFontSizeMultiplier={1.3} numberOfLines={1} style={S.month}>{`${MONTH_LONG[sd.getMonth()]} ${sd.getFullYear()}`}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Tap label="Earlier week" onPress={() => ws - 1 >= -60 && onChange({ ...sh, d: Math.max(-60, sh.d - 7) })} style={{ width: 44, height: 40, alignItems: 'center', justifyContent: 'center', opacity: ws - 1 >= -60 ? 1 : 0.3 }}>
              <Svg width={9} height={15} viewBox="0 0 10 16">
                <Path d="M8 2L2 8l6 6" fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Tap>
            <Tap label="Later week" onPress={() => ws + 7 <= 0 && onChange({ ...sh, d: Math.min(0, sh.d + 7) })} style={{ width: 44, height: 40, alignItems: 'center', justifyContent: 'center', opacity: ws + 7 <= 0 ? 1 : 0.3 }}>
              <Svg width={9} height={15} viewBox="0 0 10 16">
                <Path d="M2 2l6 6-6 6" fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Tap>
          </View>
        </View>
        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const o = ws + i;
            const ok = o <= 0 && o >= -60;
            const on = o === sh.d;
            const td = o === 0;
            return (
              <Pressable key={i} disabled={!ok} onPress={() => sh.d !== o && onChange({ ...sh, d: o })} style={{ width: 44, alignItems: 'center', gap: 8 }}>
                <Text maxFontSizeMultiplier={1.3} style={S.wd}>{'MTWTFSS'[i]}</Text>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: on ? ink : 'transparent', boxShadow: td && !on ? `inset 0 0 0 1.5px ${illus.dim}` : undefined, alignItems: 'center', justifyContent: 'center' }}>
                  <Text maxFontSizeMultiplier={1.3} style={{ ...sans(on || td ? '700' : '400'), fontSize: 16, lineHeight: 20, color: on ? mono.onInk : ok ? ink : '#4A4741', fontVariant: ['tabular-nums'] }}>{String(at(o).getDate())}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{ marginTop: 20, height: 1, backgroundColor: mono.line }} />
        <Pressable onPress={() => onChange({ ...sh, on: !sh.on })} accessibilityRole="switch" aria-checked={sh.on} style={{ marginTop: 4, minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ gap: 2 }}>
            <Text maxFontSizeMultiplier={1.3} style={S.row}>Add a time</Text>
            <Text maxFontSizeMultiplier={1.3} style={S.rowSub}>Optional</Text>
          </View>
          <View style={{ width: 50, height: 30, borderRadius: 15, backgroundColor: sh.on ? ink : illus.dim2, flexShrink: 0 }}>
            <View style={{ position: 'absolute', top: 3, left: sh.on ? 23 : 3, width: 24, height: 24, borderRadius: 12, backgroundColor: sh.on ? mono.card : mono.mute }} />
          </View>
        </Pressable>
        {sh.on ? (
          <View style={{ marginTop: 6, height: 200, flexDirection: 'row', justifyContent: 'center', overflow: 'hidden' }}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 80, height: 40, borderRadius: 12, backgroundColor: mono.line }} />
            <Wheel k="h" sh={sh} onChange={onChange} align="right" />
            <View style={{ width: 12, height: 200, alignItems: 'center', justifyContent: 'center', paddingBottom: 3 }}>
              <Text maxFontSizeMultiplier={1} style={{ ...sans('700'), fontSize: 22, color: ink }}>:</Text>
            </View>
            <Wheel k="m" sh={sh} onChange={onChange} align="left" />
            <Wheel k="p" sh={sh} onChange={onChange} align="center" />
            <LinearGradient pointerEvents="none" colors={[mono.card, alpha.card(0)]} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 56 }} />
            <LinearGradient pointerEvents="none" colors={[alpha.card(0), mono.card]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 56 }} />
          </View>
        ) : null}
        {fut ? (
          <View style={{ marginTop: 12, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <ErrGlyph />
            <Text maxFontSizeMultiplier={1.3} style={S.err}>That time hasn’t happened yet.</Text>
          </View>
        ) : null}
      </View>
    </>
  );
}

// ── the flow ────────────────────────────────────────────────────────────────

export type RelapsePage = 'when' | 'led' | 'watch' | 'enc';
export type RelapseDraft = { when: string | null; cd: number; ct: number | null; causes: string[]; watch: string | null };
export const blankDraft = (): RelapseDraft => ({ when: null, cd: 0, ct: null, causes: [], watch: null });

/** The saved entry this run is writing: the event and what it holds. */
export type SavedEntry = { id: string; record: RelapseRecord; createdAt: number };

export type RelapseStore = {
  /** write a new relapse; resolves to the event's id */
  create: (record: RelapseRecord, createdAt: number) => Promise<string | undefined>;
  /** change a saved one */
  update: (id: string, record: RelapseRecord, createdAt: number) => Promise<void>;
};

/** The moment an entry names: its day at its time; a day without a time at noon, but never later than now. */
export function momentOf(r: RelapseRecord, now: number): number {
  if (!r.date) return now;
  const d = new Date(`${r.date}T00:00:00`);
  if (r.time != null) return d.getTime() + r.time * 60000;
  return Math.min(d.getTime() + 12 * 3600000, now);
}

export function draftFromRecord(r: RelapseRecord, now: number): RelapseDraft {
  return { when: r.when, cd: r.when === 'custom' && r.date ? diffDays(r.date, now) : 0, ct: r.when === 'custom' ? (r.time ?? null) : null, causes: [...r.causes], watch: r.watch ?? null };
}

export function RelapseFlow({
  now,
  ctx,
  store,
  history,
  onHistory,
  initial,
  onExit,
  onClose,
}: {
  now: number;
  ctx: RelapseCtx;
  store: RelapseStore;
  history: RelapseHistory;
  onHistory: (h: RelapseHistory) => void;
  /** where the flow opens (the dev harness, or an entry reopened from the log) */
  initial?: { page?: RelapsePage; draft?: Partial<RelapseDraft>; sheet?: SheetState | null; saved?: SavedEntry | null; saving?: boolean; saveErr?: boolean; forced?: { msg: string; quote?: string | null } };
  /** Done on the message: on to the relapse log */
  onExit: () => void;
  /** ✕ */
  onClose: () => void;
}) {
  const [page, setPage] = useState<RelapsePage>(initial?.page ?? 'when');
  const [draft, setDraft] = useState<RelapseDraft>(() => ({ ...blankDraft(), ...initial?.draft }));
  const [sheet, setSheet] = useState<SheetState | null>(initial?.sheet ?? null);
  const [saved, setSaved] = useState<SavedEntry | null>(initial?.saved ?? null);
  const [saving, setSaving] = useState(Boolean(initial?.saving));
  const [saveErr, setSaveErr] = useState(Boolean(initial?.saveErr));
  const [lastSkip, setLastSkip] = useState(false);
  const nm = minutesOf(now);
  // The canvas's small phone (667 tall) and larger text (`zoom: 1.25`) drop the
  // pages' drawings and shrink the message's to 124 (D22).
  const { height, fontScale } = useWindowDimensions();
  const roomy = height > 700 && fontScale < 1.2;

  const fromDraft = (skip: boolean): RelapseRecord => {
    const e = saved?.record;
    let date: string | undefined;
    let time: number | undefined;
    if (e && e.when === draft.when && draft.when !== 'custom') {
      date = e.date;
      time = e.time;
    } else if (draft.when === 'now') {
      date = dayISO(now);
      time = nm;
    } else if (draft.when === 'today') date = dayISO(now);
    else if (draft.when === 'yesterday') date = dayISO(now, -1);
    else if (draft.when === 'custom') {
      date = dayISO(now, draft.cd);
      time = draft.ct ?? undefined;
    }
    return { ...(e ?? {}), when: draft.when ?? 'unsure', date, time, approx: draft.when === 'now', causes: skip ? [] : [...draft.causes].sort(), skipped: skip };
  };
  const dirty = (skip: boolean) => {
    const e = saved?.record;
    if (!e) return true;
    const n = fromDraft(skip);
    return n.when !== e.when || n.date !== e.date || n.time !== e.time || Boolean(n.skipped) !== Boolean(e.skipped) || n.causes.join() !== e.causes.join();
  };

  const save = (skip: boolean) => {
    if (saving) return;
    setLastSkip(skip);
    if (saved && !dirty(skip)) {
      setSaveErr(false);
      setPage('watch');
      return;
    }
    setSaving(true);
    setSaveErr(false);
    const record = fromDraft(skip);
    const createdAt = momentOf(record, now);
    const write = saved ? store.update(saved.id, record, createdAt).then(() => saved.id) : store.create(record, createdAt);
    write
      .then((id) => {
        if (!id) throw new Error('no id');
        setSaved({ id, record, createdAt });
        setSaving(false);
        setPage('watch');
      })
      .catch(() => {
        setSaving(false);
        setSaveErr(true);
      });
  };

  const toEnc = (watch: string | null) => {
    if (!saved) return;
    const base = { ...saved.record, watch: watch ?? undefined };
    const { record, history: h } = assignMessage(saved.id, base, ctx, now, history, initial?.forced);
    setDraft((d) => ({ ...d, watch }));
    setSaved({ ...saved, record });
    onHistory(h);
    void store.update(saved.id, record, saved.createdAt).catch((error) => {
      if (__DEV__) console.warn('the relapse message was not written', error);
    });
    setPage('enc');
  };

  const back = () => {
    if (saving) return;
    setSaveErr(false);
    if (page === 'led') setPage('when');
    else if (page === 'watch') {
      if (saved) setDraft({ ...draftFromRecord(saved.record, now), watch: draft.watch });
      setPage('led');
    } else if (page === 'enc') setPage('watch');
  };

  let body: ReactNode = null;
  const marks = { when: 1, led: 2, watch: 3, enc: 0 }[page];

  if (page === 'when') {
    body = (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: 34, paddingHorizontal: 24, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
          <W s={S.h1} w={345}>When did it happen?</W>
          <View style={{ height: 22 }} />
          <View style={{ gap: 12 }}>
            {RELAPSE_WHEN.map(([k, l]) => {
              const on = draft.when === k;
              const isC = k === 'custom';
              const sub = isC && on ? dayLabel(dayISO(now, draft.cd), now) + (draft.ct !== null ? ` · ${fmtTime(draft.ct)}` : '') : '';
              return (
                <Row
                  key={k}
                  label={l}
                  sub={sub}
                  on={on}
                  chev={isC && !on}
                  onPress={() => {
                    if (isC) {
                      const c = draft.when === 'custom';
                      setSheet({ d: c ? draft.cd : 0, on: c && draft.ct !== null, t: c && draft.ct !== null ? draft.ct : Math.floor(nm / 5) * 5 });
                    } else setDraft((d) => ({ ...d, when: k }));
                  }}
                />
              );
            })}
          </View>
          {roomy ? <ArtBand>{(w, h) => <Art cal w={w} h={h} />}</ArtBand> : null}
        </ScrollView>
        <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
          <Cta label="Continue" off={!draft.when} onPress={() => draft.when && setPage('led')} />
        </View>
      </View>
    );
  } else if (page === 'led') {
    const has = draft.causes.length > 0;
    const clean = Boolean(saved) && !dirty(false);
    const label = saving ? 'Saving…' : saveErr ? 'Retry' : clean ? 'Continue' : saved ? 'Save changes' : 'Save and continue';
    const ready = saving || saveErr || clean || has;
    body = (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 34, paddingHorizontal: 24, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          <W s={S.h1} w={345}>What led up to it?</W>
          <Text maxFontSizeMultiplier={1.3} style={[S.sub, { marginTop: 8 }]}>Select all that apply.</Text>
          <View style={{ height: 20 }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, opacity: saving ? 0.5 : 1 }}>
            {RELAPSE_CAUSES.map(([k, l]) => {
              const on = draft.causes.includes(k);
              return (
                <Tap
                  key={k}
                  accessibilityRole="checkbox"
                  aria-checked={on}
                  disabled={saving}
                  onPress={() =>
                    setDraft((d) => {
                      if (k === 'notsure') return { ...d, causes: d.causes.includes('notsure') ? [] : ['notsure'] };
                      const x = d.causes.filter((c) => c !== 'notsure');
                      return { ...d, causes: x.includes(k) ? x.filter((c) => c !== k) : [...x, k] };
                    })
                  }
                  style={{ minHeight: 48, maxWidth: '100%', flexShrink: 0, borderRadius: 24, backgroundColor: on ? ink : mono.card, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 13, paddingHorizontal: 20 }}>
                  {on ? (
                    <Svg width={13} height={13} viewBox="0 0 14 14">
                      <Path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke={mono.onInk} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  ) : null}
                  <Text maxFontSizeMultiplier={1.3} style={[S.chip, { color: on ? mono.onInk : ink }]}>{l}</Text>
                </Tap>
              );
            })}
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 24, paddingBottom: 47 }}>
          {saveErr ? (
            <View style={{ marginBottom: 16, paddingHorizontal: 2, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <View style={{ marginTop: 1 }}>
                <ErrGlyph />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <W s={S.err} w={313}>Couldn’t save this entry. Your answers are still here. Check your connection, then try again.</W>
              </View>
            </View>
          ) : null}
          <Cta
            label={label}
            off={!ready}
            spin={saving}
            onPress={() => {
              if (saving) return;
              if (saveErr) return save(lastSkip);
              if (!draft.causes.length && !clean) return;
              save(false);
            }}
          />
          <Ghost label="Skip" hidden={saving} onPress={() => save(true)} />
        </View>
      </View>
    );
  } else if (page === 'watch') {
    body = (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: 34, paddingHorizontal: 24, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
          <W s={S.h1} w={345}>Do you feel like watching again right now?</W>
          <View style={{ height: 22 }} />
          <View style={{ gap: 12 }}>
            {RELAPSE_WATCH.map(([k, l]) => (
              <Row key={k} label={l} on={draft.watch === k} onPress={() => setDraft((d) => ({ ...d, watch: d.watch === k ? null : k }))} />
            ))}
          </View>
          {roomy ? <ArtBand>{(w, h) => <Art k="phoneTable" w={w} h={h} />}</ArtBand> : null}
        </ScrollView>
        <View style={{ paddingHorizontal: 24, paddingBottom: 47 }}>
          <Cta label="Continue" off={!draft.watch} onPress={() => draft.watch && toEnc(draft.watch)} />
          <Ghost label="Skip" onPress={() => toEnc(null)} />
        </View>
      </View>
    );
  } else if (page === 'enc') {
    const r = saved?.record;
    const m = r?.message ? MSG_BY[r.message] : undefined;
    const [lead, rest] = paras(m ? m[3] : '');
    const q = r?.quote ? Q_BY[r.quote] : undefined;
    body = (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: 8, paddingHorizontal: 24, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <View style={{ marginVertical: 'auto' }}>
            <View style={{ height: roomy ? 210 : 124, alignItems: 'center', justifyContent: 'center' }}>
              <Art k={artFor(r?.message)} w={345} h={roomy ? 210 : 124} />
            </View>
            <View style={{ marginTop: 28, gap: 14 }}>
              <W s={S.lead} w={345}>{lead}</W>
              {rest ? <W s={S.body} w={345}>{rest}</W> : null}
            </View>
            {q ? (
              <View style={{ marginTop: 28, paddingTop: 22, borderTopWidth: 1, borderTopColor: mono.line, gap: 8 }}>
                <W s={S.quote} w={345}>{q[1]}</W>
                <Text maxFontSizeMultiplier={1.3} style={S.author}>{q[2]}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
          <Cta label="Done" onPress={onExit} />
        </View>
      </View>
    );
  }

  return (
    <Screen>
      <Nav marks={marks} backHidden={page === 'when'} onBack={back} onClose={onClose} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 102, bottom: 0 }}>{body}</View>
      {/* the sheet and its scrim cover the whole frame, the nav row included */}
      {page === 'when' && sheet ? (
        <DateSheet
          sh={sheet}
          now={now}
          onChange={setSheet}
          onCancel={() => setSheet(null)}
          onUse={() => {
            if (sheet.d === 0 && sheet.on && sheet.t > nm) return;
            setDraft((d) => ({ ...d, when: 'custom', cd: sheet.d, ct: sheet.on ? sheet.t : null }));
            setSheet(null);
          }}
        />
      ) : null}
    </Screen>
  );
}

/** `05 · Back in the app` — the relapse log. */
export function RelapseLog({ entries, now, onOpen, onNew }: { entries: TidelineEvent[]; now: number; onOpen: (e: TidelineEvent) => void; onNew: () => void }) {
  return (
    <Screen>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 102, bottom: 0 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 6, paddingHorizontal: 24, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          <Text maxFontSizeMultiplier={1.3} style={S.logTitle}>Your log</Text>
          <Text maxFontSizeMultiplier={1.3} style={[S.logCaps, { marginTop: 28 }]}>Relapses</Text>
          <View style={{ marginTop: 4 }}>
            {entries.map((e) => {
              const r = recordOf(e);
              return (
                <Tap key={e._id} onPress={() => onOpen(e)} style={{ minHeight: 72, borderBottomWidth: 1, borderBottomColor: mono.line, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                    <Text maxFontSizeMultiplier={1.3} style={S.logRowT}>{entryTitle(r, now)}</Text>
                    <W s={S.logRowM} w={317}>{entryMeta(r)}</W>
                  </View>
                  <Svg width={14} height={14} viewBox="0 0 14 14">
                    <Path d="M5 2l5 5-5 5" fill="none" stroke={mono.art} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </Tap>
              );
            })}
          </View>
          {entries.length ? null : <Text maxFontSizeMultiplier={1.3} style={[S.sub, { marginTop: 4 }]}>Nothing logged yet.</Text>}
        </ScrollView>
        <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
          <Cta label="Log a relapse" onPress={onNew} />
        </View>
      </View>
    </Screen>
  );
}

const LABEL_CAUSE: Record<string, string> = Object.fromEntries(RELAPSE_CAUSES.map(([k, l]) => [l, k]));

/**
 * A lapse event as a relapse record. Entries from this flow carry their own;
 * older lapses (the post-slip flow, the urge log) are read from their moment
 * and the words they were filed with.
 */
export function recordOf(e: TidelineEvent): RelapseRecord {
  if (e.relapse) return e.relapse;
  const causes = (e.trigger ?? '').split(' · ').map((l) => LABEL_CAUSE[l]).filter((k): k is string => !!k);
  return { when: 'custom', date: isoOf(new Date(e.createdAt)), time: minutesOf(e.createdAt), causes, skipped: !e.trigger };
}
