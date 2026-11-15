"use client";
import Link from "next/link";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { useFeedback } from "@/components/ui/Feedback";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/AppStore";
import { useMyDocs } from "./useMyDocs";

export function CompanyHome() {
  const mine = useMyDocs();
  const { resubmit } = useStore();
  const { toast } = useFeedback();
  const router = useRouter();
  const c = (...s: string[]) => mine.filter((d) => s.includes(d.s)).length;

  const again = (id: string) => {
    const nid = resubmit(id);
    toast(`สร้าง ${nid} — แนบเอกสารใหม่ทั้งชุด`);
    router.push(`/company/fix?id=${nid}`);
  };

  return (
    <>
      <PageHeader title="รายการตราสารหนี้ของบริษัท" subtitle="จัดทำเอกสาร ส่งให้ Document และติดตามความคืบหน้า" />
      <StatGrid>
        <StatCard label="รายการทั้งหมด" value={mine.length} href="/company/history" />
        <StatCard label="กำลังจัดทำ" value={c("draft")} href="/company/instruments" />
        <StatCard label="ถูกส่งกลับแก้ไข" value={c("returned")} href="/company/instruments" color="#F87171" />
        <StatCard label="อยู่ระหว่างตรวจสอบ" value={c("submitted", "pending", "approving", "approved")} href="/company/tracking" color="#FBBF24" />
        <StatCard label="เผยแพร่แล้ว" value={c("published")} href="/company/history" />
        <StatCard label="ยกเลิก / ปฏิเสธ" value={c("cancelled", "rejected")} href="/company/history" color="#94A3B8" />
      </StatGrid>
      <h3>รายการที่ต้องดำเนินการ</h3>
      <DataTable
        columns={[
          { head: "รหัส", cell: (d) => d.id }, { head: "ชื่อรายการ", cell: (d) => d.n },
          { head: "สถานะ", cell: (d) => <StatusBadge s={d.s} /> }, { head: "หมายเหตุ", cell: (d) => d.note || "-" },
          { head: "", cell: (d) => d.s === "returned" ? (
            <Link className="rounded-lg bg-brand px-3.5 py-2 text-white" href={`/company/fix?id=${d.id}`}>กรอกเอกสาร</Link>
          ) : <Button onClick={() => again(d.id)}>ส่งใหม่ทั้งฉบับ</Button> },
        ]}
        rows={mine.filter((d) => ["returned", "cancelled", "rejected"].includes(d.s))}
      />
    </>
  );
}
