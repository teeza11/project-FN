"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Layout";
import { useFeedback } from "@/components/ui/Feedback";
import { AttachmentTree } from "@/components/shared/Checklist";
import { SymbolLink } from "@/components/shared/SymbolLink";
import { useStore } from "@/store/AppStore";
import { useMyDocs } from "./useMyDocs";

/** เอกสารที่ไม่ครบ / ส่งกลับแก้ไข: แนบไฟล์ zip/pdf ในแต่ละหัวข้อให้ครบ แล้วส่งให้ Document */
export function FixDocs({ initialId }: { initialId?: string }) {
  const mine = useMyDocs();
  const { tpl, got, need, setFile, sendDoc } = useStore();
  const { toast } = useFeedback();
  const router = useRouter();
  const list = mine.filter((d) => d.s === "draft" || d.s === "returned");
  const [pick, setPick] = useState(initialId);
  const d = list.find((x) => x.id === pick) ?? list[0];

  if (!d) {
    return (<><PageHeader title="เอกสารที่ไม่ครบ/ส่งกลับแก้ไข" /><p className="text-muted">ไม่มีรายการที่ต้องกรอกเอกสาร — สร้างรายการตราสารหนี้ก่อน</p></>);
  }
  const t = tpl(d.tp);
  return (
    <>
      <PageHeader title="เอกสารที่ไม่ครบ/ส่งกลับแก้ไข" subtitle="แนบไฟล์ zip / pdf ในแต่ละหัวข้อให้ครบ แล้วกดส่งให้ Document" />
      <div className="card !max-w-none">
        <select aria-label="เลือกรายการ" value={d.id} onChange={(e) => setPick(e.target.value)}>
          {list.map((x) => <option key={x.id} value={x.id}>{x.id} · {x.n}</option>)}
        </select>
        <p className="my-2.5 text-muted">
          <SymbolLink doc={d} /> · {d.kind} · อายุ {d.tenor} · Template: {t.n} v{t.v} · แนบแล้ว {got(d)}/{need(d)}{d.note ? ` · หมายเหตุ: ${d.note}` : ""}
        </p>
        <Progress value={got(d)} max={need(d)} />
      </div>
      <AttachmentTree items={t.items} files={d.up} onFile={(item, name) => setFile(d.id, item, name)} />
      <div className="mt-3.5 flex gap-2">
        <Button variant="outline" onClick={() => { toast("บันทึกร่างแล้ว"); router.push("/company/instruments"); }}>บันทึกร่าง</Button>
        <Button onClick={() => { sendDoc(d.id); toast("ส่งให้ Document แล้ว"); }}>ส่งให้ Document</Button>
      </div>
    </>
  );
}
