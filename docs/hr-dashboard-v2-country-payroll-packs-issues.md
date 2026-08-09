# HR Dashboard V2 — Country Payroll Packs GitHub Issue Backlog

> **Roadmap track:** Native Payroll / Country Payroll Packs
>
> **Source basis:** the supplied *Comprehensive Feature Blueprint for an HR Management SaaS Platform*.
>
> **How to use:** create one GitHub issue per `## [PAY-xxx]` or country-prefixed section. Keep the ticket code in the GitHub title so implementation order remains explicit.
>
> **Important:** this document intentionally does **not** design one universal global payroll engine. The blueprint recommends independently versioned country packs because tax, filing, social-security, wage-hour, pension, year-end, correction, and recordkeeping requirements differ materially by jurisdiction.
>
> **Source vs implementation detail:** jurisdictional scope and regulatory framing come from the supplied blueprint. Specific table names, state machines, APIs, calculation primitives, test strategies, and issue decomposition below are implementation proposals. Before production release of any country pack, current statutory formulas, thresholds, filing schemas, deadlines, and official technical specifications must be validated against authoritative sources.

# Product objective

Add native payroll without weakening the existing payroll-neutral architecture.

The finished payroll platform should preserve:

- canonical employee/employment/compensation/time data;
- effective-dated statutory rules;
- deterministic gross-to-net calculation;
- exact rule/version lineage;
- payroll period locking;
- retroactive calculation;
- reversals/adjustments instead of destructive overwrites;
- statutory filing lifecycle;
- acknowledgements and corrections;
- pension/social-security interfaces where applicable;
- year-end processing;
- payslip publication;
- country-specific record retention;
- reconciliation and financial controls.

# Why country packs are separate

The blueprint highlights materially different requirements:

- **United States:** federal plus state/local wage-hour and payroll requirements, FLSA recordkeeping/overtime context, federal employment-tax reporting, W-2/W-3, I-9 retention, FMLA/state overlays.
- **United Kingdom:** PAYE / Real Time Information, workplace pension duties, statutory leave, UK GDPR / DPA employment-data requirements.
- **India:** Labour Codes effective November 21, 2025; salary TDS transition from April 1, 2026 under the Income Tax Act, 2025 framework; EPFO/ECR workflows; DPDP transition.
- **Australia:** Fair Work wage/time records, awards/agreements, seven-year record retention, Single Touch Payroll, Payday Super changes from July 1, 2026, payslip timing.
- **European Union:** GDPR plus Member-State payroll/labor law. The blueprint explicitly says the EU must be treated as a regulatory baseline plus **Member-State packs**, not as one payroll country.

# Recommended ticket series

## Shared native-payroll platform

| Order | Ticket | Area |
|---:|---|---|
| 0 | PAY-000 | Native Payroll roadmap |
| 1 | PAY-001 | Payroll domain & calculation architecture |
| 2 | PAY-002 | Country-pack registry, statutory rule versioning & sources |
| 3 | PAY-003 | Payroll calendars, periods, runs & close lifecycle |
| 4 | PAY-004 | Canonical earnings, deductions, taxes & contributions |
| 5 | PAY-005 | Gross-to-net calculation engine primitives |
| 6 | PAY-006 | Rounding, precision, currency & calculation trace |
| 7 | PAY-007 | Retroactive calculation & delta engine |
| 8 | PAY-008 | Adjustments, reversals & off-cycle payroll |
| 9 | PAY-009 | Payroll validation, precheck & anomaly framework |
| 10 | PAY-010 | Statutory filing framework |
| 11 | PAY-011 | Filing acknowledgement, rejection & correction lifecycle |
| 12 | PAY-012 | Year-end payroll framework |
| 13 | PAY-013 | Native payslip generation & publication |
| 14 | PAY-014 | Payroll payments/disbursement integration boundary |
| 15 | PAY-015 | Payroll accounting/journal integration hardening |
| 16 | PAY-016 | Payroll audit evidence & calculation explainability |
| 17 | PAY-017 | Payroll security, SoD & privileged operations |
| 18 | PAY-018 | Payroll test harness, golden datasets & regression suite |
| 19 | PAY-019 | Country-pack release/version governance |

## Country packs

### United States
`PAY-US-000` → `PAY-US-010`

### United Kingdom
`PAY-UK-000` → `PAY-UK-010`

### India
`PAY-IN-000` → `PAY-IN-010`

### Australia
`PAY-AU-000` → `PAY-AU-011`

### European Union / Member-State framework
`PAY-EU-000` → `PAY-EU-006`

# Cross-cutting native-payroll rules

1. **Every statutory rule is effective-dated and versioned.**
2. **Transaction time and business-effective time are both preserved.**
3. **Finalized payroll is ledger-like history.** Corrections use new versions, deltas, reversals, or off-cycle runs.
4. **A payroll run is tied to one legal employer context and jurisdictional pack combination.**
5. **No monetary value is stored without currency and precision context.**
6. **No calculation output exists without source inputs and rule-version lineage.**
7. **Statutory filing state is separate from payroll calculation state.**
8. **Provider/government acknowledgement state is separate from HR employment state.**
9. **Country packs extend the canonical payroll engine; they do not fork Core HR.**
10. **Jurisdiction resolution must not rely only on tenant headquarters.**
11. **Payroll security must separate preparation, approval, filing, payment and access administration where required.**
12. **Every production country-pack release requires legal/payroll subject-matter validation and regression evidence.**
13. **Do not infer statutory formulas from old payroll results.** Rules must be explicit configuration/code with source/version metadata.
14. **Backdated changes never silently rewrite a closed payroll.**
15. **Payroll result ingestion from external providers and native payroll results must share a common downstream reporting/payslip model where practical.**

---

## [PAY-000] Native Payroll & Country Payroll Packs roadmap

**Recommended label:** `enhancement`

### Goal

Track native payroll as a controlled set of shared calculation foundations plus independently released jurisdiction packs.

### Core architectural boundary

The existing HR platform remains authoritative for:
- person/employment
- legal employer
- position/job/location
- compensation
- leave/time
- workflow/approval
- documents
- audit
- integrations

Native payroll adds:
- statutory payroll rules
- gross-to-net calculation
- local taxes/contributions
- filing/output schemas
- corrections/acknowledgements
- local year-end processing

### Explicit non-goal

Do not implement one global rule table that attempts to represent every country with conditionals in a single formula set.

### Tracking checklist

#### Shared platform
- [ ] PAY-001
- [ ] PAY-002
- [ ] PAY-003
- [ ] PAY-004
- [ ] PAY-005
- [ ] PAY-006
- [ ] PAY-007
- [ ] PAY-008
- [ ] PAY-009
- [ ] PAY-010
- [ ] PAY-011
- [ ] PAY-012
- [ ] PAY-013
- [ ] PAY-014
- [ ] PAY-015
- [ ] PAY-016
- [ ] PAY-017
- [ ] PAY-018
- [ ] PAY-019

#### Country packs
- [ ] PAY-US-000 through PAY-US-010
- [ ] PAY-UK-000 through PAY-UK-010
- [ ] PAY-IN-000 through PAY-IN-010
- [ ] PAY-AU-000 through PAY-AU-011
- [ ] PAY-EU-000 through PAY-EU-006

