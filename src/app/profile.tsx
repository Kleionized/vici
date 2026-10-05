import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  GhostLink,
  LoadingView,
  MonoText,
  NavBar,
  PrimaryButton,
  Row,
  RowGroup,
  Screen,
  ScrollRegion,
  SHEET_TOP,
  Sheet,
  Tap,
  TextField,
} from '@/components/mono';
import { weekFor } from '@/content/curriculum84';
import { useAlbumStanding } from '@/lib/album';
import { useAuth } from '@/lib/auth';
import { useCurrentUser, useUpdateProfile } from '@/lib/backend';
import { dayMonthYear } from '@/lib/format';
import { lhNormal, mono, sans } from '@/lib/theme';

/**
 * 93 · Edit profile — the nav row with its caption, then a `gap 18` column
 * from canvas 124: the 96 ink monogram over "Change photo", the three rows that
 * name you, and the Journey group — when you started, the week you are in, and
 * the medallions (the album's own `N of 12`, `src/lib/album.ts`, so this row and
 * the album can never disagree).
 *
 * The two sheets (93B photo, 93C name) are the kit `Sheet`, laid over this
 * screen as the frames draw them. The column scrolls between the nav and the
 * screen's foot if it ever has to (D320); at 852 and 667 it fits.
 */

const DAY = 86_400_000;

export default function Profile() {
  const router = useRouter();
  const { email } = useAuth();
  const user = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const album = useAlbumStanding();

  const [openedAt] = useState(() => Date.now());
  const [photoOpen, setPhotoOpen] = useState(false);
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
  const username = (email ? email.split('@')[0] : (name || 'you').toLowerCase().replace(/\s+/g, '')) || 'you';
  // `14 Mar 2026`, assembled by hand: `en-GB` prints `Sept` for September.
  const started = user ? dayMonthYear(user.createdAt) : '—';
  // "Week VI, Discipline" — the roman numeral and the week's name, off the same
  // twelve-week table the week pages are built from.
  const weekNumber = user ? Math.min(12, Math.floor(Math.max(0, openedAt - user.createdAt) / (7 * DAY)) + 1) : 1;
  const week = weekFor(weekNumber);
  const currentWeek = week ? `Week ${week.roman}, ${week.name}` : '—';

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Edit profile' }} right="empty" onBack={close} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: 24, gap: 18 }}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          {/* the disc is a second door to the photo sheet; the words are the first */}
          <Tap
            label="Profile photo"
            onPress={() => setPhotoOpen(true)}
            style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
            <MonoText v="p" wrap="nowrap" color={mono.onInk} style={{ ...sans('700'), fontSize: 38, lineHeight: lhNormal(38) }}>
              {initial}
            </MonoText>
          </Tap>
          <Tap onPress={() => setPhotoOpen(true)} hitSlop={{ top: 14, bottom: 14, left: 20, right: 20 }}>
            <MonoText v="p" wrap="nowrap" color={mono.ink} style={{ ...sans('700'), fontSize: 14, lineHeight: lhNormal(14) }}>
              Change photo
            </MonoText>
          </Tap>
        </View>
        <View style={{ height: 4 }} />

        <RowGroup>
          <Row label="Name" value={name || 'Your name'} valueLines={1} onPress={openName} accessibilityLabel={`Name, ${name || 'not set'}`} />
          {/* The frame draws chevrons on Username and Email; nothing edits either
              yet, so they stay display rows (CRITIC §5, settings Q2). */}
          <Row label="Username" value={`@${username}`} valueLines={1} />
          <Row label="Email" value={email ?? 'Offline account'} valueLines={1} />
        </RowGroup>

        <RowGroup label="Journey">
          <Row label="Started VICI" value={started} chevron={false} />
          <Row label="Current week" value={currentWeek} valueLines={1} chevron={false} />
          <Row label="Medallions" value={album ? `${album.earned} of ${album.total}` : undefined} onPress={() => router.push('/milestones')} />
        </RowGroup>
      </ScrollRegion>

      {/* 93B · the three rows close the sheet — no photo pipeline exists yet */}
      <Sheet
        open={photoOpen}
        top={SHEET_TOP.photo}
        onClose={() => setPhotoOpen(false)}
        footer={<GhostLink label="Cancel" bottom={56} bold zIndex={42} onPress={() => setPhotoOpen(false)} />}>
        <MonoText v="h1Sheet">Profile photo</MonoText>
        <View style={{ height: 2 }} />
        <RowGroup>
          <Row label="Take photo" chevron={false} onPress={() => setPhotoOpen(false)} />
          <Row label="Choose from library" chevron={false} onPress={() => setPhotoOpen(false)} />
          <Row label="Remove photo" chevron={false} muted onPress={() => setPhotoOpen(false)} />
        </RowGroup>
      </Sheet>

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
