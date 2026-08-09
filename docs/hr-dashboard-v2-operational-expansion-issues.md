# HR Dashboard V2 — Operational Expansion GitHub Issue Backlog

> **Phase:** Post-MVP / Operational Expansion
>
> **Source basis:** the supplied *Comprehensive Feature Blueprint for an HR Management SaaS Platform*.
>
> **How to use:** create one GitHub issue per `## [OPS-xxx]` section. Keep the `OPS-xxx` code in the title so implementation order remains obvious even when GitHub assigns unrelated issue numbers.
>
> **Scope note:** functional scope and phase placement come from the blueprint. Specific table names, API shapes, state names and implementation breakdowns below are **suggested implementation details** intended to make the tickets actionable.

## Why this is the next phase

The blueprint's recommended build sequence places **Operational Expansion** immediately after the Core MVP, with the objective of winning larger operational customers. It explicitly lists:

- Timesheets
- Attendance
- Payroll reconciliation
- Accounting integration
- SSO / SCIM
- Public API / webhooks
- HR cases
- Benefits administration
- Performance

### Important sequencing nuance from the blueprint

The high-level product-layer table also mentions **scheduling** and **compensation cycles** under Operational Expansion. However, the blueprint's final recommended build sequence moves both **scheduling** and **compensation cycles** into the later **Workforce Expansion** stage.

This backlog follows the **recommended build sequence**:
- build operational depth first;
- then hand off to Workforce Expansion for scheduling, overtime/break/differential rules, compensation cycles, native ATS, learning, skills, engagement, advanced analytics and mobile.

## Relationship to the MVP backlog

If the conditional MVP tickets were already implemented:

- `MVP-F01` Timesheets → mark `OPS-001` largely satisfied and use it as a hardening/gap-check ticket.
- `MVP-F02` Clock-in/out → mark `OPS-002` largely satisfied and use it as a hardening/gap-check ticket.

If those conditional MVP tickets were only written but not implemented, keep `OPS-001` and `OPS-002` as normal implementation work.

## Recommended implementation sequence

| Order | Ticket | Area |
|---:|---|---|
| 0 | OPS-000 | Operational Expansion roadmap |
| 1 | OPS-001 | Timesheet core & approval lifecycle |
| 2 | OPS-002 | Clock-in/out & punch correction |
| 3 | OPS-003 | Attendance exceptions & exception resolution |
| 4 | OPS-004 | Time-to-pay controls & payroll-ready time outputs |
| 5 | OPS-005 | Payroll precheck, validation & control totals |
| 6 | OPS-006 | Payroll reconciliation & close workflow |
| 7 | OPS-007 | Payroll-to-GL mapping & journal preview |
| 8 | OPS-008 | Accounting integration & posting reconciliation |
| 9 | OPS-009 | Enterprise SSO with SAML/OIDC |
| 10 | OPS-010 | SCIM provisioning, deprovisioning & reconciliation |
| 11 | OPS-011 | Public API platform: auth, scopes, versioning & pagination |
| 12 | OPS-012 | Public Core HR API endpoints |
| 13 | OPS-013 | Webhook subscriptions, delivery, retries & replay |
| 14 | OPS-014 | HR case management core |
| 15 | OPS-015 | HR case routing, SLA & correspondence controls |
| 16 | OPS-016 | Benefits catalog & plan configuration |
| 17 | OPS-017 | Benefits eligibility engine |
| 18 | OPS-018 | Dependents & beneficiaries |
| 19 | OPS-019 | Open enrollment |
| 20 | OPS-020 | Life-event enrollment |
| 21 | OPS-021 | Performance review templates & cycle configuration |
| 22 | OPS-022 | Self-review / manager-review workflow & signoff |
| 23 | OPS-023 | Performance history, permissions & reporting |
| — | NEXT | Workforce Expansion handoff |

## Cross-cutting rules inherited from MVP

All post-MVP work must preserve the architectural foundations already established:

1. Tenant and legal-entity isolation.
2. Effective-dated employment facts.
3. Role + scope + action + field-sensitive authorization.
4. Immutable/auditable business history.
5. Configurable workflow infrastructure.
6. Canonical internal HR data model.
7. External IDs as mappings, not primary business keys.
8. HR lifecycle state separate from integration-delivery state.
9. Versioned rules/policies where historical reproducibility matters.
10. Privacy/retention controls for sensitive HR records.
11. Idempotent integration behavior.
12. Append/adjust/reverse semantics for finalized financial or time records.

---

## [OPS-000] Operational Expansion implementation roadmap

**Recommended label:** `enhancement`

### Goal

Track the complete post-MVP Operational Expansion phase and make the dependency order explicit.

### Phase objective

Move the product from a credible HR system of record into a broader operational HCM platform capable of supporting:

- hourly/time-based operations;
- stronger payroll and finance controls;
- enterprise identity lifecycle;
- customer integrations;
- HR service delivery;
- benefits administration;
- structured performance reviews.

### Included epics

- Time & attendance
- Payroll reconciliation
- Accounting integration
- Enterprise SSO / SCIM
- Public API / webhooks
- HR cases
- Benefits administration
- Performance reviews

### Explicitly deferred to Workforce Expansion

Per the blueprint's final build-sequence table:

- Shift scheduling
- Overtime/break/differential rule engine
- Compensation review cycles
- Native ATS
- Learning
- Skills
- Engagement
- Advanced analytics
- Mobile application

