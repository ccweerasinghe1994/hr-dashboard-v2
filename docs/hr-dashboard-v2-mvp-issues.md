# HR Dashboard V2 — MVP GitHub Issue Backlog

> Source basis: the HR Management SaaS feature blueprint supplied for this project.
>
> **How to use this file:** create one GitHub issue per `##` section. The code in each issue title (`MVP-001`, etc.) is the recommended implementation order. GitHub's own issue number does **not** need to match this code.

## Product boundary

The MVP should be a **payroll-neutral HR system of record plus workflow/integration foundation**. The initial product should cover core HR, lifecycle, leave, compensation, payroll connectivity, reporting, privacy/security, bulk operations, and ATS hire conversion.

Do **not** make native multi-country gross-to-net payroll part of this MVP. Native tax calculation, statutory filing, year-end processing, country tax tables, pension/social-security calculation, retro payroll, carrier-scale benefits, advanced workforce management, native ATS, learning, skills, succession, and autonomous AI decisions belong later.

### Architectural rules that apply to every ticket

1. **A person is not an employment, and an employment is not a position.**
2. Mutable workforce facts must be **effective-dated** where history matters.
3. Preserve both **business-effective time** and **transaction/audit time**.
4. Do not destructively overwrite finalized payroll/time-like history; use correction, reversal, or adjustment semantics.
5. Every tenant-owned record must be tenant-isolated at the data-access layer.
6. Authorization must consider **role + data scope + action + field sensitivity**.
7. External vendor IDs must never become internal primary keys.
8. HR lifecycle state and third-party integration-sync state must remain separate.
9. Workflow definitions and policy/rule versions must be retained for historical explainability.
10. Sensitive HR subdomains must have separable permission boundaries.
11. Retention must be record-class/jurisdiction aware; a single `deleted_at` flag is not enough.
12. Business mutations should be auditable, including actor, source, timestamp, object, and before/after state where appropriate.

## Recommended build sequence

| Order | Ticket | Area |
|---:|---|---|
| 0 | MVP-000 | Master roadmap |
| 1 | MVP-001 | Persistence, tenant isolation, tenant & legal entities |
| 2 | MVP-002 | Authentication, MFA & sessions |
| 3 | MVP-003 | RBAC, data scopes & field permissions |
| 4 | MVP-004 | Immutable audit history |
| 5 | MVP-005 | Person / employee / employment + effective dating |
| 6 | MVP-006 | Org structure, jobs, positions & reporting relationships |
| 7 | MVP-007 | Custom fields & configurable metadata |
| 8 | MVP-008 | Workflow / approvals / notifications |
| 9 | MVP-009 | Canonical integration & event foundation |
| 10 | MVP-010 | ESS / MSS / directory / org chart |
| 11 | MVP-011 | Bulk import / export / correction flows |
| 12 | MVP-012 | Preboarding / onboarding / checklists |
| 13 | MVP-013 | Documents / e-sign / expiry reminders |
| 14 | MVP-014 | Employment changes / offboarding / termination |
| 15 | MVP-015 | Leave policy / eligibility / calendars / accruals |
| 16 | MVP-016 | Leave requests / approvals / team calendar |
| 17 | MVP-017 | Compensation history |
| 18 | MVP-018 | Payroll reference data / cutoff / provider export |
| 19 | MVP-019 | Payroll result ingestion / payslips |
| 20 | MVP-020 | Standard HR reporting |
| 21 | MVP-021 | Privacy / retention / data rights |
| 22 | MVP-022 | Backup / restore / business continuity |
| 23 | MVP-023 | ATS accepted-candidate → employee conversion |
| F01 | MVP-F01 | Timesheets — conditional frontline MVP |
| F02 | MVP-F02 | Clock-in/out — conditional frontline MVP |

---


## [MVP-000] HR Management MVP implementation roadmap

### Goal
Create a single tracking issue for the entire MVP and make the implementation order explicit.

### Scope
Track all core MVP tickets in this file and maintain the product boundary:

- Core HR system of record
- Organizations, jobs, positions and manager hierarchy
- Authentication, RBAC and audit history
- Workflow/approval infrastructure
- Employee and manager self-service
- Onboarding/offboarding
- Employee documents
- Time-off
- Compensation history
- Payroll connectivity and payroll-result ingestion
- Basic HR reporting
- Privacy/retention controls
- Bulk import/export
- ATS hire conversion
- Optional frontline time capture only when hourly/frontline users are in the initial ICP

### Out of scope for this MVP
- Native gross-to-net payroll
- Statutory payroll filings and country tax engines
- Benefits administration and carrier feeds
- Native ATS
- Performance, goals, learning, skills and succession
- Advanced WFM: scheduling, overtime, breaks, penalty rates
- Workforce planning and predictive analytics
- Enterprise SSO/SCIM as a productized customer feature
- AI-driven employment decisions

### Tracking checklist
- [ ] MVP-001
- [ ] MVP-002
- [ ] MVP-003
- [ ] MVP-004
- [ ] MVP-005
- [ ] MVP-006
- [ ] MVP-007
- [ ] MVP-008
- [ ] MVP-009
- [ ] MVP-010
- [ ] MVP-011
- [ ] MVP-012
- [ ] MVP-013
- [ ] MVP-014
- [ ] MVP-015
- [ ] MVP-016
- [ ] MVP-017
- [ ] MVP-018
- [ ] MVP-019
- [ ] MVP-020
- [ ] MVP-021
- [ ] MVP-022
- [ ] MVP-023
- [ ] MVP-F01 — conditional
- [ ] MVP-F02 — conditional

### Definition of done
- All core tickets are linked from the GitHub roadmap issue.
- The order is kept current when dependencies change.
- Deferred features are not silently pulled into MVP scope without updating this roadmap.


---

## [MVP-001] Persistence, tenant isolation, tenant setup & legal entities


**Recommended label:** `enhancement`

### Goal
Establish the persistence and multi-tenant foundations for the HR system, including tenants and legal employing entities.

### Depends on
None.

### Business rationale
Tenant and legal-entity boundaries are foundational to authorization, employment records, payroll connectivity, reporting, retention and later country localization. Retrofitting these boundaries after employee data exists is risky.

