import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, TextInput, View, useWindowDimensions } from 'react-native';

import { RerollGlyph } from '@/components/day/kit';
import { AppText, PressScale } from '@/components/ui';
import { useCreateJournalEntry } from '@/lib/backend';
import { getJSON, setJSON } from '@/lib/storage';
import { fonts, sans } from '@/lib/theme';

/**
 * 21C · 21C2 — the sentence journal, and the board where you write the prompt.
 *
 * One line a day, against a prompt you can swap if the one offered does not
 * fit. Deliberately a single sentence: a blank page asks for an essay and gets
 * nothing, where a single line gets written. It arrives as a sheet over the
 * page you were on, so the dim and the skeleton behind it are drawn here.
 *
 * The two frames share their shell, scrim, sheet and grabber byte for byte —
 * only the sheet's body swaps — so both are this one screen in two modes.
 */

const PROMPTS = [
  'Why are you choosing to abstain today?',
  'What would today look like if it went well?',
  'What are you protecting by keeping today clean?',
  'Who benefits from the version of you that shows up today?',
  'What did the last good evening have in it?',
];

/**
 * Where the sheet's top edge sits, and where the bottom-most control's bottom
 * edge lands in it. The journal board's is the secondary pill at 422; the
 * custom board's is the back link at ~362 — so it is per-mode, not a constant.
 */
const SHEET_TOP = 320;
const FLOOR = { journal: 422, custom: 362 } as const;

/** Where a written-in prompt is kept so it comes back each morning. */
const CUSTOM_PROMPT_KEY = 'tideline.affirmation.prompt';

