import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, View, useWindowDimensions } from 'react-native';

import { Check, EmptyState, GhostLink, HeroBoard, LoadingView, MedalTier, MonoText, NavBar, PrimaryButton, Screen, ScrollRegion, Slack } from '@/components/mono';
import { PwLegal, PwTerms, remindBeforeTrialEnds } from '@/components/paywall/PaywallFlow';
import { DROP_OFFERING_ID, TIER_NAME, usePurchases, type Plan } from '@/lib/purchases';
import { renewalTerms } from '@/lib/purchases/plans';
import { lhNormal, mono } from '@/lib/theme';

/**
 * The yearly drop — `39C · Post — The Yearly Drop` → `39D · You Received a Drop`.
 *
 * The enclosure that comes with the medallion post: the whole year for one
 * payment. The offer is a plain board — the title, the one price card (the
 * year, its saving, the monthly sum, three things it buys), the renewal terms
 * and `Unlock my year` over `Terms · Privacy · Restore`. Once it is claimed the
 * year arrives as the platinum tier medal with its V, on the post's own hero
 * board.
 *
 * The frame draws no way out of the offer. The ✕ takes the nav's right slot
 * (D323) — where Paywall puts its own and where the claimed board keeps it, so
 * it does not move between the three. The `Restore` it displaces lives on in
 * the footer, beside Terms and Privacy, each its own link (B5, D452).
 *
 * Every figure is the store's (B7, D456): the price, cycle and per-month sum
 * are the `drop` offering's yearly package; the struck price and the saving
 * are worked out against the default offering's yearly, and left out where
 * either is unknown or the drop is not cheaper. Without a `drop` offering the
 * board says the offer is unavailable — it never sells the full-price year
 * under the drop's words. A member is told so rather than sold the year twice,
 * and the offer waits until the store has said whether this customer is one
 * (`membershipKnown`); if the store can't say, the board reads as unavailable.
 */

const NAV_BOTTOM = 100;
/** the primary at bottom 96 and its 58 */
const CONTROLS = 154;
/** what the offer keeps clear above the pill when it scrolls (D320) */
const CLEAR = 24;
/** a perk's cell at 393: (345 − 2·22 − 2·10) / 3 — where the frame breaks its words */
const PERK_W = (345 - 44 - 20) / 3;

type Phase = 'offer' | 'claimed' | 'member';

