CREATE EXTENSION IF NOT EXISTS btree_gist;--> statement-breakpoint
CREATE TYPE "public"."audit_source" AS ENUM('bootstrap', 'ui', 'system', 'seed');--> statement-breakpoint
CREATE TYPE "public"."membership_role" AS ENUM('owner', 'member');--> statement-breakpoint
CREATE TYPE "public"."record_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"source" "audit_source" NOT NULL,
	"action" text NOT NULL,
	"object_type" text NOT NULL,
	"object_id" uuid NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"effective_date" date,
	"reason" text,
	"correlation_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_entity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_entity_configuration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"legal_entity_id" uuid NOT NULL,
	"legal_name" text NOT NULL,
	"normalized_legal_name" text NOT NULL,
	"display_name" text,
	"country_code" text NOT NULL,
	"registration_number" text,
	"normalized_registration_number" text,
	"tax_identifier_ciphertext" text,
	"tax_identifier_hash" text,
	"tax_identifier_last_four" text,
	"currency_code" text,
	"status" "record_status" DEFAULT 'active' NOT NULL,
	"valid_from" date NOT NULL,
	"valid_to" date,
	"change_reason" text NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"recorded_by" uuid NOT NULL,
	"supersedes_id" uuid,
	"superseded_at" timestamp with time zone,
	"superseded_by" uuid,
	CONSTRAINT "legal_entity_configuration_valid_range" CHECK ("legal_entity_configuration"."valid_to" is null or "legal_entity_configuration"."valid_to" > "legal_entity_configuration"."valid_from")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"current_tenant_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "system_state" (
	"id" integer PRIMARY KEY NOT NULL,
	"bootstrap_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "membership_role" NOT NULL,
	"status" "record_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_status_period" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"status" "record_status" NOT NULL,
	"valid_from" date NOT NULL,
	"valid_to" date,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"recorded_by" uuid,
	CONSTRAINT "tenant_status_period_valid_range" CHECK ("tenant_status_period"."valid_to" is null or "tenant_status_period"."valid_to" > "tenant_status_period"."valid_from")
);
--> statement-breakpoint
CREATE TABLE "tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"normalized_slug" text NOT NULL,
	"default_locale" text NOT NULL,
	"default_timezone" text NOT NULL,
	"data_region" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_entity" ADD CONSTRAINT "legal_entity_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_entity" ADD CONSTRAINT "legal_entity_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_entity_configuration" ADD CONSTRAINT "legal_entity_configuration_recorded_by_user_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_entity_configuration" ADD CONSTRAINT "legal_entity_configuration_superseded_by_user_id_fk" FOREIGN KEY ("superseded_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "legal_entity_tenant_id_uidx" ON "legal_entity" USING btree ("tenant_id","id");--> statement-breakpoint
