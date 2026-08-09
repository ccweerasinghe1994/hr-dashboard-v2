import { ApplicantsCard } from "./applicants-card";
import { ApplicationChart } from "./application-chart";
import { DashboardFooter } from "./dashboard-footer";
import { DepartmentChart } from "./department-chart";
import { MobileHeader } from "./mobile-header";
import { PageHeader } from "./page-header";
import { RecruitmentSummary } from "./recruitment-summary";
import { ResourcesCard } from "./resources-card";
import { SchedulesCard } from "./schedules-card";
import { Sidebar } from "./sidebar";
import { VacanciesCard } from "./vacancies-card";

export function RecruitmentDashboard() {
  return (
    <main className="min-h-screen bg-muted p-0 sm:p-4 xl:p-7">
      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-[1880px] overflow-hidden bg-background shadow-sm sm:rounded-3xl lg:grid-cols-[285px_minmax(0,1fr)]">
        <Sidebar />
        <div className="min-w-0">
          <MobileHeader />
          <div className="bg-surface p-4 sm:p-6 xl:p-8">
            <PageHeader />
            <div
              id="dashboard"
              className="mt-6 grid gap-5 xl:grid-cols-2 2xl:grid-cols-[minmax(500px,1.35fr)_minmax(360px,1fr)_310px]"
            >
              <RecruitmentSummary />
              <div className="2xl:col-start-2 2xl:row-start-1">
                <ApplicationChart />
              </div>
              <div className="2xl:col-start-3 2xl:row-start-1">
                <ResourcesCard />
              </div>
              <div className="2xl:col-start-1 2xl:row-start-2">
                <VacanciesCard />
              </div>
              <div className="2xl:col-start-2 2xl:row-start-2">
                <DepartmentChart />
              </div>
              <div className="2xl:col-start-3 2xl:row-span-2 2xl:row-start-2">
                <SchedulesCard />
              </div>
              <div className="xl:col-span-2 2xl:col-span-2 2xl:col-start-1 2xl:row-start-3">
                <ApplicantsCard />
              </div>
            </div>
            <DashboardFooter />
          </div>
        </div>
      </div>
    </main>
  );
}
