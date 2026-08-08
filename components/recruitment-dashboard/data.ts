import {
  CalendarDays,
  CalendarX2,
  ChartNoAxesCombined,
  ContactRound,
  LayoutDashboard,
  Mail,
  ReceiptText,
  Search,
  UserCheck,
} from "lucide-react";

import type {
  Applicant,
  ApplicantResource,
  Department,
  NavigationItem,
  ScheduleItem,
  Vacancy,
} from "./types";

export const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Inbox", icon: Mail },
  { label: "Calendar", icon: CalendarDays },
  { label: "Employees", icon: ContactRound },
  { label: "Attendance", icon: UserCheck },
  { label: "Performance", icon: ChartNoAxesCombined },
  { label: "Payroll", icon: ReceiptText },
  { label: "Leave Management", icon: CalendarX2 },
  { label: "Recruitment", icon: Search, active: true },
] satisfies NavigationItem[];

export const vacancies = [
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
] satisfies Vacancy[];

export const resources = [
  { label: "Job Portal", value: 57.5, applicants: 84 },
  { label: "Company Website", value: 20.5, applicants: 30 },
  { label: "Employee Referral", value: 15.1, applicants: 22 },
  { label: "Social Media (LinkedIn)", value: 6.9, applicants: 10 },
] satisfies ApplicantResource[];

export const departments = [
  { label: "Human\nResources", value: 19 },
  { label: "Marketing", value: 27 },
  { label: "Product\nDesign", value: 31 },
  { label: "R&D", value: 22 },
  { label: "Operations", value: 28, highlighted: true },
  { label: "Customer\nService", value: 19 },
] satisfies Department[];

export const schedule = [
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
] satisfies ScheduleItem[];

export const applicants = [
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
] satisfies Applicant[];

export const applicantFilters = [
  "All",
  "Application Received",
  "Interview Scheduled",
  "Final Interview",
  "Test Completed",
];

export const calendarDates = [17, 18, 19, 20, 21, 22, 23];

export const weekdays = [
  { short: "S", name: "Sunday" },
  { short: "M", name: "Monday" },
  { short: "T", name: "Tuesday" },
  { short: "W", name: "Wednesday" },
  { short: "T", name: "Thursday" },
  { short: "F", name: "Friday" },
  { short: "S", name: "Saturday" },
];

export const applicationMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export const applicationGridLines = [12, 58, 104, 150];

export const applicationStages = [1, 2, 3, 4, 5];
