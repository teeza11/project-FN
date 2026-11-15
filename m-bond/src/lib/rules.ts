import type { BondDoc, Sector } from "./types";

export const GOV_KINDS = ["พันธบัตรรัฐบาล", "พันธบัตรรัฐวิสาหกิจ", "ตั๋วเงินคลัง"] as const;
export const kindsOf = (s: Sector): string[] => (s === "government" ? [...GOV_KINDS] : ["หุ้นกู้"]);

/** ตัวเลือกอายุตราสารตามคำเรียก: [ "กลุ่ม|อายุ", ป้ายแสดง ] */
export const TENORS: Record<string, [string, string][]> = {
  หุ้นกู้: [
    ["short|90 วัน", "ระยะสั้น · 90 วัน"], ["short|180 วัน", "ระยะสั้น · 180 วัน"], ["short|270 วัน", "ระยะสั้น · 270 วัน"],
    ["long|1 ปี", "ระยะยาว · 1 ปี"], ["long|3 ปี", "ระยะยาว · 3 ปี"], ["long|5 ปี", "ระยะยาว · 5 ปี"],
    ["long|7 ปี", "ระยะยาว · 7 ปี"], ["long|10 ปี", "ระยะยาว · 10 ปี"], ["long|15 ปี", "ระยะยาว · 15 ปี"],
  ],
  พันธบัตรรัฐบาล: ["1", "3", "5", "7", "10", "20", "30", "50"].map((y) => [`long|${y} ปี`, `${y} ปี`] as [string, string]),
  พันธบัตรรัฐวิสาหกิจ: ["1", "3", "5", "7"].map((y) => [`long|${y} ปี`, `${y} ปี`] as [string, string]),
  ตั๋วเงินคลัง: [
    ["short|14 วัน", "14 วัน"], ["short|1 เดือน", "1 เดือน"], ["short|3 เดือน", "3 เดือน"],
    ["short|6 เดือน", "6 เดือน"], ["short|1 ปี", "1 ปี"],
  ],
};

export interface InstrumentForm {
  sector: Sector; kind: string; n: string; symbol: string; tenorSpec: string;
}

/** ตรวจกฎของข้อมูลทั่วไป — คืนข้อความผิดพลาด หรือ "" ถ้าผ่าน */
export function validateInstrument(f: InstrumentForm, docs: BondDoc[]): string {
  const n = f.n.trim();
  const symbol = f.symbol.trim().toUpperCase();
  const group = f.tenorSpec.split("|")[0];
  if (f.sector === "private" && f.kind !== "หุ้นกู้") return "ตราสารภาคเอกชนต้องใช้คำเรียก “หุ้นกู้”";
  if (f.sector === "government" && !(GOV_KINDS as readonly string[]).includes(f.kind)) return "กรุณาเลือกคำเรียกตราสารภาครัฐให้ถูกต้อง";
  if (f.sector === "private" && !n.includes("หุ้นกู้")) return "ชื่อเอกชนต้องมีคำว่า “หุ้นกู้”";
  if (f.sector === "government" && !/(พันธบัตร|ตั๋วเงิน)/.test(n)) return "ชื่อภาครัฐต้องมีคำว่า “พันธบัตร” หรือ “ตั๋วเงิน”";
  if (f.kind === "ตั๋วเงินคลัง" && group !== "short") return "ตั๋วเงินคลังต้องมีอายุไม่เกิน 1 ปี";
  if (["พันธบัตรรัฐบาล", "พันธบัตรรัฐวิสาหกิจ"].includes(f.kind) && group !== "long") return "พันธบัตรต้องมีอายุตั้งแต่ 1 ปีขึ้นไป";
  if (docs.some((d) => d.symbol.toUpperCase() === symbol && !["cancelled", "rejected"].includes(d.s))) return "Symbol นี้มีในระบบแล้ว";
  return "";
}

export const issuerLabel = (d: Pick<BondDoc, "sector">) => (d.sector === "government" ? "ภาครัฐบาล" : "ภาคเอกชน");
