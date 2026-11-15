import { RoleShell } from "@/components/layout/RoleShell";
export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="document">{children}</RoleShell>;
}
