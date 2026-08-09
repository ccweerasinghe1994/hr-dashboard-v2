# HR Dashboard V2 — Workforce Expansion GitHub Issue Backlog

> **Phase:** Workforce Expansion
>
> **Source basis:** the supplied *Comprehensive Feature Blueprint for an HR Management SaaS Platform*.
>
> **How to use this file:** create one GitHub issue per `## [WFX-xxx]` section. Keep the `WFX-xxx` code in the GitHub issue title so implementation order remains visible even if GitHub assigns unrelated issue numbers.
>
> **Source vs implementation detail:** feature priority, phase placement, key workflows, broad roles, complexity, and business-value framing are derived from the blueprint. Specific table names, endpoint shapes, state machines, event names, validation rules, and issue decomposition below are proposed implementation guidance to make each ticket actionable.

# Phase objective

The blueprint places **Workforce Expansion** immediately after Operational Expansion with the objective:

> **Compete with mature mid-market HCM**

The blueprint explicitly assigns these capability families to Workforce Expansion:

- Scheduling
- Overtime / break / differential rule engine
- Compensation cycles
- Native ATS
- Learning
- Skills
- Engagement
- Advanced analytics
- Mobile

The feature catalog also classifies several closely related capabilities as Advanced and high-value, including salary bands/grades, pay-equity analytics, goals, calibration/talent review, position/requisition synchronization, careers publishing, and interview scheduling. These are included here where they are necessary to make the Workforce Expansion capabilities coherent.

# Assumed completed foundations

This backlog assumes the Core MVP and Operational Expansion work are complete or sufficiently stable, including:

- Tenant/legal-entity isolation
- Person / employee / employment separation
- Effective dating
- Organizations, jobs, positions and reporting relationships
- RBAC and field-sensitive permissions
- Authentication, MFA, SSO and SCIM
- Immutable audit history
- Workflow/approval engine
- Notifications
- Documents
- Leave
- Compensation history
- Payroll connectivity/results/reconciliation
- Time/attendance
- Public API and webhooks
- HR cases
- Benefits administration
- Performance review cycles
- Standard reporting

# Recommended sequence

| Order | Ticket | Area |
|---:|---|---|
| 0 | WFX-000 | Workforce Expansion roadmap |
| 1 | WFX-001 | Scheduling domain & availability foundations |
| 2 | WFX-002 | Schedule builder, coverage & publishing |
| 3 | WFX-003 | Open shifts, shift swaps & approval |
| 4 | WFX-004 | Versioned workforce-rule engine foundation |
| 5 | WFX-005 | Overtime rules |
| 6 | WFX-006 | Break & rest rules |
| 7 | WFX-007 | Shift differentials & penalty rates |
| 8 | WFX-008 | Mobile/kiosk/geofenced clocking extensions |
| 9 | WFX-009 | Rule-evaluated time-to-pay output |
| 10 | WFX-010 | Salary bands & grades |
| 11 | WFX-011 | Compensation-cycle setup & budget allocation |
| 12 | WFX-012 | Manager compensation proposals & approvals |
| 13 | WFX-013 | Compensation calibration, finalization & effective posting |
| 14 | WFX-014 | Pay-equity analytics |
| 15 | WFX-015 | Native ATS domain: requisitions, candidates & applications |
| 16 | WFX-016 | Position ↔ requisition synchronization |
| 17 | WFX-017 | Careers/job-board publishing & application intake |
| 18 | WFX-018 | Interview scheduling & structured feedback |
| 19 | WFX-019 | Offer workflow & native ATS hire conversion |
| 20 | WFX-020 | Goals & alignment |
| 21 | WFX-021 | Continuous feedback & one-to-ones — optional |
| 22 | WFX-022 | Calibration / talent review |
| 23 | WFX-023 | Learning catalog, courses & assignments |
| 24 | WFX-024 | Certifications, expiry & renewal |
| 25 | WFX-025 | Skills taxonomy & competency profiles |
| 26 | WFX-026 | Skills assessment, search & gap analysis |
| 27 | WFX-027 | Engagement / pulse surveys & action plans |
| 28 | WFX-028 | Advanced analytics data model & metric layer |
| 29 | WFX-029 | Cohort, trend & workforce analytics dashboards |
| 30 | WFX-030 | Mobile application foundation & secure session model |
| 31 | WFX-031 | Mobile employee/manager workflows |

# Cross-cutting design rules

1. **Effective dating remains authoritative.** Scheduling, compensation, job/position, skills and policy-derived outcomes must respect the relevant business-effective date.
2. **Rules are versioned.** Overtime, break/rest and differential rules must identify the rule version that produced a result.
3. **Jurisdiction matters.** WFM rules must be resolvable by legal entity, work jurisdiction, worker classification, collective instrument/customer policy and effective date rather than by tenant headquarters alone.
4. **Finalized time/pay-impacting outputs are append-oriented.** Correct through adjustment/reversal instead of destructive rewriting.
5. **Sensitive domains are permission-isolated.** Compensation, performance/talent data, recruiting candidate data, learning evidence and engagement responses must not inherit broad employee-directory visibility.
6. **One domain transaction should drive downstream systems through events.** Do not tightly couple UI flows to payroll, calendar, ATS, analytics or mobile implementation details.
7. **External identifiers remain mappings.** Job-board, calendar, recruiting, LMS or mobile-provider IDs must not become internal business keys.
8. **Historical explainability is a requirement.** A reviewer should be able to determine what schedule, rule, compensation budget, review template or skill framework was in force when a decision occurred.
9. **Customer-configured rule content is not legal advice.** The platform can execute configured rules but should avoid presenting generic rule output as definitive jurisdictional compliance without a maintained country pack.
10. **Mobile is another client, not a second HR system.** It must use the same authorization, workflow, APIs and audit behavior as web.

---

## [WFX-000] Workforce Expansion implementation roadmap

**Recommended label:** `enhancement`

### Goal

Track the complete Workforce Expansion phase and keep the product boundary explicit.

### Blueprint-derived phase deliverables

- Scheduling
- Overtime/break/differential engine
- Compensation cycles
- Native ATS
- Learning
- Skills
- Engagement
- Advanced analytics
- Mobile

### Supporting Advanced capabilities included in this backlog

These appear in the blueprint's feature catalog and directly support the phase deliverables:

- Shift swaps/open shifts
- Salary bands/grades
- Pay-equity analytics
- Position/requisition synchronization
- Careers/job-board publishing
- Interview scheduling
- Goals
- Calibration/talent review
- Certifications/renewals as part of LMS depth

### Explicitly deferred to Enterprise Expansion

- Workforce/headcount planning
- Succession planning
- Enterprise HR service-delivery portal
- Benefits carrier/vendor feeds
- Large-scale delegated administration
- Regional data residency
- Advanced segregation of duties
- Extensibility/developer platform beyond the public API foundation
- Global payroll orchestration

### Explicitly separate roadmap tracks

**Country payroll packs**
- native gross-to-net
- statutory filings
- social-security/pension logic
- year-end
- retro calculations
- effective-dated tax updates

**AI/intelligence**
- permission-aware policy assistant
- workflow assistance
- anomaly explanations
- selected talent intelligence
- human review and audit controls

