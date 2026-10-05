/* Walk the questionnaire from `03 · Name` to the step index in `window.__N`
   (0-based over FUNNEL_STEPS), answering each screen on the way. Written as a
   table so a screen that gains or loses a control is one row to change. */
const W = 520;
const t = (label) => window.tap(label, { wait: W });
const STEPS = [
  async () => { await window.typeIn(0, 'Sam'); await t('Continue'); },              // 03 Name
  // the wheel opens on 24 (the frame's own value) and stores it untouched
  async () => { await t('Continue'); },                                             // 04 Age
  // no primary since the overhaul: a pick turns the board over after 260 ms
  async () => { await t('Male'); },                                                 // 05 Gender
  async () => { await t('Start'); },                                                // 06 Start
  async () => { await t('A few times a week'); },                                   // 07 Frequency
  async () => { await t('1–3 years'); },                                            // 08 How long
  async () => { await t('Yes, once or twice'); },                                   // 09A Quit attempts
  async () => { await t('A few days'); },                                           // 09B Relapse
  async () => { await t('Continue'); },                                             // 10 First principle
  // `When I’m home alone` is what makes 18 and 19 non-conditional, so the walk
  // reaches every screen rather than the ones a lonely-signal-free run shows.
  async () => { await t('Late at night'); await t('When I’m home alone'); await t('Continue'); }, // 11 When
  async () => { await t('Bored'); await t('Continue'); },                           // 12 Beforehand
  async () => { await t('In bed'); await t('Continue'); },                          // 13 Place
  async () => { await t('I start scrolling'); await t('Continue'); },               // 14 What starts it
  async () => { await t('Continue'); },                                             // 15 Transition
  async () => { await t('Quite a bit'); },                                          // 16 Impact
  async () => { await t('Focus'); await t('Continue'); },                           // 17 What it affects
  async () => { await t('Sometimes'); },                                            // 18 Loneliness
  async () => { await t('Now and then'); },                                         // 19 Time alone
  async () => { await t('Stop completely'); },                                      // 20 Goal
  async () => { await t('Keep it, just without porn'); },                           // 21 Masturbation goal
  async () => { await t('Blocking sites or apps'); await t('Continue'); },          // 22 What you’ve tried
  async () => { await t('Continue'); },                                             // 23 Goal confirmation
];
const target = Number(window.__N ?? 0);
for (let k = 0; k < target; k++) await STEPS[k]();
// `__AFTER` puts the arrived-at screen into whichever state its frame draws —
// a value typed, an option chosen, a multi-select part-filled.
if (window.__AFTER) await (new Function('t', 'return (async () => { ' + window.__AFTER + ' })()'))(t);
return window.__txt().slice(0, 200);
