import type { ComponentType } from 'react';
import { View } from 'react-native';

import { mono } from '@/lib/theme';

import { NavBar } from '../NavBar';
import { Screen } from '../Screen';
import { MonoText } from '../Text';

/** V3 Q1 without the option kit (raw rows): checks Screen, NavBar + dashes, h1, the stack. */
function V3Q1() {
  const items = ['More than once a day', 'About once a day', 'A few times a week', 'About once a week', 'A few times a month', 'Less than once a month'];
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 1, total: 8 }} right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 14 }}>
        <MonoText v="h1">How often are you watching porn right now?</MonoText>
        <View style={{ height: 18 }} />
        <View style={{ gap: 12 }}>
          {items.map((t, i) => (
            <View key={t} style={{ height: 58, borderRadius: 18, backgroundColor: i === 2 ? mono.ink : mono.card, justifyContent: 'center', paddingHorizontal: 22 }}>
              <MonoText v="optionLabel" color={i === 2 ? mono.onInk : mono.ink}>{t}</MonoText>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

export const LAB_CORE: Record<string, ComponentType> = { 'V3-Q1': V3Q1 };
