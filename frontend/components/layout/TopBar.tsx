"use client"

export function TopBar() {
  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="border-b border-border bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-1.5 flex items-center justify-between text-xs">
        <span className="uppercase tracking-widest font-medium">
          PC Builder Magazine
        </span>
        <span className="hidden sm:block text-background/70">
          {today}
        </span>
      </div>
    </div>
  )
}