### Explicitly deferred beyond this phase

- Full multi-country native payroll
- Statutory filings/country payroll packs
- Carrier-scale benefits feeds
- Global payroll orchestration
- Succession
- Enterprise service delivery portal
- Advanced segregation-of-duties policies
- Data residency
- AI layer

### Tracking checklist

- [ ] OPS-001
- [ ] OPS-002
- [ ] OPS-003
- [ ] OPS-004
- [ ] OPS-005
- [ ] OPS-006
- [ ] OPS-007
- [ ] OPS-008
- [ ] OPS-009
- [ ] OPS-010
- [ ] OPS-011
- [ ] OPS-012
- [ ] OPS-013
- [ ] OPS-014
- [ ] OPS-015
- [ ] OPS-016
- [ ] OPS-017
- [ ] OPS-018
- [ ] OPS-019
- [ ] OPS-020
- [ ] OPS-021
- [ ] OPS-022
- [ ] OPS-023

### Exit criteria

Operational Expansion is complete when the system can:

1. capture/approve operational time and resolve attendance exceptions;
2. reconcile payroll provider results against HR/payroll inputs;
3. produce and post controlled payroll journals to accounting;
4. support enterprise SSO and automated identity provisioning/deprovisioning;
5. expose a scoped, versioned customer API and reliable webhooks;
6. manage HR cases with routing/SLA controls;
7. administer benefits eligibility and enrollment without carrier-scale feeds;
8. run and retain structured performance-review cycles.

---

## [OPS-001] Timesheet core, submission, approval & locking

**Recommended label:** `enhancement`

### Blueprint basis

Timesheets are listed as `MVP*` for hourly/frontline use cases and again in the Operational Expansion build stage. The blueprint workflow is:

`Enter/import time → validate → approve → lock`

### Goal

Provide production-grade timesheets for employees, managers and payroll, or harden the conditional MVP implementation if `MVP-F01` already exists in code.

### Depends on

- MVP employee/employment model
- MVP manager hierarchy
- MVP workflow/approval engine
- MVP audit history
- MVP payroll export foundation

### In scope

- Timesheet periods
- Employee time entry
- Import time entries
- Submit/recall before approval
- Manager approval/rejection
- Payroll/HR override with explicit permission
- Approved/locked states
- Lock by payroll cutoff
- Correction/adjustment workflow after lock
- Optional project/cost-center allocation hook
- Time totals by day and period
- Audit trail

### Suggested state model

`DRAFT → SUBMITTED → APPROVED → LOCKED`

Additional transitions:
- `SUBMITTED → REJECTED → DRAFT`
- `APPROVED → LOCKED`
- post-lock correction creates an adjustment rather than rewriting the locked original

### Suggested entities

`timesheet`
- id
- tenant_id
- employment_id
- period_start
- period_end
- status
- submitted_at
- approved_at
- approved_by
- locked_at
- payroll_period_id nullable

`time_entry`
- id
- timesheet_id
- work_date
- start/end nullable
- quantity_hours
- project/cost_center nullable
- source
- original_entry_id nullable for correction lineage

### Business rules

- Approved time must remain explainable.
- Locked time is immutable through normal edit flows.
- Post-lock corrections must preserve the original value.
- Manager approval uses effective reporting relationships where practical.
- Time entries must be attached to the correct employment, not merely person.
- Timezone/date rules must be explicit.

### UI

- Employee weekly/period timesheet
- Manager team approval queue
- Payroll locked-period view
- Rejection reason
- Correction history
- Totals and validation warnings

### Edge cases

- Hire/termination inside the period
- Manager changes mid-period
- Multiple employments
- Overnight entries
- Duplicate imported entry
- Approved time changed after payroll export
- Partial submission

### Acceptance criteria

- [ ] Employee can enter and submit time.
- [ ] Manager can approve/reject only permitted workers.
- [ ] Approved time can be locked.
- [ ] Locked entries cannot be silently edited.
- [ ] Adjustments preserve original entries and actor/reason.
- [ ] Payroll export can consume only approved/locked time according to configuration.
- [ ] Imported and manually entered time are distinguishable by source.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-002] Clock-in/out, punch history & correction workflow

**Recommended label:** `enhancement`

### Blueprint basis

Clock-in/out is `MVP*` for frontline workforces. The blueprint workflow is:

`Punch → break → correction → approval`

### Goal

Add or harden basic attendance capture without prematurely building the advanced WFM rule engine.

### Depends on

- OPS-001
- MVP authentication
- MVP employee/employment model
- MVP manager hierarchy

### In scope

- Clock in
- Clock out
- Basic break start/end
- Current punch state
- Punch history
- Duplicate-request protection
- Missed-punch correction request
- Manager/HR correction approval
- Conversion to time entries
- Device/source metadata hooks
- Audit trail

### Explicitly out of scope

- Geofencing
- Biometric verification
- Kiosk fleet management
- Shift scheduling
- Overtime rules
- Break-law premiums
- Shift differentials
- Penalty rates

### Suggested model

`punch_event`
- id
- employment_id
- type: CLOCK_IN / CLOCK_OUT / BREAK_START / BREAK_END
- occurred_at_utc
- local_timezone
- source
- device metadata safe subset
- idempotency_key
- correction_of_event_id nullable

### Important rules

