# 02_database_foundation.md

## Title
Inkbranch v2 — Database Foundation

## Objective
Establish the database foundation for Inkbranch v2 using PostgreSQL and Drizzle.

This prompt exists to create the persistence infrastructure and workflow, not the business schema.

By the end of this prompt, the repository should have:
- a clean PostgreSQL connection setup
- Drizzle ORM configured
- Drizzle Kit configured
- database client wiring
- schema entry points
- migration folder structure
- database health check support
- package scripts for database workflow
- environment variable support for local development
- documentation for how the DB foundation works

This prompt is about the persistence backbone only.

Do not implement the authoring schema yet.
Do not implement the runtime schema yet.
Do not sneak story concepts into the DB layer early.

---

## Why this prompt matters
Inkbranch v2 must be relational-first and inspectable.

That means the database layer cannot be:
- an afterthought
- a giant runtime blob wrapper
- an ad hoc set of random helper files
- mixed directly into UI code
- mixed directly into planner/runtime/generator logic

We need the DB layer to be clean before we create any real tables.

This prompt should make later prompts easy:
- `04_authoring_schema.md`
- `05_runtime_schema.md`
- `06_data_access_boundaries.md`

---

## Rebuild principles to protect
Inkbranch v2 is:
- relational-first
- planner-first
- runtime-inspectable
- book-bible-driven
- generator-on-rails

This database foundation must support:
- explicit relational schema
- inspectable runtime state
- append-oriented event history
- clean separation of schema, queries, and mutations

It must not encourage:
- giant JSON blobs as primary truth
- DB access inside UI components
- accidental domain logic inside persistence setup
- runtime state hidden in opaque structures

---

## Non-negotiable rules
1. Do not implement business tables yet except only the smallest non-domain support artifact if absolutely required.
2. Do not implement authoring tables in this prompt.
3. Do not implement runtime tables in this prompt.
4. Do not put engine logic in database files.
5. Do not put UI logic in database files.
6. Do not create a giant all-in-one DB file.
7. Do not hardcode database credentials into committed example files.
8. The local dev database target for this repo must match the provided setup.
9. The repo must be ready for code-first Drizzle migrations after this prompt.
10. Keep the DB foundation small, explicit, and composable.

---

## Local development database target
For local development, use this PostgreSQL database setup:

- database name: `inkbranch_dev`
- database owner / user: `inkbranch_app`
- password: `Darkness1@`

Use these values for the developer-local connection flow.

Important:
- do not commit the real password into `.env.example`
- do not expose DB secrets to client code
- do not create any `NEXT_PUBLIC_` variable for database access

The committed `.env.example` should use placeholders only.

The local non-committed env flow should be designed to support a real value like:

`DATABASE_URL=postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev`

Note:
- use proper URL encoding where needed in documentation/examples when representing the password inside a URL string
- keep actual secrets out of committed example files

---

## Scope
You should implement:
- Drizzle ORM installation/config normalization
- PostgreSQL driver wiring
- `drizzle.config.ts`
- DB client and connection helper modules
- schema entry point modules
- migration directory setup
- a tiny DB health-check path or script
- DB-related package scripts
- environment structure for DB usage
- DB foundation documentation

You should also:
- inspect existing repo config before changing it
- preserve compatible existing setup where reasonable
- normalize conflicting DB scaffolding if needed
- log meaningful changes in STATUS

---

## Out of scope
Do not implement:
- worlds table
- books table
- book_versions table
- canon_entries table
- characters table
- locations table
- factions table
- perspectives table
- arc_milestones table
- reveal_rules table
- pacing_rules table
- ending_rules table
- chronicles table
- chronicle_states table
- perspective_runs table
- scene_instances table
- scene_choices table
- choice_resolutions table
- knowledge_state table
- event_log table
- canon_commits table
- auth tables
- production deployment config
- advanced connection pooling strategy beyond a sane local baseline
- domain logic in the data layer

