import type { DocStatus } from "./types";

export const STATUS: Record<DocStatus, { label: string; color: string }> = {
  draft: { label: "ร่าง", color: "#8FAAA4" },
  pending: { label: "รอตรวจสอบ", color: "#FBBF24" },
  approving: { label: "รออนุมัติ", color: "#60A5FA" },
  returned: { label: "ส่งกลับแก้ไข", color: "#F87171" },
  approved: { label: "รอเผยแพร่", color: "#A78BFA" },
  published: { label: "เผยแพร่แล้ว", color: "#2FE6A6" },
  rejected: { label: "ปฏิเสธ", color: "#F87171" },
  submitted: { label: "รอ Document ตรวจ", color: "#38BDF8" },
  cancelled: { label: "ยกเลิก", color: "#94A3B8" },
};

export const FLOW: DocStatus[] = ["draft", "submitted", "pending", "approving", "approved", "published"];