- Original punch evidence is never overwritten.
- Corrected punch must identify reason, actor and approval.
- Store canonical timestamp plus timezone context.
- Punch retry must not create duplicate business events.
- A punch belongs to an employment.

### Edge cases

- Overnight work
- Employee never clocks out
- Network retry
- Employee clocks in on two devices
- Daylight-saving transition
- Employment terminates while clocked in

### Acceptance criteria

- [ ] Employee can clock in/out.
- [ ] Invalid duplicate state transitions are blocked.
- [ ] Punches convert to timesheet entries.
- [ ] Correction workflow preserves original values.
- [ ] Manager/HR approval is scoped and audited.
- [ ] Retried requests are idempotency-safe.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-003] Attendance exceptions & resolution workflow

**Recommended label:** `enhancement`

### Blueprint basis

The feature catalog defines Attendance Exceptions as:

`Detect lateness/missed punch → resolve → audit`

and classifies it as an Advanced, high-value workforce-management capability.

### Goal

Convert raw punches/timesheet data into a manageable exception queue without building the full scheduling/pay-rule engine.

### Depends on

- OPS-001
- OPS-002
- MVP workflow engine

### In scope

Initial exception types:
- missing clock-in
- missing clock-out
- overlapping punches
- implausible/invalid sequence
- timesheet/punch mismatch
- unapproved time at cutoff
- late/missed punch only where a basic expected-time reference exists

Exception lifecycle:
- open
- assigned
- resolved
- dismissed with reason
- reopened where appropriate

### Suggested model

`attendance_exception`
- employment_id
- work_date
- exception_type
- severity
- source_record_ids
- status
- assigned_to
- resolution_type
- resolution_reason
- resolved_by
- resolved_at

### Business rules

- Exceptions are evidence, not payroll calculations.
- Resolution that changes time must use correction/adjustment semantics.
- The system must retain detection and resolution history.
- Avoid claiming legal overtime/break violations in this phase.

### UI

- Manager exception inbox
- HR/payroll exception dashboard
- Worker/date filters
- Linked punches/timesheet context
- Resolve/correct/dismiss actions

### Acceptance criteria

- [ ] System can detect configured basic attendance exceptions.
- [ ] Managers see only their authorized population.
- [ ] Resolution is auditable.
- [ ] Time corrections preserve original evidence.
- [ ] Exception state is independent of timesheet approval state.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-004] Time-to-pay controls & payroll-ready time outputs

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint's time-to-pay workflow is:

`Capture/import time → rule evaluation → employee/manager corrections → approval → lock → payroll input`

For this phase, sophisticated overtime/break/differential rules remain deferred to Workforce Expansion.

### Goal

Make approved time operationally safe for payroll-provider export.

### Depends on

- OPS-001
- OPS-003
- MVP payroll-provider export/API foundation

### In scope

- Payroll period ↔ timesheet period mapping
- Time input cutoff
- Eligibility/readiness checks
- Approved/locked-only export policy
- Late-change detection
- Payroll input version
- Control totals by:
  - worker count
  - total hours
  - earning/time code
- Time export status
- Re-export/retry controls
- Reconciliation reference to OPS-005/006

### Explicitly out of scope

- Country overtime calculation
- Break/rest legal interpretation
- Shift differential calculation
- Penalty rates

### Business rules

- A payroll export must identify the exact approved time version used.
- Later time changes must be flagged as post-cutoff/post-export changes.
- Export retries must not duplicate provider inputs where provider supports idempotency.
- HR/time state and provider-delivery state stay separate.

### Acceptance criteria

- [ ] Payroll admin can see time-readiness checks before export.
- [ ] Only eligible approved/locked time is exported.
- [ ] Export control totals are stored.
- [ ] Late changes are surfaced.
- [ ] Re-export is versioned/idempotency-friendly.
- [ ] Export result links to the source time records/version.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-005] Payroll precheck, validation & control totals

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint lists Payroll Precheck/Anomaly Validation as an advanced payroll control:

`Compare current vs prior → flag anomalies → approve`

The Operational Expansion stage explicitly includes payroll reconciliation.

### Goal

Introduce deterministic payroll prechecks before a payroll run is submitted or reconciled.

### Depends on

- MVP compensation history
- MVP payroll export
- MVP payroll-result ingestion
- OPS-004 if time is enabled

### In scope

Precheck categories:
- missing payroll mapping
- missing compensation/rate
- unexpected inactive/terminated worker in run
- active worker unexpectedly missing
- duplicate worker/result
- currency mismatch
- large gross/net change threshold
- large hours change threshold
- late effective-dated change after cutoff
- unmatched external identifier

Control totals:
- employees in run
- gross
- deductions
- tax
- net
- time/hours where available
- by legal entity / provider / currency

### Suggested model

`payroll_check`
- payroll_run_id
- check_type
- severity
- employment_id nullable
- expected_value
- actual_value
- status
- resolution/comment
- resolved_by

### Business rules

- Rules are configurable thresholds, not statutory payroll calculations.
- A warning may be overridden by authorized payroll user with reason.
- A blocking error must prevent close/submission until resolved or explicitly permitted.
- Precheck output is auditable.

### Acceptance criteria

- [ ] Payroll run displays deterministic prechecks.
- [ ] Critical mapping/data errors can block progression.
- [ ] Threshold anomalies are reviewable.
- [ ] Overrides require authorization and reason.
- [ ] Control totals are stored with the run.
- [ ] Precheck history remains linked to the payroll-run version.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-006] Payroll reconciliation & close workflow

