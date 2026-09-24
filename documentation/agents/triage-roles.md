# Triage Roles

The skills speak in two category roles and four state roles. This file maps each role to the string this repository's tracker actually uses.

## Where a role is written

- **Remote tracker**: as a label on the issue (or merge request / pull request).
- **Local markdown tracker**: as the `Category:` and `Status:` lines near the top of the issue file under `backlog/`.

A draft in `.refinement/` carries `Status: draft` and holds no triage role. Roles start at publication.

## Category roles

| Canonical role | String in our tracker | Meaning                    |
| -------------- | --------------------- | -------------------------- |
| `bug`          | `bug`                 | Something is broken        |
| `enhancement`  | `enhancement`         | New feature or improvement |

## State roles

| Canonical role | String in our tracker | Meaning                                                                                       |
| -------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| `to-evaluate`  | `to-evaluate`         | Maintainer needs to evaluate this issue                                                         |
| `on-hold`      | `on-hold`             | Paused on something named in the triage notes: a reply, an external dependency, another issue   |
| `ready`        | `ready`               | Fully specified, with a brief attached, safe to pick up                                         |
| `not-planned`  | `not-planned`         | Closed without action, reason recorded                                                          |

When a skill names a role ("apply the ready triage role"), use the corresponding string from these tables.

Edit the right-hand columns to match the vocabulary you actually use. The role set itself (which categories and states exist, and the transitions between them) is part of the skills and stays fixed: `to-tickets` and `to-specifications` apply `ready`, so removing or renaming a role breaks the chain. These four states cover intake only, whether an issue is actionable; work that is already moving (in progress, in review, deployed) is tracked by your tracker's own status field, a branch, or a pull request.
