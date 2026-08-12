# Organization foundation manual QA runbook

Use this runbook to verify the organization foundation against a disposable
`hr_dashboard_qa` database. It covers setup, authentication, organization
settings, legal entities, effective-dated history, tenant isolation, audit
evidence, responsive behavior, and accessibility.

```mermaid
flowchart LR
    Setup["Fresh system setup"] --> Auth["Authentication"]
    Auth --> Org["Organization settings"]
    Org --> Entity["Legal entities"]
    Entity --> History["History and corrections"]
    History --> Security["Tenant isolation"]
    Security --> Evidence["Database and audit evidence"]
    Evidence --> Regression["Responsive and regression checks"]
```

## How to record results

Mark every test with one of these results:

- [ ] Pass
- [ ] Fail
- [ ] Observation
- [ ] Not tested

For a failure, capture:

- Test ID and Git commit
- Browser, viewport, and URL
- Exact reproduction steps
- Expected and actual results
- Screenshot or recording
- Browser console errors
- Application terminal output with secrets removed

Use these severity levels:

- **P0:** Tenant-data exposure, credential exposure, plaintext tax-identifier
  exposure, or data corruption
- **P1:** Setup, sign-in, or a primary create/update flow is unusable
- **P2:** Validation, history, audit, authorization, or error-handling defect
- **P3:** Visual, copy, spacing, or minor accessibility defect

## 1. Prepare an isolated QA environment

These instructions use PowerShell and the local PostgreSQL container. The
disposable database is separate from the normal `hr_dashboard` database.

### 1.1 Start PostgreSQL

```powershell
docker compose -f docker-compose.dev.yml up -d
docker inspect -f "{{.State.Status}} {{.State.Health.Status}}" hr-dashboard-postgres
```

Expected: `running healthy`.

### 1.2 Recreate only the disposable database

> Warning: The first command deletes `hr_dashboard_qa`. It does not delete the
> normal `hr_dashboard` database or its Docker volume.

```powershell
docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres dropdb -U hr_migrator --if-exists --force --maintenance-db=postgres hr_dashboard_qa

docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres createdb -U hr_migrator --owner=hr_migrator --maintenance-db=postgres hr_dashboard_qa
```

### 1.3 Point this PowerShell session at the QA database

```powershell
$env:DATABASE_URL="postgres://hr_app:dev_runtime_password@127.0.0.1:54329/hr_dashboard_qa"
$env:MIGRATION_DATABASE_URL="postgres://hr_migrator:dev_migrator_password@127.0.0.1:54329/hr_dashboard_qa"
$env:TEST_ADMIN_DATABASE_URL=$env:MIGRATION_DATABASE_URL
$env:TEST_DATABASE_URL=$env:DATABASE_URL
```

All other secrets continue to come from `.env.local`. Never paste secret
values into a QA report.

### 1.4 Migrate and run automated preflight checks

```powershell
bun run db:migrate
bun run db:migrate
bun run test
bun run lint
bun run typecheck
bun run build
```

Expected:

- [ ] Both migration runs succeed
- [ ] Unit tests pass
- [ ] Database-backed tenant-isolation tests run and pass
- [ ] Lint passes
- [ ] Type checking passes
- [ ] Production build passes

Do not run `bun run db:seed` before testing `/setup`. Seeding marks setup as
completed.

### 1.5 Start the application

Stop any existing development server. From the same PowerShell session that
contains the QA database variables, run:

```powershell
bun run dev
```

Open <http://localhost:3000>.

### 1.6 Standard test data

| Item | Value |
| --- | --- |
| Owner name | `Manual QA Owner` |
| Owner email | `qa.owner@example.test` |
| Owner password | `ManualQA2026!` |
| Organization | `QA Holdings` |
| Slug | `qa-holdings` |
| Locale | `en-US` |
| Timezone | `Asia/Colombo` |
| Legal name | `QA Lanka Operations (Pvt) Ltd` |
| Display name | `QA Lanka` |
| Country | `LK` |
| Currency | `LKR` |
| Registration | `PV-2026-QA-001` |
| Tax identifier | `TIN-QA-987654321` |

