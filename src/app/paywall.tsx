import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { WorldArt } from '@/components/journey/WorldArt';
import { AppText } from '@/components/ui';
import { useUpdateSettings } from '@/lib/backend';
import { colors, fonts, sans, spacing } from '@/lib/theme';

// ── Paywall (canvas: screens-money) — the summit leads, plans are two quiet
// rows (the chosen one turns into the home's dark card), features are an
// unboxed two-column checklist. ──

const INCLUDED = [
  'Progress that never resets',
  'Full 12-week curriculum',
  'Unlimited urge support',
  'Insights & weekly reports',
  'Private journal',
  'All 10 worlds',
];

type PlanKey = 'year' | 'coach';
const PLANS: Record<PlanKey, { name: string; price: string; per: string; sub: string; tag?: string; fine: string }> = {
  year: { name: 'Yearly', price: '$39.99', per: '/year', sub: '7-day free trial', fine: '$39.99/year ($3.33/mo) after trial · cancel anytime' },
  coach: { name: 'Yearly + Coach', price: '$99.99', per: '/year', sub: '3-day free trial', tag: 'Best value', fine: '$99.99/year ($8.33/mo) after trial · cancel anytime' },
};

export default function Paywall() {
  const router = useRouter();
  const updateSettings = useUpdateSettings();
  const [plan, setPlan] = useState<PlanKey>('year');

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const subscribe = async () => {
    await updateSettings({ premium: true });
    close();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />

      {/* the summit — where the road leads */}
      <View style={{ height: 296 }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          <WorldArt scene="summit" hue={300} w={402} h={300} />
        </View>
        <LinearGradient
          colors={['rgba(244,243,240,0.55)', 'rgba(244,243,240,0.06)', 'rgba(244,243,240,0.62)', 'rgba(244,243,240,0.94)']}
          locations={[0, 0.34, 0.74, 1]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.sm }}>
            <Pressable
              onPress={close}
              accessibilityLabel="Close"
              style={{ width: 34, height: 34, borderRadius: 9999, backgroundColor: '#F8F7F4', alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={16} height={16} viewBox="0 0 20 20">
                <Path d="M3 3l14 14M17 3L3 17" stroke={colors.text} strokeWidth={2.4} strokeLinecap="round" />
              </Svg>
            </Pressable>
            <Pressable hitSlop={8}>
              <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>Restore</AppText>
            </Pressable>
          </View>
        </SafeAreaView>
        <View style={{ position: 'absolute', left: spacing.xl, right: spacing.xl, bottom: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 15, letterSpacing: 3.6, color: colors.text }}>VICI</AppText>
            <View style={{ backgroundColor: colors.ink, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 }}>
              <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.inkText }]}>Plus</AppText>
            </View>
          </View>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 38, lineHeight: 40, letterSpacing: 0.38, color: colors.text }}>
            The long road,{'\n'}together
          </AppText>
        </View>
      </View>

      {/* quiet body */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: 26 }} showsVerticalScrollIndicator={false}>
        <AppText variant="muted" style={{ fontSize: 14, lineHeight: 22, maxWidth: 330, marginBottom: 34 }}>
          Recovery isn’t a streak to protect — it’s progress that builds and stays.
        </AppText>

        <View style={{ gap: 13 }}>
          {(['year', 'coach'] as PlanKey[]).map((key) => (
            <PlanRow key={key} plan={PLANS[key]} active={plan === key} onPress={() => setPlan(key)} />
          ))}
        </View>

        <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft, marginTop: 42 }]}>
          Everything, unlocked
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 22 }}>
          {INCLUDED.map((f) => (
            <View key={f} style={{ width: '50%', flexDirection: 'row', gap: 9, alignItems: 'flex-start', marginBottom: 16, paddingRight: 12 }}>
              <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" style={{ marginTop: 2.5 }}>
                <Path d="M4 12.5l4.8 4.8L20 6.5" stroke={colors.text} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <AppText style={[sans('400'), { flex: 1, fontSize: 13.5, lineHeight: 18, color: colors.textMuted }]}>{f}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* footer CTA */}
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: 20 }}>
        <Pressable onPress={subscribe} style={{ backgroundColor: colors.ink, borderRadius: 9999, paddingVertical: 17, alignItems: 'center', marginBottom: 14 }}>
          <AppText style={[sans('600'), { fontSize: 15.5, color: colors.inkText }]}>Try 7 days free</AppText>
        </Pressable>
        <SafeAreaView edges={['bottom']}>
          <AppText center style={[sans('400'), { fontSize: 13, lineHeight: 20, color: colors.textSoft, paddingBottom: spacing.md }]}>
            {PLANS[plan].fine}
          </AppText>
        </SafeAreaView>
      </View>
    </View>
  );
}

function PlanRow({ plan, active, onPress }: { plan: (typeof PLANS)[PlanKey]; active: boolean; onPress: () => void }) {
  const paper = colors.inkText;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: active ? colors.ink : colors.surface,
        borderRadius: 18,
        padding: 18,
      }}>
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
            <Path d="M4 12l5 5L20 6" stroke={colors.ink} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppText style={[sans('500'), { fontSize: 15, color: active ? paper : colors.text }]}>{plan.name}</AppText>
          {plan.tag ? (
            <View style={{ borderWidth: 1, borderColor: active ? 'rgba(245,244,241,0.4)' : colors.borderStrong, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3 }}>
              <AppText style={[sans('500'), { fontSize: 9.5, letterSpacing: 0.8, textTransform: 'uppercase', color: active ? paper : colors.textMuted }]}>{plan.tag}</AppText>
            </View>
          ) : null}
        </View>
        <AppText style={[sans('400'), { fontSize: 13, marginTop: 3, color: active ? colors.inkTextMuted : colors.textMuted }]}>{plan.sub}</AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText style={[sans('500'), { fontSize: 16, color: active ? paper : colors.text }]}>{plan.price}</AppText>
        <AppText style={[sans('400'), { fontSize: 12, color: active ? colors.inkTextSoft : colors.textSoft }]}>{plan.per}</AppText>
      </View>
    </Pressable>
  );
}
