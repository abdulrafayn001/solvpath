/**
 * ReturnRequest carries a single `reason` string for the whole return (already
 * settled by the API contract, not an open design choice) — presets are just
 * friendly labels that map 1:1 onto that string, plus one preset ("Other")
 * that requires the free-text comment to carry the actual reason.
 */
export const RETURN_REASON_PRESETS = [
  { value: "Wrong size", requiresComment: false },
  { value: "Damaged or defective", requiresComment: false },
  { value: "Changed my mind", requiresComment: false },
  { value: "Other", requiresComment: true },
] as const

export type ReturnReasonPreset = (typeof RETURN_REASON_PRESETS)[number]["value"]
