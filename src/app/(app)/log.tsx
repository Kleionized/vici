import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import {
  AppText,
  Button,
  Card,
  EmptyState,
  Field,
  Icon,
  type IconName,
  LoadingView,
  Screen,
  SectionLabel,
} from '@/components/ui';
import { moodLabel } from '@/components/MoodLogger';
import { useCheckins, useCreateEvent, useEvents } from '@/lib/backend';
import { RelapseScreen } from '@/components/RelapseScreen';
import { relapseSequence } from '@/content/relapseLines';
import { setJSON } from '@/lib/storage';
import { formatTimestamp } from '@/lib/date';
import { EVENT_HINT, EVENT_LABEL } from '@/lib/labels';
import { colors, fonts, radius, sans, spacing } from '@/lib/theme';
import type { EventType, PrecedingState } from '@/lib/types';

// ── the Log tab's one front door (canvas: screens-log-hub) — a chooser
// asks WHAT you're capturing, then hands off to the matching flow. ──

type Mode = 'chooser' | 'moment' | 'history';

export default function Log() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('chooser');

  if (mode === 'moment') return <MomentComposer onExit={() => setMode('chooser')} onDone={() => setMode('history')} />;
  if (mode === 'history') return <History onBack={() => setMode('chooser')} />;

  const OPTIONS: { key: string; mark: React.ReactNode; title: string; note: string; dark?: boolean; go: () => void }[] = [
    {
      key: 'checkin',
      mark: <MarkCheckin dark />,
      title: 'Daily check-in',
      note: 'Your mood today, in twenty seconds',
      dark: true,
      go: () => router.push('/checkin'),
    },
    {
      key: 'urge',
      mark: <MarkUrge />,
      title: 'An urge',
      note: 'How strong, what fed it, how it went',
      go: () => router.push('/urge-log'),
    },
    {
      key: 'moment',
      mark: <MarkMoment />,
      title: 'A moment',
      note: 'A warning sign worth remembering',
      go: () => setMode('moment'),
    },
    {
      key: 'journal',
      mark: <MarkJournal />,
      title: 'Journal entry',
      note: 'Free words, at your own pace',
      go: () => router.push('/journal-new'),
    },
  ];

  return (
    <Screen scroll={false} contentStyle={{ paddingTop: spacing.md }}>
      {/* top: centred eyebrow */}
      <View style={{ alignItems: 'center' }}>
        <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft }]}>
          Your log
        </AppText>
      </View>

      <View style={{ alignItems: 'center', marginTop: 28 }}>
        <AppText center style={{ fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, letterSpacing: 0.3, color: colors.text }}>
          What are you logging?
        </AppText>
        <AppText center variant="muted" style={{ fontSize: 13.5, lineHeight: 19, marginTop: 12, marginHorizontal: 20 }}>
          One quiet capture — pick the shape that fits.
        </AppText>
      </View>

      <View style={{ flex: 1, marginTop: 32, gap: 12 }}>
        {OPTIONS.map((o) => (
          <Pressable
            key={o.key}
            onPress={o.go}
            accessibilityRole="button"
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              paddingVertical: 17,
              paddingLeft: 14,
              paddingRight: 18,
              borderRadius: 20,
              backgroundColor: o.dark ? colors.ink : colors.surface,
              transform: [{ scale: pressed ? 0.975 : 1 }],
            })}>
            <View style={{ width: 56, height: 48 }}>{o.mark}</View>
            <View style={{ flex: 1 }}>
              <AppText style={[sans('500'), { fontSize: 16, color: o.dark ? colors.inkText : colors.text }]}>{o.title}</AppText>
              <AppText style={[sans('400'), { fontSize: 13, lineHeight: 17.5, marginTop: 3, color: o.dark ? 'rgba(245,244,241,0.6)' : colors.textMuted }]}>
                {o.note}
              </AppText>
            </View>
            <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
              <Path d="M1.5 1l6 7-6 7" stroke={o.dark ? 'rgba(245,244,241,0.55)' : colors.textSoft} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        ))}
      </View>

      {/* rough days — the in-the-moment book, one tap from the door */}
      <Pressable
        onPress={() => router.push('/(app)/rough-days')}
        hitSlop={6}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 13,
          borderRadius: 9999,
          borderWidth: 1.4,
          borderColor: colors.borderStrong,
          opacity: pressed ? 0.7 : 1,
        })}>
        <AppText style={[sans('600'), { fontSize: 13.5, color: colors.text }]}>Rough day?</AppText>
        <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted }]}>Open the book of protocols ›</AppText>
      </Pressable>

      <Pressable onPress={() => setMode('history')} hitSlop={8} style={{ paddingVertical: 18, paddingBottom: 12 }}>
        <AppText center style={[sans('400'), { fontSize: 12.5, lineHeight: 19, color: colors.textSoft }]}>
          Everything lands in your log — plain, dated, never graded. <AppText style={[sans('600'), { fontSize: 12.5, color: colors.textMuted }]}>History ›</AppText>
        </AppText>
      </Pressable>
    </Screen>
  );
}

