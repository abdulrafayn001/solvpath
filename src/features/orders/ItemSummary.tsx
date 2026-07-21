import { getItemSummary } from "./orderSummary"
import { ExpandToggle } from "./ExpandToggle"
import { OrderThumbnail } from "./OrderThumbnail"
import type { ItemSummaryProps } from "./ItemSummary.types"

export function ItemSummary({ order, expanded, onToggle }: ItemSummaryProps) {
  const { name, thumbColor, extraCount } = getItemSummary(order)
  return (
    <div className="flex items-center gap-3">
      <OrderThumbnail color={thumbColor} />
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm text-foreground">
          {name}
          {extraCount > 0 ? (
            <span className="text-muted-foreground"> +{extraCount} more</span>
          ) : null}
        </span>
        <ExpandToggle expanded={expanded} itemCount={order.items.length} onToggle={onToggle} />
      </div>
    </div>
  )
}
