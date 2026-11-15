"use client";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Progress } from "@/components/ui/Layout";
import { useFeedback } from "@/components/ui/Feedback";
import { SymbolLink } from "@/components/shared/SymbolLink";
import { useStore } from "@/store/AppStore";

/** เอกสารที่บริษัทส่งมา รอ Document ตรวจความครบถ้วนตาม Template */
export function ReceivedTable() {
  const { docs, tpl, need, got, incomplete, missing, forwardDoc, returnDoc, cancelDoc } = useStore();
  const { ask, toast } = useFeedback();

  const forward = (id: string) => {
    const er = forwardDoc(id);
    toast(er ?? "ส่งต่อให้ Reviewer แล้ว");
  };
  const giveBack = async (id: string) => {
    const r = await ask({ title: "เหตุผลที่ส่งกลับให้บริษัทแก้ไข", multiline: true, required: true });
    if (r) { returnDoc(id, r, "Document"); toast("ส่งกลับแล้ว"); }
  };
  const cancel = async (id: string) => {
    const r = await ask({ title: "เหตุผลที่ยกเลิกรายการ", multiline: true, required: true });
    if (r) { cancelDoc(id, r); toast("ยกเลิกแล้ว"); }
  };

  return (
    <DataTable
      columns={[
        { head: "รหัส", cell: (d) => d.id }, { head: "บริษัท", cell: (d) => d.co },
        { head: "Symbol", cell: (d) => <SymbolLink doc={d} /> }, { head: "ชื่อรายการ", cell: (d) => d.n },
        { head: "Template", cell: (d) => `${tpl(d.tp).n} (${need(d)} เอกสาร)` },
        { head: "ได้รับ", cell: (d) => (<><Progress value={got(d)} max={need(d)} />{got(d)}/{need(d)}</>) },
        { head: "ขาด", cell: (d) => missing(d).join(", ") || "ครบแล้ว" },
        { head: "จัดการ", cell: (d) => (
          <span className="flex gap-1.5">
            <Button disabled={incomplete(d)} onClick={() => forward(d.id)}>ส่งต่อ Reviewer</Button>
            <Button variant="outline" onClick={() => giveBack(d.id)}>ส่งกลับแก้ไข</Button>
            <Button variant="danger" onClick={() => cancel(d.id)}>ยกเลิก</Button>
          </span>) },
      ]}
      rows={docs.filter((d) => d.s === "submitted")}
    />
  );
}
