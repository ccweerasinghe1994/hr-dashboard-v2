import { Bell, Search, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PageHeader() {
  return (
    <header
      id="top"
      className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
    >
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Recruitment Update
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
