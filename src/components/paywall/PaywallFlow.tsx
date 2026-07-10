import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { WorldArt } from '@/components/journey/WorldArt';
import { useUpdateSettings } from '@/lib/backend';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * VICI Plus paywall (canvas: screens-paywall) — the summit hero card, the
 * unboxed checklist, and the long plan rows where the chosen plan floods
 * dark. Two pages — pitch → plans ($39.99/yr · $12.99/mo, no trial up
 * front). Pressing ✕ on the plans page (or declining in the funnel) is
 * rescued ONCE by a 3-day free-trial offer; declining that really closes.
 * Paying runs the Apple-Pay sheet, then the paper Confirmed page.
 */

const PW_INCL = ['Progress that never resets', 'Full 12-week curriculum', 'Unlimited urge support', 'Insights & weekly reports', 'Private journal', 'All 10 worlds'];

type PlanKey = 'year' | 'month' | 'trial';

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function checkoutFor(plan: PlanKey) {
  const now = new Date();
  const in3 = new Date(now.getTime() + 3 * 86400000);
  const in1y = new Date(now);
  in1y.setFullYear(in1y.getFullYear() + 1);
  const in1m = new Date(now);
  in1m.setMonth(in1m.getMonth() + 1);
  if (plan === 'trial') return { app: 'VICI Plus — Yearly', trial: `3 days free, then $39.99/year`, due: '$0.00', note: `$39.99 on ${fmtDate(in3)} · cancel anytime` };
  if (plan === 'month') return { app: 'VICI Plus — Monthly', trial: null, due: '$12.99', note: `Renews ${fmtDate(in1m)} · cancel anytime` };
  return { app: 'VICI Plus — Yearly', trial: null, due: '$39.99', note: `Renews ${fmtDate(in1y)} · cancel anytime` };
}

// ── small shared pieces ──────────────────────────────────────────────
function PwDots({ i }: { i: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
      {[0, 1].map((k) => (
        <View key={k} style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 9999, backgroundColor: k === i ? colors.ink : colors.borderStrong }} />
      ))}
    </View>
  );
}

function PwX({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityLabel="Close"
      style={{ width: 34, height: 34, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={15} height={15} viewBox="0 0 20 20">
        <Path d="M3 3l14 14M17 3L3 17" stroke={colors.text} strokeWidth={2.4} strokeLinecap="round" />
      </Svg>
    </Pressable>
  );
}

function BackChevron({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityLabel="Back" style={{ padding: 4, marginLeft: -4 }}>
      <Svg width={12} height={20} viewBox="0 0 13 22">
        <Path d="M11 2L2 11l9 9" stroke={colors.text} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

function PwHeader({ i, onBack, onClose, embedded }: { i: number; onBack: (() => void) | null; onClose?: () => void; embedded?: boolean }) {
  return (
    <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 34 }}>
      <View style={{ width: 70, alignItems: 'flex-start' }}>
        {onBack ? <BackChevron onPress={onBack} /> : !embedded && onClose ? <PwX onPress={onClose} /> : null}
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }} pointerEvents="none">
        <PwDots i={i} />
      </View>
      <View style={{ width: 70, alignItems: 'flex-end' }}>
        {onBack && !embedded && onClose ? (
          <PwX onPress={onClose} />
        ) : (
          <AppText style={[sans('500'), { fontSize: 13.5, color: colors.textMuted }]}>Restore</AppText>
        )}
      </View>
    </View>
  );
}

function PwCTA({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        width: '100%',
        backgroundColor: colors.ink,
        borderRadius: 9999,
        paddingVertical: 16,
        alignItems: 'center',
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      <AppText style={[sans('600'), { fontSize: 15.5, color: colors.inkText }]}>{label}</AppText>
    </Pressable>
  );
}

