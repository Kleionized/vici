import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { spacing } from '@/lib/theme';
import { AppText } from './AppText';

type Variant = 'subtitle' | 'title' | 'body' | 'muted';

export interface TypewriterSequenceProps {
  /** Lines revealed one after another, character by character. Pass a stable array. */
  lines: string[];
  onComplete?: () => void;
  /** ms per character. */
  speed?: number;
  /** ms pause after a line finishes before the next begins. */
  linePause?: number;
  variant?: Variant;
  center?: boolean;
}

export function TypewriterSequence({
  lines,
  onComplete,
  speed = 26,
  linePause = 420,
  variant = 'subtitle',
  center,
}: TypewriterSequenceProps) {
  const [done, setDone] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let lineIdx = 0;

    const typeLine = () => {
      if (cancelled) return;
      if (lineIdx >= lines.length) {
        onCompleteRef.current?.();
        return;
      }
      const text = lines[lineIdx];
      let i = 0;
      const id = setInterval(() => {
        if (cancelled) {
          clearInterval(id);
          return;
        }
        i += 1;
        setCurrent(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(id);
          const t = setTimeout(() => {
            if (cancelled) return;
            setDone((d) => [...d, text]);
            setCurrent('');
            lineIdx += 1;
            typeLine();
          }, linePause);
          timers.push(t);
        }
      }, speed);
      timers.push(id);
    };

    typeLine();
    return () => {
      cancelled = true;
      timers.forEach((t) => {
        clearTimeout(t);
        clearInterval(t as unknown as ReturnType<typeof setInterval>);
      });
    };
  }, [lines, speed, linePause]);

  return (
    <View style={{ gap: spacing.sm }}>
      {done.map((l, i) => (
        <AppText key={i} variant={variant} center={center}>
          {l}
        </AppText>
      ))}
      {current ? (
        <AppText variant={variant} center={center}>
          {current}
        </AppText>
      ) : null}
    </View>
  );
}