### In scope
- Production-ready application database/persistence layer
- Database migration strategy
- `tenant` model
- `legal_entity` model
- Tenant default locale and timezone
- Legal-entity legal name, country, registration/tax identifier placeholders, status and effective configuration
- Tenant-scoped repositories/data-access helpers
- Tenant bootstrap/admin setup screen
- Legal-entity CRUD with safe deactivation
- Unique constraints scoped correctly by tenant
- Seed/dev fixture strategy
- Request context that always resolves current tenant before accessing tenant-owned data

### Suggested data model
`tenant`
- id UUID
- name
- slug/key
- default_locale
- default_timezone
- data_region placeholder
- status
- created_at / updated_at

`legal_entity`
- id UUID
- tenant_id
- legal_name
- display_name
- country_code
- registration_number nullable
- tax_identifier nullable/sensitive
- default_currency nullable
- status
- valid_from / valid_to when needed
- created_at / updated_at

### Technical requirements
- Prefer UUIDs for internal business identifiers.
- Tenant ownership must be explicit on tenant-owned tables, directly or through an unambiguous parent.
- Add indexes for tenant-scoped lookup patterns.
- Prevent cross-tenant joins/read/write paths in application services.
- All mutations should be transaction-safe.
- Do not expose raw database errors to users.
- Provide a clear migration command/process for local, CI and production environments.

### Security requirements
- No endpoint may accept an arbitrary tenant ID and trust it without authorizing it against the session.
- Tenant context must be derived from authenticated membership/context, not client-provided hidden fields alone.
- Sensitive legal identifiers must be excluded from general logs.

### Edge cases
- Tenant with multiple legal entities
- Legal entity renamed while historical employments must remain explainable
- Legal entity deactivated while former employees still reference it
- Duplicate legal names allowed across tenants but controlled within a tenant if appropriate
- Locale/timezone changes must not reinterpret existing timestamp history

### Acceptance criteria
- [ ] A tenant can be created and configured.
- [ ] Multiple legal entities can be created under one tenant.
- [ ] All legal entities are isolated between tenants.
- [ ] Server-side tests prove cross-tenant reads and writes are rejected.
- [ ] Deactivating a legal entity does not delete historical records.
- [ ] Database migrations run cleanly from an empty database.
- [ ] Tenant and legal-entity mutations are ready for audit instrumentation.
- [ ] App build/lint succeeds.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-002] Authentication, MFA & session security


**Recommended label:** `enhancement`

### Goal
Provide secure sign-in and session management suitable for sensitive employee data.

### Depends on
- MVP-001

### In scope
- User/account identity model
- Tenant membership linkage
- Sign-in/sign-out
- Secure password or supported identity provider mechanism selected for MVP
- MFA support
- Session creation, validation, expiry and revocation
- Password reset/recovery if password auth is used
- Account lock/rate-limit protections
- Session/device view and “sign out other sessions”
- Basic security-event hooks for audit logging

### Suggested data model
`user_account`
- id
- primary_email
- email_verified_at
- status
- last_login_at

`tenant_membership`
- id
- tenant_id
- user_account_id
- employee_id nullable
- status

`session`
- id
- user_account_id
- tenant_id/current_context
- created_at
- expires_at
- revoked_at
- last_seen_at
- user_agent metadata
- network metadata only where appropriate

`mfa_factor`
- id
- user_account_id
- type
- status
- created_at
- last_used_at
- encrypted/hashed secret material as appropriate

### Security requirements
- Use established authentication libraries/frameworks rather than home-grown cryptography.
- Secrets/tokens must never be logged.
- Session cookies must be secure, HTTP-only and use appropriate SameSite settings.
- MFA recovery codes, if used, must be one-way protected.
- Authenticated identity must not imply HR authorization; RBAC comes separately.
- Disabled/terminated access must be revocable without deleting historical actor references.

### UI requirements
- Sign-in page
- MFA challenge/enrollment
- Recovery flow
- Session expired state
- Access-denied state that does not leak sensitive tenant information

### Edge cases
- User belongs to multiple tenants
- User account exists before employee record
- Employee leaves but historical audit references must remain
- MFA reset by authorized admin must be auditable
- Expired invite / expired session / revoked session

### Acceptance criteria
- [ ] Users can securely authenticate and sign out.
- [ ] MFA can be enabled and challenged.
- [ ] Session expiry and explicit revocation work.
- [ ] Disabled users cannot create new sessions.
- [ ] Authentication tests include brute-force/rate-limit protections where applicable.
- [ ] Tenant membership is resolved before application data access.
- [ ] Authentication state can be consumed by the authorization layer in MVP-003.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-003] Role-, scope- & field-level access control


**Recommended label:** `enhancement`

### Goal
Implement authorization as **role + data scope + action + field sensitivity**, not a single admin flag.

### Depends on
- MVP-001
- MVP-002

### Roles to support initially
- Employee
- Manager
- HR administrator / HRBP
- Payroll administrator
- Recruiter
- Finance
- IT / identity administrator
- Executive
- Compliance / auditor
- Tenant administrator

### In scope
- Permission catalog by resource/action
- Role definitions
- Role assignment
- Data scopes such as:
  - self
  - direct reports
  - reporting tree
  - department
  - legal entity
  - tenant
  - explicitly assigned population
- Field sensitivity/field groups
- Read/create/update/delete/export/approve permission distinctions
- Server-side authorization middleware/service
- UI capability checks only as a convenience; never as sole enforcement
- Authorization tests

### Examples
- Employee can view/update selected own profile fields but cannot edit own salary.
- Manager can see permitted team data but not bank/tax information.
- Payroll admin can see compensation/payroll fields without automatically seeing performance data.
- Recruiter can access pre-hire/ATS lineage but not unrelated post-hire sensitive content.
- Auditor gets read-only evidence access.

### Suggested model
- `permission`
- `role`
- `role_permission`
- `membership_role`
- `data_scope`
- `field_policy` or field-group permission mapping

### Security requirements
- Default deny.
- Every server mutation must authorize explicitly.
- Export permissions must be distinct because exports can create large data exfiltration paths.
- Sensitive fields should be masked or omitted, not merely disabled in the UI.
- Authorization decision failures should be auditable without leaking protected field values.

### Edge cases
- Manager changes: old manager immediately loses future team access unless specifically retained.
- Employee temporarily has no manager.
- Multiple concurrent position assignments create different reporting scopes.
- User has multiple roles; effective permission should be deterministic.
- Tenant admin should not automatically bypass all sensitive-data restrictions unless explicitly configured.

