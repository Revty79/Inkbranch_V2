# Runtime Schema

## Purpose

The runtime schema records what actually happened during a chronicle run.

## Runtime plane tables

- `chronicles`
- `chronicle_states`
- `perspective_runs`
- `scene_instances`
- `scene_choices`
- `choice_resolutions`
- `knowledge_state`
- `event_log`
- `canon_commits`

## Why projection and history are separate

- `chronicle_states` is a current-state projection for fast inspection and resume behavior.
- `event_log`, scene records, choice resolutions, knowledge entries, and canon commits preserve inspectable history.
- The projection is not the only source of runtime truth.

## Why scene/choice/resolution are separate

- `scene_instances` records committed scene packages.
- `scene_choices` records options presented for each scene.
- `choice_resolutions` records selected/resolved outcomes.

This separation keeps continuity auditable and avoids collapsing runtime into opaque blobs.

## Why canon commits exist

`canon_commits` stores run-specific truth commitments explicitly so canon effects are inspectable and traceable back to runtime events.

## JSON usage policy

`jsonb` is bounded to payload snapshots/config details (`planner_payload_json`, `generator_payload_json`, `resolution_payload_json`, etc.).
Primary runtime facts remain relational.

## Deferred to prompt 06

Queries, mutations, and repository/data-access boundaries are intentionally deferred to `06_data_access_boundaries.md`.
