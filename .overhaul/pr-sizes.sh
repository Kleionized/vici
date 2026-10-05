#!/bin/bash
# paywall-reminders: capture every board of the group at 375x667 and 430x932 (one Chrome at a time)
cd /Users/admin/Documents/Vici
O=.overhaul/shots/pr/sz
mkdir -p $O
run() { # name route seed do
  for S in 375x667 430x932; do
    W=${S%x*}; H=${S#*x}
    if [ -n "$4" ]; then
      node scripts/overhaul/shot.mjs app "$2" $O/$1-$S.png --initseed=$3 --do="$4" --wait=1200 --w=$W --h=$H 2>&1 | grep -v "^shot" | grep -v "^do ->"
    else
      node scripts/overhaul/shot.mjs app "$2" $O/$1-$S.png --initseed=$3 --wait=1800 --w=$W --h=$H 2>&1 | grep -v "^shot"
    fi
  done
}
case "$1" in
  rem) run rem "/welcome?step=reminders" .overhaul/tail-session-seed.js ;;
  dz) run dz "/welcome?step=day-zero" .overhaul/tail-session-seed.js ;;
  pw) run pw /paywall .overhaul/v-premium-seed.js ;;
  resc) run resc /paywall .overhaul/v-premium-seed.js "await tap('Close'); await waitFor('No thanks')" ;;
  conf) run conf /paywall .overhaul/f-pw-confirmed-seed.js "$(cat .overhaul/drives/pw-confirmed-trial.js | grep -v '^//')" ;;
  sub) run sub /subscription .overhaul/f-pw-sub-dated.js ;;
  night) run night /routines/night-time .overhaul/v-premium-seed.js ;;
  reminders) run reminders /reminders .overhaul/v-premium-seed.js ;;
  primer) run primer /notify-primer .overhaul/v-premium-seed.js ;;
  sheet) run sheet /paywall .overhaul/f-pw-confirmed-seed.js "await tap('Close'); await waitFor('Before you go'); await tap('Start free trial'); await waitFor('Due today')" ;;
esac
