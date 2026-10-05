/* Reach the reader the way the bundle designs it — pushed from the lesson card
   — rather than at its own URL, so a hard-coded SVG gradient id has a second
   instance of the same art mounted underneath it to collide with (F20). */
await window.__sleep(1500);
await window.tap('Start lesson', { wait: 900 });
await window.__sleep(900);
return window.__txt().slice(0, 80);