**Recommended label:** `enhancement`

### Blueprint basis

Payroll reconciliation is defined as:

`Gross/net/tax/provider totals → reconcile → approve close`

It is explicitly part of Operational Expansion.

### Goal

Give Payroll and Finance a formal control process for comparing expected payroll inputs/results and approving close.

### Depends on

- OPS-005
- MVP payroll-result ingestion
- MVP workflow/audit infrastructure

### In scope

- Reconciliation run per payroll run
- Compare provider result totals with imported/expected totals
- Reconcile worker counts
- Reconcile gross/net/deductions/taxes
- Difference thresholds
- Unmatched employee/result queue
- Reconciliation status
- Payroll approval/close
- Reopen by privileged role with reason
- Reconciliation report/export

### Suggested states

`OPEN → IN_REVIEW → RECONCILED → APPROVED/CLOSED`

Optional:
`REOPENED`

### Business rules

- Close does not rewrite provider results.
- Corrections create new result/run versions or explicit adjustments.
- Every unresolved material difference must be visible at close.
- Reopening requires elevated permission and audit trail.

### UI

- Reconciliation summary
- Difference breakdown
- Worker-level unmatched items
- Approval action
- Close checklist
- Exportable evidence

### Acceptance criteria

- [ ] Payroll admin can reconcile totals against provider results.
- [ ] Unmatched/mismatched items are visible.
- [ ] Finance/payroll approval can close the run.
- [ ] Closed run cannot be silently altered.
- [ ] Reopen requires permission/reason.
- [ ] Reconciliation evidence is exportable and audited.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-007] Payroll-to-GL mapping & journal preview

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint defines General-Ledger/Payroll Journal as:

`Map earning/deduction → account/cost center → post`

and lists accounting integration in Operational Expansion.

### Goal

Create an accounting-neutral payroll journal model before connecting to any specific accounting provider.

### Depends on

- OPS-006
- MVP department/cost-center model
- MVP payroll result model

### In scope

- Chart-of-account reference/import
- Account mappings for:
  - earnings
  - deductions
  - employer costs where results contain them
  - taxes/liabilities where results contain them
- Cost-center/department segmentation
- Debit/credit rules
- Journal generation
- Journal preview
- Balance check
- Validation errors
- Journal version
- Approval before posting

### Suggested entities

`gl_account`
`payroll_gl_mapping`
`payroll_journal`
`payroll_journal_line`

Each journal line should preserve:
- source payroll run/result
- account
- debit/credit
- currency
- legal entity
- cost center/dimension
- employee-level detail only when needed

### Business rules

- Journal must balance before posting.
- Mapping changes are versioned/effective so historical journals are reproducible.
- Do not silently remap an already-approved journal.
- Sensitive employee-level detail should not be sent to finance unless necessary.

### Acceptance criteria

- [ ] Finance can configure account mappings.
- [ ] System generates a journal from a reconciled payroll run.
- [ ] Journal is balanced or clearly blocked with errors.
- [ ] User can preview before posting.
- [ ] Journal retains mapping/version/source lineage.
- [ ] Approved journal cannot be silently regenerated with different mappings.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-008] Accounting provider integration & posting reconciliation

**Recommended label:** `enhancement`

### Blueprint basis

The integration architecture recommends configurable chart-of-accounts mapping, preview/balance before posting, and retaining the external journal ID.

### Goal

Post an approved payroll journal to an accounting system while preserving provider status and reconciliation evidence.

### Depends on

- OPS-007
- MVP canonical integration/event foundation

### In scope

- Provider-neutral accounting connector interface
- One first provider adapter OR file export if no provider is selected
- OAuth/credential boundary
- Post approved journal
- Idempotency/retry handling
- External journal ID
- Posting status
- Provider error queue
- Void/reversal reference where supported
- Verify posted total/status
- Reconciliation report

### Critical rules

- External journal ID is not internal primary key.
- Provider outage must not corrupt payroll-close state.
- Retry must not create duplicate journals.
- Credentials live in secrets boundary.
- Posting action is auditable.

### Edge cases

- Timeout after provider accepted journal
- Duplicate post retry
- Provider rejects one dimension/account
- Journal edited after attempted post
- Provider journal later deleted manually

### Acceptance criteria

- [ ] Approved journal can be exported/posted through the configured adapter.
- [ ] Provider response/external ID is retained.
- [ ] Duplicate posting is prevented.
- [ ] Failures are retryable without changing payroll business state.
- [ ] Posting/reconciliation status is visible to Finance.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-009] Enterprise SSO with SAML/OIDC

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint classifies enterprise SSO as Advanced and recommends SAML/OIDC with explicit tenant/domain mapping while keeping authentication separate from HR authorization.

### Goal

Allow enterprise customers to authenticate through their identity provider without bypassing existing HR authorization controls.

### Depends on

- MVP authentication/session controls
- MVP tenant model
- MVP RBAC

### In scope

- SAML and/or OIDC enterprise connection model
- Tenant-specific IdP configuration
- Domain/connection mapping
- Sign-in redirect
- Callback/assertion validation
- User/account matching
- Just-in-time account linking policy
- Role/group claim mapping only to allowed tenant roles
- Break-glass/local admin policy
- Connection test
- Enable/disable SSO
- Audit auth events/config changes

