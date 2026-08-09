# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** if it exists.
- **`docs/adr/`** for decisions affecting the current work.

If these files don't exist, proceed silently. The `/domain-modeling` skill creates them lazily when terminology or architectural decisions are resolved.

## File structure

This repository uses a single-context layout:

/
├── CONTEXT.md
├── docs/adr/
└── src/

## Use the glossary's vocabulary

When output names a domain concept, use the term defined in `CONTEXT.md`. Avoid synonyms the glossary explicitly rejects.

If a needed concept is missing, reconsider whether the term belongs or note the gap for `/domain-modeling`.

## Flag ADR conflicts

If work contradicts an existing ADR, surface the conflict explicitly rather than silently overriding it.
