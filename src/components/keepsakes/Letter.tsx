import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { GhostLink, HeroBoard, MonoText, NavBar, PrimaryButton, Screen } from '@/components/mono';
import { roman } from '@/lib/format';
import { lhNormal, mono, sans } from '@/lib/theme';

import { FaceCoin, type KeepsakeSceneKey } from './Medallion';

/**
 * The post — every piece of it arrives the same way and is read the same way
 * (`90B · VICI Post — Arrival`, `39 · The Letter — Read`, `39B · Post —
 * Medallion Letter`; CRITIC C8: Letter Arrival is the arrival for both posts).
 */

const DAY = 86_400_000;

/**
 * "Week XII post": the arrival names the programme week the post lands in
 * (CRITIC C8 / medallions Q7 — the frame's XII is its own sample). Day one is
 * the day of sign-up, seven days a week, twelve weeks at most.
 */
export function postWeek(createdAt: number | undefined, now = Date.now()): string {
  const day = createdAt ? Math.max(1, Math.floor((now - createdAt) / DAY) + 1) : 1;
  return `Week ${roman(Math.min(12, Math.ceil(day / 7)))} post`;
}

/**
 * `90B · VICI Post — Arrival`: the envelope hero at 190 (×1.1), caps, "The post
 * is in.", the line under it, `Read` over `Tonight`, and the ✕.
 */
export function PostArrival({ caps, onRead, onLater, onClose }: { caps: string; onRead: () => void; onLater: () => void; onClose: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'empty', right: 'close', onClose }}
      hero="envelope"
      caps={caps}
      title="The post is in."
      body="A short letter from VICI — two minutes, worth keeping."
      cta="Read"
      onCta={onRead}
      ghost="Tonight"
      onGhost={onLater}
    />
  );
}

/** the card's bottom fade */
const FADE = 70;

/**
 * The letter read (`39`, `39B`): the `#121212` frame, the nav's title, and the
 * letter on a `#1E1E1E` card (`left 16 right 16 top 112 bottom 150 r26`) whose
 * column (`padding 28 26 0, gap 16`) runs under a 70 fade to `#111111`; the
 * primary at bottom 96 over the ghost at 60.
 *
 * The frame's card clips (`overflow: hidden`) and its copy ends 105 above the
 * fade; on a shorter phone the same copy would be cut, so the column scrolls
 * inside the card, with room at its end to clear the fade. At 852 it fits and
 * nothing moves.
 */
export function LetterCard({
  title,
  onClose,
  primary,
  onPrimary,
  ghost,
  onGhost,
  children,
}: {
  title: string;
  onClose: () => void;
  primary: string;
  onPrimary: () => void;
  ghost: string;
  onGhost: () => void;
  children: ReactNode;
}) {
  return (
    <Screen variant="letter">
      <NavBar left="empty" centre={{ title }} right="close" onClose={onClose} />
      <View style={{ position: 'absolute', left: 16, right: 16, top: 112, bottom: 150, borderRadius: 26, backgroundColor: mono.card, overflow: 'hidden' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 28, paddingHorizontal: 26, paddingBottom: FADE, gap: 16 }}>
          {children}
        </ScrollView>
        {/* CSS fades from `rgba(30,30,30,0)`, interpolated premultiplied — the
            colour of a transparent stop never shows — so the ramp is the end
            colour's own alpha (D048) */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(17,17,17,0)', mono.groundDark]}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: FADE }}
        />
      </View>
      <PrimaryButton label={primary} onPress={onPrimary} bottom={96} />
      <GhostLink label={ghost} onPress={onGhost} />
    </Screen>
  );
}

/** "Dear Sam," — 22/700, −0.3, line-height normal. */
export function Salutation({ children }: { children: ReactNode }) {
  return (
    <MonoText v="h1Sheet" wrap="wrap" style={{ lineHeight: lhNormal(22), letterSpacing: -0.3 }}>
      {children}
    </MonoText>
  );
}

/** A paragraph: 15.5/25 `#B5B0A8`, pretty. `children` may carry a `Strong` run. */
export function LetterP({ children }: { children: ReactNode }) {
  return (
    <MonoText v="p" wrap="pretty" style={{ fontSize: 15.5, lineHeight: 25 }}>
      {children}
    </MonoText>
  );
}

/** The 700 ink run inside a paragraph (the reason, in his own words). */
export function Strong({ children }: { children: ReactNode }) {
  return <MonoText style={{ ...sans('700'), fontSize: 15.5, lineHeight: 25, color: mono.ink }}>{children}</MonoText>;
}

/** The sign-off: 15.5/25 ink 700. */
export function Signoff({ children }: { children: ReactNode }) {
  return (
    <MonoText v="p" style={{ ...sans('700'), fontSize: 15.5, lineHeight: 25, color: mono.ink }}>
      {children}
    </MonoText>
  );
}

/**
 * 39B's enclosure: `margin-top 6 · row center gap 14 · padding 14 16 · r18 ·
 * #0D0D0D` — the 44 coin, then the face and its rung (15/700) over what earns
 * it (13/400 mute), `gap 2`.
 */
export function Enclosure({ scene, numeral, title, line }: { scene: KeepsakeSceneKey; numeral?: string; title: string; line: string }) {
  return (
    <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 18, backgroundColor: mono.ground }}>
      <FaceCoin scene={scene} size={44} numeral={numeral} />
      {/* the column is as wide as its longer line (the frame's 184.8), not the card's remainder */}
      <View style={{ flexShrink: 1, gap: 2 }}>
        <MonoText v="rowLabel" wrap="wrap">
          {title}
        </MonoText>
        <MonoText v="pTight" wrap="wrap" color={mono.mute} style={{ fontSize: 13, lineHeight: lhNormal(13) }}>
          {line}
        </MonoText>
      </View>
    </View>
  );
}
