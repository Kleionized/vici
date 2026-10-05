/* Walk the whole funnel to `43 · Day 0`. Verification pass for group paywall. */
const W = 420;
const t = (label) => window.tap(label, { wait: W });
await window.typeIn(0, 'Sam'); await t('Continue');
await window.typeIn(0, '24'); await t('Continue');
await t('Male'); await t('Continue');
await t('Start');
await t('A few times a week');
await t('1–3 years');
await t('Yes, once or twice');
await t('A few days');
await t('Continue');
await t('Late at night'); await t('When I’m home alone'); await t('Continue');
await t('Bored'); await t('Continue');
await t('In bed'); await t('Continue');
await t('I start scrolling'); await t('Continue');
await t('Continue');
await t('Quite a bit');
await t('Focus'); await t('Continue');
await t('Sometimes');
await t('Now and then');
await t('Stop completely');
await t('Keep it, just without porn');
await t('Blocking sites or apps'); await t('Continue');
await t('Continue');
await window.__sleep(7200);
await window.waitFor('Continue', 8000);
const seq = ['Continue','I can do that','Next','Continue','Continue','Next','Next','Next','Next','Start with today','Continue','Continue','See the twelve weeks'];
for (const l of seq) await t(l);
// 34-36 Twelve Weeks — four pages
await t('Next'); await t('Next'); await t('Continue');
await window.waitFor('Open it', 8000);
await t('Save it for later');           // skips the letter reading -> vow
await window.waitFor('I sign it', 8000);
await t('I sign it');                   // -> medallion
await window.waitFor('Take it', 8000);
await t('Take it');                     // -> reminders
await window.waitFor('Turn on reminders', 8000);
await t('Not now');                     // -> paywall (embedded)
await window.waitFor('Take your life back', 8000);
await t('Skip');                        // -> rescue
await window.waitFor('No thanks', 8000);
await t('No thanks');                   // -> day zero
await window.waitFor('Day 0', 8000);
return window.__txt().slice(0, 200);
