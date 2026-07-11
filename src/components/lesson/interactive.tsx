import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { SBoat, SC, SGull } from '@/components/scene/SceneKit';
import { AppText, Laurel } from '@/components/ui';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * Interactive lesson pages (canvas: screens-lesson-pages) — five page
 * kinds that join the paged reader:
 *   teach   — a scene + one idea, the takeaway line IS the button
 *   pick    — chain the day's lesson to an existing routine
 *   check   — self-check, one warning sign per page, Not me / That's me
 *   grid    — what's underneath, multi-select
 *   collect — your signs gathered into one memorized line
 */

export type InteractivePage =
  | { kind: 'teach'; headline: string; body: string; bodyLead: string; cta: string }
  | { kind: 'pick'; headline: string }
  | { kind: 'check'; qIndex: number; qTotal: number; term: string; asIn: string }
  | { kind: 'grid'; headline: string }
  | { kind: 'collect'; headline: string; signs: string[] };

export interface InteractiveLessonConfig {
  pages: InteractivePage[];
}

const SIGNS = ['Restless scrolling', 'Putting off sleep', 'Fake-fine answers', 'Planning to be alone'];
const CHECKS = [
  { term: 'Restless scrolling', asIn: 'Circling the same three apps, wanting none of them' },
  { term: 'Putting off sleep', asIn: 'Finding reasons to stay up after you meant to stop' },
];

/** The demonstrated set — attached to the trigger-chains lesson. */
export const INTERACTIVE_LESSONS: Record<string, InteractiveLessonConfig> = {
  'cbt-trigger-chains': {
    pages: [
      {
        kind: 'teach',
        headline: 'The wave never ambushes.',
        bodyLead: 'It sends scouts first',
        body: ' — restlessness, a reach for the phone, a door quietly closed. Learn your scouts, and the wave loses its surprise.',
        cta: 'Scouts before waves',
      },
      { kind: 'pick', headline: 'Chain the day’s lesson to something you already do.' },
      { kind: 'check', qIndex: 0, qTotal: 2, ...CHECKS[0] },
      { kind: 'check', qIndex: 1, qTotal: 2, ...CHECKS[1] },
      { kind: 'grid', headline: 'And underneath them, usually?' },
      { kind: 'collect', headline: 'Your scouts, on record.', signs: SIGNS },
    ],
  },
};

const CAPS = [sans('600'), { fontSize: 11, letterSpacing: 2.42, textTransform: 'uppercase' as const, color: colors.textSoft, textAlign: 'center' as const }];

function Cta({ label, enabled = true, onPress }: { label: string; enabled?: boolean; onPress: () => void }) {
  return (
    <View style={{ paddingHorizontal: 29, paddingTop: 14, paddingBottom: 14 }}>
      <Pressable
        onPress={enabled ? onPress : undefined}
        disabled={!enabled}
        accessibilityRole="button"
        style={({ pressed }) => ({
          width: '100%',
          backgroundColor: colors.ink,
          borderRadius: 9999,
          paddingVertical: 16,
          alignItems: 'center',
          opacity: enabled ? 1 : 0.26,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}>
        <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: 0.16, color: colors.inkText }]}>{label}</AppText>
      </Pressable>
    </View>
  );
}

// ── teach: the scouts scene — gulls out ahead of the far wave ─────────
function SceneScouts() {
  return (
    <Svg width={290} height={150} viewBox="0 0 320 166" fill="none">
      <SGull x={118} y={38} s={0.95} o={0.7} />
      <SGull x={152} y={26} s={0.7} o={0.5} />
      <Path d="M0 104 C 60 101, 260 101, 320 104 L320 166 L0 166 Z" fill={SC.waterHi} />
      <Path d="M0 104 C 60 101, 260 101, 320 104" stroke={SC.foam} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Path d="M0 128 h320 v38 h-320 Z" fill={SC.water} />
      <Path d="M0 150 h320 v16 h-320 Z" fill={SC.waterLo} />
      <Path d="M236 104 C 246 82 262 82 272 104" fill={SC.water} stroke={SC.foam} strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx={243} cy={88} r={1.8} fill={SC.foam} />
      <SBoat x={64} y={92} s={0.6} />
    </Svg>
  );
}

export function LpgTeach({ page, next }: { page: Extract<InteractivePage, { kind: 'teach' }>; next: () => void }) {
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
        <View style={{ marginBottom: 30 }}>
          <SceneScouts />
        </View>
        <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 30, lineHeight: 35, color: colors.text, maxWidth: 300 }}>
          {page.headline}
        </AppText>
        <AppText center style={[sans('400'), { fontSize: 14.5, lineHeight: 23, color: colors.textMuted, marginTop: 16, maxWidth: 288 }]}>
          <AppText style={[sans('600'), { fontSize: 14.5, color: colors.text }]}>{page.bodyLead}</AppText>
          {page.body}
        </AppText>
      </View>
      <Cta label={page.cta} onPress={next} />
    </>
  );
}