Use these relative dates:

- `T-7`: seven days ago
- `T`: today
- `T+7`: seven days from today

## 2. Setup and authentication

### QA-01 — Unauthenticated route protection

1. Open `/`.
2. Open `/settings/organization`.
3. Open `/settings/organization/legal-entities/new`.

Expected:

- [ ] Every protected route redirects to `/sign-in`
- [ ] No organization data briefly appears
- [ ] No raw database or server error appears

### QA-02 — Setup validation

Open `/setup` and test one invalid value at a time.

| Input | Invalid value | Expected |
| --- | --- | --- |
| Bootstrap secret | Blank | `Bootstrap secret is required.` |
| Bootstrap secret | Incorrect value | `The bootstrap secret is invalid.` |
| Owner name | Blank | Required-field error |
| Email | `not-an-email` | Valid-email error |
| Password | `Short123!` | Minimum 12-character error |
| Organization name | Blank | Required-field error |
| Slug | `ab` | Minimum 3-character error |
| Slug | `QA Holdings` | Lowercase/hyphen error |
| Slug | `qa--holdings` | Single-hyphen error |
| Locale | `english` | BCP 47 locale error |
| Locale | `en-us` | Canonical `en-US` required |
| Timezone | `Sri Lanka` | IANA timezone error |

For every case verify:

- [ ] No organization is created
- [ ] The relevant field is highlighted
- [ ] The general highlighted-fields alert appears
- [ ] Other values remain where practical
- [ ] No technical details appear

### QA-03 — Create the first organization

1. Enter the real `TENANT_BOOTSTRAP_SECRET` from the environment.
2. Enter the standard owner and organization data.
3. Submit once.

Expected:

- [ ] Submit button disables and shows a pending state
- [ ] Owner is automatically signed in
- [ ] Browser redirects to `/settings/organization`
- [ ] Name, slug, locale, and timezone are correct
- [ ] Legal-entity section is empty

### QA-04 — Double-submission protection

This test requires another fresh QA database cycle.

1. Enable Slow 3G in browser developer tools.
2. Complete the setup form.
3. Rapidly click the submit button several times.

Expected:

- [ ] Button disables while pending
- [ ] Only one organization and owner are created
- [ ] Successful setup does not end with a duplicate-conflict message

### QA-05 — Setup closes permanently

1. While signed in, visit `/setup`.
2. Sign out and visit `/setup` again.

Expected:

- [ ] Setup cannot be opened again
- [ ] Signed-in user ends at organization settings
- [ ] Signed-out user ends at sign-in
- [ ] No public sign-up link exists

### QA-06 — Sign-in behavior

Test these cases:

1. Invalid email format
2. Empty password
3. Correct email with an incorrect password
4. Unknown email with any password
5. Uppercase email `QA.OWNER@EXAMPLE.TEST`
6. Correct email and password

Expected:

- [ ] Invalid fields receive field-level errors
- [ ] Wrong and unknown credentials show the same generic message
- [ ] Account existence is not disclosed
- [ ] Email matching is case-insensitive
- [ ] Valid credentials redirect to organization settings

### QA-07 — Session and sign-out

1. Sign in successfully.
2. Refresh several times.
3. Open organization settings in another tab.
4. Sign out.
5. Use Back, then refresh.

Expected:

- [ ] Session survives refresh and another tab
- [ ] Sign-out redirects to `/sign-in`
- [ ] Protected pages cannot be used after sign-out
- [ ] Authenticated visit to `/sign-in` redirects to organization settings

## 3. Organization settings

### QA-08 — Update settings

Change:

- Name to `QA Holdings International`
- Locale to `en-GB`
- Timezone to `Europe/London`

Expected:

