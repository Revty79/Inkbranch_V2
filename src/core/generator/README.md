# Core Generator Layer

## Owns

- Schema-first generator contracts for approved scene input and presentation-only output.
- Provider-agnostic adapter boundaries and prompt builders for scene/choice rendering requests.
- Live provider adapter implementations (currently OpenAI) behind the same adapter interface.
- Validation and fallback orchestration for structured generator results.

## Must not own

- Canon decision logic, reveal legality, ending legality, or next-scene planning.
- Runtime commit mutation logic, event append, or continuity truth projection.
- UI route orchestration or direct rendering ownership.

## Allowed examples

- Build a model prompt from planner/runtime-approved structural input.
- Return schema-validated prose and polished option text.
- Return explicit fallback presentation when generation is disabled, unavailable, times out, or fails validation.

## Forbidden examples

- Deciding what story event is canon.
- Inventing new structural choices or runtime effects.
- Updating runtime tables or planner context.

## Boundary Summary

- Input to the generator is approved and bounded (`GeneratorSceneInput`).
- Output from the generator is presentation-only (`GeneratedSceneOutput`).
- Every adapter response is validated before success is returned.
- Invalid/unavailable output returns structured fallback envelopes, not silent failures.
- Live provider configuration is server-side (`OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL`) and selected through generator service config (`GENERATOR_PROVIDER`, `GENERATOR_ENABLED`).
