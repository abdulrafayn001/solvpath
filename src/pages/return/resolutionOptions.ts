import type { ReturnResolution } from "@/api"

/**
 * Exchange doesn't get a dollar figure — you're getting a replacement item,
 * not money back, so a computed amount here would misleadingly read as a
 * refund. Refund and store credit both show the returned items' value (store
 * credit with its +10% bonus called out).
 */
export const RESOLUTION_OPTIONS: Array<{
  value: ReturnResolution
  title: string
  description: string
  showsAmount: boolean
}> = [
  {
    value: "refund",
    title: "Refund to original payment",
    description: "Back to the card or method you paid with.",
    showsAmount: true,
  },
  {
    value: "exchange",
    title: "Exchange",
    description: "We'll send a replacement for the returned item(s).",
    showsAmount: false,
  },
  {
    value: "store_credit",
    title: "Store credit",
    description: "Credit toward a future order, plus a 10% bonus.",
    showsAmount: true,
  },
]
