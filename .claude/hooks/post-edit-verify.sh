#!/usr/bin/env bash
# PostToolUse hook: run the verifier only when index.html was edited.
# Reads the tool payload on stdin; silently exits for any other file.
set -u
payload="$(cat)"
case "$payload" in
  *index.html*) ;;
  *) exit 0 ;;
esac
cd "$(dirname "$0")/../.." || exit 0
out="$(node scripts/verify.mjs 2>&1)"
status=$?
if [ $status -ne 0 ]; then
  # Exit 2 feeds the output back to Claude as feedback it must act on.
  echo "$out" >&2
  exit 2
fi
echo "$out"
