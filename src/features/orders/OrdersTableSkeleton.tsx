import { Skeleton } from "@/components/Skeleton"
import { ORDERS_PAGE_SIZE } from "@/lib/constants"

export function OrdersTableSkeleton() {
  return (
    <table className="hidden w-full border-collapse text-left md:table" aria-hidden="true">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          <th className="px-5 py-3 sm:px-6">
            <Skeleton className="h-3 w-10" />
          </th>
          <th className="px-5 py-3 sm:px-6">
            <Skeleton className="h-3 w-10" />
          </th>
          <th className="px-5 py-3 sm:px-6">
            <Skeleton className="h-3 w-10" />
          </th>
          <th className="px-5 py-3 sm:px-6">
            <Skeleton className="ml-auto h-3 w-10" />
          </th>
          <th className="px-5 py-3 sm:px-6">
            <Skeleton className="ml-auto h-3 w-10" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: ORDERS_PAGE_SIZE }).map((_, i) => (
          <tr key={i} className="border-b border-border last:border-0">
            <td className="px-5 py-4 align-top sm:px-6">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="px-5 py-4 align-top sm:px-6">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="px-5 py-4 align-top sm:px-6">
              <div className="flex items-center gap-3">
                <Skeleton className="size-11 shrink-0 rounded-lg" />
                <Skeleton className="h-4 w-40" />
              </div>
            </td>
            <td className="px-5 py-4 align-top sm:px-6">
              <Skeleton className="ml-auto h-4 w-14" />
            </td>
            <td className="px-5 py-4 align-top sm:px-6">
              <Skeleton className="ml-auto h-5 w-20 rounded-full" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