// ── pick: pair with an existing routine ───────────────────────────────
function RIcon({ k, c }: { k: string; c: string }) {
  const P = ({ d }: { d: string }) => <Path d={d} stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  switch (k) {
    case 'coffee':
      return (
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
          <P d="M5 8.5h11v6.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 15z" />
          <P d="M16 10.5h1.6a2.6 2.6 0 0 1 0 5.2H16M8 5.5c0-1 .8-1.2.8-2M11.5 5.5c0-1 .8-1.2.8-2" />
        </Svg>
      );
    case 'teeth':
      return (
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
          <P d="M4.5 19.5 15.8 8.2" />
          <P d="M14.6 5.4l4 4 1.6-1.6a1.4 1.4 0 0 0 0-2l-2-2a1.4 1.4 0 0 0-2 0z" />
          <P d="M16.2 9.8l-1.2 1.2M14.2 7.8 13 9" />
        </Svg>
      );
    case 'commute':
      return (
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
          <Rect x={5} y={4} width={14} height={13} rx={2.6} stroke={c} strokeWidth={1.8} />
          <P d="M5 9.5h14M9 20.5l-1.2 1.5M15 20.5l1.2 1.5M8.8 13.8h.01M15.2 13.8h.01" />
        </Svg>
      );
    case 'bed':
      return (
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
          <P d="M3.5 18.5v-8M3.5 14.5h17v4M3.5 14.5V9h6.6c2.4 0 3.7 1.3 3.7 3.3v2.2" />
          <Circle cx={7.1} cy={11.4} r={1.2} stroke={c} strokeWidth={1.8} />
        </Svg>
      );
    default:
      return (
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
          <P d="M12 4v16M4 12h16M6.6 6.6l10.8 10.8M17.4 6.6 6.6 17.4" />
        </Svg>
      );
  }
}

const ROUTINES: [string, string][] = [
  ['Morning coffee', 'coffee'],
  ['Brushing your teeth', 'teeth'],
  ['The commute', 'commute'],
  ['Winding down in bed', 'bed'],
  ['A habit of my own', 'own'],
];

export function LpgPick({ page, next, onAnswer }: { page: Extract<InteractivePage, { kind: 'pick' }>; next: () => void; onAnswer?: (v: string) => void }) {
  const [v, setV] = useState<string | null>(null);
  return (
    <>
      <View style={{ flex: 1, paddingHorizontal: 29, paddingTop: 26 }}>
        <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 27, lineHeight: 32, color: colors.text, maxWidth: 320, alignSelf: 'center' }}>
          {page.headline}
        </AppText>
        <AppText style={[...CAPS, { marginTop: 18 }]}>While…</AppText>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10, marginTop: 16, paddingBottom: 4 }} showsVerticalScrollIndicator={false}>
          {ROUTINES.map(([label, icon]) => {
            const on = v === label;
            return (
              <Pressable
                key={label}
                onPress={() => setV(label)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  paddingVertical: 13,
                  paddingHorizontal: 16,
                  minHeight: 56,
                  borderWidth: 1.6,
                  borderColor: on ? colors.ink : 'transparent',
                }}>
                <View style={{ width: 38, height: 38, borderRadius: 9999, backgroundColor: on ? colors.ink : colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <RIcon k={icon} c={on ? colors.inkText : colors.text} />
                </View>
                <AppText style={[sans(on ? '600' : '500'), { flex: 1, fontSize: 15, color: colors.text }]}>{label}</AppText>
                {on ? <View style={{ width: 7, height: 7, borderRadius: 9999, backgroundColor: colors.ink }} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <Cta
        label={v ? `Paired with ${v.toLowerCase()}` : 'Pair it'}
        enabled={!!v}
        onPress={() => {
          if (v && onAnswer) onAnswer(v);
          next();
        }}
      />
    </>
  );
}

// ── check: one sign per page, Not me / That's me ─────────────────────
export function LpgCheck({ page, next, onAnswer }: { page: Extract<InteractivePage, { kind: 'check' }>; next: () => void; onAnswer?: (v: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const pick = (val: string) => {
    if (picked) return;
    setPicked(val);
    if (onAnswer) onAnswer(val);
    setTimeout(next, 620);
  };
  const btn = (val: string, glyph: 'x' | 'check', label: string) => {
    const on = picked === val;
    return (
      <Pressable
        onPress={() => pick(val)}
        style={{
          flex: 1,
          backgroundColor: on ? colors.ink : colors.surface,
          borderRadius: 18,
          paddingTop: 20,
          paddingBottom: 17,
          paddingHorizontal: 10,
          alignItems: 'center',
          gap: 9,
        }}>
        <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          {glyph === 'x' ? (
            <G stroke={on ? colors.inkText : colors.text} strokeWidth={2.1} strokeLinecap="round">
              <Circle cx={13} cy={13} r={11} fill="none" />
              <Path d="M9 9l8 8M17 9l-8 8" />
            </G>
          ) : (
            <G stroke={on ? colors.inkText : colors.text} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
              <Circle cx={13} cy={13} r={11} fill="none" />
              <Path d="M8 13.5l3.4 3.4L18 10" fill="none" />
            </G>
          )}
        </Svg>
        <AppText style={[sans('600'), { fontSize: 15, color: on ? colors.inkText : colors.text }]}>{label}</AppText>
      </Pressable>
    );
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 29, paddingTop: 26 }}>
      <AppText style={CAPS}>Self-check · {['I', 'II'][page.qIndex] || 'I'} of II</AppText>
      <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 25, lineHeight: 30, color: colors.text, maxWidth: 300, alignSelf: 'center', marginTop: 14 }}>
        In the hours before a slip, I’m sometimes…
      </AppText>
      {/* the sign, held up on its own card */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: 22, paddingVertical: 44, paddingHorizontal: 26, alignItems: 'center' }}>
          <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 29, lineHeight: 33, color: colors.text }}>{page.term}</AppText>
          <AppText center style={[sans('400'), { fontSize: 13.5, lineHeight: 21, color: colors.textMuted, marginTop: 12 }]}>
            As in: {page.asIn.toLowerCase()}
          </AppText>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 34 }}>
        {btn('no', 'x', 'Not me')}
        {btn('yes', 'check', 'That’s me')}
      </View>
    </View>
  );
}

