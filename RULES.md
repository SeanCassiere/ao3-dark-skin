# RULES.md

Constraints discovered while working on the skin. Check these before adding or
changing rules in `skin.css`.

## Unsupported CSS properties

AO3 sanitizes site/work skins and silently drops properties it does not allow.
Do not use these — they will have no effect on the live site even if they work
in the local preview:

- `scroll-behavior` — not supported. In-page anchor jumps (Top, Comments,
  chapter links) cannot be made to scroll smoothly via the skin.
