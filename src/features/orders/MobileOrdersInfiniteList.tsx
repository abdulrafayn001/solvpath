import { Loader2Icon } from "lucide-react"

import { ErrorState } from "@/components/ErrorState"
import { useExpandedOrders } from "@/hooks/useExpandedOrders"
import { useInfiniteOrders } from "@/hooks/useInfiniteOrders"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { ORDERS_PAGE_SIZE } from "@/lib/constants"
import { OrdersCardList } from "./OrdersCardList"
import { OrdersCardListSkeleton } from "./OrdersCardListSkeleton"
import { OrdersEmptyState } from "./OrdersEmptyState"
import type { MobileOrdersInfiniteListProps } from "./MobileOrdersInfiniteList.types"

export function MobileOrdersInfiniteList({
  status,
  query,
  hasActiveFilters,
  onClearFilters,
}: MobileOrdersInfiniteListProps) {
  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteOrders({ pageSize: ORDERS_PAGE_SIZE, status, query })
  const { isExpanded, toggleExpanded } = useExpandedOrders()

  const sentinelRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  })

  if (isLoading) {
    return <OrdersCardListSkeleton />
  }

  if (isError) {
    return <ErrorState description={error?.message} onRetry={() => refetch()} />
  }

  const orders = data?.pages.flatMap((page) => page.data) ?? []

  if (orders.length === 0) {
    return <OrdersEmptyState hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} />
  }

  return (
    <div className="flex flex-col gap-3">
      <OrdersCardList orders={orders} isExpanded={isExpanded} onToggleExpanded={toggleExpanded} />
      <div ref={sentinelRef} className="flex justify-center py-2">
        {isFetchingNextPage ? (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        ) : null}
      </div>
    </div>
  )
}
