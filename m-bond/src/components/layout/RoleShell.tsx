"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useStore } from "@/store/AppStore";
import { ROLES } from "@/lib/roles";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Layout";
import { LogoMark } from "@/components/shared/Logo";
import { DocTable } from "@/components/shared/DocTable";
import { DocDetailDialog } from "@/components/shared/DocDetailDialog";
import { issuerLabel } from "@/lib/rules";

/**
 * โครงหน้าของแต่ละ Role (แถบเมนู + ส่วนหัว + ช่องค้นหา)
 * ทำหน้าที่ป้องกันสิทธิ์: ยังไม่ล็อกอินหรือ Role ไม่ตรงกับโฟลเดอร์ จะถูกส่งไปหน้าที่ถูกต้อง
 */
export function RoleShell({ role, children }: { role: Role; children: ReactNode }) {
  const { me, ready, logout, query, setQuery, docs } = useStore();
  const router = useRouter();
  const path = usePathname();
  const cfg = ROLES[role];
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ready) return;
    if (!me) router.replace("/login");
    else if (me.r !== role) router.replace(ROLES[me.r].base);
  }, [ready, me, role, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!ready || !me || me.r !== role) return <div className="grid h-screen place-items-center text-muted">กำลังโหลด…</div>;

  const scope = role === "company" ? docs.filter((d) => d.co === me.co) : docs;
  const q = query.trim().toLowerCase();
  const results = q
    ? scope.filter((d) => (d.id + d.symbol + d.n + d.co + d.kind + d.tenor + d.termGroup + issuerLabel(d) + d.date).toLowerCase().includes(q))
    : [];

  return (
    <div className="flex h-screen">
      <aside className="flex w-[250px] shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-line bg-sidebar px-3 py-4 max-md:hidden">
        <div className="flex items-center gap-3 px-2 pb-4">
          <LogoMark className="h-auto w-[46px]" />
          <div><b className="block text-[17px]">M-Bond</b><small className="text-[11px] text-muted">ระบบตราสารหนี้</small></div>
        </div>
        <nav className="grid gap-1.5" aria-label={`เมนู ${cfg.name}`}>
          {cfg.nav.map((m) => {
            const on = m.href === cfg.base ? path === m.href : path === m.href;
            return (
              <Link key={m.href} href={m.href} onClick={() => setQuery("")} aria-current={on ? "page" : undefined}
                className={`rounded-[10px] px-3 py-2.5 ${on ? "bg-brand font-semibold" : "hover:bg-card"}`}>
                {m.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-2.5 rounded-xl bg-card p-2.5">
          <i className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#3b5a56] text-xs not-italic">{role === "company" ? "CO" : "DM"}</i>
          <div>{role === "company" ? me.co : "ระบบเอกสารตราสารหนี้"}<small className="block text-[11px] text-muted">{cfg.desc}</small></div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-line px-6 py-3.5">
          <div className="flex max-w-[560px] flex-1 items-center gap-2 rounded-[10px] bg-card px-3">
            <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="ค้นหา"
              placeholder="ค้นหาเอกสาร / เลขที่เอกสาร / บริษัท ..." className="flex-1 border-0 bg-transparent py-2.5 outline-none" />
            <kbd className="rounded bg-line px-1.5 py-0.5 text-[11px] text-muted max-sm:hidden">Ctrl K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="text-right"><b>{me.n}</b>
              <small className="block text-[11px] text-muted">{cfg.name}{role === "company" ? ` · ${me.co}` : ""}</small></div>
            <Button variant="outline" onClick={() => { logout(); router.replace("/login"); }}>ออกจากระบบ</Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {q ? (<><PageHeader title="ผลการค้นหา" subtitle={`“${query}”`} /><DocTable docs={results} hideCompany={role === "company"} /></>) : children}
        </main>
      </div>
      <DocDetailDialog />
    </div>
  );
}
