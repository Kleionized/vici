/**
 * The dev harness's clock (Vici UI 2 run): `Date` stopped at the moment a frame
 * is drawn for, so a screen that prints the date, the day part or a count of
 * days shows what the frame shows. Installed only by the harness driver in a
 * development build started with `EXPO_PUBLIC_HARNESS=1`; `null` restores the
 * real clock.
 */
const RealDate = Date;
let frozen: number | null = null;

class HarnessDate extends RealDate {
  constructor(...args: unknown[]) {
    if (args.length === 0) super(frozen ?? RealDate.now());
    else super(...(args as [number]));
  }
  static now() {
    return frozen ?? RealDate.now();
  }
}

export function setHarnessClock(at: number | null) {
  frozen = at;
  (globalThis as { Date: DateConstructor }).Date = (at == null ? RealDate : HarnessDate) as DateConstructor;
}
