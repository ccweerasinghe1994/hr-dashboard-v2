DROP POLICY "tenant_membership_scope" ON "tenant_membership";--> statement-breakpoint
CREATE POLICY "tenant_membership_scope" ON "tenant_membership"
  USING (
    "tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
  )
  WITH CHECK (
    "tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
  );--> statement-breakpoint

CREATE POLICY "tenant_membership_resolution_scope" ON "tenant_membership" FOR SELECT
  USING (
    current_user = pg_get_userbyid(
      (SELECT relowner FROM pg_class WHERE oid = 'public.tenant_membership'::regclass)
    )
    AND "user_id" = NULLIF(current_setting('app.current_user_id', true), '')::uuid
  );--> statement-breakpoint

CREATE POLICY "tenant_status_period_resolution_scope" ON "tenant_status_period" FOR SELECT
  USING (
    current_user = pg_get_userbyid(
      (SELECT relowner FROM pg_class WHERE oid = 'public.tenant_status_period'::regclass)
    )
    AND EXISTS (
      SELECT 1
      FROM "tenant_membership"
      WHERE "tenant_membership"."tenant_id" = "tenant_status_period"."tenant_id"
        AND "tenant_membership"."user_id" = NULLIF(
          current_setting('app.current_user_id', true),
          ''
        )::uuid
    )
  );--> statement-breakpoint

CREATE FUNCTION "resolve_current_user_tenant_memberships"("as_of_date" date)
RETURNS TABLE (
  "tenant_id" uuid,
  "role" "membership_role",
  "membership_status" "record_status",
  "tenant_status" "record_status"
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT
    membership.tenant_id,
    membership.role,
    membership.status,
    COALESCE(current_status.status, 'inactive'::public.record_status)
  FROM public.tenant_membership AS membership
  LEFT JOIN LATERAL (
    SELECT status_period.status
    FROM public.tenant_status_period AS status_period
    WHERE status_period.tenant_id = membership.tenant_id
      AND status_period.superseded_at IS NULL
      AND status_period.valid_from <= as_of_date
      AND (
        status_period.valid_to IS NULL
        OR status_period.valid_to > as_of_date
      )
    ORDER BY status_period.valid_from DESC
    LIMIT 1
  ) AS current_status ON true
  WHERE membership.user_id = NULLIF(
    current_setting('app.current_user_id', true),
    ''
  )::uuid
$function$;--> statement-breakpoint

REVOKE ALL ON FUNCTION "resolve_current_user_tenant_memberships"(date) FROM PUBLIC;--> statement-breakpoint

DO $permissions$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'hr_app') THEN
    GRANT EXECUTE ON FUNCTION "resolve_current_user_tenant_memberships"(date) TO hr_app;
  END IF;
END
$permissions$;