### Release principle

A country pack is production-ready only when:
1. supported worker/pay scenarios are explicitly documented;
2. statutory rule sources/effective dates are captured;
3. golden calculations are independently checked;
4. filing schemas and acknowledgement workflows are tested where supported;
5. year-end and correction workflows are tested;
6. operational ownership for statutory updates exists.

---

## [PAY-001] Payroll domain & calculation architecture

**Recommended label:** `enhancement`

### Goal

Define the canonical native-payroll domain and boundaries before implementing country formulas.

### Depends on

- Core HR
- compensation
- time/leave
- payroll integration/reconciliation foundations
- enterprise global payroll orchestration

### In scope

Canonical native payroll entities:
- payroll calendar
- payroll period
- payroll run
- payroll worker snapshot
- payroll input
- calculation result
- earning result
- deduction result
- tax/contribution result
- employer-cost result
- adjustment/reversal
- statutory filing
- filing response
- payment batch reference

### Payroll snapshot principle

At calculation start, create/reference the exact effective-dated workforce/pay inputs used:
- employment state
- compensation
- worker classification
- location/jurisdiction
- time/premium inputs
- leave/pay-impacting inputs
- tax/social contribution elections/identifiers
- country-pack version

### State separation

Do not merge:
- HR employment state
- payroll run state
- filing state
- payment state
- integration delivery state

### Acceptance criteria

- [ ] Canonical payroll domain is documented.
- [ ] Payroll run can identify exact input snapshot/version.
- [ ] Result lines are separated by earning/deduction/tax/contribution type.
- [ ] Run/filing/payment states are modeled separately.
- [ ] Country packs can extend calculations without changing Core HR entities.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-002] Country-pack registry, statutory rule versioning & source metadata

**Recommended label:** `enhancement`

### Goal

Make statutory rules deployable, auditable and effective-dated by country.

### In scope

`country_payroll_pack`
- country/jurisdiction
- pack version
- effective_from
- effective_to
- status
- supported employment types
- supported filing interfaces

`statutory_rule_version`
- rule identifier
- category
- jurisdiction
- effective period
- version
- source/reference metadata
- published/reviewed date
- calculation implementation version
- supersedes version

### Rule categories

- income tax
- social security
- pension/retirement
- minimum statutory deduction
- employer contribution
- payroll reporting
- year-end
- record retention metadata
- wage-hour hooks where payroll calculation depends on them

### Requirements

- Future-dated statutory update support
- Rollback without rewriting historical runs
- Diff between rule versions
- Test fixture linked to rule version
- Release notes

### Acceptance criteria

- [ ] Pack versions can coexist by effective period.
- [ ] Payroll run records pack/rule versions.
- [ ] New rule version does not mutate historical calculations.
- [ ] Source/effective metadata is visible to authorized payroll admins.
- [ ] Pack release can be traced to regression tests.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-003] Payroll calendars, periods, runs & close lifecycle

**Recommended label:** `enhancement`

### Goal

Provide native payroll operational controls from period opening through finalized close.

### In scope

Payroll calendar:
- legal entity
- country pack
- frequency
- period boundaries
- pay date
- cutoff dates

Run:
- regular
- off-cycle
- correction
- year-end
- test/preview

Suggested states:
`DRAFT → COLLECTING → VALIDATING → CALCULATING → REVIEW → APPROVED → FINALIZED`

Separate downstream states:
- filing
- payment
- accounting

### Controls

- lock input snapshot
- recalculate before approval
- approval workflow
- finalization
- privileged reopen/correction path
- close checklist
- run version

### Acceptance criteria

- [ ] Payroll calendar generates valid periods.
- [ ] Native payroll run supports preview and finalization.
- [ ] Finalized run is immutable through ordinary workflow.
- [ ] Reopen/correction is explicit and audited.
- [ ] Pay date/cutoff are distinct.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-004] Canonical earnings, deductions, taxes & contribution reference model

**Recommended label:** `enhancement`

### Goal

Create a stable payroll vocabulary used by country packs, reporting and accounting.

### In scope

Earning definition:
- code
- category
- taxable treatment hooks
- pension/social contribution treatment hooks
- regular/supplemental metadata
- quantity/rate support

Deduction definition:
- pre/post-tax treatment hooks
- employee/employer
- fixed/percentage/formula
- priority
- arrears hook
- limit hook

Tax/contribution definition:
- country/jurisdiction
- employee/employer
- calculation category
- remittance/filing mapping
- effective dates

### Critical rule

Country pack decides statutory treatment. The canonical model provides structure and identifiers, not universal tax logic.

### Acceptance criteria

- [ ] Earnings/deductions/contributions have stable internal codes.
- [ ] Country-specific treatment can be attached by version.
- [ ] Accounting mappings remain independent of display labels.
- [ ] Historical result lines retain canonical code and rule treatment version.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-005] Gross-to-net calculation engine primitives

**Recommended label:** `enhancement`

### Goal

Create deterministic calculation primitives that country packs compose.

### In scope

Primitive capabilities:
- fixed amount
- quantity × rate
- percentage
- threshold/band calculation
- progressive bands
- caps/floors
- period-to-date / year-to-date accumulator
- employer vs employee contribution
- taxable-base transformations
- exemptions/allowances hook
- ordered dependency graph
- condition by worker/pay classification
- effective-date rule lookup

### Calculation stages

Suggested generic stages:
1. load snapshot;
2. normalize earnings;
3. calculate taxable/contributory bases;
4. statutory deductions/contributions;
5. voluntary deductions;
6. employer costs;
7. net;
8. validation/control totals.

Country pack may alter/order stages where required.

### Acceptance criteria

- [ ] Calculation graph is deterministic.
- [ ] Circular dependencies are rejected.
- [ ] Year/period accumulators are available.
- [ ] Country pack can compose primitives without arbitrary database mutations.
- [ ] Each result can explain contributing inputs/rules.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-006] Payroll rounding, monetary precision & calculation trace

**Recommended label:** `enhancement`

### Goal

Prevent hidden numerical drift and make every payroll amount explainable.

### In scope

- decimal arithmetic
- currency precision
- rule-specific rounding stage
- quantity precision
- rate precision
- intermediate vs final rounding
- residual handling policy
- calculation trace
- human-readable explanation
- machine-readable calculation tree

### Critical rules

- Avoid binary floating point for payroll money.
- Rounding point is part of the statutory rule version.
- Recalculation from same inputs/rules must produce same result.

### Acceptance criteria

- [ ] Decimal calculation is used consistently.
- [ ] Rounding policy can vary by rule/version.
- [ ] Calculation trace shows input → intermediate → output.
- [ ] Golden tests cover boundary/rounding scenarios.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-007] Retroactive calculation & delta engine

**Recommended label:** `enhancement`

### Blueprint basis

Retroactive Calculation is an Advanced payroll capability:

`Backdated change → identify affected periods → calculate delta`

### Goal

Calculate the financial impact of backdated HR/pay changes without rewriting closed payroll.

### In scope

Retro triggers:
- compensation
- employment status
- time correction
- tax/contribution configuration
- deduction change
- country-rule correction where policy permits

Flow:
1. detect affected closed periods;
2. reconstruct original calculation;
3. calculate corrected result;
4. derive delta;
5. assign delta to current/off-cycle run;
6. preserve original and corrected evidence.

