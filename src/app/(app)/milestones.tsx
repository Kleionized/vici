import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useTabBarHeight } from '@/components/StoicTabBar';
import { KKMedallion, KK_ALBUM, kkMetal, kkRoman, kkRung, type KKFace, type KKMetal, type KeepsakeSceneKey } from '@/components/keepsakes/Medallion';
import { AppText, LoadingView, PressScale } from '@/components/ui';
import { useCheckins, useCurrentLesson, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap } from '@/lib/backend';
import { sans } from '@/lib/theme';

/**
 * 022–023 · Medallions.
 *
 * One screen, two segments: the faces that have been struck, and the ones still
 * ahead. Every face is the same 68pt paper disc — the album's own stock — and
 * the only difference between the two segments is the low sun behind an earned
 * device. Tapping a face opens its tier detail (024–028).
 *
 * The counts are live: days since the campaign began, urges outlasted, letters
 * sent, lessons finished. The canvas's "6 of 11" is its own mock — it draws
 * eleven faces and the app awards twelve — so the rule is carried, not the
 * number.
 *
 * Canvas y − 54 throughout (the frame's status bar is the safe-area top inset).
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

type Segment = 'earned' | 'ahead';

/** The one-time faces the canvas mints in a metal of their own. */
const MINT: Partial<Record<KeepsakeSceneKey, KKMetal>> = { told: 'gold' };

/** What a face knows about itself once the log has been counted. */
type Struck = {
  face: KKFace;
  count: number;
  earned: boolean;
  /** How many rungs are behind it — 1 for a one-time face that has minted. */
  reached: number;
  /** The stamped date a one-time face carries instead of a tier. */
  date?: string;
};

const shortDate = (ms: number) => new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/** `YYYY-MM-DD` as local midnight — `new Date(iso)` reads it as UTC and slips a day west of Greenwich. */
const dayStart = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1).getTime();
};

