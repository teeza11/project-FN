"use client";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { useFeedback } from "@/components/ui/Feedback";
import { DocTable } from "@/components/shared/DocTable";
import { useStore } from "@/store/AppStore";
import { useMyDocs } from "./useMyDocs";

export function SendDocs() {
  const mine = useMyDocs();
  const { sendDoc, incomplete } = useStore();
  const { toast } = useFeedback();
  return (
    <>
      <PageHeader title="ส่งเอกสารให้ Document" subtitle="Document จะตรวจความครบถ้วนตาม Template ก่อนส่งต่อ Reviewer" />
      <DocTable docs={mine.filter((d) => d.s === "draft" || d.s === "returned")} hideCompany extra={[{
        head: "", cell: (d) => (
          <Button onClick={() => { sendDoc(d.id); toast("ส่งให้ Document แล้ว"); }}>
            {incomplete(d) ? "ส่งให้ Document (ยังไม่ครบ)" : "ส่งให้ Document"}
          </Button>),
      }]} />
    </>
  );
}
