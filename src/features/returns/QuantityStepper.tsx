import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { QuantityStepperProps } from "./QuantityStepper.types"

export function QuantityStepper({ qty, max, onChange, disabled = false }: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={disabled || qty <= 0}
        onClick={() => onChange(qty - 1)}
        aria-label="Decrease quantity"
      >
        <Minus />
      </Button>
      <span aria-live="polite" className="w-4 text-center text-sm tabular-nums text-foreground">
        {qty}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={disabled || qty >= max}
        onClick={() => onChange(qty + 1)}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  )
}
