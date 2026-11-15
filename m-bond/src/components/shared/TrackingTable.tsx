"use client";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { SymbolLink } from "./SymbolLink";
import { FLOW } from "@/lib/status";
import type { BondDoc } from "@/lib/types";

export function TrackingTable({ docs }: { docs: BondDoc[] }) {
  return (
    <DataTable
      columns={[
        { head: "รหัส", cell: (d) => d.id },
        { head: "Symbol", cell: (d) => <SymbolLink doc={d} /> },
        { head: "ชื่อ", cell: (d) => d.n },
        { head: "คำเรียก", cell: (d) => d.kind },
        { head: "อายุตราสาร", cell: (d) => d.tenor },
        { head: "สถานะ", cell: (d) => <StatusBadge s={d.s} /> },
        {
          head: "ความคืบหน้า",
          cell: (d) => {
            const at = FLOW.indexOf(d.s);
            return (
              <span className="flex gap-1" aria-label={`ขั้นที่ ${at + 1} จาก ${FLOW.length}`}>
                {FLOW.map((f, j) => <i key={f} className={`h-1.5 w-6 rounded ${j <= at ? "bg-accent" : "bg-line"}`} />)}
              </span>
            );
          },
        },
        { head: "หมายเหตุ", cell: (d) => d.note || "-" },
      ]}
      rows={docs}
    />
  );
}
