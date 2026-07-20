import { Route, Routes, useParams } from "react-router-dom"

import { NotFoundPage } from "@/pages/NotFoundPage"
import { ReturnReasonStep } from "@/pages/return/ReturnReasonStep"
import { ReturnReviewStep } from "@/pages/return/ReturnReviewStep"

export function ReturnFlowPage() {
  const { orderId } = useParams()
  return (
    <div className="p-6">
      <h1 className="text-lg font-medium">Return for order {orderId}</h1>
      <Routes>
        <Route index element={<ReturnReasonStep />} />
        <Route path="reason" element={<ReturnReasonStep />} />
        <Route path="review" element={<ReturnReviewStep />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
