import type { OrderThumbnailProps } from "./OrderThumbnail.types"

export function OrderThumbnail({ color }: OrderThumbnailProps) {
  return (
    <span
      className="inline-block size-11 shrink-0 rounded-lg border border-border"
      style={{ backgroundColor: color ?? "var(--muted)" }}
      aria-hidden="true"
    />
  )
}
