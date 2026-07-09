import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { useCreateJournalEntry, useJournalEntries, useUpdateJournalEntry } from '@/lib/backend';
import { colors, fonts, spacing } from '@/lib/theme';

const TAGS = ['Reflection', 'Urge', 'Lesson'];
const FORMATS = ['B', 'I', 'U'];

export default function JournalNew() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const entries = useJournalEntries();
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();

  const existing = id ? entries?.find((e) => e._id === id) : undefined;

  const [tag, setTag] = useState('Reflection');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Prefill once when editing an existing entry.
  useEffect(() => {
    if (id && existing && !loaded) {
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
    const input = { tag, title: t || 'Untitled', body: b };
    if (id) await updateEntry(id, input);
    else await createEntry(input);
    close();
  }

  const headerTime = existing
    ? new Date(existing.createdAt).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })
    : `Today · ${new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* top bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 14 }}>
            <Pressable onPress={close} hitSlop={8}>
              <AppText weightOverride="600" style={{ fontSize: 16.5, color: colors.textMuted }}>
                Cancel
              </AppText>
            </Pressable>
            <AppText weightOverride="700" style={{ fontSize: 14, color: colors.textSoft }}>
              {headerTime}
            </AppText>
            <Pressable onPress={save} style={{ backgroundColor: colors.accent, borderRadius: 9999, paddingHorizontal: 18, paddingVertical: 8 }}>
              <AppText weightOverride="700" color={colors.accentText} style={{ fontSize: 15 }}>
                Save
              </AppText>
            </Pressable>
          </View>

          {/* tag chips */}
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: spacing.xl, paddingBottom: 14 }}>
            {TAGS.map((t) => {
              const on = t === tag;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTag(t)}
                  style={{ paddingHorizontal: 13, paddingVertical: 7, borderRadius: 9999, backgroundColor: on ? colors.accent : 'transparent', borderWidth: on ? 0 : 1.5, borderColor: colors.border }}>
                  <AppText weightOverride="700" color={on ? colors.accentText : colors.textMuted} style={{ fontSize: 12.5, letterSpacing: 0.4 }}>
                    {t}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {/* body */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: 6 }} keyboardShouldPersistTaps="handled">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="A quiet win"
              placeholderTextColor={colors.textSoft}
              style={{ fontFamily: fonts.serif, fontSize: 26, letterSpacing: 0.26, color: colors.text, marginBottom: 12, padding: 0 }}
            />
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Write freely. No one sees this but you."
              placeholderTextColor={colors.textSoft}
              multiline
              autoFocus={!id}
              style={{ fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, letterSpacing: 0.1, color: colors.text, padding: 0, minHeight: 200, textAlignVertical: 'top' }}
            />
          </ScrollView>

          {/* format toolbar */}
          <View style={{ paddingHorizontal: 14, paddingVertical: 10 }}>
            <View style={{ flexDirection: 'row', gap: 6, backgroundColor: colors.surface, borderRadius: 14, padding: 6 }}>
              {FORMATS.map((f, i) => (
                <View key={f} style={{ flex: 1, height: 40, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: i === 0 ? colors.accent : 'transparent' }}>
                  <AppText
                    color={i === 0 ? colors.accentText : colors.text}
                    weightOverride={f === 'B' ? '700' : '600'}
                    style={{ fontSize: 18, fontStyle: f === 'I' ? 'italic' : 'normal', textDecorationLine: f === 'U' ? 'underline' : 'none' }}>
                    {f}
                  </AppText>
                </View>
              ))}
              <View style={{ flex: 1, height: 40, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={22} height={18} viewBox="0 0 24 20">
                  <Path d="M3 5h18M3 11h18M3 17h12" stroke={colors.text} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