// ── scene-marks, one per log kind — quiet ink-line miniatures ────────
function MarkCheckin({ dark = false }: { dark?: boolean }) {
  const line = dark ? 'rgba(245,244,241,0.75)' : colors.textMuted;
  const sun = dark ? colors.inkText : colors.text;
  return (
    <Svg width={56} height={48} viewBox="0 0 56 48" fill="none">
      <Circle cx={28} cy={15} r={8.5} fill={sun} opacity={0.9} />
      <Path d="M6 36 C 13 32.5 21 32.5 28 36 C 35 39.5 43 39.5 50 36" stroke={line} strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M11 43 C 17 40.5 23 40.5 28 43 C 33 45.5 39 45.5 45 43" stroke={line} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}
function MarkUrge() {
  return (
    <Svg width={56} height={48} viewBox="0 0 56 48" fill="none">
      <Path d="M10 40 C 17 12 28 12 34 27 C 37 34.5 43 38 49 39" stroke={colors.text} strokeWidth={2.8} strokeLinecap="round" fill="none" />
      <Circle cx={21.5} cy={14.5} r={2} fill={colors.surface} stroke={colors.textMuted} strokeWidth={0.8} />
      <Path d="M6 44 h44" stroke={colors.textMuted} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
    </Svg>
  );
}
function MarkMoment() {
  return (
    <Svg width={56} height={48} viewBox="0 0 56 48" fill="none">
      {/* a buoy riding the swell */}
      <Path d="M27 14 v10" stroke={colors.text} strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx={27} cy={12} r={3.2} fill={colors.text} />
      <Path d="M21 31 a6 6 0 0 1 12 0z" fill={colors.textMuted} />
      <Path d="M6 41 q 10.5 -3 21 0 t 21 0" stroke={colors.textMuted} strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}
function MarkJournal() {
  return (
    <Svg width={56} height={48} viewBox="0 0 56 48" fill="none">
      <Path d="M33.4 8.2A10 10 0 1 1 22 25.4 10.5 10.5 0 0 0 33.4 8.2z" fill={colors.text} opacity={0.85} />
      <Circle cx={9} cy={9} r={1.2} fill={colors.textSoft} />
      <Circle cx={47} cy={14} r={1} fill={colors.textSoft} />
      <Path d="M8 42 C 15 39 22 39 28 42 C 34 45 41 45 48 42" stroke={colors.textMuted} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

// ── "a moment" — the neutral event composer (win / lapse / urge note) ─
const LOGGABLE: EventType[] = ['win', 'lapse', 'urge_rode_out', 'urge_acted_on'];
const HALT: { key: keyof PrecedingState; label: string }[] = [
  { key: 'hungry', label: 'Hungry' },
  { key: 'tired', label: 'Tired' },
  { key: 'lonely', label: 'Lonely' },
  { key: 'bored', label: 'Bored' },
];

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        borderRadius: radius.pill,
        backgroundColor: on ? colors.ink : colors.surface,
      }}>
      <AppText style={[sans('500'), { fontSize: 14.5 }]} color={on ? colors.inkText : colors.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

function MomentComposer({ onExit, onDone }: { onExit: () => void; onDone: () => void }) {
  const createEvent = useCreateEvent();
  const [type, setType] = useState<EventType>('win');
  const [halt, setHalt] = useState<PrecedingState>({});
  const [trigger, setTrigger] = useState('');
  const [whatHelped, setWhatHelped] = useState('');
  const [learned, setLearned] = useState('');
  const [saving, setSaving] = useState(false);
  const [relapse, setRelapse] = useState<string[] | null>(null);

  async function save() {
    setSaving(true);
    const precedingState: PrecedingState = { ...halt };
    await createEvent({
      type,
      trigger: trigger.trim() || undefined,
      precedingState: Object.keys(precedingState).length ? precedingState : undefined,
      whatHelped: whatHelped.trim() || undefined,
      lesson: learned.trim() || undefined,
    });
    setSaving(false);
    setHalt({});
    setTrigger('');
    setWhatHelped('');
    setLearned('');
    if (type === 'lapse') {
      await setJSON('tideline.letter.pending', Date.now());
      setRelapse(relapseSequence());
      return;
    }
    onDone();
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.md, gap: spacing.lg }}>
      <FlowTop eyebrow="A moment" onBack={onExit} />
      <AppText style={{ fontFamily: fonts.serif, fontSize: 28, lineHeight: 32, letterSpacing: 0.22, color: colors.text }}>
        Worth remembering.
      </AppText>
      <AppText variant="muted" style={{ fontSize: 13.5, lineHeight: 20, marginTop: -6 }}>
        Data to learn from — never a scorecard.
      </AppText>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>What do you want to note?</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {LOGGABLE.map((t) => (
            <Chip key={t} label={EVENT_LABEL[t]} on={type === t} onPress={() => setType(t)} />
          ))}
        </View>
        <AppText variant="soft">{EVENT_HINT[type]}</AppText>
      </View>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>What was going on?</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {HALT.map((h) => (
            <Chip
              key={h.key}
              label={h.label}
              on={!!halt[h.key]}
              onPress={() => setHalt((prev) => ({ ...prev, [h.key]: !prev[h.key] }))}
            />
          ))}
        </View>
      </View>

      <Field label="Trigger (optional)" value={trigger} onChangeText={setTrigger} placeholder="What came just before?" />
      <Field label="What helped (optional)" value={whatHelped} onChangeText={setWhatHelped} placeholder="Anything that made a difference" />
      <Field label="What I learned (optional)" value={learned} onChangeText={setLearned} placeholder="What this taught you" multiline />

      <Button label="Save to log" onPress={save} loading={saving} />
      <RelapseScreen
        visible={!!relapse}
        lines={relapse ?? []}
        onDone={() => {
          setRelapse(null);
          onDone();
        }}
      />
    </Screen>
  );
}

// ── flow header: back chevron + centred eyebrow ──────────────────────
function FlowTop({ eyebrow, onBack }: { eyebrow: string; onBack: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 30 }}>
      <Pressable onPress={onBack} hitSlop={10} accessibilityLabel="Back" style={{ width: 30 }}>
        <Svg width={12} height={20} viewBox="0 0 13 22">
          <Path d="M11 2L2 11l9 9" stroke={colors.text} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft }]}>
        {eyebrow}
      </AppText>
      <View style={{ width: 30 }} />
    </View>
  );
}

