#!/bin/zsh
cd /Users/admin/Documents/Vici
echo "== size 430x932 $(date +%T)"; rm -rf .overhaul/size-sweep/430x932; node scripts/overhaul/size-sweep.mjs --size=430x932 --scroll > .overhaul/size-sweep-430x932.log 2>&1; tail -1 .overhaul/size-sweep-430x932.log
echo "== lab $(date +%T)"; node scripts/overhaul/lab-audit.mjs 2>/dev/null | tail -1
echo "== lint $(date +%T)"; node scripts/overhaul/lint-mono.mjs | tail -1
echo "== tsc"; npx tsc --noEmit -p . 2>&1 | tail -3; echo "tsc exit $?"
echo "== done $(date +%T)"
