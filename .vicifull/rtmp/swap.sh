set -e
F=src/components/urge/index.tsx
BEFORE=$(md5 -q $F)
OLD="$1"; NEW="$2"; DRIVE="$3"; OUT="$4"; SIG="$5"
python3 - "$F" "$OLD" "$NEW" <<'PY'
import sys
p,old,new=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(p,encoding='utf8').read()
assert s.count(old)==1, ('occurrences', s.count(old))
open(p,'w',encoding='utf8').write(s.replace(old,new))
PY
sleep 9
node scripts/vicifull/shot.mjs app "/urge" "$OUT" --sig="$SIG" --wait=1200 --script="$DRIVE" || true
python3 - "$F" "$NEW" "$OLD" <<'PY'
import sys
p,old,new=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(p,encoding='utf8').read()
assert s.count(old)==1, ('revert occurrences', s.count(old))
open(p,'w',encoding='utf8').write(s.replace(old,new))
PY
AFTER=$(md5 -q $F)
echo "md5 before=$BEFORE after=$AFTER  $( [ "$BEFORE" = "$AFTER" ] && echo RESTORED || echo '*** MISMATCH ***')"
