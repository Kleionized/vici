import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ReactElement } from 'react';
import { View } from 'react-native';

import { Arrive, MedalBoard } from '@/components/keepsakes/Board';
import { FaceCoin, KK_ALBUM, kkFace, kkFirstAt, kkRung, kkTierLine } from '@/components/keepsakes/Medallion';
import { EmptyState, FadeInView, LoadingView, MonoText, NavBar, Screen, ScrollRegion, TIER_NAMES, TitleHead, ladderStanding } from '@/components/mono';
import { useMedallionLedger } from '@/lib/album';
import { roman, shortDate } from '@/lib/format';
import { mono } from '@/lib/theme';

/**
 * 88I–88Q · The ladder behind one medallion (`Tiers *`).
 *
 * A state page now, not a reference list (D060's "no earned mark" is
 * superseded): the face's board at T 155 — coin at its rung, name, the
 * requirement, the rung as caps — then the five-tier track with each rung's
 * threshold under it and a fill that runs part-way to the next rung, the count
 * itself (`Day 13`, `×23`), how far the next rung is, and `Back to medallions`.
 *
 * The four faces that mint once share `Earned once` (88Q, `?key=once`): a 2×2
 * grid of 84 coins with the requirement and the day each minted, or "Not yet".
 *
 * Every number is the account's own (`src/lib/album.ts`). The page is opened
 * from a board whose coin was just struck, so the ladder's coin is drawn
 * still; its track runs its fill out instead. Until the ledger is in the page
 * is the bare ground and its back chevron (no spinner inside 300 ms); if it
 * had to wait, the page then fades in rather than cutting in.
 */

/** The album's four one-off faces, in the order 88Q lists them. */
const NAV_BOTTOM = 100;

const ONCE = KK_ALBUM.filter((face) => !face.steps.length);

export default function MedallionTiers() {
  const router = useRouter();
  const params = useLocalSearchParams<{ key?: string }>();
  const ledger = useMedallionLedger();
  // whether the page had to wait for its numbers — then it fades in when they land
  const [waited] = useState(() => ledger === undefined);
  const once = params.key === 'once';
  const face = once ? undefined : kkFace(params.key ?? '');

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/milestones'));
  // "Back to medallions" goes to the album itself, past the board the ladder was opened from
  const album = () => router.dismissTo('/(app)/milestones');

  if (!once && (!face || !face.steps.length)) {
    return (
      <Screen>
        <NavBar left="back" onBack={back} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState title="Medallion not found" body="It may have been renamed." h1 />
        </View>
      </Screen>
    );
  }

  if (!ledger) return <LoadingView onBack={back} />;

  const arrive = (page: ReactElement) => (waited ? <FadeInView style={{ flex: 1 }}>{page}</FadeInView> : page);

  if (once) return arrive(<OneOffs ledger={ledger} onBack={back} />);

  const f = face!;
  const { count, standing } = ledger.byKey[f.key];
  const { reached, progress } = ladderStanding(count, f.steps);
  const day = f.unit === 'day';
  // the rung after the one it stands on — Paper when nothing is reached yet;
  // at the top there is no next rung and the frames draw no line for it (Q6)
  const left = standing < f.steps.length ? f.steps[standing] - count : null;
  const next =
    left == null ? undefined : `${left.toLocaleString('en-US')} ${day ? (left === 1 ? 'day' : 'days') : 'more'} to ${TIER_NAMES[standing]}`;

  return arrive(
    <MedalBoard
      scene={f.key}
      earned={standing > 0}
      strike={false}
      numeral={standing > 0 ? roman(standing) : undefined}
      title={f.name}
      body={f.blurb}
      caps={standing > 0 ? kkTierLine(f, standing) : kkFirstAt(f)}
      capsMuted={standing === 0}
      ladder={{ reached, progress, thresholds: f.steps.map((s) => kkRung(f, s)) }}
      below={{ kind: 'count', count: day ? `Day ${count.toLocaleString('en-US')}` : `×${count.toLocaleString('en-US')}`, next }}
      cta="Back to medallions"
      onCta={album}
      onBack={back}
    />,
  );
}

/**
 * 88Q · Earned once: title head, the line under it at 160, and a 2 × 2 grid
 * (`left 32 right 32 top 240; row-gap 44; column-gap 16`) of `column center
 * gap 12` cells — the 84 coin, then the name (17/700 −0.2), the requirement
 * (13/400/18 mute) and the date (12/700 `#B5B0A8`, 2 below) or "Not yet"
 * (`#5A574F`), `gap 3`. No pill, no tab bar.
 */
function OneOffs({ ledger, onBack }: { ledger: NonNullable<ReturnType<typeof useMedallionLedger>>; onBack: () => void }) {
  const rows = [ONCE.slice(0, 2), ONCE.slice(2, 4)];
  return (
    <Screen>
      {/* a title-head page scrolls whole, under the fixed nav row, on a phone too short for it (D320) */}
      <ScrollRegion top={NAV_BOTTOM}>
        <View style={{ height: 616 - NAV_BOTTOM }}>
          <TitleHead title="Earned once" top={108 - NAV_BOTTOM} />
          <View style={{ position: 'absolute', left: 24, right: 24, top: 160 - NAV_BOTTOM }}>
            <MonoText v="pTight">One tier. Kept for good.</MonoText>
          </View>
          <View style={{ position: 'absolute', left: 32, right: 32, top: 240 - NAV_BOTTOM, gap: 44 }}>
            {rows.map((row, r) => (
              <View key={r} style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
                {row.map((face, c) => {
                  const entry = ledger.byKey[face.key];
                  const when = entry.earned && entry.date != null ? shortDate(entry.date) : 'Not yet';
                  return (
                    <Arrive key={face.key} index={r * 2 + c} style={{ flex: 1 }}>
                      <View accessible accessibilityLabel={`${face.name}. ${face.blurb}. ${when}`} style={{ alignItems: 'center', gap: 12 }}>
                        <FaceCoin scene={face.key} size={84} earned={entry.earned} />
                        <View style={{ gap: 3 }}>
                          <MonoText v="rowLabel" center color={entry.earned ? mono.ink : mono.mute} style={{ fontSize: 17, lineHeight: 21, letterSpacing: -0.2 }}>
                            {face.name}
                          </MonoText>
                          <MonoText v="pTight" wrap="nowrap" center color={mono.mute} style={{ fontSize: 13, lineHeight: 18 }}>
                            {face.blurb}
                          </MonoText>
                          <MonoText v="legal" wrap="nowrap" center color={entry.earned ? mono.sub : mono.art} style={{ marginTop: 2, letterSpacing: 0 }}>
                            {when}
                          </MonoText>
                        </View>
                      </View>
                    </Arrive>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollRegion>
      <NavBar left="back" onBack={onBack} />
    </Screen>
  );
}
