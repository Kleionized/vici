#!/bin/zsh
cd /Users/admin/Documents/tideline
for i in $(seq 1 12); do
  node scripts/vicifull/shot.mjs app "/week/$i" ".vicifull/rweeks/a-$i.png" --sig="r-weeks-a-$i" --initseed=.vicifull/weeks-seed.js --wait=2200 2>&1 | grep -v '^$' | head -3
  node scripts/vicifull/shot.mjs app "/week/$i" ".vicifull/rweeks/a-${i}p2.png" --sig="r-weeks-a-${i}p2" --initseed=.vicifull/weeks-seed.js --wait=2200 --do='await scrollBy(400); await scrollBy(400)' 2>&1 | grep -v '^$' | head -3
  echo "app $i done"
done
