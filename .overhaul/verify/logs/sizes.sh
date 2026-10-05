#!/bin/zsh
# capture every logs recipe at one size: sizes.sh 375 667
cd /Users/admin/Documents/Vici
W=$1; H=$2
for f in "Log Chooser" "Lapse When" "Lapse Trigger" "Lapse Done" "Log Urges" "Log Check-ins" "Log Reports" "Urge Overview Summary" "Urge Overview" "Urge Overview Mood" "Urge Overview When" "Report Ready" "Weekly Report" "Weekly Report Days" "Weekly Report Urges" "Urge Log Intensity" "Urge Log Trigger" "Urge Log Outcome" "Urge Log When" "Urge Log Done"; do
  out=$(timeout 200 node .overhaul/verify/logs/run.mjs "$f" --tag=$W --w=$W --h=$H 2>&1 | grep -E "shot ->|FAIL|fonts|pageerror" | head -3)
  echo "$f: $out"
done
echo SIZES-DONE $W