- [ ] Success feedback appears
- [ ] Heading updates
- [ ] Refresh preserves the new values
- [ ] Slug remains `qa-holdings`

### QA-09 — Trimming and validation

Test separately:

- Name containing only spaces
- Name longer than 120 characters
- Name with leading and trailing spaces
- Invalid locale
- Invalid timezone

Expected:

- [ ] Empty and over-length names are rejected
- [ ] Leading/trailing spaces are removed when saved
- [ ] Invalid locale and timezone values are rejected
- [ ] No partial update occurs

### QA-10 — Permanent slug

1. Confirm the slug field is disabled/read-only.
2. Try editing it through browser developer tools.
3. Save settings and refresh.

Expected:

- [ ] Slug does not change
- [ ] Server ignores any submitted slug value

## 4. Legal-entity happy path

### QA-11 — Create a legal entity

Use:

- Legal name: `QA Lanka Operations (Pvt) Ltd`
- Display name: `QA Lanka`
- Country: `LK`
- Currency: `LKR`
- Registration: `PV-2026-QA-001`
- Tax identifier: `TIN-QA-987654321`
- Effective date: `T-7`
- Reason: `Initial manual QA registration`

Expected:

- [ ] Browser redirects to the detail page
- [ ] Status is active
- [ ] Entity has a stable UUID
- [ ] History has one active record beginning at `T-7`
- [ ] Organization list shows the entity and registration
- [ ] Refresh preserves the information
- [ ] Tax input uses `type="password"`
- [ ] Saved tax placeholder ends in `4321`

### QA-12 — Optional fields

Create another uniquely named entity with display name, registration, tax
identifier, and currency blank.

Expected:

- [ ] Creation succeeds
- [ ] Empty optional values display cleanly
- [ ] No `undefined` or `null` text appears

## 5. Legal-entity validation and conflicts

### QA-13 — Field validation

| Field | Invalid value | Expected |
| --- | --- | --- |
| Legal name | Blank | Required error |
| Legal name | More than 180 characters | Length error |
| Display name | More than 120 characters | Length error |
| Country | `LKA` | Two-letter error |
| Currency | `LK` | Three-letter error |
| Registration | More than 80 characters | Length error |
| Tax identifier | More than 80 characters | Length error |
| Effective date | Missing | Date error |
| Reason | Blank | Required error |
| Reason | More than 300 characters | Length error |

For every case verify:

- [ ] No entity or history row is created
- [ ] Error remains friendly and field-specific
- [ ] No raw PostgreSQL error appears

Exploratory checks:

- [ ] Try country `ZZ`
- [ ] Try currency `ZZZ`

The current implementation validates code shape, not membership in the
official ISO lists. Record a defect if the product requires strict ISO
membership.

### QA-14 — Duplicate legal name

Attempt another entity with the same effective period and then retry with:

`qa   lanka operations (pvt) ltd`

Expected:

- [ ] Both attempts are rejected as conflicts
- [ ] Error mentions a conflicting name or identifier
- [ ] No partial entity identity remains

### QA-15 — Duplicate registration

Attempt another `LK` entity with:

1. `PV-2026-QA-001`
2. `pv 2026 qa 001`

Expected:

- [ ] Both conflict with the original
- [ ] Punctuation and case cannot bypass normalization

Retry the same registration under a different country. Current expected
behavior is success because registration uniqueness is scoped by tenant and
country.

### QA-16 — Duplicate tax identifier

Attempt another `LK` entity with:

1. `TIN-QA-987654321`
2. `tin qa 987654321`

Expected:

- [ ] Both conflict with the original
- [ ] Plaintext tax identifier never appears in the error

## 6. Effective-dated history

### QA-17 — Record a current change

On the original entity, record:

- Legal name: `QA Lanka Operations Ltd`
- Effective date: `T`
- Reason: `Legal name changed during manual QA`
- Tax identifier: blank

Expected:

