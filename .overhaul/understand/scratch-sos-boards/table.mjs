import fs from 'fs';
const S = '.overhaul/understand/scratch-sos-boards/';
const L = JSON.parse(fs.readFileSync(S+'lines.json','utf8'));
const src = fs.readFileSync('src/content/sosResponses.ts','utf8');
const old = {}; for (const m of src.matchAll(/^  "([^"]+)": (\{.*\}),$/gm)) old[m[1]] = JSON.parse(m[2]);
const CARD = { bed:'Bed-at-night', openDoor:'Open-door', lamp:'Desk-lamp', bench:'Park-bench', signpost:'Signpost', umbrella:'Umbrella-in-the-rain', stairs:'Stairs', envelope:'Envelope', kettle:'Kettle', clock:'Alarm-clock', mountain:'Mountain', phoneTable:'Phone-face-down', nightPhone:'Phone-parked-for-the-night', sneaker:'Sneaker', shower:'Shower', mirror:'Mirror', door:'Closed-door', tab:'Browser-tabs', feedOff:'Feed-locked', balloon:'Balloon', charger:'Phone-on-charge', bubbles:'Speech-bubbles' };
const ORDER = ['Loc-Bed','Loc-Bathroom','Loc-Home-Alone','Loc-Private-Room','Loc-Work','Loc-Public','Loc-Elsewhere','Feel-Turned-On','Feel-Bored','Feel-Lonely','Feel-Stressed','Feel-Anxious','Feel-Angry','Feel-Low','Feel-Rejected','Feel-Tired','Feel-Restless','Feel-Numb','Feel-Ashamed','Feel-Unknown','Trig-Content','Trig-Doomscroll','Trig-Fantasy','Trig-Late-Phone','Trig-Habit','Trig-Cant-Sleep','Trig-Argument','Trig-Rejection','Trig-Alone','Trig-Unknown'];
const BADGE = ['95A','95B','95C','95D','95E','95F','95G','96A','96B','96C','96D','96E','96F','96G','96H','96I','96J','96K','96L','96M','97A','97B','97C','97D','97E','97F','97G','97H','97I','97J'];
const REACH = { 'Loc-Bed':'where: In bed', 'Loc-Bathroom':'UNREACHABLE (D038)', 'Loc-Home-Alone':'UNREACHABLE (D038)', 'Loc-Private-Room':'where: Somewhere private', 'Loc-Work':'where: At work or school', 'Loc-Public':'where: A public space', 'Loc-Elsewhere':'where: Out and about',
 'Feel-Turned-On':'feeling: Turned on', 'Feel-Bored':'feeling: Bored', 'Feel-Lonely':'feeling: Lonely', 'Feel-Stressed':'feeling: Stressed or anxious', 'Feel-Anxious':'rotation only (Stressed board + 1× Give me another)', 'Feel-Angry':'feeling: Angry', 'Feel-Low':'feeling: Low', 'Feel-Rejected':'rotation only (Low board + 1×)', 'Feel-Tired':'feeling: Tired', 'Feel-Restless':'feeling: Restless', 'Feel-Numb':'rotation only (Restless + 1×)', 'Feel-Ashamed':'rotation only (Restless + 2×)', 'Feel-Unknown':'feeling: I don’t know (also the fallback)',
 'Trig-Content':'trigger: Something online', 'Trig-Doomscroll':'trigger: Doomscrolling', 'Trig-Fantasy':'trigger: A stuck fantasy', 'Trig-Late-Phone':'trigger: Phone in bed', 'Trig-Habit':'trigger: Pure habit', 'Trig-Cant-Sleep':'trigger: Can’t sleep', 'Trig-Argument':'trigger: An argument', 'Trig-Rejection':'UNREACHABLE (D038)', 'Trig-Alone':'trigger: Being alone', 'Trig-Unknown':'trigger: I don’t know (also the fallback)' };
ORDER.forEach((s, i) => {
  const k = 'SOS-' + s; const t = fs.readFileSync(S + k + '.txt', 'utf8').split('\n').filter(l => l.trim().startsWith('·')).map(l => l.trim().slice(2));
  const hero = fs.readFileSync('.overhaul/final/Email-Login/' + k + '.html', 'utf8').match(/data-hero="([^"]+)"/)[1];
  const o = old[k]; const cta = t[3]; const ctaCell = o.cta === cta ? '`' + cta + '`' : '`' + o.cta + '` → **`' + cta + '`**';
  const fmt = (a) => a.map(x => x).join(' ⏎ ');
  console.log(`| ${BADGE[i]} | \`${k}\` | ${t[0]} | \`${hero}\` (${CARD[hero]}) | ${fmt(L[k].title)} | ${fmt(L[k].body)} | ${ctaCell} | ${t[4] ? 'yes · primary bottom 96' : 'no · primary bottom 48'} | ${REACH[s]} |`);
});
