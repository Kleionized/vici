import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { RerollGlyph } from '@/components/day/kit';
import { GhostLink, MonoText, PrimaryButton, Screen, Sheet, SHEET_TOP, Tap, TextField } from '@/components/mono';
import { useCreateJournalEntry } from '@/lib/backend';
import { ACCOUNT_KEYS, readAccountJSON, writeAccountJSON } from '@/lib/accountState';

/**
 * 21C · 21C2 — the sentence journal, and the board where you write the prompt.
 *
 * One line a day, against a prompt you can swap if the one offered does not
 * fit. Deliberately a single sentence: a blank page asks for an essay and gets
 * nothing, where a single line gets written.
 *
 * No frame in this drop draws it; it is the Change Pledge Sheet's shell (the
 * kit `Sheet` at 120 — scrim, `#171717` panel, grabber, h1 + line + card field,
 * the pill at bottom 96 over the ghost at 60), over the bare ground the
 * canvas leaves behind its own sheets. The two modes keep the shell and swap
 * the body. A tap on the scrim, a drag down or Escape closes it, as the scrim
 * did.
 */

const PROMPTS = [
  'Why stay clean today?',
  'What would today look like if it went well?',
  'What are you protecting by keeping today clean?',
  'Who is counting on you today?',
  'What did the last good evening have in it?',
];

/** Where a written-in prompt is kept so it comes back each morning. */
const CUSTOM_PROMPT_KEY = ACCOUNT_KEYS.affirmationPrompt;

export default function Affirmation() {
  const router = useRouter();
  const createJournalEntry = useCreateJournalEntry();
  const [promptIndex, setPromptIndex] = useState(0);
  const [mode, setMode] = useState<'journal' | 'custom'>('journal');
  const [custom, setCustom] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [line, setLine] = useState('');
  const [saving, setSaving] = useState(false);

  // A prompt written once comes back — the board promises it will.
  useEffect(() => {
    void readAccountJSON<string>(CUSTOM_PROMPT_KEY).then((stored) => {
      if (stored) setCustom(stored);
    });
  }, []);

  const prompt = custom ?? PROMPTS[promptIndex];
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  async function save() {
    if (!line.trim()) return close();
    setSaving(true);
    await createJournalEntry({ tag: 'Affirmation', title: prompt, body: line.trim() }).catch(() => {});
    setSaving(false);
    close();
  }

  const applyDraft = () => {
    const next = draft.trim();
    setCustom(next || null);
    void (next ? writeAccountJSON(CUSTOM_PROMPT_KEY, next) : Promise.resolve());
    setMode('journal');
  };

  return (
    <Screen>
      <Sheet
        open
        top={SHEET_TOP.pledge}
        onClose={close}
        scrimLabel="Close"
        footer={
          mode === 'custom' ? (
            <>
              <PrimaryButton sheet label="Use this prompt" bottom={96} onPress={applyDraft} />
              <GhostLink label="Back to prompts" zIndex={42} onPress={() => setMode('journal')} />
            </>
          ) : (
            <>
              <PrimaryButton sheet label="Save today’s line" bottom={96} disabled={saving} onPress={() => void save()} />
              <GhostLink
                label="Write my own prompt"
                zIndex={42}
                onPress={() => {
                  setDraft(custom ?? '');
                  setMode('custom');
                }}
              />
            </>
          )
        }>
        {mode === 'custom' ? (
          <>
            <MonoText v="h1">Write your own prompt</MonoText>
            <MonoText v="p">It comes back each morning.</MonoText>
            <View style={{ height: 8 }} />
            <TextField variant="card" value={draft} onChangeText={setDraft} placeholder="What do you get if today stays clean?" accessibilityLabel="Your prompt" />
          </>
        ) : (
          <>
            <MonoText v="h1">{prompt}</MonoText>
            <Tap
              onPress={() => {
                setCustom(null);
                setPromptIndex((i) => (i + 1) % PROMPTS.length);
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
              <RerollGlyph size={15} />
              <MonoText v="ghost">Different prompt</MonoText>
            </Tap>
            <View style={{ height: 8 }} />
            <TextField
              variant="card"
              value={line}
              onChangeText={setLine}
              placeholder="Because I want to be at Maya’s recital on Friday with a clear head"
              accessibilityLabel="Today’s line"
            />
          </>
        )}
      </Sheet>
    </Screen>
  );
}
