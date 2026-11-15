"use client";
import { PageHeader } from "@/components/ui/Layout";
import { TrackingTable } from "@/components/shared/TrackingTable";
import { useStore } from "@/store/AppStore";

export function DocumentTracking() {
  const { docs } = useStore();
  return (
    <>
      <PageHeader title="ติดตามสถานะเอกสาร" subtitle="ร่าง → Document ตรวจ → Reviewer ตรวจ → อนุมัติ → รอเผยแพร่ → เผยแพร่" />
      <TrackingTable docs={docs} />
    </>
  );
}