### Tracking checklist

- [ ] WFX-001
- [ ] WFX-002
- [ ] WFX-003
- [ ] WFX-004
- [ ] WFX-005
- [ ] WFX-006
- [ ] WFX-007
- [ ] WFX-008
- [ ] WFX-009
- [ ] WFX-010
- [ ] WFX-011
- [ ] WFX-012
- [ ] WFX-013
- [ ] WFX-014
- [ ] WFX-015
- [ ] WFX-016
- [ ] WFX-017
- [ ] WFX-018
- [ ] WFX-019
- [ ] WFX-020
- [ ] WFX-021
- [ ] WFX-022
- [ ] WFX-023
- [ ] WFX-024
- [ ] WFX-025
- [ ] WFX-026
- [ ] WFX-027
- [ ] WFX-028
- [ ] WFX-029
- [ ] WFX-030
- [ ] WFX-031

### Phase exit criteria

The phase is complete when the product can:

1. build, publish and change frontline schedules;
2. evaluate versioned overtime, break/rest and differential rules into payroll-ready time results;
3. run structured compensation-review cycles and post approved future-dated compensation changes;
4. recruit through a native ATS from requisition to accepted offer and convert the hire into Core HR;
5. manage goals, learning, skills and selected talent-review workflows;
6. run privacy-safe engagement surveys;
7. analyze historical workforce data through cohort/trend analytics;
8. provide key employee and manager workflows through a secure mobile application.

---

## [WFX-001] Scheduling domain, worker availability & staffing foundations

**Recommended label:** `enhancement`

### Blueprint basis

Shift Scheduling is an **Advanced**, **High-complexity**, **High-business-value** capability with the key workflow:

`Forecast need → build schedule → publish → swap/approve`

### Goal

Create the scheduling data model and constraints before implementing the schedule-builder UI.

### Depends on

- OPS time/attendance
- MVP employment/positions
- MVP locations
- MVP reporting relationships
- MVP leave/holiday calendars
- MVP effective dating

### In scope

Scheduling objects:
- schedule period
- shift
- shift assignment
- shift template
- worker availability
- unavailability
- required headcount/coverage placeholder
- location/worksite
- role/job/position requirement
- published vs draft schedule version

Worker scheduling context:
- active employment
- eligible position/job
- work location
- FTE/scheduled-hours reference
- approved leave
- availability preferences
- employment start/end date

### Suggested entities

`schedule_period`
- tenant_id
- location_id
- period_start
- period_end
- timezone
- status
- version
- published_at

`shift`
- schedule_period_id
- start_at
- end_at
- local_timezone
- location_id
- required_job_profile_id nullable
- required_headcount
- status

`shift_assignment`
- shift_id
- employment_id
- status
- assignment_source
- assigned_by
- assigned_at

`worker_availability`
- employment_id
- day/date pattern
- available_from/to
- effective dates
- preference vs hard-unavailable flag

### Business rules

- A shift belongs to a specific local timezone/worksite context.
- Scheduling must respect employment effective dates.
- Approved leave should block or warn on conflicting assignment according to tenant policy.
- Draft schedule changes must not silently change a previously published version.
- Schedule history must remain reconstructable after edits.
- Avoid embedding overtime/pay rules in this domain; they are evaluated by WFX-004+.

### Edge cases

- Overnight shifts
- DST transition
- Employee with multiple employments
- Employee transfers location during schedule period
- Position ends before shift
- Leave approved after draft schedule created
- Worker availability changes after schedule published

### Acceptance criteria

- [ ] Core scheduling entities exist and are tenant-scoped.
- [ ] Availability can be stored with effective dates.
- [ ] Shift assignment validates employment/date compatibility.
- [ ] Draft and published schedule versions are distinguishable.
- [ ] Scheduling timestamps preserve local timezone context.
- [ ] Approved leave can be surfaced as a scheduling conflict.
- [ ] Historical published schedule can be reconstructed.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-002] Schedule builder, staffing coverage & publishing

**Recommended label:** `enhancement`

### Goal

Allow managers to construct and publish schedules against locations, jobs/positions and staffing requirements.

### Depends on

- WFX-001
- MVP workflow/notifications
- OPS mobile/public API foundations as available

### In scope

Schedule builder:
- create shifts manually
- generate shifts from templates
- copy previous period
- assign worker
- unassign worker
- drag/drop or equivalent editing
- duplicate/copy shift
- coverage indicator
- conflict warnings
- draft save

Validation:
- employment inactive
- leave conflict
- availability conflict
- overlapping shift
- location/job mismatch
- scheduled-hours warning
- rule-engine preview hook for future WFX rules

Publish:
- publish schedule version
- notify workers
- record publisher/time
- show worker schedule
- controlled edit/republish after publication

### UI requirements

Manager:
- daily/weekly schedule views
- location/team filter
- unassigned shifts
- worker availability
- conflict indicators
- draft/published state
- coverage summary

Employee:
- published upcoming shifts
- shift detail
- schedule change notification

### Business rules

- Publishing creates a stable schedule version.
- Later edits create a revised version/republish event.
- Workers should not see unpublished schedule data unless explicitly permitted.
- The builder should warn, not silently auto-resolve, ambiguous staffing conflicts.
- Pay-rule calculations remain separate.

### Edge cases

- Manager publishes then immediately changes shift
- Worker moves teams
- Open position with no worker
- Two managers editing same schedule
- Very large location schedule
- Shift crosses schedule-period boundary

### Acceptance criteria

- [ ] Manager can create and edit a draft schedule.
- [ ] Coverage and assignment conflicts are visible.
- [ ] Manager can publish an auditable schedule version.
- [ ] Employees see only published schedule.
- [ ] Republish preserves prior published history.
- [ ] Notifications are emitted for publish/material changes.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-003] Open shifts, shift swaps & approval workflow

**Recommended label:** `enhancement`

### Blueprint basis

Shift Swaps/Open Shifts are an Advanced capability with workflow:

`Offer/request swap → eligibility check → approval`

### Goal

Reduce manager scheduling administration while preserving worker eligibility, auditability and rule checks.

### Depends on

- WFX-001
- WFX-002
- MVP workflow engine
- MVP notifications

### In scope

Open shifts:
- mark shift open
- eligible worker population
- employee claim/request
- manager approval or auto-approve policy hook
- withdraw request
- fill shift

Shift swaps:
- employee offers assigned shift
- request direct swap or marketplace-style offer
- receiving employee accepts
- eligibility/conflict validation
- manager approval
- final schedule update
- notifications

### Eligibility checks

- active employment
- correct location/job/position eligibility
- no overlapping assigned shift
- no approved leave conflict
- availability
- future WFM-rule warning hook
- maximum scheduled-hours warning hook

### Business rules

- Swap request does not alter published schedule until approved/completed.
- Final swap creates a new schedule version or auditable revision.
- Do not expose unnecessary employee information in open-shift marketplace.
- Approval and rejection reasons should be retained where entered.

### Edge cases

- Two employees claim same open shift
- Worker becomes unavailable after requesting
- Manager edits source shift while swap pending
- One participant terminates
- Rule evaluation changes before approval

### Acceptance criteria

