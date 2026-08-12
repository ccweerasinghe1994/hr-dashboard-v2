import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { databaseUrl } from "@/env/server";
import * as schema from "./schema";

const globalForDatabase = globalThis as unknown as {
  sqlClient?: ReturnType<typeof postgres>;
};

const sqlClient =
  globalForDatabase.sqlClient ??
  postgres(databaseUrl(), {
    max: 10,
    prepare: false,
    onnotice: () => undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.sqlClient = sqlClient;
}

export const db = drizzle({ client: sqlClient, schema });
export type Database = typeof db;
