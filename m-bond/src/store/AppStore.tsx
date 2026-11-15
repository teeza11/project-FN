"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  AppUser, BondDoc, DeletedDoc, Invite, LogEntry, OutlineNode, Role, Sector, Template,
} from "@/lib/types";
import { cloneTree, flatten } from "@/lib/tree";
import { fmtDT, isoDate } from "@/lib/format";
import { validateInstrument } from "@/lib/rules";
import { seedDeleted, seedDocs, seedInvites, seedLogs, seedTemplates, seedUsers, COMPANIES } from "@/data/seed";

/* ───────── ข้อมูลทั้งหมดของระบบ (ตัวอย่างในหน่วยความจำ) ───────── */
interface DB {
  docs: BondDoc[]; templates: Template[]; users: AppUser[];
  invites: Invite[]; logs: LogEntry[]; deleted: DeletedDoc[]; companies: string[];
}
type Logger = (a: string, c?: LogEntry["c"]) => void;

export interface NewInstrument {
  sector: Sector; kind: string; n: string; symbol: string; tenorSpec: string;
  co: string; tp: string; up: Record<string, string>;
}

interface Store extends DB {
  ready: boolean;
  me: AppUser | null;
  /* auth */
  login: (email: string, pw: string, remember: boolean) => string | null;
  logout: () => void;
  /* ค้นหา / ป๊อปอัพรายละเอียดตราสาร */
  query: string; setQuery: (q: string) => void;
  detailId: string | null; openDetail: (id: string | null) => void;
  /* helpers */
  tpl: (id: string) => Template;
  need: (d: BondDoc) => number;
  got: (d: BondDoc) => number;
  incomplete: (d: BondDoc) => boolean;
  missing: (d: BondDoc) => string[];
  companyDocs: (co: string) => BondDoc[];
  /* เอกสาร */
  createDoc: (f: NewInstrument, submit: boolean) => { id: string } | { error: string };
  validate: (f: Omit<NewInstrument, "co" | "tp" | "up">) => string;
  renameDoc: (id: string, name: string) => void;
  setFile: (id: string, itemId: string, file: string | null) => void;
  sendDoc: (id: string) => void;
  forwardDoc: (id: string) => string | null;
  returnDoc: (id: string, reason: string, by?: string) => void;
  cancelDoc: (id: string, reason: string) => void;
  passDoc: (id: string) => void;
  approveDoc: (id: string) => void;
  rejectDoc: (id: string, reason: string) => void;
  publishDoc: (id: string) => void;
  resubmit: (id: string) => string;
  removePublished: (id: string, reason: string) => void;
  /* Template */
  createTemplate: (name: string, items: OutlineNode[]) => string;
  renameTemplate: (id: string, name: string) => void;
  toggleTemplate: (id: string) => void;
  toggleUpdate: (id: string) => void;
  setTemplateItems: (id: string, items: OutlineNode[], what: string) => void;
  issueVersion: (id: string, v: { name: string; items: OutlineNode[]; note: string }) => string | null;
  /* ผู้ใช้ */
  addStaff: (u: { n: string; email: string; r: Exclude<Role, "company"> }) => string | null;
  invite: (i: { email: string; rep: string; co: string }) => string | null;
  resendInvite: (email: string) => void;
  revokeInvite: (email: string) => void;
  acceptInvite: (email: string) => void;
  setUserRole: (email: string, r: Exclude<Role, "company">) => void;
  toggleUser: (email: string) => void;
}

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore ต้องอยู่ใน <AppStoreProvider>");
  return c;
};

const LS_USERS = "tb_users";
const LS_SESSION = "tb_session";
const PASSWORD = "pass"; // รหัสผ่านทดลองของทุกบัญชี — ต้องเปลี่ยนเป็นระบบยืนยันตัวตนจริงก่อนใช้งานจริง

