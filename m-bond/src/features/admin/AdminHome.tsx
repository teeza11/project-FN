"use client";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/Layout";
import { LogTable } from "@/components/shared/LogTable";
import { useStore } from "@/store/AppStore";

export function AdminHome() {
  const { users, docs } = useStore();
  return (
    <>
      <PageHeader title="ภาพรวมระบบ" subtitle="จัดการผู้ใช้งานในระบบ" />
      <StatGrid>
        <StatCard label="ผู้ใช้งานทั้งหมด" value={users.length} href="/admin/users" />
        <StatCard label="เอกสารในระบบ" value={docs.length} href="/admin/logs" />
        <StatCard label="ผู้ใช้ที่กำลังใช้งาน" value={users.filter((u) => u.on).length} href="/admin/users" />
        <StatCard label="การแจ้งเตือนระบบ" value={docs.filter((d) => d.s === "returned").length} href="/admin/logs" color="#F87171" />
      </StatGrid>
      <h3>ประวัติการเข้าใช้งานล่าสุด</h3>
      <LogTable />
    </>
  );
}
