# HR Management

The HR Management context is the authoritative, tenant-isolated system of record for customer organizations, their employing entities, and the workforce records introduced by later modules.

## Tenancy and identity

**Tenant**:
A customer organization that forms the primary security and data-isolation boundary. A tenant may contain multiple legal entities.
_Avoid_: Account, workspace, company

**Tenant slug**:
The globally unique, immutable routing and integration key assigned to a tenant during provisioning.
_Avoid_: Tenant name

**Tenant-owned record**:
A business record whose ownership is explicitly attributable to exactly one tenant, directly or through an unambiguous parent.

**Tenant membership**:
The relationship that authorizes an authenticated identity to operate within a tenant. Until full role-based access control is introduced, a membership is either an owner or member.

**Tenant owner**:
A tenant member temporarily authorized to manage tenant and legal-entity configuration until the full role-based authorization model replaces this interim role.
_Avoid_: System administrator, authenticated user

**System provisioning**:
Authority outside every tenant used to create or reactivate customer tenants. It is not granted to ordinary tenant owners.
_Avoid_: Tenant administration

**Current tenant context**:
The active tenant membership stored as server-owned state on the current authenticated session and verified again before tenant-owned data is accessed. A session with no valid active membership fails closed.
_Avoid_: Tenant ID, selected company

**Authenticated identity**:
A verified application user independent of any particular tenant membership or HR authorization.
_Avoid_: Employee, tenant administrator

## Organization

**Legal entity**:
A stable employing or payroll entity owned by a tenant. Its effective-dated configuration preserves changes to its legal identity and presentation over time.
_Avoid_: Company, department, organization

**Legal-entity configuration**:
The effective-dated legal name, display name, country, registration and tax identity, default currency, and operational status that describe a legal entity during a non-overlapping business period.

**Configuration change**:
A new legal-entity configuration with a distinct business-effective date. It may split an existing interval and requires a reason when backdated.
_Avoid_: Correction, edit

**Configuration correction**:
A transaction-time replacement for erroneous legal-entity configuration that retains the original business-effective interval and requires a reason.
_Avoid_: Change, edit

**Legal-entity deactivation**:
An effective-dated transition that prevents new operational use without deleting the legal entity or its historical references.
_Avoid_: Deletion

**Inactive tenant**:
A retained tenant whose interactive sessions, tenant switching, reads, and writes are disabled while memberships, history, and audit evidence remain preserved.

**Tenant status period**:
An append-only business-effective interval during which a tenant is active or inactive, controlled exclusively through system provisioning.

## History and governance

**Business-effective time**:
The half-open calendar-date interval during which a business fact is considered true in the HR domain, including its start date and excluding its end date.

**Transaction time**:
The time at which the application recorded a fact or mutation, independent of when it became effective for the business.
_Avoid_: Effective date

**Audit event**:
Append-only evidence attributing a committed business mutation to its tenant, actor, source, object, transaction time, and safe before/after state.

**Data region**:
A nullable, system-managed request for future regional placement. It is not customer-editable and does not itself guarantee where storage or processing occurs.
_Avoid_: Data residency
