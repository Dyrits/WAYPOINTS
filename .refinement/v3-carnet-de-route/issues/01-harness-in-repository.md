# 01: Screenshot and check harness in the repository

**What to build:** a maintainer can run the page check, screenshots, burst captures and lab captures from the repository after a fresh clone, against V3, without anything left in a temporary folder. The site itself stays dependency-free and build-free; the harness has its own development-only package manifest.

**Blocked by:** None (can start immediately)

**Status:** draft

- [ ] The check, screenshot, burst, lab and walk scripts live in the repository tools, with a development-only package manifest
- [ ] The scripts target V3 (page and lab), not the old lowercase V2 path
- [ ] The check script loads every page (V1, V2, V3, V3 lab) and reports console and page errors; it passes on the current tree
- [ ] Navigation in scripts goes through rail notch clicks, since keyboard presses do not reach the page headless
- [ ] Every script passes a syntax check
- [ ] The README says how to install and run the harness, and that it uses the system Chrome
