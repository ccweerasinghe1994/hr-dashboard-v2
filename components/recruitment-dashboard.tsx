import {
  Bell,
  Blend,
  BriefcaseBusiness,
  CalendarDays,
  CalendarX2,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ContactRound,
  FileText,
  Filter,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MessageSquareText,
  MoreHorizontal,
  ReceiptText,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  UserCheck,
  UsersRound,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Inbox", icon: Mail },
  { label: "Calendar", icon: CalendarDays },
  { label: "Employees", icon: ContactRound },
  { label: "Attendance", icon: UserCheck },
  { label: "Performance", icon: ChartNoAxesCombined },
  { label: "Payroll", icon: ReceiptText },
  { label: "Leave Management", icon: CalendarX2 },
  { label: "Recruitment", icon: Search, active: true },
];

const vacancies = [
  { role: "UI Designer", type: "Full-Time", place: "Remote", applicants: 18 },
  {
    role: "Sales Manager",
    type: "Full-Time",
    place: "On-Site",
    applicants: 15,
  },
  {
    role: "HR Assistant",
    type: "Internship",
    place: "On-Site",
    applicants: 10,
  },
  { role: "Data Analyst", type: "Full-Time", place: "Hybrid", applicants: 22 },
];

const resources = [
  { label: "Job Portal", value: 57.5, applicants: 84 },
  { label: "Company Website", value: 20.5, applicants: 30 },
  { label: "Employee Referral", value: 15.1, applicants: 22 },
  { label: "Social Media (LinkedIn)", value: 6.9, applicants: 10 },
];

const departments = [
  { label: "Human\nResources", value: 19 },
  { label: "Marketing", value: 27 },
  { label: "Product\nDesign", value: 31 },
  { label: "R&D", value: 22 },
  { label: "Operations", value: 28, highlighted: true },
  { label: "Customer\nService", value: 19 },
];

const schedule = [
  {
    time: "09:45 AM",
    title: "Online Test Review",
    person: "Lala Wijaya · Data Analyst",
  },
  {
    time: "01:00 PM",
    title: "First Interview",
    person: "William Hartono · UI Designer",
  },
  {
    time: "02:30 PM",
    title: "HR Interview",
    person: "Arifin Maulana · Customer Support",
  },
  {
    time: "03:10 PM",
    title: "Final Interview",
    person: "Fanny Rizal · Sales Manager",
  },
];

const applicants = [
  {
    initials: "WH",
    name: "William Hartono",
    email: "william.hartono@email.com",
    role: "UI Designer",
    department: "Product Design",
    date: "15 Jun 2035",
    contract: "Full-Time",
    location: "Remote",
    status: "Interview Scheduled",
    stage: 4,
  },
  {
    initials: "FR",
    name: "Fanny Rizal",
    email: "fanny.rizal@email.com",
    role: "Sales Manager",
    department: "Operations",
    date: "12 Jun 2035",
    contract: "Full-Time",
    location: "On-Site",
    status: "Final Interview",
    stage: 4,
  },
  {
    initials: "LW",
    name: "Lala Wijaya",
    email: "lala.wijaya@email.com",
    role: "Data Analyst",
    department: "R&D",
    date: "14 Jun 2035",
    contract: "Full-Time",
    location: "Hybrid",
    status: "Test Completed",
    stage: 2,
  },
  {
    initials: "AM",
    name: "Arifin Maulana",
    email: "arifin.maulana@email.com",
    role: "Customer Support",
    department: "Customer Service",
    date: "13 Jun 2035",
    contract: "Full-Time",
    location: "On-Site",
    status: "Interview Scheduled",
    stage: 4,
  },
  {
    initials: "CM",
    name: "Clara Mentari",
    email: "clara.mentari@email.com",
    role: "HR Assistant",
    department: "Human Resources",
    date: "10 Jun 2035",
    contract: "Internship",
    location: "On-Site",
    status: "Application Received",
    stage: 1,
  },
];

const filters = [
  "All",
  "Application Received",
  "Interview Scheduled",
  "Final Interview",
  "Test Completed",
];

function TeamHubLogo() {
  return (
    <a
      href="#top"
      className="flex items-center gap-3"
      aria-label="TeamHub home"
    >
      <Blend aria-hidden="true" className="size-8 text-primary" />
      <span className="font-heading text-2xl font-bold tracking-tight">
        TeamHub
      </span>
    </a>
  );
}

