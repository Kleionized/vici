import { useMemo, useRef, useState, type ReactNode } from 'react';
import { Alert, Platform, Text, View, useWindowDimensions, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import type { CustomerInfo } from 'react-native-purchases';

import {
  Apple,
  Card,
  CheckDisc,
  CloseX,
  EmptyState,
  GhostLink,
  H1,
  LaurelMark,
  LoadingView,
  MonoText,
  NavBar,
  P,
  PrimaryButton,
  Row,
  RowGroup,
  Screen,
  ScrollRegion,
  Sheet,
  Slack,
  Tap,
} from '@/components/mono';
import { numberWords, shortDate } from '@/lib/format';
import { useAuth } from '@/lib/auth';
import { hasLegal, openLegal } from '@/lib/legal';
import { ENTITLEMENT_ID, TIER_NAME, usePurchases, type Membership, type Plan, type PurchaseOutcome } from '@/lib/purchases';
import { cancelPlace, renewalTerms } from '@/lib/purchases/plans';
import { scheduleTrialReminder, useReminderState } from '@/lib/reminders';
import { lhNormal, mono, ring, sans } from '@/lib/theme';

/**
 * VICI paywall — `Paywall` (43), `Paywall Rescue` (11B), `Paywall Confirmed`
 * (11C), in the flat dark system.
 *
 * Paywall — the laurel lockup, the promise, two plan cards side by side (the
 * chosen one in ink with a "Save" tab on Yearly), the renewal terms under
 * them, four check discs under "What you get", Continue, and
 * "Terms · Privacy · Restore". Rescue — walking away is met ONCE by the free
 * days, as a three-step timeline; declining that really closes. Confirmed —
 * the 132 check disc and the sentence that says when the first charge lands.
 *
 * The Paywall frame draws no way out. The app keeps one (D323): the kit ✕ in
 * the nav's right slot — exactly where Rescue draws its own, so the ✕ does not
 * move between the two boards — and the top-right "Restore" it displaces lives
 * on in the footer's "Restore", which is tappable, as are "Terms" and
 * "Privacy" (B5, D452).
 *
 * Every price, cycle, saving and trial length comes from the store (B7, D456).
 * The canvas's $39.99 / $12.99 / "Save 74%" / three days are what the offline
 * catalogue serves, so the design preview still renders the frame; with
 * RevenueCat configured nothing drawn stands in for a price — the board waits
 * for the store, and says plans are unavailable if it never answers. The free
 * days are offered only to a customer the store says can take them (P6, D455),
 * and the drawn pay sheet is only reached offline: with RevenueCat configured
 * the store presents its own sheet and this one never opens.
 */

type PlanKey = 'year' | 'month' | 'trial';

/** The catalogue plan a drawn card buys. The rescue offer sells the year too. */
const CATALOGUE = { year: 'yearly', trial: 'yearly', month: 'monthly' } as const;

/** What this render draws, from the store (or, offline, from the canvas). */
interface Money {
  year: {
    price: string;
    cycle: string;
    /** "$3.33" — the store's own per-month figure, where it gives one */
    perMonth: string | null;
    /** "Save 74%", or nothing if the year saves nothing */
    saving?: string;
    /** the year's introductory offer, only where this customer can take it */
    intro: Plan['intro'];
  } | null;
  month: { price: string; cycle: string } | null;
  /** Free days on the year for this customer — null when there are none to give. */
  trialDays: number | null;
}

const CANVAS_TRIAL: NonNullable<Plan['intro']> = { priceString: '$0.00', periodLabel: '3 days', isFree: true, days: 3 };

/** The offline catalogue's numbers — the frame's own. Never used against a store. */
const DRAWN_MONEY: Money = {
  year: { price: '$39.99', cycle: '/year', perMonth: '$3.33', saving: 'Save 74%', intro: CANVAS_TRIAL },
  month: { price: '$12.99', cycle: '/month' },
  trialDays: 3,
};

/**
 * "Save 74%" (title case — the frame sets no `text-transform`) — the yearly
 * price against twelve of the monthly one, rounded the way the canvas rounds
 * it. Undefined where either price is unknown or the year is not actually the
 * cheaper of the two, so the tab never claims a saving the store is not
 * offering.
 */
export function savingBadge(yearly: number | undefined, monthly: number | undefined): string | undefined {
  if (!yearly || !monthly) return undefined;
  const full = monthly * 12;
  const pct = Math.round((1 - yearly / full) * 100);
  return pct > 0 ? `Save ${pct}%` : undefined;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** The drawn pay sheet's rows — offline only, so the canvas's numbers. */
function checkoutFor(plan: PlanKey, m: Money) {
  const now = new Date();
  const days = m.trialDays ?? 0;
  const afterTrial = new Date(now.getTime() + days * 86400000);
  const in1y = new Date(now);
  in1y.setFullYear(in1y.getFullYear() + 1);
  const in1m = new Date(now);
  in1m.setMonth(in1m.getMonth() + 1);
  const yearPrice = m.year?.price ?? '';
  const yearCycle = m.year?.cycle ?? '';
  if (plan === 'trial')
    return {
      app: `${TIER_NAME} · Yearly`,
      trial: `${days} days free, then ${yearPrice}${yearCycle}`,
      due: '$0.00',
      note: `${yearPrice} on ${fmtDate(afterTrial)} · cancel anytime`,
    };
  if (plan === 'month') return { app: `${TIER_NAME} · Monthly`, trial: null, due: m.month?.price ?? '', note: `Renews ${fmtDate(in1m)} · cancel anytime` };
  return { app: `${TIER_NAME} · Yearly`, trial: null, due: yearPrice, note: `Renews ${fmtDate(in1y)} · cancel anytime` };
}

/** The store a receipt lives with, in its own name. */
function storeName(): string {
  return Platform.OS === 'ios' ? 'App Store' : Platform.OS === 'android' ? 'Google Play' : 'store';
}

/**
 * A free trial just started: one reminder a day before it ends, asking for
 * notification permission now (the rescue promised it). Nothing happens for a
 * purchase that is not a trial, offline, or where notifications are refused.
 */
export function remindBeforeTrialEnds(outcome: PurchaseOutcome): void {
  const info: CustomerInfo | null = outcome.status === 'purchased' ? outcome.customerInfo : null;
  const entitlement = info?.entitlements.active[ENTITLEMENT_ID];
  if (entitlement?.periodType === 'TRIAL' && entitlement.willRenew && entitlement.expirationDateMillis) {
    void scheduleTrialReminder(entitlement.expirationDateMillis).catch(() => false);
  }
}

// ── shared pieces (OfferingPaywall draws the same board from an offering) ──

const SLOP = { top: 4, bottom: 4, left: 12, right: 12 };

/**
 * The ✕ in the nav's right slot — the kit's 18 `CloseX` at x 353, y 71, as
 * Rescue draws it. Its label is the old one: "Close" standalone, "Skip" inside
 * the onboarding funnel, where it moves the funnel on rather than closing.
 */
export function PwNav({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <NavBar
      left="empty"
      right={{
        node: (
          <Tap label={label} onPress={onClose} hitSlop={SLOP} style={{ width: 36, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
            <CloseX />
          </Tap>
        ),
      }}
    />
  );
}

/** The lockup at `left 24 top 66`: the 28 laurel (white, stretched) and "VICI Unlimited" 14/700. */
export function PwBrand({ eyebrow = TIER_NAME }: { eyebrow?: string }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 24, top: 66, flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 5 }}>
      <LaurelMark size={28} />
      <MonoText v="pill" wrap="nowrap" style={{ fontSize: 14, lineHeight: lhNormal(14) }}>
        {eyebrow}
      </MonoText>
    </View>
  );
}

/**
 * One plan card (`flex 1, r22, padding 20 18 18`). Chosen: the ink card with
 * `#111111` words, `rgba(17,17,17,0.6)` tagline and cycle, `rgba(17,17,17,0.7)`
 * bottom line and the dark radio holding an ink check. Not chosen: the
 * `#1E1E1E` card in its 1.5 line ring, ink words, mute small print and an
 * empty ringed radio. The frame draws Yearly chosen; Monthly chosen is the same
 * two palettes the other way round. The "Save" tab overhangs the card's top by
 * 12 and keeps its dark-pill-in-ink-ring look on either palette.
 */
export function PwPlanCard({
  on,
  onPress,
  name,
  tagline,
  price,
  cycle,
  line,
  badge,
  style,
}: {
  on: boolean;
  onPress: () => void;
  name: string;
  /** "Best value" / "Cancel anytime" */
  tagline?: string;
  price: string;
  cycle: string;
  /** "$3.33 a month" / "Billed monthly" */
  line?: string;
  /** "Save 74%" */
  badge?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const fg = on ? mono.onInk : mono.ink;
  const soft = on ? mono.onInkMuted : mono.mute;
  return (
    <Card
      variant={on ? 'selected' : 'outline'}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: on }}
      accessibilityLabel={`${name}, ${price}${cycle}`}
      style={[{ flex: 1 }, style]}>
      {badge ? (
        <View
          style={{ position: 'absolute', top: -12, left: 18, height: 24, borderRadius: 12, backgroundColor: mono.card, boxShadow: ring.outlineInk, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
          <MonoText v="pill" wrap="nowrap" style={{ fontSize: 11, lineHeight: lhNormal(11), letterSpacing: 1 }}>
            {badge}
          </MonoText>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <MonoText v="pill" style={{ flexShrink: 1, fontSize: 18, lineHeight: lhNormal(18), color: fg }}>
          {name}
        </MonoText>
        <CheckDisc size={22} state={on ? 'inverse' : 'empty'} />
      </View>
      {tagline ? (
        <MonoText v="pill" wrap="wrap" style={{ marginTop: 6, fontSize: 12, lineHeight: lhNormal(12), color: soft }}>
          {tagline}
        </MonoText>
      ) : null}
      {/* one line box: the cycle is an inline span on the price's baseline */}
      <MonoText v="pill" wrap="wrap" style={{ marginTop: 22, fontSize: 26, lineHeight: lhNormal(26), letterSpacing: -0.8, color: fg }}>
        {price}
        <MonoText v="pill" style={{ fontSize: 13, letterSpacing: 0, color: soft }}>
          {cycle}
        </MonoText>
      </MonoText>
      {line ? (
        <MonoText v="pill" wrap="wrap" style={{ marginTop: 2, color: on ? 'rgba(17,17,17,0.7)' : mono.mute }}>
          {line}
        </MonoText>
      ) : null}
    </Card>
  );
}

/** The four promises, in the frame's order. The frame breaks none of them by hand. */
export const PW_FEATURES = ['12-week plan', 'SOS help', 'Weekly insights', 'Progress tracking'] as const;

/** a feature's column at 393: (345 − 3·8) / 4 — where the frame's words break */
const FEATURE_W = (345 - 24) / 4;

/**
 * `What you get` 49 under the plans (tightening on a short phone, D406) and the
 * four 34 ink discs (row `gap 8`, columns `gap 8`), labels 12/700/16 `#B5B0A8`.
 */
export function PwFeatures({ title = 'What you get', labels = PW_FEATURES }: { title?: string; labels?: readonly string[] }) {
  // A wider phone narrows each label to the 393 column, centred, so "Weekly
  // insights" breaks with "Progress tracking" as the frame draws them instead of
  // standing on one line beside it (D404, as Yearly Drop's perks); at 393 and
  // below nothing is inset.
  const { width } = useWindowDimensions();
  const spare = (width - 48 - 24) / 4 - FEATURE_W;
  const inset = spare > 0.5 ? spare / 2 : 0;
  return (
    <>
      <Slack h={49} />
      <MonoText v="caps">{title}</MonoText>
      <View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
        {labels.map((f) => (
          <View key={f} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
            <CheckDisc size={34} />
            {/* no `text-wrap` in the frame: "Weekly insights" and "Progress tracking" wrap where the column runs out */}
            <MonoText v="pill" wrap="wrap" center style={{ alignSelf: 'stretch', marginHorizontal: inset, fontSize: 12, lineHeight: 16, color: mono.sub }}>
              {f}
            </MonoText>
          </View>
        ))}
      </View>
    </>
  );
}


/** The words in a legal line that are controls. */
const LEGAL_WORDS = /(Terms|Privacy|Restore)/;

/** The paywall's own footer, used wherever a dashboard footnote would drop Terms or Privacy (D452). */
export const LEGAL_FOOTER = 'Terms · Privacy · Restore';

/**
 * A legal line — "Terms · Privacy · Restore" or any run carrying those words.
 * "Terms" opens the Terms of Use, "Privacy" the privacy policy (each through
 * `openLegal`, B5), "Restore" calls `onRestore`. It is drawn as one run, so
 * the centred words never re-kern at a seam, and the same line again over it
 * in transparent ink carries the pressable spans (transparent rather than
 * opacity 0, which iOS drops from VoiceOver). A word with nowhere to go — the
 * privacy policy before its URL is set, Restore with no handler — stays words.
 */
export function PwLegal({
  text = LEGAL_FOOTER,
  onRestore,
  v = 'legal',
  style,
}: {
  text?: string;
  onRestore?: () => void;
  /** `legal` — the paywall's 12/700 footer; `ghost` — the 15/400 line a ghost link sits on */
  v?: 'legal' | 'ghost';
  style?: StyleProp<TextStyle>;
}) {
  const parts = text.split(LEGAL_WORDS);
  const action = (word: string): (() => void) | undefined => {
    if (word === 'Terms') return () => void openLegal('terms');
    if (word === 'Privacy') return hasLegal('privacy') ? () => void openLegal('privacy') : undefined;
    if (word === 'Restore') return onRestore;
    return undefined;
  };
  const controls = parts.some((p) => LEGAL_WORDS.test(p) && action(p));
  return (
    <View pointerEvents="box-none">
      <MonoText v={v} center style={style} accessibilityElementsHidden={controls} importantForAccessibility={controls ? 'no-hide-descendants' : 'auto'} aria-hidden={controls || undefined}>
        {text}
      </MonoText>
      {controls ? (
        <MonoText v={v} center color="transparent" style={[style, { position: 'absolute', left: 0, right: 0, top: 0 }]}>
          {parts.map((part, i) => {
            const onPress = LEGAL_WORDS.test(part) ? action(part) : undefined;
            return onPress ? (
              <Text key={i} onPress={onPress} accessibilityRole="link" suppressHighlighting>
                {part}
              </Text>
            ) : (
              part
            );
          })}
        </MonoText>
      ) : null}
    </View>
  );
}

/**
 * The footer at `bottom 52`, 12/700 ls 0.4 mute: "Terms · Privacy · Restore".
 * "Restore" is the control the top-right word used to be (D323). A dashboard
 * footnote is used only when it still names Terms and Privacy — a subscription
 * screen without both is a rejection (App Store 3.1.2).
 */
export function PwFooter({ text, onRestore }: { text?: string; onRestore: () => void }) {
  const line = text && /Terms/.test(text) && /Privacy/.test(text) ? text : LEGAL_FOOTER;
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 52, zIndex: 6 }}>
      <PwLegal text={line} onRestore={onRestore} />
    </View>
  );
}

/**
 * The renewal terms under the plans (B5, D452): one or two lines of the
 * footer's mute, left on the cards' edge. Not in the frame — the store asks
 * for it beside the purchase.
 */
export function PwTerms({ children, style }: { children: string; style?: StyleProp<TextStyle> }) {
  return (
    <MonoText v="legal" wrap="wrap" style={[{ marginTop: 16, letterSpacing: 0, lineHeight: 16 }, style]}>
      {children}
    </MonoText>
  );
}

/** The pill (82 off the edge) and the footer under it take 140 off the screen's bottom. */
const PAYWALL_CONTROLS = 82 + 58;

/**
 * `Paywall`'s board, in canvas coordinates: the ✕, the lockup, then the stack
 * from 130 in flow — title and sub (gap 14), the plan row at 318, the renewal
 * terms, "What you get" at 520, the discs at 552. On a phone too short to hold
 * it, the three open gaps (above the title, the plans and "What you get")
 * tighten first, so a 667 phone shows the whole board with its discs; only
 * what that cannot cover scrolls between the nav row and the pill (D320,
 * D406). `plans` is the card row; `terms` the line under it.
 */
export function PwBoard({
  closeLabel,
  onClose,
  eyebrow,
  headline = 'Take your life back.',
  plans,
  terms,
  benefitsTitle,
  benefits,
  cta = 'Continue',
  onCta,
  footnote,
  onRestore,
}: {
  closeLabel: string;
  onClose: () => void;
  eyebrow?: string;
  headline?: string;
  plans: ReactNode;
  /** the auto-renewal line for the chosen plan */
  terms?: string;
  benefitsTitle?: string;
  benefits?: readonly string[];
  cta?: string;
  onCta: () => void;
  footnote?: string;
  onRestore: () => void;
}) {
  return (
    <>
      <PwNav label={closeLabel} onClose={onClose} />
      <PwBrand eyebrow={eyebrow} />
      <ScrollRegion top={100} bottom={PAYWALL_CONTROLS} contentStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Slack h={30} min={16} />
        <View style={{ gap: 14 }}>
          <MonoText v="titleCover">{headline}</MonoText>
          <P>Get your self-control back. Become someone you can trust again.</P>
        </View>
        {/* 318 − (130 + 40 + 14 + 48) */}
        <Slack h={86} />
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 24 }}>
          {plans}
        </View>
        {terms ? <PwTerms>{terms}</PwTerms> : null}
        <PwFeatures title={benefitsTitle} labels={benefits} />
      </ScrollRegion>
      <PrimaryButton label={cta} bottom={82} onPress={onCta} />
      <PwFooter text={footnote} onRestore={onRestore} />
    </>
  );
}