- [ ] Employee can view eligible open shifts.
- [ ] Employee can request an open shift.
- [ ] Assigned worker can initiate a swap.
- [ ] Eligibility/conflicts are checked before finalization.
- [ ] Manager approval uses shared workflow controls.
- [ ] Completed swap updates published schedule with audit history.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-004] Versioned workforce-rule engine foundation

**Recommended label:** `enhancement`

### Goal

Create a generic, versioned rule-evaluation foundation for overtime, breaks/rest and shift differentials without hard-coding one country's law into time-entry code.

### Depends on

- OPS time/attendance
- WFX scheduling foundations
- MVP effective dating
- MVP legal entity/location
- MVP custom metadata
- MVP audit

### Blueprint architectural requirement

Compliance should be represented as **data, rules, versioned policy and evidence**. Workforce rules may depend on jurisdiction, worker classification and effective date.

### In scope

Rule metadata:
- rule set
- rule type
- version
- effective dates
- jurisdiction
- legal entity
- location
- employment/worker classification
- job/grade hooks
- collective agreement/customer policy hooks
- priority/order
- source/version metadata
- active/deprecated status

Evaluation:
- canonical time facts as input
- deterministic rule selection
- evaluation trace
- output facts
- warnings/errors
- rule-version reference
- recalculation/version behavior

### Suggested resolution order

A configurable resolver should be capable of considering:

`tenant → legal entity → work jurisdiction → employment type/classification → industry/collective instrument/customer policy → effective date`

### Business rules

- Existing historical results must retain the rule version used.
- Publishing a new rule version must not silently recalculate finalized historical payroll/time outputs.
- Draft preview and finalized evaluation should be distinguishable.
- Rule engine should output facts/premiums; payroll provider/native payroll can consume them later.
- Customer-configured rules should not be labeled as legal compliance guarantees.

### Acceptance criteria

- [ ] Rules can be versioned and effective-dated.
- [ ] Rule resolution is deterministic and testable.
- [ ] Evaluation result stores rule/version lineage.
- [ ] Historical finalized result is not silently changed by a new rule version.
- [ ] Evaluation trace can explain why a rule applied.
- [ ] Rule framework is extensible to overtime, breaks and differentials.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-005] Overtime rule configuration & premium-time evaluation

**Recommended label:** `enhancement`

### Blueprint basis

Overtime Rules are Advanced/High-value with the workflow:

`Classify time → evaluate daily/weekly rules → generate premium`

The blueprint notes they are highly jurisdiction-dependent and payroll-sensitive.

### Goal

Evaluate configured overtime rules against approved time and produce payroll-ready premium classifications.

### Depends on

- WFX-004
- OPS approved/locked time
- WFX-001 scheduling where schedule context is needed

### In scope

Configurable concepts:
- workweek definition
- daily threshold
- weekly threshold
- consecutive-day hook
- premium multiplier/classification
- eligible worker classification
- included/excluded time types
- stacking/precedence policy
- effective dates

Evaluation output:
- regular hours
- overtime hours
- premium hours/type
- source time-entry references
- rule/version
- calculation trace

### Important rules

- Do not hard-code only the U.S. 40-hour model; the platform model must support different customer/country packs.
- Avoid double-counting the same hour across daily/weekly rules unless rule configuration explicitly permits it.
- Rounding policy must be explicit.
- Finalized payroll input should reference a frozen evaluation version.
- Post-lock corrections trigger an adjustment/re-evaluation path.

### Edge cases

- Overnight shift
- Workweek boundary
- Employee changes classification
- Multiple employments
- Paid leave included/excluded from overtime base
- Two applicable overtime rules
- Backdated correction after payroll close

### Acceptance criteria

- [ ] HR/payroll admin can configure versioned overtime rules.
- [ ] Approved time can be classified into regular/premium output.
- [ ] Output retains source time and rule lineage.
- [ ] Precedence/double-count protection is tested.
- [ ] Historical finalized overtime result remains stable.
- [ ] Post-close correction creates an adjustment path.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-006] Break & rest rule evaluation and violation evidence

**Recommended label:** `enhancement`

### Blueprint basis

Break and Rest Rules are Advanced/High-value with workflow:

`Schedule/capture breaks → identify violations/premiums`

### Goal

Evaluate configured break/rest requirements and produce auditable exceptions or premium outputs.

### Depends on

- WFX-004
- OPS punch/time capture
- WFX-001 scheduling where scheduled shift context exists

### In scope

Rule concepts:
- minimum shift length before break required
- meal/rest break type
- minimum break duration
- timing window
- maximum continuous work
- minimum rest between shifts
- required vs optional
- paid/unpaid metadata
- violation handling
- premium/result code hook
- jurisdiction/classification/effective dates

Evaluation:
- compare schedule, punch and approved time facts
- identify missing/short/late break
- identify insufficient rest between shifts
- create exception/evidence
- manager/HR review
- payroll premium output hook where configured

### Important rules

- Preserve actual punch evidence.
- A manager correction must not erase the original violation evidence.
- Separate “detected rule exception” from a legal conclusion.
- Rule versions must be retained.
- Premium output must not be silently duplicated on re-evaluation.

### Acceptance criteria

- [ ] Break/rest policies are versioned.
- [ ] Engine can detect configured break/rest exceptions.
- [ ] Evaluation shows source time/schedule and rule version.
- [ ] Corrections preserve original evidence.
- [ ] Premium output is idempotency-safe.
- [ ] Historical finalized evaluations remain reproducible.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-007] Shift differentials & penalty-rate rule engine

**Recommended label:** `enhancement`

### Blueprint basis

Shift Differentials/Penalty Rates are Advanced/High-value with workflow:

`Match time to rule → calculate differential`

The blueprint highlights their importance in healthcare, hospitality, manufacturing and similar frontline sectors.

### Goal

Classify eligible time into configured differential/penalty components for payroll.

### Depends on

- WFX-004
- WFX-001 scheduling
- OPS approved time
- MVP payroll reference mappings

### In scope

Rule dimensions:
- time-of-day window
- day of week
- holiday/calendar day
- shift type
- location
- job/classification
- schedule vs actual time
- amount or multiplier metadata
- earning code mapping
- stacking/precedence
- effective dates

Evaluation output:
- eligible time quantity
- differential type
- multiplier/rate reference
- earning code
- rule/version
- source shift/time entries
- calculation trace

### Business rules

- Currency/rate interpretation must be explicit when a fixed monetary premium is configured.
- Differential output should map to canonical payroll earning codes.
- Rule stacking must be deterministic.
- Existing finalized payroll output remains stable after rule changes.

### Edge cases

- Shift spans two differential windows
- Weekend plus night rule
- Holiday plus overtime
- Shift crosses midnight
- Employee transfers classification mid-period

### Acceptance criteria

- [ ] Admin can configure effective-dated differential rules.
- [ ] Time is split correctly across applicable rule windows.
- [ ] Stacking/precedence behavior is deterministic.
- [ ] Payroll-ready output contains earning-code mapping.
- [ ] Result retains source and rule/version lineage.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-008] Mobile, kiosk & geofenced clocking extensions — optional frontline capability

**Recommended label:** `enhancement`

### Blueprint basis

