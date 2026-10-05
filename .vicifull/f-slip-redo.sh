#!/bin/zsh
cd /Users/admin/Documents/tideline
S0=.vicifull/f-slip-seed0-2340.js
BASE='await tap("Log the slip"); await tap("Closed"); await tap("Continue"); await tap("Bored"); await tap("Continue · 1"); await tap("Continue"); await tap("Continue"); await tap("Continue")'
redo=(3:Slip-Feel-Stressed 12:Slip-Trigger-Loneliness 14:Slip-Trigger-Argument)
for pair in $redo; do
  i=${pair%%:*}; f=${pair#*:}
  DO="$BASE"; n=$i
  while (( n > 0 )); do DO="$DO; await tap(\"Give me another\")"; n=$((n-1)); done
  .vicifull/f-slip-run.sh "$f.html" "card$i" /slip $S0 "$DO" 2>&1 | grep -E '^──|blocks over|overlay'
done
.vicifull/f-slip-run.sh Slip-Pledge.html pledge /slip $S0 "$BASE; await tap(\"Done\")" 2>&1 | grep -E '^──|blocks over|overlay|design rows'
.vicifull/f-slip-run.sh Slip-Begin-Again.html begin /slip $S0 "$BASE; await tap(\"Done\"); await tap(\"Sign it again\")" 2>&1 | grep -E '^──|blocks over|overlay|design rows'
