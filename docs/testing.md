# Automated testing strategy

This document defines the target automated testing architecture. The repository
currently has explicit Bun unit and PostgreSQL integration commands in the
layered layout below. The coverage gate and Playwright suite remain later
implementation milestones, not current capabilities.

## Test behavior at the boundary that owns it

| Layer | Runner | Owns | Must not claim |
| --- | --- | --- | --- |
| Unit | `bun:test` | Pure validation, normalization, policy, mapping, and cryptographic invariants | PostgreSQL, Better Auth, or Next.js integration correctness |
| Integration | `bun:test` plus real PostgreSQL | Drizzle persistence, transactions, RLS, grants, constraints, concurrency, and audit atomicity | Browser, cookie, redirect, or rendered-page behavior |
| End to end | Playwright plus a production Next.js build | Authentication journeys, cookies, Server Actions, redirects, async Server Components, and critical UI flows | Exhaustive domain decision tables |

Async Server Components and Server Actions are not unit-rendered. Next.js
request context, redirect sentinels, revalidation, and authentication cookies
are covered through Playwright. Drizzle's fluent query API and PostgreSQL row
security are not mocked.

React Testing Library and a DOM emulator are deferred. Add component tests only
when a client component develops meaningful behavior that is expensive or
awkward to cover through the browser.

## Target layout and commands

```text
tests/
├── unit/
│   └── *.test.ts
├── integration/
│   └── *.test.ts
├── e2e/
│   └── *.spec.ts
├── fixtures/
└── support/
```

The current commands are:

```text
bun test / test   Database-free Bun unit suite
test:unit         Explicit alias for the database-free Bun unit suite
test:integration  Bun integration suite; fails when test DB URLs are missing
```

The default `bunfig.toml` limits Bun's test discovery to `tests/unit`.
`test:integration` selects `bunfig.integration.toml` so database-backed tests
must be requested explicitly.

The planned package scripts for later milestones are:

```text
test:e2e          Playwright against the production build
test:coverage     Unit coverage report and threshold gate
test:all          Unit, integration, and E2E suites
```

Local development uses `test:unit` for rapid feedback and calls the slower
layers explicitly. CI calls every required layer explicitly; a missing database
URL or skipped required suite is a failure, never a green build.

## Unit seams and first milestone

Small behavior-preserving refactors may extract pure policy modules. Production
code should not expose helpers only for tests, and test code should prefer
explicit inputs over global mocks.

Implement these suites in order:

1. **Organization validation:** schema boundaries, trimming, case
   normalization, canonical locale, timezone, optional defaults, ISO-shaped
   codes, dates, and UUIDs.
2. **Legal identifiers:** normalization, masking, encryption round-trip,
   randomized ciphertext, deterministic keyed lookup hash, last-four handling,
   unsupported versions, and tamper rejection.
3. **Tenant selection:** requested active membership, sole-membership fallback,
   multiple/no active memberships, inactive tenants, and owner/member policy.
4. **Effective periods:** inclusive start, exclusive end, current selection,
   interval split, correction, deactivation, and reactivation using fixed ISO
   dates.
5. **Boundary mapping:** FormData string extraction, expected database conflict
   codes, nested causes, malformed errors, and safe audit snapshots.

Do not test trivial constructors, framework internals, or private method call
order. Effective-date policies accept an explicit `asOfDate` or `Clock`; tests
do not globally fake the JavaScript clock.

## PostgreSQL integration milestone

The first integration milestone covers the complete organization foundation:

- Apply migrations to an empty database and apply them a second time safely.
- Verify every tenant-owned table fails closed with missing or wrong context.
- Verify the runtime role cannot bypass RLS or delete protected business and
  audit records.
- Prove bootstrap is atomic and succeeds only once, including concurrent
  attempts.
- Prove tenant settings and their audit event commit or roll back together.
- Exercise legal-entity creation, future/backdated changes, correction,
  deactivation, reactivation, stale writes, and concurrency.
- Verify half-open intervals and tenant/date-scoped name, registration, and tax
  uniqueness.
- Verify duplicates remain legal across tenants.
- Verify DTOs mask tax identifiers and audit payloads never contain plaintext.

Each CI job receives one freshly created disposable database. Migrations run
once before the suite. Integration files remain serial until each worker can
receive an isolated database. Suites generate unique UUIDs and names, perform
best-effort cleanup before setup, and clean up again during teardown so an
interrupted run does not poison the next one.

`TEST_ADMIN_DATABASE_URL` prepares and removes fixtures. `TEST_DATABASE_URL`
must use the restricted runtime role. Neither URL may target a developer or
production database.

## Playwright milestone

The initial CI suite runs Chromium serially against `next build` plus the
production server and covers:

- First-system setup and automatic sign-in
- Sign-out, sign-in, and session persistence
- Organization-settings update
- Legal-entity create, change, correction, deactivate, and reactivate journey
- Cross-tenant URL rejection without information disclosure
- One 375px mobile navigation and form smoke test
- Role, accessible-name, label, and user-visible error assertions

Playwright test support provisions the disposable database directly. The app
must not gain reset endpoints, authentication bypasses, hard-coded credentials,
or `NODE_ENV` security exceptions. CI retains traces and screenshots only for
failed tests. Firefox and WebKit can be added to a scheduled matrix after the
Chromium suite is stable.

## Mocking policy

- Do not mock Drizzle, PostgreSQL, RLS, Better Auth sessions, Next redirects,
  or Server Actions to claim integration correctness.
- Prefer pure modules and dependency injection to `mock.module`.
- Pass dates, keys, and controllable external dependencies explicitly.
- Use spies only for external side effects that cannot be observed safely at a
  real boundary.
- If a Bun module mock is unavoidable, isolate the test because module mocks
  remain affected by the process module cache.

Modules marked `server-only` stay server-only. Extract pure cryptographic or
policy cores into environment-independent modules instead of globally mocking
the `server-only` guard.

## Coverage and CI gates

Bun coverage includes loaded modules, so an apparently high whole-repository
percentage can omit untouched files. Coverage initially targets the explicit
pure modules imported by the unit suites, not pages, generated code, migrations,
or thin framework wrappers.

After recording the first complete baseline, enable these starting gates:

- Lines: 85%
- Functions: 85%
- Statements: 80%

Thresholds may ratchet upward and must not be reduced to make a build pass.
Decision-table coverage for security and effective dating is more important
than maximizing a global percentage. CI publishes text and LCOV reports.

Operational targets:

- Unit suite: under 2 seconds
- Integration suite: under 60 seconds
- E2E suite: under 3 minutes
- Required suites may not silently skip
- Security-sensitive integration tests remain serial

The complete human workflow remains in
[the organization foundation manual QA runbook](manual-qa-organization-foundation.md).
