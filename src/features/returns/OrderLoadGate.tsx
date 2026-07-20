import { ErrorState } from "@/components/ErrorState"
import { useOrder } from "@/hooks/useOrder"

import type { OrderLoadGateProps } from "./OrderLoadGate.types"
import { ReturnStepSkeleton } from "./ReturnStepSkeleton"

/** Owns the loading/error UI for fetching the order a return step needs, so each step only renders its own content once the order is available. */
export function OrderLoadGate({ orderId, children }: OrderLoadGateProps) {
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId)

  if (isLoading) {
    return <ReturnStepSkeleton />
  }

  if (isError || !order) {
    return (
      <ErrorState
        title="Couldn't load this order"
        description={error?.message}
        onRetry={refetch}
      />
    )
  }

  return <>{children(order)}</>
}
