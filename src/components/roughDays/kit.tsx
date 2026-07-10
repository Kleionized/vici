import { type ReactNode, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * Rough Days flow kit (canvas: screens-rough-days) — the urge grammar,
 * replicated: segmented progress + back + close up top; one calm page
 * (label · headline · a few quiet lines · one action); and the
 * questionnaire page with white cells and a radio that floods ink.
 */

// ── segmented progress + back + close ────────────────────────────────
export function RDTop({ total, index, onBack, onClose }: { total: number; index: number; onBack: (() => void) | null; onClose: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 29, paddingTop: 8 }}>
      <Pressable onPress={onBack ?? undefined} hitSlop={10} accessibilityLabel="Back" style={{ padding: 2, opacity: onBack ? 1 : 0 }}>
        <Svg width={10} height={17} viewBox="0 0 10 18">
          <Path d="M8.5 1.5L1.5 9l7 7.5" stroke={colors.text} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      </Pressable>
      <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i <= index ? colors.ink : colors.borderStrong }} />
        ))}
      </View>
      <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close" style={{ padding: 2 }}>
        <Svg width={16} height={16} viewBox="0 0 20 20">
          <Path d="M3 3l14 14M17 3L3 17" stroke={colors.textMuted} strokeWidth={2.3} strokeLinecap="round" />
        </Svg>
      </Pressable>
    </View>
  );
}

export function RDPill({ label, onPress, enabled = true }: { label: string; onPress?: () => void; enabled?: boolean }) {
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      accessibilityRole="button"
      style={({ pressed }) => ({
        width: '100%',
        backgroundColor: colors.ink,
        borderRadius: 9999,
        paddingVertical: 16,
        alignItems: 'center',
        opacity: enabled ? 1 : 0.34,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      <AppText style={[sans('600'), { fontSize: 15.5, color: colors.inkText }]}>{label}</AppText>
    </Pressable>
  );
}

// ── one calm page: label · headline · a few quiet lines · one action ──
export function RDPage({
  label,
  headline,
  sub,
  small,
  cta = 'Done — next',
  onNext,
  ghost,
  hSize = 30,
}: {
  label?: string;
  headline: string;
  sub?: string | null;
  small?: ReactNode;
  cta?: string;
  onNext: () => void;
  ghost?: ReactNode;
  hSize?: number;
}) {
  return (
    <>
      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 30, alignItems: 'center' }}>
        {label ? (
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft, marginBottom: 14 }]}>
            {label}
          </AppText>
        ) : null}
        <AppText center style={{ fontFamily: fonts.serif, fontSize: hSize, lineHeight: hSize * 1.16, letterSpacing: hSize * 0.01, color: colors.text }}>
          {headline}
        </AppText>
        {sub ? (
          <AppText center style={[sans('400'), { fontSize: 14, lineHeight: 22, color: colors.textMuted, marginTop: 15, maxWidth: 300 }]}>
            {sub}
          </AppText>
        ) : null}
        {small}
      </View>
      <View style={{ flex: 1.15 }} />
      <View style={{ paddingHorizontal: 29, paddingBottom: 12 }}>
        <RDPill label={cta} onPress={onNext} />
        {ghost}
      </View>
    </>
  );
}

// ── the questionnaire page: white cells, radio floods ink, Continue ───
export function RDAsk({
  label,
  title,
  options,
  onPick,
}: {
  label?: string;
  title: string;
  options: [string | number, string][];
  onPick: (index: number, key: string | number) => void;
}) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <>
      <View style={{ paddingHorizontal: 29, paddingTop: 26, alignItems: 'center' }}>
        {label ? (
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft, marginBottom: 12 }]}>
            {label}
          </AppText>
        ) : null}
        <AppText center style={{ fontFamily: fonts.serif, fontSize: 28, lineHeight: 32, letterSpacing: 0.28, color: colors.text }}>
          {title}
        </AppText>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 29, paddingTop: 24, gap: 10 }} showsVerticalScrollIndicator={false}>
        {options.map(([k, lab], i) => {
          const on = sel === i;
          return (
            <Pressable
              key={String(k) + i}
              onPress={() => setSel(i)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 13,
                backgroundColor: colors.surface,
                borderRadius: 18,
                paddingVertical: 16,
                paddingHorizontal: 17,
                borderWidth: 1.8,
                borderColor: on ? colors.ink : 'transparent',
              }}>
              <View
                style={{
                  width: 19,
                  height: 19,
                  borderRadius: 9999,
                  borderWidth: on ? 0 : 1.6,
                  borderColor: colors.borderStrong,
                  backgroundColor: on ? colors.ink : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {on ? (
                  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                    <Path d="M4.5 12.5l4.6 4.6L19.5 7" stroke={colors.inkText} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                ) : null}
              </View>
              <AppText style={[sans(on ? '600' : '500'), { flex: 1, fontSize: 14.5, lineHeight: 20, color: colors.text }]}>{lab}</AppText>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={{ paddingHorizontal: 29, paddingBottom: 12, paddingTop: 20 }}>
        <RDPill label="Continue" enabled={sel != null} onPress={() => sel != null && onPick(sel, options[sel][0])} />
      </View>
    </>
  );
}

// ── the flow shell — paper ground, progress, one page at a time ───────
export function RDShell({ total, index, onBack, onClose, children }: { total: number; index: number; onBack: (() => void) | null; onClose: () => void; children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <RDTop total={total} index={index} onBack={onBack} onClose={onClose} />
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaView>
    </View>
  );
}
