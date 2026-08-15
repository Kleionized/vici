import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useRef, useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { AppText, Grain, LoadingView, PressScale } from '@/components/ui';
import { useEvents } from '@/lib/backend';
import { colors, sans } from '@/lib/theme';
import type { TidelineEvent } from '@/lib/types';

/**
 * 91B · Urge overview — canvas 036 / 037 / 038 / 039.
 *
 * Four readings of the same week — the week's three numbers, what set the urges
 * off, what mood came first, and when and where they landed. The switch at the
 * top names them; they still swipe, under a header that never moves, so the
 * answer to "how was the week" stays put while you look around.
 *
 * Everything here is counted from the log. A week with nothing in it says so
 * rather than inventing a pattern out of three data points.
 *
 * Laid out from the canvas's 393 × 852 frame: every `top` below is the canvas
 * value less the 54pt status bar.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const WEEK = 7 * 86_400_000;

// The bar ramp, darkest first. The canvas gives triggers three tones and the
// mood reading four.
const TRIGGER_TONES = ['#131313', '#767267', '#CDC9BD'];
const MOOD_TONES = ['#131313', '#767267', '#A9A597', '#CDC9BD'];

// Canvas row tops: triggers 306/364/422, mood 306/360/414/468, places
// 454/492/530 — each less the status bar.
const TRIGGER_ROW_Y = [252, 310, 368];
const MOOD_ROW_Y = [252, 306, 360, 414];
const PLACE_ROW_Y = [400, 438, 476];

const SEGMENTS = ['Overview', 'Strength', 'Mood', 'Timing'];

export default function UrgeOverview() {
  const router = useRouter();
  const params = useLocalSearchParams<{ week?: string }>();
  const events = useEvents();
  const [page, setPage] = useState(0);
  const [now] = useState(() => Date.now());
  const pager = useRef<ScrollView>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // One viewport per page, computed rather than measured: onLayout settles a
  // frame late on web and the first page would render at its natural height.
  const pageH = height - insets.top;

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  if (events === undefined) return <LoadingView />;

  const start = params.week ? new Date(`${params.week}T00:00:00`).getTime() : now - WEEK;
  const urges = events.filter((e) => e.type.startsWith('urge') && e.createdAt >= start && e.createdAt < start + WEEK);
  const rode = urges.filter((e) => e.type === 'urge_rode_out').length;
  const avg = urges.length ? urges.reduce((s, e) => s + (e.severity ?? 5), 0) / urges.length : null;

  const end = start + WEEK - 86_400_000;
  const opens = new Date(start);
  const closes = new Date(end);
  const monthDay = (t: number) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  // "Jul 14–20" — the closing month is only worth repeating when the week
  // straddles two of them.
  const range = opens.getMonth() === closes.getMonth() ? `${monthDay(start)}–${closes.getDate()}` : `${monthDay(start)}–${monthDay(end)}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={pager}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width)))}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <View style={{ width, height: pageH }}>
              <Summary urges={urges} rode={rode} avg={avg} />
            </View>
            <View style={{ width, height: pageH }}>
              <Triggers urges={urges} />
            </View>
            <View style={{ width, height: pageH }}>
              <MoodBefore urges={urges} />
            </View>
            <View style={{ width, height: pageH }}>
              <WhenWhere urges={urges} />
            </View>
          </ScrollView>

          {/* the header rides above the pager and lets every swipe through */}
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <AppText style={[sans('500'), { position: 'absolute', right: 20, top: 14, fontSize: 14, color: '#8B8882' }]}>{range}</AppText>
            <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 60, fontSize: 27, lineHeight: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
              Urge overview
            </AppText>
          </View>

          <PressScale
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Svg width={11} height={19} viewBox="0 0 11 19">
              <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
          </PressScale>

          <View style={{ position: 'absolute', left: 16, right: 16, top: 114, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.06)', flexDirection: 'row', padding: 3 }}>
            {SEGMENTS.map((label, index) => {
              const on = page === index;
              return (
                <Pressable
                  key={label}
                  onPress={() => {
                    setPage(index);
                    pager.current?.scrollTo({ x: index * width, animated: true });
                  }}
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
                  <AppText style={[sans(on ? '600' : '500'), { fontSize: 14, color: on ? '#1D1C1A' : '#8B8882' }]}>{label}</AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ----------------------------------------------------------------- the parts */

/** The one heading each reading carries. Canvas y 244, and 414 for the second on the When page. */
function Heading({ top, children }: { top: number; children: string }) {
  return <AppText style={[sans('600'), { position: 'absolute', left: 24, top, fontSize: 20, letterSpacing: -0.1, color: '#1D1C1A' }]}>{children}</AppText>;
}

/** A labelled bar. The mood reading earns a percentage column; triggers go without. */
function BarRow({
  top,
  label,
  fill,
  tone,
  percent,
}: {
  top: number;
  label: string;
  fill: `${number}%`;
  tone: string;
  percent?: string;
}) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <AppText numberOfLines={1} style={[sans('500'), { width: 88, fontSize: 15.5, color: '#1D1C1A' }]}>
        {label}
      </AppText>
      <View style={{ flex: 1 }}>
        <View style={{ width: fill, height: 10, borderRadius: 5, backgroundColor: tone }} />
      </View>
      {percent ? <AppText style={[sans('500'), { width: 44, textAlign: 'right', fontSize: 14.5, color: '#55534E' }]}>{percent}</AppText> : null}
    </View>
  );
}

/** The one sentence a reading earns. Canvas y 566, and 606 on the When page; 76 tall, 16 gutter. */
function Insight({ icon, title, note, body, top = 512 }: { icon: React.ReactNode; title: string; note: string; body: string; top?: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top,
        height: 76,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 10px 24px rgba(40,38,32,0.06)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
      }}>
      <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <View>
        <AppText style={[sans('600'), { fontSize: 13.5, color: '#1D1C1A' }]}>{title}</AppText>
        <AppText style={[sans('400'), { marginTop: 2, fontSize: 11.5, color: '#8B8882' }]}>{note}</AppText>
      </View>
      <AppText style={[sans('400'), { flex: 1, paddingLeft: 8, fontSize: 12.5, lineHeight: 17, color: '#55534E' }]}>{body}</AppText>
    </View>
  );
}

function Empty({ top, what }: { top: number; what: string }) {
  return (
    <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 24, top, fontSize: 14.5, color: '#8B8882' }]}>
      Nothing logged this week, so there is no {what} to read yet.
    </AppText>
  );
}

