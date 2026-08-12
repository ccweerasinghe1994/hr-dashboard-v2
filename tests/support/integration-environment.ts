const requiredDatabaseVariables = [
  "TEST_ADMIN_DATABASE_URL",
  "TEST_DATABASE_URL",
] as const;

const missingDatabaseVariables = requiredDatabaseVariables.filter(
  (name) => !process.env[name]?.trim(),
);

if (missingDatabaseVariables.length > 0) {
  throw new Error(
    `Integration test configuration error: TEST_ADMIN_DATABASE_URL and TEST_DATABASE_URL are required. Missing: ${missingDatabaseVariables.join(", ")}.`,
  );
}

export const testDatabaseEnvironment = {
  adminUrl: process.env.TEST_ADMIN_DATABASE_URL as string,
  runtimeUrl: process.env.TEST_DATABASE_URL as string,
};
