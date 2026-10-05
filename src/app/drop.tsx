import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View, useWindowDimensions } from 'react-native';

import { Check, GhostLink, HeroBoard, MedalTier, MonoText, NavBar, PrimaryButton, Screen, ScrollRegion } from '@/components/mono';
import { useUpdateSettings } from '@/lib/backend';
import { DROP_OFFERING_ID, usePurchases } from '@/lib/purchases';
import { setJSON } from '@/lib/storage';
import { lhNormal, mono } from '@/lib/theme';

/**
 * The yearly drop — `39C · Post — The Yearly Drop` → `39D · You Received a Drop`.
 *
 * The enclosure that comes with the medallion post: the whole year for one
 * payment. The offer is a plain board — the title, the one price card (the
 * year, its saving, the monthly sum, three things it buys) and `Unlock my year`
 * over `Terms · Restore`. Once it is claimed the year arrives as the platinum
 * tier medal with its V, on the post's own hero board.
 *
 * The frame draws no way out of the offer. The ✕ takes the nav's right slot
 * (D323) — where Paywall puts its own and where the claimed board keeps it, so
 * it does not move between the three — and leaving marks the drop seen as the
 * old close did. The `Restore` it displaces lives on in the ghost's
 * `Terms · Restore`, which restores (D323, D276).
 *
 * Claiming buys the year from the `drop` offering — the same yearly product at
 * the enclosure's price. A dashboard with no such offering falls back to the
 * current one, so the drop still sells the year rather than failing shut.
 */

const DROP_SEEN_KEY = 'tideline.post.yearlydrop.seen';

const FULL_PRICE = '$39.99';
const DROP_PRICE = '$26.99';
/** the drop price over twelve months, as the card says it */
const MONTHLY = '$2.25';

const NAV_BOTTOM = 100;
/** the primary at bottom 96 and its 58 */
const CONTROLS = 154;
/** what the offer keeps clear above the pill when it scrolls (D320) */
const CLEAR = 24;
/** a perk's cell at 393: (345 − 2·22 − 2·10) / 3 — where the frame breaks its words */
const PERK_W = (345 - 44 - 20) / 3;

type Phase = 'offer' | 'claimed';

export default function Drop() {
  const router = useRouter();
  const updateSettings = useUpdateSettings();
  const { purchase, restore } = usePurchases();
  const [phase, setPhase] = useState<Phase>('offer');

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  const later = () => {
    void setJSON(DROP_SEEN_KEY, Date.now());
    close();
  };

  const claim = () => {
    void (async () => {
      await setJSON(DROP_SEEN_KEY, Date.now());
      const outcome = await purchase('yearly', DROP_OFFERING_ID);
      if (outcome.status === 'cancelled') return;
      if (outcome.status === 'error' || outcome.status === 'unavailable') {
        Alert.alert('The store could not complete that', outcome.message);
        return;
      }
      // Kept for the record: which price the year was taken at.
      await updateSettings({ yearlyDrop: true }).catch(() => {});
      setPhase('claimed');
    })();
  };

  const restorePurchases = () => {
    void (async () => {
      const outcome = await restore();
      if (outcome.status === 'restored') {
        if (outcome.entitled) {
          await setJSON(DROP_SEEN_KEY, Date.now());
          setPhase('claimed');
          return;
        }
        Alert.alert('Nothing to restore', 'This store account has no VICI purchase on it.');
        return;
      }
      if (outcome.status === 'error' || outcome.status === 'unavailable') Alert.alert('Could not restore', outcome.message);
    })();
  };

  if (phase === 'claimed') {
    return (
      <HeroBoard
        nav={{ left: 'empty', right: 'close', onClose: close }}
        art={
          <View style={{ position: 'absolute', left: 0, right: 0, top: 212, alignItems: 'center' }}>
            <MedalTier tier={4} size={176} glyph="V" disc={false} />
          </View>
        }
        artTop={212}
        stackTop={432}
        caps="The year"
        title="You received a drop."
        body="One drop covers the year — twelve months of VICI, billed once."
        cta="Continue"
        onCta={close}
        ghost="See the receipt"
        onGhost={() => router.replace('/subscription')}
      />
    );
  }

  const y = (canvas: number) => canvas - NAV_BOTTOM;
  return (
    <Screen>
      {/* between the nav and the pill the offer scrolls on a phone too short for it (D320) */}
      <ScrollRegion top={NAV_BOTTOM} bottom={CONTROLS}>
        <View style={{ height: 610 + CLEAR - NAV_BOTTOM }}>
          <View style={{ position: 'absolute', left: 24, right: 24, top: y(175), alignItems: 'center', gap: 12 }}>
            {/* the frame breaks the title itself (`<br>`) */}
            <MonoText v="title" center style={{ alignSelf: 'stretch' }}>
              {'One decision.\nA year of change.'}
            </MonoText>
            <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
              Unlock everything VICI has to offer for an entire year.
            </MonoText>
          </View>
          <PriceCard top={y(325)} />
        </View>
      </ScrollRegion>
      <NavBar left="empty" right="close" onClose={later} />
      <PrimaryButton label="Unlock my year" onPress={claim} bottom={96} />
      <GhostLink label="Terms · Restore" onPress={restorePurchases} />
    </Screen>
  );
}

