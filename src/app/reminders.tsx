import { useRouter } from 'expo-router';

import { NavBar } from '@/components/mono';
import { ReminderBoard } from '@/components/onboarding/reminders';
import { turnOnReminders } from '@/lib/reminders';

/**
 * `/reminders` (Settings → All → Reminders) — no frame draws it. It shows the
 * same two notes `Reminders Setup` draws, so it is that board (D225): the
 * bell, the words, the notes and the pill, with the kit back chevron because
 * it is a pushed page, and its own headline and line — no frame authors them
 * (D328). It has Back, so it keeps no "Not now"; the pill sits at the frame's
 * bottom 48.
 *
 * The pill turns on exactly the two reminders the notes show — the morning and
 * night check-ins, at the saved times — asking the OS first; a phone that will
 * no longer show the prompt is sent to system Settings (D422). The line said
 * "Timed to your risky window", which nothing schedules; it now says when they
 * come (D425).
 */
export default function Reminders() {
  const router = useRouter();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  const turnOn = async () => {
    await turnOnReminders({ openSettingsIfBlocked: true });
    back();
  };

  return (
    <ReminderBoard
      nav={<NavBar left="back" right="empty" onBack={back} />}
      title="Two reminders a day."
      sub="At your check-in times. They never name the habit."
      cta="Turn on reminders"
      onCta={() => void turnOn()}
    />
  );
}
