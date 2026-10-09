/**
 * Two boards of the handover — `Reminders Setup` (42) and `Day 0` (44) — and
 * the notification card `/reminders` and `/notify-primer` draw too.
 *
 * Moved out of `handover.tsx` (D390) so paywall-reminders and tail never edit
 * one file; paywall-reminders owns it. Children of `Screen` are in canvas
 * coordinates (the 54 status bar is the app's safe area, D009).
 */

import { useState, type ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';

import {
  Caps,
  GhostLink,
  H1,
  Hero,
  heroArtTop,
  LaurelMark,
  MonoText,
  NavBar,
  P,
  PrimaryButton,
  Screen,
  ScrollRegion,
  useCanvasTop,
} from '@/components/mono';
import { REMINDER_COPY, turnOnReminders } from '@/lib/reminders';
import { lhNormal, mono, sans } from '@/lib/theme';

// ── the notification card ────────────────────────────────────────────
/**
 * The two notes as they would land — the frame's words, which are the words
 * the scheduled reminders carry (`REMINDER_COPY`, one source for both).
 */
export const REMINDER_NOTES = [
  { title: REMINDER_COPY.morning.title, when: 'now', body: REMINDER_COPY.morning.body },
  { title: REMINDER_COPY.night.title, when: 'You pick the time', body: REMINDER_COPY.night.body },
] as const;

/**
 * A notification as the OS would show it (`notif` in the designer's kit):
 * `r20 #1E1E1E, padding 16 18`, a 40 white laurel (r10) top-aligned beside a
 * `gap 3` column — the title 15/700 ink and its time 12/700 mute on one
 * baseline, then the body 14/20 `#B5B0A8`, which the frame leaves at `wrap`.
 */
export function NotificationCard({ title, when, body }: { title: string; when: string; body: string }) {
  return (
    <View
      style={{
        borderRadius: 20,
        backgroundColor: mono.card,
        paddingVertical: 16,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
      <LaurelMark size={40} radius={10} />
      <View style={{ flex: 1, gap: 3 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <MonoText v="rowLabel" wrap="wrap" style={{ flexShrink: 1 }}>
            {title}
          </MonoText>
          <MonoText v="pill" wrap="nowrap" color={mono.mute} style={{ fontSize: 12, lineHeight: lhNormal(12) }}>
            {when}
          </MonoText>
        </View>
        <MonoText v="p" wrap="wrap" style={{ fontSize: 14, lineHeight: 20 }}>
          {body}
        </MonoText>
      </View>
    </View>
  );
}

/** The two cards, `gap 14`. */
export function ReminderNotes() {
  return (
    <View style={{ gap: 14 }}>
      {REMINDER_NOTES.map((n) => (
        <NotificationCard key={n.title} title={n.title} when={n.when} body={n.body} />
      ))}
    </View>
  );
}

// ── 42 · Reminders Setup ─────────────────────────────────────────────
/** The scroll band starts under the nav row; the frame's y are this much below its top. */
const BAND_TOP = 100;

/**
 * `Reminders Setup`'s board — the bell at 90, the headline and its line at
 * 320, the two notes at 470, the pill (at 96 over a ghost link, else 48) — for
 * the onboarding step and for the two routes no frame draws that show the same
 * notes (`/reminders`, `/notify-primer`), each with its own nav row and words.
 *
 * Everything between the nav row and the pill sits in flow in a band that
 * scrolls only on a phone too short to hold it (D320); at 393 × 852 it is the
 * frame. `after` follows the notes (the primer's discretion line).
 */
export function ReminderBoard({
  nav,
  title,
  sub,
  after,
  cta,
  onCta,
  ghost,
  onGhost,
  notesGap = 42,
}: {
  nav?: ReactNode;
  title: string;
  sub: string;
  after?: ReactNode;
  /** the space above the notes — the frame's 42; a board that adds a line under them gives some back */
  notesGap?: number;
  cta: string;
  onCta: () => void;
  ghost?: string;
  onGhost?: () => void;
}) {
  const ctaBottom = ghost ? 96 : 48;
  return (
    <Screen>
      {nav ?? <NavBar left="empty" right="empty" />}
      <ScrollRegion top={BAND_TOP} bottom={ctaBottom + 58} contentStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        {/* the hero is drawn in the band's own coordinates, so it scrolls with the words */}
        <Hero id="bell" top={90 - BAND_TOP} />
        <View style={{ marginTop: 320 - BAND_TOP, gap: 18 }}>
          <H1>{title}</H1>
          <P>{sub}</P>
        </View>
        {/* 470 − (320 + 66 + 18 + 24) */}
        <View style={{ marginTop: notesGap }}>
          <ReminderNotes />
        </View>
        {after}
      </ScrollRegion>
      <PrimaryButton label={cta} bottom={ctaBottom} onPress={onCta} />
      {ghost ? <GhostLink label={ghost} onPress={onGhost} /> : null}
    </Screen>
  );
}

/**
 * The onboarding step: the headline names the window the questionnaire gave
 * ("Late night is when you’re most likely to watch." — the frame's), and the
 * frame's nav row is empty: no Back, no Skip.
 *
 * `Turn on reminders` asks the OS and schedules the two check-ins at the saved
 * times (the time boards after Day 0 replace them and reschedule on `Save
 * time`), then carries on without waiting for the answer — the OS prompt sits
 * over the next board. Done here rather than in `welcome.tsx`'s `onAllow`,
 * which records the answer and moves the check-in that covers the window to
 * just before it (D422, D425). `onAllow` runs first, so the schedule is made
 * from the moved time.
 */
export function O3Reminders({ window: riskWindow, onAllow, skip }: { window: string; onAllow: () => void; skip: () => void }) {
  return (
    <ReminderBoard
      title={`${riskWindow} is when you’re most likely to watch.`}
      sub="Want VICI there before that time?"
      cta="Turn on reminders"
      onCta={() => {
        onAllow();
        void turnOnReminders();
      }}
      ghost="Not now"
      onGhost={skip}
    />
  );
}

// ── 44 · Day 0 ───────────────────────────────────────────────────────
/**
 * `lesson` is what `welcome.tsx` passes today — `Lesson 1 · Prepare for
 * tonight` — and is split at the middot into the card's two runs; `number` and
 * `title` say the same thing directly.
 */
function lessonRuns(lesson: string | undefined, number: number | undefined, title: string | undefined) {
  if (number != null || title) return { kicker: `Lesson ${number ?? 1}`, title: title ?? '' };
  const [kicker, ...rest] = (lesson ?? 'Lesson 1 · Prepare for tonight').split(' · ');
  return { kicker, title: rest.join(' · ') };
}

const SUNRISE_TOP = 126;
/** Never lift the art's top above canvas 108 (D320 rule 2). */
const ART_FLOOR = 108;

/**
 * The sunrise at 126, "Today" over a 44pt "Day 0" at 382, the lesson card and
 * the sentence under it at 504, "Begin" at the frame's bottom 48.
 *
 * On a phone too short for it the hero and both stacks rise together by the
 * deficit (D320 rule 2), never past the art's top at 108; past that the art is
 * dropped and the words rise alone. Nothing is shown until the lower stack has
 * been measured, so a short phone never draws one unlifted frame.
 */
/**
 * `busy`: "Begin" is filing the end of onboarding — the button holds, dimmed,
 * so a second tap cannot file it twice (D2, D498).
 */
export function O3DayZero({ lesson, number, title, next, busy }: { lesson?: string; number?: number; title?: string; next: () => void; busy?: boolean }) {
  const runs = lessonRuns(lesson, number, title);
  const { height: winH } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const [lowH, setLowH] = useState(0);

  const controlsTop = winH - canvasTop - 48 - 58;
  const measured = lowH > 0;
  const deficit = measured ? Math.ceil(504 + lowH + 16 - controlsTop) : 0;
  const room = Math.floor(heroArtTop('sunrise', SUNRISE_TOP) - ART_FLOOR);
  const dropArt = deficit > room;
  const lift = deficit <= 0 ? 0 : dropArt ? Math.min(deficit, 382 - ART_FLOOR) : deficit;
  const hidden = measured ? null : { opacity: 0 };

  return (
    <Screen>
      <NavBar left="empty" right="empty" />
      {dropArt ? null : (
        <View pointerEvents="none" style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, hidden]}>
          <Hero id="sunrise" top={SUNRISE_TOP - lift} />
        </View>
      )}
      <View style={[{ position: 'absolute', left: 24, right: 24, top: 382 - lift, gap: 8, alignItems: 'center' }, hidden]}>
        <Caps center style={{ alignSelf: 'stretch' }}>
          Today
        </Caps>
        <H1 center style={{ alignSelf: 'stretch', fontSize: 44, lineHeight: 50 }}>
          Day 0
        </H1>
      </View>
      <View
        onLayout={(e) => setLowH(e.nativeEvent.layout.height)}
        style={[{ position: 'absolute', left: 24, right: 24, top: 504 - lift, gap: 18, alignItems: 'center' }, hidden]}>
        <View style={{ borderRadius: 20, backgroundColor: mono.card, paddingVertical: 18, paddingHorizontal: 20, gap: 4, maxWidth: '100%' }}>
          <Caps>{runs.kicker}</Caps>
          <MonoText v="rowLabel" wrap="wrap" style={{ ...sans('700'), fontSize: 19, lineHeight: lhNormal(19) }}>
            {runs.title}
          </MonoText>
        </View>
        <MonoText v="pTight" center style={{ alignSelf: 'stretch' }}>
          Your first lesson is ready. Start with one thing today.
        </MonoText>
      </View>
      <PrimaryButton label="Begin" onPress={next} disabled={busy} />
    </Screen>
  );
}