Mobile/Kiosk/Geofenced Clocking is listed as **Optional**, with workflow:

`Device/location validation → punch`

It is valuable for distributed hourly operations but unnecessary for many office customers.

### Goal

Extend the existing punch system with trusted device/location context without making geolocation mandatory for all tenants.

### Depends on

- OPS clock-in/out
- WFX scheduling
- WFX-030 mobile foundation if using native mobile
- MVP privacy controls

### In scope

Configurable modes:
- normal authenticated mobile punch
- kiosk mode
- geofence-required punch
- geofence-warning-only mode
- device/site identifier

Location configuration:
- worksite coordinates
- allowed radius
- effective dates
- timezone
- privacy notice hook

Punch evidence:
- validation result
- safe location metadata
- device/source
- override reason if authorized

### Privacy/security

- Do not collect continuous background location in this ticket.
- Collect the minimum location evidence needed for the punch policy.
- Tenant must be able to disable geolocation.
- Employee should understand when location is being used.
- Kiosk must prevent one user from accessing another employee's HR data.

### Edge cases

- GPS unavailable
- Employee near geofence boundary
- Kiosk offline
- Device clock manipulated
- Worksite changed
- Employee has legitimate remote-work exception

### Acceptance criteria

- [ ] Tenant can configure clocking mode per worksite/population.
- [ ] Geofence validation can allow, warn or reject according to policy.
- [ ] Punch preserves validation evidence without excessive location retention.
- [ ] Kiosk mode limits access to punch workflow.
- [ ] Overrides require permission/reason and are audited.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-009] Rule-evaluated time-to-pay output & adjustment pipeline

**Recommended label:** `enhancement`

### Goal

Create the final bridge from approved time and WFM rule evaluation into payroll-ready inputs.

### Depends on

- WFX-005
- WFX-006
- WFX-007
- OPS time-to-pay controls
- OPS payroll reconciliation

### In scope

Canonical outputs:
- regular time
- overtime/premium time
- break/rest premium
- differential/penalty earning
- unpaid/paid classification
- source time-entry references
- source schedule references
- rule-result references
- canonical earning code
- quantity/rate/multiplier metadata

Pipeline:
1. freeze approved time version;
2. evaluate applicable rule set;
3. validate outputs;
4. produce payroll-input version;
5. lock/export;
6. preserve late corrections as adjustments;
7. reconcile provider result where possible.

### Business rules

- Every pay-impacting time output must be traceable to source time and rule version.
- Re-running the same frozen input/rule version should be deterministic.
- A new rule version must not mutate prior frozen payroll inputs.
- Late corrections produce delta/adjustment workflow rather than a destructive rewrite.

### Acceptance criteria

- [ ] Approved time produces versioned payroll-ready outputs.
- [ ] Each output is traceable to source time and rule evaluation.
- [ ] Re-evaluation is deterministic for same inputs/version.
- [ ] Locked/exported results cannot be silently rewritten.
- [ ] Late adjustments can flow through payroll export/reconciliation.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-010] Salary bands, grades & compensation structures

**Recommended label:** `enhancement`

### Blueprint basis

Salary Bands/Grades are Advanced/High-value with workflow:

`Define range by job/grade/location → compare worker comp`

### Goal

Create reusable compensation structures that support review cycles and compensation governance.

### Depends on

- MVP job profiles
- MVP locations
- MVP compensation history
- MVP effective dating
- MVP RBAC

### In scope

- grade
- salary band/range
- currency
- pay frequency
- minimum
- midpoint/reference
- maximum
- location/geo differential hook
- job/level association
- legal entity
- effective dates
- version
- active/inactive status

Derived metrics:
- compa-ratio or equivalent position-in-range metric
- below/within/above band classification

### Important rules

- Never compare raw amounts without currency/frequency normalization.
- Historical compensation decisions should retain the band/version used.
- Band visibility to managers/employees is configurable.
- Do not assume ranges are legally permissible to hide in every jurisdiction; visibility policy remains tenant/country driven.

### Edge cases

- Multiple currencies
- Job mapped to different ranges by country/location
- Band changes during compensation cycle
- Employee above range
- Hourly vs salaried ranges

### Acceptance criteria

- [ ] HR/Finance can configure effective-dated salary structures.
- [ ] Jobs/levels/locations can map to ranges.
- [ ] Worker compensation can be compared to the applicable range.
- [ ] Historical range/version is retained.
- [ ] Access to compensation structures is permission-controlled.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-011] Compensation-cycle setup, eligibility & budget allocation

**Recommended label:** `enhancement`

### Blueprint basis

Compensation Review Cycles are Advanced/High-value with workflow:

`Budget → manager proposals → calibration → approval → effective changes`

### Goal

Create the cycle and budget foundation for annual/periodic compensation reviews.

### Depends on

- WFX-010
- MVP compensation history
- MVP manager hierarchy
- OPS performance data where used
- MVP workflow engine

### In scope

Cycle configuration:
- cycle name
- eligible population
- eligibility date
- proposal window
- approval/calibration window
- effective date
- compensation components in scope
- currency policy
- guidelines
- salary-band reference version
- performance-rating reference hook

Budget:
- total budget
- manager/organization allocation
- currency
- percentage and/or amount
- reserve pool
- budget owner
- version

Eligibility:
- active status
- hire-date/tenure rule
- legal entity
- worker type
- population filters
- explicit include/exclude

### Business rules

- Cycle population should freeze or version at launch.
- Budget adjustments after launch require audit/version.
- Employee compensation at cycle baseline must be snapshotted/referenced.
- Cycle effective date is not proposal submission date.

### Acceptance criteria

- [ ] HR/Finance can configure a compensation cycle.
- [ ] Eligibility population can be previewed before launch.
- [ ] Manager/organization budgets can be allocated.
- [ ] Baseline compensation/range references are retained.
- [ ] Launched cycle configuration is versioned/frozen appropriately.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-012] Manager compensation proposals, guidelines & approval workflow

**Recommended label:** `enhancement`

### Goal

Allow managers to propose compensation changes within configured budgets and policy guardrails.

### Depends on

- WFX-011
- MVP workflow/approvals
- MVP manager self-service

### In scope

Manager worksheet:
- eligible employees
- current compensation
- salary range context
- performance rating context where authorized
- guideline
- proposed amount/percentage
- reason/comment
- budget consumed/remaining

Validation:
- budget
- min/max guideline
- range placement
- invalid currency/frequency
- employee no longer eligible
- duplicate proposal

Workflow:
- submit manager worksheet
- higher manager/HR/Finance approval
- reject/return
- resubmit
- freeze approved proposal

### Security

- Managers see only authorized compensation population.
- Performance details shown only if performance permission permits.
- Finance can see budget data without automatically seeing unrelated performance text.
- Export is separately permissioned.

### Acceptance criteria

- [ ] Manager can submit proposals for eligible employees.
- [ ] Budget impact updates in real time or deterministically on save.
- [ ] Guideline/range violations are visible.
- [ ] Approval uses shared workflow infrastructure.
- [ ] Proposal history and comments are audited.
- [ ] Unauthorized compensation data is not exposed.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-013] Compensation calibration, finalization & effective posting