### Acceptance criteria
- [ ] Authorization policy service exists and is used by protected routes/actions.
- [ ] Tests cover employee, manager, HR, payroll and auditor scenarios.
- [ ] Cross-tenant access is denied even for high-privilege tenant roles.
- [ ] Field-level restrictions are enforced server-side.
- [ ] Export permission is separately controlled.
- [ ] UI hides or masks inaccessible data without relying on that as security.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-004] Immutable audit history & mutation attribution


**Recommended label:** `enhancement`

### Goal
Record defensible, append-oriented audit evidence for HR mutations.

### Depends on
- MVP-001
- MVP-002
- MVP-003

### In scope
- Append-oriented `audit_event` store
- Actor identity
- Tenant
- Source: UI, API, import, workflow, integration/system
- Action name
- Object type / object ID
- Before/after snapshot or safe diff
- Transaction timestamp
- Business effective date where relevant
- Correlation/request ID
- Optional reason/comment/reference
- Audit viewer with permission controls
- Filter by actor, object, date, action and source

### Important rules
- Do not store plaintext secrets in audit payloads.
- Sensitive values may need masking, hashing or safe diff policies.
- Audit history should not be editable through normal business APIs.
- A failed mutation may be logged separately as a security/operational event, but must not look like a committed HR change.
- Historical actor references must survive user deactivation.

### Technical notes
- Consider separating audit persistence from mutable domain rows.
- Audit writes should occur atomically with domain changes where feasible.
- Include a stable event ID.
- Support correlation between workflow approval events and resulting HR transactions.

### UI requirements
- Read-only audit timeline
- Human-readable action labels
- Before/after presentation for authorized viewers
- Link from employee/employment records to relevant audit entries

### Edge cases
- Bulk imports creating thousands of row changes
- System-generated accruals
- Workflow approval leading to multiple domain writes
- Backdated correction entered today
- Sensitive document metadata

### Acceptance criteria
- [ ] Create/update/deactivate actions emit audit records.
- [ ] Audit records identify actor, source, timestamp and object.
- [ ] Effective date and transaction date can both be represented.
- [ ] Normal application users cannot alter prior audit events.
- [ ] Sensitive secrets are not written to audit payloads.
- [ ] Auditor role can search audit evidence without gaining unrelated edit rights.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-005] Person / employee / employment master with effective-dated history


**Recommended label:** `enhancement`

### Goal
Build the canonical workforce system of record with a clean separation between person identity and legal employment relationships.

### Depends on
- MVP-001
- MVP-003
- MVP-004

### Domain rule
**A person is not the same thing as an employment.** A person may be rehired or have multiple employments, and history must remain intact.

### In scope
`employee/person`
- legal name
- preferred name
- personal/contact details
- work contact details
- demographic fields only where lawful/needed
- status at person level where useful

`employment`
- employee/person reference
- legal entity
- worker type
- employment status
- hire/start date
- original hire date where useful
- termination information placeholders
- work location/jurisdiction hooks
- scheduled FTE/hours hooks

Effective-dated history
- valid_from / valid_to or equivalent
- future-dated changes
- backdated corrections
- historical “as of date” query
- transaction timestamp preserved separately

### Lifecycle states
At minimum:
- pre-hire where appropriate
- active
- leave/suspended as a generic employment state
- terminated

Do not overload lifecycle state with integration sync state.

### Technical requirements
- Stable internal identifiers
- Duplicate-person detection hooks
- “Current view” and “as-of date” query helpers
- No destructive overwrite of historical business facts
- Validation preventing impossible date ranges
- Employment must belong to one legal entity at a given legal employment relationship

### Security
- Separate sensitive field groups.
- Employee self-service update permissions will be added through MVP-010.
- Tax/bank fields may be placeholders but should not be mixed into universally readable profile objects.

### Edge cases
- Rehire after termination
- Multiple employments for same person
- Future-dated hire
- Backdated correction to hire date
- Employee changes legal entity via termination/new employment versus transfer model
- Employee record exists but no active employment

### Acceptance criteria
- [ ] HR can create a person and at least one employment.
- [ ] One person can have multiple employment records.
- [ ] Historical employment values can be queried as of a past date.
- [ ] Future-dated changes do not overwrite the currently effective value.
- [ ] Backdated changes preserve transaction time.
- [ ] Rehire does not create an unrelated duplicate person by default.
- [ ] All mutations are authorized and audited.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-006] Organization structure, jobs, positions, assignments & reporting relationships


**Recommended label:** `enhancement`

### Goal
Model the company structure separately from employees so positions can exist before and after incumbents.

### Depends on
- MVP-005

### In scope
- Locations
- Departments/teams
- Cost centers
- Hierarchical departments
- Job profiles
- Position management
- Position assignment
- Reporting relationships
- Position vacancy/fill status
- Primary and concurrent assignments where required

### Suggested models
`location`
- tenant_id
- name
- country/region
- timezone
- status

`department`
- tenant_id / legal_entity_id
- parent_department_id
- name
- code
- cost_center_id
- status

`job_profile`
- family
- function
- level
- default title
- grade placeholder
- status

`position`
- legal_entity_id
- department_id
- location_id
- job_profile_id
- title override
- FTE/headcount fields
- status: draft/open/filled/frozen/closed as appropriate

`position_assignment`
- employment_id
- position_id
- valid_from / valid_to
- primary flag
- FTE

`reporting_relationship`
- subordinate employment/assignment
- manager employment/assignment
- relationship type
- valid_from / valid_to

### Business rules
- Position can exist without an employee.
- Vacating a position must not delete it.
- Historical assignments remain queryable.
- Manager relationship changes must be effective-dated.
- Prevent obvious reporting cycles where possible.
- Department hierarchy must not allow a department to become its own ancestor.

### UI requirements
- Organization setup screens
- Position list and detail
- Filled/vacant indicator
- Assignment history
- Manager relationship editor
- Basic hierarchy browser

### Acceptance criteria
- [ ] HR can configure locations, departments, cost centers and job profiles.
- [ ] HR can create a position without an incumbent.
- [ ] Employment can be assigned to a position with effective dates.
- [ ] Position history survives transfer/termination.
- [ ] Manager relationships are effective-dated.
- [ ] Hierarchy cycle protections exist.
- [ ] Permission scopes can use department/legal entity/reporting tree data.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-007] Custom fields & configurable metadata


**Recommended label:** `enhancement`

### Goal
Allow tenant-specific HR attributes without schema changes for every customer request.

### Depends on
- MVP-003
- MVP-005

