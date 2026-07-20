import type { ReturnStepActionsProps } from "./ReturnStepActions.types"

const mobileSpacer = <div className="h-20 sm:hidden" aria-hidden="true" />

/**
 * Wraps each step's primary CTA. Below the tablet breakpoint the button
 * pins to the bottom of the viewport (full-width, thumb-reachable) instead
 * of sitting wherever the step content happens to end — the spacer keeps
 * that fixed bar from covering the last bit of scrollable content.
 */
export function ReturnStepActions({ children }: ReturnStepActionsProps) {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card p-4 **:data-[slot=button]:w-full sm:static sm:z-auto sm:border-0 sm:bg-transparent sm:p-0 sm:**:data-[slot=button]:w-auto">
        {children}
      </div>
      {mobileSpacer}
    </>
  )
}