**Recommended label:** `enhancement`

### Goal

Complete the compensation cycle with controlled calibration, final approval and creation of effective-dated compensation records.

### Depends on

- WFX-012
- OPS performance review history
- MVP effective-dated compensation

### In scope

Calibration:
- organization/team view
- proposal comparisons
- budget view
- range placement
- performance/rating distribution context where permitted
- adjust proposal
- record calibration reason
- lock calibrated result

Finalization:
- final approval
- final budget check
- effective date
- create future-dated compensation records
- notification/statement hook
- payroll integration event
- cycle close
- reopen with privileged control

### Critical rules

- Do not overwrite current compensation before effective date.
- Finalized proposal must create the same canonical compensation transaction as ordinary HR compensation changes.
- Cycle must retain baseline, proposed and final values.
- Reopen/change after finalization must be explicit and auditable.

### Acceptance criteria

- [ ] HR/Finance can calibrate authorized proposals.
- [ ] Final budget control prevents unnoticed over-allocation.
- [ ] Finalization posts effective-dated compensation changes.
- [ ] Payroll/integration events are emitted.
- [ ] Cycle retains baseline/proposed/final history.
- [ ] Reopen requires elevated permission and reason.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-014] Pay-equity analytics & controlled remediation insights

**Recommended label:** `enhancement`

### Blueprint basis

Pay-Equity Analytics is Advanced/High-value with workflow:

`Cohort analysis → identify gaps → controlled remediation`

### Goal

Provide descriptive compensation equity analysis without turning analytics into an autonomous employment decision engine.

### Depends on

- WFX-010
- WFX-013
- WFX-028 analytics layer
- MVP privacy/field permissions

### In scope

- configurable comparison cohort
- job/level/location/legal entity filters
- compensation normalization by currency/frequency
- band position
- descriptive pay gap metrics
- distribution views
- protected/demographic attributes only where lawful and explicitly permitted
- export with strong permissions
- remediation workflow hook to compensation change/cycle

### Important limits

- This ticket provides analysis, not a legal determination of discrimination.
- Avoid causal claims not supported by the data.
- Small cohorts may require suppression.
- Protected-characteristic access must be tightly permissioned.
- Any remediation becomes a human-approved compensation transaction.

### Acceptance criteria

- [ ] HR can define comparison cohorts.
- [ ] Metrics normalize compensation appropriately.
- [ ] Small/sensitive cohorts can be suppressed.
- [ ] Protected data requires dedicated permission.
- [ ] Analysis can link to controlled compensation action without auto-changing pay.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-015] Native ATS domain: requisitions, candidates & applications

**Recommended label:** `enhancement`

### Blueprint basis

Native ATS is Advanced/High-value with workflow:

`Requisition → candidate → interviews → offer → hire`

The blueprint also notes that recruiting data should distinguish jobs, applications and candidates.

### Goal

Create the native recruiting system while preserving the existing position model and ATS-to-HRIS lineage.

### Depends on

- MVP positions
- MVP ATS hire-conversion foundations
- OPS API/webhooks
- MVP RBAC/audit
- MVP documents

### In scope

`requisition`
- position link
- hiring manager
- recruiter
- headcount
- location
- job profile
- status
- approval reference

`candidate`
- identity/contact
- source
- consent/privacy metadata hook
- duplicate candidate detection

`application`
- candidate
- requisition/job
- stage
- disposition
- source
- timestamps

Recruiting pipeline:
- draft requisition
- approved/open
- sourcing/application
- screen
- interview
- offer
- hired/rejected/withdrawn

### Critical rules

- Candidate and application are separate objects.
- A candidate may apply to multiple requisitions.
- Position remains authoritative for headcount where position management is used.
- Candidate data is not ordinary employee data until conversion.
- Recruiting permissions are isolated from payroll/health/performance.

### Acceptance criteria

- [ ] Recruiter can create/manage candidate and application records.
- [ ] One candidate can have multiple applications.
- [ ] Requisition can link to an approved position.
- [ ] Pipeline stages are configurable enough for MVP ATS depth.
- [ ] Candidate data has dedicated privacy/access controls.
- [ ] Audit history exists for stage/disposition changes.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-016] Position ↔ requisition synchronization & headcount control

**Recommended label:** `enhancement`

### Blueprint basis

Position/Requisition Synchronization is Advanced/High-value with workflow:

`Approved position → ATS job/requisition → hiring outcome`

### Goal

Keep Core HR position management authoritative while allowing recruiting to operate on requisitions.

### Depends on

- WFX-015
- MVP position management

### In scope

- create requisition from position
- carry job/location/department/legal entity data
- recruiter/hiring manager assignment
- requisition headcount
- position status ↔ recruiting status mapping
- fill position when hire conversion completes
- cancel/close requisition
- vacancy reopening policy hook
- concurrent/multiple openings handling

### Business rules

- Requisition must not become a duplicate position record.
- Filling a position through an accepted hire creates the position assignment in Core HR.
- Closing requisition does not delete position history.
- Position change after requisition launch creates a visible sync/change decision.

### Edge cases

- Multiple hires against one requisition
- One position with replacement hiring
- Position frozen while candidates active
- Hiring manager changes
- Candidate hired into different approved position

### Acceptance criteria

- [ ] Approved position can seed a requisition.
- [ ] Key structural fields stay traceable to position/job data.
- [ ] Hire can fill the correct position.
- [ ] Requisition close/cancel preserves history.
- [ ] Conflicting position/requisition changes are surfaced.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-017] Careers/job-board publishing & application intake

**Recommended label:** `enhancement`

### Blueprint basis

Careers/Job-Board Publishing is Advanced with workflow:

`Approved job → publish → application`

### Goal

Publish approved requisitions to a candidate-facing careers experience and ingest applications into the native ATS.

### Depends on

- WFX-015
- WFX-016
- OPS public API/webhooks where external boards are integrated

### In scope

- publish/unpublish requisition
- careers listing
- job detail
- location/work-mode metadata
- pay-range field hook
- application form
- resume/document upload
- candidate consent/privacy notice
- source tracking
- duplicate candidate matching
- application confirmation
- external job-board adapter interface

### Privacy/security

- Candidate portal is not authenticated employee self-service.
- Collect only recruiting-required fields.
- Candidate retention must integrate with privacy/retention controls.
- Resume/document files are protected.
- Avoid exposing internal-only requisition fields publicly.

### Acceptance criteria

- [ ] Recruiter can publish/unpublish an approved requisition.
- [ ] Candidate can submit an application.
- [ ] Application creates/links candidate + application correctly.
- [ ] Recruiting source is retained.
- [ ] Candidate privacy/retention metadata is captured.
- [ ] Internal fields are not leaked publicly.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-018] Interview scheduling, calendar integration & structured feedback

**Recommended label:** `enhancement`

### Blueprint basis

Interview Scheduling is Advanced with workflow:

`Panel availability → invite → reschedule → feedback`

### Goal

Coordinate interview panels and collect structured hiring feedback.

### Depends on

- WFX-015
- OPS integration platform
- MVP notifications
- External calendar adapter if available

### In scope

Interview:
- application
- interview stage/type
- panel members
- candidate
- proposed time
- timezone
- duration
- location/video link
- calendar event external ID
- status

