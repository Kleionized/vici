/* v-handover: walk the whole funnel + plan + tail into the handover.
   window.__H is the handover stop: 'map1'|'map2'|'map3'|'letter'|'read'|'vow'|'med'|'rem'|'day0' */
const W = 520;
const t = (label) => window.tap(label, { wait: W });
const F = [
  async () => { await window.typeIn(0, 'Sam'); await t('Continue'); },
  async () => { await window.typeIn(0, '24'); await t('Continue'); },
  async () => { await t('Male'); await t('Continue'); },
  async () => { await t('Start'); },
  async () => { await t('A few times a week'); },
  async () => { await t('1–3 years'); },
  async () => { await t('Yes, once or twice'); },
  async () => { await t('A few days'); },
  async () => { await t('Continue'); },
  async () => { await t('Late at night'); await t('When I’m home alone'); await t('Continue'); },
  async () => { await t('Bored'); await t('Continue'); },
  async () => { await t('In bed'); await t('Continue'); },
  async () => { await t('I start scrolling'); await t('Continue'); },
  async () => { await t('Continue'); },
  async () => { await t('Quite a bit'); },
  async () => { await t('Focus'); await t('Continue'); },
  async () => { await t('Sometimes'); },
  async () => { await t('Now and then'); },
  async () => { await t('Stop completely'); },
  async () => { await t('Keep it, just without porn'); },
  async () => { await t('Blocking sites or apps'); await t('Continue'); },
  async () => { await t('Continue'); },
];
for (const s of F) await s();
// 26 Enlisting Aegis hands over on its own after ~6.8s
await window.waitFor('this is where', 12000);
await t('Continue');                 // 27 Where We'd Start
await t('I can do that');            // 28 Start Here
await t('Next');                     // 29 Step 1
await t('Continue');                 // 30 Step 2
await t('Continue');                 // 31 Your Plan
await t('Next');                     // 32 Starting Score
await t('Next');                     // 33 Cost Next 30
await t('Next');                     // 34 Cost Next 365
await t('Next');                     // 35 By Age 80
await t('Start with today');         // 36 Change the Line
await t('Continue');                 // 37 A Clean Day
await t('Continue');                 // 38 One Bad Day
await t('See the twelve weeks');     // 39 What You Want Back
await window.waitFor('The next twelve weeks', 8000);
const H = window.__H || 'map1';
if (H === 'map1') return window.__txt().slice(0, 120);
await t('Next');
if (H === 'map2') return window.__txt().slice(0, 120);
await t('Next');
if (H === 'map3') return window.__txt().slice(0, 120);
await t('Continue');                 // → 40 Letter Received
if (H === 'letter') return window.__txt().slice(0, 120);
await t('Open it');
if (H === 'read') return window.__txt().slice(0, 120);
await t('Continue');                 // → The Vow
if (H === 'vow') return window.__txt().slice(0, 120);
await t('I sign it');
if (H === 'med') return window.__txt().slice(0, 120);
await t('Take it');
if (H === 'rem') return window.__txt().slice(0, 120);
return window.__txt().slice(0, 200);
