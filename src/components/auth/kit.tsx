/**
 * Auth kit — the pieces the auth boards share, on the `Vici Overhaul` kit.
 *
 * `02 · Login` and `02B · Welcome Back` are one flat stack on the ground: a
 * 104 white laurel at 150, a centred 26/33 title and 15/24 paragraph at 284,
 * three 58/29 pills and an "or" rule at 436, and a footer link and a caption
 * anchored 108 and 64 off the bottom edge. The two frames differ in four
 * strings, so they are one component with a variant (`AuthDoor`).
 *
 * The boards behind the doors — the address step, the password step, the
 * verification code, Save your progress, Create account — have no frame in
 * this drop either. They take the vocabulary of the screen family they sit
 * between (auth-funnel §7.2): a door that offers ways in is drawn as the Login
 * stack (`AuthBoard`); a board that asks for something typed is drawn as
 * `03 · Name` (`AuthSurface` — the nav chevron, a left-aligned 26/33 title,
 * 15/22 mute lines, the 60/18 name field, the primary pill). Their copy and
 * their behaviour are the app's own.
 *
 * Children of `Screen` are laid out in canvas coordinates (y measured from
 * the canvas's top, status bar included — D009).
 */

import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { Platform, Text, useWindowDimensions, View, type ScrollView, type TextInputProps, type TextStyle } from 'react-native';

import {
  Apple,
  CloseX,
  Google,
  LaurelMark,
  MonoText,
  NavBar,
  PrimaryButton,
  Screen,
  ScrollRegion,
  Tap,
  TextField,
  useCanvasTop,
} from '@/components/mono';
import { lhNormal, mono, ring, sans } from '@/lib/theme';

/** The frame's height: the doors are laid out for 852 and scroll on a shorter phone (D320). */
const FRAME_H = 852;
/** The safe-area top in canvas coordinates — nothing on a door is drawn above it. */
const STATUS = 54;
/** The nav row's bottom: the typed boards' content scrolls below it. */
const NAV_BOTTOM = 100;
/** The door's last control ends at 672 (the email pill, 614 + 58). */
const CONTROLS_END = 672;
/** The footer's top off the bottom edge: `bottom 108` + its 18 line. */
const FOOTER_TOP_OFF = 108 + 18;
/** What a message keeps clear above and below it — the stack's own gap. */
const MESSAGE_GAP = 12;

/**
 * Native has no `text-wrap: pretty`; Login's paragraph is fixed copy whose
 * greedy wrap at 393 takes "and" up to the first line, so the canvas's break
 * is written in there (D332). Web balances it itself.
 */
function usePretty(text: string, canvas: string) {
  const { width } = useWindowDimensions();
  return Platform.OS !== 'web' && width >= 393 && canvas.replace(/\n/g, ' ') === text ? canvas : text;
}

// ── the door ─────────────────────────────────────────────────────────

/**
 * A provider or email pill (Login): 58 tall, r29, a glyph and a 17/700 label
 * 10 apart. `ink` is Apple's (ink fill, `#111111` label); `card` the other two
 * (`#1E1E1E` under the 1.5 line ring, ink label).
 */
export function AuthPill({
  label,
  kind = 'card',
  icon,
  onPress,
  disabled,
}: {
  label: string;
  kind?: 'ink' | 'card';
  icon?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const ink = kind === 'ink';
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      label={label}
      style={{
        height: 58,
        borderRadius: 29,
        backgroundColor: ink ? mono.ink : mono.card,
        boxShadow: ink ? undefined : ring.outline,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: disabled ? 0.38 : 1,
      }}>
      {icon}
      <MonoText v="authButton" wrap="nowrap" color={ink ? mono.onInk : mono.ink}>
        {label}
      </MonoText>
    </Tap>
  );
}

/** The "or" between the providers and email: two 1pt line rules either side of 13/700 mute, `padding 2 0`, gap 12. */
export function AuthOr() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 2 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: mono.line }} />
      <MonoText v="caps">or</MonoText>
      <View style={{ flex: 1, height: 1, backgroundColor: mono.line }} />
    </View>
  );
}

/**
 * The door's composition (Login, Welcome Back, and the undrawn Save your
 * progress gate): the laurel at 150, the title and paragraph at 284, the
 * controls at 436, the message in the gap under them, and the footer link and
 * the caption bottom-anchored.
 *
 * Off 852 the board keeps the frame's height and scrolls (D320): on a 667
 * phone the four controls are all on the first screen and the footer is
 * under them, never across them; on a taller one the footer and caption stay
 * on the bottom edge as drawn.
 *
 * The message (no frame draws one) sits in the 54 the frame leaves between
 * the email pill and the footer. A refusal runs to two lines there (the mock's
 * and most of Clerk's do), so the board keeps 12 clear on either side and
 * grows by what the line needs past that — the footer and caption move down
 * with the bottom edge, never under the text. Where that gap is below the
 * fold (a 667 phone), the board scrolls the message into view when it
 * appears: it answers a tap on a pill a screen above it.
 */