### Acceptance criteria

- [ ] Backdated change identifies affected periods.
- [ ] Original run remains unchanged.
- [ ] Corrected calculation can be reproduced.
- [ ] Delta is posted through controlled future/off-cycle run.
- [ ] Retro lineage is visible on result/payslip.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-008] Adjustments, reversals & off-cycle payroll

**Recommended label:** `enhancement`

### Goal

Support correction scenarios that cannot wait for or should not alter the next regular run.

### In scope

- off-cycle run
- manual authorized adjustment
- reversal
- void/reissue hook
- prior-period correction
- final pay run
- reason
- approval
- source run/result reference

### Business rules

- Manual amount override requires privileged permission and reason.
- Reversal must reference original result.
- Off-cycle calculation uses appropriate pack/rule effective context.
- Accounting/payment/filing consequences remain visible.

### Acceptance criteria

- [ ] Payroll can create off-cycle run.
- [ ] Reversal references original.
- [ ] Manual overrides are controlled/audited.
- [ ] Result remains included in YTD/year-end totals correctly.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-009] Payroll validation, precheck & anomaly framework for native payroll

**Recommended label:** `enhancement`

### Goal

Extend existing payroll prechecks with native-calculation controls.

### In scope

Validation layers:
- input completeness
- country-pack eligibility
- missing tax/social identifiers
- invalid negative/zero values
- unusual gross/net change
- negative net
- statutory cap/band sanity
- YTD inconsistency
- duplicate worker/run
- missing bank/payment details where required
- filing-required data gaps

### Severity

- info
- warning
- blocking error

### Acceptance criteria

- [ ] Country pack can register prechecks.
- [ ] Blocking issues stop finalization.
- [ ] Warning overrides require reason where configured.
- [ ] Precheck results are versioned with run.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-010] Statutory filing framework

**Recommended label:** `enhancement`

### Goal

Create a generic filing lifecycle that country packs can extend for local authority schemas.

### In scope

`statutory_filing`
- country pack
- legal entity
- period/year
- filing type
- schema version
- source payroll run(s)
- generated payload/file
- submission timestamp
- status
- external submission/reference ID

Generic states:
`DRAFT → VALIDATED → SUBMITTED → ACKNOWLEDGED / REJECTED`

### Requirements

- schema/version validation
- control totals
- generated-file checksum
- secure submission adapter
- idempotency/re-submission policy
- audit trail

### Acceptance criteria

- [ ] Country pack can define filing type/schema.
- [ ] Filing is linked to exact payroll runs.
- [ ] Submission state is separate from calculation.
- [ ] Generated payload/version is retained.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-011] Filing acknowledgement, rejection & correction lifecycle

**Recommended label:** `enhancement`

### Goal

Handle government/provider responses and corrected filings safely.

### In scope

- acknowledgement
- rejection
- validation error parsing
- correction/amendment
- replacement submission
- original filing lineage
- support queue
- response evidence

### Critical rules

- Rejected filing does not rewrite finalized payroll.
- Correction may require payroll adjustment, filing-only correction, or both.
- Preserve every submitted/acknowledged version.

### Acceptance criteria

- [ ] Filing responses are ingested.
- [ ] Errors are actionable.
- [ ] Corrected filing references original.
- [ ] Filing history remains immutable/auditable.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-012] Year-end payroll framework

**Recommended label:** `enhancement`

### Goal

Provide a generic year-end process country packs can extend.

### In scope

- payroll year definition
- year-to-date validation
- employee totals
- employer totals
- final-period checks
- year-end statements
- year-end filing types
- correction/reissue
- archive/retention
- new-year accumulator reset with historical preservation

### Acceptance criteria

- [ ] Country pack can define payroll-year/year-end requirements.
- [ ] YTD totals reconcile to finalized runs.
- [ ] Year-end statements are versioned.
- [ ] Corrections do not destroy original issued statement.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-013] Native payslip generation, versioning & publication

**Recommended label:** `enhancement`

### Goal

Generate employee pay statements from native payroll results.

### In scope

- payslip template by country/legal entity
- earning/deduction/tax/contribution detail
- gross/net
- YTD fields where required
- employer metadata
- pay period/date
- localized labels
- corrected/reissued payslip
- secure document publication
- employee notification

### Business rules

- Payslip is a snapshot of finalized result.
- Correction creates new version.
- Employee access uses existing secure document/pay-history controls.

### Acceptance criteria

- [ ] Finalized run can generate payslip.
- [ ] Payslip matches calculation result.
- [ ] Reissue creates version/history.
- [ ] Employee sees only own statements.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-014] Payroll payment/disbursement integration boundary

**Recommended label:** `enhancement`

### Goal

Prepare finalized net-pay and remittance outputs for payment systems without embedding banking rails directly into calculation logic.

### In scope

- employee net-pay instruction
- employer/statutory remittance instruction
- payment batch
- bank/payment account reference
- payment date
- currency
- status
- external payment ID
- rejected/returned payment hook

### Security

- Bank data is a separate sensitive boundary.
- Calculation engine references payment identity; it does not log bank details.
- Payment approval can have separate SoD controls.

### Acceptance criteria

- [ ] Finalized payroll produces payment instructions.
- [ ] Payment state is separate from payroll finalization.
- [ ] External payment IDs are retained.
- [ ] Failed payment does not rewrite payroll result.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-015] Payroll accounting/journal integration hardening for native payroll

**Recommended label:** `enhancement`

### Goal

Extend payroll-to-GL integration to native statutory results and employer costs.

### In scope

- earning expense
- employee deductions payable
- tax liabilities
- social/pension liabilities
- employer tax/contribution expense
- cash/payroll payable
- cost center
- legal entity
- country
- adjustment/off-cycle journals
- reconciliation to payroll run

### Acceptance criteria

- [ ] Native result lines map to accounting categories.
- [ ] Journal balances.
- [ ] Adjustments/reversals create corresponding journal treatment.
- [ ] Journal can reconcile to run and filing totals.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-016] Payroll audit evidence & calculation explainability

**Recommended label:** `enhancement`

### Goal

Provide defensible evidence for how a payroll result was produced.

### In scope

For each result:
- input snapshot ID/version
- country pack version
- rule versions
- calculation trace
- operator actions
- overrides
- approvals
- filing references
- payment references
- accounting references

### UI

- worker payroll calculation explanation
- run-level audit timeline
- rule-version view
- override history
- retro/reversal lineage

### Acceptance criteria

- [ ] Authorized payroll user can explain any result amount.
- [ ] Rule/source version is visible.
- [ ] Original, corrected and adjustment results are linked.
- [ ] Audit access does not expose data outside authorized scope.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-017] Payroll security, segregation of duties & privileged operations

**Recommended label:** `enhancement`

### Goal

Apply stronger governance to native payroll preparation, approval, filing and payment.

### In scope

Distinct privileges:
- maintain payroll config
- maintain employee tax/bank data
- prepare run
- calculate
- override
- approve/finalize
- submit filing
- approve payment
- view payroll
- export payroll
- reopen/correct closed run

### SoD examples

- preparer vs final approver
- configuration change vs approval of impacted run
- payment instruction creation vs payment approval
- access administration vs own privilege approval

