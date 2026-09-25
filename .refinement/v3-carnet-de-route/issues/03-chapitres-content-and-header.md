# 03: Chapitres in the content file and the header

**What to build:** the seven chapitres are declared in the shared content file and each escale references one. V3 derives the current chapitre from the marcheur's position and names it in the header next to the escale number. This derivation is the single place later tickets read for tenue, light and double page. V1 keeps working unchanged.

**Blocked by:** 01

**Status:** draft

- [ ] The content file holds the seven chapitres of the specification, each with identifier, title (with markup for the struck-through "Vacances"), period label, opening sentence, light key and tenue key
- [ ] Every escale references exactly one chapitre; chapitres are consecutive runs of escales
- [ ] For any position, the engine answers the current chapitre and whether a chapitre boundary is being crossed, in both directions
- [ ] The header shows the chapitre name then "Escale NN / NN" at every escale, forward and backward, including after rail and keyboard jumps
- [ ] Opening sentences are drafted by the agent, passed through unslop, and validated by Dylan before merge
- [ ] V1 and V2 load without errors and render as before (check script)