/**
 * No frame draws a store that did not answer. The paywall's own ground — the
 * ✕, the lockup, the footer — around the kit's empty state, and "Try again"
 * where Continue stands. Nothing drawn stands in for a price (B7, D456).
 */
export function PwUnavailable({ closeLabel, onClose, onRetry, onRestore }: { closeLabel: string; onClose: () => void; onRetry: () => Promise<void> | void; onRestore: () => void }) {
  const [trying, setTrying] = useState(false);
  const retry = () => {
    if (trying) return;
    setTrying(true);
    void Promise.resolve(onRetry()).finally(() => setTrying(false));
  };
  return (
    <Screen>
      <PwNav label={closeLabel} onClose={onClose} />
      <PwBrand />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 100, bottom: PAYWALL_CONTROLS, justifyContent: 'center' }}>
        <EmptyState title="Plans aren’t available right now." body="The store didn’t answer. Check your connection and try again. Nothing has been charged." />
      </View>
      <PrimaryButton label={trying ? 'Trying…' : 'Try again'} bottom={82} disabled={trying} onPress={retry} />
      <PwFooter onRestore={onRestore} />
    </Screen>
  );
}

// ═════ PAYWALL ═══════════════════════════════════════════════════════
function PwMain({
  plan,
  setPlan,
  onPay,
  onClose,
  onRestore,
  closeLabel,
  money,
}: {
  plan: PlanKey;
  setPlan: (p: PlanKey) => void;
  onPay: () => void;
  onClose: () => void;
  onRestore: () => void;
  closeLabel: string;
  money: Money;
}) {
  const { year, month } = money;
  // the line names what Continue buys — the year carries its free days, if any
  const terms =
    plan === 'month' && month
      ? renewalTerms({ priceString: month.price, cycle: month.cycle })
      : year
        ? renewalTerms({ priceString: year.price, cycle: year.cycle, intro: year.intro })
        : undefined;
  return (
    <PwBoard
      closeLabel={closeLabel}
      onClose={onClose}
      onCta={onPay}
      onRestore={onRestore}
      eyebrow={TIER_NAME}
      terms={terms}
      plans={
        <>
          {year ? (
            <PwPlanCard
              on={plan === 'year'}
              onPress={() => setPlan('year')}
              name="Yearly"
              tagline="Best value"
              price={year.price}
              cycle={year.cycle}
              line={year.perMonth ? `${year.perMonth} a month` : undefined}
              badge={year.saving}
            />
          ) : null}
          {month ? (
            <PwPlanCard
              on={plan === 'month'}
              onPress={() => setPlan('month')}
              name="Monthly"
              tagline="Cancel anytime"
              price={month.price}
              cycle={month.cycle}
              line="Billed monthly"
            />
          ) : null}
        </>
      }
    />
  );
}

