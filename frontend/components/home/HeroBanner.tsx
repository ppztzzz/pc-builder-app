"use client"

import Link from "next/link"
import { Gamepad2, ArrowRight } from "lucide-react"

export function HeroBanner() {
  return (
    <section className="border-b-2 border-foreground bg-foreground text-background">
      <Link
        href="/simulator"
        className="block group mx-auto max-w-6xl px-4 py-12 sm:py-16 hover:bg-primary transition"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-background/60 group-hover:text-background/90 mb-4 font-bold flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" />
          Hands-on Lab
        </p>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] mb-6 max-w-4xl">
          อยากรู้ว่าประกอบเครื่องนี้ได้ไหม?
          <br />
          <span className="opacity-50 group-hover:opacity-80 transition">
            ลองประกอบเลย
          </span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl text-background/80 leading-relaxed">
          ลากชิ้นส่วนเข้าเคส ระบบตรวจ compatibility อัตโนมัติ
          คำนวณ FPS ของเกม และแชร์ build ผ่าน QR ได้
        </p>
        <p className="text-sm font-bold uppercase tracking-widest mt-8 inline-flex items-center gap-2">
          เริ่มประกอบ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </p>
      </Link>
    </section>
  )
}
