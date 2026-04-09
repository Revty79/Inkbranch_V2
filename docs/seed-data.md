# Seed Data Workflow

## Command

Run the demo seed script:

```bash
npm run seed:demo
```

The script requires `DATABASE_URL` to point at your local Inkbranch database.

## What gets created

`seed:demo` upserts a coherent authored package:

- one world
- one book
- one active book version
- demo canon entries
- demo characters, locations, factions, and perspectives
- demo arc milestones, reveal rules, pacing rules, and ending rules

It also resets and bootstraps one runtime chronicle:

- deletes and recreates the demo chronicle (safe scoped reset by fixed chronicle id)
- creates two perspective runs
- initializes chronicle state
- runs planner -> runtime instantiation
- resolves one enabled structural choice
- runs planner -> runtime instantiation again

This leaves a meaningful runtime trail for Reader/Admin inspection.

## Runtime bootstrap outcome

After a successful run, you should have:

- a demo chronicle id: `d2b85a5a-fd5e-4208-8aa1-60162d083f26`
- at least two scene instances
- at least one committed choice resolution
- event log entries for instantiation/resolution/state refresh
- current scene state available for reader rendering

## How to verify quickly

1. Run lint/typecheck/tests:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test:run`
2. Run seed:
   - `npm run seed:demo`
3. Open Reader:
   - `/reader/chronicles`
   - `/reader/chronicles/d2b85a5a-fd5e-4208-8aa1-60162d083f26/scene`
4. Open Admin Inspector:
   - `/admin/chronicles`
   - `/admin/chronicles/d2b85a5a-fd5e-4208-8aa1-60162d083f26`

## Notes

- The seed is intentionally compact and deterministic (fixed ids) for easier debugging.
- Generated prose remains presentational; runtime/canon truth still comes from committed relational records.
- Seed bootstrap is integrated into `test:e2e` so demo viability remains part of routine verification.

## Related docs

- [Demo Book](demo-book.md)
- [Local Setup](local-setup.md)
- [Testing and Quality Gates](testing-and-quality-gates.md)
