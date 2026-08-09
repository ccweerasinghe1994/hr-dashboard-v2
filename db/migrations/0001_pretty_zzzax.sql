ALTER TABLE "tenant_status_period" ADD COLUMN "supersedes_id" uuid;--> statement-breakpoint
ALTER TABLE "tenant_status_period" ADD COLUMN "superseded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tenant_status_period" ADD COLUMN "superseded_by" uuid;--> statement-breakpoint
ALTER TABLE "tenant_status_period" ADD CONSTRAINT "tenant_status_period_superseded_by_user_id_fk" FOREIGN KEY ("superseded_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_status_period" DROP CONSTRAINT "tenant_status_period_no_overlap";--> statement-breakpoint
ALTER TABLE "tenant_status_period" ADD CONSTRAINT "tenant_status_period_no_overlap"
  EXCLUDE USING gist (
    "tenant_id" WITH =,
    daterange("valid_from", COALESCE("valid_to", 'infinity'::date), '[)') WITH &&
  ) WHERE ("superseded_at" IS NULL);
