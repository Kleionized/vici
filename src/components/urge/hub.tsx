/**
 * The urge hub — `UrgeHub`, behind `/urge-hub`: 85A–85E, five panes on the
 * dark board, and 85F, the breathing board its Breathe pill opens (with the
 * tap and odd-one-out stages after it, from `stages.tsx`).
 *
 * Shell (sos-flow §3.17): the kit's `dark` Screen (`#111111`, `noise-dark` @
 * 0.09), the nav's "Ride it out" and ✕, each pane's head at 160, the pager's
 * 6-pt dots at `bottom 180`, the white "Breathe" pill at `bottom 96` and "I
 * slipped" at 60, and "Help" — the way to Find support — in the nav's left
 * slot (D467). The panes page sideways; each scrolls on its own only when a
 * short phone cannot hold it above the dots (D320).
 *
 * The hub rides a real urge (deploy WP5, D460): its ring is the live
 * session's clock and survives the app closing; riding it out — the three
 * stages run to their end, the twenty minutes up, or leaving after the ring
 * has run a minute — writes one `urge_rode_out`, with the chip as its trigger.
 */

import { useFocusEffect, useRouter } from 'expo-router';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';

import { GhostLink, MonoText, NavBar, PagerDots, PledgeCard, PrimaryButton, Screen, Tap } from '@/components/mono';
import { INTENSITY_BANDS } from '@/components/ui/IntensityBands';
import { useCreateEvent, useCurrentUser, useEvents, useJournalEntries } from '@/lib/backend';
import { lastNDateKeys, toDateKey } from '@/lib/date';
import { isSlip, isSurfed, programmeStartKey } from '@/lib/day';
import { clockTime, countOf, daysAgo, minutesWords, WEEKDAYS_SHORT } from '@/lib/format';
import { ACCOUNT_KEYS, readAccountJSON, writeAccountJSON } from '@/lib/accountState';
import { mono, monoDark, ring, sans } from '@/lib/theme';
import type { TidelineEvent } from '@/lib/types';
import { clearUrgeSession, newUrgeSession, openUrgeSession, SAME_URGE_WINDOW_MS, saveUrgeSession, slipLoggedSince, type UrgeSession } from '@/lib/urgeSession';
import { pledgeText, standingPledge } from '@/lib/pledge';

import {
  BAND_LIFT,
  BreatheStage,
  CanvasBand,
  DarkHead,
  DEFAULT_SOS_SETTINGS,
  OddStage,
  readSosSettings,
  SOS_ORDER,
  SOS_SETTINGS_KEY,
  SosSettingsSheet,
  SupportDoor,
  TapStage,
  UrgeRing,
  useBandBottom,
  useStepBack,
  type SosSettings,
} from './stages';

// ════════ WHAT THE PANES READ ═══════════════════════════════════════════════

/**
 * The ring is the app's own same-urge window: the arc is what is left of its
 * twenty minutes and the clock counts it down (D066). The frame draws 17:42
 * against a 62 % arc; no single moment draws both, and the clock is kept
 * (D257).
 */
const hubRemaining = (elapsedMs: number) => Math.max(0, SAME_URGE_WINDOW_MS - elapsedMs);

function hubClock(remainingMs: number): string {
  const s = Math.round(remainingMs / 1000);
  return `${Math.floor(s / 60)}:${`${s % 60}`.padStart(2, '0')}`;
}

/**
 * How long the ring must have run before closing the hub counts as riding
 * the urge out (F1, D460). Under a minute the user has looked at the hub, not
 * ridden anything: closing then just ends the session.
 */
const RIDE_MIN_MS = 60 * 1000;

/** `Thu, 3:10 pm` — the frame's comma and its lower-case meridiem. */
function hubWhen(ms: number): string {
  return `${WEEKDAYS_SHORT[new Date(ms).getDay()]}, ${clockTime(ms, { lower: true })}`;
}

interface HubUrge {
  at: number;
  seconds: number;
  severity?: number;
  /** What got the user through, as stored — absent when nothing was recorded. */
  helped?: string;
}

