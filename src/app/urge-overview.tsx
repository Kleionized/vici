import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState, type ReactNode } from 'react';
import { ScrollView, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';

import { bandOf, clockHour, DAY_MS, hourCounts, isSlip, isUrge, peakWindow, tally, triggerNoun, triggersOf } from '@/components/logflow';
import { ROW_GAP, ChevronD, ChevronR, EmptyState, Hero, LoadingView, MonoText, NavBar, Screen, Tap, useCanvasTop, VizArt } from '@/components/mono';
import { OVERVIEW_ART_VIEWBOX, OVERVIEW_PLACE_ART } from '@/content/overviewArt';
import { SOS_ACTIONS } from '@/content/sosLibrary.data';
import { SOS_VIZ } from '@/content/sosViz';
import { HarnessPages } from '@/dev/HarnessPages';
import { useEvents } from '@/lib/backend';
import { clockTime, shortDate, splitStored } from '@/lib/format';
import type { TidelineEvent } from '@/lib/types';
import { lhNormal, mono } from '@/lib/theme';
import { weekLabel } from '@/lib/weeklyReport';

/**
 * 91A / 91B · Urge overview (Vici UI 2) — one page in two parts. The first,
 * under the night window: when most urges came (a heading and the line under
 * it), then four ruled facts — where, what set them off, what helped most, how
 * they ended. Scrolled on (the page snaps to it), three cards: what helped
 * (the SOS task's drawing, how often, strength before → after), where, and the
 * slips.
 *
 * The range is the last 30 days (the nav says so); the weekly report opens it
 * on one week (`?week=`), and the nav then names that week. Every sentence is
 * the frame's own, filled from the log (D42): "Most come late at night." where
 * the busiest two hours fall between 10 pm and 3 am, "Most come between 3 pm
 * and 5 pm." otherwise, and "5 of your 9 urges in the last 30 days came between
 * 11 pm and 1 am." A heading about where most urges fall needs at least two.
 */

const RANGE_DAYS = 30;
/** The nav row's foot: the page scrolls under it. */
const NAV_FOOT = 100;
/** The second part's first line sits at canvas 120 once scrolled to (91B). */
const LISTS_TOP = 120;

/** Places the Where card can draw: the frame's three, and the SOS places that are the same rooms. */
const PLACE_ART: Record<string, keyof typeof OVERVIEW_PLACE_ART> = {
  Bedroom: 'bedroom',
  'In bed': 'bedroom',
  Desk: 'desk',
  'At work or school': 'desk',
  Bathroom: 'bathroom',
};
const TASK_VIZ: Record<string, string> = Object.fromEntries(SOS_ACTIONS.map((a) => [a.title, a.viz]));

/** A start hour whose two-hour window falls inside the night (22:00 – 03:00). */
const lateAtNight = (h: number) => h >= 22 || h <= 1;
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const timesWord = (n: number) => (n === 1 ? 'Once' : `${n} times`);
const band = (severity: number) => bandOf(severity) + 1;
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** A ruled fact on the first part (`min-height 57`, rule under it): the name 15/400 mute, the value 15/700 ink and a chevron. */
function Fact({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <Tap label={`${label}, ${value}`} onPress={onPress} disabled={!onPress} style={{ height: 52, paddingHorizontal: 16, borderRadius: 16, backgroundColor: mono.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <MonoText v="p" wrap="nowrap" color={mono.mute} style={{ lineHeight: lhNormal(15) }}>
        {label}
      </MonoText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
        <MonoText v="rowLabel" wrap="nowrap" style={{ textAlign: 'right', flexShrink: 1 }}>
          {value}
        </MonoText>
        <ChevronR color={mono.art} />
      </View>
    </Tap>
  );
}

/** A card of rows under its caps (gap 12); a label opens its group, 30 under the one above (D63, D65). */
function Section({ title, onLayout, children }: { title: string; onLayout?: (e: LayoutChangeEvent) => void; children: ReactNode }) {
  return (
    <View onLayout={onLayout} style={{ gap: 12 }}>
      <MonoText v="caps">{title}</MonoText>
      <View style={{ gap: ROW_GAP }}>{children}</View>
    </View>
  );
}

/**
 * A card row: a 64 × 48 drawing at 10 (or none, the words then at 18), the
 * line 15/700/21 over its note 13/400/18 mute (gap 3), centred in a row at
 * least 68 tall with 10 above and below; a chevron where the row leads somewhere.
 */
function CardRow({ art, title, note, first, onPress, chevron }: { art?: string | null; title: string; note: string; first: boolean; onPress?: () => void; chevron?: boolean }) {
  const body = (
    <>
      {art ? (
        <View style={{ width: 64, height: 48 }}>
          <VizArt markup={art} viewBox={OVERVIEW_ART_VIEWBOX} w={64} h={48} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 3 }}>
        <MonoText v="rowLabel" wrap="pretty" style={{ lineHeight: 21 }}>
          {title}
        </MonoText>
        <MonoText v="p" wrap="pretty" color={mono.mute} style={{ fontSize: 13, lineHeight: 18 }}>
          {note}
        </MonoText>
      </View>
      {chevron ? <ChevronR color={mono.art} /> : null}
    </>
  );
  const style = {
    minHeight: 68,
    paddingVertical: 10,
    paddingLeft: art ? 10 : 18,
    paddingRight: 18,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 14,
    borderRadius: 16,
    backgroundColor: mono.card,
  };
  return onPress ? (
    <Tap label={`${title}, ${note}`} onPress={onPress} style={style}>
      {body}
    </Tap>
  ) : (
    <View style={style}>{body}</View>
  );
}

export default function UrgeOverview() {
  const router = useRouter();
  const params = useLocalSearchParams<{ week?: string }>();
  const events = useEvents();
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const [now] = useState(() => Date.now());
  const pager = useRef<ScrollView>(null);
  const [anchors, setAnchors] = useState<Record<string, number>>({});

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  if (events === undefined) return <LoadingView onBack={back} />;

  const start = params.week ? new Date(`${params.week}T00:00:00`).getTime() : now - RANGE_DAYS * DAY_MS;
  const end = params.week ? new Date(start).setDate(new Date(start).getDate() + 7) : now + 1;
  const urges = events.filter((e) => isUrge(e) && e.createdAt >= start && e.createdAt < end).sort((a, b) => b.createdAt - a.createdAt);
  const n = urges.length;
  const span = params.week ? 'this week' : `in the last ${RANGE_DAYS} days`;

  // when: the busiest two hours
  const hours = hourCounts(urges);
  const peak = peakWindow(hours);
  const inPeak = peak == null ? 0 : hours[peak] + hours[(peak + 1) % 24];
  const window = peak == null ? null : `between ${clockHour(peak)} and ${clockHour(peak + 2)}`;
  const heading = n >= 2 && peak != null ? (lateAtNight(peak) ? 'Most come late at night.' : `Most come ${window}.`) : null;
  const line = n >= 2 && window ? `${inPeak} of your ${n} urges ${span} came ${window}.` : null;

  // the facts
  const ridden = urges.filter((e) => !isSlip(e));
  const slips = urges.filter(isSlip);
  const places = tally(urges.map((e) => e.precedingState?.location).filter((p): p is string => !!p));
  const triggers = tally(triggersOf(urges));
  const helped = tally(ridden.map((e) => e.whatHelped).filter((w): w is string => !!w));
  const ended = [ridden.length ? `${ridden.length} ridden out` : '', slips.length ? `${slips.length} ${slips.length === 1 ? 'slip' : 'slips'}` : ''].filter(Boolean).join(', ');

  // the second part's rows
  const helpedRows = helped.map(([title, count]) => {
    const with_ = ridden.filter((e) => e.whatHelped === title);
    const scored = with_.filter((e) => e.severity != null && e.severityAfter != null);
    const move = scored.length ? ` · ${Math.round(mean(scored.map((e) => band(e.severity as number))))} → ${Math.round(mean(scored.map((e) => band(e.severityAfter as number))))}` : '';
    const viz = TASK_VIZ[title];
    return { title, note: `${timesWord(count)}${move}`, art: viz ? SOS_VIZ[viz] : null };
  });
  const placeRows = places.map(([place, count]) => ({ title: place, note: `${count} of ${n}`, art: PLACE_ART[place] ? OVERVIEW_PLACE_ART[PLACE_ART[place]] : null }));
  const slipRows = slips.map((e: TidelineEvent) => {
    const fed = e.trigger ? splitStored(e.trigger).map((t: string, i: number) => (i ? lowerFirst(t) : t)).join(', ') : '';
    const where = e.precedingState?.location ? `in ${lowerFirst(e.precedingState.location.replace(/^In /, ''))}` : '';
    return { key: e._id, title: `${shortDate(e.createdAt)}, ${clockTime(e.createdAt, { lower: true })}`, note: [fed, where].filter(Boolean).join(' · ') };
  });

  // the first part fills the screen under the nav; the page snaps to the second
  const firstH = height - canvasTop - NAV_FOOT;
  function scrollToList(key: string) {
    const y = anchors[key];
    if (y != null) pager.current?.scrollTo({ y: firstH + y - (LISTS_TOP - NAV_FOOT), animated: true });
  }
  const mark = (key: string) => (e: LayoutChangeEvent) => {
    const y = e.nativeEvent.layout.y;
    setAnchors((a) => (a[key] === y ? a : { ...a, [key]: y }));
  };

  return (
    <Screen>
      <NavBar
        left="back"
        centre={{ title: 'Urges' }}
        right={{
          node: (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MonoText v="navTitle" color={mono.ink}>
                {params.week ? weekLabel(params.week) : `${RANGE_DAYS} days`}
              </MonoText>
              <ChevronD size={10} />
            </View>
          ),
        }}
        onBack={back}
      />
      {n === 0 ? (
        <EmptyState body={`No urges logged ${span}.`} style={{ position: 'absolute', left: 0, right: 0, top: 318, paddingVertical: 0 }} />
      ) : (
        <View style={{ position: 'absolute', left: 0, right: 0, top: NAV_FOOT, bottom: 0 }}>
          <HarnessPages name="overview" pager={pager} pages={[0, firstH]} />
          <ScrollView ref={pager} snapToOffsets={[0, firstH]} decelerationRate="fast" showsVerticalScrollIndicator={false}>
            <View style={{ height: firstH }}>
              <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: -NAV_FOOT }}>
                <Hero id="windowNight" top={96} scale={0.86} />
              </View>
              <View style={{ position: 'absolute', left: 24, right: 24, top: 318 - NAV_FOOT }}>
                {heading ? (
                  <View style={{ gap: 12, marginBottom: 21 }}>
                    <MonoText v="title" center style={{ lineHeight: 37 }}>
                      {heading}
                    </MonoText>
                    <MonoText v="p" center>
                      {line}
                    </MonoText>
                  </View>
                ) : null}
                <View style={{ gap: ROW_GAP }}>
                  {places.length ? <Fact label="Usually in" value={places[0][0]} onPress={anchors.where != null ? () => scrollToList('where') : undefined} /> : null}
                  {triggers.length ? <Fact label="Set off by" value={triggerNoun(triggers[0][0])} onPress={anchors.slips != null ? () => scrollToList('slips') : undefined} /> : null}
                  {helped.length ? <Fact label="Helped most" value={helped[0][0]} onPress={anchors.helped != null ? () => scrollToList('helped') : undefined} /> : null}
                  <Fact label="How they ended" value={ended} onPress={anchors.slips != null ? () => scrollToList('slips') : undefined} />
                </View>
              </View>
            </View>
            <View style={{ paddingTop: LISTS_TOP - NAV_FOOT, paddingHorizontal: 24, paddingBottom: 40, gap: 30 }}>
              {helpedRows.length ? (
                <Section title="What helped" onLayout={mark('helped')}>
                  {helpedRows.map((r, i) => (
                    <CardRow key={r.title} first={i === 0} art={r.art} title={r.title} note={r.note} chevron />
                  ))}
                </Section>
              ) : null}
              {placeRows.length ? (
                <Section title="Where" onLayout={mark('where')}>
                  {placeRows.map((r, i) => (
                    <CardRow key={r.title} first={i === 0} art={r.art} title={r.title} note={r.note} />
                  ))}
                </Section>
              ) : null}
              {slipRows.length ? (
                <Section title="Slips" onLayout={mark('slips')}>
                  {slipRows.map((r, i) => (
                    <CardRow key={r.key} first={i === 0} title={r.title} note={r.note} chevron onPress={() => router.push('/relapses')} />
                  ))}
                </Section>
              ) : null}
            </View>
          </ScrollView>
        </View>
      )}
    </Screen>
  );
}