### Security requirements

- Authentication claim never grants unrestricted HR access by itself.
- Tenant must be resolved explicitly.
- Validate issuer/audience/signature/state/nonce as applicable.
- Prevent account takeover through email-only linking without verified rules.
- Preserve local recovery path for tenant administrators.

### Edge cases

- Same email exists in multiple tenants
- User removed from IdP but active session exists
- IdP certificate/secret rotation
- Incorrect domain mapping
- Multiple IdPs for one tenant later

### Acceptance criteria

- [ ] Tenant admin can configure/test SSO.
- [ ] User can authenticate through configured IdP.
- [ ] Existing RBAC remains authoritative after authentication.
- [ ] Invalid assertions/tokens are rejected.
- [ ] SSO can be disabled without deleting user history.
- [ ] Configuration/auth events are auditable.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-010] SCIM provisioning, deprovisioning & reconciliation

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint describes SCIM lifecycle as:

`Create/update/deactivate users/groups automatically`

with stable external IDs and deactivation rather than accidental deletion.

### Goal

Automate joiner/mover/leaver account lifecycle for enterprise customers.

### Depends on

- OPS-009
- MVP employee lifecycle events
- MVP external identifier model

### In scope

- SCIM 2.0 Users
- SCIM Groups where practical
- Stable external ID mapping
- Create account/membership
- Update profile/account fields
- Deactivate account
- Group-to-role mapping with guardrails
- Reconciliation job
- Provisioning error queue
- Idempotent repeated requests
- Audit source = SCIM/integration

### Critical rules

- Deprovision access; do not delete employee/person history.
- IT identity admin does not gain unrestricted HR data.
- Define field ownership so SCIM does not overwrite HR-mastered employment facts.
- HR termination can trigger downstream deactivation, but SCIM account state remains separate from employment state.

### Edge cases

- SCIM tries to create existing email
- Rehire/reactivation
- Group removed
- Deactivation before HR termination
- Multiple tenants/connections
- Provider sends same request twice

### Acceptance criteria

- [ ] SCIM can create/update/deactivate user access.
- [ ] Employee history is never deleted by deprovisioning.
- [ ] External IDs are connection scoped.
- [ ] Reconciliation identifies drift.
- [ ] Unauthorized fields cannot be overwritten through SCIM.
- [ ] Requests are auditable/idempotent.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-011] Public API platform: OAuth/service credentials, scopes, versioning & pagination

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint specifies Public API behavior including:

- OAuth/scoped service accounts
- cursor pagination
- idempotency
- versioning
- audit attribution

### Goal

Turn the MVP's internal integration foundations into a supported customer-facing API platform.

### Depends on

- MVP canonical domain APIs
- MVP RBAC/field permissions
- MVP audit
- MVP integration foundation

### In scope

- API client/service-account model
- OAuth or secure service credential mechanism
- Scopes
- Tenant binding
- API versioning strategy
- Consistent error envelope
- Cursor pagination
- Filtering conventions
- Rate limiting
- Idempotency keys for supported writes
- Request/correlation IDs
- API audit source attribution
- Developer/API documentation
- Credential rotation/revocation

### Security

- API scope does not bypass field/data-scope permissions.
- Service credentials are secret-managed.
- Default deny.
- Rate limits and abuse controls.
- Sensitive endpoints require explicit scopes.

### Acceptance criteria

- [ ] Tenant admin can create/revoke API credentials.
- [ ] API request resolves one tenant safely.
- [ ] Scopes restrict endpoint/action access.
- [ ] Pagination/versioning conventions are documented.
- [ ] Supported writes accept idempotency keys.
- [ ] API writes produce the same domain validation/audit behavior as UI writes.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-012] Public Core HR API endpoints

**Recommended label:** `enhancement`

### Goal

Expose the highest-value supported HR resources through the public API without creating a second domain model.

### Depends on

- OPS-011

### Initial read resources

- employees/persons
- employments
- legal entities
- departments
- locations
- job profiles
- positions
- position assignments
- reporting relationships
- compensation (privileged scope)
- leave requests/balances where authorized
- payroll result summaries where authorized

### Initial write resources

Prefer controlled domain actions rather than unrestricted CRUD:
- create/update permitted employee profile data
- create employment/pre-hire where scoped
- initiate approved employee-change flows where appropriate
- create leave request
- integration-safe writes with source attribution

### Requirements

- Effective/as-of-date query where relevant
- Stable internal IDs
- External identifier access where permitted
- Field filtering/expansion strategy
- Pagination
- Consistent validation errors
- Audit `source=public_api`

### Critical rule

Treat every API write as the same business transaction used by the UI. Do not create API-only shortcuts that bypass workflow, authorization, effective dating or audit.

### Acceptance criteria

- [ ] Core HR resources can be queried with scopes and pagination.
- [ ] Effective-dated resources support an as-of model where needed.
- [ ] Sensitive data requires explicit privileged scope.
- [ ] Writes reuse domain services/validation.
- [ ] API cannot bypass workflow-required changes.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-013] Webhook subscriptions, signed delivery, retries & replay

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint recommends webhook behavior with:

- signed payloads
- retries/backoff
- replay
- event IDs
- ordering metadata

### Goal

Allow customers and integrations to react reliably to committed HR business events.

### Depends on

