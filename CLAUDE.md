# TrendDrop

Landing page for the TrendDrop newsletter (5 trending TikTok products, every Monday).
One static file, no build step, deployed to GitHub Pages on every push to `main`.

## Layout

- `index.html` — the entire site. Inline CSS, no JS of our own, beehiiv embed for signup.
- `.github/workflows/pages.yml` — deploys the repo root to GitHub Pages on push to `main`.
- `scripts/verify.mjs` — the check that proves the page is sound. Run it after every edit.
- `notes/DECISIONS.md` — why things are the way they are. Append, don't rewrite.
- `.claude/` — commands, agents, hooks and settings for Claude Code.

## Verify your work

Always run `node scripts/verify.mjs` after editing `index.html`. It checks:
doctype, title, viewport, the beehiiv form id, balanced tags, no `http://` assets,
and (when Playwright is installed) renders the page headless, fails on console errors,
and writes a screenshot to `.verify/index.png`. Look at the screenshot before saying a
visual change is done. A hook runs this automatically after Edit/Write on `index.html`.

## Rules

- Keep `index.html` a single file. No frameworks, no bundler, no npm deps for the site.
- Never change the beehiiv form id `65db508b-8c20-47c1-beef-c47bc5ee5386` or the
  fallback link `https://trenddropweekly.beehiiv.com/subscribe` without being told to.
- Keep the page under 10 KB. Inline everything. External assets only from beehiiv.
- Brand colors: bg `#0b0b12`, text `#f2f2f7`, muted `#b8b8c8`, cyan `#25f4ee`, pink `#fe2c55`.
- Copy voice: direct, operator-to-operator, no hype words ("revolutionary", "game-changing").
- Commit messages: imperative, one line, say what changed for the visitor.
- Do not push to `main` directly from a session unless asked. `main` deploys live.

## Workflow

- Start non-trivial changes in plan mode. Agree the plan, then auto-accept edits.
- After any correction from the user, add the lesson under "Lessons" below so it is not repeated.
- Use `/verify` to check, `/ship` to verify + commit + push, `/copy-review` before changing copy.

## Lessons

<!-- Add one line per correction. Keep this list short and current; prune what stops applying. -->
- (none yet)
