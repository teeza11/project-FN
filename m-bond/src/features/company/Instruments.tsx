"use client";
import Link from "next/link";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { DocTable } from "@/components/shared/DocTable";
import { useStore } from "@/store/AppStore";
import { useMyDocs } from "./useMyDocs";

export function Instruments() {
  const mine = useMyDocs();
  const { renameDoc } = useStore();
  const { ask, toast } = useFeedback();
  const editable = (s: string) => s === "draft" || s === "returned";
  const rename = async (id: string, cur: string) => {
    const v = await ask({ title: "แก้ไขชื่อรายการ", initial: cur, required: true });
    if (v) { renameDoc(id, v); toast("บันทึกแล้ว"); }
  };
  return (
    <>
      <PageHeader title="บันทึกและแก้ไขข้อมูล" subtitle="รายการที่ถูกส่งกลับแก้ไขได้โดยใช้เอกสารและเทมเพลตเดิม" />
      <DocTable docs={mine} hideCompany extra={[
        { head: "หมายเหตุ", cell: (d) => d.note || "-" },
        { head: "", cell: (d) => (
          <span className="flex gap-1.5">
            <Button variant="outline" disabled={!editable(d.s)} onClick={() => rename(d.id, d.n)}>แก้ไข</Button>
            {editable(d.s)
              ? <Link className="rounded-lg border border-line px-3.5 py-2 hover:bg-line/60" href={`/company/fix?id=${d.id}`}>กรอกเอกสาร</Link>
              : <Button variant="outline" disabled>กรอกเอกสาร</Button>}
          </span>) },
      ]} />
    </>
  );
}
