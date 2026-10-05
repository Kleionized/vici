import { Platform, TextInput, View, type TextStyle } from 'react-native';

import { Check, Hero, MonoText, Pencil, Quote, Tap } from '@/components/mono';
import type { LessonContent, LessonOption, LessonPage, OptionDensity } from '@/content/lessons';
import { lhNormal, mono, ring, sans } from '@/lib/theme';

import { LT } from './LessonText';
import { LessonVizCard } from './LessonViz';

/**
 * One renderer per page kind (lessons.md §3.4–3.12). Every vertical gap is the
 * frame's stated `margin-top` (§3.3) — the band has no flex gap — and the
 * reading pages are left-aligned; only the cover, the quotes and the complete
 * page centre their runs.
 */

/** cover — hero · `Lesson n` · title (no header label; `Begin`) */
function Cover({ lesson }: { lesson: LessonContent }) {
  return (
    <>
      <Hero mode="box" id={lesson.hero} />
      <LT r="label" center style={{ marginTop: 36 }}>{`Lesson ${lesson.n}`}</LT>
      <LT r="display" center style={{ marginTop: 12 }}>
        {lesson.title}
      </LT>
    </>
  );
}

function QuotePage({ text, by }: { text: string; by: string }) {
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Quote />
      </View>
      <LT r="title" center style={{ marginTop: 24 }}>
        {text}
      </LT>
      <LT r="label" center style={{ marginTop: 18 }}>
        {by}
      </LT>
    </>
  );
}

/** paragraphs: `first` above the first (28 after a title or viz, 36 after a hero, 0 first), 22 between */
function Body({ pieces, first, center }: { pieces: string[]; first: number; center?: boolean }) {
  return (
    <>
      {pieces.map((p, i) => (
        <LT key={i} r="body" center={center} style={{ marginTop: i === 0 ? first : 22 }}>
          {p}
        </LT>
      ))}
    </>
  );
}

function Read({ page }: { page: Extract<LessonPage, { k: 'read' }> }) {
  const lead = page.hero ? 36 : page.viz ? 28 : 0;
  return (
    <>
      {page.hero ? <Hero mode="box" id={page.hero} /> : page.viz ? <LessonVizCard viz={page.viz} /> : null}
      {page.part ? (
        <>
          <LT r="label" style={{ marginTop: lead }}>{`Part ${page.part}`}</LT>
          <LT r="title" style={{ marginTop: 12 }}>
            {page.title ?? ''}
          </LT>
        </>
      ) : null}
      <Body pieces={page.body} first={page.part ? 28 : lead} />
    </>
  );
}

/** option rows by count (lessons.md §3.7): min height, vertical padding, list gap, list margin */
const DENSITY: Record<OptionDensity, { h: number; p: number; gap: number; mt: number }> = {
  regular: { h: 48, p: 13, gap: 8, mt: 20 },
  seven: { h: 44, p: 11, gap: 6, mt: 20 },
  eight: { h: 44, p: 11, gap: 5, mt: 16 },
};

/** the option letter: 12/700/16 `#B5B0A8` (the best-answer letter is 13/700 at normal leading) */
const markLetter: TextStyle = { ...sans('700'), fontSize: 12, lineHeight: 16, color: mono.sub };

/**
 * One answer row. Every question frame draws the rows unselected; the chosen
 * one is the kit's selection idiom (D322): the row fills with ink, its text
 * turns `#111111`, and the mark becomes a filled `#111111` disc carrying an ink
 * letter — same geometry, so nothing moves.
 */
function OptionRow({
  option,
  multi,
  density,
  on,
  onPress,
}: {
  option: LessonOption;
  multi: boolean;
  density: OptionDensity;
  on: boolean;
  onPress: () => void;
}) {
  const d = DENSITY[density];
  return (
    <Tap
      onPress={onPress}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      aria-checked={on}
      label={`${option.L}. ${option.t}`}
      style={{
        minHeight: d.h,
        borderRadius: d.h / 2,
        backgroundColor: on ? mono.ink : mono.card,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: d.p,
        paddingBottom: d.p,
        paddingLeft: 14,
        paddingRight: 16,
      }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: multi ? 7 : 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: on ? mono.onInk : undefined,
          boxShadow: on ? undefined : ring.insetMute,
        }}>
        <MonoText style={[markLetter, on ? { color: mono.ink } : null]} wrap="nowrap">
          {option.L}
        </MonoText>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <LT r="optQ" color={on ? mono.onInk : undefined}>
          {option.t}
        </LT>
      </View>
    </Tap>
  );
}

function Question({
  page,
  chosen,
  onChoose,
}: {
  page: Extract<LessonPage, { k: 'question' }>;
  chosen: readonly string[];
  onChoose: (letter: string) => void;
}) {
  const d = DENSITY[page.density];
  return (
    <>
      <LT r="label">Question</LT>
      <LT r="title" style={{ marginTop: 12 }}>
        {page.prompt}
      </LT>
      <LT r="small" style={{ marginTop: 8 }}>
        {page.instr}
      </LT>
      <View accessibilityRole={page.multi ? undefined : 'radiogroup'} style={{ gap: d.gap, marginTop: d.mt }}>
        {page.options.map((o) => (
          <OptionRow
            key={o.L}
            option={o}
            multi={page.multi}
            density={page.density}
            on={chosen.includes(o.L)}
            onPress={() => onChoose(o.L)}
          />
        ))}
      </View>
    </>
  );
}

