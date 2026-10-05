/**
 * The urge-surfing kit's front door. `UrgeFlow` (`/urge`, `/rough-first90`) and
 * `UrgeHub` (`/urge-hub`) are all the app imports from it.
 *
 *   `flow.tsx`    the First 90 Seconds — the interrupt's boards and `UrgeFlow`  (sos-flow)
 *   `hub.tsx`     85A–85F — `UrgeHub`                                           (sos-flow)
 *   `stages.tsx`  the SOS stages, their settings, and the boards flow, hub and
 *                 `/relapse` share                                              (sos-flow)
 *   `boards.tsx`  the response boards — `ResponsePage`                          (sos-boards)
 *
 * The old paper kit's thirty exports (D392) were imported by nothing outside
 * this folder and went with the restyle (D250).
 */

export { UrgeFlow, type UrgePlace } from './flow';
export { UrgeHub } from './hub';
export type { SosBackground, SosLight, SosSettings, SosSound } from './stages';
