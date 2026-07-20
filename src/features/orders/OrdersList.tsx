import { useExpandedOrders } from "@/hooks/useExpandedOrders"
import { OrdersCardList } from "./OrdersCardList"
import { OrdersTable } from "./OrdersTable"
import type { OrdersListProps } from "./OrdersList.types"

export function OrdersList({ orders }: OrdersListProps) {
  const { isExpanded, toggleExpanded } = useExpandedOrders()

  return (
    <>
      <OrdersTable orders={orders} isExpanded={isExpanded} onToggleExpanded={toggleExpanded} />
      <OrdersCardList orders={orders} isExpanded={isExpanded} onToggleExpanded={toggleExpanded} />
    </>
  )
}
