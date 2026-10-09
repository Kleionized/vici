import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { PurchasesOffering } from 'react-native-purchases';

import { LoadingView, Screen } from '@/components/mono';
import { PW_FEATURES, PaywallFlow, PwBoard, PwPlanCard, remindBeforeTrialEnds } from '@/components/paywall/PaywallFlow';
import { TIER_NAME, usePurchases } from '@/lib/purchases';
import { bestValueId, renewalTerms, type PackageView } from '@/lib/purchases/plans';
import { offeringCopy } from '@/lib/purchases/metadata';

/**
 * The offering paywall — `Paywall`, drawn from whatever the RevenueCat
 * offering contains.
 *
 * `PaywallFlow` is the canvas: two cards, two prices, three days, all pinned to
 * the frame they were drawn at. This is the same board with none of that fixed
 * — it renders every package the offering carries, in the dashboard's own
 * order, names each one from its package type rather than its identifier, takes
 * prices, cycles and introductory offers from the store, and takes its
 * headline, tagline, call to action and footnote from the offering's metadata
 * where the dashboard sets any. Adding a six-month plan, reordering the cards,
 * changing a price, or A/B testing the copy is then a dashboard change and not
 * a release.
 *
 * It draws the frame's own board (`PwBoard`), so an offering with the two
 * packages VICI sells reproduces it to the point (D152). One package takes the
 * full width; three or more wrap two to a row, 24 apart so the "Save" tab
 * that overhangs a card by 12 clears the card above it (D223). Every string
 * still has the canvas's own word behind it, so an offering with no metadata
 * renders the paywall as drawn. With no packages at all — offline, or an
 * offering that failed to load — it hands back to `PaywallFlow`, which says
 * plans are unavailable rather than showing an empty board or sample prices.
 * Under the cards, the chosen package's renewal terms; in the footer, Terms,
 * Privacy and Restore (B5, D452). An intro offer shows only where the
 * customer can take it (P6, D455).
 */

/**
 * The card's tagline, in this order: the dashboard's badge for the package,
 * "Best value" on the best one, the introductory offer if the customer is
 * eligible for one, else "Cancel anytime" — the frame's two words (a lifetime
 * package takes the store's description instead).
 */
function taglineFor(view: PackageView, badge: string | undefined): string {
  if (badge) return badge;
  if (view.intro) {
    const period = view.intro.periodLabel;
    if (view.intro.isFree) return period ? `${period} free` : 'Free to start';
    return period ? `${view.intro.priceString} for ${period}` : view.intro.priceString;
  }
  // a one-time purchase has nothing to cancel: the store's own description, if any
  return view.isLifetime ? view.description : 'Cancel anytime';
}

/**
 * The card's bottom line: the comparable monthly price where it says something
 * the headline price does not ("$3.33 a month"), "Billed monthly" on a monthly
 * plan, and the store's own description otherwise.
 */
function lineFor(view: PackageView): string | undefined {
  if (view.pricePerMonthString && view.cycle !== '/month') return `${view.pricePerMonthString} a month`;
  if (view.cycle === '/month') return 'Billed monthly';
  return view.isLifetime ? undefined : view.description || undefined;
}

/**
 * "Save 74%", worked out rather than written: the cheapest package's monthly
 * cost against the dearest one's, rounded the way the canvas rounds it.
 * Withheld unless there are two comparable prices and this card is the cheaper.
 */
function savingFor(view: PackageView, views: PackageView[]): string | undefined {
  const mine = view.pricePerMonth;
  if (typeof mine !== 'number') return undefined;
  const dearest = views.reduce<number | null>((a, v) => (typeof v.pricePerMonth === 'number' && (a === null || v.pricePerMonth > a) ? v.pricePerMonth : a), null);
  if (dearest === null || dearest <= mine) return undefined;
  const pct = Math.round((1 - mine / dearest) * 100);
  return pct > 0 ? `Save ${pct}%` : undefined;
}

