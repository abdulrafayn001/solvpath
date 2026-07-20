import { Skeleton } from "@/components/Skeleton"
import { ORDERS_PAGE_SIZE } from "@/lib/constants"

export function OrdersTableSkeleton() {
  return (
    <table className="hidden w-full border-collapse text-left md:table" aria-hidden="true">
      <thead>
        <tr className="border-b border-border text-xs text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Order</th>
          <th className="py-2 pr-4 font-medium">Date</th>
          <th className="py-2 pr-4 font-medium">Items</th>
          <th className="py-2 pr-4 font-medium">Total</th>
          <th className="py-2 pr-4 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: ORDERS_PAGE_SIZE }).map((_, i) => (
          <tr key={i} className="border-b border-border last:border-0">
            <td className="py-3 pr-4 align-top">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="py-3 pr-4 align-top">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="py-3 pr-4 align-top">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-md" />
                <Skeleton className="h-4 w-40" />
              </div>
            </td>
            <td className="py-3 pr-4 align-top">
              <Skeleton className="h-4 w-14" />
            </td>
            <td className="py-3 pr-4 align-top">
              <Skeleton className="h-5 w-20 rounded-full" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
