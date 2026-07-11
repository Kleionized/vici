import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, Avatar, SectionLabel, SettingsGroup, SettingsRow } from '@/components/ui';
import { type KeepsakeSceneKey, KKMedallion } from '@/components/keepsakes/Medallion';
import { useAuth } from '@/lib/auth';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLifeMap, useUpdateProfile } from '@/lib/backend';
import { colors, fonts, radius, sans, spacing } from '@/lib/theme';

export default function Profile() {
  const router = useRouter();
  const { email } = useAuth();
  const user = useCurrentUser();
  const lifeMap = useLifeMap();
  const updateProfile = useUpdateProfile();
  const events = useEvents();
  const checkins = useCheckins();
  const journal = useJournalEntries();

  const [name, setName] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user && !loaded) {
      setName(user.displayName ?? '');
      setLoaded(true);
    }
  }, [user, loaded]);

  async function save() {
    await updateProfile(name);
    router.canGoBack() ? router.back() : router.replace('/(app)/settings');
  }
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  const initials = (name || email || 'You')
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');
  const username = (email ? email.split('@')[0] : (name || 'you').toLowerCase().replace(/\s+/g, '')) || 'you';
  const sober = user ? new Date(user.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const valuesCount = lifeMap?.values.length ?? 0;

  // ── the medallions shelf — the album, condensed (canvas: EditProfile) ──
  const days = user ? Math.max(1, Math.floor((Date.now() - user.createdAt) / 86400000) + 1) : 1;
  const rode = (events ?? []).filter((e) => e.type === 'urge_rode_out').length;
  const letters = (journal ?? []).filter((j) => j.tag === 'Letter').length;
  const recovered = (events ?? []).some((e) => e.type === 'lapse');
  const entries = (journal ?? []).length;
  const checkinDays = (checkins ?? []).length;
  const shelfTier = (count: number, steps: number[]) => steps.filter((st) => count >= st).length;
  const album: { key: KeepsakeSceneKey; name: string; earned: boolean; tier: number | null; tierMax: number }[] = [
    { key: 'lettersent', name: 'Letter sent', earned: letters >= 1, tier: shelfTier(letters, [1, 4, 12, 24, 52]), tierMax: 5 },
    { key: 'veni', name: 'Veni', earned: true, tier: null, tierMax: 0 },
    { key: 'vidi', name: 'Vidi', earned: days >= 3, tier: shelfTier(days, [3, 7, 30, 90, 180, 365]), tierMax: 6 },
    { key: 'vici', name: 'Vici', earned: rode >= 1, tier: shelfTier(rode, [1, 5, 25, 100, 250, 500, 1000]), tierMax: 7 },
    { key: 'bounce', name: 'Never failed twice', earned: recovered, tier: shelfTier(recovered ? 1 : 0, [1, 10, 25, 50, 100]), tierMax: 5 },
    { key: 'firstlight', name: 'First light', earned: checkinDays >= 1, tier: null, tierMax: 0 },
    { key: 'honest', name: 'Honest ink', earned: entries >= 10, tier: shelfTier(entries, [10, 50, 100, 200, 365]), tierMax: 5 },
  ];
  const earnedShelf = album.filter((k) => k.earned);
  const shelfShown = earnedShelf.slice(0, 4);
  const shelfMore = earnedShelf.length - shelfShown.length;
  const newestShelf = recovered ? 'Never failed twice' : letters >= 1 ? 'Letter sent' : rode >= 1 ? 'Vici' : checkinDays >= 1 ? 'First light' : 'Veni';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
          <Pressable onPress={close} hitSlop={8}>
            <AppText weightOverride="500" style={{ fontSize: 16, color: colors.textMuted }}>
              Cancel
            </AppText>
          </Pressable>
          <AppText weightOverride="500" style={{ fontSize: 15.5 }}>
            Edit profile
          </AppText>
          <Pressable onPress={save} hitSlop={8}>
            <AppText weightOverride="500" style={{ fontSize: 15 }}>
              Save
            </AppText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginVertical: spacing.xl }}>
            <View>
              <Avatar initials={initials || 'YOU'} size={88} />
              <View style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderRadius: 9999, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg }}>
                <Svg width={15} height={15} viewBox="0 0 24 24">
                  <Path d="M4 20l4-1L19 8a2 2 0 00-3-3L5 16l-1 4z" stroke={colors.text} strokeWidth={2} fill="none" strokeLinejoin="round" />
                </Svg>
              </View>
            </View>
            <Pressable hitSlop={8} style={{ marginTop: 12 }}>
              <AppText weightOverride="500" style={{ fontSize: 14.5 }}>
                Change photo
              </AppText>
            </Pressable>
          </View>

          <View style={{ marginHorizontal: 16, marginBottom: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden' }}>
            {/* editable name */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, gap: 12 }}>
              <AppText weightOverride="400" style={{ width: 86, fontSize: 13.5, color: colors.textMuted }}>
                Name
              </AppText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textSoft}
                style={{ flex: 1, fontFamily: fonts.body, fontSize: 14.5, color: colors.text, padding: 0 }}
              />
            </View>
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 18 }} />
            <ReadRow label="Username" value={`@${username}`} />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 18 }} />
            <ReadRow label="Email" value={email ?? 'Offline account'} last />
          </View>

          {/* medallions — the shelf, straight from the album */}
          <View style={{ marginHorizontal: 16, marginBottom: 22 }}>
            <View style={{ paddingBottom: 12 }}>
              <SectionLabel>Medallions</SectionLabel>
            </View>
            <Pressable
              onPress={() => router.push('/milestones')}
              accessibilityRole="button"
              style={({ pressed }) => ({
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                paddingVertical: 16,
                paddingHorizontal: 18,
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {shelfShown.map((k) => (
                  <KKMedallion key={k.key} scene={k.key} size={50} earned tier={k.tier} tierMax={k.tierMax} />
                ))}
                {shelfMore > 0 ? (
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 9999,
                      backgroundColor: colors.accentSoft,
                      borderWidth: 1.4,
                      borderColor: 'rgba(74,74,66,0.16)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textMuted, fontVariant: ['tabular-nums'] }]}>+{shelfMore}</AppText>
                  </View>
                ) : null}
                <View style={{ flex: 1 }} />
                <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
                  <Path d="m1.5 1.5 5 5.5-5 5.5" stroke={colors.textSoft} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textSoft, marginTop: 13, fontVariant: ['tabular-nums'] }]}>
                {earnedShelf.length} earned · {newestShelf} is newest
              </AppText>
            </Pressable>
          </View>

          <SettingsGroup header="Recovery">
            <SettingsRow glyph="calendar" title="Campaign began" detail={sober} />
            <SettingsRow glyph="heart" title="My values" detail={`${valuesCount} chosen`} last onPress={() => router.push('/lifemap')} />
          </SettingsGroup>

          <SettingsGroup header="App">
            <SettingsRow glyph="bell" title="Settings" detail="Reminders · lock · billing" last onPress={() => router.push('/(app)/settings')} />
          </SettingsGroup>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ReadRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, gap: 12 }}>
        <AppText weightOverride="400" style={{ width: 86, fontSize: 13.5, color: colors.textMuted }}>
          {label}
        </AppText>
        <AppText weightOverride="500" style={{ flex: 1, fontSize: 14.5, letterSpacing: 0.1 }}>
          {value}
        </AppText>
      </View>
      {!last ? <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 18 }} /> : null}
    </View>
  );
}
