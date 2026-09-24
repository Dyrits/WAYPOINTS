# Handoff: V2 "Carnet de route" (walking planet)

Supersedes: `.agents/handoffs/2026-09-24-0203-cv-site-globe.md` (V1 globe notes there remain valid for the V1 site; its "nothing committed" line was already stale).

## Context

Same project and working dir (`/Users/dgerrits/Codelab/Resume`), same constraints: static, zero dependency, zero build, French content, opens from `file://`. The user found V1 generic and asked for a V2 keeping only the "Voyage" part: full-page scene, name and title top right, a narrated travel/life log with the work and study cards kept. Their brief: a silhouette walking on a curved world, scrolling rotates it, only the paper-style skyline changes per location, the story grows over time; later maybe origami/scrapbook elements unfolding words.

V2 lives in `v2/` and is committed on branch `V2` (see `git log V2`). V1 (`index.html`, `app.js`, `style.css` at root) is untouched and still works. `README.md` has a "V2 · Carnet de route" section describing files and how to edit.

## V2 model (built this session, user has seen screenshots only via report, not yet reacted)

- `v2/skylines.js`: flat-coordinate polygon primitives (towers, domes, palms, animals, landmarks) and one scene per `place` (plus `online`, `prologue`, `epilogue`), three layers far/mid/near, palette per region. Polygons with `hole: true` cut windows (winding normalized in app.js). Parts passed to `L()`/`move()` may be a polygon or a list of polygons.
- `v2/app.js`: SVG scene. Items = prologue + one per stop + epilogue. Geometry built at angle 0 around the planet center, then each item's paths rotated by `(index - pos) * S`. Scroll maps to `target` with a HOLD rest per item; `pos` lerps toward it. Walker legs driven by distance walked, flips on scroll up. Signposts between items with haversine km. Card folds/unfolds (CSS), narration words stagger in, red stamp for the place. Year rail at bottom, arrows keys navigate.
- `data.js`: added `story` per stop and `prologue` / `epilogue` objects (used only by V2). Narration is a DRAFT written by the agent; the user must rewrite. Invented phrasings flagged to the user: Lyon "apprendre à parler aux gens", Merredin "Je range le costume", Perth "les coups de feu", Dubbo "au milieu des eucalyptus", ENI "Je mets un titre sur la pratique".

## Known gaps

- Repeated places (Nantes x3, Lyon x2, Kuala Lumpur x2) reuse the same scene.
- Lima: walker walks at the foot of the cliff, not on top.
- Performance not measured on real hardware; CSS drop-shadow filters on rotating layers may be costly. Fallback: drop `.layer` filter or bake shadows as offset paths.
- Card covers the right part of the skyline on desktop; on mobile the card is a bottom sheet over the ground.

## Next steps offered to the user (none chosen yet)

1. Origami/scrapbook: paper panels unfolding on the ground to reveal words.
2. Distinct scene per return visit (time of day, seasonal change, added props).
3. Story props: plane or boat between continents, backpack that fills up.
Also still open from V1 handoff: 2026 freelance title/date alignment, Taichung/Lima remote calls.

## Verification workflow

Puppeteer-core in `/tmp/shot` (may not survive; recreate with `npm i puppeteer-core`). `shot.mjs <w> <h> <item...>` scrolls to an item index (0 = prologue, stop i = i+1, 22 = epilogue) and screenshots `/tmp/shot/v2-<w>-<item>.png`; `walk.mjs` clips walker frames mid-walk (clip y must add `scrollY`). Also `node --check v2/*.js data.js`. Check 1440x900, 1024x768, 390x844.

## Suggested skills

- `run`: launch and screenshot V2 after each visual change.
- `unslop`: when the user's narration text lands in `data.js`.
- `prototype`: for trying origami/unfold interactions before committing to one.
- `simplify` or `code-review`: before merging `V2` into `main`.
- `documentation`: when README needs more than the V2 section.