/**
 * The price card: `r24 #1E1E1E padding 22 22 24`, a `gap 18` column — the caps
 * and the "Save 74%" tab; the price on a shared baseline with "/ year" and the
 * struck full price; the monthly sum; and three check discs under a hairline.
 */
function PriceCard({ top }: { top: number }) {
  // A wider phone narrows each perk's words to the 393 cell, centred, so they
  // keep the frame's two-line breaks; at 393 and below nothing is inset.
  const { width } = useWindowDimensions();
  const spare = (width - 48 - 44 - 20) / 3 - PERK_W;
  const perkInset = spare > 0.5 ? spare / 2 : 0;
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, borderRadius: 24, backgroundColor: mono.card, paddingTop: 22, paddingHorizontal: 22, paddingBottom: 24, gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <MonoText v="caps" style={{ flex: 1 }}>
          Yearly access
        </MonoText>
        <View style={{ height: 28, borderRadius: 14, backgroundColor: mono.ink, paddingHorizontal: 12, justifyContent: 'center' }}>
          <MonoText v="pill" color={mono.onInk} style={{ fontSize: 12, lineHeight: lhNormal(12) }}>
            Save 74%
          </MonoText>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
        <MonoText v="titlePage" wrap="wrap" style={{ fontSize: 44, lineHeight: 48, letterSpacing: -1.6 }}>
          {DROP_PRICE}
        </MonoText>
        <MonoText v="pill" color={mono.mute} style={{ fontSize: 16, lineHeight: lhNormal(16) }}>
          / year
        </MonoText>
        <MonoText v="pill" color={mono.art} style={{ fontSize: 16, lineHeight: lhNormal(16), textDecorationLine: 'line-through' }}>
          {FULL_PRICE}
        </MonoText>
      </View>
      <MonoText v="rowLabel" wrap="wrap" color={mono.sub}>
        {`That’s ${MONTHLY} a month.`}
      </MonoText>
      <View style={{ flexDirection: 'row', gap: 10, paddingTop: 16, borderTopWidth: 1, borderTopColor: mono.line }}>
        {['Full 12-week programme', 'SOS support anytime', 'Track your progress'].map((perk) => (
          <View key={perk} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
              <Check size={13} />
            </View>
            <MonoText v="legal" wrap="wrap" center color={mono.sub} style={{ letterSpacing: 0, lineHeight: 17, alignSelf: 'stretch', marginHorizontal: perkInset }}>
              {perk}
            </MonoText>
          </View>
        ))}
      </View>
    </View>
  );
}
