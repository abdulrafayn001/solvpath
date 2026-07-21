import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrderStatus } from "@/api"
import { STATUS_CONFIG } from "@/lib/status"
import { cn } from "@/lib/utils"
import type { StatusFilterProps } from "./StatusFilter.types"
import type { StatusFilterValue } from "@/hooks/useOrderFilters"

const STATUS_OPTIONS: Array<{ value: StatusFilterValue; label: string }> = [
  { value: "all", label: "All" },
  ...(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((status) => ({
    value: status,
    label: STATUS_CONFIG[status].label,
  })),
]

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <>
      {/* Below sm, a segmented tray can't fit five options in one row without
          wrapping or scrolling — both are worse than a single compact control
          that reveals every option in one tap. The row layout has room for
          all of them, so it gets the segmented tray instead. */}
      <Select
        items={STATUS_OPTIONS}
        value={value}
        onValueChange={(next) => onChange(next as StatusFilterValue)}
      >
        <SelectTrigger className="w-full sm:hidden" aria-label="Filter by status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div
        role="group"
        aria-label="Filter by status"
        className="hidden min-w-0 shrink-0 items-center gap-1 rounded-lg bg-muted p-1 sm:flex"
      >
        {STATUS_OPTIONS.map((option) => {
          const active = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-8 shrink-0 rounded-md px-3 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </>
  )
}
