#!/bin/zsh
cd /Users/admin/Documents/tideline
S0=.vicifull/f-slip-seed0-2340.js
BASE='await tap("Log the slip"); await tap("Closed"); await tap("Continue"); await tap("Bored"); await tap("Continue · 1"); await tap("Continue"); await tap("Continue"); await tap("Continue")'
FRAMES=(Slip-Feel-Bored Slip-Feel-Ashamed Slip-Feel-Lonely Slip-Feel-Stressed Slip-Feel-Rejected Slip-Feel-Tired Slip-Feel-Turned-on Slip-Feel-Not-sure Slip-Trigger-Late-night Slip-Trigger-Scrolling Slip-Trigger-Sexual-content Slip-Trigger-Boredom Slip-Trigger-Loneliness Slip-Trigger-Stress Slip-Trigger-Argument Slip-Trigger-Couldn-t-sleep Slip-Trigger-Being-alone Slip-Trigger-Habit Slip-Trigger-Not-sure)
i=0
for f in $FRAMES; do
  DO="$BASE"
  n=$i
  while (( n > 0 )); do DO="$DO; await tap(\"Give me another\")"; n=$((n-1)); done
  .vicifull/f-slip-run.sh "$f.html" "card$i" /slip $S0 "$DO" 2>&1 | grep -E '^──|blocks over'
  i=$((i+1))
done
