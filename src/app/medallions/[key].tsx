import { useLocalSearchParams, useRouter } from 'expo-router';
import { Share, View } from 'react-native';

import { MedalBoard } from '@/components/keepsakes/Board';
import { KK_METALS, kkFace, kkFirstAt, kkStandingFor, kkTierLine, type KKMetal } from '@/components/keepsakes/Medallion';
import { EmptyState, NavBar, Screen, type Tier } from '@/components/mono';
import { useMedallionLedger } from '@/lib/album';
import { roman, shortDate } from '@/lib/format';

/**
 * 88D–88H · 89A–89F — one medallion at one rung (`Breakwater *`, `Detail *`).
 *
 * Every board is the same dark page: the 168 coin with the rung's numeral,
 * the name, the line under it, the rung as caps, the five-tier track filled to
 * the rung, the rung's own line as an italic quote, and `Share this` (the nav's
 * share icon does the same). A face with nothing behind it (`?tier=none`,
 * `Detail Paper`) draws the blank coin, `Not yet. First at …` in `#5A574F`, an
 * empty track and `Back to medallions` instead.
 *
 * The board reads the face and the rung off the route (`?tier=<metal>|none`),
 * as the album pushes it. The pill that used to open the ladder is gone; the
 * track itself is the door to `Tiers <face>` (Q5, D273), and on a face that
 * mints once — no track — the caps line is the door to `Tiers One-offs`.
 *
 * `Detail Paper` is the previous drop's seven-rung Vici left unredrawn: its
 * `First at ×1` and its quote, "Nine minutes…", were that ladder's first rung
 * and the line `Detail Bronze` carried at it. Vici's first rung is now ×5
 * (`Tiers Vici`, the album's own data), so an unearned board computes both —
 * `First at ×5` and the first rung's own line, `stories[0]` — as D057 did
 * (CRITIC §1.4, D274). The other four `Detail` boards agree with the ladder
 * word for word.
 */
export default function MedallionDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ key?: string; tier?: string }>();
  const ledger = useMedallionLedger();
  const face = kkFace(params.key ?? '');

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/milestones'));

  if (!face) {
    return (
      <Screen>
        <NavBar left="back" onBack={back} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState title="Medallion not found" body="It may have been renamed." h1 />
        </View>
      </Screen>
    );
  }

  // `?tier=` is the rung the face stands on, by name; anything else — the
  // album sends `none` — is a face with nothing behind it.
  const metal = KK_METALS.includes(params.tier as KKMetal) ? (params.tier as KKMetal) : null;
  const standing = metal ? kkStandingFor(face, metal) : 0;
  const tiered = face.steps.length > 0;
  const earned = standing > 0;

  // A one-off carries the day it minted where a tiered face carries its rung;
  // the board does not wait for the ledger to draw, it only borrows the date.
  const minted = ledger?.byKey[face.key]?.date;
  const caps = tiered
    ? earned
      ? kkTierLine(face, standing)
      : kkFirstAt(face)
    : earned
      ? minted != null
        ? shortDate(minted)
        : 'Earned once'
      : 'Not yet';

  // the rung's own line; with nothing behind it, the line that waits at the first rung
  const quote = `“${face.stories[Math.max(1, Math.min(face.stories.length, standing)) - 1]}”`;

  const share = () => {
    void Share.share({ message: `${face.name} · ${caps}` }).catch(() => {});
  };

  return (
    <MedalBoard
      scene={face.key}
      earned={earned}
      numeral={tiered && earned ? roman(standing) : undefined}
      title={face.name}
      body={face.long ?? face.blurb}
      caps={caps}
      capsMuted={!earned}
      onCaps={tiered ? undefined : () => router.push('/medallions/tiers/once')}
      capsLabel={`${caps}. Every one-off`}
      ladder={tiered ? { reached: (standing - 1) as -1 | Tier } : undefined}
      onLadder={() => router.push(`/medallions/tiers/${face.key}`)}
      below={{ kind: 'quote', text: quote, nudge: standing === 5 ? 1 : 0 }}
      cta={earned ? 'Share this' : 'Back to medallions'}
      onCta={earned ? share : back}
      onBack={back}
      onShare={share}
    />
  );
}
