/**
 * GENERATED FILE — do not edit by hand.
 *
 * The 270 × 190 scene every lesson from 2 to 84 draws on its cover and again
 * on its task page. All 168 of them are byte-identical in the canvas, so this
 * is transcribed once: a horizon dome, three stars, the sun with its blurred
 * halo, and the shadow it casts on the ground.
 *
 * Rebuild: node scripts/uifinal/gen-lesson-scrolls.mjs
 */
import type { TaskSceneLayer } from './taskScenes';

export const COVER_SCENE_W = 270;
export const COVER_SCENE_H = 190;

export const COVER_SCENE: TaskSceneLayer[] = [
  {"kind":"box","left":-28,"top":138,"width":326,"height":64,"radius":"50% 50% 0 0 / 26px 26px 0 0","background":"#EAE9E3"},
  {"kind":"box","left":96,"top":26,"width":2.5,"height":2.5,"radius":"50%","background":"rgba(200,225,235,0.45)"},
  {"kind":"box","left":206,"top":44,"width":2,"height":2,"radius":"50%","background":"rgba(200,225,235,0.35)"},
  {"kind":"box","left":58,"top":64,"width":2,"height":2,"radius":"50%","background":"rgba(200,225,235,0.3)"},
  {"kind":"box","left":113,"top":58,"width":44,"height":44,"radius":"50%","background":"radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 76%)","blur":4},
  {"kind":"box","left":126,"top":71,"width":18,"height":18,"radius":"50%","background":"radial-gradient(circle at 34% 30%, #F3E3C4 0%, #E2BA78 58%, #C49856 100%)","shadow":"0 2px 6px rgba(160,120,50,0.3)"},
  {"kind":"box","left":103,"top":141,"width":64,"height":10,"radius":"50%","background":"rgba(0,0,0,0.07)","blur":5},
];
