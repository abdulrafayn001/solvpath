import type { ReturnResolution } from "@/api"

export type SelectedReturnItem = {
  itemId: string
  qty: number
}

export type ReturnFlowState = {
  orderId: string
  selectedItems: SelectedReturnItem[]
  reason: string
  resolution: ReturnResolution | null
}

export type ReturnFlowAction =
  | { type: "SET_ITEMS"; items: SelectedReturnItem[] }
  | { type: "SET_REASON"; reason: string }
  | { type: "SET_RESOLUTION"; resolution: ReturnResolution }
  | { type: "RESET"; orderId: string }
