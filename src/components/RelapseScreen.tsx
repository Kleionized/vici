import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/ui';
import { colors, spacing } from '@/lib/theme';

export interface RelapseScreenProps {
  visible: boolean;
  /** The lines to speak (e.g. from `relapseSequence()`), passed fresh per show. */
  lines: string[];
  onDone: () => void;
}

/**
 * A calm, full-screen post-relapse moment. Lines are revealed one word at a time
 * and cross-fade into each other, so it reads like the screen is speaking to you.
 */
export function RelapseScreen({ visible, lines, onDone }: RelapseScreenProps) {
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onDone} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          {visible ? <Speaker lines={lines} onDone={onDone} /> : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function Speaker({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [words, setWords] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;

  const lineWords = (lines[lineIdx] ?? '').split(' ');
  const total = lineWords.length;

  useEffect(() => {
    let cancelled = false;
    let advance: ReturnType<typeof setTimeout> | null = null;
    setWords(0);
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();

    let w = 0;
    const id = setInterval(() => {
      if (cancelled) {
        clearInterval(id);
        return;
      }
      w += 1;
      setWords(w);
      if (w >= total) {
        clearInterval(id);
        if (lineIdx < lines.length - 1) {
          advance = setTimeout(() => {
            Animated.timing(opacity, { toValue: 0, duration: 320, useNativeDriver: true }).start(({ finished }) => {
              if (finished && !cancelled) setLineIdx((x) => x + 1);
            });
          }, 950);
        }
      }
    }, 165);

    return () => {
      cancelled = true;
      clearInterval(id);
      if (advance) clearTimeout(advance);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIdx]);

  const finished = lineIdx >= lines.length - 1 && words >= total;

  return (
    <View style={{ flex: 1, paddingHorizontal: spacing.xl }}>
      <View style={{ alignItems: 'flex-end', paddingTop: spacing.sm }}>
        <Pressable onPress={onDone} hitSlop={10} style={{ paddingVertical: spacing.xs, paddingHorizontal: spacing.sm }}>
          <AppText variant="soft">{finished ? '' : 'Skip'}</AppText>
        </Pressable>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{ opacity }}>
          <AppText
            center
            weightOverride="600"
            style={{ fontSize: 27, lineHeight: 27 * 1.4, letterSpacing: -0.4, color: colors.text }}>
            {lineWords.slice(0, words).join(' ')}
          </AppText>
        </Animated.View>
      </View>

      <View style={{ paddingBottom: spacing.lg }}>
        <Button label="Begin again" onPress={onDone} />
      </View>
    </View>
  );
}
