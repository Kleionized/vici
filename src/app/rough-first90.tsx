import { Redirect } from 'expo-router';

/**
 * Rough Days' door to the SOS. `Vici UI 2` draws one SOS (`Vici SOS.dc.html`),
 * so this door and the chooser's open the same flow.
 */
export default function RoughFirst90() {
  return <Redirect href="/urge" />;
}
