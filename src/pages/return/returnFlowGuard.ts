import type { ReturnFlowState } from "@/features/returns/returnFlow.types"

import { RETURN_FLOW_STEPS } from "./returnFlowSteps"

type StepPath = (typeof RETURN_FLOW_STEPS)[number]["path"]

const STEP_IS_COMPLETE: Record<StepPath, (state: ReturnFlowState) => boolean> = {
  items: (state) => state.selectedItems.length > 0,
  reason: (state) => Boolean(state.reason),
  resolution: (state) => Boolean(state.resolution),
  review: () => true,
}

/** Returns the earliest incomplete step before `currentStep`, or null if every prior step is satisfied. */
export function getReturnFlowRedirectStep(currentStep: StepPath, state: ReturnFlowState): StepPath | null {
  const currentIndex = RETURN_FLOW_STEPS.findIndex((step) => step.path === currentStep)
  for (let i = 0; i < currentIndex; i++) {
    const step = RETURN_FLOW_STEPS[i].path
    if (!STEP_IS_COMPLETE[step](state)) {
      return step
    }
  }
  return null
}
