#!/bin/zsh
# controls + unframed captures, one Chrome at a time
cd /Users/admin/Documents/Vici
V=.overhaul/verify/logs
S() { timeout 200 node scripts/overhaul/shot.mjs "$@" 2>&1 | grep -E "script ->|do ->|shot ->|pageerror|fonts|Error|error" | grep -v "Download the React DevTools" | head -6; }
echo "== chooser"; S app /log-chooser "" --initseed=.overhaul/logs-flow-tick-seed.js --script=$V/ctl/chooser.js --wait=300
echo "== lapse-save"; S app /log-chooser $V/u-lapse-done.png --initseed=.overhaul/logs-flow-tick-seed.js --do="await tap('A lapse'); await tap('Continue'); await __sleep(1500)" --script=$V/ctl/lapse-save.js --wait=400
echo "== lapse-back"; S app /log-chooser "" --initseed=.overhaul/logs-flow-tick-seed.js --do="await tap('A lapse'); await tap('Continue'); await __sleep(1500)" --script=$V/ctl/lapse-back.js --wait=300
echo "== urge-ride"; S app /log-chooser "" --initseed=.overhaul/logs-flow-tick-seed.js --do="await tap('Continue'); await __sleep(1500)" --script=$V/ctl/urge-ride.js --wait=300
echo "== urge-slip"; S app /urge-log $V/u-urge-slip-after.png --initseed=.overhaul/logs-flow-tick-seed.js --script=$V/ctl/urge-slip.js --wait=600
echo "== urge-slip-board"; S app /urge-log $V/u-urge-slip-done.png --initseed=.overhaul/logs-flow-tick-seed.js --do="await waitFor('How strong was the urge?'); await tap('Strong'); await tap('Continue'); await waitFor('What set it off?'); await tap('Stress'); await tap('Continue'); await waitFor('What did you do?'); await tap('I slipped'); await tap('Continue'); await waitFor('When was it?'); await tap('Log the urge'); await waitFor('Urge logged.'); await __sleep(400)" --wait=400
echo "== change-sheet"; S app /lapse $V/u-change-sheet.png --initseed=.overhaul/logs-flow-tick-seed.js --do="await waitFor('When did it happen?'); await tap('Change'); await __sleep(1200)" --wait=300
echo "== change-sheet-375"; S app /lapse $V/u-change-sheet-375.png --w=375 --h=667 --initseed=.overhaul/logs-flow-tick-seed.js --do="await waitFor('When did it happen?'); await tap('Change'); await __sleep(1200)" --wait=300
echo "== trigger-0"; S app /lapse $V/u-trigger0.png --initseed=.overhaul/logs-flow-tick-seed.js --do="await waitFor('When did it happen?'); await tap('Continue'); await waitFor('What fed it?'); await __sleep(300)" --wait=300
echo "== chooser-lapse"; S app /log-chooser $V/u-chooser-lapse.png --initseed=.overhaul/logs-flow-tick-seed.js --do="await waitFor('What are you logging?'); await tap('A lapse')" --wait=400
echo "== log"; S app /log "" --initseed=$V/tick-logs-reports-seed.js --script=$V/ctl/log.js --wait=300
echo "== overview"; S app /urge-overview "" --initseed=$V/tick-logs-overview-seed.js --script=$V/ctl/overview.js --wait=300
echo "== wr"; S app "/weekly-report?week=2025-07-14" "" --initseed=$V/tick-logs-wr-urges-seed.js --script=$V/ctl/wr.js --wait=300
echo "== rr"; S app "/report-ready?week=2025-07-14" "" --initseed=$V/tick-logs-wr-urges-seed.js --script=$V/ctl/rr.js --wait=300
echo "== rr-later"; S app "/report-ready?week=2025-07-14" "" --initseed=$V/tick-logs-wr-urges-seed.js --script=$V/ctl/rr-later.js --wait=300
echo "== rr-close"; S app "/report-ready" $V/u-rr-noweek.png --initseed=$V/tick-logs-wr-urges-seed.js --script=$V/ctl/rr-close.js --wait=300
echo "== rr-noweek-shot"; S app "/report-ready" $V/u-rr-noweek.png --initseed=$V/tick-logs-wr-urges-seed.js --do="await waitFor('Open the report'); await __sleep(600)" --wait=300
echo "== dash"; S app /dashboard "" --initseed=$V/tick-logs-week-sun-seed.js --script=$V/ctl/dash.js --wait=300
echo "== dash-shot"; S app /dashboard $V/u-dash.png --initseed=$V/tick-logs-week-sun-seed.js --do="await waitFor('Insights'); await __sleep(500)" --wait=300
echo "== dash-shot-end"; S app /dashboard $V/u-dash-end.png --initseed=$V/tick-logs-week-sun-seed.js --do="await waitFor('Insights'); await tap('12W'); await __sleep(500)" --scroll=end --wait=300
echo "== empty-urges"; S app /log $V/u-empty-urges.png --initseed=$V/tick-logs-empty-seed.js --do="await waitFor('Your log'); await __sleep(400)" --wait=300
echo "== empty-checkins"; S app /log $V/u-empty-checkins.png --initseed=$V/tick-logs-empty-seed.js --do="await waitFor('Your log'); await tap('Check-ins'); await __sleep(400)" --wait=300
echo "== empty-reports"; S app /log $V/u-empty-reports.png --initseed=$V/tick-logs-empty-seed.js --do="await waitFor('Your log'); await tap('Reports'); await __sleep(600)" --wait=300
echo "== empty-overview"; S app /urge-overview $V/u-empty-overview.png --initseed=$V/tick-logs-empty-seed.js --do="await waitFor('Urge overview'); await __sleep(400)" --wait=300
echo "== empty-overview-strength"; S app /urge-overview $V/u-empty-overview-s.png --initseed=$V/tick-logs-empty-seed.js --do="await waitFor('Urge overview'); await tap('Strength'); await __sleep(900)" --wait=300
echo "== empty-wr"; S app /weekly-report $V/u-empty-wr.png --initseed=$V/tick-logs-empty-seed.js --do="await waitFor('Weekly report'); await __sleep(400)" --wait=300
echo "== overview-week"; S app "/urge-overview?week=2025-07-14" $V/u-overview-week.png --initseed=$V/tick-logs-wr-urges-seed.js --do="await waitFor('Urge overview'); await __sleep(400)" --wait=300
echo "== realfeel"; S app /urge-overview $V/u-realfeel.png --initseed=$V/realfeel-seed.js --do="await waitFor('Urge overview'); await __sleep(300); await tap('Mood'); await __sleep(900)" --wait=300
echo "== realplace"; S app /urge-overview $V/u-realplace.png --initseed=$V/realplace-seed.js --do="await waitFor('Urge overview'); await __sleep(300); await tap('Timing'); await __sleep(900)" --wait=300
echo "== log-checkins-375-end"; S app /log $V/u-checkins-375-end.png --w=375 --h=667 --initseed=$V/tick-logs-week-sun-seed.js --do="await waitFor('Your log'); await tap('Check-ins'); await __sleep(400)" --scroll=end --wait=300
echo "== log-reports-375-end"; S app /log $V/u-reports-375-end.png --w=375 --h=667 --initseed=$V/tick-logs-reports-seed.js --do="await waitFor('Your log'); await tap('Reports'); await __sleep(600)" --scroll=end --wait=300
echo "== log-urges-852-end"; S app /log $V/u-checkins-852-end.png --initseed=$V/tick-logs-week-sun-seed.js --do="await waitFor('Your log'); await tap('Check-ins'); await __sleep(400)" --scroll=end --wait=300
echo CTL-DONE
