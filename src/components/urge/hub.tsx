/**
 * The urge hub — `UrgeHub`, behind `/urge-hub`: 85A–85E, five panes on the
 * dark board, and 85F, the breathing board its Breathe pill opens (with the
 * tap and odd-one-out stages after it, from `stages.tsx`).
 *
 * Shell (sos-flow §3.17): the kit's `dark` Screen (`#111111`, `noise-dark` @
 * 0.09), the nav's "Ride it out" and ✕, each pane's head at 160, the pager's
 * 6-pt dots at `bottom 180`, the white "Breathe" pill at `bottom 96` and "I
 * slipped" at 60. The panes page sideways; each scrolls on its own only when a
 * short phone cannot hold it above the dots (D320).
 */

import { useRouter } from 'expo-router';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';

import { GhostLink, MonoText, NavBar, PagerDots, PledgeCard, PrimaryButton, Screen, Tap } from '@/components/mono';
import { bandToSeverity, INTENSITY_BANDS } from '@/components/ui/IntensityBands';
import { useCurrentUser, useEvents, useJournalEntries } from '@/lib/backend';
import { lastNDateKeys, toDateKey } from '@/lib/date';
import { clockTime, countOf, daysAgo, minutesWords, WEEKDAYS_SHORT } from '@/lib/format';
import { getJSON, setJSON } from '@/lib/storage';
import { mono, monoDark, ring, sans } from '@/lib/theme';
import type { EventType, TidelineEvent } from '@/lib/types';
import { loadUrgeSession, newUrgeSession, SAME_URGE_WINDOW_MS, saveUrgeSession, type UrgeSession } from '@/lib/urgeSession';

