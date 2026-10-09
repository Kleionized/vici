import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { ASK_AFTER, authenticate, lockAvailable, releaseLock, saveLockConfig, useLockConfig, useLockName, type LockConfig } from '@/components/AppLockGate';
import { Check, GhostLink, LoadingView, MonoText, NavBar, Row, RowGroup, Screen, ScrollRegion, SHEET_TOP, Sheet } from '@/components/mono';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import type { UserSettings } from '@/lib/types';
import { mono } from '@/lib/theme';

/**
 * 95 · App lock — the padlock on a 76 ink disc at canvas 124, then a `gap 14`
 * column from 222: the heading and its line centred, the Lock and Privacy
 * groups, and the footnote. The column scrolls between the nav and the
 * screen's foot if it has to (D320).
 *
 * The three switches write `appLockFaceId` (default off), `appLockOnLeave`
 * (default off) and `hideSensitivePreviews` (default on), and the same moment
 * this phone's mirror of them, which `AppLockGate` enforces (D423). Turning
 * the lock on first asks for Face ID, so a phone that cannot check never turns
 * it on and locks its owner out. `Require Face ID` locks a cold start and a
 * return after 15 minutes away; `Lock when I leave the app` locks every return
 * after `Ask after`, a sheet of intervals kept on this phone (D423). The words
 * name what the phone actually unlocks with (Touch ID, a passcode, Android's
 * screen lock) where it is not Face ID (D424).
 *
 * The switches wait for the account: drawn from the defaults first, the two
 * that default off opened off and slid on once the settings arrived (a cold
 * open — a reload, a deep link — showed it).
 */

type Flag = 'appLockFaceId' | 'appLockOnLeave' | 'hideSensitivePreviews';

/** Which mirror field each account switch feeds. */
const MIRROR: Record<Flag, keyof LockConfig> = {
  appLockFaceId: 'faceId',
  appLockOnLeave: 'onLeave',
  hideSensitivePreviews: 'hidePreviews',
};

const UNAVAILABLE = 'App lock isn’t available in this version of VICI.';

/** The `Ask after` sheet: the photo sheet's panel (512 for three rows), two rows taller. */
const ASK_SHEET_TOP = SHEET_TOP.photo - 2 * 55;

export default function AppLock() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const local = useLockConfig();
  const name = useLockName();
  const [note, setNote] = useState<string | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const s = user?.settings;

  const write = (key: Flag, next: boolean) => {
    void saveLockConfig({ [MIRROR[key]]: next });
    void Promise.resolve(update({ [key]: next })).catch(() => {});
  };
  const value = (key: Flag, def: boolean) => (s?.[key as keyof UserSettings] as boolean | undefined) ?? def;
  const flag = (key: Flag, def: boolean) => ({ value: value(key, def), onChange: (next: boolean) => write(key, next) });

  /** On only once the phone has shown it can check — never a lock its owner cannot open. */
  const setRequire = async (next: boolean) => {
    setNote(null);
    if (!next) return write('appLockFaceId', false);
    if (!lockAvailable()) return setNote(UNAVAILABLE);
    const outcome = await authenticate('Turn on app lock');
    if (outcome === 'ok') {
      releaseLock();
      write('appLockFaceId', true);
    } else if (outcome === 'unavailable') {
      setNote(name === 'Face ID' || name === 'Touch ID' ? `Set up ${name} or a passcode on this phone first.` : `Set a ${name} on this phone first.`);
    }
  };

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  if (user === undefined) return <LoadingView onBack={back} />;

  const lockOn = value('appLockFaceId', false);
  // a switch left on by another phone, in a build that cannot lock, says so
  const shownNote = note ?? (lockOn && !lockAvailable() ? UNAVAILABLE : null);
  const askAfter = ASK_AFTER.find((o) => o.sec === local.askAfterSec) ?? ASK_AFTER[0];

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'App lock' }} right="empty" onBack={back} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: 24 }}>
        {/* the frame's disc keeps the kit's palette inverted: a `#111111` padlock
            with an ink keyhole on the ink disc */}
        <View style={{ alignSelf: 'center', width: 76, height: 76, borderRadius: 38, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={30} height={30} viewBox="0 0 30 30">
            <Rect width={18} height={13} x={6} y={13} rx={3.5} fill={mono.onInk} />
            <Path d="M10 13V9.5a5 5 0 0 1 10 0V13" fill="none" stroke={mono.onInk} strokeWidth={2.6} />
            <Circle cx={15} cy={19.5} r={2} fill={mono.ink} />
          </Svg>
        </View>

        {/* 124 + 76 = 200; the column starts at 222 */}
        <View style={{ marginTop: 22, gap: 14 }}>
          <MonoText v="h1" center>
            Keep VICI private.
          </MonoText>
          <MonoText v="p" center>
            {`Lock it with your ${name} so only you can open it.`}
          </MonoText>
          <View style={{ height: 4 }} />
          <RowGroup label="Lock">
            <Row label={`Require ${name}`} toggle={{ value: lockOn, onChange: (next) => void setRequire(next) }} />
            <Row label="Lock when I leave the app" toggle={flag('appLockOnLeave', false)} />
            {/* how long away before a return asks again (with `Lock when I leave
                the app` off, never sooner than 15 minutes — D423) */}
            <Row label="Ask after" value={askAfter.row} onPress={() => setAskOpen(true)} />
          </RowGroup>
          {shownNote ? (
            <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
              {shownNote}
            </MonoText>
          ) : null}
          <RowGroup label="Privacy">
            <Row label="Hide sensitive previews" toggle={flag('hideSensitivePreviews', true)} />
          </RowGroup>
          {/* the frame's line promised notifications too; reminders never carry
              anything written, so the switch only has the app switcher to hide (D429) */}
          <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
            Covers VICI in the app switcher, so entries and titles never show. Reminders never include what you write.
          </MonoText>
        </View>
      </ScrollRegion>

      {/* the photo sheet's shell: a heading, the choices, Cancel */}
      <Sheet
        open={askOpen}
        top={ASK_SHEET_TOP}
        onClose={() => setAskOpen(false)}
        footer={<GhostLink label="Cancel" bottom={56} bold zIndex={42} onPress={() => setAskOpen(false)} />}>
        <MonoText v="h1Sheet">Ask after</MonoText>
        <View style={{ height: 2 }} />
        <RowGroup>
          {ASK_AFTER.map((o) => (
            <Row
              key={o.sec}
              label={o.label}
              chevron={false}
              right={o.sec === askAfter.sec ? <Check color={mono.ink} /> : null}
              onPress={() => {
                void saveLockConfig({ askAfterSec: o.sec });
                setAskOpen(false);
              }}
            />
          ))}
        </RowGroup>
      </Sheet>
    </Screen>
  );
}
