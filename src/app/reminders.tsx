import { useRouter } from 'expo-router';

import { NavBar } from '@/components/mono';
import { ReminderBoard } from '@/components/onboarding/reminders';
import { useUpdateSettings } from '@/lib/backend';

/**
 * `/reminders` (Settings → All → Reminders) — no frame draws it. It shows the
 * same two notes `Reminders Setup` draws, so it is that board (D225): the
 * bell, the words, the notes and the pill, with the kit back chevron because
 * it is a pushed page, and its own headline and line — no frame authors them
 * (D328). It has Back, so it keeps no "Not now"; the pill sits at the frame's
 * bottom 48.
 */
export default function Reminders() {
  const router = useRouter();
  const update = useUpdateSettings();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  // The one pill turns on exactly the two nudges the notes promise.
  const turnOn = () => {
    void update({ morningCheckin: true, riskTimeSupport: true }).catch(() => {});
    back();
  };

  return (
    <ReminderBoard
      nav={<NavBar left="back" right="empty" onBack={back} />}
      title="Two reminders a day."
      sub="Timed to your risky window. Nothing noisy, nothing shaming."
      cta="Turn on reminders"
      onCta={turnOn}
    />
  );
}
