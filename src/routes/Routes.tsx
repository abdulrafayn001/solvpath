import { Route, Routes as RouterRoutes } from "react-router-dom"

import { AppShell } from "@/components/layout/AppShell"
import { DashboardPage } from "@/pages/DashboardPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { OrderDetailPage } from "@/pages/OrderDetailPage"
import { ReturnFlowPage } from "@/pages/return/ReturnFlowPage"

export function Routes() {
  return (
    <AppShell>
      <RouterRoutes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/orders/:orderId/return/*" element={<ReturnFlowPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </RouterRoutes>
    </AppShell>
  )
}
