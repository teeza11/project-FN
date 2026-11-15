import type { AppUser, BondDoc, DeletedDoc, DocStatus, Invite, LogEntry, Template } from "@/lib/types";
import { cloneTree, flatten, node } from "@/lib/tree";
import { todayAt } from "@/lib/format";

export const COMPANIES = ["บริษัท xxx จำกัด", "บริษัท yyy จำกัด"];

const tplPrivate = (): Template => {
  const items = [
    node("หนังสือชี้ชวน", [node("ฉบับร่างหนังสือชี้ชวน"), node("เอกสารสรุปข้อมูลสำคัญ (Fact Sheet)")]),
    node("งบการเงิน", [node("งบการเงินรายปีล่าสุด"), node("งบการเงินไตรมาสล่าสุด")]),
    node("หนังสือรับรอง", [node("หนังสือรับรองนิติบุคคล"), node("รายชื่อกรรมการและผู้ถือหุ้น")]),
    node("มติที่ประชุม", [node("มติที่ประชุมคณะกรรมการ"), node("มติที่ประชุมผู้ถือหุ้น")]),
    node("สัญญา", [node("ข้อกำหนดสิทธิ"), node("สัญญาแต่งตั้งผู้แทนผู้ถือหุ้นกู้")]),
  ];
  return {
    id: "TPL-01", n: "Template หุ้นกู้เอกชน", items, on: true, v: 2, upd: false, verDate: "2026-02-01",
    // ข้อมูลตัวอย่าง: Version 1 มีหัวข้อน้อยกว่าปัจจุบัน 1 หัวข้อ
    hist: [{ v: 1, n: "Template หุ้นกู้เอกชน", items: cloneTree(items).slice(0, -1), date: "2026-02-01", note: "Version แรก" }],
  };
};

const tplGov = (): Template => ({
  id: "TPL-04", n: "Template พันธบัตรรัฐบาล", on: true, v: 1, upd: false, verDate: "2026-02-01", hist: [],
  items: [
    node("ประกาศกระทรวงการคลัง", [node("ประกาศการออกพันธบัตร")]),
    node("หนังสือชี้ชวน", [node("หนังสือชี้ชวนฉบับหลัก"), node("ภาคผนวก")]),
    node("ผลการประมูล", [node("รายงานผลการประมูล")]),
    node("ข้อมูล ISIN", [node("หนังสือขอรหัส ISIN")]),
  ],
});

export const seedTemplates = (): Template[] => [tplPrivate(), tplGov()];

type Meta = Partial<BondDoc>;
const mk = (
  tpls: Template[], id: string, n: string, tp: string, s: DocStatus, filled: number,
  v = 1, a = 0, note = "", date = "", meta: Meta = {},
): BondDoc => {
  const t = tpls.find((x) => x.id === tp)!;
  const up: Record<string, string> = {};
  flatten(t.items.slice(0, filled)).forEach((it) => { up[it.id] = `${it.t}.pdf`; });
  return {
    id, n, co: COMPANIES[0], tp, s, up, v, a, note, date,
    sector: "private", kind: "หุ้นกู้", symbol: "", tenor: "3 ปี", termGroup: "long", ...meta,
  };
};

