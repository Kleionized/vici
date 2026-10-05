import fs from 'node:fs';
const R = [];
const push = (o) => R.push(o);
const D = (n) => `.vicifull/drives/${n}.js`;

push({ frame: 'Cue Intro Modal', route: '/urge', wait: 1800, note: 'the interrupt opens on this page; nothing has to be seeded for it' });
push({ frame: 'SOS Strength', route: '/urge', wait: 1600, do: "await tap('Start the interrupt')" });
push({ frame: 'Cue Hue Picker', route: '/urge', wait: 1600, do: "await tap('Start the interrupt'); await tap('Continue')", note: 'the Expo dev-tools badge lands on x 0-64 / y 788-852 and reads as a false Δ75 here — mask it or crop below 788' });

// the three move boards
push({ frame: 'Surf Step 1', route: '/urge', wait: 1800, do: "await tap('Start the interrupt'); await tap('Continue'); await tap('Continue'); await tap('Door is open')", note: "the file names describe the previous drop's order: Surf-Step-1 is the SECOND move, 'Stand up.'" });
push({ frame: 'Surf Step 3', route: '/urge', wait: 1600, do: "await tap('Start the interrupt'); await tap('Continue'); await tap('Continue'); await tap('Door is open'); await tap('I’m up')" });
push({ frame: 'Cue Set Confirmation', route: '/urge', wait: 1600, do: "await tap('Start the interrupt'); await tap('Continue'); await tap('Continue'); await tap('Door is open'); await tap('I’m up'); await tap('I’ve left')" });

push({ frame: 'SOS Reason Picker', route: '/urge', wait: 900, script: D('sos-reason'), note: "pass 1 recorded this one as prose ('…the Cue Set Confirmation recipe, then tap Phone is away') and the audit could not run it; it is a drive file now" });
push({ frame: 'SOS Feeling Picker', route: '/urge', wait: 1600, script: D('sos-feel') });

// the seven location boards
const LOC = [
  ['SOS Loc Private Room', 'b-SOS-Loc-Private-Room'],
  ['SOS Loc Bed', 'b-SOS-Loc-Bed'],
  ['SOS Loc Public', 'b-SOS-Loc-Public'],
  ['SOS Loc Work', 'b-SOS-Loc-Work'],
  ['SOS Loc Elsewhere', 'b-SOS-Loc-Elsewhere'],
];
for (const [frame, d] of LOC) push({ frame, route: '/urge', wait: 900, script: D(d) });
const D038 = (board, swap) => `no picker card reaches it: the location picker draws five rows against seven boards and no board on this branch carries "Give me another" (DECISIONS D038, unchanged — no picker gains an option the canvas does not draw). Both halves are proven rather than assumed. DATA: re-running scripts/vicifull/gen-sos-responses.mjs reproduces src/content/sosResponses.ts byte for byte. RENDER (new in pass 2, D146): ${swap} in src/components/urge/index.tsx, run the drive named below, then revert — the file was diffed against a pre-swap copy afterwards and is byte-identical. Measured that way against its own frame: ${board}.`;
push({ frame: 'SOS Loc Bathroom', unreachable: D038('mean |Δ| 0.015, max 5', "temporarily set PLACE_BOARD.private to 'SOS-Loc-Bathroom'"), verifyRoute: '/urge', verifyWait: 1200, verifyScript: D('d038-loc-bathroom') });
push({ frame: 'SOS Loc Home Alone', unreachable: D038('mean |Δ| 0.030, max 5', "temporarily set PLACE_BOARD.private to 'SOS-Loc-Home-Alone'"), verifyRoute: '/urge', verifyWait: 1200, verifyScript: D('d038-loc-home-alone') });

// thirteen feeling boards + the challenge
const FEEL = ['Turned On','Bored','Lonely','Stressed','Anxious','Angry','Low','Rejected','Tired','Restless','Numb','Ashamed','Unknown'];
for (const f of FEEL) push({ frame: `SOS Feel ${f}`, route: '/urge', wait: 900, script: D(`b-SOS-Feel-${f.replace(/ /g,'-')}`) });
push({ frame: 'SOS Challenge', route: '/urge', wait: 900, script: D('b-SOS-Challenge'), note: 'reached by pressing "Give me another" through the feeling branch, which is the only thing that reaches it (D038)' });

