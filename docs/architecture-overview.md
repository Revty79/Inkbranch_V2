# Architecture Overview

## Product direction

Inkbranch v2 is planner-led, runtime-committed, and AI-on-rails.

It is explicitly not a beat-graph-first architecture.

## Core flow

`authored truth -> planner scene package -> runtime commit -> reader/admin inspection -> next planner cycle`

## Layer ownership

- `src/app`: route-level orchestration and page entry points
- `src/core`: domain contracts and engine behavior (planner/runtime/generator/validators)
- `src/data`: DB schema, query/mutation modules, and persistence mappers/adapters
- `src/ui`: presentational components only
- `src/lib`: small shared helpers/constants/env access

## Engine boundaries

- Planner (`core/planner`) decides valid structural scene/choice packages.
- Runtime (`core/runtime`) commits relational truth and projection/event updates.
- Generator (`core/generator`) renders approved structure into prose/options only.
- Validators (`core/validators`) guard continuity, legality, projection coherence, and generator safety boundaries.

## Truth model

- Authoring tables are authored source-of-truth.
- Runtime truth is relational + event-log backed.
- Generated prose is presentation, not canon.

## Red lines

1. Do not put planner/runtime/generator logic into UI.
2. Do not let generator output become truth authority.
3. Do not collapse runtime truth into an opaque JSON blob.
4. Do not reintroduce beat-tree/beat-graph core progression.

## Related docs

- [Module Boundaries](module-boundaries.md)
- [Rebuild Principles](rebuild-principles.md)
- [Planner MVP](planner-mvp.md)
- [Runtime Commit Pipeline](runtime-commit-pipeline.md)
- [Generator Boundary](generator-boundary.md)
- [Validation and Continuity Guards](validation-and-continuity-guards.md)
