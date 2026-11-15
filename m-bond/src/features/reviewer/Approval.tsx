"use client";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { DocTable } from "@/components/shared/DocTable";
import { useStore } from "@/store/AppStore";

export function Approval() {
  const { docs, approveDoc, rejectDoc } = useStore();
  const { ask, toast } = useFeedback();
  const reject = async (id: string) => {
    const r = await ask({ title: "เหตุผลที่ปฏิเสธ", multiline: true, required: true });
    if (r) { rejectDoc(id, r); toast("ปฏิเสธแล้ว"); }
  };
  return (
    <>
      <PageHeader title="อนุมัติหรือปฏิเสธเอกสาร" />
      <DocTable docs={docs.filter((d) => d.s === "approving")} extra={[{
        head: "", cell: (d) => (
          <span className="flex gap-1.5">
            <Button onClick={() => { approveDoc(d.id); toast("อนุมัติแล้ว"); }}>อนุมัติ</Button>
            <Button variant="danger" onClick={() => reject(d.id)}>ปฏิเสธ</Button>
          </span>),
      }]} />
    </>
  );
}
