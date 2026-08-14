import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { moodLabel } from '@/components/MoodLogger';
import { useTabBarHeight } from '@/components/StoicTabBar';
import { AppText, EmptyState, PressScale } from '@/components/ui';
import { useCheckins, useCurrentUser, useEvents } from '@/lib/backend';
import { SCORE_BASE, SCORE_WEIGHTS } from '@/lib/score';
import { colors, sans } from '@/lib/theme';
import type { DailyCheckin, TidelineEvent } from '@/lib/types';
import { completedWeekStarts, severityWord } from '@/lib/weeklyReport';

// ── the Log tab's one front door (canvas 029) — three cards ask WHAT you're
// capturing and one pill sends you there. Dismissing it uncovers the log
// itself: urges, check-ins and reports (canvas 033–035). ──

const noiseDark = require('../../../assets/images/noise-dark.png');

type Mode = 'chooser' | 'history';

/** The one ink the marks are drawn in, straight off the canvas. */
const INK = '#131313';

/**
 * The canvas grain, at the frame's own 7%. It is painted outside the safe area
 * so it reaches the status bar the way `inset:0` does on the canvas.
 */
function Grain() {
  return <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />;
}

/** Sunrise — the daily check-in. 26 on the chooser card, 16 in a log row. */
function SunriseMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26">
      <Path d="M13 4.5V1.5M6.2 7.6L4.2 5.6M19.8 7.6l2-2" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M6.8 15a6.2 6.2 0 0 1 12.4 0Z" fill={INK} />
      <Path d="M3 15h20M8 19.5h10" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

/** 029's sun, drawn at 30 on a 24 viewBox — a filled core and eight rays. */
function CardSun() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={4.2} fill="#2A2924" />
      <Path
        d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M18.4 5.6l-1.9 1.9M7.5 16.5l-1.9 1.9"
        fill="none"
        stroke="#2A2924"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** 029's crest — the waterline rule is gone, only the wave is left. */
function CardWave() {
  return (
    <Svg width={34} height={22} viewBox="0 0 26 16">
      <Path d="M2 12c4-7 8 3 12-3s8 2 10-2" fill="none" stroke="#2A2924" strokeWidth={2.6} strokeLinecap="round" />
    </Svg>
  );
}

/** 029's crescent, cut in paper against the dark card. */
function CardMoon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24">
      <Path d="M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z" fill="#F4F3F0" />
    </Svg>
  );
}

/**
 * The 150° ramp the chooser cards are cut from. In the card's 281 × 128 box the
 * axis runs through the centre along (sin150, −cos150) = (0.5, 0.866) and its
 * ends sit where the corners project onto a line 281·0.5 + 128·0.866 = 251.4
 * long. Half of that off centre is (62.8, 108.8)pt — ±0.224 of the width and
 * ±0.850 of the height, so both ends fall outside the box, as CSS draws them.
 */
const CARD_GRADIENT_START = { x: 0.276, y: -0.35 };
const CARD_GRADIENT_END = { x: 0.724, y: 1.35 };

type ChooserOption = { key: string; mark: ReactNode; title: string; dark?: boolean; route: string };

const OPTIONS: ChooserOption[] = [
  { key: 'checkin', mark: <CardSun />, title: 'Daily check-in', route: '/checkin' },
  { key: 'urge', mark: <CardWave />, title: 'An urge', route: '/urge-log' },
  { key: 'lapse', mark: <CardMoon />, title: 'A lapse', dark: true, route: '/lapse' },
];

/** Canvas card tops 214 / 356 / 498, each less the 54pt status bar. */
const CARD_TOP = [160, 302, 444];

/**
 * One card. The chosen one wears a 26pt ink pip ringed in paper; the rest carry
 * an empty 24pt ring drawn in whichever ink reads against their own ground.
 */
