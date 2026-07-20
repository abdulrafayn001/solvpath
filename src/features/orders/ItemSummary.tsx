import { getItemSummary } from "./orderSummary"
import { OrderThumbnail } from "./OrderThumbnail"
import type { ItemSummaryProps } from "./ItemSummary.types"

export function ItemSummary({ order }: ItemSummaryProps) {
  const { name, thumbColor, extraCount } = getItemSummary(order)
  return (
    <div className="flex items-center gap-3">
      <OrderThumbnail color={thumbColor} />
      <span className="text-sm text-foreground">
        {name}
        {extraCount > 0 ? (
          <span className="text-muted-foreground"> +{extraCount} more</span>
        ) : null}
      </span>
    </div>
  )
}
