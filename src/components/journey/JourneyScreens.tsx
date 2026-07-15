/**
 * The journey overview MAP + immersive per-world HUB — a 1:1 port of the design
 * bundle's `screens-worlds.jsx`. A single sea-to-summit vista with a winding
 * dotted path; ten worlds sit on it, two side-worlds branch off. Tap a node to
 * open its hub. The 402×874 design canvas is scaled to the device width.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { wa } from '@/lib/oklch';
import { NODES, PATH_ORDER, SHORT, SIDE, SIDE_NODES, seaFill, seaPath, type World, WORLDS } from '@/lib/worlds';
import { WorldArt } from './WorldArt';

const MAP_W = 402;
const MAP_H = 874;
const INK = '#06080B';
const TEXT = '#F2F2EE';

// ── full sea-to-summit backdrop ──────────────────────────────────────────────
function JourneyBackdrop({ w, h }: { w: number; h: number }) {
  return (
    <Svg width={w} height={h} viewBox="0 0 402 874" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <SvgGradient id="jmap" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={wa(300, 0.4, 0.1)} />
          <Stop offset="16%" stopColor={wa(286, 0.32, 0.09)} />
          <Stop offset="36%" stopColor={wa(150, 0.24, 0.075)} />
          <Stop offset="58%" stopColor={wa(186, 0.22, 0.075)} />
          <Stop offset="80%" stopColor={wa(214, 0.28, 0.085)} />
          <Stop offset="100%" stopColor={wa(224, 0.4, 0.1)} />
        </SvgGradient>
      </Defs>
      <Path d={`M0 0H402V874H0Z`} fill="url(#jmap)" />
      {/* summit + high peaks */}
      <Circle cx={204} cy={150} r={46} fill={wa(300, 0.82, 0.08, 0.25)} />
      <Path d="M120 250L204 120 300 250Z" fill={wa(296, 0.2, 0.05)} />
      <Path d="M204 120L186 158C196 148 214 148 224 158Z" fill={wa(300, 0.85, 0.05, 0.7)} />
      <Path d="M0 250L70 175 150 250Z" fill={wa(288, 0.17, 0.05)} />
      <Path d="M250 270L330 185 402 270Z" fill={wa(286, 0.16, 0.05)} />
      {/* cloud sea around the upper mountain */}
      <Path d="M0 296C70 282 130 290 200 286 280 282 340 292 402 284V330H0Z" fill={wa(286, 0.62, 0.05, 0.16)} />
      {/* mid mountains / base */}
      <Path d="M0 470L96 360 196 470Z" fill={wa(150, 0.2, 0.06)} />
      <Path d="M180 480L300 350 402 480Z" fill={wa(150, 0.17, 0.055)} />
      <Path d="M0 478C80 452 140 466 210 462 290 458 350 470 402 460V520H0Z" fill={wa(150, 0.24, 0.07)} />
      {/* island */}
      <Path d="M96 600C120 560 156 540 198 540 240 540 280 562 306 600Z" fill={wa(176, 0.22, 0.06)} />
      <Path d="M198 556L198 530" stroke={wa(176, 0.8, 0.07, 0.7)} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={198} cy={524} r={10} fill={wa(176, 0.75, 0.08, 0.8)} />
      {/* sea bands to the shore */}
      {[636, 672, 710, 748, 788, 826].map((y, i) => (
        <Path key={i} d={seaPath(y, 5 + i * 0.4)} fill="none" stroke={wa(220 - i * 2, 0.7, 0.07, 0.22 - i * 0.015)} strokeWidth={1.8} />
      ))}
      <Path d={seaFill(800, 6, 874)} fill={wa(224, 0.18, 0.06, 0.7)} />
    </Svg>
  );
}