### Acceptance criteria

- [ ] Payroll privileges are independently assignable.
- [ ] SoD policy can detect configured conflicts.
- [ ] Sensitive exports require explicit permission.
- [ ] Privileged overrides/reopen operations require reason/audit.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-018] Payroll test harness, golden datasets & regression suite

**Recommended label:** `enhancement`

### Goal

Make statutory calculation changes safe to release.

### In scope

Test fixture format:
- country pack/version
- employee profile
- employment/classification
- earnings/time
- tax/social configuration
- expected intermediate values
- expected gross/net
- expected filing fields where applicable

Test categories:
- normal cases
- thresholds
- zero/negative
- period boundary
- year boundary
- hire/termination
- retro
- off-cycle
- multiple earnings
- rounding
- maximum/minimum/cap boundary

### Release requirement

Every statutory-rule change adds/updates fixtures and produces a regression report.

### Acceptance criteria

- [ ] Golden fixture runner exists.
- [ ] Tests can select pack/version.
- [ ] Intermediate and final amounts can be asserted.
- [ ] Regression output is retained in release process.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-019] Country-pack release, approval & statutory update governance

**Recommended label:** `enhancement`

### Goal

Define the operational process for maintaining payroll law after launch.

### In scope

- statutory change intake
- impact analysis
- rule implementation
- source metadata update
- effective date
- QA
- independent payroll/SME review
- release approval
- customer release notes
- future-dated activation
- emergency patch
- rollback
- post-release monitoring

### Acceptance criteria

- [ ] Every pack release identifies statutory source/effective date.
- [ ] Production activation can be future-dated.
- [ ] Regression evidence is attached.
- [ ] Emergency rollback preserves historical runs.
- [ ] Ownership for monitoring statutory changes is documented.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-000] United States payroll pack roadmap

**Recommended label:** `enhancement`

### Blueprint-derived scope

The supplied blueprint identifies:
- federal plus state/local wage-hour/payroll requirements;
- FLSA overtime/recordkeeping context;
- federal employment-tax reporting;
- Forms 941 and W-2/W-3;
- I-9 retention as an HR record requirement;
- FMLA/state leave overlays;
- state-specific privacy and labor variation.

### Goal

Deliver a U.S. pack architecture that supports federal rules plus state/local overlays instead of treating the U.S. as one flat jurisdiction.

### Tracking
- [ ] PAY-US-001
- [ ] PAY-US-002
- [ ] PAY-US-003
- [ ] PAY-US-004
- [ ] PAY-US-005
- [ ] PAY-US-006
- [ ] PAY-US-007
- [ ] PAY-US-008
- [ ] PAY-US-009
- [ ] PAY-US-010

---

## [PAY-US-001] U.S. payroll jurisdiction, workweek & worker-classification model

**Recommended label:** `enhancement`

### Goal

Resolve U.S. federal/state/local payroll and wage-hour context for each employment/pay period.

### In scope

- federal jurisdiction baseline
- work state
- resident state hook
- local jurisdiction hook
- workweek definition
- exempt/nonexempt classification
- employee/employer tax identifier hooks
- effective dates
- multi-state work allocation extension point

### Acceptance criteria

- [ ] Worker has effective-dated U.S. payroll jurisdiction context.
- [ ] Workweek is explicit.
- [ ] State/local overlays can be registered separately.
- [ ] Classification changes preserve history.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-002] U.S. federal income-tax withholding calculation module

**Recommended label:** `enhancement`

### Goal

Implement federal income-tax withholding as a versioned statutory calculation module.

### Requirements

- year/effective-date version
- employee withholding elections/input model
- taxable wage base
- regular/supplemental earning hooks
- YTD accumulators where required
- rounding
- calculation trace
- golden tests

### Acceptance criteria

- [ ] Federal withholding uses explicit versioned rule data.
- [ ] Employee elections are effective-dated.
- [ ] Result is explainable and reproducible.
- [ ] Boundary tests exist for supported scenarios.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-003] U.S. Social Security / Medicare contribution module

**Recommended label:** `enhancement`

### Goal

Calculate employee/employer federal social-insurance payroll contributions using versioned rules.

### In scope

- contributory wage base
- employee contribution
- employer contribution
- annual cap hooks
- additional contribution threshold hooks where applicable to supported rule set
- YTD accumulation
- calculation trace

### Acceptance criteria

- [ ] Employee and employer amounts are separated.
- [ ] Annual accumulators/caps work.
- [ ] Rule version/effective date is retained.
- [ ] YTD totals reconcile to payroll results.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-004] U.S. state/local tax adapter framework

**Recommended label:** `enhancement`

### Goal

Allow state/local payroll-tax modules to be installed independently.

### In scope

- state pack interface
- local jurisdiction interface
- resident/work jurisdiction inputs
- reciprocity hook
- state unemployment/employer-tax hook
- state withholding module registration
- local tax registration
- effective-date/version metadata

### Important note

This ticket is a framework. Individual state/local statutory formulas require their own validated modules and are not supplied by the blueprint.

### Acceptance criteria

- [ ] Federal pack can compose state/local modules.
- [ ] Multiple jurisdiction modules can contribute to one payroll result.
- [ ] Unsupported jurisdiction is clearly blocked/flagged.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-005] U.S. FLSA time-to-pay integration & overtime evidence

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint notes federal overtime generally applies to covered nonexempt employees after 40 hours in a workweek, while state rules can require additional logic.

### Goal

Connect the existing WFM overtime engine to U.S. payroll and retain workweek/classification evidence.

### In scope

- nonexempt eligibility hook
- workweek context
- regular/overtime earning mapping
- state-rule override/stacking hook
- calculation evidence
- payroll result mapping

### Acceptance criteria

- [ ] U.S. payroll consumes approved WFM premium outputs.
- [ ] Workweek and classification context are retained.
- [ ] State/local rule modules can add/override treatment.
- [ ] Final output links to original time/rule evidence.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-006] U.S. federal payroll filing framework — Form 941 family

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint identifies federal employment-tax reporting including Form 941.

### Goal

Implement a versioned federal periodic filing adapter for supported U.S. payroll-tax reporting.

### In scope

- filing schema/version
- legal employer data
- payroll-period/quarter totals
- control totals
- generated filing payload
- submission adapter boundary
- acknowledgement/correction workflow

### Acceptance criteria

- [ ] Filing is generated from finalized payroll results.
- [ ] Totals reconcile to run/YTD data.
- [ ] Schema version is retained.
- [ ] Correction references prior filing.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-007] U.S. year-end wage reporting — W-2 / W-3 framework

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint identifies W-2/W-3 year-end wage reporting.

### Goal

Generate employee and employer year-end wage reporting from finalized payroll history.

### In scope

- employee annual totals
- employer aggregate
- W-2/W-3 schema adapter
- corrected statement hook
- employee statement publication
- filing status/acknowledgement

### Acceptance criteria

- [ ] Annual totals reconcile to finalized payroll.
- [ ] Employee year-end statement is versioned.
- [ ] Correction/reissue preserves original history.
- [ ] Employer filing totals reconcile to worker statements.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-008] U.S. payroll record-retention metadata & evidence controls

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint notes U.S. payroll records generally need multi-year retention and supporting wage-computation records have their own retention periods.

### Goal

