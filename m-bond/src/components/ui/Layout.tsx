import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="mb-1">{title}</h2>{subtitle && <p className="text-muted">{subtitle}</p>}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">{children}</div>;
}

export function StatCard({ label, value, href, color = "#2FE6A6" }: { label: string; value: number; href: string; color?: string }) {
  return (
    <Link href={href} className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-[18px] text-muted transition hover:border-accent">
      {label}<b className="text-[34px] font-semibold" style={{ color }}>{value}</b>
    </Link>
  );
}

export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-brand bg-[#0b3028] px-3.5 py-3 text-[#bcebdc]">
      <b className="text-accent">{title}</b><span>{children}</span>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="mb-3.5 grid gap-1.5 font-medium">{label}{children}</label>;
}

export function Progress({ value, max }: { value: number; max: number }) {
  return (
    <span className="mr-2 inline-block h-1.5 w-20 overflow-hidden rounded bg-line align-middle">
      <i className="block h-full bg-accent" style={{ width: `${(value / Math.max(1, max)) * 100}%` }} />
    </span>
  );
}
