import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  EmptyState,
  Field,
  LoadingView,
  ScaleInput,
  Screen,
  SectionLabel,
  SegmentedControl,
  ToggleRow,
} from '@/components/ui';
import {
  useCheckins,
  useCreateEvent,
  useEvents,
  useTodayCheckin,
  useUpsertCheckin,
} from '@/lib/backend';
import { formatTimestamp, todayKey } from '@/lib/date';
import { EVENT_HINT, EVENT_LABEL, eventTint } from '@/lib/labels';
import { colors, radius, spacing } from '@/lib/theme';
import type { EventType, PrecedingState } from '@/lib/types';

type Tab = 'event' | 'checkin' | 'history';

const LOGGABLE: EventType[] = ['win', 'lapse', 'urge_rode_out', 'urge_acted_on'];
const HALT: { key: keyof PrecedingState; label: string }[] = [
  { key: 'hungry', label: 'Hungry' },
  { key: 'tired', label: 'Tired' },
  { key: 'lonely', label: 'Lonely' },
  { key: 'bored', label: 'Bored' },
];

export default function Log() {
  const [tab, setTab] = useState<Tab>('event');
  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="label">Log</AppText>
        <AppText variant="display">A place to notice.</AppText>
        <AppText variant="muted">Everything here is data to learn from — never a scorecard.</AppText>
      </View>

      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { key: 'event', label: 'Log' },
          { key: 'checkin', label: 'Check-in' },
          { key: 'history', label: 'History' },
        ]}
      />

      {tab === 'event' ? <EventComposer onDone={() => setTab('history')} /> : null}
      {tab === 'checkin' ? <CheckinForm /> : null}
      {tab === 'history' ? <History /> : null}
    </Screen>
  );
}

function EventComposer({ onDone }: { onDone: () => void }) {
  const createEvent = useCreateEvent();
  const [type, setType] = useState<EventType>('win');
  const [halt, setHalt] = useState<PrecedingState>({});
  const [trigger, setTrigger] = useState('');
  const [whatHelped, setWhatHelped] = useState('');
  const [learned, setLearned] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const precedingState: PrecedingState = { ...halt };
    await createEvent({
      type,
      trigger: trigger.trim() || undefined,
      precedingState: Object.keys(precedingState).length ? precedingState : undefined,
      whatHelped: whatHelped.trim() || undefined,
      lesson: learned.trim() || undefined,
      note: note.trim() || undefined,
    });
    setSaving(false);
    setHalt({});
    setTrigger('');
    setWhatHelped('');
    setLearned('');
    setNote('');
    onDone();
  }

  return (
    <View style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>What do you want to note?</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {LOGGABLE.map((t) => {
            const on = type === t;
            return (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm + 2,
                  borderRadius: radius.pill,
                  backgroundColor: on ? colors.accent : colors.surfaceAlt,
                  borderWidth: 1,
                  borderColor: on ? colors.accent : colors.border,
                }}>
                <AppText color={on ? colors.accentText : colors.text}>{EVENT_LABEL[t]}</AppText>
              </Pressable>
            );
          })}
        </View>
        <AppText variant="soft">{EVENT_HINT[type]}</AppText>
      </View>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>What was going on? (HALT)</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {HALT.map((h) => {
            const on = !!halt[h.key];
            return (
              <Pressable
                key={h.key}
                onPress={() => setHalt((prev) => ({ ...prev, [h.key]: !prev[h.key] }))}
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm + 2,
                  borderRadius: radius.pill,
                  backgroundColor: on ? colors.accent : colors.surfaceAlt,
                  borderWidth: 1,
                  borderColor: on ? colors.accent : colors.border,
                }}>
                <AppText color={on ? colors.accentText : colors.text}>{h.label}</AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Field label="Trigger (optional)" value={trigger} onChangeText={setTrigger} placeholder="What came just before?" />
      <Field label="What helped (optional)" value={whatHelped} onChangeText={setWhatHelped} placeholder="Anything that made a difference" />
      <Field label="What I learned (optional)" value={learned} onChangeText={setLearned} placeholder="What this taught you" multiline />

      <Button label="Save to log" onPress={save} loading={saving} />
    </View>
  );
}

