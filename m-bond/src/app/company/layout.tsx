import { RoleShell } from "@/components/layout/RoleShell";
export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="company">{children}</RoleShell>;
}
