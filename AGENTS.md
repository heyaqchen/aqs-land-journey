# Frozen phone prototype area

The user explicitly requested on 2026-10-11 that subsequent unrelated changes
must not touch the phone display adaptation or the highlight/guidance flow.

Preserve:
- `prototype-tour.js`: phone viewport scaling, mode tabs, instruction messages.
- `prototype/phone-embed.js`, `prototype/phone-fit.css`, `prototype/home-phone.css`.
- `prototype/tour-guide.js`, `prototype/interaction-tools.js`.
- The homepage and four mode HTML files, plus homepage entry/onboarding scripts.
- The phone iframe and tour script reference in `index.html`.
- The phone/tour CSS region and desktop phone height rule in `style.css`.

The four mode display proportions were accepted by the user. Mode selection
must only highlight the confirmation button; entry happens after confirmation.
Question pages use direct long-press/drag marking and long-press exclusion.

Before publishing any later change, run `node verify-prototype-lock.mjs` from
this checkout. Its baseline is in `prototype-lock.json`. Keep the baseline
unchanged for unrelated work. If validation fails during unrelated work,
restore the accidental changes. Only a subsequent explicit request to change
this protected area permits changing its implementation and baseline.
