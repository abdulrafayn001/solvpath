import { Link, useParams } from "react-router-dom"

import { EmptyState } from "@/components/EmptyState"
import { ErrorState } from "@/components/ErrorState"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import { OrderDetailSkeleton } from "@/features/orders/OrderDetailSkeleton"
import { ItemIdentity } from "@/features/orders/ItemIdentity"
import { getItemLineTotalCents, getOrderTotalCents } from "@/features/orders/orderSummary"
import { useOrder } from "@/hooks/useOrder"
import { formatCents, formatOrderDate } from "@/lib/format"

export function OrderDetailPage() {
  const { orderId } = useParams()
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId)

  if (isLoading) {
    return <OrderDetailSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load this order"
        description={error?.message}
        onRetry={refetch}
      />
    )
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find an order with that ID."
      />
    )
  }

  const canReturn = order.status === "delivered"
  const hasReturnEligibleItem = order.items.some((item) => item.returnEligible)
  const showReturnCta = canReturn && hasReturnEligibleItem
  const returnDisabledReason = !canReturn
    ? "Returns are available once your order is delivered."
    : "No items in this order are eligible for return."

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium text-foreground">Order {order.orderNumber}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatOrderDate(order.placedAt)}</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {order.items.length === 0 ? (
        <EmptyState title="No items on this order" />
      ) : (
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-card p-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <ItemIdentity item={item} />
              <span className="ml-auto text-sm tabular-nums text-foreground">
                {formatCents(getItemLineTotalCents(item))}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-medium text-foreground">
            <span>Total</span>
            <span className="tabular-nums">{formatCents(getOrderTotalCents(order))}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-start gap-1.5">
        {showReturnCta ? (
          <Button render={<Link to={`/orders/${order.id}/return`} />}>Start a return</Button>
        ) : (
          <Button disabled>Start a return</Button>
        )}
        {!showReturnCta ? (
          <p className="text-xs text-muted-foreground">{returnDisabledReason}</p>
        ) : null}
      </div>
    </div>
  )
}
