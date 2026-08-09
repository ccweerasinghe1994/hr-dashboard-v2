import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const databaseUrl =
  process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("MIGRATION_DATABASE_URL or DATABASE_URL is required.");
}

const client = postgres(databaseUrl, { max: 1, prepare: false });
try {
  await migrate(drizzle(client), {
    migrationsFolder: resolve(import.meta.dir, "../../db/migrations"),
  });
  console.info("Database migrations completed.");
} finally {
  await client.end();
}
