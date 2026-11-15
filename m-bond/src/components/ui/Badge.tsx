import { STATUS } from "@/lib/status";
import type { DocStatus } from "@/lib/types";

export function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
      {children}
    </span>
  );
}

export const StatusBadge = ({ s }: { s: DocStatus }) => <Badge color={STATUS[s].color}>{STATUS[s].label}</Badge>;