### In scope
- Custom field definitions
- Supported types: short text, long text, number, date, boolean, single-select, multi-select where practical
- Entity targets: employee/person, employment, position, legal entity initially
- Required/optional
- Validation constraints
- Display order/group
- Effective active/inactive state
- Field-level permission integration
- Import/export/reporting visibility
- Custom-field values
- Admin management UI

### Technical requirements
- Keep definitions tenant-scoped.
- Stable custom-field IDs so renaming labels does not break integrations/imports.
- Validation must occur server-side.
- Do not allow arbitrary executable formulas/scripts in MVP.
- Design values so later reporting remains feasible.
- Avoid storing all custom fields as an unvalidated opaque blob if that prevents permissioning and reporting.

### Security
- Custom fields may contain sensitive data; allow sensitivity classification or permission group mapping.
- Do not automatically expose new fields to all roles.
- Audit definition and value changes.

### Edge cases
- Field deactivated after values already exist
- Select option renamed
- Required field added after many existing employees already exist
- Imported invalid option
- Field visible to HR but hidden from employee/manager

### Acceptance criteria
- [ ] Admin can define and deactivate custom fields.
- [ ] Values validate according to field type/configuration.
- [ ] Custom fields appear on configured entity forms/details.
- [ ] Permissions control read/write access.
- [ ] Import/export and reporting layers can identify custom fields by stable ID.
- [ ] Deactivating a field does not destroy historical values.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-008] Workflow / approval engine, notifications & templates


**Recommended label:** `enhancement`

### Goal
Provide reusable workflow infrastructure for leave, employment changes, onboarding/offboarding and other HR processes.

### Depends on
- MVP-003
- MVP-004
- MVP-005
- MVP-006

### In scope
Workflow definitions
- trigger/event
- version
- conditions
- approval steps
- dynamic approver resolution
- optional HR/admin step
- reminders/escalations
- rejection
- resubmission
- cancellation
- completion actions

Workflow instances
- subject object
- definition version
- current state
- requested effective date
- initiator
- approvals/decisions
- timestamps
- reason/comments

Notifications
- in-app notification
- email adapter/template boundary
- template variables
- reminder scheduling
- workflow status notifications

### Required capabilities
- Conditional routing based on legal entity, department, manager, request type, amount/category where relevant
- Dynamic manager approver
- Delegation hooks
- Idempotent completion actions
- Explicit failed completion state rather than silently losing an approved request
- Audit each decision and final business action

### Important rule
Approval state is not the authoritative HR record. On completion, the workflow must commit an auditable domain transaction.

### UI requirements
- My approvals inbox
- Request status/timeline
- Admin workflow-definition interface can be basic but must support versioning
- Notification center or equivalent
- Rejection/resubmit experience

### Edge cases
- Approver leaves company mid-workflow
- Requester becomes approver through hierarchy change
- Same workflow resubmitted after rejection
- Future-dated approved employment change
- Completion action partially fails
- Duplicate click/retry

### Acceptance criteria
- [ ] A configurable approval workflow can be defined and versioned.
- [ ] Workflow instances retain the definition version used.
- [ ] Dynamic manager approval works.
- [ ] Approve/reject/cancel/resubmit paths are auditable.
- [ ] Completion actions are idempotent.
- [ ] Notifications are generated from workflow events rather than bespoke module code.
- [ ] Approval does not directly bypass domain validation.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-009] Canonical integration model, transactional outbox & external identifiers


**Recommended label:** `enhancement`

### Goal
Create the integration foundation early so HR transactions can safely drive payroll/ATS/identity/calendar integrations later.

### Depends on
- MVP-001
- MVP-004
- MVP-005
- MVP-008

### In scope
- Canonical internal HR domain events
- Transactional outbox or equivalent reliable post-commit event mechanism
- Event IDs and correlation IDs
- Event version
- Retry-safe delivery model
- `external_identifier` model
- Integration connection model
- Integration sync status/error model
- Source-of-truth ownership metadata where useful
- Secret/config boundary design
- Admin-visible integration error queue foundation

### Initial event examples
- `employee.created`
- `employee.updated`
- `employment.hired`
- `employment.changed`
- `employee.terminated`
- `position.created`
- `position.assignment_changed`
- `compensation.changed`
- `timeoff.approved`

### Suggested model
`external_identifier`
- tenant_id
- connection_id
- provider
- object_type
- internal_id
- external_id
- created_at / updated_at

`integration_delivery`
- event_id
- connection_id
- status
- attempt_count
- next_attempt_at
- last_error_safe
- acknowledged_at

### Critical rules
- External IDs are mappings, never primary business IDs.
- Connector failure must not roll back an already committed HR transaction.
- HR lifecycle status must not become `FAILED` because a third-party sync failed.
- Provider secrets must not live in ordinary HR configuration fields.
- Every integration write should identify its source for audit.

### Edge cases
- Duplicate provider callback
- Retry after timeout where provider actually processed request
- External object deleted and recreated
- Multiple payroll providers by legal entity
- Same provider connected twice for separate populations

### Acceptance criteria
- [ ] Domain mutation can atomically create an outbox event.
- [ ] Event retries are idempotency-friendly.
- [ ] External IDs are stored provider/connection scoped.
- [ ] Integration failure is visible separately from HR lifecycle status.
- [ ] Secrets are not exposed in normal application logs/config UI.
- [ ] Audit events can identify integration-originated writes.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-010] Employee & manager self-service, directory & org chart


**Recommended label:** `enhancement`

### Goal
Expose the authoritative HR data through permission-aware employee and manager experiences.

### Depends on
- MVP-003
- MVP-005
- MVP-006

### Employee self-service
- View own permitted profile/employment data
- Update configured self-service fields
- View manager, department, position, location
- Access future modules from one profile shell
- Clear indication when an HR-controlled field cannot be edited

### Manager self-service
- View direct reports/reporting tree according to permission scope
- View permitted employee summary
- Access approval inbox
- Initiate permitted employment-change workflow hooks
- Team absence links once leave module is complete

### Employee directory
- Search by name
- Filter by department/location where allowed
- Show only permitted contact/organization fields
- Do not expose compensation, tax, personal address or other sensitive data

### Org chart
- Render manager/reporting relationships
- Use effective/current assignments
- Support vacant position representation if practical
- Handle missing manager gracefully

### UI/UX
- Loading, empty and permission-denied states
- Mobile-responsive layout
- Accessible navigation and controls
- Search should not leak names from unauthorized populations

