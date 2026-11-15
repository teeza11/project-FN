"use client";
import { PageHeader } from "@/components/ui/Layout";
import { LogTable } from "@/components/shared/LogTable";

export function AdminLogs() {
  return (<><PageHeader title="ประวัติการใช้งาน" subtitle="บันทึกทุกการดำเนินการในระบบ" /><LogTable /></>);
}
