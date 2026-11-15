"use client";
import { useStore } from "@/store/AppStore";
import type { BondDoc } from "@/lib/types";

/** Symbol ที่กดแล้วเปิดรายละเอียดตราสารหนี้ — ใช้ได้ทุกตาราง */
export function SymbolLink({ doc }: { doc: Pick<BondDoc, "id" | "symbol"> }) {
  const { openDetail } = useStore();
  return (
    <button type="button" title="ดูรายละเอียดตราสารหนี้" onClick={() => openDetail(doc.id)}
      className="font-semibold text-accent underline underline-offset-4 hover:text-white">
      {doc.symbol || "-"}
    </button>
  );
}
