import type { OrderThumbnailProps } from "./OrderThumbnail.types"

export function OrderThumbnail({ color }: OrderThumbnailProps) {
  return (
    <span
      className="inline-block size-9 shrink-0 rounded-md border border-border"
      style={{ backgroundColor: color ?? "var(--muted)" }}
      aria-hidden="true"
    />
  )
}