// ── grid: what's underneath, multi-select ─────────────────────────────
const FEELINGS = ['Lonely', 'Wound up', 'Bored', 'Low', 'Irritable', 'Numb', 'Tired', 'Out of place', 'Hungry'];

export function LpgGrid({ page, next, onAnswer }: { page: Extract<InteractivePage, { kind: 'grid' }>; next: () => void; onAnswer?: (v: string) => void }) {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (f: string) => setSel((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  return (
    <>
      <View style={{ flex: 1, paddingHorizontal: 29, paddingTop: 26 }}>
        <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 27, lineHeight: 32, color: colors.text, maxWidth: 300, alignSelf: 'center' }}>
          {page.headline}
        </AppText>
        <AppText center style={[sans('400'), { fontSize: 13.5, color: colors.textMuted, marginTop: 12, maxWidth: 280, alignSelf: 'center' }]}>
          Pick every one that rings true.
        </AppText>
        <ScrollView style={{ flex: 1, marginTop: 22 }} contentContainerStyle={{ paddingBottom: 4 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
            {FEELINGS.map((f) => {
              const on = sel.includes(f);
              return (
                <Pressable
                  key={f}
                  onPress={() => toggle(f)}
                  style={{
                    width: '31%',
                    flexGrow: 1,
                    aspectRatio: 1 / 0.92,
                    backgroundColor: on ? colors.ink : colors.surface,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                  }}>
                  <AppText center style={[sans(on ? '600' : '500'), { fontSize: 14, lineHeight: 17.5, color: on ? colors.inkText : colors.text }]}>
                    {f}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <Cta
        label="Continue"
        enabled={sel.length > 0}
        onPress={() => {
          if (onAnswer) onAnswer(sel.join(', '));
          next();
        }}
      />
    </>
  );
}

// ── collect: the signs, gathered and memorized ────────────────────────
export function LpgCollect({ page, next }: { page: Extract<InteractivePage, { kind: 'collect' }>; next: () => void }) {
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Laurel size={40} color={colors.text} />
        <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 28, lineHeight: 32.5, color: colors.text, maxWidth: 300, marginTop: 20 }}>
          {page.headline}
        </AppText>
        <AppText center style={{ fontFamily: fonts.serifSharpItalic, fontSize: 17, lineHeight: 25.5, color: colors.textMuted, marginTop: 16, maxWidth: 290 }}>
          “If I notice I’m ______, the wave is coming — and I go to the tools first.”
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, justifyContent: 'center', marginTop: 26 }}>
          {page.signs.map((s) => (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 9999, paddingVertical: 10, paddingHorizontal: 16 }}>
              <View style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: colors.ink }} />
              <AppText style={[sans('500'), { fontSize: 13.5, color: colors.text }]}>{s}</AppText>
            </View>
          ))}
        </View>
      </View>
      <Cta label="Memorized — I’ll know them" onPress={next} />
    </>
  );
}