### Acceptance criteria
- [ ] Employee can view own authorized profile.
- [ ] Employee can update only allowed self-service fields.
- [ ] Manager can view authorized team members.
- [ ] Directory search respects data scope.
- [ ] Org chart derives from reporting relationships/positions rather than hard-coded UI data.
- [ ] Sensitive fields are omitted/masked according to RBAC.
- [ ] Changes are auditable.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-011] Bulk import, export & controlled corrections


**Recommended label:** `enhancement`

### Goal
Support customer implementation, migrations and recurring bulk HR operations safely.

### Depends on
- MVP-003
- MVP-004
- MVP-005
- MVP-006
- MVP-007

### In scope
Import
- CSV initially
- Downloadable template
- Column mapping
- Stable system/custom-field identifiers
- Validation-only dry run
- Row-level error reporting
- Duplicate handling strategy
- Commit only after review
- Audit attribution to import job and initiating user
- Import job status/progress

Export
- Permission-aware export
- Standard employee/employment export
- Custom field support
- As-of-date option where appropriate
- Large-export safeguards

Corrections
- Controlled correction flow for effective-dated records
- Preserve original transaction history
- Reason/comment
- Avoid raw direct database-style editing in UI

### Security
- Export requires explicit permission.
- Generated files containing sensitive data should have controlled access and expiry.
- Do not include fields the actor cannot read.
- Import must not allow tenant IDs or object IDs to escape authorization boundaries.

### Edge cases
- Partial invalid import
- Duplicate employee email/name
- Rehire vs duplicate person
- Future-dated changes imported
- Invalid custom-field values
- User loses permission while long-running export is processing

### Acceptance criteria
- [ ] User can dry-run an import and receive row-level errors.
- [ ] No data is changed during dry run.
- [ ] Committed import mutations are audited.
- [ ] Export contains only authorized fields/populations.
- [ ] Effective-dated corrections preserve history.
- [ ] Invalid rows cannot silently create partially corrupt records.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-012] Preboarding, onboarding & reusable task checklists


**Recommended label:** `enhancement`

### Goal
Convert an accepted hire/pre-hire into an active employee through a repeatable, trackable onboarding process.

### Depends on
- MVP-005
- MVP-006
- MVP-008
- MVP-010

### In scope
- Pre-hire record/status
- Onboarding templates
- Task/checklist definitions
- Trigger by legal entity, location, department/job where practical
- Assignee types: employee, manager, HR, named role
- Due-date rules relative to start date
- Required vs optional tasks
- Task completion evidence/comment
- Reminder notifications
- Start-day activation gate/hook

### Example onboarding tasks
- Personal details
- Contract/policy acknowledgement
- Payroll information placeholder collection if allowed
- Manager welcome task
- Equipment/access handoff placeholder
- Required documents
- Orientation task

### Business rules
- Reuse the person/employment model; do not create a separate incompatible “onboarding employee” schema.
- Onboarding completion should not destroy pre-hire history.
- Task templates must be versioned enough that historical onboarding records remain understandable.
- Missing downstream integration must not prevent HR employment state from being represented.

### UI
- HR onboarding dashboard
- Employee onboarding checklist
- Manager task view
- Progress indicator
- Overdue state

### Edge cases
- Start date changes after tasks were generated
- Hire cancels before start
- Rehire
- Manager changes before start
- Template changes after onboarding started

### Acceptance criteria
- [ ] HR can create an onboarding template.
- [ ] A pre-hire can be assigned a template.
- [ ] Tasks are generated with owners and due dates.
- [ ] Employee/manager/HR see only their permitted tasks.
- [ ] Changing a template does not mutate already-started onboarding unexpectedly.
- [ ] Cancellation and start-date changes are auditable.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-013] Employee document repository, e-signature boundary & expiry reminders


**Recommended label:** `enhancement`

### Goal
Provide secure storage and lifecycle management for contracts, policies and employee documents.

### Depends on
- MVP-003
- MVP-004
- MVP-005
- MVP-008

### In scope
- Document metadata
- Secure object/file storage boundary
- Employee/employment association
- Document categories/types
- Versioning
- Retention class hook
- Visibility/permission rules
- Upload/download
- Signed/unsigned state
- E-signature integration boundary or simple native acknowledgement where appropriate
- Lock signed/final version
- Expiry date
- Reminder notifications for contract/probation/document expiry

### Suggested metadata
- id
- tenant_id
- employee_id / employment_id
- document_type
- title
- storage_key
- content_type
- size
- checksum
- version
- signature_status
- signed_at
- expiry_date
- retention_class
- created_by / created_at

### Security
- Files must never be public by predictable URL.
- Authorization must be checked at download time.
- Avoid storing object-store credentials in application-visible config.
- Virus/malware scanning hook if available in chosen stack.
- Audit upload, view/download where required, replacement, signature and deletion/anonymization actions.

### Edge cases
- New version after old version was signed
- Expired document still legally retained
- Employee terminated
- Document visible to employee but not manager
- Large file / unsupported file type

### Acceptance criteria
- [ ] Authorized users can upload and retrieve employee documents.
- [ ] Document access respects field/resource permissions.
- [ ] Versions are retained.
- [ ] Signed/final documents cannot be silently overwritten.
- [ ] Expiry reminders can be generated.
- [ ] Retention metadata exists for later privacy workflow.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-014] Employment-change workflow, offboarding & termination


**Recommended label:** `enhancement`

### Goal
Make promotions, transfers and termination controlled workflows that create effective-dated HR transactions instead of direct destructive edits.

### Depends on
- MVP-005
- MVP-006
- MVP-008
- MVP-009
- MVP-012
- MVP-013

### Employment changes in scope
- Promotion
- Transfer
- Department change
- Position change
- Manager change
- Location change
- Scheduled/FTE change hook
- Compensation change hook to MVP-017

### Change workflow
request → validation → approval → future/backdated effective transaction → domain update → integration events

### Termination/offboarding in scope
- Termination initiated
- Reason
- Termination effective date
- Last worked date
- System access cutoff date
- Final payroll action status placeholder
- Benefit action placeholder
- Offboarding tasks/checklist
- Position vacated at appropriate effective date
- Employee/employment retained as historical record
- Integration event for downstream deprovisioning

### Important rules
- Keep termination date, last-worked date, pay date and access cutoff as separate concepts.
- Do not delete the employee on termination.
- Position vacancy and manager hierarchy must update effectively.
- Downstream sync failure must not rewrite termination status.

