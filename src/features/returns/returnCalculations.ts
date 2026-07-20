import type { OrderItem, ReturnResolution } from "@/api"

import type { SelectedReturnItem } from "./returnFlow.types"

export type ReturnLineItem = {
  unitPriceCents: number
  returnedQty: number
}

/** Resolves selected items against the order's current prices — the one place selectedItems become priced line items. */
export function toReturnLineItems(selectedItems: SelectedReturnItem[], orderItems: OrderItem[]): ReturnLineItem[] {
  const unitPriceCentsByItemId = new Map(orderItems.map((item) => [item.id, item.unitPriceCents]))

  return selectedItems.map(({ itemId, qty }) => ({
    unitPriceCents: unitPriceCentsByItemId.get(itemId) ?? 0,
    returnedQty: qty,
  }))
}

/** Sum of unitPriceCents * returnedQty across the items being returned. */
export function calculateReturnBaseCents(items: ReturnLineItem[]): number {
  return items.reduce((total, item) => total + item.unitPriceCents * item.returnedQty, 0)
}

/**
 * +10% bonus on top of the base value, kept in integer cents throughout —
 * `Math.floor((baseCents + 5) / 10)` is round-half-up on base/10 done with
 * integer division, so there's no float multiply (`base * 1.1`) to drift.
 */
export function calculateStoreCreditBonusCents(baseCents: number): number {
  return Math.floor((baseCents + 5) / 10)
}

/**
 * The amount to show for a resolution, in cents, based only on the returned
 * items (never the whole order). Refund and exchange both surface the base
 * value — exchange doesn't get a dollar figure in the UI, but the underlying
 * value is still the returned items' worth, not a refund amount.
 */
export function calculateReturnValueCents(items: ReturnLineItem[], resolution: ReturnResolution): number {
  const baseCents = calculateReturnBaseCents(items)

  if (resolution === "store_credit") {
    return baseCents + calculateStoreCreditBonusCents(baseCents)
  }

  return baseCents
}