- OPS-011
- MVP transactional outbox/event model

### In scope

- Webhook subscription management
- Event-type selection
- Destination URL
- Secret/signing key
- Signed requests
- Delivery event ID
- Attempt count
- Exponential/backoff retry strategy
- Retryable vs terminal failures
- Manual replay
- Delivery log
- Disable noisy/failing endpoint after policy threshold
- Event version

### Initial event families

- employee/person changes
- employment hire/change/termination
- position assignment changes
- compensation changes
- leave approval/cancellation
- payroll result finalized
- timesheet approved/locked where enabled

### Critical rules

- Publish only after committed business transaction.
- Do not leak fields the subscription is not entitled to receive.
- Payload versioning must be explicit.
- Replay must use the same event ID or clearly expose original-event linkage.

### Acceptance criteria

- [ ] Tenant can register a webhook endpoint.
- [ ] Deliveries are signed.
- [ ] Failed deliveries retry according to policy.
- [ ] Admin can inspect attempts and replay.
- [ ] Event IDs/version are stable.
- [ ] Webhook failure never rolls back HR transaction.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-014] HR case management core

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint defines HR case management as:

`Submit case → categorize → SLA → correspondence → resolution`

and places HR cases in Operational Expansion.

### Goal

Provide a secure HR service workflow for employee questions/issues without using ordinary employee notes as a substitute.

### Depends on

- MVP employee self-service
- MVP workflow/notifications
- MVP RBAC/audit
- MVP document service for attachments

### In scope

- Employee case submission
- HR-created case
- Category/subcategory
- Subject/description
- Case requester
- Affected employee where different and permitted
- Assigned HR owner/team
- Priority
- Status
- Internal notes vs employee-visible replies
- Attachments
- Resolution
- Closed/reopened
- Audit trail

### Suggested states

`NEW → TRIAGED → IN_PROGRESS → WAITING_ON_EMPLOYEE / WAITING_INTERNAL → RESOLVED → CLOSED`

### Security

- Case content is sensitive and needs its own permission boundary.
- Internal notes must never be exposed to employee requester.
- Managers should not automatically see employee HR cases.
- Attachments use document authorization.

### Edge cases

- Anonymous case is not required unless explicitly added later.
- Case concerns another employee.
- Employee terminates while case remains open.
- Case transferred to another HR team.
- Sensitive medical/payroll content.

### Acceptance criteria

- [ ] Employee can submit and view own case/replies.
- [ ] HR can triage/assign/update case.
- [ ] Internal notes are hidden from requester.
- [ ] Attachments are permission protected.
- [ ] Resolution/closure is auditable.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-015] HR case routing, SLA, queues & correspondence controls

**Recommended label:** `enhancement`

### Goal

Add operational service-management controls on top of the HR case core.

### Depends on

- OPS-014

### In scope

- Category-based routing
- Legal entity/location routing
- HR queue/team ownership
- SLA target by priority/category
- First-response and resolution targets
- Due/overdue indicator
- Escalation
- Assignment history
- Email/in-app correspondence template
- Employee reply ingestion through app
- Case search/filter
- Basic case metrics

### Suggested metrics

- open cases
- overdue cases
- time to first response
- time to resolution
- cases by category
- reopen rate

### Business rules

- SLA changes should not make old case history inexplicable.
- Escalation must not grant the assignee access outside authorized HR populations.
- Correspondence history is retained.

### Acceptance criteria

- [ ] Cases can route to configured queue/team.
- [ ] SLA due dates are calculated and visible.
- [ ] Overdue/escalated cases are identifiable.
- [ ] Assignment history is retained.
- [ ] Employee/HR correspondence is threaded and auditable.
- [ ] Basic service metrics are available.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-016] Benefits catalog & plan configuration

**Recommended label:** `enhancement`

### Blueprint basis

Benefits Catalog is defined as:

`Configure plans, coverage levels and costs`

and is the foundation for benefits administration.

### Goal

Create an effective-dated benefits catalog without yet owning carrier-scale integration.

### Depends on

- MVP legal entities
- MVP employment model
- MVP effective dating
- MVP RBAC/audit

### In scope

- Benefit plan categories
- Provider/vendor reference
- Legal entity
- Country/region hook
- Plan name/code
- Effective dates
- Coverage levels
- Employee cost
- Employer cost where configured
- Enrollment window metadata
- Plan documents/links
- Active/inactive/version behavior

### Suggested categories

- health/medical
- dental
- vision
- retirement/pension reference
- life/disability
- custom benefit

Do not hard-code a single country's benefits structure.

### Business rules

- Plan versions are effective-dated.
- Historical enrollments keep the plan/version used.
- Costs require currency/frequency.
- Benefits data needs a separate permission group.

### Acceptance criteria

- [ ] Benefits admin can create/version plans.
- [ ] Plans attach to legal entity/population.
- [ ] Coverage levels and costs are explicit.
- [ ] Old plan versions remain historically available.
- [ ] Employee can see only offered/authorized plan information.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-017] Benefits eligibility engine

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint defines Benefits Eligibility as:

`Evaluate employment/status/location/age/etc. → eligible plans`

and warns that benefits cannot safely be modeled as unrestricted selections.

### Goal

Determine which plans an employment is eligible for on a given effective date.

### Depends on

- OPS-016
- MVP employment/effective dating
- MVP policy/rules concepts

### In scope

