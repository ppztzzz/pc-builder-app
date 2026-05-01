import Link from "next/link"
import { getIcon } from "@/shared/constants/icons"

type Props = {
  href?: string
  iconName: string
  name: string
  variant?: "default" | "small"
}

export function CategoryTag({ href, iconName, name, variant = "default" }: Props) {
  const sizeClass =
    variant === "small"
      ? "text-[10px] px-2 py-1 gap-1"
      : "text-xs px-3 py-1.5 gap-1.5"

  const iconSize = variant === "small" ? "w-3 h-3" : "w-3.5 h-3.5"

  const Icon = getIcon(iconName)

  const className = `inline-flex items-center uppercase tracking-widest font-bold bg-primary text-primary-fg ${sizeClass}`

  if (href) {
    return (
      <Link href={href} className={`${className} hover:opacity-90 transition`}>
        <Icon className={iconSize} strokeWidth={2} />
        <span>{name}</span>
      </Link>
    )
  }

  return (
    <span className={className}>
      <Icon className={iconSize} strokeWidth={2} />
      <span>{name}</span>
    </span>
  )
}
