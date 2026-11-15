export type Role = "admin" | "document" | "reviewer" | "company";

export type DocStatus =
  | "draft" | "submitted" | "pending" | "approving" | "approved"
  | "published" | "returned" | "rejected" | "cancelled";

export type Sector = "private" | "government";
export type TermGroup = "short" | "long";

/** หัวข้อ / หัวข้อย่อยของ Template (ซ้อนได้หลายชั้น) */
export interface OutlineNode { id: string; t: string; c: OutlineNode[] }

export interface TemplateVersion {
  v: number; n: string; items: OutlineNode[]; date: string; note: string;
}
export interface Template {
  id: string; n: string; items: OutlineNode[];
  on: boolean; v: number; upd: boolean; verDate: string; note?: string;
  hist: TemplateVersion[];
}

export interface BondDoc {
  id: string; n: string; co: string; tp: string; s: DocStatus;
  /** itemId -> ชื่อไฟล์ที่แนบ */
  up: Record<string, string>;
  v: number; a: number; note: string; date: string;
  sector: Sector; kind: string; symbol: string; tenor: string; termGroup: TermGroup;
}

export interface AppUser {
  n: string; email: string; r: Role; co?: string; on: boolean; added?: boolean;
}
export interface Invite { email: string; rep: string; co: string; t: string }
export interface LogEntry { t: string; u: string; a: string; c: "doc" | "tpl" | "sys" }
export interface DeletedDoc { t: string; u: string; id: string; n: string; reason: string }