// ═════ RESCUE: the free days, shown once when he walks ═══════════════
/**
 * The timeline's connector: `flex 1; border-left 2px dashed #5A574F; margin
 * 6px 0` under the disc. On web the border is the frame's own, so Chrome fits
 * the same dashes to the run (6 / 4 / 6 over 16); native cannot dash one side
 * of a box, so there it is an SVG line with the 6 4 pattern.
 */
function Connector() {
  if (Platform.OS === 'web') return <View style={{ flex: 1, marginVertical: 6, borderLeftWidth: 2, borderStyle: 'dashed', borderColor: mono.art }} />;
  return (
    <View style={{ flex: 1, marginVertical: 6, width: 2 }}>
      <Svg width={2} height="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
        <Line x1={1} y1={0} x2={1} y2="100%" stroke={mono.art} strokeWidth={2} strokeDasharray="6 4" />
      </Svg>
    </View>
  );
}

/** The three days: today in ink with a check, then two ringed dark discs. */
function TimelineRow({ first, last, children }: { first?: boolean; last?: boolean; children: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <View style={{ width: 22, alignItems: 'center', flexShrink: 0 }}>
        {first ? (
          <CheckDisc size={22} />
        ) : (
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: mono.card, boxShadow: ring.outlineInk }} />
        )}
        {last ? null : <Connector />}
      </View>
      {/* no `text-wrap`: "…unless you" / "cancel" breaks where the box runs out */}
      <MonoText
        v="p"
        wrap="wrap"
        style={{ flex: 1, paddingBottom: last ? 0 : 26, fontSize: 16, lineHeight: 24, color: mono.ink, ...(first ? sans('700') : null) }}>
        {children}
      </MonoText>
    </View>
  );
}

