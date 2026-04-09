# Studio Shell

## Purpose

The Studio shell is the author-facing home for managing book-bible inputs.

## Studio routes

- `/studio` overview
- `/studio/worlds`
- `/studio/books`
- `/studio/versions`
- `/studio/canon`
- `/studio/entities`
- `/studio/planning`

## What belongs in Studio

- Authoring navigation and section structure.
- Section headers, shell components, and placeholder states.
- Future authoring workflows for worlds/books/versions/canon/entities/planning rules.

## What does not belong in Studio

- Planner algorithms or planner validity decisions.
- Runtime commit orchestration.
- Generator provider logic.
- Admin observability surfaces.
- Reader runtime flow logic.

## Why this prompt stops at shell level

This stage establishes structure and navigation only.
Prompt `08_authoring_workflow_v1.md` adds first-pass authoring workflows on top of this shell.

## Architecture reminder

- Studio page files stay thin and compose reusable `src/ui/studio` components.
- Raw DB client imports are intentionally excluded from Studio UI/page layers.
- Planner/runtime/generator logic remains outside Studio UI.
