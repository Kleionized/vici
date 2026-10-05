#!/bin/zsh
cd /Users/admin/Documents/Vici
V=.overhaul/verify/logs
S() { timeout 200 node scripts/overhaul/shot.mjs "$@" 2>&1 | grep -E "script ->|do ->|shot ->|pageerror|fonts|Error|error" | grep -v "Download the React DevTools" | head -6; }
echo "== lapse-save"; S app /lapse $V/u-lapse-done.png --initseed=.overhaul/logs-flow-tick-seed.js --script=$V/ctl/lapse-save.js --wait=400
echo "== lapse-back"; S app /lapse "" --initseed=.overhaul/logs-flow-tick-seed.js --script=$V/ctl/lapse-back.js --wait=300
echo "== urge-ride"; S app /urge-log "" --initseed=.overhaul/logs-flow-tick-seed.js --script=$V/ctl/urge-ride.js --wait=300
echo "== mouse"; timeout 200 node .overhaul/f-logs-mouse.mjs 2>&1 | grep -E "CHECK|Error" | head -12
echo CTL2-DONE
