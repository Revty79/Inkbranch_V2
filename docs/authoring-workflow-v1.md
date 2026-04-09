# Authoring Workflow v1

## Purpose

Prompt `08_authoring_workflow_v1.md` turns Studio from a shell into a usable first-pass authoring workflow for Inkbranch v2.

Studio v1 now supports structured create/list/edit flows for:

- worlds
- books
- book versions
- canon entries
- characters
- locations
- factions
- perspectives
- arc milestones
- reveal rules
- pacing rules
- ending rules

## What v1 covers

The workflow follows the core hierarchy:

`world -> book -> book version -> version-owned authored truth`

Implemented route families:

- `/studio/worlds/*`
- `/studio/books/*`
- `/studio/versions/*`
- `/studio/canon/*`
- `/studio/entities/*`
- `/studio/planning/*`

Each section provides readable list pages, clear create entry points, and explicit edit pages.

## Version-centered authoring

Version ownership is explicit for canon, entities, and planning sections.

The workflow uses a visible version context selector (`StudioVersionContext`) so authors can see and switch the active book version. Version-owned forms include `bookVersionId` and persist data through the authoring data-access layer.

## Validation and structured fields

Server actions validate practical v1 constraints:

- required fields
- slug format (`lowercase-numbers-hyphen`)
- key format (`lowercase-numbers-hyphen-underscore`)
- numeric parsing for numeric fields
- JSON-object parsing for structured fields

Structured fields (for example eligibility/completion/gating/rule config payloads) use practical JSON textareas with validation instead of a complex rule-builder UI.

## Deliberate v1 simplifications

This workflow is intentionally practical, not final:

- explicit create/edit pages instead of advanced inline editing
- JSON textarea editing for complex structured rule payloads
- lightweight list-card displays instead of heavy data grids
- no autosave, collaboration, publishing automation, or rich editorial tools

## Architecture boundaries preserved

Studio pages and UI components do not perform raw DB access.

Read and write operations flow through:

- `src/data/queries/authoring/*`
- `src/data/mutations/authoring/*`
- `src/app/(studio)/studio/_actions/*`

Planner/runtime/generator logic is not introduced in Studio authoring pages.

## Why this is not a beat graph editor

Studio v1 authoring aligns to authored truth inputs for a planner-led system. It does not include:

- beat nodes
- beat trees
- branch graph wiring
- UI-owned scene graph logic

The planner and runtime prompts come later and consume these structured authoring inputs.

## Deferred to later prompts

Still intentionally out of scope:

- planner implementation and planner previews
- runtime commit orchestration
- generator integration and AI rendering controls
- publishing/version promotion workflow automation
- advanced validation and continuity enforcement UI
