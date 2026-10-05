/* GROUP day: tap-and-wait with retries. The dev server is shared with the other
   agents on this run, so a press can land while the bundle is being rebuilt and
   simply do nothing. */
window.go = async (label, needle) => {
  for (let i = 0; i < 8; i++) {
    try { await tap(label); await waitFor(needle, 1400); return true; } catch (e) { await __sleep(500); }
  }
  throw new Error('stuck: ' + label + ' -> ' + needle + ' :: ' + __txt().slice(0, 200));
};
