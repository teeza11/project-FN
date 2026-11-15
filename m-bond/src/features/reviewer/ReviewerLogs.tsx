"use client";
import { PageHeader } from "@/components/ui/Layout";
import { LogTable } from "@/components/shared/LogTable";

export function ReviewerLogs() {
  return (
    <>
      <PageHeader title="ประวัติการดำเนินการ" subtitle="บันทึกทุกการดำเนินการในระบบ" />
      <LogTable filter={(l) => l.c !== "sys"} />
    </>
  );
}
