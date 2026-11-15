import type { ReactNode } from "react";

export interface Column<T> { head: string; cell: (row: T, i: number) => ReactNode }

export function DataTable<T>({ columns, rows, empty = "ไม่มีรายการ" }: { columns: Column<T>[]; rows: T[]; empty?: string }) {
  return (
    <div className="table-wrap">
      <table className="w-full border-collapse">
        <thead>
          <tr>{columns.map((c, i) => <th key={i} className="whitespace-nowrap border-b border-line px-3.5 py-3 text-left text-xs font-semibold text-muted">{c.head}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {columns.map((c, j) => <td key={j} className="whitespace-nowrap px-3.5 py-3">{c.cell(r, i)}</td>)}
            </tr>
          )) : (
            <tr><td colSpan={columns.length} className="px-3.5 py-3 text-muted">{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
