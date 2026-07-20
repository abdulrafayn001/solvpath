import { Loader2 } from "lucide-react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { OrderLoadGate } from "@/features/returns/OrderLoadGate"
import {
  calculateReturnBaseCents,
  calculateReturnValueCents,
  calculateStoreCreditBonusCents,
  toReturnLineItems,
} from "@/features/returns/returnCalculations"
import { useReturnFlow } from "@/features/returns/ReturnFlowContext"
import { useSubmitReturn } from "@/hooks/useSubmitReturn"
import { formatCents } from "@/lib/format"

import { RESOLUTION_OPTIONS } from "./resolutionOptions"
import { getReturnFlowRedirectStep } from "./returnFlowGuard"

export function ReturnReviewStep() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { state } = useReturnFlow()
  const submitReturn = useSubmitReturn()

  const redirectStep = getReturnFlowRedirectStep("review", state)
  if (redirectStep) {
    return <Navigate to={`/orders/${orderId}/return/${redirectStep}`} replace />
  }

  const resolution = state.resolution!
  const resolutionOption = RESOLUTION_OPTIONS.find((option) => option.value === resolution)

  return (
    <OrderLoadGate orderId={orderId}>
      {(order) => {
        const itemsById = new Map(order.items.map((item) => [item.id, item]))
        const returnLineItems = toReturnLineItems(state.selectedItems, order.items)
        const baseCents = calculateReturnBaseCents(returnLineItems)
        const bonusCents = calculateStoreCreditBonusCents(baseCents)
        const totalCents = calculateReturnValueCents(returnLineItems, resolution)

        function handleSubmit() {
          submitReturn.mutate(
            {
              orderId: orderId!,
              items: state.selectedItems.map(({ itemId, qty }) => ({ itemId, quantity: qty })),
              reason: state.reason,
              resolution,
              comment: state.comment || undefined,
            },
            {
              onSuccess: (receipt) => {
                navigate(`/orders/${orderId}/return/confirmation`, {
                  state: { receipt, resolution, amountCents: totalCents },
                })
              },
            },
          )
        }

        return (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">Review your return before submitting.</p>

            <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-card p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Items</span>
                  <Link
                    to={`/orders/${orderId}/return/items`}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                {state.selectedItems.map(({ itemId, qty }) => {
                  const item = itemsById.get(itemId)
                  return (
                    <div key={itemId} className="flex items-center justify-between text-sm text-foreground">
                      <span>
                        {item?.name ?? itemId} × {qty}
                      </span>
                      <span className="tabular-nums">{formatCents((item?.unitPriceCents ?? 0) * qty)}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Reason</span>
                  <Link
                    to={`/orders/${orderId}/return/reason`}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                <p className="text-sm text-foreground">{state.reason}</p>
                {state.comment ? <p className="text-sm text-muted-foreground">{state.comment}</p> : null}
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Resolution</span>
                  <Link
                    to={`/orders/${orderId}/return/resolution`}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                <p className="text-sm text-foreground">{resolutionOption?.title ?? resolution}</p>
                {resolution === "store_credit" ? (
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Returned items value</span>
                      <span className="tabular-nums">{formatCents(baseCents)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Store credit bonus (10%)</span>
                      <span className="tabular-nums">{formatCents(bonusCents)}</span>
                    </div>
                    <div className="flex items-center justify-between font-medium text-foreground">
                      <span>Total store credit</span>
                      <span className="tabular-nums">{formatCents(totalCents)}</span>
                    </div>
                  </div>
                ) : resolutionOption?.showsAmount ? (
                  <div className="flex items-center justify-between text-sm font-medium text-foreground">
                    <span>Refund amount</span>
                    <span className="tabular-nums">{formatCents(totalCents)}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {submitReturn.isError ? (
              <div className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{submitReturn.error?.message}</p>
                <Button variant="outline" size="sm" className="w-fit" onClick={handleSubmit}>
                  Retry
                </Button>
              </div>
            ) : null}

            <div>
              <Button onClick={handleSubmit} disabled={submitReturn.isPending}>
                {submitReturn.isPending ? <Loader2 className="animate-spin" /> : null}
                {submitReturn.isPending ? "Submitting…" : "Submit return"}
              </Button>
            </div>
          </div>
        )
      }}
    </OrderLoadGate>
  )
}
