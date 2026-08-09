import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  Filter,
  Search,
  Star,
  UserRoundCheck,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const roles = [
  ["UX Designer", "Full-Time", "Remote"],
  ["Sales Manager", "Full-Time", "Hybrid"],
  ["HR Assistant", "Internship", "On-site"],
  ["Data Analyst", "Full-Time", "Hybrid"],
];

const applicants = [
  ["WW", "William Warfate", "13 Jun", "Final Interview"],
  ["FS", "Ferry Silen", "12 Jun", "Test Completed"],
  ["LW", "Lala Wijaya", "10 Jun", "Interview"],
];

const weekdays = [
  { short: "S", name: "Sunday" },
  { short: "M", name: "Monday" },
  { short: "T", name: "Tuesday" },
  { short: "W", name: "Wednesday" },
  { short: "T", name: "Thursday" },
  { short: "F", name: "Friday" },
  { short: "S", name: "Saturday" },
];

const moduleItems = [
  {
    title: "Payroll",
    description: "Effortless payroll, benefits, and employee compensation.",
    icon: CircleDollarSign,
  },
  {
    title: "Leave Management",
    description: "Make time-off requests and approvals simple for everyone.",
    icon: CalendarDays,
  },
  {
    title: "Performance Reviews",
    description: "Run thoughtful reviews and track goals over time.",
    icon: UserRoundCheck,
  },
];

const plans = [
  {
    name: "Starter",
    description: "For small teams building a repeatable hiring process.",
    price: "$0",
    suffix: "forever",
    features: [
      "Up to 15 employees",
      "5 GB storage",
      "Recruitment tools",
      "Payroll essentials",
    ],
  },
  {
    name: "Pro",
    description: "For growing teams ready to unify every people workflow.",
    price: "$12",
    suffix: "per employee / month",
    featured: true,
    features: [
      "Unlimited employees",
      "25 GB storage",
      "Advanced analytics",
      "Leave management",
      "Payroll reporting",
      "Bulk employee import",
    ],
  },
  {
    name: "Enterprise",
    description: "For complex organizations that need control at scale.",
    price: "Custom",
    suffix: "tailored to your team",
    features: [
      "Custom employee limits",
      "250 GB storage",
      "SSO and SCIM",
      "Priority support",
      "Custom reporting",
    ],
  },
];

