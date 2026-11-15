"use client";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { cloneTree, find, node, rows } from "@/lib/tree";
import type { OutlineNode } from "@/lib/types";

/**
 * ตัวแก้ไขโครงหัวข้อ / หัวข้อย่อยของ Template (เพิ่ม ลบ แก้ชื่อ จัดลำดับ)
 * ใช้ร่วมกันใน: สร้าง Template, จัดการรูปแบบเอกสาร และป๊อปอัพออก Version ใหม่
 */
export function OutlineEditor({ items, onChange, showKind = false }: {
  items: OutlineNode[]; onChange: (next: OutlineNode[]) => void; showKind?: boolean;
}) {
  const { ask } = useFeedback();

  const edit = (fn: (tree: OutlineNode[]) => void) => { const t = cloneTree(items); fn(t); onChange(t); };

  const add = async (parentId: string) => {
    const v = await ask({ title: parentId ? "ชื่อหัวข้อย่อย" : "ชื่อหัวข้อ", required: true });
    if (!v) return;
    edit((t) => { if (parentId) find(t, parentId)?.n.c.push(node(v)); else t.push(node(v)); });
  };
  const rename = async (id: string, cur: string) => {
    const v = await ask({ title: "แก้ไขชื่อ", initial: cur, required: true });
    if (v) edit((t) => { const f = find(t, id); if (f) f.n.t = v; });
  };
  const remove = (id: string) => edit((t) => { const f = find(t, id); if (f) f.arr.splice(f.i, 1); });
  const move = (id: string, d: number) => edit((t) => {
    const f = find(t, id); if (!f) return;
    const j = f.i + d; if (j < 0 || j >= f.arr.length) return;
    [f.arr[f.i], f.arr[j]] = [f.arr[j], f.arr[f.i]];
  });

  return (
    <div>
      <div className="mb-3 grid max-w-4xl gap-1.5">
        {items.length === 0 && <p className="text-muted">ยังไม่มีหัวข้อ — กด “+ เพิ่มหัวข้อ” เพื่อเริ่ม</p>}
        {rows(items).map(({ n, no, depth, i, siblings }) => (
          <div key={n.id} className="tree-row" style={{ marginLeft: depth * 24 }}>
            <b className="min-w-[34px] text-accent">{no}</b>
            <span className="min-w-[140px] flex-1">{n.t}</span>
            {showKind && <em className="text-xs not-italic text-muted">{depth ? "หัวข้อย่อย" : "หัวข้อ"}</em>}
            <span className="flex flex-wrap gap-1.5">
              <Button variant="outline" aria-label="เลื่อนขึ้น" disabled={i === 0} onClick={() => move(n.id, -1)}>↑</Button>
              <Button variant="outline" aria-label="เลื่อนลง" disabled={i === siblings.length - 1} onClick={() => move(n.id, 1)}>↓</Button>
              <Button variant="outline" onClick={() => add(n.id)}>+ หัวข้อย่อย</Button>
              <Button variant="outline" onClick={() => rename(n.id, n.t)}>แก้ชื่อ</Button>
              <Button variant="danger" onClick={() => remove(n.id)}>ลบ</Button>
            </span>
          </div>
        ))}
      </div>
      <Button onClick={() => add("")}>+ เพิ่มหัวข้อ</Button>
    </div>
  );
}
