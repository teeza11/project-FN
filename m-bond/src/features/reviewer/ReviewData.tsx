"use client";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { DocTable } from "@/components/shared/DocTable";
import { useStore } from "@/store/AppStore";

export function ReviewData() {
  const { docs, passDoc, returnDoc } = useStore();
  const { ask, toast } = useFeedback();
  const giveBack = async (id: string) => {
    const r = await ask({ title: "เหตุผลที่ส่งกลับ", multiline: true, required: true });
    if (r) { returnDoc(id, r); toast("ส่งกลับแล้ว"); }
  };
  return (
    <>
      <PageHeader title="ตรวจสอบข้อมูลตราสารหนี้" subtitle="ตรวจผ่านเพื่อส่งอนุมัติ หรือส่งกลับพร้อมเหตุผล" />
      <DocTable docs={docs.filter((d) => d.s === "pending")} extra={[{
        head: "", cell: (d) => (
          <span className="flex gap-1.5">
            <Button onClick={() => { passDoc(d.id); toast("ส่งต่อให้อนุมัติ"); }}>ตรวจผ่าน</Button>
            <Button variant="outline" onClick={() => giveBack(d.id)}>ส่งกลับ</Button>
          </span>),
      }]} />
    </>
  );
}
