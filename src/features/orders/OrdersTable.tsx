import { Fragment } from "react"
import { Link } from "react-router-dom"

import { StatusBadge } from "@/components/StatusBadge"
import { formatCents, formatOrderDate } from "@/lib/format"
import { ExpandToggle } from "./ExpandToggle"
import { ItemIdentity } from "./ItemIdentity"
import { ItemSummary } from "./ItemSummary"
import { getItemLineTotalCents, getOrderTotalCents } from "./orderSummary"
import type { OrdersTableProps } from "./OrdersTable.types"

export function OrdersTable({ orders, isExpanded, onToggleExpanded }: OrdersTableProps) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-border text-xs text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Order</th>
          <th className="py-2 pr-4 font-medium">Date</th>
          <th className="py-2 pr-4 font-medium">Items</th>
          <th className="py-2 pr-4 font-medium">Total</th>
          <th className="py-2 pr-4 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const expanded = isExpanded(order.id)
          return (
            <Fragment key={order.id}>
              <tr className="border-b border-border last:border-0">
                <td className="py-3 pr-4 align-top">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm font-medium text-foreground hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-3 pr-4 align-top text-sm text-muted-foreground">
                  {formatOrderDate(order.placedAt)}
                </td>
                <td className="py-3 pr-4 align-top">
                  <div className="flex flex-col items-start gap-1">
                    <ItemSummary order={order} />
                    <ExpandToggle
                      expanded={expanded}
                      itemCount={order.items.length}
                      onToggle={() => onToggleExpanded(order.id)}
                    />
                  </div>
                </td>
                <td className="py-3 pr-4 align-top text-sm text-foreground">
                  {formatCents(getOrderTotalCents(order))}
                </td>
                <td className="py-3 pr-4 align-top">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
              {expanded
                ? order.items.map((item) => (
                    <tr key={item.id} className="border-b border-border bg-muted/30 last:border-b">
                      <td />
                      <td />
                      <td className="py-2 pr-4 pl-0">
                        <div className="flex items-center gap-3">
                          <ItemIdentity item={item} />
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-sm tabular-nums text-foreground">
                        {formatCents(getItemLineTotalCents(item))}
                      </td>
                      <td />
                    </tr>
                  ))
                : null}
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