/** A day on 85B's grid: kept, slipped, or before the programme began (not the user's to have kept). */
type HubDay = 'held' | 'slip' | 'before';

interface HubStats {
  /** Every rode-out urge that carries a recorded length, newest first. */
  timed: HubUrge[];
  ridden: number;
  /** The last 30 days, oldest first. */
  days: HubDay[];
  /** Whether the programme's first day is known yet — until it is, no day is counted. */
  counted: boolean;
  slips: TidelineEvent[];
}

/**
 * Everything the panes read, out of the event log. A slip is `isSlip` — a
 * lapse or an urge acted on, the one rule every screen counts by — and a day
 * is clean when neither landed in it. Days before the programme's first day
 * (`src/lib/day.ts`) are nobody's to have kept: they are drawn faint and not
 * counted (S4, D460).
 */
function hubStats(events: TidelineEvent[] | undefined, start: string | null): HubStats {
  const log = events ?? [];
  const ridden = log.filter(isSurfed);
  const slips = log.filter(isSlip).sort((a, b) => b.createdAt - a.createdAt);
  const timed: HubUrge[] = ridden
    .filter((e) => typeof e.durationSeconds === 'number' && e.durationSeconds > 0)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((e) => ({
      at: e.createdAt,
      seconds: e.durationSeconds as number,
      severity: e.severity,
      // only what was recorded: a row with nothing stored says nothing (P4, D460)
      helped: e.whatHelped?.trim() || undefined,
    }));
  const slipKeys = new Set(slips.map((e) => toDateKey(new Date(e.createdAt))));
  const days = lastNDateKeys(30).map((k): HubDay => (start == null || k < start ? 'before' : slipKeys.has(k) ? 'slip' : 'held'));
  return { timed, ridden: ridden.length, days, counted: start != null, slips };
}

const minutesOf = (seconds: number) => Math.max(1, Math.round(seconds / 60));

/** A pane's last block reports the canvas y it ends at, for the short-phone lift (D258). */
type OnBottom = (y: number) => void;
const endsAt = (top: number, onBottom?: OnBottom) => (onBottom ? (e: LayoutChangeEvent) => onBottom(top + Math.ceil(e.nativeEvent.layout.height)) : undefined);

// ════════ 85A · Right now ════════════════════════════════════════════════════

/**
 * The three chips the canvas draws under the ring, verbatim — the hub's own
 * words, not the pickers'; the one chosen is kept on the session and filed
 * as the urge's trigger when it is logged, where the trigger charts read it
 * (F1). The frame draws none chosen, which is where the hub starts (CRITIC
 * §5); a chosen chip takes the white fill and `#111111` words (D258).
 */
const HUB_CHIPS = ['Bored', 'Relationship', 'Work or school'];

function HubChip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Tap
      onPress={onPress}
      accessibilityRole="radio"
      aria-checked={on}
      hitSlop={{ top: 4, bottom: 4 }}
      style={{
        height: 36,
        borderRadius: 18,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: on ? monoDark.text : mono.card,
        boxShadow: on ? undefined : ring.chipDark,
      }}>
      <MonoText v="pill" color={on ? mono.onInk : monoDark.text}>
        {label}
      </MonoText>
    </Tap>
  );
}

/** 85A's chips at 546; on a short phone they may close up on the ring to 16 under the marker's lowest point (270 + 223). */
const CHIPS_TOP = 546;
const CHIPS_TUCK = CHIPS_TOP - (270 + 223 + 16);

/**
 * 85A. The frame's head — "Get out of bed." — is its sample moment, said to
 * everyone at any hour in any place; the hub knows neither, so its head is
 * the part that holds anywhere (P4, D460): change where you are, and the
 * frame's own line under it.
 *
 * Once the urge is logged as ridden out (`passedSeconds`) the pane goes
 * quiet: the ring empties, its clock shows how long the urge ran and the line
 * under it says it passed, the head says it is logged, and the chips — filed
 * with the event already — are put away (D460).
 */
