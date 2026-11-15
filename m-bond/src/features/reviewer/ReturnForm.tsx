"use client";
import { useState, type FormEvent } from "react";
import { PageHeader, Field } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { useStore } from "@/store/AppStore";

export function ReturnForm() {
  const { docs, returnDoc } = useStore();
  const { toast } = useFeedback();
  const options = docs.filter((d) => d.s === "pending" || d.s === "approving");
  const [id, setId] = useState("");
  const [reason, setReason] = useState("");
  const current = options.some((d) => d.id === id) ? id : options[0]?.id ?? "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!current) return toast("ไม่มีเอกสาร");
    returnDoc(current, reason.trim());
    toast("ส่งกลับแล้ว");
    setReason("");
  };
  return (
    <>
      <PageHeader title="ส่งกลับเพื่อแก้ไข" subtitle="ต้องระบุเหตุผลทุกครั้ง" />
      <form onSubmit={submit} className="card max-w-[760px]">
        <Field label="เอกสาร">
          <select value={current} onChange={(e) => setId(e.target.value)}>
            {options.map((d) => <option key={d.id} value={d.id}>{d.id} {d.n}</option>)}
          </select>
        </Field>
        <Field label="เหตุผล"><textarea rows={4} required value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
        <Button type="submit" variant="danger" disabled={!current}>ส่งกลับ</Button>
      </form>
    </>
  );
}