function CheckinForm() {
  const today = useTodayCheckin();
  const upsert = useUpsertCheckin();
  const [sleep, setSleep] = useState('');
  const [mood, setMood] = useState<number | null>(null);
  const [moved, setMoved] = useState(false);
  const [social, setSocial] = useState(false);
  const [structure, setStructure] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(false);

  useEffect(() => {
    if (today) {
      setSleep(today.sleepHours != null ? String(today.sleepHours) : '');
      setMood(today.mood ?? null);
      setMoved(!!today.movedBody);
      setSocial(!!today.socialContact);
      setStructure(!!today.structureFollowed);
      setNote(today.note ?? '');
    }
  }, [today]);

  async function save() {
    setSaving(true);
    const sleepHours = sleep.trim() ? Number(sleep) : undefined;
    await upsert({
      date: todayKey(),
      sleepHours: Number.isFinite(sleepHours) ? sleepHours : undefined,
      mood: mood ?? undefined,
      movedBody: moved,
      socialContact: social,
      structureFollowed: structure,
      note: note.trim() || undefined,
    });
    setSaving(false);
    setSavedAt(true);
  }

  return (
    <View style={{ gap: spacing.lg }}>
      <AppText variant="muted">
        A quick read on the leading indicators — the things that actually move the needle.
      </AppText>
      <Field label="Hours of sleep" value={sleep} onChangeText={setSleep} placeholder="e.g. 7" keyboardType="numeric" />
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Mood</SectionLabel>
        <ScaleInput min={1} max={5} value={mood} onChange={setMood} leftLabel="Low" rightLabel="Good" />
      </View>
      <ToggleRow label="Moved my body" value={moved} onValueChange={setMoved} />
      <ToggleRow label="Real connection with someone" value={social} onValueChange={setSocial} />
      <ToggleRow label="Kept some structure to the day" value={structure} onValueChange={setStructure} />
      <Field label="Anything else (optional)" value={note} onChangeText={setNote} placeholder="A note to yourself" multiline />
      <Button label={savedAt ? 'Saved — update' : 'Save check-in'} onPress={save} loading={saving} />
    </View>
  );
}

function History() {
  const events = useEvents();
  const checkins = useCheckins();

  if (events === undefined || checkins === undefined) return <LoadingView />;
  if (events.length === 0 && checkins.length === 0) {
    return <EmptyState title="Nothing logged yet" body="When you log something, it'll show up here as data to learn from." />;
  }

  return (
    <View style={{ gap: spacing.md }}>
      {events.map((e) => (
        <Card key={e._id} accent={eventTint(e.type)}>
          <View style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText weightOverride="600">{EVENT_LABEL[e.type]}</AppText>
              <AppText variant="soft">{formatTimestamp(e.createdAt, true)}</AppText>
            </View>
            {e.trigger ? <AppText variant="muted">Trigger: {e.trigger}</AppText> : null}
            {e.whatHelped ? <AppText variant="muted">Helped: {e.whatHelped}</AppText> : null}
            {e.lesson ? <AppText variant="muted">Learned: {e.lesson}</AppText> : null}
            {e.note ? <AppText variant="muted">{e.note}</AppText> : null}
          </View>
        </Card>
      ))}
      {checkins.map((c) => (
        <Card key={c._id} accent={colors.neutral}>
          <View style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText weightOverride="600">Check-in</AppText>
              <AppText variant="soft">{c.date}</AppText>
            </View>
            <AppText variant="muted">
              {[
                c.sleepHours != null ? `${c.sleepHours}h sleep` : null,
                c.mood != null ? `mood ${c.mood}/5` : null,
                c.movedBody ? 'moved' : null,
                c.socialContact ? 'connected' : null,
                c.structureFollowed ? 'structure' : null,
              ]
                .filter(Boolean)
                .join(' · ') || 'logged'}
            </AppText>
          </View>
        </Card>
      ))}
    </View>
  );
}
