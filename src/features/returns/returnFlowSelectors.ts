import type { OrderItem } from "@/api"

import type { ReturnFlowState } from "./returnFlow.types"

/** Sum of unit price * qty across selected items, using the order's current prices. */
export function getReturnTotalCents(state: ReturnFlowState, orderItems: OrderItem[]): number {
  const unitPriceCentsByItemId = new Map(orderItems.map((item) => [item.id, item.unitPriceCents]))

  return state.selectedItems.reduce((total, { itemId, qty }) => {
    const unitPriceCents = unitPriceCentsByItemId.get(itemId) ?? 0
    return total + unitPriceCents * qty
  }, 0)
}
