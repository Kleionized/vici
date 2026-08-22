/**
 * GENERATED FILE — do not edit by hand.
 *
 * The 83 task scenes, transcribed layer by layer out of the `Task DNN Intro`
 * frames in `UI Final/project/Lessons and Tasks.dc.html`. Coordinates are
 * scene-local against the canvas's own 340 × 200 box.
 *
 * Day 32 has no frames in the bundle at all, so it has no scene.
 *
 * Rebuild: node scripts/uifinal/gen-task-art.mjs
 */

export interface TaskSvgChild {
  tag: string;
  attrs: Record<string, string>;
}

export interface TaskSceneSvg {
  kind: 'svg';
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  viewBox?: string;
  svg: { attrs: Record<string, string>; children: TaskSvgChild[] };
}

export interface TaskSceneBox {
  kind: 'box';
  left?: number;
  right?: number;
  top?: number;
  width?: number;
  height?: number;
  /** The raw CSS `border-radius`, including the elliptical `/` form. */
  radius?: string;
  background?: string;
  /** CSS blur radius in px — folded into a gradient falloff when drawn. */
  blur?: number;
  rotate?: number;
  opacity?: number;
  shadow?: string;
  mask?: string;
  children?: TaskSceneLayer[];
  /**
   * A run of type inside the box. Exactly one layer in the whole art corpus
   * carries one — the gold `?` on `Lesson 21`'s plate — and without it the
   * app paints an empty card where the canvas paints a glyph.
   */
  text?: { s: string; size: number; weight: string; color: string };
}

export type TaskSceneLayer = TaskSceneBox | TaskSceneSvg;

/** The box the canvas composes every scene against. */
export const TASK_SCENE_W = 340;
export const TASK_SCENE_H = 200;