### Edge cases
- Future-dated termination canceled
- Termination date changed
- Rehire later
- Employee has multiple concurrent employments
- Employee is a manager with reports
- Backdated transfer
- Promotion plus compensation change in one approved transaction

### Acceptance criteria
- [ ] Manager/HR can initiate a permitted employment change.
- [ ] Approval uses the workflow engine.
- [ ] Completion creates effective-dated records.
- [ ] Historical assignment/manager data remains queryable.
- [ ] Termination preserves the person and employment history.
- [ ] Position becomes vacant/closed according to configuration.
- [ ] Termination emits downstream integration event(s).
- [ ] All decisions and final mutations are auditable.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-015] Leave types, policy versions, eligibility, holiday calendars & accrual engine


**Recommended label:** `enhancement`

### Goal
Build a reusable date/policy-based leave entitlement engine instead of storing PTO as a simple counter.

### Depends on
- MVP-005
- MVP-006
- MVP-007

### In scope
Leave types
- vacation/PTO
- sick
- unpaid/custom types
- statutory placeholder category without building full protected-leave case management

Holiday/work calendars
- calendar by legal entity/location
- holiday date/name
- partial-day hook if practical

Leave policies
- version
- effective dates
- entitlement unit: days/hours
- accrual frequency
- accrual amount/rate
- waiting period
- carryover rule
- cap
- expiration rule
- negative balance allowed or not
- prorating hooks

Eligibility
- legal entity
- location
- worker/employment type
- tenure
- status
- explicit assignment/eligibility group where practical

Balance model
Prefer ledger/reconstructable transactions:
- opening
- accrued
- used
- adjustment
- carryover
- expiration

### Critical rules
- Policy changes are versioned; do not mutate the historical rule used to calculate old balances.
- Balance must be explainable from transactions/rules.
- Store calculation context/version for entitlement-changing events.
- Holiday calendars affect leave duration.

### Edge cases
- Mid-year hire
- Policy change during year
- Future policy version
- Negative adjustment
- Carryover cap
- Leap year
- Part-time/FTE change hook
- Employee changes legal entity/location

### Acceptance criteria
- [ ] HR can define leave types and policy versions.
- [ ] HR can configure holiday calendars.
- [ ] Eligibility selects the correct policy for an employment/date.
- [ ] Accrual creates auditable balance transactions.
- [ ] Balance can be reconstructed/explained.
- [ ] Old calculations retain their policy version.
- [ ] Deactivating a policy does not erase historical balances.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-016] Leave requests, approvals & team calendar visibility


**Recommended label:** `enhancement`

### Goal
Provide employee leave self-service with balance validation, approval workflow and team visibility.

### Depends on
- MVP-008
- MVP-010
- MVP-015

### In scope
- Employee request
- Full day / partial day where practical
- Leave type
- Start/end dates
- Duration calculation using assigned holiday/work calendar
- Balance and eligibility validation
- Overlap/conflict validation
- Manager/HR approval
- Cancel/withdraw
- Approved request balance transaction
- Request timeline
- Team/calendar visibility
- Privacy-aware leave labeling
- Notification events

### Workflow
request → calculate → validate → submit → approve/reject → post balance transaction → calendar visibility

### Important rules
- Do not expose sensitive leave reason/category to coworkers unless explicitly permitted.
- Approved leave should reference the policy version/calculation evidence.
- Cancellation of approved leave should reverse/adjust the balance transaction rather than delete history.

### Edge cases
- Request spans policy year
- Employee changes manager while request is pending
- Insufficient balance after another request is approved first
- Overlapping leave requests
- Holiday inside leave range
- Cancel approved leave
- Backdated leave entered by HR

### Acceptance criteria
- [ ] Employee can see eligible leave types and current explainable balance.
- [ ] Leave duration respects holiday calendar.
- [ ] Invalid/overlapping requests are blocked or clearly handled.
- [ ] Approval routes through shared workflow engine.
- [ ] Approved leave updates balance ledger.
- [ ] Cancellation reverses/adjusts rather than deleting evidence.
- [ ] Managers can see team absence calendar without unnecessary sensitive detail.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-017] Effective-dated compensation records & history


**Recommended label:** `enhancement`

### Goal
Make compensation a first-class HR master-data domain even though native payroll is deferred.

### Depends on
- MVP-005
- MVP-008
- MVP-014

### In scope
- Salary and hourly rate
- Currency
- Pay frequency
- Pay type
- Effective date
- End date
- Reason
- Source
- Approval workflow hook
- Compensation history
- As-of-date compensation query
- Future-dated compensation change
- Backdated correction support
- Payroll integration event

### Suggested model
`compensation`
- id
- tenant_id
- employment_id
- amount_decimal
- currency_code
- pay_frequency
- pay_type
- valid_from
- valid_to
- reason_code
- created_at
- created_by
- source
- workflow_instance_id nullable

### Important rules
- Currency and frequency are mandatory; never assume meaning of numeric amount.
- Do not overwrite old salary row.
- Preserve transaction time separately from effective time.
- Compensation fields require stronger permissions than general profile data.
- Employee visibility of own compensation should be configurable.

### Edge cases
- Promotion and compensation effective same date
- Two future-dated compensation changes
- Backdated change after payroll cutoff
- Currency change due to legal-entity transfer
- Hourly ↔ salaried change

### Acceptance criteria
- [ ] Authorized HR/payroll users can create compensation changes.
- [ ] Compensation is effective-dated and historically queryable.
- [ ] Amount always includes currency and frequency.
- [ ] Unauthorized managers/employees cannot access restricted compensation.
- [ ] Changes emit audit and integration events.
- [ ] Direct destructive overwrite of prior compensation is prevented.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-018] Payroll reference data, cutoff/locking & payroll-provider export/API


**Recommended label:** `enhancement`

### Goal
Deliver payroll connectivity without owning statutory gross-to-net calculation.

### Depends on
- MVP-009
- MVP-015
- MVP-017

### In scope
Canonical payroll reference data
- earning codes
- deduction codes
- leave/time mapping references
- provider mapping
- legal-entity/provider connection

Payroll period/run control
- pay period
- pay date
- provider
- status
- cutoff/lock
- version/reference

Outbound payroll dataset
- employee/person identifiers
- employment
- legal entity
- compensation
- mapped leave/time inputs where available
- effective changes within selected window
- validation results
- control totals where practical

Delivery
- CSV/file export minimum
- API adapter boundary if provider integration is available
- idempotency key
- sync status/error queue

