import { Fragment } from "react"
import { Link } from "react-router-dom"

import { StatusBadge } from "@/components/StatusBadge"
import { formatCents, formatOrderDate } from "@/lib/format"
import { ItemIdentity } from "./ItemIdentity"
import { ItemSummary } from "./ItemSummary"
import { getItemLineTotalCents, getOrderTotalCents } from "./orderSummary"
import type { OrdersTableProps } from "./OrdersTable.types"

export function OrdersTable({ orders, isExpanded, onToggleExpanded }: OrdersTableProps) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          <th className="px-5 py-3 sm:px-6">Order</th>
          <th className="px-5 py-3 sm:px-6">Date</th>
          <th className="px-5 py-3 sm:px-6">Items</th>
          <th className="px-5 py-3 text-right sm:px-6">Total</th>
          <th className="px-5 py-3 text-right sm:px-6">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const expanded = isExpanded(order.id)
          return (
            <Fragment key={order.id}>
              <tr className="border-b border-border transition-colors last:border-0 hover:bg-muted/30">
                <td className="px-5 py-4 align-middle sm:px-6">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm font-semibold text-foreground transition-colors hover:text-accent-foreground"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-4 align-middle text-sm whitespace-nowrap text-muted-foreground sm:px-6">
                  {formatOrderDate(order.placedAt)}
                </td>
                <td className="px-5 py-4 align-middle sm:px-6">
                  <ItemSummary
                    order={order}
                    expanded={expanded}
                    onToggle={() => onToggleExpanded(order.id)}
                  />
                </td>
                <td className="px-5 py-4 align-middle text-right text-sm font-medium whitespace-nowrap text-foreground sm:px-6">
                  {formatCents(getOrderTotalCents(order))}
                </td>
                <td className="px-5 py-4 text-right align-middle sm:px-6">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
              {expanded
                ? order.items.map((item) => (
                    <tr key={item.id} className="border-b border-border bg-muted/30 last:border-b">
                      <td />
                      <td />
                      <td className="px-5 py-3 pl-5 sm:px-6 sm:pl-6">
                        <div className="flex items-center gap-3">
                          <ItemIdentity item={item} />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-sm tabular-nums whitespace-nowrap text-foreground sm:px-6">
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