// ten trigger boards
const TRIG = [['Content','Content'],['Doomscroll','Doomscroll'],['Fantasy','Fantasy'],['Late Phone','Late-Phone'],['Habit','Habit'],['Cant Sleep','Cant-Sleep'],['Argument','Argument'],['Alone','Alone'],['Unknown','Unknown']];
for (const [label, file] of TRIG) push({ frame: `SOS Trig ${label}`, route: '/urge', wait: 900, script: D(`b-SOS-Trig-${file}`) });
push({ frame: 'SOS Trig Rejection', unreachable: 'no picker card reaches it: the trigger picker draws nine cards against ten boards and this branch carries no "Give me another" (DECISIONS D038, unchanged). DATA proven by regenerating src/content/sosResponses.ts byte for byte. RENDER proven in pass 2 (D146) by temporarily setting TRIGGER_BOARD.Doomscrolling to \'SOS-Trig-Rejection\', running the drive below and reverting: mean |Δ| 0.015, max 5 against its own frame.', verifyRoute: '/urge', verifyWait: 1200, verifyScript: D('d038-trig-rejection') });

push({ frame: 'SOS Reassess', route: '/urge', wait: 1200, script: D('sos-reassess') });
push({ frame: 'SOS Afterward', route: '/urge', wait: 1200, script: D('sos-afterward') });
push({ frame: 'Surf Complete', route: '/urge', wait: 1600, script: D('sos-done'), initseed: '.vicifull/sos-seed.js', note: "the frame states 'Logged — rode it out · ×3' and the count is the account's own urge_rode_out events with this run included, so the seed carries two (FINDINGS F28). Unseeded it draws ×1 and the line reads as a Δ150 defect that is not one." });

// the four relapse frames
push({ frame: 'Relapse Log', route: '/relapse', wait: 1200, script: D('rel-log') });
push({ frame: 'Relapse Twice', route: '/relapse', wait: 1200, script: D('rel-twice') });
push({ frame: 'Relapse Resign', route: '/relapse', wait: 1200, initseed: '.vicifull/day-seed.js', script: D('rel-resign'), note: 'needs a signed-in account for the pledge and the signature. --seed timed out at networkidle twice under load where --initseed worked.' });
push({ frame: 'Relapse Begin', route: '/relapse', wait: 1200, initseed: '.vicifull/day-seed.js', script: D('rel-begin') });

// the five hub panes
const HUBNOTE = 'the hub seed now carries a LIVE urge session, startedAt = now − 138 s at severity 7 — 85A draws 17:42 inside stroke-dasharray 433.7 490.1 (88.49% of the r=78 ring) and 85B labels its marker "2:18 in" (D066/D067). Without it UrgeHub calls newUrgeSession() and the pane renders 20:00 against a full ring, i.e. the clock and the arc are never actually compared.';
push({ frame: 'Urge Hub Now', route: '/urge-hub', wait: 1400, initseed: '.vicifull/hub-seed.js', note: HUBNOTE });
push({ frame: 'Urge Hub Score', route: '/urge-hub', wait: 1400, initseed: '.vicifull/hub-seed.js', script: D('hub-pane2'), note: HUBNOTE });
push({ frame: 'Urge Hub Proof', route: '/urge-hub', wait: 1400, initseed: '.vicifull/hub-seed.js', script: D('hub-pane3'), note: "85C's twelve bars and its 'Longest urge survived · 41 min' row read durationSeconds; the seed carries the canvas's own twelve lengths" });
push({ frame: 'Urge Hub Surfed', route: '/urge-hub', wait: 1400, initseed: '.vicifull/hub-seed.js', script: D('hub-pane4') });
push({ frame: 'Urge Hub Pledges', route: '/urge-hub', wait: 1400, initseed: '.vicifull/hub-seed.js', script: D('hub-pane5'), note: '85E dates the pledge fourteen days back; the seed rewrites the Pledge entry to now − 13 days' });
push({ frame: 'Urge Hub — Breathe handoff', route: '/urge-hub', wait: 1200, initseed: '.vicifull/hub-seed.js', script: D('hub-breathe'), note: 'not a frame in the bundle; proves the paper pill hands over to the SOS breathing stage and comes back (D069)' });

fs.writeFileSync('.vicifull/recipes/sos.json', JSON.stringify(R, null, 2) + '\n');
console.log('entries', R.length);
