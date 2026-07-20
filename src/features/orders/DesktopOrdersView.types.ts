import type { StatusFilterValue } from "@/hooks/useOrderFilters"

export type DesktopOrdersViewProps = {
  status: StatusFilterValue
  query: string
  page: number
  onPageChange: (page: number) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}
