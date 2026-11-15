"use client";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { useFeedback } from "@/components/ui/Feedback";
import { useStore } from "@/store/AppStore";

export function PublishDocs() {
  const { docs, publishDoc } = useStore();
  const { toast } = useFeedback();
  return (
    <>
      <PageHeader title="เผยแพร่เอกสารฉบับปัจจุบัน" subtitle="Version เดิมจะถูกเก็บเป็น Archive" />
      <DataTable
        columns={[
          { head: "รหัส", cell: (d) => d.id }, { head: "ชื่อ", cell: (d) => d.n },
          { head: "สถานะ", cell: (d) => <StatusBadge s={d.s} /> }, { head: "Current", cell: (d) => `v${d.v}` },
          { head: "Archive", cell: (d) => d.a },
          { head: "", cell: (d) => d.s === "approved" ? <Button onClick={() => { publishDoc(d.id); toast("เผยแพร่แล้ว"); }}>เผยแพร่</Button> : "-" },
        ]}
        rows={docs.filter((d) => d.s === "approved" || d.s === "published")}
      />
    </>
  );
}
