import { useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useReturnFlow } from "@/features/returns/ReturnFlowContext"
import { ReturnStepActions } from "@/features/returns/ReturnStepActions"
import { RETURN_REASON_PRESETS } from "@/features/returns/returnReasonPresets"

import { getReturnFlowRedirectStep } from "./returnFlowGuard"

export function ReturnReasonStep() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useReturnFlow()
  const [showValidation, setShowValidation] = useState(false)

  const redirectStep = getReturnFlowRedirectStep("reason", state)
  if (redirectStep) {
    return <Navigate to={`/orders/${orderId}/return/${redirectStep}`} replace />
  }

  const requiresComment = RETURN_REASON_PRESETS.find((preset) => preset.value === state.reason)
    ?.requiresComment ?? false
  const missingComment = requiresComment && state.comment.trim() === ""

  function handleContinue() {
    if (!state.reason || missingComment) {
      setShowValidation(true)
      return
    }
    navigate(`/orders/${orderId}/return/resolution`)
  }

  const reasonErrorId = "return-reason-error"
  const commentErrorId = "return-comment-error"
  const showReasonError = showValidation && !state.reason
  const showCommentError = showValidation && missingComment

  return (
    <div className="flex flex-col gap-4">
      <p id="return-reason-label" className="text-sm text-muted-foreground">
        What's the reason for this return?
      </p>

      <RadioGroup
        value={state.reason}
        onValueChange={(reason: string) => {
          dispatch({ type: "SET_REASON", reason })
          setShowValidation(false)
        }}
        aria-labelledby="return-reason-label"
        aria-describedby={showReasonError ? reasonErrorId : undefined}
        className="rounded-[var(--radius-card)] border border-border bg-card p-4"
      >
        {RETURN_REASON_PRESETS.map((preset) => (
          <label key={preset.value} className="flex items-center gap-2.5 text-sm text-foreground">
            <RadioGroupItem value={preset.value} />
            {preset.value}
          </label>
        ))}
      </RadioGroup>

      {showReasonError ? (
        <p id={reasonErrorId} role="alert" className="text-sm text-destructive">
          Select a reason to continue.
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="return-comment" className="text-sm text-foreground">
          Additional details{requiresComment ? "" : " (optional)"}
        </label>
        <textarea
          id="return-comment"
          value={state.comment}
          onChange={(event) => {
            dispatch({ type: "SET_COMMENT", comment: event.target.value })
            setShowValidation(false)
          }}
          rows={3}
          placeholder={requiresComment ? "Tell us what happened…" : "Optional"}
          aria-invalid={showCommentError}
          aria-describedby={showCommentError ? commentErrorId : undefined}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {showCommentError ? (
          <p id={commentErrorId} role="alert" className="text-sm text-destructive">
            Add a comment to tell us what happened.
          </p>
        ) : null}
      </div>

      <ReturnStepActions>
        <Button onClick={handleContinue}>Continue</Button>
      </ReturnStepActions>
    </div>
  )
}
