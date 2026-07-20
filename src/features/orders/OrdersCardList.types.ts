import type { Order } from "@/api"

export type OrdersCardListProps = {
  orders: Order[]
  isExpanded: (orderId: string) => boolean
  onToggleExpanded: (orderId: string) => void
}
