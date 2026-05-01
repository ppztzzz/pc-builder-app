"use client"

import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary mb-3">
            🎮 แบบจำลองประกอบคอมพิวเตอร์
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            อยากรู้ว่าประกอบเครื่องนี้ได้ไหม?
            <br />
            <span className="text-primary">ลองประกอบเลย</span>
          </h1>
          <p className="text-lg text-muted mb-6">
            เรียนรู้ส่วนประกอบของคอมพิวเตอร์ + ลากชิ้นส่วนเข้าเคส +
            ระบบตรวจ compatibility อัตโนมัติ
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white font-medium hover:opacity-90 transition"
            >
              🚀 เริ่มประกอบ
            </Link>
            <a
              href="#latest"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium hover:bg-card transition"
            >
              📚 อ่านบทความ
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
