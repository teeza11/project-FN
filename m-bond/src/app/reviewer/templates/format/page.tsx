import { TemplateFormat } from "@/features/reviewer/TemplateFormat";

// รับ ?id=TPL-xx เพื่อเปิดแก้ Template ที่เพิ่งสร้างได้ทันที
export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <TemplateFormat initialId={id} />;
}