export default function Affirmation() {
  const router = useRouter();
  const createJournalEntry = useCreateJournalEntry();
  const [promptIndex, setPromptIndex] = useState(0);
  const [mode, setMode] = useState<'journal' | 'custom'>('journal');
  const [custom, setCustom] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [line, setLine] = useState('');
  const [saving, setSaving] = useState(false);
  const [keyboard, setKeyboard] = useState(0);
  const screenH = useWindowDimensions().height;

  // The sheet only rides up once the keyboard eats into the room under the
  // pill, so with the keyboard down it sits exactly where the canvas puts it.
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) => setKeyboard(e.endCoordinates.height));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboard(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // A prompt written once comes back — the board promises it will.
  useEffect(() => {
    void getJSON<string>(CUSTOM_PROMPT_KEY).then((stored) => {
      if (stored) setCustom(stored);
    });
  }, []);

  const prompt = custom ?? PROMPTS[promptIndex];
  const lift = Math.max(0, keyboard - Math.max(0, screenH - SHEET_TOP - FLOOR[mode]));
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  async function save() {
    if (!line.trim()) return close();
    setSaving(true);
    await createJournalEntry({ tag: 'Affirmation', title: prompt, body: line.trim() }).catch(() => {});
    setSaving(false);
    close();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />

      {/* the page underneath, reduced to its blocks — the sheet is what you read */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.45 }}>
        <View style={{ position: 'absolute', left: 12, right: 12, top: 164, height: 48, borderRadius: 12, backgroundColor: '#E8E7E1' }} />
        <View style={{ position: 'absolute', left: 36, right: 36, top: 228, height: 236, borderRadius: 16, backgroundColor: '#E8E7E1' }} />
        <View style={{ position: 'absolute', left: 12, right: 12, top: 544, height: 152, borderRadius: 14, backgroundColor: '#E8E7E1' }} />
      </View>

      <Pressable
        onPress={close}
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(38,37,30,0.42)' }}
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: SHEET_TOP - lift,
          bottom: 0,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          backgroundColor: '#F4F3F0',
          boxShadow: '0 -12px 36px rgba(20,19,16,0.22)',
        }}>
        <View style={{ position: 'absolute', left: '50%', marginLeft: -18, top: 10, width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)' }} />

        {mode === 'custom' ? (
          <CustomPrompt
            draft={draft}
            onDraft={setDraft}
            onUse={() => {
              const next = draft.trim();
              setCustom(next || null);
              void (next ? setJSON(CUSTOM_PROMPT_KEY, next) : Promise.resolve());
              setMode('journal');
            }}
            onBack={() => setMode('journal')}
          />
        ) : null}

        {mode === 'journal' ? (
          <>
        <AppText style={[sans('500'), { position: 'absolute', left: 24, right: 40, top: 44, fontSize: 22, lineHeight: 29, letterSpacing: -0.2, color: '#1D1C1A' }]}>
          {prompt}
        </AppText>

        <PressScale
          onPress={() => {
            setCustom(null);
            setPromptIndex((i) => (i + 1) % PROMPTS.length);
          }}
          accessibilityRole="button"
          hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
          style={{ position: 'absolute', left: 24, top: 112, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <RerollGlyph size={13} />
          <AppText style={[sans('500'), { fontSize: 13, color: '#8B8882' }]}>Different prompt</AppText>
        </PressScale>

        <View style={{ position: 'absolute', left: 16, right: 16, top: 148, height: 126, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
          <TextInput
            value={line}
            onChangeText={setLine}
            multiline
            placeholder="Because I want to be at Maya’s recital on Friday with a clear head"
            placeholderTextColor="rgba(139,136,130,0.7)"
            style={[
              { position: 'absolute', left: 18, right: 18, top: 16, height: 94, fontFamily: fonts.quote, fontSize: 17, lineHeight: 26, color: '#1D1C1A', padding: 0 },
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
            ]}
            selectionColor="#131313"
            cursorColor="#131313"
          />
        </View>

        <PressScale
          onPress={() => void save()}
          disabled={saving}
          accessibilityRole="button"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            top: 306,
            height: 52,
            minHeight: 52,
            borderRadius: 26,
            backgroundColor: '#131313',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: saving ? 0.5 : 1,
          }}>
          <AppText style={[sans('600'), { fontSize: 17, color: '#FFFFFF' }]}>Save today’s line</AppText>
        </PressScale>

        {/* canvas 370 — a paper pill, ringed at 0.08 rather than the card's 0.06 */}
        <PressScale
          onPress={() => {
            setDraft(custom ?? '');
            setMode('custom');
          }}
          accessibilityRole="button"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            top: 370,
            height: 52,
            minHeight: 52,
            borderRadius: 26,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText style={[sans('600'), { fontSize: 15.5, color: '#1D1C1A' }]}>Write my own prompt</AppText>
        </PressScale>
          </>
        ) : null}
      </View>
    </View>
  );
}

/** 21C2 · the board where the prompt itself is written. */
function CustomPrompt({ draft, onDraft, onUse, onBack }: { draft: string; onDraft: (next: string) => void; onUse: () => void; onBack: () => void }) {
  return (
    <>
      <AppText style={[sans('500'), { position: 'absolute', left: 24, right: 40, top: 44, fontSize: 22, lineHeight: 29, letterSpacing: -0.2, color: '#1D1C1A' }]}>
        Write your own prompt
      </AppText>
      <AppText style={[sans('400'), { position: 'absolute', left: 24, right: 24, top: 80, fontSize: 13, color: '#8B8882' }]}>
        It’ll be waiting for you each morning.
      </AppText>

      <View style={{ position: 'absolute', left: 16, right: 16, top: 116, height: 126, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
        <TextInput
          value={draft}
          onChangeText={onDraft}
          multiline
          placeholder="What am I protecting today?"
          placeholderTextColor="rgba(139,136,130,0.7)"
          selectionColor="#131313"
          cursorColor="#131313"
          style={[
            // italic on this board only — the journal's own card is upright
            { position: 'absolute', left: 18, right: 18, top: 16, height: 94, fontFamily: fonts.quote, fontStyle: 'italic', fontSize: 17, lineHeight: 26, color: '#1D1C1A', padding: 0 },
            Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
          ]}
        />
      </View>

      <PressScale
        onPress={onUse}
        accessibilityRole="button"
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: 274,
          height: 52,
          minHeight: 52,
          borderRadius: 26,
          backgroundColor: '#131313',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText style={[sans('600'), { fontSize: 17, color: '#FFFFFF' }]}>Use this prompt</AppText>
      </PressScale>

      <PressScale
        onPress={onBack}
        accessibilityRole="button"
        hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 346, minHeight: 0, alignItems: 'center' }}>
        <AppText style={[sans('500'), { fontSize: 13.5, color: '#8B8882' }]}>Back to today’s prompt</AppText>
      </PressScale>
    </>
  );
}
