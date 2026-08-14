import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, TextInput, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, ChevronGlyph, PressScale } from '@/components/ui';
import { type KeepsakeSceneKey, KKMedallion } from '@/components/keepsakes/Medallion';
import { useAuth } from '@/lib/auth';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLifeMap, useUpdateProfile } from '@/lib/backend';
import { colors, sans } from '@/lib/theme';

/**
 * 040 · Edit profile — the monogram and the three fields that name you, then
 * the two things the account is actually made of: the medallions earned and
 * the day the campaign started.
 *
 * Canvas geometry with the 54px status bar removed: the bar at y 10, the
 * monogram at 64, the fields card at 220, and each caption exactly 26 above
 * its card.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const HAIRLINE = 'rgba(0,0,0,0.06)';

export default function Profile() {
  const router = useRouter();
  const { email } = useAuth();
  const user = useCurrentUser();
  const lifeMap = useLifeMap();
  const updateProfile = useUpdateProfile();
  const events = useEvents();
  const checkins = useCheckins();
  const journal = useJournalEntries();

  const [nameDraft, setName] = useState<string | null>(null);
  const [openedAt] = useState(() => Date.now());
  const name = nameDraft ?? user?.displayName ?? '';

  async function save() {
    await updateProfile(name);
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/settings');
  }
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  // The canvas monogram is a single letter, not a two-letter badge.
  const initial = ((name || email || 'You').trim()[0] ?? 'Y').toUpperCase();
  const username = (email ? email.split('@')[0] : (name || 'you').toLowerCase().replace(/\s+/g, '')) || 'you';
  const started = user ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const valuesCount = lifeMap?.values.length ?? 0;

  // ── the medallions shelf — the album, condensed ──
  const days = user ? Math.max(1, Math.floor((openedAt - user.createdAt) / 86400000) + 1) : 1;
  const rode = (events ?? []).filter((e) => e.type === 'urge_rode_out').length;
  const letters = (journal ?? []).filter((j) => j.tag === 'Letter').length;
  const recovered = (events ?? []).some((e) => e.type === 'lapse');
  const entries = (journal ?? []).length;
  const checkinDays = (checkins ?? []).length;
  const shelfTier = (count: number, steps: number[]) => steps.filter((st) => count >= st).length;
  const returns = (events ?? []).filter((e) => e.type === 'urge_rode_out' || e.type === 'urge_acted_on').length;
  const album: { key: KeepsakeSceneKey; earned: boolean; tier: number | null; tierMax: number }[] = [
    { key: 'backondeck', earned: returns >= 1, tier: shelfTier(returns, [1, 5, 25, 100]), tierMax: 4 },
    { key: 'lettersent', earned: letters >= 1, tier: shelfTier(letters, [1, 4, 12, 24, 52]), tierMax: 5 },
    { key: 'veni', earned: true, tier: null, tierMax: 0 },
    { key: 'vidi', earned: days >= 3, tier: shelfTier(days, [3, 7, 30, 90, 180, 365]), tierMax: 6 },
    { key: 'vici', earned: rode >= 1, tier: shelfTier(rode, [1, 5, 25, 100, 250, 500, 1000]), tierMax: 7 },
    { key: 'bounce', earned: recovered, tier: shelfTier(recovered ? 1 : 0, [1, 10, 25, 50, 100]), tierMax: 5 },
    { key: 'firstlight', earned: checkinDays >= 1, tier: null, tierMax: 0 },
    { key: 'honest', earned: entries >= 10, tier: shelfTier(entries, [10, 50, 100, 200, 365]), tierMax: 5 },
  ];
  const earnedShelf = album.filter((k) => k.earned);
  const shelfShown = earnedShelf.slice(0, 4);
  const shelfMore = earnedShelf.length - shelfShown.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* the bar box is 64 tall so the monogram opens the scroll at y 64 */}
        <View style={{ height: 64 }}>
          {/* the title box stops 80 in from each edge so it can never run under Cancel or Save */}
          <AppText center style={[sans('600'), { position: 'absolute', left: 80, right: 80, top: 10, fontSize: 18.5, letterSpacing: 0.2, color: '#1D1C1A' }]}>
            Edit profile
          </AppText>
          <PressScale
            onPress={close}
            accessibilityRole="button"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 20 }}
            style={{ position: 'absolute', left: 16, top: 12, minHeight: 0 }}>
            <AppText style={[sans('400'), { fontSize: 17, color: '#3A3934' }]}>Cancel</AppText>
          </PressScale>
          <PressScale
            onPress={save}
            accessibilityRole="button"
            hitSlop={{ top: 16, bottom: 16, left: 20, right: 16 }}
            style={{ position: 'absolute', right: 16, top: 12, minHeight: 0 }}>
            <AppText style={[sans('600'), { fontSize: 17, color: '#1D1C1A' }]}>Save</AppText>
          </PressScale>
        </View>

        <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* 156 carries the monogram block down to the fields card at y 220 */}
          <View style={{ height: 156, alignItems: 'center' }}>
            <View>
              <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#EDECE7', alignItems: 'center', justifyContent: 'center' }}>
                <AppText style={[sans('600'), { fontSize: 28, color: '#55534E' }]}>{initial}</AppText>
              </View>
              <View style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderRadius: 15, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 20l4-1L19 8a2 2 0 00-3-3L5 16l-1 4z" stroke="#F4F3F0" strokeWidth={2} fill="none" strokeLinejoin="round" />
                </Svg>
              </View>
            </View>
            <PressScale accessibilityRole="button" hitSlop={{ top: 14, bottom: 14, left: 20, right: 20 }} style={{ marginTop: 12, minHeight: 0 }}>
              <AppText style={[sans('600'), { fontSize: 14.5, color: '#1D1C1A' }]}>Change photo</AppText>
            </PressScale>
          </View>

          <View style={{ marginHorizontal: 12, marginBottom: 26, borderRadius: 16, backgroundColor: '#FFFFFF', paddingVertical: 4, paddingHorizontal: 18 }}>
            <View style={{ height: 46, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <AppText style={[sans('400'), { width: 86, fontSize: 13.5, color: '#8B8882' }]}>Name</AppText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#B0AEA8"
                style={[sans('500'), { flex: 1, fontSize: 14.5, color: '#1D1C1A', padding: 0 }]}
              />
            </View>
            <View style={{ height: 1, backgroundColor: HAIRLINE }} />
            <FieldLine label="Username" value={`@${username}`} />
            <View style={{ height: 1, backgroundColor: HAIRLINE }} />
            <FieldLine label="Email" value={email ?? 'Offline account'} />
          </View>

          <Section header="Medallions" gap={24} card={{ paddingVertical: 16, paddingHorizontal: 18 }}>
            <PressScale
              onPress={() => router.push('/milestones')}
              accessibilityRole="button"
              accessibilityLabel="Medallions"
              style={{ minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {shelfShown.map((k) => (
                // the canvas frames each coin in a hairline, a paper gap and a fainter ring
                <View key={k.key} style={{ width: 48, height: 48, borderRadius: 24, boxShadow: '0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 4px #FFFFFF, 0 0 0 5.4px rgba(0,0,0,0.16)' }}>
                  <KKMedallion scene={k.key} size={48} earned tier={k.tier} tierMax={k.tierMax} />
                </View>
              ))}
              {shelfMore > 0 ? (
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#EDECE7', alignItems: 'center', justifyContent: 'center' }}>
                  <AppText style={[sans('600'), { fontSize: 12.5, color: '#55534E' }]}>+{shelfMore}</AppText>
                </View>
              ) : null}
              <View style={{ flex: 1 }} />
              <ChevronGlyph color="#B0AEA8" />
            </PressScale>
          </Section>

          <Section header="Journey" gap={26} card={{ paddingVertical: 4, paddingHorizontal: 18 }}>
            <FieldLine label="Started VICI" value={started} record />
            <View style={{ height: 1, backgroundColor: HAIRLINE }} />
            <FieldLine label="My values" value={`${valuesCount} chosen`} record onPress={() => router.push('/lifemap')} />
          </Section>

          {/* not in the canvas frame: profile is the only door to Settings from Today */}
          <Section header="App" gap={0} card={{ paddingVertical: 4, paddingHorizontal: 18 }}>
            <FieldLine label="Settings" value="Reminders · lock · billing" record onPress={() => router.push('/(app)/settings')} />
          </Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/** A captioned group; the 26-tall caption box is the canvas's caption-to-card gap. */
function Section({ header, gap = 26, card, children }: { header: string; gap?: number; card?: ViewStyle; children: ReactNode }) {
  return (
    <View style={{ marginBottom: gap }}>
      <View style={{ height: 26, paddingHorizontal: 16 }}>
        <AppText style={[sans('600'), { fontSize: 13, color: '#55534E' }]}>{header}</AppText>
      </View>
      <View style={[{ marginHorizontal: 12, borderRadius: 16, backgroundColor: '#FFFFFF' }, card]}>{children}</View>
    </View>
  );
}

/**
 * A 46-tall line of the account record. The identity fields set the label in a
 * fixed 86 column; the journey lines push their value to the right instead.
 */
function FieldLine({ label, value, record, onPress }: { label: string; value: string; record?: boolean; onPress?: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={{ height: 46, minHeight: 0, flexDirection: 'row', alignItems: 'center', justifyContent: record ? 'space-between' : 'flex-start', gap: 12 }}>
      <AppText style={[sans('400'), record ? { fontSize: 15, color: '#55534E' } : { width: 86, fontSize: 13.5, color: '#8B8882' }]}>{label}</AppText>
      <AppText style={[sans(record ? '600' : '500'), { flexShrink: 1, fontSize: record ? 15 : 14.5, color: '#1D1C1A' }]}>{value}</AppText>
    </PressScale>
  );
}
