/* Walk the whole funnel, the plan sub-flow, and then the tail, stopping at the
   tail screen named in window.__T. Verification pass for group `tail`. */
const W = 420;
const t = (label) => window.tap(label, { wait: W });
await window.typeIn(0, 'Sam'); await t('Continue');            // 03 Name
await window.typeIn(0, '24'); await t('Continue');             // 04 Age
await t('Male'); await t('Continue');                          // 05 Gender
await t('Start');                                              // 06 Start
await t('A few times a week');                                 // 07
await t('1–3 years');                                          // 08
await t('Yes, once or twice');                                 // 09A
await t('A few days');                                         // 09B
await t('Continue');                                           // 10
await t('Late at night'); await t('When I’m home alone'); await t('Continue'); // 11
await t('Bored'); await t('Continue');                         // 12
await t('In bed'); await t('Continue');                        // 13
await t('I start scrolling'); await t('Continue');             // 14
await t('Continue');                                           // 15
await t('Quite a bit');                                        // 16
await t('Focus'); await t('Continue');                         // 17
await t('Sometimes');                                          // 18
await t('Now and then');                                       // 19
await t('Stop completely');                                    // 20
await t('Keep it, just without porn');                         // 21
await t('Blocking sites or apps'); await t('Continue');         // 22
await t('Continue');                                           // 23 goal confirmation -> 26 Enlisting Aegis
await window.__sleep(7200);                                    // the board hands over on its own
await window.waitFor('Continue', 8000);                        // 27 Where We'd Start
const TARGET = "start-here";
const seq = [
  ['whered-start',  'Continue'],
  ['start-here',    'I can do that'],
  ['start-here-1',  'Next'],
  ['start-here-2',  'Continue'],
  ['your-plan',     'Continue'],
  ['starting-point','Next'],
  ['next30',        'Next'],
  ['one-year',      'Next'],
  ['age80',         'Next'],
  ['change-line',   'Start with today'],
  ['clean-day',     'Continue'],
  ['one-bad-day',   'Continue'],
  ['want-back',     'See the twelve weeks'],
];
for (const [id, label] of seq) { if (id === TARGET) break; await t(label); }
if (window.__AFTER) await (new Function('t', 'return (async () => { ' + window.__AFTER + ' })()'))(t);
await t("Choose another");
return window.__txt().slice(0,300);
