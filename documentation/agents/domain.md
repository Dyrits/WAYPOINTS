# Domain Documentation

How the workflow skills should consume this repository's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repository root, or
- **`CONTEXT-MAP.md`** at the repository root if it exists: it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`documentation/architecture-decision-record/`**: read architecture decision records that touch the area you're about to work in. In multi-context repositories, also check `src/<context>/documentation/architecture-decision-record/` for context-scoped decisions.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-documentation` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repository (most repositories):

```
/
├── CONTEXT.md
├── documentation/architecture-decision-record/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Multi-context repository (presence of `CONTEXT-MAP.md` at the root):

```
/
├── CONTEXT-MAP.md
├── documentation/architecture-decision-record/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── documentation/architecture-decision-record/                  ← context-specific decisions
    └── billing/
        ├── CONTEXT.md
        └── documentation/architecture-decision-record/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
