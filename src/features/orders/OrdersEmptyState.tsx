import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/EmptyState"
import type { OrdersEmptyStateProps } from "./OrdersEmptyState.types"


export function OrdersEmptyState({ hasActiveFilters, onClearFilters }: OrdersEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <EmptyState
        title="No matching orders"
        description="No orders match your current filter or search."
        action={
          <Button type="button" variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        }
      />
    )
  }

  return <EmptyState title="No orders yet" description="Orders you place will show up here." />
}
