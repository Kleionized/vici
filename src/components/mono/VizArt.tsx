import { useMemo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

/**
 * A drawing given as SVG markup and the box it is shown through (`viewBox`),
 * fitted (`xMidYMid meet`) into `w × h` — the SOS task drawings, the relapse
 * pages' art.
 *
 * The frames draw these `<svg>`s with `overflow: visible`, so a full-bleed
 * floor runs past the box toward the screen's edges. Native SVG clips at its
 * own box, so the drawing is laid on a canvas `pad` larger on every side with
 * the viewBox widened by the same amount at the fitted scale: the art lands
 * exactly where the box puts it, and what runs past the box is kept (D27).
 */
export function VizArt({ markup, viewBox, w, h, pad = 48 }: { markup: string; viewBox: string; w: number; h: number; pad?: number }) {
  const xml = useMemo(() => {
    const [vx, vy, vw, vh] = viewBox.trim().split(/[\s,]+/).map(Number);
    const s = Math.min(w / vw, h / vh);
    const ox = (w - vw * s) / 2;
    const oy = (h - vh * s) / 2;
    const box = [vx - (ox + pad) / s, vy - (oy + pad) / s, (w + 2 * pad) / s, (h + 2 * pad) / s].map((v) => +v.toFixed(4)).join(' ');
    return `<svg viewBox="${box}">${markup}</svg>`;
  }, [markup, viewBox, w, h, pad]);
  return (
    <View pointerEvents="none" style={{ width: w, height: h }}>
      <SvgXml xml={xml} width={w + 2 * pad} height={h + 2 * pad} style={{ position: 'absolute', left: -pad, top: -pad }} />
    </View>
  );
}