export function RecruitmentLifecycle() {
  return (
    <section id="features" className="scroll-mt-24 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Recruitment"
        title="Master the recruitment lifecycle"
        description="Source great people, keep every application organized, and move interviews forward without losing momentum."
      />

      <div className="mt-9 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Current vacancies</h3>
            </CardTitle>
            <CardAction>
              <Filter
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {roles.map(([role, type, location]) => (
              <article
                key={role}
                className="rounded-xl border border-border bg-muted/35 p-3"
              >
                <p className="text-xs font-semibold">{role}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[9px]">
                    {type}
                  </Badge>
                  <Badge variant="outline" className="text-[9px]">
                    {location}
                  </Badge>
                </div>
              </article>
            ))}
          </CardContent>
          <CardFooter className="flex-col items-start">
            <p className="font-semibold">Find the perfect match</p>
            <p className="text-xs text-muted-foreground">
              Create roles and keep every job opening visible.
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Applicants table</h3>
            </CardTitle>
            <CardAction>
              <Search
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {applicants.map(([initials, name, date, status]) => (
              <div
                key={name}
                className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {status}
                    </p>
                  </div>
                </div>
                <time className="text-[10px] text-muted-foreground">
                  {date}
                </time>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex-col items-start">
            <p className="font-semibold">Efficient applicant tracking</p>
            <p className="text-xs text-muted-foreground">
              See who is moving, waiting, or ready for an offer.
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Schedules</h3>
            </CardTitle>
            <CardAction>
              <CalendarDays
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
              {weekdays.map((day) => (
                <span key={day.name}>{day.short}</span>
              ))}
              {[17, 18, 19, 20, 21, 22, 23].map((date) => (
                <span
                  key={date}
                  className={cn(
                    "rounded-full py-1.5 text-foreground",
                    date === 20 && "bg-primary text-primary-foreground",
                  )}
                >
                  {date}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-secondary p-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-background text-primary">
                <Clock3 aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-[10px] text-muted-foreground">09:00 AM</p>
                <p className="text-xs font-semibold">Candidate interview</p>
                <p className="text-[10px] text-muted-foreground">
                  Garline Test Review
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start">
            <p className="font-semibold">Seamless interview scheduling</p>
            <p className="text-xs text-muted-foreground">
              Coordinate hiring teams and candidates in one place.
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

export function WorkforceInsights() {
  return (
    <section id="analytics" className="scroll-mt-24 py-16 sm:py-20">
      <SectionHeading
        eyebrow="People analytics"
        title="Unlock powerful workforce insights"
        description="Turn recruiting activity into a clear picture of where your team is growing and where it needs attention."
      />

      <div className="mt-9 grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>
              <h3>Application growth</h3>
            </CardTitle>
            <CardAction>
              <Badge variant="secondary">Last 6 months</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <AreaChart />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-1">
          <AnalyticsMetric label="Hired" value="8.2%" />
          <AnalyticsMetric label="Interviewed" value="28.8%" />
        </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              <h3>Applications by department</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBars />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              <h3>Applicant resource distribution</h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ResourceBar label="Job portal" value={92} />
            <ResourceBar label="Careers page" value={75} />
            <ResourceBar label="Referral" value={54} />
            <ResourceBar label="Social media" value={29} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function IntegratedModules() {
  return (
    <section id="modules" className="scroll-mt-24 py-16 sm:py-20">
      <SectionHeading
        eyebrow="One connected system"
        title="Integrated HR modules"
        description="Everything you need to manage the employee journey after the offer is signed."
      />

      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {moduleItems.map((item) => (
          <ModuleCard key={item.title} {...item} />
        ))}
      </div>

      <Card tone="highlight" className="mt-6 sm:[--card-spacing:--spacing(6)]">
        <CardHeader>
          <Badge className="mb-2">TeamHub Pro</Badge>
          <CardTitle>
            <h3 className="text-2xl font-bold">Level up your HR system</h3>
          </CardTitle>
          <CardDescription>
            Give every people workflow more automation, more detail, and fewer
            handoffs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Advanced leave types",
              "Detailed payroll reporting",
              "Bulk employee import",
              "Data planning",
              "Performance reporting",
              "Custom assessments",
            ].map((feature) => (
              <FeatureLine key={feature}>{feature}</FeatureLine>
            ))}
          </div>
          <div className="flex items-end justify-stretch lg:justify-end">
            <a
              href="#pricing"
              className={cn(buttonVariants({ size: "lg" }), "w-full lg:w-auto")}
            >
              Get TeamHub Pro
            </a>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Simple pricing"
        title="A plan that grows with your team"
        description="Start with the essentials and upgrade when your workflows need more power."
      />

      <div className="mt-9 grid items-stretch gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            tone={plan.featured ? "highlight" : "default"}
            className={cn(plan.featured && "lg:-my-3 lg:py-7")}
          >
            <CardHeader>
              {plan.featured ? (
                <Badge className="mb-2">Most popular</Badge>
              ) : null}
              <CardTitle>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-5">
              <div>
                <p className="text-3xl font-bold">{plan.price}</p>
                <p className="text-xs text-muted-foreground">{plan.suffix}</p>
              </div>
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <FeatureLine>{feature}</FeatureLine>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <a
                href="#contact"
                className={cn(
                  buttonVariants({
                    variant: plan.featured ? "default" : "outline",
                    size: "lg",
                  }),
                  "w-full",
                )}
              >
                {plan.featured
                  ? "Get Pro"
                  : plan.name === "Enterprise"
                    ? "Contact sales"
                    : "Start free"}
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  const items = [
    [
      "AM",
      "Avery Morgan",
      "People Director, Northstar",
      "TeamHub gave our managers one place to see recruiting progress and make decisions faster.",
    ],
    [
      "RS",
      "Rina Silva",
      "Head of Talent, Divide",
      "We went from scattered spreadsheets to a hiring process everyone understands and actually uses.",
    ],
    [
      "DK",
      "Daniel Kim",
      "COO, Common Ground",
      "The reports are clear, the workflows feel natural, and our team spends less time on admin.",
    ],
  ];

  return (
    <section id="customers" className="scroll-mt-24 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Customer stories"
        title="Loved by teams that put people first"
        description="HR leaders use TeamHub to create a calmer, clearer employee experience."
      />
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {items.map(([initials, name, role, quote]) => (
          <Card key={name}>
            <CardHeader>
              <div className="flex gap-1 text-chart-2">
                <span className="sr-only">5 out of 5 stars</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    aria-hidden="true"
                    className="size-3.5 fill-current"
                  />
                ))}
              </div>
              <CardDescription className="pt-3 text-sm leading-6 text-foreground">
                “{quote}”
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Badge variant="secondary">{eyebrow}</Badge>
      <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

function ModuleCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader>
        <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <CardTitle className="pt-4">
          <h3>{title}</h3>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Badge variant="secondary">Included in TeamHub</Badge>
      </CardContent>
    </Card>
  );
}

function FeatureLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-sm">
      <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />
      {children}
    </span>
  );
}

function AnalyticsMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <Badge variant="secondary" className="mt-3">
          +4.1%
        </Badge>
      </CardContent>
    </Card>
  );
}

function AreaChart() {
  return (
    <div>
      <svg
        viewBox="0 0 420 180"
        className="h-44 w-full"
        role="img"
        aria-label="Applications grew from 104 in January to 142 in June, peaking in May."
      >
        <defs>
          <linearGradient id="insights-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[35, 78, 121, 164].map((y) => (
          <line key={y} x1="5" x2="415" y1={y} y2={y} stroke="var(--border)" />
        ))}
        <path
          d="M8 104 L88 122 L168 116 L248 59 L328 46 L412 91 L412 166 L8 166 Z"
          fill="url(#insights-area)"
        />
        <polyline
          points="8,104 88,122 168,116 248,59 328,46 412,91"
          fill="none"
          stroke="var(--chart-2)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="grid grid-cols-6 text-center text-[10px] text-muted-foreground">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}

function DepartmentBars() {
  const bars = [
    { label: "HR", value: 16 },
    { label: "MKT", value: 28 },
    { label: "DES", value: 34 },
    { label: "R&D", value: 25 },
    { label: "OPS", value: 31 },
    { label: "CS", value: 20 },
  ];
  return (
    <div
      className="flex h-48 items-end gap-2"
      role="img"
      aria-label="Application volume by department"
    >
      {bars.map((bar) => (
        <div
          key={bar.label}
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
        >
          <span className="text-[10px] text-muted-foreground">{bar.value}</span>
          <span
            className="w-full rounded-t-md bg-chart-2"
            style={{ height: `${bar.value * 2.4}%` }}
          />
          <span className="text-[8px] text-muted-foreground">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function ResourceBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-chart-2"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