export function AuthBoard({
  title,
  subtitle,
  subtitleCanvas,
  controls,
  message,
  footer,
  caption,
  onBack,
}: {
  title: string;
  subtitle: string;
  /** the subtitle with the canvas's own line break, for native (D332) */
  subtitleCanvas?: string;
  controls: ReactNode;
  message?: ReactNode;
  footer?: { text: string; link: string; onPress: () => void };
  caption: ReactNode;
  /** No frame draws a back here; a pushed door must not strand you (see the call sites). */
  onBack?: () => void;
}) {
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const sub = usePretty(subtitle, subtitleCanvas ?? subtitle);
  const scroller = useRef<ScrollView>(null);
  const [messageH, setMessageH] = useState(0);
  const frameH = Math.max(height - canvasTop, FRAME_H);
  const room = frameH - FOOTER_TOP_OFF - CONTROLS_END;
  const grow = messageH > 0 ? Math.max(0, Math.ceil(messageH + 2 * MESSAGE_GAP - room)) : 0;
  const h = frameH + grow;
  useEffect(() => {
    if (!messageH) return;
    const messageBottom = CONTROLS_END + Math.max(MESSAGE_GAP, (room - messageH) / 2) + messageH;
    // the window's bottom edge in canvas y is `height − canvasTop`
    const below = Math.ceil(messageBottom + MESSAGE_GAP - (height - canvasTop));
    if (below > 0) scroller.current?.scrollTo({ y: below, animated: true });
  }, [messageH, room, height, canvasTop]);
  return (
    <Screen>
      {/* React 19 passes `ref` as a prop; ScrollRegion spreads it onto its ScrollView */}
      <ScrollRegion {...({ ref: scroller } as { ref?: Ref<ScrollView> })} top={STATUS} contentStyle={{ height: h - STATUS }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: -STATUS, height: h }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 150, alignItems: 'center' }}>
            <LaurelMark size={104} />
          </View>
          <View style={{ position: 'absolute', left: 24, right: 24, top: 284, gap: 12, alignItems: 'center' }}>
            <MonoText v="h1" center accessibilityRole="header" style={{ alignSelf: 'stretch' }}>
              {title}
            </MonoText>
            <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
              {sub}
            </MonoText>
          </View>
          <View style={{ position: 'absolute', left: 24, right: 24, top: 436, gap: 14 }}>{controls}</View>
          {/* Nothing is drawn between the last control (672) and the footer
              (726); a refusal has to say so somewhere, and this is the gap. */}
          {message ? (
            <View style={{ position: 'absolute', left: 24, right: 24, top: CONTROLS_END, bottom: FOOTER_TOP_OFF, justifyContent: 'center' }}>
              <View onLayout={(e) => setMessageH(Math.round(e.nativeEvent.layout.height))}>{message}</View>
            </View>
          ) : null}
          {footer ? (
            // The canvas puts the pointer on the bold run; the whole row is the
            // target here, so the finger does not have to find six letters.
            <Tap onPress={footer.onPress} hitSlop={{ top: 12, bottom: 12 }} style={{ position: 'absolute', left: 0, right: 0, bottom: 108 }}>
              <Text maxFontSizeMultiplier={1.3} style={{ ...sans('400'), fontSize: 15, lineHeight: lhNormal(15), color: mono.sub, textAlign: 'center' }}>
                {footer.text}
                <Text style={{ ...sans('700'), color: mono.ink }}>{footer.link}</Text>
              </Text>
            </Tap>
          ) : null}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 64 }}>{caption}</View>
        </View>
      </ScrollRegion>
      {onBack ? <NavBar left="back" right="empty" onBack={onBack} /> : null}
    </Screen>
  );
}

/** The two doors, and the four strings that separate them. */
export type AuthDoorVariant = 'new' | 'returning';

const DOOR = {
  new: {
    title: 'Welcome to VICI.',
    subtitle: 'Sign in or create an account to keep your plan and progress.',
    subtitleCanvas: 'Sign in or create an account to keep your plan\nand progress.',
    email: 'Continue with email',
    footer: 'Already have an account? ',
    footerLink: 'Sign in',
  },
  returning: {
    title: 'Welcome back.',
    subtitle: 'Sign in to pick up where you left off.',
    subtitleCanvas: 'Sign in to pick up where you left off.',
    email: 'Sign in with email',
    footer: 'New here? ',
    footerLink: 'Create an account',
  },
} as const;

/**
 * `02 · Login` and `02B · Welcome Back`. Every control the canvas marks
 * `cursor:pointer` is one: the three pills and the footer link. "Terms ·
 * Privacy" carries none and is drawn as the caption it is (D013/D021).
 */
