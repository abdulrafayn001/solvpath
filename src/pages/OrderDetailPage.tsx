import { ChevronLeftIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { EmptyState } from "@/components/EmptyState"
import { ErrorState } from "@/components/ErrorState"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import { OrderDetailSkeleton } from "@/features/orders/OrderDetailSkeleton"
import { ItemIdentity } from "@/features/orders/ItemIdentity"
import { getItemLineTotalCents, getOrderTotalCents, isOrderReturnEligible } from "@/features/orders/orderSummary"
import { useOrder } from "@/hooks/useOrder"
import { formatCents, formatOrderDate } from "@/lib/format"

export function OrderDetailPage() {
  const { orderId } = useParams()
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId)

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        All orders
      </Link>

      {isLoading ? (
        <OrderDetailSkeleton />
      ) : isError ? (
        <ErrorState
          title="Couldn't load this order"
          description={error?.message}
          onRetry={refetch}
        />
      ) : !order ? (
        <EmptyState
          title="Order not found"
          description="We couldn't find an order with that ID."
        />
      ) : (
        <OrderDetailContent order={order} />
      )}
    </div>
  )
}

function OrderDetailContent({ order }: { order: NonNullable<ReturnType<typeof useOrder>["data"]> }) {
  const showReturnCta = isOrderReturnEligible(order)
  const returnDisabledReason = order.status !== "delivered"
    ? "Returns are available once your order is delivered."
    : "No items in this order are eligible for return."

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Order {order.orderNumber}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatOrderDate(order.placedAt)}</span>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          {showReturnCta ? (
            <Button render={<Link to={`/orders/${order.id}/return`} />} nativeButton={false}>
              Start a return
            </Button>
          ) : (
            <Button disabled>Start a return</Button>
          )}
          {!showReturnCta ? (
            <p className="max-w-56 text-xs text-muted-foreground sm:text-right">{returnDisabledReason}</p>
          ) : null}
        </div>
      </div>

      {order.items.length === 0 ? (
        <EmptyState title="No items on this order" />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-[var(--radius-card)] border border-border bg-card lg:col-span-2">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-foreground">Items in this order</h2>
            </div>
            <div className="divide-y divide-border px-5 sm:px-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-4">
                  <ItemIdentity item={item} />
                  <span className="ml-auto text-sm font-medium tabular-nums text-foreground">
                    {formatCents(getItemLineTotalCents(item))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-foreground">Summary</h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <dt>Items</dt>
                <dd className="tabular-nums text-foreground">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 font-medium text-foreground">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatCents(getOrderTotalCents(order))}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