// ── the long plan row — the chosen plan floods dark ──────────────────
function PlanRow({ active, onPress, tag, name, price, per, sub }: { active: boolean; onPress: () => void; tag?: string; name: string; price: string; per: string; sub: string }) {
  const paper = '#F5F4F1';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: active ? '#131313' : colors.surface,
        borderRadius: 18,
        padding: 18,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}>
      <View
        style={{
          width: 23,
          height: 23,
          borderRadius: 9999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: active ? paper : 'transparent',
          borderWidth: active ? 0 : 2,
          borderColor: colors.borderStrong,
        }}>
        {active ? (
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path d="M4 12l5 5L20 6" stroke="#131313" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppText style={[sans('500'), { fontSize: 15, color: active ? paper : colors.text }]}>{name}</AppText>
          {tag ? (
            <View style={{ borderWidth: 1, borderColor: active ? 'rgba(245,244,241,0.4)' : colors.borderStrong, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3 }}>
              <AppText style={[sans('500'), { fontSize: 9.5, letterSpacing: 0.76, textTransform: 'uppercase', color: active ? paper : colors.textMuted }]}>{tag}</AppText>
            </View>
          ) : null}
        </View>
        <AppText style={[sans('400'), { fontSize: 13, color: active ? 'rgba(245,244,241,0.62)' : colors.textMuted, marginTop: 3 }]}>{sub}</AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText style={[sans('500'), { fontSize: 16, letterSpacing: -0.16, color: active ? paper : colors.text, fontVariant: ['tabular-nums'] }]}>{price}</AppText>
        <AppText style={[sans('400'), { fontSize: 12, color: active ? 'rgba(245,244,241,0.45)' : colors.textSoft }]}>{per}</AppText>
      </View>
    </Pressable>
  );
}

// ═════ PAGE 1 · THE PITCH ════════════════════════════════════════════
function PwPitch({ name, trig, onNext }: { name?: string; trig: string; onNext: () => void }) {
  return (
    <>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* the summit — where the road leads */}
        <View style={{ position: 'relative', height: 240, borderRadius: 20, overflow: 'hidden', marginTop: 14 }}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <WorldArt scene="summit" fit="xMidYMid slice" />
          </View>
          <LinearGradient
            colors={['rgba(247,245,240,0.12)', 'rgba(247,245,240,0.04)', 'rgba(247,245,240,0.9)']}
            locations={[0, 0.4, 0.96]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}>
              <AppText style={{ fontFamily: fonts.serif, fontSize: 14, letterSpacing: 3.4, color: colors.text }}>VICI</AppText>
              <View style={{ backgroundColor: colors.ink, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 }}>
                <AppText style={[sans('500'), { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.inkText }]}>Plus</AppText>
              </View>
            </View>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 33, lineHeight: 35, letterSpacing: 0.33, color: colors.text }}>
              {name ? `${name} — let’s\nfinish this.` : 'Let’s finish\nthis, together.'}
            </AppText>
          </View>
        </View>

        {/* everything, unlocked — the unboxed checklist */}
        <View style={{ paddingTop: 26, paddingHorizontal: 2, paddingBottom: 8 }}>
          <AppText style={[sans('400'), { fontSize: 13.5, lineHeight: 21, color: colors.textMuted, marginBottom: 20 }]}>
            Built from your answers tonight — the {trig} window guarded first, one small lesson a day.
          </AppText>
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft }]}>
            Everything, unlocked
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 18 }}>
            {PW_INCL.map((f) => (
              <View key={f} style={{ width: '50%', flexDirection: 'row', gap: 9, alignItems: 'flex-start', marginBottom: 15, paddingRight: 12 }}>
                <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" style={{ marginTop: 2.5 }}>
                  <Path d="M4 12.5l4.8 4.8L20 6.5" stroke={colors.text} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <AppText style={[sans('400'), { flex: 1, fontSize: 13.5, lineHeight: 18, color: colors.textMuted }]}>{f}</AppText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PwCTA label="Continue" onPress={onNext} />
      </View>
    </>
  );
}

// ═════ PAGE 2 · THE PLANS ════════════════════════════════════════════
function PwPlans({ name, plan, setPlan, onDone, onFree }: { name?: string; plan: PlanKey; setPlan: (p: PlanKey) => void; onDone: () => void; onFree: () => void }) {
  return (
    <>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 22 }} showsVerticalScrollIndicator={false}>
        <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 30, lineHeight: 34, color: colors.text, marginTop: 4 }}>Choose your plan.</AppText>
        <AppText style={[sans('400'), { fontSize: 13.5, lineHeight: 20, color: colors.textMuted, marginTop: 10 }]}>
          You did the work tonight{name ? `, ${name}` : ''}. Let’s keep it.
        </AppText>
        <View style={{ gap: 13, marginTop: 24 }}>
          <PlanRow active={plan === 'year'} onPress={() => setPlan('year')} tag="Best value" name="Yearly" price="$39.99" per="/year" sub="$3.33 a month" />
          <PlanRow active={plan === 'month'} onPress={() => setPlan('month')} name="Monthly" price="$12.99" per="/month" sub="Cancel anytime" />
        </View>
        <AppText center style={[sans('400'), { fontSize: 12.5, color: colors.textSoft, marginTop: 18 }]}>The urge tool is free forever.</AppText>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PwCTA label={plan === 'month' ? 'Continue — $12.99/month' : 'Continue — $39.99/year'} onPress={onDone} />
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Pressable
            onPress={onFree}
            style={{ borderWidth: 1.4, borderColor: colors.borderStrong, borderRadius: 9999, paddingHorizontal: 24, paddingVertical: 11 }}>
            <AppText style={[sans('600'), { fontSize: 13.5, color: colors.text }]}>Continue with the free tools</AppText>
          </Pressable>
        </View>
      </View>
    </>
  );
}

