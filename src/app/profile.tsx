import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, Avatar, SettingsGroup, SettingsRow } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCurrentUser, useLifeMap, useUpdateProfile } from '@/lib/backend';
import { colors, fonts, radius, spacing } from '@/lib/theme';

export default function Profile() {
  const router = useRouter();
  const { email } = useAuth();
  const user = useCurrentUser();
  const lifeMap = useLifeMap();
  const updateProfile = useUpdateProfile();

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

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
          <Pressable onPress={close} hitSlop={8}>
            <AppText weightOverride="600" style={{ fontSize: 16.5, color: colors.textMuted }}>
              Cancel
            </AppText>
          </Pressable>
          <AppText weightOverride="700" style={{ fontSize: 17 }}>
            Edit profile
          </AppText>
          <Pressable onPress={save} hitSlop={8}>
            <AppText weightOverride="700" style={{ fontSize: 16.5 }}>
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
              <AppText weightOverride="700" style={{ fontSize: 14.5 }}>
                Change photo
              </AppText>
            </Pressable>
          </View>

          <View style={{ marginHorizontal: 16, marginBottom: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden' }}>
            {/* editable name */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, gap: 12 }}>
              <AppText weightOverride="600" style={{ width: 86, fontSize: 15.5, color: colors.textMuted }}>
                Name
              </AppText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textSoft}
                style={{ flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.text, padding: 0 }}
              />
            </View>
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 18 }} />
            <ReadRow label="Username" value={`@${username}`} />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 18 }} />
            <ReadRow label="Email" value={email ?? 'Offline account'} last />
          </View>

          <SettingsGroup header="Recovery">
            <SettingsRow glyph="calendar" title="Sober since" detail={sober} />
            <SettingsRow glyph="heart" title="My values" detail={`${valuesCount} chosen`} last onPress={() => router.push('/lifemap')} />
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
        <AppText weightOverride="600" style={{ width: 86, fontSize: 15.5, color: colors.textMuted }}>
          {label}
        </AppText>
        <AppText weightOverride="600" style={{ flex: 1, fontSize: 16.5, letterSpacing: -0.2 }}>
          {value}
        </AppText>
      </View>
      {!last ? <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 18 }} /> : null}
    </View>
  );
}