Eligibility criteria:
- legal entity
- work location/country
- employment/worker type
- active status
- tenure/waiting period
- FTE/scheduled hours hook
- age only where lawful/required
- explicit eligibility group
- effective date

Eligibility result:
- plan
- reason/rule version
- eligibility start date
- eligibility end date if known

### Important rules

- Rules are versioned.
- Eligibility is date-dependent.
- Store enough evidence to explain why plan was offered.
- Employee cannot manually opt into an ineligible plan.

### Edge cases

- Future hire
- Mid-period status change
- Transfer between legal entities
- Hours/FTE changes
- Plan closes while employee is enrolled

### Acceptance criteria

- [ ] Eligibility can be evaluated for employment/date.
- [ ] Ineligible plans are not selectable.
- [ ] Result retains rule/version context.
- [ ] Future eligibility can be calculated for onboarding/enrollment.
- [ ] Rule changes do not rewrite historical enrollment evidence.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-018] Dependents & beneficiaries with sensitive-data controls

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint lists Dependents/Beneficiaries as part of benefits administration and notes that this introduces additional sensitive personal data.

### Goal

Model dependent/beneficiary relationships without putting their identity data directly into generic employee profile fields.

### Depends on

- OPS-016
- MVP privacy/retention controls
- MVP RBAC

### In scope

- Dependent/beneficiary record
- Relationship type
- Limited identity fields
- Date of birth where needed
- Contact fields only where needed
- Benefit-plan enrollment linkage
- Beneficiary percentage/order hook
- Effective status
- Verification/document hook
- Privacy/retention classification

### Security

- Separate permission boundary.
- Minimize collected data.
- Employee can manage own dependents where tenant policy allows.
- HR/benefits roles can access only needed fields.
- Do not expose dependent data to managers.

### Acceptance criteria

- [ ] Employee/benefits admin can create permitted dependent records.
- [ ] Dependent data is not exposed through ordinary directory/manager views.
- [ ] Enrollment can reference dependents.
- [ ] Privacy/retention metadata applies.
- [ ] Changes are audited.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-019] Open enrollment campaign & employee elections

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint defines Open Enrollment as:

`Offer plans → employee elections → validation → confirmation`

### Goal

Run a time-bounded benefits election process over an eligible employee population.

### Depends on

- OPS-016
- OPS-017
- OPS-018
- MVP workflow/notifications

### In scope

- Enrollment campaign
- Legal entity/population
- enrollment start/end
- coverage effective date
- offered plans
- employee election
- waive coverage
- dependent selection
- validation
- cost summary
- confirmation
- submission lock
- benefits-admin correction with audit
- reminder notifications
- campaign progress dashboard

### Suggested states

Campaign:
`DRAFT → SCHEDULED → OPEN → CLOSED → FINALIZED`

Election:
`NOT_STARTED → IN_PROGRESS → SUBMITTED → CONFIRMED`

### Business rules

- Only eligible plans are offered.
- Submitted election is versioned/locked except through controlled correction.
- Cost/plan version used is retained.
- Closing campaign does not delete incomplete elections.

### Acceptance criteria

- [ ] Benefits admin can launch an enrollment campaign.
- [ ] Eligible employees see correct offered plans.
- [ ] Employee can elect/waive and confirm.
- [ ] Dependents can be selected where plan permits.
- [ ] Submitted elections are historically retained.
- [ ] Admin can see completion status without unnecessary private details.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-020] Life-event benefits enrollment

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint defines Life-Event Enrollment as:

`Qualifying event → allowed changes → effective coverage`

### Goal

Allow controlled benefit changes outside annual open enrollment.

### Depends on

- OPS-019

### In scope

- Qualifying event type
- Event date
- Evidence/document hook
- Allowed election window
- Plans/changes allowed by event
- Add/remove dependent
- Coverage effective date
- Submission/approval where configured
- Event expiration
- Historical event record

### Example event types

Configurable examples:
- marriage
- birth/adoption
- loss/gain of other coverage
- relocation where relevant
- employment status change

The product should not hard-code jurisdiction-specific legal conclusions into the generic engine.

### Business rules

- Event type determines allowed changes.
- Eligibility is recalculated as of effective date.
- Expired event window blocks normal employee editing but may allow privileged correction.
- Evidence documents use document permissions/retention.

### Acceptance criteria

- [ ] Employee can initiate an allowed life event.
- [ ] System calculates election window.
- [ ] Only permitted plan changes are offered.
- [ ] Dependents can be updated where event permits.
- [ ] Effective enrollment history is preserved.
- [ ] Expired/overridden events are auditable.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-021] Performance review templates & cycle configuration

**Recommended label:** `enhancement`

### Blueprint basis

Performance Review Cycles are defined as:

`Cycle → self review → manager review → signoff`

and are part of Operational Expansion.

### Goal

Create the configuration foundation for repeatable performance-review cycles.

### Depends on

- MVP employee/employment
- MVP manager hierarchy
- MVP workflow/notifications
- MVP RBAC/audit

### In scope

Review template:
- sections
- questions
- rating scale
- required/optional fields
- employee-visible vs manager-only field
- instructions
- version

Cycle:
- name
- eligible population
- start/end
- self-review dates
- manager-review dates
- signoff date
- template version
- status

### Out of scope

- Goals module
- Continuous feedback
- Calibration/talent review
- Skills/competencies
- Succession

