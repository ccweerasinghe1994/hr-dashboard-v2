# TeamHub HR dashboard

TeamHub is a Bun-powered Next.js application. The organization foundation uses
PostgreSQL, Drizzle migrations, Better Auth database sessions, tenant-scoped
server data access, forced PostgreSQL row-level security, effective-dated legal
entity configuration, and atomic audit events.

## Local development

Requirements: Bun 1.3.14 and Docker.

```bash
bun install --frozen-lockfile
docker compose -f docker-compose.dev.yml up -d
cp .env.example .env.local
bun run db:migrate
bun run dev
```

Generate independent secrets before using setup:

```bash
openssl rand -base64 32
```

Use separate outputs for `BETTER_AUTH_SECRET`,
`LEGAL_IDENTIFIER_ENCRYPTION_KEY`, `TENANT_BOOTSTRAP_SECRET`, and
`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`. The legal-identifier and Server Action
keys must decode to exactly 32 bytes. Do not commit `.env.local`.

Open `http://localhost:3000/setup` once, enter
`TENANT_BOOTSTRAP_SECRET`, and create the first owner and tenant. Public signup
is disabled and `/setup` closes after the transaction commits. The first legal
entity is then created from `/settings/organization`.

Optional development fixtures create two deliberately isolated tenants:

```bash
bun run db:seed
```

The fixture owners are `owner@northwind.test` and `owner@contoso.test`. Set
`SEED_OWNER_PASSWORD` before seeding to choose their password; the local-only
default is `ChangeMe1234!`.

## Database roles and migrations

`DATABASE_URL` must use a restricted runtime role (`hr_app` in the local
compose file). It must not own the tables and must have `NOSUPERUSER` and
`NOBYPASSRLS`. `MIGRATION_DATABASE_URL` is a separate schema-owner connection
used only by deployment jobs and local migration commands.

The initial migration enables and forces RLS on every tenant-owned table,
restricts the runtime role to non-delete mutations, adds composite tenant
ownership keys, and uses GiST exclusion constraints to prevent overlapping
effective records and effective duplicate names/identifiers.

```bash
bun run db:generate  # after changing db/schema.ts; requires a DB URL for config
bun run db:migrate   # apply checked-in migrations with the migration role
```

Production migrations are a separate pre-deployment job. Do not run them from
each application replica. Create the restricted runtime role before applying
the first migration so its grants are installed.

After the one-time bootstrap, additional tenants and tenant activation changes
are system-provisioning operations with no customer-facing endpoint:

```bash
bun run system:provision-tenant
bun run system:set-tenant-status
```

The provisioning command requires `MIGRATION_DATABASE_URL`,
`PROVISION_OWNER_NAME`, `PROVISION_OWNER_EMAIL`, `PROVISION_OWNER_PASSWORD`,
`PROVISION_TENANT_NAME`, `PROVISION_TENANT_SLUG`, `PROVISION_LOCALE`,
`PROVISION_TIMEZONE`, and `PROVISION_REASON`; `PROVISION_DATA_REGION` is
optional. The status command requires `MIGRATION_DATABASE_URL`,
`TENANT_STATUS_TENANT_ID`, `TENANT_STATUS_TARGET`,
`TENANT_STATUS_EFFECTIVE_DATE`, and `TENANT_STATUS_REASON`; an optional
`TENANT_STATUS_ACTOR_USER_ID` attributes the event to a system operator.
Provisioning credentials are the authority boundary, so inject them from a
secret manager and never grant the migration URL to tenant owners.

Tenant status changes supersede rather than erase prior transaction-time rows,
append a system audit event, and clear sessions currently pointed at a tenant
when it becomes inactive. Reactivation remains system-only.

## Verification

```bash
bun run test
bun run test:e2e
bun run lint
bun run typecheck
bun run build
```

`test:e2e` requires the test PostgreSQL service and creates a fresh database
for each run. It migrates that database, builds the production application,
starts the standalone production server, runs Chromium, and removes the
database afterward:

```bash
docker compose -f docker-compose.test.yml up -d
bunx playwright install chromium
bun run test:e2e
```

For a complete human verification of setup, authentication, organization
settings, legal-entity history, tenant isolation, audit evidence, responsive
behavior, and accessibility, follow the
[organization foundation manual QA runbook](docs/manual-qa-organization-foundation.md).
The target automated suite boundaries, commands, database lifecycle, and
coverage policy are defined in the [testing strategy](docs/testing.md).

The database-backed isolation suite runs when both `TEST_ADMIN_DATABASE_URL`
and `TEST_DATABASE_URL` are set. The admin URL prepares and removes fixtures;
the runtime URL must use the restricted role. CI creates a clean PostgreSQL
database, migrates it, and verifies cross-tenant reads, writes, and composite
ownership before linting and building.

## Deployment configuration

Required runtime values are listed in `.env.example`. A multi-instance release
must also inject the same `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` while building
every image in that release. The Docker build accepts that value through the
BuildKit secret named `next_server_actions_encryption_key`; it is never passed
as a Docker build argument. The build also requires a temporary
`better_auth_secret` BuildKit secret so Next.js can evaluate the authentication
configuration without embedding a source-code fallback. The real
`BETTER_AUTH_SECRET` remains a required runtime value supplied by Portainer.

For a local image build, forward values from the current shell without placing
them in the Dockerfile or command history:

```bash
docker build \
  --secret id=next_server_actions_encryption_key,env=NEXT_SERVER_ACTIONS_ENCRYPTION_KEY \
  --secret id=better_auth_secret,env=BETTER_AUTH_SECRET \
  -t hr-dashboard-v2:local .
```

The production `docker-compose.yml` intentionally does not contain a database
or run migrations; it expects externally managed PostgreSQL and an already
migrated schema.

Tax identifiers are encrypted with AES-256-GCM using a domain-separated key,
hashed separately only for tenant-scoped uniqueness, and returned to the UI as
masked DTOs. Plaintext, ciphertext, and lookup hashes are excluded from audit
payloads and application responses.

Architectural decisions and the domain glossary live in `docs/adr/` and
`CONTEXT.md`.
