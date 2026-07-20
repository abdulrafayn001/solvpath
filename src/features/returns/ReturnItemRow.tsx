import { OrderThumbnail } from "@/features/orders/OrderThumbnail"
import { formatCents } from "@/lib/format"
import { cn } from "@/lib/utils"

import { QuantityStepper } from "./QuantityStepper"
import type { ReturnItemRowProps } from "./ReturnItemRow.types"

export function ReturnItemRow({ item, qty, onChange }: ReturnItemRowProps) {
  const disabled = !item.returnEligible

  return (
    <div className={cn("flex items-center gap-3 py-1", disabled && "opacity-60")}>
      <OrderThumbnail color={item.thumbColor} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm text-foreground">{item.name}</span>
        <span className="text-xs text-muted-foreground">
          {disabled
            ? "Not eligible for return"
            : `Purchased ×${item.quantity} · ${formatCents(item.unitPriceCents)} each`}
        </span>
      </div>
      <QuantityStepper qty={qty} max={item.quantity} onChange={onChange} disabled={disabled} />
    </div>
  )
}