export const TASK_SCENES: Record<number, TaskSceneLayer[]> = {
  "1": [
    {
      "kind": "box",
      "left": 43,
      "top": 31,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#C5C4BD",
      "mask": "radial-gradient(circle at 15.299999999999999px 5.58px, transparent 7.0200000000000005px, #000 7.38px)"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": 30,
      "top": 74,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 158,
      "width": 400,
      "height": 72,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 29,
      "top": 155,
      "width": 118,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 28,
      "top": 96,
      "width": 10,
      "height": 62,
      "radius": "5px 5px 3px 3px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 36,
      "top": 126,
      "width": 104,
      "height": 24,
      "radius": "6px 10px 5px 5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 70,
      "top": 124,
      "width": 70,
      "height": 26,
      "radius": "12px 12px 5px 4px",
      "background": "#C9C8C1"
    },
    {
      "kind": "box",
      "left": 76,
      "top": 130,
      "width": 56,
      "height": 4,
      "radius": "2px",
      "background": "rgba(255,255,255,0.55)"
    },
    {
      "kind": "box",
      "left": 40,
      "top": 117,
      "width": 28,
      "height": 14,
      "radius": "7px 7px 5px 5px",
      "background": "#FFFFFF",
      "shadow": "inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 38,
      "top": 150,
      "width": 6,
      "height": 8,
      "radius": "0 0 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 150,
      "width": 6,
      "height": 8,
      "radius": "0 0 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 54,
      "width": 64,
      "height": 104,
      "radius": "6px 6px 0 0",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 6px #E4E3DE, 0 6px 14px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 204,
      "top": 62,
      "width": 42,
      "height": 96,
      "background": "linear-gradient(90deg, rgba(233,210,164,0.8) 0%, rgba(243,227,196,0.3) 55%, rgba(244,243,240,0.12) 100%)"
    },
    {
      "kind": "box",
      "left": 240,
      "top": 60,
      "width": 20,
      "height": 98,
      "radius": "2px",
      "background": "#D6D5D0",
      "shadow": "-4px 3px 7px rgba(40,38,32,0.16)"
    },
    {
      "kind": "box",
      "left": 244,
      "top": 99.75999999999999,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "#8A857C"
    },
    {
      "kind": "box",
      "left": 200,
      "top": 158,
      "width": 84,
      "height": 12,
      "background": "linear-gradient(100deg, rgba(233,210,164,0.5), rgba(233,210,164,0.06))"
    },
    {
      "kind": "box",
      "left": 193,
      "top": 160,
      "width": 82,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 283,
      "top": 160,
      "width": 38,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 282,
      "top": 136,
      "width": 40,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 289,
      "top": 144,
      "width": 5,
      "height": 20,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 310,
      "top": 144,
      "width": 5,
      "height": 20,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 285,
      "top": 113,
      "width": 34,
      "height": 34,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 279,
      "top": 135,
      "width": 46,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 284,
      "top": 127,
      "width": 36,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 129.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    },
    {
      "kind": "box",
      "left": 258,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    }
  ],
  "2": [
    {
      "kind": "box",
      "left": 50,
      "top": 44,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 304,
      "top": 34,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 164,
      "width": 400,
      "height": 66,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 48.16,
      "top": 165,
      "width": 95.68,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 44,
      "top": 130,
      "width": 104,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 54,
      "top": 139,
      "width": 6,
      "height": 32,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 132,
      "top": 139,
      "width": 6,
      "height": 32,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 63,
      "top": 129,
      "width": 66,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 67,
      "top": 114,
      "width": 29,
      "height": 16,
      "radius": "6px 2px 2px 4px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 114,
      "width": 29,
      "height": 16,
      "radius": "2px 6px 4px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 95,
      "top": 113,
      "width": 2,
      "height": 15,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 119,
      "width": 16,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 102,
      "top": 119,
      "width": 16,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 218.15,
      "top": 166,
      "width": 43.699999999999996,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 217,
      "top": 138,
      "width": 46,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 224,
      "top": 146,
      "width": 5,
      "height": 24,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 251,
      "top": 146,
      "width": 5,
      "height": 24,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 210,
      "top": 134,
      "width": 60,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 214,
      "top": 78,
      "width": 52,
      "height": 52,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 219,
      "top": 83,
      "width": 42,
      "height": 42,
      "radius": "50%",
      "background": "conic-gradient(#E9D2A4 0deg 125.99999999999999deg, rgba(0,0,0,0) 125.99999999999999deg 360deg)"
    },
    {
      "kind": "box",
      "left": 238.6,
      "top": 83,
      "width": 2.8,
      "height": 21,
      "radius": "1.5px",
      "background": "#55534E",
      "rotate": 125.99999999999999
    },
    {
      "kind": "box",
      "left": 237.5,
      "top": 101.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 235,
      "top": 71,
      "width": 10,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 66,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "rgba(226,186,120,0.6)"
    },
    {
      "kind": "svg",
      "left": 38,
      "top": 84,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:38px; top:84px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "3": [
    {
      "kind": "box",
      "left": 241,
      "top": 5,
      "width": 90,
      "height": 90,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 271,
      "top": 35,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 180,
      "top": 28,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -80,
      "top": 118,
      "width": 300,
      "height": 112,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 128,
      "width": 300,
      "height": 102,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 148,
      "width": 430,
      "height": 82,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "svg",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "viewBox": "0 0 340 200",
      "svg": {
        "attrs": {
          "width": "340",
          "height": "200",
          "viewBox": "0 0 340 200",
          "style": "position:absolute; left:0px; top:0px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M90 206 Q 140 156 182 161 T 249.5 128 L 258.5 128 Q 212 169 192 181 T 130 206 Z",
              "fill": "#DDDCD5"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 30.35,
      "top": 166,
      "width": 51.3,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 53.625,
      "top": 133.7,
      "width": 4.75,
      "height": 32.3,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 32.25,
      "top": 109,
      "width": 30.4,
      "height": 30.4,
      "radius": "50%",
      "background": "#C9CEC1"
    },
    {
      "kind": "box",
      "left": 48.4,
      "top": 97.60000000000001,
      "width": 32.3,
      "height": 32.3,
      "radius": "50%",
      "background": "#D3D7CB"
    },
    {
      "kind": "box",
      "left": 46.5,
      "top": 116.6,
      "width": 32.3,
      "height": 28.5,
      "radius": "50%",
      "background": "#BEC4B4"
    },
    {
      "kind": "box",
      "left": 38.900000000000006,
      "top": 103.30000000000001,
      "width": 24.7,
      "height": 24.7,
      "radius": "50%",
      "background": "#CDD2C5"
    },
    {
      "kind": "box",
      "left": 285.26,
      "top": 150,
      "width": 33.48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 300.45,
      "top": 128.92000000000002,
      "width": 3.1,
      "height": 21.08,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 286.5,
      "top": 112.8,
      "width": 19.84,
      "height": 19.84,
      "radius": "50%",
      "background": "#C9CEC1"
    },
    {
      "kind": "box",
      "left": 297.04,
      "top": 105.36,
      "width": 21.08,
      "height": 21.08,
      "radius": "50%",
      "background": "#D3D7CB"
    },
    {
      "kind": "box",
      "left": 295.8,
      "top": 117.75999999999999,
      "width": 21.08,
      "height": 18.6,
      "radius": "50%",
      "background": "#BEC4B4"
    },
    {
      "kind": "box",
      "left": 290.84,
      "top": 109.08,
      "width": 16.12,
      "height": 16.12,
      "radius": "50%",
      "background": "#CDD2C5"
    },
    {
      "kind": "box",
      "left": 183,
      "top": 158,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 190.56,
      "top": 118,
      "width": 10.88,
      "height": 10.88,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 189.54,
      "top": 130.88,
      "width": 12.92,
      "height": 21.119999999999997,
      "radius": "6.46px 6.46px 2.72px 2.72px",
      "background": "#55534E"
    },
    {
      "kind": "svg",
      "left": 120,
      "top": 64,
      "width": 16,
      "height": 8,
      "viewBox": "0 0 16 8",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "8",
          "viewBox": "0 0 16 8",
          "style": "position:absolute; left:120px; top:64px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 146,
      "top": 74,
      "width": 12.8,
      "height": 6.4,
      "viewBox": "0 0 12.8 6.4",
      "svg": {
        "attrs": {
          "width": "12.8",
          "height": "6.4",
          "viewBox": "0 0 12.8 6.4",
          "style": "position:absolute; left:146px; top:74px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 4.800000000000001 Q3.6 1.2000000000000002 6.4 4 Q9.200000000000001 1.2000000000000002 12 4.800000000000001",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "4": [
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 44,
      "top": 38,
      "width": 58,
      "height": 74,
      "radius": "6px",
      "background": "#EAF0F5",
      "shadow": "0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 71,
      "top": 38,
      "width": 4,
      "height": 74,
      "background": "#E4E3DE"
    },
    {
      "kind": "box",
      "left": 44,
      "top": 72,
      "width": 58,
      "height": 4,
      "background": "#E4E3DE"
    },
    {
      "kind": "box",
      "left": 80,
      "top": 50,
      "width": 10,
      "height": 10,
      "radius": "50%",
      "background": "rgba(226,186,120,0.9)"
    },
    {
      "kind": "box",
      "left": 68,
      "top": 38,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 37,
      "top": 112,
      "width": 72,
      "height": 7,
      "radius": "3px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 167.44,
      "top": 167,
      "width": 125.12,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 162,
      "top": 122,
      "width": 136,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 172,
      "top": 131,
      "width": 6,
      "height": 42,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 282,
      "top": 131,
      "width": 6,
      "height": 42,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 176,
      "top": 92,
      "width": 46,
      "height": 30,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 184,
      "top": 101,
      "width": 20.7,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 184,
      "top": 110,
      "width": 22,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 234,
      "top": 108,
      "width": 36,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -24,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 234,
      "top": 108,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 234,
      "top": 108.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 274.08,
      "top": 82,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 292.92,
      "top": 82,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": 24
    },
    {
      "kind": "box",
      "left": 272,
      "top": 88,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.4px #55534E, 0 3px 7px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 276.08,
      "top": 118,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": 20
    },
    {
      "kind": "box",
      "left": 295.92,
      "top": 118,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 286.9,
      "top": 97.28,
      "width": 2.2,
      "height": 6.72,
      "radius": "1px",
      "background": "#55534E",
      "rotate": 40
    },
    {
      "kind": "box",
      "left": 286.9,
      "top": 94.08,
      "width": 2.2,
      "height": 9.92,
      "radius": "1px",
      "background": "#55534E",
      "rotate": -52
    },
    {
      "kind": "box",
      "left": 286.5,
      "top": 102.5,
      "width": 3,
      "height": 3,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 44,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    }
  ],
  "5": [
    {
      "kind": "box",
      "left": 48,
      "top": 50,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 200,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 89,
      "top": 170,
      "width": 58,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 119,
      "top": 44,
      "width": 6,
      "height": 64,
      "radius": "3px",
      "background": "#B4B1AB",
      "rotate": 9
    },
    {
      "kind": "box",
      "left": 127,
      "top": 29,
      "width": 12,
      "height": 18,
      "radius": "3px",
      "background": "#C6C5C0",
      "rotate": 9
    },
    {
      "kind": "box",
      "left": 105,
      "top": 96,
      "width": 34,
      "height": 34,
      "radius": "50%",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 98,
      "top": 120,
      "width": 46,
      "height": 46,
      "radius": "50%",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 116,
      "top": 130,
      "width": 11,
      "height": 11,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 112,
      "top": 152,
      "width": 20,
      "height": 3,
      "radius": "1.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 120.2,
      "top": 52,
      "width": 1.4,
      "height": 82,
      "background": "rgba(85,83,78,0.35)",
      "rotate": 9
    },
    {
      "kind": "box",
      "left": 96,
      "top": 104,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.32), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 226.15,
      "top": 168,
      "width": 43.699999999999996,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 225,
      "top": 140,
      "width": 46,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 232,
      "top": 148,
      "width": 5,
      "height": 24,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 259,
      "top": 148,
      "width": 5,
      "height": 24,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 222,
      "top": 134,
      "width": 52,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 226,
      "top": 86,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 231,
      "top": 91,
      "width": 34,
      "height": 34,
      "radius": "50%",
      "background": "conic-gradient(#E9D2A4 0deg 118.80000000000001deg, rgba(0,0,0,0) 118.80000000000001deg 360deg)"
    },
    {
      "kind": "box",
      "left": 246.6,
      "top": 91,
      "width": 2.8,
      "height": 17,
      "radius": "1.5px",
      "background": "#55534E",
      "rotate": 118.80000000000001
    },
    {
      "kind": "box",
      "left": 245.5,
      "top": 105.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 243,
      "top": 79,
      "width": 10,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78"
    }
  ],
  "6": [
    {
      "kind": "box",
      "left": 160,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 302,
      "top": 54,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 95,
      "top": 168,
      "width": 150,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 96,
      "top": 142,
      "width": 148,
      "height": 8,
      "radius": "4px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 104,
      "top": 150,
      "width": 6,
      "height": 20,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 230,
      "top": 150,
      "width": 6,
      "height": 20,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 124,
      "top": 96,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 121,
      "top": 114,
      "width": 22,
      "height": 28,
      "radius": "10px 10px 4px 4px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 200,
      "top": 96,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#6B6862"
    },
    {
      "kind": "box",
      "left": 197,
      "top": 114,
      "width": 22,
      "height": 28,
      "radius": "10px 10px 4px 4px",
      "background": "#6B6862"
    },
    {
      "kind": "box",
      "left": 160,
      "top": 127,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#E9D2A4",
      "shadow": "inset 0 0 0 1.5px #E2BA78"
    },
    {
      "kind": "box",
      "left": 179,
      "top": 130,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #E2BA78"
    },
    {
      "kind": "svg",
      "left": 163,
      "top": 115,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:163px; top:115px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 91,
      "top": 54,
      "width": 42,
      "height": 24,
      "radius": "11px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.10)"
    },
    {
      "kind": "box",
      "left": 115,
      "top": 76.5,
      "width": 9,
      "height": 8,
      "background": "#FBFAF7"
    },
    {
      "kind": "box",
      "left": 100,
      "top": 62,
      "width": 20,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 100,
      "top": 69,
      "width": 12,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 181,
      "top": 40,
      "width": 50,
      "height": 28,
      "radius": "11px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.10)"
    },
    {
      "kind": "box",
      "left": 191,
      "top": 66.5,
      "width": 9,
      "height": 8,
      "background": "#FBFAF7"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 48,
      "width": 28,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 55,
      "width": 20,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 226,
      "top": 50,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "rgba(226,186,120,0.8)"
    }
  ],
  "7": [
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 240,
      "top": 26,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -80,
      "top": 124,
      "width": 300,
      "height": 106,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 134,
      "width": 300,
      "height": 96,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 152,
      "width": 430,
      "height": 78,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "box",
      "left": 48,
      "top": 176.96,
      "width": 44,
      "height": 14.08,
      "radius": "50%",
      "background": "#DDDCD5",
      "shadow": "inset 0 -2px 0 rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 98,
      "top": 169.6,
      "width": 40,
      "height": 12.8,
      "radius": "50%",
      "background": "#DDDCD5",
      "shadow": "inset 0 -2px 0 rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 142,
      "top": 161.24,
      "width": 36,
      "height": 11.52,
      "radius": "50%",
      "background": "#DDDCD5",
      "shadow": "inset 0 -2px 0 rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 180,
      "top": 152.88,
      "width": 32,
      "height": 10.24,
      "radius": "50%",
      "background": "#DDDCD5",
      "shadow": "inset 0 -2px 0 rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 212,
      "top": 144.52,
      "width": 28,
      "height": 8.96,
      "radius": "50%",
      "background": "#DDDCD5",
      "shadow": "inset 0 -2px 0 rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 239.5,
      "top": 137,
      "width": 25,
      "height": 8,
      "radius": "50%",
      "background": "#DDDCD5",
      "shadow": "inset 0 -2px 0 rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 258,
      "top": 115,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 265,
      "top": 129.48,
      "width": 22,
      "height": 7.04,
      "radius": "50%",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 277,
      "top": 128,
      "width": 30,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 290.5,
      "top": 90,
      "width": 3,
      "height": 40,
      "radius": "1.5px",
      "background": "#8A857C"
    },
    {
      "kind": "box",
      "left": 293.5,
      "top": 90,
      "width": 26,
      "height": 16,
      "radius": "2px 3px 3px 2px",
      "background": "#E9D2A4",
      "shadow": "inset -2px -2px 0 rgba(0,0,0,0.05)"
    },
    {
      "kind": "box",
      "left": 288.5,
      "top": 86.5,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "svg",
      "left": 130,
      "top": 58,
      "width": 16,
      "height": 8,
      "viewBox": "0 0 16 8",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "8",
          "viewBox": "0 0 16 8",
          "style": "position:absolute; left:130px; top:58px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "8": [
    {
      "kind": "box",
      "left": 52,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 40,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 87,
      "top": 63,
      "width": 166,
      "height": 2,
      "radius": "1px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 69,
      "top": 55,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 3px 7px rgba(40,38,32,0.1)"
    },
    {
      "kind": "svg",
      "left": 72,
      "top": 58.5,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:72px; top:58.5px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 99,
      "top": 55,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 3px 7px rgba(40,38,32,0.1)"
    },
    {
      "kind": "svg",
      "left": 102,
      "top": 58.5,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:102px; top:58.5px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 129,
      "top": 55,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 3px 7px rgba(40,38,32,0.1)"
    },
    {
      "kind": "svg",
      "left": 132,
      "top": 58.5,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:132px; top:58.5px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 159,
      "top": 55,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 3px 7px rgba(40,38,32,0.1)"
    },
    {
      "kind": "svg",
      "left": 162,
      "top": 58.5,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:162px; top:58.5px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 189,
      "top": 55,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 3px 7px rgba(40,38,32,0.1)"
    },
    {
      "kind": "svg",
      "left": 192,
      "top": 58.5,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:192px; top:58.5px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 219,
      "top": 55,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 3px 7px rgba(40,38,32,0.1)"
    },
    {
      "kind": "svg",
      "left": 222,
      "top": 58.5,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:222px; top:58.5px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 244,
      "top": 50,
      "width": 28,
      "height": 28,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 249,
      "top": 55,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 101,
      "top": 169,
      "width": 138,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 95,
      "top": 132,
      "width": 150,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 105,
      "top": 141,
      "width": 6,
      "height": 34,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 229,
      "top": 141,
      "width": 6,
      "height": 34,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 120,
      "top": 131,
      "width": 100,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 124,
      "top": 116,
      "width": 46,
      "height": 16,
      "radius": "6px 2px 2px 4px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 170,
      "top": 116,
      "width": 46,
      "height": 16,
      "radius": "2px 6px 4px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 169,
      "top": 115,
      "width": 2,
      "height": 15,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 131,
      "top": 121,
      "width": 33,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 176,
      "top": 121,
      "width": 33,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 248,
      "top": 117,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 1.5px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 267,
      "top": 120,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #C6C5C0"
    },
    {
      "kind": "svg",
      "left": 251,
      "top": 105,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:251px; top:105px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "9": [
    {
      "kind": "box",
      "left": 300,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 46,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 48,
      "top": 34,
      "width": 214,
      "height": 118,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)"
    },
    {
      "kind": "svg",
      "left": 48,
      "top": 34,
      "width": 214,
      "height": 118,
      "viewBox": "0 0 214 118",
      "svg": {
        "attrs": {
          "width": "214",
          "height": "118",
          "viewBox": "0 0 214 118",
          "style": "position:absolute; left:48px; top:34px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M22 62 L64 44 L96 88 L138 60 L178 38",
              "fill": "none",
              "stroke": "#55534E",
              "stroke-width": "2.6",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          },
          {
            "tag": "circle",
            "attrs": {
              "cx": "96",
              "cy": "88",
              "r": "5",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.2"
            }
          },
          {
            "tag": "circle",
            "attrs": {
              "cx": "178",
              "cy": "38",
              "r": "4.5",
              "fill": "#E2BA78"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 210,
      "top": 56,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 268,
      "top": 152,
      "width": 40,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -28,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 268,
      "top": 152,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -28
    },
    {
      "kind": "box",
      "left": 268,
      "top": 152.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -28
    },
    {
      "kind": "box",
      "left": 262,
      "top": 166,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    }
  ],
  "10": [
    {
      "kind": "box",
      "left": 66,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 280,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 178,
      "width": 400,
      "height": 52,
      "radius": "50% 50% 0 0 / 22px 22px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 53,
      "top": 178,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 58,
      "top": 144,
      "width": 15,
      "height": 34,
      "radius": "3px",
      "background": "#C6C5C0",
      "rotate": 76
    },
    {
      "kind": "box",
      "left": 91,
      "top": 178,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 96,
      "top": 144,
      "width": 15,
      "height": 34,
      "radius": "3px",
      "background": "#C6C5C0",
      "rotate": 68
    },
    {
      "kind": "box",
      "left": 127,
      "top": 178,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 132,
      "top": 144,
      "width": 15,
      "height": 34,
      "radius": "3px",
      "background": "#C0BFB8",
      "rotate": 58
    },
    {
      "kind": "box",
      "left": 158,
      "top": 138,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 165,
      "top": 178,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 170,
      "top": 142,
      "width": 16,
      "height": 36,
      "radius": "3px",
      "background": "#E9D2A4",
      "shadow": "inset -2px 0 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 205,
      "top": 178,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 210,
      "top": 144,
      "width": 15,
      "height": 34,
      "radius": "3px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 233,
      "top": 178,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 238,
      "top": 144,
      "width": 15,
      "height": 34,
      "radius": "3px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 261,
      "top": 178,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 266,
      "top": 144,
      "width": 15,
      "height": 34,
      "radius": "3px",
      "background": "#D6D5D0"
    }
  ],
  "11": [
    {
      "kind": "box",
      "left": 170,
      "top": 26,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 174,
      "width": 400,
      "height": 56,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 44,
      "top": 56,
      "width": 100,
      "height": 100,
      "radius": "12px",
      "background": "#FBFAF7",
      "opacity": 0.85,
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 6px 14px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 90,
      "width": 14,
      "height": 46,
      "radius": "4px 4px 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 82,
      "top": 106,
      "width": 14,
      "height": 30,
      "radius": "4px 4px 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 104,
      "top": 98,
      "width": 14,
      "height": 38,
      "radius": "4px 4px 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 140,
      "width": 68,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0"
    },
    {
      "kind": "svg",
      "left": 155,
      "top": 92,
      "width": 30,
      "height": 22,
      "viewBox": "0 0 30 22",
      "svg": {
        "attrs": {
          "width": "30",
          "height": "22",
          "viewBox": "0 0 30 22",
          "style": "position:absolute; left:155px; top:92px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 11h18M15 4l7 7-7 7",
              "fill": "none",
              "stroke": "#B4B1AB",
              "stroke-width": "2.6",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 196,
      "top": 44,
      "width": 100,
      "height": 112,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 212,
      "top": 96,
      "width": 14,
      "height": 34,
      "radius": "4px 4px 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 234,
      "top": 82,
      "width": 14,
      "height": 48,
      "radius": "4px 4px 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 256,
      "top": 68,
      "width": 14,
      "height": 62,
      "radius": "4px 4px 2px 2px",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 262,
      "top": 72,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 212,
      "top": 140,
      "width": 68,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0"
    }
  ],
  "12": [
    {
      "kind": "box",
      "left": 56,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 170,
      "width": 400,
      "height": 60,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 56,
      "top": 56,
      "width": 228,
      "height": 70,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 169,
      "top": 66,
      "width": 2,
      "height": 50,
      "radius": "1px",
      "background": "#E4E3DE"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 74,
      "width": 66,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 86,
      "width": 80,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 98,
      "width": 56,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "svg",
      "left": 160,
      "top": 82,
      "width": 22,
      "height": 16,
      "viewBox": "0 0 22 16",
      "svg": {
        "attrs": {
          "width": "22",
          "height": "16",
          "viewBox": "0 0 22 16",
          "style": "position:absolute; left:160px; top:82px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 8h14M11 3l6 5-6 5",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 190,
      "top": 74,
      "width": 60,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 86,
      "width": 76,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 98,
      "width": 50,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 202,
      "top": 58,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 216,
      "top": 152,
      "width": 42,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -24,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 216,
      "top": 152,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 216,
      "top": 152.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 211,
      "top": 166,
      "width": 46,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    }
  ],
  "13": [
    {
      "kind": "box",
      "left": 23,
      "top": 11,
      "width": 86,
      "height": 86,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 53,
      "top": 41,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 44,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 162,
      "width": 400,
      "height": 68,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#E7EAE0"
    },
    {
      "kind": "box",
      "left": 186,
      "top": 164,
      "width": 48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 195,
      "top": 156,
      "width": 30,
      "height": 9,
      "radius": "50%",
      "background": "#D8D3C8"
    },
    {
      "kind": "box",
      "left": 208.5,
      "top": 134,
      "width": 3,
      "height": 26,
      "radius": "1.5px",
      "background": "#A9AF9E"
    },
    {
      "kind": "box",
      "left": 188,
      "top": 108,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 196,
      "top": 124,
      "width": 13,
      "height": 18,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#BEC4B4",
      "rotate": -28
    },
    {
      "kind": "box",
      "left": 212,
      "top": 122,
      "width": 13,
      "height": 19,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#E9D2A4",
      "rotate": 24
    },
    {
      "kind": "box",
      "left": 204,
      "top": 112,
      "width": 11,
      "height": 15,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#C9CEC1",
      "rotate": -3
    },
    {
      "kind": "svg",
      "left": 120,
      "top": 64,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:120px; top:64px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "14": [
    {
      "kind": "box",
      "left": 58.5,
      "top": 29.5,
      "width": 28.9,
      "height": 18.7,
      "radius": "50%",
      "background": "#D2D1CB"
    },
    {
      "kind": "box",
      "left": 72.1,
      "top": 21,
      "width": 34,
      "height": 27.2,
      "radius": "50%",
      "background": "#D2D1CB"
    },
    {
      "kind": "box",
      "left": 90.8,
      "top": 31.2,
      "width": 25.5,
      "height": 17,
      "radius": "50%",
      "background": "#D2D1CB"
    },
    {
      "kind": "box",
      "left": 58.5,
      "top": 39.7,
      "width": 57.8,
      "height": 8.5,
      "radius": "8px",
      "background": "#D2D1CB"
    },
    {
      "kind": "box",
      "left": 52,
      "top": 58,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.75
    },
    {
      "kind": "box",
      "left": 68,
      "top": 66,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.55
    },
    {
      "kind": "box",
      "left": 84,
      "top": 58,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.75
    },
    {
      "kind": "box",
      "left": 100,
      "top": 66,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.55
    },
    {
      "kind": "box",
      "left": 116,
      "top": 58,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.75
    },
    {
      "kind": "box",
      "left": -80,
      "top": 126,
      "width": 300,
      "height": 104,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 136,
      "width": 300,
      "height": 94,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 152,
      "width": 430,
      "height": 78,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "box",
      "left": 203,
      "top": 158,
      "width": 30,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 212.88,
      "top": 114,
      "width": 10.24,
      "height": 10.24,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 211.92,
      "top": 126.24,
      "width": 12.16,
      "height": 19.759999999999998,
      "radius": "6.08px 6.08px 2.56px 2.56px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 226,
      "top": 88,
      "width": 2.5,
      "height": 34,
      "radius": "1px",
      "background": "#8A857C",
      "rotate": 10
    },
    {
      "kind": "box",
      "left": 196,
      "top": 68,
      "width": 62,
      "height": 26,
      "radius": "31px 31px 4px 4px",
      "background": "#E9D2A4",
      "rotate": 6,
      "shadow": "inset 0 -3px 0 rgba(196,152,86,0.45)"
    },
    {
      "kind": "box",
      "left": 198,
      "top": 93,
      "width": 14,
      "height": 6,
      "radius": "0 0 7px 7px",
      "background": "#F7F6F2",
      "rotate": 6
    },
    {
      "kind": "box",
      "left": 218,
      "top": 95,
      "width": 14,
      "height": 6,
      "radius": "0 0 7px 7px",
      "background": "#F7F6F2",
      "rotate": 6
    },
    {
      "kind": "box",
      "left": 238,
      "top": 97,
      "width": 14,
      "height": 6,
      "radius": "0 0 7px 7px",
      "background": "#F7F6F2",
      "rotate": 6
    },
    {
      "kind": "box",
      "left": 194,
      "top": 56,
      "width": 52,
      "height": 52,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.3), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 296,
      "top": 52,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:296px; top:52px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "15": [
    {
      "kind": "box",
      "left": 150,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 46,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "svg",
      "left": 216,
      "top": 38,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:216px; top:38px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": -30,
      "top": 176,
      "width": 400,
      "height": 54,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "svg",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "viewBox": "0 0 340 200",
      "svg": {
        "attrs": {
          "width": "340",
          "height": "200",
          "viewBox": "0 0 340 200",
          "style": "position:absolute; left:0px; top:0px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M74 176 Q180 44 306 176 Z",
              "fill": "#E7E6E0"
            }
          },
          {
            "tag": "path",
            "attrs": {
              "d": "M96 156 Q186 62 282 158",
              "fill": "none",
              "stroke": "#B4B1AB",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 8"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 237,
      "top": 109,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 247,
      "top": 119,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 31.1,
      "top": 176,
      "width": 41.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 30,
      "top": 148,
      "width": 44,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 37,
      "top": 156,
      "width": 5,
      "height": 24,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 62,
      "top": 156,
      "width": 5,
      "height": 24,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 28,
      "top": 147,
      "width": 48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 33,
      "top": 139,
      "width": 38,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 46,
      "top": 141.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    }
  ],
  "16": [
    {
      "kind": "box",
      "left": 56,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 36,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 170,
      "width": 400,
      "height": 60,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "svg",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "viewBox": "0 0 340 200",
      "svg": {
        "attrs": {
          "width": "340",
          "height": "200",
          "viewBox": "0 0 340 200",
          "style": "position:absolute; left:0px; top:0px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M46 118 Q86 104 126 116 T206 114 T286 108",
              "fill": "none",
              "stroke": "#B4B1AB",
              "stroke-width": "3",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 184,
      "top": 90,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 180,
      "top": 68,
      "width": 48,
      "height": 48,
      "radius": "50%",
      "background": "rgba(251,250,247,0.75)",
      "shadow": "inset 0 0 0 4px #55534E, 0 6px 14px rgba(40,38,32,0.14)"
    },
    {
      "kind": "svg",
      "left": 178,
      "top": 98,
      "width": 52,
      "height": 14,
      "viewBox": "0 0 52 14",
      "svg": {
        "attrs": {
          "width": "52",
          "height": "14",
          "viewBox": "0 0 52 14",
          "style": "position:absolute; left:178px; top:98px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 8 Q26 2 48 6",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "3.4",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 200,
      "top": 94,
      "width": 8,
      "height": 8,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "box",
      "left": 220,
      "top": 108,
      "width": 9,
      "height": 26,
      "radius": "4.5px",
      "background": "#C6C5C0",
      "rotate": -42
    },
    {
      "kind": "box",
      "left": 58,
      "top": 132,
      "width": 44,
      "height": 28,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 66,
      "top": 141,
      "width": 19.8,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 66,
      "top": 150,
      "width": 20,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 112,
      "top": 150,
      "width": 34,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -20,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 112,
      "top": 150,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 112,
      "top": 150.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 106,
      "top": 164,
      "width": 40,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    }
  ],
  "17": [
    {
      "kind": "box",
      "left": 60,
      "top": 42,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 160,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 162,
      "width": 400,
      "height": 68,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 208,
      "top": 54,
      "width": 64,
      "height": 104,
      "radius": "6px 6px 0 0",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 6px #E4E3DE, 0 6px 14px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 216,
      "top": 62,
      "width": 42,
      "height": 96,
      "background": "linear-gradient(90deg, rgba(233,210,164,0.8) 0%, rgba(243,227,196,0.3) 55%, rgba(244,243,240,0.12) 100%)"
    },
    {
      "kind": "box",
      "left": 252,
      "top": 60,
      "width": 20,
      "height": 98,
      "radius": "2px",
      "background": "#D6D5D0",
      "shadow": "-4px 3px 7px rgba(40,38,32,0.16)"
    },
    {
      "kind": "box",
      "left": 256,
      "top": 99.75999999999999,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "#8A857C"
    },
    {
      "kind": "box",
      "left": 212,
      "top": 158,
      "width": 84,
      "height": 12,
      "background": "linear-gradient(100deg, rgba(233,210,164,0.5), rgba(233,210,164,0.06))"
    },
    {
      "kind": "box",
      "left": 205,
      "top": 160,
      "width": 82,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 44,
      "top": 116,
      "width": 70,
      "height": 30,
      "viewBox": "0 0 70 30",
      "svg": {
        "attrs": {
          "width": "70",
          "height": "30",
          "viewBox": "0 0 70 30",
          "style": "position:absolute; left:44px; top:116px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M64 6 Q40 2 22 12 M66 18 Q46 14 30 24",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 7"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 102,
      "top": 159,
      "width": 64,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 102,
      "top": 146,
      "width": 30,
      "height": 12,
      "radius": "9px 5px 2px 3px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 102,
      "top": 155,
      "width": 30,
      "height": 3,
      "radius": "1.5px",
      "background": "#F7F6F2",
      "shadow": "0 1px 1px rgba(0,0,0,0.12)"
    },
    {
      "kind": "box",
      "left": 109,
      "top": 148,
      "width": 6,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(244,243,240,0.55)"
    },
    {
      "kind": "box",
      "left": 136,
      "top": 146,
      "width": 30,
      "height": 12,
      "radius": "9px 5px 2px 3px",
      "background": "#6B6862"
    },
    {
      "kind": "box",
      "left": 136,
      "top": 155,
      "width": 30,
      "height": 3,
      "radius": "1.5px",
      "background": "#F7F6F2",
      "shadow": "0 1px 1px rgba(0,0,0,0.12)"
    },
    {
      "kind": "box",
      "left": 143,
      "top": 148,
      "width": 6,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(244,243,240,0.55)"
    },
    {
      "kind": "box",
      "left": 186,
      "top": 148,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "rgba(226,186,120,0.8)"
    },
    {
      "kind": "svg",
      "left": 288,
      "top": 36,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:288px; top:36px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "18": [
    {
      "kind": "box",
      "left": 52,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 42,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 94.56,
      "top": 169,
      "width": 150.88,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 88,
      "top": 130,
      "width": 164,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 98,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 236,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 144,
      "top": 70,
      "width": 52,
      "height": 52,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 94,
      "top": 128,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 95,
      "top": 76,
      "width": 42,
      "height": 52,
      "radius": "8px",
      "background": "#FBFAF7",
      "rotate": -7,
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 103,
      "top": 94,
      "width": 26,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0",
      "rotate": -7
    },
    {
      "kind": "box",
      "left": 103,
      "top": 103,
      "width": 20,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0",
      "rotate": -7
    },
    {
      "kind": "box",
      "left": 103,
      "top": 112,
      "width": 23,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0",
      "rotate": -7
    },
    {
      "kind": "box",
      "left": 202,
      "top": 128,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 203,
      "top": 76,
      "width": 42,
      "height": 52,
      "radius": "8px",
      "background": "#FBFAF7",
      "rotate": 7,
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 211,
      "top": 94,
      "width": 26,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0",
      "rotate": 7
    },
    {
      "kind": "box",
      "left": 211,
      "top": 103,
      "width": 20,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0",
      "rotate": 7
    },
    {
      "kind": "box",
      "left": 211,
      "top": 112,
      "width": 23,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0",
      "rotate": 7
    },
    {
      "kind": "box",
      "left": 148,
      "top": 122,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 149,
      "top": 70,
      "width": 42,
      "height": 52,
      "radius": "8px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 149,
      "top": 70,
      "width": 42,
      "height": 9,
      "radius": "8px 8px 0 0",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 157,
      "top": 88,
      "width": 26,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 157,
      "top": 97,
      "width": 20,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 157,
      "top": 106,
      "width": 23,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0"
    }
  ],
  "19": [
    {
      "kind": "box",
      "left": 170,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 178,
      "width": 400,
      "height": 52,
      "radius": "50% 50% 0 0 / 18px 18px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 37,
      "top": 134,
      "width": 50,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 35,
      "top": 78,
      "width": 54,
      "height": 54,
      "radius": "14px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 51,
      "top": 100,
      "width": 22,
      "height": 10,
      "radius": "2px 2px 11px 11px",
      "shadow": "inset 0 0 0 2.2px #55534E"
    },
    {
      "kind": "box",
      "left": 56,
      "top": 94,
      "width": 2,
      "height": 4,
      "radius": "1px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 66,
      "top": 94,
      "width": 2,
      "height": 4,
      "radius": "1px",
      "background": "#B4B1AB"
    },
    {
      "kind": "svg",
      "left": 56,
      "top": 142,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:56px; top:142px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.4",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 109,
      "top": 134,
      "width": 50,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 107,
      "top": 78,
      "width": 54,
      "height": 54,
      "radius": "14px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 127,
      "top": 94,
      "width": 14,
      "height": 20,
      "background": "#55534E"
    },
    {
      "kind": "svg",
      "left": 128,
      "top": 142,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:128px; top:142px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.4",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 181,
      "top": 134,
      "width": 50,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 179,
      "top": 78,
      "width": 54,
      "height": 54,
      "radius": "14px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 195,
      "top": 98,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 208,
      "top": 98,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 195,
      "top": 108,
      "width": 22,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#B4B1AB"
    },
    {
      "kind": "svg",
      "left": 200,
      "top": 142,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:200px; top:142px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.4",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 253,
      "top": 134,
      "width": 50,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 251,
      "top": 78,
      "width": 54,
      "height": 54,
      "radius": "14px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 270,
      "top": 96,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#55534E",
      "mask": "radial-gradient(circle at 13.6px 4.96px, transparent 6.24px, #000 6.56px)"
    },
    {
      "kind": "svg",
      "left": 272,
      "top": 142,
      "width": 12,
      "height": 11,
      "viewBox": "0 0 12 11",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "11",
          "viewBox": "0 0 12 11",
          "style": "position:absolute; left:272px; top:142px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5.5l3 3 5.4-6.6",
              "stroke": "#E2BA78",
              "stroke-width": "2.4",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    }
  ],
  "20": [
    {
      "kind": "box",
      "left": 60,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 36,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 22px 22px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 146.25,
      "top": 178,
      "width": 47.5,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 145,
      "top": 148,
      "width": 50,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 152,
      "top": 156,
      "width": 5,
      "height": 26,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 183,
      "top": 156,
      "width": 5,
      "height": 26,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 144,
      "top": 147,
      "width": 52,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 149,
      "top": 139,
      "width": 42,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 164,
      "top": 141.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    },
    {
      "kind": "svg",
      "left": 110,
      "top": 40,
      "width": 120,
      "height": 84,
      "viewBox": "0 0 120 84",
      "svg": {
        "attrs": {
          "width": "120",
          "height": "84",
          "viewBox": "0 0 120 84",
          "style": "position:absolute; left:110px; top:40px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M18 78 A46 46 0 0 1 102 78",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.6",
              "stroke-linecap": "round",
              "opacity": "0.8"
            }
          },
          {
            "tag": "path",
            "attrs": {
              "d": "M34 74 A30 30 0 0 1 86 74",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "opacity": "0.5"
            }
          },
          {
            "tag": "path",
            "attrs": {
              "d": "M48 70 A16 16 0 0 1 72 70",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.2",
              "stroke-linecap": "round",
              "opacity": "0.3"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 157,
      "top": 31,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 166,
      "top": 39,
      "width": 8,
      "height": 8,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "svg",
      "left": 70,
      "top": 64,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:70px; top:64px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "21": [
    {
      "kind": "box",
      "left": 56,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 64,
      "top": 158,
      "width": 80,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 67,
      "top": 66,
      "width": 74,
      "height": 92,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 7px 16px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 93,
      "top": 88,
      "width": 22,
      "height": 36,
      "radius": "5px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 2px #2A2E35"
    },
    {
      "kind": "box",
      "left": 100,
      "top": 92,
      "width": 8,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.25)"
    },
    {
      "kind": "box",
      "left": 88,
      "top": 134,
      "width": 32,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 158,
      "width": 80,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 199,
      "top": 66,
      "width": 74,
      "height": 92,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 7px 16px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 223,
      "top": 93,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "#C5C4BD",
      "mask": "radial-gradient(circle at 22.099999999999998px 8.06px, transparent 10.14px, #000 10.66px)"
    },
    {
      "kind": "box",
      "left": 220,
      "top": 134,
      "width": 32,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "svg",
      "left": 167,
      "top": 52,
      "width": 6,
      "height": 104,
      "viewBox": "0 0 6 104",
      "svg": {
        "attrs": {
          "width": "6",
          "height": "104",
          "viewBox": "0 0 6 104",
          "style": "position:absolute; left:167px; top:52px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 4v96",
              "stroke": "#C6C5C0",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 9"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 157,
      "top": 89,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 165,
      "top": 97,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    }
  ],
  "22": [
    {
      "kind": "box",
      "left": 48,
      "top": 42,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 85.6,
      "top": 173,
      "width": 128.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 80,
      "top": 132,
      "width": 140,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 90,
      "top": 141,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 204,
      "top": 141,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 122,
      "top": 131,
      "width": 56,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 127,
      "top": 123,
      "width": 46,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 144,
      "top": 125.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    },
    {
      "kind": "box",
      "left": 216,
      "top": 96,
      "width": 11,
      "height": 11,
      "radius": "50%",
      "opacity": 0.85,
      "shadow": "inset 0 0 0 2.4px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 242,
      "top": 74,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "opacity": 0.55,
      "shadow": "inset 0 0 0 2.2px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 264,
      "top": 54,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "opacity": 0.32,
      "shadow": "inset 0 0 0 2px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 106,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 288,
      "top": 40,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:288px; top:40px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "23": [
    {
      "kind": "box",
      "left": 294,
      "top": 30,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#C5C4BD",
      "mask": "radial-gradient(circle at 13.6px 4.96px, transparent 6.24px, #000 6.56px)"
    },
    {
      "kind": "box",
      "left": 258,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": 330,
      "top": 64,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 164,
      "width": 400,
      "height": 66,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 31,
      "top": 161,
      "width": 118,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 30,
      "top": 102,
      "width": 10,
      "height": 62,
      "radius": "5px 5px 3px 3px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 38,
      "top": 132,
      "width": 104,
      "height": 24,
      "radius": "6px 10px 5px 5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 130,
      "width": 70,
      "height": 26,
      "radius": "12px 12px 5px 4px",
      "background": "#C9C8C1"
    },
    {
      "kind": "box",
      "left": 78,
      "top": 136,
      "width": 56,
      "height": 4,
      "radius": "2px",
      "background": "rgba(255,255,255,0.55)"
    },
    {
      "kind": "box",
      "left": 42,
      "top": 123,
      "width": 28,
      "height": 14,
      "radius": "7px 7px 5px 5px",
      "background": "#FFFFFF",
      "shadow": "inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 40,
      "top": 156,
      "width": 6,
      "height": 8,
      "radius": "0 0 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 132,
      "top": 156,
      "width": 6,
      "height": 8,
      "radius": "0 0 2px 2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 215,
      "top": 84,
      "width": 86,
      "height": 7,
      "radius": "3.5px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 223,
      "top": 91,
      "width": 5,
      "height": 12,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 91,
      "width": 5,
      "height": 12,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 226,
      "top": 83,
      "width": 48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 231,
      "top": 75,
      "width": 38,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 244,
      "top": 77.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    },
    {
      "kind": "box",
      "left": 234,
      "top": 62,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 280,
      "top": 76,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "rgba(226,186,120,0.9)"
    },
    {
      "kind": "box",
      "left": 120,
      "top": 52,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    }
  ],
  "24": [
    {
      "kind": "box",
      "left": 292,
      "top": 32,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#C5C4BD",
      "mask": "radial-gradient(circle at 13.6px 4.96px, transparent 6.24px, #000 6.56px)"
    },
    {
      "kind": "box",
      "left": 258,
      "top": 58,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 55.75999999999999,
      "top": 169,
      "width": 132.48000000000002,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 50,
      "top": 124,
      "width": 144,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 133,
      "width": 6,
      "height": 42,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 178,
      "top": 133,
      "width": 6,
      "height": 42,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 76,
      "top": 111,
      "width": 32,
      "height": 13,
      "radius": "3px 3px 16px 16px",
      "background": "#E9D2A4",
      "shadow": "inset 0 0 0 1.6px #E2BA78"
    },
    {
      "kind": "box",
      "left": 82,
      "top": 122,
      "width": 20,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "svg",
      "left": 84,
      "top": 98,
      "width": 16,
      "height": 11,
      "viewBox": "0 0 16 11",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "11",
          "viewBox": "0 0 16 11",
          "style": "position:absolute; left:84px; top:98px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 10 Q2.5 7 4.5 5 Q6.5 3 5 1 M11 10 Q9.5 7 11.5 5 Q13.5 3 12 1",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 144,
      "top": 104,
      "width": 16,
      "height": 20,
      "radius": "2px 2px 5px 5px",
      "background": "rgba(200,215,229,0.4)",
      "shadow": "inset 0 0 0 1.6px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 146,
      "top": 113,
      "width": 12,
      "height": 9,
      "radius": "0 0 4px 4px",
      "background": "#C8D7E5"
    },
    {
      "kind": "box",
      "left": 247.1,
      "top": 172,
      "width": 41.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 246,
      "top": 146,
      "width": 44,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 253,
      "top": 154,
      "width": 5,
      "height": 22,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 278,
      "top": 154,
      "width": 5,
      "height": 22,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 255.32,
      "top": 106,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 271.68,
      "top": 106,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": 24
    },
    {
      "kind": "box",
      "left": 254,
      "top": 112,
      "width": 28,
      "height": 28,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.4px #55534E, 0 3px 7px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 257.32,
      "top": 138,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": 20
    },
    {
      "kind": "box",
      "left": 274.68,
      "top": 138,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 266.9,
      "top": 120.12,
      "width": 2.2,
      "height": 5.88,
      "radius": "1px",
      "background": "#55534E",
      "rotate": 40
    },
    {
      "kind": "box",
      "left": 266.9,
      "top": 117.32,
      "width": 2.2,
      "height": 8.68,
      "radius": "1px",
      "background": "#55534E",
      "rotate": -52
    },
    {
      "kind": "box",
      "left": 266.5,
      "top": 124.5,
      "width": 3,
      "height": 3,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 56,
      "top": 44,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    }
  ],
  "25": [
    {
      "kind": "box",
      "left": 170,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 66,
      "top": 78,
      "width": 92,
      "height": 58,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 87,
      "width": 41.4,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 96,
      "width": 68,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 105,
      "width": 76,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 114,
      "width": 68,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 75,
      "top": 55,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "0 0 0 1px rgba(0,0,0,0.08), 0 3px 7px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 83,
      "top": 61,
      "width": 10,
      "height": 14,
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 182,
      "top": 78,
      "width": 92,
      "height": 58,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 87,
      "width": 41.4,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 96,
      "width": 68,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 105,
      "width": 76,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 114,
      "width": 68,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 191,
      "top": 55,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "0 0 0 1px rgba(0,0,0,0.08), 0 3px 7px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 63,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 205,
      "top": 63,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 71,
      "width": 16,
      "height": 4,
      "radius": "2px 2px 0 0",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 238,
      "top": 158,
      "width": 40,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -22,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 238,
      "top": 158,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -22
    },
    {
      "kind": "box",
      "left": 238,
      "top": 158.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -22
    },
    {
      "kind": "box",
      "left": 234,
      "top": 170,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    }
  ],
  "26": [
    {
      "kind": "box",
      "left": 56,
      "top": 38,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 34,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 170,
      "width": 400,
      "height": 60,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 76,
      "top": 52,
      "width": 120,
      "height": 86,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 104,
      "top": 76,
      "width": 5,
      "height": 40,
      "radius": "2.5px",
      "background": "#55534E",
      "opacity": 0.85
    },
    {
      "kind": "box",
      "left": 117,
      "top": 76,
      "width": 5,
      "height": 40,
      "radius": "2.5px",
      "background": "#55534E",
      "opacity": 0.85
    },
    {
      "kind": "box",
      "left": 130,
      "top": 76,
      "width": 5,
      "height": 40,
      "radius": "2.5px",
      "background": "#55534E",
      "opacity": 0.85
    },
    {
      "kind": "box",
      "left": 143,
      "top": 76,
      "width": 5,
      "height": 40,
      "radius": "2.5px",
      "background": "#55534E",
      "opacity": 0.85
    },
    {
      "kind": "box",
      "left": 96,
      "top": 88,
      "width": 66,
      "height": 6,
      "radius": "3px",
      "background": "#E2BA78",
      "rotate": -26
    },
    {
      "kind": "box",
      "left": 114,
      "top": 72,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 237.1,
      "top": 178,
      "width": 41.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 236,
      "top": 150,
      "width": 44,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 243,
      "top": 158,
      "width": 5,
      "height": 24,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 268,
      "top": 158,
      "width": 5,
      "height": 24,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 234,
      "top": 149,
      "width": 48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 239,
      "top": 141,
      "width": 38,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 252,
      "top": 143.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    }
  ],
  "27": [
    {
      "kind": "box",
      "left": 60,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 170,
      "width": 400,
      "height": 60,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 52,
      "top": 98,
      "width": 48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 56,
      "top": 54,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 61,
      "top": 59,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "conic-gradient(#E9D2A4 0deg 36deg, rgba(0,0,0,0) 36deg 360deg)"
    },
    {
      "kind": "box",
      "left": 74.6,
      "top": 59,
      "width": 2.8,
      "height": 15,
      "radius": "1.5px",
      "background": "#55534E",
      "rotate": 36
    },
    {
      "kind": "box",
      "left": 73.5,
      "top": 71.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 71,
      "top": 47,
      "width": 10,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 192,
      "top": 166,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 206,
      "top": 84,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 203,
      "top": 102,
      "width": 22,
      "height": 34,
      "radius": "10px 10px 6px 6px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 184,
      "top": 92,
      "width": 22,
      "height": 6,
      "radius": "3px",
      "background": "#55534E",
      "rotate": 38
    },
    {
      "kind": "box",
      "left": 222,
      "top": 92,
      "width": 22,
      "height": 6,
      "radius": "3px",
      "background": "#55534E",
      "rotate": -38
    },
    {
      "kind": "box",
      "left": 198,
      "top": 134,
      "width": 20,
      "height": 6,
      "radius": "3px",
      "background": "#55534E",
      "rotate": 52
    },
    {
      "kind": "box",
      "left": 210,
      "top": 134,
      "width": 20,
      "height": 6,
      "radius": "3px",
      "background": "#55534E",
      "rotate": -52
    },
    {
      "kind": "svg",
      "left": 170,
      "top": 66,
      "width": 26,
      "height": 20,
      "viewBox": "0 0 26 20",
      "svg": {
        "attrs": {
          "width": "26",
          "height": "20",
          "viewBox": "0 0 26 20",
          "style": "position:absolute; left:170px; top:66px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M22 18 Q10 14 4 2",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 6"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 232,
      "top": 66,
      "width": 26,
      "height": 20,
      "viewBox": "0 0 26 20",
      "svg": {
        "attrs": {
          "width": "26",
          "height": "20",
          "viewBox": "0 0 26 20",
          "style": "position:absolute; left:232px; top:66px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 18 Q16 14 22 2",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 6"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 184,
      "top": 80,
      "width": 60,
      "height": 60,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.32), rgba(226,186,120,0) 74%)",
      "blur": 5
    }
  ],
  "28": [
    {
      "kind": "box",
      "left": 64,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 44,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 174,
      "width": 400,
      "height": 56,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 48,
      "width": 64,
      "height": 92,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.08), 0 8px 18px rgba(40,38,32,0.13)"
    },
    {
      "kind": "box",
      "left": 158,
      "top": 70,
      "width": 24,
      "height": 44,
      "radius": "12px",
      "background": "#E4E3DE",
      "shadow": "inset 0 0 0 1.5px rgba(0,0,0,0.07)"
    },
    {
      "kind": "box",
      "left": 154,
      "top": 62,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 161,
      "top": 72,
      "width": 18,
      "height": 20,
      "radius": "9px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "svg",
      "left": 216,
      "top": 88,
      "width": 60,
      "height": 18,
      "viewBox": "0 0 60 18",
      "svg": {
        "attrs": {
          "width": "60",
          "height": "18",
          "viewBox": "0 0 60 18",
          "style": "position:absolute; left:216px; top:88px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 9h12M24 9h12M44 9h12",
              "stroke": "#C6C5C0",
              "stroke-width": "3",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 276,
      "top": 82,
      "width": 14,
      "height": 14,
      "viewBox": "0 0 14 14",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "14",
          "viewBox": "0 0 14 14",
          "style": "position:absolute; left:276px; top:82px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 2l7 5-7 5",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "2.6",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 206,
      "top": 60,
      "width": 3.5,
      "height": 3.5,
      "radius": "50%",
      "background": "rgba(226,186,120,0.7)"
    }
  ],
  "29": [
    {
      "kind": "box",
      "left": 56,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 94,
      "top": 44,
      "width": 152,
      "height": 100,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 94,
      "top": 44,
      "width": 152,
      "height": 20,
      "radius": "12px 12px 0 0",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 112,
      "top": 39,
      "width": 4,
      "height": 10,
      "radius": "2px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 224,
      "top": 39,
      "width": 4,
      "height": 10,
      "radius": "2px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 108,
      "top": 74,
      "width": 40,
      "height": 56,
      "radius": "6px",
      "background": "#F1F0EA"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 74,
      "width": 40,
      "height": 56,
      "radius": "6px",
      "background": "#F1F0EA"
    },
    {
      "kind": "box",
      "left": 192,
      "top": 74,
      "width": 40,
      "height": 56,
      "radius": "6px",
      "background": "#F1F0EA"
    },
    {
      "kind": "box",
      "left": 152,
      "top": 78,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 153,
      "top": 86,
      "width": 34,
      "height": 22,
      "radius": "5px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 268.7,
      "top": 111,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 286.3,
      "top": 111,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": 24
    },
    {
      "kind": "box",
      "left": 267,
      "top": 117,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.4px #55534E, 0 3px 7px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 270.7,
      "top": 145,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": 20
    },
    {
      "kind": "box",
      "left": 289.3,
      "top": 145,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 280.9,
      "top": 125.7,
      "width": 2.2,
      "height": 6.3,
      "radius": "1px",
      "background": "#55534E",
      "rotate": 40
    },
    {
      "kind": "box",
      "left": 280.9,
      "top": 122.7,
      "width": 2.2,
      "height": 9.3,
      "radius": "1px",
      "background": "#55534E",
      "rotate": -52
    },
    {
      "kind": "box",
      "left": 280.5,
      "top": 130.5,
      "width": 3,
      "height": 3,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 264,
      "top": 150,
      "width": 36,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    }
  ],
  "30": [
    {
      "kind": "box",
      "left": 48,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 44,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 172,
      "top": 170,
      "width": 100,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 182,
      "top": 104,
      "width": 6,
      "height": 64,
      "radius": "3px",
      "background": "#C6C5C0",
      "rotate": 9
    },
    {
      "kind": "box",
      "left": 256,
      "top": 104,
      "width": 6,
      "height": 64,
      "radius": "3px",
      "background": "#C6C5C0",
      "rotate": -9
    },
    {
      "kind": "box",
      "left": 219,
      "top": 110,
      "width": 6,
      "height": 58,
      "radius": "3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 178,
      "top": 110,
      "width": 88,
      "height": 7,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 184,
      "top": 50,
      "width": 76,
      "height": 60,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.08), 0 6px 14px rgba(40,38,32,0.13)"
    },
    {
      "kind": "svg",
      "left": 184,
      "top": 50,
      "width": 76,
      "height": 60,
      "viewBox": "0 0 76 60",
      "svg": {
        "attrs": {
          "width": "76",
          "height": "60",
          "viewBox": "0 0 76 60",
          "style": "position:absolute; left:184px; top:50px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M14 40 Q28 20 42 32 Q54 42 64 26",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "4",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 208,
      "top": 60,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 192,
      "top": 105,
      "width": 26,
      "height": 5,
      "radius": "2.5px",
      "background": "#E9D2A4",
      "rotate": -14
    },
    {
      "kind": "box",
      "left": 186,
      "top": 109,
      "width": 9,
      "height": 4,
      "radius": "2px",
      "background": "#55534E",
      "rotate": -14
    },
    {
      "kind": "box",
      "left": 56,
      "top": 164,
      "width": 48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 60,
      "top": 120,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 65,
      "top": 125,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "conic-gradient(#E9D2A4 0deg 118.80000000000001deg, rgba(0,0,0,0) 118.80000000000001deg 360deg)"
    },
    {
      "kind": "box",
      "left": 78.6,
      "top": 125,
      "width": 2.8,
      "height": 15,
      "radius": "1.5px",
      "background": "#55534E",
      "rotate": 118.80000000000001
    },
    {
      "kind": "box",
      "left": 77.5,
      "top": 137.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 75,
      "top": 113,
      "width": 10,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78"
    },
    {
      "kind": "svg",
      "left": 120,
      "top": 50,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:120px; top:50px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "31": [
    {
      "kind": "box",
      "left": 60,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 28,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 101,
      "top": 169,
      "width": 138,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 95,
      "top": 128,
      "width": 150,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 105,
      "top": 137,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 229,
      "top": 137,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 142,
      "top": 104,
      "width": 56,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 142,
      "top": 108,
      "width": 56,
      "height": 18,
      "radius": "0 0 5px 5px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 142,
      "top": 104,
      "width": 20,
      "height": 5,
      "radius": "3px 3px 0 0",
      "background": "#C6C5C0"
    },
    {
      "kind": "svg",
      "left": 80,
      "top": 34,
      "width": 180,
      "height": 110,
      "viewBox": "0 0 180 110",
      "svg": {
        "attrs": {
          "width": "180",
          "height": "110",
          "viewBox": "0 0 180 110",
          "style": "position:absolute; left:80px; top:34px;"
        },
        "children": [
          {
            "tag": "ellipse",
            "attrs": {
              "cx": "90",
              "cy": "66",
              "rx": "78",
              "ry": "38",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.4",
              "stroke-dasharray": "2 8",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 152,
      "top": 78,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 165,
      "top": 88,
      "width": 10,
      "height": 10,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "svg",
      "left": 196,
      "top": 44,
      "width": 16,
      "height": 14,
      "viewBox": "0 0 16 14",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "14",
          "viewBox": "0 0 16 14",
          "style": "position:absolute; left:196px; top:44px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M2 2l8 4-5 7",
              "fill": "none",
              "stroke": "#B4B1AB",
              "stroke-width": "2.2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    }
  ],
  "33": [
    {
      "kind": "box",
      "left": 236,
      "top": 0,
      "width": 88,
      "height": 88,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 266,
      "top": 30,
      "width": 28,
      "height": 28,
      "radius": "50%",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 80,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "svg",
      "left": 126,
      "top": 48,
      "width": 16,
      "height": 8,
      "viewBox": "0 0 16 8",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "8",
          "viewBox": "0 0 16 8",
          "style": "position:absolute; left:126px; top:48px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 152,
      "top": 58,
      "width": 12.8,
      "height": 6.4,
      "viewBox": "0 0 12.8 6.4",
      "svg": {
        "attrs": {
          "width": "12.8",
          "height": "6.4",
          "viewBox": "0 0 12.8 6.4",
          "style": "position:absolute; left:152px; top:58px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 4.800000000000001 Q3.6 1.2000000000000002 6.4 4 Q9.200000000000001 1.2000000000000002 12 4.800000000000001",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": -80,
      "top": 118,
      "width": 300,
      "height": 112,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 128,
      "width": 300,
      "height": 102,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 148,
      "width": 430,
      "height": 82,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "svg",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "viewBox": "0 0 340 200",
      "svg": {
        "attrs": {
          "width": "340",
          "height": "200",
          "viewBox": "0 0 340 200",
          "style": "position:absolute; left:0px; top:0px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M83 206 Q 134 154 183 160 T 258 126 L 266 126 Q 213 168 193 180 T 125 206 Z",
              "fill": "#DDDCD5"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 261,
      "top": 122,
      "width": 30,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 274.5,
      "top": 86,
      "width": 3,
      "height": 38,
      "radius": "1.5px",
      "background": "#8A857C"
    },
    {
      "kind": "box",
      "left": 277.5,
      "top": 86,
      "width": 26,
      "height": 16,
      "radius": "2px 3px 3px 2px",
      "background": "#E9D2A4",
      "shadow": "inset -2px -2px 0 rgba(0,0,0,0.05)"
    },
    {
      "kind": "box",
      "left": 272.5,
      "top": 82.5,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 264,
      "top": 94,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 30.4,
      "top": 162,
      "width": 43.2,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 50,
      "top": 134.8,
      "width": 4,
      "height": 27.200000000000003,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 32,
      "top": 114,
      "width": 25.6,
      "height": 25.6,
      "radius": "50%",
      "background": "#C9CEC1"
    },
    {
      "kind": "box",
      "left": 45.6,
      "top": 104.4,
      "width": 27.200000000000003,
      "height": 27.200000000000003,
      "radius": "50%",
      "background": "#D3D7CB"
    },
    {
      "kind": "box",
      "left": 44,
      "top": 120.4,
      "width": 27.200000000000003,
      "height": 24,
      "radius": "50%",
      "background": "#BEC4B4"
    },
    {
      "kind": "box",
      "left": 37.6,
      "top": 109.19999999999999,
      "width": 20.8,
      "height": 20.8,
      "radius": "50%",
      "background": "#CDD2C5"
    },
    {
      "kind": "box",
      "left": 107,
      "top": 172,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 114.88,
      "top": 134,
      "width": 10.24,
      "height": 10.24,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 113.92,
      "top": 146.24,
      "width": 12.16,
      "height": 19.759999999999998,
      "radius": "6.08px 6.08px 2.56px 2.56px",
      "background": "#55534E"
    }
  ],
  "34": [
    {
      "kind": "box",
      "left": 52,
      "top": 38,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 34,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 170,
      "width": 400,
      "height": 60,
      "radius": "50% 50% 0 0 / 22px 22px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 114,
      "top": 166,
      "width": 64,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 123,
      "top": 160,
      "width": 46,
      "height": 8,
      "radius": "4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 143.5,
      "top": 104,
      "width": 5,
      "height": 56,
      "radius": "2.5px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 84,
      "top": 102.25,
      "width": 124,
      "height": 3.5,
      "radius": "2px",
      "background": "#55534E",
      "rotate": 10
    },
    {
      "kind": "box",
      "left": 142,
      "top": 100,
      "width": 8,
      "height": 8,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 82.4,
      "top": 112.3,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 83.7,
      "top": 114.8,
      "width": 2.5,
      "height": 27,
      "radius": "1px",
      "background": "#6B6862",
      "rotate": 36
    },
    {
      "kind": "box",
      "left": 83.7,
      "top": 114.8,
      "width": 2.5,
      "height": 27,
      "radius": "1px",
      "background": "#6B6862",
      "rotate": -36
    },
    {
      "kind": "box",
      "left": 65.9,
      "top": 135.3,
      "width": 38,
      "height": 11,
      "radius": "3px 3px 19px 19px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.55), 0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 62.941919313243105,
      "top": 116.76618701534969,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 204.6,
      "top": 90.7,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 205.8,
      "top": 93.2,
      "width": 2.5,
      "height": 27,
      "radius": "1px",
      "background": "#6B6862",
      "rotate": 36
    },
    {
      "kind": "box",
      "left": 205.8,
      "top": 93.2,
      "width": 2.5,
      "height": 27,
      "radius": "1px",
      "background": "#6B6862",
      "rotate": -36
    },
    {
      "kind": "box",
      "left": 188.1,
      "top": 113.7,
      "width": 38,
      "height": 11,
      "radius": "3px 3px 19px 19px",
      "background": "#D6D5D0",
      "shadow": "inset 0 -2px 0 rgba(0,0,0,0.08), 0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 274.7,
      "top": 125,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 292.3,
      "top": 125,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": 24
    },
    {
      "kind": "box",
      "left": 273,
      "top": 131,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.4px #55534E, 0 3px 7px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 276.7,
      "top": 159,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": 20
    },
    {
      "kind": "box",
      "left": 295.3,
      "top": 159,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 286.9,
      "top": 139.7,
      "width": 2.2,
      "height": 6.3,
      "radius": "1px",
      "background": "#55534E",
      "rotate": 40
    },
    {
      "kind": "box",
      "left": 286.9,
      "top": 136.7,
      "width": 2.2,
      "height": 9.3,
      "radius": "1px",
      "background": "#55534E",
      "rotate": -52
    },
    {
      "kind": "box",
      "left": 286.5,
      "top": 144.5,
      "width": 3,
      "height": 3,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 270,
      "top": 164,
      "width": 36,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 96,
      "top": 74,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "rgba(226,186,120,0.7)"
    }
  ],
  "35": [
    {
      "kind": "box",
      "left": 52,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 170,
      "width": 400,
      "height": 60,
      "radius": "50% 50% 0 0 / 22px 22px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 166,
      "width": 64,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 147,
      "top": 160,
      "width": 46,
      "height": 8,
      "radius": "4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 167.5,
      "top": 104,
      "width": 5,
      "height": 56,
      "radius": "2.5px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 108,
      "top": 102.25,
      "width": 124,
      "height": 3.5,
      "radius": "2px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 166,
      "top": 100,
      "width": 8,
      "height": 8,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 105.5,
      "top": 101.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 106.8,
      "top": 104,
      "width": 2.5,
      "height": 27,
      "radius": "1px",
      "background": "#6B6862",
      "rotate": 36
    },
    {
      "kind": "box",
      "left": 106.8,
      "top": 104,
      "width": 2.5,
      "height": 27,
      "radius": "1px",
      "background": "#6B6862",
      "rotate": -36
    },
    {
      "kind": "box",
      "left": 89,
      "top": 124.5,
      "width": 38,
      "height": 11,
      "radius": "3px 3px 19px 19px",
      "background": "#D6D5D0",
      "shadow": "inset 0 -2px 0 rgba(0,0,0,0.08), 0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 229.5,
      "top": 101.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 230.8,
      "top": 104,
      "width": 2.5,
      "height": 27,
      "radius": "1px",
      "background": "#6B6862",
      "rotate": 36
    },
    {
      "kind": "box",
      "left": 230.8,
      "top": 104,
      "width": 2.5,
      "height": 27,
      "radius": "1px",
      "background": "#6B6862",
      "rotate": -36
    },
    {
      "kind": "box",
      "left": 213,
      "top": 124.5,
      "width": 38,
      "height": 11,
      "radius": "3px 3px 19px 19px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.55), 0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 210,
      "top": 106,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 230.5,
      "top": 110,
      "width": 3,
      "height": 14,
      "radius": "1.5px",
      "background": "#A9AF9E"
    },
    {
      "kind": "box",
      "left": 221,
      "top": 102,
      "width": 10,
      "height": 14,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#BEC4B4",
      "rotate": -28
    },
    {
      "kind": "box",
      "left": 233,
      "top": 100,
      "width": 10,
      "height": 15,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#C9CEC1",
      "rotate": 24
    },
    {
      "kind": "svg",
      "left": 64,
      "top": 60,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:64px; top:60px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "36": [
    {
      "kind": "box",
      "left": 170,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 45.4,
      "top": 169,
      "width": 101.2,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 41,
      "top": 130,
      "width": 110,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 51,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 135,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 68,
      "top": 130,
      "width": 56,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 72,
      "top": 78,
      "width": 48,
      "height": 48,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 77,
      "top": 83,
      "width": 38,
      "height": 38,
      "radius": "50%",
      "background": "conic-gradient(#E9D2A4 0deg 90deg, rgba(0,0,0,0) 90deg 360deg)"
    },
    {
      "kind": "box",
      "left": 94.6,
      "top": 83,
      "width": 2.8,
      "height": 19,
      "radius": "1.5px",
      "background": "#55534E",
      "rotate": 90
    },
    {
      "kind": "box",
      "left": 93.5,
      "top": 99.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 91,
      "top": 71,
      "width": 10,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 220,
      "top": 64,
      "width": 84,
      "height": 7,
      "radius": "3.5px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 228,
      "top": 71,
      "width": 5,
      "height": 12,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 291,
      "top": 71,
      "width": 5,
      "height": 12,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 231,
      "top": 63,
      "width": 46,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 236,
      "top": 55,
      "width": 36,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 248,
      "top": 57.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    },
    {
      "kind": "box",
      "left": 216,
      "top": 70,
      "width": 2,
      "height": 96,
      "radius": "1px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 40,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    }
  ],
  "37": [
    {
      "kind": "box",
      "left": 64,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 280,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "svg",
      "left": 70,
      "top": 36,
      "width": 200,
      "height": 120,
      "viewBox": "0 0 200 120",
      "svg": {
        "attrs": {
          "width": "200",
          "height": "120",
          "viewBox": "0 0 200 120",
          "style": "position:absolute; left:70px; top:36px;"
        },
        "children": [
          {
            "tag": "ellipse",
            "attrs": {
              "cx": "100",
              "cy": "60",
              "rx": "86",
              "ry": "48",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.6",
              "stroke-dasharray": "2 9",
              "stroke-linecap": "round"
            }
          },
          {
            "tag": "path",
            "attrs": {
              "d": "M186 52l4 10-11 1",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 157,
      "top": 23,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 165,
      "top": 31,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "box",
      "left": 81,
      "top": 120,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "rgba(226,186,120,0.85)"
    },
    {
      "kind": "box",
      "left": 249,
      "top": 120,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "rgba(226,186,120,0.85)"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 159,
      "width": 64,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 138,
      "top": 146,
      "width": 30,
      "height": 12,
      "radius": "9px 5px 2px 3px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 155,
      "width": 30,
      "height": 3,
      "radius": "1.5px",
      "background": "#F7F6F2",
      "shadow": "0 1px 1px rgba(0,0,0,0.12)"
    },
    {
      "kind": "box",
      "left": 145,
      "top": 148,
      "width": 6,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(244,243,240,0.55)"
    },
    {
      "kind": "box",
      "left": 172,
      "top": 146,
      "width": 30,
      "height": 12,
      "radius": "9px 5px 2px 3px",
      "background": "#6B6862"
    },
    {
      "kind": "box",
      "left": 172,
      "top": 155,
      "width": 30,
      "height": 3,
      "radius": "1.5px",
      "background": "#F7F6F2",
      "shadow": "0 1px 1px rgba(0,0,0,0.12)"
    },
    {
      "kind": "box",
      "left": 179,
      "top": 148,
      "width": 6,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(244,243,240,0.55)"
    }
  ],
  "38": [
    {
      "kind": "box",
      "left": 56,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 36,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 95,
      "top": 168,
      "width": 150,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 98,
      "top": 140,
      "width": 144,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 106,
      "top": 149,
      "width": 6,
      "height": 22,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 228,
      "top": 149,
      "width": 6,
      "height": 22,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 124,
      "top": 126,
      "width": 34,
      "height": 14,
      "radius": "3px 3px 2px 2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 128,
      "top": 130,
      "width": 26,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(255,255,255,0.5)"
    },
    {
      "kind": "box",
      "left": 180,
      "top": 108,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 190,
      "top": 110,
      "width": 13,
      "height": 30,
      "radius": "4px 4px 3px 3px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 193,
      "top": 103,
      "width": 7,
      "height": 7,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "svg",
      "left": 120,
      "top": 52,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:120px; top:52px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "39": [
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 284,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 128,
      "top": 166,
      "width": 84,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 136,
      "top": 76,
      "width": 68,
      "height": 88,
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07)"
    },
    {
      "kind": "box",
      "left": 144,
      "top": 86,
      "width": 52,
      "height": 70,
      "background": "#F1F0EA"
    },
    {
      "kind": "box",
      "left": 168.5,
      "top": 90,
      "width": 3,
      "height": 58,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 178,
      "top": 86,
      "width": 28,
      "height": 28,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 168,
      "top": 90,
      "width": 4,
      "height": 58,
      "radius": "2px",
      "background": "#E2BA78",
      "rotate": 22
    },
    {
      "kind": "box",
      "left": 185.5,
      "top": 92,
      "width": 11,
      "height": 8,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": 22
    },
    {
      "kind": "box",
      "left": 252,
      "top": 140,
      "width": 40,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 256,
      "top": 104,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 261,
      "top": 109,
      "width": 22,
      "height": 22,
      "radius": "50%",
      "background": "conic-gradient(#E9D2A4 0deg 90deg, rgba(0,0,0,0) 90deg 360deg)"
    },
    {
      "kind": "box",
      "left": 270.6,
      "top": 109,
      "width": 2.8,
      "height": 11,
      "radius": "1.5px",
      "background": "#55534E",
      "rotate": 90
    },
    {
      "kind": "box",
      "left": 269.5,
      "top": 117.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 267,
      "top": 97,
      "width": 10,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 253,
      "top": 140,
      "width": 38,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    }
  ],
  "40": [
    {
      "kind": "box",
      "left": 56,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 160,
      "top": 26,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 162,
      "width": 400,
      "height": 68,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 206,
      "top": 54,
      "width": 64,
      "height": 104,
      "radius": "6px 6px 0 0",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 6px #E4E3DE, 0 6px 14px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 214,
      "top": 62,
      "width": 42,
      "height": 96,
      "background": "linear-gradient(90deg, rgba(233,210,164,0.8) 0%, rgba(243,227,196,0.3) 55%, rgba(244,243,240,0.12) 100%)"
    },
    {
      "kind": "box",
      "left": 250,
      "top": 60,
      "width": 20,
      "height": 98,
      "radius": "2px",
      "background": "#D6D5D0",
      "shadow": "-4px 3px 7px rgba(40,38,32,0.16)"
    },
    {
      "kind": "box",
      "left": 254,
      "top": 99.75999999999999,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "#8A857C"
    },
    {
      "kind": "box",
      "left": 210,
      "top": 158,
      "width": 84,
      "height": 12,
      "background": "linear-gradient(100deg, rgba(233,210,164,0.5), rgba(233,210,164,0.06))"
    },
    {
      "kind": "box",
      "left": 203,
      "top": 160,
      "width": 82,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 71,
      "top": 59,
      "width": 66,
      "height": 38,
      "radius": "11px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.10)"
    },
    {
      "kind": "box",
      "left": 119,
      "top": 95.5,
      "width": 9,
      "height": 8,
      "background": "#FBFAF7"
    },
    {
      "kind": "box",
      "left": 80,
      "top": 67,
      "width": 44,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 80,
      "top": 74,
      "width": 36,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 80,
      "top": 67,
      "width": 34,
      "height": 3,
      "radius": "1.5px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 186,
      "top": 120,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "rgba(226,186,120,0.8)"
    },
    {
      "kind": "svg",
      "left": 64,
      "top": 120,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:64px; top:120px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "41": [
    {
      "kind": "box",
      "left": 60,
      "top": 32,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 38,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 70,
      "width": 94,
      "height": 62,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 68,
      "top": 79,
      "width": 42.300000000000004,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 68,
      "top": 88,
      "width": 70,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 68,
      "top": 97,
      "width": 78,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 68,
      "top": 106,
      "width": 70,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 68,
      "top": 115,
      "width": 78,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "svg",
      "left": 158,
      "top": 92,
      "width": 24,
      "height": 18,
      "viewBox": "0 0 24 18",
      "svg": {
        "attrs": {
          "width": "24",
          "height": "18",
          "viewBox": "0 0 24 18",
          "style": "position:absolute; left:158px; top:92px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9h14M12 3l7 6-7 6",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "2.6",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 190,
      "top": 70,
      "width": 94,
      "height": 62,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 198,
      "top": 82,
      "width": 52,
      "height": 4,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 198,
      "top": 94,
      "width": 70,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 198,
      "top": 106,
      "width": 44,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 206,
      "top": 66,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 232,
      "top": 156,
      "width": 40,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -22,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 232,
      "top": 156,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -22
    },
    {
      "kind": "box",
      "left": 232,
      "top": 156.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -22
    },
    {
      "kind": "box",
      "left": 228,
      "top": 168,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    }
  ],
  "42": [
    {
      "kind": "box",
      "left": 52,
      "top": 38,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 34,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 174,
      "width": 400,
      "height": 56,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 134,
      "top": 178,
      "width": 80,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 140,
      "top": 44,
      "width": 68,
      "height": 134,
      "radius": "10px",
      "background": "#E4E3DE",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 8px 18px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 140,
      "top": 96,
      "width": 68,
      "height": 3,
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 58,
      "width": 4,
      "height": 26,
      "radius": "2px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 106,
      "width": 4,
      "height": 34,
      "radius": "2px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 56,
      "width": 36,
      "height": 30,
      "radius": "3px",
      "background": "#FBFAF7",
      "rotate": -3,
      "shadow": "0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 155,
      "top": 65,
      "width": 24,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0",
      "rotate": -3
    },
    {
      "kind": "box",
      "left": 155,
      "top": 71,
      "width": 18,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0",
      "rotate": -3
    },
    {
      "kind": "box",
      "left": 155,
      "top": 77,
      "width": 21,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0",
      "rotate": -3
    },
    {
      "kind": "box",
      "left": 157,
      "top": 45,
      "width": 20,
      "height": 20,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 163,
      "top": 51,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "svg",
      "left": 268,
      "top": 60,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:268px; top:60px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "43": [
    {
      "kind": "box",
      "left": 288,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 48,
      "top": 36,
      "width": 58,
      "height": 74,
      "radius": "6px",
      "background": "#EAF0F5",
      "shadow": "0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 75,
      "top": 36,
      "width": 4,
      "height": 74,
      "background": "#E4E3DE"
    },
    {
      "kind": "box",
      "left": 48,
      "top": 70,
      "width": 58,
      "height": 4,
      "background": "#E4E3DE"
    },
    {
      "kind": "box",
      "left": 84,
      "top": 48,
      "width": 10,
      "height": 10,
      "radius": "50%",
      "background": "rgba(226,186,120,0.9)"
    },
    {
      "kind": "box",
      "left": 70,
      "top": 34,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 41,
      "top": 110,
      "width": 72,
      "height": 7,
      "radius": "3px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 157.6,
      "top": 169,
      "width": 128.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 152,
      "top": 126,
      "width": 140,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 162,
      "top": 135,
      "width": 6,
      "height": 40,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 276,
      "top": 135,
      "width": 6,
      "height": 40,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 174,
      "top": 113,
      "width": 32,
      "height": 13,
      "radius": "3px 3px 16px 16px",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 1.6px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 180,
      "top": 124,
      "width": 20,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "svg",
      "left": 182,
      "top": 100,
      "width": 16,
      "height": 11,
      "viewBox": "0 0 16 11",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "11",
          "viewBox": "0 0 16 11",
          "style": "position:absolute; left:182px; top:100px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 10 Q2.5 7 4.5 5 Q6.5 3 5 1 M11 10 Q9.5 7 11.5 5 Q13.5 3 12 1",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 236,
      "top": 111,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#E9D2A4",
      "shadow": "inset 0 0 0 1.5px #E2BA78"
    },
    {
      "kind": "box",
      "left": 255,
      "top": 114,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #E2BA78"
    },
    {
      "kind": "svg",
      "left": 239,
      "top": 99,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:239px; top:99px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 266,
      "top": 102,
      "width": 38,
      "height": 24,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 274,
      "top": 111,
      "width": 17.1,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 274,
      "top": 120,
      "width": 14,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "svg",
      "left": 160,
      "top": 48,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:160px; top:48px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 130,
      "top": 60,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    }
  ],
  "44": [
    {
      "kind": "box",
      "left": 56,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 52,
      "top": 96,
      "width": 26,
      "height": 18,
      "radius": "9px",
      "opacity": 0.85,
      "shadow": "inset 0 0 0 4px #55534E"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 96,
      "width": 26,
      "height": 18,
      "radius": "9px",
      "opacity": 0.85,
      "shadow": "inset 0 0 0 4px #55534E"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 96,
      "width": 26,
      "height": 18,
      "radius": "9px",
      "opacity": 0.85,
      "shadow": "inset 0 0 0 4px #55534E"
    },
    {
      "kind": "box",
      "left": 123,
      "top": 88,
      "width": 34,
      "height": 34,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 126,
      "top": 92,
      "width": 13,
      "height": 15,
      "radius": "7px 3px 3px 7px",
      "rotate": -14,
      "shadow": "inset 0 0 0 4px #E2BA78"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 99,
      "width": 13,
      "height": 15,
      "radius": "3px 7px 7px 3px",
      "rotate": -14,
      "shadow": "inset 0 0 0 4px #E2BA78"
    },
    {
      "kind": "box",
      "left": 176,
      "top": 96,
      "width": 26,
      "height": 18,
      "radius": "9px",
      "opacity": 0.85,
      "shadow": "inset 0 0 0 4px #55534E"
    },
    {
      "kind": "box",
      "left": 198,
      "top": 96,
      "width": 26,
      "height": 18,
      "radius": "9px",
      "opacity": 0.85,
      "shadow": "inset 0 0 0 4px #55534E"
    },
    {
      "kind": "box",
      "left": 220,
      "top": 96,
      "width": 26,
      "height": 18,
      "radius": "9px",
      "opacity": 0.85,
      "shadow": "inset 0 0 0 4px #55534E"
    },
    {
      "kind": "box",
      "left": 246,
      "top": 132,
      "width": 46,
      "height": 30,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 254,
      "top": 141,
      "width": 20.7,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 254,
      "top": 150,
      "width": 22,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 64,
      "top": 158,
      "width": 36,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -20,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 64,
      "top": 158,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 64,
      "top": 158.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 60,
      "top": 170,
      "width": 40,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    }
  ],
  "45": [
    {
      "kind": "box",
      "left": 60,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 58,
      "top": 52,
      "width": 224,
      "height": 88,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 66,
      "width": 64,
      "height": 4,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 84,
      "width": 56,
      "height": 26,
      "radius": "7px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 84,
      "width": 62,
      "height": 26,
      "radius": "7px",
      "background": "#F1F0EA",
      "shadow": "inset 0 0 0 1px rgba(0,0,0,0.05)"
    },
    {
      "kind": "box",
      "left": 208,
      "top": 84,
      "width": 58,
      "height": 26,
      "radius": "7px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 74,
      "top": 118,
      "width": 110,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 158,
      "top": 32,
      "width": 24,
      "height": 24,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 165,
      "top": 39,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "box",
      "left": 240,
      "top": 164,
      "width": 38,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -24,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 240,
      "top": 164,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 240,
      "top": 164.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 235,
      "top": 176,
      "width": 42,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    }
  ],
  "46": [
    {
      "kind": "box",
      "left": 56,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 42,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 115,
      "top": 170,
      "width": 110,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 120,
      "top": 140,
      "width": 100,
      "height": 30,
      "radius": "6px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 120,
      "top": 134,
      "width": 100,
      "height": 8,
      "radius": "4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 162,
      "top": 136,
      "width": 16,
      "height": 5,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 132,
      "top": 114,
      "width": 22,
      "height": 22,
      "radius": "5px",
      "background": "#FBFAF7",
      "rotate": -8,
      "shadow": "0 2px 6px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 137,
      "top": 121,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0",
      "rotate": -8
    },
    {
      "kind": "box",
      "left": 137,
      "top": 126,
      "width": 9,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0",
      "rotate": -8
    },
    {
      "kind": "box",
      "left": 175,
      "top": 97,
      "width": 34,
      "height": 34,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 182,
      "top": 104,
      "width": 20,
      "height": 26,
      "radius": "5px",
      "background": "#E9D2A4",
      "rotate": 7,
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "svg",
      "left": 186,
      "top": 112,
      "width": 12,
      "height": 10,
      "viewBox": "0 0 12 10",
      "svg": {
        "attrs": {
          "width": "12",
          "height": "10",
          "viewBox": "0 0 12 10",
          "style": "position:absolute; left:186px; top:112px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 5l2.6 2.6 5-6",
              "stroke": "#8a6b34",
              "stroke-width": "1.8",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "opacity": "0.7"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 90,
      "top": 54,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:90px; top:54px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "47": [
    {
      "kind": "box",
      "left": 44.5,
      "top": 31.5,
      "width": 28.9,
      "height": 18.7,
      "radius": "50%",
      "background": "#D2D1CB"
    },
    {
      "kind": "box",
      "left": 58.1,
      "top": 23,
      "width": 34,
      "height": 27.2,
      "radius": "50%",
      "background": "#D2D1CB"
    },
    {
      "kind": "box",
      "left": 76.8,
      "top": 33.2,
      "width": 25.5,
      "height": 17,
      "radius": "50%",
      "background": "#D2D1CB"
    },
    {
      "kind": "box",
      "left": 44.5,
      "top": 41.7,
      "width": 57.8,
      "height": 8.5,
      "radius": "8px",
      "background": "#D2D1CB"
    },
    {
      "kind": "box",
      "left": 40,
      "top": 60,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.75
    },
    {
      "kind": "box",
      "left": 55,
      "top": 68,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.55
    },
    {
      "kind": "box",
      "left": 70,
      "top": 60,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.75
    },
    {
      "kind": "box",
      "left": 85,
      "top": 68,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.55
    },
    {
      "kind": "box",
      "left": 100,
      "top": 60,
      "width": 3,
      "height": 8,
      "radius": "2px",
      "background": "#B9C3CC",
      "rotate": 12,
      "opacity": 0.75
    },
    {
      "kind": "box",
      "left": -80,
      "top": 126,
      "width": 300,
      "height": 104,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 136,
      "width": 300,
      "height": 94,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 152,
      "width": 430,
      "height": 78,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "box",
      "left": 141,
      "top": 168,
      "width": 110,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 144,
      "top": 102,
      "width": 104,
      "height": 64,
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 158,
      "top": 120,
      "width": 76,
      "height": 46,
      "background": "#C6C5C0",
      "opacity": 0.5
    },
    {
      "kind": "box",
      "left": 176,
      "top": 128,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.55), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 185,
      "top": 140,
      "width": 22,
      "height": 26,
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 194.5,
      "top": 96,
      "width": 3,
      "height": 10,
      "radius": "1.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "svg",
      "left": 288,
      "top": 60,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:288px; top:60px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "48": [
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 40,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 170,
      "width": 120,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 134,
      "top": 94,
      "width": 112,
      "height": 74,
      "radius": "42% 46% 8px 8px / 60% 54% 8px 8px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 156,
      "top": 110,
      "width": 24,
      "height": 12,
      "radius": "6px",
      "background": "rgba(255,255,255,0.4)",
      "rotate": -18
    },
    {
      "kind": "box",
      "left": 218,
      "top": 88,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 224,
      "top": 94,
      "width": 22,
      "height": 20,
      "background": "#F7F6F2"
    },
    {
      "kind": "box",
      "left": 230,
      "top": 80,
      "width": 14,
      "height": 10,
      "radius": "3px",
      "background": "#E9D2A4",
      "rotate": 14
    },
    {
      "kind": "box",
      "left": 254,
      "top": 128,
      "width": 7,
      "height": 22,
      "radius": "3px",
      "background": "#B4B1AB",
      "rotate": 32
    },
    {
      "kind": "box",
      "left": 248,
      "top": 122,
      "width": 11,
      "height": 11,
      "radius": "2px",
      "background": "#C6C5C0",
      "rotate": 32
    },
    {
      "kind": "box",
      "left": 242,
      "top": 72,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "rgba(226,186,120,0.8)"
    }
  ],
  "49": [
    {
      "kind": "box",
      "left": 64,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 280,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 52,
      "top": 96,
      "width": 96,
      "height": 44,
      "radius": "8px",
      "background": "#F1F0EA",
      "shadow": "inset 0 0 0 1px rgba(0,0,0,0.05)"
    },
    {
      "kind": "box",
      "left": 62,
      "top": 86,
      "width": 34,
      "height": 4,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 192,
      "top": 96,
      "width": 96,
      "height": 44,
      "radius": "8px",
      "background": "#F1F0EA",
      "shadow": "inset 0 0 0 1px rgba(0,0,0,0.05)"
    },
    {
      "kind": "box",
      "left": 202,
      "top": 86,
      "width": 46,
      "height": 4,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 206,
      "top": 104,
      "width": 34,
      "height": 26,
      "radius": "5px",
      "background": "#FBFAF7",
      "rotate": 4,
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 3px 8px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 252,
      "top": 104,
      "width": 30,
      "height": 26,
      "radius": "5px",
      "background": "#FBFAF7",
      "rotate": -3,
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 3px 8px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 94,
      "top": 98,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 96,
      "top": 106,
      "width": 32,
      "height": 26,
      "radius": "5px",
      "background": "#E9D2A4",
      "rotate": -4,
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "svg",
      "left": 132,
      "top": 74,
      "width": 64,
      "height": 26,
      "viewBox": "0 0 64 26",
      "svg": {
        "attrs": {
          "width": "64",
          "height": "26",
          "viewBox": "0 0 64 26",
          "style": "position:absolute; left:132px; top:74px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M58 22 Q34 2 8 18",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "2.6",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 7"
            }
          },
          {
            "tag": "path",
            "attrs": {
              "d": "M14 10l-6 8 10 2",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    }
  ],
  "50": [
    {
      "kind": "box",
      "left": 60,
      "top": 38,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 34,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 101,
      "top": 171,
      "width": 138,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 95,
      "top": 130,
      "width": 150,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 105,
      "top": 139,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 229,
      "top": 139,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 120,
      "top": 102,
      "width": 100,
      "height": 28,
      "radius": "6px",
      "background": "#E4E3DE",
      "shadow": "0 0 0 1px rgba(0,0,0,0.05)"
    },
    {
      "kind": "box",
      "left": 120,
      "top": 98,
      "width": 100,
      "height": 10,
      "radius": "5px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 156,
      "top": 90,
      "width": 28,
      "height": 28,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 162,
      "top": 99,
      "width": 16,
      "height": 8,
      "radius": "4px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 248,
      "top": 115,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 1.5px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 267,
      "top": 118,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #C6C5C0"
    },
    {
      "kind": "svg",
      "left": 251,
      "top": 103,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:251px; top:103px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 78,
      "top": 54,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:78px; top:54px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "51": [
    {
      "kind": "box",
      "left": 120,
      "top": 32,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "svg",
      "left": 230,
      "top": 40,
      "width": 16,
      "height": 8,
      "viewBox": "0 0 16 8",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "8",
          "viewBox": "0 0 16 8",
          "style": "position:absolute; left:230px; top:40px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": -80,
      "top": 122,
      "width": 300,
      "height": 108,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 132,
      "width": 300,
      "height": 98,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 150,
      "width": 430,
      "height": 80,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "svg",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "viewBox": "0 0 340 200",
      "svg": {
        "attrs": {
          "width": "340",
          "height": "200",
          "viewBox": "0 0 340 200",
          "style": "position:absolute; left:0px; top:0px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M99 206 Q 150 158 190 162 T 255.5 130 L 264.5 130 Q 220 170 200 182 T 141 206 Z",
              "fill": "#DDDCD5"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 44,
      "top": 158,
      "width": 40,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 59,
      "top": 132,
      "width": 10,
      "height": 26,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 56,
      "top": 129,
      "width": 16,
      "height": 5,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "svg",
      "left": 42,
      "top": 106,
      "width": 44,
      "height": 26,
      "viewBox": "0 0 44 26",
      "svg": {
        "attrs": {
          "width": "44",
          "height": "26",
          "viewBox": "0 0 44 26",
          "style": "position:absolute; left:42px; top:106px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 24 A18 18 0 0 1 40 24",
              "fill": "none",
              "stroke": "#55534E",
              "stroke-width": "4",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 40,
      "top": 126,
      "width": 11,
      "height": 15,
      "radius": "5px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 77,
      "top": 126,
      "width": 11,
      "height": 15,
      "radius": "5px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 193,
      "top": 152,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 200.88,
      "top": 114,
      "width": 10.24,
      "height": 10.24,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 199.92,
      "top": 126.24,
      "width": 12.16,
      "height": 19.759999999999998,
      "radius": "6.08px 6.08px 2.56px 2.56px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 258,
      "top": 120,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "rgba(226,186,120,0.9)"
    },
    {
      "kind": "box",
      "left": 249,
      "top": 111,
      "width": 20,
      "height": 20,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    }
  ],
  "52": [
    {
      "kind": "box",
      "left": 56,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 94.56,
      "top": 169,
      "width": 150.88,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 88,
      "top": 130,
      "width": 164,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 98,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 236,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 112,
      "width": 44,
      "height": 18,
      "radius": "4px 4px 8px 8px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 104,
      "top": 104,
      "width": 28,
      "height": 8,
      "radius": "4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "svg",
      "left": 142,
      "top": 84,
      "width": 30,
      "height": 26,
      "viewBox": "0 0 30 26",
      "svg": {
        "attrs": {
          "width": "30",
          "height": "26",
          "viewBox": "0 0 30 26",
          "style": "position:absolute; left:142px; top:84px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M6 22 Q10 8 24 4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.2",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 6"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 192,
      "top": 90,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 196,
      "top": 100,
      "width": 30,
      "height": 22,
      "radius": "4px",
      "background": "#E9D2A4",
      "rotate": -6,
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 204,
      "top": 94,
      "width": 22,
      "height": 18,
      "radius": "4px",
      "background": "#E2BA78",
      "rotate": 8
    },
    {
      "kind": "box",
      "left": 246,
      "top": 106,
      "width": 22,
      "height": 24,
      "radius": "3px",
      "background": "#FBFAF7",
      "rotate": 6,
      "shadow": "0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 43,
      "top": 105,
      "width": 42,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 47,
      "top": 67,
      "width": 34,
      "height": 34,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 52,
      "top": 72,
      "width": 24,
      "height": 24,
      "radius": "50%",
      "background": "conic-gradient(#E9D2A4 0deg 118.80000000000001deg, rgba(0,0,0,0) 118.80000000000001deg 360deg)"
    },
    {
      "kind": "box",
      "left": 62.6,
      "top": 72,
      "width": 2.8,
      "height": 12,
      "radius": "1.5px",
      "background": "#55534E",
      "rotate": 118.80000000000001
    },
    {
      "kind": "box",
      "left": 61.5,
      "top": 81.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 59,
      "top": 60,
      "width": 10,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78"
    }
  ],
  "53": [
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 32,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#C5C4BD",
      "mask": "radial-gradient(circle at 13.6px 4.96px, transparent 6.24px, #000 6.56px)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 85.6,
      "top": 173,
      "width": 128.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 80,
      "top": 132,
      "width": 140,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 90,
      "top": 141,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 204,
      "top": 141,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 106,
      "top": 104,
      "width": 88,
      "height": 28,
      "radius": "7px",
      "background": "#E4E3DE",
      "shadow": "inset 0 0 0 1px rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 126,
      "top": 127,
      "width": 48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 131,
      "top": 119,
      "width": 38,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 144,
      "top": 121.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    },
    {
      "kind": "box",
      "left": 134,
      "top": 106,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 240,
      "top": 120,
      "width": 52,
      "height": 34,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 248,
      "top": 129,
      "width": 23.400000000000002,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 248,
      "top": 138,
      "width": 28,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 248,
      "top": 128,
      "width": 26,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 238,
      "top": 156,
      "width": 56,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    }
  ],
  "54": [
    {
      "kind": "box",
      "left": 52,
      "top": 38,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 164,
      "width": 400,
      "height": 66,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 73,
      "top": 163,
      "width": 74,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 80,
      "top": 106,
      "width": 16,
      "height": 44,
      "radius": "8px 6px 4px 4px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 84,
      "top": 134,
      "width": 52,
      "height": 18,
      "radius": "6px 10px 4px 4px",
      "background": "#D6D5D0",
      "shadow": "inset 0 3px 0 rgba(255,255,255,0.35)"
    },
    {
      "kind": "box",
      "left": 128,
      "top": 128,
      "width": 12,
      "height": 24,
      "radius": "6px 6px 4px 4px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 86,
      "top": 152,
      "width": 6,
      "height": 11,
      "radius": "0 0 3px 3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 128,
      "top": 152,
      "width": 6,
      "height": 11,
      "radius": "0 0 3px 3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 195.84,
      "top": 169,
      "width": 88.32000000000001,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 192,
      "top": 132,
      "width": 96,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 202,
      "top": 141,
      "width": 6,
      "height": 34,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 272,
      "top": 141,
      "width": 6,
      "height": 34,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 210,
      "top": 131,
      "width": 60,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 214,
      "top": 116,
      "width": 26,
      "height": 16,
      "radius": "6px 2px 2px 4px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 240,
      "top": 116,
      "width": 26,
      "height": 16,
      "radius": "2px 6px 4px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 239,
      "top": 115,
      "width": 2,
      "height": 15,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 221,
      "top": 121,
      "width": 13,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 246,
      "top": 121,
      "width": 13,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 273,
      "top": 88,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 282,
      "top": 110,
      "width": 12,
      "height": 22,
      "radius": "3px 3px 2px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 0 0 1.2px rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 287.2,
      "top": 106,
      "width": 1.6,
      "height": 4,
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 285,
      "top": 98,
      "width": 6,
      "height": 9,
      "radius": "50% 50% 50% 50% / 62% 62% 38% 38%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 275,
      "top": 134,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 30,
      "top": 163,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 35,
      "top": 155,
      "width": 34,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 46,
      "top": 157.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    },
    {
      "kind": "box",
      "left": 218,
      "top": 88,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.32), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 180,
      "top": 44,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:180px; top:44px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "55": [
    {
      "kind": "box",
      "left": 43,
      "top": 31,
      "width": 18,
      "height": 18,
      "radius": "50%",
      "background": "#C5C4BD",
      "mask": "radial-gradient(circle at 15.299999999999999px 5.58px, transparent 7.0200000000000005px, #000 7.38px)"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 162,
      "width": 400,
      "height": 68,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 78,
      "top": 164,
      "width": 84,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 90,
      "top": 84,
      "width": 10,
      "height": 78,
      "radius": "5px 5px 3px 3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 90,
      "top": 122,
      "width": 64,
      "height": 9,
      "radius": "4px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 146,
      "top": 131,
      "width": 7,
      "height": 31,
      "radius": "0 0 3px 3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 131,
      "width": 7,
      "height": 31,
      "radius": "0 0 3px 3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 94,
      "top": 106,
      "width": 52,
      "height": 16,
      "radius": "5px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -3px 0 rgba(196,152,86,0.4)"
    },
    {
      "kind": "box",
      "left": 94,
      "top": 98,
      "width": 52,
      "height": 11,
      "radius": "5px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 80,
      "width": 48,
      "height": 48,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 180,
      "top": 165,
      "width": 64,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 180,
      "top": 152,
      "width": 30,
      "height": 12,
      "radius": "9px 5px 2px 3px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 180,
      "top": 161,
      "width": 30,
      "height": 3,
      "radius": "1.5px",
      "background": "#F7F6F2",
      "shadow": "0 1px 1px rgba(0,0,0,0.12)"
    },
    {
      "kind": "box",
      "left": 187,
      "top": 154,
      "width": 6,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(244,243,240,0.55)"
    },
    {
      "kind": "box",
      "left": 214,
      "top": 152,
      "width": 30,
      "height": 12,
      "radius": "9px 5px 2px 3px",
      "background": "#6B6862"
    },
    {
      "kind": "box",
      "left": 214,
      "top": 161,
      "width": 30,
      "height": 3,
      "radius": "1.5px",
      "background": "#F7F6F2",
      "shadow": "0 1px 1px rgba(0,0,0,0.12)"
    },
    {
      "kind": "box",
      "left": 221,
      "top": 154,
      "width": 6,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(244,243,240,0.55)"
    },
    {
      "kind": "box",
      "left": 266.05,
      "top": 168,
      "width": 39.9,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 265,
      "top": 142,
      "width": 42,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 272,
      "top": 150,
      "width": 5,
      "height": 22,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 295,
      "top": 150,
      "width": 5,
      "height": 22,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 273.94,
      "top": 103,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 289.06,
      "top": 103,
      "width": 9,
      "height": 6,
      "radius": "5px 5px 0 0",
      "background": "#E2BA78",
      "rotate": 24
    },
    {
      "kind": "box",
      "left": 273,
      "top": 109,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.4px #55534E, 0 3px 7px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 275.94,
      "top": 133,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": 20
    },
    {
      "kind": "box",
      "left": 292.06,
      "top": 133,
      "width": 4,
      "height": 7,
      "radius": "2px",
      "background": "#55534E",
      "rotate": -20
    },
    {
      "kind": "box",
      "left": 284.9,
      "top": 116.54,
      "width": 2.2,
      "height": 5.46,
      "radius": "1px",
      "background": "#55534E",
      "rotate": 40
    },
    {
      "kind": "box",
      "left": 284.9,
      "top": 113.94,
      "width": 2.2,
      "height": 8.06,
      "radius": "1px",
      "background": "#55534E",
      "rotate": -52
    },
    {
      "kind": "box",
      "left": 284.5,
      "top": 120.5,
      "width": 3,
      "height": 3,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 258,
      "top": 60,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    }
  ],
  "56": [
    {
      "kind": "box",
      "left": 60,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 284,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 174,
      "width": 400,
      "height": 56,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 122,
      "top": 154,
      "width": 96,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 126,
      "top": 56,
      "width": 88,
      "height": 88,
      "radius": "50%",
      "background": "#FBFAF7",
      "shadow": "inset 0 0 0 3px #55534E, 0 8px 18px rgba(40,38,32,0.13)"
    },
    {
      "kind": "box",
      "left": 134,
      "top": 64,
      "width": 72,
      "height": 72,
      "radius": "50%",
      "shadow": "inset 0 0 0 1.5px #D6D5D0"
    },
    {
      "kind": "box",
      "left": 168.75,
      "top": 61,
      "width": 2.5,
      "height": 7,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 168.75,
      "top": 132,
      "width": 2.5,
      "height": 7,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 131,
      "top": 98.75,
      "width": 7,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 202,
      "top": 98.75,
      "width": 7,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 168,
      "top": 70,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 167,
      "top": 74,
      "width": 6,
      "height": 26,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78",
      "rotate": 38
    },
    {
      "kind": "box",
      "left": 167,
      "top": 100,
      "width": 6,
      "height": 22,
      "radius": "0 0 3px 3px",
      "background": "#C6C5C0",
      "rotate": 38
    },
    {
      "kind": "box",
      "left": 165.5,
      "top": 95.5,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "svg",
      "left": 70,
      "top": 120,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:70px; top:120px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "57": [
    {
      "kind": "box",
      "left": 64,
      "top": 80,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 160,
      "top": 40,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 174,
      "width": 400,
      "height": 56,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "svg",
      "left": 60,
      "top": 74,
      "width": 150,
      "height": 70,
      "viewBox": "0 0 150 70",
      "svg": {
        "attrs": {
          "width": "150",
          "height": "70",
          "viewBox": "0 0 150 70",
          "style": "position:absolute; left:60px; top:74px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M6 60 Q50 44 92 30 Q118 20 142 8",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "2.6",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 8"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 196,
      "top": 52,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 192,
      "top": 54,
      "width": 52,
      "height": 40,
      "viewBox": "0 0 52 40",
      "svg": {
        "attrs": {
          "width": "52",
          "height": "40",
          "viewBox": "0 0 52 40",
          "style": "position:absolute; left:192px; top:54px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 22 L48 4 L30 36 L22 26 Z",
              "fill": "#E9D2A4",
              "stroke": "#E2BA78",
              "stroke-width": "2",
              "stroke-linejoin": "round"
            }
          },
          {
            "tag": "path",
            "attrs": {
              "d": "M48 4 L22 26",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "2"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 64,
      "top": 162,
      "width": 64,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 67,
      "top": 124,
      "width": 58,
      "height": 36,
      "radius": "5px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "svg",
      "left": 67,
      "top": 124,
      "width": 58,
      "height": 36,
      "viewBox": "0 0 58 36",
      "svg": {
        "attrs": {
          "width": "58",
          "height": "36",
          "viewBox": "0 0 58 36",
          "style": "position:absolute; left:67px; top:124px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M2 4 L29 21 L56 4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 286,
      "top": 44,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:286px; top:44px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 268,
      "top": 66,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    }
  ],
  "58": [
    {
      "kind": "box",
      "left": 250,
      "top": 2,
      "width": 84,
      "height": 84,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 280,
      "top": 32,
      "width": 24,
      "height": 24,
      "radius": "50%",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -80,
      "top": 128,
      "width": 300,
      "height": 102,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 138,
      "width": 300,
      "height": 92,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 154,
      "width": 430,
      "height": 76,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "box",
      "left": 85,
      "top": 168,
      "width": 170,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 82,
      "top": 138,
      "width": 176,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 92,
      "top": 147,
      "width": 6,
      "height": 24,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 242,
      "top": 147,
      "width": 6,
      "height": 24,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 110,
      "top": 94,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 107,
      "top": 112,
      "width": 22,
      "height": 26,
      "radius": "10px 10px 4px 4px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 208,
      "top": 94,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#6B6862"
    },
    {
      "kind": "box",
      "left": 205,
      "top": 112,
      "width": 22,
      "height": 26,
      "radius": "10px 10px 4px 4px",
      "background": "#6B6862"
    },
    {
      "kind": "box",
      "left": 166,
      "top": 124,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "rgba(226,186,120,0.9)"
    },
    {
      "kind": "box",
      "left": 156,
      "top": 114,
      "width": 22,
      "height": 22,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 150,
      "top": 60,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:150px; top:60px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 16.560000000000002,
      "top": 158,
      "width": 38.879999999999995,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 34.2,
      "top": 133.52,
      "width": 3.5999999999999996,
      "height": 24.48,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 18,
      "top": 114.80000000000001,
      "width": 23.04,
      "height": 23.04,
      "radius": "50%",
      "background": "#C9CEC1"
    },
    {
      "kind": "box",
      "left": 30.240000000000002,
      "top": 106.16,
      "width": 24.48,
      "height": 24.48,
      "radius": "50%",
      "background": "#D3D7CB"
    },
    {
      "kind": "box",
      "left": 28.8,
      "top": 120.56,
      "width": 24.48,
      "height": 21.599999999999998,
      "radius": "50%",
      "background": "#BEC4B4"
    },
    {
      "kind": "box",
      "left": 23.04,
      "top": 110.48,
      "width": 18.72,
      "height": 18.72,
      "radius": "50%",
      "background": "#CDD2C5"
    }
  ],
  "59": [
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 200,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 164,
      "width": 400,
      "height": 66,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 83,
      "top": 163,
      "width": 74,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 90,
      "top": 106,
      "width": 16,
      "height": 44,
      "radius": "8px 6px 4px 4px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 94,
      "top": 134,
      "width": 52,
      "height": 18,
      "radius": "6px 10px 4px 4px",
      "background": "#D6D5D0",
      "shadow": "inset 0 3px 0 rgba(255,255,255,0.35)"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 128,
      "width": 12,
      "height": 24,
      "radius": "6px 6px 4px 4px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 152,
      "width": 6,
      "height": 11,
      "radius": "0 0 3px 3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 152,
      "width": 6,
      "height": 11,
      "radius": "0 0 3px 3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 104,
      "top": 96,
      "width": 26,
      "height": 20,
      "radius": "4px",
      "background": "#FBFAF7",
      "rotate": -8,
      "shadow": "0 1px 4px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 107,
      "top": 101,
      "width": 9,
      "height": 11,
      "radius": "1px",
      "background": "#E9D2A4",
      "rotate": -8
    },
    {
      "kind": "box",
      "left": 170,
      "top": 108,
      "width": 52,
      "height": 52,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 185,
      "top": 126,
      "width": 22,
      "height": 15,
      "radius": "8px 8px 3px 3px",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 194.5,
      "top": 141,
      "width": 3,
      "height": 15,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 188,
      "top": 156,
      "width": 16,
      "height": 5,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 181,
      "top": 166,
      "width": 30,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 270,
      "top": 120,
      "width": 2,
      "height": 46,
      "radius": "1px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 291,
      "top": 170,
      "width": 38,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 290,
      "top": 146,
      "width": 40,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 297,
      "top": 154,
      "width": 5,
      "height": 20,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 318,
      "top": 154,
      "width": 5,
      "height": 20,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 289,
      "top": 145,
      "width": 42,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 294,
      "top": 137,
      "width": 32,
      "height": 9,
      "radius": "4px",
      "background": "linear-gradient(180deg, #12151B 0%, #1A2027 100%)",
      "shadow": "0 0 0 1.6px #2A2E35"
    },
    {
      "kind": "box",
      "left": 304,
      "top": 139.5,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "rgba(190,205,220,0.28)"
    },
    {
      "kind": "svg",
      "left": 258,
      "top": 50,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:258px; top:50px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "60": [
    {
      "kind": "box",
      "left": 56,
      "top": 38,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 34,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 94.56,
      "top": 171,
      "width": 150.88,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 88,
      "top": 124,
      "width": 164,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 98,
      "top": 133,
      "width": 6,
      "height": 44,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 236,
      "top": 133,
      "width": 6,
      "height": 44,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 110,
      "top": 109,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 1.5px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 129,
      "top": 112,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #C6C5C0"
    },
    {
      "kind": "svg",
      "left": 113,
      "top": 97,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:113px; top:97px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 210,
      "top": 109,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#E9D2A4",
      "shadow": "inset 0 0 0 1.5px #E2BA78"
    },
    {
      "kind": "box",
      "left": 229,
      "top": 112,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #E2BA78"
    },
    {
      "kind": "svg",
      "left": 213,
      "top": 97,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:213px; top:97px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 155,
      "top": 82,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 164,
      "top": 104,
      "width": 12,
      "height": 20,
      "radius": "3px 3px 2px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 0 0 1.2px rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 169.2,
      "top": 100,
      "width": 1.6,
      "height": 4,
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 167,
      "top": 92,
      "width": 6,
      "height": 9,
      "radius": "50% 50% 50% 50% / 62% 62% 38% 38%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 120,
      "top": 82,
      "width": 100,
      "height": 1,
      "background": "none"
    },
    {
      "kind": "box",
      "left": 40.05,
      "top": 174,
      "width": 39.9,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 39,
      "top": 148,
      "width": 42,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 46,
      "top": 156,
      "width": 5,
      "height": 22,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 69,
      "top": 156,
      "width": 5,
      "height": 22,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 260.05,
      "top": 174,
      "width": 39.9,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 259,
      "top": 148,
      "width": 42,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 266,
      "top": 156,
      "width": 5,
      "height": 22,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 289,
      "top": 156,
      "width": 5,
      "height": 22,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 76,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 240,
      "top": 44,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:240px; top:44px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "61": [
    {
      "kind": "box",
      "left": 52,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 42,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 81,
      "top": 171,
      "width": 138,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 75,
      "top": 132,
      "width": 150,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 85,
      "top": 141,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 209,
      "top": 141,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 102,
      "top": 117,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 1.5px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 121,
      "top": 120,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #C6C5C0"
    },
    {
      "kind": "svg",
      "left": 105,
      "top": 105,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:105px; top:105px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 140,
      "top": 117,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#E9D2A4",
      "shadow": "inset 0 0 0 1.5px #E2BA78"
    },
    {
      "kind": "box",
      "left": 159,
      "top": 120,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #E2BA78"
    },
    {
      "kind": "svg",
      "left": 143,
      "top": 105,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:143px; top:105px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 199,
      "top": 65,
      "width": 74,
      "height": 62,
      "radius": "9px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 6px 14px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 199,
      "top": 65,
      "width": 74,
      "height": 17,
      "radius": "9px 9px 0 0",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 213,
      "top": 60,
      "width": 4,
      "height": 10,
      "radius": "2px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 255,
      "top": 60,
      "width": 4,
      "height": 10,
      "radius": "2px",
      "background": "#B4B1AB"
    },
    {
      "kind": "svg",
      "left": 199,
      "top": 65,
      "width": 74,
      "height": 62,
      "viewBox": "0 0 74 62",
      "svg": {
        "attrs": {
          "width": "74",
          "height": "62",
          "viewBox": "0 0 74 62",
          "style": "position:absolute; left:199px; top:65px;"
        },
        "children": [
          {
            "tag": "circle",
            "attrs": {
              "cx": "11",
              "cy": "28",
              "r": "3.4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2"
            }
          },
          {
            "tag": "circle",
            "attrs": {
              "cx": "27.7",
              "cy": "28",
              "r": "3.4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2"
            }
          },
          {
            "tag": "circle",
            "attrs": {
              "cx": "44.3",
              "cy": "28",
              "r": "3.4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2"
            }
          },
          {
            "tag": "circle",
            "attrs": {
              "cx": "61",
              "cy": "28",
              "r": "3.4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2"
            }
          },
          {
            "tag": "circle",
            "attrs": {
              "cx": "11",
              "cy": "43",
              "r": "3.4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2"
            }
          },
          {
            "tag": "circle",
            "attrs": {
              "cx": "27.7",
              "cy": "43",
              "r": "3.4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2"
            }
          },
          {
            "tag": "circle",
            "attrs": {
              "cx": "44.3",
              "cy": "43",
              "r": "3.4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 239,
      "top": 91,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 245,
      "top": 97,
      "width": 14,
      "height": 14,
      "radius": "50%",
      "shadow": "inset 0 0 0 2.6px #E2BA78"
    },
    {
      "kind": "box",
      "left": 206,
      "top": 150,
      "width": 60,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.06)",
      "blur": 5
    }
  ],
  "62": [
    {
      "kind": "box",
      "left": 60,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 96.25,
      "top": 170,
      "width": 47.5,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 95,
      "top": 140,
      "width": 50,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 102,
      "top": 148,
      "width": 5,
      "height": 26,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 133,
      "top": 148,
      "width": 5,
      "height": 26,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 100,
      "top": 139,
      "width": 40,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 106,
      "top": 118,
      "width": 28,
      "height": 22,
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 103,
      "top": 114,
      "width": 34,
      "height": 6,
      "radius": "3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 118.5,
      "top": 94,
      "width": 3,
      "height": 22,
      "radius": "1.5px",
      "background": "#A9AF9E"
    },
    {
      "kind": "box",
      "left": 107,
      "top": 94,
      "width": 12,
      "height": 16,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#BEC4B4",
      "rotate": -62
    },
    {
      "kind": "box",
      "left": 122,
      "top": 92,
      "width": 12,
      "height": 17,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#C9CEC1",
      "rotate": 58
    },
    {
      "kind": "box",
      "left": 115,
      "top": 100,
      "width": 10,
      "height": 13,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#CDD2C5",
      "rotate": 110
    },
    {
      "kind": "box",
      "left": 132,
      "top": 120,
      "width": 9,
      "height": 13,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#CDD2C5",
      "rotate": 118,
      "opacity": 0.8
    },
    {
      "kind": "box",
      "left": 146,
      "top": 152,
      "width": 8,
      "height": 11,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#CDD2C5",
      "rotate": 96,
      "opacity": 0.55
    },
    {
      "kind": "svg",
      "left": 196,
      "top": 96,
      "width": 90,
      "height": 50,
      "viewBox": "0 0 90 50",
      "svg": {
        "attrs": {
          "width": "90",
          "height": "50",
          "viewBox": "0 0 90 50",
          "style": "position:absolute; left:196px; top:96px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M6 44 Q36 24 84 12",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 7"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 278,
      "top": 90,
      "width": 28,
      "height": 28,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 286,
      "top": 98,
      "width": 10,
      "height": 10,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "svg",
      "left": 80,
      "top": 60,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:80px; top:60px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "63": [
    {
      "kind": "box",
      "left": 64,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 40,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 158,
      "width": 400,
      "height": 72,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#E7EAE0"
    },
    {
      "kind": "box",
      "left": 184.35,
      "top": 168,
      "width": 51.3,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 183,
      "top": 138,
      "width": 54,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 190,
      "top": 146,
      "width": 5,
      "height": 26,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 225,
      "top": 146,
      "width": 5,
      "height": 26,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 188,
      "top": 137,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 194.6,
      "top": 113.8,
      "width": 30.800000000000004,
      "height": 24.200000000000003,
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 191.3,
      "top": 109.4,
      "width": 37.400000000000006,
      "height": 6.6000000000000005,
      "radius": "3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 208.35,
      "top": 87.4,
      "width": 3.3000000000000003,
      "height": 24.200000000000003,
      "radius": "1.5px",
      "background": "#A9AF9E"
    },
    {
      "kind": "box",
      "left": 196.8,
      "top": 76.39999999999999,
      "width": 13.200000000000001,
      "height": 18.700000000000003,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#BEC4B4",
      "rotate": -28
    },
    {
      "kind": "box",
      "left": 211.1,
      "top": 74.19999999999999,
      "width": 13.200000000000001,
      "height": 20.900000000000002,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#C9CEC1",
      "rotate": 24
    },
    {
      "kind": "box",
      "left": 203.95,
      "top": 69.8,
      "width": 12.100000000000001,
      "height": 16.5,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#D3D7CB",
      "rotate": -2
    },
    {
      "kind": "box",
      "left": 188,
      "top": 74,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 96,
      "top": 64,
      "width": 40,
      "height": 28,
      "radius": "5px 5px 8px 8px",
      "background": "#D6D5D0",
      "rotate": -18
    },
    {
      "kind": "box",
      "left": 130,
      "top": 70,
      "width": 26,
      "height": 7,
      "radius": "3px",
      "background": "#C6C5C0",
      "rotate": 24
    },
    {
      "kind": "svg",
      "left": 92,
      "top": 58,
      "width": 26,
      "height": 18,
      "viewBox": "0 0 26 18",
      "svg": {
        "attrs": {
          "width": "26",
          "height": "18",
          "viewBox": "0 0 26 18",
          "style": "position:absolute; left:92px; top:58px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M22 16 A11 9 0 0 0 4 12",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "4",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 160,
      "top": 96,
      "width": 4,
      "height": 4,
      "radius": "50%",
      "background": "rgba(226,186,120,0.9)"
    },
    {
      "kind": "box",
      "left": 172,
      "top": 108,
      "width": 3.5,
      "height": 3.5,
      "radius": "50%",
      "background": "rgba(226,186,120,0.75)"
    },
    {
      "kind": "box",
      "left": 184,
      "top": 120,
      "width": 3,
      "height": 3,
      "radius": "50%",
      "background": "rgba(226,186,120,0.6)"
    },
    {
      "kind": "svg",
      "left": 280,
      "top": 60,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:280px; top:60px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "64": [
    {
      "kind": "box",
      "left": 56,
      "top": 40,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 36,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 101,
      "top": 171,
      "width": 138,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 95,
      "top": 130,
      "width": 150,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 105,
      "top": 139,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 229,
      "top": 139,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 118,
      "top": 106,
      "width": 70,
      "height": 24,
      "radius": "5px 8px 8px 5px",
      "background": "#D6D5D0",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 9px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 118,
      "top": 106,
      "width": 8,
      "height": 24,
      "radius": "5px 0 0 5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 100,
      "width": 5,
      "height": 12,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 225,
      "top": 84,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 234,
      "top": 106,
      "width": 12,
      "height": 24,
      "radius": "3px 3px 2px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 0 0 1.2px rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 239.2,
      "top": 102,
      "width": 1.6,
      "height": 4,
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 237,
      "top": 94,
      "width": 6,
      "height": 9,
      "radius": "50% 50% 50% 50% / 62% 62% 38% 38%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 226,
      "top": 132,
      "width": 28,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 172,
      "top": 84,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.3), rgba(226,186,120,0) 74%)",
      "blur": 5
    }
  ],
  "65": [
    {
      "kind": "box",
      "left": 60,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 174,
      "width": 400,
      "height": 56,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 76,
      "top": 44,
      "width": 188,
      "height": 104,
      "radius": "12px",
      "background": "#EFEDE6",
      "shadow": "0 0 0 6px #E4E3DE, 0 8px 18px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 64,
      "width": 26,
      "height": 20,
      "radius": "4px",
      "background": "#FBFAF7",
      "rotate": 2,
      "shadow": "0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 99,
      "top": 70,
      "width": 16,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 99,
      "top": 75,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 106,
      "top": 60,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 140,
      "top": 54,
      "width": 24,
      "height": 24,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 146,
      "top": 60,
      "width": 26,
      "height": 20,
      "radius": "4px",
      "background": "#FBFAF7",
      "rotate": 3,
      "shadow": "0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 149,
      "top": 66,
      "width": 16,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 149,
      "top": 71,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 156,
      "top": 56,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 66,
      "width": 26,
      "height": 20,
      "radius": "4px",
      "background": "#FBFAF7",
      "rotate": -3,
      "shadow": "0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 199,
      "top": 72,
      "width": 16,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 199,
      "top": 77,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 206,
      "top": 62,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 120,
      "top": 104,
      "width": 26,
      "height": 20,
      "radius": "4px",
      "background": "#FBFAF7",
      "rotate": -2,
      "shadow": "0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 123,
      "top": 110,
      "width": 16,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 123,
      "top": 115,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 100,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 172,
      "top": 100,
      "width": 26,
      "height": 20,
      "radius": "4px",
      "background": "#FBFAF7",
      "rotate": 1,
      "shadow": "0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 175,
      "top": 106,
      "width": 16,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 175,
      "top": 111,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 182,
      "top": 96,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 216,
      "top": 100,
      "width": 24,
      "height": 24,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 222,
      "top": 106,
      "width": 26,
      "height": 20,
      "radius": "4px",
      "background": "#FBFAF7",
      "rotate": 2,
      "shadow": "0 2px 5px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 225,
      "top": 112,
      "width": 16,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 225,
      "top": 117,
      "width": 12,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 232,
      "top": 102,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 95,
      "top": 182,
      "width": 150,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    }
  ],
  "66": [
    {
      "kind": "box",
      "left": 56,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 64,
      "top": 76,
      "width": 92,
      "height": 60,
      "radius": "4px",
      "background": "#F1F0EA",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 85,
      "width": 76,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 94,
      "width": 68,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 103,
      "width": 76,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 112,
      "width": 68,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 121,
      "width": 76,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 72,
      "top": 64,
      "width": 44,
      "height": 4,
      "radius": "2px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 186,
      "top": 76,
      "width": 92,
      "height": 60,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 194,
      "top": 85,
      "width": 41.4,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 194,
      "top": 94,
      "width": 68,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 194,
      "top": 103,
      "width": 76,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 194,
      "top": 112,
      "width": 68,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 194,
      "top": 121,
      "width": 76,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 194,
      "top": 64,
      "width": 44,
      "height": 4,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 216,
      "top": 54,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 150,
      "top": 158,
      "width": 38,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -22,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 158,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -22
    },
    {
      "kind": "box",
      "left": 150,
      "top": 158.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -22
    },
    {
      "kind": "box",
      "left": 145,
      "top": 170,
      "width": 42,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    }
  ],
  "67": [
    {
      "kind": "box",
      "left": 52,
      "top": 38,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 300,
      "top": 34,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 170,
      "width": 400,
      "height": 60,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 56,
      "width": 120,
      "height": 22,
      "radius": "7px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 3px 8px rgba(40,38,32,0.09)"
    },
    {
      "kind": "svg",
      "left": 68,
      "top": 63,
      "width": 10,
      "height": 9,
      "viewBox": "0 0 10 9",
      "svg": {
        "attrs": {
          "width": "10",
          "height": "9",
          "viewBox": "0 0 10 9",
          "style": "position:absolute; left:68px; top:63px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 4.5l2.6 2.6 4.4-5.4",
              "stroke": "#E2BA78",
              "stroke-width": "2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 84,
      "top": 65.5,
      "width": 82,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 86,
      "width": 132,
      "height": 22,
      "radius": "7px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 3px 8px rgba(40,38,32,0.09)"
    },
    {
      "kind": "svg",
      "left": 68,
      "top": 93,
      "width": 10,
      "height": 9,
      "viewBox": "0 0 10 9",
      "svg": {
        "attrs": {
          "width": "10",
          "height": "9",
          "viewBox": "0 0 10 9",
          "style": "position:absolute; left:68px; top:93px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 4.5l2.6 2.6 4.4-5.4",
              "stroke": "#E2BA78",
              "stroke-width": "2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 84,
      "top": 95.5,
      "width": 94,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 60,
      "top": 116,
      "width": 112,
      "height": 22,
      "radius": "7px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 3px 8px rgba(40,38,32,0.09)"
    },
    {
      "kind": "svg",
      "left": 68,
      "top": 123,
      "width": 10,
      "height": 9,
      "viewBox": "0 0 10 9",
      "svg": {
        "attrs": {
          "width": "10",
          "height": "9",
          "viewBox": "0 0 10 9",
          "style": "position:absolute; left:68px; top:123px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1.5 4.5l2.6 2.6 4.4-5.4",
              "stroke": "#E2BA78",
              "stroke-width": "2",
              "fill": "none",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 84,
      "top": 125.5,
      "width": 74,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 204.16,
      "top": 167,
      "width": 95.68,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 200,
      "top": 128,
      "width": 104,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 210,
      "top": 137,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 137,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 236,
      "top": 106,
      "width": 14,
      "height": 22,
      "radius": "3px 3px 5px 5px",
      "background": "rgba(200,215,229,0.45)",
      "shadow": "inset 0 0 0 1.5px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 239,
      "top": 98,
      "width": 3,
      "height": 12,
      "radius": "1.5px",
      "background": "#E2BA78",
      "rotate": 14
    },
    {
      "kind": "box",
      "left": 246,
      "top": 97,
      "width": 3,
      "height": 13,
      "radius": "1.5px",
      "background": "#B4B1AB",
      "rotate": -8
    },
    {
      "kind": "box",
      "left": 231,
      "top": 91,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 160,
      "top": 42,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:160px; top:42px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "68": [
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 164,
      "width": 400,
      "height": 66,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 103,
      "top": 163,
      "width": 74,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 110,
      "top": 106,
      "width": 16,
      "height": 44,
      "radius": "8px 6px 4px 4px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 114,
      "top": 134,
      "width": 52,
      "height": 18,
      "radius": "6px 10px 4px 4px",
      "background": "#D6D5D0",
      "shadow": "inset 0 3px 0 rgba(255,255,255,0.35)"
    },
    {
      "kind": "box",
      "left": 158,
      "top": 128,
      "width": 12,
      "height": 24,
      "radius": "6px 6px 4px 4px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 116,
      "top": 152,
      "width": 6,
      "height": 11,
      "radius": "0 0 3px 3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 158,
      "top": 152,
      "width": 6,
      "height": 11,
      "radius": "0 0 3px 3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 118,
      "top": 112,
      "width": 44,
      "height": 12,
      "radius": "6px 6px 3px 3px",
      "background": "#E9D2A4",
      "rotate": -4,
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.4)"
    },
    {
      "kind": "box",
      "left": 122,
      "top": 96,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 206.6,
      "top": 169,
      "width": 82.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 203,
      "top": 134,
      "width": 90,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 213,
      "top": 143,
      "width": 6,
      "height": 32,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 277,
      "top": 143,
      "width": 6,
      "height": 32,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 220,
      "top": 119,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#E9D2A4",
      "shadow": "inset 0 0 0 1.5px #E2BA78"
    },
    {
      "kind": "box",
      "left": 239,
      "top": 122,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #E2BA78"
    },
    {
      "kind": "svg",
      "left": 223,
      "top": 107,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:223px; top:107px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 240,
      "top": 133,
      "width": 52,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 244,
      "top": 118,
      "width": 22,
      "height": 16,
      "radius": "6px 2px 2px 4px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 266,
      "top": 118,
      "width": 22,
      "height": 16,
      "radius": "2px 6px 4px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 265,
      "top": 117,
      "width": 2,
      "height": 15,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 251,
      "top": 123,
      "width": 9,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 272,
      "top": 123,
      "width": 9,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "svg",
      "left": 80,
      "top": 52,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:80px; top:52px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "69": [
    {
      "kind": "box",
      "left": 60,
      "top": 32,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 280,
      "top": 36,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 145.3,
      "top": 170,
      "width": 49.4,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 144,
      "top": 140,
      "width": 52,
      "height": 8,
      "radius": "4px",
      "background": "#DEDDD7"
    },
    {
      "kind": "box",
      "left": 151,
      "top": 148,
      "width": 5,
      "height": 26,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 184,
      "top": 148,
      "width": 5,
      "height": 26,
      "radius": "2.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 158,
      "top": 118,
      "width": 24,
      "height": 20,
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 155,
      "top": 114,
      "width": 30,
      "height": 5,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 168.5,
      "top": 100,
      "width": 3,
      "height": 16,
      "radius": "1.5px",
      "background": "#A9AF9E"
    },
    {
      "kind": "box",
      "left": 154,
      "top": 80,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 160,
      "top": 92,
      "width": 10,
      "height": 14,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#BEC4B4",
      "rotate": -26
    },
    {
      "kind": "box",
      "left": 171,
      "top": 90,
      "width": 10,
      "height": 15,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#E9D2A4",
      "rotate": 22
    },
    {
      "kind": "box",
      "left": 238,
      "top": 124,
      "width": 50,
      "height": 32,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 4px 10px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 246,
      "top": 133,
      "width": 22.5,
      "height": 3.5,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 246,
      "top": 142,
      "width": 26,
      "height": 3.5,
      "radius": "2px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 235,
      "top": 158,
      "width": 54,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 96,
      "top": 54,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:96px; top:54px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "70": [
    {
      "kind": "box",
      "left": 56,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 40,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 95,
      "top": 154,
      "width": 110,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 98,
      "top": 142,
      "width": 104,
      "height": 10,
      "radius": "5px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2.5px 0 rgba(196,152,86,0.45)"
    },
    {
      "kind": "box",
      "left": 92,
      "top": 140,
      "width": 12,
      "height": 14,
      "radius": "4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 140,
      "width": 12,
      "height": 14,
      "radius": "4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 124,
      "top": 118,
      "width": 52,
      "height": 52,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 44,
      "top": 154,
      "width": 52,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 48,
      "top": 134,
      "width": 9,
      "height": 18,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 83,
      "top": 134,
      "width": 9,
      "height": 18,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 55,
      "top": 140,
      "width": 30,
      "height": 6,
      "radius": "3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 238,
      "top": 144,
      "width": 48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 242,
      "top": 100,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "#F7F6F2",
      "shadow": "inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)"
    },
    {
      "kind": "box",
      "left": 247,
      "top": 105,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "conic-gradient(#E9D2A4 0deg 118.80000000000001deg, rgba(0,0,0,0) 118.80000000000001deg 360deg)"
    },
    {
      "kind": "box",
      "left": 260.6,
      "top": 105,
      "width": 2.8,
      "height": 15,
      "radius": "1.5px",
      "background": "#55534E",
      "rotate": 118.80000000000001
    },
    {
      "kind": "box",
      "left": 259.5,
      "top": 117.5,
      "width": 5,
      "height": 5,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 257,
      "top": 93,
      "width": 10,
      "height": 6,
      "radius": "3px 3px 0 0",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 240,
      "top": 144,
      "width": 44,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 200,
      "top": 48,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:200px; top:48px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "71": [
    {
      "kind": "box",
      "left": 56,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 166,
      "width": 400,
      "height": 64,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 101,
      "top": 169,
      "width": 138,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 95,
      "top": 130,
      "width": 150,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 105,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 229,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 122,
      "top": 129,
      "width": 96,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 126,
      "top": 114,
      "width": 44,
      "height": 16,
      "radius": "6px 2px 2px 4px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 170,
      "top": 114,
      "width": 44,
      "height": 16,
      "radius": "2px 6px 4px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 169,
      "top": 113,
      "width": 2,
      "height": 15,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 133,
      "top": 119,
      "width": 31,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 176,
      "top": 119,
      "width": 31,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 134,
      "top": 112,
      "width": 28,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 134,
      "top": 119,
      "width": 22,
      "height": 2.5,
      "radius": "1px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 180,
      "top": 113,
      "width": 26,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 134,
      "top": 104,
      "width": 28,
      "height": 28,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 236,
      "top": 96,
      "width": 22,
      "height": 22,
      "radius": "50%",
      "background": "rgba(251,250,247,0.7)",
      "shadow": "inset 0 0 0 3px #55534E, 0 3px 8px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 254,
      "top": 116,
      "width": 7,
      "height": 18,
      "radius": "3.5px",
      "background": "#C6C5C0",
      "rotate": -42
    },
    {
      "kind": "svg",
      "left": 90,
      "top": 50,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:90px; top:50px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "72": [
    {
      "kind": "box",
      "left": 64,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.45)"
    },
    {
      "kind": "svg",
      "left": 220,
      "top": 40,
      "width": 16,
      "height": 8,
      "viewBox": "0 0 16 8",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "8",
          "viewBox": "0 0 16 8",
          "style": "position:absolute; left:220px; top:40px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": -80,
      "top": 110,
      "width": 300,
      "height": 120,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 120,
      "width": 300,
      "height": 110,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 132,
      "width": 430,
      "height": 98,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E7E6E0"
    },
    {
      "kind": "box",
      "left": -28,
      "top": 148,
      "width": 296,
      "height": 82,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#C9D7E3"
    },
    {
      "kind": "box",
      "left": 70,
      "top": 166,
      "width": 30,
      "height": 4,
      "radius": "2px",
      "background": "rgba(255,255,255,0.55)"
    },
    {
      "kind": "box",
      "left": 180,
      "top": 176,
      "width": 36,
      "height": 4,
      "radius": "2px",
      "background": "rgba(255,255,255,0.4)"
    },
    {
      "kind": "box",
      "left": 262,
      "top": 162,
      "width": 26,
      "height": 4,
      "radius": "2px",
      "background": "rgba(255,255,255,0.5)"
    },
    {
      "kind": "box",
      "left": 223,
      "top": 131,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 228,
      "top": 140,
      "width": 20,
      "height": 11,
      "radius": "50% 50% 46% 46% / 70% 70% 30% 30%",
      "background": "#E9D2A4",
      "rotate": -10,
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.4)"
    },
    {
      "kind": "box",
      "left": 236.5,
      "top": 136,
      "width": 2,
      "height": 6,
      "radius": "1px",
      "background": "#E2BA78",
      "rotate": 24
    },
    {
      "kind": "svg",
      "left": 120,
      "top": 140,
      "width": 60,
      "height": 20,
      "viewBox": "0 0 60 20",
      "svg": {
        "attrs": {
          "width": "60",
          "height": "20",
          "viewBox": "0 0 60 20",
          "style": "position:absolute; left:120px; top:140px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M4 14 Q20 6 36 12 Q48 16 56 10",
              "fill": "none",
              "stroke": "rgba(255,255,255,0.55)",
              "stroke-width": "2.4",
              "stroke-linecap": "round",
              "stroke-dasharray": "1 8"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 67,
      "top": 120,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 74.88,
      "top": 82,
      "width": 10.24,
      "height": 10.24,
      "radius": "50%",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 73.92,
      "top": 94.24,
      "width": 12.16,
      "height": 19.759999999999998,
      "radius": "6.08px 6.08px 2.56px 2.56px",
      "background": "#55534E"
    }
  ],
  "73": [
    {
      "kind": "box",
      "left": 60,
      "top": 32,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 284,
      "top": 36,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 170,
      "width": 400,
      "height": 60,
      "radius": "50% 50% 0 0 / 22px 22px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 158,
      "width": 80,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 138,
      "top": 30,
      "width": 64,
      "height": 10,
      "radius": "4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 144,
      "width": 64,
      "height": 10,
      "radius": "4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 144,
      "top": 40,
      "width": 52,
      "height": 52,
      "background": "rgba(200,215,229,0.35)"
    },
    {
      "kind": "box",
      "left": 144,
      "top": 92,
      "width": 52,
      "height": 52,
      "background": "rgba(200,215,229,0.35)"
    },
    {
      "kind": "box",
      "left": 144,
      "top": 58,
      "width": 52,
      "height": 34,
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 168.5,
      "top": 86,
      "width": 3,
      "height": 22,
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 155,
      "top": 128,
      "width": 30,
      "height": 16,
      "radius": "3px",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 148,
      "top": 114,
      "width": 44,
      "height": 44,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 251,
      "top": 106,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 260,
      "top": 128,
      "width": 12,
      "height": 30,
      "radius": "3px 3px 2px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 0 0 1.2px rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 265.2,
      "top": 124,
      "width": 1.6,
      "height": 4,
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 263,
      "top": 116,
      "width": 6,
      "height": 9,
      "radius": "50% 50% 50% 50% / 62% 62% 38% 38%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 251,
      "top": 160,
      "width": 30,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 48,
      "top": 36,
      "width": 16,
      "height": 16,
      "radius": "50%",
      "background": "#C5C4BD",
      "mask": "radial-gradient(circle at 13.6px 4.96px, transparent 6.24px, #000 6.56px)"
    }
  ],
  "74": [
    {
      "kind": "box",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "children": [
        {
          "kind": "box",
          "left": 56,
          "top": 32,
          "width": 2.5,
          "height": 2.5,
          "radius": "50%",
          "background": "rgba(200,225,235,0.4)"
        },
        {
          "kind": "box",
          "left": 292,
          "top": 38,
          "width": 2,
          "height": 2,
          "radius": "50%",
          "background": "rgba(200,225,235,0.35)"
        },
        {
          "kind": "box",
          "left": -30,
          "top": 170,
          "width": 400,
          "height": 60,
          "radius": "50% 50% 0 0 / 24px 24px 0 0",
          "background": "#EAE9E3"
        },
        {
          "kind": "box",
          "left": 115,
          "top": 168,
          "width": 110,
          "height": 11,
          "radius": "50%",
          "background": "rgba(0,0,0,0.1)",
          "blur": 5
        },
        {
          "kind": "box",
          "left": 124,
          "top": 136,
          "width": 92,
          "height": 32,
          "radius": "6px",
          "background": "#D6D5D0"
        },
        {
          "kind": "box",
          "left": 120,
          "top": 126,
          "width": 44,
          "height": 12,
          "radius": "5px 3px 3px 3px",
          "background": "#C6C5C0",
          "rotate": -24
        },
        {
          "kind": "box",
          "left": 176,
          "top": 126,
          "width": 44,
          "height": 12,
          "radius": "3px 5px 3px 3px",
          "background": "#C6C5C0",
          "rotate": 24
        },
        {
          "kind": "box",
          "left": 144,
          "top": 94,
          "width": 52,
          "height": 52,
          "radius": "50%",
          "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
          "blur": 5
        },
        {
          "kind": "box",
          "left": 163,
          "top": 110,
          "width": 14,
          "height": 20,
          "radius": "4px",
          "background": "#E9D2A4",
          "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
        },
        {
          "kind": "box",
          "left": 148,
          "top": 102,
          "width": 4,
          "height": 4,
          "radius": "50%",
          "background": "rgba(226,186,120,0.7)"
        },
        {
          "kind": "box",
          "left": 186,
          "top": 96,
          "width": 3.5,
          "height": 3.5,
          "radius": "50%",
          "background": "rgba(226,186,120,0.6)"
        },
        {
          "kind": "box",
          "left": 168,
          "top": 90,
          "width": 3,
          "height": 3,
          "radius": "50%",
          "background": "rgba(226,186,120,0.5)"
        },
        {
          "kind": "svg",
          "left": 84,
          "top": 52,
          "width": 14.4,
          "height": 7.2,
          "viewBox": "0 0 14.4 7.2",
          "svg": {
            "attrs": {
              "width": "14.4",
              "height": "7.2",
              "viewBox": "0 0 14.4 7.2",
              "style": "position:absolute; left:84px; top:52px;"
            },
            "children": [
              {
                "tag": "path",
                "attrs": {
                  "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
                  "fill": "none",
                  "stroke": "#8A857C",
                  "stroke-width": "1.6",
                  "stroke-linecap": "round"
                }
              }
            ]
          }
        },
        {
          "kind": "svg",
          "left": 258,
          "top": 46,
          "width": 12.8,
          "height": 6.4,
          "viewBox": "0 0 12.8 6.4",
          "svg": {
            "attrs": {
              "width": "12.8",
              "height": "6.4",
              "viewBox": "0 0 12.8 6.4",
              "style": "position:absolute; left:258px; top:46px;"
            },
            "children": [
              {
                "tag": "path",
                "attrs": {
                  "d": "M1 4.800000000000001 Q3.6 1.2000000000000002 6.4 4 Q9.200000000000001 1.2000000000000002 12 4.800000000000001",
                  "fill": "none",
                  "stroke": "#8A857C",
                  "stroke-width": "1.6",
                  "stroke-linecap": "round"
                }
              }
            ]
          }
        }
      ]
    }
  ],
  "75": [
    {
      "kind": "box",
      "left": 64,
      "top": 32,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "svg",
      "left": 140,
      "top": 46,
      "width": 16,
      "height": 8,
      "viewBox": "0 0 16 8",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "8",
          "viewBox": "0 0 16 8",
          "style": "position:absolute; left:140px; top:46px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": -80,
      "top": 120,
      "width": 300,
      "height": 110,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 130,
      "width": 300,
      "height": 100,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 150,
      "width": 430,
      "height": 80,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "svg",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "viewBox": "0 0 340 200",
      "svg": {
        "attrs": {
          "width": "340",
          "height": "200",
          "viewBox": "0 0 340 200",
          "style": "position:absolute; left:0px; top:0px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M70 204 Q 122 152 180 158 T 264 124 L 272 124 Q 210 166 190 178 T 114 204 Z",
              "fill": "#DDDCD5"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 105,
      "top": 160,
      "width": 30,
      "height": 12,
      "radius": "50%",
      "background": "#DDDCD5"
    },
    {
      "kind": "box",
      "left": 184,
      "top": 137.2,
      "width": 24,
      "height": 9.600000000000001,
      "radius": "50%",
      "background": "#DDDCD5"
    },
    {
      "kind": "box",
      "left": 248,
      "top": 122,
      "width": 20,
      "height": 8,
      "radius": "50%",
      "background": "#DDDCD5"
    },
    {
      "kind": "box",
      "left": 267,
      "top": 120,
      "width": 30,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 280.5,
      "top": 82,
      "width": 3,
      "height": 40,
      "radius": "1.5px",
      "background": "#8A857C"
    },
    {
      "kind": "box",
      "left": 283.5,
      "top": 82,
      "width": 26,
      "height": 16,
      "radius": "2px 3px 3px 2px",
      "background": "#E9D2A4",
      "shadow": "inset -2px -2px 0 rgba(0,0,0,0.05)"
    },
    {
      "kind": "box",
      "left": 278.5,
      "top": 78.5,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 257,
      "top": 1,
      "width": 86,
      "height": 86,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 287,
      "top": 31,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "#E9D2A4"
    }
  ],
  "76": [
    {
      "kind": "box",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "children": [
        {
          "kind": "box",
          "left": 60,
          "top": 40,
          "width": 2.5,
          "height": 2.5,
          "radius": "50%",
          "background": "rgba(200,225,235,0.4)"
        },
        {
          "kind": "box",
          "left": 288,
          "top": 34,
          "width": 2,
          "height": 2,
          "radius": "50%",
          "background": "rgba(200,225,235,0.3)"
        },
        {
          "kind": "box",
          "left": -30,
          "top": 164,
          "width": 400,
          "height": 66,
          "radius": "50% 50% 0 0 / 26px 26px 0 0",
          "background": "#EAE9E3"
        },
        {
          "kind": "box",
          "left": 179,
          "top": 163,
          "width": 74,
          "height": 11,
          "radius": "50%",
          "background": "rgba(0,0,0,0.09)",
          "blur": 5
        },
        {
          "kind": "box",
          "left": 186,
          "top": 106,
          "width": 16,
          "height": 44,
          "radius": "8px 6px 4px 4px",
          "background": "#D6D5D0"
        },
        {
          "kind": "box",
          "left": 190,
          "top": 134,
          "width": 52,
          "height": 18,
          "radius": "6px 10px 4px 4px",
          "background": "#D6D5D0",
          "shadow": "inset 0 3px 0 rgba(255,255,255,0.35)"
        },
        {
          "kind": "box",
          "left": 234,
          "top": 128,
          "width": 12,
          "height": 24,
          "radius": "6px 6px 4px 4px",
          "background": "#D6D5D0"
        },
        {
          "kind": "box",
          "left": 192,
          "top": 152,
          "width": 6,
          "height": 11,
          "radius": "0 0 3px 3px",
          "background": "#B4B1AB"
        },
        {
          "kind": "box",
          "left": 234,
          "top": 152,
          "width": 6,
          "height": 11,
          "radius": "0 0 3px 3px",
          "background": "#B4B1AB"
        },
        {
          "kind": "box",
          "left": 271,
          "top": 118,
          "width": 30,
          "height": 30,
          "radius": "50%",
          "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
          "blur": 5
        },
        {
          "kind": "box",
          "left": 280,
          "top": 140,
          "width": 12,
          "height": 24,
          "radius": "3px 3px 2px 2px",
          "background": "#FBFAF7",
          "shadow": "inset 0 0 0 1.2px rgba(0,0,0,0.06)"
        },
        {
          "kind": "box",
          "left": 285.2,
          "top": 136,
          "width": 1.6,
          "height": 4,
          "background": "#B4B1AB"
        },
        {
          "kind": "box",
          "left": 283,
          "top": 128,
          "width": 6,
          "height": 9,
          "radius": "50% 50% 50% 50% / 62% 62% 38% 38%",
          "background": "#E2BA78"
        },
        {
          "kind": "box",
          "left": 272,
          "top": 166,
          "width": 28,
          "height": 11,
          "radius": "50%",
          "background": "rgba(0,0,0,0.07)",
          "blur": 5
        },
        {
          "kind": "box",
          "left": 51.839999999999996,
          "top": 169,
          "width": 88.32000000000001,
          "height": 11,
          "radius": "50%",
          "background": "rgba(0,0,0,0.09)",
          "blur": 5
        },
        {
          "kind": "box",
          "left": 48,
          "top": 134,
          "width": 96,
          "height": 9,
          "radius": "4.5px",
          "background": "#E0DFDA"
        },
        {
          "kind": "box",
          "left": 58,
          "top": 143,
          "width": 6,
          "height": 32,
          "radius": "3px",
          "background": "#C6C5C0"
        },
        {
          "kind": "box",
          "left": 128,
          "top": 143,
          "width": 6,
          "height": 32,
          "radius": "3px",
          "background": "#C6C5C0"
        },
        {
          "kind": "box",
          "left": 68,
          "top": 119,
          "width": 20,
          "height": 15,
          "radius": "2px 2px 7px 7px",
          "background": "#E9D2A4",
          "shadow": "inset 0 0 0 1.5px #E2BA78"
        },
        {
          "kind": "box",
          "left": 87,
          "top": 122,
          "width": 7,
          "height": 7,
          "radius": "50%",
          "shadow": "inset 0 0 0 2px #E2BA78"
        },
        {
          "kind": "svg",
          "left": 71,
          "top": 107,
          "width": 14,
          "height": 10,
          "viewBox": "0 0 14 10",
          "svg": {
            "attrs": {
              "width": "14",
              "height": "10",
              "viewBox": "0 0 14 10",
              "style": "position:absolute; left:71px; top:107px;"
            },
            "children": [
              {
                "tag": "path",
                "attrs": {
                  "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
                  "stroke": "#C6C5C0",
                  "stroke-width": "1.6",
                  "fill": "none",
                  "stroke-linecap": "round"
                }
              }
            ]
          }
        },
        {
          "kind": "box",
          "left": 104,
          "top": 112,
          "width": 32,
          "height": 20,
          "radius": "4px 4px 2px 2px",
          "background": "#D6D5D0"
        },
        {
          "kind": "box",
          "left": 104,
          "top": 120,
          "width": 32,
          "height": 3,
          "background": "#C6C5C0"
        },
        {
          "kind": "box",
          "left": 192,
          "top": 96,
          "width": 48,
          "height": 48,
          "radius": "50%",
          "background": "radial-gradient(closest-side, rgba(226,186,120,0.3), rgba(226,186,120,0) 74%)",
          "blur": 5
        },
        {
          "kind": "svg",
          "left": 160,
          "top": 44,
          "width": 14.4,
          "height": 7.2,
          "viewBox": "0 0 14.4 7.2",
          "svg": {
            "attrs": {
              "width": "14.4",
              "height": "7.2",
              "viewBox": "0 0 14.4 7.2",
              "style": "position:absolute; left:160px; top:44px;"
            },
            "children": [
              {
                "tag": "path",
                "attrs": {
                  "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
                  "fill": "none",
                  "stroke": "#8A857C",
                  "stroke-width": "1.6",
                  "stroke-linecap": "round"
                }
              }
            ]
          }
        }
      ]
    }
  ],
  "77": [
    {
      "kind": "box",
      "left": 150,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 162,
      "width": 400,
      "height": 68,
      "radius": "50% 50% 0 0 / 26px 26px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 52,
      "top": 42,
      "width": 52,
      "height": 66,
      "radius": "6px",
      "background": "#EAF0F5",
      "shadow": "0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 76,
      "top": 42,
      "width": 4,
      "height": 66,
      "background": "#E4E3DE"
    },
    {
      "kind": "box",
      "left": 52,
      "top": 72,
      "width": 52,
      "height": 4,
      "background": "#E4E3DE"
    },
    {
      "kind": "box",
      "left": 86,
      "top": 54,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "rgba(226,186,120,0.9)"
    },
    {
      "kind": "box",
      "left": 75,
      "top": 43,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 45,
      "top": 108,
      "width": 66,
      "height": 7,
      "radius": "3px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 149.6,
      "top": 169,
      "width": 128.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 144,
      "top": 126,
      "width": 140,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 154,
      "top": 135,
      "width": 6,
      "height": 40,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 268,
      "top": 135,
      "width": 6,
      "height": 40,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 170,
      "top": 111,
      "width": 20,
      "height": 15,
      "radius": "2px 2px 7px 7px",
      "background": "#E9D2A4",
      "shadow": "inset 0 0 0 1.5px #E2BA78"
    },
    {
      "kind": "box",
      "left": 189,
      "top": 114,
      "width": 7,
      "height": 7,
      "radius": "50%",
      "shadow": "inset 0 0 0 2px #E2BA78"
    },
    {
      "kind": "svg",
      "left": 173,
      "top": 99,
      "width": 14,
      "height": 10,
      "viewBox": "0 0 14 10",
      "svg": {
        "attrs": {
          "width": "14",
          "height": "10",
          "viewBox": "0 0 14 10",
          "style": "position:absolute; left:173px; top:99px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q1.5 6 3.5 4 Q5.5 2 4 0 M9 9 Q7.5 6 9.5 4 Q11.5 2 10 0",
              "stroke": "#C6C5C0",
              "stroke-width": "1.6",
              "fill": "none",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 208,
      "top": 125,
      "width": 60,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 212,
      "top": 110,
      "width": 26,
      "height": 16,
      "radius": "6px 2px 2px 4px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 238,
      "top": 110,
      "width": 26,
      "height": 16,
      "radius": "2px 6px 4px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 237,
      "top": 109,
      "width": 2,
      "height": 15,
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 219,
      "top": 115,
      "width": 13,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 244,
      "top": 115,
      "width": 13,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 286,
      "top": 165,
      "width": 32,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 290.8,
      "top": 148.4,
      "width": 22.400000000000002,
      "height": 17.6,
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 288.4,
      "top": 145.2,
      "width": 27.200000000000003,
      "height": 4.800000000000001,
      "radius": "3px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 300.8,
      "top": 129.2,
      "width": 2.4000000000000004,
      "height": 17.6,
      "radius": "1.5px",
      "background": "#A9AF9E"
    },
    {
      "kind": "box",
      "left": 292.4,
      "top": 121.19999999999999,
      "width": 9.600000000000001,
      "height": 13.600000000000001,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#BEC4B4",
      "rotate": -28
    },
    {
      "kind": "box",
      "left": 302.8,
      "top": 119.6,
      "width": 9.600000000000001,
      "height": 15.200000000000001,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#C9CEC1",
      "rotate": 24
    },
    {
      "kind": "box",
      "left": 297.6,
      "top": 116.4,
      "width": 8.8,
      "height": 12,
      "radius": "50% 50% 46% 46% / 66% 66% 34% 34%",
      "background": "#D3D7CB",
      "rotate": -2
    },
    {
      "kind": "svg",
      "left": 160,
      "top": 58,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:160px; top:58px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "78": [
    {
      "kind": "box",
      "left": 60,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 30,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 83,
      "top": 123,
      "width": 190,
      "height": 2,
      "radius": "1px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 65,
      "top": 113,
      "width": 22,
      "height": 22,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 69,
      "top": 117,
      "width": 14,
      "height": 14,
      "radius": "50%",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 103,
      "top": 113,
      "width": 22,
      "height": 22,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 107,
      "top": 117,
      "width": 14,
      "height": 14,
      "radius": "50%",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 141,
      "top": 113,
      "width": 22,
      "height": 22,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 145,
      "top": 117,
      "width": 14,
      "height": 14,
      "radius": "50%",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 179,
      "top": 113,
      "width": 22,
      "height": 22,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 183,
      "top": 117,
      "width": 14,
      "height": 14,
      "radius": "50%",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 221,
      "top": 117,
      "width": 14,
      "height": 14,
      "radius": "50%",
      "background": "#E8E7E1",
      "shadow": "inset 0 0 0 1.6px #C6C5C0"
    },
    {
      "kind": "box",
      "left": 259,
      "top": 117,
      "width": 14,
      "height": 14,
      "radius": "50%",
      "background": "#E8E7E1",
      "shadow": "inset 0 0 0 1.6px #C6C5C0"
    },
    {
      "kind": "svg",
      "left": 282,
      "top": 115,
      "width": 20,
      "height": 18,
      "viewBox": "0 0 20 18",
      "svg": {
        "attrs": {
          "width": "20",
          "height": "18",
          "viewBox": "0 0 20 18",
          "style": "position:absolute; left:282px; top:115px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M3 9 Q9 3 16 9 Q9 15 3 9 Z",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "2.2",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 152,
      "top": 46,
      "width": 36,
      "height": 36,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 132,
      "top": 44,
      "width": 76,
      "height": 40,
      "viewBox": "0 0 76 40",
      "svg": {
        "attrs": {
          "width": "76",
          "height": "40",
          "viewBox": "0 0 76 40",
          "style": "position:absolute; left:132px; top:44px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M38 20 C30 6 8 6 8 20 C8 34 30 34 38 20 C46 6 68 6 68 20 C68 34 46 34 38 20 Z",
              "fill": "none",
              "stroke": "#E2BA78",
              "stroke-width": "3",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 120,
      "top": 160,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:120px; top:160px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "79": [
    {
      "kind": "box",
      "left": 56,
      "top": 34,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 38,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 94.56,
      "top": 169,
      "width": 150.88,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 88,
      "top": 130,
      "width": 164,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 98,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 236,
      "top": 139,
      "width": 6,
      "height": 36,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 93,
      "top": 132,
      "width": 54,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.05)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 96,
      "top": 122,
      "width": 48,
      "height": 8,
      "radius": "2px 4px 4px 2px",
      "background": "#E8E7E1",
      "shadow": "0 0 0 1px rgba(0,0,0,0.05)"
    },
    {
      "kind": "box",
      "left": 96,
      "top": 118,
      "width": 48,
      "height": 5,
      "radius": "2px 3px 0 0",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 96,
      "width": 52,
      "height": 34,
      "radius": "3px 6px 6px 3px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 96,
      "width": 7,
      "height": 34,
      "radius": "3px 0 0 3px",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 230,
      "top": 90,
      "width": 5,
      "height": 12,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 206,
      "top": 96,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 268,
      "top": 150,
      "width": 36,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -24,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 268,
      "top": 150,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 268,
      "top": 150.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 262,
      "top": 162,
      "width": 40,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    }
  ],
  "80": [
    {
      "kind": "box",
      "left": 64,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "svg",
      "left": 230,
      "top": 36,
      "width": 16,
      "height": 8,
      "viewBox": "0 0 16 8",
      "svg": {
        "attrs": {
          "width": "16",
          "height": "8",
          "viewBox": "0 0 16 8",
          "style": "position:absolute; left:230px; top:36px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": -80,
      "top": 118,
      "width": 300,
      "height": 112,
      "radius": "50% 50% 0 0 / 52px 52px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 130,
      "top": 128,
      "width": 300,
      "height": 102,
      "radius": "50% 50% 0 0 / 48px 48px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": -40,
      "top": 148,
      "width": 430,
      "height": 82,
      "radius": "50% 50% 0 0 / 40px 40px 0 0",
      "background": "#E2E1DB"
    },
    {
      "kind": "svg",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "viewBox": "0 0 340 200",
      "svg": {
        "attrs": {
          "width": "340",
          "height": "200",
          "viewBox": "0 0 340 200",
          "style": "position:absolute; left:0px; top:0px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M150 196 Q140 160 118 138 Q96 118 66 108",
              "fill": "none",
              "stroke": "#D8D7D0",
              "stroke-width": "9",
              "stroke-linecap": "round",
              "stroke-dasharray": "10 12"
            }
          }
        ]
      }
    },
    {
      "kind": "svg",
      "left": 0,
      "top": 0,
      "width": 340,
      "height": 200,
      "viewBox": "0 0 340 200",
      "svg": {
        "attrs": {
          "width": "340",
          "height": "200",
          "viewBox": "0 0 340 200",
          "style": "position:absolute; left:0px; top:0px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M172 196 Q186 156 216 134 Q246 114 282 108",
              "fill": "none",
              "stroke": "#DDDCD5",
              "stroke-width": "13",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 267,
      "top": 91,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 276,
      "top": 100,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "box",
      "left": 58,
      "top": 100,
      "width": 9,
      "height": 9,
      "radius": "50%",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 21.1,
      "top": 150,
      "width": 37.8,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 38.25,
      "top": 126.2,
      "width": 3.5,
      "height": 23.799999999999997,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 22.5,
      "top": 108,
      "width": 22.4,
      "height": 22.4,
      "radius": "50%",
      "background": "#C9CEC1"
    },
    {
      "kind": "box",
      "left": 34.4,
      "top": 99.6,
      "width": 23.799999999999997,
      "height": 23.799999999999997,
      "radius": "50%",
      "background": "#D3D7CB"
    },
    {
      "kind": "box",
      "left": 33,
      "top": 113.6,
      "width": 23.799999999999997,
      "height": 21,
      "radius": "50%",
      "background": "#BEC4B4"
    },
    {
      "kind": "box",
      "left": 27.4,
      "top": 103.80000000000001,
      "width": 18.2,
      "height": 18.2,
      "radius": "50%",
      "background": "#CDD2C5"
    },
    {
      "kind": "box",
      "left": 289.26,
      "top": 144,
      "width": 33.48,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 304.45,
      "top": 122.92,
      "width": 3.1,
      "height": 21.08,
      "radius": "2.5px",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 290.5,
      "top": 106.8,
      "width": 19.84,
      "height": 19.84,
      "radius": "50%",
      "background": "#C9CEC1"
    },
    {
      "kind": "box",
      "left": 301.04,
      "top": 99.36,
      "width": 21.08,
      "height": 21.08,
      "radius": "50%",
      "background": "#D3D7CB"
    },
    {
      "kind": "box",
      "left": 299.8,
      "top": 111.75999999999999,
      "width": 21.08,
      "height": 18.6,
      "radius": "50%",
      "background": "#BEC4B4"
    },
    {
      "kind": "box",
      "left": 294.84,
      "top": 103.08,
      "width": 16.12,
      "height": 16.12,
      "radius": "50%",
      "background": "#CDD2C5"
    }
  ],
  "81": [
    {
      "kind": "box",
      "left": 56,
      "top": 32,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 36,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 172,
      "width": 400,
      "height": 58,
      "radius": "50% 50% 0 0 / 20px 20px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 64,
      "top": 58,
      "width": 212,
      "height": 8,
      "radius": "4px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 92,
      "top": 70,
      "width": 6,
      "height": 6,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 84,
      "top": 84,
      "width": 22,
      "height": 30,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 2px 6px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 88,
      "top": 92,
      "width": 14,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 88,
      "top": 98,
      "width": 10,
      "height": 2.5,
      "radius": "1px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 164,
      "top": 70,
      "width": 6,
      "height": 6,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 151,
      "top": 80,
      "width": 32,
      "height": 32,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 158,
      "top": 80,
      "width": 18,
      "height": 26,
      "radius": "9px 9px 4px 4px",
      "background": "#E9D2A4",
      "shadow": "inset 0 -2px 0 rgba(196,152,86,0.5)"
    },
    {
      "kind": "box",
      "left": 163,
      "top": 106,
      "width": 8,
      "height": 10,
      "radius": "0 0 3px 3px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 236,
      "top": 70,
      "width": 6,
      "height": 6,
      "radius": "50%",
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 226,
      "top": 82,
      "width": 26,
      "height": 18,
      "radius": "9px",
      "opacity": 0.85,
      "shadow": "inset 0 0 0 4px #55534E"
    },
    {
      "kind": "box",
      "left": 234,
      "top": 100,
      "width": 10,
      "height": 12,
      "radius": "0 0 4px 4px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 159,
      "width": 64,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 138,
      "top": 146,
      "width": 30,
      "height": 12,
      "radius": "9px 5px 2px 3px",
      "background": "#55534E"
    },
    {
      "kind": "box",
      "left": 138,
      "top": 155,
      "width": 30,
      "height": 3,
      "radius": "1.5px",
      "background": "#F7F6F2",
      "shadow": "0 1px 1px rgba(0,0,0,0.12)"
    },
    {
      "kind": "box",
      "left": 145,
      "top": 148,
      "width": 6,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(244,243,240,0.55)"
    },
    {
      "kind": "box",
      "left": 172,
      "top": 146,
      "width": 30,
      "height": 12,
      "radius": "9px 5px 2px 3px",
      "background": "#6B6862"
    },
    {
      "kind": "box",
      "left": 172,
      "top": 155,
      "width": 30,
      "height": 3,
      "radius": "1.5px",
      "background": "#F7F6F2",
      "shadow": "0 1px 1px rgba(0,0,0,0.12)"
    },
    {
      "kind": "box",
      "left": 179,
      "top": 148,
      "width": 6,
      "height": 3,
      "radius": "1.5px",
      "background": "rgba(244,243,240,0.55)"
    }
  ],
  "82": [
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 288,
      "top": 32,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 105,
      "top": 166,
      "width": 130,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.1)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 114,
      "top": 96,
      "width": 112,
      "height": 68,
      "radius": "8px",
      "background": "#D6D5D0",
      "shadow": "0 0 0 1px rgba(0,0,0,0.06), 0 6px 14px rgba(40,38,32,0.12)"
    },
    {
      "kind": "box",
      "left": 128,
      "top": 86,
      "width": 26,
      "height": 10,
      "radius": "4px 4px 0 0",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 162,
      "top": 86,
      "width": 26,
      "height": 10,
      "radius": "4px 4px 0 0",
      "background": "#E9D2A4"
    },
    {
      "kind": "box",
      "left": 196,
      "top": 86,
      "width": 26,
      "height": 10,
      "radius": "4px 4px 0 0",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 126,
      "top": 108,
      "width": 88,
      "height": 44,
      "radius": "4px",
      "background": "#FBFAF7",
      "shadow": "0 1px 3px rgba(40,38,32,0.1)"
    },
    {
      "kind": "box",
      "left": 136,
      "top": 118,
      "width": 52,
      "height": 3,
      "radius": "1.5px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 136,
      "top": 127,
      "width": 64,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 136,
      "top": 136,
      "width": 44,
      "height": 3,
      "radius": "1.5px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 162,
      "top": 77,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 80,
      "top": 54,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:80px; top:54px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "83": [
    {
      "kind": "box",
      "left": 60,
      "top": 36,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 292,
      "top": 42,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.3)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 168,
      "width": 400,
      "height": 62,
      "radius": "50% 50% 0 0 / 24px 24px 0 0",
      "background": "#EAE9E3"
    },
    {
      "kind": "box",
      "left": 101,
      "top": 173,
      "width": 138,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.09)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 95,
      "top": 132,
      "width": 150,
      "height": 9,
      "radius": "4.5px",
      "background": "#E0DFDA"
    },
    {
      "kind": "box",
      "left": 105,
      "top": 141,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 229,
      "top": 141,
      "width": 6,
      "height": 38,
      "radius": "3px",
      "background": "#C6C5C0"
    },
    {
      "kind": "box",
      "left": 134,
      "top": 132.5,
      "width": 72,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.08)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 137,
      "top": 89.5,
      "width": 66,
      "height": 41,
      "radius": "5px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 5px 12px rgba(40,38,32,0.12)"
    },
    {
      "kind": "svg",
      "left": 137,
      "top": 89.5,
      "width": 66,
      "height": 41,
      "viewBox": "0 0 66 41",
      "svg": {
        "attrs": {
          "width": "66",
          "height": "41",
          "viewBox": "0 0 66 41",
          "style": "position:absolute; left:137px; top:89.5px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M2 4 L33 23.5 L64 4",
              "fill": "none",
              "stroke": "#C6C5C0",
              "stroke-width": "2",
              "stroke-linejoin": "round"
            }
          }
        ]
      }
    },
    {
      "kind": "box",
      "left": 164,
      "top": 107,
      "width": 12,
      "height": 12,
      "radius": "50%",
      "background": "#E2BA78",
      "shadow": "0 0 0 2.5px rgba(226,186,120,0.35)"
    },
    {
      "kind": "box",
      "left": 150,
      "top": 84,
      "width": 40,
      "height": 40,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 237,
      "top": 88,
      "width": 30,
      "height": 30,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 246,
      "top": 110,
      "width": 12,
      "height": 22,
      "radius": "3px 3px 2px 2px",
      "background": "#FBFAF7",
      "shadow": "inset 0 0 0 1.2px rgba(0,0,0,0.06)"
    },
    {
      "kind": "box",
      "left": 251.2,
      "top": 106,
      "width": 1.6,
      "height": 4,
      "background": "#B4B1AB"
    },
    {
      "kind": "box",
      "left": 249,
      "top": 98,
      "width": 6,
      "height": 9,
      "radius": "50% 50% 50% 50% / 62% 62% 38% 38%",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 239,
      "top": 134,
      "width": 26,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.07)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 92,
      "top": 120,
      "width": 34,
      "height": 7,
      "radius": "2px",
      "background": "#E9D2A4",
      "rotate": -24,
      "shadow": "inset 0 -1.5px 0 rgba(0,0,0,0.08)"
    },
    {
      "kind": "box",
      "left": 92,
      "top": 120,
      "width": 9,
      "height": 7,
      "radius": "2px 0 0 2px",
      "background": "#C6C5C0",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 92,
      "top": 120.5,
      "width": 7,
      "height": 6,
      "background": "#55534E",
      "rotate": -24
    },
    {
      "kind": "box",
      "left": 87,
      "top": 132,
      "width": 38,
      "height": 11,
      "radius": "50%",
      "background": "rgba(0,0,0,0.06)",
      "blur": 5
    },
    {
      "kind": "svg",
      "left": 258,
      "top": 48,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:258px; top:48px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ],
  "84": [
    {
      "kind": "box",
      "left": 56,
      "top": 30,
      "width": 2.5,
      "height": 2.5,
      "radius": "50%",
      "background": "rgba(200,225,235,0.4)"
    },
    {
      "kind": "box",
      "left": 296,
      "top": 34,
      "width": 2,
      "height": 2,
      "radius": "50%",
      "background": "rgba(200,225,235,0.35)"
    },
    {
      "kind": "box",
      "left": -30,
      "top": 176,
      "width": 400,
      "height": 54,
      "radius": "50% 50% 0 0 / 18px 18px 0 0",
      "background": "#ECEBE5"
    },
    {
      "kind": "box",
      "left": 104,
      "top": 40,
      "width": 132,
      "height": 96,
      "radius": "12px",
      "background": "#FBFAF7",
      "shadow": "0 0 0 1px rgba(0,0,0,0.07), 0 10px 22px rgba(40,38,32,0.13)"
    },
    {
      "kind": "box",
      "left": 157,
      "top": 25,
      "width": 26,
      "height": 26,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.55), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 164,
      "top": 32,
      "width": 11,
      "height": 11,
      "radius": "50%",
      "background": "rgba(226,186,120,1)"
    },
    {
      "kind": "box",
      "left": 122,
      "top": 64,
      "width": 70,
      "height": 4,
      "radius": "2px",
      "background": "#E2BA78"
    },
    {
      "kind": "box",
      "left": 122,
      "top": 80,
      "width": 96,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 122,
      "top": 94,
      "width": 84,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 122,
      "top": 108,
      "width": 90,
      "height": 3.5,
      "radius": "2px",
      "background": "#D6D5D0"
    },
    {
      "kind": "box",
      "left": 18,
      "top": 18,
      "width": 84,
      "height": 84,
      "radius": "50%",
      "background": "radial-gradient(closest-side, rgba(226,186,120,0.35), rgba(226,186,120,0) 74%)",
      "blur": 5
    },
    {
      "kind": "box",
      "left": 48,
      "top": 48,
      "width": 24,
      "height": 24,
      "radius": "50%",
      "background": "#E9D2A4"
    },
    {
      "kind": "svg",
      "left": 262,
      "top": 66,
      "width": 14.4,
      "height": 7.2,
      "viewBox": "0 0 14.4 7.2",
      "svg": {
        "attrs": {
          "width": "14.4",
          "height": "7.2",
          "viewBox": "0 0 14.4 7.2",
          "style": "position:absolute; left:262px; top:66px;"
        },
        "children": [
          {
            "tag": "path",
            "attrs": {
              "d": "M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4",
              "fill": "none",
              "stroke": "#8A857C",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }
          }
        ]
      }
    }
  ]
} as unknown as Record<number, TaskSceneLayer[]>;

/** The option glyphs, 22 in a 20-unit box, in the order the rows draw them. */
export const TASK_OPTION_ICONS: Record<number, { attrs: Record<string, string>; children: TaskSvgChild[] }[]> = {
  "1": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3 15.5V6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "fill": "none"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "5.6",
            "cy": "8.9",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4",
            "y": "3",
            "width": "12",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3v14",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 7.5h0M13.2 7.5h0",
            "stroke": "#3A3934",
            "stroke-width": "1.8",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 10.5v2M13.2 10.5v2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M4 9V7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5V9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 9a1.8 1.8 0 0 1 1.8 1.8V12h9.4v-1.2A1.8 1.8 0 0 1 16.5 9a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14v-3.5A1.5 1.5 0 0 1 3.5 9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 8.2V11l2 1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4.5 4.5L3 6M15.5 4.5L17 6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "2": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M14.5 3L9.6 9.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9.9 9.4c1.8.9 2.9 2.2 3.3 4.3l-5.7 3c-1.5-1.4-2-3-1.7-5.1Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.4 12.4l2.5 1.5",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4",
            "y": "3",
            "width": "12",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3v14",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 7.5h0M13.2 7.5h0",
            "stroke": "#3A3934",
            "stroke-width": "1.8",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 10.5v2M13.2 10.5v2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6 7.6h8l1 8.9H5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.8 7.6V6a2.2 2.2 0 0 1 4.4 0v1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M4.5 6h11M8 6V4.6h4V6M6.2 6l.7 10.4h6.2L13.8 6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.7 9v4.4M11.3 9v4.4",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "3": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 2.6v2M10 15.4v2M2.6 10h2M15.4 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M15.4 4.6L14 6M6 14l-1.4 1.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.8 12.5a3.3 3.3 0 1 1 .6-6.6A4.3 4.3 0 0 1 14.8 7a2.9 2.9 0 0 1-.6 5.5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7 14.6l-.9 2.2M10.5 14.6l-.9 2.2M14 14.6l-.9 2.2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 9.7L10 3.6l6.5 6.1v6.8h-4.6v-4.2H8.1v4.2H3.5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.6 8.2c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6M2.6 14c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "4": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 6.2V10l2.6 1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 12.1A6.6 6.6 0 1 1 8.2 4.2a5.3 5.3 0 0 0 7.5 7.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 8.2V11l2 1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4.5 4.5L3 6M15.5 4.5L17 6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4",
            "y": "3",
            "width": "12",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3v14",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 7.5h0M13.2 7.5h0",
            "stroke": "#3A3934",
            "stroke-width": "1.8",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 10.5v2M13.2 10.5v2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "5": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M7 6.5L3.5 10 7 13.5M13 6.5l3.5 3.5L13 13.5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 15.2V5.2l7-1.6v9.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "6.2",
            "cy": "15.2",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "13.2",
            "cy": "13.4",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3a5 5 0 0 1 2.9 9.1c-.6.5-.9 1-.9 1.9H8c0-.9-.3-1.4-.9-1.9A5 5 0 0 1 10 3Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.4 16.6h3.2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "6": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 3.8L8.6 7l-1.7 1.6a10.8 10.8 0 0 0 4.5 4.5L13 11.4l3.2 1.8-.9 2.9c-.3.8-1.1 1.3-1.9 1.1A13.6 13.6 0 0 1 2.8 6.6c-.2-.8.3-1.6 1.1-1.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "4.5",
            "width": "11",
            "height": "12.5",
            "rx": "1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.5 7.8h1.6M10.9 7.8h1.6M7.5 10.8h1.6M10.9 10.8h1.6M9 17v-2.8h2V17",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 6.2V10l2.6 1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "7": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "5",
            "width": "13",
            "height": "10",
            "rx": "1.5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 5v10M13.4 5v10M3.5 8h3.1M3.5 12h3.1M13.4 8h3.1M13.4 12h3.1",
            "stroke": "#3A3934",
            "stroke-width": "1.3"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3",
            "y": "5.5",
            "width": "14",
            "height": "9.5",
            "rx": "2",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 10.2h4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "13.6",
            "cy": "10.2",
            "r": "0.9",
            "fill": "#3A3934"
          }
        }
      ]
    }
  ],
  "8": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.6 8.2c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6M2.6 14c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.2 7.6H12a4 4 0 0 1 0 8H8.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8 4.6l-3 3 3 3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 2.6v2M10 15.4v2M2.6 10h2M15.4 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M15.4 4.6L14 6M6 14l-1.4 1.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "9": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 5.4h8.5M8 10h8.5M8 14.6h8.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "5.4",
            "r": "1",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "10",
            "r": "1",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "14.6",
            "r": "1",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.4 11.4V6a1.1 1.1 0 0 1 2.2 0v4M8.6 5.4V4.2a1.1 1.1 0 0 1 2.2 0V10m0-4.9a1.1 1.1 0 0 1 2.2 0V11m0-3.3a1.1 1.1 0 0 1 2.2 0v4.7a5.4 5.4 0 0 1-9.3 3.7l-2.5-2.7a1.3 1.3 0 0 1 1.9-1.8l1.5 1.3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 17.2V3.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "10": [],
  "11": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.6 8.2c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6M2.6 14c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.2 7.6H12a4 4 0 0 1 0 8H8.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8 4.6l-3 3 3 3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "5",
            "width": "13",
            "height": "11.5",
            "rx": "1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 8.6h13M7 3.2v3M13 3.2v3",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "7.6",
            "cy": "12.2",
            "r": "1.1",
            "fill": "#3A3934"
          }
        }
      ]
    }
  ],
  "12": [],
  "13": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.4l1.7 4.6 4.6 1.7-4.6 1.7L10 16l-1.7-4.6L3.7 9.7l4.6-1.7Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "14": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "5",
            "width": "13",
            "height": "11.5",
            "rx": "1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 8.6h13M7 3.2v3M13 3.2v3",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "7.6",
            "cy": "12.2",
            "r": "1.1",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.2 7.6H12a4 4 0 0 1 0 8H8.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8 4.6l-3 3 3 3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.6 14.5a3.6 3.6 0 1 1 .7-7.1A4.6 4.6 0 0 1 15.3 8.6a3 3 0 0 1-.7 5.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "15": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "3.5",
            "width": "11",
            "height": "13",
            "rx": "1.5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.3 7.4h5.4M7.3 10.2h5.4M7.3 13h3.2",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 6.2V10l2.6 1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 10.2l2.2 2.2 4.2-4.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "16": [],
  "17": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3 15.5V6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "fill": "none"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "5.6",
            "cy": "8.9",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 9.5h14.4M4.2 9.5V16M15.8 9.5V16",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M11.5 9.5V7.2h3.3a1.6 1.6 0 0 0-1.6-1.6h-1.7Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 6.6v2.9",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.2 4.4h3.2l-.6 2.2H5.8Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.2 7.6a3.8 3.8 0 0 1 7.6 0v.8H6.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.8V2.6",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7 11.2l-.6 1.8M10 11.6l-.6 1.8M13 11.2l-.6 1.8M8.5 15l-.6 1.8M11.5 15l-.6 1.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "4.5",
            "width": "11",
            "height": "12.5",
            "rx": "1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.5 7.8h1.6M10.9 7.8h1.6M7.5 10.8h1.6M10.9 10.8h1.6M9 17v-2.8h2V17",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "18": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5 8h9v4.4a3.6 3.6 0 0 1-3.6 3.6H8.6A3.6 3.6 0 0 1 5 12.4Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M14 9h.9a2 2 0 0 1 0 4H14",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.7 5.4c0-1 .8-1 .8-2M10.9 5.4c0-1 .8-1 .8-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "6.6",
            "cy": "6.6",
            "r": "3.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.9 8.9l7.6 7.6M13.6 13.6l1.9-1.9M15.4 15.4l1.4-1.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 3.8L8.6 7l-1.7 1.6a10.8 10.8 0 0 0 4.5 4.5L13 11.4l3.2 1.8-.9 2.9c-.3.8-1.1 1.3-1.9 1.1A13.6 13.6 0 0 1 2.8 6.6c-.2-.8.3-1.6 1.1-1.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "19": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10.8",
            "cy": "3.8",
            "r": "1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10.4 6.6l-1.8 4 2.3 1.9.7 4M8.6 10.6l-2.4 1M10.4 6.6l2.5 1.5 1.6 2.5M8.6 12.5l-2.3 4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 3.8L8.6 7l-1.7 1.6a10.8 10.8 0 0 0 4.5 4.5L13 11.4l3.2 1.8-.9 2.9c-.3.8-1.1 1.3-1.9 1.1A13.6 13.6 0 0 1 2.8 6.6c-.2-.8.3-1.6 1.1-1.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 12.1A6.6 6.6 0 1 1 8.2 4.2a5.3 5.3 0 0 0 7.5 7.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "20": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11.2",
            "r": "6.2",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 8.4v2.8l1.9 1.3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.2 2.6h3.6M10 2.6v2.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.4 11.4V6a1.1 1.1 0 0 1 2.2 0v4M8.6 5.4V4.2a1.1 1.1 0 0 1 2.2 0V10m0-4.9a1.1 1.1 0 0 1 2.2 0V11m0-3.3a1.1 1.1 0 0 1 2.2 0v4.7a5.4 5.4 0 0 1-9.3 3.7l-2.5-2.7a1.3 1.3 0 0 1 1.9-1.8l1.5 1.3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.6 8.2c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6M2.6 14c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "21": [],
  "22": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "8.6",
            "cy": "8.6",
            "r": "5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M12.4 12.4L17 17",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 9.7L10 3.6l6.5 6.1v6.8h-4.6v-4.2H8.1v4.2H3.5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "23": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "5",
            "y": "9",
            "width": "10",
            "height": "8",
            "rx": "2",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7 9V6.8a3 3 0 0 1 6 0V9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 12.2v1.6",
            "stroke": "#3A3934",
            "stroke-width": "1.7",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 10.2l2.2 2.2 4.2-4.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 12.1A6.6 6.6 0 1 1 8.2 4.2a5.3 5.3 0 0 0 7.5 7.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "24": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6 3.5h8l-1 13H7Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 8.4h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 12.1A6.6 6.6 0 1 1 8.2 4.2a5.3 5.3 0 0 0 7.5 7.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 6.2V10l2.6 1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "25": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3c1.1 2.7 3.9 4 3.9 7.1A4.2 4.2 0 0 1 10 14.4a4.2 4.2 0 0 1-3.9-4.3C6.1 7 8.9 5.7 10 3Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.6 16.8h2.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.6 14.5a3.6 3.6 0 1 1 .7-7.1A4.6 4.6 0 0 1 15.3 8.6a3 3 0 0 1-.7 5.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "26": [],
  "27": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "3.5",
            "width": "11",
            "height": "13",
            "rx": "1.5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.3 7.4h5.4M7.3 10.2h5.4M7.3 13h3.2",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10.8",
            "cy": "3.8",
            "r": "1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10.4 6.6l-1.8 4 2.3 1.9.7 4M8.6 10.6l-2.4 1M10.4 6.6l2.5 1.5 1.6 2.5M8.6 12.5l-2.3 4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.6 8.2c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6M2.6 14c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 10.2l2.2 2.2 4.2-4.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "28": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3 15.5V6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "fill": "none"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "5.6",
            "cy": "8.9",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.2 7.6a3.8 3.8 0 0 1 7.6 0v.8H6.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.8V2.6",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7 11.2l-.6 1.8M10 11.6l-.6 1.8M13 11.2l-.6 1.8M8.5 15l-.6 1.8M11.5 15l-.6 1.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6",
            "y": "3",
            "width": "8",
            "height": "14",
            "rx": "1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "12",
            "cy": "10.2",
            "r": "0.9",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4 17h12",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "29": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.2a4.6 4.6 0 0 1 4.6 4.6C14.6 11.1 10 16.8 10 16.8S5.4 11.1 5.4 7.8A4.6 4.6 0 0 1 10 3.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "7.8",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 5.4h8.5M8 10h8.5M8 14.6h8.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "5.4",
            "r": "1",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "10",
            "r": "1",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "14.6",
            "r": "1",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M4.3 8.4a6 6 0 0 1 10.6-1.7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M15.2 3.4v3.4h-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 11.6a6 6 0 0 1-10.6 1.7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4.8 16.6v-3.4h3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "30": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.2 7.6a3.8 3.8 0 0 1 7.6 0v.8H6.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.8V2.6",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7 11.2l-.6 1.8M10 11.6l-.6 1.8M13 11.2l-.6 1.8M8.5 15l-.6 1.8M11.5 15l-.6 1.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.4l1.7 4.6 4.6 1.7-4.6 1.7L10 16l-1.7-4.6L3.7 9.7l4.6-1.7Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5 8h9v4.4a3.6 3.6 0 0 1-3.6 3.6H8.6A3.6 3.6 0 0 1 5 12.4Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M14 9h.9a2 2 0 0 1 0 4H14",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.7 5.4c0-1 .8-1 .8-2M10.9 5.4c0-1 .8-1 .8-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 16.4S3.6 12.6 3.6 8.2A3.5 3.5 0 0 1 10 6.1a3.5 3.5 0 0 1 6.4 2.1c0 4.4-6.4 8.2-6.4 8.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "31": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M16.5 9.6a6.1 5.4 0 0 1-9 4.7L4 15.6l1.1-2.9a5.4 5.4 0 1 1 11.4-3.1Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 9.8h4.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3",
            "y": "5.5",
            "width": "14",
            "height": "9.5",
            "rx": "2",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 10.2h4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "13.6",
            "cy": "10.2",
            "r": "0.9",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M7.2 7.4A2.9 2.9 0 0 1 13 8c0 1.9-2 2.2-2.6 3.4-.2.4-.3.9-.3 1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "16",
            "r": "1",
            "fill": "#3A3934"
          }
        }
      ]
    }
  ],
  "33": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.4l1.7 4.6 4.6 1.7-4.6 1.7L10 16l-1.7-4.6L3.7 9.7l4.6-1.7Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "34": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "8.6",
            "cy": "8.6",
            "r": "5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M12.4 12.4L17 17",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 9.7L10 3.6l6.5 6.1v6.8h-4.6v-4.2H8.1v4.2H3.5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M4.3 8.4a6 6 0 0 1 10.6-1.7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M15.2 3.4v3.4h-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 11.6a6 6 0 0 1-10.6 1.7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4.8 16.6v-3.4h3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "35": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 15.2V5.2l7-1.6v9.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "6.2",
            "cy": "15.2",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "13.2",
            "cy": "13.4",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    }
  ],
  "36": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 5.4h8.5M8 10h8.5M8 14.6h8.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "5.4",
            "r": "1",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "10",
            "r": "1",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "14.6",
            "r": "1",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 17.2V3.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.6 8.2c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6M2.6 14c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "37": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M4.3 8.4a6 6 0 0 1 10.6-1.7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M15.2 3.4v3.4h-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 11.6a6 6 0 0 1-10.6 1.7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4.8 16.6v-3.4h3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.2a4.6 4.6 0 0 1 4.6 4.6C14.6 11.1 10 16.8 10 16.8S5.4 11.1 5.4 7.8A4.6 4.6 0 0 1 10 3.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "7.8",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 6.2V10l2.6 1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "38": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 9.7L10 3.6l6.5 6.1v6.8h-4.6v-4.2H8.1v4.2H3.5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.4 11.4V6a1.1 1.1 0 0 1 2.2 0v4M8.6 5.4V4.2a1.1 1.1 0 0 1 2.2 0V10m0-4.9a1.1 1.1 0 0 1 2.2 0V11m0-3.3a1.1 1.1 0 0 1 2.2 0v4.7a5.4 5.4 0 0 1-9.3 3.7l-2.5-2.7a1.3 1.3 0 0 1 1.9-1.8l1.5 1.3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "39": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 17.2V3.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11.2",
            "r": "6.2",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 8.4v2.8l1.9 1.3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.2 2.6h3.6M10 2.6v2.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.2 7.6H12a4 4 0 0 1 0 8H8.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8 4.6l-3 3 3 3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.4 11.4V6a1.1 1.1 0 0 1 2.2 0v4M8.6 5.4V4.2a1.1 1.1 0 0 1 2.2 0V10m0-4.9a1.1 1.1 0 0 1 2.2 0V11m0-3.3a1.1 1.1 0 0 1 2.2 0v4.7a5.4 5.4 0 0 1-9.3 3.7l-2.5-2.7a1.3 1.3 0 0 1 1.9-1.8l1.5 1.3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "40": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M16.5 9.6a6.1 5.4 0 0 1-9 4.7L4 15.6l1.1-2.9a5.4 5.4 0 1 1 11.4-3.1Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 9.8h4.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 17.2V3.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "41": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3 15.5V6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "fill": "none"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "5.6",
            "cy": "8.9",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 10S5.5 5.4 10 5.4 17.2 10 17.2 10 14.5 14.6 10 14.6 2.8 10 2.8 10Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "8.6",
            "cy": "8.6",
            "r": "5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M12.4 12.4L17 17",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    }
  ],
  "42": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 12.1A6.6 6.6 0 1 1 8.2 4.2a5.3 5.3 0 0 0 7.5 7.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "43": [],
  "44": [],
  "45": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.2 7.6a3.8 3.8 0 0 1 7.6 0v.8H6.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.8V2.6",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7 11.2l-.6 1.8M10 11.6l-.6 1.8M13 11.2l-.6 1.8M8.5 15l-.6 1.8M11.5 15l-.6 1.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.2 7.6H12a4 4 0 0 1 0 8H8.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8 4.6l-3 3 3 3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "46": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 17.2V3.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 12.1A6.6 6.6 0 1 1 8.2 4.2a5.3 5.3 0 0 0 7.5 7.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "47": [],
  "48": [],
  "49": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 9.7L10 3.6l6.5 6.1v6.8h-4.6v-4.2H8.1v4.2H3.5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M16.5 9.6a6.1 5.4 0 0 1-9 4.7L4 15.6l1.1-2.9a5.4 5.4 0 1 1 11.4-3.1Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 9.8h4.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "50": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5 8h9v4.4a3.6 3.6 0 0 1-3.6 3.6H8.6A3.6 3.6 0 0 1 5 12.4Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M14 9h.9a2 2 0 0 1 0 4H14",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.7 5.4c0-1 .8-1 .8-2M10.9 5.4c0-1 .8-1 .8-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "4.5",
            "width": "11",
            "height": "12.5",
            "rx": "1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.5 7.8h1.6M10.9 7.8h1.6M7.5 10.8h1.6M10.9 10.8h1.6M9 17v-2.8h2V17",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "51": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 9.7L10 3.6l6.5 6.1v6.8h-4.6v-4.2H8.1v4.2H3.5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6 7.6h8l1 8.9H5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.8 7.6V6a2.2 2.2 0 0 1 4.4 0v1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "4.5",
            "width": "11",
            "height": "12.5",
            "rx": "1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.5 7.8h1.6M10.9 7.8h1.6M7.5 10.8h1.6M10.9 10.8h1.6M9 17v-2.8h2V17",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "52": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 15.2V5.2l7-1.6v9.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "6.2",
            "cy": "15.2",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "13.2",
            "cy": "13.4",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 2.6v2M10 15.4v2M2.6 10h2M15.4 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M15.4 4.6L14 6M6 14l-1.4 1.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 12.1A6.6 6.6 0 1 1 8.2 4.2a5.3 5.3 0 0 0 7.5 7.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "53": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3 15.5V6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "fill": "none"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "5.6",
            "cy": "8.9",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.2 7.6a3.8 3.8 0 0 1 7.6 0v.8H6.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.8V2.6",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7 11.2l-.6 1.8M10 11.6l-.6 1.8M13 11.2l-.6 1.8M8.5 15l-.6 1.8M11.5 15l-.6 1.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3 15.2h14",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.2 15.2a3.8 3.8 0 0 1 7.6 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 4.4v2.4M4.8 7.6l1.6 1.6M15.2 7.6l-1.6 1.6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "54": [],
  "55": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 8.2V11l2 1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4.5 4.5L3 6M15.5 4.5L17 6",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6 7.6h8l1 8.9H5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.8 7.6V6a2.2 2.2 0 0 1 4.4 0v1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "5",
            "width": "13",
            "height": "11.5",
            "rx": "1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 8.6h13M7 3.2v3M13 3.2v3",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "7.6",
            "cy": "12.2",
            "r": "1.1",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 6.2V10l2.6 1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "56": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 15.2V5.2l7-1.6v9.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "6.2",
            "cy": "15.2",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "13.2",
            "cy": "13.4",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 17.2V3.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "57": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5 8h9v4.4a3.6 3.6 0 0 1-3.6 3.6H8.6A3.6 3.6 0 0 1 5 12.4Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M14 9h.9a2 2 0 0 1 0 4H14",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.7 5.4c0-1 .8-1 .8-2M10.9 5.4c0-1 .8-1 .8-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 3.8L8.6 7l-1.7 1.6a10.8 10.8 0 0 0 4.5 4.5L13 11.4l3.2 1.8-.9 2.9c-.3.8-1.1 1.3-1.9 1.1A13.6 13.6 0 0 1 2.8 6.6c-.2-.8.3-1.6 1.1-1.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "58": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "4.5",
            "width": "11",
            "height": "12.5",
            "rx": "1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.5 7.8h1.6M10.9 7.8h1.6M7.5 10.8h1.6M10.9 10.8h1.6M9 17v-2.8h2V17",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 2.6v2M10 15.4v2M2.6 10h2M15.4 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M15.4 4.6L14 6M6 14l-1.4 1.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 3.8L8.6 7l-1.7 1.6a10.8 10.8 0 0 0 4.5 4.5L13 11.4l3.2 1.8-.9 2.9c-.3.8-1.1 1.3-1.9 1.1A13.6 13.6 0 0 1 2.8 6.6c-.2-.8.3-1.6 1.1-1.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "59": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5 8h9v4.4a3.6 3.6 0 0 1-3.6 3.6H8.6A3.6 3.6 0 0 1 5 12.4Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M14 9h.9a2 2 0 0 1 0 4H14",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.7 5.4c0-1 .8-1 .8-2M10.9 5.4c0-1 .8-1 .8-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 9.7L10 3.6l6.5 6.1v6.8h-4.6v-4.2H8.1v4.2H3.5Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "60": [],
  "61": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M16.5 9.6a6.1 5.4 0 0 1-9 4.7L4 15.6l1.1-2.9a5.4 5.4 0 1 1 11.4-3.1Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 9.8h4.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "4.5",
            "width": "11",
            "height": "12.5",
            "rx": "1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.5 7.8h1.6M10.9 7.8h1.6M7.5 10.8h1.6M10.9 10.8h1.6M9 17v-2.8h2V17",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M4.3 8.4a6 6 0 0 1 10.6-1.7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M15.2 3.4v3.4h-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M15.7 11.6a6 6 0 0 1-10.6 1.7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4.8 16.6v-3.4h3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "62": [],
  "63": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 3.8L8.6 7l-1.7 1.6a10.8 10.8 0 0 0 4.5 4.5L13 11.4l3.2 1.8-.9 2.9c-.3.8-1.1 1.3-1.9 1.1A13.6 13.6 0 0 1 2.8 6.6c-.2-.8.3-1.6 1.1-1.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "5",
            "width": "13",
            "height": "11.5",
            "rx": "1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M3.5 8.6h13M7 3.2v3M13 3.2v3",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "7.6",
            "cy": "12.2",
            "r": "1.1",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M16.5 9.6a6.1 5.4 0 0 1-9 4.7L4 15.6l1.1-2.9a5.4 5.4 0 1 1 11.4-3.1Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 9.8h4.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "64": [],
  "65": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M16.5 9.6a6.1 5.4 0 0 1-9 4.7L4 15.6l1.1-2.9a5.4 5.4 0 1 1 11.4-3.1Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 9.8h4.8",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.2a4.6 4.6 0 0 1 4.6 4.6C14.6 11.1 10 16.8 10 16.8S5.4 11.1 5.4 7.8A4.6 4.6 0 0 1 10 3.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "7.8",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "66": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "3.5",
            "width": "11",
            "height": "13",
            "rx": "1.5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.3 7.4h5.4M7.3 10.2h5.4M7.3 13h3.2",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "6.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "0.9",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11.2",
            "r": "6.2",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 8.4v2.8l1.9 1.3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.2 2.6h3.6M10 2.6v2.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "67": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 5.4h8.5M8 10h8.5M8 14.6h8.5",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "5.4",
            "r": "1",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "10",
            "r": "1",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "4.4",
            "cy": "14.6",
            "r": "1",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.4 11.4V6a1.1 1.1 0 0 1 2.2 0v4M8.6 5.4V4.2a1.1 1.1 0 0 1 2.2 0V10m0-4.9a1.1 1.1 0 0 1 2.2 0V11m0-3.3a1.1 1.1 0 0 1 2.2 0v4.7a5.4 5.4 0 0 1-9.3 3.7l-2.5-2.7a1.3 1.3 0 0 1 1.9-1.8l1.5 1.3",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    }
  ],
  "68": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "4.5",
            "y": "3.5",
            "width": "11",
            "height": "13",
            "rx": "1.5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.3 7.4h5.4M7.3 10.2h5.4M7.3 13h3.2",
            "stroke": "#3A3934",
            "stroke-width": "1.4",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.6 14.5a3.6 3.6 0 1 1 .7-7.1A4.6 4.6 0 0 1 15.3 8.6a3 3 0 0 1-.7 5.9Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 17.2V3.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "69": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10.8",
            "cy": "3.8",
            "r": "1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10.4 6.6l-1.8 4 2.3 1.9.7 4M8.6 10.6l-2.4 1M10.4 6.6l2.5 1.5 1.6 2.5M8.6 12.5l-2.3 4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "5.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "11",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2",
            "stroke": "#3A3934",
            "stroke-width": "1.3",
            "stroke-linecap": "round",
            "transform": "translate(0,2.4)"
          }
        }
      ]
    }
  ],
  "70": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M7 6.5L3.5 10 7 13.5M13 6.5l3.5 3.5L13 13.5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M8 15.2V5.2l7-1.6v9.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "6.2",
            "cy": "15.2",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "13.2",
            "cy": "13.4",
            "r": "1.9",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3a5 5 0 0 1 2.9 9.1c-.6.5-.9 1-.9 1.9H8c0-.9-.3-1.4-.9-1.9A5 5 0 0 1 10 3Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M8.4 16.6h3.2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "71": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.2a4.6 4.6 0 0 1 4.6 4.6C14.6 11.1 10 16.8 10 16.8S5.4 11.1 5.4 7.8A4.6 4.6 0 0 1 10 3.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "7.8",
            "r": "1.5",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 10.2l2.2 2.2 4.2-4.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "6.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "0.9",
            "fill": "#3A3934"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 17.2V3.4",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "72": [],
  "73": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 3.4l1.7 4.6 4.6 1.7-4.6 1.7L10 16l-1.7-4.6L3.7 9.7l4.6-1.7Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    }
  ],
  "74": [],
  "75": [],
  "76": [],
  "77": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 16.4S3.6 12.6 3.6 8.2A3.5 3.5 0 0 1 10 6.1a3.5 3.5 0 0 1 6.4 2.1c0 4.4-6.4 8.2-6.4 8.2Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10 5.6v10.8",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "78": [],
  "79": [],
  "80": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10.8",
            "cy": "3.8",
            "r": "1.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M10.4 6.6l-1.8 4 2.3 1.9.7 4M8.6 10.6l-2.4 1M10.4 6.6l2.5 1.5 1.6 2.5M8.6 12.5l-2.3 4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6",
            "y": "3",
            "width": "8",
            "height": "14",
            "rx": "1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "12",
            "cy": "10.2",
            "r": "0.9",
            "fill": "#3A3934"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M4 17h12",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    }
  ],
  "81": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "3.5",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "3.5",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "rect",
          "attrs": {
            "x": "11.1",
            "y": "11.1",
            "width": "5.4",
            "height": "5.4",
            "rx": "1.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "rect",
          "attrs": {
            "x": "6.5",
            "y": "3",
            "width": "7",
            "height": "14",
            "rx": "1.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M9 14.6h2",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "7",
            "cy": "7",
            "r": "2.6",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 16a4.2 4.2 0 0 1 8.4 0",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "14",
            "cy": "7.6",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M13 16a3.9 3.9 0 0 1 4.4-3.4",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }
        }
      ]
    }
  ],
  "82": [],
  "83": [
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "8.6",
            "cy": "8.6",
            "r": "5",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M12.4 12.4L17 17",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "7",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6"
          }
        },
        {
          "tag": "path",
          "attrs": {
            "d": "M6.8 10.2l2.2 2.2 4.2-4.8",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }
        }
      ]
    },
    {
      "attrs": {
        "width": "22",
        "height": "22",
        "viewBox": "0 0 20 20"
      },
      "children": [
        {
          "tag": "path",
          "attrs": {
            "d": "M2.8 10S5.5 5.4 10 5.4 17.2 10 17.2 10 14.5 14.6 10 14.6 2.8 10 2.8 10Z",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }
        },
        {
          "tag": "circle",
          "attrs": {
            "cx": "10",
            "cy": "10",
            "r": "2.1",
            "fill": "none",
            "stroke": "#3A3934",
            "stroke-width": "1.5"
          }
        }
      ]
    }
  ],
  "84": []
} as unknown as Record<number, { attrs: Record<string, string>; children: TaskSvgChild[] }[]>;