/** The pill at 96 over the ghost link takes 154 off the screen's bottom. */
const RESCUE_CONTROLS = 96 + 58;

function PwRescue({ onStart, onNo, closeLabel, money, remind }: { onStart: () => void; onNo: () => void; closeLabel: string; money: Money; remind: boolean }) {
  const days = money.trialDays ?? 0;
  const year = money.year;
  const then = year ? `${year.price}${year.cycle}` : '';
  return (
    <>
      <PwNav label={closeLabel} onClose={onNo} />
      {/* title at 257, rows at 367 — in flow, so a short phone scrolls instead of meeting the pill */}
      <ScrollRegion top={100} bottom={RESCUE_CONTROLS} contentStyle={{ paddingTop: 157, paddingHorizontal: 24, paddingBottom: 24 }}>
        {/* the frame balances after the first clause; the break is written in so
            native (which cannot balance) and every width break there too */}
        <H1>{`Before you go,\n${numberWords(days)} ${days === 1 ? 'day' : 'days'} free.`}</H1>
        <View style={{ marginTop: 44 }}>
          <TimelineRow first>Today: full access</TimelineRow>
          <TimelineRow>{remind ? `Day ${days - 1}: a reminder before any charge` : `Until day ${days}: cancel in ${cancelPlace()} and pay nothing`}</TimelineRow>
          <TimelineRow last>{`Day ${days}: ${then} starts unless you cancel`}</TimelineRow>
        </View>
        {/* the renewal terms and both documents, beside the purchase (B5, D452) */}
        {year ? <PwTerms style={{ marginTop: 28 }}>{renewalTerms({ priceString: year.price, cycle: year.cycle, intro: year.intro })}</PwTerms> : null}
        <PwLegal text="Terms · Privacy" style={{ marginTop: 10, textAlign: 'left' }} />
      </ScrollRegion>
      <PrimaryButton label="Start free trial" bottom={96} onPress={onStart} />
      <GhostLink label="No thanks" onPress={onNo} />
    </>
  );
}