- [ ] Success feedback appears
- [ ] New name becomes current immediately
- [ ] Original active interval is `T-7` to `T`
- [ ] New active interval is `T` to open
- [ ] Superseded transaction row remains visible
- [ ] Masked tax identifier is preserved

### QA-18 — Schedule a future change

Record:

- Legal name: `QA Lanka Holdings Ltd`
- Effective date: `T+7`
- Reason: `Future legal name change QA`

Expected:

- [ ] Change is recorded
- [ ] Today's displayed name remains `QA Lanka Operations Ltd`
- [ ] Future configuration begins at `T+7`
- [ ] Present configuration ends at `T+7`
- [ ] Effective periods do not overlap

### QA-19 — Same-start-date conflict

Try another configuration starting on `T`.

Expected:

- [ ] Error says a configuration already starts on that date
- [ ] Error directs the user to correct the existing record
- [ ] History remains unchanged

### QA-20 — Date before entity creation

Schedule a configuration before `T-7`.

Expected:

- [ ] `No configuration covers that effective date.` appears
- [ ] History remains unchanged

## 7. Corrections

### QA-21 — Correct an existing record

1. Select `Correct` on the current non-superseded configuration.
2. Change display name to `QA Lanka Operations`.
3. Leave tax identifier blank.
4. Enter `Correct display name typo` as the reason.
5. Submit.

Expected:

- [ ] Effective date is read-only
- [ ] Browser returns to the entity page
- [ ] Original transaction row remains as superseded
- [ ] Corrected row keeps the same effective interval
- [ ] Only corrected row offers another Correct action
- [ ] Tax identifier remains unchanged and masked

### QA-22 — Replace the tax identifier

Correct again using:

- Tax identifier: `TIN-QA-11112222`
- Reason: `Correct tax identifier test value`

Expected:

- [ ] Mask now ends in `2222`
- [ ] Original value is never displayed
- [ ] Duplicate use of the new normalized value conflicts

### QA-23 — Stale correction URL

1. Copy a correction URL.
2. Complete that correction.
3. Reopen the copied URL.

Expected:

- [ ] Superseded configuration cannot be corrected again
- [ ] Friendly not-found state appears

## 8. Legal-entity status

### QA-24 — Deactivate

1. Open the same entity in two tabs.
2. In the first tab, deactivate it effective `T`.
3. Use reason `Manual QA deactivation`.

Expected:

- [ ] Status becomes inactive
- [ ] Entity is not deleted
- [ ] History records the status change
- [ ] Form changes from Deactivate to Reactivate

### QA-25 — Stale duplicate submission

Submit the old Deactivate form in the second tab.

Expected:

- [ ] System reports the entity is already inactive
- [ ] No duplicate status interval is created

### QA-26 — Reactivate

Reactivate effective `T` using `Manual QA reactivation`.

Expected:

- [ ] Entity becomes active
- [ ] Deactivation remains in transaction history
- [ ] No record was deleted

### QA-27 — Status validation

Test missing date, missing reason, and a reason longer than 300 characters.

Expected:

- [ ] Status remains unchanged
- [ ] Relevant validation errors appear

## 9. Multi-tenant isolation

### 9.1 Create a second tenant

In a second PowerShell terminal:

```powershell
$env:MIGRATION_DATABASE_URL="postgres://hr_migrator:dev_migrator_password@127.0.0.1:54329/hr_dashboard_qa"
$env:PROVISION_OWNER_NAME="QA Contoso Owner"
$env:PROVISION_OWNER_EMAIL="qa.contoso@example.test"
$env:PROVISION_OWNER_PASSWORD="ManualQA2026!"
$env:PROVISION_TENANT_NAME="QA Contoso"
$env:PROVISION_TENANT_SLUG="qa-contoso"
$env:PROVISION_LOCALE="en-GB"
$env:PROVISION_TIMEZONE="Europe/London"
$env:PROVISION_REASON="Manual tenant isolation QA"

bun run system:provision-tenant
```