Apply U.S.-specific retention classes to payroll and wage/time evidence.

### In scope

- payroll result retention class
- wage/time source retention class
- filing evidence
- year-end statements
- legal hold
- retention trigger
- expiry
- deletion/anonymization exception handling

### Acceptance criteria

- [ ] U.S. payroll records receive explicit retention metadata.
- [ ] Time/wage evidence can have a distinct retention class.
- [ ] Privacy deletion workflow respects statutory retention.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-009] U.S. termination/final-pay country-pack hooks

**Recommended label:** `enhancement`

### Goal

Provide country-pack hooks for final payroll handling while allowing state-specific final-pay modules later.

### In scope

- termination effective date
- last-worked date
- final pay run
- accrued leave payout hook
- deductions/benefits final-period handling hook
- state-specific final-pay deadline adapter interface
- year-end continuation

### Acceptance criteria

- [ ] Final pay can be calculated off-cycle.
- [ ] State-specific deadline/rule module can be attached.
- [ ] Termination does not break YTD/year-end reporting.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-US-010] U.S. payroll pack certification & regression suite

**Recommended label:** `enhancement`

### Goal

Create a U.S.-specific golden test set covering federal plus selected supported state/local modules.

### Test matrix

- regular salaried
- hourly/nonexempt
- overtime
- supplemental earnings
- hire mid-year
- termination
- YTD cap boundary
- retro
- off-cycle
- state/local adapter cases
- quarterly filing totals
- year-end reconciliation

### Acceptance criteria

- [ ] U.S. release cannot activate without pack regression pass.
- [ ] Each supported state/local module declares its test coverage.
- [ ] Filing/year-end totals reconcile in fixtures.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-000] United Kingdom payroll pack roadmap

**Recommended label:** `enhancement`

### Blueprint-derived scope

The blueprint identifies:
- PAYE / Real Time Information;
- workplace pension eligibility/enrolment/re-enrolment;
- UK statutory leave/holiday context;
- tax/NI/payroll identifiers;
- UK GDPR / DPA employment-data considerations.

### Tracking
- [ ] PAY-UK-001
- [ ] PAY-UK-002
- [ ] PAY-UK-003
- [ ] PAY-UK-004
- [ ] PAY-UK-005
- [ ] PAY-UK-006
- [ ] PAY-UK-007
- [ ] PAY-UK-008
- [ ] PAY-UK-009
- [ ] PAY-UK-010

---

## [PAY-UK-001] UK payroll worker identifiers & tax/NI configuration

**Recommended label:** `enhancement`

### Goal

Model UK-specific employee and employer payroll identifiers and effective payroll configuration.

### In scope

- employer PAYE reference hooks
- employee tax code/configuration
- National Insurance category/configuration
- starter/leaver metadata hooks
- payroll ID
- effective dates
- sensitive-field permissions

### Acceptance criteria

- [ ] UK-specific payroll identifiers are separately permissioned.
- [ ] Configuration is effective-dated.
- [ ] Missing required data produces precheck errors.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-002] UK PAYE income-tax calculation module

**Recommended label:** `enhancement`

### Goal

Implement a versioned UK PAYE calculation module for supported tax-year scenarios.

### In scope

- tax-year rule version
- taxable pay
- tax code/election inputs
- period/YTD accumulators
- cumulative/non-cumulative hooks as supported
- calculation trace
- rounding
- golden tests

### Acceptance criteria

- [ ] PAYE module is versioned by tax year/effective period.
- [ ] Calculation retains tax-code/input lineage.
- [ ] YTD totals reconcile.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-003] UK National Insurance contribution module

**Recommended label:** `enhancement`

### Goal

Calculate employee/employer NI contributions using versioned rules.

### In scope

- NI category
- thresholds/bands
- employee amount
- employer amount
- pay-period accumulators as required
- calculation trace

### Acceptance criteria

- [ ] Employee/employer NI are separated.
- [ ] Category changes are effective-dated.
- [ ] Golden threshold/band tests exist.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-004] UK PAYE Real Time Information submission lifecycle

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint states RTI transmits tax/deduction information to HMRC each time an employee is paid.

### Goal

Implement RTI-oriented filing lifecycle linked to each applicable payroll close.

### In scope

- RTI filing type adapter
- pay-event linkage
- schema/version
- employer/employee payroll identifiers
- generated submission
- acknowledgement
- rejection
- correction/replacement flow
- submission reference

### Acceptance criteria

- [ ] RTI submission is generated from finalized pay event.
- [ ] Submission schema/version is retained.
- [ ] Response is ingested.
- [ ] Correction workflow preserves original submission.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-005] UK workplace pension eligibility & contribution integration

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint identifies workplace-pension eligibility, employer contribution, ongoing monitoring and re-enrolment duties.

### Goal

Integrate pension eligibility/contribution logic into UK payroll while keeping provider enrollment state distinct.

### In scope

- worker pension eligibility inputs
- pension scheme/provider reference
- employee contribution
- employer contribution
- effective dates
- postponement/opt-out hooks as applicable to supported implementation
- re-enrolment review hook
- payroll deduction/contribution output
- provider/export boundary

### Acceptance criteria

- [ ] Pension contributions are versioned/effective-dated.
- [ ] Employee/employer amounts are separated.
- [ ] Eligibility/enrolment state is traceable.
- [ ] Provider sync state does not alter payroll result.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-006] UK statutory leave/pay calculation hooks

**Recommended label:** `enhancement`

### Goal

Provide country-pack extension points for supported UK statutory leave/pay calculations.

### Blueprint basis

The blueprint recommends a UK statutory leave policy pack and distinguishes ordinary PTO from more complex statutory/protected leave.

### In scope

- statutory leave case reference
- qualifying-pay input hook
- statutory pay earning code
- effective rule version
- leave/payroll integration
- payroll result evidence

### Important note

Exact leave/pay formulas and covered leave types require validated statutory specifications before implementation.

### Acceptance criteria

- [ ] Payroll can consume approved UK statutory leave/pay outputs.
- [ ] Result retains leave case and rule-version lineage.
- [ ] Ordinary PTO remains separate.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-007] UK starter, leaver & final-pay payroll workflow

**Recommended label:** `enhancement`

### Goal

Handle UK payroll lifecycle changes without losing RTI/year-to-date continuity.

### In scope

- starter payroll setup
- first-period handling hooks
- leaver date
- final pay
- final statement/document hooks
- payroll/RTI status
- rehire/new employment handling

### Acceptance criteria

- [ ] Starter/leaver data is effective-dated.
- [ ] Final pay can be calculated and reported.
- [ ] Former employee history remains available.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-008] UK payroll year-end & employee statement framework

**Recommended label:** `enhancement`

### Goal

Provide a UK-specific year-end extension using the shared year-end platform.

### In scope

- tax-year close
- employee annual totals
- year-end filing/statement adapter hooks
- corrected/reissued statement
- archive/retention

### Acceptance criteria

- [ ] UK tax-year totals reconcile.
- [ ] Year-end output is pack-versioned.
- [ ] Reissue preserves prior version.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-009] UK payroll/privacy retention metadata

**Recommended label:** `enhancement`

### Goal

Apply UK-specific privacy/special-category and payroll-retention metadata to payroll records.

### In scope

