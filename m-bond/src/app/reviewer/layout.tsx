import { RoleShell } from "@/components/layout/RoleShell";
export default function ReviewerLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="reviewer">{children}</RoleShell>;
}
