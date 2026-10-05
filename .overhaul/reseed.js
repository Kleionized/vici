/* Put the mock account into the state the canvas's frames are drawn for, then
   reload. The dataset is built by `scripts/uifinal1/seed.mjs`; the user id is
   whatever the signed-in mock user already has. */
(async function () {
  const seed = await (await fetch('http://localhost:8097/seed.json?v=' + Date.now())).json();
  const dataKey = Object.keys(localStorage).find((k) => k.startsWith('tideline.mock.userdata.'));
  if (!dataKey) return 'no mock user signed in';
  const userId = dataKey.slice('tideline.mock.userdata.'.length);
  seed.user.clerkUserId = userId;
  seed.lifeMap.userId = userId;
  for (const e of seed.events) e.userId = userId;
  for (const k of Object.keys(seed.checkins)) seed.checkins[k].userId = userId;
  for (const k of Object.keys(seed.progress)) seed.progress[k].userId = userId;
  for (const j of seed.journalEntries) j.userId = userId;
  localStorage.setItem(dataKey, JSON.stringify(seed));
  return 'seeded ' + userId;
})();
