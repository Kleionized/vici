import { useState, type ComponentType } from 'react';
import { View } from 'react-native';

import { mono } from '@/lib/theme';

import { NextFab, PrimaryButton } from '../buttons';
import { Chips, DateRow, Grid2, OptionList, WhenChips } from '../choices';
import { Hero } from '../Hero';
import { NavBar } from '../NavBar';
import { Screen } from '../Screen';
import { MonoText } from '../Text';
import { TimeWheel, type WheelTime } from '../TimeWheel';

/**
 * Kit-lab replicas for the choices part of the kit. Key = the frame's split file
 * stem. Each holds its selection in state, so tapping in the lab exercises the
 * same controlled API the screens use.
 */

/** V3 Q1 — `OptionList` with the V3 lift (supersedes the core lab's raw rows, same numbers). */
function V3Q1() {
  const [v, setV] = useState<string | null>('A few times a week');
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 1, total: 8 }} right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 14 }}>
        <MonoText v="h1">How often are you watching porn right now?</MonoText>
        <View style={{ height: 18 }} />
        <OptionList
          lift
          options={['More than once a day', 'About once a day', 'A few times a week', 'About once a week', 'A few times a month', 'Less than once a month']}
          value={v}
          onChange={setV}
        />
      </View>
    </Screen>
  );
}

/** V3 Q5 — `Chips`, multi, with the lift; the stack sits at 140 on this frame. */
function V3Q5() {
  const [v, setV] = useState<string[]>(['Late at night', 'When I can’t sleep', 'When I’m home alone', 'While scrolling']);
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 3, total: 8 }} right="empty" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 140, gap: 14 }}>
        <MonoText v="h1">When do you usually end up watching?</MonoText>
        <MonoText v="pTight" color={mono.mute}>
          Select all that apply
        </MonoText>
        <View style={{ height: 10 }} />
        <Chips
          multi
          lift
          options={['Late at night', 'In the morning', 'When I’m bored', 'When I’m stressed', 'When I can’t sleep', 'On weekends', 'After drinking', 'When I’m home alone', 'While scrolling']}
          value={v}
          onChange={setV}
        />
      </View>
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

/** Checkin Emotions — `Grid2` (multi) + `NextFab`, over the hero part's night art (T 506, 0.954; first in paint order, as the frame). */
function CheckinEmotions() {
  const [v, setV] = useState<string[]>(['Calm', 'Tired']);
  return (
    <Screen>
      <Hero id="windowNight" top={506} scale={0.954} />
      <NavBar left="back" centre={{ step: 3, total: 8 }} right="close" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 8 }}>
        <MonoText v="h1">What did today feel like?</MonoText>
        <MonoText v="pTight" color={mono.mute}>
          Select all that apply.
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 232, gap: 20 }}>
        <Grid2 multi options={['Calm', 'Tense', 'Tired', 'Hopeful', 'Flat', 'Proud', 'Lonely', 'Restless']} value={v} onChange={setV} />
      </View>
      <NextFab />
    </Screen>
  );
}

/**
 * Lapse When — `WhenChips` + `DateRow` around the overlay part's `TimeWheel`:
 * the whole frame from kit pieces, at the frame's own stem. (The overlay part's
 * `Lapse-When@overlay` checks the wheel with the chips as plain boxes.)
 */
function LapseWhen() {
  const [v, setV] = useState<string | null>('Just now');
  const [time, setTime] = useState<WheelTime>({ hour12: 11, minute: 40, period: 'PM' });
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 3, total: 8 }} right="close" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap: 14 }}>
        <MonoText v="h1">When did it happen?</MonoText>
        <View style={{ height: 2 }} />
        <WhenChips options={['Just now', 'Earlier today', 'Yesterday']} value={v} onChange={setV} />
        <View style={{ height: 6 }} />
        <MonoText v="caps">Or choose a time</MonoText>
        <TimeWheel value={time} onChange={setTime} />
        <DateRow label="Tonight, Tue Jul 22" />
      </View>
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

export const LAB_CHOICES: Record<string, ComponentType> = {
  'V3-Q1': V3Q1,
  'V3-Q5': V3Q5,
  'Checkin-Emotions': CheckinEmotions,
  'Lapse-When': LapseWhen,
};
