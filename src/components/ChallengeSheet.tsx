import { type ReactNode, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { colors, fonts, sans, spacing } from '@/lib/theme';

/**
 * ChallengeSheet — the step-commitment sheet (pattern: Fabulous's challenge
 * card, translated to ink and paper). A dark hero with the step's glyph, the
 * serif ask, the week's seven day-dots, an expandable "why", and one pill
 * CTA over a quiet decline.
 */

export interface Challenge {
  /** big white glyph drawn in the ink hero */
  glyph: ReactNode;
  title: string;
  sub: string;
  why: string;
  cta: string;
  /** Sun–Sat, true where the step was done that day */
  weekDone: boolean[];
  /** 0–6 index of today inside weekDone */
  todayIdx: number;
}

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function ChallengeSheet({
  challenge,
  onGo,
  onClose,
}: {
  challenge: Challenge | null;
  onGo: () => void;
  onClose: () => void;
}) {
  const [whyOpen, setWhyOpen] = useState(false);
  const c = challenge;
  return (
    <Modal visible={c != null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(19,19,19,0.44)' }}>
        {/* tap-away scrim */}
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Dismiss" />
        {c ? (
          <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
            {/* ink hero — the step's mark, held in the dark */}
            <View style={{ height: 150, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
              {c.glyph}
            </View>

            <View style={{ paddingHorizontal: spacing.xl, paddingTop: 26, paddingBottom: 30 }}>
              <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 27, lineHeight: 32, color: colors.text }}>
                {c.title}
              </AppText>
              <AppText
                center
                style={[sans('400'), { fontSize: 14.5, lineHeight: 22, color: colors.textMuted, marginTop: 12, alignSelf: 'center', maxWidth: 300 }]}>
                {c.sub}
              </AppText>

              {/* the week, day by day */}
              <AppText center style={[sans('600'), { fontSize: 12.5, letterSpacing: 1.5, textTransform: 'uppercase', color: colors.textSoft, marginTop: 26 }]}>
                This week
              </AppText>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 13, marginTop: 12 }}>
                {c.weekDone.map((done, i) => (
                  <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 9999,
                        backgroundColor: done ? colors.ink : 'transparent',
                        borderWidth: done ? 0 : 1.5,
                        borderColor: i === c.todayIdx ? colors.text : colors.ring,
                        borderStyle: done || i === c.todayIdx ? 'solid' : 'dashed',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {done ? (
                        <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                          <Path d="m5 12.5 4.5 4.5L19 7.5" stroke={colors.inkText} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      ) : null}
                    </View>
                    <AppText style={[sans(i === c.todayIdx ? '600' : '500'), { fontSize: 10, color: i === c.todayIdx ? colors.text : colors.textSoft }]}>
                      {DOW[i]}
                    </AppText>
                  </View>
                ))}
              </View>

              {/* why am I doing this? */}
              <Pressable onPress={() => setWhyOpen((v) => !v)} hitSlop={8} style={{ marginTop: 24, alignItems: 'center' }}>
                <AppText style={[sans('600'), { fontSize: 13.5, color: colors.text, textDecorationLine: 'underline' }]}>
                  Why am I doing this?
                </AppText>
              </Pressable>
              {whyOpen ? (
                <AppText
                  center
                  style={{ fontFamily: fonts.serifSharpItalic, fontSize: 15.5, lineHeight: 23, color: colors.textMuted, marginTop: 12, alignSelf: 'center', maxWidth: 300 }}>
                  {c.why}
                </AppText>
              ) : null}

              {/* commit / decline */}
              <Pressable
                onPress={onGo}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  marginTop: 26,
                  backgroundColor: colors.ink,
                  borderRadius: 9999,
                  paddingVertical: 16,
                  alignItems: 'center',
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                })}>
                <AppText style={[sans('600'), { fontSize: 16, letterSpacing: 0.32, color: colors.inkText }]}>{c.cta}</AppText>
              </Pressable>
              <Pressable onPress={onClose} hitSlop={8} style={{ marginTop: 16, alignItems: 'center', paddingBottom: 6 }}>
                <AppText style={[sans('500'), { fontSize: 14.5, color: colors.textSoft }]}>Not now</AppText>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
