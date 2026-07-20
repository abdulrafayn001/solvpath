import { Skeleton } from "@/components/Skeleton"

export function ReturnStepSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <Skeleton className="h-4 w-64" />
      <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-card p-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-md" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="ml-auto h-4 w-14" />
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
  )
}
