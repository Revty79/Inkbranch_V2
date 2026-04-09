# Rebuild Principles

## Purpose

Inkbranch v2 is a full rebuild, not a refactor of legacy Inkbranch architecture.

## Non-negotiable principles

1. Planner-first progression. The planner decides which scene packages and choices are valid.
2. Relational-first runtime. Runtime truth must remain inspectable and reconstructable from relational state and events.
3. Generator-on-rails. The generator renders approved structure into prose and structured option text, but does not decide canon truth.
4. Boundary clarity. App, core, data, and ui layers remain separate to prevent architecture drift.
5. No beat-graph-first core. The legacy beat-graph pattern is intentionally rejected as the central model.

## Rejected rebuild direction

- Re-creating hand-authored beat trees as the primary progression model.
- Letting generated prose become canon truth.
- Collapsing runtime, planner, and UI behavior into the same modules.