export const seedDocs = (t: Template[]): BondDoc[] => {
  const y = COMPANIES[1];
  const gov = { sector: "government" as const };
  return [
    mk(t, "DB-001", "หุ้นกู้บริษัท xxx ครั้งที่ 1/2569", "TPL-01", "draft", 3, 1, 0, "", "", { symbol: "XXX29AA", tenor: "270 วัน", termGroup: "short" }),
    mk(t, "DB-002", "หุ้นกู้บริษัท xxx ครั้งที่ 2/2569", "TPL-01", "pending", 5, 1, 0, "", "", { symbol: "XXX29AB", tenor: "5 ปี" }),
    mk(t, "DB-003", "หุ้นกู้บริษัท xxx ครั้งที่ 3/2569", "TPL-01", "approving", 5, 1, 0, "", "", { symbol: "XXX30AA", tenor: "7 ปี" }),
    mk(t, "DB-004", "หุ้นกู้บริษัท xxx ครั้งที่ 4/2569", "TPL-01", "returned", 4, 1, 0, "ขาดมติที่ประชุม", "", { symbol: "XXX30AB", tenor: "10 ปี" }),
    mk(t, "DB-005", "หุ้นกู้บริษัท xxx ครั้งที่ 5/2569", "TPL-01", "approved", 5, 1, 0, "", "", { symbol: "XXX31AA", tenor: "15 ปี" }),
    mk(t, "DB-006", "หุ้นกู้บริษัท xxx ครั้งที่ 6/2568", "TPL-01", "published", 5, 2, 1, "", "2025-12-18", { symbol: "XXX28DA", tenor: "5 ปี" }),
    mk(t, "DB-007", "หุ้นกู้บริษัท xxx ครั้งที่ 7/2569", "TPL-01", "submitted", 5, 1, 0, "", "", { symbol: "XXX31AB", tenor: "5 ปี" }),
    mk(t, "DB-008", "หุ้นกู้บริษัท xxx ครั้งที่ 8/2569", "TPL-01", "submitted", 3, 1, 0, "", "", { symbol: "XXX32AA", tenor: "3 ปี" }),
    mk(t, "DB-009", "หุ้นกู้บริษัท xxx ครั้งที่ 9/2569", "TPL-01", "cancelled", 4, 1, 0, "เอกสารไม่ถูกต้อง ต้องยื่นใหม่ทั้งฉบับ", "", { symbol: "XXX32AB", tenor: "7 ปี" }),
    mk(t, "DB-010", "หุ้นกู้บริษัท yyy ครั้งที่ 1/2569", "TPL-01", "submitted", 5, 1, 0, "", "", { co: y, symbol: "YYY29AA", tenor: "3 ปี" }),
    mk(t, "DB-011", "หุ้นกู้บริษัท yyy ครั้งที่ 2/2568", "TPL-01", "published", 5, 1, 0, "", "2026-01-15", { co: y, symbol: "YYY28AA", tenor: "5 ปี" }),
    mk(t, "GB-001", "พันธบัตรรัฐบาล รุ่น LB346A", "TPL-04", "published", 4, 1, 0, "", "2026-02-20", { ...gov, co: "กระทรวงการคลัง", kind: "พันธบัตรรัฐบาล", symbol: "LB346A", tenor: "10 ปี" }),
    mk(t, "SE-001", "พันธบัตรรัฐวิสาหกิจ การไฟฟ้าส่วนภูมิภาค", "TPL-04", "published", 4, 1, 0, "", "2026-02-25", { ...gov, co: "การไฟฟ้าส่วนภูมิภาค", kind: "พันธบัตรรัฐวิสาหกิจ", symbol: "PEA31NA", tenor: "5 ปี" }),
    mk(t, "TB-001", "ตั๋วเงินคลัง รุ่นที่ 1/2569", "TPL-04", "published", 4, 1, 0, "", "2026-03-01", { ...gov, co: "กระทรวงการคลัง", kind: "ตั๋วเงินคลัง", symbol: "B26M1", tenor: "6 เดือน", termGroup: "short" }),
  ];
};

/** บัญชีทดลอง: ชื่อผู้ใช้ (email) เป็นชื่อ Role และรหัสผ่านทุกบัญชีคือ "pass" */
export const seedUsers = (): AppUser[] => [
  { n: "สมชาย ใจดี", email: "admin", r: "admin", on: true },
  { n: "สุดา รักงาน", email: "reviewer", r: "reviewer", on: true },
  { n: "ธนา มั่นคง", email: "document", r: "document", on: true },
  { n: "ปรีชา เจ้าของกิจการ", email: "company", r: "company", co: COMPANIES[0], on: true },
  { n: "มานี ตัวแทน yyy", email: "company2", r: "company", co: COMPANIES[1], on: true },
  { n: "วิภา ตรวจดี", email: "reviewer2", r: "reviewer", on: true },
  { n: "อนุชา ใหม่", email: "document2", r: "document", on: false },
];

export const seedInvites = (): Invite[] => [
  { email: "somchai@xxx.co.th", rep: "สมชาย ผู้แทน xxx", co: COMPANIES[0], t: todayAt(8, 30) },
];

export const seedLogs = (): LogEntry[] => [
  { t: todayAt(10, 5), u: "วิภา ตรวจดี", a: "ส่งกลับ DB-004: ขาดมติที่ประชุม", c: "doc" },
  { t: todayAt(9, 40), u: "สุดา รักงาน", a: "ออก Version ใหม่ TPL-01", c: "tpl" },
  { t: todayAt(9, 12), u: "ธนา มั่นคง", a: "ส่งตรวจ DB-002", c: "doc" },
  { t: "18 ธ.ค. 2568 16:40", u: "วิภา ตรวจดี", a: "เผยแพร่ DB-006 v2", c: "doc" },
];

export const seedDeleted = (): DeletedDoc[] => [];
