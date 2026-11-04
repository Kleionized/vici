import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking } from 'react-native';

import { MonoText, NavBar } from '@/components/mono';
import { ReminderBoard } from '@/components/onboarding/reminders';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { haptic } from '@/lib/haptics';
import { cancelAllReminders, enableReminders } from '@/lib/notifications';
import { mono } from '@/lib/theme';

/**
 * `/reminders` (Settings → All → Reminders) — no frame draws it. It shows the
 * same two notes `Reminders Setup` draws, so it is that board (D225): the
 * bell, the words, the notes and the pill, with the kit back chevron because
 * it is a pushed page, and its own headline and line — no frame authors them
 * (D328). It has Back, so it keeps no "Not now"; the pill sits at the frame's
 * bottom 48.
 *
 * The pill asks the OS for permission and switches on the check-ins and the
 * risky-window heads-up. If the OS says no, the board says where to change it
 * and the pill opens the app's page in Settings instead.
 */
export default function Reminders() {
  const router = useRouter();
  const update = useUpdateSettings();
  const user = useCurrentUser();
  const on = !!(user?.settings.morningCheckin || user?.settings.eveningWindDown || user?.settings.riskTimeSupport);
  const [denied, setDenied] = useState(false);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  const turnOff = async () => {
    await update({ morningCheckin: false, eveningWindDown: false, riskTimeSupport: false, weeklyReflection: false }).catch(() => {});
    await cancelAllReminders();
    back();
  };

  const turnOn = async () => {
    if (denied) {
      void Linking.openSettings().catch(() => {});
      return;
    }
    const result = await enableReminders();
    await update({ morningCheckin: true, eveningWindDown: true, riskTimeSupport: true, weeklyReflection: true }).catch(() => {});
    if (result === 'denied') {
      setDenied(true);
      return;
    }
    haptic('success');
    back();
  };

  return (
    <ReminderBoard
      nav={<NavBar left="back" right="empty" onBack={back} />}
      title="Two reminders a day."
      sub="Timed to your risky window. Nothing noisy, nothing shaming."
      notesGap={denied ? 24 : undefined}
      after={
        denied ? (
          <MonoText v="p" center wrap="wrap" style={{ marginTop: 12, fontSize: 14, lineHeight: 20, color: mono.mute }}>
            Notifications are off for this app. Turn them on in Settings and they’ll start on their own.
          </MonoText>
        ) : undefined
      }
      cta={denied ? 'Open Settings' : on ? 'Turn off reminders' : 'Turn on reminders'}
      onCta={() => void (on && !denied ? turnOff() : turnOn())}
    />
  );
}
