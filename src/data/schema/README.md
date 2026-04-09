# Data Schema Root

This directory is the canonical schema definition root for Drizzle.

- Authoring schema lives under `src/data/schema/authoring/`.
- Runtime schema lives under `src/data/schema/runtime/`.
- Shared schema helpers live in `src/data/schema/shared.ts`.

Current scope:

- relational authored-truth tables for worlds, books, versions, canon, entities, and planning rules
- relational runtime tables for chronicles, projection state, scenes, choices, resolutions, knowledge, events, and canon commits
