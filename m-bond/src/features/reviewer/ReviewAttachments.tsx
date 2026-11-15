"use client";
import { PageHeader } from "@/components/ui/Layout";
import { ChecklistView } from "@/components/shared/Checklist";
import { useStore } from "@/store/AppStore";

export function ReviewAttachments() {
  const { docs, tpl, got, need } = useStore();
  const list = docs.filter((d) => d.s === "pending");
  return (
    <>
      <PageHeader title="ตรวจสอบเอกสารแนบ" subtitle="เทียบกับรายการใน Template ทุกหัวข้อ" />
      <div className="grid gap-2.5">
        {list.length === 0 && <p className="text-muted">ไม่มีรายการรอตรวจสอบ</p>}
        {list.map((d) => (
          <div key={d.id} className="card !max-w-none">
            <b>{d.id} · {d.n}</b>{" "}
            <small className="text-muted">{d.co} · {tpl(d.tp).n} · แนบแล้ว {got(d)}/{need(d)}</small>
            <div className="mt-3"><ChecklistView items={tpl(d.tp).items} files={d.up} /></div>
          </div>
        ))}
      </div>
    </>
  );
}
