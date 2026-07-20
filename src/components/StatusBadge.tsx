import type { OrderStatus } from "@/api"
import { STATUS_CONFIG } from "@/lib/status"

type StatusBadgeProps = {
  status: OrderStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color, softColor } = STATUS_CONFIG[status]

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: softColor }}
    >
      {label}
    </span>
  )
}
