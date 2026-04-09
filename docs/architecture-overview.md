# Architecture Overview

## Product direction

Inkbranch v2 is a planner-led, book-first, world-first interactive fiction platform.

## Top-level layers

- `src/app`: Route entry points, layouts, and request orchestration.
- `src/core`: Domain, planner, runtime, generator, and validation contracts and services.
- `src/data`: Database integration, schema entry points, queries, mutations, and mappers.
- `src/ui`: Presentational components only.
- `src/lib`: Small shared constants and environment helpers.

## Core loop

book bible -> planner -> scene package -> reader decision -> runtime state update -> next scene package

## Boundary intent

- Planner validity checks live in `core/planner`.
- Runtime state transitions and projections live in `core/runtime` with data persistence in `data`.
- Generator output is presentation-oriented and never treated as canonical truth.
- UI renders and collects input, but does not decide validity.