- payroll retention class
- special-category leave/health evidence separation
- filing evidence
- employee statement retention
- legal hold
- DSAR/export hooks

### Acceptance criteria

- [ ] Payroll/privacy workflows respect record classes.
- [ ] Sensitive leave/health evidence is not exposed through normal payroll views.
- [ ] Retention exception decisions are auditable.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-UK-010] UK payroll pack regression & filing test suite

**Recommended label:** `enhancement`

### Test scenarios

- normal monthly pay
- tax-code changes
- NI categories
- pension contribution
- starter
- leaver/final pay
- backdated compensation
- correction
- RTI submission/response
- year-end totals

### Acceptance criteria

- [ ] UK pack has golden calculation fixtures.
- [ ] RTI fixture/output validation exists.
- [ ] YTD/year-end reconciliation passes.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-000] India payroll pack roadmap

**Recommended label:** `enhancement`

### Blueprint-derived scope

The blueprint identifies:
- four Labour Codes effective November 21, 2025;
- salary TDS computation transition from April 1, 2026 under the Income Tax Act, 2025 framework;
- EPFO Electronic Challan-cum-Return workflows;
- DPDP transition;
- state/UT-specific configuration rather than one immutable national profile.

### Tracking
- [ ] PAY-IN-001
- [ ] PAY-IN-002
- [ ] PAY-IN-003
- [ ] PAY-IN-004
- [ ] PAY-IN-005
- [ ] PAY-IN-006
- [ ] PAY-IN-007
- [ ] PAY-IN-008
- [ ] PAY-IN-009
- [ ] PAY-IN-010

---

## [PAY-IN-001] India payroll jurisdiction, worker & statutory identifier model

**Recommended label:** `enhancement`

### Goal

Model India-specific payroll identity and jurisdiction inputs while preserving state/UT extension points.

### In scope

- legal entity
- work state/UT
- worker classification
- payroll identifiers
- tax identifier hooks
- EPFO identifiers/hooks
- wage-definition metadata hook
- effective dates

### Acceptance criteria

- [ ] India worker payroll context is effective-dated.
- [ ] State/UT extension point exists.
- [ ] Sensitive identifiers are permission-isolated.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-002] India salary TDS calculation module — 2026+ effective-version architecture

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint states employers had to reset salary TDS computation from April 1, 2026 under the new tax framework.

### Goal

Implement salary TDS as an explicitly tax-year/effective-dated calculation module.

### In scope

- tax-year version
- salary taxable-base inputs
- employee declarations/elections hooks
- period/YTD projection hooks
- tax calculation
- withholding-to-date
- adjustment through remaining periods
- calculation trace

### Acceptance criteria

- [ ] TDS rules are versioned by tax year/effective date.
- [ ] April 1, 2026+ transition is represented as a distinct rule version.
- [ ] YTD/projected values are explainable.
- [ ] Golden boundary tests exist.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-003] India EPFO contribution calculation & membership integration

**Recommended label:** `enhancement`

### Goal

Calculate supported employee/employer EPFO contribution outputs and link membership identifiers.

### In scope

- EPFO eligibility/member context
- contributory wage base
- employee contribution
- employer contribution
- component mapping hooks
- effective rule version
- ECR output mapping

### Acceptance criteria

- [ ] Employee/employer contributions are separated.
- [ ] Rule version is retained.
- [ ] Contribution output maps into ECR adapter.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-004] India EPFO ECR generation, upload & acknowledgement workflow

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint identifies EPFO Electronic Challan-cum-Return employer workflows.

### Goal

Generate ECR-compatible employer output and preserve acknowledgement/error lifecycle.

### In scope

- ECR schema/version
- legal employer
- employee/member identifiers
- contribution totals
- generated file/payload
- validation
- upload/integration boundary
- acknowledgement
- error/correction

### Acceptance criteria

- [ ] ECR output is generated from finalized payroll.
- [ ] Totals reconcile to EPFO contribution results.
- [ ] Acknowledgement/error state is retained.
- [ ] Correction references original submission.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-005] India Labour-Code payroll rule hooks & wage-definition versioning

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint states the four Labour Codes became effective November 21, 2025 and recommends effective-dated labor-code policy content.

### Goal

Provide versioned payroll hooks for wage definitions/classifications affected by the Labour Code framework.

### In scope

- wage-definition rule metadata
- classification
- inclusion/exclusion of earning components
- effective date
- statutory contribution/tax-base hooks
- source/version evidence

### Important note

The blueprint supports the architectural need, not every implementing rule or state-level detail. Exact formulas must be validated before coding.

### Acceptance criteria

- [ ] India pack can version wage-definition rules.
- [ ] Derived payroll bases retain rule lineage.
- [ ] State/UT extensions can add local requirements.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-006] India state/UT payroll extension framework

**Recommended label:** `enhancement`

### Goal

Avoid representing India as one immutable national payroll profile.

### In scope

- state/UT pack registration
- local payroll tax/levy hook
- leave/wage rule hook
- local filing/output hook
- effective dates
- unsupported-state blocking/warning

### Acceptance criteria

- [ ] India national pack can compose state/UT modules.
- [ ] Unsupported local requirements are visible.
- [ ] State module versions are retained.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-007] India payroll filing/remittance adapter framework

**Recommended label:** `enhancement`

### Goal

Use the shared statutory filing framework for India-specific tax/social-security outputs.

### In scope

- filing types
- remittance references
- tax-year/pay-period linkage
- generated output
- acknowledgement
- correction
- control totals

### Acceptance criteria

- [ ] India pack can register filing/remittance adapters.
- [ ] Outputs reconcile to payroll results.
- [ ] Submission/correction history is retained.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-008] India final-pay, arrears & retro payroll handling

**Recommended label:** `enhancement`

### Goal

Handle backdated wage/pay changes and final pay through native retro/off-cycle foundations.

### In scope

- arrears trigger
- affected period detection
- delta
- current/off-cycle payment
- termination/final pay
- TDS/EPFO recalculation hooks
- audit

### Acceptance criteria

- [ ] Backdated change creates explicit delta.
- [ ] Original closed run remains unchanged.
- [ ] Statutory components are recalculated consistently.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-009] India payroll privacy/DPDP & retention metadata hooks

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint notes DPDP implementation is phased and recommends building toward final-state privacy controls rather than assuming all obligations began together.

### Goal

Attach India-specific privacy/retention metadata without hard-coding a single commencement assumption.

### In scope

- payroll record class
- notice/purpose metadata hook
- employee data-right workflow integration
- retention/legal-hold
- phased effective-date metadata

### Acceptance criteria

- [ ] India privacy metadata is effective/version aware.
- [ ] Payroll retention can override deletion where required.
- [ ] Sensitive identifiers are separately protected.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-IN-010] India payroll pack regression & statutory-output test suite

**Recommended label:** `enhancement`

### Test scenarios

- normal salary
- tax-year transition/version selection
- TDS projection/adjustment
- EPFO
- state/UT adapter
- mid-year hire
- termination/final pay
- arrears/retro
- ECR output/acknowledgement
- year-end totals

### Acceptance criteria

- [ ] India golden fixtures select correct effective rule versions.
- [ ] EPFO/ECR totals reconcile.
- [ ] Retro/TDS scenarios are covered.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-000] Australia payroll pack roadmap

