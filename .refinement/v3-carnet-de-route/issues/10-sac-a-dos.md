# 10: Sac à dos inventory

**What to build:** the sac à dos fills with the skills of each experience at the passed escales. Hovering or tapping it opens the inventory grouped by skill category, with the skills added at the current escale highlighted. Walking backward removes skills gained later. Skills tags are validated by Dylan before they go live.

**Blocked by:** 01, 02

**Status:** draft

- [ ] Each experience in the content file carries its own skills tags, mapped to the existing skill categories (languages, back-end, cloud, data, front, AI, quality)
- [ ] Skills tags are proposed by the agent and validated by Dylan before merge; nothing invented
- [ ] The sac à dos is visible from the first escale, empty until skills are gained
- [ ] Hover (pointer) or tap (touch) on the sac à dos opens the inventory; opening it does not trigger a saut
- [ ] The inventory is the union of the skills of all passed escales, grouped by category
- [ ] Skills added at the current escale are highlighted
- [ ] Walking backward removes skills gained at later escales
- [ ] V1 ignores the new tags and renders as before
- [ ] Headless check: inventory contents at three chosen escales, forward and backward
