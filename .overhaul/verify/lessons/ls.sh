#!/bin/bash
# Lesson Scroll k: capture app, pxdiff + sigdiff against the Email-Login frame
cd /Users/admin/Documents/Vici
V=.overhaul/verify/lessons
for k in "$@"; do
  node scripts/overhaul/shot.mjs app "/lesson/day/1?page=$k" $V/a-ls$k.png --sig=vl-a-ls$k --wait=1200 2>&1 | grep -v '^shot' | grep -v 'rows ->'
  echo "== LS$k pxdiff"
  node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/Lesson-Scroll-$k.png $V/a-ls$k.png $V/ls$k 2>&1 | head -8
  echo "== LS$k pxdiff t=8"
  node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/Lesson-Scroll-$k.png $V/a-ls$k.png $V/ls${k}t8 --t=8 2>&1 | head -6
  rm -f $V/ls${k}t8.* $V/ls${k}.overlay.png $V/ls${k}.diff.png
  echo "== LS$k sigdiff"
  node scripts/overhaul/sigdiff.mjs d-Email-Login-Lesson-Scroll-$k vl-a-ls$k 2>&1 | head -40
done