// ═════ THE PAYMENT — the drawn pay sheet (offline only) ══════════════
/**
 * No frame draws it: offline there is no store, so this stands in for the
 * system purchase sheet. It is the kit sheet (`#171717` panel over the scrim)
 * rather than an imitation of Apple's light one — the system face and hues it
 * used are gone from the app (D224). Its rows, the sum and "Confirm with Side
 * Button" keep their words. A release build never draws it (D450).
 */
function PwPaySheet({ open, plan, email, money, onCancel, onPay }: { open: boolean; plan: PlanKey; email: string; money: Money; onCancel: () => void; onPay: () => void }) {
  const C = checkoutFor(plan, money);
  // 44 + head 28 + 12 + rows (54 + 55 each after) + 12 + note 20, ending 24 above the pill at 698
  const rows = C.trial ? 6 : 5;
  const top = 698 - 24 - (44 + 28 + 12 + 54 + 55 * (rows - 1) + 12 + 20);
  return (
    <Sheet
      open={open}
      top={top}
      onClose={onCancel}
      footer={
        <>
          <PrimaryButton label="Confirm with Side Button" bottom={96} sheet onPress={onPay} />
          <GhostLink label="Cancel" zIndex={42} onPress={onCancel} />
        </>
      }>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Apple color={mono.ink} />
        <MonoText v="h1Sheet">Pay</MonoText>
      </View>
      <RowGroup>
        <Row label="App" value={C.app} chevron={false} />
        {C.trial ? <Row label="Trial" value={C.trial} chevron={false} valueLines={1} /> : null}
        <Row label="Account" value={email} chevron={false} valueLines={1} />
        <Row label="Payment" value="Visa •••• 4271" chevron={false} />
        <Row label="Billing" value="Apple ID" chevron={false} />
        <Row label="Due today" value={C.due} chevron={false} />
      </RowGroup>
      <MonoText v="p" wrap="wrap" style={{ fontSize: 14, lineHeight: 20, color: mono.mute }}>
        {C.note}
      </MonoText>
    </Sheet>
  );
}