export default function Milestones() {
  const router = useRouter();
  const tabBar = useTabBarHeight();
  const events = useEvents();
  const checkins = useCheckins();
  const user = useCurrentUser();
  const journal = useJournalEntries();
  const progress = useLessonProgressMap();
  const current = useCurrentLesson();
  const [segment, setSegment] = useState<Segment>('earned');
  const [openedAt] = useState(() => Date.now());
  const grid = useRef<ScrollView>(null);
  // The two segments are different lengths; a carried-over offset would open
  // the shorter one mid-grid, with its first row already under the count line.
  const show = (next: Segment) => {
    setSegment(next);
    grid.current?.scrollTo({ y: 0, animated: false });
  };

  if (events === undefined || checkins === undefined || user === undefined || journal === undefined || progress === undefined || current === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <LoadingView />
        </SafeAreaView>
      </View>
    );
  }

  const days = user ? Math.max(1, Math.floor((openedAt - user.createdAt) / 86400000) + 1) : 1;
  const rode = events.filter((e) => e.type === 'urge_rode_out');
  const returns = events.filter((e) => e.type === 'urge_rode_out' || e.type === 'urge_acted_on').length;
  const storms = rode.filter((e) => (e.severity ?? 0) >= 9);
  const lapses = events.filter((e) => e.type === 'lapse');
  const letters = journal.filter((j) => j.tag === 'Letter').length;
  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;
  const worldsDone = Math.max(0, (current?.lesson.week ?? 1) - 1);
  const firstCheckin = checkins.length ? Math.min(...checkins.map((c) => dayStart(c.date))) : null;

  // What each face counts, and — for the four that mint once — whether it has.
  const COUNT: Record<KeepsakeSceneKey, number> = {
    veni: 1,
    vidi: days,
    vici: rode.length,
    lettersent: letters,
    bounce: lapses.length,
    firstlight: checkins.length ? 1 : 0,
    honest: journal.length,
    study: lessonsDone,
    groundtaken: worldsDone,
    told: 0,
    storm: storms.length ? 1 : 0,
    backondeck: returns,
  };

  const DATE: Partial<Record<KeepsakeSceneKey, string>> = {
    veni: user ? `Day 0 · ${shortDate(user.createdAt)}` : 'Day 0',
    firstlight: firstCheckin != null ? shortDate(firstCheckin) : undefined,
    storm: storms.length ? shortDate(Math.min(...storms.map((e) => e.createdAt))) : undefined,
  };

  const struck: Struck[] = KK_ALBUM.map((face) => {
    const count = COUNT[face.key];
    if (!face.steps.length) return { face, count, earned: count >= 1, reached: count >= 1 ? 1 : 0, date: DATE[face.key] };
    const reached = face.steps.filter((step) => count >= step).length;
    return { face, count, earned: reached > 0, reached };
  });

  const shown = struck.filter((s) => (segment === 'earned' ? s.earned : !s.earned));
  const rows: Struck[][] = [];
  for (let i = 0; i < shown.length; i += 2) rows.push(shown.slice(i, i + 2));
  const nEarned = struck.filter((s) => s.earned).length;

  const back = () => (router.canGoBack() ? router.back() : router.navigate('/(app)/today'));

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Yoga measures an absolute child's inset from the parent's border box
            and never consults padding, which is how safe-area-context expresses
            the inset — so everything absolute hangs off this plain view. */}
        <View style={{ flex: 1 }}>
          {/* the header, anchored on the canvas; the grid below it scrolls */}
          <View style={{ height: segment === 'earned' ? 236 : 208 }}>
            {/* canvas y 64 */}
            <PressScale
              onPress={back}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
              style={{ position: 'absolute', left: 16, top: 10, minHeight: 0 }}>
              <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
                <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </PressScale>

            {/* canvas y 72 — the album's page marks, carried through as chrome */}
            <View pointerEvents="none" style={{ position: 'absolute', right: 20, top: 18, flexDirection: 'row', gap: 4.5 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ width: 4.5, height: 4.5, borderRadius: 2.25, backgroundColor: '#55534E' }} />
              ))}
            </View>

            {/* canvas y 114 */}
            <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 60, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>Medallions</AppText>

            {/* canvas y 168 */}
            <View
              style={{
                position: 'absolute',
                left: 16,
                right: 16,
                top: 114,
                height: 38,
                borderRadius: 19,
                backgroundColor: 'rgba(0,0,0,0.06)',
                flexDirection: 'row',
                padding: 3,
              }}>
              {([['earned', 'Earned'], ['ahead', 'Still to earn']] as const).map(([key, label]) => {
                const on = segment === key;
                return (
                  <PressScale
                    key={key}
                    onPress={() => show(key)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: on }}
                    style={{
                      flex: 1,
                      minHeight: 0,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: on ? '#FFFFFF' : 'transparent',
                      boxShadow: on ? '0 1px 4px rgba(40,38,32,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)' : undefined,
                    }}>
                    <AppText style={[sans(on ? '600' : '500'), { fontSize: 14, color: on ? '#1D1C1A' : '#8B8882' }]}>{label}</AppText>
                  </PressScale>
                );
              })}
            </View>

            {/* canvas y 230 */}
            <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 176, fontSize: 13, color: '#55534E' }]}>
              {segment === 'earned' ? `${nEarned} of ${struck.length} earned` : `${struck.length - nEarned} left`}
            </AppText>

            {/* canvas y 256 — only the earned segment carries the rail */}
            {segment === 'earned' ? (
              <View style={{ position: 'absolute', left: 16, right: 16, top: 202, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.12)', overflow: 'hidden' }}>
                <View style={{ width: `${(nEarned / struck.length) * 100}%`, height: '100%', borderRadius: 3, backgroundColor: '#131313' }} />
              </View>
            ) : null}
          </View>

          {/* canvas y 290 / 262 — rows of two, on a 168 stride */}
          <ScrollView ref={grid} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: tabBar + 24, gap: 17 }}>
            {rows.map((row, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 17 }}>
                {row.map((s) => (
                  // A row that ends on one face is held to half the width, which
                  // the canvas states as `flex: 0 0 calc(50% - 5px)`. It cannot
                  // be `flex: 1` against a `flex: 1` spacer: a flex item's base
                  // size is floored at its own padding, so the card's 24 of
                  // horizontal padding makes it grow 12 wider than the empty box
                  // beside it. Yoga does this too — it is not a web quirk.
                  <FaceCard
                    key={s.face.key}
                    struck={s}
                    half={row.length === 1}
                    onPress={() => router.push(`/medallions/${s.face.key}?tier=${cardMetal(s)}`)}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

/** Which treatment this face's detail page opens in. */
function cardMetal(s: Struck): KKMetal {
  if (!s.earned) return 'paper';
  return MINT[s.face.key] ?? kkMetal(s.reached, s.face.steps.length);
}

/**
 * The state line under a face. Earned and tiered, it reads the rung it stands
 * on; earned and one-time, the day it was struck. Unearned, it reads how far
 * along the first rung is, or — for the faces that mint once — what mints it.
 */
function stateLine(s: Struck): string {
  const { face } = s;
  if (s.earned) {
    if (face.steps.length) return `Tier ${kkRoman(s.reached)} · ${kkRung(face, face.steps[s.reached - 1])}`;
    return s.date ?? 'Minted';
  }
  if (face.steps.length) return s.count > 0 ? `${s.count} of ${face.steps[0]}` : `Not yet · first ${kkRung(face, face.steps[0])}`;
  return MINT[face.key] ? `${TITLE_CASE[MINT[face.key]!]}, once · not yet` : 'Not yet';
}

const TITLE_CASE: Record<KKMetal, string> = { paper: 'Paper', bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };

/** One face in the grid: the coin in its triple rim, its name, and where it stands. */
function FaceCard({ struck, half, onPress }: { struck: Struck; half?: boolean; onPress: () => void }) {
  const line = stateLine(struck);
  // the canvas's `flex: 0 0 calc(50% - 8.5px)` — half the 353pt row less half
  // the 17pt gap. Stated as a width because neither flex basis nor a percentage
  // can subtract the gap, and `flex: 1` against an empty spacer cannot produce
  // it: a flex item's base size is floored at its own padding, so the card's 24
  // of horizontal padding would make it grow 12 wider than the box beside it.
  const halfW = (useWindowDimensions().width - 40 - 17) / 2;
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${struck.face.name}. ${line}`}
      style={{
        ...(half ? { width: halfW } : { flex: 1 }),
        // `UI Final` pinned the height and centred the contents in one edit;
        // either without the other reopens the ~26pt gap the diff closed.
        height: 168,
        minHeight: 168,
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: '#FFFFFF',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
      {/* the triple rim the canvas mounts every face in */}
      <View style={{ borderRadius: 9999, boxShadow: '0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 5px #FFFFFF, 0 0 0 6.5px rgba(0,0,0,0.16)' }}>
        <KKMedallion scene={struck.face.key} size={68} metal="paper" sun={struck.earned} />
      </View>
      <View style={{ alignSelf: 'stretch' }}>
        <AppText center style={[sans('500'), { fontSize: 14.5, lineHeight: 18.85, color: '#1D1C1A' }]}>
          {struck.face.name}
        </AppText>
        <AppText center style={[sans('600'), { marginTop: 4, fontSize: 12.5, color: '#8B8882' }]}>
          {line}
        </AppText>
      </View>
    </PressScale>
  );
}
