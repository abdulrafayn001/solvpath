import { cn } from "@/lib/utils"
import { OrderThumbnail } from "./OrderThumbnail"
import type { ItemIdentityProps } from "./ItemIdentity.types"

export function ItemIdentity({ item, nameClassName = "max-w-64" }: ItemIdentityProps) {
  return (
    <>
      <OrderThumbnail color={item.thumbColor} />
      <span className={cn("min-w-0 truncate text-sm text-foreground", nameClassName)}>
        {item.name}
      </span>
      <span className="w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
        ×{item.quantity}
      </span>
    </>
  )
}
