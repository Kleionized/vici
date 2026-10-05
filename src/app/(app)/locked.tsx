import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { CourseRow, ROW_GAP } from '@/components/library/WeekPage';
import { Hero, MonoText, NavBar, PrimaryButton, Screen, ScrollRegion } from '@/components/mono';
import { CURRICULUM_84 } from '@/content/curriculum84';

/**
 * The locked curriculum (old canvas 106) — no frame in `Vici Overhaul` draws it
 * (routes §4.5). Week I walked, the three weeks after it as week-page rows, the
 * count of what is left and the unlock pill. The rows are upcoming rows — the
 * week's numeral, its name and its blurb — with no lock glyph and no fade
 * (CRITIC C7): the title, the count and "Unlock VICI Plus" carry the meaning.
 * The paper mist vignette has no dark equivalent; the Closed-door illustration
 * stands in its place.
 */

/** The three weeks the old canvas lists under week I. */
const GHOSTED = 3;

export default function Locked() {
  const router = useRouter();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/library'));

  // The curriculum's own shape: week one, the three listed under it, and how
  // many are left after that.
  const first = CURRICULUM_84[0];
  const firstCount = first?.lessons.length ?? 0;
  const ahead = Math.max(0, CURRICULUM_84.length - 1);
  const ghosted = CURRICULUM_84.slice(1, 1 + GHOSTED);

  // The door is decoration between the rows and the words: where the column
  // would not fit above the pill with it, it goes (D320 rule 1) — once, so the
  // shorter column cannot bring it back and drop it again.
  const [door, setDoor] = useState(true);
  const regionH = useRef(0);
  const contentH = useRef(0);
  const fit = () => {
    if (door && regionH.current > 0 && contentH.current > regionH.current) setDoor(false);
  };

  return (
    <Screen>
      <NavBar left="back" onBack={back} />

      {/* the column between the nav and the pill (a 58 pill at bottom 48) */}
      <ScrollRegion
        top={100}
        bottom={106}
        contentStyle={{ paddingTop: 8, paddingBottom: 24 }}
        onLayout={(e) => {
          regionH.current = e.nativeEvent.layout.height;
          fit();
        }}
        onContentSizeChange={(_, h) => {
          contentH.current = h;
          fit();
        }}>
        <MonoText v="titlePage" accessibilityRole="header" style={{ marginHorizontal: 24 }}>
          Weeks
        </MonoText>

        <View style={{ marginTop: 24, marginHorizontal: 16, gap: ROW_GAP }}>
          <CourseRow
            lead="check"
            title={first ? `Week ${first.roman} · ${first.name}` : 'Week I'}
            detail={`Completed · ${firstCount} lessons`}
            state="done"
            trailing={null}
          />
          {ghosted.map((week) => (
            <CourseRow key={week.n} lead={week.roman} title={`Week ${week.roman} · ${week.name}`} detail={week.blurb} state="upcoming" trailing={null} />
          ))}
        </View>

        {door ? <Hero mode="box" id="door" bleed={0} style={{ marginTop: 16 }} /> : <View style={{ height: 16 }} />}

        <View style={{ marginTop: 8, marginHorizontal: 24, gap: 8 }}>
          <MonoText v="h1" center>
            {`${ahead} more weeks ahead`}
          </MonoText>
          <MonoText v="p" center>
            {`You've finished week one. The road carries on past the mist.`}
          </MonoText>
        </View>
      </ScrollRegion>

      <PrimaryButton label="Unlock VICI Plus" onPress={() => router.push('/paywall')} />
    </Screen>
  );
}
