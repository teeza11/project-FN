"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { rows } from "@/lib/tree";
import type { OutlineNode } from "@/lib/types";

/** แสดงโครงหัวข้อพร้อมสถานะไฟล์แนบ (อ่านอย่างเดียว) */
export function ChecklistView({ items, files }: { items: OutlineNode[]; files: Record<string, string> }) {
  return (
    <div className="grid max-w-4xl gap-1.5">
      {rows(items).map(({ n, no, depth }) => (
        <div key={n.id} className="tree-row" style={{ marginLeft: depth * 24 }}>
          <b className="min-w-[34px] text-accent">{no}</b>
          <span className="min-w-[140px] flex-1">{n.t}</span>
          {files[n.id] ? <em className="text-xs not-italic text-accent">✓ {files[n.id]}</em> : <em className="text-xs not-italic text-danger">✗ ยังไม่แนบ</em>}
        </div>
      ))}
    </div>
  );
}

/** โครงหัวข้อล้วน ๆ ไม่มีสถานะไฟล์ (พรีวิว Template) */
export function OutlinePreview({ items, trailing }: { items: OutlineNode[]; trailing?: (n: OutlineNode) => ReactNode }) {
  if (!items.length) return <p className="text-muted">เทมเพลตนี้ยังไม่มีรายการ</p>;
  return (
    <div className="grid max-w-4xl gap-1.5">
      {rows(items).map(({ n, no, depth }) => (
        <div key={n.id} className="tree-row" style={{ marginLeft: depth * 24 }}>
          <b className="min-w-[34px] text-accent">{no}</b><span className="flex-1">{n.t}</span>{trailing?.(n)}
        </div>
      ))}
    </div>
  );
}

/** โครงหัวข้อที่แนบ/เปลี่ยน/ลบไฟล์ได้ (รับเฉพาะ .zip และ .pdf) */
export function AttachmentTree({ items, files, onFile }: {
  items: OutlineNode[]; files: Record<string, string>; onFile: (itemId: string, name: string | null) => void;
}) {
  const { toast } = useFeedback();
  const pick = (id: string, list: FileList | null) => {
    const f = list?.[0];
    if (!f) return;
    if (!/\.(zip|pdf)$/i.test(f.name)) return toast("แนบได้เฉพาะไฟล์ .zip หรือ .pdf");
    onFile(id, f.name);
  };
  const input = (id: string) => (
    <input type="file" hidden accept=".zip,.pdf,application/pdf,application/zip" onChange={(e) => { pick(id, e.target.files); e.target.value = ""; }} />
  );
  if (!items.length) return <p className="text-muted">เทมเพลตนี้ยังไม่มีรายการ</p>;
  return (
    <div className="grid max-w-4xl gap-1.5">
      {rows(items).map(({ n, no, depth }) => (
        <div key={n.id} className="tree-row" style={{ marginLeft: depth * 24 }}>
          <b className="min-w-[34px] text-accent">{no}</b>
          <span className="min-w-[140px] flex-1">{n.t}</span>
          {files[n.id] ? (
            <>
              <em className="text-xs not-italic text-accent">✓ {files[n.id]}</em>
              <span className="ml-auto flex gap-1.5">
                <label className="cursor-pointer rounded-lg border border-line px-3.5 py-2 hover:bg-line/60">เปลี่ยนไฟล์{input(n.id)}</label>
                <Button variant="outline" onClick={() => onFile(n.id, null)}>ลบไฟล์</Button>
              </span>
            </>
          ) : (
            <>
              <em className="text-xs not-italic text-muted">ยังไม่แนบ</em>
              <span className="ml-auto"><label className="cursor-pointer rounded-lg bg-brand px-3.5 py-2 text-white hover:brightness-110">แนบไฟล์{input(n.id)}</label></span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
