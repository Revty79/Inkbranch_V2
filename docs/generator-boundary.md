# Generator Boundary

## Purpose

Inkbranch v2 treats generation as a constrained presentation layer.

The planner decides structural validity.
The runtime commits continuity truth.
The generator renders approved structure into reader-facing text.

## Ownership

The generator layer owns:

- approved generation input contracts
- presentation output contracts
- provider-agnostic adapter interfaces
- prompt builders for scene prose and choice wording
- output validation and explicit fallback envelopes

The generator layer does not own:

- next-scene planning
- reveal legality decisions
- ending legality decisions
- runtime mutation or canon commits
- UI routing logic

## Input Model

`GeneratorSceneInput` contains only approved data needed for rendering:

- scene identity and structural shape (`sceneKind`, `sceneGoal`, `plannerCycle`)
- perspective framing
- approved constraints and continuity facts
- approved reveal usage for presentation
- approved structural choices
- safe fallback body copy

No open-ended authority is passed to the model.

## Output Model

The adapter returns structured payload candidate data:

- `prose` (required)
- `choices` (required, keyed to approved choice keys)
- optional `summary`
- optional `presentationNotes`

The generator service validates this payload and only then emits `GeneratedSceneOutput`.

`GeneratedSceneOutput` is presentation-only and includes:

- generated or fallback mode
- prose/summary/choices for display
- request/scene metadata for traceability

## Validation

`validateGeneratedSceneOutput` enforces:

- required object shape
- non-empty prose
- approved choice-key alignment (missing/unexpected keys fail validation)
- non-empty choice labels
- optional note/summary shape correctness

If validation fails, the service returns a fallback result envelope.

## Fallback

Fallback is a first-class result path.

Fallback is used for:

- generation disabled
- provider unavailable
- adapter failure
- timeout
- invalid output shape/content

Fallback output is explicit (`mode: "fallback"`) and includes reason notes.
It does not pretend generated prose succeeded.

## Service Boundary

`createGeneratorSceneService` is the orchestration boundary:

1. receives approved generator input
2. builds constrained prompts
3. calls a provider-agnostic adapter
4. validates output
5. returns success/failure/fallback envelope

The service does not mutate runtime truth or planner state.

## Prompt Discipline

Prompt builders explicitly instruct that:

- structure is already decided
- legality is already decided
- canon and effects must not be invented
- response must match the schema

This keeps prompts as rendering instructions, not story logic authority.

## Provider Strategy

Boundary remains provider-agnostic.
Live provider wiring is implemented in [Generator Integration](generator-integration.md).
