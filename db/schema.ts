import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  ...timestamps,
});

export const sessions = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    currentTenantId: uuid("current_tenant_id").references(() => tenants.id, {
      onDelete: "restrict",
    }),
    ...timestamps,
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const accounts = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    uniqueIndex("account_provider_account_uidx").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verifications = pgTable(
  "verification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const membershipRole = pgEnum("membership_role", ["owner", "member"]);
export const recordStatus = pgEnum("record_status", ["active", "inactive"]);
export const auditSource = pgEnum("audit_source", [
  "bootstrap",
  "ui",
  "system",
  "seed",
]);

export const systemState = pgTable("system_state", {
  id: integer("id").primaryKey(),
  bootstrapCompleted: boolean("bootstrap_completed").default(false).notNull(),
  ...timestamps,
});

export const tenants = pgTable(
  "tenant",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    normalizedSlug: text("normalized_slug").notNull(),
    defaultLocale: text("default_locale").notNull(),
    defaultTimezone: text("default_timezone").notNull(),
    dataRegion: text("data_region"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tenant_normalized_slug_uidx").on(table.normalizedSlug),
    uniqueIndex("tenant_id_tenant_uidx").on(table.id, table.id),
  ],
);

export const tenantStatusPeriods = pgTable(
  "tenant_status_period",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    status: recordStatus("status").notNull(),
    validFrom: date("valid_from").notNull(),
    validTo: date("valid_to"),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    recordedBy: uuid("recorded_by").references(() => users.id, {
      onDelete: "restrict",
    }),
    supersedesId: uuid("supersedes_id"),
    supersededAt: timestamp("superseded_at", { withTimezone: true }),
    supersededBy: uuid("superseded_by").references(() => users.id, {
      onDelete: "restrict",
    }),
  },
  (table) => [
    index("tenant_status_period_tenant_idx").on(table.tenantId),
    check(
      "tenant_status_period_valid_range",
      sql`${table.validTo} is null or ${table.validTo} > ${table.validFrom}`,
    ),
  ],
);

export const tenantMemberships = pgTable(
  "tenant_membership",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    role: membershipRole("role").notNull(),
    status: recordStatus("status").default("active").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tenant_membership_tenant_user_uidx").on(
      table.tenantId,
      table.userId,
    ),
    index("tenant_membership_user_idx").on(table.userId),
  ],
);

export const legalEntities = pgTable(
  "legal_entity",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("legal_entity_tenant_id_uidx").on(table.tenantId, table.id),
    index("legal_entity_tenant_idx").on(table.tenantId),
  ],
);

export const legalEntityConfigurations = pgTable(
  "legal_entity_configuration",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    legalEntityId: uuid("legal_entity_id").notNull(),
    legalName: text("legal_name").notNull(),
    normalizedLegalName: text("normalized_legal_name").notNull(),
    displayName: text("display_name"),
    countryCode: text("country_code").notNull(),
    registrationNumber: text("registration_number"),
    normalizedRegistrationNumber: text("normalized_registration_number"),
    taxIdentifierCiphertext: text("tax_identifier_ciphertext"),
    taxIdentifierHash: text("tax_identifier_hash"),
    taxIdentifierLastFour: text("tax_identifier_last_four"),
    currencyCode: text("currency_code"),
    status: recordStatus("status").default("active").notNull(),
    validFrom: date("valid_from").notNull(),
    validTo: date("valid_to"),
    changeReason: text("change_reason").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    recordedBy: uuid("recorded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    supersedesId: uuid("supersedes_id"),
    supersededAt: timestamp("superseded_at", { withTimezone: true }),
    supersededBy: uuid("superseded_by").references(() => users.id, {
      onDelete: "restrict",
    }),
  },
  (table) => [
    foreignKey({
      columns: [table.tenantId, table.legalEntityId],
      foreignColumns: [legalEntities.tenantId, legalEntities.id],
      name: "legal_entity_configuration_tenant_entity_fk",
    }).onDelete("restrict"),
    index("legal_entity_configuration_tenant_entity_idx").on(
      table.tenantId,
      table.legalEntityId,
    ),
    index("legal_entity_configuration_current_idx").on(
      table.tenantId,
      table.validFrom,
      table.validTo,
    ),
    check(
      "legal_entity_configuration_valid_range",
      sql`${table.validTo} is null or ${table.validTo} > ${table.validFrom}`,
    ),
  ],
);

export const auditEvents = pgTable(
  "audit_event",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "restrict",
    }),
    source: auditSource("source").notNull(),
    action: text("action").notNull(),
    objectType: text("object_type").notNull(),
    objectId: uuid("object_id").notNull(),
    before: jsonb("before"),
    after: jsonb("after"),
    effectiveDate: date("effective_date"),
    reason: text("reason"),
    correlationId: uuid("correlation_id").defaultRandom().notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_event_tenant_occurred_idx").on(
      table.tenantId,
      table.occurredAt,
    ),
  ],
);

export const betterAuthSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
};
