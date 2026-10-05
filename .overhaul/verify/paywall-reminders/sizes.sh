#!/bin/bash
# verifier: every board at 375x667 (top + scroll end) and 430x932, dpr 1, one Chrome at a time
cd /Users/admin/Documents/Vici
O=.overhaul/verify/paywall-reminders/sz
shoot() { # name route seed do
  local n=$1 r=$2 s=$3 d=$4
  for S in 375x667 430x932; do
    W=${S%x*}; H=${S#*x}
    args=(app "$r" $O/$n-$S.png --initseed=$s --wait=1500 --w=$W --h=$H --dpr=1)
    [ -n "$d" ] && args+=(--do="$d")
    node scripts/overhaul/shot.mjs "${args[@]}" 2>&1 | grep -E "fonts|error|Error|scroll" 
  done
  args=(app "$r" $O/$n-375x667-end.png --initseed=$s --wait=1500 --w=375 --h=667 --dpr=1 --scroll=end)
  [ -n "$d" ] && args+=(--do="$d")
  node scripts/overhaul/shot.mjs "${args[@]}" 2>&1 | grep -E "fonts|error|Error|scroll"
  echo "done $n"
}
case "$1" in
  rem) shoot rem "/welcome?step=reminders" .overhaul/tail-session-seed.js ;;
  dz) shoot dz "/welcome?step=day-zero" .overhaul/tail-session-seed.js ;;
  pw) shoot pw /paywall .overhaul/v-premium-seed.js ;;
  resc) shoot resc /paywall .overhaul/v-premium-seed.js "await tap('Close'); await waitFor('No thanks')" ;;
  conf) shoot conf /paywall .overhaul/f-pw-confirmed-seed.js "$(grep -v '^//' .overhaul/drives/pw-confirmed-trial.js)" ;;
  sub) shoot sub /subscription .overhaul/f-pw-sub-dated.js ;;
  morning) shoot morning /routines/morning-time .overhaul/v-premium-seed.js ;;
  night) shoot night /routines/night-time .overhaul/v-premium-seed.js ;;
  reminders) shoot reminders /reminders .overhaul/v-premium-seed.js ;;
  primer) shoot primer /notify-primer .overhaul/v-premium-seed.js ;;
  sheet) shoot sheet /paywall .overhaul/f-pw-confirmed-seed.js "await tap('Close'); await waitFor('Before you go'); await tap('Start free trial'); await waitFor('Due today'); await __sleep(500)" ;;
  sheety) shoot sheety /paywall .overhaul/f-pw-confirmed-seed.js "await tap('Continue'); await waitFor('Due today'); await __sleep(500)" ;;
esac
