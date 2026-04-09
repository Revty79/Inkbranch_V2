# Core Domain Layer

## Owns

- Canonical domain contracts for authored truth.
- Value object definitions used across planner/runtime/generator boundaries.
- Cross-cutting domain rules that are independent of frameworks.

## Must not own

- React components or route logic.
- Database driver setup or query orchestration.
- Generator provider integrations.

## Allowed examples

- World/book/version contract types.
- Perspective, arc, reveal, pacing, and ending contract definitions.
- Pure domain rule signatures.

## Forbidden examples

- Next.js page logic.
- SQL adapter wiring.
- AI API client calls.
