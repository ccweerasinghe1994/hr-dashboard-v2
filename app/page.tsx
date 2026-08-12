import { redirect } from "next/navigation";
import { TenantUnavailableNotice } from "@/components/organization/permission-notice";
import { RecruitmentDashboard } from "@/components/recruitment-dashboard";
import {
  AuthenticationRequiredError,
  TenantUnavailableError,
} from "@/data/errors";
import { withTenantContext } from "@/data/tenant-context";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    await withTenantContext(async () => null);
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/sign-in");
    if (error instanceof TenantUnavailableError) {
      return (
        <main className="mx-auto w-full max-w-2xl px-4 py-12">
          <TenantUnavailableNotice />
        </main>
      );
    }
    throw error;
  }
  return <RecruitmentDashboard />;
}