export function AuthDoor({
  variant,
  onApple,
  onGoogle,
  onEmail,
  onFooter,
  onBack,
  loading,
  message,
}: {
  variant: AuthDoorVariant;
  onApple: () => void;
  onGoogle: () => void;
  onEmail: () => void;
  onFooter: () => void;
  /** The canvas draws no Back here; see the call site for when one is shown. */
  onBack?: () => void;
  loading?: boolean;
  message?: ReactNode;
}) {
  const copy = DOOR[variant];
  return (
    <AuthBoard
      title={copy.title}
      subtitle={copy.subtitle}
      subtitleCanvas={copy.subtitleCanvas}
      onBack={onBack}
      controls={
        <>
          <AuthPill kind="ink" icon={<Apple />} label="Continue with Apple" onPress={onApple} disabled={loading} />
          <AuthPill icon={<Google />} label="Continue with Google" onPress={onGoogle} disabled={loading} />
          <AuthOr />
          <AuthPill label={copy.email} onPress={onEmail} />
        </>
      }
      message={message}
      footer={{ text: copy.footer, link: copy.footerLink, onPress: onFooter }}
      caption={
        <MonoText v="legal" center>
          Terms · Privacy
        </MonoText>
      }
    />
  );
}

// ── the typed boards ─────────────────────────────────────────────────

/**
 * The typed boards' shell, after `03 · Name`: the nav row's back chevron, and
 * under it a column from the stack's 136 (left/right 24, gap 14) that scrolls
 * when the keyboard or a short phone leaves it less room than it needs.
 */
export function AuthSurface({ children, onBack }: { children: ReactNode; onBack?: () => void }) {
  return (
    <Screen>
      <NavBar left={onBack ? 'back' : 'empty'} right="empty" onBack={onBack} />
      <ScrollRegion top={NAV_BOTTOM} contentStyle={{ paddingHorizontal: 24, paddingTop: 136 - NAV_BOTTOM, paddingBottom: 48 }}>
        <View style={{ gap: 14 }}>{children}</View>
      </ScrollRegion>
    </Screen>
  );
}

/** A typed board's title: the question template's 26/33, left-aligned. */
export function AuthTitle({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <MonoText v="h1" center={center} accessibilityRole="header">
      {children}
    </MonoText>
  );
}

/** A typed board's quieter line: Name's 15/22 `#9B968E`. */
export function AuthSub({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <MonoText v="pTight" color={mono.mute} center={center}>
      {children}
    </MonoText>
  );
}

/**
 * A labelled field: the label in the sub line's 15/22 mute, 8 above Name's
 * 60/18 `#1E1E1E` field (17/400 ink, `#9B968E` placeholder, the 2×24 bar
 * standing in for the caret while it is focused and empty).
 */
export function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  onClear,
  ...props
}: Pick<
  TextInputProps,
  'secureTextEntry' | 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'textContentType' | 'returnKeyType' | 'onSubmitEditing' | 'autoFocus'
> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /** a clear-✕ at the field's right while it holds anything */
  onClear?: () => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      {label ? <AuthSub>{label}</AuthSub> : null}
      <TextField
        variant="name"
        {...props}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={label ?? placeholder}
        accessory={
          onClear && value.length ? (
            <Tap label="Clear email" onPress={onClear} hitSlop={16} style={{ width: 18, height: 18, marginLeft: 12 }}>
              <CloseX color={mono.mute} />
            </Tap>
          ) : undefined
        }
      />
    </View>
  );
}

/** The primary pill, in flow under a form (so the keyboard never covers it). */
export function AuthButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <PrimaryButton inline label={label} onPress={onPress} disabled={disabled} />;
}

/** A quiet text action under a primary (the kit's ghost link, in flow): 15/400 mute, centred. */
export function AuthGhost({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Tap onPress={onPress} hitSlop={{ top: 8, bottom: 8 }} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
      <MonoText v="ghost" center>
        {label}
      </MonoText>
    </Tap>
  );
}

/**
 * The one line an auth board says back. No frame draws a failed sign-in, and
 * the system has no hue left for one (D330): a refusal is 14/700 ink, a
 * notice 14/400 mute, both on a 20 line, centred — balanced on web, as the
 * frames balance their centred copy, so a two-line refusal does not end on
 * one stranded word.
 */
const BALANCE = Platform.OS === 'web' ? ({ textWrap: 'balance' } as unknown as TextStyle) : null;
export function AuthMessage({ error, notice }: { error: string | null; notice: string | null }) {
  const message = error || notice;
  if (!message) return null;
  return (
    <Text
      selectable
      accessibilityLiveRegion="polite"
      maxFontSizeMultiplier={1.3}
      style={[{ ...sans(error ? '700' : '400'), fontSize: 14, lineHeight: 20, color: error ? mono.ink : mono.mute, textAlign: 'center' }, BALANCE]}>
      {message}
    </Text>
  );
}

/** The small print under the last control, in Login's caption style (12/700, ls 0.4, mute), links underlined. */
export function AuthLegal() {
  const u = { textDecorationLine: 'underline' } as const;
  return (
    <MonoText v="legal" center wrap="balance">
      By continuing, you agree to our <Text style={u}>terms of service</Text> and <Text style={u}>privacy policy</Text>.
    </MonoText>
  );
}

/** The laurel, centred, at a canvas top — for the address step and the gate. */
export function AuthLaurel({ size = 104 }: { size?: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <LaurelMark size={size} />
    </View>
  );
}
