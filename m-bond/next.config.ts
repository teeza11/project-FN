import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ข้อมูลทั้งหมดเป็นข้อมูลตัวอย่างฝั่ง client — ยังไม่มี API หลังบ้าน
  // เมื่อเชื่อม backend จริง ให้เพิ่ม rewrites / env ที่นี่
  poweredByHeader: false,
};

export default nextConfig;
