# 02: Saut

**What to build:** the visitor makes the marcheur jump with the space bar or by clicking or tapping the scene. The saut is purely visual: it never moves the walk, never scrolls the page, and never steals clicks from the card, the rail or links.

**Blocked by:** 01

**Status:** draft

- [ ] Space triggers a saut and does not scroll the page; arrow keys keep their navigation role
- [ ] A click or tap on the scene surface triggers a saut; clicks on the card, the rail and links keep their own behaviour and trigger no saut
- [ ] The saut works at every pace (idle, walk, run, sprint) and lasts longer when sprinting
- [ ] A new saut starts only once the marcheur has landed; repeated presses while airborne are ignored
- [ ] Walker position, current escale and header are identical before and after a saut
- [ ] The lab bench can trigger a saut at each fixed speed
- [ ] Headless check: scene click produces a saut, card, rail and link clicks do not; screenshots at rest and mid-saut
