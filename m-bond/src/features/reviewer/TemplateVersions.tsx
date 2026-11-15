"use client";
import { useState } from "react";
import { PageHeader, Field } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { useFeedback } from "@/components/ui/Feedback";
import { OutlineEditor } from "@/components/shared/OutlineEditor";
import { OutlinePreview } from "@/components/shared/Checklist";
import { useStore } from "@/store/AppStore";
import { cloneTree, flatten } from "@/lib/tree";
import type { OutlineNode, Template } from "@/lib/types";

/** ดู Archive ของ Version เก่า (อ่านอย่างเดียว) */
function ArchiveDialog({ t, onClose }: { t: Template; onClose: () => void }) {
  const [v, setV] = useState(t.hist[t.hist.length - 1].v);
  const h = t.hist.find((x) => x.v === v)!;
  return (
    <Modal title={`Archive · ${t.n}`} onClose={onClose}>
      <select aria-label="เลือก Version" value={v} onChange={(e) => setV(+e.target.value)}>
        {t.hist.map((x) => <option key={x.v} value={x.v}>v{x.v} · เก็บเมื่อ {x.date}</option>)}
      </select>
      <p className="my-2.5 text-muted">{h.n} · {flatten(h.items).length} รายการ{h.note ? ` · ${h.note}` : ""} · อ่านอย่างเดียว</p>
      <OutlinePreview items={h.items} />
    </Modal>
  );
}

/** ออก Version ใหม่ = ป๊อปอัพแก้ไข เพิ่ม หรือลดข้อมูล Template แล้วบันทึก */
function NewVersionDialog({ t, onClose }: { t: Template; onClose: () => void }) {
  const { issueVersion } = useStore();
  const { toast } = useFeedback();
  const [name, setName] = useState(t.n);
  const [note, setNote] = useState("");
  const [items, setItems] = useState<OutlineNode[]>(() => cloneTree(t.items));
  const save = () => {
    const er = issueVersion(t.id, { name, items, note });
    if (er) return toast(er);
    toast(`ออก Version ใหม่ v${t.v + 1} แล้ว`);
    onClose();
  };
  return (
    <Modal title={`ออก Version ใหม่ · ${t.id} (v${t.v} → v${t.v + 1})`} onClose={onClose}
      footer={<><Button variant="outline" onClick={onClose}>ยกเลิก</Button><Button onClick={save}>บันทึกเป็น Version ใหม่</Button></>}>
      <p className="mb-3 text-muted">Version เดิมจะถูกเก็บเป็น Archive — แก้ไข เพิ่ม หรือลดข้อมูล Template ได้ตามต้องการ</p>
      <Field label="ชื่อ Template"><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="สรุปการเปลี่ยนแปลง"><input value={note} placeholder="เช่น เพิ่มหัวข้อหนังสือรับรองผู้สอบบัญชี" onChange={(e) => setNote(e.target.value)} /></Field>
      <OutlineEditor items={items} onChange={setItems} />
    </Modal>
  );
}

function Modal({ title, children, footer, onClose }: { title: string; children: React.ReactNode; footer?: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-line bg-card p-5">
        <h3>{title}</h3>
        {children}
        <div className="mt-4 flex justify-end gap-2">{footer ?? <Button variant="outline" onClick={onClose}>ปิด</Button>}</div>
      </div>
    </div>
  );
}

export function TemplateVersions() {
  const { templates } = useStore();
  const [archive, setArchive] = useState<string | null>(null);
  const [edit, setEdit] = useState<string | null>(null);
  const at = (id: string | null) => templates.find((t) => t.id === id);
  return (
    <>
      <PageHeader title="จัดการเวอร์ชัน Template" subtitle="ดู Archive ของ Version เก่า และออก Version ใหม่โดยแก้ไขข้อมูล Template ได้ในหน้าต่างป๊อปอัพ" />
      <DataTable
        columns={[
          { head: "Template", cell: (t) => t.n }, { head: "Current", cell: (t) => `v${t.v}` },
          { head: "อัปเดตล่าสุด", cell: (t) => t.verDate || "-" }, { head: "Archive", cell: (t) => t.hist.length },
          { head: "", cell: (t) => (
            <span className="flex gap-1.5">
              <Button variant="outline" disabled={!t.hist.length} onClick={() => setArchive(t.id)}>ดู Archive</Button>
              <Button onClick={() => setEdit(t.id)}>ออก Version ใหม่</Button>
            </span>) },
        ]}
        rows={templates}
      />
      {at(archive) && <ArchiveDialog t={at(archive)!} onClose={() => setArchive(null)} />}
      {at(edit) && <NewVersionDialog key={edit} t={at(edit)!} onClose={() => setEdit(null)} />}
    </>
  );
}