// ═════ CONFIRMED ═════════════════════════════════════════════════════
/** The pill at 82 and the receipt line under it take 140 off the screen's bottom. */
const CONFIRMED_CONTROLS = 82 + 58;

/** `Jul 24` with a no-break space, so the date stays whole on a wider phone. */
function chargeDay(d: Date): string {
  return shortDate(d).replace(' ', ' ');
}

/**
 * The sentence under "You're in", from what the store says this customer now
 * has — the trial's real end, the plan actually bought or restored — rather
 * than from the card that happened to be selected (P6, D457).
 */
function storeLine(m: Membership): string {
  const lead = 'The work starts now.';
  if (!m.isActive) return `${lead} You have full access.`;
  if (m.periodType === 'TRIAL' && m.expiresAt) {
    return m.willRenew
      ? `${lead} Nothing is charged until ${chargeDay(m.expiresAt)}. Cancel anytime in ${cancelPlace()}.`
      : `${lead} Your free days run until ${chargeDay(m.expiresAt)}.`;
  }
  if (m.plan === 'lifetime' || !m.expiresAt) return `${lead} You have full access, for good.`;
  if (m.plan === 'monthly') return `${lead} You have full access, month to month.`;
  return `${lead} You have full access until ${m.expiresAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;
}

/** Offline: the canvas's sentence for the card bought, dated from today. */
function drawnLine(plan: PlanKey, money: Money, now: Date): string {
  const lead = 'The work starts now.';
  if (plan === 'trial') {
    const charge = chargeDay(new Date(now.getTime() + (money.trialDays ?? 0) * 86400000));
    // a no-break space keeps the date whole: a wider phone otherwise splits it
    return `${lead} Nothing is charged until ${charge}. Cancel anytime in Settings.`;
  }
  if (plan === 'month') return `${lead} You have full access, month to month.`;
  const nextYear = new Date(now);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  return `${lead} You have full access until ${nextYear.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;
}

function PwConfirmed({ line, name, confirmLabel, onDone }: { line: string; name?: string; confirmLabel: string; onDone: () => void }) {
  return (
    <>
      <NavBar left="empty" right="empty" />
      {/* the disc at 266 and the stack at 436, in flow (D320) */}
      <ScrollRegion top={100} bottom={CONFIRMED_CONTROLS} contentStyle={{ paddingTop: 166, paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <CheckDisc size={132} />
        </View>
        <View style={{ marginTop: 38, gap: 18, alignItems: 'center' }}>
          <H1 center style={{ alignSelf: 'stretch' }}>
            {name ? `You’re in, ${name}.` : 'You’re in.'}
          </H1>
          <P center style={{ alignSelf: 'stretch' }}>
            {line}
          </P>
        </View>
      </ScrollRegion>
      <PrimaryButton label={confirmLabel} bottom={82} onPress={onDone} />
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 52 }}>
        {/* the app sends no receipt — the store keeps it (P6, D457) */}
        <MonoText v="legal" center wrap="wrap" style={{ letterSpacing: 0, paddingHorizontal: 24 }}>
          {`Your receipt is in your ${storeName()} purchase history.`}
        </MonoText>
      </View>
    </>
  );
}

// ═════ THE FLOW ══════════════════════════════════════════════════════
export function PaywallFlow({
  name,
  triggers: _triggers = [],
  emotions: _emotions = [],
  load: _load,
  confirmLabel = 'Begin',
  embedded = false,
  onDone,
}: {
  /** First name from the intake — personalizes the confirmed page. */
  name?: string;
  /** Their triggers — kept for call-site compatibility with the funnel. */
  triggers?: string[];
  /** The feeling underneath — kept for call-site compatibility. */
  emotions?: string[];
  /** Their chosen daily load — kept for call-site compatibility. */
  load?: string;
  confirmLabel?: string;
  /** Inside the onboarding shell: the ✕ skips the funnel rather than closing. */
  embedded?: boolean;
  /** Called when the funnel ends — purchased true/false. */
  onDone: (purchased: boolean) => void;
}) {
  const purchases = usePurchases();
  const { email } = useAuth();
  const [plan, setPlan] = useState<PlanKey>('year');
  const [checkout, setCheckout] = useState<PlanKey | null>(null);
  const [offer, setOffer] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [done, setDone] = useState(false);
  const [offered, setOffered] = useState(false);
  const [doneAt, setDoneAt] = useState<Date | null>(null);
  const closeLabel = embedded ? 'Skip' : 'Close';
  const mock = purchases.mode === 'mock';

  const year = purchases.planFor('yearly');
  const month = purchases.planFor('monthly');
  const money = useMemo<Money | null>(() => {
    if (mock) return DRAWN_MONEY;
    if (!year && !month) return null;
    const freeDays = year?.intro?.isFree ? year.intro.days : null;
    return {
      year: year
        ? {
            price: year.priceString,
            cycle: year.cycle,
            perMonth: year.pricePerMonthString,
            // worked out from this store's own two prices, and withheld where
            // the year is not in fact cheaper — never the canvas's 74 (B7)
            saving: savingBadge(year.pkg?.product.price, month?.pkg?.product.price),
            intro: year.intro,
          }
        : null,
      month: month ? { price: month.priceString, cycle: month.cycle } : null,
      trialDays: freeDays && freeDays > 0 ? freeDays : null,
    };
  }, [mock, year, month]);

  /**
   * The rescue page promises free days, so it only appears where this
   * customer has free days to take: offline, where the canvas supplies them,
   * and where the store's yearly product carries a free introductory offer the
   * customer is eligible for (on iOS, the store's own ELIGIBLE — P6). Without
   * one, ✕ closes on the first press — the same path the canvas gives a
   * second press.
   */
  const hasTrial = !!money?.trialDays;
  // The rescue's "a reminder, before any charge" is a promise the phone has to
  // keep: made only where this build can send one, notifications are allowed
  // or the OS will still ask for them, and the trial is long enough to fit it
  // (the design preview keeps the frame's row). Someone who has blocked
  // notifications gets the "cancel in Settings, nothing is charged" row.
  const reminders = useReminderState();
  const remind = mock || (reminders.available && (reminders.permission === 'granted' || reminders.canAskAgain) && (money?.trialDays ?? 0) >= 2);
  // A card the store does not sell cannot be the chosen one.
  const chosen: PlanKey = plan === 'year' && !money?.year ? 'month' : plan === 'month' && !money?.month ? 'year' : plan;

  // One store sheet at a time: a second press while the first is open would
  // queue a second purchase behind it.
  const busy = useRef(false);

  const finish = () => {
    setDoneAt(new Date());
    setDone(true);
  };

  async function buy(which: PlanKey) {
    if (busy.current) return;
    busy.current = true;
    const outcome = await purchases.purchase(CATALOGUE[which]);
    busy.current = false;
    setSheet(false);
    if (outcome.status === 'purchased' || (outcome.status === 'restored' && outcome.entitled)) {
      remindBeforeTrialEnds(outcome);
      finish();
      return;
    }
    if (outcome.status === 'cancelled' || outcome.status === 'restored') return;
    Alert.alert('Purchase failed', outcome.message);
  }

  /** The paywall's Continue and the rescue's pill both start here. */
  function start(which: PlanKey) {
    setCheckout(which);
    // Offline there is no store, so the drawn sheet stands in for one; with
    // RevenueCat configured the store presents its own and this never opens.
    if (mock) {
      setSheet(true);
      return;
    }
    void buy(which);
  }

  async function restore() {
    if (busy.current) return;
    busy.current = true;
    const outcome = await purchases.restore();
    busy.current = false;
    if (outcome.status === 'restored') {
      if (outcome.entitled) {
        // the confirmation reads what came back, not the selected card (P6)
        setCheckout(null);
        finish();
      } else {
        Alert.alert('Nothing to restore', `This store account has no ${TIER_NAME} purchase on it.`);
      }
      return;
    }
    if (outcome.status === 'cancelled' || outcome.status === 'purchased') return;
    Alert.alert('Could not restore', outcome.message);
  }

  // walking away gets one rescue: the free days, where there are any
  const decline = () => {
    if (!offered && hasTrial) {
      setOffered(true);
      setOffer(true);
      return;
    }
    onDone(false);
  };

  // With a store configured, nothing is drawn until it has answered — and if
  // it never does, the board says so instead of showing sample prices (B7).
  if (!done && !money) {
    if (!purchases.ready && !purchases.error) return <LoadingView onClose={() => onDone(false)} />;
    return <PwUnavailable closeLabel={closeLabel} onClose={() => onDone(false)} onRetry={() => purchases.refresh()} onRestore={() => void restore()} />;
  }

  const confirmedLine = mock ? drawnLine(checkout || chosen, DRAWN_MONEY, doneAt ?? new Date()) : storeLine(purchases.membership);

  return (
    <Screen>
      {done ? (
        <PwConfirmed line={confirmedLine} name={name} confirmLabel={confirmLabel} onDone={() => onDone(true)} />
      ) : offer && money ? (
        <PwRescue closeLabel={closeLabel} money={money} remind={remind} onStart={() => start('trial')} onNo={() => onDone(false)} />
      ) : money ? (
        <PwMain plan={chosen} setPlan={setPlan} closeLabel={closeLabel} money={money} onPay={() => start(chosen)} onClose={decline} onRestore={() => void restore()} />
      ) : null}
      {done || !money || !mock ? null : (
        <PwPaySheet open={sheet} plan={checkout || chosen} email={email ?? 'your Apple ID'} money={money} onCancel={() => setSheet(false)} onPay={() => void buy(checkout || chosen)} />
      )}
    </Screen>
  );
}