Scheduling:
- panel availability integration hook
- invite
- reschedule
- cancel
- candidate confirmation hook
- reminders

Feedback:
- scorecard/template
- interviewer response
- submit/finalize
- visibility rules
- conflict-of-interest/recusal hook
- audit

### Important rules

- Interview feedback is recruiting-sensitive data.
- Submitted feedback should be frozen or corrected through explicit workflow.
- Calendar provider status is separate from ATS interview state.
- Store provider event ID as external identifier.

### Acceptance criteria

- [ ] Recruiter can schedule/reschedule/cancel interviews.
- [ ] Calendar event linkage is retained where integrated.
- [ ] Panel members receive appropriate notifications.
- [ ] Interviewers can submit structured feedback.
- [ ] Feedback visibility is permission-controlled.
- [ ] Provider sync failure does not corrupt ATS application state.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-019] Offer workflow & native ATS hire conversion

**Recommended label:** `enhancement`

### Goal

Complete the native ATS workflow from selected candidate to accepted offer and reuse the existing HR pre-hire/onboarding conversion path.

### Depends on

- WFX-015
- WFX-016
- WFX-018
- MVP documents/e-sign
- MVP onboarding
- MVP ATS hire conversion

### In scope

Offer:
- selected candidate/application
- position
- proposed start date
- compensation proposal
- legal entity
- work location
- offer document template hook
- approvals
- e-signature
- offer status

Suggested states:
`DRAFT → APPROVAL → SENT → ACCEPTED / DECLINED / WITHDRAWN / EXPIRED`

Hire conversion:
- accepted offer
- deduplicate person
- create/link pre-hire
- create employment
- create position assignment
- create approved compensation record/effective date
- launch onboarding
- retain candidate/application/requisition lineage

### Critical rules

- Offer compensation visibility is restricted.
- Accepted offer does not create a duplicate person if existing former employee is matched.
- ATS candidate/application history remains separate from employee record but linked.
- Hire conversion is idempotent.

### Acceptance criteria

- [ ] Recruiter can create/send approved offer.
- [ ] Accepted offer can trigger conversion.
- [ ] Core HR person/employment/position models are reused.
- [ ] Source candidate/application/requisition IDs remain linked.
- [ ] Duplicate conversion is prevented.
- [ ] Onboarding starts from accepted hire.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-020] Goals, alignment & review-cycle integration

**Recommended label:** `enhancement`

### Blueprint basis

Goals are Advanced with workflow:

`Create → align → update → review outcome`

### Goal

Add ongoing goal management that integrates with performance reviews without becoming a project-management system.

### Depends on

- OPS performance reviews
- MVP employee/manager hierarchy
- MVP notifications

### In scope

- employee goal
- manager-created goal
- organizational/team alignment reference
- title/description
- start/end date
- status
- progress
- outcome/result text
- weight optional
- review-cycle linking
- visibility rules
- goal history

### Suggested states

`DRAFT → ACTIVE → COMPLETED / CANCELLED`

### Business rules

- Goal history should survive manager/position changes.
- Final review snapshots should retain the goal state referenced during the review.
- Private development goals may require tighter visibility than general performance goals.
- Do not allow goal edits to rewrite a finalized performance review.

### Acceptance criteria

- [ ] Employee/manager can create permitted goals.
- [ ] Goals can align to team/organization references.
- [ ] Progress/status can be updated.
- [ ] Review cycle can include goal snapshot/reference.
- [ ] Historical goal changes are auditable.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-021] Continuous feedback & one-to-ones — optional

**Recommended label:** `enhancement`

### Blueprint basis

Continuous Feedback/One-to-Ones is classified **Optional**, with workflow:

`Request/give feedback → manager conversation`

### Goal

Provide lightweight ongoing feedback and one-to-one records for customers that want continuous performance practices.

### Depends on

- OPS performance permissions
- WFX-020 goals
- MVP notifications

### In scope

- feedback request
- feedback response
- manager/employee one-to-one
- agenda items
- notes
- follow-up action
- goal reference
- visibility model
- recurring-meeting hook
- reminders

### Privacy/permission design

- Clearly distinguish private manager notes, shared notes and employee-authored content.
- Avoid one universal visibility flag.
- HR access to one-to-one content should be explicitly configured.
- Retention policy should be defined.

### Acceptance criteria

- [ ] Employee/manager can request/give feedback according to policy.
- [ ] One-to-one agenda/notes support explicit visibility.
- [ ] Follow-ups can link to goals.
- [ ] Sensitive/private content is not exposed by general manager/HR access accidentally.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-022] Performance calibration & talent review

**Recommended label:** `enhancement`

### Blueprint basis

Calibration/Talent Review is Advanced with workflow:

`Aggregate reviews → calibration → final rating`

### Goal

Add controlled multi-manager calibration on top of completed performance-review cycles.

### Depends on

- OPS performance cycles
- WFX-020 goals where used
- MVP RBAC/audit

### In scope

- calibration session
- eligible population
- reviewer/calibrator group
- pre-calibration ratings
- final calibrated ratings
- distribution view
- comparison by team/job/level
- comments/rationale
- approval/finalization
- frozen calibration history

### Important rules

- Calibration should not silently change finalized original manager input; retain original and calibrated/final value.
- Access to cross-team employee performance must be explicit.
- Demographic/protected data should not be shown unless there is a lawful, separately authorized analysis purpose.
- Succession planning is deferred to Enterprise Expansion.

### Acceptance criteria

- [ ] HR can configure a calibration session.
- [ ] Authorized participants can compare eligible reviews.
- [ ] Original and calibrated ratings remain distinguishable.
- [ ] Finalization is auditable/frozen.
- [ ] Cross-population access is explicitly permissioned.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-023] Learning catalog, courses, assignments & completion tracking

**Recommended label:** `enhancement`

### Blueprint basis

Learning/LMS is Optional/Advanced with workflow:

`Assign course → complete → certify → expire/renew`

The blueprint notes particular value for regulated/credentialed workforces.

### Goal

Create a basic LMS foundation for assigned and self-directed learning.

### Depends on

- MVP employee/employment
- MVP manager hierarchy
- MVP documents
- MVP notifications

### In scope

Learning catalog:
- course
- description
- category
- delivery type
- provider
- duration
- active dates
- content/link/document reference
- prerequisites hook

Assignment:
- employee
- course
- source: manual/manager/policy
- due date
- required/optional
- status
- completion date
- score/result optional

Manager/HR:
- assign course
- bulk assign to population
- track completion
- reminders

Employee:
- learning dashboard
- assigned courses
- mark/record completion as permitted
- completion history

### Business rules

- Employment termination should not destroy learning history.
- Completion evidence is historical.
- External LMS IDs, if later integrated, are mappings.
- Certification behavior is separated into WFX-024.

### Acceptance criteria

- [ ] HR can create/publish learning content.
- [ ] Course can be assigned to workers/populations.
- [ ] Employee can see assigned learning.
- [ ] Completion history is retained.
- [ ] Manager/HR can report completion according to permission.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-024] Certifications, expiry, renewal & compliance-learning evidence

**Recommended label:** `enhancement`

### Goal

