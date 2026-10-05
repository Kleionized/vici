#!/bin/bash
# verifier: list src/ files whose content differs from refs/snapshots/pre-overhaul-full (incl. untracked), or are new/deleted
cd /Users/admin/Documents/Vici
REF=refs/snapshots/pre-overhaul-full
git ls-tree -r $REF --name-only -- src | while read -r f; do
  if [ ! -e "$f" ]; then echo "D $f"; continue; fi
  if ! git show "$REF:$f" | cmp -s - "$f"; then echo "M $f"; fi
done
comm -13 <(git ls-tree -r $REF --name-only -- src | sort) <(find src -type f | sort) | sed 's/^/A /'
