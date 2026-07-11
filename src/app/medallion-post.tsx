import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { KKMedallion } from '@/components/keepsakes/Medallion';
import { AppText } from '@/components/ui';
import { useCreateJournalEntry, useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { setJSON } from '@/lib/storage';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * Post from VICI, beyond the slip (canvas: screens-letter-drops) — the same
 * sealed envelope arrives when a medallion is earned; the card outside says
 * only "You received a letter." Inside, a short letter presents the medallion
 * ("Back on deck"), and this one carries an enclosure: the yearly plan at a
 * drop price — a quiet thank-you, good for VII days, no timer.
 */

const POST_DONE_KEY = 'tideline.post.backondeck.delivered';
const LT_INK = '#3B3B33';
const LT_DARK = '#26261F';

type Phase = 'arrive' | 'opening' | 'read' | 'offer' | 'claimed' | 'kept' | 'later';

export default function MedallionPost() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const updateSettings = useUpdateSettings();
  const createJournalEntry = useCreateJournalEntry();
  const [phase, setPhase] = useState<Phase>('arrive');
  const [breathe] = useState(() => new Animated.Value(0));
  const name = (user?.displayName || '').trim().split(/\s+/)[0] || '';

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ]),
    ).start();
  }, [breathe]);

  useEffect(() => {
    if (phase !== 'opening') return;
    const id = setTimeout(() => setPhase('read'), 1200);
    return () => clearTimeout(id);
  }, [phase]);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  async function keep() {
    await setJSON(POST_DONE_KEY, Date.now());
    await createJournalEntry({
      tag: 'Letter',
      title: 'VICI Post · Back on deck',
      body: `Dear ${name || 'friend'},\n\nLast night an urge rose, crested, and left without you. And this morning you opened the app anyway — logged it, stayed. Most men vanish for a week after a night like that. You came back.\n\nBack on deck — earned.\n\nThe return is the strongest predictor there is — stronger than any count. So this one isn't for resisting. It's for coming back.\n\n— VICI Post`,
    }).catch(() => {});
    setPhase('kept');
  }

  async function claim() {
    await setJSON(POST_DONE_KEY, Date.now());
    await updateSettings({ premium: true, yearlyDrop: true }).catch(() => {});
    setPhase('claimed');
  }

  const scrim = phase === 'arrive' || phase === 'opening' || phase === 'read' || phase === 'offer';

  return (
    <View style={{ flex: 1, backgroundColor: scrim ? 'rgba(38,37,30,0.9)' : colors.bg }}>
      <StatusBar style={scrim ? 'light' : 'dark'} />

      {/* arrival — the sealed envelope over the day */}
      {(phase === 'arrive' || phase === 'opening') && (
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <Animated.View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              overflow: 'hidden',
              opacity: phase === 'opening' ? 0.6 : 1,
              transform: [{ scale: phase === 'opening' ? 1.03 : 1 }],
            }}>
            <View style={{ height: 212, backgroundColor: '#131313', overflow: 'hidden' }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] }) }],
                }}>
                <Image source={require('../../assets/images/envelope-seal.webp')} contentFit="contain" style={{ width: '74%', height: '84%' }} />
              </Animated.View>
              <Pressable
                onPress={() => {
                  void setJSON(POST_DONE_KEY, Date.now());
                  setPhase('later');
                }}
                hitSlop={8}
                accessibilityLabel="Not now"
                style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: 9999, backgroundColor: 'rgba(245,244,241,0.94)', alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={15} height={15} viewBox="0 0 20 20">
                  <Path d="M3 3l14 14M17 3L3 17" stroke="#4A4A42" strokeWidth={2.2} strokeLinecap="round" />
                </Svg>
              </Pressable>
            </View>
            <View style={{ paddingHorizontal: 28, paddingTop: 26, paddingBottom: 28, alignItems: 'center' }}>
              <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 27, lineHeight: 30, letterSpacing: 0.27, color: colors.text }}>
                You received a letter.
              </AppText>
              <Pressable
                onPress={() => setPhase('opening')}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  marginTop: 24,
                  alignSelf: 'stretch',
                  backgroundColor: colors.ink,
                  borderRadius: 9999,
                  paddingVertical: 15,
                  alignItems: 'center',
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}>
                <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: 0.47, color: colors.inkText }]}>Break the seal</AppText>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      )}

      {/* the letter — the medallion presented */}
      {phase === 'read' && (
        <View
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            top: Math.max(insets.top + 12, 44),
            bottom: Math.max(insets.bottom + 20, 44),
            borderRadius: 26,
            backgroundColor: '#FDFBF5',
            overflow: 'hidden',
          }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: '31%', height: 1.5, backgroundColor: 'rgba(0,0,0,0.05)' }} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: '63%', height: 1.5, backgroundColor: 'rgba(0,0,0,0.04)' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 22, paddingTop: 20 }}>
            <Pressable
              onPress={close}
              hitSlop={8}
              accessibilityLabel="Close"
              style={{ width: 34, height: 34, borderRadius: 9999, backgroundColor: '#FBFAF9', alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={15} height={15} viewBox="0 0 20 20">
                <Path d="M3 3l14 14M17 3L3 17" stroke="#4A4A42" strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingTop: 12, paddingBottom: 8 }}>
            <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 29, lineHeight: 34, color: LT_DARK, marginBottom: 18 }}>
              Dear {name || 'friend'},
            </AppText>
            <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 18, lineHeight: 30, color: LT_INK, marginBottom: 18 }}>
              Last night an urge rose, crested, and left without you. And this morning you opened the app anyway — logged it, stayed. Most men
              vanish for a week after a night like that. You came back.
            </AppText>
            {/* the medallion, presented */}
            <View style={{ alignItems: 'center', gap: 12, marginTop: 6, marginBottom: 22 }}>
              <KKMedallion scene="backondeck" size={118} earned tier={1} tierMax={4} />
              <View style={{ alignItems: 'center' }}>
                <AppText style={[sans('600'), { fontSize: 12, letterSpacing: 2.4, textTransform: 'uppercase', color: LT_DARK }]}>Back on deck</AppText>
                <AppText style={[sans('500'), { fontSize: 11.5, letterSpacing: 0.92, color: 'rgba(59,59,51,0.6)', marginTop: 4 }]}>Earned</AppText>
              </View>
            </View>
            <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 18, lineHeight: 30, color: LT_INK, marginBottom: 18 }}>
              The return is the strongest predictor there is — stronger than any count. So this one isn’t for resisting. It’s for coming back.
            </AppText>
            <View style={{ marginTop: 2, gap: 3 }}>
              <AppText style={{ fontFamily: fonts.serifSharpItalic, fontSize: 21, color: LT_DARK }}>— VICI Post</AppText>
              <Svg width={150} height={12} viewBox="0 0 150 12" fill="none">
                <Path d="M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7" stroke="rgba(38,38,31,0.5)" strokeWidth={1.6} strokeLinecap="round" />
              </Svg>
            </View>
            <AppText style={{ fontFamily: fonts.serifSharpItalic, fontSize: 14.5, lineHeight: 22, color: 'rgba(59,59,51,0.62)', marginTop: 22 }}>
              P.S. — something is enclosed with this one. It keeps for seven days.
            </AppText>
          </ScrollView>
          <View style={{ paddingHorizontal: 22, paddingTop: 12, paddingBottom: 20 }}>
            <Pressable
              onPress={() => setPhase('offer')}
              accessibilityRole="button"
              style={({ pressed }) => ({
                backgroundColor: colors.ink,
                borderRadius: 9999,
                paddingVertical: 15,
                alignItems: 'center',
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}>
              <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: 0.47, color: colors.inkText }]}>Open the enclosure</AppText>
            </Pressable>
            <Pressable onPress={() => void keep()} style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 2 }}>
              <AppText style={[sans('500'), { fontSize: 14, color: 'rgba(59,59,51,0.66)' }]}>Tuck it into your Log</AppText>
            </Pressable>
          </View>
        </View>
      )}

      {/* the enclosure — the year, at a drop */}
      {phase === 'offer' && (
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: '#131313', borderRadius: 26, paddingTop: 30, paddingHorizontal: 26, paddingBottom: 26, alignItems: 'center' }}>
            <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.31, textTransform: 'uppercase', color: 'rgba(245,244,241,0.62)' }]}>
              Enclosed with Back on deck
            </AppText>
            <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 28, lineHeight: 31, letterSpacing: 0.14, color: '#F5F4F1', marginTop: 12 }}>
              The year, at a drop.
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 12, marginTop: 22 }}>
              <AppText style={[sans('500'), { fontSize: 17, color: 'rgba(245,244,241,0.45)', textDecorationLine: 'line-through' }]}>$39.99</AppText>
              <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 46, lineHeight: 46, color: '#F5F4F1', fontVariant: ['tabular-nums'] }}>$26.99</AppText>
              <AppText style={[sans('500'), { fontSize: 14, color: 'rgba(245,244,241,0.62)' }]}>/year</AppText>
            </View>
            <AppText style={[sans('400'), { fontSize: 12.5, color: 'rgba(245,244,241,0.62)', marginTop: 8 }]}>$2.25 a month · billed once</AppText>
            <View style={{ alignSelf: 'stretch', height: 1, backgroundColor: 'rgba(245,244,241,0.14)', marginVertical: 20 }} />
            <AppText center style={[sans('400'), { fontSize: 13, lineHeight: 20, color: 'rgba(245,244,241,0.62)', marginHorizontal: 8 }]}>
              A quiet thank-you for coming back. Good for VII days, then it expires on its own — no timer chasing you.
            </AppText>
            <Pressable
              onPress={() => void claim()}
              accessibilityRole="button"
              style={({ pressed }) => ({
                alignSelf: 'stretch',
                backgroundColor: '#F5F4F1',
                borderRadius: 9999,
                paddingVertical: 15,
                alignItems: 'center',
                marginTop: 20,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}>
              <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: 0.31, color: '#131313' }]}>Claim the year — $26.99</AppText>
            </Pressable>
            <Pressable onPress={() => void keep()} style={{ paddingTop: 14, paddingHorizontal: 6 }}>
              <AppText style={[sans('500'), { fontSize: 13.5, color: 'rgba(245,244,241,0.62)' }]}>Maybe later — it keeps</AppText>
            </Pressable>
          </View>
        </View>
      )}

      {/* toasts over the quiet day */}
      {(phase === 'claimed' || phase === 'kept' || phase === 'later') && (
        <Pressable onPress={close} style={{ flex: 1 }}>
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 132, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingLeft: 12, paddingRight: 18, borderRadius: 9999, backgroundColor: '#F8F7F4' }}>
              <View style={{ width: 24, height: 24, borderRadius: 9999, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 12.5l5 5L20 6.5" stroke={colors.inkText} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>
                {phase === 'claimed' ? 'The year is yours — Plus unlocked' : phase === 'kept' ? 'Tucked into your Log' : "It'll be there if you need it"}
              </AppText>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}
