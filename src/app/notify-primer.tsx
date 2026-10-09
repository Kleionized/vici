import { useRouter } from 'expo-router';

import { MonoText, NavBar } from '@/components/mono';
import { ReminderBoard } from '@/components/onboarding/reminders';
import { turnOnReminders } from '@/lib/reminders';
import { mono } from '@/lib/theme';

/**
 * `/notify-primer` — no frame draws it; it is `Reminders Setup`'s board with
 * the kit ✕ it always had and its progress dashes (eight of nine, as the old
 * strip filled them) in the nav row (D225). The two notes are the ones the
 * frame draws — the "10:41 PM" / "wave tool" pair this screen still carried
 * was retired from `/reminders` already (D099). Its own headline, line and
 * discretion promise stay (D328); the lock glyph before the promise goes (no
 * frame draws a lock, CRITIC C7). `Not now` closes; `Turn on reminders` asks
 * the OS and schedules the two check-ins, then closes (D422). Its line said
 * "Timed to your risky window", which nothing schedules (D425).
 */
export default function NotifPrimer() {
  const router = useRouter();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const turnOn = async () => {
    await turnOnReminders({ openSettingsIfBlocked: true });
    close();
  };

  return (
    <ReminderBoard
      nav={<NavBar left="empty" centre={{ step: 8, total: 9 }} right="close" onClose={close} />}
      title="Two reminders a day."
      sub="At your check-in times."
      // the promise under the notes costs the space above them, so it clears the pill at 852
      notesGap={24}
      after={
        <MonoText v="p" center wrap="wrap" style={{ marginTop: 12, fontSize: 14, lineHeight: 20, color: mono.mute }}>
          They never name the habit.
        </MonoText>
      }
      cta="Turn on reminders"
      onCta={() => void turnOn()}
      ghost="Not now"
      onGhost={close}
    />
  );
}
