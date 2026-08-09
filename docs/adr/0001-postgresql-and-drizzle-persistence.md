# Use PostgreSQL and Drizzle for persistence

Use vendor-neutral PostgreSQL with Drizzle ORM and checked-in migrations. Local development runs PostgreSQL through Docker Compose, while CI and production run migrations as an explicit deployment step rather than during application startup; this keeps transaction and constraint capabilities without coupling the system to a hosted database vendor.
