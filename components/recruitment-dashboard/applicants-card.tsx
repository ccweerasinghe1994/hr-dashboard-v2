import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { applicantFilters, applicants } from "./data";
import { Stages } from "./stages";

export function ApplicantsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applicants</CardTitle>
        <CardAction>
          <nav
            aria-label="Applicant status filters"
            className="hidden flex-wrap justify-end gap-1 lg:flex"
          >
            {applicantFilters.map((filter, index) => (
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
