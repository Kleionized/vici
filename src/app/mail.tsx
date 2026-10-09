import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { kkFace, kkStanding } from '@/components/keepsakes/Medallion';
import { ChevronR, EmptyState, LoadingView, MonoText, NavBar, Screen, ScrollRegion, Tap } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents } from '@/lib/backend';
import { roman } from '@/lib/format';
import { ACCOUNT_KEYS, readAccountJSON } from '@/lib/accountState';
import { mono } from '@/lib/theme';
import { buildWeeklyReport, completedWeekStarts } from '@/lib/weeklyReport';

/**
 * Mail — every report and letter the app has delivered. No frame draws it;
 * it takes `Log — Reports`' idiom (CRITIC C6, routes §4.15): a title head and
 * ruled rows on the ground — the title 15/700 over its line 14/700 `#9B968E`,
 * 64 tall, a `#5A574F` chevron — and the app's own copy. Empty, a centred
 * 26/33 heading and its line.
 */

const LETTER_KEY = ACCOUNT_KEYS.letterKept;
const POST_DONE_KEY = ACCOUNT_KEYS.postDelivered;

const NAV_BOTTOM = 100;
/** the title head's 32/38 at 108 (`TitleHead`), in flow here so it scrolls with the rows */
const TITLE_TOP = 108;
/** the title ends at 146; the rows start a gutter under it */
const ROWS_TOP = 170;
const ROW_H = 64;

type Item = { key: string; title: string; sub: string; go: () => void };

export default function Mail() {
  const router = useRouter();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  const [letter, setLetter] = useState<{ kept?: boolean } | null>(null);
  const [postDelivered, setPostDelivered] = useState(false);

  useEffect(() => {
    void readAccountJSON<{ kept?: boolean }>(LETTER_KEY).then(setLetter);
    // The key still spells the retired `Back on deck` face; it is load-bearing
    // storage on accounts that already have the post, so it keeps its name.
    void readAccountJSON<number>(POST_DONE_KEY).then((v) => setPostDelivered(!!v));
  }, []);

  const items = useMemo<Item[]>(() => {
    if (!user || !checkins || !events) return [];
    const out: Item[] = [];

    // weekly reports — newest first
    for (const weekStart of completedWeekStarts(user)) {
      const r = buildWeeklyReport(weekStart, checkins, events);
      const verdict =
        r.thisAvg == null
          ? 'No moods logged'
          : r.lastAvg == null
            ? 'Your first full week'
            : r.thisAvg - r.lastAvg >= 0.25
              ? 'A better week'
              : r.lastAvg - r.thisAvg >= 0.25
                ? 'A harder week'
                : 'A steady week';
      out.push({
        key: `report-${weekStart}`,
        title: 'Weekly report',
        sub: `${r.label} · ${verdict}`,
        go: () => router.push({ pathname: '/weekly-report', params: { week: weekStart } }),
      });
    }

    // Post from VICI — the medallion letter (and its enclosure), re-readable.
    // The row names the face and the rung the post itself encloses, which
    // `/medallion-post` reads from the ridden-out count — in the enclosure
    // card's own words (`Vici, Tier I`, 39B's casing).
    if (postDelivered) {
      const face = kkFace('vici');
      const ridden = events.filter((e) => e.type === 'urge_rode_out').length;
      const standing = face ? kkStanding(face, ridden) : 0;
      out.push({
        key: 'post',
        title: 'A medallion from VICI',
        sub: `${face?.name ?? 'Vici'}, Tier ${roman(Math.max(1, standing))}`,
        go: () => router.push('/medallion-post'),
      });
    }

    // VICI's post-slip letter, resealed after each reading. It is VICI's, the
    // same for everyone — not something he wrote on day zero (D476).
    out.push({
      key: 'letter',
      title: 'A letter from VICI',
      sub: letter?.kept ? 'Saved to your journal' : 'Read it after a slip',
      go: () => router.push('/letter'),
    });
    return out;
  }, [user, checkins, events, letter, postDelivered, router]);

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/dashboard'));

  if (checkins === undefined || events === undefined) return <LoadingView onBack={back} />;

  return (
    <Screen>
      {/* a title-head page scrolls whole, under the fixed nav row (D320) */}
      <ScrollRegion top={NAV_BOTTOM} contentStyle={{ paddingTop: TITLE_TOP - NAV_BOTTOM, paddingHorizontal: 24, paddingBottom: 58 }}>
        <MonoText v="titlePage" style={{ marginBottom: ROWS_TOP - TITLE_TOP - 38 }}>
          Mail
        </MonoText>
        {items.length === 0 ? (
          <EmptyState
            h1
            title="Nothing here yet."
            body="Weekly reports and letters from VICI come here."
            style={{ marginTop: 300 - ROWS_TOP, paddingVertical: 0 }}
          />
        ) : (
          items.map((it, i) => (
            <Tap
              key={it.key}
              onPress={it.go}
              label={`${it.title}. ${it.sub}`}
              style={[
                { height: i ? ROW_H + 1 : ROW_H, paddingHorizontal: 2, flexDirection: 'row', alignItems: 'center', gap: 14 },
                // a ruled list: the rule is the row's own top border, as `Log — Reports` draws it
                i ? { borderTopWidth: 1, borderTopColor: mono.line } : null,
              ]}>
              <View style={{ flex: 1, gap: 2 }}>
                <MonoText v="rowLabel">
                  {it.title}
                </MonoText>
                {/* a dynamic line may ellipsise on a narrow phone; nothing else does (CRITIC C11) */}
                <MonoText v="rowValue" numberOfLines={1}>
                  {it.sub}
                </MonoText>
              </View>
              <ChevronR color={mono.art} />
            </Tap>
          ))
        )}
      </ScrollRegion>
      <NavBar left="back" onBack={back} />
    </Screen>
  );
}
