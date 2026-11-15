"use client";
import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { useFeedback } from "@/components/ui/Feedback";
import { useStore } from "@/store/AppStore";
import { ROLES } from "@/lib/roles";
import type { AppUser, Role } from "@/lib/types";

type StaffRole = Exclude<Role, "company">;
const STAFF: StaffRole[] = ["admin", "document", "reviewer"];

const Status = ({ on }: { on: boolean }) => (on ? <Badge color="#2FE6A6">ใช้งาน</Badge> : <Badge color="#F87171">ปิดใช้งาน</Badge>);
const Who = ({ u }: { u: AppUser }) => (<>{u.n}<br /><small className="text-muted">{u.email}</small></>);

/** เจ้าหน้าที่พนักงาน "เพิ่มตรง" — ผู้ใช้บริษัท "ชวนผ่านอีเมล" แล้วรอตอบรับ (สองขั้นตอนแยกกัน) */
export function UserManager() {
  const { users, invites, companies, addStaff, invite, resendInvite, revokeInvite, acceptInvite, setUserRole, toggleUser } = useStore();
  const { toast } = useFeedback();
  const [staff, setStaff] = useState<{ n: string; email: string; r: StaffRole }>({ n: "", email: "", r: "document" });
  const [inv, setInv] = useState({ email: "", rep: "", co: "" });

  const onStaff = (e: FormEvent) => {
    e.preventDefault();
    const er = addStaff(staff);
    if (er) return toast(er);
    toast("เพิ่มเจ้าหน้าที่แล้ว — ล็อกอินด้วยอีเมลนี้ รหัสผ่าน pass");
    setStaff({ n: "", email: "", r: "document" });
  };
  const onInvite = (e: FormEvent) => {
    e.preventDefault();
    const er = invite(inv);
    if (er) return toast(er);
    toast(`ส่งคำเชิญไปที่ ${inv.email} แล้ว`);
    setInv({ email: "", rep: "", co: "" });
  };

  const staffUsers = users.filter((u) => u.r !== "company");
  const companyUsers = users.filter((u) => u.r === "company");

  return (
    <>
      <PageHeader title="จัดการผู้ใช้งาน" subtitle="เจ้าหน้าที่พนักงานเพิ่มได้โดยตรง ส่วนผู้ใช้บริษัทต้องชวนผ่านอีเมลและรอให้ตอบรับคำเชิญ" />

      <h3>เจ้าหน้าที่พนักงาน</h3>
      <form onSubmit={onStaff} className="card flex flex-wrap gap-2.5">
        <input placeholder="ชื่อ-นามสกุล" required value={staff.n} onChange={(e) => setStaff({ ...staff, n: e.target.value })} />
        <input type="email" placeholder="อีเมลองค์กร" required value={staff.email} onChange={(e) => setStaff({ ...staff, email: e.target.value })} />
        <select aria-label="Role" value={staff.r} onChange={(e) => setStaff({ ...staff, r: e.target.value as StaffRole })}>
          {STAFF.map((r) => <option key={r} value={r}>{ROLES[r].name}</option>)}
        </select>
        <Button type="submit">เพิ่มเจ้าหน้าที่</Button>
      </form>
      <DataTable
        columns={[
          { head: "ชื่อ", cell: (u) => <Who u={u} /> },
          { head: "Role", cell: (u) => (
            <select aria-label={`Role ของ ${u.n}`} value={u.r} onChange={(e) => { setUserRole(u.email, e.target.value as StaffRole); toast("บันทึกแล้ว"); }}>
              {STAFF.map((r) => <option key={r} value={r}>{ROLES[r].name}</option>)}
            </select>) },
          { head: "สถานะ", cell: (u) => <Status on={u.on} /> },
          { head: "", cell: (u) => <Button variant="outline" onClick={() => toggleUser(u.email)}>{u.on ? "ปิด" : "เปิด"}</Button> },
        ]}
        rows={staffUsers}
      />

      <h3 className="mt-7">ผู้ใช้บริษัท</h3>
      <form onSubmit={onInvite} className="card flex flex-wrap gap-2.5">
        <input type="email" placeholder="อีเมล" required value={inv.email} onChange={(e) => setInv({ ...inv, email: e.target.value })} />
        <input placeholder="ชื่อผู้แทนบริษัท" required value={inv.rep} onChange={(e) => setInv({ ...inv, rep: e.target.value })} />
        <input list="company-list" placeholder="ชื่อบริษัท" required value={inv.co} onChange={(e) => setInv({ ...inv, co: e.target.value })} />
        <datalist id="company-list">{companies.map((c) => <option key={c} value={c} />)}</datalist>
        <Button type="submit">ชวนผู้ใช้</Button>
      </form>

      <h3 className="text-muted">คำเชิญที่รอตอบรับ</h3>
      <DataTable
        columns={[
          { head: "ชื่อผู้แทน", cell: (v) => v.rep }, { head: "อีเมล", cell: (v) => v.email },
          { head: "บริษัท", cell: (v) => v.co }, { head: "ชวนเมื่อ", cell: (v) => v.t },
          { head: "สถานะ", cell: () => <Badge color="#FBBF24">รอตอบรับ</Badge> },
          { head: "", cell: (v) => (
            <span className="flex gap-1.5">
              <Button variant="outline" onClick={() => { resendInvite(v.email); toast("ส่งคำเชิญซ้ำแล้ว"); }}>ส่งซ้ำ</Button>
              <Button variant="outline" title="ปุ่มทดสอบ — ใช้งานจริงผู้ใช้ตอบรับจากอีเมลเอง" onClick={() => { acceptInvite(v.email); toast(`ตอบรับคำเชิญแล้ว — ${v.rep} เป็นผู้ใช้บริษัทเรียบร้อย`); }}>จำลองการตอบรับ</Button>
              <Button variant="danger" onClick={() => { revokeInvite(v.email); toast("ยกเลิกคำเชิญแล้ว"); }}>ยกเลิกคำเชิญ</Button>
            </span>) },
        ]}
        rows={invites}
      />

      <h3 className="text-muted">ผู้ใช้บริษัทที่ตอบรับแล้ว</h3>
      <DataTable
        columns={[
          { head: "ชื่อผู้แทน", cell: (u) => <Who u={u} /> }, { head: "บริษัท", cell: (u) => u.co },
          { head: "สถานะ", cell: (u) => <Status on={u.on} /> },
          { head: "", cell: (u) => <Button variant="outline" onClick={() => toggleUser(u.email)}>{u.on ? "ปิด" : "เปิด"}</Button> },
        ]}
        rows={companyUsers}
      />
    </>
  );
}
