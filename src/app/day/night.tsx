import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  ActionButton,
  ActionCard,
  ActionTitle,
  DayBadge,
  DayClosing,
  DayDots,
  DayShell,
  DayTitle,
  JournalMark,
  LedgerRow,
  LedgerRule,
  MoodDial,
  NightActionArt,
  NightSky,
  ScaleEnds,
  ScaleReading,
  nightAction,
} from '@/components/day/kit';
import { AppText, PressScale } from '@/components/ui';
import { useCreateJournalEntry, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap, useLessons, useUpsertCheckin } from '@/lib/backend';
import { toDateKey, todayKey } from '@/lib/date';
import { roman } from '@/lib/lessonArt';
import { fonts, sans } from '@/lib/theme';

/**
 * Frames 131–135 · the nightly check-in.
 *
 * Five steps: how it landed, what the day actually contained, anything worth
 * keeping, the one thing to do before sleep, and the close. The record is read
 * back rather than asked for — the day is already written by the time you get
 * here. The action step carries no rail, which is how the canvas draws it: it
 * is an aside between closing the day and being told the day is closed.
 */

const RAIL = 4;

/** What the dial reads back. The canvas draws the middle rung. */
const MOOD_READ: [string, string][] = [
  ['Heavy', 'A hard one'],
  ['Low', 'It took something'],
  ['Mixed', 'Some of both'],
  ['Good', 'More right than wrong'],
  ['Bright', 'One to keep'],
];

function dayNumber(createdAt?: number): number {
  if (!createdAt) return 1;
  return Math.max(1, Math.floor((Date.now() - createdAt) / 86_400_000) + 1);
}

