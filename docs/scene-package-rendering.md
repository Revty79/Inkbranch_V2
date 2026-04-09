# Scene Package Rendering (Prompt 13)

## Purpose

Scene package rendering transforms committed runtime scene data into a reader-facing presentation model before generator-driven prose is integrated.

This layer makes committed scenes readable even when generated prose is missing.

## Ownership

Rendering owns:

- runtime-to-reader scene mapping
- prose vs fallback body precedence
- scene composition components (header, body, meta, choices)
- reader-safe degraded states

Rendering does not own:

- planner algorithms
- runtime commit logic
- generator/provider calls
- canon truth decisions

## Mapping layer

`src/data/mappers/reader-scene.ts` builds a presentation-safe model:

- scene context (`sceneId`, `sceneKind`, `sceneGoal`, `plannerCycle`, status)
- perspective context (`perspectiveId`, optional display name)
- body model (`prose` or structural `fallback`)
- normalized choice presentation (`label`, intent label, availability)
- lightweight scene meta (`progressIndex`, ending lock, enabled/disabled counts)

Raw runtime payload blobs are not rendered as the main scene body.

## Body rendering precedence

Body rendering follows explicit order:

1. Use committed `renderedProse` when meaningful.
2. Otherwise render structural fallback body derived from safe scene context.
3. Route-level empty states handle no-scene/no-content conditions.

Fallback body is intentionally honest and structural, not fabricated AI prose.

## Scene composition

Reader scene composition is modular in `src/ui/reader/scene`:

- `SceneFrame` for top-level composition
- `SceneHeader` for scene + perspective framing
- `SceneBody` for prose/fallback selection
- `SceneFallbackBody` for structural fallback narrative blocks
- `SceneMeta` for secondary contextual metadata
- `ChoiceList` and `ChoiceCard` for choice rendering

## Route usage

`/reader/chronicles/[chronicleId]/scene` remains thin:

- load committed runtime scene + choices via data queries
- map into presentation shape via `mapRuntimeSceneForReader`
- render through reusable scene components

No runtime commit or generator logic is embedded in the route.

## Testing

Rendering-focused tests cover:

- prose rendering precedence when prose exists
- fallback rendering when prose is absent
- enabled/disabled choice presentation mapping
- reader component rendering for key scene/summary states

## Next steps

- `14_generator_boundary.md` defines generator contracts and validation rails.
- `15_generator_integration.md` adds AI generation behind those boundaries.
- Runtime truth and planner validity remain in their respective layers.
