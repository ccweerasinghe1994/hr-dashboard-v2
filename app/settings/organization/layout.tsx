import { OrganizationShell } from "@/components/organization/organization-shell";

export default function OrganizationLayout({
  children,
}: LayoutProps<"/settings/organization">) {
  return <OrganizationShell>{children}</OrganizationShell>;
}
