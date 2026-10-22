import { Redirect } from 'expo-router';

/**
 * The urge hub is the SOS's own hub in `Vici UI 2` (`06 · Urge Hub — Main`
 * and its pages, inside `Vici SOS.dc.html`): it is reached by doing a task, not
 * as a section of its own. An old link here opens the SOS.
 */
export default function UrgeHubRoute() {
  return <Redirect href="/urge" />;
}
