import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import type { ReturnResolution } from "@/api"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { OrderLoadGate } from "@/features/returns/OrderLoadGate"
import { useReturnFlow } from "@/features/returns/ReturnFlowContext"
import { calculateReturnValueCents, toReturnLineItems } from "@/features/returns/returnCalculations"
import { ValidationMessage } from "@/features/returns/ValidationMessage"
import { formatCents } from "@/lib/format"
import { cn } from "@/lib/utils"

import { RESOLUTION_OPTIONS } from "./resolutionOptions"

export function ReturnResolutionStep() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useReturnFlow()
  const [showValidation, setShowValidation] = useState(false)

  function handleContinue() {
    if (!state.resolution) {
      setShowValidation(true)
      return
    }
    navigate(`/orders/${orderId}/return/review`)
  }

  return (
    <OrderLoadGate orderId={orderId}>
      {(order) => {
        const returnLineItems = toReturnLineItems(state.selectedItems, order.items)

        return (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              How would you like to be resolved for the returned item(s)?
            </p>

            <RadioGroup
              value={state.resolution ?? ""}
              onValueChange={(resolution: ReturnResolution) => {
                dispatch({ type: "SET_RESOLUTION", resolution })
                setShowValidation(false)
              }}
              className="gap-3"
            >
              {RESOLUTION_OPTIONS.map((option) => {
                const isSelected = state.resolution === option.value
                const amountCents = calculateReturnValueCents(returnLineItems, option.value)

                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border border-border bg-card p-4 transition-colors",
                      isSelected && "border-ring ring-2 ring-ring/50",
                    )}
                  >
                    <RadioGroupItem value={option.value} className="mt-0.5" />
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">{option.title}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                    {option.showsAmount ? (
                      <span className="text-sm font-medium tabular-nums text-foreground">
                        {formatCents(amountCents)}
                      </span>
                    ) : null}
                  </label>
                )
              })}
            </RadioGroup>

            {showValidation ? <ValidationMessage>Select a resolution to continue.</ValidationMessage> : null}

            <div>
              <Button onClick={handleContinue}>Continue</Button>
            </div>
          </div>
        )
      }}
    </OrderLoadGate>
  )
}
