import { Redirect } from 'expo-router';

/**
 * `/lapse` was the log's own three-board lapse logger (90B–90D). `Vici UI 2`
 * draws one way to log a relapse — the relapse flow — so an old link here
 * lands there.
 */
export default function Lapse() {
  return <Redirect href="/slip" />;
}
