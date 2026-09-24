Status: draft

# V3 · Carnet de route

## Problem Statement

La V2 fait marcher un personnage d'escale en escale, mais le parcours se lit comme une suite plate de 21 escales. Le visiteur ne perçoit pas les grandes périodes de vie, ne voit pas ce que chaque expérience a apporté, ne comprend pas d'où le travail à distance a été fait, et n'a aucun moyen de jouer avec le marcheur. Un recruteur pressé n'a pas de repère pour situer une escale dans l'ensemble.

## Solution

Le carnet est découpé en sept chapitres, chacun ouvert par une double page qui se tourne, avec sa propre lumière et la tenue du marcheur qui change. Le marcheur accumule les compétences dans un sac à dos consultable, déroule un fil rouge vers les endroits d'où il a travaillé à distance, est suivi par des apprenants à partir de 2023 puis rejoint par un compagnon IA. Le visiteur peut le faire sauter. Le parcours contient des interludes et une annexe, et se termine sur un panneau vierge. Un lien LinkedIn reste accessible en haut à droite.

Chapitres, dans l'ordre :

| Chapitre | Escales | Période | Lumière | Tenue |
| --- | --- | --- | --- | --- |
| Premiers pas | Lyon 2011 | 2011 – 2012 | Aube | Sac de prospectus en bandoulière |
| Première expérience | Nantes, Accenture | 2013 – 2016 | Jour gris de bureau | Costume |
| Visa ~~Vacances~~ Travail | Merredin, Perth, annexe Ubud, Dubbo | 2016 – 2017 | Plein soleil ocre | Chapeau et sac à dos |
| Sur la route | Ubud 2017 à Istanbul 2021, ENI et interlude Bouguenais compris | 2017 – 2021 | Couchant tropical | Sacoche d'ordinateur |
| Architecte en devenir | OpenClassrooms, Lima, Lyon Rubrash | 2021 – 2023 | Lumière froide et nette | Rouleau de plans sous le bras |
| Transmission du savoir | Nantes 2023 (OpenClassrooms, O'clock, EPSI) | 2023 – 2025 | Fin d'après-midi dorée | Aucun accessoire, apprenants en chapeau d'université |
| L'ère de l'IA | Nantes HiPay, Paris | 2025 – | Nuit bleutée | Compagnon IA |

Le foulard rouge est présent dans toutes les tenues.

## User Stories

### Chapitres

1. As a visitor, I want the walk divided into named chapters, so that I grasp the main periods of the career at a glance.
2. As a visitor, I want a double page to turn when I cross into a new chapter, so that the change of period feels like turning a page of the carnet.
3. As a visitor, I want the double page to show the chapter title, its period and one opening sentence, so that I know what the next stretch is about before walking it.
4. As a visitor, I want the double page to turn whether I walk forward or backward, so that the carnet behaves the same in both directions.
5. As a visitor, I want the double page to turn when I jump through the rail or the keyboard arrows across a chapter boundary, so that I never land in a chapter without seeing its title.
6. As a visitor, I want each chapter to have its own light, so that I feel the atmosphere of the period.
7. As a visitor, I want a revisited place (Lyon, Nantes, Kuala Lumpur) to take the light of the current chapter, so that returning to a place still feels like a different moment.
8. As a visitor, I want the current chapter named in the header next to the escale number, so that I always know where I am.
9. As a visitor, I want the title "Visa ~~Vacances~~ Travail" rendered with "Vacances" struck through, so that the joke lands.
10. As a visitor who prefers reduced motion, I want the page turn replaced by a simple fade, so that the transition does not bother me.

### Tenues et personnages

11. As a visitor, I want the walker to change outfit at each chapter, so that the character visibly grows with the career.
12. As a visitor, I want the red scarf in every outfit, so that I recognise the same walker throughout.
13. As a visitor, I want the outfit to switch at the chapter boundary, not in the middle of an escale, so that the change is readable.
14. As a visitor, I want apprentices wearing graduation caps to follow the walker from March 2023 onwards, so that I see the teaching activity.
15. As a visitor, I want one to three apprentices at a time, some leaving and new ones joining over the walk, so that the teaching feels alive rather than static.
16. As a visitor, I want the apprentices to walk at the walker's pace, sprint and stop with the walker, so that they read as followers.
17. As a visitor, I want the apprentices to keep following during L'ère de l'IA, so that the ongoing mentoring stays visible.
18. As a visitor, I want no apprentice before March 2023, so that the story stays truthful.
19. As a visitor, I want a small glowing companion floating next to the walker from L'ère de l'IA onwards, so that the AI period has a presence.
20. As a visitor walking backward, I want outfits, apprentices and the companion to revert to what matches the chapter, so that going back is consistent.

### Saut

21. As a visitor, I want to make the walker jump by pressing the space bar, so that I can play with the character.
22. As a visitor, I want to make the walker jump by clicking on the scene, so that I can play without a keyboard, including on touch screens.
23. As a visitor, I want clicks on the card, the rail and links to keep their own behaviour and not make the walker jump, so that navigation still works.
24. As a visitor, I want the space bar not to scroll the page, so that jumping does not move me along the walk.
25. As a visitor, I want the jump to work at every pace (idle, walk, run, sprint), longer when sprinting, so that it feels physical.
26. As a visitor, I want the apprentices and the companion to stay on their path when the walker jumps, so that the jump stays the walker's own.
27. As a visitor, I want the jump to have no effect on the walk or on the story, so that playing never breaks my reading.
28. As a visitor pressing space repeatedly, I want a new jump to start only once the walker has landed, so that the character does not fly away.

### Sac à dos

29. As a visitor, I want the walker's backpack to fill with the skills gained at each passed escale, so that I see expertise accumulate.
30. As a visitor, I want to hover or tap the backpack to see its inventory, so that I can read the skills.
31. As a visitor, I want the inventory grouped by category (languages, back-end, cloud, data, front, AI, quality), so that it reads like a skills section.
32. As a visitor, I want the skills specific to each experience, so that the backpack tells what each job brought.
33. As a visitor, I want newly added skills highlighted when I arrive at an escale, so that I notice what this escale brought.
34. As a visitor walking backward, I want skills gained later to leave the backpack, so that the inventory matches the moment.
35. As Dylan, I want to validate the skills of each experience before they go live, so that nothing invented appears on my CV.

### Fil rouge

36. As a visitor, I want a red thread extending from the walker's scarf to each place I worked remotely from, so that I understand remote work at a glance.
37. As a visitor, I want the thread to follow the listed order when the remote places form an itinerary, so that I read the route.
38. As a visitor, I want the thread to mark time spent on site when the list says so, so that I tell on-site time apart from remote time.
39. As a visitor, I want the thread to appear only at escales with remote work, so that it stays meaningful.
40. As a visitor, I want the thread to unwind when I arrive and wind back when I leave, so that it follows the pop-up rhythm of the scenes.

### Interlude et annexe

41. As a visitor, I want Bouguenais 2019 shown as an interlude inside Sur la route, so that I understand it is a pause outside the chapter's theme.
42. As a visitor, I want an interlude to keep its card and experience but open no new chapter, keep the outfit and turn no double page, so that the chapter stays whole.
43. As a visitor, I want the header to label an interlude as such instead of a regular escale, so that its status is clear.
44. As a visitor, I want a short halt at Ubud between Perth and Dubbo in summer 2017, so that the story covers that time.
45. As a visitor, I want the annexe to show one sentence in the Ubud scenery and no card, so that it reads as a breath, not a job.
46. As a visitor, I want the annexe not counted in the escale numbering, so that the count only reflects experiences.
47. As Dylan, I want to declare interludes and annexes in the content file, so that I can add more later without touching the engine.

### Fin et liens

48. As a visitor, I want the walk to end on a blank signpost, so that the career reads as open.
49. As a visitor, I want the ending to keep the LinkedIn and email links, so that I can get in touch.
50. As a visitor, I want a LinkedIn link permanently at the top right, so that I can reach the full profile at any time.

### Contenu et maintenance

51. As Dylan, I want chapters defined in the content file (title, opening sentence, period, light, outfit) and each escale linked to one chapter, so that I edit the story without touching the engine.
52. As Dylan, I want the V1 site to keep working with the enriched content file, so that both versions share one source.
53. As Dylan, I want chapter sentences drafted for me to validate, so that the copy stays mine.
54. As a maintainer, I want a screenshot and check harness in the repository, so that visual checks survive a clean of temporary files.

## Implementation Decisions

- **Content file.** Gains a list of chapters, each with an identifier, title (markup for the struck-through word), period label, opening sentence, light and outfit keys. Each escale references its chapter. An escale can be marked as interlude. A new escale kind, annexe, carries a place, dates, one story sentence and no experience. Each experience gains its own skills tags, mapped to the existing skill categories. V1 ignores the new fields; the annexe must not break V1 rendering (V1 skips annexes).
- **Chapter derivation.** A chapter is the run of consecutive escales that reference it. The engine computes, for any walker position, the current chapter and whether a boundary is being crossed. This is the single place deciding outfit, light, double page and header label.
- **Double page.** An overlay turned on crossing a boundary, in both directions and on rail or keyboard jumps. It does not trigger on interludes or annexes. Reduced motion replaces the turn with a fade.
- **Light.** Applied as a tint over the existing per-region palettes, per chapter; the scenery is not redrawn for it.
- **Walker module.** Its interface grows with: an outfit setter (accessory set per chapter, scarf always on), a jump trigger (ignored while airborne, arc length scaled by current speed, pure visual offset with no effect on position), and a backpack anchor used for the inventory hover.
- **Followers.** Apprentices and the AI companion are drawn by the engine next to the walker, reusing the walker's gait for apprentices (smaller figure, graduation cap). Apprentice presence starts at the first escale dated March 2023. Arrivals and departures are random, one to three at a time, from a seeded generator so a given position always shows the same group (walking back and forth stays consistent and checks are repeatable).
- **Jump input.** Space bar with default scrolling prevented; pointer click on the scene surface only. Card, rail and links stop the event from reaching the scene. Arrow keys keep their navigation role.
- **Backpack inventory.** Union of the skills tags of all passed escales, grouped by skill category, recomputed from position; skills added at the current escale are flagged as new.
- **Red thread.** Drawn from the scarf tip to the remote places already listed per escale, in order when the escale marks an itinerary, with on-site time marked. It unwinds and winds back with the existing fold thresholds.
- **Header.** Shows chapter name, then "Escale NN / NN" (annexes excluded from numbering) or "Interlude".
- **Ending.** The epilogue scene shows a blank signpost, with the existing links.
- **LinkedIn link.** Permanent, top right, from the existing profile links.
- **Test harness.** The screenshot scripts move from the temporary folder into the repository tools, with their own development-only package manifest; the site itself stays dependency-free and build-free.

## Testing Decisions

- **One seam: the V2 page in a headless browser.** Navigation by clicking rail notches (keyboard presses do not reach the page headless). Checks assert what the visitor sees, never internal variables: header text (chapter, escale number, interlude label), presence of the double page when crossing a boundary and its absence on interludes and annexes, card presence (none on the annexe), backpack inventory contents at a given escale, number of apprentices (zero before March 2023, one to three after, same group on revisit), companion presence from L'ère de l'IA, red thread presence at remote escales only, jump on scene click and no jump on card, rail or link click, no scroll on space.
- **Screenshots** accompany each visual change for review, at rest and mid-walk, using the existing burst approach during unfold and page turn (full viewport, no clip).
- **Lab bench** remains the place to tune gait and jump at fixed speeds; outfits and followers are added to it.
- **Prior art:** the existing screenshot, burst and lab scripts, and syntax checks on every script.

## Out of Scope

- Express version "Le CV en 30 secondes", PDF export and contact form (abandoned).
- Day and night computed from the time-zone gap (abandoned in favour of per-chapter light; recommendation not explicitly confirmed).
- Redrawing scenery, including the Part-Dieu towers and Nantes, which proceeds in parallel, one scene at a time for review.
- Any change to V1 beyond tolerating the new content fields.
- Gameplay attached to the jump (collectibles, score).

## Further Notes

- V3 is developed in its own version folder, started as a copy of V2; V2 stays frozen as reference and V1 stays as is. The three versions share one content file. The site root redirects to V1 until V3 goes live.
- Delivery order: jump, chapters (double page and light), outfits and followers, backpack, red thread, interlude and annexe, ending.
- Open point: the Visa ~~Vacances~~ Travail outfit includes a backpack, while the Sac à dos inventory implies the walker carries a backpack throughout. To settle before the outfits ticket: is the inventory backpack visible from the start, or does it appear with this chapter and stay?
- Open point: annexe exclusion from escale numbering and the "Interlude" header label were derived here, not stated by Dylan.
- The chapter-boundary rendering and the double page deserve a prototype before integration, as suggested in the last handoff.
- Narration in the content file is still a draft; chapter sentences and skills tags are proposed by the agent and validated by Dylan, copy passed through unslop.
- Glossary in the repository's CONTEXT file: Escale, Chapitre, Interlude, Annexe, Lieu, Marcheur, Tenue, Apprenant, Compagnon IA, Saut, Fil rouge, Sac à dos.
