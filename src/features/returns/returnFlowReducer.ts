import type { ReturnFlowAction, ReturnFlowState } from "./returnFlow.types"

export function createInitialReturnFlowState(orderId: string): ReturnFlowState {
  return {
    orderId,
    selectedItems: [],
    reason: "",
    comment: "",
    resolution: null,
  }
}

export function returnFlowReducer(state: ReturnFlowState, action: ReturnFlowAction): ReturnFlowState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, selectedItems: action.items }
    case "SET_REASON":
      return { ...state, reason: action.reason }
    case "SET_COMMENT":
      return { ...state, comment: action.comment }
    case "SET_RESOLUTION":
      return { ...state, resolution: action.resolution }
    case "RESET":
      return createInitialReturnFlowState(action.orderId)
    default:
      return state
  }
}
