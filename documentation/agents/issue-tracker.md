# Issue tracker: Local Markdown

Published issues and specifications live in `backlog/`, the committed system of record. Drafts live in `.refinement/` and reach `backlog/` only through an explicit publish (see the refinement workspace section below).

## Conventions

- One feature per directory: `backlog/<feature-slug>/`
- The specification is `backlog/<feature-slug>/specification.md`
- Implementation issues are one file per ticket at `backlog/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage roles are two lines near the top of each issue file: `Category:` for the category role and `Status:` for the state role (see `triage-roles.md` for the strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## Ticket writing convention

- **Source:** Built-in `to-tickets`
- **Applies to:** Refinement drafts and published tickets
- **Rules:** Use the built-in ticket template unless the user selects another configured convention for the run.

## When a skill says "publish to the issue tracker"

Write the file under `backlog/<feature-slug>/` (creating the directory if needed), replacing `Status: draft` with the triage state role the publishing skill applies.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `backlog/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `backlog/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Progress:` line records `claimed`/`resolved`. `Progress:` is wayfinder's own line, kept separate from the `Status:` triage role.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `Progress: resolved`.
- **Frontier**: scan `backlog/<effort>/issues/` for files that are open, unblocked, and carry no `Progress: claimed`; first by number wins.
- **Claim**: set `Progress: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Progress: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.

## Refinement workspace

Every repository refines locally before it publishes, whatever its tracker.

- One workspace per source issue at `.refinement/<issue-key>/`, or `.refinement/<feature-slug>/` when no issue exists yet.
- The refined specification lives at `specification.md`; draft implementation tickets live under `issues/` as one file per ticket, numbered from `01`.
- Every draft carries `Status: draft`. A draft sourced from the tracker also carries `Source: <issue-key> (<url or repository-relative ticket path>)` at the top of `specification.md`.
- Interviews, exploratory catalogues, working playtest notes, and draft specifications or tickets stay in this workspace. A reference from a published issue does not promote a working note into the tracker.
- Reading the tracker is always allowed through the configured access method. Creating or updating its records is the **publication boundary**, crossed only on an explicit request from the user ("publish", "create the issue", "update Jira").
- Publication writes the selected specification or tickets to `backlog/<feature-slug>/`, then links each draft to the record it produced. Supporting notes stay in refinement.
- A tracker with its own refinement, analysis, or grooming status does not replace this workspace. Draft here, then publish into that status.
