"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Field } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { OutlineEditor } from "@/components/shared/OutlineEditor";
import { useStore } from "@/store/AppStore";
import type { OutlineNode } from "@/lib/types";

/** สร้าง Template: ตั้งชื่อ แล้วกดเพิ่มหัวข้อ / หัวข้อย่อยทีละรายการ */
export function TemplateBuilder() {
  const { createTemplate } = useStore();
  const { toast } = useFeedback();
  const router = useRouter();
  const [name, setName] = useState("");
  const [items, setItems] = useState<OutlineNode[]>([]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return toast("กรุณาเพิ่มอย่างน้อย 1 หัวข้อ");
    const id = createTemplate(name.trim(), items);
    toast("สร้างแล้ว — เพิ่ม/แก้ไขรายการต่อได้");
    router.push(`/reviewer/templates/format?id=${id}`);
  };

  return (
    <>
      <PageHeader title="สร้าง Template" subtitle="ตั้งชื่อ Template แล้วเพิ่มหัวข้อและหัวข้อย่อย — แก้ชื่อ จัดลำดับ หรือลบได้ก่อนกดสร้าง" />
      <form onSubmit={submit} className="card">
        <Field label="ชื่อ Template"><input required value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <OutlineEditor items={items} onChange={setItems} showKind />
        <div className="mt-4 text-right"><Button type="submit">สร้าง Template</Button></div>
      </form>
    </>
  );
}
