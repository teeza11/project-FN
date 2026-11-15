"use client";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/Layout";
import { useStore } from "@/store/AppStore";
import { ReceivedTable } from "./ReceivedTable";

export function DocumentHome() {
  const { docs, incomplete } = useStore();
  const count = (s: string) => docs.filter((d) => d.s === s).length;
  const waiting = docs.filter((d) => d.s === "submitted");
  return (
    <>
      <PageHeader title="ตรวจเอกสารจากบริษัท" subtitle="ตรวจจำนวนเอกสารตาม Template แล้วส่งต่อ Reviewer ส่งกลับแก้ไข หรือยกเลิก" />
      <StatGrid>
        <StatCard label="รอ Document ตรวจ" value={count("submitted")} href="/document/inbox" color="#38BDF8" />
        <StatCard label="ครบ พร้อมส่ง Reviewer" value={waiting.filter((d) => !incomplete(d)).length} href="/document/inbox" />
        <StatCard label="เอกสารไม่ครบ" value={waiting.filter(incomplete).length} href="/document/inbox" color="#FB923C" />
        <StatCard label="ส่งกลับแก้ไข" value={count("returned")} href="/document/tracking" color="#F87171" />
        <StatCard label="ยกเลิก" value={count("cancelled")} href="/document/tracking" color="#94A3B8" />
      </StatGrid>
      <h3>เอกสารที่รอตรวจ</h3>
      <ReceivedTable />
    </>
  );
}