function clockTime(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function Night() {
  const router = useRouter();
  const user = useCurrentUser();
  const events = useEvents();
  const journal = useJournalEntries();
  const lessons = useLessons();
  const progress = useLessonProgressMap();
  const upsert = useUpsertCheckin();
  const createJournalEntry = useCreateJournalEntry();

  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(2);
  const [reflection, setReflection] = useState('');
  const [action, setAction] = useState(true);

  const day = dayNumber(user?.createdAt);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  const midnight = new Date().setHours(0, 0, 0, 0);
  const urges = (events ?? []).filter((e) => e.type.startsWith('urge') && e.createdAt >= midnight);
  const lastUrge = urges[urges.length - 1];
  const rodeOut = urges.filter((e) => e.type === 'urge_rode_out').length;
  const pledge = (journal ?? []).find((entry) => entry.tag === 'Pledge' && entry.createdAt >= midnight);
  const finished = (lessons ?? []).find((lesson) => {
    const at = progress?.[lesson.slug]?.completedAt;
    return at != null && at >= midnight;
  });

  const task = nightAction(day);

  async function finish() {
    // The upsert merges now, so only what this flow asked for is written.
    await upsert({ date: todayKey(), mood: mood + 1 }).catch(() => {});
    if (reflection.trim()) {
      await createJournalEntry({ tag: 'Reflection', title: `Day ${day}`, body: reflection.trim() }).catch(() => {});
    }
    // The action lands on the day it is for, not the day it was named: it is
    // set tonight and answered for by tomorrow morning's check-in.
    if (action) {
      await upsert({ date: toDateKey(new Date(Date.now() + 86_400_000)), dailyAction: task }).catch(() => {});
    }
    close();
  }

  const label = ['Continue', 'Continue', 'Close the day', '', 'Goodnight'][step];
  const dark = step === 0 || step === 4;
  const take = (keep: boolean) => {
    setAction(keep);
    setStep(4);
  };

  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <DayShell
        // the canvas gives the action step no rail at all
        rail={step === 3 ? undefined : <DayDots step={step === 4 ? 3 : step} count={RAIL} light={dark} />}
        onBack={step === 0 ? close : () => setStep((s) => s - 1)}
        cta={step === 3 ? undefined : () => (step === 4 ? void finish() : setStep((s) => s + 1))}
        ctaLabel={label}
        footer={
          step === 3 ? (
            <>
              <ActionButton label="Done" onPress={() => take(true)} />
              <PressScale
                onPress={() => take(false)}
                accessibilityRole="button"
                hitSlop={{ top: 12, bottom: 12, left: 24, right: 24 }}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 10, minHeight: 0, alignItems: 'center' }}>
                <AppText style={[sans('500'), { fontSize: 14.5, color: '#8B8882' }]}>Skip tonight</AppText>
              </PressScale>
            </>
          ) : undefined
        }
        backdrop={step === 0 ? <NightSky height={212} hillTop={142} /> : step === 4 ? <NightSky height={360} hillTop={290} /> : undefined}>
        {step === 0 ? (
          <>
            <DayTitle top={216}>How was today?</DayTitle>
            <MoodDial value={mood} onChange={setMood} top={326} />
            <ScaleEnds top={390} low="Heavy" high="Bright" />
            <ScaleReading top={448} label={MOOD_READ[mood][0]} note={MOOD_READ[mood][1]} />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <DayTitle top={116}>The record.</DayTitle>
            <View style={{ position: 'absolute', left: 12, right: 12, top: 186, height: 230, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
              <LedgerRow
                top={14}
                mark="check"
                glyph={[13, 11]}
                title={pledge ? 'Pledge kept' : 'No pledge signed today'}
                detail={pledge ? `signed ${clockTime(pledge.createdAt)}` : undefined}
              />
              <LedgerRule top={63} />
              <LedgerRow
                top={70}
                mark="wave"
                glyph={[17, 12]}
                title={lastUrge ? `${urges.length === 1 ? 'One urge' : `${urges.length} urges`} · ${clockTime(lastUrge.createdAt)}` : 'No urges today'}
                detail={lastUrge ? (rodeOut === urges.length ? 'rode it out' : 'logged') : undefined}
              />
              <LedgerRule top={119} />
              <LedgerRow
                top={126}
                mark="play"
                glyph={[11, 14]}
                title={finished ? `Part ${roman(finished.dayInWeek)} finished` : 'No lesson today'}
                detail={finished ? `${finished.estimatedMinutes ?? 7} min` : undefined}
              />
              <PressScale
                onPress={() => router.push('/urge-log')}
                accessibilityRole="button"
                // the canvas is content-box, so its 44 + 1px rule is a 45-tall
                // border box; RN is border-box, so the 45 goes on the height
                style={{ position: 'absolute', left: 16, right: 16, bottom: 0, height: 45, minHeight: 45, flexDirection: 'row', alignItems: 'center', gap: 9, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.07)' }}>
                <Svg width={12} height={12} viewBox="0 0 14 14" fill="none">
                  <Path d="M7 1v12M1 7h12" stroke="#55534E" strokeWidth={2} strokeLinecap="round" />
                </Svg>
                <AppText style={[sans('600'), { fontSize: 13.5, color: '#55534E' }]}>Add to the record</AppText>
              </PressScale>
            </View>
            <JournalMark top={446} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <DayTitle top={176}>Anything worth keeping?</DayTitle>
            <View style={{ position: 'absolute', left: 12, right: 12, top: 256, height: 150, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.07)' }}>
              <TextInput
                value={reflection}
                onChangeText={setReflection}
                multiline
                placeholder="Sam called at the right moment…"
                placeholderTextColor="#8B8882"
                style={[
                  { position: 'absolute', left: 20, right: 20, top: 22, height: 96, fontFamily: fonts.quote, fontStyle: 'italic', fontSize: 17, lineHeight: 27, color: '#1D1C1A', padding: 0 },
                  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
                ]}
              />
              <AppText style={[sans('500'), { position: 'absolute', right: 16, bottom: 12, fontSize: 11, color: '#B0AEA8' }]}>Optional</AppText>
            </View>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <ActionTitle>Tonight’s action</ActionTitle>
            <ActionCard top={182} art={<NightActionArt frame="night" />} mark="moon" label="Tonight" line={task} />
          </>
        ) : null}

        {step === 4 ? (
          <>
            <DayBadge top={366} mark="check" />
            <DayClosing top={458} headline={`Day ${day}, closed.`} note="See you in the morning." />
          </>
        ) : null}
      </DayShell>
    </>
  );
}
