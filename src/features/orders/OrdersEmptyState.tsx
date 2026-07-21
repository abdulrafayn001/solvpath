import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { OrdersEmptyStateProps } from "./OrdersEmptyState.types"

export function OrdersEmptyState({ hasActiveFilters, onClearFilters }: OrdersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-full bg-accent">
        <SearchIcon className="size-5 text-accent-foreground" />
      </div>
      {hasActiveFilters ? (
        <>
          <p className="text-sm font-medium text-foreground">No matching orders</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            No orders match your current filter or search.
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onClearFilters}>
            Clear filters
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-foreground">No orders yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Orders you place will show up here.
          </p>
        </>
      )}
    </div>
  )
}