// ═════ THE RESCUE — 3 days free, shown once when he walks ════════════
function OfferIcon({ k, c }: { k: string; c: string }) {
  if (k === 'today')
    return (
      <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
        <Path d="M7.5 10.5V7a4.5 4.5 0 0 1 8.6-1.8" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
        <Rect x={4.4} y={10} width={15.2} height={10.5} rx={2.6} stroke={c} strokeWidth={1.8} />
        <Path d="M12 14v2.6" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  if (k === 'day2')
    return (
      <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.4a5.8 5.8 0 0 1 5.8 5.8v3.6l1.7 2.4a1 1 0 0 1-.8 1.6H5.3a1 1 0 0 1-.8-1.6l1.7-2.4V9.2A5.8 5.8 0 0 1 12 3.4z" stroke={c} strokeWidth={1.8} strokeLinejoin="round" />
        <Path d="M10 19.6a2.2 2.2 0 0 0 4 0" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={5.5} width={17} height={13.5} rx={2.6} stroke={c} strokeWidth={1.8} />
      <Path d="M3.5 9.5h17" stroke={c} strokeWidth={1.8} />
      <Path d="M7 15h4" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
const PW_OFFER: [string, string][] = [
  ['today', 'Today — everything unlocks'],
  ['day2', 'Day 2 — a reminder, before any charge'],
  ['day3', 'Day 3 — $39.99/year begins, unless you cancel'],
];

function PwTrialOffer({ onStart, onNo, embedded }: { onStart: () => void; onNo: () => void; embedded?: boolean }) {
  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 34 }}>{embedded ? null : <PwX onPress={onNo} />}</View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 18 }} showsVerticalScrollIndicator={false}>
        <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 30, lineHeight: 34, color: colors.text, marginTop: 4 }}>
          Before you go — three days on us.
        </AppText>
        <View style={{ marginTop: 30 }}>
          <View style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, backgroundColor: colors.borderStrong }} />
          {PW_OFFER.map(([k, t], i) => (
            <View key={k} style={{ flexDirection: 'row', gap: 16, alignItems: 'center', paddingVertical: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: i === 0 ? colors.ink : colors.surface }}>
                <OfferIcon k={k} c={i === 0 ? colors.inkText : colors.text} />
              </View>
              <AppText style={[sans('500'), { flex: 1, fontSize: 14.5, lineHeight: 20, color: colors.text }]}>{t}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{ paddingTop: 12 }}>
        <PwCTA label="Start my 3 free days" onPress={onStart} />
        <Pressable onPress={onNo} style={{ alignItems: 'center', marginTop: 12, paddingVertical: 4 }}>
          <AppText style={[sans('500'), { fontSize: 13.5, color: colors.textSoft }]}>No thanks</AppText>
        </Pressable>
      </View>
    </>
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

function PwPaySheet({ plan, onCancel, onPay }: { plan: PlanKey; onCancel: () => void; onPay: () => void }) {
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
          <Pressable onPress={onCancel} hitSlop={8} accessibilityLabel="Cancel" style={{ width: 27, height: 27, borderRadius: 9999, backgroundColor: 'rgba(0,0,0,0.07)', alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={11} height={11} viewBox="0 0 20 20">
              <Path d="M3 3l14 14M17 3L3 17" stroke="rgba(0,0,0,0.55)" strokeWidth={2.6} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </View>
        <SheetRow label="App" value={C.app} />
        {C.trial ? <SheetRow label="Trial" value={C.trial} /> : null}
        <SheetRow label="Account" value="jordan@hey.com" />
        <SheetRow label="Payment" value="Visa •••• 4271" chev />
        <SheetRow label="Billing" value="J. Reyes · Portland, OR" chev last />
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderTopWidth: 1.5, borderTopColor: 'rgba(0,0,0,0.12)', marginTop: 4, paddingTop: 12 }}>
          <AppText style={{ fontFamily: PW_SYS, fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Due today</AppText>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText style={{ fontFamily: PW_SYS, fontSize: 17, fontWeight: '600', color: '#111' }}>{C.due}</AppText>
            <AppText style={{ fontFamily: PW_SYS, fontSize: 11.5, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>{C.note}</AppText>
          </View>
        </View>
        <Pressable onPress={onPay} style={{ width: '100%', marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingTop: 6, paddingBottom: 2 }}>
          <Svg width={22} height={30} viewBox="0 0 22 30" fill="none">
            <Rect x={8} y={2} width={6} height={26} rx={3} stroke="#2E63F6" strokeWidth={2} />
            <Path d="M18 9l2.5 2M18 15l2.5 2" stroke="#2E63F6" strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <AppText style={{ fontFamily: PW_SYS, fontSize: 14, fontWeight: '500', color: '#2E63F6' }}>Confirm with Side Button</AppText>
        </Pressable>
      </View>
    </View>
  );
}

// ═════ CONFIRMED — the paper landing ═════════════════════════════════
function PwConfirmed({ plan, name, confirmLabel, onDone }: { plan: PlanKey; name?: string; confirmLabel: string; onDone: () => void }) {
  const in3 = fmtDate(new Date(Date.now() + 3 * 86400000));
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const line =
    plan === 'trial'
      ? `Let’s take the first ground. Nothing is charged until ${in3} — cancelling is one tap in Settings.`
      : plan === 'month'
        ? 'Let’s take the first ground. The campaign is unlocked, month by month.'
        : `Let’s take the first ground. The whole campaign is yours until ${nextYear.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 29, paddingBottom: 10 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 84, height: 84, borderRadius: 9999, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 26 }}>
            <Svg width={34} height={34} viewBox="0 0 24 24" fill="none">
              <Path d="M4.5 12.5l4.8 4.8L19.5 6.8" stroke={colors.inkText} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 36, lineHeight: 39, letterSpacing: 0.36, color: colors.text }}>
            {name ? `We’re in, ${name}.` : 'You’re in.'}
          </AppText>
          <AppText center style={[sans('400'), { fontSize: 14.5, lineHeight: 22, color: colors.textMuted, marginTop: 14, maxWidth: 280 }]}>
            {line}
          </AppText>
        </View>
        <PwCTA label={confirmLabel} onPress={onDone} />
        <AppText center style={[sans('400'), { fontSize: 12, color: colors.textSoft, marginTop: 12 }]}>Receipt sent to jordan@hey.com</AppText>
      </SafeAreaView>
    </View>
  );
}

// ═════ THE FLOW ══════════════════════════════════════════════════════
export function PaywallFlow({
  name,
  triggers = [],
  confirmLabel = 'Begin Day I',
  embedded = false,
  onDone,
}: {
  /** First name from the intake — personalizes the pitch/plans/confirmed. */
  name?: string;
  /** Their triggers — the pitch cites the first one. */
  triggers?: string[];
  confirmLabel?: string;
  /** Embedded in the onboarding shell: no standalone ✕ on the pitch. */
  embedded?: boolean;
  /** Called when the funnel ends — purchased true/false. */
  onDone: (purchased: boolean) => void;
}) {
  const updateSettings = useUpdateSettings();
  const [i, setI] = useState(0);
  const [plan, setPlan] = useState<PlanKey>('year');
  const [checkout, setCheckout] = useState<PlanKey | null>(null);
  const [offer, setOffer] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [done, setDone] = useState(false);
  const [offered, setOffered] = useState(false);
  const trig = (triggers[0] || 'late night').toLowerCase();

  // walking away from the plans page gets one rescue: 3 days free
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

  if (done) return <PwConfirmed plan={checkout || plan} name={name} confirmLabel={confirmLabel} onDone={() => onDone(true)} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 29, paddingBottom: 10 }} edges={['top', 'bottom']}>
        {offer ? (
          <PwTrialOffer
            embedded={embedded}
            onStart={() => {
              setCheckout('trial');
              setSheet(true);
            }}
            onNo={() => onDone(false)}
          />
        ) : (
          <>
            <PwHeader i={i} embedded={embedded} onClose={i === 1 ? decline : () => onDone(false)} onBack={i > 0 ? () => setI(i - 1) : null} />
            {i === 0 ? (
              <PwPitch name={name} trig={trig} onNext={() => setI(1)} />
            ) : (
              <PwPlans
                name={name}
                plan={plan}
                setPlan={setPlan}
                onDone={() => {
                  setCheckout(plan);
                  setSheet(true);
                }}
                onFree={decline}
              />
            )}
          </>
        )}
      </SafeAreaView>
      {sheet ? <PwPaySheet plan={checkout || plan} onCancel={() => setSheet(false)} onPay={pay} /> : null}
    </View>
  );
}
