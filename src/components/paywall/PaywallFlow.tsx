import { useMemo, useRef, useState, type ReactNode } from 'react';
import { Alert, Platform, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import {
  Apple,
  Card,
  CheckDisc,
  CloseX,
  GhostLink,
  H1,
  LaurelMark,
  MonoText,
  NavBar,
  P,
  PrimaryButton,
  Row,
  RowGroup,
  Screen,
  ScrollRegion,
  Sheet,
  Tap,
} from '@/components/mono';
import { numberWords, shortDate } from '@/lib/format';
import { useAuth } from '@/lib/auth';
import { usePurchases } from '@/lib/purchases';
import { lhNormal, mono, ring, sans } from '@/lib/theme';

/**
 * VICI paywall — `Paywall` (43), `Paywall Rescue` (11B), `Paywall Confirmed`
 * (11C), in the flat dark system.
 *
 * Paywall — the laurel lockup, the promise, two plan cards side by side (the
 * chosen one in ink with a "Save 74%" tab on Yearly), four check discs under
 * "What you get", Continue, and "Terms · Restore". Rescue — walking away is
 * met ONCE by the free days, as a three-step timeline; declining that really
 * closes. Confirmed — the 132 check disc and the sentence that says when the
 * first charge lands.
 *
 * The Paywall frame draws no way out. The app keeps one (D323): the kit ✕ in
 * the nav's right slot — exactly where Rescue draws its own, so the ✕ does not
 * move between the two boards — and the top-right "Restore" it displaces lives
 * on in the footer's "Restore", which is now tappable.
 *
 * Every price, cycle and trial length is read from the offering rather than
 * drawn in — the canvas's $39.99 / $12.99 / three days are what the offline
 * catalogue serves, so the frame still renders exactly, while a real store
 * shows the customer their own currency and their own introductory offer. The
 * drawn pay sheet is likewise only reached offline: with RevenueCat configured
 * the store presents its own sheet and this one never opens.
 */

type PlanKey = 'year' | 'month' | 'trial';

/** The catalogue plan a drawn card buys. The rescue offer sells the year too. */
const CATALOGUE = { year: 'yearly', trial: 'yearly', month: 'monthly' } as const;

/**
 * The prices this render draws, resolved from the offering with the canvas's
 * own numbers as the fallback.
 */
interface Money {
  yearPrice: string;
  yearCycle: string;
  yearPerMonth: string;
  /** The tab on the yearly card — "Save 74%", or nothing if it saves nothing. */
  yearSaving?: string;
  monthPrice: string;
  monthCycle: string;
  /** Length of the yearly plan's introductory offer, in days. */
  trialDays: number;
}

const DRAWN_MONEY: Money = { yearPrice: '$39.99', yearCycle: '/year', yearPerMonth: '$3.33', yearSaving: 'Save 74%', monthPrice: '$12.99', monthCycle: '/month', trialDays: 3 };

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
function checkoutFor(plan: PlanKey, m: Money) {
  const now = new Date();
  const afterTrial = new Date(now.getTime() + m.trialDays * 86400000);
  const in1y = new Date(now);
  in1y.setFullYear(in1y.getFullYear() + 1);
  const in1m = new Date(now);
  in1m.setMonth(in1m.getMonth() + 1);
  if (plan === 'trial')
    return {
      app: 'VICI Plus · Yearly',
      trial: `${m.trialDays} days free, then ${m.yearPrice}${m.yearCycle}`,
      due: '$0.00',
      note: `${m.yearPrice} on ${fmtDate(afterTrial)} · cancel anytime`,
    };
  if (plan === 'month') return { app: 'VICI Plus · Monthly', trial: null, due: m.monthPrice, note: `Renews ${fmtDate(in1m)} · cancel anytime` };
  return { app: 'VICI Plus · Yearly', trial: null, due: m.yearPrice, note: `Renews ${fmtDate(in1y)} · cancel anytime` };
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
export function PwBrand({ eyebrow = 'VICI Unlimited' }: { eyebrow?: string }) {
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

/** `What you get` and the four 34 ink discs (row `gap 8`, columns `gap 8`), labels 12/700/16 `#B5B0A8`. */
export function PwFeatures({ title = 'What you get', labels = PW_FEATURES }: { title?: string; labels?: readonly string[] }) {
  return (
    <>
      <MonoText v="caps" style={{ marginTop: 49 }}>
        {title}
      </MonoText>
      <View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
        {labels.map((f) => (
          <View key={f} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
            <CheckDisc size={34} />
            {/* no `text-wrap` in the frame: "Weekly insights" and "Progress tracking" wrap where the column runs out */}
            <MonoText v="pill" wrap="wrap" center style={{ alignSelf: 'stretch', fontSize: 12, lineHeight: 16, color: mono.sub }}>
              {f}
            </MonoText>
          </View>
        ))}
      </View>
    </>
  );
}

/**
 * "Terms · Restore", 12/700 ls 0.4 mute at `bottom 52`. "Restore" is the
 * control the top-right word used to be (D323); "Terms" has no destination in
 * the app and stays words. Any other footnote is drawn as text.
 */
export function PwFooter({ text = 'Terms · Restore', onRestore }: { text?: string; onRestore: () => void }) {
  const at = text.lastIndexOf('Restore');
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 52, zIndex: 6 }}>
      {/* drawn as one run: splitting it into spans re-kerns the line at the
          seam and moves the centred words by a fraction of a point */}
      <MonoText v="legal" center accessibilityElementsHidden={at >= 0} importantForAccessibility={at >= 0 ? 'no-hide-descendants' : 'auto'} aria-hidden={at >= 0 || undefined}>
        {text}
      </MonoText>
      {at < 0 ? null : (
        // the same line again over it in transparent ink: its "Restore" span is the
        // control (transparent rather than opacity 0, which iOS drops from VoiceOver)
        <MonoText v="legal" center color="transparent" style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
          {text.slice(0, at)}
          <Text onPress={onRestore} accessibilityRole="link" suppressHighlighting>
            Restore
          </Text>
          {text.slice(at + 'Restore'.length)}
        </MonoText>
      )}
    </View>
  );
}

