import { FixDocs } from "@/features/company/FixDocs";

// รับ ?id=DB-xxx เพื่อเปิดรายการที่ต้องแนบเอกสารโดยตรง
export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <FixDocs initialId={id} />;
}
