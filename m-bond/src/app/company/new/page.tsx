import { NewInstrumentWizard } from "@/features/company/NewInstrumentWizard";

// รับ ?tp=TPL-xx เมื่อกด “ใช้ Template นี้” จากหน้าเทมเพลตเอกสาร
export default async function Page({ searchParams }: { searchParams: Promise<{ tp?: string }> }) {
  const { tp } = await searchParams;
  return <NewInstrumentWizard initialTemplate={tp} />;
}