Save the tenant UUID printed by the command.

### QA-28 — Tenant B cannot see Tenant A

1. Copy Tenant A's legal-entity URL.
2. Sign out.
3. Sign in as `qa.contoso@example.test`.
4. Open organization settings.
5. Paste Tenant A's entity URL.

Expected:

- [ ] Only QA Contoso data appears
- [ ] Tenant A entities do not appear
- [ ] Tenant A URL shows the generic not-found state
- [ ] No Tenant A name, registration, status, or history is exposed

### QA-29 — Duplicate values across tenants

As QA Contoso, create an entity with the same legal name, country,
registration, and tax identifier used by QA Holdings.

Expected:

- [ ] Creation succeeds because uniqueness is tenant-scoped
- [ ] QA Holdings remains unchanged

## 10. Role and tenant-status boundaries

Run these commands only against `hr_dashboard_qa`.

### QA-30 — Non-owner permission

Change QA Contoso's membership to `member`:

```powershell
docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres psql -U hr_migrator -d hr_dashboard_qa -c "UPDATE tenant_membership SET role='member' WHERE tenant_id=(SELECT id FROM tenant WHERE slug='qa-contoso');"
```

Refresh organization settings.

Expected:

- [ ] `Owner access required` appears
- [ ] Settings and legal-entity forms are unavailable

Restore the owner role:

```powershell
docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres psql -U hr_migrator -d hr_dashboard_qa -c "UPDATE tenant_membership SET role='owner' WHERE tenant_id=(SELECT id FROM tenant WHERE slug='qa-contoso');"
```

### QA-31 — Inactive organization

Get the tenant UUID:

```powershell
docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres psql -U hr_migrator -d hr_dashboard_qa -c "SELECT id,name,slug FROM tenant;"
```

Run:

```powershell
$env:MIGRATION_DATABASE_URL="postgres://hr_migrator:dev_migrator_password@127.0.0.1:54329/hr_dashboard_qa"
$env:TENANT_STATUS_TENANT_ID="<QA-CONTOSO-UUID>"
$env:TENANT_STATUS_TARGET="inactive"
$env:TENANT_STATUS_EFFECTIVE_DATE="<TODAY-YYYY-MM-DD>"
$env:TENANT_STATUS_REASON="Manual inactive tenant QA"

bun run system:set-tenant-status
```

Refresh the application.

Expected:

- [ ] Session loses its current tenant
- [ ] `No active organization` appears
- [ ] Organization data is not displayed
- [ ] User can sign out

Reactivate using the same command with:

```powershell
$env:TENANT_STATUS_TARGET="active"
$env:TENANT_STATUS_REASON="Manual tenant reactivation QA"
```

Expected: owner can sign in and access the organization again.

## 11. Error handling, responsive layout, and accessibility

### QA-32 — Unknown routes

Test:

- `/settings/organization/legal-entities/11111111-1111-4111-8111-111111111111`
- `/settings/organization/legal-entities/not-a-uuid`
- Another tenant's real legal-entity UUID

Expected:

- [ ] No raw SQL, table names, stack traces, or credentials appear
- [ ] Valid unknown and cross-tenant IDs show `Legal entity not found`
- [ ] Malformed-ID behavior is recorded separately if it uses the generic error boundary

### QA-33 — Database outage

1. Keep organization settings open.
2. Stop PostgreSQL:

   ```powershell
   docker stop hr-dashboard-postgres
   ```

3. Refresh or submit a form.
4. Restart PostgreSQL:

   ```powershell
   docker start hr-dashboard-postgres
   ```

Expected:

- [ ] UI does not claim a duplicate/conflict
- [ ] No database credentials or raw SQL appear
- [ ] Operation does not partially save
- [ ] Application recovers after PostgreSQL restarts

Development mode may display the Next.js developer overlay. Verify production
error behavior separately before release.

### QA-34 — Responsive layout

