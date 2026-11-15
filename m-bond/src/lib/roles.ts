import type { Role } from "./types";

export interface NavItem { href: string; label: string }
export interface RoleConfig { id: Role; name: string; desc: string; base: string; nav: NavItem[] }

/** เมนูและเส้นทางของแต่ละ Role — โฟลเดอร์ใน src/app/<base> ต้องตรงกับค่า base */
export const ROLES: Record<Role, RoleConfig> = {
  admin: {
    id: "admin", name: "admin", desc: "ผู้ดูแลระบบ", base: "/admin",
    nav: [
      { href: "/admin", label: "หน้าหลัก" },
      { href: "/admin/users", label: "จัดการผู้ใช้งาน" },
      { href: "/admin/published", label: "เอกสารที่เผยแพร่แล้ว" },
      { href: "/admin/logs", label: "ตรวจสอบประวัติการใช้งาน" },
    ],
  },
  document: {
    id: "document", name: "document", desc: "ผู้ดูแลเอกสาร", base: "/document",
    nav: [
      { href: "/document", label: "หน้าหลัก" },
      { href: "/document/inbox", label: "ตรวจเอกสารที่ได้รับ" },
      { href: "/document/tracking", label: "ติดตามสถานะเอกสาร" },
    ],
  },
  reviewer: {
    id: "reviewer", name: "reviewer", desc: "ผู้ตรวจสอบ / ผู้เผยแพร่ / ผู้จัดการ Template", base: "/reviewer",
    nav: [
      { href: "/reviewer", label: "หน้าหลัก" },
      { href: "/reviewer/templates/new", label: "สร้าง Template" },
      { href: "/reviewer/templates", label: "แก้ไข Template" },
      { href: "/reviewer/templates/format", label: "จัดการรูปแบบเอกสาร" },
      { href: "/reviewer/templates/versions", label: "จัดการเวอร์ชัน Template" },
      { href: "/reviewer/review/data", label: "ตรวจสอบข้อมูลตราสารหนี้" },
      { href: "/reviewer/review/attachments", label: "ตรวจสอบเอกสารแนบ" },
      { href: "/reviewer/review/return", label: "ส่งกลับเพื่อแก้ไข" },
      { href: "/reviewer/review/approval", label: "อนุมัติหรือปฏิเสธเอกสาร" },
      { href: "/reviewer/publish", label: "เผยแพร่เอกสารฉบับปัจจุบัน" },
      { href: "/reviewer/logs", label: "ดูประวัติการดำเนินการ" },
    ],
  },
  company: {
    id: "company", name: "user", desc: "บริษัทผู้เสนอตราสารหนี้", base: "/company",
    nav: [
      { href: "/company", label: "หน้าหลัก" },
      { href: "/company/templates", label: "เทมเพลตเอกสาร" },
      { href: "/company/new", label: "สร้างรายการตราสารหนี้" },
      { href: "/company/instruments", label: "บันทึกและแก้ไขข้อมูล" },
      { href: "/company/fix", label: "เอกสารที่ไม่ครบ/ส่งกลับแก้ไข" },
      { href: "/company/send", label: "ส่งเอกสารให้ Document" },
      { href: "/company/tracking", label: "ตรวจสอบความคืบหน้า" },
      { href: "/company/history", label: "ประวัติการยื่น" },
    ],
  },
};
