"use client";
import { useState } from "react";
import { PageHeader, Notice } from "@/components/ui/Layout";
import { OutlineEditor } from "@/components/shared/OutlineEditor";
import { useStore } from "@/store/AppStore";

/** จัดการรูปแบบเอกสาร: แก้โครงหัวข้อ/หัวข้อย่อยของ Template ที่เลือกได้โดยตรง */
export function TemplateFormat({ initialId }: { initialId?: string }) {
  const { templates, setTemplateItems } = useStore();
  const [id, setId] = useState(templates.some((t) => t.id === initialId) ? initialId! : templates[0].id);
  const t = templates.find((x) => x.id === id)!;
  return (
    <>
      <PageHeader title="จัดการรูปแบบเอกสาร" subtitle="เพิ่ม ลบ แก้ชื่อ และจัดลำดับรายการหลัก / รายการย่อยของ Template" />
      <div className="card max-w-[760px]">
        <select aria-label="เลือก Template" value={id} onChange={(e) => setId(e.target.value)}>
          {templates.map((x) => <option key={x.id} value={x.id}>{x.n}</option>)}
        </select>
      </div>
      <Notice title="หมายเหตุ">รายการที่เพิ่มใหม่จะถูกนับเป็นเอกสารที่ยังไม่แนบ ในรายการที่ยังไม่เผยแพร่ซึ่งใช้ Template นี้</Notice>
      <OutlineEditor items={t.items} onChange={(next) => setTemplateItems(id, next, "แก้ไขรูปแบบเอกสาร")} />
    </>
  );
}