Extend LMS completion into time-bounded certification/credential evidence.

### Depends on

- WFX-023
- MVP document expiry/reminders

### In scope

- certification/credential definition
- course linkage
- issuer/provider
- issue date
- expiry date
- renewal period
- required employee population
- document/evidence
- reminder schedule
- status
- renewal assignment
- manager/HR compliance view

### Suggested statuses

`VALID → EXPIRING → EXPIRED → RENEWED`

### Important rules

- Renewal creates new credential evidence; do not overwrite prior certification.
- Expired certification history remains retained.
- Population requirements may depend on job/location/legal entity and effective date.
- Do not label a credential “legally compliant” unless a maintained country/industry pack defines that assertion.

### Acceptance criteria

- [ ] Certification records can be created from learning completion or admin entry.
- [ ] Expiry/renewal reminders are generated.
- [ ] Historical certification versions are retained.
- [ ] HR/manager can identify expired/expiring required credentials.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-025] Skills taxonomy & competency profiles

**Recommended label:** `enhancement`

### Blueprint basis

Skills and Competency Profiles are Advanced/High-value with workflow:

`Define skill taxonomy → assess/infer → search gaps`

### Goal

Create a structured skills model that can support talent development and later workforce planning.

### Depends on

- MVP job profiles
- OPS performance
- WFX learning
- MVP RBAC

### In scope

Skill taxonomy:
- skill
- category/domain
- description
- proficiency scale
- parent/related skill hook
- active/version status

Competency framework:
- job profile
- skill
- required/desired proficiency
- effective dates

Employee skill profile:
- employee/employment
- skill
- proficiency
- evidence/source
- assessed_by
- assessed_at
- confidence/source type
- expiry/refresh hook

### Sources

Initial supported sources:
- self-declared
- manager-assessed
- HR-assessed
- learning/certification evidence

AI-inferred skills are explicitly not required in this ticket.

### Business rules

- Skills data should not silently alter job/compensation decisions.
- Source/provenance must be visible.
- Skill framework changes should be versioned enough for historical interpretation.

### Acceptance criteria

- [ ] HR can define skills/proficiency scales.
- [ ] Job profiles can reference desired skills.
- [ ] Employee skill profile records source/evidence.
- [ ] Permissions control assessment/edit access.
- [ ] Historical skill assessments are retained.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-026] Skills assessment, search & gap analysis

**Recommended label:** `enhancement`

### Goal

Make the skills framework operational through assessments, workforce search and development-gap views.

### Depends on

- WFX-025
- WFX-023 learning
- WFX-028 analytics foundation

### In scope

Assessment:
- employee self-assessment
- manager assessment
- evidence/reference
- proficiency
- date
- status
- disagreement/confirmation hook

Search:
- find employees by skill
- minimum proficiency
- location/department/legal entity filters
- permission-aware results

Gap analysis:
- compare employee skills to current job profile
- team gaps
- job/role gaps
- recommended learning links where explicit mappings exist

### Important limits

- Search must not become an automated selection/rejection engine.
- Skills may be incomplete or subjective; show provenance.
- Protected employee data must not be mixed into ranking.

### Acceptance criteria

- [ ] Employee/manager can complete permitted skill assessments.
- [ ] Authorized users can search workforce by skill/proficiency.
- [ ] Job-to-worker gap can be calculated.
- [ ] Learning content can be linked to a skill gap.
- [ ] Provenance/source is visible in results.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-027] Engagement / pulse surveys, anonymity rules & action plans

**Recommended label:** `enhancement`

### Blueprint basis

Engagement/Pulse Surveys are Optional with workflow:

`Survey → anonymity rules → analysis → action`

### Goal

Provide an employee-experience survey capability with privacy-safe anonymity controls.

### Depends on

- MVP employee population/organization data
- MVP notifications
- MVP privacy controls
- WFX analytics foundation optional for richer analysis

### In scope

Survey:
- title/purpose
- question types
- scale questions
- free text optional
- target population
- open/close dates
- anonymous vs identified mode
- anonymity threshold
- reminders
- status

Response:
- submission
- question answer
- anonymity handling
- response timestamp
- no manager access to raw response unless policy permits and anonymity is preserved

Analysis:
- response rate
- question scores
- trend vs prior survey where comparable
- department/location aggregate with threshold
- comment access controls
- action plan
- owner/due date/status

### Critical anonymity rules

- Suppress results for cohorts below configured threshold.
- Do not expose hidden identifiers through exports.
- Free-text comments can re-identify people; treat them carefully.
- Employee should know whether survey is anonymous before submission.
- Survey configuration should not switch anonymity mode after responses exist.

### Acceptance criteria

- [ ] HR can launch targeted survey.
- [ ] Employee sees clear anonymity status.
- [ ] Small cohorts are suppressed according to threshold.
- [ ] Aggregate analysis is permission-aware.
- [ ] HR/manager can create tracked action plans.
- [ ] Raw response access is tightly controlled/audited.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-028] Advanced analytics historical model & governed metric layer

**Recommended label:** `enhancement`

### Blueprint basis

Advanced Analytics/BI is Advanced/High-value with workflow:

`Model historical workforce → metrics/cohorts/trends`

The blueprint notes that effective dates must be preserved rather than exposing only current employee state.

### Goal

Create an analytics architecture capable of trustworthy historical workforce analysis without overloading transactional queries.

### Depends on

- MVP effective-dated HR data
- MVP reporting
- OPS payroll/time/benefits/performance domains
- WFX scheduling/comp/recruiting domains as they become available

### In scope

Analytics model:
- workforce snapshot/fact strategy
- employment facts
- headcount facts
- hire/termination events
- organization dimensions
- position dimensions
- leave facts
- time facts
- compensation facts
- payroll summary facts
- recruiting facts
- performance facts
- learning/skills facts
- survey aggregate facts

Metric governance:
- metric definition
- formula
- dimensions
- effective version
- owner
- sensitivity classification
- refresh timestamp

Pipeline:
- incremental load
- backfill
- late-arriving/backdated correction handling
- data-quality checks
- lineage to source domain
- tenant partitioning

### Important rules

- Preserve business-effective history.
- Backdated HR changes may require recomputing affected historical aggregates.
- Do not expose sensitive row-level data simply because analytics store exists.
- Metric definition/version should be visible so reports remain explainable.

### Acceptance criteria

- [ ] Analytics model can represent historical workforce state.
- [ ] Backdated changes can be reflected deterministically.
- [ ] Metric definitions are governed/versioned.
- [ ] Tenant and permission boundaries remain enforceable.
- [ ] Data quality/refresh status is observable.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-029] Cohort, trend & workforce analytics dashboards

**Recommended label:** `enhancement`

### Goal

Expose the governed analytics model through actionable historical dashboards and cohort analysis.

### Depends on

- WFX-028

### In scope

Initial advanced dashboards:
- headcount trend
- hires/terminations/turnover trend
- tenure distribution
- internal movement
- leave/absence trends
- overtime/time trends where enabled
- compensation range positioning
- recruiting funnel/time-in-stage
- performance completion/rating trends
- learning completion
- skills coverage
- engagement trend

