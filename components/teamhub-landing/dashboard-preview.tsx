import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  FileText,
  Search,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const previewApplicants = [
  {
    initials: "WW",
    name: "William Warfate",
    role: "UX Designer",
    date: "13 Jun",
  },
  {
    initials: "FS",
    name: "Ferry Silen",
    role: "Sales Manager",
    date: "12 Jun",
  },
  { initials: "LW", name: "Lala Wijaya", role: "Data Analyst", date: "10 Jun" },
];

const chartBars = [
  { label: "HR", height: 42 },
  { label: "Marketing", height: 59 },
  { label: "Design", height: 74 },
  { label: "R&D", height: 66 },
  { label: "Operations", height: 91 },
  { label: "Support", height: 70 },
];

export function DashboardPreview() {
  return (
    <div
      className="relative mx-auto w-full max-w-[690px]"
      aria-label="Preview of the TeamHub recruitment dashboard"
      role="img"
    >
      <div className="absolute -inset-x-4 top-8 bottom-5 rotate-3 rounded-[2rem] bg-primary/75 sm:-inset-x-7" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-primary/15">
        <div className="flex h-12 items-center justify-between border-b border-border px-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CircleUserRound aria-hidden="true" className="size-3.5" />
            </span>
            <span className="text-[10px] font-bold sm:text-xs">TeamHub</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Search aria-hidden="true" className="size-3.5" />
            <Bell aria-hidden="true" className="size-3.5" />
            <Avatar className="size-6">
              <AvatarFallback className="text-[8px]">DL</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="grid min-h-[300px] grid-cols-[62px_1fr] sm:min-h-[390px] sm:grid-cols-[104px_1fr]">
          <aside
            className="border-r border-border bg-muted/40 p-2 sm:p-3"
            aria-hidden="true"
          >
            <div className="mb-4 hidden text-[7px] font-semibold uppercase tracking-widest text-muted-foreground sm:block">
              Workspace
            </div>
            <div className="flex flex-col gap-2">
              {["Overview", "Recruitment", "Employees", "Reports"].map(
                (item, index) => (
                  <div
                    key={item}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-[7px] sm:text-[9px]",
                      index === 1
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <span className="hidden sm:inline">{item}</span>
                    <span className="mx-auto block size-1.5 rounded-full bg-current sm:hidden" />
                  </div>
                ),
              )}
            </div>
          </aside>

          <div className="min-w-0 bg-surface p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[8px] text-muted-foreground">
                  Dashboard / Recruitment
                </p>
                <p className="text-xs font-bold sm:text-base">
                  Recruitment Update
                </p>
              </div>
              <Badge className="hidden sm:inline-flex">June 2035</Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <PreviewMetric icon={FileText} label="Applicants" value="146" />
              <PreviewMetric
                icon={CircleUserRound}
                label="Interviewed"
                value="42"
              />
              <PreviewMetric icon={CalendarDays} label="Hired" value="12" />
            </div>

            <div className="mt-2 grid gap-2 sm:mt-3 sm:grid-cols-[1.2fr_0.8fr] sm:gap-3">
              <div className="rounded-lg border border-border bg-background p-2 sm:p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-semibold sm:text-[10px]">
                    Application Growth
                  </p>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-3 text-muted-foreground"
                  />
                </div>
                <svg
                  viewBox="0 0 280 100"
                  className="mt-2 h-[72px] w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="preview-area"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--chart-2)"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--chart-2)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M4 67 L48 77 L92 72 L136 36 L182 27 L232 56 L276 45 L276 92 L4 92 Z"
                    fill="url(#preview-area)"
                  />
                  <polyline
                    points="4,67 48,77 92,72 136,36 182,27 232,56 276,45"
                    fill="none"
                    stroke="var(--chart-2)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="hidden rounded-lg border border-border bg-background p-3 sm:block">
                <p className="text-[10px] font-semibold">By Department</p>
                <div className="mt-3 flex h-[72px] items-end justify-around gap-2">
                  {chartBars.map((bar) => (
                    <div
                      key={bar.label}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <span className="text-[6px] text-muted-foreground">
                        {Math.round(bar.height / 3)}
                      </span>
                      <span
                        className="w-full rounded-t-sm bg-chart-2"
                        style={{ height: `${bar.height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 overflow-hidden rounded-lg border border-border bg-background sm:mt-3">
              <div className="flex items-center justify-between border-b border-border px-2 py-1.5 sm:px-3 sm:py-2">
                <p className="text-[8px] font-semibold sm:text-[10px]">
                  Recent Applicants
                </p>
                <span className="text-[7px] text-primary">View all</span>
              </div>
              <div className="divide-y divide-border">
                {previewApplicants.map((applicant) => (
                  <div
                    key={applicant.name}
                    className="grid grid-cols-[1fr_auto] items-center gap-2 px-2 py-1.5 sm:grid-cols-[1fr_0.8fr_auto] sm:px-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar className="size-5 sm:size-6">
                        <AvatarFallback className="text-[7px]">
                          {applicant.initials}
                        </AvatarFallback>
                      </Avatar>
                      <p className="truncate text-[7px] font-medium sm:text-[9px]">
                        {applicant.name}
                      </p>
                    </div>
                    <p className="hidden text-[8px] text-muted-foreground sm:block">
                      {applicant.role}
                    </p>
                    <p className="text-[7px] text-muted-foreground sm:text-[8px]">
                      {applicant.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-2 sm:p-3">
      <div className="flex items-center justify-between">
        <span className="flex size-5 items-center justify-center rounded-md bg-secondary text-primary sm:size-7">
          <Icon aria-hidden="true" className="size-3 sm:size-3.5" />
        </span>
        <Badge variant="secondary" className="hidden text-[7px] sm:inline-flex">
          +8.2%
        </Badge>
      </div>
      <p className="mt-2 text-sm font-bold sm:text-lg">{value}</p>
      <p className="text-[7px] text-muted-foreground sm:text-[9px]">{label}</p>
    </div>
  );
}
