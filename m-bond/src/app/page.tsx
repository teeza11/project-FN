"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/AppStore";
import { ROLES } from "@/lib/roles";

/** จุดเข้าระบบ: ส่งไปหน้าหลักของ Role ที่ล็อกอินอยู่ หรือไปหน้าล็อกอิน */
export default function Home() {
  const { me, ready } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (ready) router.replace(me ? ROLES[me.r].base : "/login");
  }, [ready, me, router]);
  return null;
}
