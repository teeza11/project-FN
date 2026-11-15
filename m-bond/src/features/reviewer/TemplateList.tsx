"use client";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { useFeedback } from "@/components/ui/Feedback";
import { useStore } from "@/store/AppStore";
import { flatten } from "@/lib/tree";

export function TemplateList() {
  const { templates, renameTemplate, toggleTemplate, toggleUpdate } = useStore();
  const { ask } = useFeedback();
  const rename = async (id: string, cur: string) => {
    const v = await ask({ title: "ชื่อ Template", initial: cur, required: true });
    if (v) renameTemplate(id, v);
  };
  return (
    <>
      <PageHeader title="แก้ไข Template" subtitle="เปลี่ยนชื่อ เปิด/ปิด และระบุว่าต้องปรับปรุง" />
      <DataTable
        columns={[
          { head: "รหัส", cell: (t) => t.id }, { head: "ชื่อ", cell: (t) => t.n },
          { head: "รายการ", cell: (t) => flatten(t.items).length }, { head: "Version", cell: (t) => `v${t.v}` },
          { head: "สถานะ", cell: (t) => t.upd ? <Badge color="#FBBF24">ต้องปรับปรุง</Badge> : t.on ? <Badge color="#2FE6A6">เปิดใช้งาน</Badge> : <Badge color="#8FAAA4">ปิด</Badge> },
          { head: "", cell: (t) => (
            <span className="flex gap-1.5">
              <Button variant="outline" onClick={() => rename(t.id, t.n)}>ชื่อ</Button>
              <Button variant="outline" onClick={() => toggleTemplate(t.id)}>{t.on ? "ปิด" : "เปิด"}</Button>
              <Button variant="outline" onClick={() => toggleUpdate(t.id)}>{t.upd ? "เสร็จแล้ว" : "ต้องปรับปรุง"}</Button>
            </span>) },
        ]}
        rows={templates}
      />
    </>
  );
}
