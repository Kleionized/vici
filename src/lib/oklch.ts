/**
 * oklch → sRGB conversion.
 *
 * The design bundles (urge surfing + the journey worlds) express every tint in
 * CSS `oklch(L C H / a)`. oklch is a web-only colour space — React Native's
 * native renderer cannot parse it, so every tint must be converted to an rgba()
 * string up front. This is the single source of that conversion.
 *
 * Pipeline: oklch → oklab → linear sRGB → gamma-encoded sRGB (the standard
 * Björn Ottosson matrices).
 */

function srgbGamma(x: number): number {
  return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
}

const clamp255 = (x: number) => Math.max(0, Math.min(255, Math.round(x * 255)));

/** oklch (L 0..1, C chroma, H degrees) → [r, g, b] in 0..255. */
export function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [clamp255(srgbGamma(r)), clamp255(srgbGamma(g)), clamp255(srgbGamma(bl))];
}

/**
 * Matches the design helper `wa = (h, l, c, a) => oklch(${l} ${c} ${h} / ${a})`.
 * NOTE the argument order is (hue, lightness, chroma, alpha) — hue first.
 */
export function wa(h: number, l: number, c: number, a = 1): string {
  const [r, g, b] = oklchToRgb(l, c, h);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Build a reusable tint accessor from a fixed oklch triple: returns
 * `(alpha) => 'rgba(...)'`, mirroring the design's `tintOf(base)`.
 */
export function tintFromOklch(L: number, C: number, H: number): (alpha?: number) => string {
  const [r, g, b] = oklchToRgb(L, C, H);
  return (alpha = 1) => `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type Tint = (alpha?: number) => string;