// connector path string through the main nodes
function connectorD() {
  const pts = PATH_ORDER.map((k) => NODES[k]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const my = (y0 + y1) / 2;
    d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`;
  }
  return d;
}

// pulsing ring for the current node (urge-ring keyframe)
function PulseRing({ size, color }: { size: number; color: string }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: 3000, easing: Easing.out(Easing.ease), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [t]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        opacity: t.interpolate({ inputRange: [0, 0.16, 1], outputRange: [0, 0.55, 0] }),
        transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.32, 1.95] }) }],
      }}
    />
  );
}

// node icons
const LockIcon = ({ c }: { c: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M6 11h12v9H6z" stroke={c} strokeWidth={2} strokeLinejoin="round" />
    <Path d="M8 11V8a4 4 0 018 0v3" stroke={c} strokeWidth={2} />
  </Svg>
);
const CheckIcon = ({ c, size = 20 }: { c: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12.5l4.5 4.5L19 7" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

function MapNode({ world, cx, cy, side, onOpen }: { world: World; cx: number; cy: number; side?: boolean; onOpen: (k: string) => void }) {
  const st = world.state;
  const r = side ? 25 : 28;
  const accent = wa(world.hue, 0.82, 0.12);
  const isDone = st === 'done',
    isCur = st === 'current',
    isOpen = st === 'open';
  const bg = isDone ? accent : isCur ? wa(world.hue, 0.3, 0.09, 0.95) : isOpen ? wa(world.hue, 0.26, 0.08, 0.9) : 'rgba(255,255,255,0.06)';
  const borderColor = isCur || isOpen ? accent : isDone ? 'transparent' : 'rgba(255,255,255,0.22)';
  const borderWidth = isCur || isOpen ? 2 : isDone ? 0 : 2;

  return (
    <View style={{ position: 'absolute', left: cx - 60, top: cy - r, width: 120, alignItems: 'center' }}>
      <Pressable onPress={() => onOpen(world.key)} accessibilityRole="button" accessibilityLabel={world.name} style={{ alignItems: 'center', gap: 6 }}>
        <View style={{ width: r * 2, height: r * 2, alignItems: 'center', justifyContent: 'center' }}>
          {isCur ? <PulseRing size={r * 2 + 14} color={accent} /> : null}
          <View
            style={{
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              backgroundColor: bg,
              borderWidth,
              borderColor,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: isCur ? wa(world.hue, 0.7, 0.12) : isDone ? wa(world.hue, 0.5, 0.1) : '#000',
              shadowOpacity: isCur ? 0.5 : isDone ? 0.4 : 0,
              shadowRadius: isCur ? 13 : 8,
              shadowOffset: { width: 0, height: isDone ? 6 : 0 },
            }}>
            {st === 'locked' ? (
              <LockIcon c="rgba(255,255,255,0.5)" />
            ) : isDone ? (
              <CheckIcon c="#06080B" />
            ) : side ? (
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                {world.crisis ? (
                  <Path d="M12 3l9 16H3L12 3z M12 10v4 M12 17v.5" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <>
                    <Circle cx={12} cy={12} r={8} stroke={accent} strokeWidth={2} />
                    <Path d="M12 8v8M8 12h8" stroke={accent} strokeWidth={2} strokeLinecap="round" />
                  </>
                )}
              </Svg>
            ) : (
              <AppText weightOverride="500" color={TEXT} style={{ fontSize: 16.5 }}>
                {world.n}
              </AppText>
            )}
          </View>
        </View>
        <AppText
          weightOverride="600"
          style={{ fontSize: 11.5, letterSpacing: 0.1, color: st === 'locked' ? 'rgba(242,242,238,0.5)' : TEXT, textAlign: 'center', maxWidth: 116, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 1 } }}>
          {side ? world.name.split(' & ')[0].replace('Get ', '') : SHORT[world.key]}
        </AppText>
      </Pressable>
    </View>
  );
}

// ── 1 · the overview MAP ─────────────────────────────────────────────────────
function WorldMapScreen({ worlds, side, onOpen }: { worlds: World[]; side: World[]; onOpen: (k: string) => void }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = width / MAP_W;
  const mapH = MAP_H * scale;
  const doneCount = worlds.filter((w) => w.state === 'done').length;
  const cur = worlds.find((w) => w.state === 'current');
  const sx = (x: number) => x * scale;

  return (
    <View style={{ flex: 1, backgroundColor: INK }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ width, height: mapH }}>
          <JourneyBackdrop w={width} h={mapH} />
          {/* top/bottom darkening */}
          <LinearGradient
            colors={['rgba(6,8,11,0.35)', 'rgba(6,8,11,0)', 'rgba(6,8,11,0)', 'rgba(6,8,11,0.5)']}
            locations={[0, 0.16, 0.78, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: mapH }}
            pointerEvents="none"
          />

          {/* connectors + branch lines */}
          <Svg width={width} height={mapH} viewBox="0 0 402 874" style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none">
            <Path d={connectorD()} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 11" />
            <Path
              d={`M ${NODES.base[0]} ${NODES.base[1]} Q ${SIDE_NODES.curio[0]} ${(NODES.base[1] + SIDE_NODES.curio[1]) / 2}, ${SIDE_NODES.curio[0]} ${SIDE_NODES.curio[1]}`}
              fill="none"
              stroke={wa(332, 0.7, 0.08, 0.4)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="1 10"
            />
            <Path
              d={`M ${NODES.sailing[0]} ${NODES.sailing[1]} Q ${SIDE_NODES.help[0]} ${(NODES.sailing[1] + SIDE_NODES.help[1]) / 2}, ${SIDE_NODES.help[0]} ${SIDE_NODES.help[1]}`}
              fill="none"
              stroke={wa(26, 0.7, 0.09, 0.4)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="1 10"
            />
          </Svg>

          {/* header */}
          <View style={{ position: 'absolute', top: insets.top + 16, left: 0, right: 0, paddingHorizontal: 24, alignItems: 'center' }}>
            <AppText weightOverride="600" color={TEXT} style={{ fontSize: 30, letterSpacing: -0.75, marginTop: 6, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 12 }}>
              Sea to summit
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <View style={{ width: 150, height: 5, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
                <View style={{ width: `${(doneCount / WORLDS.length) * 100 + 4}%`, height: '100%', backgroundColor: wa(cur ? cur.hue : 224, 0.85, 0.11), borderRadius: 9999 }} />
              </View>
              <AppText weightOverride="600" style={{ fontSize: 12.5, color: 'rgba(242,242,238,0.75)' }}>
                {doneCount}/{WORLDS.length} worlds
              </AppText>
            </View>
          </View>

          {/* nodes */}
          {worlds.map((w) => (
            <MapNode key={w.key} world={w} cx={sx(NODES[w.key][0])} cy={sx(NODES[w.key][1])} onOpen={onOpen} />
          ))}
          {side.map((w) => (
            <MapNode key={w.key} world={w} cx={sx(SIDE_NODES[w.key][0])} cy={sx(SIDE_NODES[w.key][1])} side onOpen={onOpen} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ── back chrome shared by hubs ───────────────────────────────────────────────
function HubChrome({ onBack, index, total, hue, top }: { onBack: () => void; index: number | null; total: number; hue: number; top: number }) {
  return (
    <View style={{ position: 'absolute', top, left: 0, right: 0, zIndex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22 }}>
      <Pressable onPress={onBack} accessibilityLabel="Back" hitSlop={8} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.28)', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M15 5l-7 7 7 7" stroke={TEXT} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      {total ? (
        <View style={{ flexDirection: 'row', gap: 5 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View key={i} style={{ width: i === index ? 20 : 6, height: 6, borderRadius: 9999, backgroundColor: i <= (index ?? -1) ? wa(hue, 0.85, 0.1) : 'rgba(255,255,255,0.22)' }} />
          ))}
        </View>
      ) : (
        <View />
      )}
      <View style={{ width: 38 }} />
    </View>
  );
}

function LessonRow({ title, mins, state, hue, i }: { title: string; mins: number; state: string; hue: number; i: number }) {
  const accent = wa(hue, 0.82, 0.12);
  const done = state === 'done',
    cur = state === 'current',
    locked = state === 'locked';
  const meta = done ? 'Done' : cur ? 'In progress' : locked ? 'Locked' : 'Tap to start';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        paddingVertical: 11,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: cur ? wa(hue, 0.4, 0.09, 0.16) : 'rgba(255,255,255,0.045)',
        borderWidth: cur ? 1.5 : 1,
        borderColor: cur ? wa(hue, 0.6, 0.1, 0.5) : 'rgba(255,255,255,0.06)',
        opacity: locked ? 0.55 : 1,
      }}>
      <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? accent : 'rgba(255,255,255,0.07)', borderWidth: cur ? 1.5 : 0, borderColor: accent }}>
        {done ? <CheckIcon c="#06080B" size={15} /> : locked ? <LockIcon c="rgba(255,255,255,0.5)" /> : <AppText weightOverride="600" color={accent} style={{ fontSize: 13 }}>{i}</AppText>}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText weightOverride="600" color={TEXT} numberOfLines={1} style={{ fontSize: 15.5, letterSpacing: -0.15 }}>
          {title}
        </AppText>
        <AppText weightOverride="500" style={{ fontSize: 12.5, color: 'rgba(242,242,238,0.5)', marginTop: 1 }}>
          {mins} min · {meta}
        </AppText>
      </View>
      {cur ? (
        <View style={{ backgroundColor: accent, borderRadius: 9999, paddingHorizontal: 13, paddingVertical: 6 }}>
          <AppText weightOverride="600" color="#06080B" style={{ fontSize: 12 }}>
            Resume
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

// ── 2 · the immersive per-world HUB ──────────────────────────────────────────
function WorldHubScreen({ world, onBack, onAction }: { world: World; onBack: () => void; onAction: (w: World) => void }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const w = world;
  const accent = wa(w.hue, 0.82, 0.12);
  const idx = w.side ? null : (w.n ?? 1) - 1;
  const shown = w.lessons.slice(0, 4);
  const more = w.count - shown.length;
  const stateFor = (i: number) => {
    if (w.state === 'current') return i < (w.done || 0) ? 'done' : i === (w.done || 0) ? 'current' : 'locked';
    if (w.state === 'open') return i === 0 ? 'current' : 'locked';
    if (w.state === 'done') return 'done';
    return 'locked';
  };
  const ctaLabel = w.crisis ? 'Get help now' : w.state === 'locked' ? 'Locked' : w.state === 'current' ? 'Continue world' : w.state === 'open' ? 'Explore' : w.state === 'done' ? 'Review world' : 'Start world';
  const locked = w.state === 'locked';

  return (
    <View style={{ flex: 1, backgroundColor: INK }}>
      <HubChrome onBack={onBack} index={idx} total={w.side ? 0 : 10} hue={w.hue} top={insets.top + 8} />

      {/* scene banner */}
      <View style={{ height: 312 }}>
        <WorldArt scene={w.key} hue={w.hue} w={width} h={312} />
        <LinearGradient colors={['rgba(6,8,11,0)', INK]} locations={[0.56, 1]} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none" />
      </View>

      {/* body */}
      <View style={{ flex: 1, marginTop: -42, paddingHorizontal: 24, paddingBottom: 18 }}>
        <AppText weightOverride="600" color={accent} style={{ fontSize: 12, letterSpacing: 2.4, textTransform: 'uppercase' }}>
          {w.side ? 'Side quest' : `World ${w.n} of 10`}
        </AppText>
        <AppText weightOverride="600" color={TEXT} style={{ fontSize: 30, letterSpacing: -0.75, lineHeight: 33, marginTop: 8 }}>
          {w.name}
        </AppText>
        <AppText weightOverride="500" style={{ fontSize: 16, color: 'rgba(242,242,238,0.6)', marginTop: 6 }}>
          {w.sub}
          {w.crisis ? '' : ` · ${w.count} lesson${w.count > 1 ? 's' : ''}${w.mins ? ` · ~${w.mins} min each` : ''}`}
        </AppText>

        <ScrollView style={{ flex: 1, marginTop: 18 }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
          {shown.map((t, i) => (
            <LessonRow key={i} title={t} mins={w.mins || 3} state={w.crisis ? (i === 0 ? 'current' : 'avail') : stateFor(i)} hue={w.hue} i={i + 1} />
          ))}
          {more > 0 ? (
            <AppText weightOverride="600" style={{ textAlign: 'center', fontSize: 13, color: 'rgba(242,242,238,0.5)', paddingTop: 6 }}>
              + {more} more {w.crisis ? 'resource' : 'lesson'}
              {more > 1 ? 's' : ''}
            </AppText>
          ) : null}
        </ScrollView>

        <Pressable
          onPress={() => onAction(w)}
          style={{
            marginTop: 10,
            width: '100%',
            backgroundColor: locked ? 'rgba(255,255,255,0.08)' : accent,
            borderRadius: 9999,
            paddingVertical: 17,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          {locked ? <LockIcon c="rgba(242,242,238,0.55)" /> : null}
          <AppText weightOverride="500" color={locked ? 'rgba(242,242,238,0.55)' : '#06080B'} style={{ fontSize: 16.5, letterSpacing: -0.1 }}>
            {ctaLabel}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

// ── live flow: map ⇄ hub ─────────────────────────────────────────────────────
export function WorldsJourney({ worlds, side, onAction }: { worlds: World[]; side: World[]; onAction: (w: World) => void }) {
  const [openKey, setOpen] = useState<string | null>(null);
  const open = openKey ? [...worlds, ...side].find((w) => w.key === openKey) : null;
  if (open) return <WorldHubScreen world={open} onBack={() => setOpen(null)} onAction={onAction} />;
  return <WorldMapScreen worlds={worlds} side={side} onOpen={(k) => setOpen(k)} />;
}
