import type { ReturnStepActionsProps } from "./ReturnStepActions.types"

/**
 * Wraps each step's primary CTA. Below the tablet breakpoint the button
 * pins to the bottom of the viewport (full-width, thumb-reachable) instead
 * of sitting wherever the step content happens to end. Reserving the scroll
 * space that fixed bar covers is the page shell's job, not this component's
 * — this button can end up followed by other content (e.g. the summary
 * sidebar) that also needs to scroll clear of it.
 */
export function ReturnStepActions({ children }: ReturnStepActionsProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card p-4 **:data-[slot=button]:w-full sm:static sm:z-auto sm:border-0 sm:bg-transparent sm:p-0 sm:**:data-[slot=button]:w-auto">
      {children}
    </div>
  )
}
