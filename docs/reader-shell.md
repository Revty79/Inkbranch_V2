# Reader Shell (Prompt 12)

## Purpose

The Reader shell is the chronicle-facing UI frame for viewing committed runtime state.

It is responsible for:

- reader route structure
- chronicle list and chronicle summary presentation
- current scene and available choice presentation
- loading/empty/error route surfaces

It is not responsible for runtime commits, planning decisions, or prose generation.

## Route structure

- `/reader`
  - entry page for the reader experience
- `/reader/chronicles`
  - lists available chronicles
- `/reader/chronicles/[chronicleId]`
  - chronicle summary and projection context
- `/reader/chronicles/[chronicleId]/scene`
  - current scene frame and committed scene choices

Route-level loading and not-found/error handling are included for reader reliability.

## Data loading model

Reader routes load data through runtime query modules only:

- chronicles list and chronicle lookup
- chronicle projection state
- perspective run summaries
- current scene selection
- scene choice lookup

No raw DB client import exists in reader page/UI components.

## Reader UI composition

Reusable reader UI lives under `src/ui/reader`:

- `layout/*` for shell frame, header, and nav
- `chronicle/*` for list, cards, summary, and progress panel
- `scene/*` for scene frame, metadata, placeholder, and choice list/cards
- `shared/*` for empty/error/status/perspective helpers

Route pages stay thin and compose these components with server-side data loading.

## Boundaries and non-goals

Reader shell does not:

- run planner logic
- perform runtime commit orchestration
- call generator providers
- present beat-graph navigation

Reader shell may show structural scene placeholders when prose is absent.

## Next prompts

- `13_scene_package_rendering.md` deepens scene package presentation.
- Generator boundary/integration prompts (`14` and `15`) remain separate from reader shell concerns.
- Runtime commit pipeline remains in core/data runtime layers, outside reader UI.
