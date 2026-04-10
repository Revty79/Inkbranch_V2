# 22_reader_experience_upgrade.md

## Goal
Upgrade the reader experience so Inkbranch v2 feels playable and readable, not inspectable.

## Scope
Focus on:
- `/reader/chronicles`
- `/reader/chronicles/[chronicleId]`
- `/reader/chronicles/[chronicleId]/scene`
- supporting reader UI components

## Required outcomes
1. Choices must read like actions a reader can take.
2. Reader-facing choice UI must not expose unnecessary technical/internal terminology.
3. Current scene presentation must feel immersive and product-facing.
4. Empty states and chronicle flow must help users continue reading naturally.
5. If choices are not currently actionable in the UI, make them clearly actionable using the existing architecture.

## Constraints
Do not:
- rewrite planner/runtime architecture
- move engine logic into UI
- broaden into full design-system overhaul
- expose internal IDs or technical refs to normal readers

## Verification
Run:
- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:integration
- npm run build
- npm run test:e2e

## Deliverable
Make the changes, verify them, commit them, and update `prompts/STATUS.md`.