**Recommended label:** `enhancement`

### Blueprint-derived scope

The blueprint identifies:
- Fair Work wage/time record requirements;
- modern awards and enterprise/registered agreements;
- overtime, penalty rates and work conditions;
- seven-year employment time/wage record retention;
- Single Touch Payroll;
- Payday Super changes from July 1, 2026;
- payslip publication timing;
- privacy/TFN handling nuances.

### Tracking
- [ ] PAY-AU-001
- [ ] PAY-AU-002
- [ ] PAY-AU-003
- [ ] PAY-AU-004
- [ ] PAY-AU-005
- [ ] PAY-AU-006
- [ ] PAY-AU-007
- [ ] PAY-AU-008
- [ ] PAY-AU-009
- [ ] PAY-AU-010
- [ ] PAY-AU-011

---

## [PAY-AU-001] Australia worker classification, award/agreement & payroll context

**Recommended label:** `enhancement`

### Goal

Resolve the employment/pay-rule context needed for Australian payroll.

### In scope

- legal entity
- work location
- worker classification
- award/agreement reference
- classification level hook
- employment type
- ordinary-hours context
- effective dates

### Critical rule

Awards/agreements are versioned rule sources, not free-text notes.

### Acceptance criteria

- [ ] Worker can be assigned effective-dated award/agreement context.
- [ ] Rule source/version is retained.
- [ ] Unsupported classifications are surfaced before payroll finalization.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-002] Australia PAYG withholding calculation module

**Recommended label:** `enhancement`

### Goal

Implement Australian payroll withholding using a versioned statutory rule module.

### In scope

- employee tax configuration hooks
- taxable earnings
- withholding rule version
- pay-frequency handling
- YTD
- rounding
- calculation trace

### Acceptance criteria

- [ ] PAYG calculation is versioned.
- [ ] Result is explainable.
- [ ] Golden threshold/boundary scenarios exist.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-003] Australia superannuation calculation & Payday Super effective rules

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint notes a July 1, 2026 change under Payday Super and ties super liability/reporting more closely to payday.

### Goal

Implement versioned superannuation liability calculation with explicit support for post-July-1-2026 effective rules.

### In scope

- super eligibility/configuration
- qualifying earnings base
- employee/provider/member references
- employer liability
- pay-date relationship
- effective-date rule version
- payment/remittance status hook

### Acceptance criteria

- [ ] Super rule versions include July 1, 2026 transition boundary.
- [ ] Liability is linked to payroll/pay date.
- [ ] Calculation retains source/version.
- [ ] Remittance/payment status is separate from payroll result.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-004] Australia STP reporting adapter

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint identifies Single Touch Payroll and states that from July 1, 2026 reporting includes qualifying-earnings and super-liability information.

### Goal

Generate and manage STP submissions using versioned schemas/effective rules.

### In scope

- STP schema version
- employer/employee payroll data
- earnings/tax
- qualifying earnings/super liability fields as required by supported version
- submission
- acknowledgement
- rejection
- correction/update event

### Acceptance criteria

- [ ] STP output is generated from finalized payroll.
- [ ] Effective schema/version is selected by pay date/period.
- [ ] Provider/authority responses are retained.
- [ ] Correction preserves original submission.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-005] Australia award/agreement time-to-pay integration

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint states awards may govern overtime, penalty rates and hours of work and treats this as a WFM/payroll rule-engine problem.

### Goal

Connect the versioned WFM rule engine to Australian payroll classification.

### In scope

- award/agreement rule-set reference
- overtime output
- penalty-rate output
- break/rest premium output
- ordinary time
- earning-code mapping
- source time/schedule/rule lineage

### Important note

Exact award interpretation must be implemented as validated versioned rule packs; this ticket provides the payroll integration contract.

### Acceptance criteria

- [ ] Payroll can consume award/agreement evaluated outputs.
- [ ] Result preserves source WFM rule version.
- [ ] Unsupported rule pack blocks or warns explicitly.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-006] Australia leave and termination payroll hooks

**Recommended label:** `enhancement`

### Goal

Integrate supported Australian leave/final-pay components with payroll.

### In scope

- approved paid leave earning mapping
- leave payout hook
- termination effective date
- final pay/off-cycle
- award/agreement extension point
- super/tax recalculation

### Acceptance criteria

- [ ] Paid leave inputs map into payroll.
- [ ] Final pay is processed through controlled run.
- [ ] Country/award rules can extend payout behavior.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-007] Australia payslip generation & publication SLA controls

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint states Fair Work requires payslips within one working day of payday.

### Goal

Generate Australian payslips and track publication timing.

### In scope

- AU payslip template fields
- finalized result linkage
- publication timestamp
- pay-date SLA status
- corrected/reissued statement
- employee access

### Acceptance criteria

- [ ] Payslip generates from finalized result.
- [ ] System tracks pay date vs publication timestamp.
- [ ] Late publication can be reported.
- [ ] Reissue preserves history.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-008] Australia seven-year payroll/time record-retention classes

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint states relevant employee time and wage records must be kept for seven years.

### Goal

Apply explicit Australian retention rules to payroll/time evidence.

### In scope

- wage record class
- time record class
- payslip
- STP evidence
- super evidence
- retention trigger
- seven-year duration metadata
- legal hold
- correction history

### Acceptance criteria

- [ ] AU wage/time records receive retention classification.
- [ ] Corrected record retains original.
- [ ] Privacy workflow cannot erase retained evidence prematurely.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-009] Australia TFN/sensitive payroll-data controls

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint notes Australian employee-record privacy nuances and separate Tax File Number considerations.

### Goal

Create a strict sensitive-data boundary for Australian tax/payroll identifiers.

### In scope

- tax identifier field classification
- masking
- payroll-only access
- export control
- audit access
- secrets/log redaction
- retention metadata

### Acceptance criteria

- [ ] Sensitive tax identifiers are masked outside authorized payroll roles.
- [ ] Exports require explicit privilege.
- [ ] Values are excluded from ordinary logs/audit diffs where unsafe.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-010] Australia payroll year-end & statutory reconciliation framework

**Recommended label:** `enhancement`

### Goal

Provide Australian year-end reconciliation using shared payroll-year infrastructure.

### In scope

- annual totals
- PAYG/STP reconciliation
- super totals
- employee annual summary hooks
- corrections
- archive

### Acceptance criteria

- [ ] Annual totals reconcile to payroll/STP submissions.
- [ ] Corrections preserve original history.
- [ ] Year-end output references pack/schema version.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-AU-011] Australia payroll pack regression & award-rule integration suite

**Recommended label:** `enhancement`

### Test scenarios

- ordinary salaried/hourly pay
- PAYG boundary cases
- super before/after July 1, 2026 rule transition
- STP schema selection
- award/penalty output integration
- overtime
- final pay
- payslip timing
- retro
- seven-year retention metadata

### Acceptance criteria

- [ ] AU pack has golden calculation fixtures.
- [ ] July 1, 2026 transition scenarios are explicitly tested.
- [ ] STP and super totals reconcile.
- [ ] WFM pay-output integration is covered.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-EU-000] EU Member-State payroll-pack framework roadmap

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint explicitly states:

