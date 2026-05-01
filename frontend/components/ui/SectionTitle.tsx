type Props = {
  label: string
  title: string
  className?: string
}

export function SectionTitle({ label, title, className = "" }: Props) {
  return (
    <div className={`mb-6 ${className}`}>
      <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
        {label}
      </p>
      <div className="flex items-baseline justify-between border-b-2 border-foreground pb-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {title}
        </h2>
      </div>
    </div>
  )
}
