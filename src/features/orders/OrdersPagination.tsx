import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { OrdersPaginationProps } from "./OrdersPagination.types"

export function OrdersPagination({ page, pageSize, total, onPageChange }: OrdersPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const rangeStart = (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">
        Showing <span className="font-medium text-foreground">{rangeStart}–{rangeEnd}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </span>
      {totalPages > 1 ? (
        <div className="flex items-center gap-3">
          <span className="hidden text-muted-foreground sm:inline">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeftIcon />
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
