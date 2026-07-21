import type { Order } from "@/api"

export type ItemSummaryProps = {
  order: Order
  expanded: boolean
  onToggle: () => void
}
