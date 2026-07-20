import type { OrderStatus } from "@/api"

type StatusConfig = {
  label: string
  color: string
  softColor: string
}

// "shipped" (the code/API value) and "in transit" (the customer-facing name
// for the same state) refer to one status — "In Transit" is the label used
// everywhere: badge, filter control, copy.
export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  processing: {
    label: "Processing",
    color: "var(--warning)",
    softColor: "var(--warning-soft)",
  },
  shipped: {
    label: "In Transit",
    color: "var(--info)",
    softColor: "var(--info-soft)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--success)",
    softColor: "var(--success-soft)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--danger)",
    softColor: "var(--danger-soft)",
  },
}
