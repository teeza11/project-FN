import { DataTable } from "@/components/ui/DataTable";
import type { LogEntry } from "@/lib/types";

export function LogTableRaw({ logs }: { logs: LogEntry[] }) {
  return (
    <DataTable
      empty="ยังไม่มีประวัติ"
      columns={[
        { head: "วันที่และเวลา", cell: (l) => l.t },
        { head: "ผู้ใช้", cell: (l) => l.u },
        { head: "รายการ", cell: (l) => l.a },
      ]}
      rows={logs}
    />
  );
}
