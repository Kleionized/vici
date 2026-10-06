#!/bin/zsh
# Full measurement pass, sequential (one browser at a time — the user's machine is 8 GB).
cd /Users/admin/Documents/Vici
set -o pipefail
echo "== audit $(date +%T)"; rm -rf .overhaul/audit; node scripts/overhaul/audit-fast.mjs > .overhaul/audit.log 2>&1; tail -1 .overhaul/audit.log
echo "== lessons $(date +%T)"; rm -rf .overhaul/lesson-sweep; node scripts/overhaul/lesson-sweep.mjs --lessons=1-84 > .overhaul/lesson-sweep.log 2>&1; tail -1 .overhaul/lesson-sweep.log
for s in 375x667 390x844 430x932; do echo "== size $s $(date +%T)"; rm -rf .overhaul/size-sweep/$s; node scripts/overhaul/size-sweep.mjs --size=$s --scroll > .overhaul/size-sweep-$s.log 2>&1; tail -1 .overhaul/size-sweep-$s.log; done
echo "== lab $(date +%T)"; node scripts/overhaul/lab-audit.mjs 2>/dev/null | tail -1
echo "== lint $(date +%T)"; node scripts/overhaul/lint-mono.mjs | tail -1
echo "== tsc"; npx tsc --noEmit -p . 2>&1 | tail -3; echo "tsc exit $?"
echo "== done $(date +%T)"