/** "Best answer(s)" — the designated answer, not the reader's choice */
function Answer({ page }: { page: Extract<LessonPage, { k: 'answer' }> }) {
  return (
    <>
      <LT r="label">{page.best.length > 1 ? 'Best answers' : 'Best answer'}</LT>
      <View style={{ marginTop: 16 }}>
        {page.best.map((b, i) => (
          <View
            key={b.L}
            style={{
              marginTop: i ? 10 : 0,
              borderRadius: 18,
              backgroundColor: mono.card,
              paddingVertical: 16,
              paddingHorizontal: 18,
              flexDirection: 'row',
              gap: 14,
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: page.multi ? 8 : 14,
                backgroundColor: mono.ink,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MonoText wrap="nowrap" style={{ ...sans('700'), fontSize: 13, lineHeight: lhNormal(13), color: mono.onInk }}>
                {b.L}
              </MonoText>
            </View>
            <View style={{ flex: 1, minWidth: 0, paddingTop: 3 }}>
              <LT r="fbT">{b.t}</LT>
            </View>
          </View>
        ))}
      </View>
      <Body pieces={page.body} first={28} />
    </>
  );
}

/** No focus ring, an ink caret (web); native takes `selectionColor`. */
const webInput = Platform.OS === 'web' ? ({ outlineStyle: 'none', caretColor: mono.ink } as unknown as TextStyle) : null;

/**
 * The note field: a 48 pill with the inset line ring and the pencil, its
 * placeholder the frame's `Add a note (optional)` (16/22 `#9B968E`). Typed text
 * is ink (D322). One line, as drawn.
 */
function NoteField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View
      style={{
        marginTop: 32,
        height: 48,
        borderRadius: 24,
        boxShadow: ring.insetLine,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 20,
        flexShrink: 0,
      }}>
      <View style={{ flexShrink: 0 }}>
        <Pencil />
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Add a note (optional)"
        placeholderTextColor={mono.mute}
        selectionColor={mono.ink}
        cursorColor={mono.ink}
        keyboardAppearance="dark"
        returnKeyType="done"
        maxFontSizeMultiplier={1.3}
        accessibilityLabel="Add a note (optional)"
        style={[{ flex: 1, minWidth: 0, ...sans('400'), fontSize: 16, lineHeight: 22, color: mono.ink, padding: 0, height: 22 }, webInput]}
      />
    </View>
  );
}

function Reflect({ page, note, onNote }: { page: Extract<LessonPage, { k: 'reflect' }>; note: string; onNote: (v: string) => void }) {
  return (
    <>
      <LT r="label">After choosing</LT>
      <LT r="title" style={{ marginTop: 12 }}>
        {page.lead}
      </LT>
      <Body pieces={page.body} first={28} />
      <NoteField value={note} onChange={onNote} />
    </>
  );
}

/** `Today’s task` + the lesson title (+ the cover's hero again, where it fits) */
function Task({ page, title }: { page: Extract<LessonPage, { k: 'task' }>; title: string }) {
  return (
    <>
      {page.hero ? <Hero mode="box" id={page.hero} /> : null}
      <LT r="label" style={{ marginTop: page.hero ? 36 : 0 }}>
        Today’s task
      </LT>
      <LT r="title" style={{ marginTop: 12 }}>
        {title}
      </LT>
      <Body pieces={page.body} first={28} />
    </>
  );
}

/** the rest of the practice and the Done-when card */
function TaskEnd({ page }: { page: Extract<LessonPage, { k: 'taskEnd' }> }) {
  return (
    <>
      <Body pieces={page.body} first={0} />
      <View
        style={{
          marginTop: 28,
          borderRadius: 20,
          backgroundColor: mono.card,
          paddingVertical: 18,
          paddingHorizontal: 20,
          flexDirection: 'row',
          gap: 14,
          alignItems: 'flex-start',
          flexShrink: 0,
        }}>
        <View
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Check size={12} />
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <LT r="label">Done when</LT>
          <LT r="cardT">{page.done}</LT>
        </View>
      </View>
    </>
  );
}

function Complete({ line }: { line: string }) {
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View
          style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Check size={34} />
        </View>
      </View>
      <LT r="display" center style={{ marginTop: 36 }}>
        Lesson complete.
      </LT>
      <LT r="body" center style={{ marginTop: 14 }}>
        {line}
      </LT>
    </>
  );
}

export function LessonPageView({
  lesson,
  page,
  chosen,
  onChoose,
  note,
  onNote,
}: {
  lesson: LessonContent;
  page: LessonPage;
  chosen: readonly string[];
  onChoose: (letter: string) => void;
  note: string;
  onNote: (v: string) => void;
}) {
  switch (page.k) {
    case 'cover':
      return <Cover lesson={lesson} />;
    case 'quote':
      return <QuotePage text={page.text} by={page.by} />;
    case 'read':
      return <Read page={page} />;
    case 'question':
      return <Question page={page} chosen={chosen} onChoose={onChoose} />;
    case 'answer':
      return <Answer page={page} />;
    case 'reflect':
      return <Reflect page={page} note={note} onNote={onNote} />;
    case 'task':
      return <Task page={page} title={lesson.title} />;
    case 'taskEnd':
      return <TaskEnd page={page} />;
    case 'complete':
      return <Complete line={page.line} />;
  }
}
