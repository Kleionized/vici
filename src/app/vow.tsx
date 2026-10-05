import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';

import {
  GhostLink,
  Hero,
  heroArtTop,
  LoadingView,
  MonoText,
  NavBar,
  Pill,
  PledgeCard,
  PrimaryButton,
  Screen,
  ScrollRegion,
  SHEET_TOP,
  Sheet,
  useCanvasTop,
} from '@/components/mono';
import { useCreateJournalEntry, useCurrentUser, useJournalEntries } from '@/lib/backend';
import { shortDate } from '@/lib/format';
import { mono } from '@/lib/theme';

/**
 * 92C · Your vow — the flag hero, then the vow read back in its card (the kit
 * `PledgeCard`, quote setting: the line in Lato 700, the first name in 700
 * italic), how long it has held and when it was signed, and the line about
 * re-signing — which the ghost at `bottom 48` now does (D294).
 *
 * Short phones (D320, as `HeroBoard` does it): when the stack would come within
 * 16 of the ghost, the flag and the stack rise together; past the flag's room
 * above canvas 108 the flag goes. The flag's room is only 25, so once it goes
 * the stack is centred in the band it frees between the nav's foot and the
 * ghost rather than rising by the deficit alone, which left ~180 of bare
 * ground over the card on a 667 phone (D297). A vow too long even for that
 * scrolls between the nav and the ghost. At 393 × 852 nothing moves, and like
 * `HeroBoard` nothing paints until the stack has been measured, so a short
 * phone never shows one frame of the unlifted layout.
 */

/** The line the canvas draws when nothing has been signed yet. */
const PLACEHOLDER = 'I’m done letting the wave decide. One evening at a time, I take the watch back.';

const DAY = 86_400_000;
const STACK_TOP = 340;
const HERO_TOP = 104;
/** the ghost's 18 line box at `bottom 48` */
const GHOST_RESERVE = 48 + 18;
/** where the scroll region starts: the nav row's foot */
const NAV_FOOT = 100;

export default function Vow() {
  const router = useRouter();
  const user = useCurrentUser();
  const journal = useJournalEntries();
  const createJournalEntry = useCreateJournalEntry();
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  // Read once on mount so the day count cannot move while the page is open.
  const [now] = useState(() => Date.now());
  const [stackH, setStackH] = useState(0);
  const [resignOpen, setResignOpen] = useState(false);

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  if (user === undefined || journal === undefined) return <LoadingView onBack={back} />;

  // newest first: a re-signed vow is the one read back
  const vow = journal.find((entry) => entry.tag === 'Vow') ?? journal.find((entry) => entry.tag === 'Pledge');
  const text = vow?.body ?? PLACEHOLDER;
  const signedAt = vow?.createdAt ?? user?.createdAt;
  const held = signedAt ? Math.max(0, Math.floor((now - signedAt) / DAY)) : 0;
  const name = user?.displayName?.split(' ')[0] || 'You';

  // the lift the short-screen rule asks for (0 at 852)
  const ghostTop = height - canvasTop - GHOST_RESERVE;
  const measured = stackH > 0;
  const deficit = measured ? Math.ceil(STACK_TOP + stackH + 16 - ghostTop) : 0;
  const room = Math.max(0, Math.floor(heroArtTop('flag', HERO_TOP) - 108));
  const dropArt = deficit > room;
  // with the flag gone: centred between the nav's foot and the ghost's 16, never above 108
  const freeTop = Math.max(108, NAV_FOOT + Math.floor((ghostTop - 16 - NAV_FOOT - stackH) / 2));
  const lift = deficit <= 0 ? 0 : dropArt ? STACK_TOP - freeTop : deficit;
  const hidden = measured ? null : { opacity: 0 };

  // "It resets the promise, never the progress": a new Vow entry with the same
  // words — the page reads the newest, so `Signed` becomes today and `Held for`
  // starts again. Like any journal entry (a morning pledge included) it is
  // listed in Past pledges and counts toward the album's Archive and Vidi;
  // nothing is removed or rewritten (D294). Signed today already, there is
  // nothing to restart, so a second tap writes no second entry.
  const signedToday = signedAt !== undefined && new Date(signedAt).toDateString() === new Date().toDateString();
  async function resign() {
    setResignOpen(false);
    if (signedToday) return;
    await createJournalEntry({ tag: 'Vow', title: 'Vow', body: text }).catch(() => {});
  }

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Your vow' }} right="empty" onBack={back} />
      {dropArt ? null : (
        <View pointerEvents="none" style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, hidden]}>
          <Hero id="flag" top={HERO_TOP - lift} />
        </View>
      )}

      <ScrollRegion top={NAV_FOOT} bottom={GHOST_RESERVE} contentStyle={{ paddingTop: STACK_TOP - lift - NAV_FOOT, paddingHorizontal: 24, paddingBottom: 16 }}>
        <View onLayout={(e) => setStackH(Math.ceil(e.nativeEvent.layout.height))} style={[{ gap: 16 }, hidden]}>
          <PledgeCard variant="quote" pledge={text} name={name} />
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
            <Pill kind="status" filled label={`Held for ${held} ${held === 1 ? 'day' : 'days'}`} />
            <Pill kind="status" label={signedAt ? `Signed ${shortDate(signedAt)}` : 'Not signed yet'} />
          </View>
          <MonoText v="p" color={mono.mute} center style={{ fontSize: 14, lineHeight: 21 }}>
            After a relapse you can re-sign the vow. It resets the promise, never the progress.
          </MonoText>
        </View>
      </ScrollRegion>

      <GhostLink label="Re-sign the vow" bottom={48} onPress={() => setResignOpen(true)} />

      {/* No frame draws what re-signing looks like; the confirmation is the
          sign-out sheet's shell, worded from this page's own lines (D294). */}
      <Sheet
        open={resignOpen}
        top={SHEET_TOP.signOut}
        gap={10}
        onClose={() => setResignOpen(false)}
        footer={
          <>
            <PrimaryButton label="Sign it again" bottom={96} sheet onPress={() => void resign()} />
            <GhostLink label="Cancel" zIndex={42} onPress={() => setResignOpen(false)} />
          </>
        }>
        <MonoText v="h1SheetLg">Re-sign the vow?</MonoText>
        <MonoText v="p" color={mono.sub} style={{ lineHeight: 23 }}>
          It resets the promise, never the progress.
        </MonoText>
      </Sheet>
    </Screen>
  );
}