### Critical rules
- This ticket does not calculate taxes or net pay.
- Locking a payroll period must prevent silent modification of already-exported inputs; late changes should be queued/flagged for next action.
- Provider IDs are external identifiers only.
- Sensitive bank/tax fields should be added only when needed and separately permissioned.

### Edge cases
- Change entered after cutoff but effective inside period
- Re-export same period
- Provider timeout
- Employee missing required mapping
- Multiple legal entities/providers
- No time module enabled

### Acceptance criteria
- [ ] Payroll admin can configure canonical earning/deduction mappings.
- [ ] Payroll period can be opened, validated and locked.
- [ ] Export contains only authorized required payroll input data.
- [ ] Re-export/retry behavior is idempotency-friendly.
- [ ] Late changes after lock are surfaced, not silently ignored.
- [ ] Provider sync status is distinct from HR state.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-019] Payroll-result ingestion & employee payslip history


**Recommended label:** `enhancement`

### Goal
Close the payroll integration loop by importing finalized provider results back into HR for employee history and reporting.

### Depends on
- MVP-018
- MVP-013

### In scope
Payroll result ingestion
- provider/run reference
- employment
- gross
- earnings breakdown
- deductions
- taxes
- net
- currency
- pay date
- source file/API reference
- finalized/version state

Payslip/document references
- upload or provider URL/tokenized reference
- secure employee access
- pay-period grouping

Validation
- match employment/external IDs
- reject unknown tenant/provider mappings
- duplicate run/result protection
- basic control-total checks

### Important rules
- Finalized payroll results behave like ledger history.
- Corrections should create new version/adjustment/reversal semantics; do not silently edit finalized numbers.
- Provider result is provider-mastered data.
- Employee can see only own payslips/results unless privileged.

### Edge cases
- Duplicate import
- Corrected payroll result
- Unknown employee mapping
- Employee terminated after pay period
- Multiple currencies
- Provider sends aggregate result with missing breakdown

### Acceptance criteria
- [ ] Payroll admin can ingest provider results.
- [ ] Duplicate import is detected/idempotent.
- [ ] Finalized results are not destructively overwritten.
- [ ] Employee can view own pay history/payslip references.
- [ ] Payroll/HR roles can report on imported results according to permission.
- [ ] Import errors are actionable and auditable.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-020] Standard HR reporting & as-of-date workforce metrics


**Recommended label:** `enhancement`

### Goal
Provide baseline operational HR reporting from the authoritative system of record.

### Depends on
- MVP-005
- MVP-006
- MVP-015
- MVP-017

### Initial reports
- Current headcount
- Headcount by legal entity/department/location
- Hires
- Terminations
- Turnover basic calculation
- Active/inactive employment status
- Vacant/filled positions
- Leave balances
- Leave usage
- Compensation history/export where authorized
- Employee roster
- Optional payroll result summary if MVP-019 is complete

### Required capabilities
- Filter by as-of date
- Filter by legal entity, department, location
- Permission-aware population and fields
- CSV export
- Saved filters optional
- Clearly define metric formulas in UI/documentation

### Architecture
- MVP may query transactional store if performance is acceptable.
- Design metric/query interfaces so a separate analytics store can be introduced later.
- Do not collapse effective-dated history into “current only” reporting structures that prevent trend analysis.

### Security
- Report results must use the same authorization policy as record views.
- Aggregate reports must consider small-cohort privacy where sensitive fields are involved.
- Compensation exports need explicit export permission.

### Edge cases
- Employee with multiple employments
- Future-dated termination
- Rehire in same period
- Department transfer
- Multiple currencies in compensation report

### Acceptance criteria
- [ ] HR can run current and as-of-date headcount reports.
- [ ] Filters work by legal entity/department/location.
- [ ] Unauthorized users cannot broaden report population through URL/query manipulation.
- [ ] Exports contain only permitted fields.
- [ ] Report formulas are documented and testable.
- [ ] Historical reports use effective-dated data correctly.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-021] Privacy, retention & data-rights administration console


**Recommended label:** `enhancement`

### Goal
Represent compliance as data, rules and evidence by building configurable retention and subject-right workflows into the HR platform.

### Depends on
- MVP-003
- MVP-004
- MVP-005
- MVP-013
- MVP-020

### In scope
Record classification
- retention class
- jurisdiction
- retention trigger
- expiry date
- legal hold
- deletion/anonymization status

Data-right workflow
- locate a person/data subject
- export their data
- correction request support
- restriction status hook
- delete/anonymize where permitted
- record exceptions where statutory retention prevents deletion
- audit every action

Privacy metadata hooks
- purpose/lawful-basis metadata where relevant to tenant configuration
- notices/consent hooks without building a full consent-management product
- sensitive-data classification

### Critical rules
- A privacy request must not automatically delete legally retained payroll, wage or employment records.
- Legal hold overrides ordinary deletion schedule.
- Deletion/anonymization should be domain-aware, not a blind cascading database delete.
- Audit evidence itself may have separate retention requirements.
- Data minimization should be considered in new fields and exports.

### UI
- Privacy/admin console
- Search subject
- Data inventory summary by domain
- Export package action
- Retention decision/exception display
- Legal hold toggle with authorization/reason
- Action timeline

### Edge cases
- Former employee with payroll records still under retention
- Same person with multiple employments
- Legal hold placed after deletion request
- Document file retained while profile fields anonymized
- Cross-jurisdiction employment

### Acceptance criteria
- [ ] Record classes can carry retention metadata.
- [ ] Admin can initiate subject export.
- [ ] Delete/anonymize flow checks retention and legal hold.
- [ ] Exceptions are visible and auditable.
- [ ] Sensitive fields are not exposed merely because privacy admin can run workflow metadata.
- [ ] No single generic delete operation can erase all historical HR evidence.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-022] Backup, restore & business-continuity controls


**Recommended label:** `enhancement`

### Goal
Protect the authoritative employee system of record against data loss, corruption and operational failure.

### Depends on
- MVP-001
- Major core persistence schema stable enough to validate restore

### In scope
- Automated database backups
- Secure backup storage
- Backup encryption according to platform capability
- Retention schedule
- Restore procedure
- Periodic restore verification
- Object/document storage backup/recovery strategy
- Environment configuration backup guidance
- Basic disaster-recovery runbook
- Recovery Point Objective / Recovery Time Objective targets documented for MVP
- Operational ownership and failure alerting

