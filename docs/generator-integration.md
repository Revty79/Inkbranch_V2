# Generator Integration

## Purpose

Prompt `15_generator_integration.md` wires a real provider behind the generator boundary from prompt `14`.

The integration keeps Inkbranch architecture intact:

- planner owns structural validity
- runtime owns committed truth
- generator owns presentation only

## Integrated Provider

The current live provider adapter is:

- OpenAI (`src/core/generator/adapters/openai.ts`)

It is isolated behind `SceneGenerationAdapter` so the rest of the app remains provider-agnostic.

## Server-Side Configuration

Generation config is read from server env:

- `GENERATOR_ENABLED` (`true`/`false`)
- `GENERATOR_PROVIDER` (`mock` or `openai`)
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default: `gpt-5.4-mini`)
- `OPENAI_BASE_URL` (default: `https://api.openai.com/v1`)

If `GENERATOR_PROVIDER=openai` but `OPENAI_API_KEY` is missing, the configured adapter returns structured provider-unavailable failure, and orchestration falls back safely.

## Integration Flow

1. Reader scene route builds structural scene presentation from runtime records.
2. If committed prose is absent, runtime scene data is mapped into `GeneratorSceneInput`.
3. Configured generator service selects adapter by env (`mock` or `openai`).
4. Adapter executes server-side generation request.
5. Generator output is schema-validated.
6. On success: generated prose/choice wording overlays reader presentation.
7. On failure/invalid output: explicit fallback presentation is used.

No runtime tables are mutated by generator integration.

## Structured Generation

OpenAI adapter requests structured JSON output and returns parsed payload only.

The generator service then enforces validation:

- required prose
- approved choice-key alignment
- non-empty choice labels
- bounded optional metadata fields

Invalid outputs do not pass through as trusted presentation.

## Fallback Behavior

Fallback remains first-class for:

- generation disabled
- provider unavailable
- adapter failure
- timeout
- invalid output

Fallback output is explicit and presentation-safe.

## Boundaries Preserved

This prompt intentionally does not:

- move planning logic into prompts/models
- mutate runtime truth from generator code
- expose provider calls in UI components
- expose provider secrets to client code

Provider integration is server-only and boundary-constrained.

## Future Refinement

Potential future improvements (outside this prompt):

- provider retry/backoff policy tuning
- richer prompt variants by scene type
- deeper provider observability and admin inspection
- multi-provider routing strategy
