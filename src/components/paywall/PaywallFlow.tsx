import { LinearGradient } from 'expo-linear-gradient';
import { useId, useState } from 'react';
import { Platform, Pressable, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, Grain, PressScale } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useUpdateSettings } from '@/lib/backend';
import { fonts, sans } from '@/lib/theme';

/**
 * VICI Plus paywall (canvas 103 · 104 · 105).
 *
 * 103 — a 296-tall drawn headland band dissolving into paper, the mark, and the
 * two plan rows where the chosen plan floods dark ($39.99/yr · $12.99/mo, no
 * trial up front). 104 — pressing ✕ is rescued ONCE by the three-day offer;
 * declining that really closes. 105 — the paper confirmation.
 *
 * Laid out from the canvas's 393 × 852 frame: the status bar ends at 54, so
 * every canvas `top` below is written as `top − 54` under the safe area.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

type PlanKey = 'year' | 'month' | 'trial';

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
/** The confirmed page names the charge day without a year — "until Jul 24". */
function fmtShort(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function checkoutFor(plan: PlanKey) {
  const now = new Date();
  const in3 = new Date(now.getTime() + 3 * 86400000);
  const in1y = new Date(now);
  in1y.setFullYear(in1y.getFullYear() + 1);
  const in1m = new Date(now);
  in1m.setMonth(in1m.getMonth() + 1);
  if (plan === 'trial') return { app: 'VICI Plus · Yearly', trial: `3 days free, then $39.99/year`, due: '$0.00', note: `$39.99 on ${fmtDate(in3)} · cancel anytime` };
  if (plan === 'month') return { app: 'VICI Plus · Monthly', trial: null, due: '$12.99', note: `Renews ${fmtDate(in1m)} · cancel anytime` };
  return { app: 'VICI Plus · Yearly', trial: null, due: '$39.99', note: `Renews ${fmtDate(in1y)} · cancel anytime` };
}

// ── small shared pieces ──────────────────────────────────────────────
/** The 34pt close disc. `minHeight: 0` keeps PressScale from inflating it to 44. */
function PwX({ onPress, label, fill, ring }: { onPress: () => void; label: string; fill: string; ring: string }) {
  return (
    <PressScale
      onPress={onPress}
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: 34, height: 34, minHeight: 0, borderRadius: 17, backgroundColor: fill, boxShadow: `0 0 0 1px ${ring}`, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={15} height={15} viewBox="0 0 20 20">
        <Path d="M3 3l14 14M17 3L3 17" stroke="#1D1C1A" strokeWidth={2.4} strokeLinecap="round" />
      </Svg>
    </PressScale>
  );
}

// 103's pill states no letter-spacing and 104/105's states 0.2, so tracking
// stays undefined here rather than being forced to 0 — AppText only keeps the
// variant's inherited tracking when a caller asks for one.
function PwCTA({ label, onPress, height, radius, size, tracking }: { label: string; onPress: () => void; height: number; radius: number; size: number; tracking?: number }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={{ height, borderRadius: radius, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
      <AppText style={[sans('600'), { fontSize: size, letterSpacing: tracking, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

// ── the header band — a drawn coast, not a photograph ────────────────
/**
 * Every offset the canvas gives this band is a percentage of its own box, so
 * the whole composition is recomputed against the real frame rather than
 * pinned to the 393 × 296 it was drawn at.
 */
function PwHeaderArt({ w, h }: { w: number; h: number }) {
  const glow = useId().replace(/:/g, '');
  // the sun's halo: radial-gradient(closest-side, rgba(243,227,196,0.95), transparent 78%)
  const gx = 0.74 * w;
  const gy = 0.18 * h;
  // the low sun sits inside a 40 × 26 box scaled to 11% of the frame width
  const s = (0.11 * w) / 40;
  const hill = (left: number, right: number, top: number, ryPct: number) => {
    const x1 = left * w;
    const x2 = right * w;
    const rx = (x2 - x1) / 2;
    const ry = ryPct * 0.8 * h;
    const cy = top * h + ry;
    const bottom = top * h + 0.8 * h;
    return `M ${x1} ${cy} A ${rx} ${ry} 0 0 1 ${x2} ${cy} L ${x2} ${bottom} L ${x1} ${bottom} Z`;
  };
  return (
    <Svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs>
        <RadialGradient id={glow} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#F3E3C4" stopOpacity={0.95} />
          <Stop offset="0.78" stopColor="#F3E3C4" stopOpacity={0} />
          <Stop offset="1" stopColor="#F3E3C4" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={gx} cy={gy} rx={0.22 * w} ry={0.22 * h} fill={`url(#${glow})`} />
      <Rect x={0.08 * w} y={0.12 * h} width={0.16 * w} height={0.05 * h} rx={0.025 * h} fill="#FFFFFF" opacity={0.7} />
      <Rect x={0.74 * w} y={0.2 * h} width={0.12 * w} height={0.04 * h} rx={0.02 * h} fill="#FFFFFF" opacity={0.55} />
      <Circle cx={0.58 * w + 20 * s} cy={0.3 * h + 13 * s} r={9 * s} fill="#E9D2A4" />
      <Path d={hill(-0.2, 1.2, 0.48, 0.6)} fill="#DEDDD6" />
      <Path d={hill(-0.42, 1.1, 0.62, 0.52)} fill="#C8D7E5" />
      <Path d={hill(-0.1, 1.42, 0.78, 0.46)} fill="#C0BFB8" />
    </Svg>
  );
}

/** The warm floor light on the rescue and confirmed pages: a 560 circle whose
 * centre hangs 300 below the frame. Each frame names both of its own stops —
 * 104 is 0.3 → 0.13, 105 is 0.44 → 0.2 — so the mid is passed in rather than
 * derived from the peak, which would put 105 at 0.1907. */
function PwFloorGlow({ peak, mid }: { peak: number; mid: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <View style={{ position: 'absolute', left: '50%', bottom: -300, marginLeft: -280, width: 560, height: 560 }} pointerEvents="none">
      {/* positioned, not static: on web a bare <Svg> paints under every
          absolutely-positioned sibling regardless of document order */}
      <Svg width={560} height={560} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFECC4" stopOpacity={peak} />
            <Stop offset="0.45" stopColor="#FFECC4" stopOpacity={mid} />
            <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
            <Stop offset="1" stopColor="#FFECC4" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={280} cy={280} r={280} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

// ── the plan row — 76 tall, the chosen one floods ink ────────────────
function PwPlanRow({
  active,
  onPress,
  name,
  badge,
  sub,
  price,
  cycle,
  top,
}: {
  active: boolean;
  onPress: () => void;
  name: string;
  badge?: string;
  sub: string;
  price: string;
  cycle: string;
  top: number;
}) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: active }}
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top,
        height: 76,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 18,
        backgroundColor: active ? '#131313' : '#FFFFFF',
        boxShadow: active ? undefined : '0 0 0 1px rgba(0,0,0,0.08)',
      }}>
      {active ? (
        <View style={{ width: 23, height: 23, borderRadius: 11.5, backgroundColor: '#F4F3F0', alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path d="M4 12l5 5L20 6" stroke="#131313" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      ) : (
        <View style={{ width: 23, height: 23, borderRadius: 11.5, borderWidth: 2, borderColor: 'rgba(0,0,0,0.18)' }} />
      )}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppText style={[sans('500'), { fontSize: 15, color: active ? '#F5F4F1' : '#1D1C1A' }]}>{name}</AppText>
          {/* the canvas only ever draws this badge on the ink row; off ink it
              borrows the unselected radio's hairline so it stays legible */}
          {badge ? (
            <View style={{ borderWidth: 1, borderColor: active ? 'rgba(245,244,241,0.4)' : 'rgba(0,0,0,0.18)', borderRadius: 9, paddingHorizontal: 8, paddingVertical: 3 }}>
              <AppText style={[sans('500'), { fontSize: 12.5, color: active ? '#F5F4F1' : '#1D1C1A' }]}>{badge}</AppText>
            </View>
          ) : null}
        </View>
        <AppText style={[sans('400'), { marginTop: 3, fontSize: 13, color: active ? 'rgba(245,244,241,0.62)' : '#8B8882' }]}>{sub}</AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText style={[sans('500'), { fontSize: 16, color: active ? '#F5F4F1' : '#1D1C1A' }]}>{price}</AppText>
        <AppText style={[sans('400'), { fontSize: 12, color: active ? 'rgba(245,244,241,0.45)' : '#8B8882' }]}>{cycle}</AppText>
      </View>
    </PressScale>
  );
}

/** The four promises, two to a row: 165 wide boxes at canvas y 560 and 610,
 * pinned to the canvas's own columns at x 18 and x 208. */
const PW_BENEFITS = [
  'Progress that never resets',
  'Full curriculum, every week',
  'Unlimited urge support',
  'Insights & weekly reports',
];

function PwBenefit({ text, top, left }: { text: string; top: number; left: number }) {
  return (
    <View style={{ position: 'absolute', top, left, width: 165, flexDirection: 'row', alignItems: 'flex-start', gap: 9 }}>
      <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" style={{ marginTop: 2.5 }}>
        <Path d="M4 12.5l4.8 4.8L20 6.5" stroke="#1D1C1A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <AppText style={[sans('400'), { flex: 1, fontSize: 13.5, lineHeight: 18, color: '#55534E' }]}>{text}</AppText>
    </View>
  );
}

// ═════ 103 — THE PLANS ═══════════════════════════════════════════════
function PwMain({ plan, setPlan, onPay, onClose, closeLabel }: { plan: PlanKey; setPlan: (p: PlanKey) => void; onPay: () => void; onClose: () => void; closeLabel: string }) {
  return (
    <View style={{ flex: 1 }}>
      {/* the paper the band dissolves into, drawn over its last 8px seam */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 234, height: 38, backgroundColor: '#F4F3F0' }} />

      <View style={{ position: 'absolute', left: 20, top: 12 }}>
        <PwX onPress={onClose} label={closeLabel} fill="rgba(19,19,19,0.06)" ring="rgba(0,0,0,0.18)" />
      </View>
      <AppText style={[sans('500'), { position: 'absolute', right: 20, top: 20, fontSize: 14, color: '#55534E' }]}>Restore</AppText>

      <View style={{ position: 'absolute', left: 20, top: 174, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        <AppText style={{ fontFamily: fonts.quote, fontSize: 15, fontWeight: '500', letterSpacing: 4, color: '#1D1C1A' }}>VICI</AppText>
        <View style={{ backgroundColor: '#131313', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 }}>
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 1, color: '#F4F3F0' }]}>PLUS</AppText>
        </View>
      </View>
      <AppText style={[sans('500'), { position: 'absolute', left: 20, right: 80, top: 206, fontSize: 28, letterSpacing: -0.2, lineHeight: 36, color: '#1D1C1A' }]}>
        The long road, together
      </AppText>

      <PwPlanRow active={plan === 'year'} onPress={() => setPlan('year')} name="Yearly" badge="Best value" sub="$3.33 a month" price="$39.99" cycle="/year" top={276} />
      <PwPlanRow active={plan === 'month'} onPress={() => setPlan('month')} name="Monthly" sub="Cancel anytime" price="$12.99" cycle="/month" top={364} />

      <AppText style={[sans('600'), { position: 'absolute', left: 18, top: 476, fontSize: 12.5, color: '#8B8882' }]}>Everything, unlocked</AppText>
      <PwBenefit text={PW_BENEFITS[0]} top={506} left={18} />
      <PwBenefit text={PW_BENEFITS[1]} top={506} left={208} />
      <PwBenefit text={PW_BENEFITS[2]} top={556} left={18} />
      <PwBenefit text={PW_BENEFITS[3]} top={556} left={208} />

      <View style={{ position: 'absolute', left: 16, right: 16, top: 630 }}>
        <PwCTA label={plan === 'month' ? 'Continue — $12.99/month' : 'Continue — $39.99/year'} onPress={onPay} height={52} radius={26} size={16.5} />
      </View>
      <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 702, fontSize: 13, color: '#8B8882' }]}>
        {'Terms  ·  Restore'}
      </AppText>
    </View>
  );
}

