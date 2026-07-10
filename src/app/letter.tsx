import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Path, Text as SvgText, TextPath } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { useCreateJournalEntry, useCurrentUser, useLifeMap } from '@/lib/backend';
import { getJSON, setJSON } from '@/lib/storage';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * The letter (canvas: screens-letter). A sealed envelope from day-zero you
 * waits in the Log; the morning after a slip it arrives over Today. Breaking
 * the wax unfolds one message — don't fail twice — then it reseals itself
 * back into the Log.
 *
 * The design's literal CSS 3D flap can't be reproduced in RN, so the motion is
 * a tasteful approximation — the arrival card lifts away and the reading sheet
 * unfolds in (fade · scale · rise) — while every visual state stays 1:1.
 */

const LETTER_KEY = 'tideline.letter.day3';
const PENDING_KEY = 'tideline.letter.pending';
const LT_INK = '#3B3B33';
const LT_INK_STRONG = '#26261F';

type Phase = 'arrive' | 'opening' | 'read' | 'kept' | 'after' | 'later';

export default function LetterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const lifeMap = useLifeMap();
  const createJournalEntry = useCreateJournalEntry();
  const [phase, setPhase] = useState<Phase>('arrive');

  const name = user?.displayName?.trim().split(/\s+/)[0] || 'friend';
  const why = lifeMap?.whyStatement?.trim() || 'I want to be present for the people I love';

  // ── motion values ──────────────────────────────────────────────────
  const dim = useRef(new Animated.Value(0)).current;
  const card = useRef(new Animated.Value(0)).current; // 0 hidden → 1 settled
  const sheet = useRef(new Animated.Value(0)).current; // 0 hidden → 1 unfolded
  const toast = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  // dim + card drop-in on mount
  useEffect(() => {
    Animated.timing(dim, { toValue: 1, duration: 480, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    Animated.timing(card, { toValue: 1, duration: 780, easing: Easing.bezier(0.24, 1.24, 0.42, 1), useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, [breathe, card, dim]);

  const dismiss = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  }, [router]);

  const breakSeal = useCallback(() => {
    setPhase('opening');
    Animated.timing(card, { toValue: 2, duration: 480, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => {
      setPhase('read');
      Animated.timing(sheet, { toValue: 1, duration: 720, easing: Easing.bezier(0.22, 1.12, 0.36, 1), useNativeDriver: true }).start();
    });
  }, [card, sheet]);

  const keep = useCallback(() => {
    setPhase('kept');
    // Tuck it into the Log — persist the letter as a journal entry (once).
    void (async () => {
      const prev = await getJSON<{ kept?: boolean }>(LETTER_KEY);
      await setJSON(LETTER_KEY, { kept: true, at: Date.now() });
      await setJSON(PENDING_KEY, null);
      if (prev?.kept) return;
      const body = `Dear ${name},\n\nIt happened. Nothing since day zero is erased.\n\nOne slip is data. Two begins a pattern. The next choice is the only one that counts: don’t fail twice.\n\nI can still feel how much you meant it: ${why}.\n\n— you, on day zero`;
      await createJournalEntry({ tag: 'Letter', title: 'Don’t fail twice', body }).catch(() => {});
    })();
    setTimeout(() => {
      setPhase('after');
      Animated.timing(toast, { toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      setTimeout(dismiss, 1700);
    }, 1050);
  }, [createJournalEntry, dismiss, name, toast, why]);

  const later = useCallback(() => {
    setPhase('later');
    void setJSON(LETTER_KEY, { kept: false, deferred: true, at: Date.now() });
    void setJSON(PENDING_KEY, null);
    Animated.timing(toast, { toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    setTimeout(dismiss, 1600);
  }, [dismiss, toast]);

  const showToast = phase === 'after' || phase === 'later';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* dim scrim over the paper field */}
      <Animated.View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(38,37,30,0.42)', opacity: dim }}
      />

      {/* arrival card */}
      {(phase === 'arrive' || phase === 'opening') && (
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Animated.View
          style={{
            transform: [
              { translateY: card.interpolate({ inputRange: [0, 1, 2], outputRange: [24, 0, -46] }) },
              { scale: card.interpolate({ inputRange: [0, 1, 2], outputRange: [0.94, 1, 0.94] }) },
            ],
            opacity: card.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 0] }),
            backgroundColor: colors.surface,
            borderRadius: 24,
            overflow: 'hidden',
          }}>
          {/* envelope — full-bleed dark section, like Today's Next-lesson card */}
          <View style={{ height: 212, backgroundColor: colors.ink, overflow: 'hidden' }}>
            <Animated.View
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] }) }],
              }}>
              <Image
                source={require('../../assets/images/letter-envelope.webp')}
                contentFit="contain"
                style={{ width: '76%', height: '84%' }}
              />
            </Animated.View>
            <View style={{ position: 'absolute', left: 13, top: 13, transform: [{ rotate: '-9deg' }], opacity: 0.9 }}>
              <Postmark size={72} day="0" ink="rgba(245,244,241,0.78)" />
            </View>
            <Pressable
              onPress={later}
              hitSlop={8}
              accessibilityLabel="Not now"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 34,
                height: 34,
                borderRadius: 9999,
                backgroundColor: 'rgba(245,244,241,0.94)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Svg width={15} height={15} viewBox="0 0 20 20">
                <Path d="M3 3l14 14M17 3L3 17" stroke="#4A4A42" strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          <View style={{ paddingHorizontal: 28, paddingTop: 26, paddingBottom: 28, alignItems: 'center' }}>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 27, lineHeight: 30, letterSpacing: 0.27, color: colors.text }}>
              A letter for you.
            </AppText>
            <AppText
              center
              style={[sans('400'), { fontSize: 13, lineHeight: 21, color: colors.textMuted, marginTop: 14, maxWidth: 248 }]}>
              Sealed on day zero. It waits in your Log.
            </AppText>
            <Pressable
              onPress={breakSeal}
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

      {/* reading sheet */}
      {(phase === 'read' || phase === 'kept') && (
        <Animated.View
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            top: Math.max(insets.top + 12, 44),
            bottom: Math.max(insets.bottom + 20, 44),
            borderRadius: 26,
            backgroundColor: '#FDFBF5',
            overflow: 'hidden',
            opacity: sheet,
            transform: [
              { translateY: sheet.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
              { scale: sheet.interpolate({ inputRange: [0, 1], outputRange: [0.952, 1] }) },
            ],
          }}>
          {/* fold creases */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: '31%', height: 1.5, backgroundColor: 'rgba(0,0,0,0.05)' }} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: '63%', height: 1.5, backgroundColor: 'rgba(0,0,0,0.04)' }} />

          {/* header row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              paddingHorizontal: 22,
              paddingTop: 20,
            }}>
            <View style={{ transform: [{ rotate: '-6deg' }], marginLeft: -6 }}>
              <Postmark size={72} day="0" />
            </View>
            <Pressable
              onPress={() => setPhase('arrive')}
              hitSlop={8}
              accessibilityLabel="Close"
              style={{
                width: 34,
                height: 34,
                borderRadius: 9999,
                backgroundColor: '#FBFAF9',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Svg width={15} height={15} viewBox="0 0 20 20">
                <Path d="M3 3l14 14M17 3L3 17" stroke="#4A4A42" strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          {/* the letter */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingTop: 20, paddingBottom: 8 }}>
            <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 29, lineHeight: 34, color: LT_INK_STRONG, marginBottom: 18 }}>
              Dear {name},
            </AppText>
            <LetterP>It happened. Nothing since day zero is erased.</LetterP>
            <LetterP>
              One slip is data. Two begins a pattern. The next choice is the only one that counts:{' '}
              <AppText
                style={{
                  fontFamily: fonts.serifSharpItalic,
                  color: LT_INK_STRONG,
                  textDecorationLine: 'underline',
                }}>
                don’t fail twice
              </AppText>
              .
            </LetterP>
            <LetterP>I can still feel how much you meant it: {why}.</LetterP>

            <View style={{ marginTop: 26, gap: 3 }}>
              <AppText style={{ fontFamily: fonts.serifSharpItalic, fontSize: 21, color: LT_INK_STRONG }}>
                — you, on day zero
              </AppText>
              <Svg width={150} height={12} viewBox="0 0 150 12" fill="none">
                <Path d="M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7" stroke="rgba(38,38,31,0.5)" strokeWidth={1.6} strokeLinecap="round" />
              </Svg>
            </View>
            <AppText style={{ fontFamily: fonts.serifSharpItalic, fontSize: 14.5, lineHeight: 22, color: 'rgba(59,59,51,0.62)', marginTop: 24 }}>
              The urge tool is one tap away.
            </AppText>
          </ScrollView>

          {/* keep it */}
          <View style={{ paddingHorizontal: 22, paddingTop: 12, paddingBottom: 20 }}>
            <Pressable
              onPress={keep}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                backgroundColor: colors.ink,
                borderRadius: 9999,
                paddingVertical: 15,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z"
                  stroke={colors.inkText}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </Svg>
              <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: 0.47, color: colors.inkText }]}>
                Tuck it into your Log
              </AppText>
            </Pressable>
            <AppText center style={[sans('400'), { fontSize: 12, color: 'rgba(59,59,51,0.55)', marginTop: 10 }]}>
              It will wait there, sealed, until it’s needed.
            </AppText>
          </View>

          {/* KEPT stamp */}
          {phase === 'kept' && (
            <View
              style={{
                position: 'absolute',
                right: 26,
                top: '38%',
                transform: [{ rotate: '-11deg' }],
                borderWidth: 2.5,
                borderColor: 'rgba(59,59,51,0.7)',
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 15,
                backgroundColor: '#F9F7F3',
              }}>
              <AppText style={[sans('500'), { fontSize: 13, letterSpacing: 2.08, color: 'rgba(59,59,51,0.82)' }]}>
                RESEALED
              </AppText>
            </View>
          )}
        </Animated.View>
      )}

      {/* toast */}
      {showToast && (
        <Pressable onPress={dismiss} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 132,
              alignItems: 'center',
              opacity: toast,
              transform: [{ translateY: toast.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 11,
                paddingLeft: 12,
                paddingRight: 18,
                borderRadius: 9999,
                backgroundColor: '#F8F7F4',
              }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 9999,
                  backgroundColor: colors.ink,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 12.5l5 5L20 6.5" stroke={colors.inkText} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>
                {phase === 'later' ? 'It’ll wait in your Log' : 'Resealed into your Log'}
              </AppText>
            </View>
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

// ── the letter body paragraph ─────────────────────────────────────────
function LetterP({ children }: { children: React.ReactNode }) {
  return (
    <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 18, lineHeight: 30, color: LT_INK, marginBottom: 18 }}>
      {children}
    </AppText>
  );
}

// ── the postmark: dashed ring, arced wordmark, day numeral ────────────
function Postmark({ size = 86, day = 'III', ink = 'rgba(74,74,66,0.62)' }: { size?: number; day?: string; ink?: string }) {
  const cx = size / 2;
  const r = size / 2 - 13;
  const uid = `pm-${Math.round(size)}-${day}`;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Defs>
        <Path id={uid} d={`M ${cx - r} ${cx} a ${r} ${r} 0 1 1 ${2 * r} 0`} />
      </Defs>
      <Circle cx={cx} cy={cx} r={size / 2 - 2} stroke={ink} strokeWidth={1.6} strokeDasharray="3 5" />
      <Circle cx={cx} cy={cx} r={size / 2 - 9.5} stroke={ink} strokeWidth={1} />
      <SvgText fill={ink} fontFamily={fonts.sans} fontWeight="500" fontSize={8.2} letterSpacing={1.6}>
        <TextPath href={`#${uid}`} startOffset="50%" textAnchor="middle">
          VICI POST
        </TextPath>
      </SvgText>
      <SvgText x={cx} y={cx - 4} fill={ink} textAnchor="middle" fontFamily={fonts.sans} fontWeight="500" fontSize={7.5} letterSpacing={1.4}>
        DAY
      </SvgText>
      <SvgText x={cx} y={cx + 16} fill={ink} textAnchor="middle" fontFamily={fonts.serif} fontWeight="500" fontSize={day.length > 1 ? 17 : 21}>
        {day}
      </SvgText>
    </Svg>
  );
}