/** A plan's amount as a number: the store's, or (offline only) read off the drawn string. */
function amountOf(plan: Plan | null, mock: boolean): number | undefined {
  if (!plan) return undefined;
  if (plan.pkg) return plan.pkg.product.price;
  if (!mock) return undefined;
  const n = Number.parseFloat(plan.priceString.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : undefined;
}

export default function Drop() {
  const router = useRouter();
  const { ready, error, mode, isPremium, membershipKnown, planIn, planFor, purchase, restore, refresh } = usePurchases();
  const [phase, setPhase] = useState<Phase>('offer');
  const [claiming, setClaiming] = useState(false);
  const busy = useRef(false);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const toSubscription = () => router.replace('/subscription');

  const drop = planIn(DROP_OFFERING_ID, 'yearly');
  const full = planFor('yearly');
  const mock = mode === 'mock';
  const dropAmount = amountOf(drop, mock);
  const fullAmount = amountOf(full, mock);
  const cheaper = !!full && dropAmount !== undefined && fullAmount !== undefined && dropAmount < fullAmount;
  const pct = cheaper ? Math.round((1 - (dropAmount as number) / (fullAmount as number)) * 100) : 0;

  const claim = () => {
    if (busy.current) return;
    busy.current = true;
    setClaiming(true);
    void (async () => {
      const outcome = await purchase('yearly', DROP_OFFERING_ID);
      busy.current = false;
      if (outcome.status === 'purchased') {
        remindBeforeTrialEnds(outcome);
        setPhase('claimed');
      } else if (outcome.status === 'error' || outcome.status === 'unavailable') {
        Alert.alert('The store could not complete that', outcome.message);
      }
      setClaiming(false);
    })();
  };

  const restorePurchases = () => {
    if (busy.current) return;
    busy.current = true;
    void (async () => {
      const outcome = await restore();
      busy.current = false;
      if (outcome.status === 'restored') {
        // a restore brings back what was bought — not a drop received today
        if (outcome.entitled) setPhase('member');
        else Alert.alert('Nothing to restore', `This store account has no ${TIER_NAME} purchase on it.`);
        return;
      }
      if (outcome.status === 'error' || outcome.status === 'unavailable') Alert.alert('Could not restore', outcome.message);
    })();
  };

  const medal = (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 212, alignItems: 'center' }}>
      <MedalTier tier={4} size={176} glyph="V" disc={false} />
    </View>
  );

  if (phase === 'claimed') {
    return (
      <HeroBoard
        nav={{ left: 'empty', right: 'close', onClose: close }}
        art={medal}
        artTop={212}
        stackTop={432}
        caps="The year"
        title="You received a drop."
        body="One drop covers the year — twelve months of VICI. It renews yearly until you cancel."
        cta="Continue"
        onCta={close}
        ghost="See the receipt"
        onGhost={toSubscription}
      />
    );
  }

  // Already a member — or a restore just said so: nothing to sell.
  if (phase === 'member' || (isPremium && !claiming)) {
    return (
      <HeroBoard
        nav={{ left: 'empty', right: 'close', onClose: close }}
        art={medal}
        artTop={212}
        stackTop={432}
        caps="The year"
        title="You’re already a member."
        body={`${TIER_NAME} is active on this account, so there is nothing to claim.`}
        cta="Continue"
        onCta={close}
        ghost="Manage subscription"
        onGhost={toSubscription}
      />
    );
  }

  // The year is sold only to someone the store has said is not already a
  // member: while it is still being asked, wait; if it cannot say, the offer
  // is not shown.
  if ((!ready || !membershipKnown) && !error) return <LoadingView onClose={close} />;

  if (!drop || !membershipKnown) {
    return (
      <Screen>
        <NavBar left="empty" right="close" onClose={close} />
        <View style={{ position: 'absolute', left: 0, right: 0, top: NAV_BOTTOM, bottom: CONTROLS, justifyContent: 'center' }}>
          <EmptyState title="This offer isn’t available right now." body="The store didn’t return it. It may have ended, or the connection dropped. Nothing has been charged." />
        </View>
        <PrimaryButton label="Try again" bottom={96} onPress={() => void refresh()} />
        <GhostLink label="Not now" onPress={close} />
      </Screen>
    );
  }

  return (
    <Screen>
      {/* between the nav and the pill the offer scrolls on a phone too short for it (D320) —
          after the 75 over the title has closed to 16, so a 667 phone reads the perks (D406) */}
      <ScrollRegion top={NAV_BOTTOM} bottom={CONTROLS}>
        <Slack h={175 - NAV_BOTTOM} min={16} />
        <View style={{ height: 610 + CLEAR - 175 }}>
          <View style={{ position: 'absolute', left: 24, right: 24, top: 0, alignItems: 'center', gap: 12 }}>
            {/* the frame breaks the title itself (`<br>`) */}
            <MonoText v="title" center style={{ alignSelf: 'stretch' }}>
              {'One decision.\nA year of change.'}
            </MonoText>
            <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
              Unlock everything VICI has to offer for an entire year.
            </MonoText>
          </View>
          <PriceCard
            top={325 - 175}
            price={drop.priceString}
            cycle={drop.cycle}
            struck={cheaper ? full?.priceString : undefined}
            saving={pct > 0 ? `Save ${pct}%` : undefined}
            perMonth={drop.pricePerMonthString}
          />
        </View>
        {/* the renewal terms, beside the purchase (B5, D452) */}
        <PwTerms style={{ marginTop: 0, marginHorizontal: 24, textAlign: 'center' }}>
          {renewalTerms({ priceString: drop.priceString, cycle: drop.cycle, intro: drop.intro })}
        </PwTerms>
      </ScrollRegion>
      <NavBar left="empty" right="close" onClose={close} />
      <PrimaryButton label="Unlock my year" onPress={claim} disabled={claiming} bottom={96} />
      {/* the ghost's line, its three words each a link */}
      <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 60, zIndex: 6 }}>
        <PwLegal v="ghost" text="Terms · Privacy · Restore" onRestore={restorePurchases} />
      </View>
    </Screen>
  );
}

/**
 * The price card: `r24 #1E1E1E padding 22 22 24`, a `gap 18` column — the caps
 * and the "Save" tab; the price on a shared baseline with "/ year" and the
 * struck full price; the monthly sum; and three check discs under a hairline.
 * The tab, the struck price and the monthly sum each appear only where the
 * store gives the figure.
 */
function PriceCard({ top, price, cycle, struck, saving, perMonth }: { top: number; price: string; cycle: string; struck?: string; saving?: string; perMonth: string | null }) {
  // A wider phone narrows each perk's words to the 393 cell, centred, so they
  // keep the frame's two-line breaks; at 393 and below nothing is inset.
  const { width } = useWindowDimensions();
  const spare = (width - 48 - 44 - 20) / 3 - PERK_W;
  const perkInset = spare > 0.5 ? spare / 2 : 0;
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, borderRadius: 24, backgroundColor: mono.card, paddingTop: 22, paddingHorizontal: 22, paddingBottom: 24, gap: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 28 }}>
        <MonoText v="caps" style={{ flex: 1 }}>
          Yearly access
        </MonoText>
        {saving ? (
          <View style={{ height: 28, borderRadius: 14, backgroundColor: mono.ink, paddingHorizontal: 12, justifyContent: 'center' }}>
            <MonoText v="pill" color={mono.onInk} style={{ fontSize: 12, lineHeight: lhNormal(12) }}>
              {saving}
            </MonoText>
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <MonoText v="titlePage" wrap="wrap" style={{ fontSize: 44, lineHeight: 48, letterSpacing: -1.6 }}>
          {price}
        </MonoText>
        <MonoText v="pill" color={mono.mute} style={{ fontSize: 16, lineHeight: lhNormal(16) }}>
          {cycle.replace('/', '/ ')}
        </MonoText>
        {struck ? (
          <MonoText v="pill" color={mono.art} style={{ fontSize: 16, lineHeight: lhNormal(16), textDecorationLine: 'line-through' }}>
            {struck}
          </MonoText>
        ) : null}
      </View>
      {perMonth ? (
        <MonoText v="rowLabel" wrap="wrap" color={mono.sub}>
          {`That’s ${perMonth} a month.`}
        </MonoText>
      ) : null}
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
