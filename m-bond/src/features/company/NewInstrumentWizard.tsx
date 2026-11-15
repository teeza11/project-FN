"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Field } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { AttachmentTree } from "@/components/shared/Checklist";
import { useStore } from "@/store/AppStore";
import { kindsOf, TENORS } from "@/lib/rules";
import { flatten } from "@/lib/tree";
import type { Sector } from "@/lib/types";

const defaultTemplate = (s: Sector) => (s === "government" ? "TPL-04" : "TPL-01");

/** สร้างรายการตราสารหนี้ 2 เฟส: 1 · ข้อมูลทั่วไป → 2 · ข้อมูลเทมเพลต (แนบเอกสาร) */
export function NewInstrumentWizard({ initialTemplate }: { initialTemplate?: string }) {
  const { me, templates, validate, createDoc } = useStore();
  const { toast } = useFeedback();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [sector, setSector] = useState<Sector>("private");
  const [kind, setKind] = useState("หุ้นกู้");
  const [tenorSpec, setTenorSpec] = useState("long|3 ปี");
  const [n, setN] = useState("");
  const [symbol, setSymbol] = useState("");
  const [tp, setTp] = useState(initialTemplate ?? "TPL-01");
  const [files, setFiles] = useState<Record<string, string>>({});

  const active = templates.filter((t) => t.on);
  const tpl = templates.find((t) => t.id === tp) ?? active[0];
  const attached = tpl ? flatten(tpl.items).filter((x) => files[x.id]).length : 0;

  const changeSector = (s: Sector) => {
    const k = kindsOf(s)[0];
    setSector(s); setKind(k); setTenorSpec(TENORS[k][0][0]);
    if (active.some((t) => t.id === defaultTemplate(s))) { setTp(defaultTemplate(s)); setFiles({}); }
  };
  const changeKind = (k: string) => { setKind(k); setTenorSpec(TENORS[k].find(([v]) => v === tenorSpec) ? tenorSpec : TENORS[k][0][0]); };

  const next = (e: FormEvent) => {
    e.preventDefault();
    const er = validate({ sector, kind, n, symbol, tenorSpec });
    if (er) return toast(er);
    setStep(2);
    window.scrollTo({ top: 0 });
  };

  const save = (submit: boolean) => {
    const r = createDoc({ sector, kind, n, symbol, tenorSpec, co: me!.co!, tp: tpl.id, up: files }, submit);
    if ("error" in r) { setStep(1); return toast(r.error); }
    toast(submit ? `สร้าง ${r.id} และส่งให้ Document แล้ว` : `บันทึกร่าง ${r.id} แล้ว`);
    router.push(submit ? "/company/tracking" : "/company/instruments");
  };

  return (
    <>
      <PageHeader title="สร้างรายการตราสารหนี้" subtitle="กรอก 1 · ข้อมูลทั่วไปให้ครบ แล้วระบบจะพาไป 2 · ข้อมูลเทมเพลตเพื่อแนบเอกสารต่อทันที ระบบตรวจคำเรียก รหัส และอายุตราสารให้สอดคล้องกับประเภทผู้ออก" />
      <ol className="mb-[18px] flex max-w-[760px] gap-2.5" aria-label="ขั้นตอน">
        {["1 · ข้อมูลทั่วไป", "2 · ข้อมูลเทมเพลต"].map((l, i) => (
          <li key={l} aria-current={step === i + 1 ? "step" : undefined}
            className={`flex-1 rounded-[10px] border px-3.5 py-2.5 font-semibold ${step === i + 1 ? "border-accent bg-[#0b3028]" : step > i + 1 ? "border-line text-accent" : "border-line text-muted"}`}>{l}</li>
        ))}
      </ol>

      {step === 1 ? (
        <form onSubmit={next} className="card max-w-[760px]">
          <Field label="ประเภทผู้ออก">
            <select value={sector} onChange={(e) => changeSector(e.target.value as Sector)}>
              <option value="private">ภาคเอกชน</option><option value="government">ภาครัฐบาล</option>
            </select>
          </Field>
          <Field label="คำเรียกตราสาร">
            <select value={kind} onChange={(e) => changeKind(e.target.value)}>{kindsOf(sector).map((k) => <option key={k}>{k}</option>)}</select>
          </Field>
          <Field label="อายุตราสาร">
            <select required value={tenorSpec} onChange={(e) => setTenorSpec(e.target.value)}>
              {TENORS[kind].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="ชื่อรายการตามมาตรฐาน"><input required value={n} placeholder="เช่น หุ้นกู้บริษัท A ครั้งที่ 1/2569" onChange={(e) => setN(e.target.value)} /></Field>
          <Field label="Symbol / รหัสตราสาร"><input required value={symbol} placeholder="เช่น PTT29NA หรือ LB346A" onChange={(e) => setSymbol(e.target.value)} /></Field>
          <Field label="บริษัทหรือหน่วยงานผู้ออก"><input readOnly required value={me?.co ?? ""} /></Field>
          <div className="mt-[18px] text-right"><Button type="submit">ถัดไป: ข้อมูลเทมเพลต →</Button></div>
        </form>
      ) : (
        <div className="card max-w-[760px]">
          <Field label="Template">
            <select value={tpl.id} onChange={(e) => { setTp(e.target.value); setFiles({}); }}>
              {active.map((t) => <option key={t.id} value={t.id}>{t.n}</option>)}
            </select>
          </Field>
          <p className="mb-2 text-muted">แนบแล้ว {attached}/{flatten(tpl.items).length}</p>
          <div className="mb-[18px]">
            <AttachmentTree items={tpl.items} files={files}
              onFile={(id, name) => setFiles((f) => { const c = { ...f }; if (name) c[id] = name; else delete c[id]; return c; })} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>← ย้อนกลับ</Button>
            <Button variant="outline" onClick={() => save(false)}>บันทึกร่าง</Button>
            <Button onClick={() => save(true)}>บันทึกและส่งให้ Document</Button>
          </div>
        </div>
      )}
    </>
  );
}
