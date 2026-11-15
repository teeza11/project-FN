# M-Bond · ระบบจัดการตราสารหนี้

Next.js (App Router) + React + TypeScript (TSX) + Tailwind CSS · รองรับ `next.config.ts`

## เริ่มใช้งาน

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # ตรวจชนิดข้อมูล
npm run build
```

## บัญชีทดลอง (รหัสผ่านทุกบัญชี: `pass`)

| ชื่อผู้ใช้ | Role | โฟลเดอร์ |
| --- | --- | --- |
| `admin` | admin | `src/app/admin` |
| `document` | document | `src/app/document` |
| `reviewer` | reviewer | `src/app/reviewer` |
| `company` / `company2` | user (company) | `src/app/company` |

ผู้ใช้ที่ admin เพิ่ม (เจ้าหน้าที่ หรือผู้แทนบริษัทที่ตอบรับคำเชิญ) จะเก็บใน `localStorage` คีย์ `tb_users` และล็อกอินด้วยอีเมลของตัวเอง รหัสผ่าน `pass`

## โครงสร้างโฟลเดอร์

```
src/
├─ app/                         เส้นทางของหน้า — แยกโฟลเดอร์ตาม Role
│  ├─ login/                    หน้าล็อกอิน
│  ├─ admin/                    users · published · logs
│  ├─ document/                 inbox · tracking
│  ├─ reviewer/                 templates (new, format, versions) · review (data, attachments, return, approval) · publish · logs
│  └─ company/                  templates · new · instruments · fix · send · tracking · history
│     (แต่ละโฟลเดอร์มี layout.tsx ที่ครอบด้วย <RoleShell role="..."> เพื่อป้องกันสิทธิ์)
├─ features/                    คอมโพเนนต์เฉพาะ Role (admin/ document/ reviewer/ company/)
├─ components/
│  ├─ layout/RoleShell.tsx      แถบเมนู ส่วนหัว ค้นหา และตัวป้องกันสิทธิ์
│  ├─ shared/                   ใช้ร่วมกันหลาย Role (ตาราง, OutlineEditor, Checklist, รายละเอียดตราสาร ฯลฯ)
│  └─ ui/                       ปุ่ม ตาราง Badge ป๊อปอัพกรอกข้อความ/Toast
├─ store/AppStore.tsx           ข้อมูลและการกระทำทั้งหมด (React Context)
├─ data/seed.ts                 ข้อมูลตัวอย่าง
└─ lib/                         types · rules (กฎตรวจข้อมูล) · roles (เมนู/เส้นทาง) · status · tree · format
```

## หมายเหตุสำคัญ

- ข้อมูลทั้งหมดเป็นตัวอย่างในหน่วยความจำของเบราว์เซอร์ (รีเฟรชแล้วกลับเป็นค่าเริ่มต้น ยกเว้นผู้ใช้ที่ admin เพิ่ม)
- การล็อกอินและรหัสผ่าน `pass` ตรวจฝั่ง client เพื่อสาธิตเท่านั้น — ก่อนใช้งานจริงต้องเปลี่ยนเป็นระบบยืนยันตัวตนและ API ฝั่งเซิร์ฟเวอร์ (จุดเริ่มต้นอยู่ที่ `store/AppStore.tsx`)
- เพิ่ม Role ใหม่: เพิ่มใน `lib/types.ts` และ `lib/roles.ts` แล้วสร้างโฟลเดอร์ `src/app/<role>` พร้อม `layout.tsx`
