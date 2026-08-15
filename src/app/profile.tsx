import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Modal, ScrollView, TextInput, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, BackGlyph, ChevronGlyph, Grain, PressScale } from '@/components/ui';
import { type KeepsakeSceneKey, KKMedallion } from '@/components/keepsakes/Medallion';
import { useAuth } from '@/lib/auth';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLifeMap, useUpdateProfile } from '@/lib/backend';
import { weekFor } from '@/content/curriculum84';
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
  const [photoOpen, setPhotoOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const name = nameDraft ?? user?.displayName ?? '';

  // Save now closes the sheet rather than the screen — 93C puts the pill in
  // the sheet, and the header has no Save any more.
  async function save() {
    await updateProfile(name);
    setNameOpen(false);
  }
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  // The canvas monogram is a single letter, not a two-letter badge.
  const initial = ((name || email || 'You').trim()[0] ?? 'Y').toUpperCase();
  const username = (email ? email.split('@')[0] : (name || 'you').toLowerCase().replace(/\s+/g, '')) || 'you';
  const started = user ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const valuesCount = lifeMap?.values.length ?? 0;
  // "VI · Discipline" — the roman numeral and the week's name, off the same
  // twelve-week table the week overviews are built from.
  const weekNumber = user ? Math.min(12, Math.floor(Math.max(0, openedAt - user.createdAt) / (7 * 86_400_000)) + 1) : 1;
  const week = weekFor(weekNumber);
  const currentWeek = week ? `${week.roman} · ${week.name}` : '—';

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
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* canvas 64 and 114 — the block runs to the monogram at 112. Save is
            gone from the bar: it lives in the name sheet now. */}
        <View style={{ height: 112 }}>
          <PressScale
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <BackGlyph color="#55534E" />
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
          </PressScale>
          <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 60, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
            Edit profile
          </AppText>
        </View>

        <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* 152 carries the monogram block down to the identity card at 264 */}
          <View style={{ height: 152, alignItems: 'center' }}>
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
            <PressScale
              onPress={() => setPhotoOpen(true)}
              accessibilityRole="button"
              hitSlop={{ top: 14, bottom: 14, left: 20, right: 20 }}
              style={{ marginTop: 12, minHeight: 0 }}>
              <AppText style={[sans('600'), { fontSize: 14.5, color: '#1D1C1A' }]}>Change photo</AppText>
            </PressScale>
          </View>

          <View style={{ marginHorizontal: 12, marginBottom: 20, borderRadius: 16, backgroundColor: '#FFFFFF', paddingVertical: 4, paddingHorizontal: 18 }}>
            {/* the name is read-only here now; 93C is where it is edited */}
            <PressScale
              onPress={() => setNameOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={`Name, ${name || 'not set'}`}
              style={{ height: 46, minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <AppText style={[sans('400'), { width: 86, fontSize: 13.5, color: '#8B8882' }]}>Name</AppText>
              <AppText style={[sans('500'), { flex: 1, fontSize: 14.5, color: name ? '#1D1C1A' : '#B0AEA8' }]}>{name || 'Your name'}</AppText>
            </PressScale>
            <View style={{ height: 1, backgroundColor: HAIRLINE }} />
            <FieldLine label="Username" value={`@${username}`} />
            <View style={{ height: 1, backgroundColor: HAIRLINE }} />
            <FieldLine label="Email" value={email ?? 'Offline account'} />
          </View>

          <Section header="Medallions" gap={28} card={{ paddingVertical: 16, paddingHorizontal: 18 }}>
            <PressScale
              onPress={() => router.push('/milestones')}
              accessibilityRole="button"
              accessibilityLabel="Medallions"
              style={{ minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {shelfShown.map((k) => (
                // the canvas frames each coin in a hairline, a paper gap and a fainter ring
                <View key={k.key} style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 4px #FFFFFF, 0 0 0 5.4px rgba(0,0,0,0.16)' }}>
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
            <FieldLine label="Current week" value={currentWeek} record />
            <View style={{ height: 1, backgroundColor: HAIRLINE }} />
            <ActionLine label="Weekly reports" onPress={() => router.push('/weekly-report')} />
          </Section>

          {/* Not on the canvas. `My values` left the Journey card with the
              redesign and no frame in the bundle points at /lifemap or at
              Settings, so profile keeps both doors (DECISIONS D-026). */}
          <Section header="App" gap={0} card={{ paddingVertical: 4, paddingHorizontal: 18 }}>
            <FieldLine label="My values" value={`${valuesCount} chosen`} record onPress={() => router.push('/lifemap')} />
            <View style={{ height: 1, backgroundColor: HAIRLINE }} />
            <FieldLine label="Settings" value="Reminders · lock · billing" record onPress={() => router.push('/(app)/settings')} />
          </Section>
        </ScrollView>
      </SafeAreaView>

      <ProfileSheet open={photoOpen} title="Profile photo" onClose={() => setPhotoOpen(false)}>
        <View style={{ marginTop: 16, borderRadius: 16, borderCurve: 'continuous', backgroundColor: '#FFFFFF', paddingVertical: 4 }}>
          <SheetRow label="Take photo" onPress={() => setPhotoOpen(false)} />
          <View style={{ height: 1, marginHorizontal: 18, backgroundColor: HAIRLINE }} />
          <SheetRow label="Choose from library" onPress={() => setPhotoOpen(false)} />
          <View style={{ height: 1, marginHorizontal: 18, backgroundColor: HAIRLINE }} />
          <SheetRow label="Remove photo" tone="#A4613C" onPress={() => setPhotoOpen(false)} />
        </View>
        <PressScale
          onPress={() => setPhotoOpen(false)}
          accessibilityRole="button"
          style={{ marginTop: 12, height: 50, minHeight: 50, borderRadius: 25, backgroundColor: '#F4F3F0', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 16, color: '#55534E' }]}>Cancel</AppText>
        </PressScale>
      </ProfileSheet>

      <ProfileSheet open={nameOpen} title="Name" onClose={() => setNameOpen(false)}>
        <View
          style={{
            marginTop: 16,
            height: 54,
            borderRadius: 16,
            borderCurve: 'continuous',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 0 1.5px rgba(0,0,0,0.14)',
            paddingHorizontal: 18,
            justifyContent: 'center',
          }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#B0AEA8"
            autoFocus
            style={[sans('500'), { fontSize: 16.5, color: '#1D1C1A', padding: 0 }]}
          />
        </View>
        <AppText style={[sans('400'), { marginTop: 8, fontSize: 12.5, color: '#8B8882' }]}>Shown on your vow and your letters.</AppText>
        <PressScale
          onPress={() => void save()}
          accessibilityRole="button"
          style={{ marginTop: 16, height: 54, minHeight: 54, borderRadius: 27, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 17, color: '#FFFFFF' }]}>Save</AppText>
        </PressScale>
      </ProfileSheet>
    </View>
  );
}

/** 93B / 93C · the two bottom sheets — same shell, different contents. */
function ProfileSheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <PressScale
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, minHeight: 0, backgroundColor: 'rgba(19,19,19,0.45)' }}>
          <View />
        </PressScale>
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#F4F3F0', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <View style={{ paddingTop: 10, paddingHorizontal: 20, paddingBottom: 30 }}>
            <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: 'rgba(19,19,19,0.15)' }} />
            <AppText center style={[sans('600'), { marginTop: 16, fontSize: 17, color: '#1D1C1A' }]}>
              {title}
            </AppText>
            {children}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

/** A 52-tall centred row inside the photo sheet's card. */
function SheetRow({ label, tone = '#1D1C1A', onPress }: { label: string; tone?: string; onPress: () => void }) {
  return (
    <PressScale onPress={onPress} accessibilityRole="button" style={{ height: 52, minHeight: 52, alignItems: 'center', justifyContent: 'center' }}>
      <AppText style={[sans('500'), { fontSize: 16, color: tone }]}>{label}</AppText>
    </PressScale>
  );
}

/** A row that is only a label and a chevron — `FieldLine` cannot say that. */
function ActionLine({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={{ height: 46, minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <AppText style={[sans('500'), { fontSize: 16, color: '#1D1C1A' }]}>{label}</AppText>
      <ChevronGlyph color="#B0AEA8" />
    </PressScale>
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
