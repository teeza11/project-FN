"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";

interface AskOptions { title: string; initial?: string; multiline?: boolean; required?: boolean; confirmLabel?: string }
interface Feedback {
  toast: (msg: string) => void;
  /** เปิดป๊อปอัพกรอกข้อความ — คืน null ถ้ายกเลิก (required=true จะไม่ยอมรับค่าว่าง) */
  ask: (opts: AskOptions) => Promise<string | null>;
}

const Ctx = createContext<Feedback | null>(null);
export const useFeedback = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFeedback ต้องอยู่ใน <FeedbackProvider>");
  return c;
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [dlg, setDlg] = useState<(AskOptions & { resolve: (v: string | null) => void }) | null>(null);
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2400);
  }, []);

  const ask = useCallback((opts: AskOptions) => new Promise<string | null>((resolve) => {
    setVal(opts.initial ?? "");
    setErr("");
    setDlg({ ...opts, resolve });
  }), []);

  const close = (v: string | null) => { dlg?.resolve(v); setDlg(null); };
  const confirm = () => {
    if (dlg?.required && !val.trim()) { setErr("กรุณาระบุข้อมูลก่อนดำเนินการต่อ"); return; }
    close(val.trim());
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Ctx.Provider value={{ toast, ask }}>
      {children}
      {dlg && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-5">
            <h3 className="mb-3 text-[15px] font-semibold text-accent">{dlg.title}</h3>
            {dlg.multiline ? (
              <textarea autoFocus rows={4} className="w-full" value={val} onChange={(e) => setVal(e.target.value)} />
            ) : (
              <input autoFocus className="w-full" value={val} onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirm()} />
            )}
            {err && <p role="alert" className="mt-2 text-sm text-danger">{err}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => close(null)}>ยกเลิก</Button>
              <Button onClick={confirm}>{dlg.confirmLabel ?? "ยืนยัน"}</Button>
            </div>
          </div>
        </div>
      )}
      {msg && (
        <div role="status" className="fixed bottom-6 right-6 z-[80] rounded-xl bg-brand px-4 py-3 text-white shadow-lg">{msg}</div>
      )}
    </Ctx.Provider>
  );
}