Cohorts:
- legal entity
- location
- department
- job family/level
- manager tree
- tenure band
- worker type
- time period

Capabilities:
- compare periods
- drill-down where authorized
- saved views
- export
- metric definitions/help
- freshness indicator

### Security/privacy

- Sensitive metrics need explicit permission.
- Small cohorts may require suppression.
- Cross-domain joins must not accidentally reveal fields a role cannot view.
- Executive aggregate access does not imply employee-level record access.

### Acceptance criteria

- [ ] Users can analyze selected workforce metrics over time.
- [ ] Cohort filters use governed dimensions.
- [ ] Metric definitions are visible.
- [ ] Drill-down respects row/field permissions.
- [ ] Sensitive small-cohort output can be suppressed.
- [ ] Dashboard shows data freshness.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-030] Mobile application foundation, authentication & secure client architecture

**Recommended label:** `enhancement`

### Blueprint basis

Mobile Application is Advanced with workflow:

`Leave/time/pay/approvals/tasks on mobile`

and is particularly valuable to employees without desk access.

### Goal

Create a secure mobile client that uses the same HR APIs, authorization and audit controls as web.

### Depends on

- OPS SSO/auth
- OPS public/internal API maturity
- OPS webhooks/notifications as applicable
- MVP RBAC
- MVP privacy/security

### In scope

- mobile application shell
- authenticated session
- MFA/SSO-compatible flow as supported
- secure token storage
- session expiry/revocation
- tenant switching if account belongs to multiple tenants
- API client
- mobile-safe error handling
- push-notification foundation
- deep-link foundation
- biometric device unlock optional as local convenience, not primary identity
- secure local cache policy
- app version/minimum-version control
- telemetry without sensitive HR payloads

### Security requirements

- Do not persist unnecessary sensitive HR records offline.
- Screenshot/clipboard restrictions may be considered for especially sensitive screens but are not a substitute for authorization.
- Remote session revocation must take effect.
- Push notifications should not expose sensitive compensation/medical content on lock screens by default.
- Mobile client must not contain backend secrets.

### Acceptance criteria

- [ ] User can securely authenticate on mobile.
- [ ] Existing RBAC applies identically.
- [ ] Session revocation works.
- [ ] Sensitive data is not stored/logged unnecessarily.
- [ ] Push/deep-link foundation is available.
- [ ] App can report compatible version and handle forced upgrade policy if configured.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---

## [WFX-031] Mobile employee & manager workflows

**Recommended label:** `enhancement`

### Goal

Deliver the highest-value employee and manager HCM workflows through the mobile application.

### Depends on

- WFX-030
- MVP/OPS APIs for each included domain
- WFX scheduling where enabled

### Employee mobile scope

- own profile summary
- employee directory
- leave balance/request/cancel
- published schedule
- open-shift/swap request
- clock in/out where enabled
- timesheet view/submit
- payslip/pay history
- documents
- onboarding/assigned tasks
- learning assignments
- goals
- performance tasks
- benefits summary/election links where appropriate
- HR cases
- notifications

### Manager mobile scope

- approval inbox
- leave approvals
- timesheet approvals
- attendance exception actions
- schedule view
- open shift/swap approvals
- team directory
- onboarding/offboarding tasks
- HR workflow approvals
- performance review tasks
- compensation approvals only if tenant explicitly enables secure mobile access

### UX requirements

- optimized for small screens, not a compressed desktop UI
- accessible controls
- resilient loading/retry
- clear offline/not-current data indication
- high-risk actions require explicit confirmation

### Security

- Same server-side authorization as web.
- Do not place compensation or sensitive case data in push notification text.
- Mobile navigation must not expose hidden screens through deep links without authorization.
- Sensitive downloaded documents must use secure temporary storage.

### Acceptance criteria

- [ ] Employee can complete core self-service workflows on mobile.
- [ ] Manager can complete selected approvals on mobile.
- [ ] Schedule/time workflows function for frontline users where enabled.
- [ ] Deep links re-check authorization.
- [ ] Mobile actions create the same workflow/audit records as web.

### Global definition of done

Unless explicitly overridden by the issue:

- [ ] Tenant isolation is enforced for all new records and queries.
- [ ] Server-side authorization is implemented; UI visibility is not the security boundary.
- [ ] Relevant business mutations, approvals and rule overrides are audited.
- [ ] Effective date and transaction timestamp are retained where history matters.
- [ ] Versioned rules/templates/policies remain historically explainable.
- [ ] Finalized time/pay/review evidence is not destructively overwritten.
- [ ] Retryable integration operations are idempotency-safe.
- [ ] Sensitive PII/pay/talent/candidate data is excluded from ordinary logs.
- [ ] Loading, empty, validation, permission-denied and failure UI states exist.
- [ ] Critical domain rules and permission boundaries have automated tests.
- [ ] Schema changes include migrations.
- [ ] API/webhook behavior remains backward-compatible or explicitly versioned.
- [ ] Operational/support diagnostics exist for asynchronous jobs.
- [ ] Project lint/build/test checks pass.
- [ ] New configuration, data migration and operational procedures are documented.

---


# NEXT — Enterprise Expansion

After `WFX-001` through `WFX-031`, the blueprint's next recommended stage is **Enterprise Expansion** with the objective:

> **Support multi-entity/global enterprise governance**

The next issue series should use a separate prefix such as `ENT-xxx` and cover:

1. Workforce/headcount planning
2. Succession planning
3. HR service-delivery portal / knowledge-to-case workflow
4. Benefits carrier/vendor feeds
5. Delegated administration
6. Regional data residency
7. Advanced segregation-of-duties policies
8. Extensibility/developer tooling beyond the public API baseline
9. Integration marketplace
10. Global payroll orchestration
11. Multi-country employment packs where commercially prioritized
12. Multi-language UI/content where required for global deployments

## Separate parallel roadmap: Country Payroll Packs

The blueprint deliberately keeps native payroll as country-specific packs rather than one universal payroll engine. A future payroll backlog should be jurisdiction-scoped and include:

- gross-to-net
- statutory filings
- pension/social-security
- year-end
- retroactive calculation
- tax/rule updates by effective date
- acknowledgements/corrections
- country-specific record retention and reporting

## Separate later roadmap: AI / Intelligence

The blueprint positions AI after permission, provenance, audit and human-review foundations exist. A future `AI-xxx` backlog should focus on controlled assistance rather than autonomous employment decisions.

---

# Manual GitHub creation workflow

1. Create `WFX-000` first.
2. Create `WFX-001` through `WFX-031` in order.
3. Add the actual GitHub issue links back to `WFX-000`.
4. Do not begin country payroll implementation merely because WFM outputs now contain premium calculations; those outputs remain payroll inputs until a jurisdiction-specific payroll pack is deliberately chosen.
5. Treat `WFX-008` and `WFX-021` as optional if the initial customer profile does not require geofenced/kiosk clocking or continuous feedback.
6. Salary bands/pay equity support the compensation-cycle capability but should retain their own security and analytics boundaries.
7. Keep succession and workforce planning for Enterprise Expansion; do not overload the skills/calibration tickets with enterprise talent-planning scope.
8. Keep mobile as a client of existing APIs/workflows instead of duplicating business logic inside the app.