Test at 1440px desktop, 768px tablet, and 375px mobile widths.

Verify:

- [ ] Forms reflow without overlap
- [ ] No page-level horizontal overflow
- [ ] History table remains usable
- [ ] Navigation remains understandable
- [ ] Sign-out remains accessible
- [ ] Alerts and validation remain visible
- [ ] No corrupted text such as `â€¢`, `â€”`, or `â€¦` appears

### QA-35 — Keyboard accessibility

Using only the keyboard, navigate and submit the sign-in, organization, and
legal-entity forms.

Expected:

- [ ] Focus order follows visual order
- [ ] Focus remains visible
- [ ] Every input has an understandable label
- [ ] Disabled/read-only fields are understandable
- [ ] Errors appear near their fields
- [ ] No keyboard trap exists

### QA-36 — Browser console

Repeat the happy path while the browser console is open.

Expected:

- [ ] No React hydration errors
- [ ] No uncaught exceptions
- [ ] No sensitive identifier is printed
- [ ] No repeated failed requests follow successful navigation

## 12. Database evidence

Use only local QA data.

### 12.1 Audit trail

```powershell
docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres psql -U hr_migrator -d hr_dashboard_qa -c "SELECT action,effective_date,reason,occurred_at FROM audit_event ORDER BY occurred_at;"
```

Expected actions include:

- `tenant.provisioned`
- `tenant.settings_updated`
- `legal_entity.created`
- `legal_entity.configuration_changed`
- `legal_entity.configuration_corrected`
- `legal_entity.deactivated`
- `legal_entity.reactivated`

### 12.2 Tax protection

```powershell
docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres psql -U hr_migrator -d hr_dashboard_qa -c "SELECT tax_identifier_ciphertext LIKE 'v1.%' AS encrypted, length(tax_identifier_hash)=64 AS hashed, tax_identifier_last_four FROM legal_entity_configuration WHERE tax_identifier_ciphertext IS NOT NULL;"
```

Expected:

- [ ] `encrypted` is true
- [ ] `hashed` is true
- [ ] Only the last four characters are stored separately for display

Verify plaintext is absent from audit JSON:

```powershell
docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres psql -U hr_migrator -d hr_dashboard_qa -c "SELECT count(*) AS plaintext_leaks FROM audit_event WHERE concat(coalesce(before::text,''),coalesce(after::text,'')) LIKE '%TIN-QA-987654321%';"
```

Expected: `0`.

## 13. Exit criteria

The change is ready only when:

- [ ] Automated checks pass
- [ ] Setup, sign-in, organization update, and entity happy paths pass
- [ ] Cross-tenant reads and writes are blocked
- [ ] Duplicate effective values are controlled within a tenant
- [ ] History and corrections preserve old transaction rows
- [ ] Every successful mutation creates an audit event
- [ ] Plaintext tax identifiers are absent from UI, audit, logs, and errors
- [ ] No P0 or P1 defects remain
- [ ] Mobile and keyboard checks pass

Record these known boundaries separately from regressions:

- UI creates only the first organization; additional organizations use the
  system provisioning command.
- Rerunning the seed script does not update an existing fixture password.
- Country and currency currently validate shape, not official ISO membership.
- Production Portainer PostgreSQL and backup deployment are not yet implemented.

## 14. Cleanup

Stop the QA application, then remove only the disposable database:

```powershell
docker exec -e PGPASSWORD=dev_migrator_password hr-dashboard-postgres dropdb -U hr_migrator --if-exists --force --maintenance-db=postgres hr_dashboard_qa
```

Clear the temporary environment variables:

```powershell
Remove-Item Env:DATABASE_URL,Env:MIGRATION_DATABASE_URL,Env:TEST_ADMIN_DATABASE_URL,Env:TEST_DATABASE_URL -ErrorAction SilentlyContinue
```

Starting `bun run dev` in a new terminal will use `.env.local` again.
