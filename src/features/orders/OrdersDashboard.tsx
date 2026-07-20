import { EmptyState } from "@/components/EmptyState"
import { ErrorState } from "@/components/ErrorState"
import { Skeleton } from "@/components/Skeleton"
import { useOrders } from "@/hooks/useOrders"
import { OrdersList } from "./OrdersList"

export function OrdersDashboard() {
  const { data, isLoading, isError, error, refetch } = useOrders()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium">Orders</h1>

      <div className="rounded-[var(--radius-card)] border border-border bg-card p-4">
        {/* filter bar placeholder */}
      </div>

      <div className="rounded-[var(--radius-card)] border border-border bg-card p-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState description={error?.message} onRetry={() => refetch()} />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="There are no orders matching your filters."
          />
        ) : (
          <OrdersList orders={data.data} />
        )}
      </div>

      <div className="flex items-center justify-center">
        {/* pagination placeholder */}
      </div>
    </div>
  )
}
