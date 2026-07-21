import { useId, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"

import type { ReturnResolution } from "@/api"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useReturnFlow } from "@/features/returns/ReturnFlowContext"
import { calculateReturnValueCents, toReturnLineItems } from "@/features/returns/returnCalculations"
import { ReturnStepActions } from "@/features/returns/ReturnStepActions"
import { ValidationMessage } from "@/features/returns/ValidationMessage"
import { formatCents } from "@/lib/format"
import { cn } from "@/lib/utils"

import { RESOLUTION_OPTIONS } from "./resolutionOptions"
import { getReturnFlowRedirectStep } from "./returnFlowGuard"

export function ReturnResolutionStep() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch, order } = useReturnFlow()
  const [showValidation, setShowValidation] = useState(false)
  const resolutionLabelId = useId()
  const resolutionErrorId = useId()

  const redirectStep = getReturnFlowRedirectStep("resolution", state)
  if (redirectStep) {
    return <Navigate to={`/orders/${orderId}/return/${redirectStep}`} replace />
  }

  function handleContinue() {
    if (!state.resolution) {
      setShowValidation(true)
      return
    }
    navigate(`/orders/${orderId}/return/review`)
  }

  const showResolutionError = showValidation && !state.resolution
  const returnLineItems = toReturnLineItems(state.selectedItems, order.items)

  return (
    <div className="flex flex-col gap-4">
      <p id={resolutionLabelId} className="text-sm text-muted-foreground">
        How would you like to be resolved for the returned item(s)?
      </p>

      <RadioGroup
        value={state.resolution ?? ""}
        onValueChange={(resolution: ReturnResolution) => {
          dispatch({ type: "SET_RESOLUTION", resolution })
          setShowValidation(false)
        }}
        aria-labelledby={resolutionLabelId}
        aria-describedby={showResolutionError ? resolutionErrorId : undefined}
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

      {showResolutionError ? (
        <ValidationMessage id={resolutionErrorId}>Select a resolution to continue.</ValidationMessage>
      ) : null}

      <ReturnStepActions>
        <Button onClick={handleContinue}>Continue</Button>
      </ReturnStepActions>
    </div>
  )
}