function Sidebar() {
  return (
    <aside className="hidden min-h-full bg-sidebar px-5 py-8 text-sidebar-foreground lg:flex lg:flex-col">
      <div className="px-3">
        <TeamHubLogo />
      </div>
      <nav aria-label="Primary navigation" className="mt-10">
        <ul className="flex flex-col gap-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.label}>
                <a
                  href={`#${item.label.toLowerCase().replaceAll(" ", "-")}`}
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: item.active ? "default" : "ghost",
                      size: "lg",
                    }),
                    "h-12 w-full justify-start gap-3 px-4 text-base",
                  )}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <Card className="mt-auto" size="sm" tone="highlight">
        <CardHeader>
          <CardTitle>Level Up Your HR System</CardTitle>
          <CardDescription>
            TeamHub Pro gives you full control with advanced modules and
            extended layouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg">
            Get TeamHub Pro
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}

function MobileHeader() {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-4 lg:hidden">
      <TeamHubLogo />
      <Button
        variant="secondary"
        size="icon-lg"
        aria-label="Open dashboard filters"
      >
        <SlidersHorizontal aria-hidden="true" />
      </Button>
    </div>
  );
}

function PageHeader() {
  return (
    <header
      id="top"
      className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
    >
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Recruitment
        </h1>
        <nav
          aria-label="Breadcrumb"
          className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <a href="#dashboard">Dashboard</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Recruitment</span>
        </nav>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:min-w-72">
          <label htmlFor="dashboard-search" className="sr-only">
            Search the dashboard
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="dashboard-search"
            type="search"
            placeholder="Search anything"
            className="h-11 pl-10"
          />
        </div>
        <Button variant="secondary" size="icon-lg" aria-label="Open settings">
          <Settings aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          size="icon-lg"
          aria-label="View notifications"
        >
          <Bell aria-hidden="true" />
        </Button>
        <div className="hidden items-center gap-3 sm:flex">
          <Avatar size="lg">
            <AvatarFallback>DL</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="font-semibold">Davis Levin</p>
            <p className="text-sm text-muted-foreground">User</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricCard({
  label,
  value,
  percentage,
  icon: Icon,
}: {
  label: string;
  value: string;
  percentage: string;
  icon: typeof MessageSquareText;
}) {
  return (
    <Card size="sm">
      <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-primary">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <CardDescription>{label}</CardDescription>
        <span className="text-sm font-semibold text-chart-1">{percentage}</span>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <strong className="font-heading text-4xl leading-none">{value}</strong>
        <span className="text-xs text-muted-foreground">of applicants</span>
      </CardContent>
    </Card>
  );
}

function RecruitmentSummary() {
  return (
    <section
      aria-label="Recruitment summary"
      className="grid gap-4 sm:grid-cols-[0.9fr_1.3fr] sm:grid-rows-2"
    >
      <Card className="sm:row-span-2" tone="highlight">
        <CardHeader>
          <span className="flex size-14 items-center justify-center rounded-full bg-chart-1 text-primary-foreground">
            <FileText aria-hidden="true" className="size-7" />
          </span>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex items-center gap-2">
            <strong className="font-heading text-5xl leading-none">146</strong>
            <Badge>+8.2%</Badge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Total Applicants</p>
        </CardContent>
      </Card>
      <MetricCard
        label="Interviewed"
        value="42"
        percentage="28.8%"
        icon={MessageSquareText}
      />
      <MetricCard
        label="Hired"
        value="12"
        percentage="8.2%"
        icon={CircleUserRound}
      />
    </section>
  );
}

function VacancyCard({ vacancy }: { vacancy: (typeof vacancies)[number] }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{vacancy.role}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness aria-hidden="true" className="size-4" />
          {vacancy.type}
        </span>
        <span className="flex items-center gap-1.5">
          <LayoutDashboard aria-hidden="true" className="size-4" />
          {vacancy.place}
        </span>
        <span className="flex items-center gap-1.5">
          <UsersRound aria-hidden="true" className="size-4" />
          {vacancy.applicants}
        </span>
      </CardContent>
    </Card>
  );
}

function VacanciesCard() {
  return (
    <Card className="2xl:col-start-1 2xl:row-start-2">
      <CardHeader>
        <CardTitle>Current Vacancies</CardTitle>
        <CardAction>
          <Button variant="secondary">
            <Filter data-icon="inline-start" aria-hidden="true" />
            Filter
            <ChevronDown data-icon="inline-end" aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {vacancies.map((vacancy) => (
          <VacancyCard key={vacancy.role} vacancy={vacancy} />
        ))}
      </CardContent>
    </Card>
  );
}

function ApplicationChart() {
  return (
    <Card className="2xl:col-start-2 2xl:row-start-1">
      <CardHeader>
        <CardTitle>Application</CardTitle>
        <CardAction>
          <Button variant="secondary">
            Last 6 Months
            <ChevronDown data-icon="inline-end" aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[2rem_1fr] gap-3">
          <div
            className="flex h-44 flex-col justify-between py-1 text-xs text-muted-foreground"
            aria-hidden="true"
          >
            <span>200</span>
            <span>150</span>
            <span>100</span>
            <span>50</span>
          </div>
          <div>
            <svg
              viewBox="0 0 360 176"
              className="h-44 w-full text-chart-2"
              role="img"
              aria-labelledby="application-chart-title application-chart-description"
            >
              <title id="application-chart-title">
                Applications received from January through June
              </title>
              <desc id="application-chart-description">
                Applications rose from 105 in January to 140 in June, peaking at
                160 in May.
              </desc>
              <defs>
                <linearGradient
                  id="applications-fill"
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
              {[12, 58, 104, 150].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="360"
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              ))}
              <path
                d="M0 92 L72 108 L144 104 L216 54 L288 44 L360 78 L360 164 L0 164 Z"
                fill="url(#applications-fill)"
              />
              <polyline
                points="0,92 72,108 144,104 216,54 288,44 360,78"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="grid grid-cols-6 text-center text-xs text-muted-foreground"
              aria-hidden="true"
            >
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DepartmentChart() {
  const max = Math.max(...departments.map((department) => department.value));

  return (
    <Card className="2xl:col-start-2 2xl:row-start-2">
      <CardHeader>
        <CardTitle>Application by Department</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            aria-label="More department chart options"
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div
          className="grid h-48 grid-cols-6 items-end gap-2"
          role="img"
          aria-label="Applications by department: Human Resources 19, Marketing 27, Product Design 31, Research and Development 22, Operations 28, Customer Service 19."
        >
          {departments.map((department) => (
            <div
              key={department.label}
              className="flex h-full min-w-0 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs text-muted-foreground">
                {department.value}
              </span>
              <div
                className={cn(
                  "w-full max-w-12 rounded-t-lg bg-chart-2",
                  department.highlighted && "bg-chart-1",
                )}
                style={{
                  height: `${Math.round((department.value / max) * 66)}%`,
                }}
              />
              <span className="whitespace-pre-line text-center text-[10px] leading-none text-muted-foreground">
                {department.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ResourcesCard() {
  return (
    <Card className="2xl:col-start-3 2xl:row-start-1">
      <CardHeader>
        <CardTitle>Applicant Resources</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            aria-label="More applicant resource options"
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {resources.map((resource) => (
          <Progress
            key={resource.label}
            value={resource.value}
            aria-label={`${resource.label}: ${resource.value}%`}
          >
            <ProgressLabel>{resource.label}</ProgressLabel>
            <span className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
              <ProgressValue />
              <span>· {resource.applicants}</span>
            </span>
          </Progress>
        ))}
        <div
          className="grid grid-cols-5 text-xs text-muted-foreground"
          aria-hidden="true"
        >
          <span>0</span>
          <span className="text-center">25</span>
          <span className="text-center">50</span>
          <span className="text-center">75</span>
          <span className="text-right">100</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniCalendar() {
  const dates = [17, 18, 19, 20, 21, 22, 23];
  const weekdays = [
    { short: "S", name: "Sunday" },
    { short: "M", name: "Monday" },
    { short: "T", name: "Tuesday" },
    { short: "W", name: "Wednesday" },
    { short: "T", name: "Thursday" },
    { short: "F", name: "Friday" },
    { short: "S", name: "Saturday" },
  ];

  return (
    <div className="rounded-xl bg-muted p-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" aria-label="Previous week">
          <ChevronLeft aria-hidden="true" />
        </Button>
        <strong className="text-sm">June 2035</strong>
        <Button variant="ghost" size="icon" aria-label="Next week">
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      <div
        className="mt-3 grid grid-cols-7 text-center text-xs text-muted-foreground"
        aria-hidden="true"
      >
        {weekdays.map((day) => (
          <span key={day.name}>{day.short}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 text-center text-sm">
        {dates.map((date) => (
          <span
            key={date}
            className={cn(
              "flex size-9 items-center justify-center justify-self-center rounded-lg",
              date === 20 && "bg-primary font-semibold text-primary-foreground",
            )}
            aria-current={date === 20 ? "date" : undefined}
          >
            {date}
          </span>
        ))}
      </div>
    </div>
  );
}

function SchedulesCard() {
  return (
    <Card className="2xl:col-start-3 2xl:row-span-2 2xl:row-start-2">
      <CardHeader>
        <CardTitle>Schedules</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            aria-label="More schedule options"
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <MiniCalendar />
        <ol className="relative flex flex-col gap-4 border-l border-border pl-5">
          {schedule.map((item) => (
            <li
              key={`${item.time}-${item.title}`}
              className="relative rounded-xl bg-secondary p-4 text-secondary-foreground"
            >
              <span
                className="absolute top-5 -left-[1.65rem] size-2.5 rounded-full bg-primary ring-4 ring-card"
                aria-hidden="true"
              />
              <time className="text-xs text-muted-foreground">{item.time}</time>
              <p className="mt-1 font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.person}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function Stages({ current, label }: { current: number; label: string }) {
  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={`${label}, stage ${current} of 5`}
    >
      {[1, 2, 3, 4, 5].map((stage) => (
        <Badge
          key={stage}
          variant={stage <= current ? "secondary" : "outline"}
          aria-hidden="true"
        >
          {stage}
        </Badge>
      ))}
    </div>
  );
}

function ApplicantsCard() {
  return (
    <Card className="xl:col-span-2 2xl:col-span-2 2xl:col-start-1 2xl:row-start-3">
      <CardHeader>
        <CardTitle>Applicants</CardTitle>
        <CardAction>
          <nav
            aria-label="Applicant status filters"
            className="hidden flex-wrap justify-end gap-1 lg:flex"
          >
            {filters.map((filter, index) => (
              <a
                key={filter}
                href={`#${filter.toLowerCase().replaceAll(" ", "-")}`}
                aria-current={index === 0 ? "page" : undefined}
                className={buttonVariants({
                  variant: index === 0 ? "default" : "ghost",
                  size: "sm",
                })}
              >
                {filter}
              </a>
            ))}
          </nav>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name ↕</TableHead>
              <TableHead>Job Title ↕</TableHead>
              <TableHead>Applied Date ↕</TableHead>
              <TableHead>Application Received ↕</TableHead>
              <TableHead>Status (Stage) ↕</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{applicant.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{applicant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {applicant.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{applicant.role}</p>
                  <p className="text-xs text-muted-foreground">
                    {applicant.department}
                  </p>
                </TableCell>
                <TableCell>{applicant.date}</TableCell>
                <TableCell>
                  <span className="font-medium">{applicant.contract}</span>
                  <span className="ml-3">{applicant.location}</span>
                </TableCell>
                <TableCell>
                  <p className="mb-2 font-medium">{applicant.status}</p>
                  <Stages current={applicant.stage} label={applicant.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Footer() {
  const socialLinks = [
    { label: "Twitter", icon: MessageCircle },
    { label: "YouTube", icon: Video },
    { label: "LinkedIn", icon: Share2 },
  ];

  return (
    <footer className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <strong className="text-foreground">Copyright © 2025 Peetrdraw</strong>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms and conditions</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="flex items-center gap-1">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <Button
              key={social.label}
              variant="ghost"
              size="icon"
              aria-label={social.label}
            >
              <Icon aria-hidden="true" />
            </Button>
          );
        })}
      </div>
    </footer>
  );
}

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
              <ApplicationChart />
              <ResourcesCard />
              <VacanciesCard />
              <DepartmentChart />
              <SchedulesCard />
              <ApplicantsCard />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
