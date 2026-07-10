import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { WorldArt } from '@/components/journey/WorldArt';
import { useUpdateSettings } from '@/lib/backend';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * The paywall funnel — one canonical flow used mid-onboarding and from any
 * locked state: pitch → plans → (declining is rescued once by a 3-day trial)
 * → payment sheet → confirmed. The urge tool is never behind it.
 */

type PageId = 'pitch' | 'plans' | 'trial' | 'payment' | 'confirmed';

const PLANS = [
  { id: 'yearly', name: 'Yearly', price: '$39.99', per: '/year', note: '$3.33 a month' },
  { id: 'monthly', name: 'Monthly', price: '$12.99', per: '/month', note: 'Cancel anytime' },
] as const;

export function PaywallFlow({
  prize = [],
  confirmLabel = 'Begin Day I',
  onDone,
}: {
  /** What they said returns when it's won — personalizes the checklist. */
  prize?: string[];
  confirmLabel?: string;
  /** Called when the funnel ends — purchased true/false. */
  onDone: (purchased: boolean) => void;
}) {
  const updateSettings = useUpdateSettings();
  const [page, setPage] = useState<PageId>('pitch');
  const [plan, setPlan] = useState(0);
  const [rescued, setRescued] = useState(false);
  const [trial, setTrial] = useState(false);

  // declining the plans page is rescued once by the trial offer
  const decline = () => {
    if (!rescued) {
      setRescued(true);
      setPage('trial');
    } else {
      onDone(false);
    }
  };

  async function confirm() {
    await updateSettings({ premium: true }).catch(() => {});
    setPage('confirmed');
  }

  const unlocked = [
    'The full campaign — ten grounds, twelve weeks',
    'Every lesson, tool, and pattern report',
    ...prize.slice(0, 2).map((p) => `The road back to ${p.toLowerCase()}`),
  ];

  if (page === 'pitch') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 210, overflow: 'hidden', backgroundColor: '#EFECE1' }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: -30, aspectRatio: 402 / 300 }}>
            <WorldArt scene="summit" fit="xMidYMid meet" />
          </View>
        </View>
        <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, right: 18 }}>
          <Pressable onPress={() => onDone(false)} hitSlop={10} accessibilityLabel="Close" style={{ padding: 8 }}>
            <Svg width={16} height={16} viewBox="0 0 20 20">
              <Path d="M3 3l14 14M17 3L3 17" stroke={colors.text} strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </SafeAreaView>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 17, letterSpacing: 3.4, color: colors.text }}>VICI</AppText>
            <View style={{ backgroundColor: colors.ink, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 }}>
              <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 1.6, color: colors.inkText }]}>PLUS</AppText>
            </View>
          </View>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 34, lineHeight: 38, color: colors.text, marginTop: 14 }}>
            The whole campaign, unlocked.
          </AppText>
          <View style={{ marginTop: 22, gap: 13 }}>
            {unlocked.map((u) => (
              <View key={u} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 22, height: 22, borderRadius: 9999, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                    <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={colors.inkText} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
                <AppText style={[sans('500'), { flex: 1, fontSize: 14.5, color: colors.text }]}>{u}</AppText>
              </View>
            ))}
          </View>
          <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textSoft, marginTop: 20 }]}>The urge tool is free forever.</AppText>
        </ScrollView>
        <SafeAreaView edges={['bottom']} style={{ paddingHorizontal: 28, paddingBottom: 10 }}>
          <DarkPill label="See the plans" onPress={() => setPage('plans')} />
        </SafeAreaView>
      </View>
    );
  }

  if (page === 'plans') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView edges={['top']} style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 18 }}>
          <Pressable onPress={decline} hitSlop={10} accessibilityLabel="Close" style={{ padding: 8 }}>
            <Svg width={16} height={16} viewBox="0 0 20 20">
              <Path d="M3 3l14 14M17 3L3 17" stroke={colors.textSoft} strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </SafeAreaView>
        <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'center' }}>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, color: colors.text }}>Pick your plan.</AppText>
          <View style={{ marginTop: 24, gap: 12 }}>
            {PLANS.map((p, i) => {
              const on = plan === i;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setPlan(i)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    backgroundColor: on ? colors.ink : colors.surface,
                    borderRadius: 20,
                    padding: 20,
                  }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 9999,
                      borderWidth: 1.8,
                      borderColor: on ? colors.inkText : colors.ring,
                      backgroundColor: on ? colors.inkText : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {on ? (
                      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                        <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={colors.ink} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    ) : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText style={[sans('600'), { fontSize: 16.5, color: on ? colors.inkText : colors.text }]}>{p.name}</AppText>
                    <AppText style={[sans('400'), { fontSize: 13, color: on ? colors.inkTextMuted : colors.textMuted, marginTop: 2 }]}>{p.note}</AppText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <AppText style={[sans('700'), { fontSize: 19, color: on ? colors.inkText : colors.text }]}>{p.price}</AppText>
                    <AppText style={[sans('400'), { fontSize: 12, color: on ? colors.inkTextMuted : colors.textSoft }]}>{p.per}</AppText>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textSoft, marginTop: 18 }]}>
            Billed through the App Store. Cancel anytime. The urge tool is free forever.
          </AppText>
        </View>
        <SafeAreaView edges={['bottom']} style={{ paddingHorizontal: 28, paddingBottom: 10 }}>
          <DarkPill
            label="Continue"
            onPress={() => {
              setTrial(false);
              setPage('payment');
            }}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (page === 'trial') {
    const steps: [string, string][] = [
      ['Today', 'Everything unlocks. Full access, no charge.'],
      ['Day 2', 'A reminder that the trial is ending.'],
      ['Day 3', `${PLANS[0].price}/year begins — unless you cancel.`],
    ];
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'center' }}>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, color: colors.text }}>Try it free for 3 days.</AppText>
          <View style={{ marginTop: 26 }}>
            {steps.map(([t, s], i) => (
              <View key={t} style={{ flexDirection: 'row', gap: 15 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: 13, height: 13, borderRadius: 9999, backgroundColor: i === 0 ? colors.ink : 'transparent', borderWidth: 1.7, borderColor: colors.ink, marginTop: 3 }} />
                  {i < steps.length - 1 ? <View style={{ width: 1.6, flex: 1, backgroundColor: colors.borderStrong, marginVertical: 3 }} /> : null}
                </View>
                <View style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 22 : 0 }}>
                  <AppText style={[sans('600'), { fontSize: 14.5, color: colors.text }]}>{t}</AppText>
                  <AppText style={[sans('400'), { fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: 2 }]}>{s}</AppText>
                </View>
              </View>
            ))}
          </View>
          <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textSoft, marginTop: 20 }]}>The urge tool is free forever.</AppText>
        </View>
        <SafeAreaView edges={['bottom']} style={{ paddingHorizontal: 28, paddingBottom: 10, gap: 8 }}>
          <DarkPill
            label="Start the free trial"
            onPress={() => {
              setTrial(true);
              setPlan(0);
              setPage('payment');
            }}
          />
          <Pressable onPress={() => onDone(false)} style={{ paddingVertical: 10, alignItems: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 14, color: colors.textSoft }]}>No thanks</AppText>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  if (page === 'payment') {
    const p = PLANS[plan];
    const row = (k: string, v: string, strong = false) => (
      <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}>
        <AppText style={[sans('400'), { fontSize: 13.5, color: 'rgba(237,237,232,0.55)' }]}>{k}</AppText>
        <AppText style={[sans(strong ? '700' : '500'), { fontSize: 13.5, color: '#EDEDE8' }]}>{v}</AppText>
      </View>
    );
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(8,8,10,0.94)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#141416', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 26, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="#EDEDE8">
                <Path d="M17.05 12.5c0-2.1 1.7-3.1 1.8-3.16-1-1.45-2.5-1.65-3.05-1.67-1.3-.13-2.53.76-3.19.76-.65 0-1.67-.74-2.74-.72-1.41.02-2.71.82-3.43 2.08-1.46 2.54-.37 6.3 1.05 8.36.69 1.01 1.51 2.14 2.59 2.1 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1.03 2.51-2.04.79-1.17 1.12-2.3 1.13-2.36-.02-.01-2.17-.83-2.19-3.29zM15.1 6.2c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.52.6-.98 1.58-.86 2.5.91.07 1.84-.46 2.41-1.13z" />
              </Svg>
              <AppText style={[sans('600'), { fontSize: 15, color: '#EDEDE8' }]}>Pay</AppText>
            </View>
            <Pressable onPress={() => setPage(trial ? 'trial' : 'plans')} hitSlop={10} accessibilityLabel="Close">
              <Svg width={15} height={15} viewBox="0 0 20 20">
                <Path d="M3 3l14 14M17 3L3 17" stroke="rgba(237,237,232,0.6)" strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>
          <View style={{ marginTop: 16 }}>
            {row('App', 'VICI — tideline')}
            {row('Plan', trial ? `3-day trial → ${p.name} ${p.price}${p.per}` : `${p.name} ${p.price}${p.per}`)}
            {row('Account', 'you@icloud.com')}
            {row('Card', 'Apple Card ···· 4242')}
            {row('Billing', 'App Store')}
            {row('Due today', trial ? '$0.00' : p.price, true)}
          </View>
          <Pressable
            onPress={confirm}
            style={({ pressed }) => ({
              marginTop: 20,
              backgroundColor: '#EDEDE8',
              borderRadius: 14,
              paddingVertical: 15,
              alignItems: 'center',
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}>
            <AppText style={[sans('600'), { fontSize: 15, color: '#131313' }]}>Confirm</AppText>
          </Pressable>
          <SafeAreaView edges={['bottom']}>
            <AppText center style={[sans('400'), { fontSize: 11.5, color: 'rgba(237,237,232,0.4)', paddingVertical: 12 }]}>
              Confirm with the side button
            </AppText>
          </SafeAreaView>
        </View>
      </View>
    );
  }

  // confirmed
  return (
    <View style={{ flex: 1, backgroundColor: '#08080A' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
        <View style={{ width: 64, height: 64, borderRadius: 9999, borderWidth: 1.8, borderColor: '#EDEDE8', alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12.5l4.5 4.5L19 7.5" stroke="#EDEDE8" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
        <AppText center style={{ fontFamily: fonts.serif, fontSize: 32, lineHeight: 38, color: '#EDEDE8', marginTop: 24 }}>
          Confirmed.
        </AppText>
        <AppText center style={[sans('400'), { fontSize: 14, color: 'rgba(237,237,232,0.55)', marginTop: 10 }]}>
          {trial ? 'Three days, everything unlocked.' : 'The whole campaign is open.'}
        </AppText>
      </View>
      <SafeAreaView edges={['bottom']} style={{ paddingHorizontal: 28, paddingBottom: 10 }}>
        <Pressable
          onPress={() => onDone(true)}
          style={({ pressed }) => ({
            backgroundColor: '#EDEDE8',
            borderRadius: 9999,
            paddingVertical: 16,
            alignItems: 'center',
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}>
          <AppText style={[sans('600'), { fontSize: 15.5, color: '#131313' }]}>{confirmLabel}</AppText>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

function DarkPill({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
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
