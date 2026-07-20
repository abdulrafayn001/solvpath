import type { OrderItem } from "@/api"

export type ReturnItemRowProps = {
  item: OrderItem
  qty: number
  onChange: (qty: number) => void
}
