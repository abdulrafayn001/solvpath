import { CheckCircle2 } from "lucide-react"
import { Link, useLocation, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import type { ReturnReceipt, ReturnResolution } from "@/api"
import { useReturnFlow } from "@/features/returns/ReturnFlowContext"
import { formatCents } from "@/lib/format"

import { NEXT_STEPS_COPY } from "./nextStepsCopy"
import { RESOLUTION_OPTIONS } from "./resolutionOptions"

type ConfirmationState = {
  receipt: ReturnReceipt
  resolution: ReturnResolution
  amountCents: number
}

function isConfirmationState(value: unknown): value is ConfirmationState {
  return typeof value === "object" && value !== null && "receipt" in value
}

export function ReturnConfirmationStep() {
  const { orderId } = useParams()
  const location = useLocation()
  const { order } = useReturnFlow()

  if (!isConfirmationState(location.state)) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          We don't have a return to confirm here. If you just submitted one, check your email for confirmation.
        </p>
        <Button render={<Link to={`/orders/${orderId}`} />} nativeButton={false} className="w-fit">
          Back to order
        </Button>
      </div>
    )
  }

  const { receipt, resolution, amountCents } = location.state
  const resolutionOption = RESOLUTION_OPTIONS.find((option) => option.value === resolution)
  const createdAt = new Date(receipt.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">Return submitted</span>
          <span className="text-xs text-muted-foreground">
            Reference {receipt.returnId} · {createdAt}
          </span>
        </div>
      </div>

      {resolutionOption?.showsAmount ? (
        <div className="flex items-center justify-between border-t border-border pt-4 text-sm font-medium text-foreground">
          <span>{resolutionOption.title}</span>
          <span className="tabular-nums">{formatCents(amountCents)}</span>
        </div>
      ) : null}

      <p className="border-t border-border pt-4 text-sm text-muted-foreground">
        {NEXT_STEPS_COPY[resolution]}
      </p>

      <Button render={<Link to={`/orders/${orderId}`} />} nativeButton={false} className="w-fit">
        Back to order {order.orderNumber}
      </Button>
    </div>
  )
}
