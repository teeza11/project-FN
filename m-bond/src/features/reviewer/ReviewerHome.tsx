"use client";
import Link from "next/link";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/Layout";
import { DocTable } from "@/components/shared/DocTable";
import { useStore } from "@/store/AppStore";

export function ReviewerHome() {
  const { docs, templates } = useStore();
  const count = (s: string) => docs.filter((d) => d.s === s).length;
  return (
    <>
      <PageHeader title="ตรวจสอบ อนุมัติ และเผยแพร่" subtitle="คิวงานและการจัดการ Template ของคุณ" />
      <StatGrid>
        <StatCard label="รอตรวจสอบ" value={count("pending")} href="/reviewer/review/data" color="#FBBF24" />
        <StatCard label="รออนุมัติ" value={count("approving")} href="/reviewer/review/approval" color="#60A5FA" />
        <StatCard label="ถูกส่งกลับแก้ไข" value={count("returned")} href="/reviewer/review/return" color="#F87171" />
        <StatCard label="เผยแพร่แล้ว" value={count("published")} href="/reviewer/publish" />
        <StatCard label="Template ทั้งหมด" value={templates.length} href="/reviewer/templates" />
        <StatCard label="Template ต้องปรับปรุง" value={templates.filter((t) => t.upd).length} href="/reviewer/templates" color="#FBBF24" />
      </StatGrid>
      <h3>รอตรวจสอบ</h3>
      <DocTable docs={docs.filter((d) => d.s === "pending")}
        extra={[{ head: "", cell: () => <Link className="rounded-lg bg-brand px-3.5 py-2 text-white" href="/reviewer/review/data">ตรวจ</Link> }]} />
    </>
  );
}