function HubNow({
  elapsedMs,
  chip,
  onChip,
  passedSeconds,
  tuck = 0,
}: {
  elapsedMs: number;
  chip: number | null;
  onChip: (i: number) => void;
  passedSeconds: number | null;
  tuck?: number;
}) {
  if (passedSeconds != null) {
    return (
      <>
        <DarkHead title="It passed." body="Logged as ridden out. Stay here as long as you need." />
        <UrgeRing fraction={0} clock={hubClock(passedSeconds * 1000)} label="It passed" />
      </>
    );
  }
  const remaining = hubRemaining(elapsedMs);
  return (
    <>
      <DarkHead title="Change where you are." body="Stand up. Move somewhere with light." />
      <UrgeRing fraction={remaining / SAME_URGE_WINDOW_MS} clock={hubClock(remaining)} label="Until it passes" />
      <View accessibilityRole="radiogroup" style={{ position: 'absolute', left: 0, right: 0, top: CHIPS_TOP - tuck, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {HUB_CHIPS.map((label, i) => (
          <HubChip key={label} label={label} on={chip === i} onPress={() => onChip(i)} />
        ))}
      </View>
    </>
  );
}

// ════════ 85B · Last 30 days (the frame's "Recovery score"; no number here) ═════

/**
 * "This one is strong. None this strong has lasted past forty minutes." — the
 * live urge's band, in `INTENSITY_BANDS`' words, and the longest ridden-out
 * urge at that strength or stronger, in words. With nothing that strong on
 * record the second sentence is left out (D257).
 *
 * The first sentence is only said when the user rated this urge (the SOS asks;
 * the hub does not). Unrated, the line is the record alone — "None has lasted
 * past forty minutes." — or nothing (P4, D460).
 */
function scoreLine(severity: number | undefined, timed: HubUrge[]): string | undefined {
  if (severity == null) {
    if (!timed.length) return undefined;
    const longest = minutesOf(Math.max(...timed.map((u) => u.seconds)));
    return `None has lasted past ${minutesWords(longest, { capital: false })}.`;
  }
  const band = Math.min(4, Math.max(0, Math.round((severity - 2) / 2)));
  const word = INTENSITY_BANDS[band].label.toLowerCase();
  const strong = timed.filter((u) => (u.severity ?? 0) >= severity);
  const first = `This one is ${word}.`;
  if (!strong.length) return first;
  const longest = minutesOf(Math.max(...strong.map((u) => u.seconds)));
  return `${first} None this ${word} has lasted past ${minutesWords(longest, { capital: false })}.`;
}

/** A day before the programme: a faint ring, so the grid keeps its shape without claiming the day. */
const BEFORE_RING = `0 0 0 1px ${monoDark.chipRing}`;

function HubScore({ severity, stats, onBottom }: { severity?: number; stats: HubStats; onBottom?: OnBottom }) {
  const clean = stats.days.filter((d) => d === 'held').length;
  const slipped = stats.days.filter((d) => d === 'slip').length;
  return (
    <>
      <DarkHead title="You’re riding a wave." body={scoreLine(severity, stats.timed)} />
      <View onLayout={endsAt(276, onBottom)} style={{ position: 'absolute', left: 24, right: 24, top: 276 }}>
        <View style={{ borderRadius: 24, backgroundColor: mono.card, paddingVertical: 20, paddingHorizontal: 22, gap: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <MonoText v="caps" color="rgba(255,255,255,0.5)">
              Last 30 days
            </MonoText>
            <MonoText v="pill" color={monoDark.text}>
              {stats.counted ? `${clean} clean, ${countOf(slipped, 'slip')}` : ''}
            </MonoText>
          </View>
          {/* three rows of ten `flex: 1` dots — where CSS's `repeat(10, 1fr)` puts them, at any width */}
          <View style={{ gap: 10 }}>
            {[0, 10, 20].map((row) => (
              <View key={row} style={{ flexDirection: 'row', gap: 10 }}>
                {stats.days.slice(row, row + 10).map((day, i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      borderRadius: 999,
                      backgroundColor: day === 'held' ? monoDark.text : 'transparent',
                      boxShadow: day === 'held' ? undefined : day === 'slip' ? ring.outlineDark : BEFORE_RING,
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

// ════════ 85C · Your proof ═══════════════════════════════════════════════════

/**
 * The count of urges ridden out, and the last twelve timed ones as 12-wide
 * pills, oldest to latest, the **longest** in white. Heights are `96 · s /
 * longest` from the unrounded seconds (the frame's are not whole minutes),
 * never under 12 so the radius-6 pill stays whole.
 */
function HubProof({ stats, onBottom }: { stats: HubStats; onBottom?: OnBottom }) {
  const last = stats.timed.slice(0, 12).reverse();
  const peak = last.length ? Math.max(...last.map((u) => u.seconds)) : 0;
  const peakAt = last.findIndex((u) => u.seconds === peak);
  return (
    <>
      <DarkHead title="Every urge so far has ended." />
      <View onLayout={last.length ? undefined : endsAt(274, onBottom)} style={{ position: 'absolute', left: 24, right: 24, top: 274, gap: 10, alignItems: 'center' }}>
        <MonoText v="statValue" center color={monoDark.text} style={{ lineHeight: 68 }}>
          {String(stats.ridden)}
        </MonoText>
        <MonoText v="pTight" center wrap="nowrap" color="rgba(255,255,255,0.55)">
          {stats.ridden === 1 ? 'Urge ridden out' : 'Urges ridden out'}
        </MonoText>
      </View>
      {last.length ? (
        <View onLayout={endsAt(410, onBottom)} style={{ position: 'absolute', left: 32, right: 32, top: 410, gap: 12 }}>
          <View style={{ height: 96, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 10 }}>
            {last.map((u, i) => (
              <View
                key={u.at}
                style={{ width: 12, height: Math.max(12, Math.round((96 * u.seconds) / peak)), borderRadius: 6, backgroundColor: i === peakAt ? monoDark.text : monoDark.dotOff }}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {['Oldest', `Longest: ${minutesOf(peak)} min`, 'Latest'].map((t) => (
              <MonoText key={t} v="pill" wrap="nowrap" color="rgba(255,255,255,0.55)" style={{ fontSize: 12, lineHeight: 15 }}>
                {t}
              </MonoText>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}

// ════════ 85D · Surfed before ════════════════════════════════════════════════

/**
 * 85D's card at 270; on a short phone it may close up on its head, to 12 under
 * it — the head's own title-to-line gap (D258). At 375 × 667 the card needs 63
 * of the 65 that leaves, and the whole card then shows without a scroll.
 */
const CARD_TOP = 270;
const cardTuckMax = (headH: number) => Math.max(0, CARD_TOP - (160 + headH + 12));

/**
 * The last four, in one card: when, how long, a 6-pt track filled against the
 * longest of the four, and what got you through, in sentence case as stored.
 * `tuck` raises the card toward the head (never the head itself); `onHead`
 * reports the head's height, which bounds it.
 */
function HubSurfed({ stats, onBottom, onHead, tuck = 0 }: { stats: HubStats; onBottom?: OnBottom; onHead?: (h: number) => void; tuck?: number }) {
  const rows = stats.timed.slice(0, 4);
  const peak = rows.length ? Math.max(...rows.map((r) => minutesOf(r.seconds))) : 1;
  const t15 = { ...sans('700'), fontSize: 15, lineHeight: 18 };
  return (
    <>
      <DarkHead
        title="You’ve outlasted this before."
        onHeight={(h) => {
          onHead?.(Math.ceil(h));
          if (!rows.length) onBottom?.(160 + Math.ceil(h));
        }}
      />
      {rows.length ? (
        // the pane's bottom is measured from the drawn top, so the tuck never feeds back into itself
        <View onLayout={endsAt(CARD_TOP, onBottom)} style={{ position: 'absolute', left: 24, right: 24, top: CARD_TOP - tuck }}>
          <View style={{ borderRadius: 24, backgroundColor: mono.card, paddingTop: 22, paddingHorizontal: 22, paddingBottom: 24, gap: 22 }}>
            {rows.map((row) => {
              const min = minutesOf(row.seconds);
              return (
                <View key={row.at} style={{ gap: 9 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <MonoText v="rowLabel" color={monoDark.text} style={t15}>
                      {hubWhen(row.at)}
                    </MonoText>
                    <MonoText v="rowLabel" color={monoDark.text} style={t15}>
                      {`${min} min`}
                    </MonoText>
                  </View>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: monoDark.chipRing }}>
                    <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.round((min / peak) * 100)}%`, borderRadius: 3, backgroundColor: monoDark.text }} />
                  </View>
                  {row.helped ? (
                    <MonoText v="pill" wrap="wrap" color={monoDark.body} style={sans('400')}>
                      {row.helped}
                    </MonoText>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </>
  );
}

// ════════ 85E · Your pledge ══════════════════════════════════════════════════

/**
 * "Signed 14 days ago. Kept every day since." — the second sentence only while
 * no slip has landed after the signing (D259).
 */
function pledgeLine(signedAt: number, now: number, slips: TidelineEvent[]): string {
  const n = daysAgo(signedAt, now);
  const signed = n <= 0 ? 'Signed today.' : n === 1 ? 'Signed yesterday.' : `Signed ${n} days ago.`;
  return slips.some((e) => e.createdAt > signedAt) ? signed : `${signed} Kept every day since.`;
}

/**
 * With no pledge signed there is no card: the pane used to quote the
 * designer's line as the user's own signed words (D460).
 */
function HubPledge({ name, pledge, line, onBottom }: { name?: string; pledge: string | null; line?: string; onBottom?: OnBottom }) {
  return (
    <>
      <DarkHead title="Your pledge." gap={20} />
      <View onLayout={endsAt(238, onBottom)} style={{ position: 'absolute', left: 24, right: 24, top: 238, gap: 12 }}>
        {pledge ? <PledgeCard variant="quote" tone="dark" pledge={pledge} name={name} /> : null}
        {line ? (
          <MonoText v="pTight" center wrap="pretty" color={monoDark.body} style={{ paddingTop: 6 }}>
            {line}
          </MonoText>
        ) : null}
      </View>
    </>
  );
}

// ════════ THE HUB ════════════════════════════════════════════════════════════

/**
 * The canvas y each pane's content reaches at 393 — until the pane has
 * measured its own (text wraps longer on a narrower phone); 85A's is fixed:
 * the chips' 546 + 36, and their 1-pt ring, which a band fitted flush to the
 * chips' box would clip.
 */
const PANE_BOTTOM = [546 + 36 + 1, 431, 533, 612, 493];
/** 85A's ring: its box at canvas 270, 240 tall — where the pane ends once its chips are put away. */
const RING_TOP = 270;
const RING_BOX = 240;
/** The dots' row top (`bottom 180`, 6 tall) and 16 clear of it. */
const PANE_CONTROLS = 180 + 6 + 16;

/**
 * `85A–85F`. Five panes, one shell, and the two ways out the canvas draws: the
 * white "Breathe" pill (85F, then the tap and odd-one-out stages, then back to
 * the panes) and "I slipped" (the slip flow, D147) — and the way to a person,
 * "Help".
 *
 * On a phone too short for a pane above the dots (D258, D320) the panes first
 * rise — heads and all, by at most `BAND_LIFT`, all five by the same amount so
 * the heads stay on one line as they slide past each other — then 85A's chips
 * close up on the ring and 85D's card on its head, and only what still does
 * not fit scrolls. At 393 × 852 no pane moves.
 */
export function UrgeHub() {
  const router = useRouter();
  const events = useEvents();
  const user = useCurrentUser();
  const journal = useJournalEntries();
  const createEvent = useCreateEvent();
  const { width } = useWindowDimensions();
  const [pane, setPane] = useState(0);
  /** A horizontal `ScrollView` gives its pages no height, so the pager's own is measured. */
  const [pageHeight, setPageHeight] = useState(0);
  const pager = useRef<ScrollView>(null);
  const [chip, setChip] = useState<number | null>(null);
  const [session, setSession] = useState<UrgeSession | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [sos, setSos] = useState(false);
  const [sosStage, setSosStage] = useState(0);
  const [settings, setSettings] = useState<SosSettings>(DEFAULT_SOS_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bottoms, setBottoms] = useState(PANE_BOTTOM);
  /** 85D's head — one line (33) at every width the frames' copy has been checked at, until measured. */
  const [surfedHead, setSurfedHead] = useState(33);
  const bandBottom = useBandBottom(PANE_CONTROLS);
  /** How long the urge ran, once it is logged as ridden out — 85A's quiet state. */
  const [passed, setPassed] = useState<number | null>(null);

  /**
   * Where this urge stands, read by the clock, the close and the unmount
   * alike: `live` while it runs; `logged` once ridden out; `slipped` while the
   * slip flow is open over the hub; `left` when the hub has gone.
   */
  const ended = useRef<'live' | 'logged' | 'slipped' | 'left'>('live');
  const sessionRef = useRef<UrgeSession | null>(null);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);
  /** Which `begin` is current; an earlier one's storage answer is dropped. 0 until the first. */
  const run = useRef(0);
  /** When "I slipped" opened the slip flow, and what the urge was then — what an unlogged return goes back to. */
  const slipAt = useRef(0);
  const slippedFrom = useRef<'live' | 'logged'>('live');

  /**
   * The urge this hub is riding: the live one if there is one (the ring picks
   * up its own clock — F1, D460), else a new one, saved at once so closing the
   * app does not restart the ring. One whose twenty minutes ran out while the
   * app was closed is not resumed into an instant "It passed": a fresh one starts.
   *
   * The urge before it is let go first, so until storage answers the clock,
   * the close and the ring have no urge to count: an old session must not be
   * logged as waited out, or as ridden out on a close, in that gap (D460).
   */
  const begin = useCallback(() => {
    const mine = ++run.current;
    ended.current = 'live';
    sessionRef.current = null;
    setSession(null);
    setPassed(null);
    setChip(null);
    setNow(Date.now());
    // a hub left before storage answered must not leave the session it just saved behind
    const gone = () => {
      if (ended.current === 'left') void clearUrgeSession();
      return ended.current !== 'live' || run.current !== mine;
    };
    void openUrgeSession('hub').then(async (stored) => {
      if (gone()) return;
      let s = stored;
      if (Date.now() - s.startedAt >= SAME_URGE_WINDOW_MS) {
        s = newUrgeSession('hub');
        await saveUrgeSession(s);
      }
      if (gone()) return;
      setSession(s);
      const at = s.trigger ? HUB_CHIPS.indexOf(s.trigger) : -1;
      setChip(at >= 0 ? at : null);
    });
  }, []);

  /**
   * On focus: the first time, the urge begins. Back from the slip flow, it
   * depends on whether a slip was logged. If one was, the urge ended in it and
   * a new one starts (98F's "I’m already watching again" means exactly that).
   * If the flow was left without logging ("Not now", ✕, back), nothing ended:
   * the same urge rides on, ring, chip and all, or 85A stays quiet if it had
   * already passed. A ring that ran out while the slip flow was open is not
   * logged as waited out, since the user said they slipped; a new one starts (D460).
   */
  useFocusEffect(
    useCallback(() => {
      if (run.current === 0) {
        begin();
        return;
      }
      if (ended.current !== 'slipped') return;
      if (slipLoggedSince(slipAt.current)) {
        begin();
        return;
      }
      if (slippedFrom.current === 'logged') {
        ended.current = 'logged';
        return;
      }
      const held = sessionRef.current;
      if (held && Date.now() - held.startedAt < SAME_URGE_WINDOW_MS) {
        ended.current = 'live';
        setNow(Date.now());
      } else begin();
    }, [begin]),
  );

  useEffect(() => {
    void readAccountJSON<Partial<SosSettings>>(SOS_SETTINGS_KEY).then((stored) => {
      if (stored) setSettings(readSosSettings(stored));
    });
  }, []);

  /**
   * The urge, written as ridden out — once (F1, D460). The hub's chip is its
   * trigger, the ring's run its length (never past the window), and "what got
   * you through" only what the hub saw: the three stages run to their end, or
   * the twenty minutes waited out. A strength is filed only if the user gave
   * one (an SOS session the hub picked up). The screen never waits for the
   * write (D465). Returns the length, or null when nothing was written.
   */
  const rideOut = useCallback(
    (how: 'stages' | 'clock' | 'closed'): number | null => {
      const s = sessionRef.current;
      if (!s || ended.current !== 'live') return null;
      ended.current = 'logged';
      const seconds = Math.max(1, Math.min(SAME_URGE_WINDOW_MS / 1000, Math.round((Date.now() - s.startedAt) / 1000)));
      void createEvent({
        type: 'urge_rode_out',
        severity: s.severity,
        trigger: s.trigger,
        durationSeconds: seconds,
        whatHelped: how === 'stages' ? 'Breathing, number tap and odd one out' : how === 'clock' ? 'Waited out the timer' : undefined,
        reopens: s.reopens ? s.reopens : undefined,
      }).catch((error) => {
        if (__DEV__) console.warn('urge_rode_out (hub) was not written', error);
      });
      void writeAccountJSON(ACCOUNT_KEYS.postPending, Date.now());
      void clearUrgeSession();
      return seconds;
    },
    [createEvent],
  );

  /**
   * Leaving the hub — ✕, a swipe back, Android's back alike, so it runs as the
   * hub unmounts: an urge the ring has run on for a minute or more was ridden
   * out; a shorter look just ends the session, so it never silences the
   * launch arrivals afterwards.
   */
  const rideOutRef = useRef(rideOut);
  useEffect(() => {
    rideOutRef.current = rideOut;
  }, [rideOut]);
  useEffect(
    () => () => {
      const s = sessionRef.current;
      if (ended.current === 'live' && s && Date.now() - s.startedAt >= RIDE_MIN_MS) rideOutRef.current('closed');
      // live, or handed to a slip flow that is going with the hub: nobody is riding it now
      if (ended.current === 'live' || ended.current === 'slipped') void clearUrgeSession();
      ended.current = 'left';
    },
    [],
  );

  // The ring's clock. At 0:00 the twenty minutes are up: the urge is logged as
  // waited out and 85A goes quiet (D460).
  useEffect(() => {
    const clock = setInterval(() => {
      const t = Date.now();
      setNow(t);
      const s = sessionRef.current;
      if (s && ended.current === 'live' && hubRemaining(t - s.startedAt) <= 0) {
        const seconds = rideOutRef.current('clock');
        if (seconds != null) setPassed(seconds);
      }
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  const stats = hubStats(events, programmeStartKey(user));
  const pledge = standingPledge(journal);
  const elapsed = session ? Math.max(0, now - session.startedAt) : 0;
  const first = user?.displayName?.split(' ')[0];

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  /**
   * "I slipped": the urge is held, not counted, while the slip flow is open.
   * Its session stays saved, because only a logged slip ends it (the slip
   * flow's save clears it); leaving that flow without logging comes back to
   * the same urge (D460).
   */
  const slip = () => {
    if (ended.current !== 'slipped') {
      slippedFrom.current = ended.current === 'logged' ? 'logged' : 'live';
      ended.current = 'slipped';
    }
    slipAt.current = Date.now();
    router.push('/slip');
  };
  const goToPane = (index: number) => {
    setPane(index);
    pager.current?.scrollTo({ x: index * width, animated: true });
  };
  const bottomOf = (index: number) => (y: number) => setBottoms((current) => (current[index] === y ? current : current.map((v, i) => (i === index ? y : v))));

  function pickChip(index: number) {
    setChip(index);
    if (session && ended.current === 'live') {
      const next = { ...session, trigger: HUB_CHIPS[index] };
      setSession(next);
      void saveUrgeSession(next);
    }
  }

  function saveSettings(next: SosSettings) {
    setSettings(next);
    void writeAccountJSON(SOS_SETTINGS_KEY, next);
  }

  const endStages = () => {
    setSos(false);
    setSosStage(0);
    setSettingsOpen(false);
  };
  // Android's back inside the stages returns to the panes, as the back chevron does (F2)
  useStepBack(endStages, sos);

  if (sos) {
    const stage = SOS_ORDER[sosStage];
    // The hub's own ring is the clock, so the fourth stage — the 90-second
    // ring — has nothing to add here: finishing the third returns to the
    // panes, with the urge logged as ridden out (F1).
    const advance = () => {
      const next = sosStage + 1;
      if (next >= SOS_ORDER.length || SOS_ORDER[next] === 'wave') {
        const seconds = rideOut('stages');
        if (seconds != null) setPassed(seconds);
        endStages();
      } else setSosStage(next);
    };
    const stageProps = {
      ctx: 'hub' as const,
      settings,
      onClose: close,
      onEnd: endStages,
      onDone: advance,
      onSlip: slip,
      onBack: endStages,
      // the old hub drew the sheet over every stage, so a round ending under it does not close it
      overlay: <SosSettingsSheet open={settingsOpen} settings={settings} onChange={saveSettings} onDone={() => setSettingsOpen(false)} />,
    };
    if (stage === 'tap') return <TapStage {...stageProps} dots={{ count: 3, active: 1 }} />;
    if (stage === 'odd') return <OddStage {...stageProps} dots={{ count: 3, active: 2 }} />;
    // the gear the old hub's breathing stage had: one tap from the hub, as before (D256)
    return <BreatheStage {...stageProps} onSettings={() => setSettingsOpen(true)} />;
  }

  // 85A ends at the ring's box once the chips are put away
  const bottomsNow = passed != null ? [RING_TOP + RING_BOX, ...bottoms.slice(1)] : bottoms;
  // what each pane lacks above the dots on this screen, and what it does about it: one lift for the
  // pager (a pane that fits rises with the others, so no head jumps mid-swipe), then each pane's own tuck
  const deficit = bottomsNow.map((b) => Math.max(0, b - bandBottom));
  const lift = Math.min(BAND_LIFT, Math.max(...deficit));
  const tuck = [passed != null ? 0 : Math.min(CHIPS_TUCK, deficit[0] - lift), 0, 0, Math.min(cardTuckMax(surfedHead), deficit[3] - lift), 0].map((t) => Math.max(0, t));

  const pledgeWords = pledgeText(pledge);
  const panes: ReactNode[] = [
    <HubNow key="now" elapsedMs={elapsed} chip={chip} onChip={pickChip} passedSeconds={passed} tuck={tuck[0]} />,
    <HubScore key="score" severity={session?.severity} stats={stats} onBottom={bottomOf(1)} />,
    <HubProof key="proof" stats={stats} onBottom={bottomOf(2)} />,
    <HubSurfed key="surfed" stats={stats} onBottom={bottomOf(3)} onHead={(h) => setSurfedHead((current) => (current === h ? current : h))} tuck={tuck[3]} />,
    <HubPledge
      key="pledge"
      pledge={pledgeWords || null}
      name={first ?? 'You'}
      line={pledge ? pledgeLine(pledge.createdAt, now, stats.slips) : 'No pledge signed yet.'}
      onBottom={bottomOf(4)}
    />,
  ];

  return (
    <Screen variant="dark">
      {/* the panes move under a fixed shell. The page index comes off `onScroll`:
          `onMomentumScrollEnd` never fires in the web build (D065). */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}>
        <ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => setPane(Math.round(event.nativeEvent.contentOffset.x / Math.max(1, width)))}
          // The pager remounts when Breathe hands back to the panes, and opens on
          // the first; put it back on the pane the dots still mark.
          onContentSizeChange={() => {
            if (pane > 0) pager.current?.scrollTo({ x: pane * width, animated: false });
          }}
          style={{ flex: 1 }}>
          {panes.map((node, i) => (
            <View key={i} style={{ width, height: pageHeight }}>
              <CanvasBand controls={PANE_CONTROLS} height={bottomsNow[i] - tuck[i]} lift={lift}>
                {node}
              </CanvasBand>
            </View>
          ))}
        </ScrollView>
      </View>
      <NavBar tone="dark" left="empty" centre={{ title: 'Ride it out' }} right="close" onClose={close} />
      <SupportDoor />
      <PagerDots active={pane} onChange={goToPane} />
      <PrimaryButton label="Breathe" onPress={() => setSos(true)} bottom={96} tone="dark" />
      <GhostLink label="I slipped" onPress={slip} tone="dark" />
    </Screen>
  );
}
