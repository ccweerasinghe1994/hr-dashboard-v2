# Layer tenant isolation in the application and database

Tenant-owned access requires tenant-explicit data-access APIs, composite tenant foreign keys, and forced PostgreSQL row-level security. The runtime role does not own tables or bypass row security, and each tenant transaction sets a verified transaction-local tenant context; the layers make both omitted predicates and cross-tenant identifiers fail closed, at the cost of separate migration/runtime roles and transaction-scoped repository work.