export function OfferingPaywall({
  name,
  confirmLabel,
  embedded = false,
  placement,
  onDone,
}: {
  name?: string;
  confirmLabel?: string;
  /** Inside the onboarding shell: the ✕ skips the funnel rather than closing. */
  embedded?: boolean;
  /**
   * A RevenueCat placement identifier, when this paywall is shown at a named
   * point in the app. Falls back to the current offering where the placement
   * resolves to nothing — `/paywall` is opened by a deliberate tap, so showing
   * nothing at all would strand the customer.
   */
  placement?: string;
  onDone: (purchased: boolean) => void;
}) {
  const purchases = usePurchases();

  const [placed, setPlaced] = useState<PurchasesOffering | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const busy = useRef(false);

  const { offeringForPlacement } = purchases;
  useEffect(() => {
    if (!placement) return;
    let live = true;
    void offeringForPlacement(placement).then((offering) => {
      if (live) setPlaced(offering);
    });
    return () => {
      live = false;
    };
  }, [placement, offeringForPlacement]);

  const { packagesIn } = purchases;
  const views = useMemo(() => (placed ? packagesIn(placed) : purchases.packages), [placed, packagesIn, purchases.packages]);
  const copy = useMemo(() => (placed ? offeringCopy(placed) : purchases.copy), [placed, purchases.copy]);
  const best = useMemo(() => bestValueId(views), [views]);

  // The dashboard names the card to open on; failing that, the best value; and
  // failing that, whatever the offering lists first.
  const selectedId = chosen ?? (copy.defaultPackage && views.some((v) => v.id === copy.defaultPackage) ? copy.defaultPackage : (best ?? views[0]?.id ?? null));
  const selected = views.find((v) => v.id === selectedId) ?? views[0] ?? null;

  if (!purchases.ready && !purchases.error) return <LoadingView onClose={() => onDone(false)} />;
  // Nothing to sell here — the drawn paywall's "unavailable" board is a better answer than an empty one.
  if (!views.length || !selected) return <PaywallFlow name={name} confirmLabel={confirmLabel} embedded={embedded} onDone={onDone} />;

  async function buy() {
    if (busy.current || !selected) return;
    busy.current = true;
    const outcome = await purchases.purchasePackage(selected.pkg);
    busy.current = false;
    if (outcome.status === 'purchased' || (outcome.status === 'restored' && outcome.entitled)) {
      remindBeforeTrialEnds(outcome);
      return onDone(true);
    }
    if (outcome.status === 'cancelled' || outcome.status === 'restored') return;
    Alert.alert('The store could not complete that', outcome.message);
  }

  async function restore() {
    if (busy.current) return;
    busy.current = true;
    const outcome = await purchases.restore();
    busy.current = false;
    if (outcome.status === 'restored') {
      if (outcome.entitled) return onDone(true);
      Alert.alert('Nothing to restore', `This store account has no ${TIER_NAME} purchase on it.`);
      return;
    }
    if (outcome.status === 'cancelled' || outcome.status === 'purchased') return;
    Alert.alert('Could not restore', outcome.message);
  }

  // The four discs relabel only from a list of exactly four; a dashboard list
  // written for the old board carries `\n` breaks the new labels do not draw.
  const labels = copy.benefits?.length === PW_FEATURES.length ? copy.benefits.map((b) => b.replace(/\s*\n\s*/g, ' ')) : undefined;
  // Two to a row from three cards on; an odd last card takes the row.
  const wrap = views.length > 2;

  return (
    <Screen>
      <PwBoard
        closeLabel={embedded ? 'Skip' : 'Close'}
        onClose={() => onDone(false)}
        eyebrow={copy.eyebrow ?? undefined}
        headline={copy.headline ?? undefined}
        benefitsTitle={copy.benefitsTitle ?? undefined}
        benefits={labels}
        cta={copy.cta ?? undefined}
        terms={renewalTerms({ priceString: selected.priceString, cycle: selected.cycle, isLifetime: selected.isLifetime, intro: selected.intro })}
        onCta={() => void buy()}
        footnote={copy.footnote ?? undefined}
        onRestore={() => void restore()}
        plans={views.map((view) => {
          const badge = copy.badges[view.id] ?? (view.id === best ? 'Best value' : undefined);
          return (
            <PwPlanCard
              key={view.id}
              on={view.id === selected.id}
              onPress={() => setChosen(view.id)}
              name={view.name}
              tagline={taglineFor(view, badge)}
              price={view.priceString}
              cycle={view.cycle}
              line={lineFor(view)}
              badge={view.id === best ? savingFor(view, views) : undefined}
              style={wrap ? { flexBasis: '40%', flexGrow: 1 } : null}
            />
          );
        })}
      />
    </Screen>
  );
}
