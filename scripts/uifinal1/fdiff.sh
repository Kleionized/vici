#!/bin/bash
# Declaration-level diff of one frame between the previous bundle's split and this one.
# usage: fdiff.sh <prevBundleDir> <newBundleDir> <frameFile>
diff -u <(node scripts/uifinal1/decl.mjs "$1/$3" 2>/dev/null) <(node scripts/uifinal1/decl.mjs "$2/$3" 2>/dev/null)
