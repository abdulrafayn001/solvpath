import { useReducer, useRef } from "react"
import { ChevronLeftIcon } from "lucide-react"
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"

import type { Order } from "@/api"
import { OrderLoadGate } from "@/features/returns/OrderLoadGate"
import { ReturnFlowContext } from "@/features/returns/ReturnFlowContext"
import { ReturnSummaryRail } from "@/features/returns/ReturnSummaryRail"
import {
  createInitialReturnFlowState,
  returnFlowReducer,
} from "@/features/returns/returnFlowReducer"
import { isOrderReturnEligible } from "@/features/orders/orderSummary"
import { useFocusOnChange } from "@/hooks/useFocusOnChange"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { ReturnConfirmationStep } from "@/pages/return/ReturnConfirmationStep"
import { ReturnItemsStep } from "@/pages/return/ReturnItemsStep"
import { ReturnReasonStep } from "@/pages/return/ReturnReasonStep"
import { ReturnResolutionStep } from "@/pages/return/ReturnResolutionStep"
import { ReturnReviewStep } from "@/pages/return/ReturnReviewStep"
import { RETURN_FLOW_STEPS } from "@/pages/return/returnFlowSteps"
import { cn } from "@/lib/utils"

export function ReturnFlowPage() {
  const { orderId } = useParams()

  if (!orderId) {
    return <NotFoundPage />
  }

  return (
    <OrderLoadGate orderId={orderId}>
      {(order) => {
        if (!isOrderReturnEligible(order)) {
          return <Navigate to={`/orders/${orderId}`} replace />
        }
        return <ReturnFlow orderId={orderId} order={order} />
      }}
    </OrderLoadGate>
  )
}

function ReturnFlow({ orderId, order }: { orderId: string; order: Order }) {
  const [state, dispatch] = useReducer(
    returnFlowReducer,
    orderId,
    createInitialReturnFlowState
  )
  const location = useLocation()
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)

  // The index route (bare "/return", no sub-path) renders the same step as
  // "/return/items" but doesn't end with "/items" — match it to step 0
  // explicitly instead of falling through to a not-found index.
  const currentStepIndex = location.pathname.endsWith("/return")
    ? 0
    : RETURN_FLOW_STEPS.findIndex((step) => location.pathname.endsWith(`/${step.path}`))
  const stepNumber = Math.max(currentStepIndex, 0) + 1
  const isConfirmation = location.pathname.endsWith("/confirmation")
  const currentStepLabel = RETURN_FLOW_STEPS[currentStepIndex]?.label

  // Move focus to the current view's heading on every step change (including
  // Edit-link jumps back to an earlier step) so screen reader users land
  // somewhere meaningful instead of keeping focus on a button that just
  // navigated them away.
  useFocusOnChange(stepHeadingRef, location.pathname)

  const routesElement = (
    <Routes>
      <Route index element={<ReturnItemsStep />} />
      <Route path="items" element={<ReturnItemsStep />} />
      <Route path="reason" element={<ReturnReasonStep />} />
      <Route path="resolution" element={<ReturnResolutionStep />} />
      <Route path="review" element={<ReturnReviewStep />} />
      <Route path="confirmation" element={<ReturnConfirmationStep />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )

  return (
    <ReturnFlowContext.Provider value={{ state, dispatch, order }}>
      <div className="flex flex-col gap-6">
        <Link
          to={`/orders/${orderId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4" />
          Back to order {order.orderNumber}
        </Link>

        <h1
          className="text-2xl font-semibold tracking-tight text-foreground outline-none"
          ref={isConfirmation ? stepHeadingRef : undefined}
          tabIndex={isConfirmation ? -1 : undefined}
        >
          {isConfirmation
            ? "Return submitted"
            : `Return items from order ${order.orderNumber}`}
        </h1>

        {isConfirmation ? null : (
          <div className="flex flex-col gap-3">
            <h2
              ref={stepHeadingRef}
              tabIndex={-1}
              className="sr-only outline-none"
            >
              {currentStepLabel} — step {stepNumber} of{" "}
              {RETURN_FLOW_STEPS.length}
            </h2>
            <ol className="flex items-center">
              {RETURN_FLOW_STEPS.map((step, index) => {
                const isCurrent = index === currentStepIndex
                const isComplete = index < currentStepIndex
                const badge = (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isComplete
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                )

                const isLast = index === RETURN_FLOW_STEPS.length - 1

                return (
                  <li
                    key={step.path}
                    className={cn("flex items-center", !isLast && "flex-1")}
                  >
                    {isComplete ? (
                      <Link
                        to={`/orders/${orderId}/return/${step.path}`}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {badge}
                        <span className="hidden sm:inline">{step.label}</span>
                      </Link>
                    ) : (
                      <span
                        aria-current={isCurrent ? "step" : undefined}
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium",
                          isCurrent
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        )}
                      >
                        {badge}
                        <span className="hidden sm:inline">{step.label}</span>
                      </span>
                    )}
                    {!isLast ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mx-2 h-px flex-1",
                          isComplete ? "bg-primary/30" : "bg-border"
                        )}
                      />
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </div>
        )}

        {isConfirmation ? (
          routesElement
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">{routesElement}</div>
              <ReturnSummaryRail />
            </div>
            {/* Reserves scroll room below the tablet breakpoint so the
                fixed CTA bar from ReturnStepActions doesn't cover the tail
                end of the page — has to live here, after the sidebar, since
                that's the true bottom of the scrollable content. */}
            <div className="h-20 sm:hidden" aria-hidden="true" />
          </>
        )}
      </div>
    </ReturnFlowContext.Provider>
  )
}
