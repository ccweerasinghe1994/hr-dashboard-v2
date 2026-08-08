import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { applicationGridLines, applicationMonths } from "./data";

export function ApplicationChart() {
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
              {applicationGridLines.map((y) => (
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
              {applicationMonths.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
