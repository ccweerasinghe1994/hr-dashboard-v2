import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

import { resources } from "./data";

export function ResourcesCard() {
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
