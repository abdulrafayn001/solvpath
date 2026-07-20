import type { StatusFilterValue } from "@/hooks/useOrderFilters"

export type StatusFilterProps = {
  value: StatusFilterValue
  onChange: (value: StatusFilterValue) => void
}
