#!/bin/zsh
set -e
cd /Users/admin/Documents/tideline
FILES=(Week-I-Reset Week-II-Changing-Your-Mindset Week-III-In-the-Moment Week-IV-Know-Your-Brain Week-V-Why-It-Feels-Worth-It Week-VI-Discipline Week-VII-Relapse-and-Adversity Week-VIII-Boredom-and-Meaning Week-IX-Connection Week-X-Yourself Week-XI-Build-a-Life-You-Want Week-XII-Leave-It-Behind)
i=1
for f in $FILES; do
  node scripts/vicifull/shot.mjs design Email-Login "$f.html" ".vicifull/rweeks/d-$i.png" --sig="r-weeks-d-$i" >/dev/null
  node scripts/vicifull/shot.mjs design Email-Login "$f-P2.html" ".vicifull/rweeks/d-${i}p2.png" --sig="r-weeks-d-${i}p2" >/dev/null
  echo "design $i $f done"
  i=$((i+1))
done
