import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

export type Vacancy = {
  role: string;
  type: string;
  place: string;
  applicants: number;
};

export type ApplicantResource = {
  label: string;
  value: number;
  applicants: number;
};

export type Department = {
  label: string;
  value: number;
  highlighted?: boolean;
};

export type ScheduleItem = {
  time: string;
  title: string;
  person: string;
};

export type Applicant = {
  initials: string;
  name: string;
  email: string;
  role: string;
  department: string;
  date: string;
  contract: string;
  location: string;
  status: string;
  stage: number;
};
