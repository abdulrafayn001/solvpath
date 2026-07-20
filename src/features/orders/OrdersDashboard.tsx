import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useOrderFilters } from "@/hooks/useOrderFilters"
import { DesktopOrdersView } from "./DesktopOrdersView"
import { MobileOrdersInfiniteList } from "./MobileOrdersInfiniteList"
import { SearchInput } from "./SearchInput"
import { StatusFilter } from "./StatusFilter"

export function OrdersDashboard() {
  const { status, query, page, hasActiveFilters, setStatus, setQuery, setPage, clearFilters } = useOrderFilters()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium">Orders</h1>

      <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-card p-4 sm:flex-row sm:items-center">
        <SearchInput value={query} onChange={setQuery} />
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      <div className="rounded-[var(--radius-card)] border border-border bg-card p-4">
        {isDesktop ? (
          <DesktopOrdersView
            status={status}
            query={query}
            page={page}
            onPageChange={setPage}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <MobileOrdersInfiniteList
            status={status}
            query={query}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </div>
  )
}
