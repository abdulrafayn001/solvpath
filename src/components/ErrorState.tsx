import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry: () => void
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-border bg-card px-6 py-12 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
