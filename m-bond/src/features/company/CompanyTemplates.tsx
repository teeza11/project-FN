"use client";
import Link from "next/link";
import { PageHeader } from "@/components/ui/Layout";
import { OutlinePreview } from "@/components/shared/Checklist";
import { useStore } from "@/store/AppStore";
import { flatten } from "@/lib/tree";

export function CompanyTemplates() {
  const { templates } = useStore();
  return (
    <>
      <PageHeader title="เทมเพลตเอกสาร" subtitle="เลือกเทมเพลตเพื่อสร้างรายการตราสารหนี้ — ต้องแนบไฟล์ให้ครบทุกหัวข้อ" />
      <div className="grid gap-2.5">
        {templates.filter((t) => t.on).map((t) => (
          <div key={t.id} className="card !max-w-none">
            <b>{t.n}</b> <small className="text-muted">v{t.v} · {flatten(t.items).length} เอกสาร</small>
            <div className="my-3"><OutlinePreview items={t.items} /></div>
            <Link className="inline-block rounded-lg bg-brand px-3.5 py-2 text-white" href={`/company/new?tp=${t.id}`}>ใช้ Template นี้</Link>
          </div>
        ))}
      </div>
    </>
  );
}