ALTER TABLE "legal_entity_configuration" ADD CONSTRAINT "legal_entity_configuration_tenant_entity_fk" FOREIGN KEY ("tenant_id","legal_entity_id") REFERENCES "public"."legal_entity"("tenant_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_current_tenant_id_tenant_id_fk" FOREIGN KEY ("current_tenant_id") REFERENCES "public"."tenant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_membership" ADD CONSTRAINT "tenant_membership_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_membership" ADD CONSTRAINT "tenant_membership_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_status_period" ADD CONSTRAINT "tenant_status_period_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_status_period" ADD CONSTRAINT "tenant_status_period_recorded_by_user_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_uidx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "audit_event_tenant_occurred_idx" ON "audit_event" USING btree ("tenant_id","occurred_at");--> statement-breakpoint
CREATE INDEX "legal_entity_tenant_idx" ON "legal_entity" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "legal_entity_configuration_tenant_entity_idx" ON "legal_entity_configuration" USING btree ("tenant_id","legal_entity_id");--> statement-breakpoint
CREATE INDEX "legal_entity_configuration_current_idx" ON "legal_entity_configuration" USING btree ("tenant_id","valid_from","valid_to");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_membership_tenant_user_uidx" ON "tenant_membership" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX "tenant_membership_user_idx" ON "tenant_membership" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tenant_status_period_tenant_idx" ON "tenant_status_period" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_normalized_slug_uidx" ON "tenant" USING btree ("normalized_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_id_tenant_uidx" ON "tenant" USING btree ("id","id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint

ALTER TABLE "tenant_status_period" ADD CONSTRAINT "tenant_status_period_no_overlap"
  EXCLUDE USING gist (
    "tenant_id" WITH =,
    daterange("valid_from", COALESCE("valid_to", 'infinity'::date), '[)') WITH &&
  );--> statement-breakpoint

ALTER TABLE "legal_entity_configuration" ADD CONSTRAINT "legal_entity_configuration_no_overlap"
  EXCLUDE USING gist (
    "tenant_id" WITH =,
    "legal_entity_id" WITH =,
    daterange("valid_from", COALESCE("valid_to", 'infinity'::date), '[)') WITH &&
  ) WHERE ("superseded_at" IS NULL);--> statement-breakpoint

ALTER TABLE "legal_entity_configuration" ADD CONSTRAINT "legal_entity_legal_name_no_overlap"
  EXCLUDE USING gist (
    "tenant_id" WITH =,
    "normalized_legal_name" WITH =,
    daterange("valid_from", COALESCE("valid_to", 'infinity'::date), '[)') WITH &&
  ) WHERE ("superseded_at" IS NULL);--> statement-breakpoint

ALTER TABLE "legal_entity_configuration" ADD CONSTRAINT "legal_entity_registration_no_overlap"
  EXCLUDE USING gist (
    "tenant_id" WITH =,
    "country_code" WITH =,
    "normalized_registration_number" WITH =,
    daterange("valid_from", COALESCE("valid_to", 'infinity'::date), '[)') WITH &&
  ) WHERE ("superseded_at" IS NULL AND "normalized_registration_number" IS NOT NULL);--> statement-breakpoint

ALTER TABLE "legal_entity_configuration" ADD CONSTRAINT "legal_entity_tax_identifier_no_overlap"
  EXCLUDE USING gist (
    "tenant_id" WITH =,
    "country_code" WITH =,
    "tax_identifier_hash" WITH =,
    daterange("valid_from", COALESCE("valid_to", 'infinity'::date), '[)') WITH &&
  ) WHERE ("superseded_at" IS NULL AND "tax_identifier_hash" IS NOT NULL);--> statement-breakpoint

INSERT INTO "system_state" ("id", "bootstrap_completed") VALUES (1, false);--> statement-breakpoint

ALTER TABLE "tenant" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tenant" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "tenant_scope" ON "tenant"
  USING ("id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint

ALTER TABLE "tenant_membership" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tenant_membership" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "tenant_membership_scope" ON "tenant_membership"
  USING (
    "tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR "user_id" = NULLIF(current_setting('app.current_user_id', true), '')::uuid
  )
  WITH CHECK (
    "tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR "user_id" = NULLIF(current_setting('app.current_user_id', true), '')::uuid
  );--> statement-breakpoint

ALTER TABLE "tenant_status_period" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tenant_status_period" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "tenant_status_period_scope" ON "tenant_status_period"
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint

ALTER TABLE "legal_entity" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "legal_entity" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "legal_entity_scope" ON "legal_entity"
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint

ALTER TABLE "legal_entity_configuration" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "legal_entity_configuration" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "legal_entity_configuration_scope" ON "legal_entity_configuration"
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint

ALTER TABLE "audit_event" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "audit_event" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "audit_event_select_scope" ON "audit_event" FOR SELECT
  USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "audit_event_insert_scope" ON "audit_event" FOR INSERT
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint

DO $permissions$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'hr_app') THEN
    GRANT USAGE ON SCHEMA public TO hr_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON "user", "session", "account", "verification" TO hr_app;
    GRANT SELECT, UPDATE ON "system_state" TO hr_app;
    GRANT SELECT, INSERT, UPDATE ON "tenant", "tenant_membership", "tenant_status_period", "legal_entity", "legal_entity_configuration" TO hr_app;
    GRANT SELECT, INSERT ON "audit_event" TO hr_app;
  END IF;
END
$permissions$;
