import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { AppStoreProvider } from "@/store/AppStore";
import { FeedbackProvider } from "@/components/ui/Feedback";

const thai = Noto_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "600", "700"], variable: "--font-thai" });

export const metadata: Metadata = {
  title: "M-Bond ระบบตราสารหนี้",
  description: "ระบบจัดการตราสารหนี้สำหรับเจ้าหน้าที่หลังบ้าน",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={thai.variable}>
      <body>
        <FeedbackProvider>
          <AppStoreProvider>{children}</AppStoreProvider>
        </FeedbackProvider>
      </body>
    </html>
  );
}
