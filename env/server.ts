import "server-only";

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

function required(name: string, buildFallback?: string) {
  const value = process.env[name];
  if (value) return value;
  if (isProductionBuild && buildFallback) return buildFallback;
  throw new Error(`${name} is required.`);
}

export function databaseUrl() {
  return required(
    "DATABASE_URL",
    "postgres://build:build@127.0.0.1:5432/hr_dashboard_build",
  );
}

export function betterAuthSecret() {
  return required(
    "BETTER_AUTH_SECRET",
    "build-only-better-auth-secret-0000000000000000",
  );
}

export function betterAuthUrl() {
  return process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
}

export function bootstrapSecret() {
  return required("TENANT_BOOTSTRAP_SECRET");
}

export function legalIdentifierKey() {
  return required("LEGAL_IDENTIFIER_ENCRYPTION_KEY");
}
