/**
 * The urge-surfing kit's front door. `UrgeFlow` (`/urge`, `/rough-first90`) and
 * `UrgeHub` (`/urge-hub`) are all the app imports from it.
 *
 *   `flow.tsx`    the First 90 Seconds — the interrupt's boards and `UrgeFlow`  (sos-flow)
 *   `hub.tsx`     85A–85F — `UrgeHub`                                           (sos-flow)
 *   `stages.tsx`  the SOS stages, their settings, the boards flow and hub share,
 *                 the Help door and the step-back hook (the slip flow uses it) (sos-flow)
 *   `boards.tsx`  the response boards — `ResponsePage`                          (sos-boards)
 *   `saving.tsx`  writes that never hold a screen, and the board a refused one
 *                 shows — the logs and the slip flow use it                     (deploy WP5)
 *
 * The old paper kit's thirty exports (D392) were imported by nothing outside
 * this folder and went with the restyle (D250).
 */

export { UrgeFlow, type UrgePlace } from './flow';
export { UrgeHub } from './hub';
export type { SosBackground, SosLight, SosSettings } from './stages';
