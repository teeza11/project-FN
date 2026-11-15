"use client";
import { useStore } from "@/store/AppStore";

/** รายการตราสารหนี้ของบริษัทที่ล็อกอินอยู่เท่านั้น (ผู้ใช้บริษัทเห็นข้อมูลบริษัทอื่นไม่ได้) */
export function useMyDocs() {
  const { docs, me } = useStore();
  return docs.filter((d) => d.co === me?.co);
}
