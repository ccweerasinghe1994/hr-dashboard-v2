export type E2eFixture = {
  bootstrapSecret: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  tenantName: string;
  tenantSlug: string;
};

export function requiredE2eEnvironmentValue(
  name: string,
  environment: NodeJS.ProcessEnv = process.env,
) {
  const value = environment[name]?.trim();
  if (!value) throw new Error(`${name} is required by the E2E suite.`);
  return value;
}

export function readE2eFixture(
  environment: NodeJS.ProcessEnv = process.env,
): E2eFixture {
  return {
    bootstrapSecret: requiredE2eEnvironmentValue(
      "E2E_BOOTSTRAP_SECRET",
      environment,
    ),
    ownerName: requiredE2eEnvironmentValue("E2E_OWNER_NAME", environment),
    ownerEmail: requiredE2eEnvironmentValue("E2E_OWNER_EMAIL", environment),
    ownerPassword: requiredE2eEnvironmentValue(
      "E2E_OWNER_PASSWORD",
      environment,
    ),
    tenantName: requiredE2eEnvironmentValue("E2E_TENANT_NAME", environment),
    tenantSlug: requiredE2eEnvironmentValue("E2E_TENANT_SLUG", environment),
  };
}

export function e2eFixtureEnvironment(fixture: E2eFixture) {
  return {
    E2E_BOOTSTRAP_SECRET: fixture.bootstrapSecret,
    E2E_OWNER_NAME: fixture.ownerName,
    E2E_OWNER_EMAIL: fixture.ownerEmail,
    E2E_OWNER_PASSWORD: fixture.ownerPassword,
    E2E_TENANT_NAME: fixture.tenantName,
    E2E_TENANT_SLUG: fixture.tenantSlug,
  } satisfies Record<string, string>;
}
