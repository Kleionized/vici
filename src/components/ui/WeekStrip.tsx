import { View } from 'react-native';

import { toDateKey } from '@/lib/date';
import { colors, radius, spacing } from '@/lib/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { useOnInk } from './surface';

export interface WeekStripProps {
  /** Date keys (YYYY-MM-DD) that should read as "done" (a check). */
  markedDates?: string[];
  /** Anchor date; shows the Sun–Sat week containing it. Defaults to today. */
  anchor?: Date;
}

const DAY_INITIALS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/** Sunday-start week of dates containing `anchor`. */
function weekDates(anchor: Date): Date[] {
  const d = new Date(anchor);
  const monday = new Date(d);
  monday.setDate(d.getDate() - d.getDay()); // back to Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

/**
 * The Stoic-style week ribbon — weekday letters over checkmarks for completed
 * days, with today boxed.
 */
export function WeekStrip({ markedDates = [], anchor = new Date() }: WeekStripProps) {
  const onInk = useOnInk();
  const todayKey = toDateKey(new Date());
  const marked = new Set(markedDates);
  const days = weekDates(anchor);

  const fg = onInk ? colors.inkText : colors.text;
  const boxBorder = onInk ? colors.inkBorder : colors.borderStrong;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {days.map((day, i) => {
        const key = toDateKey(day);
        const isToday = key === todayKey;
        const isDone = marked.has(key);
        const future = day.getTime() > Date.now() && !isToday;
        return (
          <View key={key} style={{ alignItems: 'center', gap: spacing.sm, flex: 1 }}>
            <AppText variant="soft" style={{ fontSize: 12, letterSpacing: 0.3 }}>
              {DAY_INITIALS[i]}
            </AppText>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.sm,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: isToday ? 1.5 : 0,
                borderColor: boxBorder,
              }}>
              {isDone ? (
                <Icon name="check" size={17} color={fg} strokeWidth={2.4} />
              ) : (
                <View
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: radius.pill,
                    backgroundColor: future ? colors.textSofter : fg,
                    opacity: future ? 0.5 : isToday ? 1 : 0.35,
                  }}
                />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
