# Handoff: V2 stickman gait, pop-up scenes, Lyon redraw

Supersedes: `.agents/handoffs/2026-09-24-2153-v2-carnet-de-route.md` (its V2 model section still describes the scene engine; this one records what changed since and the agreed V3 plan).

## State

Branch `V2`, last commit `13d62e0`. Everything below is UNCOMMITTED in the working tree (`README.md`, `v2/app.js`, `v2/index.html`, `v2/skylines.js`, new `v2/walker.js`, new `v2/lab.html`). The user has not yet asked to commit this batch; ask before committing.

## Done this session

- `v2/walker.js`: stickman with procedural gait (idle, walk, run, Naruto sprint with speed lines), stance foot planted at ground speed, inverted-pendulum hip, turn-around pivot, red scarf. `v2/lab.html` is a standalone test bench (speed slider, auto demo). The user asked for a stickman, "well animated, running Naruto-style on fast scroll"; they have not reacted to the result yet.
- `v2/app.js`: stops spaced `SP = 900` scene units (was 1450) so a human-scale walker is plausible; position follows scroll with a spring capped at sprint speed (`VMAX`); story, card and rail switch on the walker's position (`Math.round(pos)`), not on scroll. Pop-up: each layer folds flat leaving a stop and unfolds arriving (`FOLD` thresholds, near first), with a small bounce; path strings cached per quantized opening. Signposts pop up too.
- `v2/skylines.js`: `L()` tags each part as a group; a group unfolds as one piece (fixes floating buildings during unfold). Lyon redrawn: Fourvière hill with plateau and the basilica on it, chapel with the Virgin, Vieux Lyon, Saône, Presqu'île, Part-Dieu (`crayon`, `incity`). The metallic tower (looked like the Eiffel Tower) was removed.

## User feedback pending

Last message: the user asked what the second Part-Dieu tower is (it is meant to be Tour Incity; they guessed Oxygène), then said "We'll rework that later". Both Part-Dieu towers need a more faithful redraw: the real Crayon is a round tower with a pyramid top, Incity has a tapered, rounded crown. Consider whether the user prefers Oxygène.

## Agreed V3 plan (user validated on 2026-09-25)

In order: 1 stickman (done, awaiting feedback), 2 life chapters with a double-page transition and per-chapter light or season, 3 pop-up (done), 4 walker outfit per chapter plus learners walking behind from 2023, 5 backpack that fills with skills per stop (hover shows the inventory, replaces V1 skills), 6 red thread or paper plane for remote work, and day or night computed from the timezone gap, 7 express flat timeline "Le CV en 30 secondes", 8 open ending with a blank signpost.

Proposed chapters (validated): Premiers pas (Lyon 2011), Consultant (Accenture 2013), L'Australie (2016–2017), Nomade (Bali 2017 to Istanbul 2021, ENI included), Architecte (OpenClassrooms, Lima, Lyon Rubrash, 2021–2023), Transmission (2023 onward, HiPay and freelance included). Outfits: suit (Consultant), hat and backpack (Australia), laptop bag (Nomade); Premiers pas and Architecte outfits still undecided, ask.

User decisions: NO contact form and NO PDF (express version without PDF, ending keeps LinkedIn and email links); this interpretation was stated to the user and not contradicted. Illustrations: the agent draws SVG by hand itself, one scene redrawn at a time for review (Lyon done; Nantes proposed next). Work stays in `v2/` on branch `V2`.

## Known issues

- Mid-walk the page looks empty for a moment (both scenes folded); acceptable so far, watch feedback.
- Performance still unmeasured on real hardware (drop-shadow filters on layers, path swaps during unfold).
- Narration in `data.js` is a draft; invented phrasings listed in the superseded handoff.

## Verification workflow

`/tmp/shot` (recreate with `npm i puppeteer-core` if gone). `shot2.mjs <w> <h> <items...>` jumps via the rail (`9` = rest at item 9, `9+` = mid-walk toward the next; keyboard presses do not reach the page headless, use rail clicks). `burst.mjs` takes successive full-viewport frames during an unfold; do not use `clip` (it breaks the fixed scene capture). `lab.mjs` shoots the stickman at fixed speeds in `lab.html`. Always `node --check v2/*.js`.

## Suggested skills

- `run`: screenshot V2 and `lab.html` after each visual change.
- `prototype`: for the chapter double-page and outfit experiments before integrating.
- `unslop`: for any narration or chapter copy.
- `simplify` or `code-review`: before merging `V2` into `main`.
