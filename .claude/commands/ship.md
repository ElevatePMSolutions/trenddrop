---
description: Verify, commit, and push the current branch (never main)
allowed-tools: Bash(node scripts/verify.mjs), Bash(git status*), Bash(git diff*), Bash(git add *), Bash(git commit *), Bash(git push -u origin *), Bash(git branch --show-current)
---
1. Run `node scripts/verify.mjs`. Stop and fix if it fails.
2. `git status` and `git diff --stat`. Confirm only intended files changed.
3. If the current branch is `main`, stop and ask for a branch name. `main` deploys live.
4. Commit with a one-line imperative message describing the visitor-facing change.
   Append a line to `notes/DECISIONS.md` if the change involved a judgment call.
5. `git push -u origin <current-branch>`.
6. Reply with the commit hash and the one-line summary. Do not open a PR unless asked.
