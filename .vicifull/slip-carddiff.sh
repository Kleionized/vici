#!/bin/bash
# Re-diff the nineteen card frames against the app captures already taken.
# Deck order with only `Bored` picked, index 0..18.
FRAMES=(Slip-Feel-Bored Slip-Feel-Ashamed Slip-Feel-Lonely Slip-Feel-Stressed Slip-Feel-Rejected \
        Slip-Feel-Tired Slip-Feel-Turned-on Slip-Feel-Not-sure Slip-Trigger-Late-night \
        Slip-Trigger-Scrolling Slip-Trigger-Sexual-content Slip-Trigger-Boredom \
        Slip-Trigger-Loneliness Slip-Trigger-Stress Slip-Trigger-Argument \
        Slip-Trigger-Couldn-t-sleep Slip-Trigger-Being-alone Slip-Trigger-Habit Slip-Trigger-Not-sure)
cd /Users/admin/Documents/tideline
for i in $(seq 1 18); do
  f=${FRAMES[$i]}
  node scripts/vicifull/shot.mjs design Email-Login $f.html .vicifull/shots/slip-d-c$i.png --sig=slip-d-c$i >/dev/null 2>&1
  echo "##### $i $f"
  node scripts/vicifull/sigdiff.mjs slip-d-c$i slip-a-c$i 2>&1 | grep -vE "^# count|radius: 50% →|bg: rgba\(0, 0, 0, 0\.1\) → -"
done
