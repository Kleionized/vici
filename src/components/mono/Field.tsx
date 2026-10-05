import { useState, type ReactNode, type Ref } from 'react';
import { Platform, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';

import { lhNormal, mono, sans } from '@/lib/theme';

/**
 * The five typed inputs the bundle draws (design-system §7.27):
 *
 * | variant | frame | box | type |
 * | --- | --- | --- | --- |
 * | `name`  | V3 Q24 Name | 60 tall, r18, `#1E1E1E`, padding 0 22, gap 2 | 17/400, the 2×24 bar before the placeholder |
 * | `sheet` | Sheet Edit Name | 60 tall, r18, `#1E1E1E`, padding 0 20 | 18/700 |
 * | `card`  | Change Pledge Sheet | min 100, r20, `#1E1E1E`, padding 20 22 | 20/700/29, grows |
 * | `note`  | SOS Afterward | min 150, r22, `#1E1E1E`, padding 22 24 | 20/400/30, grows |
 * | `bare`  | Night 3 Reflection | no box | 22/400/34, grows |
 *
 * Every one is a real `TextInput`: the value is ink, the placeholder `#9B968E`
 * (CRITIC C9), the caret the platform's in ink. The frames' drawn caret bars
 * are a static frame's stand-in for focus; only `name` keeps its bar, because
 * its frame draws the bar *before* the placeholder and the bar's 2pt slot is
 * what puts the placeholder at x 50 — it shows while the field is focused and
 * empty (the native caret is hidden then), and keeps its slot once typed so
 * nothing shifts.
 *
 * Unframed screens get two more knobs: `multiline` grows a one-line field
 * (`sheet` → the Life Map answer, routes.md §4.4) from 60 tall, its first line
 * where the single line sat; `accessory` puts a control at the box's right
 * (the Life Map's 48 "+" disc). A caller's `onContentSizeChange` runs after
 * the field's own growth, never instead of it.
 */
export type FieldVariant = 'name' | 'sheet' | 'card' | 'note' | 'bare';

const TYPE: Record<FieldVariant, TextStyle> = {
  name: { ...sans('400'), fontSize: 17, lineHeight: lhNormal(17) },
  sheet: { ...sans('700'), fontSize: 18, lineHeight: lhNormal(18) },
  card: { ...sans('700'), fontSize: 20, lineHeight: 29 },
  note: { ...sans('400'), fontSize: 20, lineHeight: 30 },
  bare: { ...sans('400'), fontSize: 22, lineHeight: 34 },
};

const BOX: Record<FieldVariant, ViewStyle> = {
  name: { height: 60, borderRadius: 18, backgroundColor: mono.card, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 2 },
  sheet: { height: 60, borderRadius: 18, backgroundColor: mono.card, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  card: { minHeight: 100, borderRadius: 20, backgroundColor: mono.card, paddingVertical: 20, paddingHorizontal: 22 },
  note: { minHeight: 150, borderRadius: 22, backgroundColor: mono.card, paddingVertical: 22, paddingHorizontal: 24 },
  bare: {},
};

const MULTILINE: Record<FieldVariant, boolean> = { name: false, sheet: false, card: true, note: true, bare: true };
/** The one-line boxes are 60 tall; grown, they keep that line's place. */
const ROW_H = 60;

/** No focus ring, an ink caret, and — on a textarea — no resize grip or scrollbar. */
const webInput = (caret: boolean) =>
  Platform.OS === 'web'
    ? ({ outlineStyle: 'none', caretColor: caret ? mono.ink : 'transparent', overflow: 'hidden' } as unknown as TextStyle)
    : null;

export function TextField({
  variant = 'name',
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
  ref,
  onFocus,
  onBlur,
  maxFontSizeMultiplier = 1.3,
  multiline: multilineProp,
  accessory,
  onContentSizeChange,
  ...rest
}: Omit<TextInputProps, 'style'> & {
  variant?: FieldVariant;
  /** a control inside the box, after the text (one-line variants) */
  accessory?: ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  /** the box */
  style?: StyleProp<ViewStyle>;
  /** the text — e.g. a frame that sets the run's colour or size differently */
  inputStyle?: StyleProp<TextStyle>;
  ref?: Ref<TextInput>;
}) {
  const [focused, setFocused] = useState(false);
  const multiline = multilineProp ?? MULTILINE[variant];
  const type = TYPE[variant];
  const lh = type.lineHeight as number;
  // a one-line variant asked to grow: a 60 minimum, the first line where the single one sat
  const grownRow = multiline && !MULTILINE[variant];
  // A growing field: one line box per line, as the frame's div grows.
  const [contentH, setContentH] = useState(lh);
  const empty = value.length === 0;
  const bar = variant === 'name';
  const caret = !(bar && empty);

  const input = (
    <TextInput
      ref={ref}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={mono.mute}
      selectionColor={mono.ink}
      cursorColor={mono.ink}
      caretHidden={!caret}
      keyboardAppearance="dark"
      underlineColorAndroid="transparent"
      multiline={multiline}
      scrollEnabled={multiline ? false : undefined}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...rest}
      onContentSizeChange={(e) => {
        if (multiline) setContentH(Math.max(lh, Math.ceil(e.nativeEvent.contentSize.height)));
        onContentSizeChange?.(e);
      }}
      style={[
        type,
        { color: mono.ink, padding: 0, margin: 0 },
        multiline ? { height: contentH, textAlignVertical: 'top' } : { flex: 1, height: '100%' },
        grownRow ? { flex: 1 } : null,
        webInput(caret),
        inputStyle,
      ]}
    />
  );

  return (
    <View
      style={[
        BOX[variant],
        grownRow ? { height: 'auto', minHeight: ROW_H, paddingVertical: (ROW_H - lh) / 2, alignItems: 'flex-start' } : null,
        style,
      ]}>
      {bar ? (
        <View
          style={{
            width: 2,
            height: 24,
            borderRadius: 1,
            backgroundColor: mono.ink,
            opacity: empty && focused ? 1 : 0,
            marginTop: grownRow ? (lh - 24) / 2 : 0,
          }}
        />
      ) : null}
      {input}
      {accessory}
    </View>
  );
}
