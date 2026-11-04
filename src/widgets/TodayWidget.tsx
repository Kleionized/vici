/**
 * The home-screen and lock-screen widgets (iOS, via `expo-widgets`).
 *
 * Each layout function carries the `'widget'` directive: Babel turns it into a
 * string at build time and the widget extension runs it in its own small JS
 * runtime, where the SwiftUI views (`VStack`, `Text`, …) and modifiers (`font`,
 * `padding`, …) are globals. So a layout may use nothing from this module's
 * scope — no imports, no constants — only its props, its environment and
 * those globals. The `declare const`s below give TypeScript their types without
 * importing `@expo/ui` into the app bundle (it is iOS-only and the app also
 * builds for Android and the web).
 *
 * Discretion first: a widget sits on a home screen anyone can see. No widget
 * names the habit, and unless "Hide sensitive previews" is switched off the
 * pledge is not shown — only the day count, the score and a neutral line.
 */

import type * as UI from '@expo/ui/swift-ui';
import type * as M from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

// the SwiftUI views and modifiers the widget runtime provides
declare const VStack: typeof UI.VStack;
declare const HStack: typeof UI.HStack;
declare const Text: typeof UI.Text;
declare const Spacer: typeof UI.Spacer;
declare const font: typeof M.font;
declare const foregroundStyle: typeof M.foregroundStyle;
declare const padding: typeof M.padding;
declare const containerBackground: typeof M.containerBackground;
declare const widgetURL: typeof M.widgetURL;
declare const lineLimit: typeof M.lineLimit;
declare const minimumScaleFactor: typeof M.minimumScaleFactor;
declare const frame: typeof M.frame;
declare const kerning: typeof M.kerning;

export type TodayWidgetProps = {
  /** the account's day number */
  day: number;
  /** "1,240" */
  score: string;
  /** "+6 today", or '' */
  delta: string;
  /** today's one action, or '' */
  task: string;
  /** the standing pledge, or '' when discretion hides it */
  pledge: string;
  /** "Night check-in · 10:30 PM", or '' once both are done */
  next: string;
  /** whether the person has opened the app at all yet (false = a placeholder) */
  ready: boolean;
};

const TodayLayout = (props: TodayWidgetProps, env: WidgetEnvironment) => {
  'widget';
  const ink = '#F2F0EC';
  const mute = '#9B968E';
  const sub = '#B5B0A8';
  const ground = '#0D0D0D';
  const family = env.widgetFamily;

  if (family === 'accessoryInline') {
    return <Text modifiers={[widgetURL('tideline:///today')]}>{props.ready ? `Day ${props.day}` : 'Vici'}</Text>;
  }
  if (family === 'accessoryCircular') {
    return (
      <VStack spacing={0} modifiers={[widgetURL('tideline:///today')]}>
        <Text modifiers={[font({ size: 10, weight: 'semibold' }), kerning(0.6)]}>DAY</Text>
        <Text modifiers={[font({ size: 22, weight: 'bold', design: 'rounded' }), minimumScaleFactor(0.6)]}>{props.ready ? String(props.day) : '–'}</Text>
      </VStack>
    );
  }
  if (family === 'accessoryRectangular') {
    return (
      <VStack alignment="leading" spacing={2} modifiers={[widgetURL('tideline:///today')]}>
        <Text modifiers={[font({ size: 15, weight: 'bold' })]}>{props.ready ? `Day ${props.day} · ${props.score}` : 'Vici'}</Text>
        <Text modifiers={[font({ size: 12 }), lineLimit(2)]}>{props.next || props.task || 'One day at a time.'}</Text>
      </VStack>
    );
  }

  const small = family === 'systemSmall';
  return (
    <VStack alignment="leading" spacing={small ? 4 : 6} modifiers={[containerBackground(ground, 'widget'), widgetURL('tideline:///today')]}>
      <HStack>
        <Text modifiers={[font({ size: 11, weight: 'bold' }), kerning(1.2), foregroundStyle(mute)]}>{props.ready ? `DAY ${props.day}` : 'VICI'}</Text>
        <Spacer />
        {props.delta ? <Text modifiers={[font({ size: 11, weight: 'bold' }), foregroundStyle(sub)]}>{props.delta}</Text> : null}
      </HStack>
      <Text modifiers={[font({ size: small ? 34 : 38, weight: 'heavy', design: 'rounded' }), foregroundStyle(ink), minimumScaleFactor(0.6), lineLimit(1)]}>{props.ready ? props.score : '—'}</Text>
      <Spacer />
      {small ? (
        <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(sub), lineLimit(3)]}>{props.next || props.task || 'One day at a time.'}</Text>
      ) : (
        <VStack alignment="leading" spacing={4}>
          <Text modifiers={[font({ size: 11, weight: 'bold' }), kerning(1.2), foregroundStyle(mute)]}>{props.pledge ? 'YOUR PLEDGE' : 'TODAY'}</Text>
          <Text modifiers={[font({ size: 14, weight: 'semibold' }), foregroundStyle(ink), lineLimit(2)]}>{props.pledge || props.task || 'One day at a time.'}</Text>
          {props.next ? <Text modifiers={[font({ size: 12 }), foregroundStyle(sub), lineLimit(1)]}>{props.next}</Text> : null}
        </VStack>
      )}
    </VStack>
  );
};

export type SosWidgetProps = { ready: boolean };

/**
 * The one-tap door into the interrupt. Its words are neutral on purpose — it
 * is on a home screen — and the whole surface opens the first ninety seconds.
 */
const SosLayout = (props: SosWidgetProps, env: WidgetEnvironment) => {
  'widget';
  const ink = '#F2F0EC';
  const sub = '#B5B0A8';
  if (env.widgetFamily === 'accessoryCircular') {
    return (
      <VStack spacing={0} modifiers={[widgetURL('tideline:///urge')]}>
        <Text modifiers={[font({ size: 16, weight: 'heavy', design: 'rounded' })]}>SOS</Text>
      </VStack>
    );
  }
  return (
    <VStack alignment="leading" spacing={6} modifiers={[containerBackground('#0D0D0D', 'widget'), widgetURL('tideline:///urge'), frame({ maxWidth: 10000, maxHeight: 10000, alignment: 'topLeading' }), padding({ all: 2 })]}>
      <Text modifiers={[font({ size: 28, weight: 'heavy', design: 'rounded' }), foregroundStyle(ink)]}>SOS</Text>
      <Spacer />
      <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(sub), lineLimit(3)]}>{props.ready ? 'Ninety seconds. Ride the next one out.' : 'Open once to set up.'}</Text>
    </VStack>
  );
};

/** Names match `expo-widgets` → `widgets[].name` in app.json. */
export const todayWidget = createWidget<TodayWidgetProps>('TodayWidget', TodayLayout);
export const sosWidget = createWidget<SosWidgetProps>('SosWidget', SosLayout);
