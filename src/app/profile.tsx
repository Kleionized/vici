import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { LoadingView, MonoText, NavBar, PrimaryButton, Row, RowGroup, Screen, ScrollRegion, SHEET_TOP, Sheet, TextField } from '@/components/mono';
import { weekFor } from '@/content/curriculum84';
import { useAlbumStanding } from '@/lib/album';
import { useAuth } from '@/lib/auth';
import { useCurrentUser, useUpdateProfile } from '@/lib/backend';
import { courseWeekForDay, programmeDay, programmeStartMs } from '@/lib/day';
import { dayMonthYear } from '@/lib/format';
import { lhNormal, mono, sans } from '@/lib/theme';

/**
 * 93 · Edit profile — the nav row with its caption, then a `gap 18` column
 * from canvas 124: the 96 ink monogram, the rows that name you, and the
 * Journey group — when you started, the week you are in, and the medallions
 * (the album's own `N of 12`, `src/lib/album.ts`, so this row and the album
 * can never disagree).
 *
 * P7 (D480): no photo pipeline exists, so the monogram is the picture and the
 * frame's "Change photo" and its sheet (93B — Take photo, Choose from library,
 * Remove photo, each of which only closed the sheet) are gone. The frame's
 * "Username" row is gone too: the app has no usernames, and the row showed
 * "@" plus the email's local part (a random string under Hide My Email).
 * Email is display-only, so it carries no chevron; Name, which opens 93C,
 * keeps its.
 *
 * The name sheet (93C) is the kit `Sheet`, laid over this screen as the frame
 * draws it. The column scrolls between the nav and the screen's foot if it
 * ever has to (D320); at 852 and 667 it fits.
 */

export default function Profile() {
  const router = useRouter();
  const { email } = useAuth();
  const user = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const album = useAlbumStanding();

  const [openedAt] = useState(() => Date.now());
  const [nameOpen, setNameOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  if (user === undefined) return <LoadingView onBack={close} />;

  const name = user?.displayName ?? '';
  const openName = () => {
    setDraft(name);
    setNameOpen(true);
  };
  // Save closes the sheet, not the screen — 93C puts the pill in the sheet.
  async function save() {
    await updateProfile(draft);
    setNameOpen(false);
  }

  // The canvas monogram is a single letter, not a two-letter badge.
  const initial = ((name || email || 'You').trim()[0] ?? 'Y').toUpperCase();
  // `14 Mar 2026`, assembled by hand: `en-GB` prints `Sept` for September.
  // The programme's first day, the date the week below is counted from (not
  // the sign-up date, which can be earlier).
  const startMs = programmeStartMs(user);
  const started = startMs != null ? dayMonthYear(startMs) : '—';
  // "Week VI, Discipline" — the roman numeral and the week's name, off the same
  // twelve-week table the week pages are built from.
  // the programme week on the calendar count every screen uses (src/lib/day.ts)
  const weekNumber = user ? courseWeekForDay(programmeDay(user, openedAt)) : 1;
  const week = weekFor(weekNumber);
  const currentWeek = week ? `Week ${week.roman}, ${week.name}` : '—';

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Edit profile' }} right="empty" onBack={close} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: 24, gap: 18 }}>
        <View style={{ alignItems: 'center' }}>
          {/* the monogram is the picture: a display disc, not a control */}
          <View
            accessible
            accessibilityLabel={`Monogram ${initial}`}
            style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
            <MonoText v="p" wrap="nowrap" color={mono.onInk} style={{ ...sans('700'), fontSize: 38, lineHeight: lhNormal(38) }}>
              {initial}
            </MonoText>
          </View>
        </View>
        <View style={{ height: 4 }} />

        <RowGroup>
          <Row label="Name" value={name || 'Your name'} valueLines={1} onPress={openName} accessibilityLabel={`Name, ${name || 'not set'}`} />
          {/* The frame draws a chevron on Email; nothing edits it, so it is a
              display row and draws none (CRITIC §5, settings Q2; D480). */}
          <Row label="Email" value={email ?? 'Offline account'} valueLines={1} chevron={false} />
        </RowGroup>

        <RowGroup label="Journey">
          <Row label="Started VICI" value={started} chevron={false} />
          <Row label="Current week" value={currentWeek} valueLines={1} chevron={false} />
          <Row label="Medallions" value={album ? `${album.earned} of ${album.total}` : undefined} onPress={() => router.push('/milestones')} />
        </RowGroup>
      </ScrollRegion>

      {/* 93C · the scrim and the back gesture close it without saving */}
      <Sheet
        open={nameOpen}
        top={SHEET_TOP.name}
        onClose={() => setNameOpen(false)}
        footer={<PrimaryButton label="Save" sheet onPress={() => void save()} />}>
        <MonoText v="h1Sheet">Name</MonoText>
        <TextField variant="sheet" value={draft} onChangeText={setDraft} placeholder="Your name" autoFocus />
        <MonoText v="p" color={mono.mute} style={{ fontSize: 14, lineHeight: 20 }}>
          Shown on your vow and your letters.
        </MonoText>
      </Sheet>
    </Screen>
  );
}
