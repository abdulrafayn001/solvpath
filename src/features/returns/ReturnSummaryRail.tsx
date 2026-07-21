import { OrderThumbnail } from "@/features/orders/OrderThumbnail"
import { calculateReturnBaseCents, calculateStoreCreditBonusCents, toReturnLineItems } from "@/features/returns/returnCalculations"
import { useReturnFlow } from "@/features/returns/ReturnFlowContext"
import { formatCents } from "@/lib/format"

/** Persistent running total for the return in progress — visible across every step so the value never disappears when moving between them. */
export function ReturnSummaryRail() {
  const { state, order } = useReturnFlow()
  const { selectedItems, resolution } = state

  if (selectedItems.length === 0) {
    return (
      <aside className="flex flex-col gap-1 rounded-[var(--radius-card)] border border-border bg-card p-5 lg:sticky lg:top-6 lg:self-start">
        <h2 className="text-sm font-semibold text-foreground">Return summary</h2>
        <p className="text-sm text-muted-foreground">Pick at least one item to start your return.</p>
      </aside>
    )
  }

  const itemsById = new Map(order.items.map((item) => [item.id, item]))
  const returnLineItems = toReturnLineItems(selectedItems, order.items)
  const baseCents = calculateReturnBaseCents(returnLineItems)
  const bonusCents = resolution === "store_credit" ? calculateStoreCreditBonusCents(baseCents) : 0

  return (
    <aside className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-card p-5 lg:sticky lg:top-6 lg:self-start">
      <h2 className="text-sm font-semibold text-foreground">Return summary</h2>

      <ul className="flex flex-col gap-3">
        {selectedItems.map(({ itemId, qty }) => {
          const item = itemsById.get(itemId)
          return (
            <li key={itemId} className="flex items-center gap-3">
              <OrderThumbnail color={item?.thumbColor} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm text-foreground">{item?.name ?? itemId}</span>
                <span className="text-xs text-muted-foreground">Qty {qty}</span>
              </div>
            </li>
          )
        })}
      </ul>

      <dl className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <dt>Items value</dt>
          <dd className="tabular-nums text-foreground">{formatCents(baseCents)}</dd>
        </div>
        {resolution === "store_credit" ? (
          <>
            <div className="flex items-center justify-between text-muted-foreground">
              <dt>Store credit bonus (10%)</dt>
              <dd className="tabular-nums text-foreground">+{formatCents(bonusCents)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-1.5 font-medium text-foreground">
              <dt>Total store credit</dt>
              <dd className="tabular-nums">{formatCents(baseCents + bonusCents)}</dd>
            </div>
          </>
        ) : null}
        {resolution === "refund" ? (
          <div className="flex items-center justify-between border-t border-border pt-1.5 font-medium text-foreground">
            <dt>Refund amount</dt>
            <dd className="tabular-nums">{formatCents(baseCents)}</dd>
          </div>
        ) : null}
      </dl>
    </aside>
  )
}
