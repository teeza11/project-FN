"use client";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { SymbolLink } from "./SymbolLink";
import { useStore } from "@/store/AppStore";
import { issuerLabel } from "@/lib/rules";
import type { BondDoc } from "@/lib/types";

/** ตารางรายการตราสารหนี้มาตรฐาน — ต่อคอลัมน์เพิ่มได้ด้วย extra */
export function DocTable({ docs, extra = [], hideCompany = false }: { docs: BondDoc[]; extra?: Column<BondDoc>[]; hideCompany?: boolean }) {
  const { got, need } = useStore();
  const cols: Column<BondDoc>[] = [
    { head: "รหัส", cell: (d) => d.id },
    { head: "Symbol", cell: (d) => <SymbolLink doc={d} /> },
    { head: "ชื่อรายการ", cell: (d) => d.n },
    { head: "ผู้ออก", cell: (d) => (hideCompany ? issuerLabel(d) : d.co) },
    { head: "คำเรียก", cell: (d) => d.kind },
    { head: "อายุตราสาร", cell: (d) => d.tenor },
    { head: "สถานะ", cell: (d) => <StatusBadge s={d.s} /> },
    { head: "เอกสาร", cell: (d) => `${got(d)}/${need(d)}` },
    ...extra,
  ];
  return <DataTable columns={cols} rows={docs} />;
}
