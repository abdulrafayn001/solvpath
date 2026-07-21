import { createContext, useContext, type Dispatch } from "react"

import type { Order } from "@/api"

import type { ReturnFlowAction, ReturnFlowState } from "./returnFlow.types"

export type ReturnFlowContextValue = {
  state: ReturnFlowState
  dispatch: Dispatch<ReturnFlowAction>
  order: Order
}

export const ReturnFlowContext = createContext<ReturnFlowContextValue | null>(null)

export function useReturnFlow() {
  const context = useContext(ReturnFlowContext)
  if (!context) {
    throw new Error("useReturnFlow must be used within a ReturnFlowPage")
  }
  return context
}