/** The summary card names the band in title case; the chips read it lowercase. */
function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function severityWord(severity: number): string {
  if (severity >= 8) return 'intense';
  if (severity >= 6) return 'strong';
  if (severity >= 4) return 'moderate';
  return 'mild';
}

/* ---------------------------------------------------------------- 036 summary */

/** One 48pt row of the summary card: a mark on the paper disc, a name, a figure. */
function SummaryRow({ top, icon, label, value, strong = false }: { top: number; icon: React.ReactNode; label: string; value: string; strong?: boolean }) {
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, top, height: 48, flexDirection: 'row', alignItems: 'center', gap: 13 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <AppText style={[sans('500'), { flex: 1, fontSize: 15, color: '#1D1C1A' }]}>{label}</AppText>
      <AppText style={[sans(strong ? '600' : '500'), { fontSize: 13.5, color: strong ? '#131313' : '#8B8882' }]}>{value}</AppText>
    </View>
  );
}

/** The week in three figures, before any of it is broken down. */
function Summary({ urges, rode, avg }: { urges: TidelineEvent[]; rode: number; avg: number | null }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', left: 12, right: 12, top: 176, height: 188, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
        <SummaryRow
          top={14}
          icon={
            <Svg width={17} height={12} viewBox="0 0 26 20">
              <Path d="M2 13c4-8 9 3 13-3s7 2 9-2" fill="none" stroke="#131313" strokeWidth={2.4} strokeLinecap="round" />
            </Svg>
          }
          label="Urges logged"
          value={`${urges.length} this week`}
          strong
        />
        <View style={{ position: 'absolute', left: 16, right: 16, top: 62, height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />
        <SummaryRow
          top={70}
          icon={
            <Svg width={18} height={11} viewBox="0 0 22 13">
              <Path d="M2,11 A9,9 0 0 1 20,11" fill="none" stroke="rgba(19,19,19,0.15)" strokeWidth={3} strokeLinecap="round" />
              <Path d="M2,11 A9,9 0 0 1 16.5,4" fill="none" stroke="#131313" strokeWidth={3} strokeLinecap="round" />
            </Svg>
          }
          label="Average intensity"
          value={avg != null ? titleCase(severityWord(avg)) : '—'}
        />
        <View style={{ position: 'absolute', left: 16, right: 16, top: 118, height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />
        <SummaryRow
          top={126}
          icon={
            <Svg width={13} height={11} viewBox="0 0 16 13">
              <Path d="M1.5 7l4.4 4.5L14.5 1.5" fill="none" stroke="#131313" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          }
          label="Ridden out, start to finish"
          value={`${rode} of ${urges.length}`}
        />
      </View>
      <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 24, top: 392, fontSize: 14, lineHeight: 21, color: '#55534E' }]}>
        Each one is a data point, not a verdict — the pages ahead break them down.
      </AppText>
    </View>
  );
}

