import { randomBytes } from "node:crypto";
import { cp } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import {
  type E2eFixture,
  e2eFixtureEnvironment,
  requiredE2eEnvironmentValue,
} from "./e2e-fixture";

const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
const databaseSuffix = crypto.randomUUID().replaceAll("-", "");
const databaseName = `hr_dashboard_e2e_${databaseSuffix}`;
const baseURL = "http://127.0.0.1:3100";

function databaseUrl(connectionUrl: string, name: string) {
  const url = new URL(connectionUrl);
  url.pathname = `/${name}`;
  return url.toString();
}

function generatedSecret() {
  return randomBytes(32).toString("base64");
}

async function run(command: string[], environment: NodeJS.ProcessEnv) {
  const child = Bun.spawn(command, {
    cwd: projectRoot,
    env: environment,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await child.exited;
  if (exitCode !== 0) {
    throw new Error(`${command.join(" ")} exited with code ${exitCode}.`);
  }
}

async function prepareStandaloneApplication() {
  const standaloneRoot = join(projectRoot, ".next", "standalone");
  await cp(join(projectRoot, "public"), join(standaloneRoot, "public"), {
    recursive: true,
  });
  await cp(
    join(projectRoot, ".next", "static"),
    join(standaloneRoot, ".next", "static"),
    { recursive: true },
  );
}

const adminBaseUrl = requiredE2eEnvironmentValue("TEST_ADMIN_DATABASE_URL");
const runtimeBaseUrl = requiredE2eEnvironmentValue("TEST_DATABASE_URL");
const admin = postgres(adminBaseUrl, { max: 1, prepare: false });
let databaseCreated = false;

try {
  await admin`create database ${admin(databaseName)}`;
  databaseCreated = true;
  console.info(`Created disposable E2E database ${databaseName}.`);

  const bootstrapSecret = process.env.E2E_BOOTSTRAP_SECRET ?? generatedSecret();
  const fixture = {
    bootstrapSecret,
    ownerName: process.env.E2E_OWNER_NAME ?? "Playwright Owner",
    ownerEmail:
      process.env.E2E_OWNER_EMAIL ??
      `playwright-owner-${databaseSuffix}@example.test`,
    ownerPassword:
      process.env.E2E_OWNER_PASSWORD ??
      `E2e-${randomBytes(18).toString("base64url")}!aA1`,
    tenantName:
      process.env.E2E_TENANT_NAME ??
      `Playwright Tenant ${databaseSuffix.slice(0, 8)}`,
    tenantSlug:
      process.env.E2E_TENANT_SLUG ??
      `playwright-tenant-${databaseSuffix.slice(0, 12)}`,
  } satisfies E2eFixture;
  const environment = {
    ...process.env,
    DATABASE_URL: databaseUrl(runtimeBaseUrl, databaseName),
    MIGRATION_DATABASE_URL: databaseUrl(adminBaseUrl, databaseName),
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? generatedSecret(),
    BETTER_AUTH_URL: baseURL,
    TENANT_BOOTSTRAP_SECRET: bootstrapSecret,
    LEGAL_IDENTIFIER_ENCRYPTION_KEY:
      process.env.LEGAL_IDENTIFIER_ENCRYPTION_KEY ?? generatedSecret(),
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY:
      process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY ?? generatedSecret(),
    E2E_BASE_URL: baseURL,
    ...e2eFixtureEnvironment(fixture),
    HOSTNAME: "127.0.0.1",
    NODE_ENV: "production",
    PORT: "3100",
  } satisfies NodeJS.ProcessEnv;

  await run(["bun", "run", "db:migrate"], environment);
  await run(["bun", "run", "build"], environment);
  await prepareStandaloneApplication();
  await run(
    ["bunx", "playwright", "test", ...process.argv.slice(2)],
    environment,
  );
} finally {
  if (databaseCreated) {
    await admin`drop database if exists ${admin(databaseName)} with (force)`;
    console.info(`Dropped disposable E2E database ${databaseName}.`);
  }
  await admin.end();
}
