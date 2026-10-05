#!/bin/zsh
# Capture all 26 lesson-one reader pages and diff each against its own frame.
# Each capture's identity is proved by the hairline percent the driver reads back.
cd /Users/admin/Documents/tideline
for n in $(seq 1 26); do
  nn=$(printf %02d $n)
  if [ ! -f .vicifull/fls/d$nn.png ]; then
    node scripts/vicifull/shot.mjs design Lesson-1-Surviving-the-Night L1-Frame-$nn.html .vicifull/fls/d$nn.png --sig=f-lesson-scrolls-d$n >/dev/null 2>&1
  fi
  if [ "$n" = "1" ]; then
    out=$(node scripts/vicifull/shot.mjs app "/lesson/day/1" .vicifull/fls/a$nn.png --sig=f-lesson-scrolls-a$n --wait=1600 2>&1)
    pct="1 (url)"
  else
    out=$(node scripts/vicifull/shot.mjs app "/lesson/day/1" .vicifull/fls/a$nn.png --sig=f-lesson-scrolls-a$n --script=.vicifull/lsdrive/p$n.js --wait=1200 2>&1)
    pct=$(echo "$out" | grep -o 'script -> "[0-9]*%' | grep -o '[0-9]*%')
  fi
  printf "p%-2s %-6s  " "$n" "$pct"
  node .vicifull/lsdrive/pxdiff.mjs .vicifull/fls/d$nn.png .vicifull/fls/a$nn.png 5 | head -1
done
