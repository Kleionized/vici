#!/bin/zsh
# GROUP slip — capture one frame both ways and block-diff the PNGs.
#   f-slip-run.sh <FrameFile.html> <slug> <route> <seedfile|-> <doString|-> [wait]
set -e
cd /Users/admin/Documents/tideline
F=$1; S=$2; R=$3; SEED=$4; DO=$5; W=${6:-2500}
node scripts/vicifull/shot.mjs design Email-Login "$F" ".vicifull/fslip/d-$S.png" "--sig=f-slip-d-$S" >/dev/null
ARGS=(scripts/vicifull/shot.mjs app "$R" ".vicifull/fslip/a-$S.png" "--sig=f-slip-a-$S" "--wait=$W")
[[ "$SEED" != "-" ]] && ARGS+=("--initseed=$SEED")
[[ "$DO" != "-" ]] && ARGS+=("--do=$DO")
node "${ARGS[@]}" >/dev/null
echo "── $S"
node scripts/vicifull/sigdiff.mjs "f-slip-d-$S" "f-slip-a-$S" | tail -1
node .vicifull/f-slip-blocks.mjs ".vicifull/fslip/d-$S.png" ".vicifull/fslip/a-$S.png" 4