### Important rules
- A backup is not considered valid until restore has been tested.
- Restore process must preserve tenant isolation.
- Secrets should use the secrets platform's recovery approach, not be dumped into ordinary backups.
- Backup retention must align with privacy/retention design.

### Suggested verification
- Automated scheduled DB backup
- Restore to isolated test environment
- Run integrity checks:
  - tenant counts
  - employment relationships
  - audit event presence
  - document metadata
  - foreign key consistency
- Record verification result

### Edge cases
- Database restored but object files missing
- Partial region/provider outage
- Schema migration between backup and restore
- Accidental tenant-level deletion
- Corrupt backup

### Acceptance criteria
- [ ] Automated backups are configured.
- [ ] At least one documented end-to-end restore test succeeds.
- [ ] Restore runbook exists.
- [ ] Backup failures are detectable.
- [ ] Sensitive backup data is access-controlled.
- [ ] Restore does not merge tenant data incorrectly.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-023] ATS accepted-candidate → pre-hire / employee conversion


**Recommended label:** `enhancement`

### Goal
Allow an external ATS to hand off an accepted candidate into the HR system without re-keying data or losing source lineage.

### Depends on
- MVP-005
- MVP-006
- MVP-009
- MVP-012

### In scope
Canonical incoming hire payload
- candidate identity
- accepted offer/hire status
- target legal entity
- job/position
- start date
- manager where available
- work location
- source metadata

External lineage
- external candidate ID
- external application ID
- external job/requisition ID
- provider/connection ID

Conversion flow
- receive/import accepted candidate
- duplicate-person detection
- review/mapping
- create or link person
- create pre-hire/employment
- attach target position
- launch onboarding template
- preserve external IDs

### MVP interface
Support one practical path:
- manual file/import using canonical ATS format, or
- one provider adapter if already available in the codebase

The architecture should still use the canonical integration model so another ATS can be added later.

### Critical rules
- Do not create a duplicate person every time the ATS sends an update.
- Retain candidate/application/job IDs separately.
- ATS remains source of recruiting data; HR becomes source for post-hire employment.
- Rejected/unaccepted candidates should not become employees through this endpoint.

### Edge cases
- Existing former employee rehired
- Candidate email differs from existing person
- Position already filled
- Start date changes before onboarding
- Duplicate webhook/import
- ATS sends accepted candidate before position exists

### Acceptance criteria
- [ ] Accepted candidate can be converted to pre-hire/employment.
- [ ] Duplicate detection is performed before person creation.
- [ ] External candidate/application/job lineage is preserved.
- [ ] Position and start-date mapping are validated.
- [ ] Onboarding can be launched from the conversion.
- [ ] Repeated delivery is idempotency-safe.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-F01] Conditional frontline MVP — timesheets, approvals & period locking


**Recommended label:** `enhancement`

### Goal
Add timesheets only if hourly/frontline or professional-services time capture is part of the initial target market.

### Depends on
- MVP-005
- MVP-006
- MVP-008
- MVP-018

### In scope
- Timesheet period
- Time entry
- Date
- Hours
- optional project/cost center hook
- employee submit
- manager approval
- rejection/correction
- lock after approval/payroll cutoff
- adjustment flow after lock
- payroll export mapping

### Suggested states
draft → submitted → approved → locked

Rejected returns to editable state with history.

### Important rules
- Approved/locked time should not be destructively rewritten.
- Corrections after lock create explicit adjustment semantics.
- All entries must be timezone/date consistent.
- Do not build advanced overtime/break/penalty calculations in this ticket.

### Edge cases
- Employee changes manager mid-period
- Partial period due to hire/termination
- Duplicate time entry import
- Correction after payroll export
- Concurrent jobs/assignments

### Acceptance criteria
- [ ] Employee can enter and submit time.
- [ ] Manager can approve/reject authorized team timesheets.
- [ ] Approved period can be locked.
- [ ] Locked corrections are explicit and auditable.
- [ ] Payroll export can include approved time.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---

## [MVP-F02] Conditional frontline MVP — clock-in/out & punch corrections


**Recommended label:** `enhancement`

### Goal
Provide basic punch capture for frontline users when real-time attendance is required in the initial product.

### Depends on
- MVP-F01

### In scope
- Clock in
- Clock out
- Optional break start/end if simple
- Current punch status
- Punch history
- Missed-punch correction request
- Manager correction/approval
- Convert approved punches into time entries
- Device/user metadata hooks

### Out of scope
- Geofencing
- Biometric verification
- Kiosk fleet management
- Advanced attendance exceptions
- Overtime law engine
- Meal/rest premium calculation
- Shift scheduling

### Important rules
- Preserve original punch and corrected punch evidence.
- Store timestamps in a normalized format while retaining local timezone context.
- Prevent obvious duplicate clock-in states.
- Correction must identify actor/reason.

### Edge cases
- Overnight shift
- User forgets clock out
- Network retry causes duplicate punch request
- Daylight saving transition in supported locales
- Employee terminated while clocked in

### Acceptance criteria
- [ ] Employee can clock in/out.
- [ ] Duplicate/current-state validation works.
- [ ] Punches can be converted into timesheet entries.
- [ ] Corrections preserve original values and audit history.
- [ ] Manager correction flow is permission-aware.


### Global definition of done
Unless explicitly superseded above, this issue is complete only when:
- [ ] Tenant isolation is enforced for all new data.
- [ ] Server-side authorization is implemented.
- [ ] Relevant business mutations are audited.
- [ ] Loading, empty, validation, permission-denied and error UI states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Historical records are not silently overwritten where effective dating/history applies.
- [ ] No secrets or sensitive PII are written to application logs.
- [ ] Database/schema changes include migrations.
- [ ] `bun`/project lint and build checks pass.
- [ ] New configuration/environment requirements are documented.


---


## Manual GitHub creation notes

When creating these manually:

1. Create `MVP-000` first and use it as the parent tracking issue.
2. Copy each `## [MVP-xxx] ...` section into a separate GitHub issue.
3. Keep the `MVP-xxx` code in the title even if GitHub assigns a different numeric issue number.
4. Add links back into the checklist in `MVP-000`.
5. Use the existing `enhancement` label initially; add area labels later if useful.
6. For implementation, start with `MVP-001` and follow dependency order rather than trying to build every screen in parallel.
7. Only create `MVP-F01` and `MVP-F02` as required MVP work if hourly/frontline employees are part of the initial customer profile.
