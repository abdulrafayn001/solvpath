import { Skeleton } from "@/components/Skeleton"

export function ReturnStepSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-7 w-64" />
      <div className="flex items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 flex-1 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-card p-5 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-11 shrink-0 rounded-lg" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-card p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}