/* --------------------------------------------------------------- 037 triggers */

/** What set them off. */
function Triggers({ urges }: { urges: TidelineEvent[] }) {
  // The urge log stores a multi-select as one " · " joined string; split it back
  // apart so a session tagged Stress and Late night counts toward both.
  const counts = tally(urges.flatMap((e) => (e.trigger ? e.trigger.split(' · ') : [])));
  const max = counts[0]?.[1] ?? 0;
  const hours = tally(urges.map((e) => String(new Date(e.createdAt).getHours())));
  const band = hours.length ? timeBand(Number(hours[0][0])) : null;

  return (
    <View style={{ flex: 1 }}>
      <Heading top={190}>Common triggers</Heading>
      {counts.length ? (
        counts.slice(0, 3).map(([label, count], i) => (
          <BarRow key={label} top={TRIGGER_ROW_Y[i]} label={label} fill={`${Math.round((count / max) * 100)}%`} tone={TRIGGER_TONES[i]} />
        ))
      ) : (
        <Empty top={252} what="pattern" />
      )}
      {counts.length ? (
        <Insight
          icon={
            <Svg width={16} height={14} viewBox="0 0 16 14">
              <Rect x={1} y={6} width={3.4} height={7} rx={1.2} fill="#FFFFFF" />
              <Rect x={6.3} y={3} width={3.4} height={10} rx={1.2} fill="#FFFFFF" />
              <Rect x={11.6} y={0.5} width={3.4} height={12.5} rx={1.2} fill="#FFFFFF" />
            </Svg>
          }
          title={`${counts[0][0]} on top`}
          note="most common"
          body={band ? `Most land ${BAND_PHRASE[band]}. The evening drill helps.` : 'The evening drill helps.'}
        />
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------- 038 mood */

const STATE_WORD: Record<string, string> = { hungry: 'Hungry', tired: 'Tired', lonely: 'Lonely', bored: 'Bored' };

/** The state that arrived first. */
function MoodBefore({ urges }: { urges: TidelineEvent[] }) {
  const states = urges.flatMap((e) =>
    Object.entries(e.precedingState ?? {})
      .filter(([key, on]) => on === true && key in STATE_WORD)
      .map(([key]) => STATE_WORD[key]),
  );
  const counts = tally(states);
  const share = (count: number) => Math.round((count / Math.max(1, urges.length)) * 100);

  return (
    <View style={{ flex: 1 }}>
      <Heading top={190}>Mood before the urge</Heading>
      {counts.length ? (
        counts.slice(0, 4).map(([label, count], i) => (
          <BarRow key={label} top={MOOD_ROW_Y[i]} label={label} fill={`${share(count)}%`} tone={MOOD_TONES[i]} percent={`${share(count)}%`} />
        ))
      ) : (
        <Empty top={252} what="mood pattern" />
      )}
      {counts.length ? (
        <Insight
          icon={
            <Svg width={18} height={11} viewBox="0 0 26 16">
              <Path d="M2 12c4-7 8 3 12-3s8 2 10-2" stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" />
            </Svg>
          }
          title={`${counts[0][0]} first`}
          note={`${Math.round(share(counts[0][1]) / 10)} in 10 urges`}
          body="Two minutes of unclenching beats the spike."
        />
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------- 039 when */

/** When they landed, and where. */
function WhenWhere({ urges }: { urges: TidelineEvent[] }) {
  const seen = tally(urges.map((e) => timeBand(new Date(e.createdAt).getHours())));
  // The canvas draws a fixed 3-up grid, and its two 1×56 dividers are the only
  // thing setting the strip's height — a week that fell in one band would
  // otherwise stretch that band across all 369 and shave a point off the row.
  const bands = [...seen, ...BAND_ORDER.filter((b) => !seen.some(([label]) => label === b)).map((b): [string, number] => [b, 0])].slice(0, 3);
  const hours = tally(urges.map((e) => String(new Date(e.createdAt).getHours())));
  const peak = hours.length ? Number(hours[0][0]) : null;
  // The log has no place field of its own yet — a location noted during the
  // urge, else whatever note was left on it.
  const places = tally(urges.map((e) => e.precedingState?.location ?? e.note).filter((p): p is string => !!p));

  return (
    <View style={{ flex: 1 }}>
      <Heading top={190}>When they hit</Heading>
      {seen.length ? (
        <View style={{ position: 'absolute', left: 12, right: 12, top: 240, flexDirection: 'row', alignItems: 'center' }}>
          {bands.map(([label, count], i) => (
            <Fragment key={label}>
              {i > 0 ? <View style={{ width: 1, height: 56, backgroundColor: 'rgba(0,0,0,0.08)' }} /> : null}
              <View style={{ flex: 1, alignItems: 'center', gap: 8 }}>
                <BandGlyph band={label} />
                <AppText style={[sans('500'), { fontSize: 13, color: '#55534E' }]}>{label}</AppText>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  {[0, 1, 2].map((dot) => (
                    <View key={dot} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dot < count ? '#131313' : 'rgba(19,19,19,0.16)' }} />
                  ))}
                </View>
              </View>
            </Fragment>
          ))}
        </View>
      ) : (
        <Empty top={252} what="timing" />
      )}

      <Heading top={360}>Where they showed up</Heading>
      {places.length ? (
        places.slice(0, 3).map(([label, count], i) => (
          <View key={label} style={{ position: 'absolute', left: 24, right: 24, top: PLACE_ROW_Y[i], flexDirection: 'row', alignItems: 'center' }}>
            <AppText style={[sans('500'), { width: 28, fontSize: 14, color: '#8B8882' }]}>{i + 1}.</AppText>
            <AppText numberOfLines={1} style={[sans('500'), { flex: 1, fontSize: 15.5, color: '#1D1C1A' }]}>
              {label}
            </AppText>
            <AppText style={[sans('600'), { fontSize: 15, color: count ? '#1D1C1A' : '#8B8882' }]}>{count}</AppText>
          </View>
        ))
      ) : (
        <Empty top={400} what="place" />
      )}

      {seen.length && peak != null ? (
        <Insight
          icon={
            <Svg width={16} height={16} viewBox="0 0 20 20">
              <Circle cx={10} cy={10} r={8} fill="none" stroke="#FFFFFF" strokeWidth={1.9} />
              <Path d="M10 5.5V10l3 2" stroke="#FFFFFF" strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          }
          title={`${clockHour(peak)} – ${clockHour(peak + 2)}`}
          note="peak window"
          body={BAND_ADVICE[seen[0][0]]}
          top={552}
        />
      ) : null}
    </View>
  );
}

/**
 * The canvas draws three glyphs for three bands. Morning borrows the sun on the
 * horizon — the same drawing reads either way round the day.
 */
function BandGlyph({ band }: { band: string }) {
  if (band === 'Late night') {
    return (
      <Svg width={17} height={17} viewBox="0 0 30 30">
        <Path d="M17 3 A11 11 0 1 0 25.5 20 A8.6 8.6 0 1 1 17 3 Z" fill="#131313" />
      </Svg>
    );
  }
  if (band === 'Afternoon') {
    return (
      <Svg width={17} height={17} viewBox="0 0 20 20">
        <Circle cx={10} cy={10} r={3.6} fill="none" stroke="#131313" strokeWidth={2.3} />
        <Path
          d="M10 1.5v2.6M10 15.9v2.6M1.5 10h2.6M15.9 10h2.6M3.9 3.9l1.9 1.9M14.2 14.2l1.9 1.9M16.1 3.9l-1.9 1.9M5.8 14.2l-1.9 1.9"
          stroke="#131313"
          strokeWidth={2.3}
          strokeLinecap="round"
        />
      </Svg>
    );
  }
  return (
    <Svg width={19} height={17} viewBox="0 0 20 17">
      <Path d="M5.5 11a4.5 4.5 0 0 1 9 0" fill="none" stroke="#131313" strokeWidth={2.3} />
      <Path d="M2 14h16M10 1.5v2.5M3.6 4.6l1.8 1.8M16.4 4.6l-1.8 1.8" stroke="#131313" strokeWidth={2.3} strokeLinecap="round" />
    </Svg>
  );
}

function timeBand(hour: number): string {
  if (hour >= 22 || hour < 5) return 'Late night';
  if (hour >= 17) return 'Evening';
  if (hour >= 12) return 'Afternoon';
  return 'Morning';
}

// The order the canvas reads the day in, and the order empty cells fill from.
const BAND_ORDER = ['Late night', 'Evening', 'Afternoon', 'Morning'];

const BAND_PHRASE: Record<string, string> = {
  'Late night': 'after 10 pm',
  Evening: 'in the evening',
  Afternoon: 'in the afternoon',
  Morning: 'in the morning',
};

const BAND_ADVICE: Record<string, string> = {
  'Late night': 'Lights out earlier shrinks the window.',
  Evening: 'The evening drill lands right before it.',
  Afternoon: 'Guard the hour before it opens.',
  Morning: 'Guard the hour before it opens.',
};

/** 23 → "11 pm", 25 → "1 am". */
function clockHour(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  return `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'am' : 'pm'}`;
}

/** Count occurrences, biggest first. */
function tally(values: string[]): [string, number][] {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}
