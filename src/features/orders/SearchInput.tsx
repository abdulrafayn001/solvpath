import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { SearchInputProps } from "./SearchInput.types"

/**
 * Matches both order number and product name — the mock API's listOrders
 * filter checks orderNumber and item names against the same query (see
 * src/api/mockApi.ts), so one field naturally covers both without the app
 * needing its own matching logic.
 */
export function SearchInput({ value, onChange, className }: SearchInputProps) {
  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by order number or product"
        aria-label="Search orders"
        className="h-10 pl-9"
      />
    </div>
  )
}
