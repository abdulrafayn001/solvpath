import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useOrderFilters } from "@/hooks/useOrderFilters"
import { DESKTOP_QUERY } from "@/lib/constants"
import { DesktopOrdersView } from "./DesktopOrdersView"
import { MobileOrdersInfiniteList } from "./MobileOrdersInfiniteList"
import { SearchInput } from "./SearchInput"
import { StatusFilter } from "./StatusFilter"

export function OrdersDashboard() {
  const { status, query, page, hasActiveFilters, setStatus, setQuery, setPage, clearFilters } = useOrderFilters()
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search your orders, check delivery status, or start a return.
        </p>
      </div>

      <div className="rounded-[var(--radius-card)] border border-border bg-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:p-5">
          <SearchInput value={query} onChange={setQuery} />
          <StatusFilter value={status} onChange={setStatus} />
        </div>

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