function ChooserCard({ option, top, selected, onPress }: { option: ChooserOption; top: number; selected: boolean; onPress: () => void }) {
  const dark = option.dark === true;
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={option.title}
      accessibilityState={{ checked: selected }}
      style={{
        position: 'absolute',
        left: 56,
        right: 56,
        top,
        height: 128,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: dark ? '0 10px 24px rgba(19,19,17,0.25)' : 'inset 0 0 0 1px rgba(0,0,0,0.05)',
      }}>
      <LinearGradient
        colors={dark ? ['#33322D', '#131311'] : ['#E9E8E3', '#C9C8C1']}
        start={CARD_GRADIENT_START}
        end={CARD_GRADIENT_END}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View style={{ position: 'absolute', right: 18, top: 16 }}>{option.mark}</View>
      <AppText style={[sans('500'), { position: 'absolute', left: 18, bottom: 16, fontSize: 16.5, color: dark ? '#F4F3F0' : '#1D1C1A' }]}>
        {option.title}
      </AppText>
      {selected ? (
        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 13,
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: INK,
            boxShadow: '0 0 0 2px rgba(244,243,240,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Svg width={12} height={10} viewBox="0 0 14 12">
            <Path d="M2 6.5L5.5 10L12 2.5" fill="none" stroke="#F4F3F0" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 14,
            width: 24,
            height: 24,
            borderRadius: 12,
            boxShadow: dark ? 'inset 0 0 0 2px rgba(244,243,240,0.35)' : 'inset 0 0 0 2px rgba(0,0,0,0.20)',
          }}
        />
      )}
    </PressScale>
  );
}

