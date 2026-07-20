import { useReducer } from "react"
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom"

import { OrderLoadGate } from "@/features/returns/OrderLoadGate"
import { ReturnFlowContext } from "@/features/returns/ReturnFlowContext"
import { createInitialReturnFlowState, returnFlowReducer } from "@/features/returns/returnFlowReducer"
import { isOrderReturnEligible } from "@/features/orders/orderSummary"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { ReturnConfirmationStep } from "@/pages/return/ReturnConfirmationStep"
import { ReturnItemsStep } from "@/pages/return/ReturnItemsStep"
import { ReturnReasonStep } from "@/pages/return/ReturnReasonStep"
import { ReturnResolutionStep } from "@/pages/return/ReturnResolutionStep"
import { ReturnReviewStep } from "@/pages/return/ReturnReviewStep"
import { RETURN_FLOW_STEPS } from "@/pages/return/returnFlowSteps"

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
        return <ReturnFlow orderId={orderId} />
      }}
    </OrderLoadGate>
  )
}

function ReturnFlow({ orderId }: { orderId: string }) {
  const [state, dispatch] = useReducer(returnFlowReducer, orderId, createInitialReturnFlowState)
  const location = useLocation()

  const currentStepIndex = RETURN_FLOW_STEPS.findIndex((step) => location.pathname.endsWith(`/${step.path}`))
  const stepNumber = Math.max(currentStepIndex, 0) + 1
  const isConfirmation = location.pathname.endsWith("/confirmation")

  return (
    <ReturnFlowContext.Provider value={{ state, dispatch }}>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-medium text-foreground">Return for order {orderId}</h1>
          {isConfirmation ? null : (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground">
                Step {stepNumber} of {RETURN_FLOW_STEPS.length}
              </p>
              <div className="flex gap-1">
                {RETURN_FLOW_STEPS.map((step, index) => (
                  <div
                    key={step.path}
                    className={`h-1.5 flex-1 rounded-full ${
                      index <= currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <Routes>
          <Route index element={<ReturnItemsStep />} />
          <Route path="items" element={<ReturnItemsStep />} />
          <Route path="reason" element={<ReturnReasonStep />} />
          <Route path="resolution" element={<ReturnResolutionStep />} />
          <Route path="review" element={<ReturnReviewStep />} />
          <Route path="confirmation" element={<ReturnConfirmationStep />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </ReturnFlowContext.Provider>
  )
}
