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
  PrimaryButton,
  Screen,
  ScrollRegion,
  SHEET_TOP,
  Sheet,
  SignatureMark,
  SignaturePad,
  useCanvasTop,
} from '@/components/mono';
import { useCreateJournalEntry, useCurrentUser, useJournalEntries } from '@/lib/backend';
import { calendarDaysBetween } from '@/lib/day';
import { shortDate } from '@/lib/format';
import { pledgeText, VOW_TEXT } from '@/lib/pledge';
import { saveSignature, useSignature, type Signature } from '@/lib/signature';
import { mono, sansItalic } from '@/lib/theme';

/**
 * 92C · Your vow — the flag hero, then from 340 at gap 36: the vow read back
 * (26/700/34), his first name in 700 italic over a 1.5 rule with when it was
 * signed and how long it has held under it (13/700 mute), and the line about
 * re-signing — which the ghost at `bottom 48` does (D294).
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

/**
 * What the page reads (D474). Only `Vow` entries: the onboarding's `40 · The
 * Vow` files one when he signs, and `Re-sign` files another. It used to fall
 * back to the newest `Pledge` — which every morning check-in re-creates — so
 * the page showed that morning's pledge as the vow, "Signed" today, "Held for
 * 0 days" every day; and with no entry at all, the canvas's sample line
 * ("I’m done letting the wave decide…") as words he had signed, dated the day
 * the account was made.
 *
 * With no vow, the card shows the vow VICI offers (the onboarding's, unsigned:
 * no name under it), "Not signed yet", and the ghost signs it. "Held for" is
 * whole calendar days since the newest signing: re-signing after a slip
 * restarts it, as the page's own line says, and nothing else does.
 */
const STACK_TOP = 340;
const HERO_TOP = 104;
/** the ghost's 18 line box at `bottom 48` */
const GHOST_RESERVE = 48 + 18;
/** where the scroll region starts: the nav row's foot */
const NAV_FOOT = 100;

/** What the sheet rises by to hold the signature pad (D68): the pad, its gap. */
const SHEET_PAD = 96;

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
  // the signature he draws in the sheet (D68), and the one he drew last
  const [drawn, setDrawn] = useState<Signature | null>(null);
  const kept = useSignature();

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  if (user === undefined || journal === undefined) return <LoadingView onBack={back} />;

  // newest first: a re-signed vow is the one read back — never a daily pledge
  const vow = journal.find((entry) => entry.tag === 'Vow' && pledgeText(entry) !== '');
  const text = vow ? pledgeText(vow) : VOW_TEXT;
  const signedAt = vow?.createdAt;
  const held = signedAt !== undefined ? Math.max(0, calendarDaysBetween(signedAt, now)) : 0;
  const name = user?.displayName?.trim().split(/\s+/)[0] || 'You';

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
  // starts again. Like any journal entry it is listed in the Journal and counts
  // toward the album's Archive and Vidi; nothing is removed or rewritten
  // (D294). Signed today already, there is nothing to restart: the ghost's
  // place says so as plain text, not a tap that silently writes nothing (D474, D487).
  const signedToday = signedAt !== undefined && calendarDaysBetween(signedAt, now) === 0;
  async function sign() {
    if (!drawn) return;
    setResignOpen(false);
    void saveSignature(drawn);
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
        <View onLayout={(e) => setStackH(Math.ceil(e.nativeEvent.layout.height))} style={[{ gap: 36 }, hidden]}>
          <MonoText v="h1" wrap="pretty" style={{ lineHeight: 34 }}>
            {text}
          </MonoText>
          {/* the name goes over the rule only once he has signed it */}
          <View style={{ gap: 10 }}>
            {vow ? (
              kept ? (
                <SignatureMark sig={kept} height={56} />
              ) : (
                <MonoText v="h1" wrap="nowrap" style={{ ...sansItalic(), lineHeight: 30, letterSpacing: undefined, paddingLeft: 4 }}>
                  {name}
                </MonoText>
              )
            ) : null}
            <View style={{ height: 1.5, backgroundColor: mono.signRule }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <MonoText v="caps" style={{ lineHeight: 18 }}>
                {signedAt !== undefined ? `Signed ${shortDate(signedAt)}` : 'Not signed yet'}
              </MonoText>
              {vow ? <MonoText v="caps" style={{ lineHeight: 18 }}>{`Held for ${held} ${held === 1 ? 'day' : 'days'}`}</MonoText> : null}
            </View>
          </View>
          <MonoText v="p" color={mono.mute} style={{ fontSize: 14, lineHeight: 21 }}>
            {vow
              ? 'After a slip, sign it again. The vow’s day count restarts. Your progress stays.'
              : 'You haven’t signed the vow yet. Sign it when you mean it.'}
          </MonoText>
        </View>
      </ScrollRegion>

      {signedToday ? (
        // the ghost's own box and type, but not a control: a `GhostLink` is always
        // a button, so screen readers announced "Signed today, button" for a tap
        // that did nothing (D487)
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 48, zIndex: 6 }}>
          <MonoText v="ghost" center color={mono.mute}>
            Signed today
          </MonoText>
        </View>
      ) : (
        <GhostLink
          label={vow ? 'Re-sign the vow' : 'Sign the vow'}
          bottom={48}
          onPress={() => {
            setDrawn(null);
            setResignOpen(true);
          }}
        />
      )}

      {/* No frame draws what re-signing looks like; the confirmation is the
          sign-out sheet's shell, worded from this page's own lines (D294). */}
      <Sheet
        open={resignOpen}
        top={SHEET_TOP.signOut - SHEET_PAD}
        gap={10}
        onClose={() => setResignOpen(false)}
        footer={
          <>
            <PrimaryButton label={vow ? 'Sign it again' : 'Sign it'} bottom={96} sheet disabled={!drawn} onPress={() => void sign()} />
            <GhostLink label="Cancel" zIndex={42} onPress={() => setResignOpen(false)} />
          </>
        }>
        <MonoText v="h1SheetLg">{vow ? 'Re-sign the vow?' : 'Sign the vow?'}</MonoText>
        <MonoText v="p" color={mono.sub} style={{ lineHeight: 23 }}>
          {vow ? 'The vow’s day count restarts. Your progress stays.' : 'Your name goes under it, dated today.'}
        </MonoText>
        {/* he signs it with a finger (D68) */}
        {resignOpen ? <SignaturePad height={80} onChange={setDrawn} style={{ marginTop: 8 }} /> : null}
      </Sheet>
    </Screen>
  );
}
