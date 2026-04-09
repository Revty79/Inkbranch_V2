# Runtime Commit Pipeline (Prompt 11)

## Purpose

The runtime commit pipeline turns planner-approved structure and reader decisions into committed, inspectable runtime truth.

It keeps these phases explicit:

1. Scene instantiation
2. Choice resolution
3. Event append and projection refresh

This avoids collapsing runtime truth into a node pointer or an opaque blob.

## Entry points

- Core orchestration: `src/core/runtime/services/runtime-commit-pipeline.ts`
- DB-backed adapter: `src/data/mutations/runtime/runtime-commit-pipeline.ts`

The core layer is persistence-agnostic and uses the `RuntimeCommitStore` port.

## Phase A: Scene instantiation

Input:

- `chronicleId`
- `perspectiveRunId`
- planner scene package and diagnostics

Writes:

- `scene_instances`
- `scene_choices`
- `event_log` entries:
  - `scene_instantiated`
  - `scene_choices_created`
  - `perspective_run_updated`
  - `chronicle_state_refreshed`
- projection updates:
  - `perspective_runs` (`entry_count`, `last_scene_instance_id`)
  - `chronicle_states` (`current_scene_instance_id`, `current_perspective_id`, summary metadata)

## Phase B: Choice resolution

Input:

- `chronicleId`
- `sceneInstanceId`
- `sceneChoiceId`

Validation:

- scene instance exists and belongs to chronicle
- selected choice exists, belongs to scene, and is enabled

Writes:

- `choice_resolutions`
- `scene_instances.status` becomes `resolved`
- `event_log` entries:
  - `choice_resolved`
  - `knowledge_state_updated` (per update)
  - `canon_commit_created` (per commit)
  - `perspective_run_updated`
  - `chronicle_state_refreshed`

Downstream runtime updates from structural effect hints:

- `knowledge_state` upserts
- `canon_commits` inserts
- `perspective_runs` knowledge/progression metadata
- `chronicle_states` progress and summary projection

## Effect mapping (MVP)

`ChoiceEffectHint[]` is mapped deterministically into:

- knowledge effects
- canon commit effects
- projection hints (`progressDelta`, `endingLocked`, milestone/reveal summary keys)

No prose is used in effect inference.

## Event model

Event names are explicit and stable:

- `scene_instantiated`
- `scene_choices_created`
- `choice_resolved`
- `knowledge_state_updated`
- `canon_commit_created`
- `chronicle_state_refreshed`
- `perspective_run_updated`

## What this prompt intentionally does not include

- reader route/UI submission flow (prompt 12)
- prose generation or model/provider calls
- planner algorithm implementation (prompt 10 already handles planning)
- admin observability UI (later prompt)

## Architectural guarantees

- Runtime truth is relational and inspectable.
- Event history is append-oriented.
- Current-state projections remain separate from event history.
- Runtime core does not import UI or raw DB code.
- Generator output is not treated as canon truth.
