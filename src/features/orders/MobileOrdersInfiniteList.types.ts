import type { StatusFilterValue } from "@/hooks/useOrderFilters"

export type MobileOrdersInfiniteListProps = {
  status: StatusFilterValue
  query: string
  hasActiveFilters: boolean
  onClearFilters: () => void
}
