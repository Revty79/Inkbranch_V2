# Admin Inspector

## Purpose

The Admin Inspector is a read-only observability surface for Inkbranch v2 runtime behavior.

It is designed to answer:

- what scenes were instantiated
- what choices were presented and resolved
- what events were appended
- what knowledge and canon commits currently exist
- what generation markers are present

It is not a runtime/planner/generator mutation console.

## Route Map

- `/admin` : inspector overview
- `/admin/chronicles` : chronicle list
- `/admin/chronicles/[chronicleId]` : chronicle summary hub
- `/admin/chronicles/[chronicleId]/state` : chronicle state projection + perspective runs
- `/admin/chronicles/[chronicleId]/scenes` : scene instance list
- `/admin/chronicles/[chronicleId]/scenes/[sceneInstanceId]` : scene detail + choices + resolutions
- `/admin/chronicles/[chronicleId]/events` : event log
- `/admin/chronicles/[chronicleId]/knowledge` : knowledge state
- `/admin/chronicles/[chronicleId]/commits` : canon commits
- `/admin/chronicles/[chronicleId]/generation` : generation/result markers

## Architecture Posture

The inspector mirrors system boundaries:

- planner determines structure (inspected via scene/planner payload consequences)
- runtime commits truth (inspected via state, events, knowledge, commits)
- generator provides presentation (inspected via rendered prose/payload markers)

Admin routes are thin and read-oriented.
Data is loaded through query modules and mapped into reusable UI components.

## UI Composition

Reusable inspector UI components live under `src/ui/admin`:

- layout shell/header/nav
- chronicle summary/state/run views
- scene/choice/resolution views
- event/knowledge/commit views
- generation summary/fallback views
- shared empty/error/status/meta-table components

## Read-Only Guarantee

This prompt intentionally excludes:

- runtime edit/delete/reset controls
- planner overrides
- generator rerun overrides
- DB-console-style mutation tooling

Inspection surfaces render committed truth and payload detail without mutating system state.

## Current Limits

- Payload detail is available primarily via expandable JSON blocks after summary fields.
- Generation inspection focuses on runtime markers (`renderedProse`, `generatorPayload`) and does not include prompt-lab functionality.
- Admin remains intentionally read-only and does not expose runtime/planner/generator mutation controls.
