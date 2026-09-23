# AGENTS.md

## Project

Dark-mode site skin for archiveofourown.org, plus a Vite preview harness for
testing skin changes against AO3-accurate page mockups.

- `skin.css` — the live skin. **This is the only theme file you edit.**
- `preview/` — mockup pages (home, search, work) + toolbar that switches between
  None / Original / Live skins. `pnpm dev` to run.

## Do NOT touch

- `DO_NOT_EDIT-original-skin.css` — frozen baseline for A/B comparison. Never edit.
- `preview/assets/ao3-base.css`, `ao3-midsize.css`, `ao3-narrow.css` — verbatim
  copies of AO3's real stylesheets. Never edit.
- `public/images/**` — downloaded AO3 sprites/logos.

## Tweaking the theme

Edit `skin.css` only. Verify visually in the preview (`pnpm dev`); the page
reloads on save. Use the toolbar's Original vs Live toggle to confirm changes.

Before adding or changing rules, check `RULES.md` for known constraints (e.g.
CSS properties AO3 does not support). Add new constraints there as you find
them.