// ═════ 104 — THE RESCUE: three days free, shown once when he walks ═══
function OfferIcon({ k, c }: { k: string; c: string }) {
  if (k === 'today')
    return (
      <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
        <Path d="M7.5 10.5V7a4.5 4.5 0 0 1 8.6-1.8" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Rect x={4.4} y={10} width={15.2} height={10.5} rx={2.6} stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
        <Path d="M12 14v2.6" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  if (k === 'day2')
    return (
      <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.4a5.8 5.8 0 0 1 5.8 5.8v3.6l1.7 2.4a1 1 0 0 1-.8 1.6H5.3a1 1 0 0 1-.8-1.6l1.7-2.4V9.2A5.8 5.8 0 0 1 12 3.4z" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10 19.6a2.2 2.2 0 0 0 4 0" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={5.5} width={17} height={13.5} rx={2.6} stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M3.5 9.5h17" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M7 15h4" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/** The three days, at canvas y 300 / 396 / 492 — a 96 pitch, not a stack. */
const PW_OFFER: [string, string, number][] = [
  ['today', 'Today — everything unlocks', 246],
  ['day2', 'Day 2 — a reminder, before any charge', 342],
  ['day3', 'Day 3 — $39.99/year begins, unless you cancel', 438],
];

function PwTrialOffer({ onStart, onNo, closeLabel }: { onStart: () => void; onNo: () => void; closeLabel: string }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', left: 20, top: 12 }}>
        <PwX onPress={onNo} label={closeLabel} fill="rgba(0,0,0,0.06)" ring="rgba(0,0,0,0.10)" />
      </View>
      <AppText style={[sans('500'), { position: 'absolute', left: 24, right: 60, top: 104, fontSize: 28, letterSpacing: -0.2, lineHeight: 36, color: '#1D1C1A' }]}>
        Before you go — three days on us.
      </AppText>

      {/* the thread runs from under the first disc to the foot of the last */}
      <View style={{ position: 'absolute', left: 45, top: 290, width: 2, height: 192, backgroundColor: 'rgba(0,0,0,0.12)' }} />
      {PW_OFFER.map(([k, t, top], i) => (
        <View key={k} style={{ position: 'absolute', left: 24, right: 24, top, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: i === 0 ? '#131313' : '#FFFFFF',
              boxShadow: i === 0 ? undefined : '0 0 0 1px rgba(0,0,0,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <OfferIcon k={k} c={i === 0 ? '#F4F3F0' : '#1D1C1A'} />
          </View>
          <AppText style={[sans('500'), { flex: 1, fontSize: 15, lineHeight: 21, color: '#1D1C1A' }]}>{t}</AppText>
        </View>
      ))}

      <View style={{ position: 'absolute', left: 24, right: 24, bottom: 96 }}>
        <PwCTA label="Start my 3 free days" onPress={onStart} height={58} radius={29} size={17} tracking={0.2} />
      </View>
      <PressScale onPress={onNo} accessibilityRole="button" style={{ position: 'absolute', left: 0, right: 0, bottom: 56, minHeight: 0, alignItems: 'center' }} hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}>
        <AppText style={[sans('500'), { fontSize: 13.5, color: '#8B8882' }]}>No thanks</AppText>
      </PressScale>
    </View>
  );
}

// ═════ THE PAYMENT — the Apple Pay sheet ═════════════════════════════
const PW_SYS = Platform.select({ ios: 'System', default: 'Helvetica Neue' }) as string;

function SheetRow({ label, value, chev, last }: { label: string; value: string; chev?: boolean; last?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: last ? 0 : 1, borderBottomColor: 'rgba(0,0,0,0.08)' }}>
      <AppText style={{ fontFamily: PW_SYS, width: 76, fontSize: 12.5, color: 'rgba(0,0,0,0.45)' }}>{label}</AppText>
      <AppText style={{ fontFamily: PW_SYS, flex: 1, fontSize: 13.5, color: '#111' }}>{value}</AppText>
      {chev ? (
        <Svg width={7} height={12} viewBox="0 0 8 14">
          <Path d="M1.5 1.5 6 7l-4.5 5.5" stroke="rgba(0,0,0,0.3)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ) : null}
    </View>
  );
}

function PwPaySheet({ plan, email, onCancel, onPay }: { plan: PlanKey; email: string; onCancel: () => void; onPay: () => void }) {
  const C = checkoutFor(plan);
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }}>
      <Pressable onPress={onCancel} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' }} />
      {/* the side button, armed */}
      <View style={{ position: 'absolute', right: -2, top: 168, width: 5, height: 76, borderRadius: 4, backgroundColor: '#2E63F6' }} />
      <View style={{ position: 'absolute', left: 5, right: 5, bottom: 5, backgroundColor: '#FCFCFE', borderRadius: 34, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Svg width={19} height={19} viewBox="0 0 24 24" fill="#111">
              <Path d="M17.05 12.5c0-2.1 1.7-3.1 1.8-3.16-1-1.45-2.5-1.65-3.05-1.67-1.3-.13-2.53.76-3.19.76-.65 0-1.67-.74-2.74-.72-1.41.02-2.71.82-3.43 2.08-1.46 2.54-.37 6.3 1.05 8.36.69 1.01 1.51 2.14 2.59 2.1 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1.03 2.51-2.04.79-1.17 1.12-2.3 1.13-2.36-.02-.01-2.17-.83-2.19-3.29zM15.1 6.2c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.52.6-.98 1.58-.86 2.5.91.07 1.84-.46 2.41-1.13z" />
            </Svg>
            <AppText style={{ fontFamily: PW_SYS, fontSize: 21, fontWeight: '600', color: '#111', letterSpacing: -0.21 }}>Pay</AppText>
          </View>
          <PressScale onPress={onCancel} hitSlop={8} accessibilityLabel="Cancel" style={{ width: 44, minHeight: 44, borderRadius: 9999, backgroundColor: 'rgba(0,0,0,0.07)', alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={11} height={11} viewBox="0 0 20 20">
              <Path d="M3 3l14 14M17 3L3 17" stroke="rgba(0,0,0,0.55)" strokeWidth={2.6} strokeLinecap="round" />
            </Svg>
          </PressScale>
        </View>
        <SheetRow label="App" value={C.app} />
        {C.trial ? <SheetRow label="Trial" value={C.trial} /> : null}
        <SheetRow label="Account" value={email} />
        <SheetRow label="Payment" value="Visa •••• 4271" chev />
        <SheetRow label="Billing" value="Apple ID" chev last />
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderTopWidth: 1.5, borderTopColor: 'rgba(0,0,0,0.12)', marginTop: 4, paddingTop: 12 }}>
          <AppText style={{ fontFamily: PW_SYS, fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Due today</AppText>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText style={{ fontFamily: PW_SYS, fontSize: 17, fontWeight: '600', color: '#111' }}>{C.due}</AppText>
            <AppText style={{ fontFamily: PW_SYS, fontSize: 11.5, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>{C.note}</AppText>
          </View>
        </View>
        <PressScale onPress={onPay} style={{ width: '100%', minHeight: 44, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <Svg width={22} height={30} viewBox="0 0 22 30" fill="none">
            <Rect x={8} y={2} width={6} height={26} rx={3} stroke="#2E63F6" strokeWidth={2} />
            <Path d="M18 9l2.5 2M18 15l2.5 2" stroke="#2E63F6" strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <AppText style={{ fontFamily: PW_SYS, fontSize: 14, fontWeight: '500', color: '#2E63F6' }}>Confirm with Side Button</AppText>
        </PressScale>
      </View>
    </View>
  );
}

// ═════ 105 — CONFIRMED, the paper landing ════════════════════════════
function PwConfirmed({ plan, name, email, confirmLabel, onDone }: { plan: PlanKey; name?: string; email: string; confirmLabel: string; onDone: () => void }) {
  const [now] = useState(() => new Date());
  const in3 = fmtShort(new Date(now.getTime() + 3 * 86400000));
  const nextYear = new Date(now);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  // 105 sets its apostrophes as plain U+0027, not the &rsquo; other frames use
  const line =
    plan === 'trial'
      ? `Let's take the first ground. Nothing is charged until ${in3} — cancelling is one tap in Settings.`
      : plan === 'month'
        ? `Let's take the first ground. The campaign is unlocked, month by month.`
        : `Let's take the first ground. The whole campaign is yours until ${nextYear.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <Grain source={noiseDark} opacity={0.07} />
      <PwFloorGlow peak={0.44} mid={0.2} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 242, alignItems: 'center' }}>
            <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(40,38,32,0.3)' }}>
              <Svg width={34} height={34} viewBox="0 0 24 24" fill="none">
                <Path d="M4.5 12.5l4.8 4.8L19.5 6.8" stroke="#F4F3F0" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </View>
          <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 360, fontSize: 28, letterSpacing: -0.2, color: '#1D1C1A' }]}>
            {name ? `We're in, ${name}.` : `We're in.`}
          </AppText>
          <AppText center style={[sans('400'), { position: 'absolute', left: 56, right: 56, top: 412, fontSize: 14.5, lineHeight: 22, color: '#55534E' }]}>
            {line}
          </AppText>
          <View style={{ position: 'absolute', left: 24, right: 24, bottom: 96 }}>
            <PwCTA label={confirmLabel} onPress={onDone} height={58} radius={29} size={17} tracking={0.2} />
          </View>
          <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, bottom: 60, fontSize: 12, color: '#8B8882' }]}>
            Receipt sent to {email}
          </AppText>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ═════ THE FLOW ══════════════════════════════════════════════════════
export function PaywallFlow({
  name,
  triggers = [],
  emotions = [],
  load,
  confirmLabel = 'Begin Day I',
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
  const updateSettings = useUpdateSettings();
  const { email } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [plan, setPlan] = useState<PlanKey>('year');
  const [checkout, setCheckout] = useState<PlanKey | null>(null);
  const [offer, setOffer] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [done, setDone] = useState(false);
  const [offered, setOffered] = useState(false);
  const closeLabel = embedded ? 'Skip' : 'Close';
  const receipt = email ?? 'your Apple ID';

  // walking away gets one rescue: 3 days free
  const decline = () => {
    if (!offered) {
      setOffered(true);
      setOffer(true);
      return;
    }
    onDone(false);
  };

  async function pay() {
    await updateSettings({ premium: true }).catch(() => {});
    setSheet(false);
    setDone(true);
  }

  if (done) return <PwConfirmed plan={checkout || plan} name={name} email={receipt} confirmLabel={confirmLabel} onDone={() => onDone(true)} />;

  // the band is drawn from the physical top so it runs behind the status bar;
  // its canvas height of 296 ends 242 below the safe area, where the paper takes over
  const bandH = insets.top + 242;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      {offer ? (
        <>
          <Grain source={noiseDark} opacity={0.07} />
          <PwFloorGlow peak={0.3} mid={0.13} />
        </>
      ) : (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: bandH, overflow: 'hidden' }} pointerEvents="none">
          <LinearGradient colors={['#F0EFE9', '#F0EBDF']} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
          <PwHeaderArt w={width} h={bandH} />
          <LinearGradient
            colors={['rgba(244,243,240,0)', '#F4F3F0', '#F4F3F0']}
            locations={[0, 0.62, 1]}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 240 }}
          />
        </View>
      )}
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {offer ? (
          <PwTrialOffer
            closeLabel={closeLabel}
            onStart={() => {
              setCheckout('trial');
              setSheet(true);
            }}
            onNo={() => onDone(false)}
          />
        ) : (
          <PwMain
            plan={plan}
            setPlan={setPlan}
            closeLabel={closeLabel}
            onPay={() => {
              setCheckout(plan);
              setSheet(true);
            }}
            onClose={decline}
          />
        )}
      </SafeAreaView>
      {sheet ? <PwPaySheet plan={checkout || plan} email={receipt} onCancel={() => setSheet(false)} onPay={pay} /> : null}
    </View>
  );
}
