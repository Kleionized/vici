import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { NavBar, Screen, TextField, WhenChips } from '@/components/mono';
import { useCreateJournalEntry, useJournalEntries, useUpdateJournalEntry } from '@/lib/backend';
import { clockTime, WEEKDAYS_SHORT } from '@/lib/format';
import { haptic } from '@/lib/haptics';

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
  const saving = useRef(false);

  async function save() {
    // Save twice in a row must not file two entries
    if (saving.current) return;
    const t = title.trim();
    const b = body.trim();
    if (!t && !b) {
      close();
      return;
    }
    saving.current = true;
    const input = { tag, title: t || 'Untitled', body: b };
    try {
      if (id) await updateEntry(id, input);
      else await createEntry(input);
      haptic('success');
      close();
    } catch {
      saving.current = false;
      Alert.alert('Not saved', 'That entry didn’t save. Check your connection and try again.');
    }
  }

  /**
   * Back with words on the page asks first — one stray tap used to throw away
   * a whole entry. (The web has no native alert; there Back keeps the words.)
   */
  const dirty = id ? !!existing && (title !== existing.title || body !== existing.body || tag !== existing.tag) : !!(title.trim() || body.trim());
  const back = () => {
    if (!dirty) return close();
    if (Platform.OS === 'web') return void save();
    Alert.alert(id ? 'Keep your changes?' : 'Keep this entry?', undefined, [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: close },
      { text: 'Save', onPress: () => void save() },
    ]);
  };

  const stamp = existing ? new Date(existing.createdAt) : new Date();
  const headerTime = existing ? `${WEEKDAYS_SHORT[stamp.getDay()]} · ${clockTime(stamp)}` : `Today · ${clockTime(stamp)}`;
  // a tag the three chips do not carry (Pledge, Affirmation) is offered as its own chip, first —
  // the one the entry came with, so it stays offered after another chip is picked
  const extra = [existing?.tag, tagParam, tag].find((t) => t && !TAGS.includes(t));
  const tags = extra ? [extra, ...TAGS] : TAGS;

  return (
    <Screen>
      <NavBar left="back" onBack={back} centre={{ title: headerTime }} right={{ text: 'Save', onPress: () => void save() }} />
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
