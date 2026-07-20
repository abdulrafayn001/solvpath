import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { OrderLoadGate } from "@/features/returns/OrderLoadGate"
import { ReturnItemRow } from "@/features/returns/ReturnItemRow"
import { useReturnFlow } from "@/features/returns/ReturnFlowContext"
import { ReturnStepActions } from "@/features/returns/ReturnStepActions"
import { ValidationMessage } from "@/features/returns/ValidationMessage"

export function ReturnItemsStep() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useReturnFlow()
  const [showValidation, setShowValidation] = useState(false)

  function setQty(itemId: string, qty: number) {
    const next = state.selectedItems.filter((selected) => selected.itemId !== itemId)
    if (qty > 0) {
      next.push({ itemId, qty })
    }
    dispatch({ type: "SET_ITEMS", items: next })
    if (next.length > 0) {
      setShowValidation(false)
    }
  }

  function handleContinue() {
    if (state.selectedItems.length === 0) {
      setShowValidation(true)
      return
    }
    navigate(`/orders/${orderId}/return/reason`)
  }

  return (
    <OrderLoadGate orderId={orderId}>
      {(order) => {
        const qtyByItemId = new Map(state.selectedItems.map((selected) => [selected.itemId, selected.qty]))

        return (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Choose which items you'd like to return, and how many of each.
            </p>
            <div className="flex flex-col divide-y divide-border rounded-[var(--radius-card)] border border-border bg-card px-4">
              {order.items.map((item) => (
                <ReturnItemRow
                  key={item.id}
                  item={item}
                  qty={qtyByItemId.get(item.id) ?? 0}
                  onChange={(qty) => setQty(item.id, qty)}
                />
              ))}
            </div>
            {showValidation ? <ValidationMessage>Select at least one item to continue.</ValidationMessage> : null}
            <ReturnStepActions>
              <Button onClick={handleContinue}>Continue</Button>
            </ReturnStepActions>
          </div>
        )
      }}
    </OrderLoadGate>
  )
}
