import type { Order } from "@/api"

export type OrdersTableProps = {
  orders: Order[]
  isExpanded: (orderId: string) => boolean
  onToggleExpanded: (orderId: string) => void
}
