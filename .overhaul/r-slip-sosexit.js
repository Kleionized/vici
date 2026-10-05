await __sleep(900);
await waitFor('The First 90 Seconds');
await tap("Start the interrupt");
await waitFor("How strong is it right now?");
await tap("Continue");
await waitFor("Where are you right now?");
await tap("Somewhere private"); await tap("Continue");
await waitFor("Open the door and move.");
await tap("Door is open");
await waitFor("Stand up."); await tap("I’m up");
await waitFor("Leave the room."); await tap("I’ve left");
await waitFor("Put the phone away."); await tap("Phone is away");
await waitFor("What’s feeding it right now?");
await tap("Doomscrolling"); await tap("Continue");
await waitFor("Get off the feed."); await tap("Locked");
await waitFor("What’s underneath it?");
await tap("Turned on"); await tap("Continue");
await waitFor("Let it pass."); await tap('Done');
await waitFor('Where is the urge now?'); await tap('Continue');
await waitFor('One more thing.'); await tap('Done');
await waitFor('Breathe with me.');
const trail = ['breathe'];
// stage 2 — five numbered discs, in order
await waitFor('Tap the numbers as they land.', 30000); trail.push('tap');
for (let i = 1; i <= 5; i++) { await tap(`Number ${i}`); await __sleep(120); }
// stage 3 — six rounds, the lit tile each time (its own fill is #E9D2A4)
await waitFor("Find the one that's different.", 20000); trail.push('odd');
for (let r = 0; r < 8; r++) {
  const lit = [...document.querySelectorAll('[aria-label^="Tile "]')]
    .find((el) => getComputedStyle(el).backgroundColor === 'rgb(233, 210, 164)');
  if (!lit) break;
  lit.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  lit.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  lit.click();
  await __sleep(150);
}
await waitFor('Ride it out.', 20000); trail.push('wave');
await tap('I slipped — log it');
await __sleep(1400);
return trail.join('>') + ' >> ' + location.pathname + ' :: ' + document.body.innerText.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,2).join(' | ').slice(0,90);