const initDB = (): DB => {
  const templates = seedTemplates();
  return {
    docs: seedDocs(templates), templates, users: seedUsers(), invites: seedInvites(),
    logs: seedLogs(), deleted: seedDeleted(), companies: [...COMPANIES],
  };
};

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(initDB);
  const [me, setMe] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [detailId, openDetail] = useState<string | null>(null);

  const dbRef = useRef(db); dbRef.current = db;
  const meRef = useRef(me); meRef.current = me;

  /* โหลดผู้ใช้ที่ admin เพิ่ม (localStorage) และ session ที่จดจำไว้ */
  useEffect(() => {
    try {
      const saved: AppUser[] = JSON.parse(localStorage.getItem(LS_USERS) ?? "[]");
      setDb((p) => {
        const users = [...p.users];
        const companies = [...p.companies];
        saved.forEach((x) => {
          if (x?.email && !users.some((u) => u.email.toLowerCase() === x.email.toLowerCase())) users.push(x);
          if (x?.co && !companies.includes(x.co)) companies.push(x.co);
        });
        return { ...p, users, companies };
      });
      const se = localStorage.getItem(LS_SESSION);
      if (se) {
        const u = (JSON.parse(localStorage.getItem(LS_USERS) ?? "[]") as AppUser[]).concat(seedUsers())
          .find((x) => x.email.toLowerCase() === se);
        if (u?.on) setMe(u);
      }
    } catch { /* localStorage ใช้ไม่ได้ — ข้าม */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(LS_USERS, JSON.stringify(db.users.filter((u) => u.added))); } catch { /* ignore */ }
  }, [db.users, ready]);

  /** แก้ข้อมูลบนสำเนา แล้วเขียน log ด้วยชื่อผู้ใช้ปัจจุบัน */
  const mutate = useCallback((fn: (d: DB, log: Logger) => void) => {
    setDb((prev) => {
      const d = structuredClone(prev);
      const log: Logger = (a, c = "doc") => d.logs.unshift({ t: fmtDT(), u: meRef.current?.n ?? "ระบบ", a, c });
      fn(d, log);
      return d;
    });
  }, []);

  const tpl = useCallback((id: string) => dbRef.current.templates.find((t) => t.id === id)!, []);
  const need = useCallback((d: BondDoc) => flatten(tpl(d.tp).items).length, [tpl]);
  const got = useCallback((d: BondDoc) => {
    const ok = new Set(flatten(tpl(d.tp).items).map((n) => n.id));
    return Object.keys(d.up).filter((k) => ok.has(k)).length;
  }, [tpl]);
  const incomplete = useCallback((d: BondDoc) => got(d) < need(d), [got, need]);
  const missing = useCallback((d: BondDoc) => {
    const out: string[] = [];
    const walk = (a: OutlineNode[], pre = "") => a.forEach((n, i) => {
      const no = `${pre}${i + 1}`;
      if (!n.c.length && !d.up[n.id]) out.push(`${no} ${n.t}`);
      walk(n.c, `${no}.`);
    });
    walk(tpl(d.tp).items);
    return out;
  }, [tpl]);
  const companyDocs = useCallback((co: string) => dbRef.current.docs.filter((d) => d.co === co), []);

  const store: Store = useMemo(() => {
    /** ผู้ใช้บริษัทแก้ได้เฉพาะเอกสารของบริษัทตัวเอง */
    const setDoc = (d: DB, id: string, fn: (x: BondDoc) => void) => {
      const x = d.docs.find((y) => y.id === id);
      const u = meRef.current;
      if (x && !(u?.r === "company" && x.co !== u.co)) fn(x);
    };
    const T = (d: DB, id: string) => d.templates.find((t) => t.id === id)!;

    return {
      ...db, ready, me, query, setQuery, detailId, openDetail,
      tpl, need, got, incomplete, missing, companyDocs,

      login(email, pw, remember) {
        const em = email.trim().toLowerCase();
        const u = dbRef.current.users.find((x) => x.email.toLowerCase() === em);
        if (!u || pw !== PASSWORD) return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        if (!u.on) return "บัญชีนี้ถูกปิดใช้งาน กรุณาติดต่อ admin";
        meRef.current = u; setMe(u);
        try { remember ? localStorage.setItem(LS_SESSION, em) : localStorage.removeItem(LS_SESSION); } catch { /* ignore */ }
        mutate((_, log) => log("เข้าสู่ระบบ", "sys"));
        return null;
      },
      logout() {
        mutate((_, log) => log("ออกจากระบบ", "sys"));
        setMe(null); setQuery(""); openDetail(null);
        try { localStorage.removeItem(LS_SESSION); } catch { /* ignore */ }
      },

      validate: (f) => validateInstrument(f, dbRef.current.docs),
      createDoc(f, submit) {
        const error = validateInstrument(f, dbRef.current.docs);
        if (error) return { error };
        const [termGroup, tenor] = f.tenorSpec.split("|");
        const prefix = f.sector === "government" ? (f.kind === "ตั๋วเงินคลัง" ? "TB-" : "GB-") : "DB-";
        const id = prefix + String(dbRef.current.docs.length + 1).padStart(3, "0");
        const ok = new Set(flatten(tpl(f.tp).items).map((x) => x.id));
        const up = Object.fromEntries(Object.entries(f.up).filter(([k]) => ok.has(k)));
        mutate((d, log) => {
          d.docs.unshift({
            id, n: f.n.trim(), co: f.co, tp: f.tp, s: submit ? "submitted" : "draft", up, v: 1, a: 0, note: "", date: "",
            sector: f.sector, kind: f.kind, symbol: f.symbol.trim().toUpperCase(), tenor, termGroup: termGroup as "short" | "long",
          });
          log(`สร้าง ${id} ${f.symbol.toUpperCase()} อายุ ${tenor}`);
          if (submit) log(`ส่งเอกสารให้ Document ${id}`);
        });
        return { id };
      },
      renameDoc: (id, name) => mutate((d, log) => setDoc(d, id, (x) => { x.n = name || x.n; if (x.s === "returned") x.s = "draft"; log(`แก้ไข ${id}`); })),
      setFile: (id, itemId, file) => mutate((d, log) => setDoc(d, id, (x) => {
        if (file) { x.up[itemId] = file; log(`แนบเอกสาร ${id}`); } else { delete x.up[itemId]; log(`ลบไฟล์ ${id}`); }
      })),
      sendDoc: (id) => mutate((d, log) => setDoc(d, id, (x) => { x.s = "submitted"; log(`ส่งเอกสารให้ Document ${id}`); })),
      forwardDoc(id) {
        const x = dbRef.current.docs.find((y) => y.id === id);
        if (!x) return "ไม่พบเอกสาร";
        if (incomplete(x)) return "เอกสารยังไม่ครบตาม Template — ส่งต่อ Reviewer ไม่ได้";
        mutate((d, log) => setDoc(d, id, (y) => { y.s = "pending"; log(`Document ส่งต่อ Reviewer ${id}`); }));
        return null;
      },
      returnDoc: (id, reason, by = "") => mutate((d, log) => setDoc(d, id, (x) => {
        x.s = "returned"; x.note = reason || "-"; log(`${by ? by + " " : ""}ส่งกลับ ${id}: ${x.note}`);
      })),
      cancelDoc: (id, reason) => mutate((d, log) => setDoc(d, id, (x) => { x.s = "cancelled"; x.note = reason || "-"; log(`Document ยกเลิก ${id}: ${x.note}`); })),
      passDoc: (id) => mutate((d, log) => setDoc(d, id, (x) => { x.s = "approving"; log(`ตรวจผ่าน ${id}`); })),
      approveDoc: (id) => mutate((d, log) => setDoc(d, id, (x) => { x.s = "approved"; log(`อนุมัติ ${id}`); })),
      rejectDoc: (id, reason) => mutate((d, log) => setDoc(d, id, (x) => { x.s = "rejected"; x.note = reason; log(`ปฏิเสธ ${id}: ${reason}`); })),
      publishDoc: (id) => mutate((d, log) => setDoc(d, id, (x) => {
        if (x.v > 1 || x.a) x.a++;
        x.v++; x.s = "published"; x.date = isoDate(); log(`เผยแพร่ ${id} v${x.v}`);
      })),
      resubmit(id) {
        const o = dbRef.current.docs.find((x) => x.id === id)!;
        const nid = o.id.split("-")[0] + "-" + String(dbRef.current.docs.length + 1).padStart(3, "0");
        mutate((d, log) => { d.docs.unshift({ ...structuredClone(o), id: nid, s: "draft", up: {}, v: 1, a: 0, note: "", date: "" }); log(`ส่งใหม่ทั้งฉบับ ${o.id} → ${nid}`); });
        return nid;
      },
      removePublished: (id, reason) => mutate((d, log) => {
        const i = d.docs.findIndex((x) => x.id === id && x.s === "published");
        if (i < 0) return;
        const [x] = d.docs.splice(i, 1);
        d.deleted.unshift({ t: fmtDT(), u: meRef.current?.n ?? "ระบบ", id: x.id, n: x.n, reason });
        log(`ลบเอกสารที่เผยแพร่แล้ว ${id}: ${reason}`);
      }),

      createTemplate(name, items) {
        const id = "TPL-" + String(Math.max(0, ...dbRef.current.templates.map((x) => +x.id.slice(4))) + 1).padStart(2, "0");
        mutate((d, log) => { d.templates.push({ id, n: name, items, on: true, v: 1, upd: false, verDate: isoDate(), hist: [] }); log(`สร้าง ${id}`, "tpl"); });
        return id;
      },
      renameTemplate: (id, name) => mutate((d, log) => { const t = T(d, id); t.n = name || t.n; log(`แก้ไขชื่อ ${id}`, "tpl"); }),
      toggleTemplate: (id) => mutate((d, log) => { const t = T(d, id); t.on = !t.on; log(`${t.on ? "เปิด" : "ปิด"} ${id}`, "tpl"); }),
      toggleUpdate: (id) => mutate((d) => { const t = T(d, id); t.upd = !t.upd; }),
      setTemplateItems: (id, items, what) => mutate((d, log) => { T(d, id).items = items; log(`${what} ${id}`, "tpl"); }),
      issueVersion(id, v) {
        const t = dbRef.current.templates.find((x) => x.id === id)!;
        const name = v.name.trim() || t.n;
        if (!v.items.length) return "ต้องมีอย่างน้อย 1 หัวข้อ";
        if (name === t.n && JSON.stringify(cloneTree(v.items)) === JSON.stringify(cloneTree(t.items))) return "ยังไม่มีการเปลี่ยนแปลง";
        mutate((d, log) => {
          const x = T(d, id);
          x.hist.push({ v: x.v, n: x.n, items: cloneTree(x.items), date: isoDate(), note: x.note ?? "" });
          x.v++; x.n = name; x.items = v.items; x.note = v.note.trim(); x.verDate = isoDate(); x.upd = false;
          log(`ออก Version ใหม่ ${id} v${x.v}${x.note ? ": " + x.note : ""}`, "tpl");
        });
        return null;
      },

      addStaff(u) {
        const em = u.email.trim().toLowerCase();
        if (dbRef.current.users.some((x) => x.email.toLowerCase() === em)) return "อีเมลนี้มีในระบบแล้ว";
        mutate((d, log) => { d.users.push({ n: u.n.trim(), email: em, r: u.r, on: true, added: true }); log(`เพิ่มเจ้าหน้าที่ ${u.n} (${u.r})`, "sys"); });
        return null;
      },
      invite(i) {
        const em = i.email.trim().toLowerCase();
        if (dbRef.current.users.some((x) => x.email.toLowerCase() === em) || dbRef.current.invites.some((x) => x.email === em)) return "อีเมลนี้มีในระบบหรือถูกชวนไว้แล้ว";
        mutate((d, log) => { d.invites.unshift({ email: em, rep: i.rep.trim(), co: i.co.trim(), t: fmtDT() }); log(`ชวนผู้ใช้ ${i.rep} (${em}) เข้าบริษัท ${i.co}`, "sys"); });
        return null;
      },
      resendInvite: (email) => mutate((d, log) => { const v = d.invites.find((x) => x.email === email); if (v) { v.t = fmtDT(); log(`ส่งคำเชิญซ้ำ ${email}`, "sys"); } }),
      revokeInvite: (email) => mutate((d, log) => { d.invites = d.invites.filter((x) => x.email !== email); log(`ยกเลิกคำเชิญ ${email}`, "sys"); }),
      acceptInvite: (email) => mutate((d, log) => {
        const v = d.invites.find((x) => x.email === email);
        if (!v) return;
        d.invites = d.invites.filter((x) => x.email !== email);
        if (!d.companies.includes(v.co)) d.companies.push(v.co);
        d.users.push({ n: v.rep, email: v.email, r: "company", co: v.co, on: true, added: true });
        log(`${v.rep} (${v.email}) ตอบรับคำเชิญเข้าบริษัท ${v.co}`, "sys");
      }),
      setUserRole: (email, r) => mutate((d, log) => { const u = d.users.find((x) => x.email === email); if (u) { u.r = r; log(`เปลี่ยน Role ${u.n}`, "sys"); } }),
      toggleUser: (email) => mutate((d, log) => { const u = d.users.find((x) => x.email === email); if (u) { u.on = !u.on; log(`${u.on ? "เปิด" : "ปิด"}ผู้ใช้ ${u.n}`, "sys"); } }),
    };
  }, [db, ready, me, query, detailId, mutate, tpl, need, got, incomplete, missing, companyDocs]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