/** The pill (82 off the edge) and the footer under it take 140 off the screen's bottom. */
const PAYWALL_CONTROLS = 82 + 58;

/**
 * `Paywall`'s board, in canvas coordinates: the ✕, the lockup, then the stack
 * from 130 in flow — title and sub (gap 14), the plan row at 318, "What you
 * get" at 520, the discs at 552 — which scrolls between the nav row and the
 * pill only on a phone too short to hold it (D320). `plans` is the card row.
 */
export function PwBoard({
  closeLabel,
  onClose,
  eyebrow,
  headline = 'Take your life back.',
  plans,
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
      <ScrollRegion top={100} bottom={PAYWALL_CONTROLS} contentStyle={{ paddingTop: 30, paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={{ gap: 14 }}>
          <MonoText v="titleCover">{headline}</MonoText>
          <P>Break the cycle, rebuild your self-control, and become someone you can trust again.</P>
        </View>
        {/* 318 − (130 + 40 + 14 + 48) */}
        <View accessibilityRole="radiogroup" style={{ marginTop: 86, flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 24 }}>
          {plans}
        </View>
        <PwFeatures title={benefitsTitle} labels={benefits} />
      </ScrollRegion>
      <PrimaryButton label={cta} bottom={82} onPress={onCta} />
      <PwFooter text={footnote} onRestore={onRestore} />
    </>
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
  return (
    <PwBoard
      closeLabel={closeLabel}
      onClose={onClose}
      onCta={onPay}
      onRestore={onRestore}
      plans={
        <>
          <PwPlanCard
            on={plan === 'year'}
            onPress={() => setPlan('year')}
            name="Yearly"
            tagline="Best value"
            price={money.yearPrice}
            cycle={money.yearCycle}
            line={`${money.yearPerMonth} a month`}
            badge={money.yearSaving}
          />
          <PwPlanCard
            on={plan === 'month'}
            onPress={() => setPlan('month')}
            name="Monthly"
            tagline="Cancel anytime"
            price={money.monthPrice}
            cycle={money.monthCycle}
            line="Billed monthly"
          />
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

function PwRescue({ onStart, onNo, closeLabel, money }: { onStart: () => void; onNo: () => void; closeLabel: string; money: Money }) {
  const days = money.trialDays;
  return (
    <>
      <PwNav label={closeLabel} onClose={onNo} />
      {/* title at 257, rows at 367 — in flow, so a short phone scrolls instead of meeting the pill */}
      <ScrollRegion top={100} bottom={RESCUE_CONTROLS} contentStyle={{ paddingTop: 157, paddingHorizontal: 24, paddingBottom: 24 }}>
        {/* the frame balances after the em dash; the break is written in so
            native (which cannot balance) and every width break there too */}
        <H1>{`Before you go —\n${numberWords(days)} days on us.`}</H1>
        <View style={{ marginTop: 44 }}>
          <TimelineRow first>Today — everything unlocks</TimelineRow>
          <TimelineRow>{`Day ${days - 1} — a reminder, before any charge`}</TimelineRow>
          <TimelineRow last>{`Day ${days} — ${money.yearPrice}${money.yearCycle} begins, unless you cancel`}</TimelineRow>
        </View>
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
 * Button" keep their words.
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

function PwConfirmed({ plan, name, email, money, confirmLabel, onDone }: { plan: PlanKey; name?: string; email: string; money: Money; confirmLabel: string; onDone: () => void }) {
  const [now] = useState(() => new Date());
  const charge = shortDate(new Date(now.getTime() + money.trialDays * 86400000)).replace(' ', '\u00A0');
  const nextYear = new Date(now);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const line =
    plan === 'trial'
      ? // no-break spaces keep "Jul 24 —" whole: a wider phone otherwise splits the date or opens a line on the dash
        `Let’s take the first ground. Nothing is charged until ${charge}\u00A0— cancelling is one tap in Settings.`
      : plan === 'month'
        ? `Let’s take the first ground. The campaign is unlocked, month by month.`
        : `Let’s take the first ground. The whole campaign is yours until ${nextYear.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;
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
            {name ? `We’re in, ${name}.` : 'We’re in.'}
          </H1>
          <P center style={{ alignSelf: 'stretch' }}>
            {line}
          </P>
        </View>
      </ScrollRegion>
      <PrimaryButton label={confirmLabel} bottom={82} onPress={onDone} />
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 52 }}>
        <MonoText v="legal" center wrap="wrap" style={{ letterSpacing: 0, paddingHorizontal: 24 }}>
          {`Receipt sent to ${email}`}
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
  const closeLabel = embedded ? 'Skip' : 'Close';
  const receipt = email ?? 'your Apple ID';

  const year = purchases.planFor('yearly');
  const month = purchases.planFor('monthly');
  const money = useMemo<Money>(
    () => ({
      yearPrice: year?.priceString ?? DRAWN_MONEY.yearPrice,
      yearCycle: year?.cycle || DRAWN_MONEY.yearCycle,
      yearPerMonth: year?.pricePerMonthString ?? DRAWN_MONEY.yearPerMonth,
      // The canvas's "Save 74%" is $39.99 against twelve months at $12.99, so
      // it is arithmetic and not a slogan: against a real store it is worked
      // out from that store's own two prices, and withheld where the year is
      // not in fact cheaper.
      yearSaving: savingBadge(year?.pkg?.product.price, month?.pkg?.product.price) ?? DRAWN_MONEY.yearSaving,
      monthPrice: month?.priceString ?? DRAWN_MONEY.monthPrice,
      monthCycle: month?.cycle || DRAWN_MONEY.monthCycle,
      trialDays: year?.intro?.days ?? DRAWN_MONEY.trialDays,
    }),
    [year, month],
  );

  /**
   * The rescue page promises free days, so it only appears where free days
   * exist: offline, where the canvas supplies them, and against a store whose
   * yearly product carries an introductory offer. Without one, ✕ closes on the
   * first press — the same path the canvas gives a second press.
   */
  const hasTrial = purchases.mode === 'mock' || !!year?.intro?.isFree;

  // One store sheet at a time: a second press while the first is open would
  // queue a second purchase behind it.
  const busy = useRef(false);

  async function buy(which: PlanKey) {
    if (busy.current) return;
    busy.current = true;
    const outcome = await purchases.purchase(CATALOGUE[which]);
    busy.current = false;
    setSheet(false);
    if (outcome.status === 'purchased' || (outcome.status === 'restored' && outcome.entitled)) {
      setDone(true);
      return;
    }
    if (outcome.status === 'cancelled' || outcome.status === 'restored') return;
    Alert.alert('The store could not complete that', outcome.message);
  }

  /** The paywall's Continue and the rescue's pill both start here. */
  function start(which: PlanKey) {
    setCheckout(which);
    // Offline there is no store, so the drawn sheet stands in for one; with
    // RevenueCat configured the store presents its own and this never opens.
    if (purchases.mode === 'mock') {
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
        setCheckout(plan);
        setDone(true);
      } else {
        Alert.alert('Nothing to restore', 'This store account has no VICI Plus purchase on it.');
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

  return (
    <Screen>
      {done ? (
        <PwConfirmed plan={checkout || plan} name={name} email={receipt} money={money} confirmLabel={confirmLabel} onDone={() => onDone(true)} />
      ) : offer ? (
        <PwRescue closeLabel={closeLabel} money={money} onStart={() => start('trial')} onNo={() => onDone(false)} />
      ) : (
        <PwMain plan={plan} setPlan={setPlan} closeLabel={closeLabel} money={money} onPay={() => start(plan)} onClose={decline} onRestore={() => void restore()} />
      )}
      {done ? null : (
        <PwPaySheet open={sheet} plan={checkout || plan} email={receipt} money={money} onCancel={() => setSheet(false)} onPay={() => void buy(checkout || plan)} />
      )}
    </Screen>
  );
}