// ── history — the reverse-chronological feed ─────────────────────────
const EVENT_ICON: Record<EventType, IconName> = {
  win: 'sparkle',
  lapse: 'pulse',
  urge_rode_out: 'wave',
  urge_acted_on: 'wave',
  check_in: 'mood',
};

function EventBadge({ icon }: { icon: IconName }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name={icon} size={20} color={colors.text} strokeWidth={1.8} />
    </View>
  );
}

function History({ onBack }: { onBack: () => void }) {
  const events = useEvents();
  const checkins = useCheckins();

  return (
    <Screen contentStyle={{ paddingTop: spacing.md, gap: spacing.md }}>
      <FlowTop eyebrow="History" onBack={onBack} />
      <AppText style={{ fontFamily: fonts.serif, fontSize: 28, lineHeight: 32, letterSpacing: 0.22, color: colors.text, marginBottom: spacing.sm }}>
        Your log, kept.
      </AppText>
      {events === undefined || checkins === undefined ? (
        <LoadingView />
      ) : events.length === 0 && checkins.length === 0 ? (
        <EmptyState title="Nothing logged yet" body="When you log something, it'll show up here as data to learn from." />
      ) : (
        <>
          {events.map((e) => (
            <Card key={e._id}>
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <EventBadge icon={EVENT_ICON[e.type]} />
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
                    <AppText style={[sans('600'), { fontSize: 15.5, flex: 1, color: colors.text }]}>{EVENT_LABEL[e.type]}</AppText>
                    <AppText variant="soft">{formatTimestamp(e.createdAt, true)}</AppText>
                  </View>
                  {e.trigger ? <AppText variant="muted">Trigger: {e.trigger}</AppText> : null}
                  {e.whatHelped ? <AppText variant="muted">Helped: {e.whatHelped}</AppText> : null}
                  {e.lesson ? <AppText variant="muted">Learned: {e.lesson}</AppText> : null}
                  {e.note ? <AppText variant="muted">{e.note}</AppText> : null}
                </View>
              </View>
            </Card>
          ))}
          {checkins.map((c) => (
            <Card key={c._id}>
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 9999,
                      backgroundColor: c.mood != null ? colors.moodTones[Math.min(4, Math.max(0, Math.round(c.mood) - 1))] : colors.surfaceAlt,
                    }}
                  />
                </View>
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
                    <AppText style={[sans('600'), { fontSize: 15.5, flex: 1, color: colors.text }]}>
                      {c.mood ? (moodLabel(c.mood) ?? 'Check-in') : 'Check-in'}
                    </AppText>
                    <AppText variant="soft">{c.date}</AppText>
                  </View>
                  {c.emotions?.length ? <AppText variant="muted">{c.emotions.join(' · ')}</AppText> : null}
                  <AppText variant="soft">
                    {[
                      c.sleepHours != null ? `${c.sleepHours}h sleep` : null,
                      c.movedBody ? 'moved' : null,
                      c.socialContact ? 'connected' : null,
                      c.structureFollowed ? 'structure' : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'logged'}
                  </AppText>
                </View>
              </View>
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}