import {
  BAND_LIFT,
  BreatheStage,
  CanvasBand,
  DarkHead,
  DEFAULT_SOS_SETTINGS,
  OddStage,
  SOS_ORDER,
  SOS_SETTINGS_KEY,
  SosSettingsSheet,
  TapStage,
  UrgeRing,
  useBandBottom,
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

/** `Thu, 3:10 pm` — the frame's comma and its lower-case meridiem. */
function hubWhen(ms: number): string {
  return `${WEEKDAYS_SHORT[new Date(ms).getDay()]}, ${clockTime(ms, { lower: true })}`;
}

interface HubUrge {
  at: number;
  seconds: number;
  severity?: number;
  helped: string;
}

interface HubStats {
  /** Every rode-out urge that carries a recorded length, newest first. */
  timed: HubUrge[];
  ridden: number;
  /** The last 30 days, oldest first; `true` = no slip that day. */
  days: boolean[];
  slips: TidelineEvent[];
}

const HUB_SLIP: EventType[] = ['lapse', 'urge_acted_on'];

/**
 * Everything the panes read, out of the event log. A slip is a `lapse` or an
 * `urge_acted_on` — the pair `today.tsx` marks a day with — and a day is clean
 * when neither landed in it.
 */
function hubStats(events: TidelineEvent[] | undefined): HubStats {
  const log = events ?? [];
  const ridden = log.filter((e) => e.type === 'urge_rode_out');
  const slips = log.filter((e) => HUB_SLIP.includes(e.type)).sort((a, b) => b.createdAt - a.createdAt);
  const timed: HubUrge[] = ridden
    .filter((e) => typeof e.durationSeconds === 'number' && e.durationSeconds > 0)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((e) => ({
      at: e.createdAt,
      seconds: e.durationSeconds as number,
      severity: e.severity,
      // what every ridden-out urge has in common, in the frame's own words
      helped: e.whatHelped ?? 'Waited out the timer',
    }));
  const slipKeys = new Set(slips.map((e) => toDateKey(new Date(e.createdAt))));
  const days = lastNDateKeys(30).map((k) => !slipKeys.has(k));
  return { timed, ridden: ridden.length, days, slips };
}

const minutesOf = (seconds: number) => Math.max(1, Math.round(seconds / 60));

/** A pane's last block reports the canvas y it ends at, for the short-phone lift (D258). */
type OnBottom = (y: number) => void;
const endsAt = (top: number, onBottom?: OnBottom) => (onBottom ? (e: LayoutChangeEvent) => onBottom(top + Math.ceil(e.nativeEvent.layout.height)) : undefined);

// ════════ 85A · Right now ════════════════════════════════════════════════════

/**
 * The three chips the canvas draws under the ring, verbatim — the hub's own
 * words, not the pickers'; the one chosen is filed on the session as its
 * trigger. The frame draws none chosen, which is where the hub starts (CRITIC
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

function HubNow({ elapsedMs, chip, onChip, tuck = 0 }: { elapsedMs: number; chip: number | null; onChip: (i: number) => void; tuck?: number }) {
  const remaining = hubRemaining(elapsedMs);
  return (
    <>
      <DarkHead title="Get out of bed." body="Stand up. Move somewhere with light." />
      <UrgeRing fraction={remaining / SAME_URGE_WINDOW_MS} clock={hubClock(remaining)} label="Until it passes" />
      <View accessibilityRole="radiogroup" style={{ position: 'absolute', left: 0, right: 0, top: CHIPS_TOP - tuck, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {HUB_CHIPS.map((label, i) => (
          <HubChip key={label} label={label} on={chip === i} onPress={() => onChip(i)} />
        ))}
      </View>
    </>
  );
}

// ════════ 85B · Recovery score ═══════════════════════════════════════════════

/**
 * "This one is strong. None this strong has lasted past forty minutes." — the
 * live urge's band, in `INTENSITY_BANDS`' words, and the longest ridden-out
 * urge at that strength or stronger, in words. With nothing that strong on
 * record the second sentence is left out (D257).
 */
function scoreLine(severity: number, timed: HubUrge[]): string {
  const band = Math.min(4, Math.max(0, Math.round((severity - 2) / 2)));
  const word = INTENSITY_BANDS[band].label.toLowerCase();
  const strong = timed.filter((u) => (u.severity ?? 0) >= severity);
  const first = `This one is ${word}.`;
  if (!strong.length) return first;
  const longest = minutesOf(Math.max(...strong.map((u) => u.seconds)));
  return `${first} None this ${word} has lasted past ${minutesWords(longest, { capital: false })}.`;
}

function HubScore({ severity, stats, onBottom }: { severity: number; stats: HubStats; onBottom?: OnBottom }) {
  const clean = stats.days.filter(Boolean).length;
  const slipped = stats.days.length - clean;
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
              {`${clean} clean, ${countOf(slipped, 'slip')}`}
            </MonoText>
          </View>
          {/* three rows of ten `flex: 1` dots — where CSS's `repeat(10, 1fr)` puts them, at any width */}
          <View style={{ gap: 10 }}>
            {[0, 10, 20].map((row) => (
              <View key={row} style={{ flexDirection: 'row', gap: 10 }}>
                {stats.days.slice(row, row + 10).map((held, i) => (
                  <View
                    key={i}
                    style={{ flex: 1, aspectRatio: 1, borderRadius: 999, backgroundColor: held ? monoDark.text : 'transparent', boxShadow: held ? undefined : ring.outlineDark }}
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
                  <MonoText v="pill" wrap="wrap" color={monoDark.body} style={sans('400')}>
                    {row.helped}
                  </MonoText>
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

function HubPledge({ name, pledge, line, onBottom }: { name?: string; pledge: string; line?: string; onBottom?: OnBottom }) {
  return (
    <>
      <DarkHead title="Your pledge." gap={20} />
      <View onLayout={endsAt(238, onBottom)} style={{ position: 'absolute', left: 24, right: 24, top: 238, gap: 12 }}>
        <PledgeCard variant="quote" tone="dark" pledge={pledge} name={name} />
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
/** The dots' row top (`bottom 180`, 6 tall) and 16 clear of it. */
const PANE_CONTROLS = 180 + 6 + 16;

/**
 * `85A–85F`. Five panes, one shell, and the two ways out the canvas draws: the
 * white "Breathe" pill (85F, then the tap and odd-one-out stages, then back to
 * the panes) and "I slipped" (the slip flow, D147).
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

  useEffect(() => {
    // The hub is opened during an urge, so it resumes the live session rather
    // than starting one — the ring is that session's own clock.
    void loadUrgeSession().then((stored) => setSession(stored ?? newUrgeSession(bandToSeverity(3))));
    void getJSON<SosSettings>(SOS_SETTINGS_KEY).then((stored) => {
      if (stored) setSettings({ ...DEFAULT_SOS_SETTINGS, ...stored });
    });
  }, []);

  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(clock);
  }, []);

  const stats = hubStats(events);
  const pledge = (journal ?? []).find((entry) => entry.tag === 'Pledge');
  const elapsed = session ? Math.max(0, now - session.startedAt) : 0;
  const severity = session?.peakSeverity ?? bandToSeverity(3);
  const first = user?.displayName?.split(' ')[0];

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const slip = () => router.push('/slip');
  const goToPane = (index: number) => {
    setPane(index);
    pager.current?.scrollTo({ x: index * width, animated: true });
  };
  const bottomOf = (index: number) => (y: number) => setBottoms((current) => (current[index] === y ? current : current.map((v, i) => (i === index ? y : v))));

  function pickChip(index: number) {
    setChip(index);
    if (session) {
      const next = { ...session, trigger: HUB_CHIPS[index] };
      setSession(next);
      void saveUrgeSession(next);
    }
  }

  function saveSettings(next: SosSettings) {
    setSettings(next);
    void setJSON(SOS_SETTINGS_KEY, next);
  }

  if (sos) {
    const stage = SOS_ORDER[sosStage];
    const end = () => {
      setSos(false);
      setSosStage(0);
      setSettingsOpen(false);
    };
    // The hub's own ring is the clock, so the fourth stage — the 90-second
    // ring — has nothing to add here: finishing the third returns to the panes.
    const advance = () => {
      const next = sosStage + 1;
      if (next >= SOS_ORDER.length || SOS_ORDER[next] === 'wave') end();
      else setSosStage(next);
    };
    const stageProps = {
      ctx: 'hub' as const,
      settings,
      onClose: close,
      onEnd: end,
      onDone: advance,
      onSlip: slip,
      onBack: end,
      // the old hub drew the sheet over every stage, so a round ending under it does not close it
      overlay: <SosSettingsSheet open={settingsOpen} settings={settings} onChange={saveSettings} onDone={() => setSettingsOpen(false)} />,
    };
    if (stage === 'tap') return <TapStage {...stageProps} dots={{ count: 3, active: 1 }} />;
    if (stage === 'odd') return <OddStage {...stageProps} dots={{ count: 3, active: 2 }} />;
    // the gear the old hub's breathing stage had: one tap from the hub, as before (D256)
    return <BreatheStage {...stageProps} onSettings={() => setSettingsOpen(true)} />;
  }

  // what each pane lacks above the dots on this screen, and what it does about it: one lift for the
  // pager (a pane that fits rises with the others, so no head jumps mid-swipe), then each pane's own tuck
  const deficit = bottoms.map((b) => Math.max(0, b - bandBottom));
  const lift = Math.min(BAND_LIFT, Math.max(...deficit));
  const tuck = [Math.min(CHIPS_TUCK, deficit[0] - lift), 0, 0, Math.min(cardTuckMax(surfedHead), deficit[3] - lift), 0].map((t) => Math.max(0, t));

  const panes: ReactNode[] = [
    <HubNow key="now" elapsedMs={elapsed} chip={chip} onChip={pickChip} tuck={tuck[0]} />,
    <HubScore key="score" severity={severity} stats={stats} onBottom={bottomOf(1)} />,
    <HubProof key="proof" stats={stats} onBottom={bottomOf(2)} />,
    <HubSurfed key="surfed" stats={stats} onBottom={bottomOf(3)} onHead={(h) => setSurfedHead((current) => (current === h ? current : h))} tuck={tuck[3]} />,
    <HubPledge
      key="pledge"
      // with no signed pledge the card keeps the words it always fell back to
      pledge={pledge?.body ?? 'The mornings are mine again.'}
      name={first ?? 'You'}
      line={pledge ? pledgeLine(pledge.createdAt, now, stats.slips) : undefined}
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
              <CanvasBand controls={PANE_CONTROLS} height={bottoms[i] - tuck[i]} lift={lift}>
                {node}
              </CanvasBand>
            </View>
          ))}
        </ScrollView>
      </View>
      <NavBar tone="dark" left="empty" centre={{ title: 'Ride it out' }} right="close" onClose={close} />
      <PagerDots active={pane} onChange={goToPane} />
      <PrimaryButton label="Breathe" onPress={() => setSos(true)} bottom={96} tone="dark" />
      <GhostLink label="I slipped" onPress={slip} tone="dark" />
    </Screen>
  );
}
