/* GROUP settings — Edit Profile: both photo-sheet doors, each of its rows and
   Cancel close it; the Name row opens the name sheet; a typed name saves and the
   row reads it back; the scrim closes without saving; Medallions opens the album. */
const out = {};
const dlg = () => !!document.querySelector('[role="dialog"]');
await waitFor('Medallions'); await __sleep(400);
await tap('Change photo'); await __sleep(700); out.photoOpen = dlg();
await tap('Take photo'); await __sleep(600); out.takeCloses = !dlg();
await tap('Profile photo'); await __sleep(700); out.discOpens = dlg();
await tap('Cancel'); await __sleep(600); out.cancelCloses = !dlg();
await tap('Change photo'); await __sleep(700);
await tap('Remove photo'); await __sleep(600); out.removeCloses = !dlg();
await tap('Name, Sam Reyes'); await __sleep(800); out.nameOpen = dlg();
out.inputValue = document.querySelector('input').value;
await typeIn(0, 'Sam R.'); await __sleep(200);
await tap('Dismiss'); await __sleep(700);
out.scrimDiscards = !dlg() && !!__btns().find((b) => b.getAttribute('aria-label') === 'Name, Sam Reyes');
await tap('Name, Sam Reyes'); await __sleep(800);
await typeIn(0, 'Sam Rivers'); await __sleep(200);
await tap('Save'); await __sleep(900);
out.saved = !dlg() && !!__btns().find((b) => b.getAttribute('aria-label') === 'Name, Sam Rivers');
out.stored = JSON.parse(localStorage.getItem('tideline.mock.userdata.settings-seed-user')).user.displayName;
await tap('Medallions'); await __sleep(1200);
out.medallions = location.pathname;
return out;
