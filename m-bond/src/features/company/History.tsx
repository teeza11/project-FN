"use client";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { useFeedback } from "@/components/ui/Feedback";
import { SymbolLink } from "@/components/shared/SymbolLink";
import { useStore } from "@/store/AppStore";
import { useMyDocs } from "./useMyDocs";

export function History() {
  const mine = useMyDocs();
  const { tpl, logs, resubmit } = useStore();
  const { toast } = useFeedback();
  const router = useRouter();
  const ids = mine.map((d) => d.id);
  const again = (id: string) => { const nid = resubmit(id); toast(`สร้าง ${nid} — แนบเอกสารใหม่ทั้งชุด`); router.push(`/company/fix?id=${nid}`); };
  return (
    <>
      <PageHeader title="ประวัติการยื่น" subtitle="รายการตราสารหนี้ที่เคยยื่นทั้งหมด — รายการที่ถูกยกเลิกต้องส่งใหม่ทั้งฉบับ" />
      <DataTable
        columns={[
          { head: "รหัส", cell: (d) => d.id }, { head: "Symbol", cell: (d) => <SymbolLink doc={d} /> },
          { head: "ชื่อรายการ", cell: (d) => d.n }, { head: "Template", cell: (d) => tpl(d.tp).n },
          { head: "สถานะ", cell: (d) => <StatusBadge s={d.s} /> }, { head: "Version", cell: (d) => `v${d.v}` },
          { head: "วันที่เผยแพร่", cell: (d) => d.date || "-" }, { head: "หมายเหตุ", cell: (d) => d.note || "-" },
          { head: "", cell: (d) => (d.s === "cancelled" || d.s === "rejected") ? <Button onClick={() => again(d.id)}>ส่งใหม่ทั้งฉบับ</Button> : null },
        ]}
        rows={mine}
      />
      <h3>บันทึกกิจกรรม</h3>
      <DataTable
        columns={[{ head: "วันที่และเวลา", cell: (l) => l.t }, { head: "เหตุการณ์", cell: (l) => l.a }]}
        rows={logs.filter((l) => ids.some((id) => l.a.includes(id)))}
      />
    </>
  );
}
