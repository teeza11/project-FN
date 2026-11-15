"use client";
import { PageHeader } from "@/components/ui/Layout";
import { TrackingTable } from "@/components/shared/TrackingTable";
import { useMyDocs } from "./useMyDocs";

export function CompanyTracking() {
  return (
    <>
      <PageHeader title="ตรวจสอบความคืบหน้า" subtitle="ร่าง → Document ตรวจ → Reviewer ตรวจ → อนุมัติ → รอเผยแพร่ → เผยแพร่" />
      <TrackingTable docs={useMyDocs()} />
    </>
  );
}
