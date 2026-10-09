import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { GhostLink, MonoText, NavBar, PrimaryButton, Screen, SHEET_TOP, Sheet, Tap, TextField, WhenChips } from '@/components/mono';
import { useCreateJournalEntry, useDeleteJournalEntry, useJournalEntries, useUpdateJournalEntry } from '@/lib/backend';
import { clockTime, WEEKDAYS_SHORT } from '@/lib/format';
import { mono } from '@/lib/theme';
import type { JournalEntry } from '@/lib/types';

const TAGS = ['Reflection', 'Urge', 'Lesson'];

/**
 * Entries that are read, not rewritten (D481): a `Letter` is VICI's (the
 * week-XII letter, the post-slip letter, the medallion post) and a `Vow` is
 * words signed on a date — editing either would change what was sent or
 * signed. They open read-only; they can still be deleted.
 */
const READ_ONLY = new Set(['Letter', 'Vow']);

/**
 * The journal editor — a new entry, or (`?id=`) an existing one from the
 * Journal. `?tag=` opens a new entry under that tag: Today III's + writes a
 * new pledge here (`tag=Pledge`), and the newest Pledge entry is the pledge
 * Today and the morning check-in stand on (D233).
 *
 * No frame draws it; it takes the sheets' and the check-ins' pieces: the nav
 * row (back = Cancel, the entry's time centred, Save on the right), the tags as
 * when-chips, the title in the one-line sheet field and the body in the note
 * field. The old B / I / U toolbar formatted nothing and is gone (D233).
 *
 * An existing entry can be deleted (D3, D481): "Delete entry" at the foot of
 * the column opens the sign-out sheet's shell to confirm, and the delete goes
 * through `useDeleteJournalEntry` on either backend. Both backends drop the
 * entry from the live list before that call resolves, so the screen holds the
 * entry it is deleting and keeps drawing it until it has left (D486); without
 * that it turned into the new-entry editor (Today's time, Save) for the
 * frames it took to go back.
 */
export default function JournalNew() {
  const router = useRouter();
  const { id, tag: tagParam } = useLocalSearchParams<{ id?: string; tag?: string }>();
  const entries = useJournalEntries();
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const live = id ? entries?.find((e) => e._id === id) : undefined;
  // the entry being deleted, held so the screen does not change under the way out (D486)
  const [held, setHeld] = useState<JournalEntry | undefined>(undefined);
  const existing = live ?? held;
  const readOnly = !!existing && READ_ONLY.has(existing.tag);

  const [tag, setTag] = useState(tagParam || 'Reflection');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Prefill once when editing an existing entry.
  useEffect(() => {
    if (id && existing && !loaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the editor once when its entry arrives.
      setTag(existing.tag);
      setTitle(existing.title);
      setBody(existing.body);
      setLoaded(true);
    }
  }, [id, existing, loaded]);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/journal'));

  async function save() {
    if (readOnly) {
      close();
      return;
    }
    const t = title.trim();
    const b = body.trim();
    if (!t && !b) {
      close();
      return;
    }
    // A pledge written in the first field alone is still the pledge: every screen
    // that shows one reads its body (see src/lib/pledge.ts).
    const input = { tag, title: t || 'Untitled', body: b || (tag === 'Pledge' ? t : '') };
    if (id) await updateEntry(id, input);
    else await createEntry(input);
    close();
  }

  async function remove() {
    if (!id || deleting) return;
    setHeld(live);
    setDeleting(true);
    setConfirmOpen(false);
    await Promise.resolve(deleteEntry(id)).catch(() => {});
    close();
  }

  const stamp = existing ? new Date(existing.createdAt) : new Date();
  const headerTime = existing ? `${WEEKDAYS_SHORT[stamp.getDay()]} · ${clockTime(stamp)}` : `Today · ${clockTime(stamp)}`;
  // a tag the three chips do not carry (Pledge, Affirmation) is offered as its own chip, first —
  // the one the entry came with, so it stays offered after another chip is picked
  const extra = [existing?.tag, tagParam, tag].find((t) => t && !TAGS.includes(t));
  const tags = extra ? [extra, ...TAGS] : TAGS;

  return (
    <Screen>
      <NavBar
        left="back"
        onBack={close}
        centre={{ title: headerTime }}
        right={readOnly ? 'empty' : { text: 'Save', onPress: () => void save() }}
      />
      <KeyboardAvoidingView style={{ position: 'absolute', left: 0, right: 0, top: 108, bottom: 0 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, gap: 16 }}>
          {readOnly && existing ? (
            // a letter or a vow, read as it was sent or signed
            <View style={{ gap: 12 }}>
              <MonoText v="caps">{existing.tag}</MonoText>
              {existing.title ? (
                <MonoText v="h1Sheet" wrap="wrap">
                  {existing.title}
                </MonoText>
              ) : null}
              <MonoText v="p" wrap="pretty" color={mono.ink} style={{ fontSize: 16, lineHeight: 25 }}>
                {existing.body}
              </MonoText>
            </View>
          ) : (
            <>
              {/* one row that scrolls sideways: a fourth chip (Pledge, Affirmation) would
                  otherwise wrap "Lesson" alone onto a second line at 375 and 393 */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ marginHorizontal: -24, flexGrow: 0 }}
                contentContainerStyle={{ paddingHorizontal: 24 }}>
                <WhenChips options={tags} value={tag} onChange={setTag} style={{ flexWrap: 'nowrap' }} />
              </ScrollView>
              <View style={{ gap: 12 }}>
                <TextField variant="sheet" value={title} onChangeText={setTitle} placeholder="Title" accessibilityLabel="Title" />
                <TextField
                  variant="note"
                  value={body}
                  onChangeText={setBody}
                  placeholder="Write freely. It stays in your account."
                  autoFocus={!id}
                  accessibilityLabel="Entry"
                />
              </View>
            </>
          )}
          {existing ? (
            <Tap onPress={() => setConfirmOpen(true)} hitSlop={{ top: 12, bottom: 12 }} label="Delete entry" style={{ alignSelf: 'center', marginTop: 16 }}>
              <MonoText v="ghost" center color={mono.mute}>
                Delete entry
              </MonoText>
            </Tap>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* the sign-out sheet's shell: only the pill deletes; the scrim and "Keep it" close */}
      <Sheet
        open={confirmOpen}
        top={SHEET_TOP.signOut}
        gap={10}
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <PrimaryButton label="Delete" bottom={96} sheet disabled={deleting} onPress={() => void remove()} />
            <GhostLink label="Keep it" zIndex={42} onPress={() => setConfirmOpen(false)} />
          </>
        }>
        <MonoText v="h1SheetLg">Delete this entry?</MonoText>
        <MonoText v="p" color={mono.sub} style={{ lineHeight: 23 }}>
          This can’t be undone.
        </MonoText>
      </Sheet>
    </Screen>
  );
}
