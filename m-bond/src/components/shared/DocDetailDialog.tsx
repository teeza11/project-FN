"use client";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { LogTableRaw } from "./LogTableRaw";
import { ChecklistView } from "./Checklist";
import { issuerLabel } from "@/lib/rules";
import { useStore } from "@/store/AppStore";

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between gap-4 border-b border-line py-2"><span className="text-muted">{k}</span><span className="text-right">{v}</span></div>;
}

/** ป๊อปอัพรายละเอียดตราสารหนี้ — เปิดจากการกด Symbol ที่ไหนก็ได้ */
export function DocDetailDialog() {
  const { detailId, openDetail, docs, tpl, got, need, logs } = useStore();
  const d = docs.find((x) => x.id === detailId);
  if (!d) return null;
  const t = tpl(d.tp);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="รายละเอียดตราสารหนี้">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-line bg-card p-5">
        <h3>รายละเอียดตราสารหนี้ · {d.symbol || "-"}</h3>
        <KV k="รหัสเอกสาร" v={d.id} />
        <KV k="Symbol" v={d.symbol || "-"} />
        <KV k="ชื่อรายการ" v={d.n} />
        <KV k="ผู้ออก" v={d.co} />
        <KV k="ประเภทผู้ออก" v={issuerLabel(d)} />
        <KV k="คำเรียกตราสาร" v={d.kind} />
        <KV k="อายุตราสาร" v={`${d.tenor} (${d.termGroup === "short" ? "ระยะสั้น" : "ระยะยาว"})`} />
        <KV k="สถานะ" v={<StatusBadge s={d.s} />} />
        <KV k="Version เอกสาร" v={`v${d.v}${d.a ? ` · Archive ${d.a}` : ""}`} />
        <KV k="วันที่เผยแพร่" v={d.date || "-"} />
        <KV k="Template" v={`${t.n} v${t.v}`} />
        {d.note && <KV k="หมายเหตุ" v={d.note} />}
        <h3 className="mb-2 mt-4">เอกสารที่แนบ ({got(d)}/{need(d)})</h3>
        <ChecklistView items={t.items} files={d.up} />
        <h3 className="mb-2 mt-4">ประวัติของรายการนี้</h3>
        <LogTableRaw logs={logs.filter((l) => l.a.includes(d.id))} />
        <div className="mt-3.5 text-right"><Button variant="outline" onClick={() => openDetail(null)}>ปิด</Button></div>
      </div>
    </div>
  );
}
