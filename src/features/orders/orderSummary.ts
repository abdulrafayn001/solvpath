import type { Order, OrderItem } from "@/api"

export function getOrderTotalCents(order: Order) {
  return order.items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0)
}

export function getItemLineTotalCents(item: OrderItem) {
  return item.unitPriceCents * item.quantity
}

export function getItemSummary(order: Order) {
  const [first, ...rest] = order.items
  const extraCount = rest.reduce((sum, item) => sum + item.quantity, 0)
  return {
    name: first?.name ?? "—",
    thumbColor: first?.thumbColor,
    extraCount,
  }
}
