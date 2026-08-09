import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { departments } from "./data";

export function DepartmentChart() {
  const max = Math.max(...departments.map((department) => department.value));

  return (
    <Card>
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
