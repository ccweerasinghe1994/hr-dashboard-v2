import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { schedule } from "./data";
import { MiniCalendar } from "./mini-calendar";

export function SchedulesCard() {
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
