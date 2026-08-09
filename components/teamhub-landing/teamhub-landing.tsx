import { ArrowRight, Blend, ChevronDown, Menu } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { DashboardPreview } from "./dashboard-preview";
import {
  IntegratedModules,
  Pricing,
  RecruitmentLifecycle,
  Testimonials,
  WorkforceInsights,
} from "./landing-sections";

const navigation = [
  { label: "Features", href: "#features", dropdown: true },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#analytics", dropdown: true },
  { label: "Contact", href: "#contact" },
];

export function TeamHubLanding() {
  return (
    <main id="top" className="min-h-screen bg-surface p-0 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-[1440px] overflow-hidden bg-background shadow-sm sm:rounded-[1.75rem]">
        <Header />

        <div className="px-5 sm:px-8 lg:px-12 xl:px-16">
          <section className="grid min-h-[590px] items-center gap-12 py-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 lg:py-20">
            <div className="max-w-xl">
              <Badge variant="secondary">
                The people platform for growing teams
              </Badge>
              <h1 className="mt-5 text-balance font-heading text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[4.35rem]">
                Streamline, manage, and grow your workforce with TeamHub.
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                TeamHub brings recruiting, employee operations, and workforce
                insights into one calm, connected workspace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
                >
                  Request a demo
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </a>
                <a
                  href="#features"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 px-5",
                  )}
                >
                  Explore features
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span>✓ No credit card required</span>
                <span>✓ Set up in minutes</span>
                <span>✓ Cancel anytime</span>
              </div>
            </div>
            <DashboardPreview />
          </section>

          <RecruitmentLifecycle />
          <WorkforceInsights />
          <IntegratedModules />
          <Pricing />
          <Testimonials />

          <section id="contact" className="scroll-mt-24 py-16 sm:py-20">
            <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
              <p className="text-sm font-semibold text-primary-foreground/75">
                Ready to bring your people workflows together?
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-balance font-heading text-3xl font-bold tracking-tight sm:text-5xl">
                Build a better employee experience with TeamHub.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-6 text-primary-foreground/75 sm:text-base">
                See how one connected HR platform can help your team hire
                confidently and grow with clarity.
              </p>
              <a
                href="mailto:hello@teamhub.example"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "mt-7 h-11 px-6",
                )}
              >
                Book your demo
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="relative z-20 border-b border-border/70 bg-background/95 px-5 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto flex h-20 items-center justify-between gap-6">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="TeamHub home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
            <Blend aria-hidden="true" className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            TeamHub
          </span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              {item.dropdown ? (
                <ChevronDown aria-hidden="true" className="size-3" />
              ) : null}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a href="#contact" className={buttonVariants({ variant: "outline" })}>
            Log in
          </a>
          <a href="#pricing" className={buttonVariants()}>
            Start your free trial
          </a>
        </div>

        <details className="group relative md:hidden">
          <summary
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-lg" }),
              "list-none cursor-pointer [&::-webkit-details-marker]:hidden",
            )}
            aria-label="Open navigation menu"
          >
            <Menu aria-hidden="true" />
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-12 w-52 rounded-2xl border border-border bg-background p-2 shadow-xl"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <a href="#pricing" className={cn(buttonVariants(), "mt-2 w-full")}>
              Start free trial
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
      <div className="flex flex-col gap-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Blend aria-hidden="true" className="size-4 text-primary" />
          <span className="font-semibold">TeamHub</span>
        </div>
        <p>© 2026 TeamHub. Built for people teams.</p>
        <nav aria-label="Legal" className="flex gap-5">
          <a href="#top" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#top" className="hover:text-foreground">
            Terms
          </a>
          <a href="#contact" className="hover:text-foreground">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
