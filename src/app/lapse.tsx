import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, PressScale } from '@/components/ui';
import { useCreateEvent } from '@/lib/backend';
import { setJSON } from '@/lib/storage';
import { colors, sans } from '@/lib/theme';

import {
  FlowTop,
  GRID_GAP,
  GRID_GUTTER,
  Heading,
  LoggedNote,
  PrimaryButton,
  SummaryRow,
  TimeWheel,
  TRIGGERS,
  TriggerCard,
  triggerTileWidth,
  WHEN_CHIPS,
} from './urge-log';

/**
 * 030–032 · The lapse, in the log's own voice — when it happened, what fed it,
 * and a card saying it is on the record. No red, no reset: it is the same sheet
 * the urge log uses, one step shorter (invariant #2).
 *
 * The canvas rail carries three 36 × 4 bars for two questions and the logged
 * card; the card drops the rail the way 048 does. Every `top` below is the
 * canvas value less the 54pt status bar, and the primary pill sits at canvas
 * 744 — 16pt under a 58pt button above the home indicator.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

/** "Today · 11:40 pm" — the canvas writes the meridiem lowercase. */
function stamp(at: number, today: number): string {
  const picked = new Date(at);
  const midnight = new Date(today).setHours(0, 0, 0, 0);
  const days = Math.round((midnight - new Date(at).setHours(0, 0, 0, 0)) / 86_400_000);
  const day = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : picked.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${day} · ${picked.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}`;
}

export default function Lapse() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const [step, setStep] = useState(0);
  const [when, setWhen] = useState(0);
  const [showWheel, setShowWheel] = useState(false);
  // A time nudged on the wheel outranks the chips until Cancel puts it back.
  const [customAt, setCustomAt] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  // Read once: the wheel must not slide under a re-render while it is open.
  const [now] = useState(() => Date.now());
  const { width: screenWidth } = useWindowDimensions();
  const triggerTile = triggerTileWidth(screenWidth);
  const at = customAt ?? now - WHEN_CHIPS[when].offsetMs;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  const back = () => (step === 0 ? close() : setStep((current) => current - 1));
  const toggleTrigger = (label: string) => setTriggers((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));

  async function save() {
    setSaving(true);
    // A lapse is one neutral event: when it landed and what fed it. Nothing
    // else is invented for it — the log reads it back with the same words.
    await createEvent({ type: 'lapse', trigger: triggers.length ? triggers.join(' · ') : undefined, createdAt: at });
    // The sealed letter arrives over Today the launch after a slip is logged.
    await setJSON('tideline.letter.pending', Date.now());
    setSaving(false);
    setStep(2);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {step < 2 ? <FlowTop index={step} steps={3} onBack={back} onClose={close} /> : null}

          {step === 0 ? (
            <>
              <Heading>When did it happen?</Heading>
              <View style={{ position: 'absolute', left: 0, right: 0, top: 152, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                {WHEN_CHIPS.map((chip, index) => {
                  const on = customAt == null && when === index;
                  return (
                    <PressScale
                      key={chip.label}
                      onPress={() => {
                        setWhen(index);
                        setCustomAt(null);
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: on }}
                      hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                      style={{
                        minHeight: 0,
                        paddingVertical: 13,
                        paddingHorizontal: 20,
                        borderRadius: 24,
                        backgroundColor: on ? '#131313' : '#FFFFFF',
                        boxShadow: on ? undefined : '0 0 0 1px rgba(0,0,0,0.10)',
                      }}>
                      <AppText style={[sans('500'), { fontSize: 14, color: on ? '#FFFFFF' : '#1D1C1A' }]}>{chip.label}</AppText>
                    </PressScale>
                  );
                })}
              </View>
              <PressScale
                onPress={() => setShowWheel((open) => !open)}
                accessibilityRole="button"
                hitSlop={{ top: 16, bottom: 16, left: 40, right: 40 }}
                style={{ position: 'absolute', left: 0, right: 0, top: 222, minHeight: 0, alignItems: 'center' }}>
                <AppText style={[sans('500'), { fontSize: 14, color: '#55534E' }]}>Specify time</AppText>
              </PressScale>
              {showWheel ? (
                <TimeWheel
                  at={at}
                  today={now}
                  onShift={(ms) => setCustomAt((current) => (current ?? at) + ms)}
                  onCancel={() => {
                    setCustomAt(null);
                    setShowWheel(false);
                  }}
                  onSave={() => setShowWheel(false)}
                />
              ) : null}
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Heading>What fed it?</Heading>
              <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: 132, fontSize: 14.5, color: '#55534E' }]}>
                Tap all that apply.
              </AppText>
              <View style={{ position: 'absolute', left: GRID_GUTTER, right: GRID_GUTTER, top: 180, flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP }}>
                {TRIGGERS.map((item) => (
                  <TriggerCard key={item.label} {...item} width={triggerTile} selected={triggers.includes(item.label)} onPress={() => toggleTrigger(item.label)} />
                ))}
              </View>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <LoggedNote />
              <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 262, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
                Lapse logged.
              </AppText>
              <View
                style={{
                  position: 'absolute',
                  left: 24,
                  right: 24,
                  top: 322,
                  borderRadius: 18,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
                  paddingVertical: 4,
                  paddingHorizontal: 20,
                }}>
                <SummaryRow label="When" value={customAt == null ? WHEN_CHIPS[when].label : stamp(at, now)} />
                <SummaryRow label="Set off by" value={triggers.length ? triggers.join(' · ') : '—'} />
                {/* The flow asks two questions; the third row reads the log's own
                    word for a lapse back, so the card and the list agree. */}
                <SummaryRow label="What I did" value="Slipped" last />
              </View>
            </>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          {step === 0 ? <PrimaryButton label="Continue" onPress={() => setStep(1)} /> : null}
          {step === 1 ? <PrimaryButton label={saving ? 'Logging…' : 'Log the lapse'} enabled={!saving} onPress={() => void save()} /> : null}
          {step === 2 ? <PrimaryButton label="Done" onPress={close} /> : null}
        </View>
      </SafeAreaView>
    </View>
  );
}
