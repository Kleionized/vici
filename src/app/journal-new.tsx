import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { NavBar, Screen, TextField, WhenChips } from '@/components/mono';
import { useCreateJournalEntry, useJournalEntries, useUpdateJournalEntry } from '@/lib/backend';
import { clockTime, WEEKDAYS_SHORT } from '@/lib/format';

const TAGS = ['Reflection', 'Urge', 'Lesson'];

/**
 * The journal editor — a new entry, or (`?id=`) an existing one from Past
 * pledges. `?tag=` opens a new entry under that tag: Today III's + writes a
 * new pledge here (`tag=Pledge`), and the newest Pledge entry is the pledge
 * Today and the morning check-in stand on (D233).
 *
 * No frame draws it; it takes the sheets' and the check-ins' pieces: the nav
 * row (back = Cancel, the entry's time centred, Save on the right), the tags as
 * when-chips, the title in the one-line sheet field and the body in the note
 * field. The old B / I / U toolbar formatted nothing and is gone (D233).
 */
export default function JournalNew() {
  const router = useRouter();
  const { id, tag: tagParam } = useLocalSearchParams<{ id?: string; tag?: string }>();
  const entries = useJournalEntries();
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();

  const existing = id ? entries?.find((e) => e._id === id) : undefined;

  const [tag, setTag] = useState(tagParam || 'Reflection');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loaded, setLoaded] = useState(false);

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

  const stamp = existing ? new Date(existing.createdAt) : new Date();
  const headerTime = existing ? `${WEEKDAYS_SHORT[stamp.getDay()]} · ${clockTime(stamp)}` : `Today · ${clockTime(stamp)}`;
  // a tag the three chips do not carry (Pledge, Affirmation) is offered as its own chip, first —
  // the one the entry came with, so it stays offered after another chip is picked
  const extra = [existing?.tag, tagParam, tag].find((t) => t && !TAGS.includes(t));
  const tags = extra ? [extra, ...TAGS] : TAGS;

  return (
    <Screen>
      <NavBar left="back" onBack={close} centre={{ title: headerTime }} right={{ text: 'Save', onPress: () => void save() }} />
      <KeyboardAvoidingView style={{ position: 'absolute', left: 0, right: 0, top: 108, bottom: 0 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, gap: 16 }}>
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
            <TextField variant="sheet" value={title} onChangeText={setTitle} placeholder="A quiet win" accessibilityLabel="Title" />
            <TextField
              variant="note"
              value={body}
              onChangeText={setBody}
              placeholder="Write freely. No one sees this but you."
              autoFocus={!id}
              accessibilityLabel="Entry"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