Those come later.

---

## Required end state
By the end of this prompt, the repo should have:
- a clean Drizzle + PostgreSQL foundation
- a clearly named DB client entry point
- a clearly named schema entry point
- a migration folder ready for later schema work
- scripts for DB workflow
- a DB health verification path
- documentation that tells future prompts how to use the DB layer correctly

The database layer should be ready, but still mostly empty of business schema.

---

## Existing repo handling
Before changing anything, inspect the repo for:
- `package.json`
- existing DB packages
- `drizzle.config.*`
- `src/data/db/*`
- `src/data/schema/*`
- old Prisma/ORM remnants if any
- existing env usage
- old scripts in `package.json`

Use this decision model:
- keep compatible setup
- normalize conflicting setup
- remove or isolate obsolete DB tooling only if it conflicts with the rebuild
- do not preserve old persistence architecture if it pushes the repo back toward the messy version

Log any meaningful removals or structural replacements in STATUS.

---

## Database architecture intent

### `src/data/db`
Owns:
- database client creation
- connection config
- small health-check helpers
- driver-level wiring

Must not own:
- domain logic
- planner logic
- runtime commit logic
- UI logic
- broad query logic
- broad mutation logic

### `src/data/schema`
Owns:
- schema entry points
- future table definitions
- future relation definitions
- migration-facing exports

Must not own:
- business behavior
- runtime mutation orchestration
- planner decisions

### `src/data/queries`
Will later own read-side access patterns.

Do not implement real queries yet.

### `src/data/mutations`
Will later own command-side persistence operations.

Do not implement real mutations yet.

### `src/data/mappers`
Will later own mapping between DB rows and domain-safe shapes where needed.

Do not overbuild this yet.

---

## Required implementation tasks

### Task 1 — inspect current persistence and package state
Review the current repo and determine:
- whether Drizzle is already installed
- whether `pg` is already installed
- whether any conflicting ORM tooling exists
- whether scripts already exist for DB tasks
- whether env handling already supports server-only variables

Document meaningful changes in STATUS later.

### Task 2 — install or normalize DB packages
Ensure the project has the correct minimal DB packages for this stage.

Expected core packages:
- `drizzle-orm`
- `drizzle-kit`
- `pg`

Add TypeScript support packages only if actually required by the repo setup.

Do not add extra database libraries “just in case.”

Do not add Prisma.
Do not add another ORM.
Do not add a query builder separate from Drizzle.

### Task 3 — create Drizzle config
Create or normalize:
- `drizzle.config.ts`

This config should:
- point at the schema entry point location under `src/data/schema`
- point migration output to a dedicated folder such as `drizzle/`
- use PostgreSQL dialect
- load the database URL from environment variables
- remain clean and readable
- support the later `generate`, `migrate`, and `studio` workflow

Do not jam multiple environments into a giant complicated config.
Keep it simple for local development first.

### Task 4 — create DB client structure
Create or normalize a clean DB foundation under `src/data/db`.

Recommended file shape:

```text
src/data/db/
  client.ts
  config.ts
  health.ts
  index.ts
config.ts

Should centralize database env access for the DB layer only.

It may:

read DATABASE_URL
provide a small helper or exported constant
fail clearly if the variable is missing where appropriate

It must not:

expose DB secrets to client code
become a giant env abstraction framework
client.ts

Should initialize the Drizzle database client using PostgreSQL.

Keep it minimal and server-only.

health.ts

Should provide a small health-check function that can verify the DB is reachable.
A simple query like select 1 is enough.

index.ts

Should export the DB client and minimal DB helpers cleanly.

Do not combine all logic into one file.

Task 5 — create schema entry point structure

Create or normalize a clean schema area under src/data/schema.

Recommended file shape for now:

src/data/schema/
  index.ts
  README.md

index.ts should be the future schema aggregation point.

At this stage:

keep it intentionally minimal
include comments or tiny placeholders describing what will arrive in later prompts
do not add speculative business tables

README.md should explain:

that authoring schema comes in 04
that runtime schema comes in 05
that this folder is the canonical schema definition root for Drizzle
Task 6 — create migration directory structure

Create or normalize the migration output area, such as:

drizzle/

If Drizzle expects to create files here later, make sure the folder path is ready and documented.

You may add a small README in the migration directory if useful, but keep it minimal.

Do not generate speculative migrations for business tables yet.

Task 7 — add DB package scripts

Inspect package.json and add or normalize scripts related to the database foundation.

Expected script intent:

db:generate → generate migrations from schema
db:migrate → apply generated migrations
db:studio → launch Drizzle Studio
db:check or equivalent → run the DB health check
optionally db:push only if you intentionally want it available, but do not make it the primary workflow

Preferred workflow doctrine for this repo:

code-first schema
generate migrations
apply migrations
inspect DB

Do not make schema drift invisible.

Do not rely on ad hoc raw SQL shell steps as the core workflow.

Task 8 — normalize env support for DB usage

Ensure the repo’s env structure supports database usage cleanly.

Requirements:

.env.example should contain DATABASE_URL as a placeholder only
real credentials must not be committed into .env.example
local usage should support the provided dev target values
any env helper under src/lib/env should remain server-safe and minimal

Recommended .env.example line:

DATABASE_URL=postgresql://inkbranch_app:your_password_here@localhost:5432/inkbranch_dev

Do not commit Darkness1@ into .env.example.

You may mention the actual local value in documentation comments if truly necessary, but prefer not to commit the raw secret unless the user explicitly wants that in the repo.

Task 9 — create DB health verification path

Provide a simple way to confirm the DB connection works.

Choose one clean approach, for example:

a small script callable by npm run db:check
or a tiny internal executable module

This health check should:

verify that the DB connection is reachable
fail clearly if DATABASE_URL is missing
fail clearly if PostgreSQL rejects the connection
not expose secrets in logs

Do not create an app route for this.
Do not create a public health endpoint.
This is developer validation, not product functionality.

Task 10 — add DB foundation documentation

Create:

docs/database-foundation.md

This doc should explain:

what packages are used
where DB config lives
where schema definitions live
where migrations live
how local env should be configured
the preferred migration workflow
what later prompts are responsible for
what this prompt intentionally does not do yet

It should also clearly state:

authoring schema arrives in 04_authoring_schema.md
runtime schema arrives in 05_runtime_schema.md
Task 11 — verify the DB foundation

Run the appropriate commands to verify the DB foundation works.

At minimum, verify as appropriate:

install succeeds if packages were added
lint still passes
typecheck still passes
DB health check works against the local database
scripts resolve correctly
the scaffold remains stable

Do not leave the repo in a “config exists but can’t actually connect” state if the local DB is available.

If the connection fails due to a wrong config, fix it.
If the connection fails because the local DB truly is unavailable, log the exact blocker and do not mark the prompt complete.

Task 12 — update STATUS

Update /prompts/STATUS.md only after all work and verification are done.

Required files to create or normalize

You may create or update the following as needed:

DB config and wiring
drizzle.config.ts
src/data/db/config.ts
src/data/db/client.ts
src/data/db/health.ts
src/data/db/index.ts
Schema root
src/data/schema/index.ts
src/data/schema/README.md
Documentation
docs/database-foundation.md
Optional tiny helper or script support
any small script file needed for db:check
Package and env files
package.json
.env.example

You may add other small support files only when directly required by this prompt.

Do not add product logic.

Local DB assumptions for this prompt

Assume local PostgreSQL is intended to be reachable at:

host: localhost
port: 5432
database: inkbranch_dev
username: inkbranch_app

For the real local environment, the provided password is:

Darkness1@

Do not place that real password in .env.example.

If a local .env or .env.local file is part of the developer workflow and is not committed, it may use the actual value.

Use URL-safe formatting where needed for connection strings.

Safe handling of credentials

Important:

avoid printing the raw connection string in logs
avoid echoing the password in scripts
fail with clean error messages
keep all DB secrets server-side only
do not leak DATABASE_URL into browser-exposed code
Suggested file behavior
src/data/db/config.ts

Should expose a small, explicit DB config surface.

Good:

one function or exported constant for DATABASE_URL
clear missing-env error
server-only posture

Bad:

giant config registry
loading half the app config here
exposing secrets broadly
src/data/db/client.ts

Should create the PostgreSQL client and Drizzle wrapper.

Good:

minimal setup
clearly named export
readable code

Bad:

embedding schema logic here
embedding query logic here
embedding retry frameworks here
src/data/db/health.ts

Should provide a tiny health check.

Good:

returns simple success/failure result
uses a minimal query
safe logs

Bad:

public HTTP route
noisy credential output
app-level UI coupling
src/data/schema/index.ts

Should be a clean future aggregation point.

Good:

minimal placeholder export/comments
obvious future home for tables

Bad:

giant speculative schema dump
authoring/runtime tables added early
Package script guidance

Expected scripts should follow a clean pattern.

Example intent:

db:generate for generating SQL migrations from Drizzle schema
db:migrate for applying migrations
db:studio for opening Drizzle Studio
db:check for validating local DB connectivity

Keep script names obvious.
Do not create script clutter.

Documentation guidance for docs/database-foundation.md

This doc should explicitly answer:

Why Drizzle?
Where is the DB client?
Where is the schema root?
Where will migrations go?
How should local env be configured?
What commands should developers run?
What comes in prompt 04?
What comes in prompt 05?

It should also explain the philosophy:

relational-first
inspectable runtime later
schema first, then queries/mutations, then higher logic
Acceptance criteria

This prompt is complete only if all of the following are true:

Drizzle ORM is installed or normalized correctly.
PostgreSQL driver support is installed or normalized correctly.
drizzle.config.ts exists and is wired to the schema root and migration folder.
src/data/db contains a clean minimal client/config foundation.
src/data/schema/index.ts exists as the canonical schema entry point.
src/data/schema/README.md exists and explains future schema ownership.
package scripts exist for DB workflow, including a DB health check.
.env.example contains a placeholder DATABASE_URL and does not contain the real password.
a DB health check runs cleanly against the intended local setup, or a real blocker is logged.
lint and typecheck still pass.
no authoring or runtime business tables were implemented yet.
the repo is cleanly ready for 04_authoring_schema.md and 05_runtime_schema.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

dependency install succeeds if packages were added
lint passes
typecheck passes
DB health check passes against the configured local DB
package scripts resolve
no accidental business schema was introduced

If verification fails:

fix the issue
rerun verification
only then mark complete

If the DB itself is genuinely unreachable:

log the exact blocker
do not mark complete
STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 02_database_foundation.md

To:

 02_database_foundation.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 02_database_foundation.md
Status: completed
Summary:
configured PostgreSQL + Drizzle foundation for Inkbranch v2
added clean DB client, config, schema root, and migration wiring
added DB workflow scripts and local connectivity verification
documented DB foundation and deferred business schema to later prompts
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note that authoring schema is intentionally deferred to 04
note that runtime schema is intentionally deferred to 05
note any local DB assumptions or credential-handling caveats

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if the repo gains a clean, verified database backbone.

It fails if you start building the actual application schema too early.

One strong callout: I intentionally kept `02` focused on the DB spine, not the real tables. That keeps `04` and `05` meaningful instead of turning `02` into a giant speculative schema dump.

Next up after this should be `03_domain_contracts.md`, unless you want me to write `04_authoring_schema.md` immediately while the database shape is fresh.
::contentReference[oaicite:1]{index=1}