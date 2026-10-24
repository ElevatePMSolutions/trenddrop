---
description: Run the page verifier and inspect the screenshot
allowed-tools: Bash(node scripts/verify.mjs), Read
---
Run `node scripts/verify.mjs`.

If it fails, fix every listed failure in `index.html` and run it again until it passes.
If it rendered screenshots, open `.verify/index-mobile.png` and `.verify/index.png` and
confirm the page matches the intended change. Report: pass/fail, what you looked at,
anything that looks off even if the script passed.
