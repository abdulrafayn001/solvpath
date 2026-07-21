import { ErrorState } from "@/components/ErrorState"
import { useExpandedOrders } from "@/hooks/useExpandedOrders"
import { useOrders } from "@/hooks/useOrders"
import { ORDERS_PAGE_SIZE } from "@/lib/constants"
import { OrdersEmptyState } from "./OrdersEmptyState"
import { OrdersPagination } from "./OrdersPagination"
import { OrdersTable } from "./OrdersTable"
import { OrdersTableSkeleton } from "./OrdersTableSkeleton"
import type { DesktopOrdersViewProps } from "./DesktopOrdersView.types"

export function DesktopOrdersView({
  status,
  query,
  page,
  onPageChange,
  hasActiveFilters,
  onClearFilters,
}: DesktopOrdersViewProps) {
  const { data, isLoading, isError, error, refetch } = useOrders({
    page,
    pageSize: ORDERS_PAGE_SIZE,
    status,
    query,
  })
  const { isExpanded, toggleExpanded } = useExpandedOrders()

  if (isLoading) {
    return <OrdersTableSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        description={error?.message}
        onRetry={() => refetch()}
        className="rounded-none border-0 bg-transparent"
      />
    )
  }

  if (!data || data.data.length === 0) {
    return <OrdersEmptyState hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} />
  }

  return (
    <div className="flex flex-col">
      <OrdersTable orders={data.data} isExpanded={isExpanded} onToggleExpanded={toggleExpanded} />
      <div className="border-t border-border px-5 py-4 sm:px-6">
        <OrdersPagination page={page} pageSize={data.pageSize} total={data.total} onPageChange={onPageChange} />
      </div>
    </div>
  )
}
