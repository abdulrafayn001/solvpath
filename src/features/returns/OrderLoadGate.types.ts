import type { ReactNode } from "react"

import type { Order } from "@/api"

export type OrderLoadGateProps = {
  orderId: string | undefined
  children: (order: Order) => ReactNode
}
