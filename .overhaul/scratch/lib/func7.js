const out = {};
await __sleep(400);


await tap('Step 5, Have another activity ready, locked'); await __sleep(900);
out.lockedStays = location.pathname;
await tap('Step 3, Choose where to go instead'); await __sleep(1800);
out.stepRow = location.pathname;
return out;
