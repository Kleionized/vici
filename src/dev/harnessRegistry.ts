import { isValidElement, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import type { ScrollView } from 'react-native';

/**
 * What the Vici UI 2 capture harness can press and scroll (D35). A frame often
 * shows a board a few taps into a flow or partway down a page; a simulator
 * takes no taps from a script, so in a harness build (`EXPO_PUBLIC_HARNESS=1`,
 * development only) the kit's pressable registers its handler under its label
 * and `ScrollRegion` its scroll view, and `HarnessDriver` works the steps a
 * target lists through them. Everywhere else both hooks do nothing.
 */
export const HARNESS = __DEV__ && process.env.EXPO_PUBLIC_HARNESS === '1';

type Press = { id: number; fn: () => void };
const presses = new Map<string, Press[]>();
type Pages = { name?: string; pages?: number[]; horizontal?: boolean };
const scrolls: { id: number; ref: RefObject<ScrollView | null>; opts: RefObject<Pages> }[] = [];
let next = 0;

/** The words a control draws: its strings and its nested runs' strings. */
function words(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(words).join('');
  if (isValidElement(node)) return words((node.props as { children?: ReactNode }).children);
  return '';
}

/** Register a pressable under its accessibility label, or else the words it draws. */
export function useHarnessPress(label: string | undefined, children: ReactNode, onPress: (() => void) | undefined, disabled?: boolean | null) {
  const fn = useRef(onPress);
  useEffect(() => {
    fn.current = disabled ? undefined : onPress;
  });
  const key = HARNESS ? (label ?? words(children)).replace(/\s+/g, ' ').trim() : '';
  useEffect(() => {
    if (!key) return;
    const entry = { id: next++, fn: () => fn.current?.() };
    presses.set(key, [...(presses.get(key) ?? []), entry]);
    return () => {
      presses.set(key, (presses.get(key) ?? []).filter((e) => e.id !== entry.id));
    };
  }, [key]);
}

/**
 * Register a scroll view; the latest mounted one is the one a step scrolls. A
 * pager passes its pages' offsets (and `horizontal`) so a step can turn to one.
 */
export function useHarnessScroll(ref: RefObject<ScrollView | null>, pages?: Pages) {
  const opts = useRef<Pages>({});
  useEffect(() => {
    opts.current = pages ?? {};
  });
  useEffect(() => {
    if (!HARNESS) return;
    const entry = { id: next++, ref, opts };
    scrolls.push(entry);
    return () => {
      const i = scrolls.indexOf(entry);
      if (i >= 0) scrolls.splice(i, 1);
    };
  }, [ref]);
}

/** Press the most recently mounted control with this label; false if there is none. */
export function harnessPress(label: string): boolean {
  const list = presses.get(label);
  const last = list?.[list.length - 1];
  if (!last) return false;
  last.fn();
  return true;
}

/** Scroll the most recently mounted scroll view to `y` (or its end). */
export function harnessScroll(y: number | 'end'): boolean {
  const ref = scrolls[scrolls.length - 1]?.ref.current;
  if (!ref) return false;
  if (y === 'end') ref.scrollToEnd({ animated: false });
  else ref.scrollTo({ y, animated: false });
  return true;
}

/** Scroll the scroll view called `name` to its end. */
export function harnessEnd(name: string): boolean {
  const entry = [...scrolls].reverse().find((e) => e.opts.current?.name === name);
  if (!entry?.ref.current) return false;
  entry.ref.current.scrollToEnd({ animated: false });
  return true;
}

/** Turn the pager called `name` to page `n`. */
export function harnessPage(name: string, n: number): boolean {
  const last = [...scrolls].reverse().find((e) => e.opts.current?.pages && e.opts.current.name === name);
  const at = last?.opts.current?.pages?.[n];
  if (!last?.ref.current || at == null) return false;
  last.ref.current.scrollTo(last.opts.current?.horizontal ? { x: at, animated: false } : { y: at, animated: false });
  return true;
}

const fields: { id: number; fn: RefObject<(text: string) => void> }[] = [];

/** Register a text field's setter; the latest mounted one is the one a `type:` step fills. */
export function useHarnessField(onChangeText: (text: string) => void) {
  const fn = useRef(onChangeText);
  useEffect(() => {
    fn.current = onChangeText;
  });
  useEffect(() => {
    if (!HARNESS) return;
    const entry = { id: next++, fn };
    fields.push(entry);
    return () => {
      const i = fields.indexOf(entry);
      if (i >= 0) fields.splice(i, 1);
    };
  }, []);
}

/** Type `text` into the most recently mounted field (as its own change handler would receive it). */
export function harnessType(text: string): boolean {
  const last = fields[fields.length - 1];
  if (!last) return false;
  last.fn.current(text);
  return true;
}

/** Labels currently pressable — for a step that cannot find its control. */
export const harnessLabels = () => [...presses.entries()].filter(([, v]) => v.length).map(([k]) => k);