export default function Log() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('chooser');
  const [picked, setPicked] = useState(0);
  // The canvas gives the chooser the whole 852 frame with no bar drawn, so its
  // pill wants to sit 88 above the frame bottom. The tab bar claims the first
  // 63 + safe-area of that; the pill takes whatever is left over.
  const tabBar = useTabBarHeight();

  if (mode === 'history') return <History onBack={() => setMode('chooser')} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Grain />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <PressScale
            onPress={() => setMode('history')}
            accessibilityLabel="Open log history"
            hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
            style={{ position: 'absolute', right: 20, top: 12, minHeight: 0 }}>
            <Svg width={18} height={18} viewBox="0 0 18 18">
              <Path d="M3 3l12 12M15 3L3 15" fill="none" stroke="#1D1C1A" strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
          </PressScale>

          <AppText center style={[sans('500'), { position: 'absolute', left: 30, right: 30, top: 64, fontSize: 22, lineHeight: 29, color: '#2A2924' }]}>
            What are you logging?
          </AppText>

          {OPTIONS.map((option, index) => (
            <ChooserCard key={option.key} option={option} top={CARD_TOP[index]} selected={picked === index} onPress={() => setPicked(index)} />
          ))}

          <PressScale
            onPress={() => router.push(OPTIONS[picked].route as never)}
            accessibilityRole="button"
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: Math.max(0, 88 - tabBar),
              height: 54,
              minHeight: 0,
              borderRadius: 27,
              backgroundColor: INK,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText style={[sans('600'), { fontSize: 16.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>Continue</AppText>
          </PressScale>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * 033 / 034 / 035 · The log, in three registers.
 *
 * Urges, check-ins and the weekly reports each read differently — an urge is an
 * incident, a check-in is a reading, a report is a verdict — so they get their
 * own lists rather than one merged stream where the shape of a week is
 * impossible to see. Every list is the same 60pt row: a mark on the inset disc,
 * what it was, when, and how it went.
 */

const LOG_TABS = [
  { key: 'urges' as const, label: 'Urges' },
  { key: 'checkins' as const, label: 'Check-ins' },
  { key: 'reports' as const, label: 'Reports' },
];
type LogTab = (typeof LOG_TABS)[number]['key'];

const DAY = 86_400_000;
const WEEK = 7 * DAY;

/** The switch: a sunken track carrying one raised paper pill. */
function LogTabs({ value, onChange }: { value: LogTab; onChange: (key: LogTab) => void }) {
  return (
    <View style={{ height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.06)', flexDirection: 'row', padding: 3 }}>
      {LOG_TABS.map((t) => {
        const on = value === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              backgroundColor: on ? '#FFFFFF' : 'transparent',
              boxShadow: on ? '0 1px 4px rgba(40,38,32,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)' : undefined,
            }}>
            <AppText style={[sans(on ? '600' : '500'), { fontSize: 14, color: on ? '#1D1C1A' : '#8B8882' }]}>{t.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

type LogRowData = { key: string; mark: ReactNode; title: string; when: string; outcome?: string; onPress?: () => void };

/** The list disclosure, drawn small: 6 × 10 out of the 8 × 14 chevron. */
function RowChevron() {
  return (
    <Svg width={6} height={10} viewBox="0 0 8 14">
      <Path d="M1.5 1.5L6.5 7l-5 5.5" fill="none" stroke="#B0AEA8" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * One entry. The hairline belongs to the row that has another below it, so the
 * box is 61 tall there — 60 of content plus the rule — and the 3pt gap after it
 * lands the next row on the canvas's 64pt pitch.
 */
function LogRow({ mark, title, when, outcome, onPress, divider }: Omit<LogRowData, 'key'> & { divider: boolean }) {
  return (
    <PressScale
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={{
        height: divider ? 61 : 60,
        marginBottom: divider ? 3 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        borderBottomWidth: divider ? 1 : 0,
        borderBottomColor: 'rgba(0,0,0,0.05)',
      }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>{mark}</View>
      <View style={{ flex: 1 }}>
        <AppText style={[sans('600'), { fontSize: 14.5, color: '#1D1C1A' }]}>{title}</AppText>
        <AppText style={[sans('400'), { marginTop: 2, fontSize: 12, color: '#8B8882' }]}>{when}</AppText>
      </View>
      {outcome ? <AppText style={[sans('400'), { fontSize: 12.5, color: '#8B8882' }]}>{outcome}</AppText> : null}
      <RowChevron />
    </PressScale>
  );
}

function LogGroup({ label, rows }: { label: string; rows: LogRowData[] }) {
  return (
    <View style={{ marginTop: 24 }}>
      {/* the caption box is exactly the canvas's caption-top to first-row-top */}
      <View style={{ height: 26, paddingLeft: 24 }}>
        <AppText style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>{label}</AppText>
      </View>
      <View style={{ paddingHorizontal: 24 }}>
        {rows.map(({ key, ...row }, i) => (
          <LogRow key={key} {...row} divider={i < rows.length - 1} />
        ))}
      </View>
    </View>
  );
}

/** Empty states sit on the list's own gutter, since the screen is full-bleed. */
function LogEmpty({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ paddingHorizontal: 24 }}>
      <EmptyState title={title} body={body} />
    </View>
  );
}

function History({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const events = useEvents();
  const checkins = useCheckins();
  // The tab bar floats over this screen, so the list has to be able to scroll
  // its last row clear of it rather than ending underneath.
  const tabBar = useTabBarHeight();
  const [tab, setTab] = useState<LogTab>('urges');
  // The clock is read once on mount: re-reading it every render would let the
  // week boundary shift underneath the list while it is on screen.
  const [now] = useState(() => Date.now());

  const urges = (events ?? []).filter((e) => e.type.startsWith('urge') || e.type === 'lapse').sort((a, b) => b.createdAt - a.createdAt);
  const reads = [...(checkins ?? [])].sort((a, b) => (a.date < b.date ? 1 : -1));

  const urgeRow = (event: TidelineEvent): LogRowData => ({
    key: event._id,
    mark: <TriggerGlyph trigger={event.trigger} />,
    title: [event.trigger || 'Urge', event.severity != null ? severityWord(event.severity) : null].filter(Boolean).join(' · '),
    when: whenLabel(event.createdAt, now),
    outcome: outcomeWord(event),
  });

  const readRow = (checkin: DailyCheckin): LogRowData => ({
    key: checkin.date,
    mark: <SunriseMark size={16} />,
    title: [
      checkin.mood != null ? `Mood ${checkin.mood}/5` : 'Check-in',
      checkin.sleepHours != null ? `${checkin.sleepHours}h sleep` : null,
    ]
      .filter(Boolean)
      .join(' · '),
    when: dayWord(dateKeyToMs(checkin.date), now),
    outcome: checkin.mood != null ? (moodLabel(checkin.mood) ?? '').toLowerCase() || undefined : undefined,
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Grain />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabBar }}>
          {/* The chevron, the title and the switch are hand-placed at 10 / 60 /
              114 under the status bar, so the list below starts at exactly 176
              whatever the type metrics do. */}
          <View style={{ height: 152 }}>
            <PressScale
              onPress={onBack}
              accessibilityLabel="Back"
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
              style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <Svg width={11} height={19} viewBox="0 0 11 19">
                <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
            </PressScale>
            <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 60, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
              Your log
            </AppText>
            <View style={{ position: 'absolute', left: 16, right: 16, top: 114 }}>
              <LogTabs value={tab} onChange={setTab} />
            </View>
          </View>

          {tab === 'urges' ? (
            urges.length ? (
              <Grouped items={urges} now={now} at={(e) => e.createdAt} row={urgeRow} />
            ) : (
              <LogEmpty title="No urges logged yet" body="When a wave hits, logging it is what turns it into data." />
            )
          ) : null}

          {tab === 'checkins' ? (
            reads.length ? (
              <Grouped items={reads} now={now} at={(c) => dateKeyToMs(c.date)} row={readRow} />
            ) : (
              <LogEmpty title="No check-ins yet" body="Twenty seconds a day is all it takes." />
            )
          ) : null}

          {tab === 'reports' ? <Reports now={now} onOpen={(week) => router.push(`/weekly-report?week=${week}`)} /> : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/**
 * This week / Last week / Earlier. The canvas only ever draws the first two,
 * but an old log has to land somewhere and a third heading beats a list that
 * silently stops at a fortnight.
 */
function Grouped<T>({ items, now, at, row }: { items: T[]; now: number; at: (item: T) => number; row: (item: T) => LogRowData }) {
  // The clock is frozen at mount, so anything logged while the list is open
  // reads as negative age — it belongs at the top, not nowhere.
  const bucket = (from: number, to: number) =>
    items
      .filter((item) => {
        const age = now - at(item);
        return age >= from && age < to;
      })
      .map(row);
  const groups: { label: string; rows: LogRowData[] }[] = [
    { label: 'This week', rows: bucket(Number.NEGATIVE_INFINITY, WEEK) },
    { label: 'Last week', rows: bucket(WEEK, 2 * WEEK) },
    { label: 'Earlier', rows: bucket(2 * WEEK, Number.POSITIVE_INFINITY) },
  ];
  return (
    <>
      {groups.filter((g) => g.rows.length).map((g) => (
        <LogGroup key={g.label} label={g.label} rows={g.rows} />
      ))}
    </>
  );
}

/** The four marks the canvas draws for a logged urge; the rest get the ring. */
function TriggerGlyph({ trigger }: { trigger?: string }) {
  const name = (trigger ?? '').toLowerCase();
  if (name.includes('night')) {
    return (
      <Svg width={15} height={15} viewBox="0 0 30 30">
        <Path d="M17 3 A11 11 0 1 0 25.5 20 A8.6 8.6 0 1 1 17 3 Z" fill={INK} />
      </Svg>
    );
  }
  if (name.includes('stress') || name.includes('argument')) {
    return (
      <Svg width={14} height={11} viewBox="0 0 14 11">
        <Path d="M1 9.5L5 5l3 3 5-6.5" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (name.includes('home') || name.includes('alone')) {
    return (
      <Svg width={15} height={15} viewBox="0 0 24 24">
        <Path d="M4 11l8-7 8 7" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M6 10v10h12V10" fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      </Svg>
    );
  }
  return <View style={{ width: 12, height: 12, borderRadius: 6, boxShadow: 'inset 0 0 0 3.5px #131313' }} />;
}

/** How it went, in the log's lowercase voice — the outcome the flow recorded. */
const OUTCOME_WORD: Record<string, string> = {
  'Rode it out': 'rode it out',
  'Surfed with the timer': 'surfed the timer',
  'Distracted myself': 'distracted myself',
  'Reached out': 'reached out',
};

function outcomeWord(event: TidelineEvent): string {
  if (event.type === 'lapse') return 'slipped';
  if (event.whatHelped) return OUTCOME_WORD[event.whatHelped] ?? event.whatHelped.toLowerCase();
  return event.type === 'urge_rode_out' ? 'rode it out' : 'acted on it';
}

function dateKeyToMs(date: string): number {
  return new Date(`${date}T00:00:00`).getTime();
}

/** "Today", "Yesterday", the weekday for a fortnight, then the date. */
function dayWord(ms: number, now: number): string {
  const midnight = new Date(now).setHours(0, 0, 0, 0);
  const days = Math.round((midnight - new Date(ms).setHours(0, 0, 0, 0)) / DAY);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 14) return new Date(ms).toLocaleDateString('en-US', { weekday: 'long' });
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** "Tuesday · 11:40 pm" — the canvas writes the meridiem lowercase. */
function whenLabel(ms: number, now: number): string {
  const time = new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  return `${dayWord(ms, now)} · ${time}`;
}

/** 035 · The weekly reports, newest first. */
function Reports({ onOpen, now }: { onOpen: (week: string) => void; now: number }) {
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  if (!user || checkins === undefined || events === undefined) return null;

  const weeks = reportWeeks(user.createdAt, checkins, events, now);
  if (!weeks.length) {
    return <LogEmpty title="No reports yet" body="The first one arrives once a full week has closed." />;
  }

  return (
    <LogGroup
      label="Weekly reports"
      rows={weeks.map((week) => ({
        key: week.key,
        mark: (
          <Svg width={16} height={12} viewBox="0 0 16 13">
            <Path d="M1.5 10.5L6 6l3 2.5L14.5 2.5" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10.8 2.5h3.7V6.2" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ),
        title: week.label,
        when: `Score ${week.score.toLocaleString('en-US')} · ${week.urges} ${week.urges === 1 ? 'urge' : 'urges'} · ${week.relapses} ${week.relapses === 1 ? 'relapse' : 'relapses'}`,
        outcome: week.delta >= 0 ? `+${week.delta}` : `−${Math.abs(week.delta)}`,
        onPress: () => onOpen(week.key),
      }))}
    />
  );
}

type ReportWeek = { key: string; label: string; score: number; urges: number; relapses: number; delta: number };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Jul 14–20", and "Jun 30–Jul 6" when the week straddles a month. */
function weekLabel(startMs: number): string {
  const start = new Date(startMs);
  const end = new Date(startMs + 6 * DAY);
  const head = `${MONTHS[start.getMonth()]} ${start.getDate()}`;
  const tail = start.getMonth() === end.getMonth() ? `${end.getDate()}` : `${MONTHS[end.getMonth()]} ${end.getDate()}`;
  return `${head}–${tail}`;
}

/**
 * Every closed week, newest first, carrying the score as it stood when that
 * week ended. The weights are the score's own, so the ± beside a week is
 * literally what that week moved the number by. Lessons are left out of the
 * weekly figure — completion is timestamped, but a lesson finished late still
 * belongs to the week it was assigned, and guessing that would make the deltas
 * lie about which week earned what.
 */
function reportWeeks(createdAt: number, checkins: DailyCheckin[], events: TidelineEvent[], now: number): ReportWeek[] {
  const oldestFirst = [...completedWeekStarts(createdAt, now)].reverse();
  let running = SCORE_BASE;
  const out: ReportWeek[] = [];
  for (const key of oldestFirst) {
    const start = dateKeyToMs(key);
    const end = start + WEEK;
    const inWeek = events.filter((e) => e.createdAt >= start && e.createdAt < end);
    const urges = inWeek.filter((e) => e.type.startsWith('urge')).length;
    const ridden = inWeek.filter((e) => e.type === 'urge_rode_out').length;
    const relapses = inWeek.filter((e) => e.type === 'lapse').length;
    const reads = checkins.filter((c) => dateKeyToMs(c.date) >= start && dateKeyToMs(c.date) < end).length;
    const delta =
      Math.max(0, 7 - relapses) * SCORE_WEIGHTS.cleanDay +
      reads * SCORE_WEIGHTS.checkin +
      ridden * SCORE_WEIGHTS.urgeRidden +
      relapses * SCORE_WEIGHTS.slip;
    running += delta;
    out.push({ key, label: weekLabel(start), score: running, urges, relapses, delta });
  }
  return out.reverse();
}
