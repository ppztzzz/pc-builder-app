export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-foreground bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-2xl font-extrabold tracking-tight mb-2">
              PC<span className="text-primary">/</span>BUILDER
            </p>
            <p className="text-sm text-background/70 max-w-md">
              นิตยสารออนไลน์เรื่องคอมพิวเตอร์ + ระบบจำลองประกอบเครื่อง
              ตรวจ compatibility อัตโนมัติ
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <p className="text-background/70">© 2026</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