- the EU should be treated as a regulatory baseline plus **Member-State packs**;
- GDPR is common, while payroll tax, social insurance, labor law and many statutory leave rules remain national;
- working-time minimums may be strengthened by Member States;
- pay-transparency obligations must map to each Member State's implementation.

### Goal

Create the architecture for Member-State payroll packs without falsely implementing a single `EU payroll` calculation engine.

### Tracking
- [ ] PAY-EU-001
- [ ] PAY-EU-002
- [ ] PAY-EU-003
- [ ] PAY-EU-004
- [ ] PAY-EU-005
- [ ] PAY-EU-006

---

## [PAY-EU-001] EU baseline privacy & employment-payroll metadata layer

**Recommended label:** `enhancement`

### Goal

Provide reusable GDPR-oriented payroll privacy metadata inherited by Member-State packs.

### In scope

- purpose/lawful-basis metadata hook
- minimization classification
- sensitive payroll fields
- access logging
- retention policy hook
- DSAR/export
- legal hold
- country/member-state override

### Acceptance criteria

- [ ] Member-State payroll records inherit privacy metadata.
- [ ] National statutory retention can override generic deletion.
- [ ] Sensitive payroll fields have dedicated access classification.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-EU-002] EU Member-State payroll adapter contract

**Recommended label:** `enhancement`

### Goal

Define the required interface every EU Member-State payroll pack must implement.

### Required modules

- payroll-tax calculation
- employee social-insurance contribution
- employer contribution
- local filing/remittance
- year-end
- statutory identifier model
- leave/pay hooks
- record retention
- payslip requirements
- effective-date/version metadata

### Acceptance criteria

- [ ] A Member-State pack can register all required modules.
- [ ] Unsupported modules block production activation.
- [ ] Shared engine does not assume one EU tax/social formula.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-EU-003] EU working-time/pay-rule integration contract

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint notes EU-level working-time minima but stronger/national Member-State rules.

### Goal

Connect Member-State payroll packs to the WFM rule engine without hard-coding the EU minimum as payroll law everywhere.

### In scope

- work jurisdiction
- Member-State WFM pack
- overtime/premium outputs
- rest/break evidence
- local earning mapping
- effective-date/version

### Acceptance criteria

- [ ] Payroll consumes Member-State-specific WFM output.
- [ ] EU baseline is not treated as the only applicable rule.
- [ ] Source Member-State/rule version is retained.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-EU-004] EU pay-transparency payroll/reporting data hooks

**Recommended label:** `enhancement`

### Blueprint basis

The blueprint treats pay-transparency functionality as an active localization requirement while requiring exact obligations to map to each Member State's implementation.

### Goal

Ensure payroll/compensation data can support Member-State pay-transparency reporting without creating one universal statutory report.

### In scope

- pay range/grade references
- compensation/payroll dataset hooks
- worker population dimensions
- reporting-period history
- protected-field access controls
- Member-State reporting adapter interface

### Acceptance criteria

- [ ] Payroll/comp data can feed Member-State transparency adapters.
- [ ] Member-State schema/threshold rules remain separate.
- [ ] Sensitive demographic data is separately permissioned.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-EU-005] EU Member-State pack release & transposition-version governance

**Recommended label:** `enhancement`

### Goal

Support national legal changes independently across Member States.

### In scope

- Member-State version
- effective date
- source metadata
- transposition/local rule metadata
- statutory change release notes
- regression pack
- future-dated activation
- emergency correction

### Acceptance criteria

- [ ] One Member-State update does not require changing unrelated countries.
- [ ] Historical payroll retains local version.
- [ ] Release evidence includes local authoritative source metadata.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---

## [PAY-EU-006] EU Member-State pack template & first-country readiness checklist

**Recommended label:** `enhancement`

### Goal

Create a reusable implementation template for adding the first actual EU Member-State payroll pack.

### Checklist

- [ ] tax identifiers
- [ ] income/payroll tax
- [ ] employee social insurance
- [ ] employer social insurance
- [ ] pension/retirement where applicable
- [ ] local wage/time integration
- [ ] statutory leave/pay hooks
- [ ] filing/remittance
- [ ] payslip
- [ ] year-end
- [ ] retention/privacy
- [ ] golden calculations
- [ ] authority schema validation
- [ ] correction workflow
- [ ] operational statutory-update owner

### Important note

The supplied blueprint does not provide enough Member-State-specific payroll detail to choose or fully specify the first EU country pack here. That selection should be made separately based on target market and authoritative country research.

### Global definition of done

Unless explicitly overridden:

- [ ] Tenant and legal-entity isolation is enforced.
- [ ] Country/jurisdiction resolution is explicit and tested.
- [ ] Server-side payroll authorization is implemented.
- [ ] Sensitive tax/bank/pay fields are field-permission protected.
- [ ] Relevant statutory rules are effective-dated and versioned.
- [ ] Calculation output retains rule/version/source lineage.
- [ ] Rounding and monetary precision are deterministic.
- [ ] Closed/finalized payroll cannot be destructively edited.
- [ ] Corrections use adjustment/reversal/retro/off-cycle semantics.
- [ ] Payroll actions are fully audited.
- [ ] Filing/payment/integration retries are idempotency-safe.
- [ ] Secrets and sensitive PII are not written to ordinary logs.
- [ ] Critical calculations have automated unit and scenario tests.
- [ ] Golden payroll examples/regression fixtures are added.
- [ ] Schema changes include migrations.
- [ ] Operational runbook and failure/recovery procedures are documented.
- [ ] Project lint/build/test checks pass.
- [ ] Country-specific formulas/specifications have a documented authoritative source and effective date before production release.

---


# NEXT — AI / Intelligence Layer

After the native payroll/country-pack work, the final major product track described by the blueprint is the **AI / Intelligence Layer**.

A separate `AI-xxx` backlog should be created for:

1. permission-aware HR policy assistant;
2. source/provenance-aware answers;
3. workflow drafting/assistance;
4. payroll/HR anomaly explanations;
5. recruiting assistance;
6. skills/talent matching;
7. workforce forecasting;
8. human review and action-confirmation controls;
9. AI audit logs;
10. jurisdiction-specific employment-AI safeguards.

The blueprint's key principle is that AI should be added **after** the platform has strong permissions, provenance, auditability, human review, and jurisdiction-specific controls.

---

# Suggested implementation strategy

## Do not build all country packs at once

A safer commercial/engineering sequence is:

1. build `PAY-001` through `PAY-019`;
2. select **one first jurisdiction** based on target customers and payroll expertise;
3. implement and validate that pack end-to-end;
4. prove calculation, filing, correction, year-end, reconciliation and statutory-update operations;
5. only then add the second country.

The supplied blueprint provides architectural/regulatory context for U.S., UK, India and Australia but does not select which one should be commercially first.

## Manual GitHub creation workflow

1. Create `PAY-000`.
2. Create shared `PAY-001` through `PAY-019`.
3. Create only the country-pack issues you intend to implement soon; the others can remain in this document until prioritized.
4. Do not code statutory numeric formulas directly from this backlog text.
5. For every country implementation ticket, attach the current authoritative calculation/filing specification before development begins.
6. Add golden fixtures before enabling a rule in production.
7. Use future-dated rule versions for known statutory transitions.
8. Never patch historical payroll calculations in place when legislation changes.
