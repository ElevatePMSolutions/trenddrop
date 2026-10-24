# Decisions

Append one entry per judgment call. Newest at the bottom. Keep each to 1-3 lines.

- 2026-10 — Single static `index.html`, no build: the page is a signup form with three
  cards. A framework would add deploy risk for zero visitor benefit.
- 2026-10 — Signup via beehiiv embed plus a plain fallback link, so the page still converts
  if the embed script is blocked.
- 2026-10 — Deploy is GitHub Pages from repo root on push to `main`. Work on branches;
  `main` is live.
- 2026-10 — Added `scripts/verify.mjs` and `.claude/` so Claude Code can prove edits
  (static checks + headless render) instead of asserting them.
