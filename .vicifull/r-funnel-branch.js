/* Re-drive the branching the questionnaire doc states and no frame can draw.
   Returns what is on screen after each decision. */
const W = 520;
const t = (l) => window.tap(l, { wait: W });
const out = {};
await window.typeIn(0, 'Sam'); await t('Continue');
await window.typeIn(0, '24'); await t('Continue');
await t('Male'); await t('Continue');
await t('Start');
await t('A few times a week');
await t('1–3 years');
await t('No');                                   // 09A -> 09B must be skipped
out.after09A_No = window.__txt().slice(0, 90);
await t('Continue');                             // 10 First principle
await t('Late at night'); await t('When I’m home alone'); await t('Continue');
await t('Bored'); await t('Nothing in particular');  // 12 exclusive
out.q12_exclusive = window.__txt().slice(0, 200);
await t('Continue');
await t('In bed'); await t('Continue');
await t('I start scrolling'); await t('Continue');
await t('Continue');                             // 15 Transition
await t('Quite a bit');                          // 16 Impact
await t('Focus'); await t('Sleep'); await t('Confidence'); await t('Energy'); // 17: refuse a fourth
out.q17_fourth = window.__txt().slice(0, 220);
return out;
