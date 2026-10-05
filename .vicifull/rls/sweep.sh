#!/bin/zsh
# Re-verification sweep for GROUP lesson-scrolls, pass 2.
cd /Users/admin/Documents/tideline
lo=${1:-1}; hi=${2:-26}
for n in $(seq $lo $hi); do
  nn=$(printf "%02d" $n)
  if [ ! -f .vicifull/rls/d$nn.png ]; then
    node scripts/vicifull/shot.mjs design Lesson-1-Surviving-the-Night L1-Frame-$nn.html .vicifull/rls/d$nn.png --sig=r-lesson-scrolls-d$nn >> .vicifull/rls/log.txt 2>&1
  fi
  if [ "$n" = "1" ]; then
    node scripts/vicifull/shot.mjs app "/lesson/day/1" .vicifull/rls/a$nn.png --sig=r-lesson-scrolls-a$nn --wait=1600 >> .vicifull/rls/log.txt 2>&1
  else
    node scripts/vicifull/shot.mjs app "/lesson/day/1" .vicifull/rls/a$nn.png --sig=r-lesson-scrolls-a$nn --script=.vicifull/lsdrive/p$n.js --wait=1200 >> .vicifull/rls/log.txt 2>&1
  fi
  echo "== $nn done" >> .vicifull/rls/log.txt
done
echo "SWEEP $lo-$hi COMPLETE" >> .vicifull/rls/log.txt
