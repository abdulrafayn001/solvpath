import { Skeleton } from "@/components/Skeleton"
import { ORDERS_PAGE_SIZE } from "@/lib/constants"

export function OrdersCardListSkeleton() {
  return (
    <ul className="flex flex-col gap-3" aria-hidden="true">
      {Array.from({ length: ORDERS_PAGE_SIZE }).map((_, i) => (
        <li
          key={i}
          className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-md" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
          </div>
        </li>
      ))}
    </ul>
  )
}
