import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ExpandToggleProps } from "./ExpandToggle.types"

export function ExpandToggle({ expanded, itemCount, onToggle }: ExpandToggleProps) {
  if (itemCount <= 1) return null
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ChevronDownIcon
        className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
      />
      {expanded ? "Hide items" : `Show all ${itemCount} items`}
    </button>
  )
}
