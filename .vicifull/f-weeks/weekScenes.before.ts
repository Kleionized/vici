/**
 * GENERATED FILE — do not edit by hand.
 *
 * The twelve week-overview scenes, transcribed layer by layer out of the
 * `Week …` frames in `UI Final/project/Email Login.dc.html`. Coordinates are
 * band-local: the band's own top already pays the canvas's 54pt status bar.
 *
 * Rebuild: node scripts/vicifull/gen-week-scenes.mjs
 */

export interface WeekSceneLayer {
  left?: number;
  right?: number;
  top?: number;
  /** `bottom:0` on the closing fade. */
  bottom?: number;
  width?: number;
  height?: number;
  /** How the box's corners are cut. */
  radius: { kind: 'none' } | { kind: 'ellipse' } | { kind: 'round'; r: number } | { kind: 'dome'; ry: number } | { kind: 'corners'; corners: number[] };
  /** An inline `<svg>` layer: the canvas draws a few birds this way. */
  svg?: { left: number; top: number; width: number; height: number; viewBox: string; children: { tag: string; attrs: Record<string, string> }[] };
  background?: string;
  /** CSS blur radius, in px — folded into a gradient falloff when drawn. */
  blur?: number;
  /** Degrees, about the box's own centre. */
  rotate?: number;
  /** A `polygon(…)` clip, as its raw percentage/px point list. */
  clip?: string;
  /** The raw CSS `box-shadow`, where a layer carries one. */
  shadow?: string;
  opacity?: number;
}

