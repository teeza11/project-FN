"use client";
import { PageHeader } from "@/components/ui/Layout";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { useStore } from "@/store/AppStore";
import { ReceivedTable } from "./ReceivedTable";

export function Inbox() {
  const { docs } = useStore();
  return (
    <>
      <PageHeader title="ตรวจเอกสารที่ได้รับ" subtitle="ตรวจจำนวนเอกสารตาม Template — ครบแล้วส่งต่อ Reviewer ได้ ไม่ครบให้ส่งกลับแก้ไข หรือยกเลิกหากดำเนินการต่อไม่ได้" />
      <ReceivedTable />
      <h3>ส่งกลับแก้ไข / ยกเลิกแล้ว</h3>
      <DataTable
        columns={[
          { head: "รหัส", cell: (d) => d.id }, { head: "ชื่อรายการ", cell: (d) => d.n },
          { head: "สถานะ", cell: (d) => <StatusBadge s={d.s} /> }, { head: "เหตุผล", cell: (d) => d.note || "-" },
        ]}
        rows={docs.filter((d) => d.s === "returned" || d.s === "cancelled")}
      />
    </>
  );
}
