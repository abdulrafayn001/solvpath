import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrderStatus } from "@/api"
import { STATUS_CONFIG } from "@/lib/status"
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
    <Select
      value={value}
      onValueChange={(next) => onChange(next as StatusFilterValue)}
    >
      <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
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
  )
}
