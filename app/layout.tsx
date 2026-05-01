import type { Metadata } from "next"
import { Prompt } from "next/font/google"
import "./globals.css"
import { TopBar } from "@/frontend/components/layout/TopBar"
import { Navbar } from "@/frontend/components/layout/Navbar"
import { Footer } from "@/frontend/components/layout/Footer"

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "PC Builder — เรียนรู้และประกอบคอมเอง",
  description:
    "เว็บความรู้และแบบจำลองประกอบคอมพิวเตอร์ — เลือกชิ้นส่วนเอง ตรวจ compatibility อัตโนมัติ",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${prompt.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TopBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
