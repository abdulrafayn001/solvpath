import { Link } from "react-router-dom"

import { StatusBadge } from "@/components/StatusBadge"
import { formatCents, formatOrderDate } from "@/lib/format"
import { ExpandToggle } from "./ExpandToggle"
import { ItemSummary } from "./ItemSummary"
import { OrderThumbnail } from "./OrderThumbnail"
import { getItemLineTotalCents, getOrderTotalCents } from "./orderSummary"
import type { OrdersCardListProps } from "./OrdersCardList.types"

export function OrdersCardList({ orders, isExpanded, onToggleExpanded }: OrdersCardListProps) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {orders.map((order) => {
        const expanded = isExpanded(order.id)
        return (
          <li
            key={order.id}
            className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <Link
                to={`/orders/${order.id}`}
                className="text-sm font-medium text-foreground hover:underline"
              >
                {order.orderNumber}
              </Link>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex flex-col items-start gap-1">
              <ItemSummary order={order} />
              <ExpandToggle
                expanded={expanded}
                itemCount={order.items.length}
                onToggle={() => onToggleExpanded(order.id)}
              />
            </div>
            {expanded ? (
              <div className="flex flex-col divide-y divide-border rounded-md bg-muted/30 px-3">
                {/* Stacked (not single-row) so long names wrap instead of
                    truncating — a narrow card has no room for a name column
                    alongside fixed qty/price columns the way the desktop
                    table does. */}
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1 py-2">
                    <div className="flex items-center gap-3">
                      <OrderThumbnail color={item.thumbColor} />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <div className="flex items-center justify-between pl-12 text-sm">
                      <span className="tabular-nums text-muted-foreground">×{item.quantity}</span>
                      <span className="tabular-nums text-foreground">
                        {formatCents(getItemLineTotalCents(item))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{formatOrderDate(order.placedAt)}</span>
              <span className="font-medium text-foreground">
                {formatCents(getOrderTotalCents(order))}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