export const WEEK_SCENES: Record<number, WeekSceneLayer[]> = {
  1: [
    { left: 116, top: 28, width: 106, height: 106, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 146, top: 58, width: 46, height: 46, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 52, top: 52, width: 44, height: 11, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 66, top: 45, width: 26, height: 10, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: 292, top: 40, width: 35.2, height: 8.8, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 303.2, top: 34.4, width: 20.8, height: 8, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: -40, top: 150, width: 473, height: 90, radius: {"kind":"dome","ry":26}, background: "#C8D7E5" },
    { left: -60, top: 170, width: 473, height: 84, radius: {"kind":"dome","ry":22}, background: "#D5E1EA" },
    { left: -40, top: 196, width: 473, height: 90, radius: {"kind":"dome","ry":22}, background: "#EDE7D8" },
    { left: -70, top: 216, width: 473, height: 80, radius: {"kind":"dome","ry":18}, background: "#F2EDE0" },
    { left: 106, top: 204, width: 56, height: 10, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.08)", blur: 4 },
    { left: 126, top: 152, width: 4, height: 54, radius: {"kind":"round","r":2}, background: "#B4B1AB" },
    { left: 130, top: 152, width: 22, height: 14, radius: {"kind":"round","r":1}, background: "#E9D2A4" },
    { left: 58, top: 178, width: 24, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.6)" },
    { left: 316, top: 186, width: 20, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.5)" },
    { left: 206, top: 206, width: 26, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.45)" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  2: [
    { left: 236, top: 18, width: 100, height: 100, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 266, top: 48, width: 40, height: 40, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 64, top: 44, width: 44, height: 11, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 78, top: 37, width: 26, height: 10, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: -40, top: 150, width: 473, height: 110, radius: {"kind":"dome","ry":48}, background: "#DEDDD6" },
    { left: -90, top: 176, width: 483, height: 100, radius: {"kind":"dome","ry":42}, background: "#CFCEC7" },
    { left: 92, top: 212, width: 14, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.75)", rotate: 10 },
    { left: 122, top: 200, width: 14, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.75)", rotate: 6 },
    { left: 152, top: 190, width: 14, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.7)", rotate: 2 },
    { left: 180, top: 180, width: 13, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.7)", rotate: -2 },
    { left: 186, top: 172, width: 56, height: 10, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.08)", blur: 4 },
    { left: 206, top: 128, width: 4, height: 46, radius: {"kind":"round","r":2}, background: "#B4B1AB" },
    { left: 210, top: 128, width: 22, height: 14, radius: {"kind":"round","r":1}, background: "#E9D2A4" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  3: [
    { left: 50, top: 14, width: 98, height: 98, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 80, top: 44, width: 38, height: 38, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 250, top: 48, width: 39.6, height: 9.9, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 262.6, top: 41.7, width: 23.400000000000002, height: 9, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: -40, top: 148, width: 473, height: 90, radius: {"kind":"dome","ry":26}, background: "#C8D7E5" },
    { left: 168, top: 140, width: 36, height: 10, radius: {"kind":"round","r":6}, background: "rgba(255,255,255,0.9)" },
    { left: 200, top: 136, width: 18, height: 8, radius: {"kind":"round","r":5}, background: "rgba(255,255,255,0.75)" },
    { left: 84, top: 166, width: 28, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.6)" },
    { left: 230, top: 160, width: 32, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.55)" },
    { left: -60, top: 186, width: 473, height: 84, radius: {"kind":"dome","ry":22}, background: "#D5E1EA" },
    { left: 130, top: 212, width: 26, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.55)" },
    { left: 288, top: 220, width: 20, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.45)" },
    { left: 66, top: 228, width: 22, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.4)" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  4: [
    { left: 96, top: -4, width: 200, height: 200, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.55), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 130, top: 20, width: 118, height: 118, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 160, top: 50, width: 58, height: 58, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 48, top: 72, width: 39.6, height: 9.9, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 60.6, top: 65.7, width: 23.400000000000002, height: 9, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: 296, top: 60, width: 35.2, height: 8.8, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 307.2, top: 54.4, width: 20.8, height: 8, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: -40, top: 154, width: 473, height: 110, radius: {"kind":"dome","ry":48}, background: "#DEDDD6" },
    { left: -90, top: 180, width: 483, height: 100, radius: {"kind":"dome","ry":42}, background: "#CFCEC7" },
    { left: 150, top: 196, width: 44, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.5)" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  5: [
    { left: 48, top: 16, width: 102, height: 102, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 78, top: 46, width: 42, height: 42, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 232, top: 52, width: 48, height: 13, radius: {"kind":"round","r":8}, background: "#D6D5D0" },
    { left: 250, top: 42, width: 30, height: 11, radius: {"kind":"round","r":7}, background: "#DDDCD5" },
    { left: 224, top: 62, width: 28, height: 9, radius: {"kind":"round","r":6}, background: "#D6D5D0" },
    { left: -40, top: 152, width: 473, height: 110, radius: {"kind":"dome","ry":48}, background: "#DEDDD6" },
    { left: -90, top: 178, width: 483, height: 100, radius: {"kind":"dome","ry":42}, background: "#CFCEC7" },
    { left: 76, top: 192, width: 40, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.6)" },
    { left: 230, top: 188, width: 70, height: 16, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.05)", blur: 5 },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  6: [
    { left: 26, top: 12, width: 90, height: 90, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 56, top: 42, width: 30, height: 30, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 238, top: 38, width: 39.6, height: 9.9, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 250.6, top: 31.7, width: 23.400000000000002, height: 9, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: 20, top: 128, width: 190, height: 132, radius: {"kind":"none"}, background: "#E0DFDA", clip: "polygon(50% 0, 100% 100%, 0 100%)" },
    { left: 112, top: 60, width: 212, height: 200, radius: {"kind":"none"}, background: "linear-gradient(180deg, #D2D1CA 0%, #C1C0B9 100%)", clip: "polygon(50% 0, 100% 100%, 0 100%)" },
    { left: 196, top: 60, width: 44, height: 36, radius: {"kind":"none"}, background: "rgba(255,255,255,0.85)", clip: "polygon(50% 0, 100% 100%, 72% 72%, 50% 96%, 28% 72%, 0 100%)" },
    { left: 194, top: 60, width: 56, height: 10, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.08)", blur: 4 },
    { left: 214, top: 24, width: 4, height: 38, radius: {"kind":"round","r":2}, background: "#B4B1AB" },
    { left: 218, top: 24, width: 22, height: 14, radius: {"kind":"round","r":1}, background: "#E9D2A4" },
    { left: -40, top: 212, width: 473, height: 70, radius: {"kind":"dome","ry":28}, background: "#DEDDD6" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  7: [
    { left: 38, top: 36, width: 46, height: 46, radius: {"kind":"ellipse"}, background: "#C6C3BB" },
    { left: 70, top: 24, width: 58, height: 58, radius: {"kind":"ellipse"}, background: "#D0CEC7" },
    { left: 108, top: 40, width: 42, height: 42, radius: {"kind":"ellipse"}, background: "#C6C3BB" },
    { left: 34, top: 52, width: 118, height: 26, radius: {"kind":"round","r":15}, background: "#D0CEC7" },
    { left: 50, top: 88, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#9FB4C4", rotate: 16 },
    { left: 72, top: 97, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#9FB4C4", rotate: 16 },
    { left: 94, top: 88, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#9FB4C4", rotate: 16 },
    { left: 116, top: 97, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#9FB4C4", rotate: 16 },
    { left: 266, top: 28, width: 92, height: 92, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 296, top: 58, width: 32, height: 32, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: -40, top: 152, width: 473, height: 90, radius: {"kind":"dome","ry":26}, background: "#C8D7E5" },
    { left: -60, top: 172, width: 473, height: 84, radius: {"kind":"dome","ry":22}, background: "#D5E1EA" },
    { left: 215.72, top: 144.04, width: 39.68, height: 6.2, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.06)", blur: 3 },
    { left: 230.6, top: 118, width: 3, height: 27.28, radius: {"kind":"none"}, background: "#C6C5C0" },
    { left: 216.96, top: 121.72, width: 13.64, height: 22.32, radius: {"kind":"none"}, background: "#F7F6F2", clip: "polygon(100% 0, 100% 100%, 0 100%)", shadow: "0 1px 2px rgba(0,0,0,0.06)" },
    { left: 234.32, top: 126.68, width: 9.92, height: 17.36, radius: {"kind":"none"}, background: "#EDECE7", clip: "polygon(0 0, 100% 100%, 0 100%)" },
    { left: 212, top: 144.04, width: 39.68, height: 9.3, radius: {"kind":"corners","corners":[5,5,16,16]}, background: "#E4E3DE", shadow: "0 0 0 1px rgba(0,0,0,0.05)" },
    { left: 66, top: 214, width: 22, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.5)" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  8: [
    { left: 60, top: 10, width: 94, height: 94, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 90, top: 40, width: 34, height: 34, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 198, top: 38, width: 41.8, height: 10.45, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 211.3, top: 31.35, width: 24.7, height: 9.5, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: 288, top: 58, width: 30.799999999999997, height: 7.699999999999999, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 297.8, top: 53.1, width: 18.2, height: 7, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { svg: { left: 258, top: 92, width: 16, height: 8, viewBox: "0 0 16 8", children: [{ tag: "path", attrs: {"d":"M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6","fill":"none","stroke":"#8A857C","stroke-width":"1.6","stroke-linecap":"round"} }] }, radius: { kind: 'none' } },
    { left: -40, top: 168, width: 473, height: 56, radius: {"kind":"dome","ry":12}, background: "#E8E4D6" },
    { left: -40, top: 198, width: 473, height: 80, radius: {"kind":"none"}, background: "#F0EBDD" },
    { left: 96, top: 176, width: 58, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.6)" },
    { left: 250, top: 188, width: 40, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.45)" },
    { left: 76, top: 214, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#C9CEC0", rotate: -14 },
    { left: 84, top: 212, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#C9CEC0", rotate: 10 },
    { left: 210, top: 224, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#C9CEC0", rotate: -12 },
    { left: 310, top: 210, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#C9CEC0", rotate: 12 },
    { left: 140, top: 226, width: 90, height: 14, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.04)", blur: 5 },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  9: [
    { left: 26, top: 8, width: 92, height: 92, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 56, top: 38, width: 32, height: 32, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 262, top: 40, width: 37.4, height: 9.35, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 273.9, top: 34.05, width: 22.099999999999998, height: 8.5, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { svg: { left: 154, top: 58, width: 16, height: 8, viewBox: "0 0 16 8", children: [{ tag: "path", attrs: {"d":"M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6","fill":"none","stroke":"#8A857C","stroke-width":"1.6","stroke-linecap":"round"} }] }, radius: { kind: 'none' } },
    { svg: { left: 174, top: 50, width: 13.6, height: 6.8, viewBox: "0 0 16 8", children: [{ tag: "path", attrs: {"d":"M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6","fill":"none","stroke":"#8A857C","stroke-width":"1.6","stroke-linecap":"round"} }] }, radius: { kind: 'none' } },
    { left: -70, top: 148, width: 270, height: 140, radius: {"kind":"dome","ry":92}, background: "#DEDDD6" },
    { left: 186, top: 140, width: 290, height: 150, radius: {"kind":"dome","ry":98}, background: "#D8D7D0" },
    { left: 62, top: 148, width: 56, height: 10, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.08)", blur: 4 },
    { left: 82, top: 112, width: 4, height: 38, radius: {"kind":"round","r":2}, background: "#B4B1AB" },
    { left: 86, top: 112, width: 22, height: 14, radius: {"kind":"round","r":1}, background: "#E9D2A4" },
    { left: 280, top: 140, width: 56, height: 10, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.08)", blur: 4 },
    { left: 300, top: 102, width: 4, height: 40, radius: {"kind":"round","r":2}, background: "#B4B1AB" },
    { left: 304, top: 102, width: 22, height: 14, radius: {"kind":"round","r":1}, background: "#E9D2A4" },
    { left: -40, top: 224, width: 473, height: 60, radius: {"kind":"dome","ry":22}, background: "#CFCEC7" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  10: [
    { left: 118, top: 24, width: 102, height: 102, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 148, top: 54, width: 42, height: 42, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 50, top: 48, width: 39.6, height: 9.9, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 62.6, top: 41.7, width: 23.400000000000002, height: 9, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: -40, top: 150, width: 473, height: 70, radius: {"kind":"dome","ry":30}, background: "#DEDDD6" },
    { left: -40, top: 182, width: 473, height: 90, radius: {"kind":"round","r":24}, background: "#D5E1EA" },
    { left: 154, top: 190, width: 30, height: 44, radius: {"kind":"ellipse"}, background: "rgba(233,210,164,0.5)", blur: 6 },
    { left: 120, top: 200, width: 44, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.6)" },
    { left: 230, top: 214, width: 32, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.5)" },
    { left: 296, top: 196, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#B8BFAE", rotate: -60 },
    { left: 304, top: 192, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#B8BFAE", rotate: -70 },
    { left: 312, top: 198, width: 3, height: 4, radius: {"kind":"round","r":2}, background: "#C9CEC0", rotate: -55 },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  11: [
    { left: 96, top: 44, width: 180, height: 180, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.6), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 154, top: 116, width: 52, height: 52, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 60, top: 50, width: 44, height: 11, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 74, top: 43, width: 26, height: 10, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: 280, top: 38, width: 37.4, height: 9.35, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 291.9, top: 32.05, width: 22.099999999999998, height: 8.5, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { left: -40, top: 150, width: 473, height: 110, radius: {"kind":"dome","ry":40}, background: "#EAE6D9" },
    { left: -70, top: 178, width: 483, height: 100, radius: {"kind":"dome","ry":34}, background: "#F0EBDD" },
    { left: 186, top: 236, width: 18, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.8)" },
    { left: 180, top: 216, width: 15, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.75)" },
    { left: 176, top: 198, width: 12, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.7)" },
    { left: 173, top: 184, width: 9, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.65)" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
  12: [
    { left: 48, top: 66, width: 96, height: 96, radius: {"kind":"ellipse"}, background: "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)", blur: 4 },
    { left: 78, top: 96, width: 36, height: 36, radius: {"kind":"ellipse"}, background: "#E9D2A4" },
    { left: 220, top: 42, width: 39.6, height: 9.9, radius: {"kind":"round","r":8}, background: "rgba(255,255,255,0.85)" },
    { left: 232.6, top: 35.7, width: 23.400000000000002, height: 9, radius: {"kind":"round","r":7}, background: "rgba(255,255,255,0.75)" },
    { svg: { left: 132, top: 60, width: 16, height: 8, viewBox: "0 0 16 8", children: [{ tag: "path", attrs: {"d":"M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6","fill":"none","stroke":"#8A857C","stroke-width":"1.6","stroke-linecap":"round"} }] }, radius: { kind: 'none' } },
    { svg: { left: 160, top: 48, width: 13, height: 7, viewBox: "0 0 16 8", children: [{ tag: "path", attrs: {"d":"M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6","fill":"none","stroke":"#8A857C","stroke-width":"1.6","stroke-linecap":"round"} }] }, radius: { kind: 'none' } },
    { left: -40, top: 148, width: 473, height: 90, radius: {"kind":"dome","ry":26}, background: "#C8D7E5" },
    { left: -60, top: 168, width: 473, height: 84, radius: {"kind":"dome","ry":22}, background: "#D5E1EA" },
    { left: 153.7, top: 135.9, width: 60.8, height: 9.5, radius: {"kind":"ellipse"}, background: "rgba(0,0,0,0.06)", blur: 3 },
    { left: 176.5, top: 96, width: 3, height: 41.8, radius: {"kind":"none"}, background: "#C6C5C0" },
    { left: 155.6, top: 101.7, width: 20.9, height: 34.199999999999996, radius: {"kind":"none"}, background: "#F7F6F2", clip: "polygon(100% 0, 100% 100%, 0 100%)", shadow: "0 1px 2px rgba(0,0,0,0.06)" },
    { left: 182.2, top: 109.3, width: 15.2, height: 26.599999999999998, radius: {"kind":"none"}, background: "#EDECE7", clip: "polygon(0 0, 100% 100%, 0 100%)" },
    { left: 148, top: 135.9, width: 60.8, height: 14.25, radius: {"kind":"corners","corners":[5,5,16,16]}, background: "#E4E3DE", shadow: "0 0 0 1px rgba(0,0,0,0.05)" },
    { left: 120, top: 212, width: 26, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.6)" },
    { left: 96, top: 224, width: 20, height: 4, radius: {"kind":"round","r":2}, background: "rgba(255,255,255,0.45)" },
    { left: 0, right: 0, bottom: 0, height: 44, radius: {"kind":"none"}, background: "linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)" },
  ],
};
