"use client";
import { PageHeader, Notice } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { useFeedback } from "@/components/ui/Feedback";
import { SymbolLink } from "@/components/shared/SymbolLink";
import { useStore } from "@/store/AppStore";

/** Admin ลบเอกสารที่เผยแพร่แล้วได้ แต่ต้องระบุสาเหตุทุกครั้ง */
export function PublishedDocs() {
  const { docs, deleted, removePublished } = useStore();
  const { ask, toast } = useFeedback();
  const list = docs.filter((d) => d.s === "published");

  const remove = async (id: string) => {
    const reason = await ask({ title: `เหตุผลที่ลบเอกสาร ${id} (ต้องระบุ)`, multiline: true, required: true, confirmLabel: "ลบเอกสาร" });
    if (!reason) return;
    removePublished(id, reason);
    toast(`ลบเอกสาร ${id} แล้ว`);
  };

  return (
    <>
      <PageHeader title="เอกสารที่เผยแพร่แล้ว" subtitle="ลบเอกสารที่เผยแพร่แล้วได้ แต่ต้องระบุสาเหตุทุกครั้ง และระบบจะบันทึกไว้ในประวัติการลบ" />
      <Notice title="ข้อควรระวัง">การลบจะนำเอกสารออกจากระบบทันที ไม่สามารถกู้คืนได้</Notice>
      <DataTable
        columns={[
          { head: "รหัส", cell: (d) => d.id },
          { head: "Symbol", cell: (d) => <SymbolLink doc={d} /> },
          { head: "ชื่อรายการ", cell: (d) => d.n },
          { head: "ผู้ออก", cell: (d) => d.co },
          { head: "Version", cell: (d) => `v${d.v}` },
          { head: "วันที่เผยแพร่", cell: (d) => d.date || "-" },
          { head: "", cell: (d) => <Button variant="danger" onClick={() => remove(d.id)}>ลบ</Button> },
        ]}
        rows={list}
      />
      <h3>ประวัติการลบ</h3>
      <DataTable
        columns={[
          { head: "วันที่และเวลา", cell: (x) => x.t }, { head: "ผู้ลบ", cell: (x) => x.u },
          { head: "รหัส", cell: (x) => x.id }, { head: "ชื่อรายการ", cell: (x) => x.n }, { head: "สาเหตุ", cell: (x) => x.reason },
        ]}
        rows={deleted}
      />
    </>
  );
}
