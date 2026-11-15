"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/AppStore";
import { ROLES } from "@/lib/roles";
import { LogoFull } from "@/components/shared/Logo";

export default function LoginPage() {
  const { login, me, ready } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { if (ready && me) router.replace(ROLES[me.r].base); }, [ready, me, router]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er = login(email, pw, remember);
    if (er) setErr(er);
  };

  const field = "h-[46px] w-full rounded-[10px] border border-[#cfe0d8] bg-[#fafdfb] px-11 text-sm text-[#0d3d2b] placeholder:text-[#7a948a] focus-visible:outline-[#3fbf73]";

  return (
    <div className="fixed inset-0 grid grid-cols-[46%_1fr] overflow-auto bg-[#f3f6f4] text-[#0d3d2b] max-md:grid-cols-1">
      {/* ฝั่งซ้าย: โลโก้และชื่อระบบ */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#0f4a33] to-[#082a1e] pl-[8%] pr-[9%] text-white [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)] max-md:hidden">
        <i className="absolute left-[6%] top-0 block h-[110px] w-[90px] -skew-x-[35deg] bg-[#2e9b5a]/55" />
        <i className="absolute left-[22%] top-0 block h-[90px] w-10 -skew-x-[35deg] bg-white/10" />
        <i className="absolute bottom-[9%] left-[4%] block h-[70px] w-[300px] -skew-x-[35deg] bg-white/10" />
        <div className="relative">
          <LogoFull className="mb-9 h-auto w-[210px]" />
          <h1 className="mb-2 text-[34px] font-semibold">ระบบจัดการตราสารหนี้</h1>
          <p className="mb-5 text-[#cfe5da]">Thai Bond Management System</p>
          <span className="mb-5 block h-1 w-[50px] rounded bg-[#3fbf73]" />
          <h4 className="mb-2 text-[15px] font-semibold">ระบบสำหรับเจ้าหน้าที่หลังบ้าน</h4>
          <p className="text-[13px] leading-7 text-[#cfe5da]">จัดการข้อมูลตราสารหนี้และเอกสาร<br />ได้อย่างเป็นระบบ ปลอดภัย และตรวจสอบได้</p>
        </div>
      </section>

      {/* ฝั่งขวา: ฟอร์มล็อกอิน */}
      <section className="flex flex-col items-center justify-center gap-4 px-5 py-8">
        <div className="w-[min(430px,100%)] rounded-[22px] border border-[#dfe9e3] bg-white px-[34px] py-8 shadow-[0_10px_40px_rgba(16,70,45,.08)]">
          <h2 className="mb-1 text-[26px] text-[#0d3d2b]">เข้าสู่ระบบ</h2>
          <p className="mb-5 text-[13px] text-[#5f7a6e]">ลงชื่อเข้าใช้เพื่อจัดการข้อมูลตราสารหนี้</p>
          <form onSubmit={submit}>
            <label htmlFor="lu" className="mb-2 mt-3.5 block text-[13px] font-bold">ชื่อผู้ใช้งาน (อีเมล)</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-[22px] w-[22px] -translate-y-1/2 fill-none stroke-[#4f8f6f]" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></svg>
              <input id="lu" className={field} autoComplete="username" placeholder="กรอกอีเมล" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </div>
            <label htmlFor="lp" className="mb-2 mt-3.5 block text-[13px] font-bold">รหัสผ่าน</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-[22px] w-[22px] -translate-y-1/2 fill-none stroke-[#4f8f6f]" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              <input id="lp" className={field} type={show ? "text" : "password"} autoComplete="current-password" placeholder="กรอกรหัสผ่าน" value={pw} onChange={(e) => setPw(e.target.value)} required />
              <button type="button" aria-label="แสดงหรือซ่อนรหัสผ่าน" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5">
                <svg className="h-5 w-5 fill-none stroke-[#294a3c]" strokeWidth="1.7" viewBox="0 0 24 24" aria-hidden><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
            </div>
            <div className="mb-1.5 mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-[12.5px] text-[#4a665a]"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> จดจำการเข้าระบบ</label>
              <button type="button" className="text-[12.5px] font-bold text-[#13683f]" onClick={() => setErr("กรุณาติดต่อ admin เพื่อรีเซ็ตรหัสผ่าน")}>ลืมรหัสผ่าน?</button>
            </div>
            <p role="alert" className="my-1.5 min-h-5 text-[13px] text-[#c0392b]">{err}</p>
            <button className="flex h-[46px] w-full items-center justify-center gap-3 rounded-[10px] bg-gradient-to-r from-[#2e9b5a] to-[#63cf88] font-bold text-white hover:brightness-105">เข้าสู่ระบบ <span aria-hidden>→</span></button>
          </form>
          <hr className="my-5 border-[#e1ebe5]" />
          <p className="text-center text-xs text-[#6b857a]">สำหรับเจ้าหน้าที่ที่ได้รับสิทธิ์เข้าใช้งานระบบเท่านั้น</p>
        </div>
        <p className="text-center text-xs text-[#6b857a]">© Thai Bond Management System · เอกสารและข้อมูลสำหรับใช้ภายในองค์กร</p>
      </section>
    </div>
  );
}
