#!/bin/bash
# usage: f-sosflow-run.sh <name> <Frame> <route> [extra shot args...]
# Captures the app with drive .overhaul/drives/sf-<name>.js (if present), pxdiffs against the frame.
name=$1; frame=$2; route=$3; shift 3
args=()
[ -f .overhaul/drives/sf-$name.js ] && args+=(--script=.overhaul/drives/sf-$name.js)
node scripts/overhaul/shot.mjs app "$route" .overhaul/shots/sosflow/a-$name.png --sig=a-sosflow-$name "${args[@]}" "$@" 2>&1 | grep -v "^shot ->\|rows ->"
node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/$frame.png .overhaul/shots/sosflow/a-$name.png 2>&1 | grep -v "^->"