Those remain later roadmap items in the blueprint.

### Important rules

- Review templates are versioned/frozen for launched cycles.
- Eligibility is tied to employment/population as of defined dates.
- Review content is a sensitive permission boundary.
- A manager cannot automatically view performance records outside current/authorized scope unless historical access is explicitly designed.

### Acceptance criteria

- [ ] HR can create/version a review template.
- [ ] HR can configure a cycle and eligibility population.
- [ ] Launched cycle freezes the relevant template version.
- [ ] Performance content has its own permission group.
- [ ] Cycle dates/status are validated.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-022] Self-review, manager review, signoff & frozen historical snapshot

**Recommended label:** `enhancement`

### Goal

Execute the configured performance-review cycle from employee self-assessment through final signoff.

### Depends on

- OPS-021

### In scope

- Generate review instances
- Self review
- Submit self review
- Manager review
- Manager rating/comments
- Return/reopen before finalization where permitted
- Employee acknowledgement/signoff
- HR intervention
- Finalized/frozen snapshot
- Notification/reminders
- Audit trail

### Suggested states

`NOT_STARTED → SELF_IN_PROGRESS → SELF_SUBMITTED → MANAGER_IN_PROGRESS → MANAGER_SUBMITTED → SIGNOFF → FINALIZED`

### Business rules

- Finalized review is historical evidence and must not be silently rewritten.
- Correction/reopen requires permission/reason and creates audit history.
- Manager visibility follows authorized reporting relationship rules.
- Employee may not see manager-only content until configured stage.

### Edge cases

- Manager changes mid-cycle
- Employee terminates during cycle
- Employee on leave
- Review transferred to alternate manager
- HR finalizes incomplete review

### Acceptance criteria

- [ ] Eligible employee can complete self review.
- [ ] Authorized manager can complete manager review.
- [ ] Stage visibility rules are enforced.
- [ ] Final signoff produces frozen historical record.
- [ ] Reopen/correction is controlled and audited.
- [ ] Reminders are generated by shared notification infrastructure.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---

## [OPS-023] Performance history, permissions & standard reporting

**Recommended label:** `enhancement`

### Goal

Make completed reviews safely accessible as historical HR records and provide basic cycle reporting.

### Depends on

- OPS-022
- MVP reporting foundation

### In scope

Employee history:
- own finalized reviews
- cycle/date
- final rating where applicable
- signed/acknowledged status

Manager/HR:
- authorized team review history
- completion status
- basic rating distribution where permitted
- export with explicit permission

Standard reports:
- completion rate
- overdue reviews
- finalized reviews by department/legal entity
- rating distribution only where configured
- signoff status

### Security

- Performance content is not part of general employee-directory access.
- Payroll/IT roles should not inherit review access.
- Export requires explicit permission.
- Small-cohort privacy should be considered for rating distribution.

### Acceptance criteria

- [ ] Employee can view own finalized reviews where tenant policy permits.
- [ ] Manager/HR access follows performance-specific permission rules.
- [ ] HR can report cycle completion/status.
- [ ] Finalized review remains tied to cycle/template version.
- [ ] Performance exports are separately authorized and audited.
### Global definition of done

Unless a ticket explicitly overrides these items:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI hiding is not the security boundary.
- [ ] Business mutations and approvals are audited.
- [ ] Relevant effective dates and transaction timestamps are retained.
- [ ] Sensitive PII/financial data is not written to normal logs.
- [ ] Empty/loading/error/permission-denied states exist.
- [ ] Critical business rules and permission boundaries have automated tests.
- [ ] Retryable integration actions are idempotency-safe.
- [ ] Database/schema changes include migrations.
- [ ] No finalized payroll/time/financial evidence is destructively overwritten.
- [ ] Existing MVP workflows and reporting are regression-tested where impacted.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration and operational runbooks are documented.

---


# NEXT — Workforce Expansion backlog handoff

After `OPS-001` through `OPS-023`, the blueprint's **next recommended build stage** is Workforce Expansion.

That stage should become a separate issue document and should cover:

1. Shift scheduling
2. Overtime rule engine
3. Break/rest rule engine
4. Shift differentials / penalty rates
5. Compensation review cycles
6. Native ATS
7. Careers/job-board publishing
8. Interview scheduling
9. Learning/LMS
10. Skills and competency profiles
11. Engagement / pulse surveys
12. Advanced analytics / BI
13. Mobile application

The blueprint states the objective of this stage is to **compete with mature mid-market HCM**.

### Do not pull these into Operational Expansion by accident

Although scheduling and compensation cycles appear in the earlier broad product-layer description, the blueprint's final recommended build sequence explicitly assigns them to Workforce Expansion. Keeping them there reduces scope pressure while payroll controls, identity lifecycle, benefits and performance are stabilized first.

---

# Manual GitHub creation workflow

1. Create `OPS-000` as the tracking issue.
2. Create `OPS-001` through `OPS-023` in order.
3. Add the actual GitHub issue links back to `OPS-000`.
4. If `MVP-F01/F02` are already implemented, use `OPS-001/002` as verification/hardening tickets or close them as already satisfied after checking their acceptance criteria.
5. Keep carrier feeds, native payroll, complex WFM rules, advanced talent and AI out of this phase.
6. Start a separate `WFX-xxx` issue series for the Workforce Expansion handoff rather than continuing to overload `OPS-xxx`.
